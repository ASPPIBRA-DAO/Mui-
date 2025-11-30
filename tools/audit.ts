
/**
 * AUDIT SCRIPT (MASTER VERSION)
 * Este script faz:
 * - Coleta e varredura de imports
 * - Dead files
 * - Funções grandes
 * - Variáveis e imports não usados
 * - Análise de complexidade
 * - Magic numbers
 * - TODO/FIXME
 * - .then sem .catch
 * - try/catch vazios
 * - console.* excessivo
 * - gera ranking de arquivos problemáticos
 * - gera report.md
 *
 * Ele busca em:
 * apps/<app>/src
 * packages/<pkg>/src
 * src/
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { Project, SyntaxKind } = require("ts-morph");

const ROOT = process.cwd();
const OUT_MD = path.join(ROOT, "audit-report.md");
const OUT_JSON = path.join(ROOT, "audit-report.json");

console.log("🔍 Iniciando AUDIT (MASTER) — procurando src em apps/*, packages/* e root/src...");

// -----------------------------
// localizar src folders priorizados (avoid node_modules)
function findMonorepoSrcFolders(root) {
  const candidates = [];

  // apps/*/src
  const appsPath = path.join(root, "apps");
  if (fs.existsSync(appsPath) && fs.statSync(appsPath).isDirectory()) {
    for (const name of fs.readdirSync(appsPath)) {
      const p = path.join(appsPath, name, "src");
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) candidates.push(p);
    }
  }

  // packages/*/src
  const pkgsPath = path.join(root, "packages");
  if (fs.existsSync(pkgsPath) && fs.statSync(pkgsPath).isDirectory()) {
    for (const name of fs.readdirSync(pkgsPath)) {
      const p = path.join(pkgsPath, name, "src");
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) candidates.push(p);
    }
  }

  // root/src fallback
  const rootSrc = path.join(root, "src");
  if (fs.existsSync(rootSrc) && fs.statSync(rootSrc).isDirectory()) candidates.push(rootSrc);

  // dedupe
  return [...new Set(candidates)];
}

const SRC_FOLDERS = findMonorepoSrcFolders(ROOT);

if (!SRC_FOLDERS.length) {
  console.error("❌ Nenhuma pasta 'src' encontrada em apps/* or packages/* or root/src — abortando.");
  process.exit(1);
}

console.log("📁 Pastas src detectadas:");
SRC_FOLDERS.forEach(p => console.log("  -", path.relative(ROOT, p)));

// -----------------------------
// Inicializar ts-morph Project sem tsconfig obrigatório
const project = new Project({
  compilerOptions: {
    allowJs: true,
    checkJs: false,
    skipLibCheck: true,
    esModuleInterop: true,
    target: 99,
    module: 1,
  },
  addFilesFromTsConfig: false,
});

// Adicionar arquivos de cada src folder explicitamente
for (const s of SRC_FOLDERS) {
  project.addSourceFilesAtPaths(path.join(s, "**/*.ts"));
  project.addSourceFilesAtPaths(path.join(s, "**/*.tsx"));
  project.addSourceFilesAtPaths(path.join(s, "**/*.js"));
  project.addSourceFilesAtPaths(path.join(s, "**/*.jsx"));
}

// Filtrar acidental node_modules (por segurança)
project.getSourceFiles().forEach(sf => {
  if (sf.getFilePath().includes("node_modules")) {
    project.removeSourceFile(sf);
  }
});

const sourceFiles = project.getSourceFiles();
console.log(`🔢 Arquivos carregados: ${sourceFiles.length}`);

// -----------------------------
// Estruturas de dados
const perFile = {};
const allFiles = sourceFiles.map(f => f.getFilePath());
const graph = new Map(); // file -> [imported file paths]
const reverseGraph = new Map(); // file -> [files that import this]
const todoList = [];
const globalStats = { totalFiles: allFiles.length, totalLines: 0, totalChars: 0 };

// Helpers
function isTestFile(p) { return /(\.test\.|\.spec\.)/i.test(p); }
function short(p) { return path.relative(ROOT, p); }

// -----------------------------
// Passo 1: coleta básica e construir grafo
for (const file of sourceFiles) {
  const pth = file.getFilePath();
  const text = file.getFullText();
  const lines = text.split(/\r?\n/).length;
  const chars = text.length;
  globalStats.totalLines += lines;
  globalStats.totalChars += chars;

  perFile[pth] = {
    file: pth,
    lines,
    chars,
    imports: [],
    importedBy: [],
    unusedImports: [],
    badImports: [],
    anyCount: 0,
    todoCount: 0,
    consoleCount: 0,
    bigFunctions: [],
    unusedVariables: [],
    magicNumbers: [],
    emptyCatch: [],
    thenWithoutCatch: [],
    complexityAverage: 0,
    dead: false,
    score: 0
  };

  // imports (resolvidos quando possível)
  try {
    const importDecls = file.getImportDeclarations();
    const resolved = [];
    for (const imp of importDecls) {
      const mod = imp.getModuleSpecifierValue();
      const resolvedFile = imp.getModuleSpecifierSourceFile();
      if (!resolvedFile) {
        perFile[pth].badImports.push(mod);
      } else {
        // garantir que import resolvido é parte do nosso conjunto
        const rf = resolvedFile.getFilePath();
        if (rf && !rf.includes("node_modules")) resolved.push(rf);
        else perFile[pth].badImports.push(mod);
      }
    }
    perFile[pth].imports = resolved;
    graph.set(pth, resolved);
  } catch (e) {
    perFile[pth].badImports.push("[import-scan-failed]");
  }

  // candidate TODOs
  try {
    const reTodo = /\/\/\s*(TODO|FIXME)|\/\*\s*(TODO|FIXME)/ig;
    let m;
    while ((m = reTodo.exec(text)) !== null) {
      perFile[pth].todoCount++;
      todoList.push({ file: pth, snippet: text.substr(Math.max(0, m.index - 40), 120) });
    }
  } catch (e) {}

  // any
  try { perFile[pth].anyCount = file.getDescendantsOfKind(SyntaxKind.AnyKeyword).length; } catch (e) {}

  // console usage
  try {
    perFile[pth].consoleCount = file.getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter(c => {
        try { return c.getExpression().getText().startsWith("console."); } catch (e) { return false; }
      }).length;
  } catch (e) {}

  // numeric literals -> magic numbers heuristic
  try {
    const numericLiterals = file.getDescendantsOfKind(SyntaxKind.NumericLiteral);
    for (const lit of numericLiterals) {
      const val = Number(lit.getLiteralText());
      if (!Number.isFinite(val)) continue;
      if ([0, 1, -1].includes(val)) continue;
      const parent = lit.getParent();
      // heurística: se envolver declaration const ignore
      const isConst = (parent && parent.getFirstAncestorByKind && parent.getFirstAncestorByKind(SyntaxKind.VariableStatement) &&
        /const\s/.test(parent.getFirstAncestorByKind(SyntaxKind.VariableStatement).getText() || ""));
      if (!isConst) {
        perFile[pth].magicNumbers.push({ value: val, line: lit.getStartLineNumber() });
      }
    }
  } catch (e) {}

  // empty catches
  try {
    const catches = file.getDescendantsOfKind(SyntaxKind.CatchClause);
    for (const c of catches) {
      const bodyText = c.getBlock ? (c.getBlock().getText() || "") : "";
      if (!bodyText || /^\{\s*\}$/.test(bodyText) || /^\{\s*\/\/.*\}$/.test(bodyText)) {
        perFile[pth].emptyCatch.push({ line: c.getStartLineNumber(), text: (bodyText || "").slice(0, 200) });
      }
    }
  } catch (e) {}

  // .then without .catch heuristic
  try {
    const thenCalls = file.getDescendantsOfKind(SyntaxKind.CallExpression).filter(c => {
      try { return c.getExpression().getText().includes(".then("); } catch (e) { return false; }
    });
    for (const t of thenCalls) {
      const full = t.getText();
      if (!/\.catch\s*\(/.test(full) && !/\.finally\s*\(/.test(full)) {
        perFile[pth].thenWithoutCatch.push({ line: t.getStartLineNumber(), text: full.slice(0, 200) });
      }
    }
  } catch (e) {}

  // collect potential big functions later
}

// -----------------------------
// construir reverse graph (importedBy)
for (const [f, imports] of graph.entries()) {
  for (const imp of imports) {
    if (!reverseGraph.has(imp)) reverseGraph.set(imp, []);
    reverseGraph.get(imp).push(f);
  }
}
for (const f of allFiles) {
  perFile[f].importedBy = reverseGraph.get(f) || [];
}

// -----------------------------
// Dead files detection (reachable from root entries)
function findEntryRoots() {
  const entries = [];
  for (const f of allFiles) {
    const b = path.basename(f).toLowerCase();
    if (["index.ts", "index.tsx", "main.tsx", "app.tsx", "server.ts", "worker.ts"].includes(b)) entries.push(f);
  }
  // fallback: files without incoming (importedBy length === 0) are roots
  if (!entries.length) {
    for (const f of allFiles) if (!isTestFile(f) && (perFile[f].importedBy || []).length === 0) entries.push(f);
  }
  return entries;
}

function traverse(roots) {
  const visited = new Set();
  const stack = [...roots];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || visited.has(cur)) continue;
    visited.add(cur);
    const children = graph.get(cur) || [];
    for (const c of children) if (!visited.has(c)) stack.push(c);
  }
  return visited;
}

const roots = findEntryRoots();
const reachable = traverse(roots);
const deadFiles = allFiles.filter(f => !reachable.has(f) && !isTestFile(f));
deadFiles.forEach(f => perFile[f].dead = true);

// -----------------------------
// imports não usados & variables unused (symbol.findReferences)
for (const file of sourceFiles) {
  const pth = file.getFilePath();
  try {
    for (const imp of file.getImportDeclarations()) {
      // named imports
      for (const named of imp.getNamedImports()) {
        try {
          const nameNode = named.getNameNode ? named.getNameNode() : null;
          const symbol = nameNode && nameNode.getSymbol ? nameNode.getSymbol() : null;
          if (!symbol || !symbol.findReferences) {
            // fallback: check occurrences of text in file (cheap)
            const text = file.getFullText();
            const name = named.getText();
            const matches = (text.match(new RegExp(`\\b${name}\\b`, "g")) || []).length;
            if (matches <= 1) perFile[pth].unusedImports.push({ name, line: named.getStartLineNumber() });
            continue;
          }
          const refs = symbol.findReferences();
          let refCount = 0;
          for (const r of refs || []) {
            const refs2 = r.getReferences();
            for (const rr of refs2) {
              try {
                const sf = rr.getSourceFile();
                if (!sf) continue;
                const sfPath = sf.getFilePath();
                if (sfPath.includes("node_modules")) continue;
                // count occurrences outside the import declaration
                if (!(sfPath === pth && rr.getText().trim() === nameNode.getText().trim())) {
                  refCount++;
                }
              } catch (e) {}
            }
          }
          if (refCount === 0) {
            perFile[pth].unusedImports.push({ name: named.getText(), line: named.getStartLineNumber() });
          }
        } catch (e) {}
      }
    }

    // variables
    const varDecls = file.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
    for (const v of varDecls) {
      try {
        const id = v.getNameNode ? v.getNameNode() : null;
        if (!id) continue;
        const sym = id.getSymbol ? id.getSymbol() : null;
        if (!sym || !sym.findReferences) continue;
        const refs = sym.findReferences();
        let refCount = 0;
        for (const r of refs || []) {
          const rr = r.getReferences();
          for (const x of rr) {
            try {
              const sf = x.getSourceFile();
              if (sf && !sf.getFilePath().includes("node_modules")) {
                if (!(sf.getFilePath() === pth && x.getText().trim() === id.getText().trim())) {
                  refCount++;
                }
              }
            } catch (e) {}
          }
        }
        if (refCount === 0) {
          const name = id.getText();
          if (!/^_/.test(name)) perFile[pth].unusedVariables.push({ name, line: id.getStartLineNumber() });
        }
      } catch (e) {}
    }
  } catch (e) {}
}

// -----------------------------
// Funções grandes & complexidade
function analyzeComplexityNode(node) {
  const branchKinds = new Set([
    SyntaxKind.IfStatement, SyntaxKind.ForStatement, SyntaxKind.ForOfStatement,
    SyntaxKind.ForInStatement, SyntaxKind.WhileStatement, SyntaxKind.CaseClause,
    SyntaxKind.CatchClause, SyntaxKind.ConditionalExpression
  ]);
  let score = 1;
  const stack = [node];
  while (stack.length) {
    const n = stack.pop();
    try {
      const children = n.getChildren ? n.getChildren() : [];
      for (const c of children) {
        const kind = c.getKind && c.getKind();
        if (branchKinds.has(kind)) score++;
        // logical operators heuristic
        try {
          const txt = c.getText ? c.getText() : "";
          if (txt.includes("&&")) score += (txt.split("&&").length - 1);
          if (txt.includes("||")) score += (txt.split("||").length - 1);
        } catch (e) {}
        stack.push(c);
      }
    } catch (e) {}
  }
  return score;
}

for (const file of sourceFiles) {
  const pth = file.getFilePath();
  try {
    const funcs = file.getFunctions();
    const arrowFuncs = file.getDescendantsOfKind(SyntaxKind.ArrowFunction);
    const methodDecls = file.getDescendantsOfKind(SyntaxKind.MethodDeclaration);
    const allFuncs = [...funcs, ...arrowFuncs, ...methodDecls];
    const complexities = [];
    for (const fn of allFuncs) {
      try {
        const body = fn.getBody ? fn.getBody() : null;
        if (!body) continue;
        const start = body.getStartLineNumber();
        const end = body.getEndLineNumber();
        const lines = Math.max(0, end - start + 1);
        const complexity = analyzeComplexityNode(body);
        complexities.push(complexity);
        if (lines >= 200 || complexity >= 25) {
          const name = fn.getName ? (fn.getName() || "<anonymous>") : "<arrow>";
          perFile[pth].bigFunctions.push({ name, lines, complexity, line: fn.getStartLineNumber() });
        }
      } catch (e) {}
    }
    perFile[pth].complexityAverage = complexities.length ? (complexities.reduce((a,b)=>a+b,0)/complexities.length) : 0;
  } catch (e) {}
}

// -----------------------------
// Score final & metrics
for (const f of Object.keys(perFile)) {
  const info = perFile[f];
  const smells = {
    unusedImports: (info.unusedImports || []).length,
    badImports: (info.badImports || []).length,
    anyCount: info.anyCount || 0,
    console: info.consoleCount || 0,
    todos: info.todoCount || 0,
    emptyCatch: (info.emptyCatch || []).length,
    thenWithoutCatch: (info.thenWithoutCatch || []).length,
    magicNumbers: (info.magicNumbers || []).length,
    bigFunctions: (info.bigFunctions || []).length,
    unusedVars: (info.unusedVariables || []).length,
    dead: info.dead ? 1 : 0
  };

  const score = (
    smells.dead * 60 +
    smells.badImports * 10 +
    smells.unusedImports * 8 +
    smells.unusedVars * 7 +
    smells.bigFunctions * 12 +
    smells.magicNumbers * 5 +
    smells.anyCount * 4 +
    smells.console * 2 +
    smells.todos * 3 +
    smells.emptyCatch * 8 +
    smells.thenWithoutCatch * 8 +
    (info.complexityAverage || 0) * 1
  );

  perFile[f].score = Math.round(score);
}

// -----------------------------
// Detect cycles (DFS)
const cycles = [];
const visited = new Set();
const inStack = new Set();

function dfs(node, stack) {
  visited.add(node);
  inStack.add(node);
  const children = graph.get(node) || [];
  for (const c of children) {
    if (!graph.has(c)) continue;
    if (!visited.has(c)) dfs(c, stack.concat([c]));
    else if (inStack.has(c)) {
      const idx = stack.indexOf(c);
      const cycle = idx >= 0 ? stack.slice(idx).concat([c]) : [c, node];
      cycles.push(cycle);
    }
  }
  inStack.delete(node);
}

for (const n of graph.keys()) if (!visited.has(n)) dfs(n, [n]);

// -----------------------------
// Ranking top files
const ranking = Object.values(perFile).sort((a,b)=>b.score - a.score).slice(0, 50);

// -----------------------------
// Gerar outputs: JSON + Markdown
const report = {
  meta: { generatedAt: new Date().toISOString(), root: ROOT },
  globalStats,
  roots,
  deadFiles,
  cycles,
  ranking,
  perFile,
  todoList
};

try {
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");
} catch (e) {
  console.error("❌ Falha ao gravar JSON:", e.message);
}

// Markdown builder
let md = "";
md += `# 📊 Auditoria Profunda — Monorepo\n\n`;
md += `**Gerado em:** ${new Date().toISOString()}\n\n`;
md += `---\n\n## 🔢 Métricas Globais\n\n`;
md += `- Arquivos analisados: **${globalStats.totalFiles}**\n`;
md += `- Linhas totais (aprox): **${globalStats.totalLines}**\n`;
md += `- Caracteres totais (aprox): **${globalStats.totalChars}**\n\n`;

md += `---\n\n## 🔥 Ranking — arquivos mais problemáticos (top ${ranking.length})\n\n`;
md += `| Rank | Score | Arquivo | Linhas | Imports | BadImports | TODOs | anys |\n`;
md += `|-----:|------:|:-------|:------:|:-------:|:----------:|:----:|:----:|\n`;
ranking.forEach((r, i) => {
  md += `| ${i+1} | ${r.score} | \`${short(r.file)}\` | ${r.lines} | ${r.imports.length} | ${r.badImports.length} | ${r.todoCount || 0} | ${r.anyCount} |\n`;
});
md += `\n`;

// dead files
md += `---\n\n## 🧟 Arquivos zumbi (não alcançáveis a partir de entradas detectadas)\n\n`;
if (!deadFiles.length) md += `Nenhum arquivo zumbi detectado.\n\n`;
else deadFiles.forEach(d => md += `- \`${short(d)}\`\n`);
md += `\n`;

// imports não utilizados
md += `---\n\n## ❌ Imports não utilizados (por arquivo)\n\n`;
const filesWithUnused = Object.values(perFile).filter(f => (f.unusedImports || []).length > 0);
if (!filesWithUnused.length) md += `Nenhum import não utilizado detectado.\n\n`;
else {
  for (const f of filesWithUnused) {
    md += `### \`${short(f.file)}\`\n`;
    for (const u of f.unusedImports) md += `- Line ${u.line}: \`${u.name}\`\n`;
    md += `\n`;
  }
}

// unused variables
md += `---\n\n## 🧩 Variáveis não usadas (heurística)\n\n`;
const filesWithUnusedVars = Object.values(perFile).filter(f => (f.unusedVariables || []).length > 0);
if (!filesWithUnusedVars.length) md += `Nenhuma variável não usada detectada.\n\n`;
else {
  for (const f of filesWithUnusedVars) {
    md += `### \`${short(f.file)}\`\n`;
    for (const v of f.unusedVariables) md += `- Line ${v.line}: \`${v.name}\`\n`;
    md += `\n`;
  }
}

// big functions
md += `---\n\n## 🧨 Funções grandes / complexas\n\n`;
const filesWithBigFuncs = Object.values(perFile).filter(f => (f.bigFunctions || []).length > 0);
if (!filesWithBigFuncs.length) md += `Nenhuma função gigante detectada.\n\n`;
else {
  for (const f of filesWithBigFuncs) {
    md += `### \`${short(f.file)}\`\n`;
    for (const bf of f.bigFunctions) md += `- Line ${bf.line}: \`${bf.name}\` — ${bf.lines} linhas, complexity ${bf.complexity}\n`;
    md += `\n`;
  }
}

// magic numbers
md += `---\n\n## 🔢 Magic numbers (heurística)\n\n`;
const filesWithMagic = Object.values(perFile).filter(f => (f.magicNumbers || []).length > 0);
if (!filesWithMagic.length) md += `Nenhum número "mágico" detectado.\n\n`;
else {
  for (const f of filesWithMagic) {
    md += `### \`${short(f.file)}\`\n`;
    for (const m of f.magicNumbers) md += `- Line ${m.line}: ${m.value}\n`;
    md += `\n`;
  }
}

// todos
md += `---\n\n## 📝 TODOs / FIXMEs encontrados\n\n`;
if (!todoList.length) md += `Nenhum TODO/FIXME detectado.\n\n`;
else {
  for (const t of todoList.slice(0, 500)) md += `- \`${short(t.file)}\`: \`${t.snippet.replace(/\n/g,' ')}\`\n`;
  md += `\n(Se houver muitos, foram mostrados os 500 primeiros)\n\n`;
}

// then without catch
md += `---\n\n## ⚠️ Chamadas .then sem .catch (heurística)\n\n`;
const filesWithThen = Object.values(perFile).filter(f => (f.thenWithoutCatch || []).length > 0);
if (!filesWithThen.length) md += `Nenhuma cadeia .then sem .catch detectada.\n\n`;
else {
  for (const f of filesWithThen) {
    md += `### \`${short(f.file)}\`\n`;
    for (const t of f.thenWithoutCatch) md += `- Line ${t.line}: \`${t.text.slice(0,200)}\`\n`;
    md += `\n`;
  }
}

// empty catches
md += `---\n\n## ⚠️ Catch blocks vazios / ineficazes\n\n`;
const filesWithEmptyCatch = Object.values(perFile).filter(f => (f.emptyCatch || []).length > 0);
if (!filesWithEmptyCatch.length) md += `Nenhum catch vazio detectado.\n\n`;
else {
  for (const f of filesWithEmptyCatch) {
    md += `### \`${short(f.file)}\`\n`;
    for (const e of f.emptyCatch) md += `- Line ${e.line}: \`${(e.text||"").slice(0,200)}\`\n`;
    md += `\n`;
  }
}

// bad imports
md += `---\n\n## ❗ Imports quebrados (módulos que não foram resolvidos)\n\n`;
const bads = Object.values(perFile).filter(f => (f.badImports || []).length > 0);
if (!bads.length) md += `Nenhum import quebrado detectado.\n\n`;
else {
  for (const f of bads) {
    md += `### \`${short(f.file)}\`\n`;
    for (const b of f.badImports) md += `- \`${b}\`\n`;
    md += `\n`;
  }
}

// cycles
md += `---\n\n## 🔁 Dependências circulares detectadas (heurística)\n\n`;
if (!cycles.length) md += `Nenhum ciclo detectado.\n\n`;
else {
  cycles.slice(0,50).forEach((c,i) => {
    md += `${i+1}. ${c.map(p=>`\`${short(p)}\``).join(" -> ")}\n`;
  });
  md += `\n`;
}

// suggestions
md += `---\n\n## ✅ Sugestões e próximos passos (prioritizadas)\n\n`;
md += `1. Corrigir imports quebrados e adicionar testes para resolução de módulos. (Alto)\n`;
md += `2. Revisar top 20 arquivos do ranking — dividir em módulos menores, extrair funções. (Alto)\n`;
md += `3. Criar regra de linter/CI para banir \`console.log\` em produção e tratar TODOs. (Médio)\n`;
md += `4. Implementar políticas de tratamento de promises: sempre usar async/await ou .catch/finally. (Alto)\n`;
md += `5. Adotar Repository / UseCase para isolar lógica de acesso a D1 / banco. (Médio)\n`;
md += `6. Adicionar análise de complexidade automática no pipeline (vitest + eslint plugin). (Médio)\n`;
md += `7. Automatizar remoção de imports não usados com ferramentas (eslint --fix / ts-prune). (Baixo)\n\n`;

// salvar
try {
  fs.writeFileSync(OUT_MD, md, "utf8");
  console.log("📄 Relatório Markdown salvo em:", OUT_MD);
  console.log("📄 Relatório JSON salvo em:", OUT_JSON);
  console.log("✅ Auditoria finalizada com sucesso.");
} catch (e) {
  console.error("❌ Falha ao salvar relatórios:", e.message);
}

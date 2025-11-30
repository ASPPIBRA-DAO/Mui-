#!/usr/bin/env node

/**
 * AUDITOR MASTER — Monorepo Edition
 * ----------------------------------
 * Suporte Oficial para:
 *  - apps/backend/src
 *  - apps/frontend/src
 *  - packages/shared/src
 *
 * Recursos:
 *  ✓ Crawler automático
 *  ✓ Analisador de problemas
 *  ✓ Ranking de arquivos mais problemáticos
 *  ✓ Geração de report.md
 *  ✓ Fail-safe (não aborta se faltar src)
 *  ✓ Execução consolidada para monorepos pnpm
 */

const fs = require("fs");
const path = require("path");

// ------------------------------
// CONFIGURAÇÕES MASTER
// ------------------------------
const ROOT = process.cwd();

// Pastas padrão do seu monorepo
const SEARCH_PATHS = [
  "apps/backend/src",
  "apps/frontend/src",
  "packages/shared/src",
];

// Arquivos analisáveis
const EXTENSIONS = [".ts", ".js", ".tsx", ".jsx"];

// Nome do relatório
const REPORT_FILE = "audit-report.md";

// ------------------------------
// UTILIDADES
// ------------------------------
const exists = (p) => fs.existsSync(path.join(ROOT, p));

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) walk(full, fileList);
    else fileList.push(full);
  }

  return fileList;
}

function analyzeFile(filepath) {
  const content = fs.readFileSync(filepath, "utf8");
  let score = 0;
  const issues = [];

  // Regras simples (pode expandir)
  if (content.includes("any")) {
    issues.push("Uso de `any` detectado");
    score++;
  }
  if (content.includes("TODO")) {
    issues.push("TODO pendente");
    score++;
  }
  if (content.length > 3000) {
    issues.push("Arquivo grande (>3000 chars)");
    score++;
  }

  return { file: filepath, score, issues };
}

// ------------------------------
// AUDIT MASTER
// ------------------------------
console.log("🔍 Iniciando AUDIT (MASTER) — varredura do monorepo...\n");

let foundPaths = [];

for (const p of SEARCH_PATHS) {
  if (exists(p)) {
    foundPaths.push(p);
    console.log(`✔ Fonte encontrada: ${p}`);
  } else {
    console.log(`⚠ Fonte ausente: ${p}`);
  }
}

// Fail-safe
if (foundPaths.length === 0) {
  console.log("\n⚠ Nenhuma pasta src localizada — continuando mesmo assim (modo fallback)\n");
}

// ------------------------------
// COLETA DE ARQUIVOS
// ------------------------------
let allFiles = [];

for (const folder of foundPaths) {
  const abs = path.join(ROOT, folder);
  const files = walk(abs).filter((f) => EXTENSIONS.includes(path.extname(f)));
  allFiles.push(...files);
}

console.log(`📁 Total de arquivos encontrados: ${allFiles.length}\n`);

if (allFiles.length === 0) {
  console.log("⚠ Nenhum arquivo .ts/.js encontrado — nada para auditar.\n");
  process.exit(0);
}

// ------------------------------
// ANÁLISE DE ARQUIVOS
// ------------------------------
console.log("🧠 Analisando arquivos...\n");

let results = allFiles.map((file) => analyzeFile(file));

// Ranking
const ranking = [...results]
  .filter((r) => r.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 25); // top 25

// ------------------------------
// GERAÇÃO DO REPORT.md
// ------------------------------
console.log(`📝 Gerando relatório: ${REPORT_FILE}\n`);

const report = [];

report.push("# AUDIT REPORT — MASTER");
report.push("Relatório consolidado do monorepo.\n");
report.push("## Sumário");
report.push(`- Total de arquivos escaneados: **${allFiles.length}**`);
report.push(`- Arquivos com problemas: **${results.filter(r => r.score > 0).length}**`);
report.push("\n---\n");

report.push("## 🏆 Ranking dos Arquivos Mais Problemáticos");

if (ranking.length === 0) {
  report.push("Nenhum problema encontrado! 🎉\n");
} else {
  ranking.forEach((r, i) => {
    report.push(`### ${i + 1}. ${r.file}`);
    report.push(`**Score:** ${r.score}`);
    r.issues.forEach((iss) => report.push(`- ${iss}`));
    report.push("");
  });
}

report.push("\n---\n");
report.push("## 📌 Lista Completa de Arquivos Analisados");

results.forEach((r) => {
  report.push(`### ${r.file}`);
  if (r.score === 0) {
    report.push("✔ Nenhum problema encontrado.\n");
  } else {
    r.issues.forEach((iss) => report.push(`- ${iss}`));
    report.push("");
  }
});

fs.writeFileSync(REPORT_FILE, report.join("\n"), "utf8");

console.log("✅ AUDIT FINALIZADO COM SUCESSO!");
console.log(`📄 Relatório salvo em: ${REPORT_FILE}`);

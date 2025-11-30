
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Caminhos do seu projeto
const ROOT = path.resolve(__dirname, '..');
const WRANGLER_CONFIG = path.join(ROOT, 'wrangler.jsonc');
const MIGRATIONS_DIR = path.join(ROOT, 'migrations');

function section(title: string) {
  console.log('\n====================================================');
  console.log('  ' + title);
  console.log('====================================================\n');
}

function run(command: string) {
  try {
    return execSync(command, { stdio: 'pipe' }).toString();
  } catch (err: any) {
    const stdout = err.stdout?.toString() || '';
    const stderr = err.stderr?.toString() || '';
    return stdout + stderr + err.toString();
  }
}

(async () => {
  section('VERIFICANDO ARQUIVO wrangler.jsonc');

  let configContent;
  try {
    configContent = readFileSync(WRANGLER_CONFIG, 'utf-8');
  } catch (error) {
    console.log(`❌ ERRO: Não foi possível ler o arquivo ${WRANGLER_CONFIG}.`);
    console.error(error);
    process.exit(1);
  }
  console.log(configContent);

  if (!configContent.includes('d1_databases') || !configContent.includes('"binding": "DB"')) {
    console.log('❌ ERRO: Binding DB não encontrado no wrangler.jsonc');
    process.exit(1);
  }

  console.log('✔ wrangler.jsonc OK');

  section('VERIFICANDO MIGRATIONS');

  let migrations = '';
  try {
    migrations = run(`ls "${MIGRATIONS_DIR}"`);
  } catch {}

  console.log(migrations);

  if (!migrations.includes('.sql')) {
    console.log("❌ ERRO: Nenhuma migration .sql encontrada na pasta 'migrations'.");
    process.exit(1);
  }

  console.log('✔ Migrations encontradas');

  section('APLICANDO MIGRATIONS LOCALMENTE');

  const apply = run(
    `npx wrangler d1 execute todo-db --local --file="${path.join(MIGRATIONS_DIR, '001_init.sql')}"`
  );
  console.log(apply);

  if (apply.includes('Error')) {
      console.log('❌ ERRO: Falha ao aplicar migrations.');
      process.exit(1);
  }

  console.log('✔ Migrations aplicadas localmente');

  section('TESTANDO CONEXÃO COM O D1 LOCAL');

  const testSelect = run(
    `npx wrangler d1 execute todo-db --local --command="SELECT 1 AS test;"`
  );
  console.log(testSelect);

  if (!testSelect.includes('1')) {
    console.log('❌ ERRO: Falha ao realizar SELECT 1.');
    process.exit(1);
  }

  console.log('✔ SELECT 1 OK');

  section('TESTANDO INSERT / SELECT EM TABELAS REAIS');

  const userId = 'test-user-123';

  const insert = run(
    `npx wrangler d1 execute todo-db --local --command="INSERT OR IGNORE INTO users (id, email, password_hash) VALUES ('${userId}', 'test-user@example.com', 'hash123');"`
  );
  console.log(insert);

  const selectUser = run(
    `npx wrangler d1 execute todo-db --local --command="SELECT * FROM users WHERE id='${userId}';"`
  );
  console.log(selectUser);

  if (!selectUser.includes('test-user@example.com')) {
    console.log('❌ ERRO: Falha no INSERT/SELECT na tabela users.');
    process.exit(1);
  }

  console.log('✔ INSERT/SELECT nas tabelas funcionando');

  section('CHECKLIST FINAL');

  const checklist = `
✔ wrangler.jsonc localizado
✔ Binding DB encontrado
✔ Migrations encontradas
✔ Migrations aplicadas
✔ Conexão com D1 local funcionando
✔ SELECT 1 funcionando
✔ INSERT/SELECT nas tabelas OK
✔ Ambiente local configurado corretamente 🎉
`;

  console.log(checklist);
  
    section("LOGO FINAL (ASCII)");

  console.log(`
██████╗ ███████╗    ██████╗ ██╗
██╔══██╗██╔════╝    ██╔══██╗██║
██║  ██║█████╗      ██████╔╝██║
██║  ██║██╔══╝      ██╔═══╝ ██║
██████╔╝███████╗    ██║     ██║
╚═════╝ ╚══════╝    ╚═╝     ╚═╝

CLOUDFLARE D1 • TESTE COMPLETO • OK
`);


  console.log('🎯 Tudo certo! Seu ambiente está 100% funcional.');
})();

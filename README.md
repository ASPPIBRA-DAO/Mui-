📘 DOCUMENTAÇÃO OFICIAL — ARQUITETURA DO MONOREPO (PNPM + CLOUDFLARE WORKERS + REACT)

Versão 2.0 — Revisada, Profissional e Consolidada
Projeto: Todo App — Monorepo Serverless
Última atualização: 1 de Dezembro de 2025

## 1. 📖 Visão Geral da Arquitetura

A aplicação Todo App é uma solução Fullstack executada em arquitetura Serverless Edge, composta por:

- Aplicação Web SPA desenvolvida em React + Vite
- API Serverless desenvolvida em Hono + Cloudflare Workers
- Monorepo PNPM com módulos compartilhados
- D1 como banco SQL nativo do Cloudflare
- R2 como armazenamento de ativos do sistema
- Schemas Zod + Tipagem compartilhada entre API e Frontend

Toda a stack foi organizada para garantir:

**Objetivos Arquiteturais**

- Estabilidade operacional — eliminação de dependências incompatíveis
- Alta performance — execução 100% na borda (Cloudflare Edge)
- Código DRY e modular — contratos reutilizáveis via pacotes internos
- Escalabilidade horizontal — escalonamento automático global
- Governança de código — auditoria interna automatizada

## 2. 🗂 Estrutura do Monorepo (PNPM Workspaces)

O repositório utiliza PNPM Workspaces, que organiza o código em aplicações (apps/) e bibliotecas internas (packages/).

```
.
├── apps/
│   ├── api/                     # API serverless (Hono + Cloudflare Workers)
│   │   ├── src/
│   │   │   ├── config/          # Configurações (D1, R2, Environment)
│   │   │   ├── middlewares/     # Middlewares Hono (ex: JWT Guard)
│   │   │   ├── modules/         # Módulos de domínio
│   │   │   │   ├── auth/
│   │   │   │   └── todos/
│   │   │   └── index.ts         # Entry point da API (fetch handler)
│   │   └── wrangler.jsonc       # Configurações Cloudflare
│   │
│   └── frontend/                # SPA React (Vite)
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── routes/
│       │   └── services/        # Clientes HTTP (axios)
│       └── package.json
│
└── packages/
    ├── shared/                  # Tipos + Schemas Zod compartilhados
    │   ├── src/
    │   │   └── schemas/
    │   └── package.json
    │
    └── utils/                   # Utilidades internas reutilizáveis
        └── package.json

pnpm-workspace.yaml             # Declara os workspaces do projeto
pnpm-lock.yaml                  # ÚNICO lockfile permitido no monorepo
```

## 3. 📦 Versões das Tecnologias (ambiente de desenvolvimento)

> As versões abaixo refletem o ambiente de desenvolvimento e as dependências principais usadas no monorepo. Atualize sempre que fizer upgrades e sincronize com `package.json` e `pnpm-lock.yaml`.

| Componente / Ferramenta | Versão usada / recomendada |
|---|---:|
| pnpm (workspace) | ≥ 9.0 (recomendado) |
| Node.js (dev) | 18.x / 20.x (LTS recomendado) |
| React | 19.2.0 |
| Vite | 7.2.4 |
| React Router DOM | 7.9.6 |
| Material UI | 7.3.5 |
| Axios | 1.13.2 |
| TypeScript | 5.9.3 |
| Hono | 4.10.7 |
| Cloudflare Wrangler | 4.51.0 |
| @hono/jwt | latest (usar versão compatível com Hono v4) |
| bcryptjs | 3.0.3 |
| Zod | 3.23.0 |
| Cloudflare D1 | (serviço Cloudflare — use runtime compatível com Wrangler 4.51) |
| pnpm-lock.yaml | Único lockfile do monorepo |

### Sugestões práticas

- Adicione campos `engines` no `package.json` da raiz para travar a versão mínima do Node/pnpm:
  ```json
  "engines": {
    "node": ">=18",
    "pnpm": ">=9"
  }
  ```
- **Mantenha uma única fonte de verdade para versões:** Use `package.json` por workspace e `pnpm-lock.yaml` na raiz.
- **Automatize updates** com Renovate/Dependabot e crie PRs de atualização.
- Ao atualizar uma dependência incompatível (ex.: Hono maior), atualize também esta tabela e as instruções de deploy (`wrangler.jsonc`/`wrangler.toml`).

## 4. ⚙️ Funcionamento do PNPM (Arquitetura Interna)

O PNPM utiliza uma arquitetura moderna baseada em:

✔ **Repositório Central ("PNPM Store")**

Onde todas as dependências reais ficam armazenadas:
`~/.pnpm-store`

✔ **Node Modules Virtuais (Symlinks)**

Cada workspace possui sua própria pasta node_modules, porém contendo apenas links simbólicos para os pacotes na store.

✔ **Benefícios**

- Redução extrema de espaço
- Instalações até 30x mais rápidas
- Zero duplicação de dependências
- Cache persistente global

❗ **Política Oficial do Projeto**

O monorepo NÃO permite o uso de:

- `package-lock.json` (bloqueado)
- `yarn.lock`         (bloqueado)

## 5. 🏗 Arquitetura da API — Hono + Cloudflare Workers

A API segue o padrão funcional adaptado para a borda:

`Cliente → Worker (fetch) → Hono → Middleware → Rota → Controller → Service → D1`

### 5.1. Componentes Principais
| Camada | Descrição |
| :--- | :--- |
| **index.ts** | Ponto de entrada do Worker. Monta o app Hono. |
| **routes/** | Define rotas e associa a validações Zod via zValidator. |
| **middlewares/** | Autenticação JWT, CORS, Logs. |
| **modules/** | Domínio (auth, todos), com controllers e services. |
| **services/** | Acessam o banco D1 via env.DB. |
| **D1 SQL** | Persistência nativa, sem ORMs. |

### 5.2. Segurança

- Hashing de senha → `bcryptjs`
- JWT → `@hono/jwt` (sign & verify)
- Secrets → configuradas via `wrangler secret put`

**Tokens:**

- Access Token: 15 minutos
- Refresh Token: 7 dias

## 6. 🧱 Persistência — Cloudflare D1
**Banco:**
`governance-system-db`
**ID:** `fbdff5ac-2fcc-4182-9cbf-be6c1d08e287`

**Migrations:**
Localizadas em:
`apps/api/migrations/`

Aplicação:
`pnpm wrangler d1 migrations apply governance-system-db`

## 7. 🖼 Frontend — React + Vite

A aplicação cliente é uma SPA que utiliza:

- React 19
- Material UI
- React Router DOM
- Axios para consumo da API
- Context API para autenticação

**Fluxo de autenticação:**
`Login → Recebe JWT → Grava em localStorage → Interceptor Axios aplica Authorization → Rotas protegidas`

## 8. 🔗 Shared — Tipos e Schemas

O pacote `packages/shared` contém:

- Tipos globais
- Schemas Zod
- Contratos entre API e Frontend

Exemplo de export:
`import { LoginSchema, TodoSchema } from '@app/shared';`

## 9. 🔍 Auditoria Interna do Repositório (Script integrado)

O monorepo inclui um módulo interno de Auditoria que executa verificações automáticas.

**Comando:**
`pnpm audit:repo`

**Verificações executadas:**
| Teste | Severidade | Status |
| :--- | :--- | :--- |
| TODOs no código | Low | ✔ |
| Uso de any | Medium | ✔ |
| Magic Numbers | Medium | ✔ |
| Catch vazio | High | ✔ |
| then() sem catch() | High | ✔ |
| Funções muito grandes | Medium | ✔ |
| Ciclos de importação | Critical | ✔ |
| Imports suspeitos | Low | ✔ |
| Imports não utilizados | Low | ✔ |
| Arquivos duplicados | Medium | ✔ |
| Pastas duplicadas | Low | ✔ |
| Estrutura do monorepo | High | ✔ |

O relatório é gerado automaticamente em:
`/audit/report.md`

## 10. 🧭 Governança Técnica (Oficial)
### 10.1. Normas Obrigatórias

- Usar somente PNPM
- Apenas 1 lockfile → `pnpm-lock.yaml`
- Importar apenas via paths absolutos configurados
- Proibido deixar código sem validação Zod
- Proibido lógica de negócio dentro de controllers
- Proibido criar "Models" (não existe ORM)

### 10.2. Código Deve Ser

- Determinístico
- Funcional
- Puro quando possível
- Segregado por domínio
- Compartilhado apenas via “packages/”

## 11. 🧱 Diagramas Arquiteturais
### 11.1. Fluxo Completo (Frontend → API → D1)
```
[React App]
    ↓ HTTP
[Cloudflare Edge]
    ↓
[Worker fetch()]
    ↓
[Hono Middleware]
    ↓
[Route Handler]
    ↓
[Controller]
    ↓
[Service]
    ↓
[D1 Database]
```

### 11.2. Monorepo (Dependências Internas)
```
apps/api  ───────┐
                 │
apps/frontend ───┤────> packages/shared
                 │
packages/utils ──┘
```

## 12. 🚀 Roadmap Técnico (Recomendado)
Próximos passos:

- Padronizar revisões via auditoria automática
- Criar scripts de CI (GitHub Actions)
- Gerar documentação interativa (OpenAPI + Zod)
- Criar CLI interna para migrações e seeds D1
- Implantar testes E2E usando Playwright

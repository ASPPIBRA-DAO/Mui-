# Arquitetura Profissional — Todo App (Monorepo Serverless)

Conteúdo: Documentação oficial e revisada da arquitetura Fullstack Monorepo, alinhada com as boas práticas de Cloudflare Workers, Hono, e React.

## 1. Visão Geral (Resumo da Arquitetura)

Aplicação: Todo App — SPA em React (Vite) consumindo uma API RESTful serverless executada em Cloudflare Workers com Hono.

A arquitetura foi migrada para um Monorepo centralizado, garantindo que a tipagem e os schemas Zod sejam compartilhados de forma eficiente entre o Frontend e o Backend.

### Principais Metas Alcançadas:

* **Estabilidade:** Eliminação completa dos conflitos de runtime (Mongoose/Typegoose) e substituição por soluções estáveis.
* **Monorepo Único:** Separação lógica das responsabilidades em `apps/` e `packages/`.
* **Performance Edge:** Uso exclusivo de tecnologias otimizadas para a borda (Hono, Workers).

### 1.1. Versões das Tecnologias Utilizadas (Estado Atual)

**Frontend (`apps/frontend`)**

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2.0 | Componentes e UI |
| Vite | 7.2.4 | Bundler e Servidor de Desenvolvimento |
| React Router DOM | 7.9.6 | Roteamento |
| Material UI | 7.3.5 | Componentes de Interface |
| Axios | 1.13.2 | Cliente HTTP para API |

**Backend (`apps/backend`)**

| Tecnologia | Versão | Uso |
|---|---|---|
| Cloudflare Workers | (runtime mais recente) | Ambiente de Execução Serverless |
| Hono | 4.10.7 (Exemplo) | Framework de Rotas/API |
| Wrangler | 4.51.0 | CLI para Deploy e Dev Local |
| @hono/jwt | (latest) | Geração/Validação de Tokens (Substitui jsonwebtoken) |
| bcryptjs | 3.0.3 | Hashing de Senhas (Substitui argon2) |
| Zod | 3.23.0 | Validação de Esquemas |

**Shared (`packages/shared`)**

* **Zod:** 3.23.0 (Schemas)
* **TypeScript:** 5.9.3 (Tipagem)

### 1.2. Estrutura de Diretórios (Monorepo)

A estrutura atual reflete a organização em Workspaces, onde o código é isolado por responsabilidade, facilitando a manutenção e a escalabilidade.

```
.
├── apps/                               # Aplicações principais (Gerenciadas pelo pnpm)
│   ├── backend/                        # API Serverless (Cloudflare Workers, Hono, D1)
│   │   ├── src/                        # Código Fonte TypeScript (Onde a lógica reside)
│   │   │   ├── config/                 # Configurações de Banco e Injeção de Dependência
│   │   │   ├── middlewares/            # Funções de pré-processamento (ex: autenticação JWT)
│   │   │   ├── modules/                # Módulos de Domínio (Lógica de Negócio principal)
│   │   │   │   ├── auth/               # Autenticação (Lógica de Login, Registro)
│   │   │   │   └── todos/              # Lógica de Tarefas (CRUD, D1 Services)
│   │   │   └── index.ts                # Ponto de Entrada do Cloudflare Worker (Função fetch)
│   │   ├── migrations/                 # Scripts SQL para o Cloudflare D1
│   │   └── wrangler.jsonc              # Configuração do Cloudflare (Bindings, Node Compat)
│   └── frontend/                       # Aplicação Cliente (React SPA)
│       ├── src/                        # Código Fonte TypeScript/JSX
│       │   ├── components/             # Componentes reutilizáveis (UI, Formulários)
│       │   ├── context/                # Contextos de Estado Global (ex: AuthProvider, ThemeContext)
│       │   ├── pages/                  # Componentes de Páginas (Views)
│       │   ├── routes/                 # Definição e Proteção de Rotas
│       │   └── services/               # Clientes de API (Axios e Stubs)
│       └── package.json                # Dependências do Frontend
├── packages/                           # Bibliotecas internas (Camada de Contrato)
│   └── shared/                         # Tipagem e Schemas (A "Cola" do Monorepo)
│       ├── src/                        # Código Fonte do Shared
│       │   └── schemas/                # Definições de Schemas Zod (Validação)
│       └── package.json                # Define o pacote como '@seu-app/shared'
└── pnpm-workspace.yaml                 # Configuração que define o Monorepo para o pnpm
```

## 2. Componentes da Arquitetura Monorepo

O projeto é dividido em três workspaces gerenciados pelo pnpm:

### 2.1. Backend (`apps/backend`)

Responsável por toda a lógica de negócio, persistência (D1/KV), segurança e exposição da API REST.

| Caminho | Descrição |
|---|---|
| `src/index.ts` | Entry Point do Worker. Contém `export default { fetch }` e monta o App Hono. |
| `src/modules/*` | Domínios/Módulos. Contém a lógica (Controllers, Services, Models). |
| `src/modules/*/controller.ts` | Trata a requisição Hono (`c.req`), chama o Service e retorna a resposta. |
| `src/modules/*/service.ts` | Lógica de Negócio e manipulação de dados (interage com D1). |
| `src/middlewares/guard.ts` | Middleware de autenticação (verifica JWT). |
| `wrangler.jsonc` | Configuração de Bindings (D1, KV, Secrets) e compatibilidade (`nodejs_compat`). |

### 2.2. Frontend (`apps/frontend`)

A Interface do Usuário (UI) que consome o Backend.

| Caminho | Descrição |
|---|---|
| `src/App.tsx` | Componente principal com a definição das rotas (RouterProvider). |
| `src/pages/*` | Componentes que representam telas inteiras (Home, Login, Dashboard). |
| `src/components/*` | Componentes reutilizáveis (UI, Formulários). |
| `src/context/AuthProvider.tsx` | Gerenciamento de estado de autenticação (Lógica de bypass atual). |
| `src/services/api.ts` | Instância de Axios configurada para a API (URL base e Interceptores). |

### 2.3. Shared (`packages/shared`)

A Camada de Tipagem e Contratos.

| Caminho | Descrição |
|---|---|
| `src/schemas/*` | Contratos (Zod). Define a estrutura de dados para entradas de API (validação) e saídas (tipagem). |
| `src/index.ts` | Ponto de Exportação Único. Facilita o consumo (ex: `import { LoginInput } from '@seu-app/shared'`). |

## 3. Persistência e Segurança (Workers)

* **Persistência:** O banco de dados primário deve ser Cloudflare D1 (SQL), que é nativo, performático e resolve os erros de compatibilidade que tínhamos com o Mongoose.
* **Hashing de Senhas:** Usar `bcryptjs` (que funciona via `nodejs_compat`) ou as APIs WebCrypto nativas do Workers.
* **JWT:** Usar o utilitário nativo `hono/jwt` para `sign` e `verify` tokens, garantindo a compatibilidade Edge.

## 4. Estrutura de Rotas e Fluxo de Dados

O Edge/API (Cloudflare Workers) segue o padrão MVC (Model-View-Controller) adaptado para uma arquitetura funcional:

1. **Requisição:** Chega ao Worker.
2. **`index.ts`:** Executa a função `fetch` e passa a requisição para o Hono.
3. **Hono Middlewares:** CORS, Logger, e `authenticate` (`guard.ts`).
4. **`todo.routes.ts`:** Usa o `zValidator` com Schemas do Shared para validar o payload.
5. **`todo.controller.ts`:** Recebe os dados validados, chama o `todo.service.ts`.
6. **`todo.service.ts`:** Interage com o Cloudflare D1 (via Bindings `env.DB`).
7. **Resposta:** Os dados são retornados, e o Hono os empacota em JSON.

## 5. Próximos Passos Prioritários

Com a arquitetura básica validada, o foco agora é a reconstrução da lógica:

1. **Implementação de Banco D1:** Escrever o código D1 Client (`src/utils/db.ts`) e definir as consultas SQL para Usuários e Tarefas.
2. **Reconstrução de Módulos:** Recriar os Models, Services e Controllers para Usuários e Tarefas, substituindo a lógica Mongoose pela lógica D1.
3. **Reativação da Autenticação:** Implementar o login e register usando `bcryptjs` e `hono/jwt`.
4. **Integração do Frontend:** Conectar os formulários do Frontend aos novos endpoints do Backend.

## Infraestrutura — Cloudflare (D1 + R2)

O sistema utiliza:

### 🗄️ Banco de Dados D1
- Nome: **governance-system-db**
- ID: **fbdff5ac-2fcc-4182-9cbf-be6c1d08e287**

### 📦 Armazenamento R2
- Bucket: **governance-system-assets**
- Account ID: **5d91807e648c183cb7833caa06dbcbdb**

Toda a infraestrutura é configurada via `wrangler.toml` e automaticamente auditada pelo módulo de auditoria incluído no repositório.

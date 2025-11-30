# Arquitetura Profissional — Todo App (Serverless)

> Conteúdo: Proposta de arquitetura nível profissional, diagrama Mermaid, e documentação oficial reescrita para implantação, operação e manutenção.

---

## 1. Visão Geral (Resumo)

Aplicação: **Todo App** — SPA em React (Vite) consumindo uma API RESTful serverless executada em **Cloudflare Workers** com Hono. O objetivo desta proposta é transformar a arquitetura atual em um design robusto, seguro, observável e pronto para produção, mantendo custo-efetividade e baixa latência.

Principais metas:

* Segurança e práticas recomendadas de autenticação (Refresh Tokens, httpOnly cookies).
* Persistência confiável (Cloudflare D1 / Durable Objects / R2 para arquivos).
* Observabilidade (logs estruturados, métricas, tracing).
* Resiliência e escalabilidade (rate-limiting, retries, CQRS quando necessário).
* Pipeline de CI/CD e infraestrutura como código para deployments reproduzíveis.

---

## 1.1. Versões das Tecnologias Utilizadas

### **Frontend**

* **React:** 19.2.0
* **Vite:** 7.2.4
* **TypeScript:** 5.9.3
* **React Router DOM:** 7.9.6
* **Material UI:** 7.3.5
* **Axios:** 1.13.2

### **Backend**

* **Cloudflare Workers:** (runtime mais recente)
* **Hono:** 5.0.22
* **TypeScript:** 5.5.2
* **Wrangler:** 4.51.0
* **bcryptjs:** 3.0.3
* **jsonwebtoken:** 9.0.2
* **Vitest:** 3.2.0

## 2. Componentes da Arquitetura

* **Frontend (React SPA)**

  * Vite, React 19, Material UI, React Router, Axios.
  * Autenticação via httpOnly cookie + token de acesso em memória (opcional).
  * Service Worker para cache offline/asset caching (opcional).
  * Estrutura de Arquivos:
    ```
    frontend/
    ├── src/
    │   ├── App.tsx              # Componente principal com a definição das rotas
    │   ├── main.tsx             # Ponto de entrada que renderiza a aplicação
    │   ├── assets/              # Arquivos estáticos (imagens, svgs)
    │   ├── components/          # Componentes reutilizáveis (Formulários, Header, etc.)
    │   │   ├── AuthProvider.tsx # Contexto para gerenciamento de estado de autenticação
    │   │   └── ProtectedRoute.tsx # Componente para proteger rotas autenticadas
    │   └── pages/               # Componentes que representam as páginas da aplicação
    │       ├── Home.tsx
    │       ├── Login.tsx
    │       ├── Register.tsx
    │       └── Dashboard.tsx
    ├── vite.config.ts           # Configuração do Vite (incluindo proxy para a API)
    └── package.json             # Dependências e scripts
    ```

* **Edge/API (Cloudflare Workers)**

  * Hono como framework de rotas/middlewares.
  * Middlewares: CORS, autenticação (JWT guard), input validation, rate-limiter.
  * Handler para endpoints REST: `/auth/*`, `/users/*`, `/todos/*`.
  * Integração com banco e outros serviços via bindings.
  * Estrutura de Arquivos:
    ```
    backend/
    ├── src/
    │   ├── index.ts             # Ponto de entrada principal do Worker
    │   ├── server.ts            # Configuração e inicialização do servidor Hono
    │   ├── config/              # Módulo de configurações da aplicação
    │   ├── middlewares/         # Middlewares (CORS, JWT Guard)
    │   ├── modules/             # Contém os módulos de negócio (Auth, Users, Todos)
    │   │   ├── auth/            # Lógica de autenticação
    │   │   ├── users/           # Gerenciamento de usuários (serviços, schemas)
    │   │   └── todos/           # Gerenciamento de tarefas (serviços, schemas)
    │   └── utils/               # Funções utilitárias (criptografia, JWT)
    ├── test/                    # Testes da aplicação com Vitest
    ├── wrangler.jsonc           # Arquivo de configuração do Cloudflare Worker
    └── package.json             # Dependências e scripts
    ```

* **Persistência e Estado**

  * **Cloudflare D1**: banco SQL para entidades relacionais (users, todos, sessions). Principal para dados relacionais.
  * **Durable Objects**: quando precisar de coordenação de estado com forte consistência (locks, rate limit counters, presence, WebSocket session state).
  * **Workers KV**: armazenamento de baixa latência e leitura-otimizada para dados que mudam pouco (config, feature flags, caches). Não recomendado para dados com alta taxa de escrita/consistência forte.
  * **R2**: armazenamento de objetos (anexos, imagens) quando necessário.

* **Segurança e Autenticação**

  * Senhas: argon2/argon2-browser ou `@cloudflare/argon2` para hashing (não usar bcryptjs em borda se houver alternativa otimizada).
  * JWT de curta duração (5–15 minutos) para acesso.
  * **Refresh Token** com armazenamento em cookie `HttpOnly`, `Secure`, `SameSite=Strict` (refresh flow em endpoint `/auth/refresh`).
  * Rotina de logout que revoga refresh tokens (lista de revogação em D1 / KV).

* **Rate Limiting / Abuse Protection**

  * Limite por IP e por usuário: counters em Durable Objects ou Redis (se usar external).
  * Proteção contra brute force em endpoints de auth (expondo CAPTCHA via Turnstile quando necessário).

* **Observabilidade**

  * Logs estruturados (JSON) enviados a Logflare / Datadog / Sentry.
  * Métricas: request count, latency, error rate (Prometheus compatible via exporter ou serviço gerenciado).
  * Tracing: integração com OpenTelemetry (amostral no edge) para correlacionar requests frontend → worker → D1.

* **CD/CI e Infraestrutura**

  * Repositórios separados `frontend/` e `backend/` com pipelines:

    * **CI**: testes unitários (Vitest), lint, typecheck.
    * **CD**: pipeline que roda build e publica via `wrangler publish` com variáveis secretas gerenciadas em CI.
  * Infra como código: Terraform + Cloudflare provider (ou wrangler for bindings) para reproduzir D1, KV, R2, Workers, DNS.

* **Backup & Disaster Recovery**

  * Export periódico do D1 para storage (R2) e versão de schema migrations (sqldef / migrator).
  * Playbook para rollback de Workers e restauração de DB.

---

## 3. Diagrama (Mermaid)

```mermaid
flowchart LR
  subgraph "User and Frontend"
    User -- "Accesses site" --> B[Cloudflare Pages]
    B -- "Serves React SPA (Vite)" --> A[Browser]
    A -- "Makes API calls (HTTPS)" --> C[Cloudflare Worker (Hono)]
  end

  subgraph "Cloudflare Edge"
    C --> D{Auth Middleware}
    D -- "Authenticated" --> E[JWT Guard & Protected Routes]
    D -- "Public" --> F[Public Routes]
  end

  subgraph "Backend Services & Persistence"
    C -- "Accesses data" --> G[Cloudflare D1 (SQL)]
    C -- "Accesses state/cache" --> H[Workers KV]
    C -- "Coordinates state" --> I[Durable Objects]
    C -- "Stores files" --> J[R2 (Storage)]
  end

  subgraph Observability
    C -- "Sends logs/traces" --> K[Logging & Monitoring (Sentry, etc)]
  end

  subgraph "Deployment (CI/CD)"
    M[GitHub Actions] -- "Deploys Frontend" --> B
    M -- "Publishes Backend" --> C
  end

  style A fill:#f8f9fa,stroke:#333
  style "User and Frontend" fill:#eef7ff,stroke:#333
  style "Cloudflare Edge" fill:#fff,stroke:#333
  style "Backend Services & Persistence" fill:#fff7e6,stroke:#333
  style Observability fill:#f0fff0,stroke:#333
  style "Deployment (CI/CD)" fill:#fdf,stroke:#333
```

> Observação: cole esse bloco `mermaid` em sua documentação para renderizar o diagrama. Se quiser, eu também gero um PNG a partir deste diagrama.

---

## 4. Fluxo de Autenticação (resumido)

1. Usuário faz `POST /auth/login` com email+senha.
2. Backend valida credenciais (argon2) e retorna:

   * **Access Token (JWT)** com expiração curta (5–15 min) — enviado no corpo da resposta ou no header.
   * **Refresh Token** armazenado em cookie `HttpOnly` com prazo maior (ex.: 14 dias).
3. Em cada requisição autenticada, frontend envia JWT no `Authorization: Bearer` (ou apenas depende do cookie e o Worker lê cookie).
4. Ao expirar o JWT, frontend chama `POST /auth/refresh` que troca refresh token por novo access token (e possivelmente novo refresh token).
5. Logout chama `POST /auth/logout` que revoga o refresh token no DB/KV.

---

## 5. Modelagem mínima (exemplos)

**users** (D1)

* id (UUID)
* email (unique)
* password_hash
* created_at
* last_login

**todos** (D1)

* id (UUID)
* user_id (FK)
* title
* description
* completed (boolean)
* due_date
* created_at
* updated_at

**refresh_tokens** (D1/kv)

* token_hash
* user_id
* issued_at
* expires_at
* revoked (boolean)

---

## 6. Endpoints (API) — resumo

* `POST /auth/register` — cria usuário
* `POST /auth/login` — autentica e emite tokens
* `POST /auth/refresh` — renova access token
* `POST /auth/logout` — revoga refresh
* `GET /users/me` — perfil
* `GET /todos` — lista paginada
* `GET /todos/:id` — detalhe
* `POST /todos` — cria
* `PUT /todos/:id` — atualiza
* `DELETE /todos/:id` — remove

Inclua validação de payload (Zod / TypeBox) e retorno padronizado (HTTP status + body `{ ok: boolean, data?, error? }`).

---

## 7. Segurança & Boas Práticas

* Use `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy` via headers no Worker.
* Cookies de refresh com `HttpOnly`, `Secure`, `SameSite=Strict`.
* Rate limiting por IP/user via Durable Objects.
* Não coloque segredos no repositório; usar Secrets do CI e Wrangler Secrets.
* Proteja endpoints sensíveis com captcha após N tentativas falhas.

---

## 8. Observability & Runbook

* Erros críticos: enviar alertas via Sentry / Ops channel (Slack).
* Métricas chave: latência 95th percentile, error rate, login failure rate, DB errors.
* Runbook curto: rollback worker (wrangler), restaurar DB a partir de backup R2, invalidar cache CDN.

---

## 9. CI/CD e Deploy

* Pipeline:

  * PR: run tests (Vitest), lint, typecheck.
  * Merge main: build frontend, run production tests, upload frontend build para CDN (Cloudflare Pages ou S3+Cloudflare), `wrangler publish` backend.
* Use tags semânticas e releases automatizadas.

---

## 10. Checklist de Produção (pronto para assinar)

* [ ] D1 provisionado com migration scripts
* [ ] Refresh token flow implementado e testado
* [ ] Rate limiter em Durable Object
* [ ] Logs estruturados enviados a Logflare
* [ ] CI rodando testes e deploy automático em merge
* [ ] Secrets no CI e wrangler secrets configurados
* [ ] Backup automático do D1 para R2
* [ ] Política de CORS limitada ao domínio do frontend

---

## 11. Próximos passos sugeridos (prioridade)

1. Implementar modelo de Refresh Token e endpoints de refresh/revocation.
2. Provisionar D1 e escrever migrations + seeds.
3. Implementar rate limiting com Durable Objects (teste de stress).
4. Instrumentar logs e métricas com Sentry/Logflare.
5. Executar revisão de segurança (pentest leve nos endpoints de auth).

---

## 12. Como posso ajudar agora

* Gerar diagramas PNG/SVG a partir do Mermaid.
* Produzir um `README.md` formal (deploy, variáveis, runbook).
* Criar scripts de migration para D1 e exemplos SQL.
* Escrever o código do middleware de refresh token (Worker/Hono + TypeScript).

---

*Documento gerado por ChatGPT — se quiser, posso dividir isso em arquivos separados (README, architecture.md, mermaid.md) ou exportar como PDF.*

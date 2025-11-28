# Projeto Full-Stack: Todo App (Serverless)

### **Resumo do Projeto**

Esta é uma aplicação full-stack de lista de tarefas (Todo App) que demonstra a integração entre um frontend moderno e uma API serverless.

*   **Backend (Serverless):** Uma API RESTful construída com **Hono** e implantada como um **Cloudflare Worker**. É responsável pelo registro de usuários, autenticação JWT e pelo gerenciamento completo das tarefas (CRUD).
*   **Frontend (SPA):** Uma Single-Page Application construída com **React** e **Vite**, utilizando Material UI para os componentes. A interface permite que os usuários se registrem, façam login e gerenciem suas tarefas de forma reativa.

---

### **Arquitetura do Backend (Cloudflare Worker)**

O backend foi desenvolvido para operar em um ambiente serverless, utilizando a plataforma da Cloudflare, o que garante escalabilidade, performance e baixo custo.

#### **Tecnologias e Ferramentas:**

| Tecnologia | Versão | Descrição |
| :--- | :--- | :--- |
| **Hono** | ^5.0.22 | Framework web ultrarrápido, ideal para ambientes de edge computing. |
| **Cloudflare Workers**| - | Plataforma serverless para execução de código na borda. |
| **TypeScript** | ^5.5.2 | Garante a tipagem e a robustez do código. |
| **Vitest** | ~3.2.0 | Framework de testes unitários e de integração. |
| **Wrangler** | ^4.51.0 | CLI para construir e gerenciar aplicações Cloudflare. |
| **bcryptjs** | ^3.0.3 | Biblioteca para hashing de senhas. |
| **jsonwebtoken** | ^9.0.2 | Para criação e verificação de JSON Web Tokens (JWT). |

#### **Estrutura de Arquivos do Backend:**

A estrutura foi organizada de forma modular para garantir a separação de responsabilidades.

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

---

### **Arquitetura do Frontend (React SPA)**

O frontend foi construído como uma interface reativa e moderna para consumir a API serverless.

#### **Tecnologias e Ferramentas:**

| Tecnologia | Versão | Descrição |
| :--- | :--- | :--- |
| **React** | ^19.2.0 | Biblioteca para construção de interfaces de usuário reativas. |
| **Vite** | ^7.2.4 | Ferramenta de build otimizada para desenvolvimento rápido. |
| **React Router DOM** | ^7.9.6 | Para gerenciamento de rotas e navegação na SPA. |
| **Material UI** | ^7.3.5 | Biblioteca de componentes de UI para design moderno. |
| **Axios** | ^1.13.2 | Cliente HTTP para realizar requisições à API. |
| **TypeScript** | ~5.9.3 | Adiciona segurança de tipo ao código do frontend. |

#### **Estrutura de Arquivos do Frontend:**

A estrutura segue as melhores práticas para organização de projetos React.

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

---

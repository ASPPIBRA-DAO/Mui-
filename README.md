# Projeto Full-Stack: Todo App (Serverless)

### **Resumo do Projeto**

Esta é uma aplicação full-stack de lista de tarefas (Todo App) que demonstra a integração entre um frontend moderno e uma API serverless.

*   **Backend (Serverless):** Uma API RESTful construída com **Hono** e implantada como um **Cloudflare Worker**. É responsável pelo registro de usuários, autenticação JWT e pelo gerenciamento completo das tarefas (CRUD).
*   **Frontend (SPA):** Uma Single-Page Application construída com **React** e **Vite**, utilizando Material UI para os componentes. A interface permite que os usuários se registrem, façam login e gerenciem suas tarefas de forma reativa.

---

### **Arquitetura do Backend (Cloudflare Worker)**

O backend foi desenvolvido para operar em um ambiente serverless, utilizando a plataforma da Cloudflare, o que garante escalabilidade, performance e baixo custo.

#### **Tecnologias e Ferramentas:**

| Tecnologia | Descrição |
| :--- | :--- |
| **Hono** | Um framework web para JavaScript/TypeScript, pequeno, simples e ultrarrápido, ideal para ambientes de edge computing como Cloudflare Workers. |
| **Cloudflare Workers**| Plataforma de computação serverless que executa o código na borda da rede da Cloudflare, mais perto do usuário final. |
| **TypeScript** | Garante a tipagem e a robustez do código. |
| **Vitest** | Framework de testes unitários e de integração, configurado para validar a lógica da API. |
| **Wrangler** | A CLI para construir e gerenciar aplicações na plataforma Cloudflare. |

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

| Tecnologia | Descrição |
| :--- | :--- |
| **React** | Biblioteca para construção de interfaces de usuário reativas. |
| **Vite** | Ferramenta de build otimizada que oferece um desenvolvimento rápido. |
| **React Router DOM** | Para gerenciamento de rotas e navegação na SPA. |
| **Material UI** | Biblioteca de componentes de UI para um design consistente e moderno. |
| **TypeScript** | Adiciona segurança de tipo ao código do frontend. |

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

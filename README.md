# Meu Projeto
### **Resumo do Projeto**

Foi desenvolvida uma aplicação full-stack de lista de tarefas (Todo App). A aplicação é composta por:

*   **Backend:** Uma API RESTful construída com **Node.js** e o framework **Fastify**. Ela é responsável pelo registro de usuários, autenticação via JWT (JSON Web Tokens) e pelo gerenciamento das tarefas (criar e listar).
*   **Frontend:** Uma SPA (Single-Page Application) construída com **React** e **Vite**. A interface permite que os usuários se registrem, façam login e, uma vez autenticados, visualizem e criem novas tarefas, que são consumidas a partir da API do backend.

---

### **Backend (Servidor)**

O backend foi estruturado de forma modular para separar as responsabilidades e facilitar a manutenção.

#### **Tecnologias e Ferramentas Utilizadas:**

| Tecnologia | Versão | Descrição |
| :--- | :--- | :--- |
| **Node.js** | ~20.x | Ambiente de execução para o JavaScript no servidor. |
| **Fastify** | ^4.27.0 | Framework web para Node.js, conhecido por sua alta performance e baixo overhead. |
| **TypeScript**| ^5.4.5 | Superset do JavaScript que adiciona tipagem estática ao código. |
| **tsx** | ^4.11.0 | Ferramenta para executar arquivos TypeScript diretamente, sem a necessidade de compilação prévia. |

#### **Estrutura de Arquivos Criada:**

*   `backend/src/server.ts`: Ponto de entrada da aplicação, onde o servidor Fastify é configurado e iniciado.
*   `backend/src/modules/users/`: Módulo contendo toda a lógica relacionada a usuários (rotas, controllers, repositórios).
*   `backend/src/modules/todos/`: Módulo contendo a lógica de negócio para as tarefas.
*   `backend/src/auth/`: Contém o hook de autenticação para verificar o token JWT.
*   `backend/src/declarations.d.ts`: Arquivo de definição de tipos para estender a interface do Fastify.
```
backend/
├── package.json
├── src
│   ├── config
│   │   └── index.ts
│   ├── db
│   ├── declarations.d.ts
│   ├── index.ts
│   ├── middlewares
│   │   ├── cors.ts
│   │   └── guard.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── todos
│   │   │   ├── todo.controller.ts
│   │   │   ├── todo.model.ts
│   │   │   ├── todo.routes.ts
│   │   │   ├── todo.schema.ts
│   │   │   └── todo.service.ts
│   │   └── users
│   │       ├── user.controller.ts
│   │       ├── user.model.ts
│   │       ├── user.routes.ts
│   │       ├── user.schema.ts
│   │       └── user.service.ts
│   ├── server.ts
│   └── utils
│       ├── crypto.ts
│       ├── jwt.ts
│       └── response.ts
├── test
│   ├── env.d.ts
│   ├── index.spec.ts
│   └── tsconfig.json
├── tsconfig.json
├── vitest.config.mts
├── worker-configuration.d.ts
└── wrangler.jsonc
```

---

### **Frontend (Cliente)**

O frontend foi desenvolvido para ser uma interface reativa e moderna para interagir com o usuário e a API.

#### **Tecnologias e Ferramentas Utilizadas:**

| Tecnologia | Versão | Descrição |
| :--- | :--- | :--- |
| **React** | ^19.2.0 | Biblioteca JavaScript para a construção de interfaces de usuário. |
| **Vite** | - | Ferramenta de build moderna e rápida para desenvolvimento frontend. |
| **TypeScript**| - | Utilizado para adicionar tipagem ao código React. |
| **React Router DOM** | ^7.9.6 | Biblioteca para gerenciamento de rotas na aplicação React. |
| **Material UI** | ^7.3.5 | Biblioteca de componentes de interface de usuário para React. |
| **Emotion** | ^11.14.0 | Biblioteca para estilização de componentes React. |

#### **Estrutura de Arquivos Criada:**

*   `frontend/index.html`: Ponto de entrada da aplicação web.
*   `frontend/src/main.tsx`: Arquivo principal que renderiza a aplicação React na DOM.
*   `frontend/src/App.tsx`: Componente principal que define as rotas da aplicação.
*   `frontend/src/pages/`: Diretório contendo os componentes de página (Login, Register, Todos).
*   `frontend/src/components/`: Diretório contendo os componentes reutilizáveis (LoginForm, RegisterForm, Todos).
*   `frontend/vite.config.ts`: Arquivo de configuração do Vite, incluindo a configuração do proxy para a API do backend.

---

### **Estrutura de Diretórios**

```
frontend/
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── AuthProvider.tsx
│   │   ├── CreateTodo.tsx
│   │   ├── Header.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── TodoList.tsx
│   │   └── Todos.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Todos.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

---
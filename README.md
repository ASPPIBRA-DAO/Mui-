# Meu Projeto
### **Resumo do Projeto**

Foi desenvolvida uma aplicação full-stack de lista de tarefas (Todo App). A aplicação é composta por:

*   **Backend:** Uma API RESTful construída com **Node.js** e o framework **Fastify**. Ela é responsável pelo registro de usuários, autenticação via JWT (JSON Web Tokens) e pelo gerenciamento das tarefas (criar e listar). Os dados são persistidos em um banco de dados **SQLite** através do ORM **Prisma**.
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
| **Prisma** | ^5.14.0 | ORM (Object-Relational Mapping) para Node.js e TypeScript, utilizado para interagir com o banco de dados. |
| **SQLite** | - | Motor de banco de dados SQL embutido, utilizado para armazenar os dados da aplicação. |
| **bcryptjs** | ^2.4.3 | Biblioteca para fazer o hash de senhas antes de armazená-las. |
| **jsonwebtoken** | ^9.0.2 | Biblioteca para criar e verificar JSON Web Tokens (JWT) para autenticação. |
| **tsx** | ^4.11.0 | Ferramenta para executar arquivos TypeScript diretamente, sem a necessidade de compilação prévia. |

#### **Dependências Instaladas:**

*   **Produção (`dependencies`):**
    *   `@fastify/jwt`: `^8.0.1`
    *   `@prisma/client`: `^5.14.0`
    *   `bcryptjs`: `^2.4.3`
    *   `fastify`: `^4.27.0`
    *   `jsonwebtoken`: `^9.0.2`
*   **Desenvolvimento (`devDependencies`):**
    *   `@types/bcryptjs`: `^2.4.3`
    *   `@types/jsonwebtoken`: `^9.0.5`
    *   `@types/node`: `^20.12.12`
    *   `prisma`: `^5.14.0`
    *   `tsx`: `^4.11.0`
    *   `typescript`: `^5.4.5`

#### **Estrutura de Arquivos Criada:**

*   `backend/prisma/schema.prisma`: Arquivo de definição do esquema do banco de dados para o Prisma.
*   `backend/src/server.ts`: Ponto de entrada da aplicação, onde o servidor Fastify é configurado e iniciado.
*   `backend/src/modules/users/`: Módulo contendo toda a lógica relacionada a usuários (rotas, controllers, repositórios).
*   `backend/src/modules/todos/`: Módulo contendo a lógica de negócio para as tarefas.
*   `backend/src/auth/`: Contém o hook de autenticação para verificar o token JWT.
*   `backend/src/declarations.d.ts`: Arquivo de definição de tipos para estender a interface do Fastify.

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

#### **Dependências Instaladas:**

*   **Produção (`dependencies`):**
    *   `react`: `^19.2.0`
    *   `react-dom`: `^19.2.0`
    *   `react-router-dom`: `^7.9.6`
    *   `@mui/material`: `^7.3.5`
    *   `@mui/icons-material`: `^7.3.5`
    *   `@emotion/react`: `^11.14.0`
    *   `@emotion/styled`: `^11.14.1`

*   **Desenvolvimento (`devDependencies`):**
    *   `@types/react`: `^19.2.7`
    *   `@types/react-dom`: `^19.2.3`
    *   `@vitejs/plugin-react`: `^5.1.1`

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
.
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── auth
│   │   │   └── auth.ts
│   │   ├── modules
│   │   │   ├── users
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.repository.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── user.schemas.ts
│   │   │   └── todos
│   │   │       ├── todo.controller.ts
│   │   │       ├── todo.repository.ts
│   │   │       ├── todo.routes.ts
│   │   │       └── todo.schemas.ts
│   │   └── server.ts
│   └── package.json
└── frontend
    ├── src
    │   ├── components
    │   │   ├── LoginForm.tsx
    │   │   ├── RegisterForm.tsx
    │   │   └── Todos.tsx
    │   ├── pages
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Todos.tsx
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

---
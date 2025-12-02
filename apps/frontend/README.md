# Frontend - ASPPIBRA-DAO

Este diretório contém o código-fonte da aplicação frontend para o projeto ASPPIBRA-DAO, construído com React, TypeScript e Material-UI (MUI).

## Funcionalidades Implementadas

### 1. Internacionalização (i18n)

A aplicação suporta múltiplos idiomas para atender a uma base de usuários global. A implementação foi feita utilizando a biblioteca `i18next` em conjunto com `react-i18next`.

- **Seleção de Idioma:** Um componente de seletor de idioma (`I18nSelector.tsx`) está localizado no cabeçalho, permitindo que os usuários alternem entre os idiomas disponíveis (por exemplo, Inglês, Português, Espanhol).
- **Estrutura de Arquivos:** As traduções são organizadas em arquivos JSON dentro de `public/locales/{idioma}/translation.json`.
- **Componente Reutilizável:** O seletor de idiomas é um menu suspenso que exibe o ícone do idioma atual e permite a seleção de outros, atualizando dinamicamente todo o conteúdo da interface.

### 2. Cabeçalho Responsivo

O cabeçalho da aplicação foi projetado para ser totalmente responsivo, oferecendo uma experiência de usuário otimizada tanto para desktops quanto para dispositivos móveis.

- **Desktop:** Apresenta um menu de navegação centralizado, com o logo à esquerda e botões de ação (como "Entrar") e o seletor de idiomas à direita.
- **Mobile:** O menu de navegação é colapsado em um ícone de "hambúrguer". Ao ser clicado, um menu lateral (`Drawer`) desliza da direita, contendo os links de navegação e o botão de ação principal, garantindo uma interface limpa e acessível em telas menores.

## Como Iniciar

1.  **Navegue até a raiz do monorepo.**
2.  Instale as dependências:
    ```bash
    pnpm install
    ```
3.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    pnpm --filter frontend dev
    ```

## Build

Para criar uma versão de produção da aplicação, execute o seguinte comando a partir da raiz do monorepo:

```bash
  pnpm --filter frontend build
```

Os arquivos otimizados serão gerados no diretório `apps/frontend/dist`.
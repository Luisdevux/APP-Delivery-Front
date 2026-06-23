<h1 align="center">App Delivery - Painel do Restaurante (Frontend)</h1>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="React Query" src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

Este é o frontend web do sistema de Delivery, construído com foco na gestão de restaurantes. Através deste painel administrativo, os restaurantes podem gerenciar seus pedidos em tempo real, acompanhar métricas, editar seus produtos e informações do perfil.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com as tecnologias mais modernas do ecossistema React, garantindo alta performance, tipagem estática e uma ótima experiência de desenvolvimento.

* **[Next.js](https://nextjs.org/) (v16)** - Framework React com renderização híbrida (SSR/SSG).
* **[React](https://react.dev/) (v19)** - Biblioteca para interfaces de usuário.
* **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript adicionando tipagem estática.
* **[Tailwind CSS](https://tailwindcss.com/) (v4)** - Framework CSS utilitário para estilização rápida e responsiva.
* **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos sem estilo focados em acessibilidade (usado como base visual, muitas vezes com shadcn/ui).
* **[React Query (TanStack Query)](https://tanstack.com/query/latest)** - Gerenciamento robusto de estado assíncrono, cache e requisições para a API.
* **[Socket.io-client](https://socket.io/)** - Integração com WebSockets para recebimento de novos pedidos e atualizações de status **em tempo real**.
* **[NextAuth.js](https://next-auth.js.org/)** - Solução completa e segura de autenticação (incluindo login com Google).
* **[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)** - Criação de formulários performáticos e validação de dados fortemente tipada.
* **[Recharts](https://recharts.org/)** - Construção de gráficos e dashboards interativos.
* **[Axios](https://axios-http.com/)** - Cliente HTTP para chamadas à API backend.
* **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de notificações (Toasts) elegante e customizável.

## ⚙️ Pré-requisitos

Para rodar este projeto localmente, certifique-se de ter instalado:
* **Node.js** (versão 18 ou superior recomendada)
* Gerenciador de pacotes da sua preferência (`npm`, `yarn` ou `pnpm`)

## 🛠️ Como rodar o projeto localmente

1. **Clone ou acesse o repositório frontend:**
   Navegue até a pasta raiz deste projeto via terminal.
   ```bash
   cd APP-Delivery-Front
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto contendo as seguintes chaves:
   
   ```env
   # ==========================================
   # API & BACKEND
   # ==========================================
   # URL pública da API usada no Client-Side (Navegador)
   NEXT_PUBLIC_API_URL=http://localhost:5020
   
   # URL da API usada em Server-Side Rendering (SSR) pelo Node.js
   API_URL_SERVER_SIDED=http://localhoost:5020

   # ==========================================
   # NEXT-AUTH & SEGURANÇA
   # ==========================================
   # URL do frontend usada pelo NextAuth para gerenciar os callbacks
   NEXTAUTH_URL=http://localhost:3000
   
   # Chave secreta de no mínimo 32 caracteres usada para encriptar os JWTs locais do NextAuth
   NEXTAUTH_SECRET=sua_secret_aleatoria_aqui_pelo_menos_32_chars_h234j23h4k

   # ==========================================
   # GOOGLE OAUTH
   # ==========================================
   # Credenciais do Google Cloud Console para o Login Social
   GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu_client_secret
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000) e pronto! O painel estará disponível.

## 📦 Scripts Disponíveis

* `npm run dev` - Inicia a aplicação em modo de desenvolvimento com hot-reload (Porta 3000).
* `npm run build` - Gera a build otimizada de produção (Standalone mode habilitado).
* `npm run start` - Roda o servidor otimizado gerado pela build.
* `npm run lint` - Roda o analisador estático de código (ESLint) para garantir a padronização.

## 📡 Comunicação em Tempo Real

Este projeto se destaca por usar **WebSockets (`socket.io-client`)** integrados harmoniosamente ao ecossistema do **React Query**.
Quando o restaurante está conectado, ele escuta canais restritos ao seu `restaurante_id`. Ao receber a notificação de um novo pedido ou alteração de status, os hooks disparam uma invalidação de cache (`invalidateQueries`), o que faz a interface buscar os dados frescos na hora, garantindo assim precisão 100% real-time para a operação da cozinha e expedição.

## 🐳 Docker

A aplicação já está configurada com Docker.

* **Modo Desenvolvimento:**
  ```bash
  docker compose -f docker-compose-dev.yml up -d
  ```

* **Modo Produção:**
  ```bash
  docker compose up -d --build
  ```

---
*Projeto desenvolvido como parte do ecossistema App Delivery (Módulo Fábrica de Software IV).*

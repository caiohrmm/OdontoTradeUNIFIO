# OdontoTrade — Frontend

Frontend da plataforma **OdontoTrade** (UNIFIO — Centro Universitário de Ourinhos). Next.js (App Router), TypeScript, Tailwind CSS e shadcn/ui.

## Stack

| Item           | Tecnologia              |
|----------------|-------------------------|
| Framework      | Next.js 14 (App Router) |
| Linguagem      | TypeScript              |
| Estilos        | Tailwind CSS            |
| UI             | shadcn/ui (componentes)  |
| Data fetching  | TanStack Query          |
| Formulários    | React Hook Form + Zod   |

## Pré-requisitos

- **Node.js** 18+
- **npm** (ou yarn/pnpm)

## Configuração

1. Clone o repositório e entre na pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. (Opcional) Copie o exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   Edite `.env.local` se a API estiver em outro endereço. O default é `http://localhost:8080/api/v1`.

## Rodar em desenvolvimento

Com o **backend** rodando (por exemplo em `http://localhost:8080`):

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
src/
├── app/              # App Router: layout, páginas, providers
├── components/       # Componentes reutilizáveis (layout, ui)
├── hooks/            # Hooks (useListings, useCategories)
├── lib/              # Utilitários e cliente HTTP (api-client)
├── services/api/     # Serviços de API (auth, listings, categories)
└── types/            # Tipos TypeScript (api.ts)
```

## Páginas principais

- **/** — Início (landing)
- **/anuncios** — Listagem de anúncios (conectada à API)
- **/anuncios/[id]** — Detalhe do anúncio
- **/categorias** — Listagem de categorias
- **/login** — Login (e-mail institucional @unifio.edu.br)
- **/registro** — Cadastro (e-mail institucional obrigatório)

## API (backend)

O frontend consome a API configurada em **NEXT_PUBLIC_API_BASE_URL** (default: `http://localhost:8080/api/v1`). O cliente HTTP está em `src/lib/api-client.ts`; os serviços em `src/services/api/` usam esse cliente. Os hooks em `src/hooks/` usam TanStack Query para cache e estado.

## Build

```bash
npm run build
npm run start
```

## Convenções

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`)
- **Branch principal:** `main`

Projeto acadêmico — UNIFIO Centro Universitário de Ourinhos.

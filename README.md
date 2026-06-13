# Pastel da Copa

Aplicação migrada para Next.js com App Router e API Routes, pronta para deploy gratuito na Vercel.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Se preferir npm:

```bash
npm install
npm run dev
```

## Deploy gratuito na Vercel

1. Suba este projeto para um repositório Git.
2. Importe o repositório em https://vercel.com/new.
3. Mantenha o framework como `Next.js`.
4. Use os comandos padrão:
   - Build Command: `pnpm build`
   - Output Directory: `.next`

## API

- `GET /api/store`: lista pedidos e acompanhamentos.
- `GET /api/orders`: lista pedidos.
- `POST /api/orders`: cria pedido com `{ "name": "...", "sides": ["..."] }`.
- `PATCH /api/orders/:id`: atualiza status com `{ "status": "Preparando" }`.
- `DELETE /api/orders/:id`: apaga um pedido.
- `GET /api/scoreboard`: mostra o placar atual.
- `PUT /api/scoreboard`: atualiza o placar do jogo.
- `GET /api/sides`: lista acompanhamentos.
- `POST /api/sides`: cria acompanhamento com `{ "name": "..." }`.
- `PATCH /api/sides/:id`: alterna disponível/esgotado.

## Link reservado do admin

O painel da cozinha fica em `/cozinha-da-copa-2026`.

## Banco de dados

Configure `DATABASE_URL` no `.env.local` e nas variáveis de ambiente da Vercel. O projeto cria automaticamente as tabelas `copa_orders`, `copa_sides` e `copa_scoreboard` no Neon/Postgres na primeira chamada da API.

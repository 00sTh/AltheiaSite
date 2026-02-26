# Altheia — E-commerce de Cosméticos

> Plataforma de e-commerce construída com Next.js 16, Clerk, Stripe e Prisma.

## Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **TypeScript** — strict mode
- **Tailwind CSS v4** + **shadcn/ui** + **Radix UI** + **lucide-react**
- **Prisma** + **PostgreSQL** (Neon)
- **Clerk** — autenticação completa
- **Stripe** — checkout + webhook
- **Zod** — validação de dados

---

## Pré-requisitos

- Node.js 20+ (recomendado via [nvm](https://github.com/nvm-sh/nvm))
- Conta no [Neon](https://neon.tech) (PostgreSQL serverless gratuito)
- Conta no [Clerk](https://clerk.com) (plano gratuito)
- Conta no [Stripe](https://stripe.com) (modo test)

---

## Instalação passo a passo

### 1. Clone e instale dependências

```bash
git clone git@github.com:00sTh/AltheiaSite.git
cd AltheiaSite
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais (veja seção abaixo).

### 3. Configure o banco de dados

```bash
# Gera o Prisma Client
npm run db:generate

# Aplica o schema no banco (dev)
npm run db:push

# Popula com dados de exemplo
npm run db:seed
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Variáveis de Ambiente

| Variável | Onde obter | Obrigatória |
|---|---|---|
| `DATABASE_URL` | Neon > Connection string (pooled) | ✅ |
| `DIRECT_URL` | Neon > Connection string (direto) | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard > API Keys | ✅ |
| `CLERK_SECRET_KEY` | Clerk Dashboard > API Keys | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe > Developers > API Keys | ✅ |
| `STRIPE_SECRET_KEY` | Stripe > Developers > API Keys | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe > Developers > Webhooks | ✅ em prod |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | ✅ em prod |

### Configuração Clerk

No [painel do Clerk](https://dashboard.clerk.com):

1. Crie uma nova aplicação
2. Em **User & Authentication > Email, Phone, Username**, habilite email
3. Em **Paths**, configure:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

### Configuração Stripe (webhook local)

```bash
# Instale o Stripe CLI
# https://stripe.com/docs/stripe-cli

stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copie o `whsec_...` exibido para `STRIPE_WEBHOOK_SECRET` no `.env.local`.

---

## Scripts disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Inicia o servidor de produção
npm run type-check   # Verifica tipos TypeScript
npm run db:push      # Aplica schema no banco (sem migration)
npm run db:migrate   # Cria e aplica migration
npm run db:seed      # Popula banco com dados de exemplo
npm run db:studio    # Abre Prisma Studio (interface visual do banco)
npm run db:reset     # Reseta o banco e reaplica migrations
```

---

## Estrutura do projeto

```
AltheiaSite/
├── prisma/
│   ├── schema.prisma          # Modelos do banco
│   └── seed.ts                # Dados iniciais (3 categorias + 10 produtos)
├── src/
│   ├── actions/               # Server Actions (cart, products)
│   ├── app/
│   │   ├── (auth)/            # Páginas Clerk (sign-in, sign-up)
│   │   ├── (store)/           # Loja pública (home, products, cart, checkout)
│   │   ├── account/           # Área do cliente
│   │   ├── admin/             # Dashboard administrativo
│   │   └── api/webhooks/      # Webhook Stripe
│   ├── components/
│   │   ├── ui/                # shadcn/ui (button, card, badge, input)
│   │   ├── layout/            # Navbar, Footer, ThemeToggle
│   │   ├── products/          # ProductCard, ProductFilters
│   │   ├── cart/              # AddToCartButton, CartItemCard
│   │   └── checkout/          # CheckoutForm
│   ├── lib/                   # prisma.ts, stripe.ts, utils.ts, constants.ts
│   ├── schemas/               # Schemas Zod
│   └── types/                 # Tipos TypeScript compostos
└── middleware.ts               # Proteção de rotas com Clerk
```

---

## Acesso Admin

Para tornar um usuário administrador:

1. No [painel do Clerk](https://dashboard.clerk.com), vá em **Users**
2. Clique no usuário desejado
3. Em **Metadata > Public metadata**, adicione:
   ```json
   { "role": "admin" }
   ```
4. O usuário agora pode acessar `/admin`

---

## Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Configure todas as variáveis de ambiente (`.env.example` como referência)
4. Em **Settings > Functions**, configure a região mais próxima do banco Neon
5. Configure o webhook Stripe com a URL de produção:
   ```
   https://seu-dominio.vercel.app/api/webhooks/stripe
   ```

---

## Próximos passos

- [ ] **Admin - Produtos**: CRUD completo com upload de imagens (Vercel Blob)
- [ ] **Admin - Pedidos**: Atualizar status, exportar CSV
- [ ] **Checkout**: Integrar `@stripe/react-stripe-js` com `PaymentElement`
- [ ] **Webhook**: Decrementar estoque + enviar e-mail de confirmação
- [ ] **Busca**: Pesquisa full-text com `pg_trgm` ou Algolia
- [ ] **Reviews**: Sistema de avaliações de produtos
- [ ] **Wishlist**: Lista de desejos por usuário
- [ ] **Analytics**: Dashboard com métricas de vendas

---

## Licença

Privado — todos os direitos reservados à Altheia.

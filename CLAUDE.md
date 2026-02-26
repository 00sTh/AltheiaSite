# CLAUDE.md — AltheiaSite

## Visão Geral
E-commerce de cosméticos para a empresa Altheia.
Gerado em 2026-02-26 como boilerplate de produção.

## Stack
| Tecnologia | Versão | Propósito |
|---|---|---|
| Next.js | ^16 | Framework (App Router + Server Components) |
| TypeScript | strict | Linguagem |
| Tailwind CSS | v4 | Estilo |
| shadcn/ui + Radix | latest | Componentes |
| Prisma | ^6 | ORM |
| PostgreSQL (Neon) | — | Banco de dados |
| Clerk | ^6 | Autenticação completa |
| Stripe | ^17 | Pagamentos |
| Zod | ^3 | Validação |

## Node
Via nvm — sempre rodar `source /home/sth/.nvm/nvm.sh` antes de npm/npx.

## Banco de Dados (PostgreSQL)
- `DATABASE_URL` — URL pooled (Neon pgbouncer) para queries normais
- `DIRECT_URL` — URL direta para migrations do Prisma
- Suporta enums nativos, Decimal, String[], Json (diferente do projeto relógios que usava SQLite)

### Modelos principais
- `UserProfile` — extensão do Clerk (clerkId único)
- `Category` — suporte a hierarquia via parentId
- `Product` — UUID, slug, price Decimal, images String[], featured, active
- `Cart` + `CartItem` — um por clerkId, persistido no banco
- `Order` + `OrderItem` — enum OrderStatus (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED)
- `OrderItem.price` — snapshot do preço no momento da compra

## Auth (Clerk)
- `middleware.ts` — usa `clerkMiddleware` + `createRouteMatcher`
- Rotas públicas: `/`, `/sign-in`, `/sign-up`, `/products/**`, `/api/webhooks/**`
- Rotas admin (`/admin/**`): exige `sessionClaims.metadata.role === "admin"`
- Rotas protegidas (`/account`, `/cart`, `/checkout`): exige userId
- **Não usar** `return false` — usar `redirectToSignIn()`

## Carrinho (Server Actions)
- `src/actions/cart.ts` — `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `getCart`
- Persistência 100% no banco (tabelas `Cart` / `CartItem`)
- Validação com Zod antes de qualquer operação no banco
- Verifica estoque antes de adicionar
- `revalidatePath("/cart")` + `revalidatePath("/", "layout")` após mutações

## Estrutura de diretórios
```
src/
  app/
    (auth)/sign-in/[[...sign-in]]/   — Clerk SignIn
    (auth)/sign-up/[[...sign-up]]/   — Clerk SignUp
    (store)/                         — Layout com Navbar + Footer
      page.tsx                       — Home (featured products + categorias)
      products/page.tsx              — Listagem com filtros
      products/[slug]/page.tsx       — Detalhe + AddToCart
      cart/page.tsx                  — Carrinho
      checkout/page.tsx              — Checkout
    account/page.tsx                 — Conta + últimos pedidos
    admin/page.tsx                   — Dashboard admin
    api/webhooks/stripe/route.ts     — Webhook Stripe
  actions/
    cart.ts                          — Server Actions do carrinho
    products.ts                      — Queries de produtos/categorias
  components/
    ui/                              — shadcn/ui (button, card, badge, input)
    layout/                          — Navbar, Footer, ThemeToggle
    products/                        — ProductCard, ProductFilters
    cart/                            — AddToCartButton, CartItemCard
    checkout/                        — CheckoutForm (placeholder Stripe)
  lib/
    prisma.ts                        — Singleton Prisma
    stripe.ts                        — Singleton Stripe + helpers
    utils.ts                         — cn(), formatPrice(), truncate()
    constants.ts                     — APP_NAME, ORDER_STATUS_LABEL, etc.
  schemas/
    cart.schema.ts                   — Zod schemas do carrinho
    checkout.schema.ts               — Zod schema do checkout
  types/
    index.ts                         — Tipos compostos (ProductWithCategory, etc.)
prisma/
  schema.prisma                      — Modelos completos
  seed.ts                            — 3 categorias + 10 produtos de exemplo
```

## Convenções
- Server Components por padrão; `"use client"` somente quando necessário
- Preços: **sempre calculados no servidor** (nunca vindos do client)
- `formatPrice()` em `src/lib/utils.ts` — usar em vez de Intl direto
- CSS variables via `@theme inline` no globals.css (padrão Tailwind v4)
- Cor primária Altheia: `hsl(340, 82%, 52%)` — rosa/coral

## Comandos úteis
```bash
# Verificar tipos
source /home/sth/.nvm/nvm.sh && cd /home/sth/AltheiaSite && npx tsc --noEmit

# Dev
source /home/sth/.nvm/nvm.sh && npm run dev

# Migrations
source /home/sth/.nvm/nvm.sh && npm run db:migrate

# Seed
source /home/sth/.nvm/nvm.sh && npm run db:seed

# Webhook Stripe local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Próximos passos sugeridos
- [ ] Admin: CRUD de produtos (upload de imagens com Vercel Blob)
- [ ] Admin: gestão de pedidos (atualizar status)
- [ ] Checkout: integrar `@stripe/react-stripe-js` com `PaymentElement`
- [ ] Webhook: decrementar estoque após pagamento confirmado
- [ ] Webhook: enviar e-mail de confirmação
- [ ] Busca: implementar pesquisa full-text
- [ ] Reviews: sistema de avaliações de produtos

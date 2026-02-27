# CLAUDE.md — AltheiaSite v0.7.0

> **REGRA:** Sempre atualizar este arquivo após qualquer mudança significativa de arquitetura, features ou convenções.

## Visão Geral
E-commerce de cosméticos para a empresa Althéia. Plataforma de luxo com tema Emerald + Gold.
Versão atual: **0.7.0** (main — pronto para deploy produção).

## Stack
| Tecnologia | Versão | Propósito |
|---|---|---|
| Next.js | ^16 | Framework (App Router + Server Components) |
| TypeScript | strict | Linguagem |
| Tailwind CSS | v4 | Estilo (`@theme inline` no globals.css) |
| shadcn/ui + Radix | latest | Componentes base |
| Prisma | ^6 | ORM |
| PostgreSQL (Neon) | — | Banco prod / SQLite dev |
| Clerk | ^6 | Autenticação produção |
| Cielo | — | Gateway de pagamento (cartão + PIX) |
| framer-motion | ^12 | Animações |
| Zod | ^3 | Validação |
| nodemailer | ^8 | E-mail |

> **Stripe foi removido** — gateway é Cielo. Stripe package pode estar instalado mas não é usado.

## Node
Via nvm — sempre rodar `source /home/sth/.nvm/nvm.sh` antes de npm/npx.

## Tema Visual (Emerald + Gold)
- **Fundo:** `#0A3D2F` (emerald-deep)
- **Accent:** `#C9A227` (gold)
- **Texto:** `#F5F0E6` (cream)
- **Tipografia:** Playfair Display (headings serif) + Geist Sans (body)
- **Animações:** framer-motion variants em `src/lib/animations.ts`
- CSS utilities: `.gold-glow`, `.text-gradient-gold`, `.label-luxury`, `.border-gold-subtle`
- `@keyframes float`, `shimmer`, `fadeInUp`

## Banco de Dados

### Dev (SQLite)
- `prisma/schema.prisma` — `provider = "sqlite"`
- `DATABASE_URL=file:./prisma/demo.db`
- Enums como String, sem `@db.Decimal`

### Produção (PostgreSQL — Neon)
- `prisma/schema.production.prisma` — enums nativos, `Decimal`, `String[]`, `Json`
- `DATABASE_URL` — URL pooled (pgbouncer)
- `DIRECT_URL` — URL direta para migrations
- `npm run build:prod` copia schema.production.prisma → schema.prisma antes do build

### Modelos principais
- `SiteUser` — auth próprio DEMO_MODE (username, email, passwordHash, role, emailVerified)
- `UserProfile` — extensão Clerk (clerkId único)
- `Category` — hierárquica via parentId (name, slug, imageUrl)
- `Product` — UUID, slug, price Decimal, images String[], featured, active, stock, ingredients, usage
- `Cart` + `CartItem` — um por clerkId, persistido no banco; unique (cartId, productId)
- `Order` + `OrderItem` — enum OrderStatus (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED), enum PaymentMethod (WHATSAPP/CREDIT_CARD/PIX)
- `OrderItem.price` — snapshot do preço no momento da compra
- `SiteSettings` — singleton id="default", ~50 campos (hero, lumina, about, social, SEO, logo, newsletter, benefícios)
- `MediaAsset` — banco de mídia (name, url, type IMAGE|VIDEO, size)
- `Wishlist` + `WishlistItem` — por clerkId, unique (wishlistId, productId)
- `NewsletterSubscriber` — email único, confirmedAt

## Auth (Dual Mode)

### Produção (`DEMO_MODE=false`)
- `middleware.ts` — `clerkMiddleware` + `createRouteMatcher`
- Rotas públicas: `/`, `/sign-in`, `/sign-up`, `/products/**`, `/api/webhooks/**`, `/loja/**`
- Rotas admin (`/admin/**`): exige `sessionClaims.metadata.role === "admin"`
- Rotas protegidas (`/account`, `/cart`, `/checkout`): exige userId
- **Não usar** `return false` — usar `redirectToSignIn()`

### Demo (`DEMO_MODE=true`)
- `SiteUser` + session cookies (DemoAuthProvider em `src/context/auth.tsx`)
- `src/lib/auth.ts` — `getServerAuth()` abstrai os dois modos
- Login via `/admin/login`

## Carrinho (Server Actions)
- `src/actions/cart.ts` — `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `getCart`
- Persistência 100% no banco (tabelas `Cart` / `CartItem`)
- Valida estoque antes de adicionar
- Zod antes de qualquer operação no banco
- `revalidatePath("/cart")` + `revalidatePath("/", "layout")` após mutações
- `src/hooks/use-guest-cart.ts` — sync carrinho guest → DB no login

## Pagamentos (Cielo)
- Gateway: **Cielo** (cartão de crédito + PIX)
- `src/lib/cielo.ts` — integração Cielo
- Webhook: `/api/webhooks/cielo/route.ts`
- PIX polling: `/checkout/pix` + `src/components/checkout/pix-polling.tsx`
- WhatsApp: flow manual `/checkout` → redirect WhatsApp
- `/api/check-payment` — verifica status do pagamento

## Estrutura de diretórios
```
src/
  app/
    (auth)/sign-in/[[...sign-in]]/   — Clerk SignIn
    (auth)/sign-up/[[...sign-up]]/   — Clerk SignUp
    (store)/                         — Layout Navbar + Footer
      page.tsx                       — Home
      products/page.tsx              — Listagem com filtros
      products/[slug]/page.tsx       — Detalhe + AddToCart
      cart/page.tsx                  — Carrinho
      checkout/page.tsx              — Checkout (Cielo/PIX/WhatsApp)
      checkout/pix/page.tsx          — PIX polling
      checkout/sucesso/page.tsx      — Confirmação
      sobre-nos/page.tsx
      videos/page.tsx
      wishlist/page.tsx
      loja/page.tsx
      politica-de-privacidade/page.tsx
      termos-de-uso/page.tsx
    account/page.tsx                 — Conta + pedidos
    admin/                           — Painel admin (role=admin)
      page.tsx                       — Dashboard métricas
      login/page.tsx                 — Login DEMO_MODE
      products/                      — CRUD produtos
      categories/                    — CRUD categorias (hierárquico)
      media/page.tsx                 — Banco de mídia
      orders/                        — Listagem + detalhe + status
      users/                         — CRUD usuários
      settings/page.tsx              — SiteSettings
      newsletter/page.tsx            — Inscritos
    api/
      newsletter/route.ts
      webhooks/cielo/route.ts
      check-payment/route.ts
    layout.tsx                       — Root layout (fontes, metadata, providers)
    globals.css                      — Tema Emerald+Gold + @theme inline
    not-found.tsx                    — 404 luxury (gold + framer particles)
    sitemap.ts                       — SEO dinâmico
    robots.ts
  actions/
    cart.ts
    products.ts
    orders.ts
    admin.ts                         — Todos os mutations admin (products, categories, media, users, orders, settings, newsletter)
    wishlist.ts
    admin-auth.ts                    — Login DEMO_MODE
    users.ts
    site-users.ts                    — CRUD SiteUser
  components/
    ui/                              — shadcn/ui + gold-button (CVA) + section-title + product-image
    layout/                          — navbar.tsx (server) + navbar-client.tsx (client) + footer + mobile-nav + newsletter-form + logout-button
    home/                            — hero-section + best-sellers + category-cards + lumina-highlight + nossa-historia-teaser + why-altheia
    products/                        — product-card + product-filters + product-accordion + wishlist-button
    cart/                            — add-to-cart-button + cart-item
    checkout/                        — checkout-form + pix-polling
    about/                           — SobreNosContent (client)
    videos/                          — VideosContent (client)
    admin/                           — admin-login-form + forms CRUD
  lib/
    prisma.ts                        — Singleton Prisma
    auth.ts                          — getServerAuth() (Clerk ou DEMO_MODE)
    cielo.ts                         — Integração Cielo
    blob.ts                          — Upload local public/uploads/ (Vercel Blob comentado)
    animations.ts                    — framer-motion variants
    utils.ts                         — cn(), formatPrice(), truncate(), parseImages()
    constants.ts                     — APP_NAME, ORDER_STATUS_LABEL, etc.
    mailer.ts                        — nodemailer
    session.ts                       — DEMO_MODE session management
  schemas/
    cart.schema.ts
    checkout.schema.ts
  types/
    index.ts                         — ProductWithCategory, etc.
  context/
    auth.tsx                         — DemoAuthProvider + ClerkAuthBridge
  hooks/
    use-guest-cart.ts
prisma/
  schema.prisma                      — Dev (SQLite)
  schema.production.prisma           — Prod (PostgreSQL)
  seed.ts
middleware.ts                        — Auth + security headers
```

## SiteSettings (singleton id="default") — campos principais
- `siteLogoUrl` — logo PNG navbar
- `heroTitle/Subtitle/ImageUrl/VideoUrl/leftVideoUrl/rightVideoUrl/heroLogoUrl`
- `lumina*` — LuminaHighlight: label, title, subtitle, imageUrl, badgeText, productLink
- `aboutTitle/Text/ImageUrl`
- `featuredVideoUrl/Title/Desc`
- `instagramUrl/youtubeUrl/twitterUrl`
- `newsletterTitle/Subtitle`
- `metaTitle/Description/shippingFreeThreshold`
- Campos de benefícios (ícones, textos do WhyAltheia)
- Editar em `/admin/settings`

## Convenções
- Server Components por padrão; `"use client"` somente quando necessário
- Separar server wrapper + client component (ex: navbar.tsx + navbar-client.tsx)
- Preços: **sempre calculados no servidor** (nunca vindos do client)
- `formatPrice()` em `src/lib/utils.ts` — usar em vez de Intl direto
- Prisma objects têm symbol properties — NÃO passar diretamente para "use client" components
- Server Components NÃO podem ter event handlers
- Todas as Server Actions: Zod validation + `getServerAuth()` + `revalidatePath()` + retornam `ActionResult<T>`

## Bugs corrigidos (não regredir)
- Admin middleware: verificar `sessionClaims.metadata.role === "admin"`, não `return false`
- Prisma hot-reload Turbopack: singleton com `globalThis` em `prisma.ts`
- images String[]: PostgreSQL suporta nativo — sem JSON.stringify/parse
- P2002 (unique constraint): tratar nos actions com try/catch específico
- Security headers: CSP sem Stripe (removido), incluir domínios Cielo se necessário

## Comandos úteis
```bash
# Verificar tipos
source /home/sth/.nvm/nvm.sh && cd /home/sth/AltheiaSite && npx tsc --noEmit

# Dev
source /home/sth/.nvm/nvm.sh && cd /home/sth/AltheiaSite && npm run dev

# Migrations dev
source /home/sth/.nvm/nvm.sh && cd /home/sth/AltheiaSite && npm run db:push

# Seed
source /home/sth/.nvm/nvm.sh && cd /home/sth/AltheiaSite && npm run db:seed

# Build produção
source /home/sth/.nvm/nvm.sh && cd /home/sth/AltheiaSite && npm run build:prod

# Webhook Cielo local
# Configurar via dashboard Cielo apontando para ngrok/tunnel
```

## Deploy (Vercel + Neon)
- Vercel DNS: A record `76.76.21.21` (raiz) + CNAME `cname.vercel-dns.com` (www)
- Env vars necessárias: `DATABASE_URL`, `DIRECT_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `DEMO_MODE`
- `npm run build:prod` copia schema.production.prisma antes do build

## Bugs corrigidos pós-deploy (não regredir)
- `layout.tsx`: em produção (DEMO_MODE=false) DEVE ter `<ClerkProvider><ClerkAuthBridge>{children}</ClerkAuthBridge></ClerkProvider>`
- `context/auth.tsx`: `ClerkAuthBridge` usa import estático `import { useUser } from "@clerk/nextjs"` — NUNCA usar `require()` dinâmico (quebra prerender)
- `navbar-client.tsx`: logout usa `<SignOutButton>` do Clerk em produção, `<LogoutButton>` apenas em DEMO_MODE
- `pix-polling.tsx`: QR code gerado por `react-qr-code` (SVG local) — Google Charts API foi removida por ser descontinuada
- Clerk `sessionClaims.metadata`: requer configurar JWT template no dashboard → Configure → Sessions → `{ "metadata": "{{user.public_metadata}}" }`
- Role admin: setar `{ "role": "admin" }` em Public metadata do usuário no Clerk dashboard

## Deploy (Vercel + Neon)
- Vercel DNS: A record `76.76.21.21` (raiz) + CNAME `cname.vercel-dns.com` (www)
- Desativar Vercel Deployment Protection: Settings → Deployment Protection → None
- Env vars necessárias: `DATABASE_URL`, `DIRECT_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `DEMO_MODE`
- `DATABASE_URL` (pooled): `...?sslmode=require&pgbouncer=true&connect_timeout=15`
- `DIRECT_URL` (direta): `...?sslmode=require` (sem pgbouncer, sem channel_binding)
- `npm run build:prod` copia schema.production.prisma antes do build
- Tabelas criadas com `npx prisma db push` usando DIRECT_URL do Neon

## Branches
- `main` — produção (v0.7.0+)
- `Altheia-0.7.0` — gateway Cielo + account redesign
- `Altheia-0.6.0` — categorias CRUD + checkout WhatsApp + WhyAltheia dinâmica
- `Altheia-0.5.0` — admin completo + banco de mídia + lumina dinâmica + logo nav
- `feature/luxury-redesign-complete` — redesign Emerald/Gold base

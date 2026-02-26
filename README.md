# Altheia — Plataforma de E-commerce de Luxo

> *A Verdade da Beleza* — Cosméticos de luxo, construído com Next.js 16 + Prisma + Clerk + Stripe

---

## Stack

| Tecnologia | Versão | Propósito |
|---|---|---|
| Next.js | ^16 | App Router + Server Components |
| TypeScript | strict | Linguagem |
| Tailwind CSS | v4 | Estilo (Emerald + Gold) |
| Prisma | ^6 | ORM |
| SQLite (dev) / PostgreSQL Neon (prod) | — | Banco de dados |
| Clerk | ^6 | Autenticação |
| Stripe | ^17 | Pagamentos |
| Framer Motion | ^11 | Animações |
| Vercel | — | Hospedagem |

---

## Rodando localmente (DEMO_MODE)

```bash
# 1. Instalar dependências
npm install

# 2. Manter DEMO_MODE=true no .env.local (sem Clerk/Stripe reais)
# O arquivo já está configurado para dev local

# 3. Sincronizar banco de dados
npx prisma db push

# 4. Popular banco com produtos de exemplo
npx tsx prisma/seed.ts

# 5. Rodar
npm run dev
```

Abrir http://localhost:3000

Em DEMO_MODE, o usuário `demo@altheia.com` tem role `admin` e acessa `/admin` diretamente.

---

## Estrutura do Projeto

```
src/
  app/
    (store)/              ← Loja pública (Navbar + Footer)
      page.tsx            ← Home (dinâmico via SiteSettings)
      products/           ← Catálogo e detalhe
      cart/               ← Carrinho
      checkout/           ← Checkout Stripe
      wishlist/           ← Lista de desejos
      sobre-nos/          ← Sobre Nós (dinâmico via SiteSettings)
      videos/             ← Vídeos (dinâmico via SiteSettings)
      politica-de-privacidade/  ← LGPD
      termos-de-uso/      ← LGPD
    admin/                ← Painel administrativo (role=admin)
      page.tsx            ← Dashboard com métricas
      products/           ← CRUD de produtos + upload de imagens
      orders/             ← Gestão de pedidos + atualizar status
      settings/           ← SiteSettings (conteúdo dinâmico)
      newsletter/         ← Lista de inscritos
    api/
      newsletter/         ← POST /api/newsletter
      webhooks/stripe/    ← Webhook Stripe (pago → status PAID)
    sitemap.ts            ← Sitemap dinâmico gerado automaticamente
    robots.ts             ← robots.txt
  actions/
    cart.ts               ← Server Actions do carrinho
    products.ts           ← Queries de produtos/categorias
    admin.ts              ← CRUD admin + SiteSettings
    wishlist.ts           ← Lista de desejos
  components/
    home/                 ← Hero, BestSellers, Lumina, Historia, WhyAltheia
    admin/                ← ProductForm, OrderStatusForm, SiteSettingsForm
    about/                ← SobreNosContent (client)
    videos/               ← VideosContent (client, embed YouTube)
    layout/               ← Navbar, Footer, MobileNav, NewsletterForm
    products/             ← ProductCard, ProductFilters, WishlistButton
    ui/                   ← GoldButton, SectionTitle, ProductImage
  lib/
    auth.ts               ← Abstração Clerk (+ DEMO_MODE)
    prisma.ts             ← Singleton + parseImages
    blob.ts               ← Upload de imagens (Vercel Blob)
    constants.ts          ← APP_NAME, ORDER_STATUS, etc.
    animations.ts         ← Framer Motion variants
prisma/
  schema.prisma           ← Modelos completos (ver abaixo)
  seed.ts                 ← 3 categorias + 10 produtos
```

---

## Modelos Prisma

| Modelo | Propósito |
|---|---|
| `UserProfile` | Extensão do usuário Clerk |
| `Category` | Categorias com hierarquia |
| `Product` | Produtos com imagens, preço, estoque |
| `Cart` + `CartItem` | Carrinho persistido no banco |
| `Order` + `OrderItem` | Pedidos com snapshot de preço |
| `Wishlist` + `WishlistItem` | Lista de desejos por usuário |
| `SiteSettings` | Singleton com conteúdo dinâmico das páginas |
| `NewsletterSubscriber` | Inscritos na newsletter |

---

## Admin Panel

Acesse `/admin` (requer `sessionClaims.metadata.role === "admin"`).

**Para promover a admin no Clerk:**
Clerk Dashboard → Users → usuário → Metadata: `{ "role": "admin" }`

| Rota | Função |
|---|---|
| `/admin` | Dashboard: produtos, pedidos, receita, clientes |
| `/admin/products` | Listar todos com thumbnail, preço, estoque, status |
| `/admin/products/new` | Criar produto (form + upload de imagem) |
| `/admin/products/[id]/edit` | Editar produto |
| `/admin/orders` | Listar com paginação |
| `/admin/orders/[id]` | Detalhe + atualizar status do pedido |
| `/admin/settings` | Editar todos os textos/imagens do site |
| `/admin/newsletter` | Visualizar inscritos |

---

## SiteSettings — Conteúdo Dinâmico

A tabela `site_settings` (singleton `id="default"`) controla o conteúdo editável.
Edite em `/admin/settings`.

| Campo | Onde aparece |
|---|---|
| `heroTitle`, `heroSubtitle` | Home — Hero |
| `heroImageUrl` / `heroVideoUrl` | Home — Hero background |
| `aboutTitle`, `aboutText` | Página Sobre Nós |
| `featuredVideoUrl` | Vídeos (embed YouTube automático) |
| `featuredVideoTitle`, `featuredVideoDesc` | Vídeos |
| `instagramUrl`, `youtubeUrl`, `twitterUrl` | Footer |
| `newsletterTitle`, `newsletterSubtitle` | Footer |
| `metaTitle`, `metaDescription` | SEO global (head) |
| `shippingFreeThreshold` | Threshold frete grátis |

---

## Deploy na Vercel

### 1. Preparar repositório

```bash
git init && git add . && git commit -m "feat: Altheia e-commerce"
git remote add origin https://github.com/SEU_USUARIO/altheia-site.git
git push -u origin main
```

### 2. Criar projeto na Vercel

1. https://vercel.com/new → Import Git Repository
2. Framework: **Next.js** (detectado automaticamente)
3. Build Command: `npm run build`
4. Output Directory: `.next`

### 3. Variáveis de Ambiente (Vercel → Settings → Environment Variables)

```env
# Banco — Neon PostgreSQL
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/altheia?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://user:pass@ep-xxx.neon.tech/altheia?sslmode=require

# Clerk (produção)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe (produção)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://altheia.com.br

# Vercel Blob (upload de imagens)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

> ⚠️ **NÃO incluir** `DEMO_MODE=true` em produção.

### 4. Banco de dados — Neon PostgreSQL

1. Criar conta em https://neon.tech
2. New Project → copiar Connection Strings

**Atualizar `prisma/schema.prisma` para produção:**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Product {
  price  Decimal @db.Decimal(10, 2)  // era Float
  images String[]                     // era String (JSON)
}

enum OrderStatus {
  PENDING PAID SHIPPED DELIVERED CANCELLED
}

model Order {
  status OrderStatus @default(PENDING)  // era String
}
```

**Aplicar migration:**
```bash
DATABASE_URL="..." DIRECT_URL="..." npx prisma migrate deploy
npx tsx prisma/seed.ts   # opcional: dados de exemplo
```

### 5. Vercel Blob (imagens de produtos)

1. Vercel Dashboard → Storage → Create Store → Blob
2. Conectar ao projeto
3. Copiar `BLOB_READ_WRITE_TOKEN`
4. Descomentar código em `src/lib/blob.ts` (substituir placeholder)

### 6. Stripe Webhook (produção)

1. Stripe Dashboard → Developers → Webhooks → Add Endpoint
2. URL: `https://altheia.com.br/api/webhooks/stripe`
3. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copiar signing secret para `STRIPE_WEBHOOK_SECRET`

---

## DNS — Network Solutions para domínio altheia.com.br

### Configuração DNS para Vercel

**Passo 1 — Adicionar domínio na Vercel:**
Vercel Dashboard → Settings → Domains → Add Domain → `altheia.com.br`

Vercel retornará os valores DNS necessários. Geralmente:

| Tipo | Host | Valor | TTL |
|---|---|---|---|
| `A` | `@` (raiz) | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

**Passo 2 — Configurar no Network Solutions:**

1. Login em https://www.networksolutions.com
2. **My Account → Domain Names → Manage**
3. Selecionar `altheia.com.br`
4. **Change Where Domain Points → Advanced DNS**
5. Apagar registros A e CNAME existentes
6. Adicionar os registros da tabela acima
7. Salvar alterações

**Passo 3 — Verificar propagação:**
```bash
# Aguardar 30 min a 24h, depois verificar:
dig altheia.com.br A         # deve retornar 76.76.21.21
dig www.altheia.com.br CNAME # deve retornar cname.vercel-dns.com
```

**Passo 4 — SSL automático:**
Vercel provisiona certificado Let's Encrypt automaticamente após validação DNS.

> **Nota sobre DNSSEC:** Se o domínio usar DNSSEC, pode ser necessário desabilitar temporariamente durante a migração de nameservers.

---

## Checklist de Produção

- [ ] `DEMO_MODE` removido das env vars
- [ ] Schema Prisma atualizado para PostgreSQL
- [ ] Migration aplicada no Neon
- [ ] Domínio configurado (DNS + SSL)
- [ ] Clerk configurado com domínio de produção
- [ ] Stripe webhook configurado com URL de produção
- [ ] Vercel Blob configurado para upload de imagens
- [ ] Admin: promover usuário real com `role: "admin"`
- [ ] Admin → Settings: preencher conteúdo inicial do SiteSettings
- [ ] Testar fluxo completo: cadastro → produto → carrinho → checkout → pedido

---

## Scripts Úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run type-check   # Verificar tipos TypeScript
npx prisma studio    # Interface visual do banco
npx prisma db push   # Sincronizar schema (dev)
npx prisma migrate deploy  # Migration (produção)
npx tsx prisma/seed.ts     # Popular banco
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Paleta de Cores

| Cor | Hex | Uso |
|---|---|---|
| Verde esmeralda profundo | `#0A3D2F` | Fundo principal |
| Verde esmeralda médio | `#0F4A37` | Cards, seções |
| Verde esmeralda claro | `#145A43` | Hover, fundo imagens |
| Ouro | `#C9A227` | Accent primário, preços |
| Ouro claro | `#E8C84A` | Hover de botões |
| Creme | `#F5F0E6` | Texto principal |
| Creme escuro | `#C8BBA8` | Texto secundário |

---

## Licença

Projeto proprietário — © 2026 Altheia Cosméticos Ltda. Todos os direitos reservados.

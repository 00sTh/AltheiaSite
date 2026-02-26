#!/usr/bin/env bash
# ============================================================
# Althéia — Script de Setup para Produção
# Execute: bash setup-prod.sh
# ============================================================
set -e

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
RED="\033[0;31m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${CYAN}║   Althéia — Setup de Produção        ║${RESET}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════╝${RESET}"
echo ""

# ── Função utilitária ──────────────────────────────────────
ask() {
  local prompt="$1"
  local var="$2"
  echo -en "${YELLOW}${prompt}${RESET} "
  read -r value
  eval "$var='$value'"
}

confirm() {
  echo -en "${CYAN}$1 [s/N] ${RESET}"
  read -r resp
  [[ "$resp" =~ ^[sSyY]$ ]]
}

# ── Verificar Node ─────────────────────────────────────────
echo -e "${BOLD}1. Verificando ambiente...${RESET}"
if [ -f "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
fi
node --version >/dev/null 2>&1 || { echo -e "${RED}Node.js não encontrado. Instale via nvm.${RESET}"; exit 1; }
echo -e "${GREEN}✓ Node $(node --version)${RESET}"

# ── Verificar Vercel CLI ───────────────────────────────────
if ! command -v vercel &>/dev/null; then
  echo -e "${YELLOW}Instalando Vercel CLI...${RESET}"
  npm install -g vercel
fi
echo -e "${GREEN}✓ Vercel CLI $(vercel --version)${RESET}"
echo ""

# ── Coletar credenciais ────────────────────────────────────
echo -e "${BOLD}2. Credenciais necessárias${RESET}"
echo ""
echo -e "${CYAN}NEON (PostgreSQL gratuito)${RESET}"
echo -e "  Acesse: https://console.neon.tech → New Project → copie a Connection String"
echo -e "  DATABASE_URL (pooled, ex: postgresql://user:pass@ep-xxx-xxx.pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true)"
ask "  DATABASE_URL:" DATABASE_URL
ask "  DIRECT_URL (URL direta, sem pgbouncer):" DIRECT_URL
echo ""

echo -e "${CYAN}CLERK (autenticação)${RESET}"
echo -e "  Acesse: https://dashboard.clerk.com → Create application → API Keys"
ask "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_live_...):" CLERK_PUB
ask "  CLERK_SECRET_KEY (sk_live_...):" CLERK_SEC
echo ""

echo -e "${CYAN}VERCEL BLOB (uploads de imagens) — opcional${RESET}"
echo -e "  Acesse: https://vercel.com → Storage → Blob → Create Store → .env.local"
ask "  BLOB_READ_WRITE_TOKEN (deixe vazio para pular):" BLOB_TOKEN
echo ""

echo -e "${CYAN}APP URL (domínio de produção)${RESET}"
ask "  NEXT_PUBLIC_APP_URL (ex: https://altheia.com.br):" APP_URL
echo ""

# ── Escrever .env.production ───────────────────────────────
echo -e "${BOLD}3. Gravando .env.production...${RESET}"

cat > .env.production <<EOF
# Gerado por setup-prod.sh em $(date)
# ============================================================
# PRODUÇÃO — NÃO commitar este arquivo!
# ============================================================
DEMO_MODE=false
NEXT_PUBLIC_DEMO_MODE=false

# PostgreSQL (Neon)
DATABASE_URL="${DATABASE_URL}"
DIRECT_URL="${DIRECT_URL}"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${CLERK_PUB}"
CLERK_SECRET_KEY="${CLERK_SEC}"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Cielo
CIELO_ENV="production"
CIELO_MERCHANT_ID="a5ba7e81-ce85-4f21-8f68-9e061cab6ef7"
CIELO_MERCHANT_KEY="2vgwaiaQ1iGUeF7DCVZBIjFgPNpfZd77SY2mACEr"
CIELO_WEBHOOK_SECRET=""

# Vercel Blob
BLOB_READ_WRITE_TOKEN="${BLOB_TOKEN}"

# App
NEXT_PUBLIC_APP_URL="${APP_URL}"
NEXT_PUBLIC_SITE_URL="${APP_URL}"
EOF

echo -e "${GREEN}✓ .env.production criado${RESET}"

# Adicionar ao .gitignore se não estiver lá
if ! grep -q ".env.production" .gitignore 2>/dev/null; then
  echo ".env.production" >> .gitignore
  echo -e "${GREEN}✓ .env.production adicionado ao .gitignore${RESET}"
fi

# ── Criar banco PostgreSQL ─────────────────────────────────
echo ""
echo -e "${BOLD}4. Configurando banco PostgreSQL...${RESET}"
export DATABASE_URL
export DIRECT_URL

# Swap to production schema
cp prisma/schema.production.prisma prisma/schema.prisma
echo -e "${GREEN}✓ schema.prisma atualizado para PostgreSQL${RESET}"

echo -e "${YELLOW}Rodando prisma db push (criando tabelas no Neon)...${RESET}"
DATABASE_URL="$DATABASE_URL" DIRECT_URL="$DIRECT_URL" npx prisma db push
echo -e "${GREEN}✓ Tabelas criadas no PostgreSQL${RESET}"

# Restore local sqlite schema for dev
git checkout prisma/schema.prisma 2>/dev/null || true

# ── Login Vercel ───────────────────────────────────────────
echo ""
echo -e "${BOLD}5. Login na Vercel...${RESET}"
vercel login
echo -e "${GREEN}✓ Logado na Vercel${RESET}"

# ── Deploy ────────────────────────────────────────────────
echo ""
echo -e "${BOLD}6. Fazendo deploy na Vercel...${RESET}"

# Set env vars on Vercel
echo -e "${YELLOW}Configurando variáveis de ambiente na Vercel...${RESET}"
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$DIRECT_URL" | vercel env add DIRECT_URL production
echo "false" | vercel env add DEMO_MODE production
echo "false" | vercel env add NEXT_PUBLIC_DEMO_MODE production
echo "$CLERK_PUB" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
echo "$CLERK_SEC" | vercel env add CLERK_SECRET_KEY production
echo "/sign-in" | vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production
echo "/sign-up" | vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production
echo "/" | vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL production
echo "/" | vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL production
echo "production" | vercel env add CIELO_ENV production
echo "a5ba7e81-ce85-4f21-8f68-9e061cab6ef7" | vercel env add CIELO_MERCHANT_ID production
echo "2vgwaiaQ1iGUeF7DCVZBIjFgPNpfZd77SY2mACEr" | vercel env add CIELO_MERCHANT_KEY production
echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production
echo "$APP_URL" | vercel env add NEXT_PUBLIC_SITE_URL production
if [ -n "$BLOB_TOKEN" ]; then
  echo "$BLOB_TOKEN" | vercel env add BLOB_READ_WRITE_TOKEN production
fi

echo -e "${YELLOW}Iniciando deploy...${RESET}"
vercel --prod

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${GREEN}║   Deploy concluído com sucesso!      ║${RESET}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════╝${RESET}"
echo ""
echo -e "${CYAN}Próximos passos:${RESET}"
echo -e "  1. ${YELLOW}Clerk:${RESET} adicionar domínio de produção em dashboard.clerk.com"
echo -e "  2. ${YELLOW}Cielo webhook:${RESET} configurar URL no painel Cielo:"
echo -e "     ${APP_URL}/api/webhooks/cielo"
echo -e "  3. ${YELLOW}Admin:${RESET} criar primeiro admin via Clerk dashboard"
echo -e "     → User → Metadata → { \"role\": \"admin\" }"
echo -e "  4. ${YELLOW}Conteúdo:${RESET} acessar ${APP_URL}/admin/settings e configurar textos"
echo ""

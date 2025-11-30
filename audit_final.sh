#!/bin/bash

# ==============================================================================
# 🕵️ FINAL AUDIT: RELATÓRIO DE CONFORMIDADE ARQUITETURAL
# ==============================================================================

LOG_FILE="FINAL_AUDIT_REPORT.txt"
echo "Gerando Inventário Completo em $LOG_FILE..."
> $LOG_FILE

log() {
    echo -e "$1" >> $LOG_FILE
    echo -e "$1"
}

header() {
    echo -e "\n==================================================" >> $LOG_FILE
    echo -e "👉 $1" >> $LOG_FILE
    echo -e "==================================================" >> $LOG_FILE
}

# ------------------------------------------------------------------------------
# 1. INVENTÁRIO DE TECNOLOGIAS E VERSÕES
# ------------------------------------------------------------------------------
header "1. STACK TECNOLÓGICA (VERSÕES INSTALADAS)"

get_version() {
    FILE=$1
    PKG=$2
    if [ -f "$FILE" ]; then
        VER=$(grep "\"\"$PKG\"\":" "$FILE" | head -n 1 | sed 's/[\", ]//g')
        if [ -z "$VER" ]; then
            echo "   ❌ $PKG: Não encontrado" >> $LOG_FILE
        else
            echo "   ✅ $VER" >> $LOG_FILE
        fi
    fi
}

log "--- BACKEND (Cloudflare Workers + Hono) ---"
get_version "apps/backend/package.json" "hono"
get_version "apps/backend/package.json" "mongoose"
get_version "apps/backend/package.json" "zod"
get_version "apps/backend/package.json" "@hono/zod-validator"
get_version "apps/backend/package.json" "@typegoose/typegoose"
get_version "apps/backend/package.json" "bcryptjs"

log "\n--- FRONTEND (Vite + React) ---"
get_version "apps/frontend/package.json" "react"
get_version "apps/frontend/package.json" "vite"
get_version "apps/frontend/package.json" "axios"
get_version "apps/frontend/package.json" "@mui/material"

log "\n--- SHARED (Core) ---"
get_version "packages/shared/package.json" "zod"
get_version "packages/shared/package.json" "typescript"

# ------------------------------------------------------------------------------
# 2. VALIDAÇÃO DE ARQUITETURA (REGRAS DE OURO)
# ------------------------------------------------------------------------------
header "2. VALIDAÇÃO DE ARQUITETURA (REGRAS DE NEGÓCIO)"

# A. Verificação de Código Morto (Fastify)
log "🔍 Procurando vestígios de Fastify (Deve ser ZERO)..."
FASTIFY_COUNT=$(grep -r "fastify" apps/backend/src 2>/dev/null | wc -l)
if [ "$FASTIFY_COUNT" -eq 0 ]; then
    log "   ✅ Backend limpo de Fastify."
else
    log "   ❌ ALERTA: $FASTIFY_COUNT referências a Fastify encontradas!"
    grep -r "fastify" apps/backend/src >> $LOG_FILE
fi

# B. Verificação de Imports Cruzados Proibidos
log "\n🔍 Verificando se Frontend importa Backend diretamente (Proibido)..."
CROSS_IMPORT=$(grep -r "\.\./backend" apps/frontend/src 2>/dev/null | wc -l)
if [ "$CROSS_IMPORT" -eq 0 ]; then
    log "   ✅ Frontend isolado corretamente."
else
    log "   ❌ CRÍTICO: Frontend está importando arquivos do Backend!"
fi

# C. Verificação de Shared
log "\n🔍 Verificando Compilação do Shared..."
if [ -d "packages/shared/dist" ]; then
    log "   ✅ Pasta 'dist' encontrada (Pacote compilado)."
    if [ -f "packages/shared/dist/schemas/index.d.ts" ]; then
        log "   ✅ Tipos (.d.ts) gerados corretamente."
    else
        log "   ❌ Tipos não encontrados em dist/schemas."
    fi
else
    log "   ❌ Pasta 'dist' NÃO encontrada. Rode 'pnpm build' no shared."
fi

# ------------------------------------------------------------------------------
# 3. VALIDAÇÃO DE CONFIGURAÇÃO (ARQUIVOS CRÍTICOS)
# ------------------------------------------------------------------------------
header "3. AUDITORIA DE CONFIGURAÇÃO"

# A. Wrangler (Backend)
log "📄 apps/backend/wrangler.jsonc"
if grep -q "nodejs_compat" apps/backend/wrangler.jsonc 2>/dev/null; then
    log "   ✅ nodejs_compat ativado (Essencial para Mongoose)."
else
    log "   ❌ nodejs_compat NÃO encontrado (Backend vai falhar no Edge)."
fi

# B. TSConfig (Backend - Typegoose)
log "\n📄 apps/backend/tsconfig.json"
if grep -q "emitDecoratorMetadata" apps/backend/tsconfig.json 2>/dev/null; then
    log "   ✅ Decorators ativados (Typegoose vai funcionar)."
else
    log "   ❌ experimentalDecorators/emitMetadata faltando (Models vão quebrar)."
fi

# C. Package.json (Workspace)
log "\n📄 pnpm-workspace.yaml"
if [ -f "pnpm-workspace.yaml" ]; then
    log "   ✅ Workspace definido."
else
    log "   ❌ Arquivo de Workspace não encontrado na raiz."
fi

# ------------------------------------------------------------------------------
# 4. MAPEAMENTO FINAL DE DIRETÓRIOS
# ------------------------------------------------------------------------------
header "4. ÁRVORE DE DIRETÓRIOS FINAL"
find apps packages -maxdepth 3 -not -path '*/.*' | grep -v "node_modules" | sed -e 's;[^/]*/;|____;g;s;____|; |;g' >> $LOG_FILE

# ------------------------------------------------------------------------------
# 5. TESTE DE INTEGRIDADE (BUILD FINAL)
# ------------------------------------------------------------------------------
header "5. TESTE DE BUILD (SIMULAÇÃO)"

log "Testando build do Backend (TSC)..."
# Tenta rodar o tsc apenas para verificar erros, sem emitir arquivos
cd apps/backend
../../node_modules/.bin/tsc --noEmit
if [ $? -eq 0 ]; then
    log "   ✅ Backend TypeScript: OK (Sem erros)."
else
    log "   ❌ Backend TypeScript: FALHOU (Veja o terminal para detalhes)."
fi
cd ../..

echo -e "\n==================================================" >> $LOG_FILE
echo "🏁 AUDITORIA FINALIZADA" >> $LOG_FILE

echo " "
echo "✅ Relatório gerado em: $LOG_FILE"
echo "👉 Abra este arquivo e cole o conteúdo para eu te dar o Veredito Final (Nota 10)."
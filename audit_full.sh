#!/bin/bash

LOGFILE="audit-log.txt"
rm -f $LOGFILE

log() {
  echo -e "$1" | tee -a "$LOGFILE"
}

log "===================================================="
log "     AUDITORIA COMPLETA COM LOGS & CORREÇÕES        "
log "===================================================="

#######################################
#             BACKEND                 #
#######################################

log ""
log "===================================================="
log "                 BACKEND AUDIT"
log "===================================================="

cd backend || exit 1

log ""
log "🔍 Verificando dependências e versões do BACKEND..."
npm list --depth=0 2>&1 | tee -a "../$LOGFILE"
npm outdated 2>&1 | tee -a "../$LOGFILE"

log ""
log "🔧 Corrigindo dependências automaticamente..."
npm update --force 2>&1 | tee -a "../$LOGFILE"
npm dedupe 2>&1 | tee -a "../$LOGFILE"

log ""
log "🛡️ Rodando auditoria de segurança do BACKEND..."
npm audit 2>&1 | tee -a "../$LOGFILE"
npm audit fix --force 2>&1 | tee -a "../$LOGFILE"

log ""
log "📘 Checando Tipagem TypeScript (Backend)..."
npx tsc --noEmit 2>&1 | tee -a "../$LOGFILE"

log ""
log "⚙️ Validando Build do Cloudflare Worker..."
npx wrangler build 2>&1 | tee -a "../$LOGFILE"

log ""
log "📁 Estrutura real do BACKEND..."
tree -I "node_modules" 2>&1 | tee -a "../$LOGFILE"

log ""
log "===================================================="
log "           FIM AUDITORIA BACKEND"
log "===================================================="


#######################################
#             FRONTEND                #
#######################################

cd ../frontend || exit 1

log ""
log "===================================================="
log "                FRONTEND AUDIT"
log "===================================================="

log ""
log "🔍 Verificando dependências e versões do FRONTEND..."
npm list --depth=0 2>&1 | tee -a "../$LOGFILE"
npm outdated 2>&1 | tee -a "../$LOGFILE"

log ""
log "🔧 Corrigindo dependências automaticamente..."
npm update --force 2>&1 | tee -a "../$LOGFILE"
npm dedupe 2>&1 | tee -a "../$LOGFILE"

log ""
log "🛡️ Rodando auditoria de segurança do FRONTEND..."
npm audit 2>&1 | tee -a "../$LOGFILE"
npm audit fix --force 2>&1 | tee -a "../$LOGFILE"

log ""
log "📘 Checando Tipagem TypeScript (Frontend)..."
npx tsc --noEmit 2>&1 | tee -a "../$LOGFILE"

log ""
log "⚙️ Validando Build do Frontend (Vite)..."
npm run build 2>&1 | tee -a "../$LOGFILE"

log ""
log "🧭 Checando imports quebrados..."
npx vite --debug 2>&1 | tee -a "../$LOGFILE"

log ""
log "🧹 Procurando arquivos não utilizados (dead code)..."
npx unimported 2>&1 | tee -a "../$LOGFILE"

log ""
log "📦 Analisando build para identificar gargalos..."
npm run build -- --debug 2>&1 | tee -a "../$LOGFILE"

log ""
log "📁 Estrutura real do FRONTEND..."
tree -I "node_modules" 2>&1 | tee -a "../$LOGFILE"

cd ..

log ""
log "===================================================="
log "                RELATÓRIO FINAL"
log "===================================================="
log "📄 O relatório completo da auditoria foi salvo em:"
log "➡  audit-log.txt"
log ""
log "🎉 Auditoria completa finalizada!"
log ""
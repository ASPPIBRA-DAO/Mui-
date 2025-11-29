#!/bin/bash

# Configurações
LOG_DIR="./refactor_logs"
MAPPING_LOG="$LOG_DIR/1_mapping.log"
EXECUTION_LOG="$LOG_DIR/2_execution.log"
CORRECTION_LOG="$LOG_DIR/3_correction.log"

mkdir -p $LOG_DIR

# Limpar logs antigos
> $MAPPING_LOG
> $EXECUTION_LOG
> $CORRECTION_LOG

echo "=================================================="
echo "🚀 INICIANDO PROCESSO DE REFATORAÇÃO EM 3 FASES"
echo "=================================================="

# ==============================================================================
# FASE 1: MAPEAMENTO (VIRTUALIZAÇÃO)
# ==============================================================================
echo " "
echo "📍 FASE 1: Mapeando arquivos e gerando plano de migração..."

# Definição dos movimentos: "ORIGEM|DESTINO"
# FORMATO: caminho_relativo_src|novo_caminho_relativo_src
declare -a MOVES=(
    "frontend/src/components/Header.tsx|frontend/src/components/layout/Header.tsx"
    "frontend/src/components/Footer.tsx|frontend/src/components/layout/Footer.tsx"
    "frontend/src/components/LayoutPublic.tsx|frontend/src/components/layout/LayoutPublic.tsx"
    "frontend/src/components/LoginForm.tsx|frontend/src/components/auth/LoginForm.tsx"
    "frontend/src/components/RegisterForm.tsx|frontend/src/components/auth/RegisterForm.tsx"
    "frontend/src/components/AuthProvider.tsx|frontend/src/context/AuthProvider.tsx"
    "frontend/src/components/CreateTodo.tsx|frontend/src/components/todo/CreateTodo.tsx"
    "frontend/src/components/TodoList.tsx|frontend/src/components/todo/TodoList.tsx"
    "frontend/src/components/Todos.tsx|frontend/src/components/todo/TodoManager.tsx" # Renomeando!
    "frontend/src/components/ProtectedRoute.tsx|frontend/src/routes/ProtectedRoute.tsx"
)

# Gerar relatório de mapeamento
for entry in "${MOVES[@]}"; do
    SRC="${entry%%|*}"
    DEST="${entry##*|}"
    
    if [ -f "$SRC" ]; then
        echo "DETECTADO: $SRC -> $DEST"
        echo "$SRC|$DEST" >> $MAPPING_LOG
    else
        echo "⚠️ ARQUIVO NÃO ENCONTRADO (IGNORADO): $SRC"
    fi
done

echo "✅ Fase 1 concluída. Plano salvo em: $MAPPING_LOG"


# ==============================================================================
# FASE 2: EXECUÇÃO (FILE SYSTEM)
# ==============================================================================
echo " "
echo "📦 FASE 2: Aplicando mudanças no sistema de arquivos..."

while IFS='|' read -r SRC DEST; do
    # Criar diretório do destino se não existir
    DEST_DIR=$(dirname "$DEST")
    mkdir -p "$DEST_DIR"
    
    # Mover arquivo
    mv "$SRC" "$DEST"
    
    if [ $? -eq 0 ]; then
        echo "MOVIDO: $SRC -> $DEST"
        echo "SUCCESS|$SRC|$DEST" >> $EXECUTION_LOG
    else
        echo "❌ FALHA: $SRC"
        echo "FAIL|$SRC|$DEST" >> $EXECUTION_LOG
    fi
done < "$MAPPING_LOG"

# Criar pastas extras e arquivos base se não existirem
mkdir -p frontend/src/types frontend/src/utils frontend/src/hooks
touch frontend/src/types/index.ts frontend/src/utils/index.ts

echo "✅ Fase 2 concluída. Log salvo em: $EXECUTION_LOG"


# ==============================================================================
# FASE 3: CORREÇÃO DE IMPORTAÇÕES (SED & GREP)
# ==============================================================================
echo " "
echo "🛠️ FASE 3: Corrigindo referências de importação nos arquivos..."

# Função para escapar caracteres para o SED
escape_sed() {
    echo "$1" | sed 's/[\/&]/\\&/g'
}

# Ler o log de execução para saber o que foi movido com sucesso
while IFS='|' read -r STATUS SRC DEST; do
    if [ "$STATUS" == "SUCCESS" ]; then
        
        # Extrair nomes para busca
        # Ex: src/components/Header.tsx -> Header
        OLD_FILENAME=$(basename "$SRC" .tsx)
        NEW_FILENAME=$(basename "$DEST" .tsx)
        
        # Caminho relativo simplificado para busca (ex: components/Header)
        OLD_PATH_PART="${SRC#frontend/src/}"
        OLD_PATH_PART="${OLD_PATH_PART%.tsx}"
        
        NEW_PATH_PART="${DEST#frontend/src/}"
        NEW_PATH_PART="${NEW_PATH_PART%.tsx}"

        echo "🔄 Atualizando referências de '$OLD_FILENAME' para '$NEW_FILENAME'..."

        # 1. Ajustar Imports em arquivos que CHAMAM o componente movido
        # Procura por strings como: from './components/Header' ou from '../components/Header'
        # Nota: Essa lógica tenta cobrir os casos mais comuns.
        
        # Busca todos os arquivos .ts e .tsx dentro de src
        find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" \) | while read -r file; do
            
            # Tenta substituir caminhos antigos
            # Estratégia: Substituir o fim do caminho de importação
            
            # Ex: components/Header -> components/layout/Header
            # Ex: components/Todos -> components/todo/TodoManager
            
            # Correção genérica baseada no nome do arquivo antigo vs novo caminho
            # Isso corrige: import { X } from '.../components/Header'
            
            # Pega apenas o nome do componente antigo (ex: Header)
            SEARCH_NAME="$OLD_FILENAME"
            
            # Define o novo sufixo (ex: /layout/Header)
            # Removemos 'components/' do inicio para ser mais flexivel ou usamos o path relativo novo
            
            # Lógica simplificada: Se o arquivo contém o nome do componente antigo no import, avisar e tentar trocar
            
            if grep -q "$SEARCH_NAME" "$file"; then
                echo "   -> Processando: $file"
                
                # Caso Específico: Header e Footer e LayoutPublic
                if [[ "$SRC" == *"Header.tsx"* ]]; then
                     sed -i "s|components/Header|components/layout/Header|g" "$file"
                fi
                if [[ "$SRC" == *"Footer.tsx"* ]]; then
                     sed -i "s|components/Footer|components/layout/Footer|g" "$file"
                fi
                if [[ "$SRC" == *"LayoutPublic.tsx"* ]]; then
                     sed -i "s|components/LayoutPublic|components/layout/LayoutPublic|g" "$file"
                fi
                
                # Caso Específico: Auth
                if [[ "$SRC" == *"LoginForm.tsx"* ]]; then
                     sed -i "s|components/LoginForm|components/auth/LoginForm|g" "$file"
                fi
                if [[ "$SRC" == *"RegisterForm.tsx"* ]]; then
                     sed -i "s|components/RegisterForm|components/auth/RegisterForm|g" "$file"
                fi
                
                # Caso Específico: Context
                if [[ "$SRC" == *"AuthProvider.tsx"* ]]; then
                     sed -i "s|components/AuthProvider|context/AuthProvider|g" "$file"
                fi
                
                # Caso Específico: Routes
                if [[ "$SRC" == *"ProtectedRoute.tsx"* ]]; then
                     sed -i "s|components/ProtectedRoute|routes/ProtectedRoute|g" "$file"
                fi

                # Caso Específico: TODO (O mais complexo devido à renomeação)
                if [[ "$SRC" == *"CreateTodo.tsx"* ]]; then
                     sed -i "s|components/CreateTodo|components/todo/CreateTodo|g" "$file"
                fi
                if [[ "$SRC" == *"TodoList.tsx"* ]]; then
                     sed -i "s|components/TodoList|components/todo/TodoList|g" "$file"
                fi
                if [[ "$SRC" == *"Todos.tsx"* ]]; then
                     # Aqui muda de components/Todos para components/todo/TodoManager
                     sed -i "s|components/Todos|components/todo/TodoManager|g" "$file"
                fi
                
                echo "$file|$OLD_FILENAME -> ATUALIZADO" >> $CORRECTION_LOG
            fi
        done
    fi
done < "$EXECUTION_LOG"

echo " "
echo "✅ Fase 3 concluída."
echo "=================================================="
echo "🏁 PROCESSO FINALIZADO"
echo "📂 Verifique a pasta '$LOG_DIR' para auditoria completa."
echo "⚠️  Nota: O script corrige os 'imports' de quem chama os arquivos."
echo "⚠️  Verifique manualmente se os arquivos movidos não perderam referência de seus próprios imports (ex: CSS ou assets)."
echo "=================================================="
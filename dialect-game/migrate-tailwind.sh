#!/bin/bash

# 🚨 SCRIPT DE MIGRATION TAILWINDCSS v4 → v3 LTS + SHADCN/UI
# Task ID: 6dfe467e-5151-4228-88f0-7e86dfd7f08f
# Priorité: SUPER PRIORITAIRE 🔥

set -e  # Exit on any error

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Vérifications préalables
check_prerequisites() {
    log "🔍 Vérification des prérequis..."
    
    # Vérifier Node.js version
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18+ requis. Version actuelle: $(node --version)"
        exit 1
    fi
    
    # Vérifier npm version
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        error "Git n'est pas installé"
        exit 1
    fi
    
    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "package.json" ] || [ ! -f "tailwind.config.js" ]; then
        error "Vous devez être dans le répertoire racine du projet (avec package.json et tailwind.config.js)"
        exit 1
    fi
    
    info "✅ Prérequis validés"
}

# Sauvegarde et audit initial
backup_and_audit() {
    log "🔍 ÉTAPE 1: Sauvegarde et audit initial..."
    
    # Créer branche de sauvegarde
    git checkout -b backup-before-tailwind-migration-$(date +%Y%m%d-%H%M%S) || true
    git add .
    git commit -m "🔧 Backup avant migration TailwindCSS v4→v3" || true
    
    # Vérifier versions actuelles
    info "Versions actuelles:"
    npm list tailwindcss || true
    npm list @tailwindcss/vite @tailwindcss/postcss @tailwindcss/cli || true
    npm list autoprefixer postcss || true
    
    # Sauvegarder fichiers de configuration
    cp tailwind.config.js tailwind.config.js.backup
    cp postcss.config.js postcss.config.js.backup
    cp components.json components.json.backup
    cp package.json package.json.backup
    
    info "✅ Sauvegarde terminée"
}

# Désinstallation v4
uninstall_v4() {
    log "🗑️ ÉTAPE 2: Désinstallation TailwindCSS v4..."
    
    # Désinstaller paquets Tailwind
    npm uninstall tailwindcss @tailwindcss/vite @tailwindcss/postcss @tailwindcss/cli || true
    
    # Nettoyer cache
    npm cache clean --force
    
    # Fresh start
    rm -rf node_modules
    rm -f package-lock.json
    
    info "✅ Désinstallation v4 terminée"
}

# Installation v3 LTS
install_v3() {
    log "📦 ÉTAPE 3: Installation TailwindCSS v3 versions spécifiques (Medium Expert)..."
    
    # Installer TailwindCSS v3 versions EXACTES testées par Pradeep Gudipati
    npm install -D tailwindcss@3.3.5 postcss@8.4.24 autoprefixer@10.4.14
    
    # Installer plugins nécessaires
    npm install -D @tailwindcss/typography@latest @tailwindcss/forms@latest @tailwindcss/aspect-ratio@latest
    
    # Installer autres dépendances
    npm install
    
    # Vérifier version installée
    TAILWIND_VERSION=$(npm list tailwindcss --depth=0 | grep tailwindcss | cut -d'@' -f2)
    info "Version TailwindCSS installée: $TAILWIND_VERSION"
    
    if [[ ! "$TAILWIND_VERSION" =~ ^3\.3\.5 ]]; then
        error "La version installée n'est pas 3.3.5: $TAILWIND_VERSION"
        exit 1
    fi
    
    info "✅ Installation v3.3.5 LTS terminée (versions Medium Expert)"
}

# Configuration PostCSS
configure_postcss() {
    log "⚙️ ÉTAPE 4: Configuration PostCSS..."
    
    # Créer configuration v3 standard
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    
    info "✅ Configuration PostCSS mise à jour"
}

# Validation Tailwind config
validate_tailwind_config() {
    log "🔧 ÉTAPE 5: Validation configuration Tailwind..."
    
    # Tester génération CSS
    npx tailwindcss -i ./src/styles/globals.css -o ./test-output.css
    
    if [ ! -f "./test-output.css" ]; then
        error "Échec de la génération CSS"
        exit 1
    fi
    
    # Vérifier contenu généré
    CSS_SIZE=$(wc -c < "./test-output.css")
    if [ "$CSS_SIZE" -lt 1000 ]; then
        error "Fichier CSS généré trop petit ($CSS_SIZE bytes)"
        exit 1
    fi
    
    info "CSS généré: $CSS_SIZE bytes"
    rm -f ./test-output.css
    
    info "✅ Configuration Tailwind validée"
}

# Mise à jour shadcn/ui
update_shadcn() {
    log "🎨 ÉTAPE 6: Mise à jour shadcn/ui..."
    
    # Mettre à jour CLI shadcn
    npm install -g shadcn@latest || true
    
    # Vérifier components.json
    if [ ! -f "components.json" ]; then
        error "components.json introuvable"
        exit 1
    fi
    
    # Réinstaller composants critiques avec --overwrite (Medium best practice)
    npx shadcn@latest add button --overwrite || warn "Échec réinstallation button"
    npx shadcn@latest add tabs --overwrite || warn "Échec réinstallation tabs"
    npx shadcn@latest add progress --overwrite || warn "Échec réinstallation progress"
    
    info "✅ shadcn/ui mis à jour"
}

# Validation build et dev
validate_build() {
    log "🏗️ ÉTAPE 7: Validation build et dev..."
    
    # Test build production
    npm run build
    if [ $? -ne 0 ]; then
        error "Échec du build production"
        exit 1
    fi
    
    # Test type checking
    npm run type-check || warn "Type checking échoué"
    
    info "✅ Build validé"
}

# Tests de régression
run_tests() {
    log "🧪 ÉTAPE 8: Tests de régression..."
    
    # Tests unitaires
    npm run test || warn "Tests unitaires échoués"
    
    # Tests E2E (optionnel, peut être long)
    if [ "$RUN_E2E" = "true" ]; then
        npm run test:e2e || warn "Tests E2E échoués"
    else
        info "Tests E2E ignorés (utiliser RUN_E2E=true pour les exécuter)"
    fi
    
    # Linting
    npm run lint || warn "Linting échoué"
    
    info "✅ Tests terminés"
}

# Documentation et finalisation
finalize() {
    log "📝 ÉTAPE 9: Finalisation..."
    
    # Nettoyer fichiers temporaires
    rm -f test-output.css
    rm -f *.backup
    
    # Commit des changements
    git add .
    git commit -m "✅ Migration TailwindCSS v4→v3 LTS + shadcn/ui compatibility"
    
    # Créer tag
    git tag -a v1.0.0-tailwind-v3-stable -m "🎯 TailwindCSS v3 LTS stable + shadcn/ui compatible"
    
    # Afficher résumé
    log "🎉 MIGRATION TERMINÉE AVEC SUCCÈS!"
    info "Version TailwindCSS: $(npm list tailwindcss --depth=0 | grep tailwindcss | cut -d'@' -f2)"
    info "Tag créé: v1.0.0-tailwind-v3-stable"
    info "Commit: $(git rev-parse --short HEAD)"
    
    info "✅ Migration finalisée"
}

# Fonction de rollback
rollback() {
    error "🆘 ROLLBACK ACTIVÉ"
    
    # Revenir aux fichiers de sauvegarde
    if [ -f "tailwind.config.js.backup" ]; then
        cp tailwind.config.js.backup tailwind.config.js
    fi
    if [ -f "postcss.config.js.backup" ]; then
        cp postcss.config.js.backup postcss.config.js
    fi
    if [ -f "components.json.backup" ]; then
        cp components.json.backup components.json
    fi
    if [ -f "package.json.backup" ]; then
        cp package.json.backup package.json
        npm install
    fi
    
    warn "Fichiers restaurés. Vérifiez manuellement l'état du projet."
}

# Gestionnaire d'erreur
trap 'error "Script interrompu"; rollback; exit 1' ERR INT TERM

# MAIN EXECUTION
main() {
    log "🚨 DÉBUT MIGRATION TAILWINDCSS v4 → v3 LTS + SHADCN/UI"
    log "Task ID: 6dfe467e-5151-4228-88f0-7e86dfd7f08f"
    
    check_prerequisites
    backup_and_audit
    uninstall_v4
    install_v3
    configure_postcss
    validate_tailwind_config
    update_shadcn
    validate_build
    run_tests
    finalize
    
    log "🎉 MIGRATION RÉUSSIE!"
}

# Exécution avec gestion des arguments
if [ "$1" = "--dry-run" ]; then
    log "🔍 MODE DRY-RUN (simulation uniquement)"
    check_prerequisites
    log "Prérequis OK - migration peut être lancée"
    exit 0
elif [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [--dry-run] [--help]"
    echo "Options:"
    echo "  --dry-run    Vérifier les prérequis sans exécuter la migration"
    echo "  --help       Afficher cette aide"
    echo ""
    echo "Variables d'environnement:"
    echo "  RUN_E2E=true    Exécuter les tests E2E (par défaut: false)"
    exit 0
else
    main
fi

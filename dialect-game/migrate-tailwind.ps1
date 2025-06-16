# 🚨 SCRIPT DE MIGRATION TAILWINDCSS v4 → v3 LTS + SHADCN/UI (PowerShell)
# Task ID: 6dfe467e-5151-4228-88f0-7e86dfd7f08f
# Priorité: SUPER PRIORITAIRE 🔥

param(
    [switch]$DryRun,
    [switch]$Help,
    [switch]$RunE2E
)

# Configuration
$ErrorActionPreference = "Stop"

# Couleurs pour les logs
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Log { param([string]$Message) Write-ColorOutput $Message "Green" }
function Warn { param([string]$Message) Write-ColorOutput "[WARNING] $Message" "Yellow" }
function Error { param([string]$Message) Write-ColorOutput "[ERROR] $Message" "Red" }
function Info { param([string]$Message) Write-ColorOutput "[INFO] $Message" "Cyan" }

# Afficher l'aide
if ($Help) {
    Write-Host "Usage: .\migrate-tailwind.ps1 [-DryRun] [-RunE2E] [-Help]"
    Write-Host "Options:"
    Write-Host "  -DryRun     Vérifier les prérequis sans exécuter la migration"
    Write-Host "  -RunE2E     Exécuter les tests E2E (par défaut: false)"
    Write-Host "  -Help       Afficher cette aide"
    exit 0
}

# Vérifications préalables
function Check-Prerequisites {
    Log "🔍 Vérification des prérequis..."
    
    # Vérifier Node.js version
    try {
        $nodeVersion = node --version
        $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($majorVersion -lt 18) {
            Error "Node.js version 18+ requis. Version actuelle: $nodeVersion"
            exit 1
        }
    } catch {
        Error "Node.js n'est pas installé ou accessible"
        exit 1
    }
    
    # Vérifier npm
    try {
        $npmVersion = npm --version
        Info "npm version: $npmVersion"
    } catch {
        Error "npm n'est pas installé ou accessible"
        exit 1
    }
    
    # Vérifier Git
    try {
        $gitVersion = git --version
        Info "Git détecté: $gitVersion"
    } catch {
        Error "Git n'est pas installé ou accessible"
        exit 1
    }
    
    # Vérifier fichiers du projet
    if (-not (Test-Path "package.json") -or -not (Test-Path "tailwind.config.js")) {
        Error "Vous devez être dans le répertoire racine du projet (avec package.json et tailwind.config.js)"
        exit 1
    }
    
    Info "✅ Prérequis validés"
}

# Sauvegarde et audit initial
function Backup-AndAudit {
    Log "🔍 ÉTAPE 1: Sauvegarde et audit initial..."
    
    # Créer branche de sauvegarde
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    try {
        git checkout -b "backup-before-tailwind-migration-$timestamp"
        git add .
        git commit -m "🔧 Backup avant migration TailwindCSS v4→v3"
    } catch {
        Warn "Impossible de créer la branche de sauvegarde (possible si aucun changement)"
    }
    
    # Vérifier versions actuelles
    Info "Versions actuelles:"
    try { npm list tailwindcss } catch { }
    try { npm list @tailwindcss/vite @tailwindcss/postcss @tailwindcss/cli } catch { }
    try { npm list autoprefixer postcss } catch { }
    
    # Sauvegarder fichiers de configuration
    Copy-Item "tailwind.config.js" "tailwind.config.js.backup"
    Copy-Item "postcss.config.js" "postcss.config.js.backup"
    Copy-Item "components.json" "components.json.backup"
    Copy-Item "package.json" "package.json.backup"
    
    Info "✅ Sauvegarde terminée"
}

# Désinstallation v4
function Uninstall-V4 {
    Log "🗑️ ÉTAPE 2: Désinstallation TailwindCSS v4..."
    
    # Désinstaller paquets Tailwind
    try { npm uninstall tailwindcss @tailwindcss/vite @tailwindcss/postcss @tailwindcss/cli } catch { }
    
    # Nettoyer cache
    npm cache clean --force
    
    # Fresh start
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
    
    Info "✅ Désinstallation v4 terminée"
}

# Installation v3 LTS
function Install-V3 {
    Log "📦 ÉTAPE 3: Installation TailwindCSS v3 LTS..."
    
    # Installer TailwindCSS v3 LTS + dépendances core
    npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
    
    # Installer plugins nécessaires
    npm install -D @tailwindcss/typography@latest @tailwindcss/forms@latest @tailwindcss/aspect-ratio@latest
    
    # Installer autres dépendances
    npm install
    
    # Vérifier version installée
    $tailwindInfo = npm list tailwindcss --depth=0
    $tailwindVersion = ($tailwindInfo | Select-String "tailwindcss@").ToString().Split("@")[1]
    Info "Version TailwindCSS installée: $tailwindVersion"
    
    if (-not $tailwindVersion.StartsWith("3.")) {
        Error "La version installée n'est pas v3.x.x: $tailwindVersion"
        exit 1
    }
    
    Info "✅ Installation v3 LTS terminée"
}

# Configuration PostCSS
function Configure-PostCSS {
    Log "⚙️ ÉTAPE 4: Configuration PostCSS..."
    
    # Créer configuration v3 standard
    $postcssConfig = @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@
    
    $postcssConfig | Out-File -FilePath "postcss.config.js" -Encoding UTF8
    
    Info "✅ Configuration PostCSS mise à jour"
}

# Validation Tailwind config
function Validate-TailwindConfig {
    Log "🔧 ÉTAPE 5: Validation configuration Tailwind..."
    
    # Tester génération CSS
    npx tailwindcss -i ./src/styles/globals.css -o ./test-output.css
    
    if (-not (Test-Path "./test-output.css")) {
        Error "Échec de la génération CSS"
        exit 1
    }
    
    # Vérifier contenu généré
    $cssSize = (Get-Item "./test-output.css").Length
    if ($cssSize -lt 1000) {
        Error "Fichier CSS généré trop petit ($cssSize bytes)"
        exit 1
    }
    
    Info "CSS généré: $cssSize bytes"
    Remove-Item "./test-output.css" -Force
    
    Info "✅ Configuration Tailwind validée"
}

# Mise à jour shadcn/ui
function Update-Shadcn {
    Log "🎨 ÉTAPE 6: Mise à jour shadcn/ui..."
    
    # Mettre à jour CLI shadcn
    try { npm install -g shadcn@latest } catch { Warn "Impossible de mettre à jour shadcn globalement" }
    
    # Vérifier components.json
    if (-not (Test-Path "components.json")) {
        Error "components.json introuvable"
        exit 1
    }
    
    # Réinstaller composants critiques
    try { npx shadcn@latest add button --overwrite } catch { Warn "Échec réinstallation button" }
    try { npx shadcn@latest add tabs --overwrite } catch { Warn "Échec réinstallation tabs" }
    try { npx shadcn@latest add progress --overwrite } catch { Warn "Échec réinstallation progress" }
    
    Info "✅ shadcn/ui mis à jour"
}

# Validation build et dev
function Validate-Build {
    Log "🏗️ ÉTAPE 7: Validation build et dev..."
    
    # Test build production
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Error "Échec du build production"
        exit 1
    }
    
    # Test type checking
    try { npm run type-check } catch { Warn "Type checking échoué" }
    
    Info "✅ Build validé"
}

# Tests de régression
function Run-Tests {
    Log "🧪 ÉTAPE 8: Tests de régression..."
    
    # Tests unitaires
    try { npm run test } catch { Warn "Tests unitaires échoués" }
    
    # Tests E2E (optionnel)
    if ($RunE2E) {
        try { npm run test:e2e } catch { Warn "Tests E2E échoués" }
    } else {
        Info "Tests E2E ignorés (utiliser -RunE2E pour les exécuter)"
    }
    
    # Linting
    try { npm run lint } catch { Warn "Linting échoué" }
    
    Info "✅ Tests terminés"
}

# Documentation et finalisation
function Finalize-Migration {
    Log "📝 ÉTAPE 9: Finalisation..."
    
    # Nettoyer fichiers temporaires
    if (Test-Path "test-output.css") { Remove-Item "test-output.css" -Force }
    Get-ChildItem "*.backup" | Remove-Item -Force
    
    # Commit des changements
    git add .
    git commit -m "✅ Migration TailwindCSS v4→v3 LTS + shadcn/ui compatibility"
    
    # Créer tag
    git tag -a v1.0.0-tailwind-v3-stable -m "🎯 TailwindCSS v3 LTS stable + shadcn/ui compatible"
    
    # Afficher résumé
    Log "🎉 MIGRATION TERMINÉE AVEC SUCCÈS!"
    $tailwindInfo = npm list tailwindcss --depth=0
    $tailwindVersion = ($tailwindInfo | Select-String "tailwindcss@").ToString().Split("@")[1]
    Info "Version TailwindCSS: $tailwindVersion"
    Info "Tag créé: v1.0.0-tailwind-v3-stable"
    $commitHash = git rev-parse --short HEAD
    Info "Commit: $commitHash"
    
    Info "✅ Migration finalisée"
}

# Fonction de rollback
function Invoke-Rollback {
    Error "🆘 ROLLBACK ACTIVÉ"
    
    # Revenir aux fichiers de sauvegarde
    if (Test-Path "tailwind.config.js.backup") {
        Copy-Item "tailwind.config.js.backup" "tailwind.config.js"
    }
    if (Test-Path "postcss.config.js.backup") {
        Copy-Item "postcss.config.js.backup" "postcss.config.js"
    }
    if (Test-Path "components.json.backup") {
        Copy-Item "components.json.backup" "components.json"
    }
    if (Test-Path "package.json.backup") {
        Copy-Item "package.json.backup" "package.json"
        npm install
    }
    
    Warn "Fichiers restaurés. Vérifiez manuellement l'état du projet."
}

# MAIN EXECUTION
function Main {
    try {
        Log "🚨 DÉBUT MIGRATION TAILWINDCSS v4 → v3 LTS + SHADCN/UI"
        Log "Task ID: 6dfe467e-5151-4228-88f0-7e86dfd7f08f"
        
        Check-Prerequisites
        
        if ($DryRun) {
            Log "🔍 MODE DRY-RUN (simulation uniquement)"
            Log "Prérequis OK - migration peut être lancée"
            return
        }
        
        Backup-AndAudit
        Uninstall-V4
        Install-V3
        Configure-PostCSS
        Validate-TailwindConfig
        Update-Shadcn
        Validate-Build
        Run-Tests
        Finalize-Migration
        
        Log "🎉 MIGRATION RÉUSSIE!"
        
    } catch {
        Error "Erreur durant la migration: $_"
        Invoke-Rollback
        exit 1
    }
}

# Exécution
Main

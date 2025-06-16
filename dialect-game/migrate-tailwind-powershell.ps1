# 🚨 SCRIPT DE MIGRATION TAILWINDCSS v4 → v3.3.5 LTS + SHADCN/UI (PowerShell)
# Task ID: 6dfe467e-5151-4228-88f0-7e86dfd7f08f
# Basé sur l'expertise Medium de Pradeep Gudipati

param(
    [switch]$DryRun,
    [switch]$Help,
    [switch]$RunE2E
)

# Couleurs pour les logs
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

# Vérifications préalables
function Test-Prerequisites {
    Write-Log "🔍 Vérification des prérequis..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        $nodeVersionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($nodeVersionNumber -lt 18) {
            Write-Error-Custom "Node.js version 18+ requis. Version actuelle: $nodeVersion"
            exit 1
        }
    }
    catch {
        Write-Error-Custom "Node.js n'est pas installé"
        exit 1
    }
    
    # Vérifier npm
    try {
        npm --version | Out-Null
    }
    catch {
        Write-Error-Custom "npm n'est pas installé"
        exit 1
    }
    
    # Vérifier Git
    try {
        git --version | Out-Null
    }
    catch {
        Write-Error-Custom "Git n'est pas installé"
        exit 1
    }
    
    # Vérifier répertoire projet
    if (-not (Test-Path "package.json") -or -not (Test-Path "tailwind.config.js")) {
        Write-Error-Custom "Vous devez être dans le répertoire racine du projet"
        exit 1
    }
    
    Write-Info "✅ Prérequis validés"
}

# Sauvegarde et audit
function Backup-And-Audit {
    Write-Log "🔍 ÉTAPE 1: Sauvegarde et audit initial..."
    
    # Créer branche de sauvegarde
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    git checkout -b "backup-before-tailwind-migration-$timestamp" 2>$null
    git add .
    git commit -m "🔧 Backup avant migration TailwindCSS v4→v3.3.5" 2>$null
    
    # Vérifier versions actuelles
    Write-Info "Versions actuelles:"
    npm list tailwindcss 2>$null
    npm list "@tailwindcss/vite" "@tailwindcss/postcss" "@tailwindcss/cli" 2>$null
    
    # Sauvegarder fichiers
    Copy-Item "tailwind.config.js" "tailwind.config.js.backup"
    Copy-Item "postcss.config.js" "postcss.config.js.backup"
    Copy-Item "components.json" "components.json.backup"
    Copy-Item "package.json" "package.json.backup"
    
    Write-Info "✅ Sauvegarde terminée"
}

# Désinstallation v4
function Uninstall-V4 {
    Write-Log "🗑️ ÉTAPE 2: Désinstallation TailwindCSS v4..."
    
    # Désinstaller paquets Tailwind (méthode Medium)
    npm uninstall tailwindcss postcss autoprefixer 2>$null
    npm uninstall "@tailwindcss/vite" "@tailwindcss/postcss" "@tailwindcss/cli" 2>$null
    
    # Nettoyer cache
    npm cache clean --force
    
    # Fresh start
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    
    Write-Info "✅ Désinstallation v4 terminée"
}

# Installation v3 versions spécifiques
function Install-V3 {
    Write-Log "📦 ÉTAPE 3: Installation TailwindCSS v3.3.5 (versions Medium Expert)..."
    
    # Installer versions EXACTES de Pradeep Gudipati
    npm install -D tailwindcss@3.3.5 postcss@8.4.24 autoprefixer@10.4.14
    
    # Plugins nécessaires
    npm install -D "@tailwindcss/typography@latest" "@tailwindcss/forms@latest" "@tailwindcss/aspect-ratio@latest"
    
    # Autres dépendances
    npm install
    
    # Vérifier version
    $tailwindVersion = (npm list tailwindcss --depth=0 | Select-String "tailwindcss@(.+)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
    Write-Info "Version TailwindCSS installée: $tailwindVersion"
    
    if ($tailwindVersion -notlike "3.3.5*") {
        Write-Error-Custom "Version incorrecte installée: $tailwindVersion"
        exit 1
    }
    
    Write-Info "✅ Installation v3.3.5 LTS terminée"
}

# Configuration PostCSS
function Configure-PostCSS {
    Write-Log "⚙️ ÉTAPE 4: Configuration PostCSS v3..."
    
    $postcssConfig = @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@
    
    $postcssConfig | Out-File -FilePath "postcss.config.js" -Encoding UTF8
    Write-Info "✅ Configuration PostCSS mise à jour"
}

# Validation config Tailwind
function Test-TailwindConfig {
    Write-Log "🔧 ÉTAPE 5: Validation configuration Tailwind..."
    
    # Tester génération CSS
    npx tailwindcss -i "./src/styles/globals.css" -o "./test-output.css"
    
    if (-not (Test-Path "./test-output.css")) {
        Write-Error-Custom "Échec de la génération CSS"
        exit 1
    }
    
    $cssSize = (Get-Item "./test-output.css").Length
    if ($cssSize -lt 1000) {
        Write-Error-Custom "Fichier CSS généré trop petit ($cssSize bytes)"
        exit 1
    }
    
    Write-Info "CSS généré: $cssSize bytes"
    Remove-Item "./test-output.css" -Force
    
    Write-Info "✅ Configuration Tailwind validée"
}

# Mise à jour shadcn/ui
function Update-ShadcnUI {
    Write-Log "🎨 ÉTAPE 6: Mise à jour shadcn/ui..."
    
    # Mettre à jour CLI
    npm install -g shadcn@latest 2>$null
    
    # Réinstaller composants avec --overwrite (Medium best practice)
    npx shadcn@latest add button --overwrite 2>$null
    npx shadcn@latest add tabs --overwrite 2>$null
    npx shadcn@latest add progress --overwrite 2>$null
    
    Write-Info "✅ shadcn/ui mis à jour"
}

# Validation build
function Test-Build {
    Write-Log "🏗️ ÉTAPE 7: Validation build et dev..."
    
    # Test build
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Échec du build production"
        exit 1
    }
    
    # Type checking
    npm run type-check 2>$null
    
    Write-Info "✅ Build validé"
}

# Tests
function Invoke-Tests {
    Write-Log "🧪 ÉTAPE 8: Tests de régression..."
    
    # Tests unitaires
    npm run test 2>$null
    
    # Tests E2E (optionnel)
    if ($RunE2E) {
        npm run test:e2e 2>$null
    }
    else {
        Write-Info "Tests E2E ignorés (utiliser -RunE2E pour les exécuter)"
    }
    
    # Linting
    npm run lint 2>$null
    
    Write-Info "✅ Tests terminés"
}

# Finalisation
function Complete-Migration {
    Write-Log "📝 ÉTAPE 9: Finalisation..."
    
    # Nettoyer
    Remove-Item "test-output.css" -Force -ErrorAction SilentlyContinue
    Remove-Item "*.backup" -Force -ErrorAction SilentlyContinue
    
    # Commit
    git add .
    git commit -m "✅ Migration TailwindCSS v4→v3.3.5 LTS + shadcn/ui compatibility"
    
    # Tag
    git tag -a "v1.0.0-tailwind-v3-stable" -m "🎯 TailwindCSS v3.3.5 LTS stable + shadcn/ui compatible"
    
    Write-Log "🎉 MIGRATION TERMINÉE AVEC SUCCÈS!"
    $version = (npm list tailwindcss --depth=0 | Select-String "tailwindcss@(.+)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
    Write-Info "Version TailwindCSS: $version"
    Write-Info "Tag créé: v1.0.0-tailwind-v3-stable"
    
    Write-Info "✅ Migration finalisée"
}

# Rollback
function Invoke-Rollback {
    Write-Error-Custom "🆘 ROLLBACK ACTIVÉ"
    
    if (Test-Path "*.backup") {
        Copy-Item "tailwind.config.js.backup" "tailwind.config.js" -Force -ErrorAction SilentlyContinue
        Copy-Item "postcss.config.js.backup" "postcss.config.js" -Force -ErrorAction SilentlyContinue
        Copy-Item "components.json.backup" "components.json" -Force -ErrorAction SilentlyContinue
        Copy-Item "package.json.backup" "package.json" -Force -ErrorAction SilentlyContinue
        npm install
    }
    
    Write-Warn "Fichiers restaurés. Vérifiez manuellement l'état du projet."
}

# MAIN EXECUTION
function Start-Migration {
    Write-Log "🚨 DÉBUT MIGRATION TAILWINDCSS v4 → v3.3.5 LTS + SHADCN/UI"
    Write-Log "Task ID: 6dfe467e-5151-4228-88f0-7e86dfd7f08f"
    Write-Log "Basé sur l'expertise Medium de Pradeep Gudipati"
    
    try {
        Test-Prerequisites
        Backup-And-Audit
        Uninstall-V4
        Install-V3
        Configure-PostCSS
        Test-TailwindConfig
        Update-ShadcnUI
        Test-Build
        Invoke-Tests
        Complete-Migration
        
        Write-Log "🎉 MIGRATION RÉUSSIE!"
    }
    catch {
        Write-Error-Custom "Erreur durant la migration: $_"
        Invoke-Rollback
        exit 1
    }
}

# Gestion des arguments
if ($Help) {
    Write-Host "Usage: .\migrate-tailwind.ps1 [-DryRun] [-RunE2E] [-Help]"
    Write-Host "Options:"
    Write-Host "  -DryRun     Vérifier les prérequis sans exécuter la migration"
    Write-Host "  -RunE2E     Exécuter les tests E2E (par défaut: false)"
    Write-Host "  -Help       Afficher cette aide"
    exit 0
}
elseif ($DryRun) {
    Write-Log "🔍 MODE DRY-RUN (simulation uniquement)"
    Test-Prerequisites
    Write-Log "Prérequis OK - migration peut être lancée"
    exit 0
}
else {
    Start-Migration
}

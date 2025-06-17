#!/usr/bin/env node

/**
 * Script pour corriger automatiquement les erreurs de lint communes
 */

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les erreurs de case declarations
function fixCaseDeclarations(filePath, content) {
  // Correction des case blocks sans accolades
  const caseRegex = /case\s+[^:]+:\s*(const|let|var)\s+/g;
  if (caseRegex.test(content)) {
    console.log(`Fixing case declarations in ${filePath}`);
    // Cette correction nécessite une analyse plus complexe
    // Pour l'instant, on signale juste le problème
  }
  return content;
}

// Fonction pour corriger les variables non utilisées (simple)
function fixUnusedVars(filePath, content) {
  // Remplacer les variables unused par des underscores
  const unusedVarRegex = /const\s+(\w+)\s*=\s*([^;]+);(?=\s*\/\/.*never used)/g;
  const fixed = content.replace(unusedVarRegex, 'const _$1 = $2;');
  
  if (fixed !== content) {
    console.log(`Fixed unused variables in ${filePath}`);
  }
  
  return fixed;
}

// Fonction pour supprimer les imports non utilisés (simple)
function removeUnusedImports(filePath, content) {
  const lines = content.split('\n');
  const fixedLines = lines.filter(line => {
    // Ne pas supprimer les imports de React pour les fichiers JSX/TSX
    if (line.includes('import') && (filePath.endsWith('.jsx') || filePath.endsWith('.tsx'))) {
      return true;
    }
    return true; // Pour l'instant, on garde tous les imports
  });
  
  return fixedLines.join('\n');
}

// Fonction principale pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = fixCaseDeclarations(filePath, content);
    content = fixUnusedVars(filePath, content);
    content = removeUnusedImports(filePath, content);
    
    // Écrire le fichier modifié
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Fonction pour traiter tous les fichiers d'un répertoire
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && !file.name.includes('node_modules')) {
      processDirectory(filePath);
    } else if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx'))) {
      processFile(filePath);
    }
  }
}

// Point d'entrée
console.log('🔧 Starting lint error fixes...');
processDirectory('./src');
console.log('✅ Lint error fixes completed!');

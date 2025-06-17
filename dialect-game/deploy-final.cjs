#!/usr/bin/env node

/**
 * Script de validation finale avant déploiement
 * Vérifie que tous les éléments sont prêts pour la production
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 VALIDATION FINALE POUR DÉPLOIEMENT\n');

// Vérifications des fichiers critiques
const checks = [
  {
    name: 'Build directory exists',
    check: () => fs.existsSync('./dist'),
    required: true
  },
  {
    name: 'Index.html built',
    check: () => fs.existsSync('./dist/index.html'),
    required: true
  },
  {
    name: 'CSS assets generated',
    check: () => fs.readdirSync('./dist/assets/css').length > 0,
    required: true
  },
  {
    name: 'JS assets generated',
    check: () => fs.readdirSync('./dist/assets/js').length > 0,
    required: true
  },
  {
    name: 'PWA Manifest',
    check: () => fs.existsSync('./dist/manifest.json'),
    required: true
  },
  {
    name: 'Service Worker',
    check: () => fs.existsSync('./dist/sw.js'),
    required: true
  },
  {
    name: 'Netlify config',
    check: () => fs.existsSync('./netlify.toml'),
    required: false
  },
  {
    name: 'Vercel config',
    check: () => fs.existsSync('./vercel.json'),
    required: false
  },
  {
    name: 'Deployment guide',
    check: () => fs.existsSync('./DEPLOYMENT.md'),
    required: false
  }
];

let allPassed = true;
let criticalPassed = true;

console.log('📋 CHECKLIST DE VALIDATION:\n');

checks.forEach(({ name, check, required }) => {
  try {
    const passed = check();
    const status = passed ? '✅' : '❌';
    const requirement = required ? '[REQUIS]' : '[OPTIONNEL]';
    
    console.log(`${status} ${name} ${requirement}`);
    
    if (!passed) {
      allPassed = false;
      if (required) {
        criticalPassed = false;
      }
    }
  } catch (error) {
    console.log(`❌ ${name} [REQUIS] - ERREUR: ${error.message}`);
    allPassed = false;
    if (required) {
      criticalPassed = false;
    }
  }
});

// Analyse des tailles de bundle
console.log('\n📊 ANALYSE DES BUNDLES:\n');

try {
  const distSize = getDirectorySize('./dist');
  const cssFiles = fs.readdirSync('./dist/assets/css');
  const jsFiles = fs.readdirSync('./dist/assets/js');
  
  console.log(`📦 Taille totale du build: ${formatBytes(distSize)}`);
  console.log(`🎨 Fichiers CSS: ${cssFiles.length}`);
  console.log(`⚙️  Fichiers JS: ${jsFiles.length}`);
  
  // Vérification taille optimale
  const maxSizeRecommended = 10 * 1024 * 1024; // 10MB
  if (distSize < maxSizeRecommended) {
    console.log('✅ Taille du bundle optimale');
  } else {
    console.log('⚠️  Bundle volumineux - considérer optimisations');
  }
  
} catch (error) {
  console.log('❌ Erreur analyse bundles:', error.message);
}

// Résumé final
console.log('\n🎯 RÉSUMÉ FINAL:\n');

if (criticalPassed) {
  console.log('✅ TOUS LES ÉLÉMENTS CRITIQUES SONT PRÊTS');
  console.log('🚀 APPLICATION PRÊTE POUR LE DÉPLOIEMENT PRODUCTION\n');
  
  console.log('📋 ÉTAPES SUIVANTES:');
  console.log('1. git add .');
  console.log('2. git commit -m "Production deployment ready"');
  console.log('3. git push origin main');
  console.log('4. Déployer sur Netlify/Vercel (voir DEPLOYMENT.md)\n');
  
  console.log('🌐 OPTIONS DE DÉPLOIEMENT:');
  console.log('• Netlify: https://netlify.com (recommandé)');
  console.log('• Vercel: https://vercel.com');
  console.log('• GitHub Pages: Via Actions\n');
  
  process.exit(0);
} else {
  console.log('❌ ÉLÉMENTS CRITIQUES MANQUANTS');
  console.log('⚠️  Corrigez les erreurs avant le déploiement\n');
  process.exit(1);
}

// Fonctions utilitaires
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stat = fs.statSync(itemPath);
    if (stat.isFile()) {
      totalSize += stat.size;
    } else if (stat.isDirectory()) {
      const items = fs.readdirSync(itemPath);
      items.forEach(item => {
        calculateSize(path.join(itemPath, item));
      });
    }
  }
  
  calculateSize(dirPath);
  return totalSize;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
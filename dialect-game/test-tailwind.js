#!/usr/bin/env node

/**
 * Script de test pour valider la configuration Tailwind CSS
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Test de configuration Tailwind CSS...\n');

// Vérifier les fichiers de configuration
const configFiles = [
  'tailwind.config.js',
  'postcss.config.js',
  'src/styles/globals.css'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Trouvé`);
  } else {
    console.log(`❌ ${file} - Manquant`);
  }
});

// Vérifier les dépendances dans package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'tailwindcss',
  'postcss',
  'autoprefixer'
];

const requiredDevDeps = [
  'tailwindcss-animate',
  '@tailwindcss/typography',
  '@tailwindcss/forms',
  '@tailwindcss/aspect-ratio'
];

console.log('\n📦 Vérification des dépendances...');
requiredDeps.forEach(dep => {
  if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
    console.log(`✅ ${dep} - Installé`);
  } else {
    console.log(`❌ ${dep} - Manquant`);
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies?.[dep]) {
    console.log(`✅ ${dep} - Installé`);
  } else {
    console.log(`⚠️  ${dep} - Recommandé mais manquant`);
  }
});

console.log('\n🎯 Configuration terminée ! Vous pouvez maintenant :\n');
console.log('1. Lancer le serveur de développement : npm run dev');
console.log('2. Tester les classes Tailwind dans vos composants');
console.log('3. Vérifier que le CSS est généré correctement\n');

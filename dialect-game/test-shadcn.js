#!/usr/bin/env node

/**
 * Script de test complet pour shadcn/ui + Tailwind CSS v3
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Test complet shadcn/ui + Tailwind CSS v3...\n');

// Vérifier les fichiers de configuration
const configFiles = [
  'components.json',
  'tailwind.config.js',
  'postcss.config.js',
  'src/styles/globals.css',
  'src/lib/utils.ts'
];

console.log('📋 Vérification des fichiers de configuration...');
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Trouvé`);
  } else {
    console.log(`❌ ${file} - Manquant`);
  }
});

// Vérifier les composants UI installés
const uiComponents = [
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/textarea.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/alert.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/skeleton.tsx'
];

console.log('\n🧩 Vérification des composants UI...');
let componentCount = 0;
uiComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${path.basename(component)} - Installé`);
    componentCount++;
  } else {
    console.log(`❌ ${path.basename(component)} - Manquant`);
  }
});

// Vérifier les dépendances dans package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'tailwindcss',
  'postcss',
  'autoprefixer',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'lucide-react',
  '@radix-ui/react-slot'
];

console.log('\n📦 Vérification des dépendances...');
let depCount = 0;
requiredDeps.forEach(dep => {
  if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
    console.log(`✅ ${dep} - Installé`);
    depCount++;
  } else {
    console.log(`❌ ${dep} - Manquant`);
  }
});

// Rapport final
console.log('\n📊 Rapport de configuration :');
console.log(`├── Fichiers de config : ${configFiles.filter(f => fs.existsSync(f)).length}/${configFiles.length}`);
console.log(`├── Composants UI : ${componentCount}/${uiComponents.length}`);
console.log(`└── Dépendances : ${depCount}/${requiredDeps.length}`);

const totalScore = (
  (configFiles.filter(f => fs.existsSync(f)).length / configFiles.length) * 40 +
  (componentCount / uiComponents.length) * 40 +
  (depCount / requiredDeps.length) * 20
);

console.log(`\n🎯 Score de configuration : ${Math.round(totalScore)}%\n`);

if (totalScore >= 95) {
  console.log('🎉 Configuration PARFAITE ! Tout est prêt pour le développement.');
  console.log('\n🚀 Prochaines étapes :');
  console.log('1. Visitez http://localhost:5174/ pour voir l\'application');
  console.log('2. Testez les composants sur /components-test');
  console.log('3. Consultez SHADCN-UI-GUIDE.md pour la documentation');
} else if (totalScore >= 80) {
  console.log('✅ Configuration BONNE ! Quelques éléments mineurs à ajuster.');
} else {
  console.log('⚠️  Configuration INCOMPLÈTE ! Vérifiez les éléments manquants.');
}

console.log('\n📚 Documentation disponible :');
console.log('├── SHADCN-UI-GUIDE.md - Guide complet d\'utilisation');
console.log('├── TAILWIND-CONFIG-GUIDE.md - Configuration Tailwind');
console.log('└── https://ui.shadcn.com/ - Documentation officielle');

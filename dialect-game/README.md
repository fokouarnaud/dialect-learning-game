# 🎮 Dialect Learning Game

Un jeu éducatif moderne et interactif pour apprendre les dialectes et langues, construit avec React, TypeScript, TailwindCSS et des APIs gratuites.

![Dialect Game](https://img.shields.io/badge/Status-Operational-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New%20York-000000)

## ✨ Fonctionnalités

### 🌍 Multilingue et Traduction
- **15+ langues supportées** avec traduction automatique
- **API Dictionary** gratuite pour définitions, phonétique et audio
- **LibreTranslate** pour traduction en temps réel
- **Détection automatique** de langue

### 🎯 Gameplay Moderne
- **Quiz interactifs** générés automatiquement
- **3 niveaux de difficulté** (Easy/Medium/Hard)
- **Timer dynamique** adapté à la complexité
- **Système de score** avec progression et célébrations
- **Support vocal** pour pronunciations

### 🎨 Interface Moderne
- **Design moderne** avec shadcn/ui (style "New York")
- **4 thèmes visuels** : Classic, Modern, Nature, Neon
- **Dark/Light mode** automatique
- **Responsive design** mobile-first
- **Accessibilité WCAG 2.1** native

### 🖼️ Assets Dynamiques
- **Images thématiques** via Unsplash et Pexels
- **Lazy loading** avec Intersection Observer
- **Fallbacks intelligents** (toujours des images disponibles)
- **Optimisations** WebP et cache

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Setup Rapide
```bash
# Cloner le repository
git clone <your-repo-url>
cd dialect-game

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:5174/
```

### Scripts Disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run test         # Tests unitaires
npm run test:e2e     # Tests E2E (Playwright)
npm run type-check   # Vérification TypeScript
```

## 🎮 Utilisation

### Démarrage du Jeu
1. **Ouvrir** l'application sur `http://localhost:5174/`
2. **Sélectionner** les langues source et cible
3. **Choisir** la difficulté (Easy/Medium/Hard)
4. **Optionnel** : Ajouter des mots personnalisés
5. **Commencer** le quiz interactif !

### Interface Principale
- **Sélecteur de langues** : Interface moderne avec flags
- **Quiz interactif** : Questions générées automatiquement
- **Galerie d'images** : Images thématiques pour contexte
- **Système de score** : Progression et statistiques
- **Settings** : Personnalisation des thèmes

## 🎨 Personnalisation

### Changer les Thèmes
Les thèmes sont configurés dans `src/styles/theme.ts` :

```typescript
export const themes = {
  classic: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    // ...
  },
  modern: {
    primary: '#10B981',
    secondary: '#F59E0B',
    // ...
  }
  // Ajouter vos thèmes personnalisés
}
```

### Modifier les APIs
Configuration dans `src/services/api/` :

```typescript
// Dictionary API
const DICTIONARY_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/';

// LibreTranslate API  
const TRANSLATE_BASE_URL = 'https://libretranslate.de/translate';

// Unsplash API (images)
const UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';
```

### Ajouter des Langues
Dans `src/services/api/translateApi.ts` :

```typescript
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  // Ajouter vos langues
];
```

## 🏗️ Architecture

### Stack Technique
- **Frontend** : React 18 + TypeScript
- **Build** : Vite 6.x
- **Styling** : TailwindCSS 4.x + shadcn/ui
- **Tests** : Vitest + Playwright
- **APIs** : Free Dictionary API + LibreTranslate + Unsplash/Pexels

### Structure du Projet
```
dialect-game/
├── src/
│   ├── components/          # Composants React
│   │   ├── ui/             # shadcn/ui components
│   │   └── game/           # Composants spécifiques au jeu
│   ├── services/           # Services API
│   │   └── api/            # Intégrations APIs externes
│   ├── hooks/              # Custom React hooks
│   ├── types/              # Définitions TypeScript
│   ├── styles/             # Styles et thèmes
│   └── utils/              # Utilitaires
├── tests/
│   ├── unit/               # Tests unitaires
│   └── e2e/                # Tests E2E
└── docs/                   # Documentation
```

### Composants Principaux

#### QuizComponent
Quiz interactif avec timer et feedback :
```typescript
<QuizComponent
  sourceLanguage="en"
  targetLanguage="fr"
  difficulty="medium"
  customWords={['hello', 'world']}
  onScoreUpdate={(score) => console.log(score)}
/>
```

#### LanguageSelector
Sélecteur de langues moderne :
```typescript
<LanguageSelector
  value={selectedLanguage}
  onChange={setSelectedLanguage}
  supportedLanguages={SUPPORTED_LANGUAGES}
/>
```

#### ImageGallery
Galerie d'images thématiques :
```typescript
<ImageGallery
  theme="nature"
  count={6}
  onImageSelect={(image) => console.log(image)}
/>
```

## 🧪 Tests

### Tests Unitaires
```bash
npm run test                 # Tous les tests
npm run test:watch          # Mode watch
npm run test:coverage       # Avec coverage
```

**Statistiques actuelles** : 285/361 tests passent (79%)

### Tests E2E
```bash
npm run test:e2e            # Tests Playwright
npm run test:e2e:headed     # Mode headed
npm run test:e2e:debug      # Mode debug
```

**Statistiques actuelles** : 124/404 tests passent (31%)

### Écrire des Tests
```typescript
// Test unitaire exemple
import { render, screen } from '@testing-library/react';
import { QuizComponent } from '../QuizComponent';

test('should render quiz with questions', () => {
  render(<QuizComponent sourceLanguage="en" targetLanguage="fr" />);
  expect(screen.getByText(/quiz/i)).toBeInTheDocument();
});
```

## 🌐 APIs Utilisées

### Free Dictionary API
- **URL** : `https://api.dictionaryapi.dev/`
- **Usage** : Définitions, phonétique, audio
- **Gratuite** : Oui, pas de clé requise
- **Limitations** : Rate limiting léger

### LibreTranslate
- **URL** : `https://libretranslate.de/`
- **Usage** : Traduction multilingue
- **Gratuite** : Oui, pas de clé requise
- **Limitations** : Rate limiting modéré

### Unsplash API
- **URL** : `https://api.unsplash.com/`
- **Usage** : Images de haute qualité
- **Gratuite** : Oui, clé demo incluse
- **Limitations** : 50 requêtes/heure

### Pexels API (Fallback)
- **URL** : `https://api.pexels.com/`
- **Usage** : Images de fallback
- **Gratuite** : Oui, clé demo incluse
- **Limitations** : 200 requêtes/heure

## 🎯 Performance

### Optimisations Appliquées
- **Lazy loading** pour images et composants
- **Cache intelligent** pour toutes les APIs
- **Bundle splitting** automatique avec Vite
- **Tree shaking** pour CSS et JavaScript
- **WebP optimization** pour images

### Métriques Cibles
- **Chargement initial** : <3s
- **Time to Interactive** : <2s
- **Bundle size** : <2MB gzipped
- **Lighthouse Score** : >90

## ♿ Accessibilité

### Standards Respectés
- **WCAG 2.1 Level AA** compliance
- **ARIA labels** automatiques via Radix UI
- **Navigation clavier** complète
- **Screen reader** support
- **Contraste couleurs** optimisé
- **Focus management** approprié

### Tests d'Accessibilité
```bash
npm run test:a11y           # Tests accessibilité
npm run lighthouse          # Audit Lighthouse
```

## 🔧 Développement

### Variables d'Environnement
Créer un fichier `.env.local` :
```env
# APIs (optionnelles, fallbacks inclus)
VITE_UNSPLASH_ACCESS_KEY=your_key_here
VITE_PEXELS_API_KEY=your_key_here

# Configuration
VITE_APP_TITLE=Dialect Learning Game
VITE_DEFAULT_LANGUAGE=en
```

### Configuration TailwindCSS
Le projet utilise TailwindCSS 4.x avec shadcn/ui :
```javascript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        // Variables shadcn/ui
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

### Hooks Personnalisés
```typescript
// useGameEngine - Logique de jeu
const { score, level, startGame } = useGameEngine();

// useVoiceService - Reconnaissance vocale
const { isListening, transcript, startListening } = useVoiceService();

// useLazyLoading - Chargement différé
const { ref, isIntersecting } = useLazyLoading();
```

## 📦 Déploiement

### Build de Production
```bash
npm run build               # Génère dist/
npm run preview            # Prévisualise le build
```

### Déploiement Vercel
```bash
npm install -g vercel
vercel
```

### Déploiement Netlify
```bash
npm run build
# Uploade le dossier dist/
```

### Docker (optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contribution

### Setup Développement
```bash
git clone <repo>
cd dialect-game
npm install
npm run dev
```

### Standards Code
- **TypeScript strict** mode
- **ESLint + Prettier** configurés
- **Conventional Commits**
- **Tests requis** pour nouvelles fonctionnalités

### Workflow Git
```bash
git checkout -b feature/nouvelle-fonctionnalite
# Développer + tests
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
# Créer Pull Request
```

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **shadcn/ui** pour les composants modernes
- **Free Dictionary API** pour les définitions
- **LibreTranslate** pour les traductions
- **Unsplash & Pexels** pour les images
- **Community React** pour l'écosystème

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions** : [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation** : [Docs](./docs/)

---

**Créé avec ❤️ en utilisant React, TypeScript, TailwindCSS et shadcn/ui**

*L'apprentissage des langues n'a jamais été aussi moderne et accessible !*

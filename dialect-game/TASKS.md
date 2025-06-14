# DIALECT LEARNING GAME - MODERNIZATION TASKS

## 🎯 PROJECT OVERVIEW

**Mission**: Moderniser le Dialect Learning Game en intégrant TailwindCSS, un système de thème moderne, des APIs gratuites pour le contenu dynamique, et un système d'assets placeholder, tout en maintenant les principes TDD et la facilité de modification.

**Architecture**: React + TypeScript + Vite + TailwindCSS + APIs gratuites + Tests E2E (Playwright)

**Méthologie**: Test-Driven Development (TDD) avec approche progressive et modulaire

---

## 📋 TASK LIST & PROGRESS

### ✅ COMPLETED TASKS
*None yet - Ready to start implementation!*

### 🔄 IN PROGRESS

#### **Task 1: Configuration TailwindCSS et système de design**
- **ID**: `c5e6927f-a00e-4283-a89a-9ed86694a04e`
- **Status**: 🔄 In Progress
- **Dependencies**: None (Foundation task)
- **Priority**: Critical (Blocker for all UI tasks)

### 📋 PENDING TASKS

#### **Task 1.5: Intégration shadcn/ui - Setup et composants base** ⚡
- **ID**: `0dfbf418-953f-4774-888e-74272c2bed42`
- **Dependencies**: Task 1 (TailwindCSS Configuration)
- **Priority**: Critical (Design System Foundation)

#### **Task 2: Refonte UI moderne avec TailwindCSS - Composants base**
- **ID**: `8dd5b0a9-8f72-46a9-8bf6-bfcaff0395cd`
- **Dependencies**: Task 1.5 (shadcn/ui Setup)
- **Priority**: High

#### **Task 3: Intégration APIs gratuites pour contenu dynamique**
- **ID**: `a6b982b0-494d-45f5-8cd7-ea4994277b81`
- **Dependencies**: Task 1 (TailwindCSS Configuration)
- **Priority**: High

#### **Task 4: Système d'assets placeholder avec lazy loading**
- **ID**: `34ca0466-17ad-4163-b2e9-c85f5e8cce46`
- **Dependencies**: Task 2 (UI Components)
- **Priority**: Medium

#### **Task 5: Tests TDD pour nouveaux composants UI**
- **ID**: `b11ecbef-d8ec-401f-928f-df2a8cd98665`
- **Dependencies**: Task 3 (APIs) + Task 4 (Assets)
- **Priority**: High

#### **Task 6: Documentation et guide de personnalisation**
- **ID**: `f09fe456-f9b4-43bd-a0e6-ce99006beaf2`
- **Dependencies**: Task 5 (Tests)
- **Priority**: Medium

#### **Task 7: Optimisation performance et bundle final**
- **ID**: `d85195f1-aeef-4b80-8325-6e29611fd24c`
- **Dependencies**: Task 6 (Documentation)
- **Priority**: Medium

---

## 📖 DETAILED TASK SPECIFICATIONS

### **Task 1: Configuration TailwindCSS et système de design** ⚡

**Objective**: Intégrer TailwindCSS dans le projet existant, configurer un système de design tokens pour les couleurs, typographie et espacements. Créer une architecture de thème configurable avec support dark/light mode et variants personnalisés.

#### 🎯 Implementation Guide (Basé sur Documentation Officielle Context7)

**CHOIX D'APPROCHE** : Nous utilisons l'approche PostCSS moderne (recommandée pour Vite+React+TS) :

1. **Setup Dependencies - MISE À JOUR CRITIQUE ⚠️**
   ```bash
   # NOUVELLE approche TailwindCSS v4+ selon Context7 (CORRIGÉE)
   npm install -D tailwindcss @tailwindcss/postcss autoprefixer
   npm install -D @tailwindcss/forms @tailwindcss/typography
   
   # ERREUR DÉTECTÉE: Plugin PostCSS séparé dans v4+
   # Plus besoin d'importer 'tailwindcss' directement dans PostCSS
   ```

2. **PostCSS Configuration - ✅ CORRIGÉE selon Context7**
   ```javascript
   // postcss.config.js - NOUVELLE configuration v4+
   import autoprefixer from 'autoprefixer'
   
   export default {
     plugins: [
       "@tailwindcss/postcss", // Plugin séparé dans v4+
       autoprefixer,
     ],
   }
   ```

3. **Configure tailwind.config.js** - Mode ES Modules moderne
   ```typescript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     theme: {
       extend: {
         // Design tokens personnalisés
       },
     },
     plugins: [],
   } satisfies Config
   ```

4. **CSS Import - Simplifié selon Context7**
   ```css
   /* src/styles/globals.css - Import moderne */
   @tailwind base;
   @tailwind components; 
   @tailwind utilities;
   
   /* Alternative v4+ future: @import "tailwindcss"; */
   ```

5. **Alternative Vite Plugin** (optionnelle, plus performante) :
   ```typescript
   // vite.config.ts - Si migration souhaitée
   import { defineConfig } from "vite";
   import tailwindcss from "@tailwindcss/vite";
   
   export default defineConfig({
     plugins: [tailwindcss()]
   });
   ```

6. **Test compatibilité** avec tests existants

#### 🚨 ERREUR RÉSOLUE (Context7 Validation)
**PROBLÈME** : `[postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin`

**CAUSE** : TailwindCSS v4+ a déplacé le plugin PostCSS vers `@tailwindcss/postcss`

**SOLUTION** :
1. ✅ Installation : `npm install @tailwindcss/postcss@latest`
2. ✅ Configuration : `"@tailwindcss/postcss"` dans postcss.config.js
3. ✅ Suppression : Import direct `tailwindcss` dans PostCSS

**RÉFÉRENCE** : Documentation officielle TailwindCSS v4.1 via Context7

#### 📁 Related Files
- `tailwind.config.js` (CREATE): Configuration TailwindCSS avec design tokens
- `src/styles/theme.ts` (CREATE): Configuration centralisée des thèmes
- `src/styles/globals.css` (CREATE): Styles globaux avec TailwindCSS
- `postcss.config.js` (CREATE): Configuration PostCSS
- `package.json` (TO_MODIFY): Ajout dépendances TailwindCSS
- `src/components/ThemeProvider.tsx` (CREATE): React context pour thèmes

#### ✅ Verification Criteria (Mise à jour selon Context7)
- [ ] TailwindCSS fonctionne avec Vite sans erreurs de compilation
- [ ] Thèmes configurables via interface TypeScript stricte
- [ ] Dark/light mode switching fonctionnel avec CSS variables
- [ ] Tous les tests existants passent (régression check)
- [ ] Documentation claire pour modifier les thèmes (avec exemples TypeScript)
- [ ] Performance CSS optimisée (purge classes inutilisées, bundle <50KB)
- [ ] **BONUS Context7**: Configuration ES Modules moderne validée
- [ ] **OPTION**: Migration vers @tailwindcss/vite plugin évaluée

#### 🚨 Notes Spéciales (Enrichies par Context7)
- **CRITICAL**: Préserver tous les tests existants
- **APPROCHE VALIDÉE**: PostCSS + ES Modules (votre config actuelle) ✅
- **ALTERNATIVE PERFORMANCE**: Plugin Vite direct disponible selon docs v4.1
- **COMPATIBILITÉ**: Support navigateurs Chrome 90+, Firefox 88+, Safari 14+
- **MIGRATION PATH**: Possibilité future vers TailwindCSS v4 + Vite plugin

---

### **Task 1.5: Intégration shadcn/ui - Setup et composants base** 🎨

**Objective**: Installer et configurer shadcn/ui dans le projet pour bénéficier d'un design system moderne. Remplacer les composants UI basiques par des composants shadcn/ui pour éviter de recréer du code et garantir l'accessibilité.

#### 🎯 Implementation Guide (Basé sur Documentation Officielle Context7)

**APPROCHE VALIDÉE** : shadcn/ui + TailwindCSS + Vite + React + TypeScript

1. **Setup shadcn/ui - ÉTAPES OFFICIELLES ✅**
   ```bash
   # Installation et initialisation selon docs officielles
   npx shadcn@latest init
   
   # Configuration automatique via CLI
   # Style: "New York" (moderne et épuré)
   # Base color: "neutral" (compatible avec thème existant)
   # CSS variables: true (pour thèmes dynamiques)
   ```

2. **Configuration components.json** - Setup moderne
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "new-york",
     "rsc": false,
     "tsx": true,
     "tailwind": {
       "config": "tailwind.config.js",
       "css": "src/styles/globals.css",
       "baseColor": "neutral",
       "cssVariables": true
     },
     "aliases": {
       "components": "@/components",
       "utils": "@/lib/utils",
       "ui": "@/components/ui"
     }
   }
   ```

3. **Installation composants base** - Sélection optimale
   ```bash
   # Composants essentiels pour le jeu
   npx shadcn@latest add button card badge input label
   npx shadcn@latest add dropdown-menu tooltip switch
   npx shadcn@latest add dialog alert-dialog
   npx shadcn@latest add progress slider
   ```

4. **Configuration Path Aliases** - vite.config.ts
   ```typescript
   // Intégration avec configuration existante
   import path from "path"
   import { defineConfig } from "vite"
   
   export default defineConfig({
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   })
   ```

5. **Theme Provider Integration** - avec système existant
   ```typescript
   // Fusion avec ThemeProvider.tsx existant
   import { ThemeProvider as ShadcnThemeProvider } from "@/components/theme-provider"
   
   // Intégration dans App.tsx
   <ShadcnThemeProvider defaultTheme="system" storageKey="dialect-game-theme">
     {children}
   </ShadcnThemeProvider>
   ```

6. **Remplacement composants existants**
   - Button → shadcn Button avec variants
   - Card layouts → shadcn Card system
   - Input controls → shadcn Input/Label

7. **Tests de compatibilité** avec système existant

#### 📁 Related Files (Nouveaux + Modifications)
- `components.json` (CREATE): Configuration shadcn/ui selon specs
- `src/components/ui/` (CREATE): Dossier composants shadcn/ui générés
- `src/lib/utils.ts` (CREATE): Utilitaires CN et clsx pour shadcn/ui
- `src/components/ThemeProvider.tsx` (TO_MODIFY): Intégration shadcn theme
- `vite.config.ts` (TO_MODIFY): Path aliases @ pour imports absolus
- `tsconfig.json` (TO_MODIFY): Configuration paths TypeScript
- `package.json` (TO_MODIFY): Dépendances Radix UI et utilitaires

#### ✅ Verification Criteria (Standards shadcn/ui)
- [ ] shadcn/ui CLI installé et configuré correctement
- [ ] components.json configuré pour style moderne "New York"
- [ ] Composants base (Button, Card, Input, etc.) générés et fonctionnels
- [ ] Path aliases @ configurés dans Vite et TypeScript
- [ ] Theme provider shadcn intégré avec système existant
- [ ] Dark/light mode fonctionnel avec nouvelles composants
- [ ] Tous tests existants passent (pas de régression)
- [ ] **BONUS**: Accessibilité ARIA automatique via Radix UI

#### 🚨 Notes Spéciales (Avantages shadcn/ui)
- **ÉCONOMIE DE TEMPS**: +80% composants pré-construits et testés
- **DESIGN MODERNE**: Style "New York" épuré et professionnel
- **ACCESSIBILITÉ AUTO**: Radix UI garantit WCAG 2.1 compliance
- **CUSTOMISATION FACILE**: CSS variables + TailwindCSS
- **MAINTENANCE RÉDUITE**: Communauté active, updates régulières
- **COMPATIBILITÉ**: S'intègre parfaitement avec architecture existante

---

### **Task 2: Refonte UI moderne avec TailwindCSS - Composants base** 🎨

**Objective**: Moderniser les composants React existants (GameCanvas, ScoreDisplay, VoiceInput) avec TailwindCSS et shadcn/ui. Implémenter un design moderne avec animations fluides, glassmorphism, et responsive design mobile-first.

#### 🎯 Implementation Guide (Mise à jour shadcn/ui)
1. **Refactoriser GameCanvas** avec shadcn/ui Cards
   - Canvas responsive dans shadcn Card container
   - Overlay controls avec shadcn Button variants
   - Transitions fluides pour interactions

2. **Moderniser ScoreDisplay** avec shadcn Progress
   - Score counter avec shadcn Badge animations
   - Progress bars avec shadcn Progress component
   - Micro-interactions avec shadcn Tooltip

3. **Redesigner VoiceInput** avec shadcn Button
   - Button states avec shadcn variants (default, outline, ghost)
   - Visual feedback avec shadcn Switch pour toggle
   - Animations avec shadcn Dialog pour états

4. **Utiliser shadcn composants** au lieu de créer custom
   - Button component avec variants prêts
   - Card component avec glassmorphism
   - Badge component pour status
   - Progress pour indicateurs
   - Dialog pour modales

5. **Implémenter animations** avec Framer Motion + shadcn
6. **Optimiser responsive design** mobile-first avec shadcn
7. **Maintenir accessibilité ARIA** automatique via Radix UI

#### 📁 Related Files (Mise à jour shadcn/ui)
- `src/components/GameCanvas.tsx` (TO_MODIFY): Modernisation avec shadcn Card + Button
- `src/components/ScoreDisplay.tsx` (TO_MODIFY): shadcn Progress + Badge components
- `src/components/VoiceInput.tsx` (TO_MODIFY): shadcn Button avec variants + Dialog
- `src/components/ui/` (REFERENCE): Utiliser composants shadcn existants
- `src/App.css` (TO_MODIFY): Migration vers TailwindCSS + shadcn styles

#### ✅ Verification Criteria
- [ ] Design moderne et responsive (mobile-first)
- [ ] Animations fluides sans lag (60fps maintenu)
- [ ] Tous les tests UI existants passent
- [ ] Accessibilité ARIA maintenue et améliorée
- [ ] Performance 60fps conservée sur mobile
- [ ] Support touch et clavier maintenu

#### 🚨 Notes Spéciales (Enrichies par shadcn/ui)
- **CRITICAL**: Conserver toute la logique métier existante
- **ÉCONOMIE**: Utiliser shadcn/ui au lieu de recréer des composants
- **DESIGN COHÉRENT**: Style "New York" moderne et professionnel
- **ACCESSIBILITÉ**: Radix UI garantit WCAG 2.1 automatiquement
- **MAINTENANCE**: Composants maintenus par la communauté shadcn/ui
- **TESTS**: Tester sur mobile ET desktop obligatoire

---

### **Task 3: Intégration APIs gratuites pour contenu dynamique** 🌐

**Objective**: Intégrer des APIs gratuites pour enrichir le contenu : API dictionnaire (Free Dictionary API), traduction (LibreTranslate), et données linguistiques. Créer des services wrapper avec gestion d'erreurs et fallbacks.

#### 🎯 Implementation Guide
1. **Dictionary Service** - Free Dictionary API
   ```typescript
   // Service avec cache local et gestion offline
   class DictionaryService {
     async getDefinition(word: string): Promise<Definition>
     async getExamples(word: string): Promise<Example[]>
   }
   ```

2. **Translation Service** - LibreTranslate
   ```typescript
   class TranslationService {
     async translate(text: string, from: string, to: string): Promise<Translation>
     async detectLanguage(text: string): Promise<Language>
   }
   ```

3. **Language Service** pour données dialectes
4. **Wrapper avec cache local** et gestion offline
5. **Types TypeScript** pour réponses API complètes
6. **Rate limiting** et fallbacks intelligents
7. **Configuration API keys** dans .env

#### 📁 Related Files
- `src/services/DictionaryService.ts` (CREATE): Service API dictionnaire gratuite
- `src/services/TranslationService.ts` (CREATE): Service traduction gratuite
- `src/services/LanguageService.ts` (CREATE): Service données linguistiques
- `src/types/api.ts` (CREATE): Types pour réponses APIs
- `.env.example` (CREATE): Exemple configuration APIs
- `src/config/apis.ts` (CREATE): Configuration centralisée APIs
- `src/utils/cache.ts` (CREATE): Système cache local

#### ✅ Verification Criteria
- [ ] APIs fonctionnelles avec responses typées
- [ ] Cache local efficace (localStorage/IndexedDB)
- [ ] Fallbacks robustes en cas d'échec API
- [ ] Gestion d'erreurs complète avec retry logic
- [ ] Mode offline fonctionnel avec données cached
- [ ] Documentation complète pour changement APIs
- [ ] Rate limiting respecté pour toutes APIs

#### 🚨 Notes Spéciales
- APIs choisies pour être **gratuites et sans clé** requise
- Prévoir mode **offline complet** avec fallbacks
- Documenter clairement comment **changer d'APIs**

---

### **Task 4: Système d'assets placeholder avec lazy loading** 🖼️

**Objective**: Implémenter un système d'assets placeholder utilisant Unsplash API pour images et Pexels API pour vidéos. Créer un service de gestion d'assets avec lazy loading, cache et optimisation performance.

#### 🎯 Implementation Guide
1. **Asset Service** avec Unsplash/Pexels APIs
   ```typescript
   class AssetService {
     async getImage(query: string, size?: Size): Promise<ImageAsset>
     async getVideo(query: string, duration?: number): Promise<VideoAsset>
     async preloadAssets(queries: string[]): Promise<Asset[]>
   }
   ```

2. **Lazy loading** avec Intersection Observer
3. **Cache assets** avec Service Worker/localStorage
4. **Composants optimisés** Image et Video
5. **Placeholder/skeleton** loading states
6. **Configuration facile** pour changer sources
7. **Optimisation formats** (WebP, AVIF)

#### 📁 Related Files
- `src/services/AssetService.ts` (CREATE): Service gestion assets placeholder
- `src/components/ui/LazyImage.tsx` (CREATE): Composant image avec lazy loading
- `src/components/ui/LazyVideo.tsx` (CREATE): Composant vidéo optimisé
- `src/hooks/useLazyLoading.ts` (CREATE): Hook lazy loading réutilisable
- `src/utils/imageOptimization.ts` (CREATE): Utilitaires optimisation images
- `src/config/assets.ts` (CREATE): Configuration sources assets

#### ✅ Verification Criteria
- [ ] Assets se chargent dynamiquement sans bloquer UI
- [ ] Lazy loading fonctionnel avec Intersection Observer
- [ ] Cache efficace avec purge automatique
- [ ] Performance maintenue (pas de memory leaks)
- [ ] Configuration assets facile via config file
- [ ] Support fallback pour assets indisponibles
- [ ] Optimisation automatique format (WebP/AVIF)

#### 🚨 Notes Spéciales
- APIs **gratuites sans clé** requise (Unsplash/Pexels)
- Système **modulaire** pour faciliter changement sources
- **Performance prioritaire** - éviter impact loading

---

### **Task 5: Tests TDD pour nouveaux composants UI** 🧪

**Objective**: Écrire tests unitaires et E2E pour tous les nouveaux composants UI, système de thème, et services APIs en suivant la méthodologie TDD. Assurer couverture complète et maintenir qualité existante.

#### 🎯 Implementation Guide
1. **Tests unitaires composants UI** avec Testing Library
   ```typescript
   describe('Button Component', () => {
     test('should render with correct variant styles')
     test('should handle click events correctly')
     test('should support keyboard navigation')
   })
   ```

2. **Tests thème** et dark/light mode switching
3. **Tests services APIs** avec mocks appropriés
4. **Tests lazy loading** et performance
5. **Tests E2E nouvelles fonctionnalités** avec Playwright
6. **Tests responsive design** multi-devices
7. **Tests accessibilité** avec axe-core

#### 📁 Related Files
- `tests/unit/components/ui/` (CREATE): Tests composants UI réutilisables
- `tests/unit/services/DictionaryService.test.ts` (CREATE): Tests service dictionnaire
- `tests/unit/services/AssetService.test.ts` (CREATE): Tests service assets
- `tests/e2e/theming.spec.ts` (CREATE): Tests E2E système de thème
- `tests/e2e/responsive.spec.ts` (CREATE): Tests responsive design
- `tests/utils/apiMocks.ts` (CREATE): Mocks pour APIs externes

#### ✅ Verification Criteria
- [ ] Tous les tests passent (100% success rate)
- [ ] Couverture code ≥85% pour nouveaux composants
- [ ] Tests E2E fonctionnels sur multi-browsers
- [ ] Pas de régression sur tests existants
- [ ] Tests accessibilité passent (axe-core)
- [ ] Tests performance validés
- [ ] Mocks APIs correctements configurés

#### 🚨 Notes Spéciales
- **CRITICAL**: Maintenir couverture ≥85%
- Tests doivent être **déterministes** (pas de flaky tests)
- **Mocker toutes les APIs externes** pour éviter dépendances

---

### **Task 6: Documentation et guide de personnalisation** 📚

**Objective**: Créer une documentation complète pour la personnalisation du thème, changement d'APIs, modification d'assets, et guide de contribution. Inclure exemples pratiques et bonnes pratiques.

#### 🎯 Implementation Guide
1. **Documentation README** détaillée avec exemples
2. **Guide personnalisation thème** avec captures écran
3. **Documentation changement APIs** avec alternatives
4. **Guide modification assets** et sources
5. **Storybook** pour composants UI
6. **Exemples configurations** courantes
7. **Guide déploiement** et optimisation

#### 📁 Related Files
- `README.md` (TO_MODIFY): Documentation complète du projet
- `docs/THEMING.md` (CREATE): Guide personnalisation thème
- `docs/APIS.md` (CREATE): Guide configuration APIs
- `docs/ASSETS.md` (CREATE): Guide gestion assets
- `docs/DEPLOYMENT.md` (CREATE): Guide déploiement
- `.storybook/` (CREATE): Configuration Storybook
- `CONTRIBUTING.md` (CREATE): Guide contribution

#### ✅ Verification Criteria
- [ ] Documentation complète et claire pour débutants
- [ ] Exemples code fonctionnels et testés
- [ ] Storybook opérationnel avec tous composants
- [ ] Guides de personnalisation testés
- [ ] Screenshots et exemples visuels
- [ ] Documentation APIs alternatives
- [ ] Guide contribution avec workflow Git

#### 🚨 Notes Spéciales
- Documentation doit être **accessible aux développeurs junior**
- Inclure **captures d'écran et exemples code complets**
- Tous les exemples doivent être **fonctionnels et testés**

---

### **Task 7: Optimisation performance et bundle final** ⚡

**Objective**: Optimiser les performances globales, analyse bundle, code splitting, optimisation images, mise en cache, et préparation pour production. Valider métriques Core Web Vitals et objectifs performance.

#### 🎯 Implementation Guide
1. **Analyse bundle** avec webpack-bundle-analyzer
2. **Code splitting** par routes et fonctionnalités
3. **Optimisation imports** (tree shaking)
4. **Service Worker** pour cache agressif
5. **Préchargement ressources** critiques
6. **Optimisation images** et fonts
7. **Mesure Core Web Vitals** et optimisation

#### 📁 Related Files
- `vite.config.ts` (TO_MODIFY): Optimisations build production
- `src/sw.ts` (CREATE): Service Worker pour cache
- `public/manifest.json` (TO_MODIFY): PWA manifest optimisé
- `.github/workflows/performance.yml` (CREATE): CI performance monitoring
- `lighthouse.config.js` (CREATE): Configuration Lighthouse CI
- `src/utils/performance.ts` (CREATE): Monitoring performance

#### ✅ Verification Criteria
- [ ] Bundle optimisé et analysé (taille <2MB gzipped)
- [ ] Core Web Vitals conformes (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] 60fps maintenu sur toutes interactions
- [ ] Cache efficace avec Service Worker
- [ ] PWA fonctionnelle avec offline support
- [ ] Tous tests performance passent
- [ ] Lighthouse score >90 (Performance, Accessibility, SEO)

#### 🚨 Notes Spéciales
- **Objectifs stricts**: <3s loading, Lighthouse >90, 60fps maintenu
- Préserver **compatibilité tous navigateurs** cibles
- **Monitoring continu** des performances en CI

---

## 🔧 DEVELOPMENT WORKFLOW (Enrichi par Context7)

### 📋 Task Execution Process
1. **Select Next Task** based on dependencies and priority
2. **Read Implementation Guide** thoroughly (avec références Context7)
3. **Setup TDD cycle**: Write tests → Implement → Refactor
4. **Verify Completion** against criteria checklist
5. **Update task status** in Shrimp Task Manager
6. **Move to next dependency-free task**

### 🔧 Quality Standards (Standards Officiels)
- **Test Coverage**: ≥85% for all new code
- **Performance**: 60fps maintained, Core Web Vitals compliant
- **Accessibility**: WCAG 2.1 AA compliance
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+ (selon TailwindCSS docs)
- **Mobile-First**: Responsive design mandatory
- **TypeScript**: Strict mode, no `any` types
- **TailwindCSS**: ES Modules config, performance optimized selon docs officielles

### 📊 Progress Tracking (Méthodologie Validée)
- Use **Shrimp Task Manager** for detailed task management
- Update **this TASKS.md** for overview and documentation
- Maintain **test coverage reports** and performance metrics
- **Git commits** should reference task IDs for traceability
- **Context7 references** for technical validation when needed

---

## 🎨 CUSTOMIZATION GUIDES (Validés par Documentation Officielle)

### 🎨 Theme Customization (Approche TypeScript Modern - Context7 + shadcn/ui)
```typescript
// src/styles/theme.ts - Configuration intégrée shadcn/ui + TailwindCSS
/** @type {import('tailwindcss').Config} */
export const themes = {
  light: {
    primary: '#3B82F6', // Bleu Tailwind officiel
    secondary: '#8B5CF6', // Violet Tailwind
    background: '#FFFFFF',
    // Variables shadcn/ui compatibles
    card: '#FFFFFF',
    popover: '#FFFFFF',
    muted: '#F1F5F9'
  },
  dark: {
    primary: '#60A5FA',   // Bleu plus clair
    secondary: '#A78BFA', // Violet plus clair
    background: '#1F2937',
    // Variables shadcn/ui dark mode
    card: '#1F2937',
    popover: '#1F2937',
    muted: '#0F172A'
  }
} satisfies Record<string, ThemeConfig>

// components.json - Configuration centralisée shadcn/ui
{
  "style": "new-york", // Style moderne
  "tailwind": {
    "css": "src/styles/globals.css",
    "baseColor": "neutral", // Compatible avec thèmes custom
    "cssVariables": true
  }
}
```

### 🌐 API Configuration (Modularité Facile)
```typescript
// src/config/apis.ts - Switch APIs easily
export const apiConfig = {
  dictionary: {
    provider: 'free-dictionary-api', // changeable facilement
    baseUrl: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
    fallback: 'offline-dictionary',
    rateLimit: { requests: 100, per: 'hour' }
  },
  translation: {
    provider: 'libretranslate', // APIs gratuites validées
    baseUrl: 'https://libretranslate.de/translate',
    fallback: 'google-translate-free'
  }
}
```

### 🖼️ Assets Configuration (Sources Modulaires)
```typescript
// src/config/assets.ts - Change asset sources
export const assetConfig = {
  images: {
    provider: 'unsplash', // easy switch to 'pexels' or 'local'
    categories: ['nature', 'technology', 'people'],
    fallback: '/assets/placeholder.jpg',
    optimization: {
      formats: ['avif', 'webp', 'jpg'], // Modern formats selon Context7
      sizes: [320, 640, 960, 1280, 1920]
    }
  },
  videos: {
    provider: 'pexels',
    maxDuration: 30, // seconds
    quality: 'hd'
  }
}
```

### ⚡ Performance Configuration (Standards Officiels)
```typescript
// vite.config.ts - Optimisations selon documentation Vite + TailwindCSS
export default defineConfig({
  plugins: [
    // Option 1: PostCSS (actuel)
    // Déjà configuré correctement ✅
    
    // Option 2: Plugin Vite direct (plus performant selon docs)
    // tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          tailwind: ['tailwindcss']
        }
      }
    }
  }
})
```

---

### 🚀 NEXT STEPS (Roadmap Validée Context7 + shadcn/ui)

1. **Complete Task 1** (TailwindCSS Configuration) - Currently in progress
   - ✅ PostCSS config validée par documentation officielle
   - ⏳ Finaliser theme system TypeScript
   - 🔄 Tests de régression à valider

2. **NEW: Complete Task 1.5** (shadcn/ui Integration) - Next priority
   - 🎯 Setup shadcn/ui avec style "New York"
   - ⚡ Installation composants base (Button, Card, Progress, etc.)
   - 🔗 Configuration path aliases et theme provider
   - 📋 Intégration avec système TailwindCSS existant

3. **Parallel execution** of Task 2 (UI shadcn/ui) and Task 3 (APIs) once Task 1.5 done
   - Task 2: UI Components avec shadcn/ui (Button, Card, Progress, etc.)
   - Task 3: APIs gratuites (Free Dictionary, LibreTranslate)

4. **Continue sequential** execution following dependency chain
   - Task 4: Assets system (Unsplash/Pexels)
   - Task 5: Tests TDD complets + shadcn/ui components
   - Task 6: Documentation Storybook + shadcn/ui showcase
   - Task 7: Performance optimization

5. **Regular testing** and quality validation at each step
   - TDD approach strict + shadcn/ui accessibility tests
   - Context7 validation pour les choix techniques
   - Performance monitoring continu

6. **Documentation updates** throughout development process
   - Guides customization avec exemples shadcn/ui
   - Component variants et theming shadcn/ui
   - Migration paths vers futures versions

**Current Priority**: 
1. Finish TailwindCSS setup (Task 1)
2. **NEW**: Setup shadcn/ui design system (Task 1.5) 
3. Modernize UI with shadcn components (Task 2)

**Technical Validation**: 
- ✅ PostCSS + ES Modules validée par TailwindCSS v4.1 docs
- ✅ shadcn/ui + Vite + React + TypeScript validée par docs officielles
- 🎨 Design moderne "New York" style pour UX optimale

**ROI shadcn/ui**: +80% économie temps développement, accessibilité WCAG 2.1 automatique, maintenance communautaire

---

*Generated by Shrimp Task Manager + Context7 Documentation + shadcn/ui Integration*  
*Technical specs verified against official TailwindCSS v4.1 + shadcn/ui documentation*  
*shadcn/ui Design System: 80%+ time savings, WCAG 2.1 compliance, modern "New York" styling*  
*Last Updated: 2025-01-14 - All configurations validated with official sources + shadcn/ui best practices*
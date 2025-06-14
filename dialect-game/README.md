# Dialect Learning Game

A modern web-based language learning game using voice recognition technology, built with React, TypeScript, and Web Speech API.

## 🎮 Game Overview

The Dialect Learning Game helps users learn different dialects and improve pronunciation through interactive voice recognition gameplay. Players listen to words in various dialects and repeat them to earn points and advance through levels.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Voice Recognition**: Web Speech API
- **Styling**: CSS3 with modern features
- **State Management**: useReducer + Context API

### Project Structure
```
dialect-game/
├── src/
│   ├── components/          # React components
│   │   ├── GameCanvas.tsx   # Main game rendering
│   │   ├── ScoreDisplay.tsx # Score and stats UI
│   │   └── VoiceInput.tsx   # Voice recognition interface
│   ├── core/                # Game engine
│   │   └── GameEngine.ts    # 60fps game loop & object management
│   ├── services/            # External service integrations
│   │   └── VoiceService.ts  # Web Speech API wrapper
│   ├── hooks/               # Custom React hooks
│   │   ├── useGameEngine.ts # Game engine integration
│   │   └── useVoiceService.ts # Voice service integration
│   ├── types/               # TypeScript definitions
│   │   ├── game.ts          # Game state and objects
│   │   ├── voice.ts         # Voice recognition types
│   │   └── dialect.ts       # Language and dialect types
│   ├── utils/               # Utility functions
│   │   ├── ObjectPool.ts    # Memory optimization
│   │   └── SpatialGrid.ts   # Collision detection optimization
│   └── App.tsx              # Main application component
├── tests/
│   ├── unit/                # Unit tests (Vitest)
│   ├── e2e/                 # End-to-end tests (Playwright)
│   └── utils/               # Test utilities
└── public/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with Web Speech API support (Chrome recommended)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd dialect-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm test             # Run unit tests
npm run test:watch   # Unit tests in watch mode
npm run test:coverage # Unit tests with coverage report
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # E2E tests with Playwright UI

# Code Quality
npm run lint         # ESLint code checking
npm run type-check   # TypeScript type checking
```

## 🎯 Game Features

### Core Gameplay
- **Voice Recognition**: Real-time speech recognition using Web Speech API
- **Dialect Learning**: Support for multiple languages and dialects
- **Progressive Difficulty**: Adaptive difficulty based on player performance
- **Real-time Scoring**: Immediate feedback with confidence-based scoring
- **Achievement System**: Streaks, milestones, and level progression

### Technical Features
- **60fps Game Loop**: Smooth animations with requestAnimationFrame
- **Object Pooling**: Memory-efficient object management
- **Spatial Partitioning**: Optimized collision detection
- **Error Boundaries**: Graceful error handling and recovery
- **Performance Monitoring**: Real-time FPS and memory usage tracking
- **Accessibility**: WCAG AA compliance with screen reader support

### Browser Support
- ✅ Chrome 80+ (recommended)
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 80+
- ❌ Internet Explorer (not supported)

## 🧪 Testing Strategy

### Test-Driven Development (TDD)
This project follows strict TDD methodology:
1. **RED**: Write failing tests first
2. **GREEN**: Implement minimal code to pass tests
3. **REFACTOR**: Improve code while keeping tests green

### Test Coverage
- **Unit Tests**: 113/160 tests passing (71% coverage)
  - GameEngine: 100% ✅
  - VoiceService: 100% ✅
  - React Components: 69% average
- **E2E Tests**: 64 comprehensive scenarios
  - Cross-browser testing (Chrome, Firefox, Safari)
  - Accessibility compliance testing
  - Performance benchmarking

### Running Tests
```bash
# Run all unit tests
npm test

# Run specific component tests
npm test -- GameEngine
npm test -- VoiceService

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🔧 Configuration

### Game Configuration
The game can be configured in `src/core/GameEngine.ts`:
```typescript
const defaultConfig: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  targetFPS: 60,
  fixedTimeStep: 16.67, // 1000/60
  maxObjects: 1000,
  collisionEnabled: true,
  debug: false
};
```

### Voice Recognition Configuration
Voice settings in `src/services/VoiceService.ts`:
```typescript
const defaultConfig = {
  language: 'en-US',
  continuous: true,
  interimResults: false,
  maxAlternatives: 1,
  serviceGrammars: false
};
```

## 🎨 Accessibility

### WCAG AA Compliance
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Proper focus indicators and management

### Voice Recognition Accessibility
- **Visual Feedback**: Real-time visual indicators for voice state
- **Error Recovery**: Clear error messages and retry mechanisms
- **Alternative Input**: Keyboard fallbacks for all voice interactions
- **Confidence Display**: Optional confidence scores for user feedback

## 🚀 Performance

### Optimization Techniques
- **Object Pooling**: Reuse game objects to minimize garbage collection
- **Spatial Grid**: Efficient collision detection for large numbers of objects
- **Component Memoization**: React.memo and useCallback for render optimization
- **Bundle Splitting**: Code splitting for faster initial load
- **Asset Optimization**: Compressed images and optimized fonts

### Performance Targets
- **Frame Rate**: Stable 60fps during gameplay
- **Loading Time**: < 3 seconds initial load
- **Memory Usage**: < 100MB heap size during extended play
- **Lighthouse Score**: > 90 performance score
- **Voice Latency**: < 200ms recognition response time

### Monitoring
The app includes built-in performance monitoring:
- Real-time FPS counter
- Memory usage tracking
- Voice recognition latency measurement
- Debug mode with detailed metrics (Ctrl+Shift+D)

## 🔍 Debugging

### Debug Mode
Enable debug mode for development insights:
- Press `Ctrl+Shift+D` to toggle debug overlay
- Shows FPS, memory usage, and performance metrics
- Displays voice recognition confidence scores
- Enables additional console logging

### Common Issues
1. **Voice Recognition Not Working**
   - Ensure microphone permissions are granted
   - Check browser compatibility (Chrome recommended)
   - Verify HTTPS connection (required for Web Speech API)

2. **Performance Issues**
   - Monitor FPS counter in debug mode
   - Check browser developer tools for memory leaks
   - Ensure hardware acceleration is enabled

3. **Test Failures**
   - Run `npm run test:coverage` for detailed coverage report
   - Check `test-results/` folder for E2E test artifacts
   - Verify browser compatibility for E2E tests

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Write tests first (TDD)
4. Implement features
5. Ensure all tests pass
6. Submit pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Enforced code style and best practices
- **Testing**: Minimum 85% coverage required
- **Accessibility**: WCAG AA compliance mandatory
- **Performance**: 60fps requirement for all features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Web Speech API for voice recognition capabilities
- React team for the excellent framework
- Vite for lightning-fast development experience
- Playwright for comprehensive E2E testing
- The accessibility community for WCAG guidelines

---

Built with ❤️ using Test-Driven Development methodology.

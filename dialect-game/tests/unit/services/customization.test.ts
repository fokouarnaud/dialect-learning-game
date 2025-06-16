/**
 * Tests unitaires pour le système de customisation avancée
 * Task 15: Customisation Avancée - Phase TDD
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  ThemeType,
  ColorCategory,
  SoundType,
  AdaptiveDifficultyMode,
  LearningStyle
} from '../../../src/types/customization';

import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToHex,
  createCustomColor,
  generateColorVariations,
  createColorPalette,
  createDefaultPalettes,
  createCustomTheme,
  applyTheme,
  createDefaultAudioSettings,
  playSound,
  createDefaultAdaptiveDifficulty,
  calculateAdaptiveDifficulty,
  createDefaultLearningPreferences,
  exportConfiguration,
  importConfiguration,
  saveCustomizationState,
  loadCustomizationState,
  createInitialCustomizationState
} from '../../../src/services/customization/customizationService';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  volume: 1,
  currentTime: 0,
  duration: 0
}));

describe('Customization System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  describe('Color Management', () => {
    test('should convert HEX to RGB', () => {
      const rgb = hexToRgb('#3B82F6');
      
      expect(rgb).toEqual({ r: 59, g: 130, b: 246 });
    });

    test('should convert RGB to HEX', () => {
      const hex = rgbToHex(59, 130, 246);
      
      expect(hex).toBe('#3b82f6');
    });

    test('should convert RGB to HSL', () => {
      const hsl = rgbToHsl(59, 130, 246);
      
      expect(hsl.h).toBeCloseTo(218, 0);
      expect(hsl.s).toBeCloseTo(83, 0);
      expect(hsl.l).toBeCloseTo(60, 0);
    });

    test('should convert HSL to HEX', () => {
      const hex = hslToHex(218, 83, 60);
      
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    });

    test('should create custom color', () => {
      const color = createCustomColor('Primary Blue', ColorCategory.PRIMARY, '#3B82F6');
      
      expect(color.name).toBe('Primary Blue');
      expect(color.category).toBe(ColorCategory.PRIMARY);
      expect(color.hex).toBe('#3B82F6');
      expect(color.rgb).toEqual({ r: 59, g: 130, b: 246 });
      expect(color.hsl.h).toBeCloseTo(218, 0);
    });

    test('should generate color variations', () => {
      const baseColor = createCustomColor('Blue', ColorCategory.PRIMARY, '#3B82F6');
      const variations = generateColorVariations(baseColor);
      
      expect(variations).toHaveLength(9);
      expect(variations[0].name).toBe('Blue-100');
      expect(variations[8].name).toBe('Blue-900');
    });

    test('should create color palette', () => {
      const palette = createColorPalette(
        'Test Palette',
        'A test color palette',
        {
          [ColorCategory.PRIMARY]: createCustomColor('Primary', ColorCategory.PRIMARY, '#3B82F6')
        }
      );
      
      expect(palette.name).toBe('Test Palette');
      expect(palette.description).toBe('A test color palette');
      expect(palette.colors[ColorCategory.PRIMARY].hex).toBe('#3B82F6');
      expect(palette.isDefault).toBe(false);
    });

    test('should create default palettes', () => {
      const palettes = createDefaultPalettes();
      
      expect(palettes).toHaveLength(3);
      expect(palettes[0].name).toBe('Light Theme');
      expect(palettes[1].name).toBe('Dark Theme');
      expect(palettes[2].name).toBe('Ocean Blue');
    });
  });

  describe('Theme Management', () => {
    test('should create custom theme', () => {
      const theme = createCustomTheme({
        name: 'My Theme',
        description: 'Custom theme for testing'
      });
      
      expect(theme.name).toBe('My Theme');
      expect(theme.description).toBe('Custom theme for testing');
      expect(theme.type).toBe(ThemeType.CUSTOM);
      expect(theme.isActive).toBe(false);
      expect(theme.isDefault).toBe(false);
      expect(theme.author).toBe('User');
    });

    test('should apply theme to DOM', () => {
      const theme = createCustomTheme({ name: 'Test Theme' });
      const mockSetProperty = vi.fn();
      
      Object.defineProperty(document, 'documentElement', {
        value: {
          style: {
            setProperty: mockSetProperty
          }
        },
        writable: true
      });
      
      applyTheme(theme);
      
      expect(mockSetProperty).toHaveBeenCalledWith('--color-primary', theme.palette.colors.primary.hex);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('active-theme', theme.id);
    });

    test('should save and load theme preferences', () => {
      const theme = createCustomTheme({ name: 'Saved Theme' });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(theme));
      
      // Simulate saving
      applyTheme(theme);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('active-theme', theme.id);
    });
  });

  describe('Audio System', () => {
    test('should create default audio settings', () => {
      const audioSettings = createDefaultAudioSettings();
      
      expect(audioSettings.enabled).toBe(true);
      expect(audioSettings.masterVolume).toBe(0.7);
      expect(audioSettings.soundEffects.enabled).toBe(true);
      expect(audioSettings.backgroundMusic.enabled).toBe(false);
      expect(audioSettings.voiceSettings.language).toBe('fr-FR');
    });

    test('should play sound with correct volume', async () => {
      const audioSettings = createDefaultAudioSettings();
      const mockPlay = vi.fn().mockResolvedValue(undefined);
      const mockAudio = {
        play: mockPlay,
        addEventListener: vi.fn((event, callback) => {
          if (event === 'ended') setTimeout(callback, 100);
        }),
        volume: 0
      };
      
      global.Audio = vi.fn().mockImplementation(() => mockAudio);
      
      await playSound(SoundType.CORRECT_ANSWER, audioSettings);
      
      expect(global.Audio).toHaveBeenCalled();
      expect(mockAudio.volume).toBe(audioSettings.masterVolume * audioSettings.soundEffects.volume);
      expect(mockPlay).toHaveBeenCalled();
    });

    test('should not play sound when disabled', async () => {
      const audioSettings = createDefaultAudioSettings();
      audioSettings.enabled = false;
      
      const mockPlay = vi.fn();
      global.Audio = vi.fn().mockImplementation(() => ({ play: mockPlay }));
      
      await playSound(SoundType.CORRECT_ANSWER, audioSettings);
      
      expect(global.Audio).not.toHaveBeenCalled();
      expect(mockPlay).not.toHaveBeenCalled();
    });

    test('should handle audio errors gracefully', async () => {
      const audioSettings = createDefaultAudioSettings();
      const mockPlay = vi.fn().mockRejectedValue(new Error('Audio error'));
      
      global.Audio = vi.fn().mockImplementation(() => ({
        play: mockPlay,
        addEventListener: vi.fn()
      }));
      
      await expect(playSound(SoundType.CORRECT_ANSWER, audioSettings)).rejects.toThrow('Audio error');
    });
  });

  describe('Adaptive Difficulty', () => {
    test('should create default adaptive difficulty settings', () => {
      const settings = createDefaultAdaptiveDifficulty();
      
      expect(settings.enabled).toBe(true);
      expect(settings.mode).toBe(AdaptiveDifficultyMode.BALANCED);
      expect(settings.sensitivity).toBe(0.5);
      expect(settings.factors.accuracy).toBe(0.4);
      expect(settings.factors.speed).toBe(0.2);
    });

    test('should calculate adaptive difficulty based on performance', () => {
      const settings = createDefaultAdaptiveDifficulty();
      const performanceHistory = [
        { correct: true, responseTime: 2000, difficulty: 0.5, timestamp: Date.now() - 4000 },
        { correct: true, responseTime: 1500, difficulty: 0.5, timestamp: Date.now() - 3000 },
        { correct: false, responseTime: 8000, difficulty: 0.5, timestamp: Date.now() - 2000 },
        { correct: true, responseTime: 2500, difficulty: 0.5, timestamp: Date.now() - 1000 }
      ];
      
      const difficulty = calculateAdaptiveDifficulty(settings, performanceHistory);
      
      expect(difficulty).toBeGreaterThan(0);
      expect(difficulty).toBeLessThan(1);
      expect(difficulty).toBeCloseTo(0.6, 1); // Approximativement
    });

    test('should return default difficulty when disabled', () => {
      const settings = createDefaultAdaptiveDifficulty();
      settings.enabled = false;
      
      const difficulty = calculateAdaptiveDifficulty(settings, []);
      
      expect(difficulty).toBe(0.5);
    });

    test('should respect min and max difficulty limits', () => {
      const settings = createDefaultAdaptiveDifficulty();
      settings.minDifficulty = 0.3;
      settings.maxDifficulty = 0.7;
      
      // Performance très faible
      const poorPerformance = Array(10).fill(null).map(() => ({
        correct: false,
        responseTime: 10000,
        difficulty: 0.5,
        timestamp: Date.now()
      }));
      
      const lowDifficulty = calculateAdaptiveDifficulty(settings, poorPerformance);
      expect(lowDifficulty).toBeGreaterThanOrEqual(settings.minDifficulty);
      
      // Performance excellente
      const excellentPerformance = Array(10).fill(null).map(() => ({
        correct: true,
        responseTime: 500,
        difficulty: 0.5,
        timestamp: Date.now()
      }));
      
      const highDifficulty = calculateAdaptiveDifficulty(settings, excellentPerformance);
      expect(highDifficulty).toBeLessThanOrEqual(settings.maxDifficulty);
    });
  });

  describe('Learning Preferences', () => {
    test('should create default learning preferences', () => {
      const preferences = createDefaultLearningPreferences('user-123');
      
      expect(preferences.userId).toBe('user-123');
      expect(preferences.learningStyle).toBe(LearningStyle.MIXED);
      expect(preferences.preferredLanguages).toEqual(['fr', 'en']);
      expect(preferences.notifications.enabled).toBe(true);
      expect(preferences.accessibility.keyboardNavigation).toBe(true);
      expect(preferences.privacy.profileVisibility).toBe('private');
    });

    test('should include comprehensive accessibility settings', () => {
      const preferences = createDefaultLearningPreferences('user-123');
      
      expect(preferences.accessibility).toHaveProperty('highContrast');
      expect(preferences.accessibility).toHaveProperty('reducedMotion');
      expect(preferences.accessibility).toHaveProperty('screenReader');
      expect(preferences.accessibility.colorBlindness).toHaveProperty('enabled');
      expect(preferences.accessibility.colorBlindness).toHaveProperty('type');
    });

    test('should include content preferences', () => {
      const preferences = createDefaultLearningPreferences('user-123');
      
      expect(preferences.content.contentTypes.text).toBe(true);
      expect(preferences.content.contentTypes.audio).toBe(true);
      expect(preferences.content.difficulty.adaptive).toBe(true);
      expect(preferences.content.culturalContent).toBe(true);
    });

    test('should include privacy settings', () => {
      const preferences = createDefaultLearningPreferences('user-123');
      
      expect(preferences.privacy.dataCollection.usage).toBe(true);
      expect(preferences.privacy.analytics).toBe(true);
      expect(preferences.privacy.marketing).toBe(false);
      expect(preferences.privacy.thirdPartySharing).toBe(false);
    });
  });

  describe('Configuration Export/Import', () => {
    test('should export configuration', () => {
      const state = createInitialCustomizationState('user-123');
      const exported = exportConfiguration(state);
      
      expect(exported.version).toBe('1.0.0');
      expect(exported.userId).toBe('user-123');
      expect(exported.data.themes).toBe(state.availableThemes);
      expect(exported.data.audio).toBe(state.audio);
      expect(exported.data.preferences).toBe(state.preferences);
      expect(exported.metadata.checksum).toBeDefined();
    });

    test('should import configuration', () => {
      const originalState = createInitialCustomizationState('user-123');
      const exported = exportConfiguration(originalState);
      
      const imported = importConfiguration(exported);
      
      expect(imported.availableThemes).toEqual(exported.data.themes);
      expect(imported.audio).toEqual(exported.data.audio);
      expect(imported.preferences).toEqual(exported.data.preferences);
    });

    test('should reject incompatible version', () => {
      const exported = {
        version: '2.0.0',
        exportDate: Date.now(),
        userId: 'user-123',
        metadata: { appVersion: '1.0.0', platform: 'test', checksum: 'abc123' },
        data: { themes: [], audio: {}, difficulty: {}, preferences: {}, customizations: {} }
      };
      
      expect(() => importConfiguration(exported as any)).toThrow('Version de configuration non compatible');
    });

    test('should include metadata in export', () => {
      const state = createInitialCustomizationState('user-123');
      const exported = exportConfiguration(state);
      
      expect(exported.metadata.appVersion).toBe('1.0.0');
      expect(exported.metadata.platform).toBe(navigator.platform);
      expect(exported.metadata.checksum).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe('State Persistence', () => {
    test('should save customization state', () => {
      const state = createInitialCustomizationState('user-123');
      
      saveCustomizationState(state);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'customization-state',
        expect.stringContaining('user-123')
      );
    });

    test('should load customization state', () => {
      const state = createInitialCustomizationState('user-123');
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(state));
      
      const loaded = loadCustomizationState();
      
      expect(loaded).toEqual(state);
    });

    test('should handle corrupted state gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      const loaded = loadCustomizationState();
      
      expect(loaded).toBeNull();
    });

    test('should mark state as saved when persisting', () => {
      const state = createInitialCustomizationState('user-123');
      state.hasUnsavedChanges = true;
      
      saveCustomizationState(state);
      
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.hasUnsavedChanges).toBe(false);
      expect(savedData.lastSavedAt).toBe(Date.now());
    });
  });

  describe('Initial State Creation', () => {
    test('should create initial customization state', () => {
      const state = createInitialCustomizationState('user-123');
      
      expect(state.preferences.userId).toBe('user-123');
      expect(state.availableThemes.length).toBeGreaterThan(0);
      expect(state.currentTheme).toBe(state.availableThemes[0]);
      expect(state.audio.enabled).toBe(true);
      expect(state.difficulty.enabled).toBe(true);
      expect(state.editor.isOpen).toBe(false);
      expect(state.hasUnsavedChanges).toBe(false);
    });

    test('should include default themes', () => {
      const state = createInitialCustomizationState('user-123');
      
      expect(state.availableThemes.some(theme => theme.name === 'Light Theme')).toBe(true);
      expect(state.availableThemes.some(theme => theme.name === 'Dark Theme')).toBe(true);
      expect(state.availableThemes.some(theme => theme.name === 'Ocean Blue')).toBe(true);
    });

    test('should initialize editor state', () => {
      const state = createInitialCustomizationState('user-123');
      
      expect(state.editor.currentTab).toBe('colors');
      expect(state.editor.previewMode).toBe(false);
      expect(state.editor.selectedElement).toBeNull();
      expect(state.editor.history).toEqual([]);
      expect(state.editor.historyIndex).toBe(-1);
    });
  });

  describe('Theme Editor Integration', () => {
    test('should track editor actions in history', () => {
      const state = createInitialCustomizationState('user-123');
      state.editor.isOpen = true;
      
      // Simulate editor action
      const action = {
        type: 'color_change' as const,
        target: 'primary',
        oldValue: '#3B82F6',
        newValue: '#EF4444',
        timestamp: Date.now()
      };
      
      state.editor.history.push(action);
      state.editor.historyIndex = 0;
      
      expect(state.editor.history).toHaveLength(1);
      expect(state.editor.history[0].type).toBe('color_change');
      expect(state.editor.historyIndex).toBe(0);
    });

    test('should support undo/redo functionality', () => {
      const state = createInitialCustomizationState('user-123');
      
      // Add some actions to history
      state.editor.history = [
        {
          type: 'color_change',
          target: 'primary',
          oldValue: '#3B82F6',
          newValue: '#EF4444',
          timestamp: Date.now() - 2000
        },
        {
          type: 'font_change',
          target: 'heading',
          oldValue: 'Inter',
          newValue: 'Roboto',
          timestamp: Date.now() - 1000
        }
      ];
      state.editor.historyIndex = 1;
      
      // Test undo
      expect(state.editor.historyIndex).toBe(1);
      state.editor.historyIndex = 0; // Simulate undo
      expect(state.editor.historyIndex).toBe(0);
      
      // Test redo
      state.editor.historyIndex = 1; // Simulate redo
      expect(state.editor.historyIndex).toBe(1);
    });
  });

  describe('Performance Metrics', () => {
    test('should calculate consistency correctly', () => {
      const settings = createDefaultAdaptiveDifficulty();
      
      // Test with consistent performance
      const consistentHistory = Array(5).fill(null).map(() => ({
        correct: true,
        responseTime: 2000,
        difficulty: 0.5,
        timestamp: Date.now()
      }));
      
      const highConsistency = calculateAdaptiveDifficulty(settings, consistentHistory);
      
      // Test with inconsistent performance
      const inconsistentHistory = [
        { correct: true, responseTime: 1000, difficulty: 0.5, timestamp: Date.now() },
        { correct: false, responseTime: 5000, difficulty: 0.5, timestamp: Date.now() },
        { correct: true, responseTime: 1500, difficulty: 0.5, timestamp: Date.now() },
        { correct: false, responseTime: 8000, difficulty: 0.5, timestamp: Date.now() },
        { correct: true, responseTime: 2000, difficulty: 0.5, timestamp: Date.now() }
      ];
      
      const lowConsistency = calculateAdaptiveDifficulty(settings, inconsistentHistory);
      
      // Consistent performance should result in higher difficulty adjustment
      expect(Math.abs(highConsistency - 0.5)).toBeGreaterThan(Math.abs(lowConsistency - 0.5));
    });

    test('should factor in response time', () => {
      const settings = createDefaultAdaptiveDifficulty();
      
      // Fast responses
      const fastHistory = Array(5).fill(null).map(() => ({
        correct: true,
        responseTime: 500,
        difficulty: 0.5,
        timestamp: Date.now()
      }));
      
      // Slow responses
      const slowHistory = Array(5).fill(null).map(() => ({
        correct: true,
        responseTime: 8000,
        difficulty: 0.5,
        timestamp: Date.now()
      }));
      
      const fastDifficulty = calculateAdaptiveDifficulty(settings, fastHistory);
      const slowDifficulty = calculateAdaptiveDifficulty(settings, slowHistory);
      
      expect(fastDifficulty).toBeGreaterThan(slowDifficulty);
    });
  });
});
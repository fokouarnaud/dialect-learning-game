/**
 * Global Game Store
 * Task 10: State management for the entire application
 */

import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameEvent } from '../types';

// Extended game state for global management
export interface GlobalGameState {
  // Core game state
  gameState: GameState;
  score: number;
  highScore: number;
  level: number;
  accuracy: number;
  streak: number;
  
  // Game statistics
  totalAttempts: number;
  correctAttempts: number;
  totalGameTime: number;
  gamesPlayed: number;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  debugMode: boolean;
  
  // Settings
  settings: {
    language: string;
    difficulty: 'easy' | 'medium' | 'hard';
    soundEnabled: boolean;
    voiceEnabled: boolean;
    highContrastMode: boolean;
  };
  
  // Performance metrics
  performance: {
    fps: number;
    memoryUsage: number;
    averageResponseTime: number;
  };
}

// Action types for the reducer
export type GameStoreAction =
  | { type: 'INIT_GAME' }
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'UPDATE_LEVEL'; payload: number }
  | { type: 'UPDATE_ACCURACY'; payload: { correct: boolean; confidence: number } }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'RESET_STREAK' }
  | { type: 'SET_HIGH_SCORE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DEBUG_MODE'; payload: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GlobalGameState['settings']> }
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<GlobalGameState['performance']> }
  | { type: 'INCREMENT_GAMES_PLAYED' }
  | { type: 'RESET_STATISTICS' };

// Initial state
const initialState: GlobalGameState = {
  gameState: 'menu',
  score: 0,
  highScore: parseInt(localStorage.getItem('dialectGame_highScore') || '0'),
  level: 1,
  accuracy: 0,
  streak: 0,
  
  totalAttempts: parseInt(localStorage.getItem('dialectGame_totalAttempts') || '0'),
  correctAttempts: parseInt(localStorage.getItem('dialectGame_correctAttempts') || '0'),
  totalGameTime: parseInt(localStorage.getItem('dialectGame_totalGameTime') || '0'),
  gamesPlayed: parseInt(localStorage.getItem('dialectGame_gamesPlayed') || '0'),
  
  isLoading: false,
  error: null,
  debugMode: false,
  
  settings: {
    language: localStorage.getItem('dialectGame_language') || 'en-US',
    difficulty: (localStorage.getItem('dialectGame_difficulty') as any) || 'medium',
    soundEnabled: localStorage.getItem('dialectGame_soundEnabled') !== 'false',
    voiceEnabled: localStorage.getItem('dialectGame_voiceEnabled') !== 'false',
    highContrastMode: localStorage.getItem('dialectGame_highContrastMode') === 'true',
  },
  
  performance: {
    fps: 60,
    memoryUsage: 0,
    averageResponseTime: 0,
  },
};

// Reducer function
function gameStoreReducer(state: GlobalGameState, action: GameStoreAction): GlobalGameState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        error: null,
        isLoading: false,
      };
    
    case 'START_GAME':
      return {
        ...state,
        gameState: 'playing',
        score: 0,
        level: 1,
        accuracy: 0,
        streak: 0,
        error: null,
      };
    
    case 'END_GAME': {
      const newHighScore = Math.max(state.score, state.highScore);
      const isNewHighScore = newHighScore > state.highScore;
      
      // Persist to localStorage
      if (isNewHighScore) {
        localStorage.setItem('dialectGame_highScore', newHighScore.toString());
      }
      localStorage.setItem('dialectGame_totalAttempts', state.totalAttempts.toString());
      localStorage.setItem('dialectGame_correctAttempts', state.correctAttempts.toString());
      localStorage.setItem('dialectGame_gamesPlayed', (state.gamesPlayed + 1).toString());
      
      return {
        ...state,
        gameState: 'game_over',
        highScore: newHighScore,
        gamesPlayed: state.gamesPlayed + 1,
      };
    }
    
    case 'PAUSE_GAME':
      return { ...state, gameState: 'paused' };
    
    case 'RESUME_GAME':
      return { ...state, gameState: 'playing' };
    
    case 'UPDATE_SCORE': {
      const newScore = state.score + action.payload;
      return {
        ...state,
        score: newScore,
      };
    }
    
    case 'UPDATE_LEVEL':
      return {
        ...state,
        level: action.payload,
      };
    
    case 'UPDATE_ACCURACY': {
      const { correct, confidence } = action.payload;
      const newTotalAttempts = state.totalAttempts + 1;
      const newCorrectAttempts = state.correctAttempts + (correct ? 1 : 0);
      const newAccuracy = (newCorrectAttempts / newTotalAttempts) * 100;
      
      return {
        ...state,
        totalAttempts: newTotalAttempts,
        correctAttempts: newCorrectAttempts,
        accuracy: newAccuracy,
      };
    }
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        streak: action.payload,
      };
    
    case 'RESET_STREAK':
      return {
        ...state,
        streak: 0,
      };
    
    case 'SET_HIGH_SCORE':
      localStorage.setItem('dialectGame_highScore', action.payload.toString());
      return {
        ...state,
        highScore: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'SET_DEBUG_MODE':
      return {
        ...state,
        debugMode: action.payload,
      };
    
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      
      // Persist settings to localStorage
      Object.entries(newSettings).forEach(([key, value]) => {
        localStorage.setItem(`dialectGame_${key}`, value.toString());
      });
      
      return {
        ...state,
        settings: newSettings,
      };
    }
    
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: {
          ...state.performance,
          ...action.payload,
        },
      };
    
    case 'INCREMENT_GAMES_PLAYED': {
      const newGamesPlayed = state.gamesPlayed + 1;
      localStorage.setItem('dialectGame_gamesPlayed', newGamesPlayed.toString());
      return {
        ...state,
        gamesPlayed: newGamesPlayed,
      };
    }
    
    case 'RESET_STATISTICS':
      // Clear localStorage statistics
      localStorage.removeItem('dialectGame_totalAttempts');
      localStorage.removeItem('dialectGame_correctAttempts');
      localStorage.removeItem('dialectGame_totalGameTime');
      localStorage.removeItem('dialectGame_gamesPlayed');
      localStorage.removeItem('dialectGame_highScore');
      
      return {
        ...state,
        highScore: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        totalGameTime: 0,
        gamesPlayed: 0,
        accuracy: 0,
      };
    
    default:
      return state;
  }
}

// Context
const GameStoreContext = createContext<{
  state: GlobalGameState;
  dispatch: React.Dispatch<GameStoreAction>;
} | null>(null);

// Provider component
export function GameStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameStoreReducer, initialState);
  
  return (
    <GameStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStoreContext.Provider>
  );
}

// Hook to use the game store
export function useGameStore() {
  const context = useContext(GameStoreContext);
  if (!context) {
    throw new Error('useGameStore must be used within a GameStoreProvider');
  }
  return context;
}

// Action creators for common operations
export const gameStoreActions = {
  startGame: () => ({ type: 'START_GAME' } as const),
  endGame: () => ({ type: 'END_GAME' } as const),
  pauseGame: () => ({ type: 'PAUSE_GAME' } as const),
  resumeGame: () => ({ type: 'RESUME_GAME' } as const),
  updateScore: (points: number) => ({ type: 'UPDATE_SCORE', payload: points } as const),
  updateAccuracy: (correct: boolean, confidence: number) => 
    ({ type: 'UPDATE_ACCURACY', payload: { correct, confidence } } as const),
  setError: (error: string | null) => ({ type: 'SET_ERROR', payload: error } as const),
  setLoading: (loading: boolean) => ({ type: 'SET_LOADING', payload: loading } as const),
  toggleDebugMode: (debug: boolean) => ({ type: 'SET_DEBUG_MODE', payload: debug } as const),
};
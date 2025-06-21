/**
 * Test unitaire pour useGameLessonState
 * Vérification des fonctionnalités principales du hook
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import { GameStoreProvider } from '../store/gameStore';
import { useGameLessonState } from './useGameLessonState';

// Composant de test
const TestComponent = () => {
  const lessonState = useGameLessonState();
  
  return (
    <div>
      <div data-testid="current-phase">{lessonState.currentPhase || 'null'}</div>
      <div data-testid="current-step">{lessonState.currentStep}</div>
      <div data-testid="phase-progress">{lessonState.phaseProgress}</div>
      <button 
        data-testid="start-situation" 
        onClick={() => lessonState.startPhase('situation')}
      >
        Start Situation
      </button>
      <button 
        data-testid="complete-phase" 
        onClick={() => lessonState.completePhase()}
      >
        Complete Phase
      </button>
      <button 
        data-testid="reset-lesson" 
        onClick={() => lessonState.resetLesson()}
      >
        Reset Lesson
      </button>
    </div>
  );
};

// Wrapper avec GameStoreProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GameStoreProvider>{children}</GameStoreProvider>
);

export { TestComponent, TestWrapper };

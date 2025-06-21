/**
 * useGameLessonState - Hook personnalisé pour gestion centralisée des états de leçon
 * Encapsule l'utilisation du GameStore étendu spécifiquement pour les composants game-lesson
 * Fournit une API simple et sécurisée pour gérer les états de leçon et de dialogue
 */

import { useCallback } from 'react';
import { useGameStore, gameStoreActions, type GlobalGameState } from '../store/gameStore';

// Interface pour le hook useGameLessonState
export interface GameLessonStateHook {
  // Getters - État actuel
  currentPhase: GlobalGameState['lessonState']['currentPhase'];
  currentStep: number;
  phaseProgress: number;
  dialogueState: GlobalGameState['dialogueState'];
  
  // Setters - Actions pour modifier l'état
  updatePhase: (phase: GlobalGameState['lessonState']['currentPhase'], step?: number) => void;
  updateStep: (step: number) => void;
  updateProgress: (progress: number) => void;
  updateDialogue: (dialogueState: Partial<GlobalGameState['dialogueState']>) => void;
  
  // Actions - Opérations complexes
  resetLesson: () => void;
  completePhase: () => void;
  moveToNextStep: () => void;
  startPhase: (phase: GlobalGameState['lessonState']['currentPhase']) => void;
  
  // Utilitaires
  isPhaseCompleted: (phase: GlobalGameState['lessonState']['currentPhase']) => boolean;
  getTotalStepsForCurrentPhase: () => number;
}

/**
 * Hook useGameLessonState
 * Point d'entrée principal pour tous les composants game-lesson
 */
export const useGameLessonState = (): GameLessonStateHook => {
  const { state, dispatch } = useGameStore();
  
  // Validation que le GameStore est bien configuré
  if (!state.lessonState || !state.dialogueState) {
    console.error('useGameLessonState: GameStore not properly extended with lesson state');
    throw new Error('GameStore must be extended with lessonState and dialogueState');
  }
  
  // Getters - Accès direct aux états
  const currentPhase = state.lessonState.currentPhase;
  const currentStep = state.lessonState.currentStep;
  const phaseProgress = state.lessonState.phaseProgress;
  const dialogueState = state.dialogueState;
  
  // Setters - Actions pour modifier l'état avec validation
  const updatePhase = useCallback((phase: GlobalGameState['lessonState']['currentPhase'], step?: number) => {
    console.log(`[useGameLessonState] Updating phase to: ${phase}, step: ${step}`);
    
    // Validation de la phase
    const validPhases = ['situation', 'vocabulary', 'exercises', 'integration', null];
    if (phase !== null && !validPhases.includes(phase)) {
      console.error(`[useGameLessonState] Invalid phase: ${phase}`);
      return;
    }
    
    dispatch(gameStoreActions.updateLessonPhase(phase, step));
  }, [dispatch]);
  
  const updateStep = useCallback((step: number) => {
    console.log(`[useGameLessonState] Updating step to: ${step}`);
    
    // Validation de l'étape
    if (step < 0) {
      console.error(`[useGameLessonState] Invalid step: ${step} (must be >= 0)`);
      return;
    }
    
    dispatch(gameStoreActions.updateLessonProgress(step));
  }, [dispatch]);
  
  const updateProgress = useCallback((progress: number) => {
    console.log(`[useGameLessonState] Updating progress to: ${progress}%`);
    
    // Validation du progrès
    if (progress < 0 || progress > 100) {
      console.error(`[useGameLessonState] Invalid progress: ${progress} (must be 0-100)`);
      return;
    }
    
    dispatch(gameStoreActions.updateLessonProgress(undefined, progress));
  }, [dispatch]);
  
  const updateDialogue = useCallback((newDialogueState: Partial<GlobalGameState['dialogueState']>) => {
    console.log(`[useGameLessonState] Updating dialogue state:`, newDialogueState);
    
    // Validation de l'index de dialogue
    if (newDialogueState.currentDialogueIndex !== undefined && newDialogueState.currentDialogueIndex < 0) {
      console.error(`[useGameLessonState] Invalid dialogue index: ${newDialogueState.currentDialogueIndex}`);
      return;
    }
    
    dispatch(gameStoreActions.updateDialogueState(newDialogueState));
  }, [dispatch]);
  
  // Actions - Opérations complexes avec logique métier
  const resetLesson = useCallback(() => {
    console.log(`[useGameLessonState] Resetting lesson state`);
    dispatch(gameStoreActions.resetLessonState());
  }, [dispatch]);
  
  const completePhase = useCallback(() => {
    console.log(`[useGameLessonState] Completing current phase: ${currentPhase}`);
    
    if (!currentPhase) {
      console.warn(`[useGameLessonState] No current phase to complete`);
      return;
    }
    
    // Logique de transition entre phases
    const phaseOrder = ['situation', 'vocabulary', 'exercises', 'integration'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    
    if (currentIndex < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIndex + 1] as GlobalGameState['lessonState']['currentPhase'];
      console.log(`[useGameLessonState] Moving to next phase: ${nextPhase}`);
      dispatch(gameStoreActions.updateLessonPhase(nextPhase, 0));
      dispatch(gameStoreActions.updateLessonProgress(0, 0));
    } else {
      console.log(`[useGameLessonState] All phases completed`);
      // Leçon terminée, rester en phase integration
      dispatch(gameStoreActions.updateLessonProgress(undefined, 100));
    }
  }, [currentPhase, dispatch]);
  
  const moveToNextStep = useCallback(() => {
    const nextStep = currentStep + 1;
    console.log(`[useGameLessonState] Moving to next step: ${nextStep}`);
    dispatch(gameStoreActions.updateLessonProgress(nextStep));
  }, [currentStep, dispatch]);
  
  const startPhase = useCallback((phase: GlobalGameState['lessonState']['currentPhase']) => {
    console.log(`[useGameLessonState] Starting phase: ${phase}`);
    dispatch(gameStoreActions.updateLessonPhase(phase, 0));
    dispatch(gameStoreActions.updateLessonProgress(0, 0));
  }, [dispatch]);
  
  // Utilitaires - Fonctions d'aide pour les composants
  const isPhaseCompleted = useCallback((phase: GlobalGameState['lessonState']['currentPhase']) => {
    if (!phase) return false;
    
    // Logique simple : une phase est complétée si le progrès est à 100%
    // Les composants peuvent implémenter leur propre logique
    return currentPhase === phase && phaseProgress >= 100;
  }, [currentPhase, phaseProgress]);
  
  const getTotalStepsForCurrentPhase = useCallback(() => {
    // Nombre d'étapes par défaut par phase
    const defaultSteps = {
      'situation': 1,
      'vocabulary': 5,
      'exercises': 3,
      'integration': 1
    };
    
    return currentPhase ? defaultSteps[currentPhase] || 1 : 1;
  }, [currentPhase]);
  
  return {
    // Getters
    currentPhase,
    currentStep,
    phaseProgress,
    dialogueState,
    
    // Setters
    updatePhase,
    updateStep,
    updateProgress,
    updateDialogue,
    
    // Actions
    resetLesson,
    completePhase,
    moveToNextStep,
    startPhase,
    
    // Utilitaires
    isPhaseCompleted,
    getTotalStepsForCurrentPhase,
  };
};

export default useGameLessonState;

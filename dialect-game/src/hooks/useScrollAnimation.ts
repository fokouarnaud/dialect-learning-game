/**
 * React Hook for Smooth Scroll Animations
 * Easy-to-use hook wrapper for ScrollAnimationManager
 * Handles component lifecycle and cleanup automatically
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  ScrollAnimationManager,
  EasingFunctions,
  createAccessibleAnimation,
  globalScrollAnimationManager
} from '../utils/ScrollAnimationManager';
import type {
  ScrollAnimationOptions,
  AnimationConfig
} from '../utils/ScrollAnimationManager';

export interface UseScrollAnimationOptions {
  /**
   * Whether to use the global animation manager or create a local one
   */
  useGlobal?: boolean;
  
  /**
   * Default animation configuration
   */
  defaultConfig?: Partial<AnimationConfig>;
}

export interface UseScrollAnimationReturn {
  /**
   * Start a smooth scroll animation
   */
  animate: (options: ScrollAnimationOptions) => Promise<void>;
  
  /**
   * Animate a value between two numbers with callback
   */
  animateValue: (
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    options?: AnimationConfig
  ) => Promise<void>;
  
  /**
   * Smooth scroll to an element
   */
  scrollToElement: (
    element: HTMLElement,
    container?: HTMLElement,
    options?: AnimationConfig
  ) => Promise<void>;
  
  /**
   * Create a spring (bouncy) animation
   */
  springAnimation: (
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    options?: AnimationConfig
  ) => Promise<void>;
  
  /**
   * Cancel all animations managed by this hook
   */
  cancelAllAnimations: () => void;
  
  /**
   * Check if any animations are currently running
   */
  hasActiveAnimations: () => boolean;
  
  /**
   * Get the number of active animations
   */
  getActiveAnimationCount: () => number;
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn => {
  const {
    useGlobal = true,
    defaultConfig = {}
  } = options;

  // Local animation manager reference
  const localManagerRef = useRef<ScrollAnimationManager | null>(null);

  // Get the animation manager (global or local)
  const getManager = useCallback((): ScrollAnimationManager => {
    if (useGlobal) {
      return globalScrollAnimationManager;
    }
    
    if (!localManagerRef.current) {
      localManagerRef.current = new ScrollAnimationManager();
    }
    
    return localManagerRef.current;
  }, [useGlobal]);

  // Animate function with default config applied
  const animate = useCallback(async (animationOptions: ScrollAnimationOptions): Promise<void> => {
    const manager = getManager();
    const finalOptions = createAccessibleAnimation({
      duration: 600,
      easing: EasingFunctions.easeOutQuart,
      ...defaultConfig,
      ...animationOptions
    });
    
    return manager.animate(finalOptions);
  }, [getManager, defaultConfig]);

  // Animate value with callback
  const animateValue = useCallback(async (
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    animationConfig: AnimationConfig = {}
  ): Promise<void> => {
    const manager = getManager();
    const finalConfig = {
      duration: 400,
      easing: EasingFunctions.easeOutQuart,
      ...defaultConfig,
      ...animationConfig
    };
    
    return manager.animateValue(from, to, onUpdate, finalConfig);
  }, [getManager, defaultConfig]);

  // Scroll to element
  const scrollToElement = useCallback(async (
    element: HTMLElement,
    container: HTMLElement = document.documentElement,
    animationConfig: AnimationConfig = {}
  ): Promise<void> => {
    const manager = getManager();
    const finalConfig = {
      duration: 600,
      easing: EasingFunctions.easeOutQuart,
      ...defaultConfig,
      ...animationConfig
    };
    
    return manager.scrollToElement(element, container, finalConfig);
  }, [getManager, defaultConfig]);

  // Spring animation
  const springAnimation = useCallback(async (
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    animationConfig: AnimationConfig = {}
  ): Promise<void> => {
    const manager = getManager();
    const finalConfig = {
      duration: 600,
      easing: EasingFunctions.easeOutElastic,
      ...defaultConfig,
      ...animationConfig
    };
    
    return manager.animateValue(from, to, onUpdate, finalConfig);
  }, [getManager, defaultConfig]);

  // Cancel all animations
  const cancelAllAnimations = useCallback((): void => {
    const manager = getManager();
    manager.cancelAllAnimations();
  }, [getManager]);

  // Check for active animations
  const hasActiveAnimations = useCallback((): boolean => {
    const manager = getManager();
    return manager.hasActiveAnimations();
  }, [getManager]);

  // Get active animation count
  const getActiveAnimationCount = useCallback((): number => {
    const manager = getManager();
    return manager.getActiveAnimationCount();
  }, [getManager]);

  // Cleanup on unmount (only for local managers)
  useEffect(() => {
    return () => {
      if (!useGlobal && localManagerRef.current) {
        localManagerRef.current.destroy();
        localManagerRef.current = null;
      }
    };
  }, [useGlobal]);

  return {
    animate,
    animateValue,
    scrollToElement,
    springAnimation,
    cancelAllAnimations,
    hasActiveAnimations,
    getActiveAnimationCount
  };
};

// Specialized hooks for common use cases

/**
 * Hook for lesson navigation animations
 */
export const useLessonNavigation = () => {
  return useScrollAnimation({
    useGlobal: true,
    defaultConfig: {
      duration: 800,
      easing: EasingFunctions.easeOutQuart
    }
  });
};

/**
 * Hook for parallax background animations
 */
export const useParallaxAnimation = () => {
  return useScrollAnimation({
    useGlobal: false, // Use local manager for parallax
    defaultConfig: {
      duration: 1000,
      easing: EasingFunctions.easeInOut
    }
  });
};

/**
 * Hook for UI micro-interactions
 */
export const useMicroAnimations = () => {
  return useScrollAnimation({
    useGlobal: false,
    defaultConfig: {
      duration: 200,
      easing: EasingFunctions.easeOut
    }
  });
};

/**
 * Hook that automatically handles page navigation
 */
export const usePageNavigation = () => {
  const { scrollToElement, animateValue } = useScrollAnimation({
    useGlobal: true,
    defaultConfig: {
      duration: 600,
      easing: EasingFunctions.easeOutQuart
    }
  });

  const navigateToSection = useCallback(async (
    sectionId: string,
    offset: number = 0
  ): Promise<void> => {
    const element = document.getElementById(sectionId);
    if (!element) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

    const container = document.documentElement;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const targetScrollTop = container.scrollTop + 
      (elementRect.top - containerRect.top) + offset;

    return animateValue(
      container.scrollTop,
      Math.max(0, Math.min(targetScrollTop, container.scrollHeight - container.clientHeight)),
      (value) => {
        container.scrollTop = value;
      }
    );
  }, [scrollToElement, animateValue]);

  return {
    navigateToSection,
    scrollToElement,
    animateValue
  };
};

export default useScrollAnimation;
/**
 * Smooth Scrolling Animation Manager
 * Advanced animation system for EdClub-style smooth navigation
 * Performance-optimized with requestAnimationFrame
 */

export type EasingFunction = (t: number) => number;

export interface AnimationConfig {
  duration?: number;
  easing?: EasingFunction;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface ScrollAnimationOptions extends AnimationConfig {
  from: number;
  to: number;
  property?: 'scrollTop' | 'scrollLeft' | 'custom';
  element?: HTMLElement | null;
}

// Predefined easing functions
export const EasingFunctions = {
  linear: (t: number): number => t,
  
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),
  
  easeIn: (t: number): number => t * t * t,
  
  easeInOut: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  
  // Bouncy animation for special effects
  easeOutBounce: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  // Smooth spring animation
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

export class ScrollAnimationManager {
  private activeAnimations = new Map<string, number>();
  private animationCounter = 0;

  /**
   * Start a smooth scroll animation
   */
  public animate(options: ScrollAnimationOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const animationId = `anim_${++this.animationCounter}`;
      
      const {
        from,
        to,
        duration = 800,
        easing = EasingFunctions.easeOutQuart,
        property = 'custom',
        element = null,
        onProgress,
        onComplete,
        onCancel
      } = options;

      // Cancel any existing animation for this element
      if (element) {
        this.cancelElementAnimations(element);
      }

      const startTime = performance.now();
      const distance = to - from;

      const animateFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        const currentValue = from + (distance * easedProgress);

        // Apply the animation
        if (property === 'scrollTop' && element) {
          element.scrollTop = currentValue;
        } else if (property === 'scrollLeft' && element) {
          element.scrollLeft = currentValue;
        }

        // Call progress callback
        if (onProgress) {
          onProgress(easedProgress);
        }

        // Check if animation is complete
        if (progress >= 1) {
          this.activeAnimations.delete(animationId);
          if (onComplete) onComplete();
          resolve();
          return;
        }

        // Continue animation
        const rafId = requestAnimationFrame(animateFrame);
        this.activeAnimations.set(animationId, rafId);
      };

      // Start animation
      const rafId = requestAnimationFrame(animateFrame);
      this.activeAnimations.set(animationId, rafId);

      // Store cancel callback for potential cleanup
      if (onCancel) {
        // You can extend this to store cancel callbacks if needed
      }
    });
  }

  /**
   * Cancel a specific animation
   */
  public cancelAnimation(animationId: string): void {
    const rafId = this.activeAnimations.get(animationId);
    if (rafId) {
      cancelAnimationFrame(rafId);
      this.activeAnimations.delete(animationId);
    }
  }

  /**
   * Cancel all animations for a specific element
   */
  public cancelElementAnimations(element: HTMLElement): void {
    // For this implementation, we'll cancel all animations
    // In a more advanced version, you could track animations per element
    this.cancelAllAnimations();
  }

  /**
   * Cancel all active animations
   */
  public cancelAllAnimations(): void {
    this.activeAnimations.forEach((rafId) => {
      cancelAnimationFrame(rafId);
    });
    this.activeAnimations.clear();
  }

  /**
   * Get the number of active animations
   */
  public getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }

  /**
   * Check if any animations are currently running
   */
  public hasActiveAnimations(): boolean {
    return this.activeAnimations.size > 0;
  }

  /**
   * Smooth scroll to element (utility method)
   */
  public scrollToElement(
    element: HTMLElement,
    container: HTMLElement = document.documentElement,
    options: AnimationConfig = {}
  ): Promise<void> {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const targetScrollTop = container.scrollTop + 
      (elementRect.top - containerRect.top) - 
      (containerRect.height / 2) + 
      (elementRect.height / 2);

    return this.animate({
      from: container.scrollTop,
      to: Math.max(0, Math.min(targetScrollTop, container.scrollHeight - container.clientHeight)),
      property: 'scrollTop',
      element: container,
      duration: 600,
      easing: EasingFunctions.easeOutQuart,
      ...options
    });
  }

  /**
   * Animate a custom property with callback
   */
  public animateValue(
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    options: AnimationConfig = {}
  ): Promise<void> {
    return this.animate({
      from,
      to,
      property: 'custom',
      onProgress: (progress) => {
        const value = from + (to - from) * progress;
        onUpdate(value);
      },
      duration: 400,
      easing: EasingFunctions.easeOutQuart,
      ...options
    });
  }

  /**
   * Create a spring animation (bouncy effect)
   */
  public springAnimation(
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    options: AnimationConfig = {}
  ): Promise<void> {
    return this.animateValue(from, to, onUpdate, {
      duration: 600,
      easing: EasingFunctions.easeOutElastic,
      ...options
    });
  }

  /**
   * Cleanup method for component unmounting
   */
  public destroy(): void {
    this.cancelAllAnimations();
  }
}

// Singleton instance for global use
export const globalScrollAnimationManager = new ScrollAnimationManager();

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility function that respects motion preferences
export const createAccessibleAnimation = (options: ScrollAnimationOptions): ScrollAnimationOptions => {
  if (prefersReducedMotion()) {
    return {
      ...options,
      duration: 0, // Instant for reduced motion
      easing: EasingFunctions.linear
    };
  }
  return options;
};
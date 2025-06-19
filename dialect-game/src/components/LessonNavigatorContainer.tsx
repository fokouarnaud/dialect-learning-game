/**
 * Main Lesson Navigator Container
 * EdClub-inspired complete navigation system with parallax background
 * Orchestrates vertical navigation, lesson grid, and smooth animations
 */

import React, { useState, useCallback, useEffect } from 'react';
import { VerticalLessonNavigator, type LessonData } from './VerticalLessonNavigator';
import { useLessonNavigation, useParallaxAnimation } from '../hooks/useScrollAnimation';

export interface LessonNavigatorContainerProps {
  lessons: LessonData[];
  backgroundImage?: string;
  parallaxSpeed?: number;
  onLessonChange?: (lessonIndex: number, lesson: LessonData) => void;
  onShowAllLessons?: () => void;
  initialLessonIndex?: number;
  className?: string;
  children?: React.ReactNode;
}

export const LessonNavigatorContainer: React.FC<LessonNavigatorContainerProps> = ({
  lessons,
  backgroundImage = 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=2560&h=1440',
  parallaxSpeed = 0.5,
  onLessonChange,
  onShowAllLessons,
  initialLessonIndex = 0,
  className = '',
  children
}) => {
  // State management
  const [currentLessonIndex, setCurrentLessonIndex] = useState(
    Math.max(0, Math.min(initialLessonIndex, lessons.length - 1))
  );
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation hooks
  const { animateValue: navigateAnimation } = useLessonNavigation();
  const { animateValue: parallaxAnimation } = useParallaxAnimation();

  // Calculate parallax position based on lesson progression
  const calculateParallaxPosition = useCallback((lessonIndex: number): number => {
    if (lessons.length <= 1) return 0;
    
    // Map lesson progression (0 to lessons.length-1) to parallax range (0 to 100)
    const progressPercentage = lessonIndex / (lessons.length - 1);
    return progressPercentage * 100;
  }, [lessons.length]);

  // Handle lesson navigation
  const handleNavigation = useCallback(async (direction: 'up' | 'down') => {
    if (isTransitioning) return;

    const newIndex = direction === 'up' 
      ? Math.max(0, currentLessonIndex - 1)
      : Math.min(lessons.length - 1, currentLessonIndex + 1);

    if (newIndex === currentLessonIndex) return;

    setIsTransitioning(true);

    try {
      // Calculate new parallax position
      const newParallaxPosition = calculateParallaxPosition(newIndex);

      // Animate parallax background
      await parallaxAnimation(
        parallaxOffset,
        newParallaxPosition,
        (value) => setParallaxOffset(value),
        {
          duration: 800,
          onComplete: () => {
            // Update lesson index after animation completes
            setCurrentLessonIndex(newIndex);
            
            // Notify parent component
            if (onLessonChange) {
              onLessonChange(newIndex, lessons[newIndex]);
            }
          }
        }
      );
    } catch (error) {
      console.error('Navigation animation failed:', error);
      // Fallback: update immediately
      setCurrentLessonIndex(newIndex);
      setParallaxOffset(calculateParallaxPosition(newIndex));
      
      if (onLessonChange) {
        onLessonChange(newIndex, lessons[newIndex]);
      }
    } finally {
      setIsTransitioning(false);
    }
  }, [
    currentLessonIndex,
    lessons,
    parallaxOffset,
    isTransitioning,
    calculateParallaxPosition,
    parallaxAnimation,
    onLessonChange
  ]);

  // Handle direct lesson selection
  const handleLessonSelect = useCallback(async (lessonIndex: number) => {
    if (lessonIndex === currentLessonIndex || isTransitioning) return;

    setIsTransitioning(true);

    try {
      const newParallaxPosition = calculateParallaxPosition(lessonIndex);

      // Animate to new position
      await parallaxAnimation(
        parallaxOffset,
        newParallaxPosition,
        (value) => setParallaxOffset(value),
        {
          duration: 1000,
          onComplete: () => {
            setCurrentLessonIndex(lessonIndex);
            
            if (onLessonChange) {
              onLessonChange(lessonIndex, lessons[lessonIndex]);
            }
          }
        }
      );
    } catch (error) {
      console.error('Lesson selection animation failed:', error);
      // Fallback
      setCurrentLessonIndex(lessonIndex);
      setParallaxOffset(calculateParallaxPosition(lessonIndex));
      
      if (onLessonChange) {
        onLessonChange(lessonIndex, lessons[lessonIndex]);
      }
    } finally {
      setIsTransitioning(false);
    }
  }, [
    currentLessonIndex,
    parallaxOffset,
    isTransitioning,
    calculateParallaxPosition,
    parallaxAnimation,
    lessons,
    onLessonChange
  ]);

  // Initialize parallax position
  useEffect(() => {
    const initialPosition = calculateParallaxPosition(currentLessonIndex);
    setParallaxOffset(initialPosition);
  }, [calculateParallaxPosition, currentLessonIndex]);

  // Handle lesson index changes from parent
  useEffect(() => {
    if (initialLessonIndex !== currentLessonIndex) {
      handleLessonSelect(initialLessonIndex);
    }
  }, [initialLessonIndex]); // Only watch initialLessonIndex

  // Get current lesson data
  const currentLesson = lessons[currentLessonIndex];

  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Parallax Background */}
      <div
        className="fixed inset-0 w-full h-[300vh]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: `center ${parallaxOffset}%`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.6) contrast(1.2)',
          transition: 'background-position 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
          zIndex: -1
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="min-h-screen relative z-10">
        {/* Vertical Navigation */}
        <div 
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30"
          style={{ top: 'calc(50% - 120px)' }}
        >
          <VerticalLessonNavigator
            lessons={lessons}
            currentIndex={currentLessonIndex}
            onNavigate={handleNavigation}
            onShowAllLessons={onShowAllLessons}
            disabled={isTransitioning}
            className="drop-shadow-lg"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-20 pr-4">
          {children}
        </div>

        {/* Current Lesson Info Panel */}
        {currentLesson && (
          <div className="fixed bottom-4 right-4 z-30">
            <div className="bg-card/90 backdrop-blur-md border border-border/30 rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentLesson.difficulty === 'beginner' ? 'bg-green-500' :
                  currentLesson.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-foreground">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </span>
              </div>
              
              <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                {currentLesson.title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {currentLesson.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{currentLesson.duration} min</span>
                <span>{currentLesson.xpReward} XP</span>
                <span className="capitalize">{currentLesson.status}</span>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-2 w-full bg-muted rounded-full h-1">
                <div
                  className="h-1 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Instructions Overlay (for first-time users) */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Use ↑↓ arrows or navigation controls to browse lessons
            </p>
          </div>
        </div>

        {/* Transition Loading Indicator */}
        {isTransitioning && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-card/90 backdrop-blur-md border border-border/30 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Navigating...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonNavigatorContainer;
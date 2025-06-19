/**
 * Vertical Lesson Navigator Component
 * EdClub-inspired vertical navigation with up/down arrows
 * Full accessibility support and smooth animations
 */

import React, { useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown, List } from 'lucide-react';

export interface LessonData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'completed' | 'current' | 'locked' | 'available';
  category: string;
  duration: number;
  xpReward: number;
  isRecommended?: boolean;
}

export interface VerticalNavigatorProps {
  lessons: LessonData[];
  currentIndex: number;
  onNavigate: (direction: 'up' | 'down') => void;
  onShowAllLessons?: () => void;
  disabled?: boolean;
  className?: string;
}

export const VerticalLessonNavigator: React.FC<VerticalNavigatorProps> = ({
  lessons,
  currentIndex,
  onNavigate,
  onShowAllLessons,
  disabled = false,
  className = ''
}) => {
  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex < lessons.length - 1;
  const totalLessons = lessons.length;

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (canGoUp) {
          onNavigate('up');
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (canGoDown) {
          onNavigate('down');
        }
        break;
      case 'Home':
        event.preventDefault();
        if (currentIndex > 0) {
          // Navigate to first lesson
          for (let i = 0; i < currentIndex; i++) {
            onNavigate('up');
          }
        }
        break;
      case 'End':
        event.preventDefault();
        if (currentIndex < totalLessons - 1) {
          // Navigate to last lesson
          for (let i = currentIndex; i < totalLessons - 1; i++) {
            onNavigate('down');
          }
        }
        break;
    }
  }, [currentIndex, canGoUp, canGoDown, disabled, onNavigate, totalLessons]);

  // Setup keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Screen reader announcements
  const announceNavigation = (direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const nextLesson = lessons[nextIndex];
    
    if (nextLesson) {
      const announcement = `Navigating ${direction} to lesson ${nextIndex + 1} of ${totalLessons}: ${nextLesson.title}`;
      
      // Create temporary element for screen reader announcement
      const announcement_element = document.createElement('div');
      announcement_element.setAttribute('aria-live', 'polite');
      announcement_element.setAttribute('aria-atomic', 'true');
      announcement_element.className = 'sr-only';
      announcement_element.textContent = announcement;
      
      document.body.appendChild(announcement_element);
      setTimeout(() => document.body.removeChild(announcement_element), 1000);
    }
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    if (disabled) return;
    
    announceNavigation(direction);
    onNavigate(direction);
  };

  return (
    <div 
      className={`flex flex-col items-center space-y-3 ${className}`}
      role="navigation"
      aria-label="Vertical lesson navigation"
    >
      {/* All Lessons Button */}
      {onShowAllLessons && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShowAllLessons}
          className="bg-card/90 backdrop-blur-sm border-border text-muted-foreground hover:bg-muted hover:text-foreground p-2 shadow-sm transition-all duration-200"
          title="Show all lessons"
          aria-label="Show all lessons"
        >
          <List className="h-4 w-4" />
        </Button>
      )}

      {/* Previous Lesson Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigate('up')}
        disabled={!canGoUp || disabled}
        className="text-muted-foreground hover:text-foreground p-2 opacity-70 hover:opacity-100 transition-all duration-200 disabled:opacity-30"
        title={canGoUp ? `Previous lesson: ${lessons[currentIndex - 1]?.title}` : 'No previous lesson'}
        aria-label={canGoUp ? `Go to previous lesson: ${lessons[currentIndex - 1]?.title}` : 'No previous lesson available'}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      {/* Progress Indicator */}
      <div className="relative" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={totalLessons}>
        {/* Progress Bar */}
        <div className="w-1 h-48 bg-muted rounded-full">
          <div
            className="w-1 bg-gradient-to-t from-primary to-primary/60 rounded-full transition-all duration-500"
            style={{ height: `${((currentIndex + 1) / totalLessons) * 100}%` }}
          />
        </div>
        
        {/* Current Position Indicator */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md transition-all duration-500"
          style={{ top: `${(currentIndex / (totalLessons - 1)) * 180}px` }}
          aria-hidden="true"
        >
          <div className="w-2 h-2 bg-primary-foreground rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Next Lesson Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigate('down')}
        disabled={!canGoDown || disabled}
        className="text-muted-foreground hover:text-foreground p-2 opacity-70 hover:opacity-100 transition-all duration-200 disabled:opacity-30"
        title={canGoDown ? `Next lesson: ${lessons[currentIndex + 1]?.title}` : 'No next lesson'}
        aria-label={canGoDown ? `Go to next lesson: ${lessons[currentIndex + 1]?.title}` : 'No next lesson available'}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Current Lesson Counter */}
      <div className="text-center mt-2" aria-live="polite">
        <div 
          className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md"
          title={`Lesson ${currentIndex + 1} of ${totalLessons}`}
        >
          {currentIndex + 1}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 opacity-70">
          of {totalLessons}
        </div>
      </div>

      {/* Screen Reader Only: Current Lesson Info */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Currently on lesson {currentIndex + 1} of {totalLessons}: {lessons[currentIndex]?.title}. 
        {canGoUp && ' Press up arrow for previous lesson.'}
        {canGoDown && ' Press down arrow for next lesson.'}
        {onShowAllLessons && ' Press Tab to show all lessons.'}
      </div>
    </div>
  );
};

export default VerticalLessonNavigator;
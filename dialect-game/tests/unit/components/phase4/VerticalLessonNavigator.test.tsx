/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { VerticalLessonNavigator } from '../../../../src/components/VerticalLessonNavigator';
import type { LessonData } from '../../../../src/components/VerticalLessonNavigator';

// Mock lesson data
const mockLessons: LessonData[] = [
  {
    id: 'lesson-1',
    title: 'Basic Greetings',
    description: 'Learn essential French greetings',
    difficulty: 'beginner',
    status: 'completed',
    category: 'conversation',
    duration: 15,
    xpReward: 50,
    isRecommended: false
  },
  {
    id: 'lesson-2',
    title: 'Numbers 1-10',
    description: 'Count from one to ten in French',
    difficulty: 'beginner',
    status: 'current',
    category: 'vocabulary',
    duration: 20,
    xpReward: 75,
    isRecommended: true
  },
  {
    id: 'lesson-3',
    title: 'Colors & Objects',
    description: 'Describe colors and common objects',
    difficulty: 'intermediate',
    status: 'available',
    category: 'vocabulary',
    duration: 25,
    xpReward: 100,
    isRecommended: false
  },
  {
    id: 'lesson-4',
    title: 'Advanced Grammar',
    description: 'Complex grammatical structures',
    difficulty: 'advanced',
    status: 'locked',
    category: 'grammar',
    duration: 45,
    xpReward: 200,
    isRecommended: false
  }
];

describe('VerticalLessonNavigator', () => {
  const mockOnNavigate = vi.fn();
  const mockOnShowAllLessons = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with lesson data', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
        onShowAllLessons={mockOnShowAllLessons}
      />
    );

    // Check if navigation is rendered
    expect(screen.getByRole('navigation', { name: /vertical lesson navigation/i })).toBeInTheDocument();
    
    // Check current lesson counter
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('of 4')).toBeInTheDocument();
  });

  it('displays correct navigation buttons', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
        onShowAllLessons={mockOnShowAllLessons}
      />
    );

    // Check for up/down arrow buttons
    const upButton = screen.getByLabelText(/go to previous lesson/i);
    const downButton = screen.getByLabelText(/go to next lesson/i);
    
    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    expect(upButton).not.toBeDisabled();
    expect(downButton).not.toBeDisabled();
  });

  it('disables navigation buttons at boundaries', () => {
    // Test at first lesson
    const { rerender } = render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={0}
        onNavigate={mockOnNavigate}
      />
    );

    const upButton = screen.getByLabelText(/no previous lesson/i);
    expect(upButton).toBeDisabled();

    // Test at last lesson
    rerender(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={3}
        onNavigate={mockOnNavigate}
      />
    );

    const downButton = screen.getByLabelText(/no next lesson/i);
    expect(downButton).toBeDisabled();
  });

  it('calls onNavigate when navigation buttons are clicked', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
      />
    );

    const upButton = screen.getByLabelText(/go to previous lesson/i);
    const downButton = screen.getByLabelText(/go to next lesson/i);

    fireEvent.click(upButton);
    expect(mockOnNavigate).toHaveBeenCalledWith('up');

    fireEvent.click(downButton);
    expect(mockOnNavigate).toHaveBeenCalledWith('down');
  });

  it('calls onShowAllLessons when all lessons button is clicked', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
        onShowAllLessons={mockOnShowAllLessons}
      />
    );

    const allLessonsButton = screen.getByLabelText(/show all lessons/i);
    fireEvent.click(allLessonsButton);
    
    expect(mockOnShowAllLessons).toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
      />
    );

    // Test ArrowUp
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(mockOnNavigate).toHaveBeenCalledWith('up');

    // Test ArrowDown
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(mockOnNavigate).toHaveBeenCalledWith('down');
  });

  it('does not navigate when disabled', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
        disabled={true}
      />
    );

    const upButton = screen.getByLabelText(/go to previous lesson/i);
    const downButton = screen.getByLabelText(/go to next lesson/i);

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();

    // Keyboard navigation should also be disabled
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it('displays progress bar correctly', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
      />
    );

    // Check for progress bar
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '2');
    expect(progressBar).toHaveAttribute('aria-valuemin', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '4');
  });

  it('provides proper ARIA labels and accessibility', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={1}
        onNavigate={mockOnNavigate}
      />
    );

    // Check navigation role
    expect(screen.getByRole('navigation', { name: /vertical lesson navigation/i })).toBeInTheDocument();
    
    // Check screen reader content
    expect(screen.getByText(/currently on lesson 2 of 4/i)).toBeInTheDocument();
    
    // Check button labels include lesson titles
    expect(screen.getByLabelText(/previous lesson: basic greetings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next lesson: colors & objects/i)).toBeInTheDocument();
  });

  it('handles edge cases gracefully', () => {
    // Test with empty lessons array
    render(
      <VerticalLessonNavigator
        lessons={[]}
        currentIndex={0}
        onNavigate={mockOnNavigate}
      />
    );

    // Should still render without crashing
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('updates lesson counter when currentIndex changes', () => {
    const { rerender } = render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={0}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={2}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles Home and End key navigation', () => {
    render(
      <VerticalLessonNavigator
        lessons={mockLessons}
        currentIndex={2}
        onNavigate={mockOnNavigate}
      />
    );

    // Test Home key (should navigate to first lesson)
    fireEvent.keyDown(document, { key: 'Home' });
    // For Home key, it would call onNavigate('up') multiple times
    expect(mockOnNavigate).toHaveBeenCalledWith('up');

    vi.clearAllMocks();

    // Test End key (should navigate to last lesson)
    fireEvent.keyDown(document, { key: 'End' });
    // For End key, it would call onNavigate('down') multiple times
    expect(mockOnNavigate).toHaveBeenCalledWith('down');
  });
});
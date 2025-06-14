/**
 * Unit tests for ScoreDisplay component
 * Following TDD methodology - these tests will initially fail (RED phase)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ScoreDisplay } from '../../../src/components/ScoreDisplay';

describe('ScoreDisplay', () => {
  const defaultProps = {
    score: 0,
    highScore: 1000,
    level: 1,
    accuracy: 85.5,
    streak: 5
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render score with proper formatting', () => {
      render(<ScoreDisplay {...defaultProps} score={1234} />);
      
      expect(screen.getByTestId('score-value')).toHaveTextContent('1,234');
      expect(screen.getByText(/score/i)).toBeInTheDocument();
    });

    it('should format large scores correctly', () => {
      render(<ScoreDisplay {...defaultProps} score={1234567} />);
      
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('should display high score', () => {
      render(<ScoreDisplay {...defaultProps} highScore={5000} />);
      
      expect(screen.getByText('5,000')).toBeInTheDocument();
      expect(screen.getByText(/best/i)).toBeInTheDocument();
    });

    it('should display current level', () => {
      render(<ScoreDisplay {...defaultProps} level={3} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/level/i)).toBeInTheDocument();
    });

    it('should display accuracy percentage', () => {
      render(<ScoreDisplay {...defaultProps} accuracy={92.7} />);
      
      expect(screen.getByText('92.7%')).toBeInTheDocument();
      expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
    });

    it('should display streak count', () => {
      render(<ScoreDisplay {...defaultProps} streak={10} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText(/streak/i)).toBeInTheDocument();
    });

    it('should handle zero values gracefully', () => {
      render(<ScoreDisplay score={0} highScore={0} level={0} accuracy={0} streak={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('Score Animation', () => {
    it('should animate score changes', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={100} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={200} />);
      
      // Should show animation class during transition
      const scoreElement = screen.getByTestId('score-value');
      expect(scoreElement).toHaveClass('score-animating');
      
      // After animation completes
      await waitFor(() => {
        expect(scoreElement).not.toHaveClass('score-animating');
        expect(screen.getByText('200')).toBeInTheDocument();
      });
    });

    it('should animate incrementally for large score changes', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={0} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={1000} />);
      
      // Should see intermediate values during animation
      await waitFor(() => {
        const scoreText = screen.getByTestId('score-value').textContent;
        const score = parseInt(scoreText?.replace(/,/g, '') || '0');
        expect(score).toBeGreaterThan(0);
        expect(score).toBeLessThanOrEqual(1000);
      });
    });

    it('should complete animation with correct final value', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={0} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={1500} />);
      
      await waitFor(() => {
        expect(screen.getByText('1,500')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should not animate if score decreases', () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={500} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={300} />);
      
      // Should immediately show new value without animation
      expect(screen.getByText('300')).toBeInTheDocument();
      const scoreElement = screen.getByTestId('score-value');
      expect(scoreElement).not.toHaveClass('score-animating');
    });
  });

  describe('Milestone Celebrations', () => {
    it('should show celebration for score milestones', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={999} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={1000} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('milestone-celebration')).toBeInTheDocument();
        expect(screen.getByText(/milestone reached/i)).toBeInTheDocument();
      });
    });

    it('should show different celebrations for different milestones', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={4999} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={5000} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('milestone-celebration')).toBeInTheDocument();
        expect(screen.getByText(/amazing/i)).toBeInTheDocument();
      });
    });

    it('should auto-hide celebration after delay', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={999} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={1000} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('milestone-celebration')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('milestone-celebration')).not.toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('should show new high score celebration', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={999} highScore={1000} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={1001} highScore={1001} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('high-score-celebration')).toBeInTheDocument();
        expect(screen.getByText(/new high score/i)).toBeInTheDocument();
      });
    });
  });

  describe('Progress Indicators', () => {
    it('should show progress to next level', () => {
      render(<ScoreDisplay {...defaultProps} score={750} level={1} />);
      
      const progressBar = screen.getByTestId('level-progress');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '75'); // 75% to next level
    });

    it('should show accuracy color coding', () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} accuracy={95} />);
      
      let accuracyElement = screen.getByTestId('accuracy-display');
      expect(accuracyElement).toHaveClass('accuracy-excellent');
      
      rerender(<ScoreDisplay {...defaultProps} accuracy={75} />);
      accuracyElement = screen.getByTestId('accuracy-display');
      expect(accuracyElement).toHaveClass('accuracy-good');
      
      rerender(<ScoreDisplay {...defaultProps} accuracy={50} />);
      accuracyElement = screen.getByTestId('accuracy-display');
      expect(accuracyElement).toHaveClass('accuracy-poor');
    });

    it('should show streak indicator with visual feedback', () => {
      render(<ScoreDisplay {...defaultProps} streak={15} />);
      
      const streakElement = screen.getByTestId('streak-display');
      expect(streakElement).toHaveClass('streak-hot');
      expect(screen.getByText(/🔥/)).toBeInTheDocument();
    });

    it('should show streak broken indicator', () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} streak={10} />);
      
      rerender(<ScoreDisplay {...defaultProps} streak={0} />);
      
      expect(screen.getByTestId('streak-broken')).toBeInTheDocument();
      expect(screen.getByText(/streak broken/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to compact layout on small screens', () => {
      // Mock small viewport
      Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });
      
      render(<ScoreDisplay {...defaultProps} />);
      
      const container = screen.getByTestId('score-display');
      expect(container).toHaveClass('compact-layout');
    });

    it('should show abbreviated labels in compact mode', () => {
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      
      render(<ScoreDisplay {...defaultProps} />);
      
      expect(screen.getByText(/acc/i)).toBeInTheDocument(); // Abbreviated "accuracy"
      expect(screen.queryByText(/accuracy/i)).not.toBeInTheDocument();
    });

    it('should maintain readability with large numbers', () => {
      render(<ScoreDisplay {...defaultProps} score={999999999} />);
      
      const scoreElement = screen.getByTestId('score-value');
      expect(scoreElement).toHaveStyle({ fontSize: expect.any(String) });
      expect(scoreElement.textContent).toMatch(/999,999,999/);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ScoreDisplay {...defaultProps} score={1500} level={3} />);
      
      const scoreElement = screen.getByTestId('score-value');
      expect(scoreElement).toHaveAttribute('aria-label', 'Current score: 1,500');
      
      const levelElement = screen.getByTestId('level-display');
      expect(levelElement).toHaveAttribute('aria-label', 'Current level: 3');
    });

    it('should announce score changes to screen readers', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={100} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={200} />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('Score increased to 200');
      });
    });

    it('should announce milestone achievements', async () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} score={999} />);
      
      rerender(<ScoreDisplay {...defaultProps} score={1000} />);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Milestone reached! Score: 1,000');
      });
    });

    it('should provide keyboard navigation for interactive elements', () => {
      render(<ScoreDisplay {...defaultProps} />);
      
      const container = screen.getByTestId('score-display');
      expect(container).toHaveAttribute('tabIndex', '0');
      expect(container).toHaveAttribute('role', 'region');
      expect(container).toHaveAttribute('aria-label', 'Game statistics');
    });
  });

  describe('Performance', () => {
    it('should not re-render with same props', () => {
      const renderSpy = vi.fn();
      
      const TestComponent = (props: any) => {
        renderSpy();
        return <ScoreDisplay {...props} />;
      };
      
      const { rerender } = render(<TestComponent {...defaultProps} />);
      rerender(<TestComponent {...defaultProps} />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should use memoized formatting functions', () => {
      const formatSpy = vi.spyOn(Intl, 'NumberFormat');
      
      render(<ScoreDisplay {...defaultProps} score={1000} />);
      render(<ScoreDisplay {...defaultProps} score={2000} />);
      
      // NumberFormat should be cached and reused
      expect(formatSpy).toHaveBeenCalledTimes(1);
    });

    it('should cleanup animation timers on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      
      const { unmount } = render(<ScoreDisplay {...defaultProps} score={0} />);
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid score values', () => {
      render(<ScoreDisplay {...defaultProps} score={NaN} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle negative scores', () => {
      render(<ScoreDisplay {...defaultProps} score={-100} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle extremely large scores', () => {
      render(<ScoreDisplay {...defaultProps} score={Number.MAX_SAFE_INTEGER} />);
      
      const scoreElement = screen.getByTestId('score-value');
      expect(scoreElement.textContent).toBeTruthy();
      expect(scoreElement.textContent).not.toBe('NaN');
    });
  });
});
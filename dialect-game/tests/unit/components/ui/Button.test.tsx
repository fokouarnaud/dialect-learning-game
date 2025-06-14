/**
 * Tests unitaires pour le composant Button réutilisable
 * Task 2: Refonte UI moderne avec TailwindCSS - Phase TDD
 */

import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../../src/components/ThemeProvider';
import { Button } from '../../../../src/components/ui/Button';

// Wrapper pour les tests avec ThemeProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const renderWithTheme = (ui: React.ReactElement) =>
  render(ui, { wrapper: TestWrapper });

describe('Button Component', () => {
  describe('Rendering', () => {
    test('should render button with default props', () => {
      renderWithTheme(<Button>Click me</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('bg-blue-500'); // Vérifier une classe TailwindCSS réelle
    });

    test('should render button with custom variant', () => {
      renderWithTheme(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).toHaveTextContent('Secondary');
    });

    test('should render button with outline variant', () => {
      renderWithTheme(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).toHaveTextContent('Outline');
    });

    test('should render button with ghost variant', () => {
      renderWithTheme(<Button variant="ghost">Ghost</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).toHaveTextContent('Ghost');
    });

    test('should render button with different sizes', () => {
      const { rerender } = renderWithTheme(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-sm');

      rerender(<ThemeProvider><Button size="lg">Large</Button></ThemeProvider>);
      expect(screen.getByRole('button')).toHaveClass('btn-lg');

      rerender(<ThemeProvider><Button size="xl">Extra Large</Button></ThemeProvider>);
      expect(screen.getByRole('button')).toHaveClass('btn-xl');
    });

    test('should render disabled button', () => {
      renderWithTheme(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });

    test('should render loading button', () => {
      renderWithTheme(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('should render button with icon', () => {
      renderWithTheme(
        <Button icon={<span data-testid="test-icon">🚀</span>}>
          With Icon
        </Button>
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    test('should render icon-only button', () => {
      renderWithTheme(
        <Button icon={<span data-testid="test-icon">🚀</span>} iconOnly>
          Hidden Text
        </Button>
      );
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Hidden Text')).toHaveClass('sr-only');
    });
  });

  describe('Interactions', () => {
    test('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(<Button onClick={handleClick} disabled>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should not trigger click when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(<Button onClick={handleClick} loading>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should handle keyboard events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should handle space key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      renderWithTheme(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    test('should support custom ARIA labels', () => {
      renderWithTheme(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    test('should indicate loading state to screen readers', () => {
      renderWithTheme(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('should be focusable by default', () => {
      renderWithTheme(<Button>Focusable</Button>);
      
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });

    test('should not be focusable when disabled', () => {
      renderWithTheme(<Button disabled>Not Focusable</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Styling', () => {
    test('should apply custom className', () => {
      renderWithTheme(<Button className="custom-class">Custom</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('should merge default classes with custom classes', () => {
      renderWithTheme(<Button className="custom-class">Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'custom-class');
    });

    test('should apply glow effect when specified', () => {
      renderWithTheme(<Button glow>Glowing Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-glow');
    });

    test('should apply full width styling', () => {
      renderWithTheme(<Button fullWidth>Full Width</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Button Types', () => {
    test('should render as submit button', () => {
      renderWithTheme(<Button type="submit">Submit</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('should render as reset button', () => {
      renderWithTheme(<Button type="reset">Reset</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    test('should render as link when href provided', () => {
      renderWithTheme(<Button href="/link">Link Button</Button>);
      
      const link = screen.getByRole('button');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/link');
    });
  });

  describe('Animation & Effects', () => {
    test('should have hover animations', () => {
      renderWithTheme(<Button>Animated</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transform', 'hover:-translate-y-0.5');
    });

    test('should respect reduced motion preferences', () => {
      // Mock matchMedia pour prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      renderWithTheme(<Button>No Animation</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('animate-safe');
    });

    test('should show loading spinner with proper animation', () => {
      renderWithTheme(<Button loading>Loading</Button>);
      
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn();
      
      const TestButton = React.memo(({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
        renderSpy();
        return <Button {...props}>{children}</Button>;
      });

      const { rerender } = renderWithTheme(<TestButton>Test</TestButton>);
      
      // Re-render with same props inside the same ThemeProvider context
      rerender(<TestButton>Test</TestButton>);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('should handle rapid clicks gracefully', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(<Button onClick={handleClick}>Rapid Click</Button>);
      
      const button = screen.getByRole('button');
      
      // Simulate rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
// Configuration des thèmes pour l'application
export const themes = {
  light: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8'
    },
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b'
    },
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
};

// Utilitaires pour les thèmes
export const themeUtils = {
  // Applique un thème à l'élément root
  applyTheme: (themeName) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  },

  // Obtient la valeur d'une couleur du thème
  getThemeColor: (themeName, colorPath) => {
    const theme = themes[themeName];
    if (!theme) return null;

    const keys = colorPath.split('.');
    let value = theme;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return null;
    }
    return value;
  },

  // Crée une variante d'une couleur
  createColorVariant: (color, opacity = 1) => {
    if (opacity === 1) return color;
    
    // Si c'est un hex, convertir en rgba
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Si c'est déjà rgba, modifier l'opacité
    if (color.startsWith('rgba')) {
      return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
    }
    
    return color;
  },

  // Détermine si une couleur est claire ou sombre
  isLightColor: (color) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    }
    return true; // Par défaut
  },

  // Obtient le thème approprié basé sur les préférences système
  getPreferredTheme: () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
};

// Thème par défaut
export const defaultTheme = 'light';

// Export par défaut
export default {
  themes,
  themeUtils,
  defaultTheme
};
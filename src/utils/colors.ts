// Color system for consistent theming across the app
export const colors = {
  // Primary brand colors
  primary: {
    light: '#E8F5E9',
    main: '#4CAF50',
    dark: '#2E7D32',
  },
  
  // Secondary/Accent colors
  accent: {
    light: '#FFF3E0',
    main: '#FF9800',
    dark: '#E65100',
  },
  
  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    light: '#F5F5F5',
    lighter: '#FAFAFA',
    gray: '#9E9E9E',
    darkGray: '#424242',
    dark: '#212121',
    black: '#000000',
  },
  
  // Semantic colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
  },
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export type ColorKey = keyof typeof colors;
export type ColorValue = typeof colors[ColorKey];

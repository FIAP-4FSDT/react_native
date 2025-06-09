import {MD3LightTheme, configureFonts} from 'react-native-paper';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  android: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({config: fontConfig}),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8c7a63',
    primaryContainer: '#f8f6f4',
    secondary: '#726452',
    secondaryContainer: '#f0ede8',
    tertiary: '#5f5446',
    surface: '#ffffff',
    surfaceVariant: '#f8f6f4',
    background: '#fefefe',
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#4f473c',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#4f473c',
    onTertiary: '#ffffff',
    onSurface: '#1c1b1f',
    onSurfaceVariant: '#726452',
    onBackground: '#1c1b1f',
    onError: '#ffffff',
    onErrorContainer: '#410002',
    outline: '#8c7a63',
    outlineVariant: '#e2dcd2',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#313033',
    inverseOnSurface: '#f4f0f7',
    inversePrimary: '#d0c5b5',
    elevation: {
      level0: 'transparent',
      level1: '#f8f6f4',
      level2: '#f0ede8',
      level3: '#e2dcd2',
      level4: '#d0c5b5',
      level5: '#b8a992',
    },
  },
};

export const colors = {
  primary: '#8c7a63',
  secondary: '#726452',
  tertiary: '#5f5446',
  background: '#fefefe',
  surface: '#ffffff',
  error: '#ba1a1a',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  text: {
    primary: '#1c1b1f',
    secondary: '#726452',
    disabled: '#a69276',
  },
  border: '#e2dcd2',
  divider: '#f0ede8',
};
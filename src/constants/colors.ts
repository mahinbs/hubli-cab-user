import { StyleSheet } from 'react-native';

export const COLORS = {
  // Base
  background: '#FAFAFA', // Off-white/Light Gray
  surface: '#FFFFFF', // Pure white for cards/sheets
  surfaceLight: '#F3F4F6', // Light gray surface for inputs

  // Accents (Yellow Theme)
  primary: '#FACC15', // yellow-400
  primaryDark: '#EAB308', // yellow-500
  secondary: '#EAB308', // yellow-500 (using as secondary too)

  // Text
  text: '#1F2937', // Dark gray for better readability on light bg
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Functional
  success: '#16A34A', // green-600
  error: '#DC2626', // red-600
  warning: '#F97316', // orange-500

  // Gradients (Represented as array of colors for LinearGradient)
  backgroundGradient: ['#FAFAFA', '#F3F4F6'] as const,
  buttonGradient: ['#FACC15', '#EAB308'] as const,
};

export const SIZES = {
  padding: 24,
  radius: 12,
  h1: 28,
  h2: 24,
  h3: 20,
  body: 16,
  caption: 14,
};

export const GLOBAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

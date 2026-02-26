import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Custom theme preset based on Aura with your color scheme
export const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}', // #8b5cf6
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{violet.500}',
          inverseColor: '#ffffff',
          hoverColor: '{violet.600}',
          activeColor: '{violet.700}'
        },
        highlight: {
          background: '{violet.950}',
          focusBackground: '{violet.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      dark: {
        primary: {
          color: '{violet.400}',
          inverseColor: '{violet.950}',
          hoverColor: '{violet.300}',
          activeColor: '{violet.200}'
        },
        highlight: {
          background: 'rgba(139, 92, 246, .16)',
          focusBackground: 'rgba(139, 92, 246, .24)',
          color: 'rgba(139, 92, 246, .87)',
          focusColor: 'rgba(139, 92, 246, .87)'
        },
        surface: {
          0: '#ffffff',
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
          950: '#ffffff'
        }
      }
    }
  }
});

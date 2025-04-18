import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { PersonalizationProvider } from '../context/PersonalizationContext';
import ThemeManager from '../components/ThemeManager';
import AccessibilityProvider from '../components/AccessibilityProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PersonalizationProvider>
        <AccessibilityProvider>
          <ThemeManager>
            <Component {...pageProps} />
          </ThemeManager>
        </AccessibilityProvider>
      </PersonalizationProvider>
    </AuthProvider>
  );
}

export default MyApp;
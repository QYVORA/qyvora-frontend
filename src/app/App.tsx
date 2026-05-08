import { BrowserRouter as Router } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppRouter } from './router';
import ScrollToTop from '../shared/components/ScrollToTop';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import AdaptiveMode from '../shared/components/AdaptiveMode';

export default function App() {
  return (
    <ErrorBoundary scope="App">
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AdaptiveMode />
          <ScrollToTop />
          <AppRouter />
        </Router>
      </MotionConfig>
    </ErrorBoundary>
  );
}

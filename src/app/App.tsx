import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router';
import ScrollToTop from '../shared/components/ScrollToTop';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import AdaptiveMode from '../shared/components/AdaptiveMode';

export default function App() {
  return (
    <ErrorBoundary scope="App">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AdaptiveMode />
        <ScrollToTop />
        <AppRouter />
      </Router>
    </ErrorBoundary>
  );
}

import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router';
import ScrollToTop from '../shared/components/ScrollToTop';
import ErrorBoundary from '../shared/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary scope="App">
      <Router>
        <ScrollToTop />
        <AppRouter />
      </Router>
    </ErrorBoundary>
  );
}

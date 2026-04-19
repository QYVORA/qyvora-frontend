import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './router';
import ScrollToTop from '../shared/components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRouter />
    </Router>
  );
}

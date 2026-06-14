import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage = () => (
  <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-4">
    <SEO 
      title="404 - Node Not Found"
      description="The requested page could not be located on the QYVORA network."
    />
    <Terminal className="w-12 h-12 text-accent mb-6 opacity-60" />
    <div className="text-accent font-mono text-sm mb-2 uppercase tracking-widest">// 404 — NODE NOT FOUND</div>
    <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-4">Lost in the Network ?</h1>
    <p className="text-text-muted text-sm mb-8 max-w-sm">
      How did you End Up here ?  I am suspecting you ! ^_^
    </p>
    <Link to="/" className="btn-primary">Return to Base</Link>
  </div>
);

export default NotFoundPage;

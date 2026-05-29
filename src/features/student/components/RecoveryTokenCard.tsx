import React, { useState } from 'react';
import { Shield, Copy, Download, Check, Eye, EyeOff } from 'lucide-react';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';

const RecoveryTokenCard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profile/recovery-token');
      setToken(res.data.token);
      setShowToken(true);
    } catch (err) {
      console.error('Failed to fetch recovery token:', err);
      addToast('Failed to fetch token.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    addToast('Token copied to clipboard.', 'success');
  };

  const handleDownload = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/profile/recovery-token/download`, '_blank');
  };

  if (user?.role === 'admin') return null;

  return (
    <div className="card-hsociety p-6 relative overflow-hidden h-full flex flex-col group">
      <Shield className="pointer-events-none absolute -right-6 -top-6 h-28 w-auto text-accent/5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
      
      <div className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-accent relative z-10">
        Account Security
      </div>
      <h3 className="mb-3 text-lg font-black text-text-primary relative z-10">Recovery Token</h3>
      
      <p className="mb-5 text-xs text-text-muted leading-relaxed relative z-10">
        Required to reset your password if you lose access to your account. 
        Keep this token safe and private.
      </p>
      
      {showToken ? (
        <div className="relative mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="absolute -inset-1 bg-accent/20 blur rounded-lg opacity-25"></div>
          <div className="relative bg-bg border border-accent/30 rounded-lg p-3 font-mono text-[10px] break-all text-accent pr-10">
            {token || 'INITIALISING...'}
            <div className="absolute right-1 top-1 flex flex-col gap-1">
              <button 
                onClick={handleCopy}
                title="Copy Token"
                className="p-1.5 rounded-md hover:bg-accent/10 text-text-muted hover:text-accent transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setShowToken(false)}
                title="Hide Token"
                className="p-1.5 rounded-md hover:bg-accent/10 text-text-muted hover:text-accent transition-colors"
              >
                <EyeOff className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={fetchToken}
          disabled={loading}
          className="
            group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden
            rounded-xl border border-border bg-bg-card/50 py-3 
            text-[10px] font-black uppercase tracking-[0.2em]
            text-text-muted transition-all hover:border-accent/50 hover:text-accent
            mb-4 z-10
          "
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              Fetching...
            </span>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" /> 
              View Recovery Token
            </>
          )}
        </button>
      )}
      
      <button 
        onClick={handleDownload}
        className="
          flex items-center justify-center gap-2 text-[10px] 
          font-black uppercase tracking-[0.2em] text-text-muted/60 
          hover:text-accent transition-colors mt-auto py-2
          relative z-10
        "
      >
        <Download className="h-3.5 w-3.5" /> Download Backup PDF
      </button>
    </div>
  );
};

export default RecoveryTokenCard;

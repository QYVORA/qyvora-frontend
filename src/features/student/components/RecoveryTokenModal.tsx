import React, { useState, useEffect } from 'react';
import { Shield, Copy, Download, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';

interface RecoveryTokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecoveryTokenModal: React.FC<RecoveryTokenModalProps> = ({ open, onOpenChange }) => {
  const { refreshMe } = useAuth();
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && !token) {
      fetchToken();
    }
  }, [open, token]);

  const fetchToken = async () => {
    try {
      const res = await api.get('/profile/recovery-token');
      setToken(res.data.token);
    } catch (err) {
      console.error('Failed to fetch recovery token:', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/profile/recovery-token/download`, '_blank');
  };

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      await api.post('/profile/recovery-token/ack');
      await refreshMe();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to acknowledge token:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        title="[ SECURITY PROTOCOL: RECOVERY ]" 
        maxWidth="max-w-2xl"
        hideClose
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="border-accent/30 shadow-[0_0_50px_rgba(var(--color-accent-rgb),0.15)]"
      >
        <div className="flex flex-col items-center -mt-2">
          
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8 mt-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`h-1.5 w-12 lg:w-16 rounded-full transition-all duration-500 ${
                  s <= step ? 'bg-accent shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)]' : 'bg-border'
                }`}
              />
            ))}
          </div>

          <div className="w-full">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 py-4">
                <div className="flex-none pt-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative flex h-24 w-24 lg:h-32 lg:w-32 items-center justify-center rounded-2xl border-2 border-yellow-500/40 bg-bg-card/80 backdrop-blur-xl text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                      <AlertTriangle className="h-12 w-12 lg:h-16 lg:w-16" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">
                      Critical Security Step
                    </h2>
                    <div className="h-1 w-20 bg-yellow-500/40 rounded-full lg:mx-0 mx-auto" />
                  </div>
                  
                  <p className="text-sm font-mono text-text-muted leading-relaxed mb-8 max-w-md">
                    We do not have a centralized password reset system. 
                    <span className="text-text-primary block mt-2 font-bold">Your recovery token is the ONLY way to regain access if you lose your password.</span>
                  </p>

                  <button
                    onClick={nextStep}
                    className="
                      flex w-full lg:max-w-xs items-center justify-center gap-2 rounded-2xl
                      bg-accent py-4 text-xs font-black uppercase tracking-[0.3em]
                      text-bg transition-all hover:scale-[1.02] active:scale-[0.98]
                    "
                  >
                    Understood <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 py-4">
                <div className="flex-none pt-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    <div className="relative flex h-24 w-24 lg:h-32 lg:w-32 items-center justify-center rounded-2xl border-2 border-accent/40 bg-bg-card/80 backdrop-blur-xl text-accent">
                      <Shield className="h-12 w-12 lg:h-16 lg:w-16" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">
                      Your Recovery Token
                    </h2>
                    <div className="h-1 w-20 bg-accent/40 rounded-full lg:mx-0 mx-auto" />
                  </div>
                  
                  <div className="relative mb-8 group w-full max-w-md">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent/5 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-bg border border-border rounded-xl p-5 font-mono text-sm break-all text-accent select-all">
                      {token || 'INITIALISING...'}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-bg-card border border-border text-text-muted hover:text-accent transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={!token}
                    className="
                      flex w-full lg:max-w-xs items-center justify-center gap-2 rounded-2xl
                      bg-accent py-4 text-xs font-black uppercase tracking-[0.3em]
                      text-bg transition-all hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50
                    "
                  >
                    Token Saved <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 py-4">
                <div className="flex-none pt-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                    <div className="relative flex h-24 w-24 lg:h-32 lg:w-32 items-center justify-center rounded-2xl border-2 border-green-500/40 bg-bg-card/80 backdrop-blur-xl text-green-500">
                      <Download className="h-12 w-12 lg:h-16 lg:w-16" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">
                      Download Backup
                    </h2>
                    <div className="h-1 w-20 bg-green-500/40 rounded-full lg:mx-0 mx-auto" />
                  </div>
                  
                  <p className="text-sm font-mono text-text-muted leading-relaxed mb-8 max-w-md">
                    Download your recovery token as a PDF for offline storage. 
                    Keep it where only you can find it.
                  </p>

                  <div className="w-full max-w-md space-y-4">
                    <button
                      onClick={handleDownload}
                      className="
                        flex w-full items-center justify-center gap-3 rounded-2xl
                        border-2 border-green-500/50 bg-green-500/10 py-5
                        text-[10px] font-black uppercase tracking-[0.3em]
                        text-green-500 transition-all hover:bg-green-500/20
                      "
                    >
                      <Download className="h-5 w-5" /> Download Recovery PDF
                    </button>

                    <button
                      onClick={handleAcknowledge}
                      disabled={loading}
                      className="
                        flex w-full items-center justify-center gap-2 rounded-2xl
                        bg-accent py-4 text-xs font-black uppercase tracking-[0.3em]
                        text-bg transition-all hover:scale-[1.02] active:scale-[0.98]
                        disabled:opacity-50
                      "
                    >
                      {loading ? 'INITIALISING...' : 'Finalise Setup'} <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center lg:justify-start w-full gap-4 text-[9px] font-mono text-text-muted/40 uppercase tracking-[0.25em]">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-accent animate-ping" />
              Secure Protocol
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Encrypted at Rest</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecoveryTokenModal;

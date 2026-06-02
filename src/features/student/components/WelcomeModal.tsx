import React from 'react';
import { Shield, ArrowRight, Zap } from 'lucide-react';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import BrandWhatsAppIcon from '../../../shared/components/icons/BrandWhatsAppIcon';
import api from '../../../core/services/api';
import { useAuth } from '../../../core/contexts/AuthContext';
import { SITE_CONFIG } from '../../marketing/content/siteConfig';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onOpenChange }) => {
  const { refreshMe } = useAuth();
  
  const handleClose = async () => {
    try {
      await api.post('/profile/onboarding/complete');
      await refreshMe();
      onOpenChange(false);
    } catch {
      // If the API fails, we don't close it to avoid the "reappearing" bug
      // But we can add a toast or alert here if needed. 
      // For now, keeping it open is the safer bet for state consistency.
    }
  };

  const whatsappUrl = SITE_CONFIG.social.find((s) => s.key === 'whatsapp')?.href || 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5';

  const handleJoinCommunity = () => {
    localStorage.setItem('hsociety_community_joined', '1');
    window.open(whatsappUrl, '_blank', 'noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        title="[ SYSTEM ACCESS GRANTED ]" 
        maxWidth="max-w-3xl"
        hideClose
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="border-accent/30 shadow-[0_0_50px_rgba(var(--color-accent-rgb),0.15)]"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 py-4">
          {/* Left Column: Visual (1/3 width on desktop) */}
          <div className="flex-none pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative flex h-28 w-28 lg:h-36 lg:w-36 items-center justify-center rounded-3xl border-2 border-accent/40 bg-bg-card/80 backdrop-blur-xl text-accent shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.2)]">
                <Shield className="h-14 w-14 lg:h-20 lg:w-20" />
                <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-bg border border-accent/40 text-accent">
                  <Zap className="h-5 w-5 fill-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content (2/3 width on desktop) */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-3 mb-6">
              <h2 className="text-2xl lg:text-3xl font-black text-text-primary uppercase tracking-tighter leading-tight">
                Welcome to the <span className="text-accent">Community of Hackers</span>
              </h2>
              <div className="h-1 w-20 bg-accent/40 rounded-full lg:mx-0 mx-auto" />
            </div>
            
            <p className="text-sm lg:text-base text-text-muted leading-relaxed mb-8 max-w-md font-mono">
              Your operator profile is now live. You've joined Africa's elite offensive security network. 
              Connect with fellow operators and start your journey.
            </p>

            <div className="w-full space-y-4 max-w-sm lg:max-w-none">
              <button
                onClick={handleJoinCommunity}
                className="
                  group relative flex w-full items-center justify-center gap-3 overflow-hidden
                  rounded-2xl bg-[#25D366] py-5 text-sm font-black uppercase tracking-[0.15em]
                  text-white shadow-xl shadow-[#25D366]/20 transition-all
                  hover:scale-[1.02] hover:shadow-[#25D366]/40 active:scale-[0.98]
                "
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                
                <BrandWhatsAppIcon className="h-6 w-6" />
                <span>Join the community to learn more</span>
              </button>
              
              <button
                onClick={handleClose}
                className="
                  flex w-full items-center justify-center gap-2 rounded-2xl
                  border border-border bg-bg-card/50 py-4
                  text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]
                  text-text-muted transition-all duration-300
                  hover:border-accent/50 hover:text-accent hover:bg-accent-dim/10
                "
              >
                Initialise Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[9px] font-mono text-text-muted/40 uppercase tracking-[0.25em]">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-accent animate-ping" />
                Node Active
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Auth Level: Student</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Ver: 2.0.26</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;


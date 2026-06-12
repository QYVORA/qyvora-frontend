import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import SimpleHeading from '../../../../shared/components/ui/SimpleHeading';

interface FinalCtaSectionProps {
  user: { isAdmin?: boolean } | null;
}

const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ user }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center py-20 sm:py-24 lg:py-20">
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ 
          background: 'radial-gradient(circle at 30% 50%, var(--color-accent-glow) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-3 sm:px-8 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center min-h-[calc(100vh-0px)]">

        {/* Mobile layout: stacked — logo on top, content below */}
        <div className="flex flex-col lg:hidden w-full gap-12">

          {/* Mobile logo — prominent, centered, LARGER based on visible logo geometry */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center w-full px-4"
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[540px] overflow-hidden">
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50 blur-3xl"
                style={{ background: 'radial-gradient(circle at center, var(--color-accent-glow) 0%, transparent 70%)' }}
              />
              <img
                src="/qyvora-cta-logo.png"
                alt="QYVORA"
                className="relative z-10 w-full h-auto block"
                style={{
                  /* Scale adjusted to be safer, combined with parent overflow-hidden */
                  transform: 'scale(1.1)',
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </motion.div>

          {/* Mobile text content */}
          <div className="flex flex-col items-start w-full gap-7">
            <SimpleHeading 
              text={user ? "Continue Training" : "Start Your Journey"} 
              align="left" 
              className="mb-0" 
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-lg text-text-secondary leading-relaxed max-w-xl"
            >
              {user
                ? 'Your training environment is active. Head to your dashboard to continue where you left off and advance through the bootcamp phases.'
                : 'Join operators training in offensive security across Africa. Start with foundational modules, progress through bootcamp phases, and earn cyber points. No experience required — just commitment.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="btn-primary min-h-[58px] !px-10 !py-4 text-base inline-flex items-center justify-center gap-2.5"
                >
                  <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="btn-primary min-h-[58px] !px-10 !py-4 text-base inline-flex items-center justify-center gap-2.5"
                  >
                    Start Free Training <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn-secondary min-h-[58px] !px-10 !py-4 text-base inline-flex items-center justify-center"
                  >
                    Log In
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Desktop layout: side-by-side grid — unchanged */}
        <div className="hidden lg:grid grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Section - Content */}
          <div className="max-w-2xl">
            <SimpleHeading 
              text={user ? "Continue Training" : "Start Your Journey"} 
              align="left" 
              className="mb-6" 
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-text-secondary leading-relaxed mb-10 max-w-xl"
            >
              {user
                ? 'Your training environment is active. Head to your dashboard to continue where you left off and advance through the bootcamp phases.'
                : 'Join operators training in offensive security across Africa. Start with foundational modules, progress through bootcamp phases, and earn cyber points. No experience required — just commitment.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="btn-primary min-h-[56px] !px-8 !py-4 text-sm inline-flex items-center justify-center gap-2.5"
                >
                  <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="btn-primary min-h-[56px] !px-8 !py-4 text-sm inline-flex items-center justify-center gap-2.5"
                  >
                    Start Free Training <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn-secondary min-h-[56px] !px-8 !py-4 text-sm inline-flex items-center justify-center"
                  >
                    Log In
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Right Section - Large Logo Mark */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-end lg:-translate-x-4 xl:-translate-x-8"
          >
            <div className="relative w-full max-w-4xl xl:max-w-5xl flex items-center justify-end">
              <img
                src="/qyvora-cta-logo.png"
                alt="QYVORA"
                className="relative z-10 w-full max-w-[850px] xl:max-w-[1100px] h-auto block"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default FinalCtaSection;
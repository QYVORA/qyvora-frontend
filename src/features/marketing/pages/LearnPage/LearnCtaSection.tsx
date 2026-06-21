import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';

const LearnCtaSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-20 md:pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center w-full">
        <div className="max-w-2xl space-y-8">
          <SimpleHeading text="Establish Your Profile" align="left" className="mb-0" />
          <p className="text-base md:text-lg text-text-secondary font-mono leading-relaxed">
            Gain immediate access to our custom learning labs, sandbox terminal server connections,
            and live operations training rooms.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-4 text-accent font-black uppercase tracking-[0.4em] text-sm hover:gap-6 transition-all"
          >
            Create Trainee Operator Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-4xl flex items-center justify-center lg:justify-end">
            <img
              src="/qyvora-single-logo.png"
              alt="QYVORA"
              className="relative z-10 w-full max-w-[400px] lg:max-w-[500px] h-auto block opacity-60"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearnCtaSection;
export { LearnCtaSection };

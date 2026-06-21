import React from 'react';
import { motion } from 'motion/react';
import { INSTALL_COMMANDS } from './anansiData';

const AnansiInstallSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
      >
        <div className="bg-[#121212] border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase font-bold">
            operator@qyvora:~
          </div>
          <div className="w-10 hidden sm:block" />
        </div>
        <div className="p-6 sm:p-8 md:p-12 font-mono text-xs sm:text-sm md:text-lg space-y-10 overflow-x-hidden overflow-y-auto custom-scrollbar">
          {INSTALL_COMMANDS.map((item, i) => (
            <div key={i} className={`space-y-4 ${i === INSTALL_COMMANDS.length - 1 ? 'pt-8 border-t border-white/5' : ''}`}>
              <div className="text-accent/40 font-bold uppercase tracking-[0.2em] text-[10px]">{item.step}</div>
              <div className="flex gap-4 items-start group">
                <span className="text-accent font-bold mt-1 shrink-0">$</span>
                <code className="text-white bg-white/5 p-2 rounded-lg group-hover:text-accent transition-colors break-all">
                  {item.cmd}
                </code>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnansiInstallSection;
export { AnansiInstallSection };

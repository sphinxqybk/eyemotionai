import React from 'react';
import { motion } from 'motion/react';
import { Play, Film, ArrowRight } from 'lucide-react';

interface EcosystemButtonsProps {
  language: 'th' | 'en';
  onEnterEcosystem?: () => void;
  onEcosystemDemo?: () => void;
}

export function EcosystemButtons({ language, onEnterEcosystem, onEcosystemDemo }: EcosystemButtonsProps) {
  const content = {
    th: {
      enter: 'เข้าสู่ระบบนิเวศ',
      demo: 'ทดลองใช้ระบบ'
    },
    en: {
      enter: 'ENTER ECOSYSTEM',
      demo: 'ECOSYSTEM DEMO'
    }
  };

  const t = content[language];

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center min-h-[120px]">
      {/* ENTER ECOSYSTEM Button */}
      <motion.button
        className="group relative overflow-hidden px-8 py-4 rounded-xl min-w-[240px] flex items-center justify-center gap-3 bg-gradient-to-r from-intent to-experience border-0"
        onClick={onEnterEcosystem}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <Play className="w-5 h-5 text-white" />
          <span className="font-display font-bold text-white tracking-wide">
            {t.enter}
          </span>
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.button>

      {/* ECOSYSTEM DEMO Button */}
      <motion.button
        className="group relative overflow-hidden px-8 py-4 rounded-xl min-w-[240px] flex items-center justify-center gap-3 bg-cinema-deep border-2 border-cinema-tertiary hover:border-experience transition-colors duration-300"
        onClick={onEcosystemDemo}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-radial from-experience/30 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <Film className="w-5 h-5 text-white" />
          <span className="font-display font-bold text-white tracking-wide">
            {t.demo}
          </span>
          <ArrowRight className="w-4 h-4 text-white group-hover:text-experience group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </motion.button>
    </div>
  );
}
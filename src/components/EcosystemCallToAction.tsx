import React from 'react';
import { motion } from 'motion/react';
import { EcosystemButtons } from './EcosystemButtons';
import { Sparkles } from 'lucide-react';

interface EcosystemCallToActionProps {
  language: 'th' | 'en';
  onEnterEcosystem?: () => void;
  onEcosystemDemo?: () => void;
}

export function EcosystemCallToAction({ 
  language, 
  onEnterEcosystem, 
  onEcosystemDemo 
}: EcosystemCallToActionProps) {
  const content = {
    th: {
      badge: 'พร้อมแล้ว',
      title: 'เข้าสู่ระบบนิเวศ EyeMotion',
      subtitle: 'เริ่มต้นการเดินทางสู่อนาคตของการเล่าเรื่องด้วยภาพ',
      description: 'สัมผัสประสบการณ์การสร้างภาพยนตร์ระดับมืออาชีพด้วยเทคโนโลยี Intent-Aware AI ที่เข้าใจและขยายขีดความสามารถในการสร้างสรรค์ของคุณ'
    },
    en: {
      badge: 'Ready to Start',
      title: 'Enter the EyeMotion Ecosystem',
      subtitle: 'Begin your journey into the future of visual storytelling',
      description: 'Experience professional filmmaking with Intent-Aware AI technology that understands and amplifies your creative capabilities'
    }
  };

  const t = content[language];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Beautiful Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-intent/10 via-transparent to-experience/10" />
        
        {/* Electric Cyan Accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-experience/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-verification/15 rounded-full blur-3xl opacity-15" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(191, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(191, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Professional Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full bg-cinema-secondary border border-experience/30 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-experience" />
          <span className="font-display font-semibold text-sm tracking-wide text-experience">
            {t.badge}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="homepage-display text-gradient-ecosystem mb-6"
        >
          {t.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="homepage-body text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          {t.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="professional-body text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {t.description}
        </motion.p>

        {/* Ecosystem Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <EcosystemButtons 
            language={language}
            onEnterEcosystem={onEnterEcosystem}
            onEcosystemDemo={onEcosystemDemo}
          />
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-experience rounded-full" />
            <span className="font-primary">
              {language === 'th' ? 'ระดับมืออาชีพ' : 'Professional Grade'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-verification rounded-full" />
            <span className="font-primary">
              {language === 'th' ? 'ยืนยันความถูกต้อง' : 'Verified Authentic'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-intent rounded-full" />
            <span className="font-primary">
              {language === 'th' ? 'AI ที่เข้าใจเจตนา' : 'Intent-Aware AI'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-60 ${
              i % 2 === 0 ? 'bg-experience' : 'bg-verification'
            }`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + i * 12}%`
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.6, 0.2, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8
            }}
          />
        ))}
      </div>
    </section>
  );
}
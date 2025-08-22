import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  BrainCircuit, Scissors, Palette, Target, Network,
  Zap, Eye, Cpu, Layers, Gauge, Film, Camera, 
  Settings, GitBranch, Sparkles, Activity,
  Hexagon, Triangle, Square, Circle, Diamond,
  ChevronRight, Power, Signal, Wifi, Database,
  MonitorSpeaker, Waveform, Binary, Shield
} from 'lucide-react';

interface Language {
  language: 'th' | 'en';
}

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  category: string;
  title: {
    th: string;
    en: string;
  };
  description: {
    th: string;
    en: string;
  };
  techSpecs: {
    th: string[];
    en: string[];
  };
  status: {
    th: string;
    en: string;
  };
  power: number; // 0-100
  color: string;
  pattern: 'neural' | 'mechanical' | 'optical' | 'network' | 'quantum';
}

const features: Feature[] = [
  {
    id: 'intent-ai',
    icon: BrainCircuit,
    category: 'NEURAL',
    title: {
      th: 'Intent-Aware AI',
      en: 'Intent-Aware AI'
    },
    description: {
      th: 'AI ที่เข้าใจเจตนาและสร้างผลงานตามวิสัยทัศน์ของคุณ',
      en: 'AI that understands your creative intent and materializes your vision'
    },
    techSpecs: {
      th: ['Neural Processing: 2.4 TOPS', 'Intent Recognition: 97.3%', 'Creative Adaptation: Real-time'],
      en: ['Neural Processing: 2.4 TOPS', 'Intent Recognition: 97.3%', 'Creative Adaptation: Real-time']
    },
    status: {
      th: 'ONLINE',
      en: 'ONLINE'
    },
    power: 95,
    color: 'oklch(0.488 0.243 264.376)',
    pattern: 'neural'
  },
  {
    id: 'cineflow-engine',
    icon: Scissors,
    category: 'MECHANICAL',
    title: {
      th: 'CineFlow Engine',
      en: 'CineFlow Engine'
    },
    description: {
      th: 'เครื่องมือตัดต่ออัตโนมัติที่แม่นยำระดับ frame-perfect',
      en: 'Intelligent auto-cut system with frame-perfect precision'
    },
    techSpecs: {
      th: ['Cut Precision: 0.001s', 'Scene Analysis: 120 FPS', 'Flow Sync: 99.8%'],
      en: ['Cut Precision: 0.001s', 'Scene Analysis: 120 FPS', 'Flow Sync: 99.8%']
    },
    status: {
      th: 'ACTIVE',
      en: 'ACTIVE'
    },
    power: 88,
    color: 'oklch(0.696 0.17 162.48)',
    pattern: 'mechanical'
  },
  {
    id: 'cinetone-ai',
    icon: Palette,
    category: 'OPTICAL',
    title: {
      th: 'CineTone AI',
      en: 'CineTone AI'
    },
    description: {
      th: 'ระบบปรับสีแบบ cinema-grade ด้วย AI ความแม่นยำสูง',
      en: 'Cinema-grade color grading with AI precision and artistry'
    },
    techSpecs: {
      th: ['Color Accuracy: 99.97%', 'LUT Generation: Instant', 'Gamut Coverage: Rec.2020'],
      en: ['Color Accuracy: 99.97%', 'LUT Generation: Instant', 'Gamut Coverage: Rec.2020']
    },
    status: {
      th: 'CALIBRATED',
      en: 'CALIBRATED'
    },
    power: 92,
    color: 'oklch(0.769 0.188 70.08)',
    pattern: 'optical'
  },
  {
    id: 'cinehub-ecosystem',
    icon: Network,
    category: 'NETWORK',
    title: {
      th: 'CineHub Ecosystem',
      en: 'CineHub Ecosystem'
    },
    description: {
      th: 'ระบบเชื่อมต่อครบวงจรสำหรับ workflow การสร้างภาพยนตร์',
      en: 'Integrated ecosystem for seamless film production workflow'
    },
    techSpecs: {
      th: ['Cloud Sync: 10 Gbps', 'Collaboration: Real-time', 'Storage: Unlimited'],
      en: ['Cloud Sync: 10 Gbps', 'Collaboration: Real-time', 'Storage: Unlimited']
    },
    status: {
      th: 'CONNECTED',
      en: 'CONNECTED'
    },
    power: 85,
    color: 'oklch(0.627 0.265 303.9)',
    pattern: 'network'
  },
  {
    id: 'cinestory-studio',
    icon: Film,
    category: 'PREVIEW',
    title: {
      th: 'CineStory Studio™',
      en: 'CineStory Studio™'  
    },
    description: {
      th: 'ระบบ preview และ narrative ขั้นสูงสำหรับการตรวจสอบผลงาน',
      en: 'Advanced preview and narrative system for comprehensive content review'
    },
    techSpecs: {
      th: ['Preview Quality: 8K HDR', 'Story Analysis: AI-powered', 'Real-time Feedback: Instant'],
      en: ['Preview Quality: 8K HDR', 'Story Analysis: AI-powered', 'Real-time Feedback: Instant']
    },
    status: {
      th: 'READY',
      en: 'READY'
    },
    power: 90,
    color: 'oklch(0.645 0.246 16.439)',
    pattern: 'optical'
  }
];

const cinemaEasing = [0.25, 0.46, 0.45, 0.94] as const;

const PatternOverlay = ({ pattern, color, isActive }: { pattern: string; color: string; isActive: boolean }) => {
  const patterns = {
    neural: (
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
        <defs>
          <pattern id="neural" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill={color} fillOpacity="0.1" />
            <circle cx="10" cy="10" r="1" fill={color} fillOpacity="0.15" />
            <circle cx="30" cy="30" r="1" fill={color} fillOpacity="0.15" />
            <line x1="20" y1="20" x2="10" y2="10" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
            <line x1="20" y1="20" x2="30" y2="30" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#neural)" />
      </svg>
    ),
    mechanical: (
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
        <defs>
          <pattern id="mechanical" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.1" />
            <rect x="5" y="5" width="10" height="10" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mechanical)" />
      </svg>
    ),
    optical: (
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="optical">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#optical)" />
        <circle cx="100" cy="100" r="60" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.1" />
        <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.15" />
      </svg>
    ),
    network: (
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
        <defs>
          <pattern id="network" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <polygon points="25,5 45,20 45,35 25,50 5,35 5,20" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.1" />
            <circle cx="25" cy="25" r="3" fill={color} fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network)" />
      </svg>
    ),
    quantum: (
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 200 200">
        <defs>
          <pattern id="quantum" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="15" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.1" />
            <circle cx="30" cy="30" r="8" fill={color} fillOpacity="0.05" />
            <path d="M15,30 Q30,15 45,30 Q30,45 15,30" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#quantum)" />
      </svg>
    )
  };

  return (
    <motion.div
      className="absolute inset-0 opacity-0"
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: cinemaEasing }}
    >
      {patterns[pattern as keyof typeof patterns]}
    </motion.div>
  );
};

const PowerIndicator = ({ power, color, isActive }: { power: number; color: string; isActive: boolean }) => (
  <div className="absolute top-4 right-4 flex items-center gap-2">
    <motion.div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      animate={{
        scale: isActive ? [1, 1.2, 1] : 1,
        opacity: isActive ? [0.6, 1, 0.6] : 0.4
      }}
      transition={{
        duration: 1.5,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    />
    <div className="text-xs font-mono font-bold text-white opacity-80">
      {power}%
    </div>
  </div>
);

const TechSpecs = ({ specs, color }: { specs: string[]; color: string }) => (
  <motion.div
    className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col justify-center p-6"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3, ease: cinemaEasing }}
  >
    <div className="space-y-3">
      {specs.map((spec, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 text-sm font-mono"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1, ease: cinemaEasing }}
        >
          <div 
            className="w-1 h-4"
            style={{ backgroundColor: color }}
          />
          <span className="text-white">{spec}</span>
        </motion.div>
      ))}
    </div>
    
    <motion.div
      className="absolute bottom-4 right-4 flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Database className="w-4 h-4 text-white/60" />
      <Wifi className="w-4 h-4 text-white/60" />
      <Signal className="w-4 h-4" style={{ color }} />
    </motion.div>
  </motion.div>
);

const FeatureCard = ({ feature, language, index }: { feature: Feature; language: 'th' | 'en'; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const IconComponent = feature.icon;

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15, 
        ease: cinemaEasing 
      }}
      onHoverStart={() => !prefersReducedMotion && setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowSpecs(false);
      }}
      onClick={() => setShowSpecs(!showSpecs)}
      whileHover={{ scale: 1.02, z: 10 }}
      whileTap={{ scale: 0.98 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Main Card */}
      <motion.div
        className="relative h-80 rounded-xl border overflow-hidden backdrop-blur-sm"
        style={{
          backgroundColor: 'oklch(0.205 0 0 / 0.8)',
          borderColor: isHovered ? feature.color : 'oklch(0.269 0 0)'
        }}
        animate={{
          borderColor: isHovered ? feature.color : 'oklch(0.269 0 0)',
          boxShadow: isHovered 
            ? `0 20px 40px ${feature.color}20, 0 0 0 1px ${feature.color}40`  
            : '0 4px 20px oklch(0.145 0 0 / 0.5)'
        }}
        transition={{ duration: 0.4, ease: cinemaEasing }}
      >
        {/* Pattern Overlay */}
        <PatternOverlay 
          pattern={feature.pattern} 
          color={feature.color} 
          isActive={isHovered} 
        />

        {/* Power Indicator */}
        <PowerIndicator 
          power={feature.power} 
          color={feature.color} 
          isActive={isHovered} 
        />

        {/* Category Badge */}
        <motion.div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
          style={{
            backgroundColor: `${feature.color}20`,
            color: feature.color
          }}
          animate={{
            backgroundColor: isHovered ? `${feature.color}30` : `${feature.color}20`
          }}
        >
          {feature.category}
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-black/50 backdrop-blur-sm"
          animate={{
            scale: isHovered ? 1.05 : 1
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: feature.color }}
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-white">{feature.status[language]}</span>
        </motion.div>

        {/* Main Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
          {/* Icon */}
          <motion.div
            className="mb-6"
            animate={{
              rotateY: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ 
              duration: 0.8, 
              ease: cinemaEasing,
              rotateY: { duration: 1.2 }
            }}
          >
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
              style={{ 
                backgroundColor: `${feature.color}15`,
                border: `1px solid ${feature.color}30`
              }}
            >
              <IconComponent 
                className="w-8 h-8" 
                style={{ color: feature.color }} 
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3 
            className="text-xl font-bold text-white mb-3 tracking-tight"
            animate={{
              color: isHovered ? feature.color : 'white'
            }}
            transition={{ duration: 0.3 }}
          >
            {feature.title[language]}
          </motion.h3>

          {/* Description */}
          <motion.p 
            className="text-base font-medium leading-relaxed"
            style={{ color: 'oklch(0.708 0 0)' }}
            animate={{
              opacity: showSpecs ? 0 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            {feature.description[language]}
          </motion.p>

          {/* Hover Indicator */}
          <motion.div
            className="absolute bottom-6 flex items-center gap-2 text-sm font-medium"
            style={{ color: feature.color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span>{language === 'th' ? 'คลิกเพื่อดูรายละเอียด' : 'Click for specs'}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Tech Specs Overlay */}
        <AnimatePresence>
          {showSpecs && (
            <TechSpecs 
              specs={feature.techSpecs[language]} 
              color={feature.color} 
            />
          )}
        </AnimatePresence>

        {/* Transformer Lines */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Corner Lines */}
          {[
            { top: 0, left: 0, transform: 'rotate(0deg)' },
            { top: 0, right: 0, transform: 'rotate(90deg)' },
            { bottom: 0, right: 0, transform: 'rotate(180deg)' },
            { bottom: 0, left: 0, transform: 'rotate(270deg)' }
          ].map((corner, i) => (
            <motion.div
              key={`corner-${i}`}
              className="absolute w-6 h-6"
              style={{
                ...corner,
                border: `2px solid ${feature.color}`,
                borderRight: 'none',
                borderBottom: 'none'
              }}
              initial={{ scale: 0, rotate: i * 90 }}
              animate={{ scale: 1, rotate: i * 90 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          ))}
        </motion.div>

        {/* Energy Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent, ${feature.color}10, transparent)`
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? [0, 0.5, 0] : 0,
            scale: isHovered ? [0.8, 1.2, 0.8] : 0.8
          }}
          transition={{ 
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export function AnimatedFeatureCards({ language }: Language) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Auto-rotate features every 8 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'oklch(0.145 0 0)' }}>
        {/* Ambient lighting */}
        <div className="absolute inset-0">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="absolute w-96 h-96 rounded-full blur-3xl"
              style={{
                backgroundColor: `${feature.color}08`,
                top: `${20 + (index * 15)}%`,
                left: `${10 + (index * 20)}%`
              }}
              animate={{
                scale: currentFeature === index ? [1, 1.2, 1] : 1,
                opacity: currentFeature === index ? [0.3, 0.6, 0.3] : 0.2
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: cinemaEasing }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Power className="w-6 h-6 text-blue-400" />
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {language === 'th' ? 'ระบบ AI ขั้นสูง' : 'Advanced AI Systems'}
            </h2>
            <Power className="w-6 h-6 text-blue-400" />
          </motion.div>
          
          <motion.p 
            className="text-xl font-medium max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'oklch(0.708 0 0)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {language === 'th' 
              ? 'เทคโนโลยี AI ระดับโลกที่ออกแบบมาเพื่อผู้สร้างภาพยนตร์มืออาชีพ'
              : 'World-class AI technology engineered for professional filmmakers'
            }
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              language={language}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.button
            className="group inline-flex items-center gap-4 px-8 py-4 rounded-xl border text-lg font-bold tracking-wide backdrop-blur-sm transition-all duration-300"
            style={{
              backgroundColor: 'oklch(0.205 0 0 / 0.5)',
              borderColor: 'oklch(0.488 0.243 264.376)',
              color: 'oklch(0.488 0.243 264.376)'
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'oklch(0.488 0.243 264.376 / 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5" />
            <span>
              {language === 'th' ? 'เริ่มต้นใช้งานระบบ' : 'Activate Systems'}
            </span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
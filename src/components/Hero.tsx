import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clapperboard, Play, Camera, Zap, BrainCircuit, Shield,
  Film, Layers, Network, Cpu, Eye, Palette, Scissors,
  ArrowRight, Sparkles, Globe, Users, Award
} from 'lucide-react';
import { StudioInterface } from './StudioInterface';
import { EcosystemButtons } from './EcosystemButtons';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  language: 'th' | 'en';
}

export function Hero({ language }: HeroProps) {
  const { user } = useAuth();
  const [activeNode, setActiveNode] = useState(0);
  const [showInterface, setShowInterface] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle through ecosystem nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hero parallax and fade calculations
  const heroOffset = scrollY * 0.3;
  const heroOpacity = Math.max(1 - scrollY / 800, 0);
  const titleOffset = scrollY * 0.2;

  const content = {
    th: {
      badge: 'ระบบนิเวศภาพยนตร์ที่ขับเคลื่อนด้วย AI',
      title: {
        main: 'EyeMotion',
        highlight: 'Professional Ecosystem'
      },
      description: 'ระบบนิเวศการสร้างภาพยนตร์มืออาชีพที่เชื่อมต่อทุกขั้นตอนการสร้างสรรค์ ขับเคลื่อนด้วยเทคโนโลยี Intent-Aware AI ที่เข้าใจและขยายขีดความสามารถในการสร้างสรรค์',
      stats: [
        { title: '8 องค์ประกอบหลัก', desc: 'ระบบครบครัน' },
        { title: '180K+ ผู้สร้างหนัง', desc: 'ทั่วโลก' },
        { title: 'มาตรฐานอุตสาหกรรม', desc: 'คุณภาพระดับมืออาชีพ' }
      ],
      buttons: {
        primary: 'เข้าสู่ระบบนิเวศ',
        secondary: 'ทดลองใช้ระบบ'
      },
      scrollText: 'เลื่อนเพื่อสำรวจ',
      ecosystemSubtitle: 'ระบบนิเวศการผลิตภาพยนตร์ครบครัน'
    },
    en: {
      badge: 'INTENT-AWARE AI FILM ECOSYSTEM',
      title: {
        main: 'EyeMotion',
        highlight: 'Professional Ecosystem'
      },
      description: 'Professional film ecosystem that connects every creative step, powered by Intent-Aware AI technology that understands and amplifies your creative capabilities',
      stats: [
        { title: '8 Core Components', desc: 'Complete ecosystem' },
        { title: '180K+ Filmmakers', desc: 'Worldwide' },
        { title: 'Industry Standard', desc: 'Professional grade' }
      ],
      buttons: {
        primary: 'ENTER ECOSYSTEM',
        secondary: 'ECOSYSTEM DEMO'
      },
      scrollText: 'SCROLL TO EXPLORE',
      ecosystemSubtitle: 'Complete Film Production Ecosystem'
    }
  };

  const t = content[language];

  const ecosystemNodes = [
    { 
      name: language === 'th' ? 'ปรัชญา Black Frame' : 'Black Frame Philosophy',
      desc: language === 'th' ? 'ปรัชญาหลัก' : 'Core Philosophy',
      color: 'from-slate-500 to-gray-600',
      glow: 'shadow-gray-500/30'
    },
    { 
      name: language === 'th' ? 'Intent-Aware AI' : 'Intent-Aware AI',
      desc: language === 'th' ? 'AI ที่เข้าใจเจตนา' : 'AI that understands intent',
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/40'
    },
    { 
      name: language === 'th' ? 'Auto-Cut Engine' : 'Auto-Cut Engine',
      desc: language === 'th' ? 'การแก้ไขอัตโนมัติ' : 'Automated editing',
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/40'
    },
    { 
      name: language === 'th' ? 'CineTone AI' : 'CineTone AI',
      desc: language === 'th' ? 'ปรับแต่งสีอัจฉริยะ' : 'Intelligent color grading',
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/40'
    },
    { 
      name: language === 'th' ? 'ระบบนิเวศ EyeMotion' : 'EyeMotion Ecosystem',
      desc: language === 'th' ? 'ระบบนิเวศภาพยนตร์' : 'Film ecosystem',
      color: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/40'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32">
      {/* Professional Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.1}px)`
          }}
        />
        
        {/* Ambient Professional Lighting */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-600/4 rounded-full blur-3xl"
            style={{
              transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.05}px)`
            }}
          />
          <div 
            className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-violet-600/3 rounded-full blur-3xl"
            style={{
              transform: `translate(${scrollY * 0.06}px, ${-scrollY * 0.04}px)`
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-600/2 rounded-full blur-2xl"
            style={{
              transform: `translate(-50%, calc(-50% + ${-scrollY * 0.03}px))`
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center">
          
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-12"
            style={{
              transform: `translateY(${titleOffset}px)`,
              opacity: heroOpacity
            }}
          >
            {/* Professional Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900/80 to-black/60 rounded-2xl border border-gray-700/30 backdrop-blur-sm"
            >
              <BrainCircuit className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300 font-bold tracking-[0.2em] uppercase">
                {t.badge}
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]"
              >
                <span className="block text-white mb-4">
                  {t.title.main}
                </span>
                <span 
                  className="block bg-gradient-to-r from-blue-400 via-violet-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent py-4 leading-[1.1]"
                  style={{
                    backgroundPosition: `${scrollY * 0.1}% 50%`,
                    backgroundSize: '400% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem'
                  }}
                >
                  {t.title.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-medium"
              >
                {t.description}
              </motion.p>
            </div>

            {/* Professional Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  title: language === 'th' ? '8 AI Systems' : '8 AI Systems',
                  desc: language === 'th' ? 'ระบบ AI ครบครัน' : 'Complete AI Ecosystem',
                  icon: '🤖',
                  color: 'text-intent'
                },
                {
                  title: language === 'th' ? '4 FFZ Levels' : '4 FFZ Levels', 
                  desc: language === 'th' ? 'เส้นทางการเรียนรู้' : 'Learning Pathway',
                  icon: '🎓',
                  color: 'text-experience'
                },
                {
                  title: language === 'th' ? '100% Verification' : '100% Verification',
                  desc: language === 'th' ? 'ตรวจสอบความถูกต้อง' : 'Authenticity Verified',
                  icon: '✅',
                  color: 'text-verification'
                }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-900/40 to-black/20 rounded-2xl border border-gray-800/30 backdrop-blur-sm group hover:border-gray-700/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className={`text-2xl font-black text-white tracking-tight group-hover:${stat.color} transition-colors`}>
                      {stat.title}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.desc}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Professional CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="py-8"
            >
              <EcosystemButtons 
                language={language}
                onEnterEcosystem={() => setShowInterface(!showInterface)}
                onEcosystemDemo={() => setShowInterface(!showInterface)}
              />
            </motion.div>
          </motion.div>

          {/* Interactive Ecosystem Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative"
            style={{
              transform: `translateY(${heroOffset}px)`,
              opacity: heroOpacity
            }}
          >
            <div className="relative w-full h-[600px] flex items-center justify-center">
              
              {/* Center Hub */}
              <motion.div
                className="absolute w-32 h-32 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center z-10 shadow-2xl border-4 border-white/10"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 50px rgba(59, 130, 246, 0.3)",
                    "0 0 80px rgba(139, 92, 246, 0.4)",
                    "0 0 50px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Zap className="w-12 h-12 text-white" />
              </motion.div>

              {/* Ecosystem Nodes */}
              {ecosystemNodes.map((node, index) => {
                const angle = (index * 72) - 90; // 360/5 = 72 degrees
                const radius = 200;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                const isActive = activeNode === index;

                return (
                  <motion.div
                    key={index}
                    className={`absolute w-24 h-24 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-700 ${
                      isActive 
                        ? `bg-gradient-to-br ${node.color} ${node.glow} shadow-2xl scale-110 border-2 border-white/20`
                        : 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/30 hover:scale-105'
                    }`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    }}
                    animate={{
                      scale: isActive ? [1.1, 1.15, 1.1] : 1,
                      rotateY: isActive ? [0, 360] : 0
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity },
                      rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                    onMouseEnter={() => setActiveNode(index)}
                  >
                    {/* Node Icons */}
                    <div className={`transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}>
                      {[
                        <Shield className="w-8 h-8" />,
                        <BrainCircuit className="w-8 h-8" />,
                        <Scissors className="w-8 h-8" />,
                        <Palette className="w-8 h-8" />,
                        <Network className="w-8 h-8" />
                      ][index]}
                    </div>

                    {/* Connection Lines */}
                    <motion.div
                      className={`absolute w-1 bg-gradient-to-r ${node.color} rounded-full`}
                      style={{
                        height: `${radius - 60}px`,
                        left: '50%',
                        bottom: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(${angle + 180}deg)`
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ 
                        scaleY: isActive ? 1 : 0.3,
                        opacity: isActive ? 1 : 0.3
                      }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                );
              })}

              {/* Active Node Info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center w-80"
                >
                  <h3 className="font-bold text-white text-lg mb-2 tracking-wide">
                    {ecosystemNodes[activeNode].name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {ecosystemNodes[activeNode].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Orbital Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                  animate={{
                    x: Math.cos((i * 45 + scrollY * 0.1) * Math.PI / 180) * 150,
                    y: Math.sin((i * 45 + scrollY * 0.1) * Math.PI / 180) * 150,
                    opacity: [0.6, 0.2, 0.6]
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>

            {/* Ecosystem Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-center text-gray-400 font-medium mt-8 tracking-wide"
            >
              {t.ecosystemSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Studio Interface Overlay */}
      <AnimatePresence>
        {showInterface && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowInterface(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <StudioInterface language={language} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        style={{ opacity: Math.max(1 - scrollY / 300, 0) }}
      >
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <span className="text-xs font-bold tracking-[0.2em] uppercase">
            {t.scrollText}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-500 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
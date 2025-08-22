import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, BrainCircuit, Eye, Scissors, Palette, ArrowRight,
  Upload, Zap, Film, Target, Sparkles, ChevronRight
} from 'lucide-react';
import { EcosystemButtons } from './EcosystemButtons';

interface DemoPreviewProps {
  language: 'th' | 'en';
}

export function DemoPreview({ language }: DemoPreviewProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const content = {
    th: {
      title: 'ทดลองใช้ระบบ AI',
      subtitle: 'สัมผัสพลัง AI ที่เข้าใจความตั้งใจของคุณ',
      upload: {
        title: 'ลากไฟล์ของคุณ',
        subtitle: 'AI จะเริ่มวิเคราะห์ทันที',
        processing: 'ประมวลผล 75%'
      },
      buttons: {
        try: 'ทดลองใช้ทันที',
        explore: 'เข้าสู่ SUITE'
      },
      disclaimer: 'ไม่ต้องสมัครสมาชิก • ไม่ต้องบัตรเครดิต'
    },
    en: {
      title: 'AI Demo Experience',
      subtitle: 'Experience AI that understands your creative intent',
      upload: {
        title: 'Drop Your File',
        subtitle: 'AI analyzes instantly',
        processing: '75% Processing'
      },
      buttons: {
        try: 'TRY NOW',
        explore: 'EXPLORE SUITE'
      },
      disclaimer: 'No signup • No credit card'
    }
  };

  const t = content[language];

  // Core features for preview
  const coreFeatures = [
    {
      id: 'intent-ai',
      name: { th: 'Intent-Aware AI', en: 'Intent-Aware AI' },
      description: { th: 'เข้าใจความตั้งใจของคุณ', en: 'Understands your creative intent' },
      icon: <BrainCircuit className="w-8 h-8" />,
      color: 'from-blue-500 to-violet-500',
      preview: { th: 'วิเคราะห์ใน 2.3 วินาที', en: 'Analyzes in 2.3 seconds' }
    },
    {
      id: 'auto-cut',
      name: { th: 'Auto-Cut Engine', en: 'Auto-Cut Engine' },
      description: { th: 'ตัดต่ออัตโนมัติแม่นยำ', en: 'Precise automated editing' },
      icon: <Scissors className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      preview: { th: 'ประหยัด 85% เวลา', en: 'Saves 85% time' }
    },
    {
      id: 'cinetone',
      name: { th: 'CineTone AI', en: 'CineTone AI' },
      description: { th: 'การแต่งสีระดับโปร', en: 'Professional color grading' },
      icon: <Palette className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-500',
      preview: { th: 'คุณภาพ Cinema', en: 'Cinema quality' }
    }
  ];

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % coreFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="relative py-20 px-6 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent tracking-tight"
          >
            {t.title}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto font-medium"
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Mini Upload Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Compact Upload Area */}
            <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-black/30 rounded-2xl border border-gray-800/40 backdrop-blur-sm overflow-hidden group hover:border-blue-600/30 transition-all duration-500">
              
              {/* Background effects */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                      style={{
                        left: `${20 + i * 25}%`,
                        top: `${30 + i * 15}%`
                      }}
                      animate={{
                        y: [-10, -20, -10],
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 10px 30px rgba(59, 130, 246, 0.3)",
                      "0 20px 40px rgba(59, 130, 246, 0.4)",
                      "0 10px 30px rgba(59, 130, 246, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="font-bold text-white text-lg mb-2 tracking-wide">
                  {t.upload.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium mb-6">
                  {t.upload.subtitle}
                </p>
                
                {/* Mini progress indicator */}
                <motion.div
                  className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
                
                <div className="text-xs text-emerald-400 font-bold">
                  {t.upload.processing}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Core Features Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activeFeature === index
                    ? 'bg-gradient-to-r from-gray-900/60 to-black/40 border-white/20 shadow-2xl'
                    : 'bg-gray-900/30 border-gray-800/40 hover:border-gray-700/60'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {/* Active feature glow */}
                {activeFeature === index && (
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-5`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  {/* Feature Icon */}
                  <motion.div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      activeFeature === index
                        ? `bg-gradient-to-br ${feature.color} text-white shadow-lg`
                        : 'bg-gray-800/60 text-gray-400'
                    }`}
                    animate={activeFeature === index ? {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Feature Info */}
                  <div className="flex-1">
                    <div className={`font-bold text-base mb-1 tracking-wide transition-colors ${
                      activeFeature === index ? 'text-white' : 'text-gray-300'
                    }`}>
                      {feature.name[language]}
                    </div>
                    <div className="text-sm text-gray-400 font-medium mb-2">
                      {feature.description[language]}
                    </div>
                    
                    {/* Active feature preview */}
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-400 font-bold">
                          {feature.preview[language]}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    className={`transition-all duration-300 ${
                      activeFeature === index ? 'text-white scale-110' : 'text-gray-600'
                    }`}
                    animate={activeFeature === index ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Minimal CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <EcosystemButtons 
            language={language}
            onEnterEcosystem={() => {
              // Add demo functionality here
              console.log('Enter Ecosystem clicked');
            }}
            onEcosystemDemo={() => {
              // Add demo functionality here
              console.log('Ecosystem Demo clicked');
            }}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-500 mt-6 font-medium"
          >
            {t.disclaimer}
          </motion.p>
        </motion.div>

        {/* Background subtle effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/4 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
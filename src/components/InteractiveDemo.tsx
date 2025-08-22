import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Play, BrainCircuit, Check, ArrowRight, Flame, 
  Sparkles, Zap, Eye, Palette, Clock, ChevronRight,
  Film, Scissors, Target, Wand2, Layers, Cpu, BarChart3, Gauge
} from 'lucide-react';
import { SectionProps, DemoStep } from '../types';
import { content } from '../locales/content';

interface InteractiveDemoProps extends SectionProps {
  isTrialActive: boolean;
  setIsTrialActive: (active: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
}

export function InteractiveDemo({ 
  language, 
  isTrialActive, 
  setIsTrialActive, 
  demoStep, 
  setDemoStep 
}: InteractiveDemoProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [processingValues, setProcessingValues] = useState({
    upload: 0,
    analysis: 0,
    autocut: 0,
    color: 0
  });

  // Animate processing values
  useEffect(() => {
    if (isTrialActive) {
      const interval = setInterval(() => {
        setProcessingValues(prev => ({
          upload: Math.min(prev.upload + Math.random() * 10, 100),
          analysis: demoStep >= 1 ? Math.min(prev.analysis + Math.random() * 8, 100) : 0,
          autocut: demoStep >= 2 ? Math.min(prev.autocut + Math.random() * 12, 100) : 0,
          color: demoStep >= 3 ? Math.min(prev.color + Math.random() * 15, 100) : 0,
        }));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isTrialActive, demoStep]);

  // Safe access to demo steps with fallbacks
  const demoStepsData = content?.demo_full?.steps || [
    {
      title: { th: 'อัปโหลดวิดีโอ', en: 'Upload Video' },
      description: { th: 'ลากไฟล์วิดีโอของคุณมา', en: 'Drag your video file' },
      detail: { th: 'ระบบรองรับหลายรูปแบบไฟล์', en: 'System supports multiple file formats' }
    },
    {
      title: { th: 'AI วิเคราะห์เนื้อหา', en: 'AI Content Analysis' },
      description: { th: 'เข้าใจความตั้งใจของคุณ', en: 'Understanding your intent' },
      detail: { th: 'วิเคราะห์บริบท อารมณ์ และจังหวะ', en: 'Analyzing context, emotion, and rhythm' }
    },
    {
      title: { th: 'สร้าง Auto-Cut', en: 'Generate Auto-Cut' },
      description: { th: 'AI ตัดต่ออัตโนมัติ', en: 'AI automatic editing' },
      detail: { th: 'สร้างการตัดต่อที่เหมาะสม', en: 'Creating optimal edit points' }
    },
    {
      title: { th: 'CineTone Color', en: 'CineTone Color' },
      description: { th: 'ปรับแต่งสีอัตโนมัติ', en: 'Automatic color grading' },
      detail: { th: 'ปรับสีและโทนให้เหมาะสม', en: 'Adjusting colors and tone optimally' }
    }
  ];

  const demoSteps = demoStepsData.map((step, index) => ({
    id: ['upload', 'analysis', 'autocut', 'color'][index],
    title: step.title,
    description: step.description,
    status: index === 0 ? 'completed' as const : demoStep >= index ? 'completed' as const : 'pending' as const,
    icon: [
      <Upload className="w-6 h-6" />,
      <Eye className="w-6 h-6" />,
      <Zap className="w-6 h-6" />,
      <Palette className="w-6 h-6" />
    ][index],
    processingIcon: [
      <Film className="w-8 h-8" />,
      <Target className="w-8 h-8" />,
      <Scissors className="w-8 h-8" />,
      <Wand2 className="w-8 h-8" />
    ][index],
    color: [
      'from-blue-500 to-cyan-500',
      'from-violet-500 to-purple-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500'
    ][index],
    bgGradient: [
      'from-blue-500/20 via-cyan-500/10 to-blue-500/5',
      'from-violet-500/20 via-purple-500/10 to-violet-500/5',
      'from-emerald-500/20 via-teal-500/10 to-emerald-500/5',
      'from-amber-500/20 via-orange-500/10 to-amber-500/5'
    ][index],
    glowColor: [
      'shadow-blue-500/30',
      'shadow-violet-500/30',
      'shadow-emerald-500/30',
      'shadow-amber-500/30'
    ][index],
    duration: ['0.5s', '2.1s', '1.8s', '1.2s'][index],
    progress: [
      processingValues.upload,
      processingValues.analysis,
      processingValues.autocut,
      processingValues.color
    ][index]
  }));

  return (
    <section id="demo" className="relative py-32 px-6 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent tracking-tight">
            {content?.demo_full?.title?.[language] || (language === 'th' ? 'ทดลองใช้ระบบเต็มรูปแบบ' : 'FULL SYSTEM DEMO')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
            {content?.demo_full?.subtitle?.[language] || (language === 'th' 
              ? 'สัมผัสพลัง Intent-Aware AI ด้วยตัวคุณเอง ไม่ต้องติดตั้ง ไม่ต้องสมัครสมาชิก'
              : 'Experience the power of Intent-Aware AI yourself. No installation, no signup required.'
            )}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto rounded-full mt-8" />
        </motion.div>

        <div className="space-y-16">
          {/* Demo Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-black/60 rounded-3xl border-2 border-dashed border-gray-700 p-16 text-center backdrop-blur-sm"
          >
            {!isTrialActive ? (
              <>
                <Upload size={64} className="text-gray-400 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-white mb-6 tracking-wide">
                  {content?.demo_full?.upload?.title?.[language] || (language === 'th' ? 'อัปโหลดวิดีโอของคุณ' : 'UPLOAD YOUR VIDEO')}
                </h3>
                <p className="text-xl text-gray-400 font-medium mb-12">
                  {content?.demo_full?.upload?.description?.[language] || (language === 'th' 
                    ? 'ลากไฟล์วิดีโอมาที่นี่ หรือคลิกเพื่อเลือกไฟล์ (รองรับ MP4, MOV, AVI)'
                    : 'Drag video file here or click to select (supports MP4, MOV, AVI)'
                  )}
                </p>
                <motion.button
                  onClick={() => setIsTrialActive(true)}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl text-white font-bold text-xl tracking-wide"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={24} />
                  {content?.demo_full?.upload?.button?.[language] || (language === 'th' ? 'เริ่มทดลองใช้' : 'START DEMO')}
                </motion.button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <motion.div
                  className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <BrainCircuit size={48} className="text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white tracking-wide">
                  {content?.demo_full?.processing?.title?.[language] || (language === 'th' ? 'AI กำลังประมวลผล...' : 'AI PROCESSING...')}
                </h3>
                <div className="text-emerald-400 font-bold text-xl">
                  {`${Math.min(demoStep + 1, 4)}/4 ${content?.demo_full?.processing?.progress?.[language] || (language === 'th' ? 'ขั้นตอนเสร็จสิ้น' : 'STEPS COMPLETED')}`}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Horizontal Premium Demo Steps */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background ambient effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            {/* Horizontal Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 -z-10">
                <div className="relative h-full bg-gray-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 via-emerald-500 to-amber-500"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: isTrialActive ? `${(demoStep + 1) * 25}%` : "0%" 
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {demoSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="group relative"
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Premium Step Container */}
                  <motion.div
                    className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border-2 transition-all duration-700 cursor-pointer ${
                      step.status === 'completed' || (isTrialActive && index <= demoStep)
                        ? `bg-gradient-to-br ${step.bgGradient} border-white/20 ${step.glowColor} shadow-2xl`
                        : 'bg-gray-900/30 border-gray-800/40 hover:bg-gray-900/50 hover:border-gray-700/60'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated Background Pattern */}
                    {(step.status === 'completed' || (isTrialActive && index <= demoStep)) && (
                      <>
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10`}
                          animate={{
                            opacity: [0.1, 0.2, 0.1],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        {/* Flowing particles */}
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`absolute w-2 h-2 bg-gradient-to-r ${step.color} rounded-full opacity-60`}
                              style={{
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 2) * 60}%`
                              }}
                              animate={{
                                y: [-20, -40, -20],
                                opacity: [0.6, 0, 0.6],
                                scale: [1, 0.5, 1]
                              }}
                              transition={{
                                duration: 2 + i * 0.3,
                                repeat: Infinity,
                                delay: i * 0.4
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Step Content */}
                    <div className="relative p-8 text-center space-y-6">
                      {/* Premium Icon Container */}
                      <motion.div
                        className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                          step.status === 'completed' || (isTrialActive && index <= demoStep)
                            ? `bg-gradient-to-br ${step.color} text-white shadow-xl ${step.glowColor}`
                            : 'bg-gray-800/60 text-gray-500 border-2 border-gray-700/50'
                        }`}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {step.status === 'completed' || (isTrialActive && index <= demoStep) ? (
                            <motion.div
                              key="processing"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ 
                                scale: 1, 
                                rotate: 0,
                                y: [0, -2, 0]
                              }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ 
                                scale: { type: "spring", stiffness: 500, damping: 25 },
                                rotate: { type: "spring", stiffness: 500, damping: 25 },
                                y: { duration: 2, repeat: Infinity }
                              }}
                            >
                              {step.processingIcon}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="pending"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              {step.icon}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Step Info */}
                      <div className="space-y-3">
                        <motion.div
                          className={`font-bold text-lg tracking-wide transition-colors duration-300 ${
                            step.status === 'completed' || (isTrialActive && index <= demoStep)
                              ? 'text-white' 
                              : 'text-gray-400 group-hover:text-gray-300'
                          }`}
                        >
                          {step.title[language]}
                        </motion.div>
                        
                        <motion.div 
                          className="text-sm text-gray-500 font-medium group-hover:text-gray-400 transition-colors duration-300"
                        >
                          {step.description[language]}
                        </motion.div>

                        {/* Progress Bar */}
                        {isTrialActive && step.progress > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Processing</span>
                              <span className="text-white font-bold">{Math.floor(step.progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${step.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${step.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Completion Status */}
                        {(step.status === 'completed' || (isTrialActive && index <= demoStep)) && step.progress >= 100 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold"
                          >
                            <Check size={12} />
                            <span>
                              {`${content?.demo_full?.completion?.prefix?.[language] || (language === 'th' ? 'เสร็จใน' : 'Done in')} ${step.duration}`}
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* Active Processing Indicator */}
                      {isTrialActive && index === demoStep && step.progress < 100 && (
                        <motion.div
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: 360
                          }}
                          transition={{
                            scale: { duration: 2, repeat: Infinity },
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                          }}
                        >
                          <Cpu size={12} className="text-white" />
                        </motion.div>
                      )}
                    </div>

                    {/* Step Number */}
                    <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.status === 'completed' || (isTrialActive && index <= demoStep)
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-800/80 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                  </motion.div>

                  {/* Detailed Features (Show on Hover) */}
                  <AnimatePresence>
                    {activeStep === index && (isTrialActive || step.status === 'completed') && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`absolute -bottom-32 left-1/2 -translate-x-1/2 w-80 p-6 bg-gradient-to-br ${step.bgGradient} backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-10`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                              {step.processingIcon}
                            </div>
                            <div>
                              <div className="font-bold text-white">{step.title[language]}</div>
                              <div className="text-xs text-gray-400">Advanced AI Processing</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {/* Feature details based on step */}
                            {step.id === 'upload' && (
                              <>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">File Size</div>
                                  <div className="text-sm font-bold text-white">2.4 GB</div>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">Format</div>
                                  <div className="text-sm font-bold text-white">4K MP4</div>
                                </div>
                              </>
                            )}
                            {step.id === 'analysis' && (
                              <>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">Intent</div>
                                  <div className="text-sm font-bold text-white">Dramatic</div>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">Confidence</div>
                                  <div className="text-sm font-bold text-emerald-400">94%</div>
                                </div>
                              </>
                            )}
                            {step.id === 'autocut' && (
                              <>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">Cuts Made</div>
                                  <div className="text-sm font-bold text-white">24</div>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">Time Saved</div>
                                  <div className="text-sm font-bold text-emerald-400">2h 30m</div>
                                </div>
                              </>
                            )}
                            {step.id === 'color' && (
                              <>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">LUT Applied</div>
                                  <div className="text-sm font-bold text-white">Cinema</div>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                  <div className="text-xs text-gray-400">Quality</div>
                                  <div className="text-sm font-bold text-amber-400">Premium</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Arrow pointer */}
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 bg-gradient-to-br ${step.bgGradient} border-l border-t border-white/10`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Overall Progress Indicator */}
            {isTrialActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 text-center"
              >
                <div className="inline-flex items-center gap-4 px-8 py-4 bg-black/60 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-sm text-gray-400">
                      {content?.demo_full?.progress_indicator?.label?.[language] || (language === 'th' ? 'ความคืบหน้าโดยรวม' : 'Overall Progress')}
                    </div>
                    <div className="font-bold text-white">
                      {Math.floor(((demoStep + 1) / 4) * 100)}
                      {content?.demo_full?.progress_indicator?.complete?.[language] || (language === 'th' ? '% เสร็จสิ้น' : '% Complete')}
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((demoStep + 1) / 4) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Demo CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center p-12 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-3xl border border-blue-600/20 backdrop-blur-sm"
          >
            <Flame size={48} className="text-blue-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-6 tracking-wide">
              {content?.demo_full?.cta?.title?.[language] || (language === 'th' ? 'ชอบใจไหม? เริ่มต้นเลย!' : 'LIKE WHAT YOU SEE? GET STARTED!')}
            </h3>
            <p className="text-xl text-gray-400 mb-10 font-medium">
              {content?.demo_full?.cta?.subtitle?.[language] || (language === 'th' 
                ? 'ทดลองใช้ฟรี 7 วัน ไม่ต้องให้ข้อมูลบัตรเครดิต'
                : '7-day free trial, no credit card required'
              )}
            </p>
            <motion.button
              className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl text-white font-bold text-xl tracking-wide"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 60px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={24} />
              {content?.demo_full?.cta?.button?.[language] || (language === 'th' ? 'เริ่มทดลองใช้เลย' : 'START TRIAL NOW')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, TrendingUp, Globe, Users, Clock, DollarSign, Zap, Star,
  Building2, Trophy, Sparkles, ArrowRight, CheckCircle, Target,
  Film, Cpu, BarChart3, Shield, Network, Eye, Play, Crown
} from 'lucide-react';

interface ImpactProps {
  language: 'th' | 'en';
}

export function Impact({ language }: ImpactProps) {
  const [activeStory, setActiveStory] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    professionals: 0,
    hours: 0,
    accuracy: 0,
    budget: 0
  });

  const content = {
    th: {
      badge: 'ผลกระทบระดับโลก',
      title: 'เปลี่ยนอุตสาหกรรม\nภาพยนตร์โลก',
      subtitle: 'เทคโนโลยี EyeMotion กำลังปฏิวัติวิธีการสร้างภาพยนตร์ทั่วโลก พร้อมผลกระทบที่วัดผลได้',
      stats: {
        primary: [
          {
            label: 'ผู้เชี่ยวชาญทั่วโลก',
            growth: '+180% ต่อปี',
            description: 'เติบโตอย่างต่อเนื่อง'
          },
          {
            label: 'ชั่วโมงประหยัดได้',
            growth: '+85% ประสิทธิภาพ',
            description: 'ประหยัดเวลา'
          },
          {
            label: 'ความแม่นยำ AI',
            growth: '+99.2% ถูกต้อง',
            description: 'คุณภาพระดับโปร'
          },
          {
            label: 'งบประมาณประหยัด',
            growth: '+67% ลดต้นทุน',
            description: 'ประหยัดงบประมาณ'
          }
        ],
        secondary: [
          {
            title: '15+ ประเทศ',
            desc: 'ใช้งานทั่วโลก'
          },
          {
            title: '500+ โปรเจ็กต์',
            desc: 'สำเร็จแล้ว'
          },
          {
            title: '24/7 การสนับสนุน',
            desc: 'ตลอดเวลา'
          }
        ]
      },
      recognition: {
        title: 'รางวัลและการยอมรับ',
        awards: [
          {
            title: 'AI Innovation Award',
            year: '2024',
            category: 'เทคโนโลยี AI'
          },
          {
            title: 'Film Tech Excellence',
            year: '2024',
            category: 'เทคโนโลยีภาพยนตร์'
          },
          {
            title: 'Industry Disruption',
            year: '2023',
            category: 'นวัตกรรม'
          },
          {
            title: 'Global Recognition',
            year: '2023',
            category: 'การยอมรับระดับโลก'
          }
        ]
      },
      success_stories: {
        title: 'เรื่องราวความสำเร็จ',
        cases: [
          {
            studio: 'Paramount Studios',
            project: 'Action Blockbuster 2024',
            result: 'ประหยัด 85% เวลา',
            quote: 'EyeMotion เปลี่ยนวิธีการทำงานของเราโดยสิ้นเชิง ประหยัดเวลาและเพิ่มคุณภาพได้อย่างน่าทึ่ง',
            author: 'ผู้อำนวยการฝ่ายผลิต'
          },
          {
            studio: 'Netflix Original',
            project: 'Drama Series Production',
            result: 'เพิ่มผลผลิต 200%',
            quote: 'ระบบ AI ของ EyeMotion ช่วยให้เราสร้างเนื้อหาคุณภาพสูงได้เร็วขึ้นกว่าเดิมมาก',
            author: 'Executive Producer'
          }
        ]
      },
      community: {
        title: 'ชุมชนนักสร้างสรรค์โลก',
        subtitle: 'เชื่อมต่อผู้สร้างภาพยนตร์ทั่วโลกเข้าด้วยกัน',
        features: [
          {
            title: 'ชุมชนผู้สร้าง',
            desc: 'เครือข่ายผู้เชี่ยวชาญ\nทั่วโลก'
          },
          {
            title: 'แบ่งปันความรู้',
            desc: 'การเรียนรู้\nและแลกเปลี่ยน'
          },
          {
            title: 'การเข้าถึงระดับโลก',
            desc: 'เครื่องมือสำหรับ\nทุกคน'
          },
          {
            title: 'ความปลอดภัย',
            desc: 'ระบบรักษาความปลอดภัย\nระดับสูง'
          }
        ]
      },
      cta: {
        title: 'เข้าร่วมการปฏิวัติ',
        subtitle: 'เป็นส่วนหนึ่งของอนาคตอุตสาหกรรมภาพยนตร์ที่ขับเคลื่อนด้วย AI',
        button: 'เริ่มต้นใช้งาน'
      }
    },
    en: {
      badge: 'GLOBAL IMPACT',
      title: 'Transforming\nGlobal Cinema',
      subtitle: 'EyeMotion technology is revolutionizing filmmaking worldwide with measurable impact and unprecedented results',
      stats: {
        primary: [
          {
            label: 'Global Professionals',
            growth: '+180% yearly',
            description: 'Growing rapidly'
          },
          {
            label: 'Hours Saved',
            growth: '+85% efficiency',
            description: 'Time savings'
          },
          {
            label: 'AI Accuracy',
            growth: '+99.2% correct',
            description: 'Pro-level quality'
          },
          {
            label: 'Budget Saved',
            growth: '+67% cost reduction',
            description: 'Budget efficiency'
          }
        ],
        secondary: [
          {
            title: '15+ Countries',
            desc: 'Global adoption'
          },
          {
            title: '500+ Projects',
            desc: 'Successfully completed'
          },
          {
            title: '24/7 Support',
            desc: 'Always available'
          }
        ]
      },
      recognition: {
        title: 'Awards & Recognition',
        awards: [
          {
            title: 'AI Innovation Award',
            year: '2024',
            category: 'AI Technology'
          },
          {
            title: 'Film Tech Excellence',
            year: '2024',
            category: 'Film Technology'
          },
          {
            title: 'Industry Disruption',
            year: '2023',
            category: 'Innovation'
          },
          {
            title: 'Global Recognition',
            year: '2023',
            category: 'Global Recognition'
          }
        ]
      },
      success_stories: {
        title: 'Success Stories',
        cases: [
          {
            studio: 'Paramount Studios',
            project: 'Action Blockbuster 2024',
            result: '85% Time Saved',
            quote: 'EyeMotion completely transformed our workflow. The time savings and quality improvements are remarkable.',
            author: 'Head of Production'
          },
          {
            studio: 'Netflix Original',
            project: 'Drama Series Production',
            result: '200% Productivity',
            quote: 'EyeMotion AI systems help us create high-quality content much faster than ever before.',
            author: 'Executive Producer'
          }
        ]
      },
      community: {
        title: 'Global Creator Community',
        subtitle: 'Connecting filmmakers worldwide in a unified ecosystem',
        features: [
          {
            title: 'Creator Network',
            desc: 'Global professional\nnetwork'
          },
          {
            title: 'Knowledge Sharing',
            desc: 'Learning and\nexchange'
          },
          {
            title: 'Global Access',
            desc: 'Tools for\neveryone'
          },
          {
            title: 'Security',
            desc: 'Enterprise-grade\nsecurity'
          }
        ]
      },
      cta: {
        title: 'Join the Revolution',
        subtitle: 'Be part of the AI-powered future of filmmaking industry',
        button: 'Get Started'
      }
    }
  };

  const t = content[language];

  // Animate statistics on scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        professionals: Math.min(prev.professionals + 2000, 180000),
        hours: Math.min(prev.hours + 30000, 2400000),
        accuracy: Math.min(prev.accuracy + 1, 94),
        budget: Math.min(prev.budget + 500000, 42000000)
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate success stories
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % t.success_stories.cases.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number, suffix = '') => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M' + suffix;
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K' + suffix;
    return num + suffix;
  };

  return (
    <section id="impact" className="relative py-32 px-6 border-t border-gray-800/50 overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 -z-10">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Professional grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Professional ambient lighting */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-violet-600/4 rounded-full blur-3xl" />
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-emerald-600/2 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Professional Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-900/80 to-black/60 rounded-2xl border border-gray-700/30 backdrop-blur-sm mb-12"
          >
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-bold tracking-[0.2em] uppercase">
              {t.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-violet-200 bg-clip-text text-transparent tracking-tight"
          >
            {t.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-medium"
          >
            {t.subtitle}
          </motion.p>
          
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full mt-8" />
        </motion.div>

        {/* Primary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {t.stats.primary.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Professional Stat Card */}
              <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-black/30 rounded-3xl border border-gray-800/40 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-700 overflow-hidden">
                
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5 opacity-0 group-hover:opacity-100 transition-all duration-700"
                  whileHover={{ scale: 1.05 }}
                />

                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`
                      }}
                      animate={{
                        y: [-10, -20, -10],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 text-center">
                  {/* Main Statistic */}
                  <motion.div
                    className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                  >
                    {index === 0 && formatNumber(animatedStats.professionals, '+')}
                    {index === 1 && formatNumber(animatedStats.hours)}
                    {index === 2 && animatedStats.accuracy + '%'}
                    {index === 3 && '$' + formatNumber(animatedStats.budget)}
                  </motion.div>

                  {/* Label */}
                  <div className="text-gray-400 font-bold text-sm mb-4 tracking-wide">
                    {stat.label}
                  </div>

                  {/* Growth Indicator */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-emerald-600/20 rounded-lg">
                      <TrendingUp size={12} className="text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">
                        {stat.growth}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {stat.description}
                    </span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-emerald-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {t.stats.secondary.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-gray-900/30 to-black/20 rounded-2xl border border-gray-800/30 backdrop-blur-sm hover:border-gray-700/50 transition-all duration-500"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-2xl font-black text-white mb-2 tracking-wide">
                {stat.title}
              </div>
              <div className="text-sm text-gray-400 font-medium">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Industry Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wide"
            >
              {t.recognition.title}
            </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.recognition.awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative p-6 bg-gradient-to-br from-amber-600/10 to-orange-600/5 rounded-2xl border border-amber-600/20 backdrop-blur-sm hover:border-amber-500/40 transition-all duration-500"
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div className="font-bold text-white text-sm mb-2 tracking-wide">
                    {award.title}
                  </div>
                  <div className="text-xs text-amber-400 mb-1 font-bold">
                    {award.year}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {award.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wide"
            >
              {t.success_stories.title}
            </motion.h3>
          </div>

          {/* Featured Success Story */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, type: "easeInOut" }}
                className="relative p-12 bg-gradient-to-br from-gray-900/60 to-black/40 rounded-3xl border border-gray-700/30 backdrop-blur-sm overflow-hidden"
              >
                {/* Background Effects */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/3" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent"
                    animate={{
                      x: [-200, 400],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                <div className="relative z-10">
                  {/* Studio & Project */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Building2 size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white tracking-wide">
                        {t.success_stories.cases[activeStory].studio}
                      </div>
                      <div className="text-blue-400 font-bold text-sm tracking-wide">
                        {t.success_stories.cases[activeStory].project}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className="px-4 py-2 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
                        <div className="text-emerald-400 font-bold text-sm tracking-wide">
                          {t.success_stories.cases[activeStory].result}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mb-8">
                    <div className="text-2xl font-medium text-gray-200 italic leading-relaxed mb-6">
                      "{t.success_stories.cases[activeStory].quote}"
                    </div>
                    <div className="text-sm text-gray-400 font-bold">
                      — {t.success_stories.cases[activeStory].author}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Story Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {t.success_stories.cases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeStory === index 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Global Community */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-white mb-6 tracking-wide"
            >
              {t.community.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-gray-400 max-w-2xl mx-auto font-medium"
            >
              {t.community.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.community.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group text-center p-8 bg-gradient-to-br from-gray-900/40 to-black/30 rounded-3xl border border-gray-800/40 backdrop-blur-sm hover:border-violet-600/30 transition-all duration-700"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl"
                  whileHover={{ 
                    rotate: [0, -5, 5, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {[<Users size={28} />, <Network size={28} />, <Globe size={28} />, <Shield size={28} />][index]}
                </motion.div>
                <div className="font-bold text-white text-lg mb-3 tracking-wide">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  {feature.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center p-16 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-emerald-600/10 rounded-3xl border border-blue-600/20 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent"
              animate={{
                x: [-300, 300],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
            >
              <Target size={64} className="text-blue-400 mx-auto mb-8" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-8 tracking-wide"
            >
              {t.cta.title}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-gray-400 mb-12 font-medium max-w-3xl mx-auto"
            >
              {t.cta.subtitle}
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-600 rounded-2xl text-white font-bold text-xl tracking-wide shadow-2xl group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 60px rgba(59, 130, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={24} />
              <span>{t.cta.button}</span>
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from 'motion/react';
import { Play, Film, Zap, Star } from 'lucide-react';

interface SuiteProps {
  language: 'th' | 'en';
}

export function Suite({ language }: SuiteProps) {
  return (
    <div className="page-professional py-20 px-6 relative overflow-hidden bg-background">
      {/* Professional Cinema Background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 bg-experience"
            style={{ 
              top: '10%',
              left: '20%'
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Enhanced Professional Header with Beautiful Colors */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="professional-hero mb-6 relative">
            {/* Beautiful EyeMotion Branding with Professional Typography */}
            <motion.span 
              className="text-gradient-ecosystem font-display block font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                textShadow: '0 0 20px rgba(72, 142, 255, 0.3), 0 0 40px rgba(72, 142, 255, 0.2)',
                lineHeight: 'var(--line-height-tight)'
              }}
            >
              EyeMotion
            </motion.span>
            
            {/* Beautiful Tech Separator */}
            <motion.div 
              className="flex items-center justify-center my-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-intent to-transparent w-32" />
              <div className="mx-4 w-3 h-3 rounded-full bg-intent animate-eyemotion-pulse" />
              <div className="h-px bg-gradient-to-r from-intent via-experience to-transparent w-32" />
            </motion.div>
            
            {/* Professional Suite with Beautiful Colors */}
            <motion.span 
              className="text-gradient-intent font-display block font-semibold tracking-normal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{
                textShadow: '0 0 15px rgba(191, 242, 255, 0.4)',
                lineHeight: 'var(--line-height-tight)',
                fontSize: 'calc(var(--professional-hero) * 0.7)' // Slightly smaller for hierarchy
              }}
            >
              Professional Suite
            </motion.span>

            {/* Beautiful Enhancement Indicator */}
            <motion.div 
              className="absolute -top-4 -right-4 md:-right-8"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="bg-intent/20 border border-intent/40 rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="text-intent font-primary text-xs font-semibold tracking-wide">
                  AI-Powered
                </span>
              </div>
            </motion.div>
          </h1>
          
          <motion.p 
            className="professional-body text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {language === 'th' 
              ? 'ชุดเครื่องมือสร้างภาพยนตร์ระดับมืออาชีพด้วยพลัง Intent-Aware AI'
              : 'Professional filmmaking suite powered by Intent-Aware AI technology'
            }
          </motion.p>

          {/* Beautiful Enhancement Indicators */}
          <motion.div 
            className="flex items-center justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {[
              { 
                label: language === 'th' ? 'AI เข้าใจเจตนา' : 'Intent-Aware AI',
                color: 'intent'
              },
              { 
                label: language === 'th' ? 'ระบบตัดต่อเชาว์' : 'Smart Editing',
                color: 'experience'
              },
              { 
                label: language === 'th' ? 'การยืนยันตัวตน' : 'Verification',
                color: 'verification'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className={`flex items-center gap-2 text-${feature.color} font-primary font-medium text-sm`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
              >
                <div className={`w-2 h-2 rounded-full bg-${feature.color} animate-eyemotion-pulse`} />
                <span className="font-primary text-xs tracking-normal">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Demo Interface */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-full h-96 rounded-2xl border border-border relative overflow-hidden bg-card/80">
            {/* Mock Interface */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-experience/20">
                  <Play className="w-10 h-10 text-experience" />
                </div>
                <h3 className="professional-heading text-foreground mb-3">
                  {language === 'th' ? 'สาธิตการใช้งาน' : 'Live Demo'}
                </h3>
                <p className="professional-body text-muted-foreground">
                  {language === 'th' ? 'คลิกเพื่อดูการทำงานของ Suite' : 'Click to see Suite in action'}
                </p>
              </div>
            </div>

            {/* Professional Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-20 bg-gradient-to-br from-transparent via-experience/10 to-transparent" />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              icon: Film,
              title: language === 'th' ? 'CineFlow Engine' : 'CineFlow Engine',
              description: language === 'th' ? 'ระบบตัดต่ออัตโนมัติที่เข้าใจจังหวะและอารมณ์' : 'Intelligent auto-cut system with emotion recognition',
              colorClass: 'experience'
            },
            {
              icon: Star,
              title: language === 'th' ? 'CineStory Studio™' : 'CineStory Studio™',
              description: language === 'th' ? 'ระบบ preview และ narrative ขั้นสูง' : 'Advanced preview and narrative system',
              colorClass: 'community'
            },
            {
              icon: Zap,
              title: language === 'th' ? 'Intent-Aware AI' : 'Intent-Aware AI',
              description: language === 'th' ? 'AI ที่เข้าใจเจตนาและวิสัยทัศน์ของคุณ' : 'AI that understands your creative intent',
              colorClass: 'intent'
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className="p-8 rounded-xl border border-border bg-card/60 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-${feature.colorClass}/20`}>
                  <IconComponent className={`w-8 h-8 text-${feature.colorClass}`} />
                </div>
                <h3 className="professional-heading text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="professional-body text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="professional-display text-foreground mb-6">
            {language === 'th' ? 'พร้อมเริ่มต้นแล้วหรือยัง?' : 'Ready to get started?'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-primary font-bold tracking-wide transition-all duration-300 hover:scale-105 bg-experience text-white shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5" />
              <span>{language === 'th' ? 'เริ่มทดลองใช้ฟรี' : 'Start Free Trial'}</span>
            </button>
            
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-border font-primary font-bold tracking-wide transition-all duration-300 hover:scale-105 text-foreground bg-experience/10 hover:bg-experience/20"
            >
              <span>{language === 'th' ? 'ดูตัวอย่าง' : 'Watch Demo'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Default export for AppRouter compatibility
export default Suite;
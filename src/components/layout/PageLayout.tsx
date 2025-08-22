import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../Navigation';
import { motion } from 'motion/react';

interface PageLayoutProps {
  children: React.ReactNode;
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
  scrollY: number;
  showFooter?: boolean;
  className?: string;
}

export function PageLayout({ 
  children, 
  language, 
  setLanguage, 
  scrollY,
  showFooter = true,
  className = ""
}: PageLayoutProps) {
  // Calculate scroll progress for professional indicators
  const scrollProgress = React.useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
  }, [scrollY]);

  return (
    <div 
      className={`min-h-screen text-white selection:bg-blue-500/20 overflow-x-hidden ${className}`}
      style={{ 
        backgroundColor: 'oklch(0.145 0 0)',
        color: 'oklch(0.985 0 0)'
      }}
    >
      {/* Professional Background System */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, oklch(0.145 0 0), oklch(0.205 0 0), oklch(0.145 0 0))'
          }}
        />
        
        {/* Subtle grid pattern for professional feel */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.985 0 0 / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.985 0 0 / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Ambient Professional Lighting */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'oklch(0.488 0.243 264.376 / 0.03)' }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: 'oklch(0.627 0.265 303.9 / 0.04)' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.04, 0.06, 0.04]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation 
          language={language}
          setLanguage={setLanguage}
        />

        <main className="relative">
          {children}
        </main>

        {showFooter && (
          <footer 
            className="py-20 px-6"
            style={{ 
              borderTop: '1px solid oklch(0.269 0 0 / 0.5)',
              backgroundColor: 'oklch(0.205 0 0 / 0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, oklch(0.488 0.243 264.376), oklch(0.627 0.265 303.9))'
                      }}
                    >
                      <span 
                        className="text-sm font-black"
                        style={{ color: 'oklch(0.985 0 0)' }}
                      >
                        EM
                      </span>
                    </div>
                    <div>
                      <div 
                        className="text-lg font-black tracking-wider"
                        style={{ color: 'oklch(0.985 0 0)' }}
                      >
                        EyeMotion
                      </div>
                      <div 
                        className="text-xs font-bold tracking-wide"
                        style={{ color: 'oklch(0.488 0.243 264.376)' }}
                      >
                        PROFESSIONAL SUITE
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-sm max-w-xs font-medium leading-relaxed"
                    style={{ color: 'oklch(0.708 0 0)' }}
                  >
                    {language === 'th' 
                      ? 'ระบบนิเวศภาพยนตร์แบบมืออาชีพด้วยพลัง Intent-Aware AI' 
                      : 'Professional film ecosystem powered by Intent-Aware AI'
                    }
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 
                    className="text-lg font-bold mb-4 tracking-wide"
                    style={{ color: 'oklch(0.985 0 0)' }}
                  >
                    {language === 'th' ? 'เมนูหลัก' : 'Main Menu'}
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Suite', path: '/suite' },
                      { label: 'Pricing', path: '/pricing' },
                      { label: 'Dashboard', path: '/dashboard' },
                      { label: 'About', path: '/about' }
                    ].map((item) => (
                      <Link 
                        key={item.label}
                        to={item.path}
                        className="block text-sm font-medium transition-colors duration-300"
                        style={{ color: 'oklch(0.708 0 0)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'oklch(0.985 0 0)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'oklch(0.708 0 0)';
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 
                    className="text-lg font-bold mb-4 tracking-wide"
                    style={{ color: 'oklch(0.985 0 0)' }}
                  >
                    {language === 'th' ? 'ฟีเจอร์หลัก' : 'Core Features'}
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'CineFlow Engine', color: 'oklch(0.696 0.17 162.48)' },
                      { name: 'CineStory Studio™', color: 'oklch(0.645 0.246 16.439)' },
                      { name: 'CineTone AI', color: 'oklch(0.769 0.188 70.08)' },
                      { name: 'Intent-Aware AI', color: 'oklch(0.488 0.243 264.376)' }
                    ].map((feature) => (
                      <div 
                        key={feature.name}
                        className="flex items-center gap-2"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: feature.color }}
                        />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: 'oklch(0.708 0 0)' }}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal */}
                <div>
                  <h4 
                    className="text-lg font-bold mb-4 tracking-wide"
                    style={{ color: 'oklch(0.985 0 0)' }}
                  >
                    {language === 'th' ? 'ข้อกำหนด' : 'Legal'}
                  </h4>
                  <div className="space-y-3">
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
                      <a 
                        key={item}
                        href="#"
                        className="block text-sm font-medium transition-colors duration-300"
                        style={{ color: 'oklch(0.708 0 0)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'oklch(0.985 0 0)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'oklch(0.708 0 0)';
                        }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div 
                className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                style={{ borderTop: '1px solid oklch(0.269 0 0 / 0.5)' }}
              >
                <p 
                  className="text-sm font-medium"
                  style={{ color: 'oklch(0.708 0 0)' }}
                >
                  © 2024 EyeMotion. All rights reserved.
                </p>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs font-medium"
                    style={{ color: 'oklch(0.708 0 0)' }}
                  >
                    Powered by Cine Suite™
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: 'oklch(0.488 0.243 264.376)' }}
                  />
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Professional Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-1"
        style={{ backgroundColor: 'oklch(0.269 0 0 / 0.3)' }}
      >
        <motion.div 
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, oklch(0.488 0.243 264.376), oklch(0.627 0.265 303.9), oklch(0.696 0.17 162.48))',
            transformOrigin: 'left'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />
      </div>

      {/* Professional Scroll Position Indicator */}
      {scrollY > 100 && (
        <motion.div
          className="fixed bottom-8 right-8 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full backdrop-blur-sm border transition-all duration-300 flex items-center justify-center group"
            style={{
              backgroundColor: 'oklch(0.205 0 0 / 0.8)',
              borderColor: 'oklch(0.269 0 0)',
              color: 'oklch(0.708 0 0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'oklch(0.488 0.243 264.376)';
              e.currentTarget.style.color = 'oklch(0.488 0.243 264.376)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'oklch(0.269 0 0)';
              e.currentTarget.style.color = 'oklch(0.708 0 0)';
            }}
          >
            <svg 
              className="w-5 h-5 transition-transform group-hover:-translate-y-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
}
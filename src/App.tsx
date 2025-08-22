import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './router/AppRouter';
import { SupabaseConnectionDetails } from './components/SupabaseConnectionStatus';
import { useScrollYSimple } from './hooks/useScrollY';

export default function App() {
  const [language, setLanguage] = useState<'th' | 'en'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const scrollY = useScrollYSimple();

  // Professional font loading optimization (Removed Orbitron)
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Preload critical fonts for immediate rendering
        await Promise.all([
          document.fonts.load('400 1rem Inter'),
          document.fonts.load('600 1rem Inter'),
          document.fonts.load('700 1rem Inter'),
          document.fonts.load('400 1rem Poppins'),
          document.fonts.load('600 1rem Poppins'),
          document.fonts.load('700 1rem Poppins'),
          document.fonts.load('400 1rem JetBrains Mono'), // Keep for technical content
        ]);
        
        setFontsLoaded(true);
      } catch (error) {
        // Silent fallback to system fonts for production
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  // Apply EyeMotion professional cinema theme
  useEffect(() => {
    // Force dark mode for cinema aesthetic
    document.documentElement.classList.add('dark');
    
    // Apply EyeMotion professional cinema background
    document.body.style.backgroundColor = 'oklch(0.145 0 0)'; // --cinema-deep
    document.body.style.color = 'oklch(0.985 0 0)';          // --cinema-foreground
    
    // Smooth scrolling for professional feel
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // EyeMotion meta tags for professional branding
    document.title = 'EyeMotion - Adaptive Visual Storytelling & Verification Ecosystem';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'EyeMotion - Professional film ecosystem powered by Intent-Aware AI. Transform lived experience into verified authentic visual narratives with Film From Zero (FFZ) educational framework and Cine Suite™ tools.'
      );
    }
    
    // Professional theme color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]') || 
                          document.createElement('meta');
    themeColorMeta.setAttribute('name', 'theme-color');
    themeColorMeta.setAttribute('content', 'oklch(0.145 0 0)'); // Deep space background
    if (!themeColorMeta.parentNode) {
      document.head.appendChild(themeColorMeta);
    }
    
    setIsLoading(false);
  }, []);

  // Enhanced language detection and management
  useEffect(() => {
    const detectLanguage = () => {
      const savedLanguage = localStorage.getItem('eyemotion-language');
      if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
        setLanguage(savedLanguage as 'th' | 'en');
        return;
      }

      // Detect from browser language with cultural context
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('th')) {
        setLanguage('th');
      } else {
        setLanguage('en');
      }
    };

    detectLanguage();
  }, []);

  // Save language preference with cultural context
  useEffect(() => {
    localStorage.setItem('eyemotion-language', language);
    
    // Update document language for accessibility and cultural authenticity
    document.documentElement.lang = language;
    
    // Update cultural context meta tag
    const culturalMeta = document.querySelector('meta[name="cultural-context"]') || 
                        document.createElement('meta');
    culturalMeta.setAttribute('name', 'cultural-context');
    culturalMeta.setAttribute('content', language === 'th' ? 'thai-storytelling' : 'global-storytelling');
    if (!culturalMeta.parentNode) {
      document.head.appendChild(culturalMeta);
    }
  }, [language]);

  // Professional scroll performance optimization with proper dependencies
  const handleScroll = useCallback(() => {
    // Throttle scroll events for 60fps performance
    requestAnimationFrame(() => {
      // Update CSS custom property for scroll-based effects
      document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
      
      // Professional scroll indicators with EyeMotion branding
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      document.documentElement.style.setProperty('--scroll-percent', `${Math.min(100, Math.max(0, scrollPercent))}%`);
      
      // Dynamic scroll performance optimization with proper typing
      const lastScrollY = (window as any).lastScrollY || 0;
      const scrollSpeed = Math.abs(scrollY - lastScrollY);
      (window as any).lastScrollY = scrollY;
      
      // Reduce animations during fast scrolling for performance
      if (scrollSpeed > 10) {
        document.documentElement.classList.add('fast-scroll');
      } else {
        document.documentElement.classList.remove('fast-scroll');
      }
    });
  }, [scrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // EyeMotion Professional Loading with Beautiful Colors and Standard Fonts
  if (isLoading || !fontsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-8 max-w-md mx-auto px-6">
          {/* EyeMotion Beautiful Logo with Professional Typography */}
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center animate-eyemotion-glow relative"
              style={{
                background: 'linear-gradient(135deg, oklch(0.488 0.243 264.376), oklch(0.627 0.265 303.9))'
              }}
            >
              {/* EyeMotion Eye logo - Visual Storytelling Focus */}
              <span 
                className="font-display text-5xl font-black transition-all duration-300"
                style={{ 
                  color: 'oklch(0.75 0.35 195)',
                  textShadow: '0 0 12px oklch(0.75 0.35 195 / 0.4)',
                  filter: 'drop-shadow(0 0 8px oklch(0.75 0.35 195 / 0.6))'
                }}
              >
                ◉
              </span>
              
              {/* Beautiful Enhancement Ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-intent/30 animate-eyemotion-pulse" />
            </div>
            
            {/* Professional Beautiful Spinner - UPGRADED with Electric Cyan! */}
            <div 
              className="absolute inset-0 w-20 h-20 border-3 border-transparent rounded-2xl animate-eyemotion-spin"
              style={{
                borderTopColor: 'oklch(0.488 0.243 264.376)',      /* Intent Blue */
                borderRightColor: 'oklch(0.75 0.35 195)',          /* Experience Cyan - UPGRADED! */
                borderBottomColor: 'oklch(0.769 0.188 70.08)',     /* Story Orange */
                borderLeftColor: 'oklch(0.627 0.265 303.9)'        /* Verification Purple */
              }}
            />
            
            {/* Beautiful Activity Indicators */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-intent rounded-full flex items-center justify-center animate-eyemotion-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* EyeMotion Beautiful Professional Branding */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                EyeMotion
              </h1>
              <span 
                className="font-display text-3xl font-bold tracking-tight"
                style={{ color: 'oklch(0.75 0.35 195)' }}
              >
                AI
              </span>
            </div>
            
            <div className="space-y-3">
              <p className="font-primary text-sm font-medium text-muted-foreground">
                Intent-Aware Visual Storytelling
              </p>
            </div>
          </div>

          {/* Beautiful Loading Status */}
          <div className="text-center space-y-3">
            <p className="font-primary text-sm font-medium text-muted-foreground animate-eyemotion-pulse">
              {language === 'th' 
                ? 'กำลังเตรียมระบบ Professional Film Suite...' 
                : 'Initializing Professional Film Suite...'}
            </p>
            
            {/* Beautiful System Components - UPGRADED with Electric Cyan! */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <div 
                  className="w-3 h-3 rounded-full animate-eyemotion-pulse flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.75 0.35 195)' }} /* Experience Cyan - UPGRADED! */
                >
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <span className="font-primary tracking-normal">
                  {language === 'th' ? 'Intent-Aware Engine' : 'Intent Recognition AI'}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <div 
                  className="w-3 h-3 rounded-full animate-eyemotion-pulse flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'oklch(0.627 0.265 303.9)',
                    animationDelay: '0.5s' 
                  }}
                >
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <span className="font-primary tracking-normal">
                  {language === 'th' ? 'ระบบยืนยันความถูกต้อง' : 'Verification Systems'}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <div 
                  className="w-3 h-3 rounded-full animate-eyemotion-pulse flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'oklch(0.488 0.243 264.376)',
                    animationDelay: '1s' 
                  }}
                >
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <span className="font-primary tracking-normal">
                  {language === 'th' ? 'CineFlow Engine' : 'Professional Processing'}
                </span>
              </div>
            </div>

            {/* Beautiful Progress Indicator - UPGRADED with Electric Cyan! */}
            <div className="mt-4 w-64 h-1 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full animate-eyemotion-pulse"
                style={{
                  background: 'linear-gradient(90deg, var(--intent-blue), var(--experience-cyan), var(--verification-purple))', /* UPGRADED to experience-cyan! */
                  width: '100%',
                  animation: 'loading-progress 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* EyeMotion Beautiful Performance Monitoring */}
      <style>{`
        /* Professional fast-scroll optimization */
        .fast-scroll * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        
        /* EyeMotion beautiful scroll indicators - UPGRADED with Electric Cyan! */
        html::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--intent-blue) 0%,
            var(--experience-cyan) 25%,      /* UPGRADED to Electric Cyan! */
            var(--story-orange) 50%,
            var(--verification-purple) 75%,
            var(--community-coral) 100%
          );
          transform: scaleX(var(--scroll-percent, 0));
          transform-origin: left;
          transition: transform 0.1s ease-out;
          z-index: 9999;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(72, 142, 255, 0.3);
        }
        
        /* Beautiful Loading Animation */
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        
        /* Professional typography enhancement for loaded state */
        body.fonts-loaded {
          font-display: swap;
          font-feature-settings: "liga" 1, "kern" 1;
        }
        
        /* EyeMotion beautiful ecosystem color CSS properties for JavaScript access - UPGRADED! */
        :root {
          --js-intent-blue: oklch(0.488 0.243 264.376);
          --js-experience-cyan: oklch(0.75 0.35 195);       /* UPGRADED to Electric Cyan! */
          --js-experience-teal: oklch(0.75 0.35 195);       /* Legacy alias for compatibility */
          --js-story-orange: oklch(0.769 0.188 70.08);
          --js-verification-purple: oklch(0.627 0.265 303.9);
          --js-community-coral: oklch(0.645 0.246 16.439);
        }
      `}</style>

      <AuthProvider>
        <AppRouter 
          language={language} 
          setLanguage={setLanguage}
          scrollY={scrollY}
        />
      </AuthProvider>
      
      {/* Development-only Supabase Connection Debug Info */}
      <SupabaseConnectionDetails />
    </div>
  );
}
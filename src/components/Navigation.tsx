import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AuthModal } from './AuthModal';
import { SupabaseConnectionStatus, SupabaseConnectionDetails } from './SupabaseConnectionStatus';
import { useAuth } from '../contexts/AuthContext';
import { Progress } from './ui/progress';
import { 
  User, 
  LogOut, 
  Settings, 
  CreditCard, 
  GraduationCap,
  Sparkles,
  Zap,
  Star,
  Crown,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface NavigationProps {
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
}

interface SubscriptionTier {
  icon: React.ReactElement;
  color: string;
  name: string;
}

interface FFZLevel {
  name: string;
  color: string;
}

export function Navigation({ language, setLanguage }: NavigationProps) {
  const { user, userProfile, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const content = {
    th: {
      home: 'หน้าหลัก',
      about: 'เกี่ยวกับ',
      suite: 'Cine Suite™',
      pricing: 'แผนบริการ',
      contact: 'ติดต่อ',
      signIn: 'เข้าสู่ระบบ',
      signUp: 'สมัครสมาชิก',
      dashboard: 'แดชบอร์ด',
      profile: 'โปรไฟล์',
      billing: 'การเรียกเก็บเงิน',
      settings: 'การตั้งค่า',
      signOut: 'ออกจากระบบ',
      ffzLevel: 'ระดับ FFZ',
      credits: 'เครดิต',
      storage: 'พื้นที่จัดเก็บ'
    },
    en: {
      home: 'Home',
      about: 'About',
      suite: 'Cine Suite™',
      pricing: 'Pricing',
      contact: 'Contact',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      dashboard: 'Dashboard',
      profile: 'Profile',
      billing: 'Billing',
      settings: 'Settings',
      signOut: 'Sign Out',
      ffzLevel: 'FFZ Level',
      credits: 'Credits',
      storage: 'Storage'
    }
  };

  const t = content[language];

  const subscriptionTierConfig: Record<string, SubscriptionTier> = {
    freemium: { 
      icon: <Sparkles className="w-4 h-4" />, 
      color: 'bg-experience/20 text-experience border-experience/40',
      name: 'Freemium'
    },
    creator: { 
      icon: <Zap className="w-4 h-4" />, 
      color: 'bg-story/20 text-story border-story/40',
      name: 'Creator'
    },
    pro: { 
      icon: <Star className="w-4 h-4" />, 
      color: 'bg-verification/20 text-verification border-verification/40',
      name: 'Pro'
    },
    studio: { 
      icon: <Crown className="w-4 h-4" />, 
      color: 'bg-intent/20 text-intent border-intent/40',
      name: 'Studio'
    }
  };

  const ffzLevelConfig: Record<number, FFZLevel> = {
    0: { name: 'Experience Capture', color: 'text-experience' },
    1: { name: 'Narrative Structure', color: 'text-story' },
    2: { name: 'Technical Proficiency', color: 'text-verification' },
    3: { name: 'Professional Mastery', color: 'text-intent' }
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const openAuthModal = (tab: 'signin' | 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/about', label: t.about },
    { href: '/suite', label: t.suite },
    { href: '/pricing', label: t.pricing },
    { href: '/contact', label: t.contact }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-4 group">
                <div 
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: 'oklch(0.488 0.243 264.376)'
                  }}
                >
                  {/* Subtle hover gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: 'oklch(0.75 0.35 195)'
                    }}
                  />
                  
                  {/* EyeMotion Eye logo - Visual Storytelling Focus */}
                  <span 
                    className="relative font-display font-black text-3xl z-10 transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      color: 'oklch(0.75 0.35 195)',
                      textShadow: '0 0 8px oklch(0.75 0.35 195 / 0.4)'
                    }}
                  >
                    ◉
                  </span>
                </div>
                
                <div className="flex items-baseline">
                  <span className="font-display font-bold tracking-tight text-lg text-foreground leading-none">
                    EyeMotion
                  </span>
                  <span 
                    className="font-display font-bold text-lg tracking-tight leading-none"
                    style={{ color: 'oklch(0.75 0.35 195)' }}
                  >
                    AI
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-primary font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side - Auth and Language */}
            <div className="flex items-center gap-4">
              {/* Supabase Connection Status - CRITICAL PRODUCTION MONITORING */}
              <SupabaseConnectionStatus />
              
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                className="font-primary font-medium text-muted-foreground hover:text-foreground"
              >
                {language === 'th' ? 'EN' : 'TH'}
              </Button>

              {/* User Authentication */}
              {user && userProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile.avatar_url || undefined} />
                        <AvatarFallback className="bg-intent/20 text-intent font-primary font-medium">
                          {userProfile.full_name?.charAt(0) || userProfile.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="font-primary font-medium text-sm">
                          {userProfile.full_name || 'User'}
                        </span>
                        <div className="flex items-center gap-1">
                          {userProfile.subscription_tier && subscriptionTierConfig[userProfile.subscription_tier] && (
                            <Badge variant="outline" className={`${subscriptionTierConfig[userProfile.subscription_tier].color} h-4 px-1.5 text-xs`}>
                              {subscriptionTierConfig[userProfile.subscription_tier].icon}
                              <span className="ml-1">{subscriptionTierConfig[userProfile.subscription_tier].name}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="hidden lg:block w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-80 bg-background/95 backdrop-blur-xl border border-border/50">
                    <DropdownMenuLabel className="font-primary">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userProfile.avatar_url || undefined} />
                          <AvatarFallback className="bg-intent/20 text-intent font-primary">
                            {userProfile.full_name?.charAt(0) || userProfile.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userProfile.full_name || 'User'}</p>
                          <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    {/* User Stats */}
                    <div className="px-2 py-3 space-y-3">
                      {/* Subscription Tier */}
                      <div className="flex items-center justify-between">
                        <span className="font-primary text-sm text-muted-foreground">Plan</span>
                        {userProfile.subscription_tier && subscriptionTierConfig[userProfile.subscription_tier] && (
                          <Badge variant="outline" className={subscriptionTierConfig[userProfile.subscription_tier].color}>
                            {subscriptionTierConfig[userProfile.subscription_tier].icon}
                            <span className="ml-1">{subscriptionTierConfig[userProfile.subscription_tier].name}</span>
                          </Badge>
                        )}
                      </div>
                      
                      {/* FFZ Level */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-primary text-sm text-muted-foreground">{t.ffzLevel}</span>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                            <span className={`font-primary text-sm font-medium ${ffzLevelConfig[userProfile.ffz_level].color}`}>
                              {userProfile.ffz_level} - {ffzLevelConfig[userProfile.ffz_level].name}
                            </span>
                          </div>
                        </div>
                        <Progress value={(userProfile.ffz_level / 3) * 100} className="h-2" />
                      </div>
                      
                      {/* Credits */}
                      <div className="flex items-center justify-between">
                        <span className="font-primary text-sm text-muted-foreground">{t.credits}</span>
                        <span className="font-primary text-sm font-medium">
                          {userProfile.credits_remaining.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Storage */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-primary text-sm text-muted-foreground">{t.storage}</span>
                          <span className="font-primary text-sm font-medium">
                            {userProfile.storage_used_gb.toFixed(1)}GB
                          </span>
                        </div>
                        <Progress value={(userProfile.storage_used_gb / 50) * 100} className="h-1" />
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2 font-primary">
                        <User className="w-4 h-4" />
                        {t.dashboard}
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center gap-2 font-primary">
                      <Settings className="w-4 h-4" />
                      {t.settings}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center gap-2 font-primary">
                      <CreditCard className="w-4 h-4" />
                      {t.billing}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 font-primary text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.signOut}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal('signin')}
                    className="font-primary font-medium"
                  >
                    {t.signIn}
                  </Button>
                  <Button
                    onClick={() => openAuthModal('signup')}
                    className="bg-intent hover:bg-intent/90 text-white font-primary font-medium"
                  >
                    {t.signUp}
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mobile-menu-container"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mobile-menu-container">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/40 bg-background/95 backdrop-blur-xl">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-3 py-2 font-primary font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {!user && (
                  <>
                    <div className="px-3 py-2">
                      <div className="h-px bg-border/40" />
                    </div>
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="w-full text-left block px-3 py-2 font-primary font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      {t.signIn}
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="w-full text-left block px-3 py-2 font-primary font-medium bg-intent text-white hover:bg-intent/90 rounded-md transition-colors"
                    >
                      {t.signUp}
                    </button>
                  </>
                )}
                
                {user && userProfile && (
                  <>
                    <div className="px-3 py-2">
                      <div className="h-px bg-border/40" />
                    </div>
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userProfile.avatar_url || undefined} />
                          <AvatarFallback className="bg-intent/20 text-intent font-primary">
                            {userProfile.full_name?.charAt(0) || userProfile.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-primary font-medium text-sm">{userProfile.full_name || 'User'}</p>
                          <p className="font-primary text-xs text-muted-foreground">{userProfile.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 font-primary font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.dashboard}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-3 py-2 font-primary font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      {t.signOut}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
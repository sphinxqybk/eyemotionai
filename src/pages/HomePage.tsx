import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { AnimatedFeatureCards } from '../components/AnimatedFeatureCards';
import { Impact } from '../components/Impact';
import { DemoPreview } from '../components/DemoPreview';
import { ComingSoonBadge } from '../components/ComingSoonBadge';
import { AuthModal } from '../components/AuthModal';
import { DemoModeIndicator } from '../components/DemoModeIndicator';
import { EcosystemCallToAction } from '../components/EcosystemCallToAction';
import { RegistrationGuide } from '../components/RegistrationGuide';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Sparkles, 
  Zap, 
  Star, 
  Crown, 
  ArrowRight, 
  Users, 
  Globe, 
  Award,
  Rocket,
  Clock,
  CheckCircle
} from 'lucide-react';

interface HomePageProps {
  language: 'th' | 'en';
}

export function HomePage({ language }: HomePageProps) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signup');

  const content = {
    th: {
      title: 'Adaptive Visual Storytelling Ecosystem',
      subtitle: 'ระบบนิเวศการเล่าเรื่องด้วยภาพที่ปรับตัวได้',
      description: 'รวมประสบการณ์สร้างสรรค์ การศึกษา Film From Zero (FFZ) และเครื่องมือแก้ไขระดับไฮเทค เข้าเป็นระบบเดียวที่ขับเคลื่อนด้วย Intent',
      getStarted: 'เริ่มต้นใช้งาน',
      learnMore: 'เรียนรู้เพิ่มเติม',
      joinEarly: 'เข้าร่วมผู้ใช้รุ่นแรก',
      alreadyMember: 'เป็นสมาชิกแล้ว?',
      signIn: 'เข้าสู่ระบบ',
      dashboard: 'ไปที่แดชบอร์ด',
      features: {
        title: 'ฟีเจอร์ที่กำลังมา',
        subtitle: 'พร้อมเปลี่ยนอนาคตของการเล่าเรื่องด้วยภาพ'
      },
      pricing: {
        title: 'แผนการใช้งาน',
        subtitle: 'เริ่มต้นฟรี อัพเกรดได้ตลอดเวลา',
        freemium: {
          name: 'Freemium',
          price: 'ฟรี',
          description: 'เหมาะสำหรับผู้เริ่มต้น',
          features: ['เครดิต 100', 'พื้นที่เก็บข้อมูล 1GB', 'แก้ไขพื้นฐาน', 'มีลายน้ำ']
        },
        creator: {
          name: 'Creator',
          price: '฿299/เดือน',
          description: 'เหมาะสำหรับผู้สร้างสรรค์อิสระ',
          features: ['เครดิต 1K', 'พื้นที่เก็บข้อมูล 5GB', 'ส่งออก HD', 'AI พื้นฐาน']
        },
        pro: {
          name: 'Pro',
          price: '฿999/เดือน',
          description: 'เครื่องมือระดับมืออาชีพ',
          features: ['เครดิต 5K', 'พื้นที่เก็บข้อมูล 50GB', 'ส่งออก 4K', 'AI ขั้นสูง']
        },
        studio: {
          name: 'Studio',
          price: '฿2,999/เดือน',
          description: 'โซลูชันสตูดิโอครบครัน',
          features: ['เครดิต 20K', 'พื้นที่เก็บข้อมูล 500GB', 'ส่งออกไม่จำกัด', 'AI พรีเมียม']
        }
      },
      earlyAccess: {
        title: '🚀 เข้าร่วมผู้ใช้รุ่นแรก',
        description: 'เป็นคนแรกที่ได้สัมผัสเครื่องมือการเล่าเรื่องด้วยภาพยุคใหม่',
        benefits: [
          'เข้าใช้ฟีเจอร์ใหม่ก่อนใคร',
          'ส่วนลดพิเศษสำหรับผู้ใช้รุ่นแรก',
          'เข้าร่วมชุมชนผู้สร้างสรรค์',
          'รับการสนับสนุนจากทีมพัฒนา'
        ],
        cta: 'สมัครเป็นสมาชิก'
      }
    },
    en: {
      title: 'Adaptive Visual Storytelling Ecosystem',
      subtitle: 'Revolutionizing Film Creation',
      description: 'Merging lived creative experience, Film From Zero (FFZ) educational framework, and high-tech editing tools into a single, intent-driven workflow.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      joinEarly: 'Join Early Access',
      alreadyMember: 'Already a member?',
      signIn: 'Sign In',
      dashboard: 'Go to Dashboard',
      features: {
        title: 'Coming Soon Features',
        subtitle: 'Revolutionary tools that will transform visual storytelling'
      },
      pricing: {
        title: 'Pricing Plans',
        subtitle: 'Start free, upgrade anytime',
        freemium: {
          name: 'Freemium',
          price: 'Free',
          description: 'Perfect for getting started',
          features: ['100 credits', '1GB storage', 'Basic editing', 'Watermark included']
        },
        creator: {
          name: 'Creator',
          price: '฿299/month',
          description: 'Perfect for independent filmmakers',
          features: ['1K credits', '5GB storage', 'HD export', 'Basic AI tools']
        },
        pro: {
          name: 'Pro',
          price: '฿999/month',
          description: 'Professional tools for serious creators',
          features: ['5K credits', '50GB storage', '4K export', 'Advanced AI']
        },
        studio: {
          name: 'Studio',
          price: '฿2,999/month',
          description: 'Complete studio solution',
          features: ['20K credits', '500GB storage', 'Unlimited export', 'Premium AI']
        }
      },
      earlyAccess: {
        title: '🚀 Join Early Access Program',
        description: 'Be among the first to experience the future of visual storytelling',
        benefits: [
          'First access to new features',
          'Exclusive early adopter discounts',
          'Join our creator community',
          'Direct support from our team'
        ],
        cta: 'Sign Up Now'
      }
    }
  };

  const t = content[language];

  const comingSoonFeatures = [
    {
      name: 'CineFlow Auto-Editor',
      description: language === 'th' 
        ? 'AI ที่แก้ไขอัตโนมัติด้วยรูปแบบการเล่าเรื่องทางวัฒนธรรม'
        : 'AI-powered automatic editing with cultural storytelling patterns',
      icon: <Sparkles className="w-6 h-6" />,
      priority: 'high' as const,
      eta: 'Q2 2025',
      color: 'text-intent'
    },
    {
      name: 'Cultural Verification System',
      description: language === 'th' 
        ? 'ระบบยืนยันความถูกต้องทางวัฒนธรรมโดยชุมชน'
        : 'Community-driven authenticity verification for cultural content',
      icon: <Award className="w-6 h-6" />,
      priority: 'high' as const,
      eta: 'Q2 2025',
      color: 'text-verification'
    },
    {
      name: 'FFZ Interactive Modules',
      description: language === 'th' 
        ? 'โมดูลการเรียนรู้แบบมีปฏิสัมพันธ์พร้อมข้อเสนอแนะแบบเรียลไทม์'
        : 'Hands-on learning modules with real-time feedback',
      icon: <Zap className="w-6 h-6" />,
      priority: 'medium' as const,
      eta: 'Q3 2025',
      color: 'text-experience'
    },
    {
      name: 'Mobile Cine Suite',
      description: language === 'th' 
        ? 'ชุดแก้ไขระดับมืออาชีพสำหรับอุปกรณ์มือถือ'
        : 'Full professional editing suite for mobile devices',
      icon: <Rocket className="w-6 h-6" />,
      priority: 'high' as const,
      eta: 'Q4 2025',
      color: 'text-story'
    }
  ];

  const subscriptionTiers = [
    {
      ...t.pricing.freemium,
      tier: 'freemium' as const,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-experience/20 text-experience border-experience/40',
      popular: false
    },
    {
      ...t.pricing.creator,
      tier: 'creator' as const,
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-story/20 text-story border-story/40',
      popular: true
    },
    {
      ...t.pricing.pro,
      tier: 'pro' as const,
      icon: <Star className="w-5 h-5" />,
      color: 'bg-verification/20 text-verification border-verification/40',
      popular: false
    },
    {
      ...t.pricing.studio,
      tier: 'studio' as const,
      icon: <Crown className="w-5 h-5" />,
      color: 'bg-intent/20 text-intent border-intent/40',
      popular: false
    }
  ];

  const openAuthModal = (tab: 'signin' | 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="page-homepage min-h-screen bg-background">
      {/* Hero Section */}
      <Hero language={language} />

      {/* Early Access Alert */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-intent/30 bg-intent/5">
            <Rocket className="h-4 w-4" />
            <AlertDescription className="font-primary">
              <strong>EyeMotion is in development!</strong> {' '}
              {language === 'th' 
                ? 'สมัครสมาชิกเพื่อเข้าใช้งานก่อนใครและได้รับอัพเดตล่าสุด'
                : 'Sign up now to get early access and stay updated on our latest developments'}
              {/* Demo mode indicator - simplified to avoid parsing issues */}
              <DemoModeIndicator language={language} />
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="homepage-display text-gradient-ecosystem mb-4">
              {t.features.title}
            </h2>
            <p className="homepage-body text-muted-foreground max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonFeatures.map((feature, index) => (
              <Card key={index} className="group hover:border-border/60 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-muted/30 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <ComingSoonBadge 
                      feature={feature.name}
                      description={feature.description}
                      priority={feature.priority}
                      estimatedDate={feature.eta}
                      variant="compact"
                    />
                  </div>
                  <CardTitle className="professional-heading">{feature.name}</CardTitle>
                  <CardDescription className="professional-body">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-primary">Expected: {feature.eta}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="homepage-display text-gradient-ecosystem mb-4">
              {t.pricing.title}
            </h2>
            <p className="homepage-body text-muted-foreground">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-intent/50 shadow-lg' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-intent text-white font-primary">
                      {language === 'th' ? 'แนะนำ' : 'Popular'}
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${tier.color}`}>
                      {tier.icon}
                    </div>
                    <Badge variant="outline" className={tier.color}>
                      {tier.name}
                    </Badge>
                  </div>
                  <CardTitle className="professional-heading">{tier.price}</CardTitle>
                  <CardDescription className="professional-body">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 font-primary text-sm">
                        <CheckCircle className="w-4 h-4 text-experience" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="font-primary text-sm text-muted-foreground mb-4">
              {language === 'th' 
                ? 'ราคาทั้งหมดรวมภาษี • ยกเลิกได้ตลอดเวลา • รองรับหลายสกุลเงิน'
                : 'All prices include tax • Cancel anytime • Multiple currency support'}
            </p>
          </div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-intent/30 bg-gradient-to-br from-intent/5 to-verification/5">
            <CardHeader className="text-center">
              <CardTitle className="homepage-display text-gradient-ecosystem">
                {t.earlyAccess.title}
              </CardTitle>
              <CardDescription className="homepage-body text-muted-foreground max-w-2xl mx-auto">
                {t.earlyAccess.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {t.earlyAccess.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-experience flex-shrink-0" />
                    <span className="font-primary">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4">
                {user ? (
                  <div className="space-y-2">
                    <p className="font-primary text-sm text-muted-foreground">
                      {language === 'th' ? 'คุณเป็นสมาชิกแล้ว!' : 'You\'re already a member!'}
                    </p>
                    <Button 
                      asChild
                      className="bg-intent hover:bg-intent/90 text-white font-primary font-medium px-8"
                    >
                      <Link to="/dashboard">
                        {t.dashboard}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => openAuthModal('signup')}
                      className="bg-intent hover:bg-intent/90 text-white font-primary font-medium px-8"
                      size="lg"
                    >
                      {t.earlyAccess.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    
                    <div className="text-center">
                      <button
                        onClick={() => openAuthModal('signin')}
                        className="font-primary text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t.alreadyMember} <span className="text-intent hover:underline">{t.signIn}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Registration Guide - Only show if user is not logged in */}
      {!user && (
        <RegistrationGuide 
          language={language} 
          onSignUp={() => openAuthModal('signup')}
        />
      )}

      {/* Feature Cards */}
      <AnimatedFeatureCards language={language} />

      {/* Demo Preview */}
      <DemoPreview language={language} />

      {/* Ecosystem Call to Action */}
      <EcosystemCallToAction 
        language={language}
        onEnterEcosystem={() => openAuthModal('signup')}
        onEcosystemDemo={() => {
          // Scroll to demo section
          document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Impact Section */}
      <Impact language={language} />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}

// Default export for AppRouter compatibility
export default HomePage;
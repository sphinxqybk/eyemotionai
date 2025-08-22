import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  Gift, 
  Users, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

interface WelcomeMessageProps {
  language: 'th' | 'en';
  userName?: string;
  onGetStarted: () => void;
  onExploreFeatures: () => void;
}

export function WelcomeMessage({ 
  language, 
  userName, 
  onGetStarted, 
  onExploreFeatures 
}: WelcomeMessageProps) {
  const content = {
    th: {
      welcome: userName ? `ยินดีต้อนรับ, ${userName}!` : 'ยินดีต้อนรับสู่ EyeMotion!',
      subtitle: 'คุณได้เป็นส่วนหนึ่งของการปฏิวัติการเล่าเรื่องด้วยภาพแล้ว',
      description: 'บัญชี Freemium ของคุณพร้อมใช้งาน พร้อมด้วยเครื่องมือและทรัพยากรที่จำเป็นเพื่อเริ่มต้นการเดินทาง',
      benefits: [
        { title: 'เครดิตฟรี 100', description: 'พร้อมใช้งานทันที', icon: <Gift className="w-4 h-4 text-experience" /> },
        { title: 'พื้นที่เก็บข้อมูล 1GB', description: 'สำหรับโปรเจกต์แรก', icon: <Sparkles className="w-4 h-4 text-verification" /> },
        { title: 'เข้าถึงชุมชน FFZ', description: 'เรียนรู้จากมืออาชีพ', icon: <Users className="w-4 h-4 text-community" /> },
        { title: 'คู่มือ Film From Zero', description: 'เริ่มต้นจากระดับ 0', icon: <BookOpen className="w-4 h-4 text-story" /> }
      ],
      nextSteps: {
        title: 'ขั้นตอนถัดไป',
        steps: [
          'สำรวจ Dashboard และเครื่องมือพื้นฐาน',
          'ลองสร้างโปรเจกต์แรกของคุณ',
          'เข้าร่วมชุมชน FFZ และเรียนรู้',
          'อัพเกรดเมื่อพร้อมสำหรับฟีเจอร์เพิ่มเติม'
        ]
      },
      actions: {
        getStarted: 'เริ่มใช้งาน Dashboard',
        exploreFeatures: 'สำรวจฟีเจอร์'
      },
      tip: 'เคล็ดลับ: เริ่มต้นด้วยการเรียนรู้ FFZ Level 0 เพื่อสร้างพื้นฐานที่แข็งแกร่ง'
    },
    en: {
      welcome: userName ? `Welcome, ${userName}!` : 'Welcome to EyeMotion!',
      subtitle: 'You\'re now part of the visual storytelling revolution',
      description: 'Your Freemium account is ready with all the tools and resources you need to start your journey',
      benefits: [
        { title: '100 Free Credits', description: 'Ready to use', icon: <Gift className="w-4 h-4 text-experience" /> },
        { title: '1GB Storage', description: 'For your first projects', icon: <Sparkles className="w-4 h-4 text-verification" /> },
        { title: 'FFZ Community Access', description: 'Learn from pros', icon: <Users className="w-4 h-4 text-community" /> },
        { title: 'Film From Zero Guide', description: 'Start from level 0', icon: <BookOpen className="w-4 h-4 text-story" /> }
      ],
      nextSteps: {
        title: 'Next Steps',
        steps: [
          'Explore Dashboard and basic tools',
          'Try creating your first project',
          'Join FFZ community and learn',
          'Upgrade when ready for more features'
        ]
      },
      actions: {
        getStarted: 'Go to Dashboard',
        exploreFeatures: 'Explore Features'
      },
      tip: 'Tip: Start with FFZ Level 0 learning to build a strong foundation'
    }
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-intent/30 bg-gradient-to-br from-intent/10 to-experience/10">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-experience/20">
                <CheckCircle className="w-8 h-8 text-experience" />
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="homepage-display text-gradient-ecosystem mb-2">
                {t.welcome}
              </CardTitle>
              <CardDescription className="homepage-body text-muted-foreground">
                {t.subtitle}
              </CardDescription>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="professional-body text-muted-foreground/80 mt-2"
            >
              {t.description}
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {t.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30"
                  >
                    <div className="p-2 rounded-lg bg-muted/30 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="professional-body font-medium text-sm">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground font-primary">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-3"
            >
              <h3 className="professional-heading text-center">{t.nextSteps.title}</h3>
              <div className="space-y-2">
                {t.nextSteps.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Badge variant="outline" className="bg-experience/20 text-experience border-experience/40 w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-primary text-sm">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                onClick={onGetStarted}
                className="flex-1 bg-intent hover:bg-intent/90 text-white font-primary font-medium"
                size="lg"
              >
                <Sparkles className="mr-2 w-4 h-4" />
                {t.actions.getStarted}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={onExploreFeatures}
                variant="outline"
                className="flex-1 border-experience/40 text-experience hover:bg-experience/10 font-primary font-medium"
                size="lg"
              >
                <Zap className="mr-2 w-4 h-4" />
                {t.actions.exploreFeatures}
              </Button>
            </motion.div>

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-center pt-4 border-t border-border/50"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-story/10 border border-story/30 rounded-full">
                <Sparkles className="w-4 h-4 text-story" />
                <span className="font-primary text-sm text-story">
                  {t.tip}
                </span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
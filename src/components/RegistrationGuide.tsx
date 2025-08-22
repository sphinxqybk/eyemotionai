import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  UserPlus, 
  Mail, 
  CheckCircle, 
  Sparkles, 
  Zap,
  ArrowRight,
  Gift,
  Shield,
  Users
} from 'lucide-react';

interface RegistrationGuideProps {
  language: 'th' | 'en';
  onSignUp: () => void;
}

export function RegistrationGuide({ language, onSignUp }: RegistrationGuideProps) {
  const content = {
    th: {
      title: 'วิธีการสมัครสมาชิก EyeMotion',
      subtitle: 'เริ่มต้นการเดินทางสู่การเล่าเรื่องด้วยภาพระดับมืออาชีพ',
      steps: [
        {
          title: 'กรอกข้อมูลพื้นฐาน',
          description: 'ใช้อีเมลจริงเพื่อรับการยืนยันและอัพเดตสำคัญ',
          icon: <UserPlus className="w-5 h-5" />
        },
        {
          title: 'ยืนยันอีเมล',
          description: 'ตรวจสอบกล่องจดหมายเพื่อยืนยันบัญชี (อาจอยู่ใน Spam)',
          icon: <Mail className="w-5 h-5" />
        },
        {
          title: 'เริ่มใช้งานทันที',
          description: 'เข้าสู่แดชบอร์ดและสำรวจเครื่องมือระดับมืออาชีพ',
          icon: <CheckCircle className="w-5 h-5" />
        }
      ],
      benefits: {
        title: 'สิทธิประโยชน์ที่จะได้รับ',
        list: [
          { title: 'เครดิตฟรี 100', description: 'สำหรับทดลองใช้ฟีเจอร์พื้นฐาน', icon: <Gift className="w-4 h-4 text-experience" /> },
          { title: 'พื้นที่เก็บข้อมูล 1GB', description: 'เก็บโปรเจกต์และไฟล์ได้', icon: <Shield className="w-4 h-4 text-verification" /> },
          { title: 'เข้าถึงชุมชน FFZ', description: 'เรียนรู้และแลกเปลี่ยนประสบการณ์', icon: <Users className="w-4 h-4 text-community" /> }
        ]
      },
      cta: 'เริ่มสมัครเลย',
      note: 'สมัครฟรี • ไม่ต้องใส่บัตรเครดิต • อัพเกรดได้ตลอดเวลา'
    },
    en: {
      title: 'How to Register for EyeMotion',
      subtitle: 'Start your journey to professional visual storytelling',
      steps: [
        {
          title: 'Fill Basic Information',
          description: 'Use a real email to receive verification and important updates',
          icon: <UserPlus className="w-5 h-5" />
        },
        {
          title: 'Verify Email',
          description: 'Check your inbox to confirm your account (may be in Spam folder)',
          icon: <Mail className="w-5 h-5" />
        },
        {
          title: 'Start Immediately',
          description: 'Access your dashboard and explore professional tools',
          icon: <CheckCircle className="w-5 h-5" />
        }
      ],
      benefits: {
        title: 'Benefits You\'ll Receive',
        list: [
          { title: '100 Free Credits', description: 'Try basic features', icon: <Gift className="w-4 h-4 text-experience" /> },
          { title: '1GB Storage', description: 'Store projects and files', icon: <Shield className="w-4 h-4 text-verification" /> },
          { title: 'FFZ Community Access', description: 'Learn and share experiences', icon: <Users className="w-4 h-4 text-community" /> }
        ]
      },
      cta: 'Sign Up Now',
      note: 'Free to join • No credit card required • Upgrade anytime'
    }
  };

  const t = content[language];

  return (
    <section className="py-16 px-4 bg-muted/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="homepage-display text-gradient-experience mb-4"
          >
            {t.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="homepage-body text-muted-foreground"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Registration Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {t.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative group hover:border-experience/40 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-experience/20 text-experience">
                      {step.icon}
                    </div>
                    <Badge variant="outline" className="bg-experience/10 text-experience border-experience/40">
                      {language === 'th' ? `ขั้นที่ ${index + 1}` : `Step ${index + 1}`}
                    </Badge>
                  </div>
                  <CardTitle className="professional-heading">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="professional-body">
                    {step.description}
                  </CardDescription>
                </CardContent>
                
                {/* Arrow for next step (except last) */}
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2 bg-background border border-border rounded-full shadow-sm">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="border-intent/30 bg-gradient-to-br from-intent/5 to-verification/5">
            <CardHeader className="text-center">
              <CardTitle className="professional-heading text-gradient-ecosystem">
                {t.benefits.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {t.benefits.list.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted/30 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="professional-body font-medium mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground font-primary">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center space-y-4">
                <Button
                  onClick={onSignUp}
                  className="bg-intent hover:bg-intent/90 text-white font-primary font-medium px-8"
                  size="lg"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  {t.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <p className="text-xs text-muted-foreground font-primary">
                  {t.note}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-experience/10 border border-experience/30 rounded-full">
            <Zap className="w-4 h-4 text-experience" />
            <span className="font-primary text-sm text-experience">
              {language === 'th' 
                ? 'เข้าใช้งานได้ทันทีหลังสมัคร • ไม่ต้องรอการอนุมัติ'
                : 'Instant access after registration • No approval required'
              }
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
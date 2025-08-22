import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Sparkles,
  ArrowRight,
  Globe,
  Crown,
  Heart
} from 'lucide-react';

interface Props {
  language: 'th' | 'en';
}

export const Pricing: React.FC<Props> = ({ language }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const content = {
    th: {
      title: "เลือกแผนที่เหมาะกับคุณ",
      subtitle: "ราคาที่ปรับตามความสามารถทางเศรษฐกิจของแต่ละประเทศ เพื่อให้ทุกคนเข้าถึงได้",
      monthlyLabel: "รายเดือน",
      yearlyLabel: "รายปี",
      saveLabel: "ประหยัด 20%",
      
      plans: [
        {
          name: "Explorer",
          price: { monthly: 0, yearly: 0 },
          description: "เริ่มต้นสำรวจการสร้างภาพยนต์",
          features: [
            "50 เครดิต AI ต่อเดือน",
            "1GB พื้นที่จัดเก็บ",
            "เข้าถึง FFZ Level 0",
            "เครื่องมือพื้นฐาน",
            "ชุมชนออนไลน์"
          ],
          popular: false,
          cta: "เริ่มฟรี"
        },
        {
          name: "Creator",
          price: { monthly: 19, yearly: 152 },
          description: "สำหรับนักสร้างสรรค์ที่จริงจัง",
          features: [
            "1,000 เครดิต AI ต่อเดือน",
            "100GB พื้นที่จัดเก็บ",
            "เข้าถึง FFZ ทุกระดับ",
            "เครื่องมือขั้นสูงทั้งหมด",
            "การยืนยันผลงาน",
            "ลำดับความสำคัญในการสนับสนุน",
            "การส่งออกความละเอียดสูง"
          ],
          popular: true,
          cta: "เริ่มใช้งาน"
        },
        {
          name: "Professional",
          price: { monthly: 59, yearly: 472 },
          description: "สำหรับมืออาชีพและทีมเล็กๆ",
          features: [
            "5,000 เครดิต AI ต่อเดือน",
            "1TB พื้นที่จัดเก็บ",
            "เครื่องมือโปรขั้นสูง",
            "การทำงานร่วมกันของทีม",
            "API เข้าถึง",
            "การสนับสนุนเฉพาะบุคคล",
            "การฝึกอบรม AI แบบกำหนดเอง"
          ],
          popular: false,
          cta: "อัปเกรด"
        },
        {
          name: "Studio",
          price: { monthly: 199, yearly: 1592 },
          description: "สำหรับสตูดิโอและองค์กรขนาดใหญ่",
          features: [
            "25,000 เครดิต AI ต่อเดือน",
            "10TB พื้นที่จัดเก็บ",
            "ทีมไม่จำกัด",
            "การจัดการผู้ใช้ขั้นสูง",
            "SLA 99.9%",
            "การสนับสนุนเฉพาะทีม",
            "การปรับแต่งแบรนด์"
          ],
          popular: false,
          cta: "ติดต่อเรา"
        }
      ],
      
      faq: {
        title: "คำถามที่พบบ่อย",
        items: [
          {
            q: "เครดิต AI คืออะไร?",
            a: "เครดิต AI ใช้สำหรับการประมวลผล AI เช่น การตัดต่ออัตโนมัติ การสร้างภาพ และการวิเคราะห์เนื้อหา"
          },
          {
            q: "สามารถเปลี่ยนแผนได้หรือไม่?",
            a: "ได้ครับ คุณสามารถอัปเกรดหรือดาวน์เกรดแผนได้ตลอดเวลา"
          },
          {
            q: "มีการคืนเงินหรือไม่?",
            a: "เรามีนโยบายคืนเงิน 30 วันสำหรับแผนที่เสียค่าใช้จ่าย"
          }
        ]
      }
    },
    en: {
      title: "Choose Your Creative Journey",
      subtitle: "Adaptive pricing designed for global accessibility - empowering creators everywhere",
      monthlyLabel: "Monthly",
      yearlyLabel: "Yearly",
      saveLabel: "Save 20%",
      
      plans: [
        {
          name: "Explorer",
          price: { monthly: 0, yearly: 0 },
          description: "Start your filmmaking journey",
          features: [
            "50 AI credits per month",
            "1GB storage",
            "FFZ Level 0 access",
            "Basic editing tools",
            "Community access"
          ],
          popular: false,
          cta: "Start Free"
        },
        {
          name: "Creator",
          price: { monthly: 19, yearly: 152 },
          description: "For serious content creators",
          features: [
            "1,000 AI credits per month",
            "100GB storage",
            "Full FFZ framework access",
            "Advanced editing suite",
            "Content verification",
            "Priority support",
            "HD export capabilities"
          ],
          popular: true,
          cta: "Get Started"
        },
        {
          name: "Professional",
          price: { monthly: 59, yearly: 472 },
          description: "For professionals and small teams",
          features: [
            "5,000 AI credits per month",
            "1TB storage",
            "Pro-grade tools",
            "Team collaboration",
            "API access",
            "Personal support",
            "Custom AI training"
          ],
          popular: false,
          cta: "Upgrade Now"
        },
        {
          name: "Studio",
          price: { monthly: 199, yearly: 1592 },
          description: "For studios and large organizations",
          features: [
            "25,000 AI credits per month",
            "10TB storage",
            "Unlimited team members",
            "Advanced user management",
            "99.9% SLA",
            "Dedicated support",
            "White-label options"
          ],
          popular: false,
          cta: "Contact Sales"
        }
      ],
      
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            q: "What are AI credits?",
            a: "AI credits are used for AI processing tasks like auto-editing, image generation, and content analysis."
          },
          {
            q: "Can I change my plan?",
            a: "Yes, you can upgrade or downgrade your plan at any time with prorated billing."
          },
          {
            q: "Is there a refund policy?",
            a: "We offer a 30-day money-back guarantee for all paid plans."
          }
        ]
      }
    }
  };

  const t = content[language];

  return (
    <div className="page-professional min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="professional-body bg-chart-1/15 text-chart-1 border-chart-1/20 px-4 py-2 mb-6 gap-2">
              <Star className="h-4 w-4" />
              {language === 'th' ? 'ราคาพิเศษ' : 'Special Pricing'}
            </Badge>
            
            <h1 className="professional-hero text-foreground mb-6 tracking-tight">
              {t.title}
            </h1>
            
            <p className="professional-body text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              {t.subtitle}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`professional-body ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t.monthlyLabel}
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-chart-1"
              />
              <span className={`professional-body ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {t.yearlyLabel}
              </span>
              {isAnnual && (
                <Badge className="bg-chart-2/15 text-chart-2 border-chart-2/20 text-sm font-semibold">
                  {t.saveLabel}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {t.plans.map((plan, index) => {
            const price = isAnnual ? plan.price.yearly : plan.price.monthly;
            const monthlyPrice = isAnnual ? Math.round(plan.price.yearly / 12) : plan.price.monthly;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-chart-1 text-white px-4 py-1 gap-2">
                      <Crown className="h-3 w-3" />
                      {language === 'th' ? 'แนะนำ' : 'Popular'}
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-chart-1/50 shadow-lg' : 'border-border'} hover:border-border/60 transition-all`}>
                  <CardHeader className="text-center pb-8">
                    <div className="professional-heading text-foreground mb-2">
                      {plan.name}
                    </div>
                    <div className="professional-body text-muted-foreground mb-6">
                      {plan.description}
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          ${price === 0 ? '0' : monthlyPrice}
                        </span>
                        {price > 0 && (
                          <span className="professional-body text-muted-foreground">
                            /{language === 'th' ? 'เดือน' : 'month'}
                          </span>
                        )}
                      </div>
                      {isAnnual && price > 0 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          ${price} {language === 'th' ? 'ต่อปี' : 'billed annually'}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-chart-1 hover:bg-chart-1/90 text-white' : 'bg-secondary hover:bg-secondary/80'} gap-2`}
                      size="default"
                    >
                      {plan.name === 'Studio' ? <Users className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-20"
        >
          <h2 className="professional-display text-foreground mb-8">
            {language === 'th' ? 'ทุกแผนรวม' : 'All Plans Include'}
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: language === 'th' ? 'ความปลอดภัย SSL' : 'SSL Security' },
              { icon: Globe, text: language === 'th' ? 'เข้าถึงทั่วโลก' : 'Global Access' },
              { icon: Sparkles, text: language === 'th' ? 'อัปเดตฟรี' : 'Free Updates' },
              { icon: Heart, text: language === 'th' ? 'สนับสนุน 24/7' : '24/7 Support' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4">
                <item.icon className="h-5 w-5 text-chart-1" />
                <span className="professional-body text-muted-foreground">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator className="bg-border my-16" />

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="professional-display text-foreground text-center mb-12">
            {t.faq.title}
          </h2>
          
          <div className="space-y-6">
            {t.faq.items.map((item, index) => (
              <Card key={index} className="bg-secondary/30 border-border">
                <CardContent className="p-6">
                  <h3 className="professional-heading text-foreground mb-3">
                    {item.q}
                  </h3>
                  <p className="professional-body text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
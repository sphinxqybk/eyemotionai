import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Shield, Link, Award, Users } from 'lucide-react';
import { VERIFICATION_SYSTEMS, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const VerificationSystems: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mb-20"
    >
      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-gradient-to-r from-chart-4/10 to-chart-5/10 p-8 border-b border-border">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.627 0.265 303.9 / 0.15)' }}
            >
              <Shield 
                className="h-6 w-6" 
                style={{ color: 'oklch(0.627 0.265 303.9)' }}
              />
            </div>
            <div>
              <h2 className="text-2xl text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {t.verificationTitle}
              </h2>
              <p className="text-muted-foreground">{t.verificationSubtitle}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          {/* Verification Systems Grid */}
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 mb-12">
            {VERIFICATION_SYSTEMS.map((system, index) => {
              const IconComponent = system.icon;
              return (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-secondary/20 border-border h-full hover:border-border/60 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div 
                          className="h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${system.color} / 0.15` }}
                        >
                          <IconComponent 
                            className="h-8 w-8" 
                            style={{ color: system.color }}
                          />
                        </div>
                        <h3 className="text-lg text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          {system.name[language]}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {system.description[language]}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {system.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded bg-background/50">
                            <div 
                              className="h-2 w-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: system.color }}
                            ></div>
                            <span className="text-xs text-muted-foreground">
                              {feature[language]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Separator className="bg-border my-12" />

          {/* Verification Process Flow */}
          <div className="mb-12">
            <h3 className="text-xl text-foreground mb-6 text-center" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {language === 'th' ? 'กระบวนการยืนยัน' : 'Verification Process'}
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-1/15 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm text-chart-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>1</span>
                </div>
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'สร้างเนื้อหา' : 'Content Creation'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'สร้างจากประสบการณ์จริง' : 'Create from lived experience'}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-2/15 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm text-chart-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>2</span>
                </div>
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'การประเมิน AI' : 'AI Assessment'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'ตรวจสอบความเป็นแท้' : 'Authenticity checking'}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-3/15 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm text-chart-3" style={{ fontWeight: 'var(--font-weight-medium)' }}>3</span>
                </div>
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'การรับรองชุมชน' : 'Community Review'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'การตรวจสอบจากชุมชน' : 'Community validation'}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-4/15 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm text-chart-4" style={{ fontWeight: 'var(--font-weight-medium)' }}>4</span>
                </div>
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'การยืนยันแล้ว' : 'Verified'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'ได้รับการรับรอง' : 'Authenticity certified'}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Technologies */}
          <div className="mb-12">
            <h3 className="text-xl text-foreground mb-6 text-center" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {language === 'th' ? 'เทคโนโลยีการยืนยัน' : 'Verification Technologies'}
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 bg-secondary/20 rounded-lg">
                <Link className="h-8 w-8 text-chart-1 mx-auto mb-3" />
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'บล็อกเชน' : 'Blockchain'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'การติดตามแหล่งที่มาที่ปลอดภัย' : 'Secure provenance tracking'}
                </p>
              </div>
              <div className="text-center p-6 bg-secondary/20 rounded-lg">
                <Award className="h-8 w-8 text-chart-2 mx-auto mb-3" />
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'AI ยืนยัน' : 'AI Verification'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'การตรวจสอบความเป็นแท้อัตโนมัติ' : 'Automated authenticity detection'}
                </p>
              </div>
              <div className="text-center p-6 bg-secondary/20 rounded-lg">
                <Users className="h-8 w-8 text-chart-3 mx-auto mb-3" />
                <h4 className="text-sm text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'การรับรองชุมชน' : 'Community Consensus'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'th' ? 'การตรวจสอบจากผู้เชี่ยวชาญ' : 'Expert community validation'}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Statistics */}
          <div className="text-center">
            <h3 className="text-xl text-foreground mb-6" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {language === 'th' ? 'สถิติการยืนยัน' : 'Verification Statistics'}
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl text-chart-1 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>150,000+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'เรื่องราวที่ยืนยันแล้ว' : 'Verified Stories'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-chart-2 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>99.2%</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'ความแม่นยำ' : 'Accuracy Rate'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-chart-3 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>500+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'ชุมชนผู้ตรวจสอบ' : 'Verification Communities'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-chart-4 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>24/7</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'การยืนยันอัตโนมัติ' : 'Automated Verification'}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-chart-2/10 border border-chart-2/20 rounded-lg">
              <Shield className="h-5 w-5 text-chart-2" />
              <div className="text-sm">
                <div className="text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                  {language === 'th' ? 'ได้รับการรับรองความปลอดภัย' : 'Security Certified'}
                </div>
                <div className="text-muted-foreground text-xs">
                  {language === 'th' 
                    ? 'การยืนยันตามมาตรฐานสากล ISO 27001'
                    : 'ISO 27001 compliant verification standards'
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  FileText,
  Users,
  Target,
  Award
} from 'lucide-react';
import { GRANT_CATEGORIES, APPLICATION_PROCESS, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const GrantApplication: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-20"
    >
      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-gradient-to-r from-chart-2/10 to-chart-1/10 p-8 border-b border-border">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.696 0.17 162.48 / 0.15)' }}
            >
              <DollarSign 
                className="h-6 w-6" 
                style={{ color: 'oklch(0.696 0.17 162.48)' }}
              />
            </div>
            <div>
              <h2 className="text-2xl text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {t.grantsTitle}
              </h2>
              <p className="text-muted-foreground">{t.grantsSubtitle}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          {/* Grant Categories */}
          <div className="mb-12">
            <h3 className="text-xl text-foreground mb-6" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {language === 'th' ? 'ประเภททุนที่ให้การสนับสนุน' : 'Grant Categories'}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {GRANT_CATEGORIES.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-secondary/30 border-border hover:border-border/60 transition-colors h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div 
                            className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${category.color} / 0.15` }}
                          >
                            <IconComponent 
                              className="h-5 w-5" 
                              style={{ color: category.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg text-foreground mb-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                              {category.name[language]}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className="text-xs mb-3"
                              style={{
                                backgroundColor: `${category.color} / 0.15`,
                                color: category.color,
                                borderColor: `${category.color} / 0.3`
                              }}
                            >
                              {category.range[language]}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {category.description[language]}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {category.recipients[language]}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-border hover:bg-secondary/50 text-xs"
                          >
                            {language === 'th' ? 'สมัคร' : 'Apply'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border my-12" />

          {/* Application Process */}
          <div className="mb-12">
            <h3 className="text-xl text-foreground mb-6" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {t.applicationProcessTitle}
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {APPLICATION_PROCESS.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="bg-secondary/20 border-border h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-chart-1/15 flex items-center justify-center">
                          <span className="text-sm text-chart-1" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            {index + 1}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-chart-3/15 text-chart-3 text-xs">
                          {step.duration[language]}
                        </Badge>
                      </div>
                      
                      <h4 className="text-lg text-foreground mb-3" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {step.name[language]}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {step.description[language]}
                      </p>

                      <div className="space-y-2">
                        {step.requirements.map((req, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 mt-1 text-chart-2 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {req[language]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connection Arrow */}
                  {index < APPLICATION_PROCESS.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-chart-1" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <Separator className="bg-border my-12" />

          {/* Application Statistics */}
          <div className="text-center mb-8">
            <h3 className="text-xl text-foreground mb-6" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {language === 'th' ? 'สถิติการให้ทุน FFZ' : 'FFZ Grant Statistics'}
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl text-chart-1 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>$2.5M+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'ทุนที่แจกจ่าย' : 'Total Distributed'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-chart-2 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>3,650+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'ผู้รับทุน FFZ' : 'FFZ Grant Recipients'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-chart-3 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>85%</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'อัตราความสำเร็จ' : 'Success Rate'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-chart-4 mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>95</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'th' ? 'ประเทศ' : 'Countries'}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button className="bg-chart-1 hover:bg-chart-1/90 text-white gap-2 px-8" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              <FileText className="h-4 w-4" />
              {t.applyForGrant}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              {language === 'th' 
                ? 'การสมัครเปิดรับตลอดปี • ระยะเวลาพิจารณา 7-8 สัปดาห์ • รองรับ FFZ framework'
                : 'Applications open year-round • Review process takes 7-8 weeks • FFZ framework supported'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ArrowRight, CheckCircle, Play, Users } from 'lucide-react';
import { FFZ_LEVELS, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const FFZFramework: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-20"
    >
      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-gradient-to-r from-chart-2/10 to-chart-3/10 p-8 border-b border-border">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
              {t.ffzTitle}
            </h2>
            <p className="text-base md:text-lg font-semibold text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.ffzSubtitle}</p>
          </div>
        </div>

        <CardContent className="p-8">
          {/* FFZ Philosophy */}
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              {language === 'th' ? 'ปรัชญา FFZ' : 'FFZ Philosophy'}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-1/15 flex items-center justify-center mx-auto mb-3">
                  <Play className="h-6 w-6 text-chart-1" />
                </div>
                <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {language === 'th' ? 'เริ่มได้ทุกที่' : 'Start Anywhere'}
                </h4>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  {language === 'th' ? 'ไม่มีเงื่อนไข' : 'No prerequisites'}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-2/15 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-chart-2" />
                </div>
                <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {language === 'th' ? 'ประสบการณ์จริง' : 'Lived Experience'}
                </h4>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  {language === 'th' ? 'เชื่อมต่อชีวิตจริง' : 'Connect to real life'}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-3/15 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-chart-3" />
                </div>
                <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {language === 'th' ? 'การพัฒนาแบบก้าวหน้า' : 'Progressive Growth'}
                </h4>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  {language === 'th' ? 'ทีละขั้นตอน' : 'Step by step'}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-chart-4/15 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-chart-4" />
                </div>
                <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {language === 'th' ? 'ชุมชนการเรียนรู้' : 'Community Learning'}
                </h4>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  {language === 'th' ? 'เรียนรู้ร่วมกัน' : 'Learn together'}
                </p>
              </div>
            </div>
          </div>

          {/* FFZ Levels */}
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6 text-center">
              {language === 'th' ? 'ระดับความสามารถ FFZ' : 'FFZ Competency Levels'}
            </h3>
            <div className="space-y-6">
              {FFZ_LEVELS.map((level, index) => {
                const IconComponent = level.icon;
                const progressValue = (index + 1) * 25;
                
                return (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-secondary/30 border-border hover:border-border/60 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Level Icon & Progress */}
                          <div className="flex-shrink-0">
                            <div 
                              className="h-16 w-16 rounded-full flex items-center justify-center mb-3"
                              style={{ backgroundColor: `${level.color} / 0.15` }}
                            >
                              <IconComponent 
                                className="h-8 w-8" 
                                style={{ color: level.color }}
                              />
                            </div>
                            <div className="w-16">
                              <Progress 
                                value={progressValue} 
                                className="h-2"
                                style={{ 
                                  backgroundColor: `${level.color} / 0.2`,
                                }}
                              />
                              <div className="text-center mt-1">
                                <span 
                                  className="text-xs font-semibold"
                                  style={{ color: level.color }}
                                >
                                  {progressValue}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Level Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="text-lg md:text-xl font-semibold text-foreground">
                                {level.name[language]}
                              </h4>
                              <Badge 
                                variant="secondary"
                                style={{
                                  backgroundColor: `${level.color} / 0.15`,
                                  color: level.color,
                                  borderColor: `${level.color} / 0.3`
                                }}
                                className="text-xs font-semibold"
                              >
                                {language === 'th' ? 'ระดับ' : 'Level'} {index}
                              </Badge>
                            </div>

                            <p className="text-sm md:text-base font-medium text-muted-foreground mb-4 leading-relaxed">
                              {level.description[language]}
                            </p>

                            {/* Skills Grid */}
                            <div className="grid gap-2 md:grid-cols-2">
                              {level.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 mt-0.5 text-chart-2 flex-shrink-0" />
                                  <span className="text-xs md:text-sm font-medium text-muted-foreground">
                                    {skill[language]}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Action Button */}
                            <div className="mt-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-border hover:bg-secondary/50 text-xs md:text-sm gap-2 font-semibold"
                              >
                                {language === 'th' 
                                  ? index === 0 ? 'เริ่มต้นที่นี่' : 'ดูรายละเอียด'
                                  : index === 0 ? 'Start Here' : 'Learn More'
                                }
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Connection Line */}
                        {index < FFZ_LEVELS.length - 1 && (
                          <div className="flex justify-center mt-6">
                            <div className="w-px h-8 bg-border"></div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground bg-background -ml-2 -mr-2" />
                            <div className="w-px h-8 bg-border"></div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border my-12" />

          {/* FFZ Statistics */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
              {language === 'th' ? 'สถิติ FFZ ทั่วโลก' : 'Global FFZ Statistics'}
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-chart-1 mb-2">25,000+</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {language === 'th' ? 'ผู้เรียน FFZ' : 'FFZ Learners'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-chart-2 mb-2">85%</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {language === 'th' ? 'อัตราสำเร็จ' : 'Completion Rate'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-chart-3 mb-2">150+</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {language === 'th' ? 'ภาษาที่สนับสนุน' : 'Languages Supported'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-chart-4 mb-2">95</div>
                <div className="text-sm md:text-base font-medium text-muted-foreground">
                  {language === 'th' ? 'ประเทศ' : 'Countries'}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button className="bg-chart-2 hover:bg-chart-2/90 text-white gap-2 px-8 text-sm font-semibold">
              <Play className="h-4 w-4" />
              {t.startFFZJourney}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs md:text-sm font-medium text-muted-foreground mt-4">
              {language === 'th' 
                ? 'เริ่มต้นฟรี • ไม่ต้องมีประสบการณ์ • เรียนรู้ตามความสามารถ'
                : 'Start free • No experience required • Learn at your own pace'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
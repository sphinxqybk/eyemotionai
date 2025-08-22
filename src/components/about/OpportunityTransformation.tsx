import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { ArrowRight } from 'lucide-react';
import { OPPORTUNITY_TRANSFORMATION, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const OpportunityTransformation: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mb-20"
    >
      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-gradient-to-r from-chart-3/10 to-chart-4/10 p-8 border-b border-border">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-foreground mb-2">{t.opportunityTitle}</h2>
            <p className="text-muted-foreground">{t.opportunitySubtitle}</p>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {OPPORTUNITY_TRANSFORMATION.map((transformation, index) => {
              const IconComponent = transformation.icon;
              return (
                <motion.div
                  key={transformation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 p-6 rounded-lg bg-secondary/20">
                    {/* Barrier Side */}
                    <div className="flex-1 text-center">
                      <div className="text-sm text-muted-foreground font-medium mb-2">
                        {language === 'th' ? 'อุปสรรค' : 'Barrier'}
                      </div>
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          {transformation.barrier[language]}
                        </h4>
                        <div className="h-8 w-8 mx-auto bg-destructive/20 rounded-lg flex items-center justify-center">
                          <div className="h-2 w-2 bg-destructive rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Transformation Arrow */}
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${transformation.color} / 0.15` }}
                      >
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: transformation.color }}
                        />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Opportunity Side */}
                    <div className="flex-1 text-center">
                      <div className="text-sm text-muted-foreground font-medium mb-2">
                        {language === 'th' ? 'โอกาส' : 'Opportunity'}
                      </div>
                      <div 
                        className="p-4 rounded-lg border"
                        style={{ 
                          backgroundColor: `${transformation.color} / 0.1`,
                          borderColor: `${transformation.color} / 0.3`
                        }}
                      >
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          {transformation.opportunity[language]}
                        </h4>
                        <div 
                          className="h-8 w-8 mx-auto rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${transformation.color} / 0.2` }}
                        >
                          <div 
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: transformation.color }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {transformation.description[language]}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="mt-12 text-center p-6 bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-lg border border-border">
            <h3 className="text-lg font-medium text-foreground mb-4">
              {language === 'th' 
                ? 'การเปลี่ยนแปลงอย่างเป็นระบบ' 
                : 'Systematic Transformation'
              }
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {language === 'th' 
                ? 'เราไม่ได้แค่สร้างเครื่องมือใหม่ เราสร้างระบบที่เปลี่ยนอุปสรรคทุกอย่างในการสร้างภาพยนตร์ให้เป็นโอกาสที่เข้าถึงได้ ให้ผู้สร้างสรรค์มุ่งเน้นไปที่การคิดและสร้างสรรค์ผลงาน'
                : 'We don\'t just create new tools—we build systems that transform every barrier in filmmaking into accessible opportunities, allowing creators to focus entirely on thinking and creating.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
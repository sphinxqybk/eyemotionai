import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Heart, Users, Target, Globe, Leaf } from 'lucide-react';
import { ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const CoreValues: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  // Fallback core values if not defined in data
  const defaultCoreValues = [
    {
      title: language === 'th' ? 'ประสบการณ์ชีวิตจริง' : 'Lived Experience Integration',
      description: language === 'th' 
        ? 'เครื่องมือที่ปรับตัวกับประสบการณ์และวัฒนธรรมของผู้สร้างสรรค์แต่ละคน'
        : 'Tools that adapt to each creator\'s unique experiences and cultural background',
      icon: Heart,
      color: 'oklch(0.696 0.17 162.48)'
    },
    {
      title: language === 'th' ? 'การศึกษาแบบก้าวหน้า' : 'Progressive Education', 
      description: language === 'th'
        ? 'กรอบ FFZ ที่นำจากเริ่มต้นสู่ความเชี่ยวชาญด้วยการยืนยันความสามารถ'
        : 'FFZ framework that guides from beginner to expert with verified competency',
      icon: Users,
      color: 'oklch(0.769 0.188 70.08)'
    },
    {
      title: language === 'th' ? 'การยืนยันความถูกต้อง' : 'Authenticity Verification',
      description: language === 'th'
        ? 'ระบบยืนยันที่ครอบคลุมเพื่อรับรองความเป็นแท้และความเคารพวัฒนธรรม' 
        : 'Comprehensive verification systems ensuring authentic and respectful creation',
      icon: Target,
      color: 'oklch(0.627 0.265 303.9)'
    },
    {
      title: language === 'th' ? 'เครื่องมือความแม่นยำ' : 'Precision Tools',
      description: language === 'th'
        ? 'เทคโนโลยี AI ที่เข้าใจเจตนาและช่วยสร้างสรรค์อย่างแม่นยำ'
        : 'Intent-aware AI technology that understands and amplifies creative vision',
      icon: Globe,
      color: 'oklch(0.488 0.243 264.376)'
    },
    {
      title: language === 'th' ? 'การอนุรักษ์วัฒนธรรม' : 'Cultural Preservation',
      description: language === 'th'
        ? 'การรักษาและเฉลิมฉลองประเพณีการเล่าเรื่องจากทั่วโลก'
        : 'Protecting and celebrating storytelling traditions from around the world',
      icon: Leaf,
      color: 'oklch(0.645 0.246 16.439)'
    }
  ];

  // Use coreValues from data or fallback to default
  const coreValues = t?.ecosystemFeatures || defaultCoreValues;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-20"
    >
      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-gradient-to-r from-chart-1/10 to-chart-2/10 p-8 border-b border-border">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              {t?.coreValuesTitle || (language === 'th' ? 'หลักการสำคัญของระบบนิเวศ' : 'Ecosystem Core Principles')}
            </h2>
            <p className="text-base md:text-lg font-semibold text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t?.coreValuesDescription || (language === 'th' 
                ? 'หลักการพื้นฐานที่ขับเคลื่อนระบบนิเวศการเล่าเรื่องด้วยภาพ'
                : 'Core principles driving the adaptive visual storytelling ecosystem'
              )}
            </p>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => {
              // Handle both data structures - objects with icon property or plain objects
              const IconComponent = value.icon || Heart;
              const valueColor = value.color || 'oklch(0.696 0.17 162.48)';
              
              return (
                <motion.div
                  key={`core-value-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-secondary/20 border-border h-full hover:border-border/60 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div 
                        className="h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${valueColor} / 0.15` }}
                      >
                        <IconComponent 
                          className="h-8 w-8" 
                          style={{ color: valueColor }}
                        />
                      </div>
                      
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      
                      <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Impact Statement */}
          <div className="mt-12 text-center p-6 bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-lg border border-border">
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
              {language === 'th' ? 'ผลกระทบที่วัดได้' : 'Measurable Impact'}
            </h3>
            <p className="text-sm md:text-base font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t?.impactDescription || (language === 'th' 
                ? 'ระบบนิเวศของเราสร้างผลกระทบที่วัดได้จริงในการเสริมพลังผู้สร้างสรรค์และอนุรักษ์วัฒนธรรมทั่วโลก'
                : 'Our ecosystem creates measurable impact in empowering creators and preserving cultural heritage worldwide'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
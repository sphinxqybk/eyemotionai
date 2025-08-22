import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight, MapPin, Award, TrendingUp, Quote, Shield } from 'lucide-react';
import { SUCCESS_STORIES, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const SuccessStories: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="mb-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl text-foreground mb-4" style={{ fontWeight: 'var(--font-weight-medium)' }}>
          {t.successStoriesTitle}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === 'th' 
            ? 'เรื่องราวของผู้สร้างสรrrค์ที่ใช้ FFZ framework เปลี่ยนประสบการณ์ให้เป็นผลงานที่ยืนยันได้'
            : 'Stories of creators who used FFZ framework to transform experiences into verified authentic works'
          }
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {SUCCESS_STORIES.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-border/60 transition-colors h-full">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-chart-1/15 flex items-center justify-center">
                    <Quote className="h-5 w-5 text-chart-1" />
                  </div>
                </div>

                {/* Creator Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl text-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    {story.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{story.location[language]}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-chart-2/15 text-chart-2 border-chart-2/20 text-xs">
                      {story.grant_type[language]}
                    </Badge>
                    <Badge variant="secondary" className="bg-chart-3/15 text-chart-3 border-chart-3/20 text-xs">
                      {story.amount}
                    </Badge>
                  </div>

                  {/* FFZ Level & Cultural Background */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-chart-4/15 text-chart-4 border-chart-4/20 text-xs">
                      {story.ffz_level[language]}
                    </Badge>
                    <Badge variant="secondary" className="bg-chart-5/15 text-chart-5 border-chart-5/20 text-xs">
                      {story.cultural_background[language]}
                    </Badge>
                  </div>
                </div>

                {/* Achievement */}
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-chart-4" />
                      <span className="text-sm text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {language === 'th' ? 'ความสำเร็จ' : 'Achievement'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {story.achievement[language]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-chart-1" />
                      <span className="text-sm text-foreground" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {language === 'th' ? 'ผลกระทบ' : 'Impact'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {story.impact[language]}
                  </p>

                  {/* Verification Status */}
                  <div className="flex items-center justify-center gap-2 p-2 bg-chart-2/10 rounded-lg border border-chart-2/20">
                    <Shield className="h-4 w-4 text-chart-2" />
                    <span className="text-xs text-chart-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {story.verification[language]}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-secondary/50 text-xs gap-2"
                  >
                    {language === 'th' ? 'อ่านเรื่องราวเต็ม' : 'Read Full Story'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View More */}
      <div className="text-center mt-12">
        <Button className="bg-chart-2 hover:bg-chart-2/90 text-white gap-2 px-8" style={{ fontWeight: 'var(--font-weight-medium)' }}>
          <Award className="h-4 w-4" />
          {t.viewAllStories}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          {language === 'th' 
            ? 'ดูเรื่องราวความสำเร็จทั้งหมด 3,650+ เรื่อง จากผู้ใช้ FFZ framework'
            : 'View all 3,650+ success stories from FFZ framework users worldwide'
          }
        </p>
      </div>
    </motion.div>
  );
};
import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { IMPACT_STATS, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const ImpactStatistics: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-medium text-foreground mb-4">{t.impactTitle}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t.impactDescription}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {IMPACT_STATS.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card border-border text-center hover:border-border/60 transition-colors">
                <CardContent className="p-8">
                  <div 
                    className="h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${stat.color} / 0.15` }}
                  >
                    <IconComponent 
                      className="h-8 w-8" 
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div className="text-4xl font-medium text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label[language]}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
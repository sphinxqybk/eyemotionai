import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Leaf } from 'lucide-react';
import { ENVIRONMENTAL_FOCUS, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const EnvironmentalStewardship: React.FC<Props> = ({ language }) => {
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
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.627 0.265 120 / 0.15)' }}
            >
              <Leaf 
                className="h-6 w-6" 
                style={{ color: 'oklch(0.627 0.265 120)' }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-foreground">{t.environmentTitle}</h2>
              <p className="text-muted-foreground">{t.environmentSubtitle}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {ENVIRONMENTAL_FOCUS.map((focus, index) => {
              const IconComponent = focus.icon;
              return (
                <motion.div
                  key={focus.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30"
                >
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${focus.color} / 0.15` }}
                  >
                    <IconComponent 
                      className="h-5 w-5" 
                      style={{ color: focus.color }}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      {focus.name[language]}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {focus.description[language]}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Separator className="bg-border my-8" />

          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-4">
              {t.environmentalGoals}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-chart-3/15 text-chart-3 border-chart-3/20 px-4 py-2">
                100% {t.renewableEnergy}
              </Badge>
              <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/20 px-4 py-2">
                {t.paperlessOps}
              </Badge>
              <Badge className="bg-chart-2/15 text-chart-2 border-chart-2/20 px-4 py-2">
                {t.carbonNegative}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
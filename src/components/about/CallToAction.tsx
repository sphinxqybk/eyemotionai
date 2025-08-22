import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Film, BookOpen, ArrowRight } from 'lucide-react';
import { ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const CallToAction: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="text-center"
    >
      <Card className="bg-gradient-to-r from-chart-1/10 to-chart-2/10 border-border">
        <CardContent className="p-12">
          <h2 className="text-3xl font-medium text-foreground mb-4">
            {t.joinMission}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.joinMissionDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-chart-1 hover:bg-chart-1/90 text-white font-medium gap-2 px-8">
              <Film className="h-4 w-4" />
              {t.getStarted}
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="border-border hover:bg-secondary/50 font-medium gap-2 px-8">
              <BookOpen className="h-4 w-4" />
              {t.learnMore}
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t.subscriptionSupport}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
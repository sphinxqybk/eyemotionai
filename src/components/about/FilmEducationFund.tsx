import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen } from 'lucide-react';
import { EDUCATION_PROGRAMS, ABOUT_CONTENT } from '../../constants/about-data';

interface Props {
  language: 'th' | 'en';
}

export const FilmEducationFund: React.FC<Props> = ({ language }) => {
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
              <BookOpen 
                className="h-6 w-6" 
                style={{ color: 'oklch(0.696 0.17 162.48)' }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-foreground">{t.educationTitle}</h2>
              <p className="text-muted-foreground">{t.educationSubtitle}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {EDUCATION_PROGRAMS.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h4 className="text-lg font-medium text-foreground mb-2">
                  {program.name[language]}
                </h4>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {program.description[language]}
                </p>
                <Badge variant="secondary" className="bg-chart-2/15 text-chart-2 border-chart-2/20">
                  {program.impact[language]}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
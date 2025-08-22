import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '../components/ui/badge';
import { Heart, Globe, Shield, GraduationCap } from 'lucide-react';
import { ABOUT_CONTENT } from '../constants/about-data';
import { ImpactStatistics } from '../components/about/ImpactStatistics';
import { CoreValues } from '../components/about/CoreValues';
import { FFZFramework } from '../components/about/FFZFramework';
import { VerificationSystems } from '../components/about/VerificationSystems';
import { GrantApplication } from '../components/about/GrantApplication';
import { SuccessStories } from '../components/about/SuccessStories';
import { CallToAction } from '../components/about/CallToAction';

interface Props {
  language: 'th' | 'en';
}

export const About: React.FC<Props> = ({ language }) => {
  const t = ABOUT_CONTENT[language];

  return (
    <div className="page-standard min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="standard-hero text-foreground mb-6 tracking-tight">
              {t.title}
            </h1>
            <p className="standard-body text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              {t.subtitle}
            </p>

            {/* Mission Statement */}
            <div className="mt-8 p-6 bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-lg max-w-4xl mx-auto border border-border">
              <h2 className="standard-display text-foreground mb-3">
                {language === 'th' ? 'พันธกิจหลัก' : 'Core Mission'}
              </h2>
              <p className="standard-body text-muted-foreground leading-relaxed">
                {t.missionStatement}
              </p>
            </div>

            {/* Ecosystem Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto mt-8">
              <Badge className="bg-chart-2/15 text-chart-2 border-chart-2/20 px-4 py-2 gap-2 text-sm font-semibold">
                <Heart className="h-4 w-4" />
                {t.profitSharing}
              </Badge>
              <Badge className="bg-chart-1/15 text-chart-1 border-chart-1/20 px-4 py-2 gap-2 text-sm font-semibold">
                <Globe className="h-4 w-4" />
                {t.globalImpact}
              </Badge>
              <Badge className="bg-chart-3/15 text-chart-3 border-chart-3/20 px-4 py-2 gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4" />
                FFZ Framework
              </Badge>
              <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/20 px-4 py-2 gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4" />
                {language === 'th' ? 'ระบบยืนยัน' : 'Verification'}
              </Badge>
            </div>

            {/* Ecosystem Features Overview */}
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {t.ecosystemFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-4 bg-secondary/20 rounded-lg border border-border"
                >
                  <h3 className="standard-heading text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="standard-body text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Impact Statistics Section */}
        <ImpactStatistics language={language} />

        {/* FFZ Framework Section */}
        <FFZFramework language={language} />

        {/* Verification Systems Section */}
        <VerificationSystems language={language} />

        {/* Core Values Section */}
        <CoreValues language={language} />

        {/* Grant Application Section */}
        <GrantApplication language={language} />

        {/* Success Stories Section */}
        <SuccessStories language={language} />

        {/* Call to Action Section */}
        <CallToAction language={language} />
      </div>
    </div>
  );
};

// Default export for AppRouter compatibility
export default About;
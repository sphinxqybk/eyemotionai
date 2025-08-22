import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface TypographyDemoProps {
  language: 'th' | 'en';
}

export const TypographyDemo: React.FC<TypographyDemoProps> = ({ language }) => {
  const content = {
    th: {
      title: "ระบบ Typography มาตรฐาน Film Industry",
      subtitle: "แสดงผลการใช้งาน Professional Film Typography System",
      homepageSection: "HomePage Typography (Sales Focus)",
      professionalSection: "Professional Typography (Suite/Pricing)",
      standardSection: "Standard Typography (About/Contact)",
      techSection: "Technical Typography (Code & Monospace)",
      cinematicSection: "Cinematic Typography (Accent & Tech)",
      fontStackSection: "Professional Font Stack",
      heroText: "ข้อความหลักขนาดใหญ่",
      displayText: "ข้อความแสดงผล",
      headingText: "หัวข้อหลัก",
      bodyText: "ข้อความเนื้อหาหลักที่ใช้ในการอ่านเพื่อทดสอบความชัดเจนของฟอนต์และการจัดรูปแบบที่ออกแบบมาสำหรับการใช้งานจริงในอุตสาหกรรมภาพยนตร์",
      buttonText: "ปุ่มทดสอบ",
      badgeText: "ป้ายกำกับ",
      codeText: "console.log('Professional code typography');",
      cinematicText: "EyeMotion AI-Powered",
      techBadge: "CINE SUITE™"
    },
    en: {
      title: "Professional Film Industry Typography System",
      subtitle: "Demonstration of Industry-Standard Film Typography",
      homepageSection: "HomePage Typography (Sales Focus)",
      professionalSection: "Professional Typography (Suite/Pricing)", 
      standardSection: "Standard Typography (About/Contact)",
      techSection: "Technical Typography (Code & Monospace)",
      cinematicSection: "Cinematic Typography (Accent & Tech)",
      fontStackSection: "Professional Font Stack",
      heroText: "Large Hero Text Sample",
      displayText: "Display Text Sample",
      headingText: "Main Heading Sample",
      bodyText: "Body text content used for reading to test font clarity and formatting designed for real-world usage in the film industry with professional-grade typography standards",
      buttonText: "Test Button",
      badgeText: "Badge Label",
      codeText: "console.log('Professional code typography');",
      cinematicText: "EyeMotion AI-Powered",
      techBadge: "CINE SUITE™"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <div className="max-w-6xl mx-auto">
        {/* Demo Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-extrabold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-lg font-primary text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Professional Font Stack Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-chart-1">
              🎬 {t.fontStackSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-display font-bold text-chart-1">Primary (Inter)</h4>
                <p className="font-primary text-sm text-muted-foreground">
                  Body text, interface elements, and readable content
                </p>
                <div className="font-primary text-base">
                  Modern, clean, excellent readability for professional interfaces
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-display font-bold text-chart-2">Display (Poppins)</h4>
                <p className="font-primary text-sm text-muted-foreground">
                  Headers, branding, and impactful text
                </p>
                <div className="font-display text-base font-semibold">
                  Sophisticated, premium feel for maximum impact
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-display font-bold text-chart-3">Mono (JetBrains)</h4>
                <p className="font-primary text-sm text-muted-foreground">
                  Code, technical content, data
                </p>
                <div className="font-mono text-sm">
                  { `function() { return "professional"; }` }
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-display font-bold text-chart-4">Cinematic (Orbitron)</h4>
                <p className="font-primary text-sm text-muted-foreground">
                  Tech accents, futuristic elements
                </p>
                <div className="font-cinematic text-sm font-bold tracking-widest">
                  AI-POWERED SUITE™
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HomePage Typography Demo */}
        <Card className="page-homepage mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-chart-1">
              📱 {t.homepageSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h1 className="homepage-hero text-foreground">
                {t.heroText}
              </h1>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Poppins Display • Weight: 800 • Size: 40px-60px
              </p>
              
              <h2 className="homepage-display text-foreground">
                {t.displayText}
              </h2>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Poppins Display • Weight: 700 • Size: 30px-40px
              </p>
              
              <h3 className="homepage-heading text-foreground">
                {t.headingText}
              </h3>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Poppins Display • Weight: 700 • Size: 24px
              </p>
              
              <p className="homepage-body text-muted-foreground">
                {t.bodyText}
              </p>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 500 • Size: 18px-20px
              </p>
              
              <div className="flex gap-4 items-center flex-wrap">
                <Button className="homepage-body bg-chart-1 hover:bg-chart-1/90 font-primary">
                  {t.buttonText}
                </Button>
                <Badge className="homepage-body badge-crisp bg-chart-1/15 text-chart-1 font-primary">
                  {t.badgeText}
                </Badge>
                <span className="pill-text bg-chart-1/15 text-chart-1 px-4 py-2 rounded-full">
                  {t.techBadge}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Typography Demo */}
        <Card className="page-professional mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-chart-2">
              💼 {t.professionalSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h1 className="professional-hero text-foreground">
                {t.heroText}
              </h1>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Poppins Display • Weight: 700 • Size: 36px-48px
              </p>
              
              <h2 className="professional-display text-foreground">
                {t.displayText}
              </h2>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 600 • Size: 30px-40px
              </p>
              
              <h3 className="professional-heading text-foreground">
                {t.headingText}
              </h3>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 600 • Size: 24px
              </p>
              
              <p className="professional-body text-muted-foreground">
                {t.bodyText}
              </p>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 400 • Size: 16px-18px
              </p>
              
              <div className="flex gap-4 items-center flex-wrap">
                <Button className="professional-body bg-chart-2 hover:bg-chart-2/90 font-primary">
                  {t.buttonText}
                </Button>
                <Badge className="professional-body badge-crisp bg-chart-2/15 text-chart-2 font-primary">
                  {t.badgeText}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Standard Typography Demo */}
        <Card className="page-standard mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-chart-3">
              📖 {t.standardSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h1 className="standard-hero text-foreground">
                {t.heroText}
              </h1>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 600 • Size: 30px-40px
              </p>
              
              <h2 className="standard-display text-foreground">
                {t.displayText}
              </h2>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 500 • Size: 24px-36px
              </p>
              
              <h3 className="standard-heading text-foreground">
                {t.headingText}
              </h3>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 400 • Size: 20px
              </p>
              
              <p className="standard-body text-muted-foreground">
                {t.bodyText}
              </p>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Font: Inter Primary • Weight: 400 • Size: 16px-18px
              </p>
              
              <div className="flex gap-4 items-center flex-wrap">
                <Button className="standard-body bg-chart-3 hover:bg-chart-3/90 font-primary">
                  {t.buttonText}
                </Button>
                <Badge className="standard-body badge-crisp bg-chart-3/15 text-chart-3 font-primary">
                  {t.badgeText}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Typography Demo */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-chart-4">
              ⚙️ {t.techSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-foreground">
                JetBrains Mono - Professional Code Font
              </h3>
              
              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <code className="text-code block text-foreground">
                  {t.codeText}
                </code>
                <p className="font-primary text-sm text-muted-foreground font-medium">
                  Font: JetBrains Mono • Weight: 500 • Enhanced for code readability
                </p>
              </div>

              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <pre className="text-mono text-sm text-foreground whitespace-pre-wrap">
{`interface TypographySystem {
  primary: "Inter";
  display: "Poppins"; 
  mono: "JetBrains Mono";
  cinematic: "Orbitron";
}`}
                </pre>
                <p className="font-primary text-sm text-muted-foreground font-medium">
                  Font: JetBrains Mono • Perfect for technical documentation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cinematic Typography Demo */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-chart-5">
              🎬 {t.cinematicSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-cinematic text-2xl md:text-3xl text-foreground">
                  {t.cinematicText}
                </h2>
                <p className="font-primary text-sm text-muted-foreground font-medium">
                  Font: Orbitron • Futuristic, tech-inspired for AI elements
                </p>
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-tech text-xl md:text-2xl text-chart-1">
                  PROFESSIONAL CINE SUITE™
                </h2>
                <p className="font-primary text-sm text-muted-foreground font-medium">
                  Font: Orbitron • Maximum letter spacing for tech branding
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <span className="pill-text bg-chart-1/15 text-chart-1 px-4 py-2 rounded-full block">
                    CINEFLOW AI
                  </span>
                  <p className="font-primary text-xs text-muted-foreground">Cinematic Pills</p>
                </div>
                <div className="space-y-2">
                  <span className="pill-text bg-chart-4/15 text-chart-4 px-4 py-2 rounded-full block">
                    CINEGUARD™
                  </span>
                  <p className="font-primary text-xs text-muted-foreground">Tech Badges</p>
                </div>
                <div className="space-y-2">
                  <span className="pill-text bg-chart-5/15 text-chart-5 px-4 py-2 rounded-full block">
                    CINESTORY AI
                  </span>
                  <p className="font-primary text-xs text-muted-foreground">Brand Elements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Effects Demo */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-foreground">
              🌈 Enhanced Typography Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6 text-center">
              <h2 className="text-gradient-blue homepage-display">
                AI-Powered Film Studio
              </h2>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Gradient Effect: Poppins Display with professional blue gradient
              </p>

              <h2 className="text-gradient-warm professional-display">
                Professional Creation Suite
              </h2>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Gradient Effect: Poppins Display with warm gradient
              </p>

              <h2 className="text-gradient-cinematic text-xl md:text-2xl">
                FUTURISTIC FILM TECHNOLOGY
              </h2>
              <p className="font-primary text-sm text-muted-foreground font-medium">
                Cinematic Gradient: Orbitron with tech-inspired multi-color gradient
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Typography Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-foreground">
              📊 Professional Typography Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="font-display font-bold text-chart-1">Homepage (Sales)</h4>
                <div className="text-sm space-y-2 font-mono text-muted-foreground">
                  <div>Hero: Poppins, 40px-60px, 800</div>
                  <div>Display: Poppins, 30px-40px, 700</div>
                  <div>Heading: Poppins, 24px, 700</div>
                  <div>Body: Inter, 18px-20px, 500</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-display font-bold text-chart-2">Professional</h4>
                <div className="text-sm space-y-2 font-mono text-muted-foreground">
                  <div>Hero: Poppins, 36px-48px, 700</div>
                  <div>Display: Inter, 30px-40px, 600</div>
                  <div>Heading: Inter, 24px, 600</div>
                  <div>Body: Inter, 16px-18px, 400</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-display font-bold text-chart-3">Standard</h4>
                <div className="text-sm space-y-2 font-mono text-muted-foreground">
                  <div>Hero: Inter, 30px-40px, 600</div>
                  <div>Display: Inter, 24px-36px, 500</div>
                  <div>Heading: Inter, 20px, 400</div>
                  <div>Body: Inter, 16px-18px, 400</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-display font-bold text-chart-4">Technical</h4>
                <div className="text-sm space-y-2 font-mono text-muted-foreground">
                  <div>Code: JetBrains Mono, 14px, 500</div>
                  <div>Data: JetBrains Mono, 12px-16px</div>
                  <div>Tech: Orbitron, Various, 600-900</div>
                  <div>Cinematic: Orbitron, Tracking 0.1em</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Default export for AppRouter compatibility
export default TypographyDemo;
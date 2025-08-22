import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ColorReadabilityAnalysis() {
  const [selectedTextSize, setSelectedTextSize] = useState<'xs' | 'sm' | 'base'>('xs');

  const ecosystemColors = [
    {
      id: 'story-orange',
      name: 'Story Orange',
      description: 'Narrative Development',
      value: 'oklch(0.769 0.188 70.08)',
      lightness: 76.9,
      chroma: 18.8,
      hue: 70.08,
      contrastRating: 'AAA',
      readabilityScore: 95,
      recommendation: 'ดีที่สุด',
      rank: 1,
      icon: '🥇',
      usageRecommendation: [
        'Primary navigation text',
        'Important action buttons',
        'Critical notifications',
        'Main headings (small size)',
        'Call-to-action elements'
      ]
    },
    {
      id: 'experience-cyan',
      name: 'Experience Cyan',
      description: 'Lived Experience Integration',
      value: 'oklch(0.75 0.35 195)',
      lightness: 75.0,
      chroma: 35.0,
      hue: 195,
      contrastRating: 'AAA',
      readabilityScore: 92,
      recommendation: 'ดีมาก',
      rank: 2,
      icon: '🥈',
      usageRecommendation: [
        'Interactive links',
        'Hover states',
        'Active elements',
        'Secondary navigation',
        'Highlight text'
      ]
    },
    {
      id: 'community-coral',
      name: 'Community Coral',
      description: 'FFZ Community Features',
      value: 'oklch(0.645 0.246 16.439)',
      lightness: 64.5,
      chroma: 24.6,
      hue: 16.439,
      contrastRating: 'AA+',
      readabilityScore: 82,
      recommendation: 'ดี',
      rank: 3,
      icon: '🥉',
      usageRecommendation: [
        'Secondary text',
        'Labels and tags',
        'Supplementary information',
        'Form labels',
        'Status indicators'
      ]
    },
    {
      id: 'verification-purple',
      name: 'Verification Purple',
      description: 'Authenticity & Verification',
      value: 'oklch(0.627 0.265 303.9)',
      lightness: 62.7,
      chroma: 26.5,
      hue: 303.9,
      contrastRating: 'AA',
      readabilityScore: 78,
      recommendation: 'ใช้ได้',
      rank: 4,
      icon: '4️⃣',
      usageRecommendation: [
        'Verification badges',
        'Security indicators',
        'Authentication elements',
        'System status',
        'Advanced features'
      ]
    },
    {
      id: 'intent-blue',
      name: 'Intent Blue',
      description: 'Intent Recognition & AI',
      value: 'oklch(0.488 0.243 264.376)',
      lightness: 48.8,
      chroma: 24.3,
      hue: 264.376,
      contrastRating: 'AA-',
      readabilityScore: 65,
      recommendation: 'ระวัง',
      rank: 5,
      icon: '5️⃣',
      usageRecommendation: [
        'Large headings only',
        'Brand accents',
        'Background elements',
        'Decorative purposes',
        'Non-critical text'
      ]
    }
  ];

  const textSizes = {
    xs: { size: '0.75rem', label: 'Extra Small (12px)', className: 'text-xs' },
    sm: { size: '0.875rem', label: 'Small (14px)', className: 'text-sm' },
    base: { size: '1rem', label: 'Base (16px)', className: 'text-base' }
  };

  const getContrastLevel = (lightness: number) => {
    if (lightness >= 75) return { level: 'AAA', color: 'bg-green-500', desc: 'ดีเยี่ยม' };
    if (lightness >= 65) return { level: 'AA+', color: 'bg-blue-500', desc: 'ดีมาก' };
    if (lightness >= 55) return { level: 'AA', color: 'bg-yellow-500', desc: 'ดี' };
    if (lightness >= 45) return { level: 'AA-', color: 'bg-orange-500', desc: 'ใช้ได้' };
    return { level: 'FAIL', color: 'bg-red-500', desc: 'ไม่แนะนำ' };
  };

  return (
    <div className="page-standard min-h-screen p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-gradient-ecosystem text-4xl md:text-5xl">
          🎨 Color Readability Analysis
        </h1>
        <p className="text-cinema-muted max-w-3xl mx-auto text-lg">
          วิเคราะห์สีในระบบ EyeMotion ecosystem เพื่อหาสีที่เหมาะสมสำหรับข้อความขนาดเล็กที่อ่านคมชัดที่สุด
        </p>
      </div>

      {/* Text Size Selector */}
      <div className="flex justify-center">
        <Tabs value={selectedTextSize} onValueChange={(value) => setSelectedTextSize(value as any)}>
          <TabsList className="bg-cinema-tertiary/50">
            {Object.entries(textSizes).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key} className="data-[state=active]:bg-intent/30">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Top 3 Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {ecosystemColors.slice(0, 3).map((color) => {
          const contrast = getContrastLevel(color.lightness);
          return (
            <Card 
              key={color.id}
              className="bg-cinema-secondary/80 border-cinema-tertiary backdrop-blur-sm hover:scale-105 transition-all duration-300"
            >
              <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl">{color.icon}</span>
                  <Badge 
                    className={`${contrast.color} text-white`}
                  >
                    {contrast.level}
                  </Badge>
                </div>
                <CardTitle className="text-cinema-foreground">{color.name}</CardTitle>
                <p className="text-sm text-cinema-muted">{color.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Color Preview */}
                <div 
                  className="w-full h-20 rounded-lg flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: 'oklch(0.145 0 0)' }}
                >
                  <span 
                    className={`font-primary ${textSizes[selectedTextSize].className} font-semibold`}
                    style={{ color: color.value }}
                  >
                    ตัวอย่างข้อความ Sample Text
                  </span>
                </div>

                {/* Technical Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cinema-muted">Lightness:</span>
                    <span className="text-cinema-foreground font-mono">{color.lightness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cinema-muted">Chroma:</span>
                    <span className="text-cinema-foreground font-mono">{color.chroma}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cinema-muted">Readability:</span>
                    <span className="text-cinema-foreground font-semibold">{color.readabilityScore}/100</span>
                  </div>
                </div>

                {/* Usage Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-cinema-foreground">การใช้งานที่แนะนำ:</h4>
                  <ul className="text-xs text-cinema-muted space-y-1">
                    {color.usageRecommendation.slice(0, 3).map((usage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span style={{ color: color.value }}>•</span>
                        <span>{usage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cinema-foreground text-2xl">
            📊 การเปรียบเทียบรายละเอียด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cinema-tertiary">
                  <th className="text-left p-3 text-cinema-foreground">สี</th>
                  <th className="text-center p-3 text-cinema-foreground">Lightness</th>
                  <th className="text-center p-3 text-cinema-foreground">Contrast</th>
                  <th className="text-center p-3 text-cinema-foreground">Score</th>
                  <th className="text-left p-3 text-cinema-foreground">ตัวอย่าง</th>
                </tr>
              </thead>
              <tbody>
                {ecosystemColors.map((color) => {
                  const contrast = getContrastLevel(color.lightness);
                  return (
                    <tr key={color.id} className="border-b border-cinema-tertiary/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{color.icon}</span>
                          <div>
                            <div className="font-semibold text-cinema-foreground">{color.name}</div>
                            <div className="text-xs text-cinema-muted">{color.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-mono text-cinema-foreground">{color.lightness}%</span>
                      </td>
                      <td className="text-center p-3">
                        <Badge className={`${contrast.color} text-white`}>
                          {contrast.level}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-semibold text-cinema-foreground">{color.readabilityScore}/100</span>
                      </td>
                      <td className="p-3">
                        <div 
                          className="bg-cinema-deep p-2 rounded"
                          style={{ backgroundColor: 'oklch(0.145 0 0)' }}
                        >
                          <span 
                            className={`${textSizes[selectedTextSize].className} font-semibold`}
                            style={{ color: color.value }}
                          >
                            ข้อความทดสอบ
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Color Usage Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cinema-foreground">
              🏆 สีที่แนะนำสำหรับข้อความเล็ก
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ecosystemColors.slice(0, 2).map((color) => (
              <div key={color.id} className="space-y-3 p-4 bg-cinema-deep/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{color.icon}</span>
                  <div>
                    <h4 className="font-semibold text-cinema-foreground">{color.name}</h4>
                    <p className="text-xs text-cinema-muted">Lightness: {color.lightness}%</p>
                  </div>
                </div>
                <ul className="text-sm text-cinema-muted space-y-1">
                  {color.usageRecommendation.map((usage, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span style={{ color: color.value }}>•</span>
                      <span>{usage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cinema-foreground">
              ⚠️ ข้อควรระวัง
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-story/10 border border-story/30 rounded-lg">
                <h4 className="font-semibold text-story mb-2">แนะนำ: Story Orange</h4>
                <p className="text-sm text-cinema-muted">
                  มี Lightness สูงสุด (76.9%) ทำให้อ่านได้ชัดเจนที่สุดในขนาดเล็ก 
                  เหมาะสำหรับ navigation, buttons และข้อความสำคัญ
                </p>
              </div>

              <div className="p-4 bg-experience/10 border border-experience/30 rounded-lg">
                <h4 className="font-semibold text-experience mb-2">ทางเลือกที่ 2: Experience Cyan</h4>
                <p className="text-sm text-cinema-muted">
                  มี Lightness สูง (75.0%) และ Chroma สูง (35.0%) ให้ความโดดเด่น 
                  เหมาะสำหรับ links และ interactive elements
                </p>
              </div>

              <div className="p-4 bg-intent/10 border border-intent/30 rounded-lg">
                <h4 className="font-semibold text-intent mb-2">ระวัง: Intent Blue</h4>
                <p className="text-sm text-cinema-muted">
                  มี Lightness ต่ำ (48.8%) อาจอ่านยากในขนาดเล็ก 
                  ควรใช้สำหรับ headings ขนาดใหญ่หรือ accents เท่านั้น
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Code */}
      <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cinema-foreground">
            💻 การใช้งานใน Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="bg-cinema-deep p-4 rounded-lg">
              <h4 className="text-story mb-3">🥇 สำหรับข้อความเล็กสำคัญ (Story Orange):</h4>
              <pre className="text-sm text-cinema-muted font-mono overflow-x-auto">
{`<!-- HTML -->
<span class="text-story text-xs font-semibold">Critical Navigation</span>

/* CSS */
color: oklch(0.769 0.188 70.08);

/* Tailwind */
className="text-story text-xs font-semibold"`}
              </pre>
            </div>

            <div className="bg-cinema-deep p-4 rounded-lg">
              <h4 className="text-experience mb-3">🥈 สำหรับ Links และ Interactive (Experience Cyan):</h4>
              <pre className="text-sm text-cinema-muted font-mono overflow-x-auto">
{`<!-- HTML -->
<a class="text-experience text-sm hover:text-experience/80">Interactive Link</a>

/* CSS */
color: oklch(0.75 0.35 195);

/* Tailwind */
className="text-experience text-sm hover:text-experience/80"`}
              </pre>
            </div>

            <div className="bg-cinema-deep p-4 rounded-lg">
              <h4 className="text-community mb-3">🥉 สำหรับข้อความทั่วไป (Community Coral):</h4>
              <pre className="text-sm text-cinema-muted font-mono overflow-x-auto">
{`<!-- HTML -->
<p class="text-community text-sm">Regular body text</p>

/* CSS */
color: oklch(0.645 0.246 16.439);

/* Tailwind */
className="text-community text-sm"`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ColorReadabilityAnalysis;
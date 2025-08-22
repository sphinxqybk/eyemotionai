import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Check, Eye, Palette, Code } from 'lucide-react';

export function ColorSystemDocumentation() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorSystem = {
    core: {
      title: '🎯 Core Ecosystem Colors (Primary Palette)',
      description: 'หลักการใช้สีหลักของระบบ EyeMotion - ใช้สำหรับ branding และ features หลัก',
      colors: [
        {
          id: 'intent-blue',
          name: 'Intent Blue',
          value: 'oklch(0.488 0.243 264.376)',
          cssVar: '--intent-blue',
          usage: 'AI & Intelligence',
          description: 'สำหรับ AI features, Intent recognition, และ intelligence systems',
          lightness: 48.8,
          textRating: '⚠️ Large text only',
          examples: ['AI suggestions', 'Intent detection', 'Smart features', 'Intelligence indicators']
        },
        {
          id: 'experience-cyan',
          name: 'Experience Cyan',
          value: 'oklch(0.75 0.35 195)',
          cssVar: '--experience-cyan',
          usage: 'User Experience - UPGRADED!',
          description: 'สำหรับ user interactions, experience elements, และ primary actions',
          lightness: 75.0,
          textRating: '🥈 Interactive elements',
          examples: ['Links', 'Hover states', 'Interactive buttons', 'User highlights']
        },
        {
          id: 'story-orange',
          name: 'Story Orange',
          value: 'oklch(0.769 0.188 70.08)',
          cssVar: '--story-orange',
          usage: 'Narrative & Content',
          description: 'สำหรับ storytelling, content creation, และ narrative elements',
          lightness: 76.9,
          textRating: '🥇 Best for text',
          examples: ['Story content', 'Navigation text', 'Important text', 'Content highlights']
        },
        {
          id: 'verification-purple',
          name: 'Verification Purple',
          value: 'oklch(0.627 0.265 303.9)',
          cssVar: '--verification-purple',
          usage: 'Authenticity & Security',
          description: 'สำหรับ verification, security, และ authentication features',
          lightness: 62.7,
          textRating: '✅ Good readability',
          examples: ['Verification badges', 'Security indicators', 'Auth elements', 'Validation']
        },
        {
          id: 'community-coral',
          name: 'Community Coral',
          value: 'oklch(0.645 0.246 16.439)',
          cssVar: '--community-coral',
          usage: 'Community & Social',
          description: 'สำหรับ community features, social elements, และ collaboration tools',
          lightness: 64.5,
          textRating: '🥉 Secondary text',
          examples: ['Community features', 'Social buttons', 'Collaboration tools', 'User connections']
        }
      ]
    },
    cinema: {
      title: '🎬 Cinema Interface Colors (Background Palette)',
      description: 'สีพื้นหลังและ interface elements สำหรับ cinema-grade aesthetic',
      colors: [
        {
          id: 'cinema-deep',
          name: 'Cinema Deep',
          value: 'oklch(0.145 0 0)',
          cssVar: '--cinema-deep',
          usage: 'Primary Background',
          description: 'พื้นหลังหลักของแอปพลิเคชัน - Deep space theme',
          lightness: 14.5,
          textRating: 'Background only',
          examples: ['Main background', 'App container', 'Primary surface']
        },
        {
          id: 'cinema-secondary',
          name: 'Cinema Secondary',
          value: 'oklch(0.205 0 0)',
          cssVar: '--cinema-secondary',
          usage: 'Secondary Background',
          description: 'พื้นหลังรองสำหรับ panels และ sections',
          lightness: 20.5,
          textRating: 'Background only',
          examples: ['Card backgrounds', 'Panel sections', 'Secondary surfaces']
        },
        {
          id: 'cinema-tertiary',
          name: 'Cinema Tertiary',
          value: 'oklch(0.269 0 0)',
          cssVar: '--cinema-tertiary',
          usage: 'Card/Panel Background',
          description: 'พื้นหลังสำหรับ cards, panels และ elevated elements',
          lightness: 26.9,
          textRating: 'Background only',
          examples: ['Card surfaces', 'Elevated panels', 'Form backgrounds']
        },
        {
          id: 'cinema-muted',
          name: 'Cinema Muted',
          value: 'oklch(0.708 0 0)',
          cssVar: '--cinema-muted',
          usage: 'Muted Text',
          description: 'ข้อความรองและ secondary information',
          lightness: 70.8,
          textRating: '✅ Muted text',
          examples: ['Secondary text', 'Descriptions', 'Captions', 'Placeholder text']
        },
        {
          id: 'cinema-foreground',
          name: 'Cinema Foreground',
          value: 'oklch(0.985 0 0)',
          cssVar: '--cinema-foreground',
          usage: 'Primary Text',
          description: 'ข้อความหลักและ primary content',
          lightness: 98.5,
          textRating: '🏆 Primary text',
          examples: ['Main text', 'Headings', 'Primary content', 'Body text']
        }
      ]
    },
    ffz: {
      title: '🎓 FFZ Educational Colors (Learning Palette)',
      description: 'สีสำหรับระบบการศึกษา Film From Zero - แต่ละสีแทน skill level',
      colors: [
        {
          id: 'ffz-level-0',
          name: 'FFZ Level 0',
          value: 'var(--experience-cyan)',
          cssVar: '--ffz-level-0',
          usage: 'Experience Capture',
          description: 'ระดับเริ่มต้น - การจับภาพประสบการณ์',
          lightness: 75.0,
          textRating: '🎯 Beginner level',
          examples: ['Basic tutorials', 'Entry level', 'Experience capture', 'Foundation skills']
        },
        {
          id: 'ffz-level-1',
          name: 'FFZ Level 1',
          value: 'var(--story-orange)',
          cssVar: '--ffz-level-1',
          usage: 'Narrative Structure',
          description: 'ระดับกลาง - การสร้างโครงสร้างเรื่องราว',
          lightness: 76.9,
          textRating: '📚 Intermediate',
          examples: ['Story structure', 'Narrative building', 'Plot development', 'Basic editing']
        },
        {
          id: 'ffz-level-2',
          name: 'FFZ Level 2',
          value: 'var(--verification-purple)',
          cssVar: '--ffz-level-2',
          usage: 'Technical Proficiency',
          description: 'ระดับสูง - ความเชี่ยวชาญทางเทคนิค',
          lightness: 62.7,
          textRating: '🔧 Advanced',
          examples: ['Technical skills', 'Advanced editing', 'Professional tools', 'Complex workflows']
        },
        {
          id: 'ffz-level-3',
          name: 'FFZ Level 3',
          value: 'var(--intent-blue)',
          cssVar: '--ffz-level-3',
          usage: 'Professional Mastery',
          description: 'ระดับผู้เชี่ยวชาญ - ความเป็นมืออาชีพ',
          lightness: 48.8,
          textRating: '🎓 Expert level',
          examples: ['Expert techniques', 'Professional workflows', 'Master skills', 'Leadership']
        },
        {
          id: 'ffz-verified',
          name: 'FFZ Verified',
          value: 'var(--community-coral)',
          cssVar: '--ffz-verified',
          usage: 'Certification',
          description: 'การรับรองและ verification',
          lightness: 64.5,
          textRating: '✅ Certification',
          examples: ['Verified badges', 'Certifications', 'Achievements', 'Completed courses']
        }
      ]
    },
    cultural: {
      title: '🌍 Cultural Authenticity Colors (Verification Palette)',
      description: 'สีสำหรับระบบ cultural authenticity และ verification',
      colors: [
        {
          id: 'cultural-context',
          name: 'Cultural Context',
          value: 'oklch(0.708 0 0)',
          cssVar: '--cultural-context',
          usage: 'Information Display',
          description: 'การแสดงข้อมูลทางวัฒนธรรม',
          lightness: 70.8,
          textRating: 'ℹ️ Information',
          examples: ['Cultural info', 'Context displays', 'Background information', 'Explanatory text']
        },
        {
          id: 'authenticity-verified',
          name: 'Authenticity Verified',
          value: 'var(--experience-cyan)',
          cssVar: '--authenticity-verified',
          usage: 'Verified Content',
          description: 'เนื้อหาที่ได้รับการตรวจสอบแล้ว',
          lightness: 75.0,
          textRating: '✅ Verified',
          examples: ['Verified content', 'Authentic materials', 'Approved cultural content', 'Validated stories']
        },
        {
          id: 'authenticity-pending',
          name: 'Authenticity Pending',
          value: 'var(--story-orange)',
          cssVar: '--authenticity-pending',
          usage: 'In Progress',
          description: 'อยู่ระหว่างการตรวจสอบ',
          lightness: 76.9,
          textRating: '⏳ Pending',
          examples: ['Under review', 'Pending verification', 'In progress', 'Awaiting approval']
        },
        {
          id: 'community-endorsed',
          name: 'Community Endorsed',
          value: 'var(--verification-purple)',
          cssVar: '--community-endorsed',
          usage: 'Community Approved',
          description: 'ได้รับการรับรองจากชุมชน',
          lightness: 62.7,
          textRating: '👥 Community',
          examples: ['Community approved', 'Endorsed content', 'Peer verified', 'Community validated']
        },
        {
          id: 'cultural-preservation',
          name: 'Cultural Preservation',
          value: 'var(--community-coral)',
          cssVar: '--cultural-preservation',
          usage: 'Preservation Projects',
          description: 'โครงการอนุรักษ์วัฒนธรรม',
          lightness: 64.5,
          textRating: '🏛️ Preservation',
          examples: ['Preservation projects', 'Cultural heritage', 'Traditional stories', 'Cultural archives']
        }
      ]
    }
  };

  const copyToClipboard = async (text: string, colorId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(colorId);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const ColorCard = ({ color, showUsage = true }: { color: any, showUsage?: boolean }) => (
    <Card className="bg-cinema-secondary/80 border-cinema-tertiary backdrop-blur-sm hover:scale-105 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-cinema-foreground text-lg">{color.name}</CardTitle>
          <Badge 
            className="text-xs"
            style={{ 
              backgroundColor: color.value.includes('var(') ? 
                (color.value.includes('experience') ? 'oklch(0.75 0.35 195)' :
                 color.value.includes('story') ? 'oklch(0.769 0.188 70.08)' :
                 color.value.includes('verification') ? 'oklch(0.627 0.265 303.9)' :
                 color.value.includes('intent') ? 'oklch(0.488 0.243 264.376)' :
                 'oklch(0.645 0.246 16.439)') : color.value,
              color: 'white',
              border: 'none'
            }}
          >
            {color.textRating}
          </Badge>
        </div>
        {showUsage && (
          <p className="text-sm text-cinema-muted">{color.usage}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Preview */}
        <div className="relative">
          <div 
            className="w-full h-20 rounded-lg flex items-center justify-center relative overflow-hidden border border-cinema-tertiary"
            style={{ 
              backgroundColor: color.value.includes('var(') ? 
                (color.value.includes('experience') ? 'oklch(0.75 0.35 195)' :
                 color.value.includes('story') ? 'oklch(0.769 0.188 70.08)' :
                 color.value.includes('verification') ? 'oklch(0.627 0.265 303.9)' :
                 color.value.includes('intent') ? 'oklch(0.488 0.243 264.376)' :
                 'oklch(0.645 0.246 16.439)') : color.value 
            }}
          >
            <span className="text-white font-semibold text-sm drop-shadow-lg">
              {color.name}
            </span>
          </div>
        </div>

        {/* Technical Details */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-cinema-muted">CSS Variable:</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={() => copyToClipboard(color.cssVar, `${color.id}-var`)}
              >
                <span className="font-mono text-experience mr-1">{color.cssVar}</span>
                {copiedColor === `${color.id}-var` ? 
                  <Check className="w-3 h-3 text-green-500" /> : 
                  <Copy className="w-3 h-3" />
                }
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-cinema-muted">OKLCH Value:</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={() => copyToClipboard(color.value, `${color.id}-value`)}
              >
                <span className="font-mono text-verification mr-1 truncate max-w-32">{color.value}</span>
                {copiedColor === `${color.id}-value` ? 
                  <Check className="w-3 h-3 text-green-500" /> : 
                  <Copy className="w-3 h-3" />
                }
              </Button>
            </div>

            {color.lightness && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-cinema-muted">Lightness:</span>
                <span className="text-xs text-cinema-foreground font-mono">{color.lightness}%</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-cinema-foreground">Description:</h5>
            <p className="text-xs text-cinema-muted">{color.description}</p>
          </div>

          {/* Usage Examples */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-cinema-foreground">Use Cases:</h5>
            <div className="flex flex-wrap gap-1">
              {color.examples.map((example: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-cinema-tertiary text-cinema-muted"
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="page-standard min-h-screen p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-gradient-ecosystem text-4xl md:text-5xl">
          🎨 EyeMotion Color System
        </h1>
        <p className="text-cinema-muted max-w-3xl mx-auto text-lg">
          ระบบสีที่จัดระเบียบแล้วของ EyeMotion ecosystem - จากการวิเคราะห์และจัดกลุ่มใหม่เพื่อความชัดเจนและง่ายต่อการใช้งาน
        </p>
      </div>

      {/* Color System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cinema-foreground flex items-center gap-2">
              <Palette className="w-5 h-5" />
              ระบบสีที่ปรับปรุงแล้ว
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-cinema-muted">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-story" />
              <span><strong className="text-story">Experience Cyan</strong> - อัปเกรดจาก Teal เป็น Cyan สำหรับ visibility ที่ดีขึ้น</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-story" />
              <span><strong className="text-story">Story Orange</strong> - สีที่ดีที่สุดสำหรับข้อความขนาดเล็ก (Lightness 76.9%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-experience" />
              <span><strong className="text-experience">Grouped by Function</strong> - จัดกลุ่มตามหน้าที่การใช้งาน</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-verification" />
              <span><strong className="text-verification">Consistency</strong> - ลงตัวระหว่าง Guidelines.md และ globals.css</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cinema-foreground flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Text Readability Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-cinema-muted">
            <div className="flex items-center gap-3">
              <span className="text-lg">🥇</span>
              <span><strong className="text-story">Story Orange</strong> - ดีที่สุดสำหรับข้อความเล็ก (76.9% lightness)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🥈</span>
              <span><strong className="text-experience">Experience Cyan</strong> - เหมาะสำหรับ interactive elements (75.0% lightness)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🥉</span>
              <span><strong className="text-community">Community Coral</strong> - ดีสำหรับข้อความรอง (64.5% lightness)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span><strong className="text-intent">Intent Blue</strong> - ใช้สำหรับข้อความใหญ่เท่านั้น (48.8% lightness)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Palettes */}
      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-cinema-tertiary/50">
          <TabsTrigger value="core" className="data-[state=active]:bg-intent/30">
            🎯 Core Colors
          </TabsTrigger>
          <TabsTrigger value="cinema" className="data-[state=active]:bg-experience/30">
            🎬 Cinema UI
          </TabsTrigger>
          <TabsTrigger value="ffz" className="data-[state=active]:bg-story/30">
            🎓 FFZ Education
          </TabsTrigger>
          <TabsTrigger value="cultural" className="data-[state=active]:bg-verification/30">
            🌍 Cultural Auth
          </TabsTrigger>
        </TabsList>

        {Object.entries(colorSystem).map(([key, palette]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl text-cinema-foreground">{palette.title}</h2>
              <p className="text-cinema-muted max-w-2xl mx-auto">{palette.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {palette.colors.map((color) => (
                <ColorCard key={color.id} color={color} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Implementation Guide */}
      <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cinema-foreground flex items-center gap-2">
            <Code className="w-5 h-5" />
            การใช้งานใน Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-cinema-foreground">Tailwind Classes:</h4>
              <div className="bg-cinema-deep p-4 rounded-lg space-y-2 text-sm">
                <div><code className="text-story">text-story</code> - สำหรับข้อความสำคัญ</div>
                <div><code className="text-experience">text-experience</code> - สำหรับ interactive elements</div>
                <div><code className="text-community">text-community</code> - สำหรับข้อความรอง</div>
                <div><code className="text-verification">text-verification</code> - สำหรับ verification</div>
                <div><code className="text-intent">text-intent</code> - สำหรับ AI features</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-cinema-foreground">CSS Variables:</h4>
              <div className="bg-cinema-deep p-4 rounded-lg space-y-2 text-sm">
                <div><code className="text-story">var(--story-orange)</code> - Primary text color</div>
                <div><code className="text-experience">var(--experience-cyan)</code> - Interactive color</div>
                <div><code className="text-community">var(--community-coral)</code> - Community features</div>
                <div><code className="text-verification">var(--verification-purple)</code> - Security elements</div>
                <div><code className="text-intent">var(--intent-blue)</code> - AI intelligence</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-cinema-foreground">React Component Example:</h4>
            <div className="bg-cinema-deep p-4 rounded-lg">
              <pre className="text-sm text-cinema-muted font-mono overflow-x-auto">
{`// ✅ ใช้ Story Orange สำหรับข้อความสำคัญ
<h2 className="text-story text-xl font-semibold">
  Important Heading
</h2>

// ✅ ใช้ Experience Cyan สำหรับ interactive elements  
<button className="bg-experience hover:bg-experience/80 text-white">
  Interactive Button
</button>

// ✅ ใช้ Community Coral สำหรับ secondary text
<p className="text-community text-sm">
  Secondary information
</p>

// ⚠️ ใช้ Intent Blue สำหรับ large text เท่านั้น
<h1 className="text-intent text-4xl font-bold">
  Large AI Feature Title
</h1>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ColorSystemDocumentation;
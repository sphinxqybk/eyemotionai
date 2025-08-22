import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function TransparencyEffectsDemo() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const transparencyEffects = [
    {
      id: 'glass-morphism',
      name: 'Glass Morphism',
      description: 'เอฟเฟกต์กระจกฝ้าแบบ iOS/macOS',
      className: 'backdrop-blur-sm bg-white/10 border border-white/20',
      code: 'backdrop-blur-sm bg-white/10 border-white/20',
      category: 'glass'
    },
    {
      id: 'alpha-transparency',
      name: 'Alpha Transparency',
      description: 'ความโปร่งใสด้วย alpha channel',
      className: 'bg-intent/30 border border-intent/50',
      code: 'bg-intent/30 border-intent/50',
      category: 'alpha'
    },
    {
      id: 'frosted-glass',
      name: 'Frosted Glass',
      description: 'กระจกฝ้าแบบขุ่น มีความสว่าง',
      className: 'backdrop-blur-md backdrop-brightness-110 bg-white/5 border border-white/30',
      code: 'backdrop-blur-md backdrop-brightness-110 bg-white/5',
      category: 'glass'
    },
    {
      id: 'gradient-overlay',
      name: 'Gradient Overlay',
      description: 'ชั้นโปร่งใสไล่สีทับซ้อน',
      className: 'bg-gradient-to-r from-intent/20 via-experience/30 to-verification/25 border border-white/20',
      code: 'from-intent/20 via-experience/30 to-verification/25',
      category: 'gradient'
    },
    {
      id: 'ecosystem-transparency',
      name: 'Ecosystem Transparency',
      description: 'ความโปร่งใสด้วยสี ecosystem',
      className: 'bg-experience/25 border border-experience/40 backdrop-blur-sm',
      code: 'bg-experience/25 border-experience/40 backdrop-blur-sm',
      category: 'ecosystem'
    },
    {
      id: 'multi-layer-glass',
      name: 'Multi-Layer Glass',
      description: 'กระจกหลายชั้นซ้อนทับ',
      className: 'backdrop-blur-lg bg-gradient-to-br from-white/15 to-white/5 border border-white/25',
      code: 'backdrop-blur-lg from-white/15 to-white/5 border-white/25',
      category: 'glass'
    },
    {
      id: 'neon-transparency',
      name: 'Neon Transparency',
      description: 'ความโปร่งใสแบบ neon glow',
      className: 'bg-story/20 border border-story/60 shadow-lg shadow-story/30',
      code: 'bg-story/20 border-story/60 shadow-story/30',
      category: 'neon'
    },
    {
      id: 'cinema-smoke',
      name: 'Cinema Smoke',
      description: 'เอฟเฟกต์ควันแบบ cinematic',
      className: 'bg-gradient-radial from-cinema-muted/20 to-transparent backdrop-blur-sm',
      code: 'bg-gradient-radial from-cinema-muted/20 to-transparent',
      category: 'cinema'
    }
  ];

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '🌟' },
    { id: 'glass', name: 'Glass Morphism', icon: '💎' },
    { id: 'alpha', name: 'Alpha Transparency', icon: '🌊' },
    { id: 'gradient', name: 'Gradient Overlay', icon: '🌈' },
    { id: 'ecosystem', name: 'Ecosystem Colors', icon: '🎨' },
    { id: 'neon', name: 'Neon Effects', icon: '✨' },
    { id: 'cinema', name: 'Cinema Effects', icon: '🎬' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredEffects = activeCategory === 'all' 
    ? transparencyEffects 
    : transparencyEffects.filter(effect => effect.category === activeCategory);

  return (
    <div className="page-standard min-h-screen relative overflow-hidden">
      {/* Beautiful Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-deep via-cinema-secondary to-cinema-deep"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-intent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-experience/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-verification/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-gradient-ecosystem text-4xl md:text-5xl">
            💎 Transparency Effects Demo
          </h1>
          <p className="text-cinema-muted max-w-3xl mx-auto text-lg">
            เอฟเฟกต์ความโปร่งใสและ Glass Morphism ในระบบ EyeMotion - 
            ทดลองคลิกดูเอฟเฟกต์ต่างๆ ที่ใช้ในการออกแบบ Professional UI
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-cinema-tertiary/50 backdrop-blur-sm">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-intent/30 data-[state=active]:text-cinema-foreground text-sm"
              >
                <span className="mr-1">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-6">
            {/* Grid of Effect Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEffects.map((effect) => (
                <Card 
                  key={effect.id}
                  className="cursor-pointer hover:scale-105 transition-all duration-300 bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm"
                  onClick={() => setSelectedEffect(effect.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-cinema-foreground">
                      <span>{effect.name}</span>
                      <Badge variant="secondary" className="bg-intent/20 text-intent border-intent/40">
                        CSS
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-cinema-muted">
                      {effect.description}
                    </p>
                    
                    {/* Preview Box with Effect */}
                    <div className="relative h-24 bg-gradient-to-br from-story/30 via-experience/20 to-verification/30 rounded-lg overflow-hidden">
                      <div 
                        className={`
                          w-full h-full rounded-lg flex items-center justify-center
                          ${effect.className}
                        `}
                      >
                        <span className="text-cinema-foreground font-mono text-sm font-medium">
                          Preview
                        </span>
                      </div>
                    </div>

                    <div className="bg-cinema-deep/80 p-3 rounded-md backdrop-blur-sm">
                      <code className="text-xs text-experience font-mono break-all">
                        {effect.code}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Full Dialog Demo */}
        <Dialog 
          open={!!selectedEffect} 
          onOpenChange={() => setSelectedEffect(null)}
        >
          <DialogContent 
            className="max-w-2xl mx-auto bg-cinema-secondary/90 backdrop-blur-xl border-cinema-tertiary"
          >
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-cinema-foreground text-2xl">
                💎 {selectedEffect ? transparencyEffects.find(e => e.id === selectedEffect)?.name : 'Transparency Demo'}
              </DialogTitle>
              <DialogDescription className="text-cinema-muted text-lg">
                {selectedEffect ? transparencyEffects.find(e => e.id === selectedEffect)?.description : ''}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {selectedEffect && (
                <div className="space-y-6">
                  {/* Large Preview */}
                  <div className="relative h-32 bg-gradient-to-br from-story/40 via-experience/30 to-verification/40 rounded-xl overflow-hidden">
                    <div 
                      className={`
                        w-full h-full rounded-xl flex items-center justify-center
                        ${transparencyEffects.find(e => e.id === selectedEffect)?.className}
                      `}
                    >
                      <span className="text-cinema-foreground font-mono text-lg font-medium">
                        {transparencyEffects.find(e => e.id === selectedEffect)?.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-intent text-lg">🎨 เอฟเฟกต์นี้ใช้งานอย่างไร?</h4>
                    
                    <div className="bg-cinema-deep/80 p-4 rounded-lg backdrop-blur-sm space-y-3">
                      <p className="text-sm text-cinema-muted">
                        การใช้งาน CSS Classes:
                      </p>
                      <code className="block text-experience font-mono text-sm p-3 bg-cinema-tertiary/50 rounded border border-experience/30">
                        className="{transparencyEffects.find(e => e.id === selectedEffect)?.code}"
                      </code>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-cinema-muted">
                        <strong className="text-story">🔧 หลักการทำงาน:</strong>
                      </p>
                      <div className="bg-cinema-tertiary/30 p-4 rounded-lg backdrop-blur-sm">
                        <ul className="text-sm text-cinema-muted space-y-2 ml-4">
                          {selectedEffect === 'glass-morphism' && (
                            <>
                              <li>• <strong className="text-experience">backdrop-blur-sm</strong> - สร้างเอฟเฟกต์เบลอพื้นหลัง</li>
                              <li>• <strong className="text-verification">bg-white/10</strong> - พื้นหลังสีขาวโปร่งใส 10%</li>
                              <li>• <strong className="text-story">border-white/20</strong> - ขอบสีขาวโปร่งใส 20%</li>
                              <li>• ใช้สำหรับ Modern UI แบบ iOS/macOS</li>
                            </>
                          )}
                          {selectedEffect === 'alpha-transparency' && (
                            <>
                              <li>• <strong className="text-intent">bg-intent/30</strong> - พื้นหลังสี Intent Blue โปร่งใส 30%</li>
                              <li>• <strong className="text-experience">Alpha Channel</strong> - ตัวเลขหลัง / คือ % ความโปร่งใส</li>
                              <li>• <strong className="text-verification">Compatible</strong> - ทำงานกับสีทุกสีใน EyeMotion ecosystem</li>
                              <li>• เหมาะสำหรับ overlay และ highlight</li>
                            </>
                          )}
                          {selectedEffect === 'frosted-glass' && (
                            <>
                              <li>• <strong className="text-experience">backdrop-blur-md</strong> - เบลอระดับกลาง</li>
                              <li>• <strong className="text-story">backdrop-brightness-110</strong> - เพิ่มความสว่าง 110%</li>
                              <li>• <strong className="text-verification">bg-white/5</strong> - พื้นหลังขาวโปร่งใสน้อยมาก</li>
                              <li>• สร้างเอฟเฟกต์กระจกฝ้าแบบ premium</li>
                            </>
                          )}
                          {selectedEffect === 'gradient-overlay' && (
                            <>
                              <li>• <strong className="text-intent">from-intent/20</strong> - เริ่มต้นด้วยสีฟ้าโปร่งใส</li>
                              <li>• <strong className="text-experience">via-experience/30</strong> - ผ่านสี cyan โปร่งใส</li>
                              <li>• <strong className="text-verification">to-verification/25</strong> - จบด้วยสีม่วงโปร่งใส</li>
                              <li>• สร้างการไล่สีแบบ multi-color transparency</li>
                            </>
                          )}
                          {selectedEffect === 'ecosystem-transparency' && (
                            <>
                              <li>• ใช้สีจาก <strong className="text-experience">EyeMotion Ecosystem</strong></li>
                              <li>• <strong className="text-experience">bg-experience/25</strong> - พื้นหลัง Experience Cyan 25%</li>
                              <li>• <strong className="text-experience">border-experience/40</strong> - ขอบสีเดียวกันเข้มขึ้น</li>
                              <li>• รักษา brand identity ในความโปร่งใส</li>
                            </>
                          )}
                          {selectedEffect === 'multi-layer-glass' && (
                            <>
                              <li>• <strong className="text-experience">backdrop-blur-lg</strong> - เบลอระดับสูง</li>
                              <li>• <strong className="text-story">gradient</strong> - ไล่สีจากขาวเข้มไปอ่อน</li>
                              <li>• <strong className="text-verification">border-white/25</strong> - ขอบขาวโปร่งใส</li>
                              <li>• เอฟเฟกต์กระจกหลายชั้นซ้อนทับ</li>
                            </>
                          )}
                          {selectedEffect === 'neon-transparency' && (
                            <>
                              <li>• <strong className="text-story">bg-story/20</strong> - พื้นหลังสี Story Orange โปร่งใส</li>
                              <li>• <strong className="text-story">border-story/60</strong> - ขอบสีเดียวกันเข้มขึ้น</li>
                              <li>• <strong className="text-story">shadow-story/30</strong> - เงาสีเดียวกันโปร่งใส</li>
                              <li>• สร้างเอฟเฟกต์ neon glow แบบ futuristic</li>
                            </>
                          )}
                          {selectedEffect === 'cinema-smoke' && (
                            <>
                              <li>• <strong className="text-cinema-muted">bg-gradient-radial</strong> - ไล่สีแบบวงกลม</li>
                              <li>• <strong className="text-cinema-muted">from-cinema-muted/20</strong> - เริ่มจากสีเทาโปร่งใส</li>
                              <li>• <strong className="text-cinema-foreground">to-transparent</strong> - จบด้วยความโปร่งใสสมบูรณ์</li>
                              <li>• เอฟเฟกต์ควันแบบ cinematic สำหรับ film industry</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setSelectedEffect(null)}
                      variant="outline"
                      className="flex-1 border-cinema-tertiary text-cinema-foreground hover:bg-cinema-tertiary/50 backdrop-blur-sm"
                    >
                      ปิด
                    </Button>
                    <Button 
                      onClick={() => {
                        const currentIndex = transparencyEffects.findIndex(e => e.id === selectedEffect);
                        const nextIndex = (currentIndex + 1) % transparencyEffects.length;
                        setSelectedEffect(transparencyEffects[nextIndex].id);
                      }}
                      className="flex-1 bg-intent/80 hover:bg-intent backdrop-blur-sm"
                    >
                      เอฟเฟกต์ถัดไป
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* CSS Reference */}
        <Card className="bg-cinema-secondary/50 border-cinema-tertiary backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cinema-foreground text-2xl">
              🎨 Transparency CSS Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alpha Transparency */}
              <div className="space-y-3">
                <h4 className="text-intent">🌊 Alpha Transparency Values</h4>
                <div className="space-y-2">
                  {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90].map(opacity => (
                    <div key={opacity} className="flex items-center gap-3">
                      <div 
                        className={`w-8 h-8 rounded border border-white/30`}
                        style={{ backgroundColor: `oklch(0.488 0.243 264.376 / ${opacity / 100})` }}
                      />
                      <code className="text-experience font-mono text-sm">
                        bg-intent/{opacity}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backdrop Effects */}
              <div className="space-y-3">
                <h4 className="text-experience">💎 Backdrop Effects</h4>
                <div className="space-y-2 text-sm text-cinema-muted">
                  <div><code className="text-verification">backdrop-blur-none</code> - ไม่เบลอ</div>
                  <div><code className="text-verification">backdrop-blur-sm</code> - เบลอเล็กน้อย (4px)</div>
                  <div><code className="text-verification">backdrop-blur</code> - เบลอปกติ (8px)</div>
                  <div><code className="text-verification">backdrop-blur-md</code> - เบลอระดับกลาง (12px)</div>
                  <div><code className="text-verification">backdrop-blur-lg</code> - เบลอมาก (16px)</div>
                  <div><code className="text-verification">backdrop-blur-xl</code> - เบลอมากที่สุด (24px)</div>
                  <div className="mt-3 pt-3 border-t border-cinema-tertiary">
                    <div><code className="text-story">backdrop-brightness-50</code> - ลดความสว่าง</div>
                    <div><code className="text-story">backdrop-brightness-110</code> - เพิ่มความสว่าง</div>
                    <div><code className="text-story">backdrop-saturate-150</code> - เพิ่มความเข้มสี</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cinema-deep/80 rounded-lg backdrop-blur-sm">
              <h4 className="text-intent mb-3">📝 การใช้งานใน React Component:</h4>
              <pre className="text-xs text-cinema-muted font-mono overflow-x-auto">
{`{/* Glass Morphism Card */}
<div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-6">
  <h3>Glass Card</h3>
</div>

{/* Alpha Transparency Button */}
<button className="bg-intent/30 hover:bg-intent/50 border border-intent/60">
  Transparent Button
</button>

{/* Gradient Overlay */}
<div className="bg-gradient-to-r from-intent/20 via-experience/30 to-verification/25">
  Gradient Overlay
</div>

{/* Multi-layer Glass */}
<div className="backdrop-blur-lg bg-gradient-to-br from-white/15 to-white/5 border border-white/25">
  Advanced Glass Effect
</div>`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add default export for lazy loading
export default TransparencyEffectsDemo;
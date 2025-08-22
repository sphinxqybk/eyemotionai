import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function DialogLightEffectsDemo() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const lightEffects = [
    {
      id: 'border-glow',
      name: 'Border Glow',
      description: 'เส้นขอบเรืองแสงไล่สีอัตโนมัติ',
      className: 'dialog-border-glow',
      code: 'className="dialog-border-glow"'
    },
    {
      id: 'gradient-border',
      name: 'Gradient Border',
      description: 'ขอบไล่สีแบบเคลื่อนไหว',
      className: 'dialog-gradient-border',
      code: 'className="dialog-gradient-border"'
    },
    {
      id: 'edge-light',
      name: 'Edge Light',
      description: 'แสงขอบแบบ inset + outer glow',
      className: 'dialog-edge-light',
      code: 'className="dialog-edge-light"'
    },
    {
      id: 'light-sweep',
      name: 'Light Sweep',
      description: 'แสงกวาดผ่านแนวนอน',
      className: 'dialog-light-sweep',
      code: 'className="dialog-light-sweep"'
    },
    {
      id: 'subtle-glow',
      name: 'Subtle Glow',
      description: 'เรืองแสงอ่อนๆ มีระดับ',
      className: 'dialog-subtle-glow',
      code: 'className="dialog-subtle-glow"'
    },
    {
      id: 'cinema-border',
      name: 'Cinema Border',
      description: 'ขอบแบบ Cinema Professional',
      className: 'dialog-cinema-border',
      code: 'className="dialog-cinema-border"'
    },
    {
      id: 'ecosystem-glow',
      name: 'Ecosystem Glow',
      description: 'เรืองแสงหลายชั้นแบบ EyeMotion',
      className: 'dialog-ecosystem-glow',
      code: 'className="dialog-ecosystem-glow"'
    }
  ];

  return (
    <div className="page-standard p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-gradient-ecosystem">
          🌟 Dialog Light Effects Demo
        </h1>
        <p className="text-cinema-muted max-w-2xl mx-auto">
          เอฟเฟกต์เส้นแสงสำหรับ Dialog Components ในระบบ EyeMotion - 
          ทดลองคลิกดูเอฟเฟกต์ต่างๆ ที่ใช้ในการออกแบบ Professional UI
        </p>
      </div>

      {/* Grid of Effect Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lightEffects.map((effect) => (
          <Card 
            key={effect.id}
            className="cursor-pointer hover:scale-105 transition-all duration-300 bg-cinema-secondary border-cinema-tertiary"
            onClick={() => setSelectedEffect(effect.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-cinema-foreground">{effect.name}</span>
                <Badge variant="secondary" className="bg-intent/20 text-intent border-intent/40">
                  CSS
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-cinema-muted">
                {effect.description}
              </p>
              
              {/* Preview Box */}
              <div className="relative">
                <div 
                  className={`
                    w-full h-20 bg-cinema-tertiary rounded-lg flex items-center justify-center
                    ${effect.className}
                  `}
                >
                  <span className="text-xs text-cinema-foreground font-mono">
                    Preview
                  </span>
                </div>
              </div>

              <div className="bg-cinema-deep p-3 rounded-md">
                <code className="text-xs text-experience font-mono">
                  {effect.code}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Dialog Demo */}
      <Dialog 
        open={!!selectedEffect} 
        onOpenChange={() => setSelectedEffect(null)}
      >
        <DialogContent 
          className={`
            max-w-md mx-auto bg-cinema-secondary border-none
            ${selectedEffect ? lightEffects.find(e => e.id === selectedEffect)?.className : ''}
          `}
        >
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-cinema-foreground">
              🎬 {selectedEffect ? lightEffects.find(e => e.id === selectedEffect)?.name : 'Dialog Demo'}
            </DialogTitle>
            <DialogDescription className="text-cinema-muted">
              {selectedEffect ? lightEffects.find(e => e.id === selectedEffect)?.description : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-intent">เอฟเฟกต์นี้ใช้งานอย่างไร?</h4>
              
              <div className="bg-cinema-deep p-4 rounded-lg space-y-3">
                <p className="text-sm text-cinema-muted">
                  การใช้งาน CSS Class:
                </p>
                <code className="block text-experience font-mono text-sm">
                  {selectedEffect ? lightEffects.find(e => e.id === selectedEffect)?.code : ''}
                </code>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-cinema-muted">
                  <strong className="text-story">หลักการทำงาน:</strong>
                </p>
                <ul className="text-sm text-cinema-muted space-y-1 ml-4">
                  {selectedEffect === 'border-glow' && (
                    <>
                      <li>• ใช้ @keyframes สำหรับเปลี่ยนสี border</li>
                      <li>• box-shadow เพื่อสร้างเอฟเฟกต์เรืองแสง</li>
                      <li>• วนซ้ำผ่านสีต่างๆ ของ EyeMotion ecosystem</li>
                    </>
                  )}
                  {selectedEffect === 'gradient-border' && (
                    <>
                      <li>• ใช้ linear-gradient เป็น background</li>
                      <li>• เคลื่อนไหว background-position</li>
                      <li>• padding วิธีการสร้าง border gradient</li>
                    </>
                  )}
                  {selectedEffect === 'edge-light' && (
                    <>
                      <li>• รวม inset และ outer box-shadow</li>
                      <li>• เปลี่ยนขนาดและสีตาม keyframes</li>
                      <li>• สร้างเอฟเฟกต์แสงภายในและภายนอก</li>
                    </>
                  )}
                  {selectedEffect === 'light-sweep' && (
                    <>
                      <li>• ใช้ ::before pseudo-element</li>
                      <li>• เคลื่อนไหว background-position แนวนอน</li>
                      <li>• opacity และ pointer-events ป้องกันการคลิก</li>
                    </>
                  )}
                  {selectedEffect === 'subtle-glow' && (
                    <>
                      <li>• box-shadow ธรรมดาไม่เคลื่อนไหว</li>
                      <li>• inset shadow เพื่อความลึก</li>
                      <li>• เหมาะสำหรับ UI ที่ต้องการความเรียบร้อย</li>
                    </>
                  )}
                  {selectedEffect === 'cinema-border' && (
                    <>
                      <li>• ใช้สี cinema-border เป็นฐาน</li>
                      <li>• เพิ่ม intent-blue เป็น accent</li>
                      <li>• box-shadow แบบมีระดับความลึก</li>
                    </>
                  )}
                  {selectedEffect === 'ecosystem-glow' && (
                    <>
                      <li>• หลายชั้น box-shadow สีต่างกัน</li>
                      <li>• gradient border แบบ padding-box</li>
                      <li>• ใช้สีครบของ EyeMotion ecosystem</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setSelectedEffect(null)}
                variant="outline"
                className="flex-1 border-cinema-tertiary text-cinema-foreground hover:bg-cinema-tertiary"
              >
                ปิด
              </Button>
              <Button 
                onClick={() => {
                  const currentIndex = lightEffects.findIndex(e => e.id === selectedEffect);
                  const nextIndex = (currentIndex + 1) % lightEffects.length;
                  setSelectedEffect(lightEffects[nextIndex].id);
                }}
                className="flex-1 bg-intent hover:bg-intent/80"
              >
                เอฟเฟกต์ถัดไป
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS Reference */}
      <Card className="bg-cinema-secondary border-cinema-tertiary">
        <CardHeader>
          <CardTitle className="text-cinema-foreground">
            🎨 CSS Classes Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lightEffects.map((effect) => (
              <div key={effect.id} className="bg-cinema-deep p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-cinema-foreground">
                    {effect.name}
                  </span>
                  <Badge variant="secondary" className="text-xs bg-verification/20 text-verification">
                    CSS
                  </Badge>
                </div>
                <code className="text-xs text-experience font-mono">
                  .{effect.className.replace(' ', '.')}
                </code>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-cinema-deep rounded-lg">
            <h4 className="text-intent mb-3">📝 การใช้งานใน React Component:</h4>
            <pre className="text-xs text-cinema-muted font-mono overflow-x-auto">
{`<Dialog>
  <DialogContent className="dialog-border-glow">
    {/* Dialog content */}
  </DialogContent>
</Dialog>

<Card className="dialog-gradient-border">
  {/* Card content */}
</Card>

<div className="dialog-light-sweep">
  {/* Any element */}
</div>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add default export for lazy loading
export default DialogLightEffectsDemo;
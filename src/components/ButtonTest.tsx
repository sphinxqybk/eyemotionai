import React from 'react';
import { EcosystemButtons } from './EcosystemButtons';

interface ButtonTestProps {
  language: 'th' | 'en';
}

export function ButtonTest({ language }: ButtonTestProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="space-y-8 text-center">
        <h1 className="homepage-display text-gradient-ecosystem">
          {language === 'th' ? 'ทดสอบปุ่ม EyeMotion' : 'EyeMotion Button Test'}
        </h1>
        
        <p className="homepage-body text-muted-foreground">
          {language === 'th' 
            ? 'ทดสอบการแสดงผลและการทำงานของปุ่ม EyeMotion Ecosystem'
            : 'Testing EyeMotion Ecosystem button display and functionality'
          }
        </p>
        
        <EcosystemButtons 
          language={language}
          onEnterEcosystem={() => {
            alert(language === 'th' ? 'เข้าสู่ระบบนิเวศ!' : 'Enter Ecosystem!');
          }}
          onEcosystemDemo={() => {
            alert(language === 'th' ? 'ทดลองใช้ระบบ!' : 'Ecosystem Demo!');
          }}
        />
        
        <div className="flex gap-4 justify-center">
          <div className="w-4 h-4 bg-intent rounded-full" />
          <div className="w-4 h-4 bg-experience rounded-full" />
          <div className="w-4 h-4 bg-story rounded-full" />
          <div className="w-4 h-4 bg-verification rounded-full" />
          <div className="w-4 h-4 bg-community rounded-full" />
        </div>
        
        <p className="text-sm text-muted-foreground">
          {language === 'th' 
            ? 'หากคุณเห็นปุ่มและสีข้างบน แสดงว่าระบบทำงานปกติ'
            : 'If you can see the buttons and colors above, the system is working correctly'
          }
        </p>
      </div>
    </div>
  );
}
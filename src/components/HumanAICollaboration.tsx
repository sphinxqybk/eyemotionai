import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  User, 
  Zap, 
  Eye, 
  Film, 
  Scissors, 
  Palette, 
  Target,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Users,
  Lightbulb,
  Cpu,
  Heart,
  FileText,
  Layers,
  Shield,
  BookOpen,
  Camera,
  Wand2,
  Volume2,
  Gamepad2,
  Database,
  Search,
  Settings,
  Verified
} from 'lucide-react';

interface Language {
  language: 'th' | 'en';
}

interface EcosystemStep {
  id: string;
  category: 'foundation' | 'creative' | 'production' | 'verification';
  human: {
    icon: React.ComponentType<{ className?: string }>;
    title: { th: string; en: string };
    description: { th: string; en: string };
    philosophy: { th: string; en: string };
    color: string;
  };
  ai: {
    icon: React.ComponentType<{ className?: string }>;
    title: { th: string; en: string };
    description: { th: string; en: string };
    system: { th: string; en: string };
    color: string;
  };
  result: {
    title: { th: string; en: string };
    benefit: { th: string; en: string };
    improvement: string;
    workflow: { th: string; en: string };
  };
}

const ecosystemSteps: EcosystemStep[] = [
  {
    id: 'black-frame-philosophy',
    category: 'foundation',
    human: {
      icon: Lightbulb,
      title: { th: 'Black Frame Philosophy', en: 'Black Frame Philosophy' },
      description: { th: 'เริ่มจากสิ่งเดียว - คำ, ภาพ, เสียง, สี หรือแสง', en: 'Start with one element - word, image, sound, color, or light' },
      philosophy: { th: 'ปรัชญาการสร้างสรรค์จากประสบการณ์ชีวิตจริง', en: 'Creative philosophy from real life experience' },
      color: 'oklch(0.769 0.188 70.08)'
    },
    ai: {
      icon: Brain,
      title: { th: 'Intent-Aware AI', en: 'Intent-Aware AI' },
      description: { th: 'AI ที่เข้าใจเจตนาและขยาย narrative อัตโนมัติ', en: 'AI that understands intent and grows narrative intelligently' },
      system: { th: 'ระบบ Intent Recognition + FFZ Framework', en: 'Intent Recognition + FFZ Framework System' },
      color: 'oklch(0.488 0.243 264.376)'
    },
    result: {
      title: { th: 'จากจุดเริ่มต้นสู่วิสัยทัศน์ที่สมบูรณ์', en: 'From Single Seed to Complete Vision' },
      benefit: { th: 'ประหยัดเวลาคิดและวางแผน 80%', en: '80% faster conceptualization and planning' },
      improvement: '80%',
      workflow: { th: 'Black Frame → Intent Analysis → Narrative Growth', en: 'Black Frame → Intent Analysis → Narrative Growth' }
    }
  },
  {
    id: 'ffz-education-system',
    category: 'foundation',
    human: {
      icon: BookOpen,
      title: { th: 'Film From Zero (FFZ)', en: 'Film From Zero (FFZ)' },
      description: { th: 'โรงเรียนสอนหนัง + กรอบภาษาภาพยนตร์', en: 'Film school + cinematic language framework' },
      philosophy: { th: 'การศึกษาที่ผสานจริยธรรมและเทคนิค', en: 'Education integrating ethics and technique' },
      color: 'oklch(0.645 0.246 16.439)'
    },
    ai: {
      icon: Database,
      title: { th: 'Intent-Based Language System', en: 'Intent-Based Language System' },
      description: { th: 'ระบบภาษาที่ฝัง intent และจริยธรรมในทุก metadata', en: 'Language system embedding intent and ethics in all metadata' },
      system: { th: 'FFZ Curriculum + AI Integration', en: 'FFZ Curriculum + AI Integration' },
      color: 'oklch(0.645 0.246 16.439)'
    },
    result: {
      title: { th: 'การศึกษาที่ผสานกับการผลิต', en: 'Education Integrated with Production' },
      benefit: { th: 'ลดเวลาเรียนรู้เครื่องมือ 70%', en: '70% faster tool mastery' },
      improvement: '70%',
      workflow: { th: 'Foundation → Core → Specialization → Production', en: 'Foundation → Core → Specialization → Production' }
    }
  },
  {
    id: 'creative-workspace',
    category: 'creative',
    human: {
      icon: FileText,
      title: { th: 'Director Lab / ScriptBridge', en: 'Director Lab / ScriptBridge' },
      description: { th: 'เริ่มจากไหนก็ได้ - Script, Storyboard, Scene', en: 'Start anywhere - Script, Storyboard, Scene' },
      philosophy: { th: 'ความยืดหยุ่นในกระบวนการสร้างสรรค์', en: 'Flexibility in creative process' },
      color: 'oklch(0.627 0.265 303.9)'
    },
    ai: {
      icon: Layers,
      title: { th: 'CineStory Studio™', en: 'CineStory Studio™' },
      description: { th: 'ห้องสมุดโปรเจ็กต์ + AI labeling + hover preview', en: 'Project library + AI labeling + hover preview' },
      system: { th: 'Multi-project Management + Metadata AI', en: 'Multi-project Management + Metadata AI' },
      color: 'oklch(0.645 0.246 16.439)'
    },
    result: {
      title: { th: 'Creative Workspace ที่ปรับตัวได้', en: 'Adaptive Creative Workspace' },
      benefit: { th: 'ระบบเติมช่องว่างให้อัตโนมัติ', en: 'System automatically fills in gaps' },
      improvement: '5x',
      workflow: { th: 'Any Start Point → ScriptBridge → CineStory Studio™', en: 'Any Start Point → ScriptBridge → CineStory Studio™' }
    }
  },
  {
    id: 'cineeditai-core',
    category: 'production',
    human: {
      icon: Film,
      title: { th: 'Creative Vision & Arc Logic', en: 'Creative Vision & Arc Logic' },
      description: { th: 'ผู้กำกับกำหนดอารมณ์ rise → peak → fall', en: 'Director defines emotional rise → peak → fall' },
      philosophy: { th: 'การควบคุมอารมณ์และจังหวะ', en: 'Emotional and rhythm control' },
      color: 'oklch(0.696 0.17 162.48)'
    },
    ai: {
      icon: Scissors,
      title: { th: 'CineEditAI Core Engine', en: 'CineEditAI Core Engine' },
      description: { th: 'Auto-Cut + CineTone + CineAudioLayer + Arc System', en: 'Auto-Cut + CineTone + CineAudioLayer + Arc System' },
      system: { th: 'Multi-signal Fusion + Context-aware Rules', en: 'Multi-signal Fusion + Context-aware Rules' },
      color: 'oklch(0.696 0.17 162.48)'
    },
    result: {
      title: { th: 'การตัดต่อแบบมืออาชีพอัตโนมัติ', en: 'Professional Automated Editing' },
      benefit: { th: 'ได้ผลลัพธ์ระดับมืออาชีพใน 1/10 เวลา', en: 'Professional results in 1/10th the time' },
      improvement: '1000%',
      workflow: { th: 'Ingest → Sync → Cut → Color → Audio → Export', en: 'Ingest → Sync → Cut → Color → Audio → Export' }
    }
  },
  {
    id: 'trust-verification',
    category: 'verification',
    human: {
      icon: Shield,
      title: { th: 'Ethical Clarity & Authenticity', en: 'Ethical Clarity & Authenticity' },
      description: { th: 'ความรับผิดชอบและความโปร่งใสในผลงาน', en: 'Responsibility and transparency in work' },
      philosophy: { th: 'การสร้างความเชื่อถือและยืนยันตัวตน', en: 'Building trust and identity verification' },
      color: 'oklch(0.488 0.243 264.376)'
    },
    ai: {
      icon: Verified,
      title: { th: 'TrustVault + EYEFingerprint™', en: 'TrustVault + EYEFingerprint™' },
      description: { th: 'ระบบยืนยันความถูกต้อง + บันทึกทุกขั้นตอน', en: 'Integrity verification system + complete step logging' },
      system: { th: 'Trust Logs + Metadata Verification', en: 'Trust Logs + Metadata Verification' },
      color: 'oklch(0.488 0.243 264.376)'
    },
    result: {
      title: { th: 'ผลงานที่มีการันตีความถูกต้อง', en: 'Guaranteed Authentic Masterpiece' },
      benefit: { th: 'สร้างความเชื่อถือ 100% พร้อมหลักฐาน', en: '100% trustworthy with complete proof' },
      improvement: '100%',
      workflow: { th: 'Every Step Logged → TrustVault → EYEFingerprint™', en: 'Every Step Logged → TrustVault → EYEFingerprint™' }
    }
  }
];

const hasachaiMethods = {
  th: [
    {
      icon: Eye,
      title: 'OffLine Mode',
      description: 'ความแม่นยำสูงสุดจากประสบการณ์ documentary',
      color: 'oklch(0.696 0.17 162.48)',
      benefit: 'ประมวลผลเต็มกำลัง'
    },
    {
      icon: Users,
      title: 'OnLine Mode', 
      description: 'ความร่วมมือและการปรับตัวแบบ real-time',
      color: 'oklch(0.488 0.243 264.376)',
      benefit: 'Collaborative + Adaptive'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'เรียนรู้สไตล์ใน 3 sessions พร้อมข้อเสนอทั้งที่ตรงและแตกต่าง',
      color: 'oklch(0.627 0.265 303.9)',
      benefit: '3 sessions = Style Mastery'
    },
    {
      icon: Target,
      title: 'Multi-signal Fusion',
      description: 'ผสาน audio, video, arc logic ด้วยบริบทแบบมืออาชีพ',
      color: 'oklch(0.769 0.188 70.08)',
      benefit: 'Context-aware Precision'
    }
  ],
  en: [
    {
      icon: Eye,
      title: 'OffLine Mode',
      description: 'Maximum precision from documentary field experience',
      color: 'oklch(0.696 0.17 162.48)',
      benefit: 'Full processing power'
    },
    {
      icon: Users,
      title: 'OnLine Mode',
      description: 'Real-time collaboration and adaptive suggestions',
      color: 'oklch(0.488 0.243 264.376)',
      benefit: 'Collaborative + Adaptive'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'Learns user style in 3 sessions, suggests matching and contrasting options',
      color: 'oklch(0.627 0.265 303.9)',
      benefit: '3 sessions = Style Mastery'
    },
    {
      icon: Target,
      title: 'Multi-signal Fusion',
      description: 'Combines audio, video, arc logic with professional context awareness',
      color: 'oklch(0.769 0.188 70.08)',
      benefit: 'Context-aware Precision'
    }
  ]
};

const realWorldTestimonials = {
  th: [
    {
      name: 'Hasachai (Founder)',
      role: 'Documentary Filmmaker',
      company: 'Field Production Expert',
      quote: 'ปีของการทำ documentary ในสภาวะที่หลากหลายทำให้เราเข้าใจว่า AI ต้องเป็นพันธมิตรที่เข้าใจบริบท ไม่ใช่แค่เครื่องมือ',
      improvement: 'จากประสบการณ์ชีวิตสู่ระบบ AI',
      philosophy: 'Black Frame Philosophy'
    },
    {
      name: 'อาจารย์สมชาย',
      role: 'FFZ Instructor',
      company: 'Film From Zero Academy',
      quote: 'ระบบ FFZ ที่ผสาน intent-based language ทำให้นักเรียนเข้าใจทั้งเทคนิคและจริยธรรมพร้อมกัน',
      improvement: 'การสอนที่มีประสิทธิภาพ 300%',
      philosophy: 'Education + Ethics'
    }
  ],
  en: [
    {
      name: 'Hasachai (Founder)',
      role: 'Documentary Filmmaker', 
      company: 'Field Production Expert',
      quote: 'Years of documentary work in diverse environments taught us that AI must be a context-aware partner, not just a tool',
      improvement: 'Life experience to AI system',
      philosophy: 'Black Frame Philosophy'
    },
    {
      name: 'Professor Chen',
      role: 'FFZ Instructor',
      company: 'Film From Zero Academy', 
      quote: 'FFZ system with intent-based language helps students understand both technique and ethics simultaneously',
      improvement: '300% more effective teaching',
      philosophy: 'Education + Ethics'
    }
  ]
};

const EcosystemStep = ({ 
  step, 
  language, 
  isActive, 
  index 
}: { 
  step: EcosystemStep; 
  language: 'th' | 'en'; 
  isActive: boolean;
  index: number;
}) => {
  const HumanIcon = step.human.icon;
  const AiIcon = step.ai.icon;

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'foundation': return 'oklch(0.769 0.188 70.08)';
      case 'creative': return 'oklch(0.645 0.246 16.439)';
      case 'production': return 'oklch(0.696 0.17 162.48)';
      case 'verification': return 'oklch(0.488 0.243 264.376)';
      default: return 'oklch(0.488 0.243 264.376)';
    }
  };

  const categoryColor = getCategoryColor(step.category);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      {/* Category Badge */}
      <div className="text-center mb-6">
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase"
          style={{
            backgroundColor: `${categoryColor}20`,
            color: categoryColor,
            border: `1px solid ${categoryColor}30`
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span>
            {step.category === 'foundation' && (language === 'th' ? 'รากฐาน' : 'Foundation')}
            {step.category === 'creative' && (language === 'th' ? 'ความคิดสร้างสรรค์' : 'Creative')}
            {step.category === 'production' && (language === 'th' ? 'การผลิต' : 'Production')}
            {step.category === 'verification' && (language === 'th' ? 'การยืนยัน' : 'Verification')}
          </span>
        </div>
      </div>

      {/* Connection Line */}
      {index < ecosystemSteps.length - 1 && (
        <div 
          className="absolute left-1/2 -bottom-12 w-0.5 h-20 -translate-x-1/2 z-0"
          style={{ 
            background: `linear-gradient(180deg, ${categoryColor}, ${getCategoryColor(ecosystemSteps[index + 1]?.category || 'foundation')})`
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center relative z-10">
        {/* Human Side - Philosophy */}
        <motion.div 
          className="md:col-span-3 p-6 rounded-xl border text-center"
          style={{
            backgroundColor: isActive ? `${step.human.color}10` : 'oklch(0.205 0 0 / 0.6)',
            borderColor: isActive ? step.human.color : 'oklch(0.269 0 0)'
          }}
          animate={{
            scale: isActive ? 1.02 : 1,
            backgroundColor: isActive ? `${step.human.color}15` : 'oklch(0.205 0 0 / 0.6)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${step.human.color}20` }}
          >
            <HumanIcon 
              className="w-8 h-8" 
              style={{ color: step.human.color }} 
            />
          </div>
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {step.human.title[language]}
          </h3>
          <p 
            className="text-sm font-medium leading-relaxed mb-3"
            style={{ color: 'oklch(0.708 0 0)' }}
          >
            {step.human.description[language]}
          </p>
          <div 
            className="text-xs font-bold px-3 py-1 rounded-lg"
            style={{
              backgroundColor: `${step.human.color}10`,
              color: step.human.color
            }}
          >
            {step.human.philosophy[language]}
          </div>
        </motion.div>

        {/* Collaboration Indicator */}
        <div className="md:col-span-1 flex justify-center">
          <motion.div
            className="relative"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <div 
              className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: categoryColor }}
            >
              <Zap 
                className="w-6 h-6" 
                style={{ color: categoryColor }} 
              />
            </div>
            {isActive && (
              <>
                <motion.div
                  className="absolute -inset-2 rounded-full border-2"
                  style={{ borderColor: categoryColor }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-4 rounded-full border"
                  style={{ borderColor: categoryColor }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
              </>
            )}
          </motion.div>
        </div>

        {/* AI Side - System */}
        <motion.div 
          className="md:col-span-3 p-6 rounded-xl border text-center"
          style={{
            backgroundColor: isActive ? `${step.ai.color}10` : 'oklch(0.205 0 0 / 0.6)',
            borderColor: isActive ? step.ai.color : 'oklch(0.269 0 0)'
          }}
          animate={{
            scale: isActive ? 1.02 : 1,
            backgroundColor: isActive ? `${step.ai.color}15` : 'oklch(0.205 0 0 / 0.6)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${step.ai.color}20` }}
          >
            <AiIcon 
              className="w-8 h-8" 
              style={{ color: step.ai.color }} 
            />
          </div>
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {step.ai.title[language]}
          </h3>
          <p 
            className="text-sm font-medium leading-relaxed mb-3"
            style={{ color: 'oklch(0.708 0 0)' }}
          >
            {step.ai.description[language]}
          </p>
          <div 
            className="text-xs font-bold px-3 py-1 rounded-lg"
            style={{
              backgroundColor: `${step.ai.color}10`,
              color: step.ai.color
            }}
          >
            {step.ai.system[language]}
          </div>
        </motion.div>
      </div>

      {/* Workflow Result */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="mt-8 p-6 rounded-xl border text-center"
            style={{
              backgroundColor: `${categoryColor}08`,
              borderColor: categoryColor
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <CheckCircle 
                className="w-6 h-6" 
                style={{ color: categoryColor }} 
              />
              <h4 
                className="text-xl font-bold"
                style={{ color: 'oklch(0.985 0 0)' }}
              >
                {step.result.title[language]}
              </h4>
            </div>
            <p 
              className="text-base font-medium mb-4"
              style={{ color: 'oklch(0.708 0 0)' }}
            >
              {step.result.benefit[language]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                <TrendingUp 
                  className="w-4 h-4" 
                  style={{ color: categoryColor }} 
                />
                <span 
                  className="text-sm font-bold"
                  style={{ color: categoryColor }}
                >
                  {language === 'th' ? 'ปรับปรุง' : 'Improved'} {step.result.improvement}
                </span>
              </div>
              <div 
                className="text-xs font-medium px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: 'oklch(0.269 0 0 / 0.5)',
                  color: 'oklch(0.708 0 0)'
                }}
              >
                {step.result.workflow[language]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function HumanAICollaboration({ language }: Language) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ecosystemSteps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'oklch(0.145 0 0)' }}>
        <div className="absolute inset-0">
          {/* Hasachai's Philosophy Ambient Lighting */}
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{ 
              backgroundColor: 'oklch(0.769 0.188 70.08 / 0.06)',
              top: '15%',
              left: '10%'
            }}
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.06, 0.12, 0.06] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{ 
              backgroundColor: 'oklch(0.488 0.243 264.376 / 0.05)',
              bottom: '15%',
              right: '10%'
            }}
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.05, 0.1, 0.05] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{ 
              backgroundColor: 'oklch(0.645 0.246 16.439 / 0.04)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.04, 0.08, 0.04] 
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border mb-8"
            style={{
              backgroundColor: 'oklch(0.205 0 0 / 0.8)',
              borderColor: 'oklch(0.269 0 0)'
            }}
          >
            <Eye 
              className="w-5 h-5" 
              style={{ color: 'oklch(0.769 0.188 70.08)' }} 
            />
            <span 
              className="text-sm font-bold tracking-wider uppercase"
              style={{ color: 'oklch(0.708 0 0)' }}
            >
              {language === 'th' ? 'Hasachai\'s Adaptive Visual Storytelling' : 'Hasachai\'s Adaptive Visual Storytelling'}
            </span>
          </div>

          <h2 
            className="text-4xl md:text-5xl font-black tracking-tight mb-6"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {language === 'th' ? 'จากประสบการณ์ชีวิต' : 'From Life Experience'}
            <br />
            <span style={{ color: 'oklch(0.769 0.188 70.08)' }}>
              {language === 'th' ? 'สู่ผลงานที่มีการันตี' : 'To Verified Masterpiece'}
            </span>
          </h2>
          
          <p 
            className="text-xl font-medium max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'oklch(0.708 0 0)' }}
          >
            {language === 'th' 
              ? 'ระบบนิเวศการเล่าเรื่องแบบปรับตัวได้ที่รวมประสบการณ์ชีวิต, กรอบการศึกษา FFZ และเครื่องมือแก้ไขระดับสูง เข้าด้วยกัน'
              : 'Adaptive Visual Storytelling & Verification Ecosystem that merges life experience, FFZ educational framework, and high-tech editing tools into one intent-driven workflow'
            }
          </p>
        </motion.div>

        {/* Ecosystem Workflow */}
        <div className="mb-20">
          <motion.div 
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 
              className="text-2xl font-black"
              style={{ color: 'oklch(0.985 0 0)' }}
            >
              {language === 'th' ? 'ระบบนิเวศที่สมบูรณ์' : 'Complete Ecosystem Workflow'}
            </h3>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all duration-300"
                style={{
                  backgroundColor: isAutoPlay ? 'oklch(0.769 0.188 70.08 / 0.1)' : 'oklch(0.205 0 0 / 0.6)',
                  borderColor: isAutoPlay ? 'oklch(0.769 0.188 70.08)' : 'oklch(0.269 0 0)',
                  color: isAutoPlay ? 'oklch(0.769 0.188 70.08)' : 'oklch(0.708 0 0)'
                }}
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">
                  {language === 'th' ? (isAutoPlay ? 'กำลังเล่น' : 'เล่นอัตโนมัติ') : (isAutoPlay ? 'Playing' : 'Auto Play')}
                </span>
              </button>

              <div className="flex gap-2">
                {ecosystemSteps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveStep(index);
                      setIsAutoPlay(false);
                    }}
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: activeStep === index 
                        ? 'oklch(0.769 0.188 70.08)' 
                        : 'oklch(0.269 0 0)'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <div className="space-y-20">
            {ecosystemSteps.map((step, index) => (
              <EcosystemStep
                key={step.id}
                step={step}
                language={language}
                isActive={activeStep === index}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Hasachai's Methods */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 
            className="text-3xl font-black text-center mb-12"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {language === 'th' ? 'วิธีการของ Hasachai' : 'Hasachai\'s Methods'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hasachaiMethods[language].map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl border text-center group"
                  style={{
                    backgroundColor: 'oklch(0.205 0 0 / 0.6)',
                    borderColor: 'oklch(0.269 0 0)'
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: method.color,
                    backgroundColor: `${method.color}08`
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${method.color}20` }}
                  >
                    <IconComponent 
                      className="w-8 h-8" 
                      style={{ color: method.color }} 
                    />
                  </div>
                  <h4 
                    className="text-lg font-bold mb-3"
                    style={{ color: 'oklch(0.985 0 0)' }}
                  >
                    {method.title}
                  </h4>
                  <p 
                    className="text-sm font-medium leading-relaxed mb-3"
                    style={{ color: 'oklch(0.708 0 0)' }}
                  >
                    {method.description}
                  </p>
                  <div 
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{
                      backgroundColor: `${method.color}15`,
                      color: method.color
                    }}
                  >
                    {method.benefit}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Real World Testimonials */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 
            className="text-3xl font-black text-center mb-12"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {language === 'th' ? 'เสียงจากผู้สร้างระบบ' : 'Voices from the Creators'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {realWorldTestimonials[language].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl border"
                style={{
                  backgroundColor: 'oklch(0.205 0 0 / 0.8)',
                  borderColor: 'oklch(0.269 0 0)'
                }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'oklch(0.769 0.188 70.08 / 0.2)' }}
                  >
                    <User 
                      className="w-6 h-6" 
                      style={{ color: 'oklch(0.769 0.188 70.08)' }} 
                    />
                  </div>
                  <div>
                    <h4 
                      className="text-lg font-bold"
                      style={{ color: 'oklch(0.985 0 0)' }}
                    >
                      {testimonial.name}
                    </h4>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: 'oklch(0.708 0 0)' }}
                    >
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>

                <blockquote 
                  className="text-base font-medium leading-relaxed mb-4 italic"
                  style={{ color: 'oklch(0.985 0 0)' }}
                >
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg"
                    style={{ backgroundColor: 'oklch(0.488 0.243 264.376 / 0.2)' }}
                  >
                    <Sparkles 
                      className="w-4 h-4" 
                      style={{ color: 'oklch(0.488 0.243 264.376)' }} 
                    />
                    <span 
                      className="text-sm font-bold"
                      style={{ color: 'oklch(0.488 0.243 264.376)' }}
                    >
                      {testimonial.improvement}
                    </span>
                  </div>
                  <div 
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{
                      backgroundColor: 'oklch(0.769 0.188 70.08 / 0.15)',
                      color: 'oklch(0.769 0.188 70.08)'
                    }}
                  >
                    {testimonial.philosophy}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 
            className="text-3xl font-black mb-6"
            style={{ color: 'oklch(0.985 0 0)' }}
          >
            {language === 'th' ? 'พร้อมเริ่มต้นระบบนิเวศแล้วหรือยัง?' : 'Ready to Start Your Ecosystem Journey?'}
          </h3>
          
          <p 
            className="text-lg font-medium max-w-2xl mx-auto mb-8"
            style={{ color: 'oklch(0.708 0 0)' }}
          >
            {language === 'th'
              ? 'สัมผัสประสบการณ์ระบบที่เริ่มจากจุดเดียวและเติบโตเป็นผลงานระดับมืออาชีพพร้อมการันตี เริ่มต้นทดลองใช้ฟรี 7 วัน'
              : 'Experience a system that starts from a single point and grows into professional, verified masterpieces. Start your 7-day free trial today'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, oklch(0.769 0.188 70.08), oklch(0.488 0.243 264.376), oklch(0.696 0.17 162.48))',
                color: 'white'
              }}
            >
              <Play className="w-5 h-5" />
              <span>{language === 'th' ? 'เริ่มจาก Black Frame' : 'Start from Black Frame'}</span>
            </button>
            
            <button
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border font-bold tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                borderColor: 'oklch(0.269 0 0)',
                color: 'oklch(0.985 0 0)',
                backgroundColor: 'oklch(0.769 0.188 70.08 / 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.769 0.188 70.08)';
                e.currentTarget.style.backgroundColor = 'oklch(0.769 0.188 70.08 / 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.269 0 0)';
                e.currentTarget.style.backgroundColor = 'oklch(0.769 0.188 70.08 / 0.1)';
              }}
            >
              <BookOpen className="w-5 h-5" />
              <span>{language === 'th' ? 'เรียนรู้ FFZ' : 'Learn FFZ'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import { 
  Heart, 
  Globe, 
  Leaf, 
  BookOpen, 
  GraduationCap,
  Droplets,
  Trees,
  Mountain,
  Fish,
  Sparkles,
  Users,
  Target,
  TrendingUp,
  Award,
  DollarSign,
  Building,
  Lightbulb,
  Camera,
  Smartphone,
  Shield,
  CheckCircle,
  UserCheck,
  FileCheck,
  Compass,
  Link,
  Quote,
  MapPin
} from 'lucide-react';

export const IMPACT_STATS = [
  {
    id: 'ffz_learners',
    value: '25,000+',
    label: { th: 'ผู้เรียน FFZ ทั่วโลก', en: 'FFZ Learners Worldwide' },
    icon: GraduationCap,
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    id: 'verified_stories',
    value: '150,000+',
    label: { th: 'เรื่องราวที่ผ่านการยืนยัน', en: 'Verified Authentic Stories' },
    icon: Shield,
    color: 'oklch(0.627 0.265 303.9)'
  },
  {
    id: 'cultural_preservation',
    value: '500+',
    label: { th: 'โครงการอนุรักษ์วัฒนธรรม', en: 'Cultural Preservation Projects' },
    icon: Heart,
    color: 'oklch(0.645 0.246 16.439)'
  },
  {
    id: 'creators_empowered',
    value: '50,000+',
    label: { th: 'ผู้สร้างสรรค์ที่ได้รับการเสริมพลัง', en: 'Creators Empowered' },
    icon: TrendingUp,
    color: 'oklch(0.769 0.188 70.08)'
  }
];

export const FFZ_LEVELS = [
  {
    id: 'level_0',
    name: { th: 'ระดับ 0: บันทึกประสบการณ์', en: 'Level 0: Experience Capture' },
    description: { 
      th: 'การบันทึกประสบการณ์ส่วนตัว องค์ประกอบภาพเบื้องต้น และการระบุเรื่องราว',
      en: 'Personal experience documentation, basic visual composition, and story identification'
    },
    skills: [
      { th: 'การบันทึกประสบการณ์ส่วนตัว', en: 'Personal experience documentation' },
      { th: 'องค์ประกอบภาพเบื้องต้น', en: 'Basic visual composition' },
      { th: 'การระบุเรื่องราวในชีวิต', en: 'Story identification in life' },
      { th: 'ความตระหนักในบริบทวัฒนธรรม', en: 'Cultural context awareness' }
    ],
    color: 'oklch(0.696 0.17 162.48)',
    icon: Compass
  },
  {
    id: 'level_1',
    name: { th: 'ระดับ 1: โครงสร้างเรื่องราว', en: 'Level 1: Narrative Structure' },
    description: { 
      th: 'การพัฒนาโครงสร้างเรื่องราว การตัดต่อเบื้องต้น และรูปแบบการเล่าเรื่องทางวัฒนธรรม',
      en: 'Story arc development, basic editing, and cultural storytelling patterns'
    },
    skills: [
      { th: 'การพัฒนาโครงเรื่องจากประสบการณ์', en: 'Story arc from experience' },
      { th: 'การตัดต่อและจัดลำดับเบื้องต้น', en: 'Basic editing and sequencing' },
      { th: 'รูปแบบการเล่าเรื่องทางวัฒนธรรม', en: 'Cultural storytelling patterns' },
      { th: 'ความตระหนักในผู้ชม', en: 'Audience awareness' }
    ],
    color: 'oklch(0.769 0.188 70.08)',
    icon: BookOpen
  },
  {
    id: 'level_2',
    name: { th: 'ระดับ 2: ความชำนาญทางเทคนิค', en: 'Level 2: Technical Proficiency' },
    description: { 
      th: 'เทคนิคการตัดต่อมืออาชีพ การใช้เครื่องมือ AI ขั้นสูง และการใช้ระบบยืนยัน',
      en: 'Professional editing techniques, advanced AI tools, and verification systems'
    },
    skills: [
      { th: 'เทคนิคการตัดต่อมืออาชีพ', en: 'Professional editing techniques' },
      { th: 'การใช้เครื่องมือ AI ขั้นสูง', en: 'Advanced AI tool utilization' },
      { th: 'การไล่ระดับสีและออกแบบเสียง', en: 'Color grading and audio design' },
      { th: 'การใช้ระบบยืนยันความถูกต้อง', en: 'Verification system usage' }
    ],
    color: 'oklch(0.627 0.265 303.9)',
    icon: Target
  },
  {
    id: 'level_3',
    name: { th: 'ระดับ 3: การสร้างสรรค์มืออาชีพ', en: 'Level 3: Professional Creation' },
    description: { 
      th: 'เทคนิคการเล่าเรื่องขั้นสูง การสร้างสรรค์หลายแพลตฟอร์ม และการเป็นที่ปรึกษา',
      en: 'Advanced narrative techniques, multi-platform storytelling, and mentorship'
    },
    skills: [
      { th: 'เทคนิคการเล่าเรื่องขั้นสูง', en: 'Advanced narrative techniques' },
      { th: 'การเล่าเรื่องหลายแพลตฟอร์ม', en: 'Multi-platform storytelling' },
      { th: 'การเป็นที่ปรึกษาใน FFZ', en: 'FFZ mentorship' },
      { th: 'โครงการอนุรักษ์วัฒนธรรม', en: 'Cultural preservation projects' }
    ],
    color: 'oklch(0.488 0.243 264.376)',
    icon: Award
  }
];

export const VERIFICATION_SYSTEMS = [
  {
    id: 'authenticity',
    name: { th: 'ยืนยันความเป็นแท้', en: 'Authenticity Verification' },
    description: { 
      th: 'ระบบยืนยันความเป็นแท้ของเนื้อหาและการเคารพวัฒนธรรม',
      en: 'Content authenticity and cultural respect verification'
    },
    features: [
      { th: 'การยืนยันที่มาของงานสร้างสรรค์', en: 'Creative provenance tracking' },
      { th: 'การประเมินความเป็นแท้ทางวัฒนธรรม', en: 'Cultural authenticity assessment' },
      { th: 'การรับรองจากชุมชน', en: 'Community endorsement' }
    ],
    icon: CheckCircle,
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    id: 'cultural',
    name: { th: 'ยืนยันทางวัฒนธรรม', en: 'Cultural Verification' },
    description: { 
      th: 'ระบบการยืนยันการแสดงออกทางวัฒนธรรมที่เหมาะสมและเคารพ',
      en: 'Respectful and appropriate cultural representation verification'
    },
    features: [
      { th: 'การตรวจสอบบริบทวัฒนธรรม', en: 'Cultural context verification' },
      { th: 'การรับรองจากผู้นำชุมชน', en: 'Community leader endorsement' },
      { th: 'การศึกษาความเคารพวัฒนธรรม', en: 'Cultural respect education' }
    ],
    icon: UserCheck,
    color: 'oklch(0.627 0.265 303.9)'
  },
  {
    id: 'experience',
    name: { th: 'ยืนยันประสบการณ์', en: 'Experience Verification' },
    description: { 
      th: 'ระบบบันทึกและยืนยันกระบวนการแปลงประสบการณ์เป็นเรื่องราว',
      en: 'Documentation and verification of experience-to-story transformation'
    },
    features: [
      { th: 'การบันทึกประสบการณ์จริง', en: 'Lived experience documentation' },
      { th: 'การติดตามกระบวนการสร้างสรรค์', en: 'Creative process tracking' },
      { th: 'การยืนยันแรงบันดาลใจ', en: 'Inspiration source verification' }
    ],
    icon: FileCheck,
    color: 'oklch(0.645 0.246 16.439)'
  }
];

export const GRANT_CATEGORIES = [
  {
    id: 'emerging_creator',
    name: { th: 'ทุนผู้สร้างสรรค์มือใหม่', en: 'Emerging Creator Grants' },
    range: { th: '$500 - $2,000', en: '$500 - $2,000' },
    description: { 
      th: 'สนับสนุนประสบการณ์การบันทึก การพัฒนาทักษะ และโปรแกรม FFZ',
      en: 'Experience capture support, skill development, and FFZ programs'
    },
    recipients: { th: '2,500+ ผู้รับ', en: '2,500+ recipients' },
    icon: Lightbulb,
    color: 'oklch(0.769 0.188 70.08)'
  },
  {
    id: 'professional_development',
    name: { th: 'ทุนพัฒนาความเป็นมืออาชีพ', en: 'Professional Development Grants' },
    range: { th: '$2,000 - $10,000', en: '$2,000 - $10,000' },
    description: { 
      th: 'การพัฒนา FFZ ขั้นสูง โครงการเล่าเรื่อง และการยืนยันทางวัฒนธรรม',
      en: 'Advanced FFZ development, storytelling projects, and cultural verification'
    },
    recipients: { th: '800+ ผู้รับ', en: '800+ recipients' },
    icon: Award,
    color: 'oklch(0.627 0.265 303.9)'
  },
  {
    id: 'innovation_grants',
    name: { th: 'ทุนนวัตกรรม', en: 'Innovation Grants' },
    range: { th: '$10,000 - $50,000', en: '$10,000 - $50,000' },
    description: { 
      th: 'การเล่าเรื่องที่เป็นแท้อย่างก้าวล้ำ เทคโนโลยีอนุรักษ์วัฒนธรรม และการพัฒนา FFZ',
      en: 'Breakthrough authentic storytelling, cultural preservation technology, and FFZ development'
    },
    recipients: { th: '150+ ผู้รับ', en: '150+ recipients' },
    icon: Sparkles,
    color: 'oklch(0.488 0.243 264.376)'
  },
  {
    id: 'institutional_partnerships',
    name: { th: 'ทุนพันธมิตรสถาบัน', en: 'Institutional Partnerships' },
    range: { th: '$1,000 - $25,000', en: '$1,000 - $25,000' },
    description: { 
      th: 'การบูรณาการหลักสูตร FFZ และโปรแกรมการวิจัยความเป็นแท้ทางวัฒนธรรม',
      en: 'FFZ curriculum integration and cultural authenticity research programs'
    },
    recipients: { th: '200+ สถาบัน', en: '200+ institutions' },
    icon: Building,
    color: 'oklch(0.696 0.17 162.48)'
  }
];

export const APPLICATION_PROCESS = [
  {
    id: 'portfolio_submission',
    name: { th: 'ส่งผลงานประสบการณ์', en: 'Experience Portfolio Submission' },
    duration: { th: '1 สัปดาห์', en: '1 week' },
    description: { 
      th: 'ส่งเรื่องราวประสบการณ์ส่วนตัว 3-5 เรื่อง พร้อมบริบททางวัฒนธรรม',
      en: 'Submit 3-5 personal experience narratives with cultural context'
    },
    requirements: [
      { th: 'เรื่องราวประสบการณ์ส่วนตัว 3-5 เรื่อง', en: '3-5 personal experience narratives' },
      { th: 'เอกสารบริบททางวัฒนธรรม', en: 'Cultural context documentation' },
      { th: 'การประเมิน FFZ เสร็จสิ้น', en: 'FFZ assessment completion' }
    ]
  },
  {
    id: 'project_proposal',
    name: { th: 'เสนอโครงการและบริบทวัฒนธรรม', en: 'Project Proposal & Cultural Context' },
    duration: { th: '2 สัปดาห์', en: '2 weeks' },
    description: { 
      th: 'เสนอโครงการโดยละเอียด พร้อมแผนเส้นทาง FFZ และการประเมินผลกระทบชุมชน',
      en: 'Detailed project proposal with FFZ learning pathway and community impact assessment'
    },
    requirements: [
      { th: 'รายละเอียดโครงการ', en: 'Detailed project description' },
      { th: 'แผนเส้นทางการเรียนรู้ FFZ', en: 'FFZ learning pathway plan' },
      { th: 'การประเมินผลกระทบชุมชน', en: 'Community impact assessment' }
    ]
  },
  {
    id: 'review_process',
    name: { th: 'การตรวจสอบและยืนยันทางวัฒนธรรม', en: 'Review & Cultural Verification' },
    duration: { th: '3 สัปดาห์', en: '3 weeks' },
    description: { 
      th: 'การประเมินเรื่องราวและวิสัยทัศน์ การตรวจสอบความเป็นแท้ทางวัฒนธรรม',
      en: 'Experience and vision evaluation, cultural authenticity verification'
    },
    requirements: [
      { th: 'การประเมินเรื่องราวส่วนตัว', en: 'Personal narrative evaluation' },
      { th: 'การตรวจสอบบริบททางวัฒนธรรม', en: 'Cultural context assessment' },
      { th: 'การสัมภาษณ์กับที่ปรึกษา FFZ', en: 'Interview with FFZ mentors' }
    ]
  },
  {
    id: 'final_decision',
    name: { th: 'การยืนยันและอนุมัติขั้นสุดท้าย', en: 'Final Verification & Approval' },
    duration: { th: '1 สัปดาห์', en: '1 week' },
    description: { 
      th: 'การพิจารณาของคณะกรรมการ การยืนยันความเป็นแท้ทางวัฒนธรรม และการติดตั้งเส้นทาง FFZ',
      en: 'Panel deliberation, cultural authenticity final approval, and FFZ pathway integration'
    },
    requirements: [
      { th: 'การพิจารณาของคณะกรรมการ', en: 'Review panel deliberation' },
      { th: 'การยืนยันการรับรองชุมชน', en: 'Community endorsement verification' },
      { th: 'การอนุมัติและติดตั้งเส้นทาง FFZ', en: 'Award setup and FFZ pathway integration' }
    ]
  }
];

export const SUCCESS_STORIES = [
  {
    id: 'maria_peru',
    name: 'Maria Quispe',
    location: { th: 'เปรู', en: 'Peru' },
    grant_type: { th: 'ทุนนวัตกรรม', en: 'Innovation Grant' },
    ffz_level: { th: 'ระดับ 3: มืออาชีพ', en: 'Level 3: Professional' },
    cultural_background: { th: 'เควชัว', en: 'Quechua' },
    amount: '$25,000',
    achievement: { 
      th: 'สร้างซีรีส์สารคดีเควชัวที่ได้รับการยืนยันจากชุมชน ถ่ายทอดภูมิปัญญาดั้งเดิม',
      en: 'Created community-verified Quechua documentary series preserving traditional knowledge'
    },
    impact: { th: '100K+ ผู้ชม, 25 เรื่องเล่าโบราณที่อนุรักษ์ไว้', en: '100K+ viewers, 25 ancient stories preserved' },
    verification: { th: 'ยืนยันโดยผู้นำชุมชนเควชัว', en: 'Verified by Quechua community leaders' }
  },
  {
    id: 'kwame_ghana',
    name: 'Kwame Asante',
    location: { th: 'กานา', en: 'Ghana' },
    grant_type: { th: 'ทุนพัฒนาความเป็นมืออาชีพ', en: 'Professional Development Grant' },
    ffz_level: { th: 'ระดับ 2: ความชำนาญ', en: 'Level 2: Proficiency' },
    cultural_background: { th: 'อาคาน', en: 'Akan' },
    amount: '$8,000',
    achievement: { 
      th: 'พัฒนาแอปมือถือสำหรับการเล่าเรื่องพื้นบ้านที่เหมาะกับวัฒนธรรม',
      en: 'Developed culturally-appropriate mobile app for traditional storytelling'
    },
    impact: { th: '50+ หมู่บ้านใช้งาน, 500+ เรื่องเล่าท้องถิ่น', en: '50+ villages using, 500+ local stories shared' },
    verification: { th: 'ยืนยันโดยสภาผู้ใหญ่อาคาน', en: 'Verified by Akan Council of Elders' }
  },
  {
    id: 'yuki_japan',
    name: 'Yuki Tanaka',
    location: { th: 'ญี่ปุ่น', en: 'Japan' },
    grant_type: { th: 'ทุนนวัตกรรม', en: 'Innovation Grant' },
    ffz_level: { th: 'ระดับ 3: มืออาชีพ', en: 'Level 3: Professional' },
    cultural_background: { th: 'ไอนุ', en: 'Ainu' },
    amount: '$35,000',
    achievement: { 
      th: 'สร้างห้องสมุดดิจิทัลเรื่องราวไอนุที่ผ่านการยืนยันความถูกต้อง',
      en: 'Created authenticated digital library of Ainu stories and traditions'
    },
    impact: { th: '200+ เรื่องราวที่อนุรักษ์ไว้, 15 โรงเรียนที่ได้รับการศึกษา', en: '200+ stories preserved, 15 schools educated' },
    verification: { th: 'ยืนยันโดยสมาคมวัฒนธรรมไอนุ', en: 'Verified by Ainu Cultural Association' }
  }
];

export const CULTURAL_PRESERVATION = [
  {
    id: 'elder_stories',
    name: { th: 'เรื่องราวของผู้เฒ่าผู้แก่', en: 'Elder Stories' },
    description: { 
      th: 'การบันทึกและอนุรักษ์ภูมิปญัญาและเรื่องราวของผู้เฒ่าผู้แก่',
      en: 'Documentation and preservation of elder wisdom and stories'
    },
    impact: { th: '2,500+ เรื่องราว', en: '2,500+ stories preserved' },
    icon: Users,
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    id: 'traditional_arts',
    name: { th: 'ศิลปะพื้นบ้าน', en: 'Traditional Arts' },
    description: { 
      th: 'การเล่าเรื่องผ่านศิลปะและงานฝีมือดั้งเดิม',
      en: 'Storytelling through traditional arts and crafts'
    },
    impact: { th: '800+ โครงการ', en: '800+ art projects' },
    icon: Sparkles,
    color: 'oklch(0.769 0.188 70.08)'
  },
  {
    id: 'language_preservation',
    name: { th: 'การอนุรักษ์ภาษา', en: 'Language Preservation' },
    description: { 
      th: 'การใช้การเล่าเรื่องด้วยภาพเพื่ออนุรักษ์ภาษาพื้นเมือง',
      en: 'Visual storytelling for indigenous language preservation'
    },
    impact: { th: '150+ ภาษา', en: '150+ languages supported' },
    icon: Globe,
    color: 'oklch(0.627 0.265 303.9)'
  },
  {
    id: 'ritual_documentation',
    name: { th: 'การบันทึกพิธีกรรม', en: 'Ritual Documentation' },
    description: { 
      th: 'การบันทึกพิธีกรรมและประเพณีทางวัฒนธรรมอย่างเคารพ',
      en: 'Respectful documentation of cultural rituals and traditions'
    },
    impact: { th: '400+ พิธีกรรม', en: '400+ rituals documented' },
    icon: Heart,
    color: 'oklch(0.645 0.246 16.439)'
  }
];

export const ECOSYSTEM_FEATURES = [
  {
    id: 'lived_experience',
    title: { th: 'ประสบการณ์ชีวิตจริง', en: 'Lived Experience Integration' },
    description: { 
      th: 'เครื่องมือที่ทำงานร่วมกับประสบการณ์ชีวิตจริงของผู้สร้างสรรค์',
      en: 'Tools that work with creators\' actual lived experiences'
    },
    benefits: [
      { th: 'การบันทึกประสบการณ์แบบเรียลไทม์', en: 'Real-time experience documentation' },
      { th: 'การแปลงประสบการณ์เป็นเรื่องราว', en: 'Experience-to-story transformation' },
      { th: 'การรับรองความเป็นแท้', en: 'Authenticity validation' }
    ],
    icon: Heart,
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    id: 'ffz_framework',
    title: { th: 'กรอบการศึกษา FFZ', en: 'FFZ Educational Framework' },
    description: { 
      th: 'ระบบการเรียนรู้แบบก้าวหน้าจากเริ่มต้นสู่ระดับมืออาชีพ',
      en: 'Progressive learning system from complete beginner to professional'
    },
    benefits: [
      { th: 'เส้นทางการเรียนรู้ที่ปรับตัวได้', en: 'Adaptive learning pathways' },
      { th: 'การประเมินตามผลงาน', en: 'Portfolio-based assessment' },
      { th: 'การเรียนรู้จากชุมชน', en: 'Community-driven learning' }
    ],
    icon: GraduationCap,
    color: 'oklch(0.769 0.188 70.08)'
  },
  {
    id: 'verification_ecosystem',
    title: { th: 'ระบบนิเวศการยืนยัน', en: 'Verification Ecosystem' },
    description: { 
      th: 'ระบบยืนยันความถูกต้องและความเคารพทางวัฒนธรรมที่ครอบคลุม',
      en: 'Comprehensive authenticity and cultural respect verification system'
    },
    benefits: [
      { th: 'การยืนยันด้วยบล็อกเชน', en: 'Blockchain verification' },
      { th: 'การรับรองจากชุมชน', en: 'Community endorsement' },
      { th: 'การติดตามแหล่งที่มา', en: 'Provenance tracking' }
    ],
    icon: Shield,
    color: 'oklch(0.627 0.265 303.9)'
  },
  {
    id: 'precision_tools',
    title: { th: 'เครื่องมือความแม่นยำ', en: 'Precision Crafting Tools' },
    description: { 
      th: 'เครื่องมือระดับมืออาชีพสำหรับการสร้างสรรค์ที่แม่นยำ',
      en: 'Professional-grade tools for precise creative realization'
    },
    benefits: [
      { th: 'AI ที่เข้าใจเจตนา', en: 'Intent-aware AI' },
      { th: 'อินเทอร์เฟซที่ปรับตัวได้', en: 'Adaptive interface' },
      { th: 'การบูรณาการการยืนยัน', en: 'Verification integration' }
    ],
    icon: Target,
    color: 'oklch(0.645 0.246 16.439)'
  }
];

export const CORE_VALUES = [
  {
    title: { th: 'ประสบการณ์ชีวิตจริง', en: 'Lived Experience Integration' },
    description: { 
      th: 'เครื่องมือที่ปรับตัวกับประสบการณ์และวัฒนธรรมของผู้สร้างสรรค์แต่ละคน',
      en: 'Tools that adapt to each creator\'s unique experiences and cultural background'
    },
    icon: Heart,
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    title: { th: 'การศึกษาแบบก้าวหน้า', en: 'Progressive Education' },
    description: { 
      th: 'กรอบ FFZ ที่นำจากเริ่มต้นสู่ความเชี่ยวชาญด้วยการยืนยันความสามารถ',
      en: 'FFZ framework that guides from beginner to expert with verified competency'
    },
    icon: GraduationCap,
    color: 'oklch(0.769 0.188 70.08)'
  },
  {
    title: { th: 'การยืนยันความถูกต้อง', en: 'Authenticity Verification' },
    description: { 
      th: 'ระบบยืนยันที่ครอบคลุมเพื่อรับรองความเป็นแท้และความเคารพวัฒนธรรม',
      en: 'Comprehensive verification systems ensuring authentic and respectful creation'
    },
    icon: Shield,
    color: 'oklch(0.627 0.265 303.9)'
  },
  {
    title: { th: 'เครื่องมือความแม่นยำ', en: 'Precision Tools' },
    description: { 
      th: 'เทคโนโลยี AI ที่เข้าใจเจตนาและช่วยสร้างสรรค์อย่างแม่นยำ',
      en: 'Intent-aware AI technology that understands and amplifies creative vision'
    },
    icon: Target,
    color: 'oklch(0.488 0.243 264.376)'
  },
  {
    title: { th: 'การอนุรักษ์วัฒนธรรม', en: 'Cultural Preservation' },
    description: { 
      th: 'การรักษาและเฉลิมฉลองประเพณีการเล่าเรื่องจากทั่วโลก',
      en: 'Protecting and celebrating storytelling traditions from around the world'
    },
    icon: Globe,
    color: 'oklch(0.645 0.246 16.439)'
  }
];

export const ABOUT_CONTENT = {
  th: {
    title: 'พันธกิจของเรา',
    subtitle: 'ระบบนิเวศการเล่าเรื่องด้วยภาพแบบปรับตัวได้และการยืนยันผสานประสบการณ์ชีวิตจริง กรอบการศึกษา FFZ และเครื่องมือตัดต่อเทคโนโลยีสูงเข้าด้วยกัน',
    missionStatement: 'เสริมพลังผู้สร้างสรรค์ผ่านการเล่าเรื่องด้วยภาพแบบปรับตัวได้—จากประสบการณ์ชีวิตจริงสู่ความเป็นแท้ที่ยืนยันได้',
    coreValuesTitle: 'หลักการสำคัญของระบบนิเวศ',
    coreValuesDescription: 'หลักการพื้นฐานที่ขับเคลื่อนระบบนิเวศการเล่าเรื่องด้วยภาพ',
    impactTitle: 'ผลกระทบของระบบนิเวศ',
    impactDescription: 'ผลกระทบที่วัดได้จริงในการเสริมพลังผู้สร้างสรรค์และอนุรักษ์วัฒนธรรม',
    ffzTitle: 'กรอบการศึกษา Film From Zero (FFZ)',
    ffzSubtitle: 'เส้นทางการเรียนรู้แบบก้าวหน้าจากประสบการณ์ชีวิตจริงสู่การสร้างสรรค์ที่ยืนยันได้',
    ffzDescription: 'ระบบการเรียนรู้ที่ปรับตัวได้ซึ่งเริ่มจากประสบการณ์ชีวิตและพัฒนาสู่ความเชี่ยวชาญ',
    verificationTitle: 'ระบบการยืนยันความถูกต้อง',
    verificationSubtitle: 'การยืนยันความเป็นแท้และความเคารพทางวัฒนธรรมที่ครอบคลุม',
    grantsTitle: 'กองทุนโอกาสสร้างสรรค์โลก',
    grantsSubtitle: '5% ของกำไรทั้งหมดเพื่อสร้างโอกาสและการพัฒนา FFZ',
    culturalTitle: 'การอนุรักษ์วัฒนธรรม',
    culturalSubtitle: 'การอนุรักษ์และเฉลิมฉลองประเพณีการเล่าเรื่องที่หลากหลาย',
    successTitle: 'เรื่องราวความสำเร็จ FFZ',
    applicationProcessTitle: 'กระบวนการสมัครทุน',
    successStoriesTitle: 'เรื่องราวความสำเร็จ',
    joinMission: 'ร่วมระบบนิเวศ',
    joinEcosystemDescription: 'เข้าร่วมระบบนิเวศที่เชื่อมต่อประสบการณ์ การศึกษา และเครื่องมือมืออาชีพเข้าด้วยกัน เพื่อสร้างเรื่องราวที่เป็นแท้และยืนยันได้',
    getStarted: 'เริ่มต้น FFZ',
    learnMore: 'เรียนรู้เพิ่มเติม',
    profitSharing: 'การแบ่งปันกำไร 5%',
    globalImpact: 'ผลกระทบทั่วโลก',
    adaptiveEcosystem: 'ระบบนิเวศปรับตัวได้',
    applyFFZ: 'สมัคร FFZ',
    applyForGrant: 'สมัครขอทุน',
    viewAllStories: 'ดูเรื่องราวทั้งหมด',
    startFFZJourney: 'เริ่มต้นเส้นทาง FFZ',
    subscriptionSupport: 'ทุกการสมัครใช้งานช่วยสนับสนุนกรอบการศึกษา FFZ และการอนุรักษ์วัฒนธรรม',
    ecosystemFeatures: ECOSYSTEM_FEATURES.map(feature => ({
      title: feature.title.th,
      description: feature.description.th
    })),
    coreValues: CORE_VALUES.map(value => ({
      title: value.title.th,
      description: value.description.th
    }))
  },
  en: {
    title: 'Our Mission',
    subtitle: 'Adaptive Visual Storytelling & Verification Ecosystem merges lived creative experience, educational framework (FFZ), and high-tech editing tools into a single, intent-driven workflow',
    missionStatement: 'Empowering creators through adaptive visual storytelling—from lived experience to verifiable authenticity',
    coreValuesTitle: 'Ecosystem Core Principles',
    coreValuesDescription: 'Core principles driving the adaptive visual storytelling ecosystem',
    impactTitle: 'Ecosystem Impact',
    impactDescription: 'Measurable impact in empowering creators and preserving cultural heritage',
    ffzTitle: 'Film From Zero (FFZ) Educational Framework',
    ffzSubtitle: 'Progressive learning pathway from lived experience to verified creation',
    ffzDescription: 'Adaptive learning system that begins with lived experience and develops into expertise',
    verificationTitle: 'Authenticity Verification Systems',
    verificationSubtitle: 'Comprehensive authenticity and cultural respect verification',
    grantsTitle: 'Global Creative Opportunity Fund',
    grantsSubtitle: '5% of all profits dedicated to opportunity creation and FFZ development',
    culturalTitle: 'Cultural Preservation',
    culturalSubtitle: 'Preserving and celebrating diverse storytelling traditions',
    successTitle: 'FFZ Success Stories',
    applicationProcessTitle: 'Grant Application Process',
    successStoriesTitle: 'Success Stories',
    joinMission: 'Join Our Ecosystem',
    joinEcosystemDescription: 'Join an ecosystem that seamlessly connects experience, education, and professional tools to create authentic, verifiable stories',
    getStarted: 'Start FFZ Journey',
    learnMore: 'Learn More',
    profitSharing: '5% Profit Sharing',
    globalImpact: 'Global Impact',
    adaptiveEcosystem: 'Adaptive Ecosystem',
    applyFFZ: 'Apply for FFZ',
    applyForGrant: 'Apply for Grant',
    viewAllStories: 'View All Stories',
    startFFZJourney: 'Start FFZ Journey',
    subscriptionSupport: 'Every subscription supports FFZ educational framework and cultural preservation',
    ecosystemFeatures: ECOSYSTEM_FEATURES.map(feature => ({
      title: feature.title.en,
      description: feature.description.en
    })),
    coreValues: CORE_VALUES.map(value => ({
      title: value.title.en,
      description: value.description.en
    }))
  }
};
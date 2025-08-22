export interface LanguageContent {
  th: string;
  en: string;
}

export interface SceneData {
  name: string;
  duration: string;
  shots: number;
  status: string;
  color: string;
  waveform: number[];
}

export interface PricingTier {
  id: string;
  name: LanguageContent;
  subtitle: LanguageContent;
  price: {
    monthly: string;
    yearly: string;
    yearlyDiscount: string | null;
  };
  icon: React.ReactNode;
  color: string;
  popular: boolean;
  features: LanguageContent[];
}

export interface DemoStep {
  title: LanguageContent;
  description: LanguageContent;
  status: 'completed' | 'pending';
}

export interface Feature {
  id: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  badge: string;
  title: LanguageContent;
  description: LanguageContent;
}

export interface Integration {
  name: string;
  icon: React.ReactNode;
  status: string;
  description: LanguageContent;
}

export interface ImpactStat {
  number: string;
  label: LanguageContent;
  icon: React.ReactNode;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: LanguageContent;
  avatar: string;
}

export interface SellingPoint {
  icon: React.ReactNode;
  title: LanguageContent;
  desc: LanguageContent;
}

export interface AppProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export interface SectionProps {
  language: string;
}
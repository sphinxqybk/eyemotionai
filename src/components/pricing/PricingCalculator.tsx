import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Globe, 
  GraduationCap, 
  Heart, 
  Sparkles,
  TrendingDown,
  CheckCircle,
  Info,
  Smartphone,
  Camera,
  Share2,
  Play,
  Leaf
} from 'lucide-react';

interface PricingData {
  basePrice: {
    usd: number;
    eur: number;
    gbp: number;
    thb: number;
  };
  regionalMultiplier: number;
  socialDiscount: number;
  billingDiscount: number;
}

interface CalculatorProps {
  language: 'th' | 'en';
}

const PLANS = {
  starter: {
    name: 'Starter',
    basePrice: { usd: 5, eur: 5, gbp: 4, thb: 180 }
  },
  creator: {
    name: 'Creator',
    basePrice: { usd: 19, eur: 18, gbp: 15, thb: 690 }
  },
  professional: {
    name: 'Professional', 
    basePrice: { usd: 59, eur: 55, gbp: 49, thb: 2150 }
  },
  studio: {
    name: 'Studio',
    basePrice: { usd: 199, eur: 185, gbp: 165, thb: 7250 }
  }
};

const MOBILE_ADDONS = {
  cinemobile: {
    name: 'CineMobile™ Pro',
    price: { usd: 4.99, eur: 4.99, gbp: 3.99, thb: 179 },
    icon: Smartphone,
    color: 'oklch(0.645 0.246 16.439)'
  },
  cinecapture: {
    name: 'CineCapture Pro',
    price: { usd: 3.99, eur: 3.99, gbp: 3.49, thb: 149 },
    icon: Camera,
    color: 'oklch(0.627 0.265 303.9)'
  },
  cinesync: {
    name: 'CineSync Mobile',
    price: { usd: 2.99, eur: 2.99, gbp: 2.49, thb: 109 },
    icon: Users,
    color: 'oklch(0.696 0.17 162.48)'
  },
  cinereview: {
    name: 'CineReview Mobile',
    price: { usd: 1.99, eur: 1.99, gbp: 1.79, thb: 79 },
    icon: Play,
    color: 'oklch(0.769 0.188 70.08)'
  },
  cineshare: {
    name: 'CineShare Mobile',
    price: { usd: 1.99, eur: 1.99, gbp: 1.79, thb: 79 },
    icon: Share2,
    color: 'oklch(0.488 0.243 264.376)'
  }
};

const MOBILE_BUNDLES = {
  creator_bundle: {
    name: 'Mobile Creator Bundle',
    addons: ['cinemobile', 'cinecapture', 'cineshare'],
    price: { usd: 9.99, eur: 9.99, gbp: 8.99, thb: 359 },
    savings: { usd: 0.99, eur: 0.99, gbp: 0.29, thb: 47 }
  },
  pro_bundle: {
    name: 'Mobile Pro Bundle',
    addons: ['cinemobile', 'cinecapture', 'cinesync', 'cinereview', 'cineshare'],
    price: { usd: 14.99, eur: 14.99, gbp: 12.99, thb: 539 },
    savings: { usd: 2.99, eur: 2.99, gbp: 2.55, thb: 111 }
  }
};

const REGIONS = {
  global: { name: 'Global Markets', multiplier: 1.0 },
  emerging: { name: 'Emerging Markets', multiplier: 0.5 }
};

const SOCIAL_PROGRAMS = {
  none: { name: 'Standard', discount: 0, icon: Users },
  student: { name: 'Student', discount: 0.7, icon: GraduationCap },
  nonprofit: { name: 'Nonprofit', discount: 0.8, icon: Heart },
  emerging_creator: { name: 'Emerging Filmmaker', discount: 0.6, icon: Sparkles },
  environmental: { name: 'Environmental Creator', discount: 0.5, icon: Leaf }
};

const CURRENCIES = {
  usd: { symbol: '$', name: 'USD' },
  eur: { symbol: '€', name: 'EUR' },
  gbp: { symbol: '£', name: 'GBP' },
  thb: { symbol: '฿', name: 'THB' }
};

export const PricingCalculator: React.FC<CalculatorProps> = ({ language }) => {
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>('creator');
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof REGIONS>('global');
  const [selectedProgram, setSelectedProgram] = useState<keyof typeof SOCIAL_PROGRAMS>('none');
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof CURRENCIES>('usd');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [teamSize, setTeamSize] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<keyof typeof MOBILE_BUNDLES | null>(null);

  // Auto-detect user region and currency
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locale = navigator.language;
        
        // Emerging market detection
        const emergingTimezones = [
          'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Ho_Chi_Minh', 'Asia/Kolkata',
          'Asia/Manila', 'Asia/Kuala_Lumpur', 'Asia/Dhaka', 'Asia/Karachi',
          'America/Sao_Paulo', 'America/Mexico_City', 'America/Bogota',
          'Africa/Lagos', 'Africa/Cairo', 'Africa/Johannesburg'
        ];
        
        if (emergingTimezones.some(tz => timezone.includes(tz.split('/')[1]))) {
          setSelectedRegion('emerging');
        }
        
        // Currency detection
        if (locale.includes('th')) setSelectedCurrency('thb');
        else if (locale.includes('en-GB')) setSelectedCurrency('gbp');
        else if (['de', 'fr', 'it', 'es', 'nl'].some(lang => locale.includes(lang))) setSelectedCurrency('eur');
        else setSelectedCurrency('usd');
        
      } catch (error) {
        console.log('Location detection failed, using defaults');
      }
    };

    detectUserLocation();
  }, []);

  const calculatePrice = () => {
    const plan = PLANS[selectedPlan];
    const region = REGIONS[selectedRegion];
    const program = SOCIAL_PROGRAMS[selectedProgram];
    const currency = CURRENCIES[selectedCurrency];
    
    let basePrice = plan.basePrice[selectedCurrency];
    
    // Apply regional multiplier
    basePrice *= region.multiplier;
    
    // Apply social program discount
    basePrice *= (1 - program.discount);
    
    // Apply yearly billing discount (20%)
    if (billingCycle === 'yearly') {
      basePrice *= 0.8;
    }
    
    // Team multiplier for applicable plans
    if (selectedPlan === 'studio' && teamSize > 1) {
      basePrice *= teamSize;
    }
    
    // Calculate mobile add-ons cost
    let addonsCost = 0;
    if (selectedBundle) {
      const bundle = MOBILE_BUNDLES[selectedBundle];
      addonsCost = bundle.price[selectedCurrency];
      
      // Apply social program discount to add-ons (50% of main discount)
      if (program.discount > 0) {
        addonsCost *= (1 - program.discount * 0.5);
      }
    } else {
      selectedAddons.forEach(addonId => {
        const addon = MOBILE_ADDONS[addonId as keyof typeof MOBILE_ADDONS];
        if (addon) {
          let price = addon.price[selectedCurrency];
          // Apply social program discount to add-ons (50% of main discount)
          if (program.discount > 0) {
            price *= (1 - program.discount * 0.5);
          }
          addonsCost += price;
        }
      });
    }
    
    const originalPlanPrice = plan.basePrice[selectedCurrency] * region.multiplier;
    const originalAddonsPrice = selectedBundle 
      ? MOBILE_BUNDLES[selectedBundle].price[selectedCurrency]
      : selectedAddons.reduce((total, addonId) => {
          const addon = MOBILE_ADDONS[addonId as keyof typeof MOBILE_ADDONS];
          return total + (addon ? addon.price[selectedCurrency] : 0);
        }, 0);
    
    return {
      planPrice: Math.round(basePrice),
      addonsPrice: Math.round(addonsCost),
      totalPrice: Math.round(basePrice + addonsCost),
      originalPlanPrice: Math.round(originalPlanPrice),
      originalAddonsPrice: Math.round(originalAddonsPrice),
      totalSavings: Math.round((originalPlanPrice + originalAddonsPrice) - (basePrice + addonsCost)),
      currency
    };
  };

  const result = calculatePrice();

  const content = {
    th: {
      title: 'คำนวณราคา',
      subtitle: 'ดูราคาที่เหมาะกับสถานการณ์ของคุณ',
      plan: 'แผน',
      region: 'ภูมิภาค',
      program: 'โปรแกรม',
      currency: 'สกุลเงิน',
      billing: 'รอบบิล',
      teamSize: 'ขนาดทีม',
      mobileAddons: 'Add-ons มือถือ',
      mobileBundles: 'แพ็คเกจมือถือ',
      individualAddons: 'เลือกแยก',
      monthly: 'รายเดือน',
      yearly: 'รายปี',
      planPrice: 'ราคาแผน',
      addonsPrice: 'ราคา Add-ons',
      totalPrice: 'ราคารวม',
      originalPrice: 'ราคาปกติ',
      totalSavings: 'ประหยัดทั้งหมด',
      perMonth: '/เดือน',
      perYear: '/ปี',
      getThisPlan: 'เลือกแผนนี้',
      savings: 'ประหยัด',
      members: 'สมาชิก',
      impactNote: '5% กำไรเพื่อการศึกษาและสิ่งแวดล้อม'
    },
    en: {
      title: 'Pricing Calculator',
      subtitle: 'See pricing that fits your situation',
      plan: 'Plan',
      region: 'Region',
      program: 'Program',
      currency: 'Currency',
      billing: 'Billing',
      teamSize: 'Team Size',
      mobileAddons: 'Mobile Add-ons',
      mobileBundles: 'Mobile Bundles',
      individualAddons: 'Individual Add-ons',
      monthly: 'Monthly',
      yearly: 'Yearly',
      planPrice: 'Plan Price',
      addonsPrice: 'Add-ons Price',
      totalPrice: 'Total Price',
      originalPrice: 'Original Price',
      totalSavings: 'Total Savings',
      perMonth: '/month',
      perYear: '/year',
      getThisPlan: 'Get This Plan',
      savings: 'Save',
      members: 'members',
      impactNote: '5% of profits support education & environment'
    }
  };

  const t = content[language];

  const handleAddonToggle = (addonId: string) => {
    if (selectedBundle) {
      setSelectedBundle(null);
    }
    
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleBundleSelect = (bundleId: keyof typeof MOBILE_BUNDLES) => {
    setSelectedBundle(bundleId);
    setSelectedAddons([]);
  };

  return (
    <Card className="bg-card border-border max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-medium text-foreground flex items-center gap-3">
          <Calculator className="h-6 w-6 text-chart-1" />
          {t.title}
        </CardTitle>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Plan Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">{t.plan}</label>
          <Select value={selectedPlan} onValueChange={(value: any) => setSelectedPlan(value)}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PLANS).map(([key, plan]) => (
                <SelectItem key={key} value={key}>
                  {plan.name}
                  {key === 'starter' && (
                    <Badge variant="secondary" className="ml-2 bg-chart-3/15 text-chart-3 text-xs">
                      NEW
                    </Badge>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region & Currency Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{t.region}</label>
            <Select value={selectedRegion} onValueChange={(value: any) => setSelectedRegion(value)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REGIONS).map(([key, region]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {region.name}
                      {key === 'emerging' && (
                        <Badge variant="secondary" className="text-xs bg-chart-2/15 text-chart-2">50% OFF</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{t.currency}</label>
            <Select value={selectedCurrency} onValueChange={(value: any) => setSelectedCurrency(value)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENCIES).map(([key, currency]) => (
                  <SelectItem key={key} value={key}>
                    {currency.symbol} {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Social Program Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">{t.program}</label>
          <Select value={selectedProgram} onValueChange={(value: any) => setSelectedProgram(value)}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SOCIAL_PROGRAMS).map(([key, program]) => {
                const IconComponent = program.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {program.name}
                      {program.discount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-chart-3/15 text-chart-3">
                          {Math.round(program.discount * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Billing Cycle */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">{t.billing}</label>
          <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              {t.monthly}
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-chart-1"
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {t.yearly}
              </span>
              <Badge variant="secondary" className="bg-chart-2/15 text-chart-2 border-chart-2/20 text-xs">
                20% OFF
              </Badge>
            </div>
          </div>
        </div>

        {/* Team Size (for Studio plan) */}
        {selectedPlan === 'studio' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{t.teamSize}</label>
            <Select value={teamSize.toString()} onValueChange={(value) => setTeamSize(parseInt(value))}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 10, 15, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {t.members}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Mobile Add-ons Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">{t.mobileAddons}</label>
          </div>

          {/* Mobile Bundles */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">{t.mobileBundles}</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(MOBILE_BUNDLES).map(([bundleId, bundle]) => (
                <div 
                  key={bundleId}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedBundle === bundleId 
                      ? 'border-chart-4 bg-chart-4/10' 
                      : 'border-border hover:border-border/60'
                  }`}
                  onClick={() => handleBundleSelect(bundleId as keyof typeof MOBILE_BUNDLES)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-medium text-foreground">{bundle.name}</h5>
                      <p className="text-xs text-muted-foreground">{bundle.addons.length} add-ons</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {CURRENCIES[selectedCurrency].symbol}{bundle.price[selectedCurrency]}
                      </div>
                      <Badge variant="secondary" className="bg-chart-2/15 text-chart-2 text-xs">
                        {t.savings} {CURRENCIES[selectedCurrency].symbol}{bundle.savings[selectedCurrency]}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Individual Add-ons */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">{t.individualAddons}</h4>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(MOBILE_ADDONS).map(([addonId, addon]) => {
                const IconComponent = addon.icon;
                const isSelected = selectedAddons.includes(addonId);
                return (
                  <div 
                    key={addonId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-chart-4 bg-chart-4/10' 
                        : 'border-border hover:border-border/60'
                    }`}
                    onClick={() => handleAddonToggle(addonId)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleAddonToggle(addonId)}
                      />
                      <div 
                        className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${addon.color} / 0.15` }}
                      >
                        <IconComponent 
                          className="h-4 w-4" 
                          style={{ color: addon.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-foreground truncate">{addon.name}</h5>
                        <div className="text-xs text-muted-foreground">
                          {CURRENCIES[selectedCurrency].symbol}{addon.price[selectedCurrency]}{t.perMonth}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Price Calculation Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={`${selectedPlan}-${selectedRegion}-${selectedProgram}-${billingCycle}-${teamSize}-${selectedAddons.join(',')}-${selectedBundle}`}
          className="space-y-4"
        >
          {/* Price Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-secondary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{t.planPrice}</span>
                <span className="text-lg font-medium text-foreground">
                  {result.currency.symbol}{result.planPrice.toLocaleString()}
                </span>
              </div>
              {result.addonsPrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.addonsPrice}</span>
                  <span className="text-sm font-medium text-foreground">
                    {result.currency.symbol}{result.addonsPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-chart-1" />
                <span className="text-sm font-medium text-chart-1">{t.totalPrice}</span>
              </div>
              <div className="text-2xl font-medium text-foreground">
                {result.currency.symbol}{result.totalPrice.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {billingCycle === 'yearly' ? t.perYear : t.perMonth}
              </div>
            </div>
          </div>

          {/* Savings Display */}
          {result.totalSavings > 0 && (
            <div className="p-4 bg-chart-2/10 rounded-lg border border-chart-2/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-chart-2" />
                <span className="text-sm font-medium text-chart-2">{t.totalSavings}</span>
              </div>
              <div className="text-lg font-medium text-chart-2">
                {result.currency.symbol}{result.totalSavings.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Original: {result.currency.symbol}{(result.originalPlanPrice + result.originalAddonsPrice).toLocaleString()}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button className="w-full bg-chart-1 hover:bg-chart-1/90 text-white font-medium gap-2 mt-6">
            <CheckCircle className="h-4 w-4" />
            {t.getThisPlan}
          </Button>

          {/* Impact & Disclaimer */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-chart-2/10 rounded-lg">
              <Leaf className="h-4 w-4 text-chart-2" />
              <span className="text-xs text-chart-2 font-medium">
                {t.impactNote}
              </span>
            </div>

            <div className="flex items-start gap-2 p-3 bg-secondary/20 rounded-lg text-xs text-muted-foreground">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                {language === 'th' 
                  ? 'ราคาแสดงยังไม่รวมภาษี การสมัครโปรแกรมส่วนลดต้องมีการยืนยันคุณสมบัติ'
                  : 'Prices shown excluding taxes. Discount program eligibility requires verification.'
                }
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
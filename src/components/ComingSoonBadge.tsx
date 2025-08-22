import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Rocket, Zap, Clock, Bell, Mail, ArrowRight, Sparkles, Star, Crown } from 'lucide-react';

interface ComingSoonBadgeProps {
  feature: string;
  description?: string;
  estimatedDate?: string;
  priority?: 'high' | 'medium' | 'low';
  variant?: 'default' | 'compact';
  className?: string;
}

export function ComingSoonBadge({ 
  feature, 
  description, 
  estimatedDate, 
  priority = 'medium',
  variant = 'default',
  className = ''
}: ComingSoonBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityConfig = {
    high: {
      color: 'bg-intent/20 text-intent border-intent/40',
      icon: <Rocket className="w-3 h-3" />,
      label: 'High Priority'
    },
    medium: {
      color: 'bg-story/20 text-story border-story/40',
      icon: <Zap className="w-3 h-3" />,
      label: 'In Development'
    },
    low: {
      color: 'bg-muted/50 text-muted-foreground border-muted',
      icon: <Clock className="w-3 h-3" />,
      label: 'Planned'
    }
  };

  const config = priorityConfig[priority];

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const upcomingFeatures = [
    {
      name: 'CineFlow Auto-Editor',
      description: 'AI-powered automatic editing with cultural storytelling patterns',
      priority: 'high',
      eta: 'Q2 2025',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'text-intent'
    },
    {
      name: 'Cultural Verification System',
      description: 'Community-driven authenticity verification for cultural content',
      priority: 'high',
      eta: 'Q2 2025',
      icon: <Star className="w-4 h-4" />,
      color: 'text-verification'
    },
    {
      name: 'FFZ Interactive Modules',
      description: 'Hands-on learning modules with real-time feedback',
      priority: 'medium',
      eta: 'Q3 2025',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-experience'
    },
    {
      name: 'CineHub Distribution',
      description: 'Multi-platform distribution with verification badges',
      priority: 'medium',
      eta: 'Q3 2025',
      icon: <Crown className="w-4 h-4" />,
      color: 'text-story'
    },
    {
      name: 'Mobile Cine Suite',
      description: 'Full professional editing suite for mobile devices',
      priority: 'high',
      eta: 'Q4 2025',
      icon: <Rocket className="w-4 h-4" />,
      color: 'text-community'
    }
  ];

  if (variant === 'compact') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${config.color} cursor-pointer hover:bg-opacity-30 transition-colors ${className}`}
          >
            {config.icon}
            <span className="ml-1 font-primary text-xs">Coming Soon</span>
          </Badge>
        </DialogTrigger>
        
        <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              {config.icon}
              {feature}
            </DialogTitle>
            <DialogDescription className="font-primary">
              {description || `${feature} is currently in development and will be available soon.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {estimatedDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-primary">Expected: {estimatedDate}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-primary font-medium">Get notified when it's ready</h3>
              
              {!success ? (
                <form onSubmit={handleNotifyMe} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="notify-email" className="font-primary">Email</Label>
                    <Input
                      id="notify-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-primary"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-intent hover:bg-intent/90 text-white font-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Adding to waitlist...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Notify Me
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <Alert className="border-experience/50 bg-experience/10">
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="text-experience font-primary">
                    You'll be notified when {feature} is available!
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-primary font-medium text-sm">Other upcoming features</h4>
              <div className="space-y-2">
                {upcomingFeatures.filter(f => f.name !== feature).slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <div className={item.color}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-primary text-sm font-medium truncate">{item.name}</p>
                      <p className="font-primary text-xs text-muted-foreground truncate">{item.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground font-primary">
                      {item.eta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer 
          hover:bg-opacity-30 transition-all duration-200 group
          ${config.color} ${className}
        `}>
          {config.icon}
          <span className="font-primary text-sm font-medium">Coming Soon</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border border-border/50">
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-xl font-bold text-gradient-ecosystem">
            🚀 EyeMotion Development Roadmap
          </DialogTitle>
          <DialogDescription className="font-primary">
            Get early access to cutting-edge visual storytelling tools
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured item */}
          <div className="border border-border/50 rounded-lg p-4 bg-muted/20">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${config.color.replace('text-', 'bg-').replace('border-', 'bg-')}/20`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-primary font-semibold">{feature}</h3>
                <p className="font-primary text-sm text-muted-foreground mt-1">
                  {description || `${feature} is currently in development and will be available soon.`}
                </p>
                {estimatedDate && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-primary">Expected: {estimatedDate}</span>
                  </div>
                )}
              </div>
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Notification signup */}
          <div className="space-y-4">
            <h3 className="font-primary font-semibold">Get Early Access</h3>
            
            {!success ? (
              <form onSubmit={handleNotifyMe} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="roadmap-email" className="font-primary">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="roadmap-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 font-primary"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-intent hover:bg-intent/90 text-white font-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Joining waitlist...
                    </>
                  ) : (
                    <>
                      <Bell className="mr-2 h-4 w-4" />
                      Join Early Access Waitlist
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <Alert className="border-experience/50 bg-experience/10">
                <Mail className="h-4 w-4" />
                <AlertDescription className="text-experience font-primary">
                  🎉 Welcome to the EyeMotion early access program! You'll be among the first to experience new features.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* All upcoming features */}
          <div className="space-y-4">
            <h4 className="font-primary font-semibold">Complete Development Roadmap</h4>
            <div className="grid gap-3">
              {upcomingFeatures.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-muted/30 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-primary font-medium">{item.name}</p>
                    <p className="font-primary text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-primary font-medium">{item.eta}</div>
                    <Badge 
                      variant="outline" 
                      size="sm" 
                      className={priorityConfig[item.priority as keyof typeof priorityConfig].color}
                    >
                      {priorityConfig[item.priority as keyof typeof priorityConfig].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-primary">
              Join thousands of creators building the future of visual storytelling
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
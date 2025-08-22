import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Mail, Lock, User, Sparkles, Zap, Star, Crown } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const { signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Update active tab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const resetForms = () => {
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const result = await signIn(signInForm.email, signInForm.password);
      
      if (result.success) {
        setSuccess('Successfully signed in! Welcome back to EyeMotion.');
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName);
      
      if (result.success) {
        setSuccess(
          result.error || 
          'Welcome to EyeMotion! Your account has been created successfully.'
        );
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subscriptionTiers = [
    {
      name: 'Freemium',
      price: 'Free',
      credits: '100 credits',
      storage: '1GB',
      features: ['Basic editing', 'Watermark', 'Community access'],
      color: 'bg-experience/20 text-experience border-experience/40',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      name: 'Creator',
      price: '฿299/month',
      credits: '1K credits',
      storage: '5GB',
      features: ['HD export', 'Basic AI', 'FFZ Level 1'],
      color: 'bg-story/20 text-story border-story/40',
      icon: <Zap className="w-4 h-4" />
    },
    {
      name: 'Pro',
      price: '฿999/month',
      credits: '5K credits',
      storage: '50GB',
      features: ['4K export', 'Advanced AI', 'FFZ Level 2'],
      color: 'bg-verification/20 text-verification border-verification/40',
      icon: <Star className="w-4 h-4" />
    },
    {
      name: 'Studio',
      price: '฿2,999/month',
      credits: '20K credits',
      storage: '500GB',
      features: ['Unlimited export', 'Premium AI', 'FFZ Level 3'],
      color: 'bg-intent/20 text-intent border-intent/40',
      icon: <Crown className="w-4 h-4" />
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border border-border/50">
        <DialogHeader className="text-center">
          <DialogTitle className="text-gradient-ecosystem font-display text-2xl font-bold tracking-tight">
            EyeMotion
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Join the Adaptive Visual Storytelling Revolution
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="signin" className="font-primary">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="font-primary">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-6 mt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="font-primary font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 font-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="font-primary font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 font-primary"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive font-primary">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-experience/50 bg-experience/10">
                  <AlertDescription className="text-experience font-primary">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-intent hover:bg-intent/90 text-white font-primary font-medium"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to EyeMotion'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setActiveTab('signup')}
                className="text-sm text-muted-foreground hover:text-foreground font-primary"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6 mt-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="font-primary font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10 font-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="font-primary font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 font-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="font-primary font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 font-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="font-primary font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 font-primary"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive font-primary">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-experience/50 bg-experience/10">
                  <AlertDescription className="text-experience font-primary">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-intent hover:bg-intent/90 text-white font-primary font-medium"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Join EyeMotion'
                )}
              </Button>
            </form>

            <div className="space-y-3">
              <Separator />
              
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground font-primary">
                  Start with Freemium tier - upgrade anytime
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {subscriptionTiers.map((tier, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`${tier.color} flex items-center gap-1 justify-center px-2 py-1 text-xs font-primary`}
                    >
                      {tier.icon}
                      <span>{tier.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setActiveTab('signin')}
                className="text-sm text-muted-foreground hover:text-foreground font-primary"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground font-primary">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
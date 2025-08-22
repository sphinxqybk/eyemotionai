import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ComingSoonBadge } from '../components/ComingSoonBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  CreditCard, 
  Zap, 
  GraduationCap, 
  PlayCircle, 
  Upload,
  Settings,
  Crown,
  Star,
  Sparkles,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  FileVideo,
  Users,
  Globe
} from 'lucide-react';

export function Dashboard() {
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-intent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-primary text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="font-primary text-muted-foreground">Please sign in to access your dashboard.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-intent hover:bg-intent/90 text-white">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const subscriptionTierConfig = {
    freemium: { 
      icon: <Sparkles className="w-5 h-5" />, 
      color: 'bg-experience/20 text-experience border-experience/40',
      name: 'Freemium',
      description: 'Basic features with watermark'
    },
    creator: { 
      icon: <Zap className="w-5 h-5" />, 
      color: 'bg-story/20 text-story border-story/40',
      name: 'Creator',
      description: 'Perfect for independent filmmakers'
    },
    pro: { 
      icon: <Star className="w-5 h-5" />, 
      color: 'bg-verification/20 text-verification border-verification/40',
      name: 'Pro',
      description: 'Professional tools for serious creators'
    },
    studio: { 
      icon: <Crown className="w-5 h-5" />, 
      color: 'bg-intent/20 text-intent border-intent/40',
      name: 'Studio',
      description: 'Complete studio solution'
    }
  };

  const ffzLevelConfig = {
    0: { 
      name: 'Experience Capture', 
      color: 'text-experience',
      description: 'Learn to document and capture your lived experiences',
      nextLevel: 'Narrative Structure'
    },
    1: { 
      name: 'Narrative Structure', 
      color: 'text-story',
      description: 'Transform experiences into compelling stories',
      nextLevel: 'Technical Proficiency'
    },
    2: { 
      name: 'Technical Proficiency', 
      color: 'text-verification',
      description: 'Master professional editing and AI tools',
      nextLevel: 'Professional Mastery'
    },
    3: { 
      name: 'Professional Mastery', 
      color: 'text-intent',
      description: 'Lead projects and mentor other creators',
      nextLevel: 'Complete!'
    }
  };

  const currentTier = userProfile.subscription_tier ? subscriptionTierConfig[userProfile.subscription_tier] : null;
  const currentFFZ = ffzLevelConfig[userProfile.ffz_level];

  const recentProjects = [
    {
      id: 1,
      title: 'My Cultural Heritage Story',
      type: 'Cultural Documentation',
      status: 'In Progress',
      lastModified: '2 hours ago',
      progress: 65
    },
    {
      id: 2,
      title: 'Community Festival Highlights',
      type: 'Event Coverage',
      status: 'Completed',
      lastModified: '1 day ago',
      progress: 100
    },
    {
      id: 3,
      title: 'FFZ Level 1: Story Basics',
      type: 'Educational',
      status: 'In Progress',
      lastModified: '3 days ago',
      progress: 40
    }
  ];

  const upcomingFeatures = [
    { name: 'CineFlow Auto-Editor', eta: 'Q2 2025', priority: 'high' as const },
    { name: 'Cultural Verification System', eta: 'Q2 2025', priority: 'high' as const },
    { name: 'FFZ Interactive Modules', eta: 'Q3 2025', priority: 'medium' as const },
    { name: 'Mobile Cine Suite', eta: 'Q4 2025', priority: 'high' as const }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="standard-hero text-gradient-ecosystem">
                Welcome back, {userProfile.full_name || 'Creator'}!
              </h1>
              <p className="standard-body text-muted-foreground mt-2">
                Continue your adaptive visual storytelling journey
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {currentTier && (
                <Badge variant="outline" className={`${currentTier.color} h-8 px-3`}>
                  {currentTier.icon}
                  <span className="ml-2 font-primary font-medium">{currentTier.name}</span>
                </Badge>
              )}
              
              <Button variant="outline" className="font-primary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-experience/20 rounded-lg">
                    <Zap className="w-5 h-5 text-experience" />
                  </div>
                  <div>
                    <p className="font-primary text-sm text-muted-foreground">Credits</p>
                    <p className="font-primary font-semibold text-lg">
                      {userProfile.credits_remaining.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-story/20 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-story" />
                  </div>
                  <div>
                    <p className="font-primary text-sm text-muted-foreground">FFZ Level</p>
                    <p className={`font-primary font-semibold text-lg ${currentFFZ.color}`}>
                      Level {userProfile.ffz_level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-verification/20 rounded-lg">
                    <FileVideo className="w-5 h-5 text-verification" />
                  </div>
                  <div>
                    <p className="font-primary text-sm text-muted-foreground">Projects</p>
                    <p className="font-primary font-semibold text-lg">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-community/20 rounded-lg">
                    <Globe className="w-5 h-5 text-community" />
                  </div>
                  <div>
                    <p className="font-primary text-sm text-muted-foreground">Storage</p>
                    <p className="font-primary font-semibold text-lg">
                      {userProfile.storage_used_gb.toFixed(1)}GB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="font-primary">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="font-primary">Projects</TabsTrigger>
            <TabsTrigger value="learning" className="font-primary">FFZ Learning</TabsTrigger>
            <TabsTrigger value="community" className="font-primary">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* FFZ Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 professional-heading">
                      <GraduationCap className="w-5 h-5 text-story" />
                      Film From Zero Progress
                    </CardTitle>
                    <CardDescription className="professional-body">
                      Your journey in adaptive visual storytelling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-primary font-medium ${currentFFZ.color}`}>
                          {currentFFZ.name}
                        </span>
                        <span className="font-primary text-sm text-muted-foreground">
                          Level {userProfile.ffz_level}/3
                        </span>
                      </div>
                      <Progress value={(userProfile.ffz_level / 3) * 100} className="h-3" />
                      <p className="font-primary text-sm text-muted-foreground mt-2">
                        {currentFFZ.description}
                      </p>
                    </div>

                    {userProfile.ffz_level < 3 && (
                      <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                        <Award className="w-5 h-5 text-intent" />
                        <div className="flex-1">
                          <p className="font-primary font-medium">Next: {currentFFZ.nextLevel}</p>
                          <p className="font-primary text-sm text-muted-foreground">
                            Continue learning to unlock advanced features
                          </p>
                        </div>
                        <ComingSoonBadge 
                          feature="FFZ Interactive Modules"
                          description="Hands-on learning modules with real-time feedback"
                          variant="compact"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between professional-heading">
                      <div className="flex items-center gap-2">
                        <FileVideo className="w-5 h-5 text-verification" />
                        Recent Projects
                      </div>
                      <Button variant="outline" size="sm" className="font-primary">
                        <Upload className="w-4 h-4 mr-2" />
                        New Project
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="flex items-center gap-4 p-3 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="p-2 bg-intent/20 rounded-lg">
                            <PlayCircle className="w-5 h-5 text-intent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-primary font-medium truncate">{project.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" size="sm" className="text-xs">
                                {project.type}
                              </Badge>
                              <span className="font-primary text-xs text-muted-foreground">
                                {project.lastModified}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-primary text-sm font-medium">{project.progress}%</p>
                            <Progress value={project.progress} className="w-20 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Account Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="professional-heading">Account Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-primary text-sm text-muted-foreground">Plan</span>
                        {currentTier && (
                          <Badge variant="outline" className={currentTier.color}>
                            {currentTier.icon}
                            <span className="ml-1">{currentTier.name}</span>
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-primary text-sm text-muted-foreground">Status</span>
                        <Badge variant="outline" className="bg-experience/20 text-experience border-experience/40">
                          Active
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-primary text-sm text-muted-foreground">Credits</span>
                          <span className="font-primary text-sm font-medium">
                            {userProfile.credits_remaining.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-primary text-sm text-muted-foreground">Storage</span>
                            <span className="font-primary text-sm font-medium">
                              {userProfile.storage_used_gb.toFixed(1)}GB / 50GB
                            </span>
                          </div>
                          <Progress value={(userProfile.storage_used_gb / 50) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-intent hover:bg-intent/90 text-white font-primary">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>

                {/* Coming Soon Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="professional-heading">Coming Soon</CardTitle>
                    <CardDescription className="professional-body">
                      Exciting features in development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-primary text-sm font-medium truncate">{feature.name}</p>
                            <p className="font-primary text-xs text-muted-foreground">{feature.eta}</p>
                          </div>
                          <ComingSoonBadge 
                            feature={feature.name}
                            priority={feature.priority}
                            variant="compact"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="professional-heading">Your Projects</CardTitle>
                <CardDescription className="professional-body">
                  Manage and create your visual storytelling projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="font-primary">
                    Project management features are coming soon! For now, you can track your progress in the overview.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="professional-heading">FFZ Learning Path</CardTitle>
                <CardDescription className="professional-body">
                  Your personalized Film From Zero educational journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <GraduationCap className="h-4 w-4" />
                  <AlertDescription className="font-primary">
                    Interactive FFZ learning modules are in development. Stay tuned for hands-on storytelling education!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="professional-heading">Community Hub</CardTitle>
                <CardDescription className="professional-body">
                  Connect with fellow creators and cultural storytellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription className="font-primary">
                    Community features and cultural collaboration tools are coming soon!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Default export for AppRouter compatibility
export default Dashboard;
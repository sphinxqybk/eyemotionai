import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  HardDrive, 
  Archive, 
  Trash2, 
  Star, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';

interface StorageData {
  analytics: {
    hot: { count: number; size_gb: number };
    warm: { count: number; size_gb: number };
    archive: { count: number; size_gb: number };
    favorites: { count: number; size_gb: number };
    total: { count: number; size_gb: number };
  };
  costs: {
    hot: number;
    warm: number;
    archive: number;
    total: number;
    currency: string;
    period: string;
  };
  suggestions: Array<{
    type: string;
    potential_savings: number;
    description: string;
  }>;
  total_files: number;
}

interface Props {
  userId: string;
  language: 'th' | 'en';
}

export const StorageManagement: React.FC<Props> = ({ userId, language }) => {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);

  // Load storage data
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        setLoading(true);
        
        // Call backend API to get storage analytics
        const response = await fetch(`/api/storage/analytics/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to load storage data');
        
        const data = await response.json();
        setStorageData(data.data);
      } catch (error) {
        console.error('Failed to load storage data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadStorageData();
      
      // Refresh every 5 minutes
      const interval = setInterval(loadStorageData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Handle storage optimization
  const handleOptimization = async (aggressive = false) => {
    try {
      setOptimizing(true);
      
      const response = await fetch('/api/storage/optimize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          aggressive
        })
      });
      
      if (!response.ok) throw new Error('Optimization failed');
      
      const result = await response.json();
      setLastOptimization(new Date());
      
      // Reload storage data
      setTimeout(() => {
        loadStorageData();
      }, 1000);
      
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const content = {
    th: {
      title: 'จัดการพื้นที่เก็บข้อมูล',
      overview: 'ภาพรวมการใช้งาน',
      analytics: 'วิเคราะห์การใช้งาน',
      optimization: 'เพิ่มประสิทธิภาพ',
      costs: 'ค่าใช้จ่าย',
      hotStorage: 'ไฟล์ใช้งานบ่อย',
      warmStorage: 'ไฟล์ใช้งานปานกลาง',
      archiveStorage: 'ไฟล์เก็บถาวร',
      favoriteFiles: 'ไฟล์สำคัญ',
      totalFiles: 'จำนวนไฟล์ทั้งหมด',
      monthlyCost: 'ค่าใช้จ่ายต่อเดือน',
      optimizeNow: 'เพิ่มประสิทธิภาพ',
      aggressiveOptimize: 'เพิ่มประสิทธิภาพแบบเข้มข้น',
      recommendations: 'คำแนะนำ',
      potentialSavings: 'ประหยัดได้',
      lastOptimized: 'เพิ่มประสิทธิภาพล่าสุด',
      optimizing: 'กำลังเพิ่มประสิทธิภาพ...',
      files: 'ไฟล์',
      baht: 'บาท'
    },
    en: {
      title: 'Storage Management',
      overview: 'Usage Overview',
      analytics: 'Analytics',
      optimization: 'Optimization',
      costs: 'Costs',
      hotStorage: 'Hot Storage',
      warmStorage: 'Warm Storage', 
      archiveStorage: 'Archive Storage',
      favoriteFiles: 'Favorite Files',
      totalFiles: 'Total Files',
      monthlyCost: 'Monthly Cost',
      optimizeNow: 'Optimize Now',
      aggressiveOptimize: 'Aggressive Optimize',
      recommendations: 'Recommendations',
      potentialSavings: 'Potential Savings',
      lastOptimized: 'Last Optimized',
      optimizing: 'Optimizing...',
      files: 'files',
      baht: 'THB'
    }
  };

  const t = content[language];

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-chart-1" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-8 h-8 border-2 rounded-full animate-spin border-t-transparent"
                style={{ borderColor: 'oklch(0.488 0.243 264.376)' }}
              />
              <p className="text-sm font-medium text-muted-foreground">
                Loading storage data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!storageData) return null;

  const { analytics, costs, suggestions } = storageData;

  return (
    <div className="space-y-6">
      {/* Storage Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.hotStorage}</p>
                  <p className="text-2xl font-medium text-foreground">
                    {analytics.hot.size_gb.toFixed(1)} GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.hot.count} {t.files}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.488 0.243 264.376 / 0.15)' }}
                >
                  <HardDrive 
                    className="h-4 w-4" 
                    style={{ color: 'oklch(0.488 0.243 264.376)' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.warmStorage}</p>
                  <p className="text-2xl font-medium text-foreground">
                    {analytics.warm.size_gb.toFixed(1)} GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.warm.count} {t.files}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.696 0.17 162.48 / 0.15)' }}
                >
                  <Clock 
                    className="h-4 w-4" 
                    style={{ color: 'oklch(0.696 0.17 162.48)' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.archiveStorage}</p>
                  <p className="text-2xl font-medium text-foreground">
                    {analytics.archive.size_gb.toFixed(1)} GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.archive.count} {t.files}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.769 0.188 70.08 / 0.15)' }}
                >
                  <Archive 
                    className="h-4 w-4" 
                    style={{ color: 'oklch(0.769 0.188 70.08)' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.favoriteFiles}</p>
                  <p className="text-2xl font-medium text-foreground">
                    {analytics.favorites.size_gb.toFixed(1)} GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.favorites.count} {t.files}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.627 0.265 303.9 / 0.15)' }}
                >
                  <Star 
                    className="h-4 w-4" 
                    style={{ color: 'oklch(0.627 0.265 303.9)' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cost Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-chart-1" />
            {t.costs}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t.monthlyCost} - {costs.period}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t.hotStorage}</span>
                <span className="text-sm font-medium text-foreground">
                  ฿{costs.hot.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={(costs.hot / costs.total) * 100} 
                className="h-2"
                style={{
                  background: 'oklch(0.269 0 0)',
                  color: 'oklch(0.488 0.243 264.376)'
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t.warmStorage}</span>
                <span className="text-sm font-medium text-foreground">
                  ฿{costs.warm.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={(costs.warm / costs.total) * 100} 
                className="h-2"
                style={{
                  background: 'oklch(0.269 0 0)',
                  color: 'oklch(0.696 0.17 162.48)'
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t.archiveStorage}</span>
                <span className="text-sm font-medium text-foreground">
                  ฿{costs.archive.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={(costs.archive / costs.total) * 100} 
                className="h-2"
                style={{
                  background: 'oklch(0.269 0 0)',
                  color: 'oklch(0.769 0.188 70.08)'
                }}
              />
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-foreground">{t.monthlyCost}</span>
            <span className="text-2xl font-medium text-foreground">
              ฿{costs.total.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-chart-2" />
              {t.recommendations}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {suggestion.description}
                      </p>
                      {suggestion.potential_savings > 0 && (
                        <p className="text-xs text-chart-2 mt-1">
                          {t.potentialSavings}: ฿{suggestion.potential_savings.toFixed(2)}/{t.baht}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs bg-chart-2/15 text-chart-2 border-chart-2/20"
                    >
                      {suggestion.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-8 w-8 text-chart-2 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {language === 'th' ? 'การใช้งานอยู่ในระดับที่เหมาะสม' : 'Storage usage is optimized'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optimization Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-3">
              <Settings className="h-5 w-5 text-chart-3" />
              {t.optimization}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastOptimization && (
              <Alert className="bg-secondary/50 border-border">
                <CheckCircle className="h-4 w-4 text-chart-2" />
                <AlertTitle className="text-sm font-medium text-foreground">
                  {t.lastOptimized}
                </AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                  {lastOptimization.toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => handleOptimization(false)}
                disabled={optimizing}
                className="w-full bg-chart-1 hover:bg-chart-1/90 text-white font-medium gap-2"
              >
                {optimizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.optimizing}
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4" />
                    {t.optimizeNow}
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleOptimization(true)}
                disabled={optimizing}
                variant="outline"
                className="w-full border-border hover:bg-secondary/50 font-medium gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-chart-3" />
                {t.aggressiveOptimize}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• {language === 'th' ? 'เพิ่มประสิทธิภาพปกติ: Archive ไฟล์เก่า' : 'Standard: Archive old files'}</p>
              <p>• {language === 'th' ? 'แบบเข้มข้น: ลบไฟล์เก่าที่ไม่ใช่รายการโปรด' : 'Aggressive: Delete old non-favorite files'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorageManagement;
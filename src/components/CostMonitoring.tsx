import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  BarChart3,
  Clock,
  Bell,
  Settings
} from 'lucide-react';

interface CostData {
  current_cost_thb: number;
  cost_limit_thb: number;
  cost_percentage: number;
  alert_level: 'ok' | 'warning' | 'critical';
  storage_gb: number;
  plan_name: string;
  monthly_trend: {
    current_month: number;
    previous_month: number;
    trend_percentage: number;
  };
  projections: {
    next_month: number;
    next_quarter: number;
    annual: number;
  };
}

interface Props {
  userId: string;
  language: 'th' | 'en';
}

export const CostMonitoring: React.FC<Props> = ({ userId, language }) => {
  const [costData, setCostData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Load cost monitoring data
  useEffect(() => {
    const loadCostData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/monitoring/costs/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to load cost data');
        
        const data = await response.json();
        setCostData(data.data);
      } catch (error) {
        console.error('Failed to load cost data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadCostData();
      
      // Refresh every minute for real-time monitoring
      const interval = setInterval(loadCostData, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const content = {
    th: {
      title: 'ติดตามค่าใช้จ่าย',
      currentCosts: 'ค่าใช้จ่ายปัจจุบัน',
      monthlyLimit: 'วงเงินรายเดือน',
      usage: 'การใช้งาน',
      trend: 'แนวโน้ม',
      projections: 'การคาดการณ์',
      nextMonth: 'เดือนถัดไป',
      nextQuarter: 'ไตรมาสถัดไป',
      annual: 'ประจำปี',
      alertLevel: {
        ok: 'ปกติ',
        warning: 'เตือน',
        critical: 'วิกฤต'
      },
      planUpgrade: 'อัปเกรดแผน',
      costOptimization: 'เพิ่มประสิทธิภาพค่าใช้จ่าย',
      enableAlerts: 'เปิดการแจ้งเตือน',
      withinBudget: 'อยู่ในงบประมาณ',
      approachingLimit: 'ใกล้ถึงขีดจำกัด',
      overLimit: 'เกินขีดจำกัด',
      increase: 'เพิ่มขึ้น',
      decrease: 'ลดลง',
      storage: 'พื้นที่เก็บข้อมูล',
      baht: 'บาท'
    },
    en: {
      title: 'Cost Monitoring',
      currentCosts: 'Current Costs',
      monthlyLimit: 'Monthly Limit',
      usage: 'Usage',
      trend: 'Trend',
      projections: 'Projections',
      nextMonth: 'Next Month',
      nextQuarter: 'Next Quarter',
      annual: 'Annual',
      alertLevel: {
        ok: 'OK',
        warning: 'Warning',
        critical: 'Critical'
      },
      planUpgrade: 'Upgrade Plan',
      costOptimization: 'Cost Optimization',
      enableAlerts: 'Enable Alerts',
      withinBudget: 'Within Budget',
      approachingLimit: 'Approaching Limit',
      overLimit: 'Over Limit',
      increase: 'Increase',
      decrease: 'Decrease',
      storage: 'Storage',
      baht: 'THB'
    }
  };

  const t = content[language];

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'oklch(0.396 0.141 25.723)';
      case 'warning': return 'oklch(0.769 0.188 70.08)';
      default: return 'oklch(0.696 0.17 162.48)';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return AlertTriangle;
      case 'warning': return Bell;
      default: return CheckCircle;
    }
  };

  const getStatusMessage = (level: string) => {
    switch (level) {
      case 'critical': return t.overLimit;
      case 'warning': return t.approachingLimit;
      default: return t.withinBudget;
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-chart-1" />
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
                Loading cost data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!costData) return null;

  const AlertIcon = getAlertIcon(costData.alert_level);

  return (
    <div className="space-y-6">
      {/* Cost Alert Status */}
      <Alert 
        className={`border-2 ${
          costData.alert_level === 'critical' ? 'bg-destructive/10 border-destructive/50' :
          costData.alert_level === 'warning' ? 'bg-orange-500/10 border-orange-500/50' :
          'bg-green-500/10 border-green-500/50'
        }`}
      >
        <AlertIcon 
          className="h-4 w-4" 
          style={{ color: getAlertColor(costData.alert_level) }}
        />
        <AlertTitle className="text-sm font-medium text-foreground">
          {getStatusMessage(costData.alert_level)}
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          {costData.cost_percentage.toFixed(1)}% {t.usage} - {costData.plan_name.toUpperCase()} Plan
        </AlertDescription>
      </Alert>

      {/* Current Cost Overview */}
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
                  <p className="text-sm font-medium text-muted-foreground">{t.currentCosts}</p>
                  <p className="text-2xl font-medium text-foreground">
                    ฿{costData.current_cost_thb.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'th' ? 'เดือนนี้' : 'This month'}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.488 0.243 264.376 / 0.15)' }}
                >
                  <DollarSign 
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
                  <p className="text-sm font-medium text-muted-foreground">{t.monthlyLimit}</p>
                  <p className="text-2xl font-medium text-foreground">
                    ฿{costData.cost_limit_thb.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {costData.plan_name.toUpperCase()}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.696 0.17 162.48 / 0.15)' }}
                >
                  <Target 
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
                  <p className="text-sm font-medium text-muted-foreground">{t.usage}</p>
                  <p className="text-2xl font-medium text-foreground">
                    {costData.cost_percentage.toFixed(1)}%
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={Math.min(100, costData.cost_percentage)} 
                      className="h-2"
                      style={{
                        background: 'oklch(0.269 0 0)',
                        color: getAlertColor(costData.alert_level)
                      }}
                    />
                  </div>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getAlertColor(costData.alert_level)} / 0.15` }}
                >
                  <BarChart3 
                    className="h-4 w-4" 
                    style={{ color: getAlertColor(costData.alert_level) }}
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
                  <p className="text-sm font-medium text-muted-foreground">{t.storage}</p>
                  <p className="text-2xl font-medium text-foreground">
                    {costData.storage_gb.toFixed(1)} GB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'th' ? 'รวมทั้งหมด' : 'Total usage'}
                  </p>
                </div>
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'oklch(0.769 0.188 70.08 / 0.15)' }}
                >
                  <Target 
                    className="h-4 w-4" 
                    style={{ color: 'oklch(0.769 0.188 70.08)' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cost Trend and Projections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-chart-2" />
              {t.trend}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {language === 'th' ? 'เปรียบเทียบกับเดือนที่แล้ว' : 'Compared to last month'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {language === 'th' ? 'เดือนก่อน' : 'Previous Month'}
              </span>
              <span className="text-sm font-medium text-foreground">
                ฿{costData.monthly_trend.previous_month.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {language === 'th' ? 'เดือนนี้' : 'Current Month'}
              </span>
              <span className="text-sm font-medium text-foreground">
                ฿{costData.monthly_trend.current_month.toFixed(2)}
              </span>
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {language === 'th' ? 'การเปลี่ยนแปลง' : 'Change'}
              </span>
              <div className="flex items-center gap-2">
                {costData.monthly_trend.trend_percentage > 0 ? (
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-2" />
                )}
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    costData.monthly_trend.trend_percentage > 0 
                      ? 'bg-chart-3/15 text-chart-3 border-chart-3/20'
                      : 'bg-chart-2/15 text-chart-2 border-chart-2/20'
                  }`}
                >
                  {costData.monthly_trend.trend_percentage > 0 ? '+' : ''}
                  {costData.monthly_trend.trend_percentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Projections */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-3">
              <Clock className="h-5 w-5 text-chart-4" />
              {t.projections}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {language === 'th' ? 'คาดการณ์ค่าใช้จ่าย' : 'Estimated future costs'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="text-sm font-medium text-foreground">{t.nextMonth}</span>
                <span className="text-sm font-medium text-foreground">
                  ฿{costData.projections.next_month.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="text-sm font-medium text-foreground">{t.nextQuarter}</span>
                <span className="text-sm font-medium text-foreground">
                  ฿{costData.projections.next_quarter.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="text-sm font-medium text-foreground">{t.annual}</span>
                <span className="text-sm font-medium text-foreground">
                  ฿{costData.projections.annual.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {costData.alert_level !== 'ok' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            className="bg-chart-1 hover:bg-chart-1/90 text-white font-medium gap-2"
          >
            <TrendingDown className="h-4 w-4" />
            {t.costOptimization}
          </Button>
          
          {costData.alert_level === 'critical' && (
            <Button
              variant="outline"
              className="border-border hover:bg-secondary/50 font-medium gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {t.planUpgrade}
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CostMonitoring;
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  File, 
  Clock, 
  Archive, 
  Trash2, 
  Star, 
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  Timer,
  HardDrive,
  Zap
} from 'lucide-react';

interface FileLifecycleData {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  processing_status: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  lifecycle_stage: string;
  days_until_next_stage: number;
  cost_tier: string;
  monthly_cost: number;
}

interface Props {
  projectId?: string;
  userId: string;
  language: 'th' | 'en';
}

export const FileLifecycle: React.FC<Props> = ({ projectId, userId, language }) => {
  const [files, setFiles] = useState<FileLifecycleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Load file lifecycle data
  useEffect(() => {
    const loadFileData = async () => {
      try {
        setLoading(true);
        
        const url = projectId 
          ? `/api/files/lifecycle/project/${projectId}`
          : `/api/files/lifecycle/user/${userId}`;
          
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to load file data');
        
        const data = await response.json();
        setFiles(data.data || []);
      } catch (error) {
        console.error('Failed to load file data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadFileData();
    }
  }, [projectId, userId]);

  const content = {
    th: {
      title: 'วงจรชีวิตไฟล์',
      description: 'ติดตามสถานะและการจัดการไฟล์อัตโนมัติ',
      allFiles: 'ไฟล์ทั้งหมด',
      hotStorage: 'ใช้งานบ่อย',
      warmStorage: 'ใช้งานปานกลาง',
      archived: 'เก็บถาวร',
      favorites: 'รายการโปรด',
      scheduled: 'กำหนดลบ',
      fileName: 'ชื่อไฟล์',
      size: 'ขนาด',
      status: 'สถานะ',
      nextStage: 'ขั้นตอนถัดไป',
      cost: 'ค่าใช้จ่าย',
      daysUntil: 'วันที่เหลือ',
      markFavorite: 'ทำเครื่องหมายเป็นรายการโปรด',
      download: 'ดาวน์โหลด',
      preview: 'ดูตัวอย่าง',
      noFiles: 'ไม่มีไฟล์',
      noFilesDesc: 'ยังไม่มีไฟล์ในระบบ',
      baht: 'บาท',
      perMonth: '/เดือน',
      stages: {
        hot: 'ใช้งานบ่อย',
        warm: 'ใช้งานปานกลาง',
        archive: 'เก็บถาวร',
        cold: 'เก็บเย็น',
        scheduled_deletion: 'กำหนดลบ',
        favorite_archive: 'เก็บถาวรพิเศษ'
      }
    },
    en: {
      title: 'File Lifecycle',
      description: 'Track file status and automated management',
      allFiles: 'All Files',
      hotStorage: 'Hot Storage',
      warmStorage: 'Warm Storage',
      archived: 'Archived',
      favorites: 'Favorites',
      scheduled: 'Scheduled',
      fileName: 'File Name',
      size: 'Size',
      status: 'Status',
      nextStage: 'Next Stage',
      cost: 'Cost',
      daysUntil: 'Days Until',
      markFavorite: 'Mark as Favorite',
      download: 'Download',
      preview: 'Preview',
      noFiles: 'No Files',
      noFilesDesc: 'No files in the system yet',
      baht: 'THB',
      perMonth: '/month',
      stages: {
        hot: 'Hot Storage',
        warm: 'Warm Storage',
        archive: 'Archived',
        cold: 'Cold Storage',
        scheduled_deletion: 'Scheduled Deletion',
        favorite_archive: 'Favorite Archive'
      }
    }
  };

  const t = content[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
      case 'uploaded': return 'oklch(0.488 0.243 264.376)';
      case 'warm_storage': return 'oklch(0.696 0.17 162.48)';
      case 'archived':
      case 'favorite_archive': return 'oklch(0.769 0.188 70.08)';
      case 'cold_storage': return 'oklch(0.627 0.265 303.9)';
      case 'scheduled_deletion': return 'oklch(0.396 0.141 25.723)';
      default: return 'oklch(0.708 0 0)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
      case 'uploaded': return HardDrive;
      case 'warm_storage': return Clock;
      case 'archived':
      case 'favorite_archive': return Archive;
      case 'cold_storage': return Zap;
      case 'scheduled_deletion': return Trash2;
      default: return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDaysUntil = (days: number) => {
    if (days < 0) return language === 'th' ? 'หมดเวลาแล้ว' : 'Overdue';
    if (days === 0) return language === 'th' ? 'วันนี้' : 'Today';
    if (days === 1) return language === 'th' ? 'พรุ่งนี้' : 'Tomorrow';
    return `${days} ${language === 'th' ? 'วัน' : 'days'}`;
  };

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return file.is_favorite;
    if (filter === 'hot') return ['ready', 'uploaded'].includes(file.processing_status);
    if (filter === 'warm') return file.processing_status === 'warm_storage';
    if (filter === 'archived') return ['archived', 'favorite_archive'].includes(file.processing_status);
    if (filter === 'scheduled') return file.processing_status === 'scheduled_deletion';
    return true;
  });

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <File className="h-5 w-5 text-chart-1" />
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
                Loading file lifecycle...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground flex items-center gap-3">
          <File className="h-5 w-5 text-chart-1" />
          {t.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: t.allFiles, count: files.length },
            { key: 'hot', label: t.hotStorage, count: files.filter(f => ['ready', 'uploaded'].includes(f.processing_status)).length },
            { key: 'warm', label: t.warmStorage, count: files.filter(f => f.processing_status === 'warm_storage').length },
            { key: 'archived', label: t.archived, count: files.filter(f => ['archived', 'favorite_archive'].includes(f.processing_status)).length },
            { key: 'favorites', label: t.favorites, count: files.filter(f => f.is_favorite).length },
            { key: 'scheduled', label: t.scheduled, count: files.filter(f => f.processing_status === 'scheduled_deletion').length }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.key)}
              className={`gap-2 ${
                filter === tab.key 
                  ? 'bg-chart-1 hover:bg-chart-1/90 text-white' 
                  : 'border-border hover:bg-secondary/50'
              }`}
            >
              {tab.label}
              <Badge 
                variant="secondary" 
                className="text-xs bg-background/20 text-current border-current/20"
              >
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>

        <Separator className="bg-border" />

        {/* Files List */}
        {filteredFiles.length > 0 ? (
          <div className="space-y-4">
            {filteredFiles.map((file, index) => {
              const StatusIcon = getStatusIcon(file.processing_status);
              const statusColor = getStatusColor(file.processing_status);
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* File Icon and Info */}
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${statusColor} / 0.15` }}
                      >
                        <StatusIcon 
                          className="h-5 w-5" 
                          style={{ color: statusColor }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.original_name}
                          </p>
                          {file.is_favorite && (
                            <Star className="h-4 w-4 text-chart-3 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>•</span>
                          <span>{file.file_type}</span>
                          <span>•</span>
                          <span>
                            {new Date(file.updated_at).toLocaleDateString(
                              language === 'th' ? 'th-TH' : 'en-US'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <Badge 
                          variant="secondary"
                          className="text-xs mb-1"
                          style={{ 
                            backgroundColor: `${statusColor} / 0.15`,
                            color: statusColor,
                            borderColor: `${statusColor} / 0.3`
                          }}
                        >
                          {t.stages[file.processing_status] || file.processing_status}
                        </Badge>
                        
                        <div className="text-xs text-muted-foreground">
                          {file.days_until_next_stage >= 0 && (
                            <span>
                              {formatDaysUntil(file.days_until_next_stage)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-foreground">
                          ฿{file.monthly_cost.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.perMonth}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        {!file.is_favorite && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-chart-3"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Lifecycle Progress */}
                  {file.days_until_next_stage >= 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>
                          {language === 'th' ? 'ความคืบหน้าวงจรชีวิต' : 'Lifecycle Progress'}
                        </span>
                        <span>
                          {formatDaysUntil(file.days_until_next_stage)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={Math.max(0, Math.min(100, (30 - file.days_until_next_stage) / 30 * 100))}
                        className="h-1"
                        style={{
                          background: 'oklch(0.269 0 0)',
                          color: statusColor
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t.noFiles}
            </h3>
            <p className="text-muted-foreground">
              {t.noFilesDesc}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileLifecycle;
import React from 'react';
import { motion } from 'motion/react';
import { 
  MoreHorizontal, Play, Edit, Trash, Share, Copy, 
  Film, Camera, Video, Folder, Clock, CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '../ui/dropdown-menu';

interface Project {
  id: string;
  title: string;
  type: 'short-film' | 'commercial' | 'music-video' | 'documentary';
  thumbnail?: string;
  duration?: string;
  status: 'draft' | 'processing' | 'complete';
  createdAt: Date;
  lastModified: Date;
  progress?: number;
}

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  delay?: number;
  onProjectClick?: (project: Project) => void;
  onEditClick?: (project: Project) => void;
  onDeleteClick?: (project: Project) => void;
  onShareClick?: (project: Project) => void;
}

const cinemaEasing = [0.25, 0.46, 0.45, 0.94] as const;

export function ProjectCard({ 
  project, 
  viewMode, 
  delay = 0,
  onProjectClick,
  onEditClick,
  onDeleteClick,
  onShareClick
}: ProjectCardProps) {
  
  const getProjectTypeIcon = (type: Project['type']) => {
    switch (type) {
      case 'short-film': return Film;
      case 'commercial': return Camera;
      case 'music-video': return Video;
      case 'documentary': return Folder;
    }
  };

  const getProjectTypeColor = (type: Project['type']) => {
    switch (type) {
      case 'short-film': return 'oklch(0.488 0.243 264.376)';
      case 'commercial': return 'oklch(0.696 0.17 162.48)';
      case 'music-video': return 'oklch(0.769 0.188 70.08)';
      case 'documentary': return 'oklch(0.627 0.265 303.9)';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'draft': return AlertCircle;
      case 'processing': return Clock;
      case 'complete': return CheckCircle;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'oklch(0.708 0 0)';
      case 'processing': return 'oklch(0.769 0.188 70.08)';
      case 'complete': return 'oklch(0.696 0.17 162.48)';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'processing': return 'Processing';
      case 'complete': return 'Complete';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const TypeIcon = getProjectTypeIcon(project.type);
  const StatusIcon = getStatusIcon(project.status);
  const typeColor = getProjectTypeColor(project.type);
  const statusColor = getStatusColor(project.status);

  const handleProjectClick = () => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: cinemaEasing }}
        className="group p-4 border rounded-xl backdrop-blur-sm cursor-pointer transition-all duration-300"
        style={{
          backgroundColor: 'oklch(0.205 0 0 / 0.5)',
          borderColor: 'oklch(0.269 0 0)'
        }}
        whileHover={{
          backgroundColor: 'oklch(0.205 0 0 / 0.8)',
          borderColor: typeColor,
          transition: { duration: 0.2 }
        }}
        onClick={handleProjectClick}
      >
        <div className="flex items-center gap-6">
          {/* Thumbnail */}
          <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
            {project.thumbnail ? (
              <img 
                src={project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: 'oklch(0.269 0 0)' }}
              >
                <TypeIcon className="w-6 h-6" style={{ color: typeColor }} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                style={{ 
                  backgroundColor: `${typeColor} / 0.15`,
                  color: typeColor 
                }}
              >
                <TypeIcon className="w-3 h-3" />
                <span className="capitalize">{project.type.replace('-', ' ')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-normal" style={{ color: 'oklch(0.708 0 0)' }}>
              <span>Duration: {project.duration || 'N/A'}</span>
              <span>•</span>
              <span>Modified {formatDate(project.lastModified)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <StatusIcon className="w-4 h-4" style={{ color: statusColor }} />
                <span style={{ color: statusColor }}>{getStatusLabel(project.status)}</span>
              </div>
            </div>

            {project.status === 'processing' && project.progress !== undefined && (
              <div className="mt-3 max-w-xs">
                <Progress value={project.progress} className="h-2" />
                <p className="text-xs mt-1 font-normal" style={{ color: 'oklch(0.708 0 0)' }}>
                  Processing... {project.progress}%
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEditClick?.(project)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShareClick?.(project)}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteClick?.(project)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: cinemaEasing }}
      className="group cursor-pointer"
      onClick={handleProjectClick}
    >
      <div 
        className="relative rounded-xl overflow-hidden border backdrop-blur-sm transition-all duration-300"
        style={{
          backgroundColor: 'oklch(0.205 0 0 / 0.5)',
          borderColor: 'oklch(0.269 0 0)'
        }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden">
          {project.thumbnail ? (
            <img 
              src={project.thumbnail} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.269 0 0)' }}
            >
              <TypeIcon className="w-12 h-12" style={{ color: typeColor }} />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: 'oklch(0.145 0 0 / 0.8)' }}
            >
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm"
              style={{ 
                backgroundColor: `${statusColor} / 0.9`,
                color: 'white'
              }}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{getStatusLabel(project.status)}</span>
            </div>
          </div>

          {/* Duration */}
          {project.duration && (
            <div className="absolute bottom-3 right-3">
              <div 
                className="px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
                style={{ backgroundColor: 'oklch(0.145 0 0 / 0.8)', color: 'white' }}
              >
                {project.duration}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 backdrop-blur-sm"
                  style={{ backgroundColor: 'oklch(0.145 0 0 / 0.8)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditClick?.(project); }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShareClick?.(project); }}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDeleteClick?.(project); }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white truncate flex-1">{project.title}</h3>
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ml-2"
              style={{ 
                backgroundColor: `${typeColor} / 0.15`,
                color: typeColor 
              }}
            >
              <TypeIcon className="w-3 h-3" />
              <span className="capitalize hidden sm:inline">{project.type.replace('-', ' ')}</span>
            </div>
          </div>
          
          <p className="text-sm mb-3 font-normal" style={{ color: 'oklch(0.708 0 0)' }}>
            Created {formatDate(project.createdAt)}
          </p>

          {project.status === 'processing' && project.progress !== undefined && (
            <div className="space-y-2">
              <Progress value={project.progress} className="h-2" />
              <p className="text-xs font-normal" style={{ color: 'oklch(0.708 0 0)' }}>
                Processing... {project.progress}%
              </p>
            </div>
          )}
        </div>

        {/* Hover Border Glow */}
        <motion.div
          className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300"
          style={{
            background: `linear-gradient(45deg, ${typeColor} / 0.3, ${statusColor} / 0.3)`
          }}
        />
      </div>
    </motion.div>
  );
}
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Film, Camera, Video, Folder, Upload, FileText, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';

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

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;
}

const cinemaEasing = [0.25, 0.46, 0.45, 0.94] as const;

const projectTypes = [
  {
    id: 'short-film',
    label: 'Short Film',
    description: 'Narrative storytelling with cinematic depth',
    icon: Film,
    color: 'oklch(0.488 0.243 264.376)',
    duration: '5-30 min'
  },
  {
    id: 'commercial',
    label: 'Commercial',
    description: 'Brand storytelling and marketing content',
    icon: Camera,
    color: 'oklch(0.696 0.17 162.48)',
    duration: '15-60 sec'
  },
  {
    id: 'music-video',
    label: 'Music Video',
    description: 'Visual interpretation of musical content',
    icon: Video,
    color: 'oklch(0.769 0.188 70.08)',
    duration: '3-6 min'
  },
  {
    id: 'documentary',
    label: 'Documentary',
    description: 'Non-fiction storytelling and exploration',
    icon: Folder,
    color: 'oklch(0.627 0.265 303.9)',
    duration: '20-120 min'
  }
];

export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
  const [step, setStep] = useState<'type' | 'details' | 'settings'>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tags: '',
  });

  const handleNext = () => {
    if (step === 'type' && selectedType) {
      setStep('details');
    } else if (step === 'details' && projectData.title.trim()) {
      setStep('settings');
    }
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('type');
    } else if (step === 'settings') {
      setStep('details');
    }
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title,
      type: selectedType as Project['type'],
      status: 'draft',
      createdAt: new Date(),
      lastModified: new Date(),
      progress: 0
    };

    onProjectCreated(newProject);
    
    // Reset form
    setStep('type');
    setSelectedType('');
    setProjectData({ title: '', description: '', tags: '' });
  };

  const selectedProjectType = projectTypes.find(type => type.id === selectedType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl p-0 gap-0 border"
        style={{
          backgroundColor: 'oklch(0.205 0 0)',
          borderColor: 'oklch(0.269 0 0)'
        }}
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black text-white">
              Create New Project
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {['type', 'details', 'settings'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{
                    backgroundColor: step === stepName || (index < ['type', 'details', 'settings'].indexOf(step))
                      ? selectedProjectType?.color || 'oklch(0.488 0.243 264.376)'
                      : 'oklch(0.269 0 0)',
                    color: 'white'
                  }}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div 
                    className="w-8 h-px mx-2 transition-all duration-300"
                    style={{
                      backgroundColor: index < ['type', 'details', 'settings'].indexOf(step)
                        ? selectedProjectType?.color || 'oklch(0.488 0.243 264.376)'
                        : 'oklch(0.269 0 0)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <Separator className="mt-6" style={{ backgroundColor: 'oklch(0.269 0 0)' }} />

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Project Type */}
          {step === 'type' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: cinemaEasing }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Choose Project Type</h3>
                <p className="font-medium text-base" style={{ color: 'oklch(0.708 0 0)' }}>
                  Select the type of project that best matches your creative vision.
                </p>
              </div>

              <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-3">
                {projectTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Label
                      htmlFor={type.id}
                      className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-300 text-base font-medium"
                      style={{
                        backgroundColor: selectedType === type.id 
                          ? `${type.color} / 0.1` 
                          : 'transparent',
                        borderColor: selectedType === type.id 
                          ? type.color 
                          : 'oklch(0.269 0 0)'
                      }}
                    >
                      <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                      
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${type.color} / 0.15`,
                          color: type.color
                        }}
                      >
                        <type.icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-lg font-bold text-white">{type.label}</h4>
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: `${type.color} / 0.15`,
                              color: type.color
                            }}
                          >
                            {type.duration}
                          </span>
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'oklch(0.708 0 0)' }}>
                          {type.description}
                        </p>
                      </div>

                      {selectedType === type.id && (
                        <motion.div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: type.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: cinemaEasing }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Project Details</h3>
                <p className="font-medium text-base" style={{ color: 'oklch(0.708 0 0)' }}>
                  Provide basic information about your {selectedProjectType?.label.toLowerCase()}.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white font-medium mb-2 block text-base">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    value={projectData.title}
                    onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your project title..."
                    className="text-lg bg-transparent border text-white placeholder:text-gray-500 font-normal"
                    style={{ borderColor: 'oklch(0.269 0 0)' }}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white font-medium mb-2 block text-base">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your creative vision..."
                    rows={4}
                    className="bg-transparent border text-white placeholder:text-gray-500 resize-none text-base font-normal"
                    style={{ borderColor: 'oklch(0.269 0 0)' }}
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-white font-medium mb-2 block text-base">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={projectData.tags}
                    onChange={(e) => setProjectData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="drama, thriller, urban (comma-separated)"
                    className="bg-transparent border text-white placeholder:text-gray-500 text-base font-normal"
                    style={{ borderColor: 'oklch(0.269 0 0)' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Settings */}
          {step === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: cinemaEasing }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Project Settings</h3>
                <p className="font-medium text-base" style={{ color: 'oklch(0.708 0 0)' }}>
                  Configure initial settings for your project workspace.
                </p>
              </div>

              <div className="space-y-6">
                {/* Project Summary */}
                <div 
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: `${selectedProjectType?.color} / 0.05`,
                    borderColor: `${selectedProjectType?.color} / 0.2`
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {selectedProjectType && (
                      <selectedProjectType.icon 
                        className="w-5 h-5" 
                        style={{ color: selectedProjectType.color }} 
                      />
                    )}
                    <h4 className="text-lg font-bold text-white">{projectData.title}</h4>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'oklch(0.708 0 0)' }}>
                    {selectedProjectType?.description}
                  </p>
                  {projectData.description && (
                    <p className="text-sm mt-2 font-medium" style={{ color: 'oklch(0.708 0 0)' }}>
                      {projectData.description}
                    </p>
                  )}
                </div>

                {/* Initial Setup Options */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-white">Initial Setup</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-base font-medium">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" style={{ color: 'oklch(0.696 0.17 162.48)' }} />
                        <span className="text-white">Import media files</span>
                      </div>
                    </Label>
                    
                    <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-base font-medium">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: 'oklch(0.769 0.188 70.08)' }} />
                        <span className="text-white">Create project template</span>
                      </div>
                    </Label>
                    
                    <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-base font-medium">
                      <input type="checkbox" className="rounded" />
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" style={{ color: 'oklch(0.627 0.265 303.9)' }} />
                        <span className="text-white">Advanced AI settings</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <Separator style={{ backgroundColor: 'oklch(0.269 0 0)' }} />

        {/* Footer */}
        <div className="p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={step === 'type' ? () => onOpenChange(false) : handleBack}
            className="gap-2 text-base font-medium"
          >
            {step === 'type' ? 'Cancel' : 'Back'}
          </Button>

          <Button
            onClick={step === 'settings' ? handleCreateProject : handleNext}
            disabled={
              (step === 'type' && !selectedType) ||
              (step === 'details' && !projectData.title.trim())
            }
            className="gap-2 px-6 border-0 text-base font-medium"
            style={{
              background: selectedProjectType 
                ? `linear-gradient(135deg, ${selectedProjectType.color}, ${selectedProjectType.color} / 0.8)`
                : 'linear-gradient(135deg, oklch(0.488 0.243 264.376), oklch(0.696 0.17 162.48))',
              color: 'white'
            }}
          >
            {step === 'settings' ? 'Create Project' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
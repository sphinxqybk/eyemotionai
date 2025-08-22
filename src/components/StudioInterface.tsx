import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize2, Settings, Clapperboard, Sliders, Headphones, Play, Pause, 
  Save, Upload, RotateCcw, Volume2, Check
} from 'lucide-react';

interface SceneData {
  name: string;
  duration: string;
  shots: number;
  status: string;
  color: string;
  waveform: number[];
}

interface StudioInterfaceProps {
  language: 'th' | 'en';
}

export function StudioInterface({ language }: StudioInterfaceProps) {
  const [activePanel, setActivePanel] = useState('timeline');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [activeScene, setActiveScene] = useState('street-chase');

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimelinePosition(prev => (prev + 1) % 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const content = {
    th: {
      title: 'สตูดิโอ EyeMotion Pro',
      tabs: {
        timeline: 'ไทม์ไลน์',
        color: 'สี',
        audio: 'เสียง'
      },
      scenes: {
        'street-chase': { name: 'ฉากไล่ล่า', status: 'Auto-Cut กำลังทำงาน' },
        'dialogue-scene': { name: 'ฉากบทสนทนา', status: 'CineTone กำลังประมวลผล' },
        'opening-credits': { name: 'เครดิตเปิด', status: 'ยืนยัน Intent แล้ว' }
      },
      panels: {
        color: 'การปรับแต่งสี CineTone',
        audio: 'การผสมเสียง'
      },
      controls: {
        shadows: 'เงา',
        midtones: 'โทนกลาง',
        highlights: 'ไฮไลท์',
        exposure: 'แสง',
        contrast: 'คอนทราสต์',
        saturation: 'ความอิ่มตัว'
      },
      tracks: {
        dialogue: 'บทสนทนา',
        music: 'ดนตรี',
        sfx: 'เสียงเอฟเฟ็กต์',
        ambient: 'เสียงบรรยากาศ'
      },
      status: 'การวิเคราะห์ Intent: 96% • การเรนเดอร์: พร้อม'
    },
    en: {
      title: 'EYEMOTION STUDIO PRO',
      tabs: {
        timeline: 'TIMELINE',
        color: 'COLOR',
        audio: 'AUDIO'
      },
      scenes: {
        'street-chase': { name: 'Street Chase', status: 'Auto-Cut Active' },
        'dialogue-scene': { name: 'Dialogue Scene', status: 'CineTone Processing' },
        'opening-credits': { name: 'Opening Credits', status: 'Intent Verified' }
      },
      panels: {
        color: 'CINETONE COLOR GRADING',
        audio: 'AUDIO MIXING'
      },
      controls: {
        shadows: 'SHADOWS',
        midtones: 'MIDTONES',
        highlights: 'HIGHLIGHTS',
        exposure: 'EXPOSURE',
        contrast: 'CONTRAST',
        saturation: 'SATURATION'
      },
      tracks: {
        dialogue: 'DIALOGUE',
        music: 'MUSIC',
        sfx: 'SFX',
        ambient: 'AMBIENT'
      },
      status: 'INTENT ANALYSIS: 96% • RENDERING: READY'
    }
  };

  const t = content[language];

  const sceneData: Record<string, SceneData> = {
    'street-chase': {
      name: t.scenes['street-chase'].name,
      duration: '2m 30s',
      shots: 12,
      status: t.scenes['street-chase'].status,
      color: '#2563eb',
      waveform: Array.from({length: 50}, () => Math.random() * 100)
    },
    'dialogue-scene': {
      name: t.scenes['dialogue-scene'].name,
      duration: '1m 45s', 
      shots: 6,
      status: t.scenes['dialogue-scene'].status,
      color: '#7c3aed',
      waveform: Array.from({length: 50}, () => Math.random() * 60 + 20)
    },
    'opening-credits': {
      name: t.scenes['opening-credits'].name,
      duration: '15s',
      shots: 3,
      status: t.scenes['opening-credits'].status,
      color: '#059669',
      waveform: Array.from({length: 50}, () => Math.random() * 80 + 10)
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 overflow-hidden shadow-2xl">
      {/* Professional Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </div>
          <span className="text-base font-bold text-white tracking-wide">{t.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button className="p-2 hover:bg-gray-700/50 rounded-lg" whileHover={{ scale: 1.1 }}>
            <Maximize2 size={16} className="text-gray-400" />
          </motion.button>
          <motion.button className="p-2 hover:bg-gray-700/50 rounded-lg" whileHover={{ scale: 1.1 }}>
            <Settings size={16} className="text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Professional Panel Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'timeline', label: t.tabs.timeline, icon: <Clapperboard size={16} /> },
          { id: 'color', label: t.tabs.color, icon: <Sliders size={16} /> },
          { id: 'audio', label: t.tabs.audio, icon: <Headphones size={16} /> }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all tracking-wide ${
              activePanel === tab.id 
                ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Active Panel Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {activePanel === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Scene Selection */}
              <div className="flex gap-3 mb-6">
                {Object.entries(sceneData).map(([key, scene]) => (
                  <motion.button
                    key={key}
                    onClick={() => setActiveScene(key)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all tracking-wide ${
                      activeScene === key 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {scene.name}
                  </motion.button>
                ))}
              </div>

              {/* Timeline Controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center hover:shadow-xl hover:shadow-blue-600/25 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
                </motion.button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3 font-bold">
                    <span>{sceneData[activeScene].duration}</span>
                    <span>{sceneData[activeScene].status}</span>
                  </div>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                      style={{ width: `${timelinePosition}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Waveform */}
              <div className="bg-gray-900/70 rounded-2xl p-6">
                <div className="flex items-end gap-1 h-24">
                  {sceneData[activeScene].waveform.map((height, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-t from-blue-500 to-violet-400 rounded-sm"
                      style={{ 
                        width: '4px',
                        height: `${height}%`,
                        opacity: i < (timelinePosition * 0.5) ? 1 : 0.3
                      }}
                      animate={{
                        height: isPlaying ? `${Math.random() * 100}%` : `${height}%`
                      }}
                      transition={{
                        duration: 0.1,
                        repeat: isPlaying ? Infinity : 0
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'color' && (
            <motion.div
              key="color"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white mb-6 tracking-wide">{t.panels.color}</h3>
              
              {/* Color Wheels */}
              <div className="grid grid-cols-3 gap-6">
                {[t.controls.shadows, t.controls.midtones, t.controls.highlights].map((range, i) => (
                  <div key={range} className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${
                      i === 0 ? 'from-blue-600 to-blue-800' :
                      i === 1 ? 'from-violet-600 to-purple-800' :
                      'from-emerald-600 to-green-800'
                    } shadow-xl border-2 border-gray-700`} />
                    <div className="text-xs text-gray-400 mt-3 font-bold tracking-wide">{range}</div>
                  </div>
                ))}
              </div>

              {/* Color Controls */}
              <div className="space-y-4">
                {[t.controls.exposure, t.controls.contrast, t.controls.saturation].map((control) => (
                  <div key={control} className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-20 font-bold tracking-wide">{control}</span>
                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activePanel === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white mb-6 tracking-wide">{t.panels.audio}</h3>
              
              {/* Audio Tracks */}
              <div className="space-y-4">
                {[t.tracks.dialogue, t.tracks.music, t.tracks.sfx, t.tracks.ambient].map((track, i) => (
                  <div key={track} className="flex items-center gap-4 p-4 bg-gray-900/70 rounded-xl">
                    <span className="text-sm text-gray-400 w-20 font-bold tracking-wide">{track}</span>
                    <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${
                          i === 0 ? 'from-blue-500 to-cyan-500' :
                          i === 1 ? 'from-violet-500 to-purple-500' :
                          i === 2 ? 'from-emerald-500 to-green-500' :
                          'from-indigo-500 to-blue-500'
                        }`}
                        style={{ width: `${Math.random() * 70 + 20}%` }}
                        animate={{ width: `${Math.random() * 70 + 20}%` }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      />
                    </div>
                    <Volume2 size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Professional Tools Footer */}
      <div className="flex items-center justify-between p-6 bg-gray-900/70 border-t border-gray-700">
        <div className="flex gap-3">
          {[
            { icon: <Save size={16} />, color: 'text-blue-400', label: 'SAVE' },
            { icon: <Upload size={16} />, color: 'text-violet-400', label: 'EXPORT' },
            { icon: <RotateCcw size={16} />, color: 'text-emerald-400', label: 'UNDO' }
          ].map((tool, i) => (
            <motion.button
              key={i}
              className={`p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors ${tool.color}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {tool.icon}
            </motion.button>
          ))}
        </div>
        
        <div className="text-sm text-gray-500 font-bold tracking-wide">
          {t.status}
        </div>
      </div>
    </div>
  );
}
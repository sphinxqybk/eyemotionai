import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      {/* Professional loading background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* Loading spinner */}
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <Loader2 className="w-full h-full text-blue-400" />
        </motion.div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">EM</span>
            </div>
            <div>
              <div className="font-black text-white tracking-wider text-lg">EyeMotion</div>
              <div className="text-xs text-blue-400 font-bold">PROFESSIONAL SUITE</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-medium">Loading professional film ecosystem...</p>
        </div>
      </div>
    </div>
  );
}
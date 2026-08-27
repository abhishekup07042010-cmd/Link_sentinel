import React from 'react';
import { motion } from 'motion/react';
import { Shield, Radio, Lock } from 'lucide-react';

interface InitialLoaderProps {
  onComplete?: () => void;
}

export const InitialLoader: React.FC<InitialLoaderProps> = () => {
  return (
    <motion.div
      id="initial-loader-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] text-white px-4 select-none"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00FFFF_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

      <div className="relative flex flex-col items-center max-w-sm w-full">
        {/* Bespoke Smooth Multi-Ring Spinner */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
          {/* Outer Pulsing Glow */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"
          />

          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40"
          />

          {/* Middle Counter-Rotating Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-fuchsia-500 border-l-transparent"
          />

          {/* Inner Fast Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-5 rounded-full border border-cyan-300/60 border-t-transparent"
          />

          {/* Center Shield Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-950/80 to-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <Shield className="w-6 h-6 text-cyan-400" />
          </motion.div>
        </div>

        {/* Text 'LinkSentinel Intelligence' with sequential reveal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h1 className="text-xl font-bold tracking-wider uppercase text-slate-100">
              LinkSentinel <span className="text-cyan-400 font-extrabold">Intelligence</span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center justify-center gap-2"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Initializing Neural Threat Engine...
          </motion.p>
        </motion.div>

        {/* Progress Loading Bar */}
        <div className="w-48 h-1 bg-slate-800/80 rounded-full mt-6 overflow-hidden border border-slate-700/50">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-300 to-cyan-400"
          />
        </div>

        {/* Security Assurance Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono"
        >
          <Lock className="w-3 h-3 text-cyan-500/70" />
          <span>Real-time Phishing & Zero-Day Heuristics</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

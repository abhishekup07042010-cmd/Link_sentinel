import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  X, 
  Lock, 
  Globe, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { THREAT_PRESETS } from '../utils/mockIntelligence';
import { sanitizeUrlString } from '../utils/security';
import { ThreatPreset } from '../types';

interface HeroInputProps {
  onAnalyze: (url: string) => void;
  isScanning: boolean;
  activeUrl?: string;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  onAnalyze,
  isScanning,
  activeUrl = '',
}) => {
  const [inputValue, setInputValue] = useState(activeUrl);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Synchronize when parent changes active URL (e.g. from preset or cache)
  React.useEffect(() => {
    if (activeUrl && activeUrl !== inputValue) {
      setInputValue(activeUrl);
      setValidationError(null);
    }
  }, [activeUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning) return;

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setValidationError('Please enter a target URL or domain to scan.');
      return;
    }

    const { sanitized, isValid, error } = sanitizeUrlString(trimmed);

    if (!isValid) {
      setValidationError(error || 'Invalid URL format. Please check and retry.');
      return;
    }

    setValidationError(null);
    onAnalyze(sanitized);
  };

  const handleSelectPreset = (preset: ThreatPreset) => {
    setInputValue(preset.url);
    setValidationError(null);
    onAnalyze(preset.url);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples(prev => [...prev.slice(-3), { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 700);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setValidationError(null);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
      {/* Top Banner Tag */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center mb-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide glass-panel bg-white/5 border-cyan-500/30 text-cyan-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Real-time Phishing & Zero-Day Threat Inspection</span>
        </div>
      </motion.div>

      {/* Main Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-2">
          Intelligence Scan
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Deep-scan suspect URLs, domains, and IP addresses against multi-engine cyber threat feeds, Shannon entropy heuristics, and reputation databases.
        </p>
      </motion.div>

      {/* Central Frosted Glass Input Container with Neon Gradient Border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-4"
      >
        <div className="w-full p-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-magenta-500/20 to-cyan-500/20 shadow-2xl transition-all">
          <div 
            style={{ 
              backdropFilter: 'blur(20px)', 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }} 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2.5 sm:p-3 rounded-[14px] w-full shadow-inner"
          >
            {/* Input Field with Icons */}
            <div className="relative flex-1 flex items-center min-w-0 px-2">
              <div className="text-gray-500 pointer-events-none flex items-center mr-3">
                <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
              </div>

              <input
                id="url-analyzer-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter URL to inspect (e.g., https://phishing.com or google.com)..."
                disabled={isScanning}
                className="w-full py-2.5 text-sm sm:text-base font-semibold bg-transparent text-gray-100 placeholder:text-gray-500 focus:outline-none transition-all"
                autoComplete="off"
                spellCheck="false"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isScanning}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Prominent High-Contrast Analyze Button */}
            <motion.button
              ref={buttonRef}
              id="analyze-submit-btn"
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              disabled={isScanning}
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold py-3 px-7 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {/* Ripple Elements */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-white/40 pointer-events-none animate-ping"
                  style={{
                    left: ripple.x - 20,
                    top: ripple.y - 20,
                    width: 40,
                    height: 40,
                  }}
                />
              ))}

              {isScanning ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin shrink-0" />
                  <span className="tracking-wider text-xs uppercase font-extrabold whitespace-nowrap">SCANNING...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wider text-xs uppercase font-extrabold whitespace-nowrap">ANALYZE</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Validation Error Alert */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-2.5 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 backdrop-blur-md"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Threat Test Presets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-5"
      >
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            Quick Presets for Live Testing:
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline font-medium whitespace-nowrap">
            Click to auto-simulate
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {THREAT_PRESETS.map((preset) => {
            const isSafe = preset.type === 'safe';
            const isMalicious = preset.type === 'malicious';
            
            return (
              <motion.button
                key={preset.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPreset(preset)}
                disabled={isScanning}
                className={`text-xs px-3.5 py-1.5 rounded-lg border font-mono font-semibold transition-all inline-flex items-center gap-2 backdrop-blur-md cursor-pointer whitespace-nowrap shrink-0 shadow-xs leading-normal ${
                  isSafe
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : isMalicious
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
                title={preset.description}
              >
                {isSafe ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isMalicious ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="whitespace-nowrap">{preset.label}</span>
                <span className="font-bold text-[10px] whitespace-nowrap opacity-85">[{preset.badge}]</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

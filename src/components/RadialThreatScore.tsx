import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { VerdictLevel, ClassificationType } from '../types';

interface RadialThreatScoreProps {
  score: number; // 0 - 100
  verdictLevel: VerdictLevel;
  classification: ClassificationType;
  scanDurationMs: number;
  fromCache: boolean;
}

export const RadialThreatScore: React.FC<RadialThreatScoreProps> = ({
  score,
  verdictLevel,
  classification,
  scanDurationMs,
  fromCache,
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth Count-Up Animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1100; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * score);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayScore(score);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [score]);

  // Dimensions & SVG Math
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Progress offset (0 = 0% filled, 100 = full circumference)
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isSafe = verdictLevel === 'safe';
  const isMalicious = verdictLevel === 'malicious';
  const isSuspicious = verdictLevel === 'suspicious';

  const getPrimaryColor = () => {
    if (isSafe) return '#10B981'; // Emerald
    if (isMalicious) return '#FF00FF'; // Vibrant Magenta
    return '#F59E0B'; // Amber Gold
  };

  const getGradientId = () => {
    if (isSafe) return 'gradient-safe';
    if (isMalicious) return 'gradient-malicious';
    return 'gradient-suspicious';
  };

  const getBadgeStyle = () => {
    if (isSafe) {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
    if (isMalicious) {
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    }
    return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  };

  const getScoreColorClass = () => {
    if (isSafe) return 'text-emerald-400';
    if (isMalicious) return 'text-fuchsia-400';
    return 'text-amber-400';
  };

  const getScoreSubtextClass = () => {
    if (isSafe) return 'text-emerald-300';
    if (isMalicious) return 'text-magenta-300';
    return 'text-amber-300';
  };

  const getVerdictTextClass = () => {
    if (isSafe) return 'text-emerald-400';
    if (isMalicious) return 'text-magenta-500';
    return 'text-amber-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center w-full">
      {/* Visual Radial Gauge Ring matching Elegant Dark spec */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
        {/* Ambient Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-2 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: getPrimaryColor() }}
        />

        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <defs>
            {/* Safe Gradient (Cyan to Emerald) */}
            <linearGradient id="gradient-safe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Malicious Gradient (Vibrant Magenta to Bright Red) */}
            <linearGradient id="gradient-malicious" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF00FF" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            {/* Suspicious Gradient (Electric Gold to Amber) */}
            <linearGradient id="gradient-suspicious" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Value Stroke */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${getScoreColorClass()}`}
          >
            {displayScore}
          </motion.span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 font-semibold mt-0.5">
            / 100 RISK
          </span>
        </div>
      </div>

      {/* Classification & Verdict Details */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          {isSafe ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : isMalicious ? (
            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}

          <h3 className={`text-xl sm:text-2xl font-extrabold uppercase tracking-tight ${getVerdictTextClass()}`}>
            {verdictLevel}
          </h3>
        </div>

        {/* Classification Chip */}
        <div className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold border whitespace-nowrap shrink-0 leading-normal ${getBadgeStyle()}`}>
          {classification}
        </div>

        {/* Timing and Cache Status Footer */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 mt-2">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            Scan Latency: <strong className="text-gray-200">{scanDurationMs}ms</strong>
          </span>
          <span>•</span>
          <span className={fromCache ? 'text-cyan-400 font-bold' : 'text-gray-400'}>
            {fromCache ? '⚡ Cache Hit (0ms Memory)' : 'Real-time Live Engine'}
          </span>
        </div>
      </div>
    </div>
  );
};

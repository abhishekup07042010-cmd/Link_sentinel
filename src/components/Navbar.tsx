import React from 'react';
import { motion } from 'motion/react';
import { Shield, Database, Terminal, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { CacheStats } from '../types';

interface NavbarProps {
  cacheStats: CacheStats;
  onOpenCacheDrawer: () => void;
  onOpenTelemetryModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cacheStats,
  onOpenCacheDrawer,
  onOpenTelemetryModal,
}) => {
  return (
    <nav
      id="main-navbar"
      className="h-16 sticky top-0 z-40 w-full flex items-center justify-between px-4 sm:px-8 md:px-10 border-b bg-[#121212]/85 backdrop-blur-md border-white/10 shadow-2xl"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 bg-cyan-400 text-[#121212] rounded-lg flex items-center justify-center shadow-sm cursor-pointer shrink-0"
        >
          <div className="w-4 h-4 border-2 border-[#121212] rotate-45"></div>
        </motion.div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
            LINK<span className="text-cyan-400">SENTINEL</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shadow-xs whitespace-nowrap">
            PRO
          </span>
        </div>
      </div>

      {/* Nav Links / Actions */}
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-400">
          <a href="#url-analyzer-input" className="text-white hover:text-cyan-400 font-bold transition-colors whitespace-nowrap">
            Scanner
          </a>
          <button 
            onClick={onOpenTelemetryModal}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Threat Feeds
          </button>
          <button 
            onClick={onOpenTelemetryModal}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Intelligence
          </button>
          <button 
            onClick={onOpenCacheDrawer}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">History</span>
            {cacheStats.totalEntries > 0 && (
              <span className="bg-cyan-500/15 text-cyan-400 text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-cyan-500/30 font-bold whitespace-nowrap">
                {cacheStats.totalEntries}
              </span>
            )}
          </button>
        </div>

        {/* Cache Drawer Quick Trigger (Mobile) */}
        <motion.button
          id="nav-cache-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenCacheDrawer}
          className="flex md:hidden items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border bg-white/5 text-slate-200 border-white/10 whitespace-nowrap"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono font-bold text-cyan-400 whitespace-nowrap">
            {cacheStats.totalEntries}
          </span>
        </motion.button>

        {/* Real-time System Status Tag (Permanent Dark Mode indicator) */}
        <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">ZERO-TRUST ENGINE ONLINE</span>
            <span className="sm:hidden whitespace-nowrap">ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

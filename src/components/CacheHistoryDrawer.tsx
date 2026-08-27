import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Database, 
  Trash2, 
  Zap, 
  Globe, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ThreatReport } from '../types';
import { threatCache } from '../utils/cacheService';

interface CacheHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: (report: ThreatReport) => void;
  onClearCache: () => void;
  activeReportId?: string;
}

export const CacheHistoryDrawer: React.FC<CacheHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectReport,
  onClearCache,
  activeReportId,
}) => {
  const cacheStats = threatCache.getStats();
  const cacheItems = threatCache.getAll();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    In-Memory Cache
                  </h2>
                  <p className="text-xs text-gray-400 font-mono font-medium">
                    Zero-latency intelligence buffer
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cache Telemetry Overview Stats */}
            <div className="p-4 bg-black/30 border-b border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 shadow-2xs">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Entries</span>
                <span className="font-extrabold text-white text-sm">{cacheStats.totalEntries}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 shadow-2xs">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Hits / Lookups</span>
                <span className="font-extrabold text-cyan-400 text-sm">{cacheStats.hits} / {cacheStats.hits + cacheStats.misses}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 shadow-2xs">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Hit Ratio</span>
                <span className="font-extrabold text-emerald-400 text-sm">{cacheStats.hitRatioPercentage}%</span>
              </div>
            </div>

            {/* Cache Entries List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {cacheItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <Database className="w-12 h-12 stroke-1 text-gray-600 mb-3" />
                  <p className="text-sm font-bold text-gray-300">
                    In-Memory Cache is Empty
                  </p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs font-medium">
                    Analyze any URL to store threat evaluations in local memory for instant sub-millisecond retrieval.
                  </p>
                </div>
              ) : (
                cacheItems.map((item) => {
                  const isSafe = item.report.verdictLevel === 'safe';
                  const isMalicious = item.report.verdictLevel === 'malicious';
                  const isActive = item.report.id === activeReportId;

                  return (
                    <motion.div
                      key={item.key}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        onSelectReport(item.report);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-white/[0.03] shadow-xs hover:shadow-md ${
                        isActive 
                          ? 'border-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.2)]' 
                          : 'border-white/10 hover:border-cyan-400/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isSafe ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isMalicious ? (
                            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <span className="font-mono text-xs font-bold text-white truncate">
                            {item.report.hostname}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${
                          isSafe ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                          isMalicious ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                          'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          Score: {item.report.threatScore}
                        </span>
                      </div>

                      <p className="text-[11px] font-mono text-gray-400 truncate mb-2 font-medium">
                        {item.report.sanitizedUrl}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-white/5 pt-2 font-semibold">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>{item.hitCount} cache hits</span>
                        </span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer Actions */}
            {cacheItems.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-black/40">
                <button
                  onClick={onClearCache}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Flush In-Memory Cache</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

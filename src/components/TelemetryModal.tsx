import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Terminal, Activity, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryModal: React.FC<TelemetryModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl rounded-2xl bg-[#121212] border border-white/10 shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Threat Intelligence Feeds & Architecture
                  </h3>
                  <p className="text-xs text-gray-400 font-mono font-medium">
                    Multi-vector analysis pipeline specifications
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-300">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="font-extrabold text-cyan-400 uppercase block mb-1">
                  1. Zero-Trust In-Memory Caching Engine
                </span>
                <p className="text-gray-400 font-sans text-xs font-medium">
                  Whenever a URL query is issued, the system checks the local in-memory JavaScript cache first. If found, results load immediately with 0ms overhead, avoiding redundant computation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="font-extrabold text-cyan-400 uppercase block mb-1">
                  2. Dynamic Shannon Entropy Heuristics
                </span>
                <p className="text-gray-400 font-sans text-xs font-medium">
                  Calculates statistical character entropy across URL domain, path, and subdomains to catch DGA (Domain Generation Algorithms), homoglyphs, and obfuscated phishing redirects.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="font-extrabold text-cyan-400 uppercase block mb-1">
                  3. Multi-Feed Aggregation Matrix
                </span>
                <p className="text-gray-400 font-sans text-xs font-medium">
                  Simulates multi-source threat queries against VirusTotal, OpenPhish, PhishTank, Spamhaus SBL, AlienVault OTX, and Google Safe Browsing API.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold transition-all shadow-[0_0_15px_rgba(0,255,255,0.25)] cursor-pointer"
              >
                Close Telemetry Panel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

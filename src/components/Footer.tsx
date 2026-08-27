import React from 'react';
import { Shield, CheckCircle, Lock, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="w-full border-t mt-16 bg-[#121212] border-white/10 backdrop-blur-xl z-20 shadow-2xl"
    >
      {/* Top Telemetry Status Bar */}
      <div className="border-b border-white/10 bg-black/40 px-4 sm:px-10 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div> 
              System Active
            </span>
            <span>Nodes: 48 Online</span>
            <span>Database Sync: 0.4ms</span>
            <span className="hidden sm:inline">Threat Feed Index: 1,420,918 Signatures</span>
          </div>
          <div className="text-gray-500 font-extrabold">
            SOC ENGINE: ONLINE (DARK MODE SECURE)
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-cyan-400 text-[#121212] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                <div className="w-4 h-4 border-2 border-[#121212] rotate-45"></div>
              </div>
              <span className="text-base font-extrabold text-white">
                LINK<span className="text-cyan-400">SENTINEL</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4 font-semibold max-w-lg">
              Autonomous progressive web app for phishing link detection, real-time threat intelligence analysis, domain reputation scoring, and URL security inspection.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>PWA Offline Ready & High-Speed Cache Active</span>
            </div>
          </div>

          {/* Security Standards & Safeguards */}
          <div>
            <h4 className="text-xs font-mono uppercase font-extrabold tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Security Safeguards & Defense Stack
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-400 font-mono font-bold">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Zero-Trust input sanitization</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Shannon entropy heuristics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Live DNS-over-HTTPS resolution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Real ASN geolocation & BGP route tracking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-white/5 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-gray-500 gap-2 font-semibold">
          <span>© {new Date().getFullYear()} LINK SENTINEL GLOBAL THREAT INTELLIGENCE SYSTEM</span>
          <span>Protected by Multi-Layer Sandboxed Mock SOC Pipeline</span>
        </div>
      </div>
    </footer>
  );
};

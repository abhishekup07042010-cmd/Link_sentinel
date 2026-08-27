import React from 'react';
import { motion } from 'motion/react';
import { Radio, Shield, Activity, Zap, CheckCircle2 } from 'lucide-react';

export const ThreatFeedTicker: React.FC = () => {
  const telemetryItems = [
    { label: 'VirusTotal API v3', status: 'Active (92 Engines)' },
    { label: 'OpenPhish Zero-Day Feed', status: 'Synced 4m ago' },
    { label: 'PhishTank Community DB', status: 'Live 100%' },
    { label: 'Spamhaus Zen BGP', status: 'Operational' },
    { label: 'Google Safe Browsing', status: 'Online' },
    { label: 'AlienVault OTX Exchange', status: 'Connected' },
  ];

  return (
    <div
      id="threat-feed-ticker"
      className="w-full border-y py-2.5 overflow-hidden backdrop-blur-md bg-black/30 border-white/5 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto no-scrollbar text-[11px] font-mono whitespace-nowrap">
        <div className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-cyan-400 shrink-0">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>Distributed Threat Feeds:</span>
        </div>

        <div className="flex items-center gap-6">
          {telemetryItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span className="font-bold text-gray-200">{item.label}</span>
              <span className="text-gray-500 font-semibold">[{item.status}]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

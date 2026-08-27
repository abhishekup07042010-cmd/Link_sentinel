import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  Radio, 
  Lock, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw, 
  ExternalLink, 
  Code2, 
  Sliders, 
  AlertTriangle, 
  FileText, 
  Terminal, 
  Zap,
  Info
} from 'lucide-react';
import { ThreatReport } from '../types';
import { RadialThreatScore } from './RadialThreatScore';
import { MetricCard } from './MetricCard';

interface ThreatDashboardProps {
  report: ThreatReport;
  onReScan: (url: string, bypassCache?: boolean) => void;
  isScanning: boolean;
}

export const ThreatDashboard: React.FC<ThreatDashboardProps> = ({
  report,
  onReScan,
  isScanning,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'anatomy' | 'flags' | 'raw'>('overview');

  const isSafe = report.verdictLevel === 'safe';
  const isMalicious = report.verdictLevel === 'malicious';
  const isSuspicious = report.verdictLevel === 'suspicious';

  const handleCopyReport = () => {
    const summaryText = `[LinkSentinel Threat Report]
Target URL: ${report.sanitizedUrl}
Threat Score: ${report.threatScore}/100 (${report.verdictLevel.toUpperCase()})
Classification: ${report.classification}
Domain Rep: ${report.domainRep.domain} (Trust: ${report.domainRep.trustScore}%, Age: ${report.domainRep.domainAge})
Host IP: ${report.ipRep.ip} (${report.ipRep.organization}, ${report.ipRep.country})
Source Feeds Flagged: ${report.sourceFeeds.filter(f => f.status !== 'Clean').length}/${report.sourceFeeds.length}
Scanned: ${new Date(report.scannedAt).toLocaleString()}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      id="threat-dashboard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6"
    >
      {/* Dashboard Top Header Bar */}
      <div className="relative rounded-2xl p-4 sm:p-5 backdrop-blur-2xl mb-6 bg-white/[0.04] border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* URL Identity info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              Analyzed Target
            </span>
            {report.fromCache && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Zap className="w-3 h-3 fill-current text-cyan-400" />
                In-Memory Cache Hit (0ms)
              </span>
            )}
            <span className="text-[11px] font-mono text-gray-400 font-medium">
              {new Date(report.scannedAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-mono text-sm sm:text-base font-extrabold text-white truncate max-w-xl">
              {report.sanitizedUrl}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            id="copy-report-btn"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            title="Copy formatted security summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0" />
                <span className="text-emerald-300 whitespace-nowrap">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Copy Report</span>
              </>
            )}
          </button>

          <button
            id="rescan-btn"
            onClick={() => onReScan(report.sanitizedUrl, true)}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 cursor-pointer disabled:opacity-50 shadow-xs whitespace-nowrap shrink-0"
            title="Bypass cache and force deep simulated scan"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">Re-Scan Live</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Primary Radial Gauge + 4 Core Secondary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Column: Prominent Radial Threat Score Graphic */}
        <div className="lg:col-span-4 rounded-3xl backdrop-blur-2xl relative overflow-hidden bg-white/[0.03] border border-white/5 shadow-2xl flex flex-col justify-between">
          {/* Subtle Dynamic Ambient Gradient Overlay */}
          <div 
            className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700 ${
              isMalicious ? 'bg-gradient-to-b from-magenta-500/10 via-transparent to-transparent' :
              isSafe ? 'bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent' :
              'bg-gradient-to-b from-amber-500/10 via-transparent to-transparent'
            }`} 
          />

          <div className="relative z-10">
            <RadialThreatScore
              score={report.threatScore}
              verdictLevel={report.verdictLevel}
              classification={report.classification}
              scanDurationMs={report.scanDurationMs}
              fromCache={report.fromCache}
            />
          </div>

          {/* Quick Summary Box */}
          <div className="relative z-10 p-5 sm:p-6 border-t border-white/5 bg-black/30 rounded-b-3xl">
            <div className="text-xs font-mono uppercase font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Intelligence Verdict
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium mb-3">
              {report.summary}
            </p>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-200 shadow-xs">
              <strong className="text-cyan-400 font-bold">Action: </strong>
              <span className="font-semibold">{report.recommendedAction}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Secondary Detail Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: Domain Rep */}
          <MetricCard
            id="card-domain-rep"
            title="Domain Reputation"
            subtitle="WHOIS & DNS Authority"
            icon={Globe}
            delay={0.1}
            badge={
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border whitespace-nowrap shrink-0 inline-block leading-normal ${
                report.domainRep.trustScore >= 80 
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                  : report.domainRep.trustScore <= 25 
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                Trust: {report.domainRep.trustScore}%
              </span>
            }
          >
            {/* Domain Metrics List */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Domain Age</span>
                <span className="font-bold text-white truncate block">
                  {report.domainRep.domainAge}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Registrar</span>
                <span className="font-bold text-white truncate block" title={report.domainRep.registrar}>
                  {report.domainRep.registrar}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">DNS Status</span>
                <span className="font-bold text-white truncate block">
                  {report.domainRep.dnsStatus}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">TLD Risk</span>
                <span className={`font-bold truncate block ${
                  report.domainRep.tldRiskLevel === 'Severe' ? 'text-rose-400' :
                  report.domainRep.tldRiskLevel === 'High' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {report.domainRep.tldRiskLevel} Risk
                </span>
              </div>
            </div>

            {/* Trust Progress Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1 font-bold">
                <span>Domain Authority Meter</span>
                <span>{report.domainRep.trustScore}/100</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    report.domainRep.trustScore >= 80 ? 'bg-emerald-500' :
                    report.domainRep.trustScore <= 25 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${report.domainRep.trustScore}%` }}
                />
              </div>
            </div>
          </MetricCard>

          {/* Card 2: IP Reputation */}
          <MetricCard
            id="card-ip-rep"
            title="IP & Host Reputation"
            subtitle="Autonomous System & Abuse Feeds"
            icon={Server}
            delay={0.2}
            badge={
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border whitespace-nowrap shrink-0 inline-block leading-normal ${
                report.ipRep.blacklisted 
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                {report.ipRep.blacklisted ? 'IP Blacklisted' : 'Clean IP'}
              </span>
            }
          >
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-400 font-bold">Host IP:</span>
                <span className="font-extrabold text-white">{report.ipRep.ip}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-400 font-bold">Location:</span>
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span>{report.ipRep.flag}</span>
                  <span>{report.ipRep.city}, {report.ipRep.countryCode}</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-400 font-bold">ASN / Org:</span>
                <span className="font-bold text-slate-200 truncate max-w-[170px]" title={report.ipRep.organization}>
                  {report.ipRep.asn}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-slate-400 font-bold">Abuse Confidence:</span>
                <span className={`font-extrabold ${report.ipRep.abuseConfidenceScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {report.ipRep.abuseConfidenceScore}% Flagged
                </span>
              </div>
            </div>
          </MetricCard>

          {/* Card 3: Classification */}
          <MetricCard
            id="card-classification"
            title="Classification"
            subtitle="Threat Vector Taxonomy"
            icon={ShieldAlert}
            delay={0.3}
            badge={
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border whitespace-nowrap shrink-0 inline-block leading-normal ${
                isSafe ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                isMalicious ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {report.verdictLevel.toUpperCase()}
              </span>
            }
          >
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block mb-1 font-bold">Primary Tag</span>
                <span className="text-sm font-extrabold text-white block">
                  {report.classification}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 font-bold">SSL Certificate:</span>
                <span className="font-bold text-slate-200 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{report.sslAnalysis.grade} ({report.sslAnalysis.protocol})</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 font-bold">Shannon Entropy:</span>
                <span className="font-extrabold text-white font-mono">
                  {report.urlBreakdown.entropyScore} (bits/char)
                </span>
              </div>
            </div>
          </MetricCard>

          {/* Card 4: Source Feeds */}
          <MetricCard
            id="card-source-feeds"
            title="Source Feeds"
            subtitle="Global Threat Database Multi-Scan"
            icon={Database}
            delay={0.4}
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap shrink-0 inline-block leading-normal">
                {report.sourceFeeds.length} Feeds Synced
              </span>
            }
          >
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {report.sourceFeeds.slice(0, 4).map((feed, idx) => {
                const isClean = feed.status === 'Clean';
                const isFlagged = feed.status === 'Flagged' || feed.status === 'Blacklisted';
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-white truncate block text-[11px]">
                        {feed.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block font-medium">
                        {feed.detail}
                      </span>
                    </div>

                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                      isClean ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                      isFlagged ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                      'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {feed.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </MetricCard>
        </div>
      </div>

      {/* Deep-Dive Inspection Panels with Tab Selector */}
      <div className="rounded-3xl backdrop-blur-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/5 shadow-2xl">
        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-cyan-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">All Threat Feeds ({report.sourceFeeds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'anatomy'
                ? 'bg-cyan-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">URL Anatomy & Entropy</span>
          </button>

          <button
            onClick={() => setActiveTab('flags')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'flags'
                ? 'bg-cyan-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Security Flags ({report.securityFlags.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'raw'
                ? 'bg-cyan-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Raw SOC Log (JSON)</span>
          </button>
        </div>

        {/* Tab 1: All Threat Feeds */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.sourceFeeds.map((feed, idx) => {
              const isClean = feed.status === 'Clean';
              const isFlagged = feed.status === 'Flagged' || feed.status === 'Blacklisted';
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-black/25 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {feed.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        isClean ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                        isFlagged ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                        'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {feed.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2 font-medium">
                      {feed.detail}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2 mt-1 font-semibold">
                    <span>Category: {feed.category}</span>
                    <span>Updated: {feed.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: URL Anatomy & Entropy */}
        {activeTab === 'anatomy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/25 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-extrabold text-white uppercase">
                  Shannon Information Entropy: {report.urlBreakdown.entropyScore} / 8.0
                </span>
                <span className={`text-xs font-mono font-bold ${
                  report.urlBreakdown.entropyScore > 3.8 ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {report.urlBreakdown.entropyScore > 3.8 ? 'High Obfuscation Risk' : 'Standard Text Entropy'}
                </span>
              </div>
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    report.urlBreakdown.entropyScore > 3.8 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(report.urlBreakdown.entropyScore / 8) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono font-medium">
                Entropy measures algorithmic randomness. Attackers often use high-entropy strings for domain generation algorithms (DGA) or disguised tracking payloads.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Protocol</span>
                <span className="font-extrabold text-cyan-400">{report.urlBreakdown.protocol}://</span>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Hostname</span>
                <span className="font-extrabold text-white truncate block">{report.urlBreakdown.hostname}</span>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Path Length</span>
                <span className="font-extrabold text-white">{report.urlBreakdown.pathname.length} characters</span>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Subdomains</span>
                <span className="font-extrabold text-white">{report.urlBreakdown.subdomainCount} levels</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security Flags */}
        {activeTab === 'flags' && (
          <div className="space-y-2.5">
            {report.securityFlags.map((flag) => {
              const isCritical = flag.severity === 'critical';
              const isHigh = flag.severity === 'high';
              const isMedium = flag.severity === 'medium';
              return (
                <div
                  key={flag.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                    isCritical ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                    isHigh ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' :
                    isMedium ? 'bg-amber-500/10 border-amber-500/25 text-amber-300' :
                    'bg-black/25 border-white/5'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCritical || isHigh ? (
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                    ) : isMedium ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-white">
                        {flag.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold bg-white/10 text-slate-300 border border-transparent">
                        {flag.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {flag.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Raw SOC JSON Log */}
        {activeTab === 'raw' && (
          <div className="relative rounded-xl bg-black/60 p-4 font-mono text-xs text-cyan-300 overflow-x-auto border border-white/10 max-h-96">
            <button
              onClick={handleCopyReport}
              className="absolute top-3 right-3 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
            <pre>{JSON.stringify(report, null, 2)}</pre>
          </div>
        )}
      </div>
    </motion.section>
  );
};

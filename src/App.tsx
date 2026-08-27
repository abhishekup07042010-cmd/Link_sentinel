import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { InitialLoader } from './components/InitialLoader';
import { HeroInput } from './components/HeroInput';
import { ThreatDashboard } from './components/ThreatDashboard';
import { ThreatFeedTicker } from './components/ThreatFeedTicker';
import { CacheHistoryDrawer } from './components/CacheHistoryDrawer';
import { TelemetryModal } from './components/TelemetryModal';
import { Footer } from './components/Footer';
import { ThreatReport, CacheStats } from './types';
import { simulateThreatScan } from './utils/mockIntelligence';
import { threatCache } from './utils/cacheService';

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [currentReport, setCurrentReport] = useState<ThreatReport | null>(null);
  const [cacheDrawerOpen, setCacheDrawerOpen] = useState(false);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState<CacheStats>(threatCache.getStats());
  const [scanError, setScanError] = useState<string | null>(null);

  // Permanent Dark Mode enforcement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  }, []);

  // Initial loader countdown & seed sample safe scan
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsAppLoading(false);
      // Pre-seed an initial sample scan for Google Safe Browsing so the user instantly sees the rich dashboard
      try {
        const initialReport = await simulateThreatScan('https://www.google.com');
        threatCache.set('https://www.google.com', initialReport);
        setCurrentReport(initialReport);
        setCacheStats(threatCache.getStats());
      } catch {
        // Safe fallback
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalyzeUrl = async (url: string, bypassCache: boolean = false) => {
    setIsScanning(true);
    setScanError(null);

    try {
      // 1. Check In-Memory Cache first (unless bypassCache is explicitly requested)
      if (!bypassCache) {
        const cachedReport = threatCache.get(url);
        if (cachedReport) {
          // Instant 0ms cache hit
          setCurrentReport(cachedReport);
          setCacheStats(threatCache.getStats());
          setIsScanning(false);
          return;
        }
      }

      // 2. Not in cache (or bypassed) -> Run Simulated Mock Intelligence Scan
      const liveReport = await simulateThreatScan(url);
      
      // 3. Store in in-memory cache for future instant lookups
      threatCache.set(url, liveReport);
      
      setCurrentReport(liveReport);
      setCacheStats(threatCache.getStats());
    } catch (err: any) {
      setScanError(err.message || 'Failed to complete threat intelligence scan.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectCachedItem = (report: ThreatReport) => {
    setCurrentReport(report);
    setCacheStats(threatCache.getStats());
  };

  const handleClearCache = () => {
    threatCache.clear();
    setCacheStats(threatCache.getStats());
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#121212] text-gray-100 relative overflow-x-hidden">
      {/* Initial App Load Reveal */}
      <AnimatePresence>
        {isAppLoading && <InitialLoader />}
      </AnimatePresence>

      {/* Cyber Grid Background Accents */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 transition-opacity duration-300"
        style={{
          backgroundImage: 'radial-gradient(#00FFFF 0.75px, transparent 0.75px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Ambient Blur Glow Spots */}
      <div className="absolute top-20 right-[-80px] w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-[-80px] w-96 h-96 bg-magenta-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Navigation */}
      <Navbar
        cacheStats={cacheStats}
        onOpenCacheDrawer={() => setCacheDrawerOpen(true)}
        onOpenTelemetryModal={() => setTelemetryModalOpen(true)}
      />

      {/* Real-time Threat Feeds Ticker Bar */}
      <ThreatFeedTicker />

      {/* Main Single-Page Container */}
      <main className="flex-1 relative z-10">
        {/* Hero Input Section */}
        <HeroInput
          onAnalyze={(url) => handleAnalyzeUrl(url, false)}
          isScanning={isScanning}
          activeUrl={currentReport?.sanitizedUrl}
        />

        {/* Scan Error Notice */}
        {scanError && (
          <div className="w-full max-w-4xl mx-auto px-4 mt-2 mb-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center justify-between">
              <span>{scanError}</span>
              <button 
                onClick={() => setScanError(null)}
                className="underline hover:text-rose-300 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Threat Intelligence Result Dashboard */}
        <AnimatePresence mode="wait">
          {currentReport && (
            <ThreatDashboard
              key={currentReport.id}
              report={currentReport}
              onReScan={(url, bypass) => handleAnalyzeUrl(url, bypass)}
              isScanning={isScanning}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Slide-over In-Memory Cache Drawer */}
      <CacheHistoryDrawer
        isOpen={cacheDrawerOpen}
        onClose={() => setCacheDrawerOpen(false)}
        onSelectReport={handleSelectCachedItem}
        onClearCache={handleClearCache}
        activeReportId={currentReport?.id}
      />

      {/* Live Threat Feeds Telemetry Modal */}
      <TelemetryModal
        isOpen={telemetryModalOpen}
        onClose={() => setTelemetryModalOpen(false)}
      />

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}

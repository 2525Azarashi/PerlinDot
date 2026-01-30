
import React, { useState } from 'react';
import { DEFAULT_SETTINGS } from './constants';
import { TerrainSettings } from './types';
import TerrainCanvas from './components/TerrainCanvas';
import ControlPanel from './components/ControlPanel';

const Logo = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
    <circle cx="20" cy="20" r="8" fill="#2dd4bf" />
    <circle cx="50" cy="20" r="8" fill="#2dd4bf" />
    <circle cx="80" cy="20" r="8" fill="#2dd4bf" />
    <circle cx="20" cy="50" r="8" fill="#0ea5e9" />
    <circle cx="50" cy="50" r="8" fill="#0ea5e9" />
    <circle cx="80" cy="50" r="8" fill="#0ea5e9" />
    <circle cx="20" cy="80" r="8" fill="#2dd4bf" />
    <circle cx="50" cy="80" r="8" fill="#2dd4bf" />
    <circle cx="80" cy="80" r="8" fill="#2dd4bf" />
    {/* Wavy connection lines */}
    <path d="M20,20 Q35,35 50,20 Q65,5 80,20" stroke="#2dd4bf" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M20,50 Q35,65 50,50 Q65,35 80,50" stroke="#0ea5e9" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M20,80 Q35,95 50,80 Q65,65 80,80" stroke="#2dd4bf" strokeWidth="3" fill="none" opacity="0.6" />
    <path d="M20,20 Q5,50 20,80" stroke="#2dd4bf" strokeWidth="2" fill="none" opacity="0.3" />
    <path d="M50,20 Q35,50 50,80" stroke="#2dd4bf" strokeWidth="2" fill="none" opacity="0.3" />
    <path d="M80,20 Q65,50 80,80" stroke="#2dd4bf" strokeWidth="2" fill="none" opacity="0.3" />
  </svg>
);

const App: React.FC = () => {
  const [settings, setSettings] = useState<TerrainSettings>(DEFAULT_SETTINGS);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `perlindot-${settings.seed}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleCopy = async () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            setCopyStatus('success');
            setTimeout(() => setCopyStatus('idle'), 2000);
          }
        });
      } catch (err) {
        console.error('Failed to copy image: ', err);
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8 bg-[#020617] selection:bg-teal-500/30">
      {/* Header */}
      <header className="max-w-6xl w-full mb-10 flex flex-col items-center">
        <div className="mb-6 animate-pulse-slow">
          <Logo />
        </div>
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">
            Perlin<span className="text-teal-400">Dot</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">
            10,000 Dots, <span className="text-sky-400">Infinite Terrains.</span>
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Canvas Display */}
        <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-sky-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <TerrainCanvas settings={settings} />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-between p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Grid Resolution</span>
                <span className="text-white font-mono text-lg">100 × 100</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Seed</span>
                <span className="text-teal-400 font-mono text-lg">#{settings.seed.toString().padStart(6, '0')}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all active:scale-95 border border-white/10 group ${
                  copyStatus === 'success' 
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' 
                    : 'bg-slate-800/50 hover:bg-slate-700/50 text-white'
                }`}
              >
                <i className={`fas ${copyStatus === 'success' ? 'fa-check' : 'fa-clipboard'} transition-transform`}></i>
                <span className="font-bold text-sm tracking-wide">
                  {copyStatus === 'success' ? 'COPIED!' : 'COPY'}
                </span>
              </button>
              
              <button 
                onClick={handleDownload}
                className="flex items-center gap-3 bg-gradient-to-br from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white px-6 py-3 rounded-xl transition-all active:scale-95 border border-white/10 group"
              >
                <i className="fas fa-camera group-hover:scale-110 transition-transform"></i>
                <span className="font-bold text-sm tracking-wide">SNAPSHOT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 w-full order-1 lg:order-2">
          <ControlPanel settings={settings} onChange={setSettings} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4">
        <span>Procedural Generation Engine v2.0</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
        <span className="text-teal-900">Computed Organic Matter</span>
      </footer>
    </div>
  );
};

export default App;

import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { LiveryColor, StudioMode } from '../types';

interface HeaderProps {
  currentSection: number;
  totalSections: number;
  currentLivery: LiveryColor;
  onSelectLivery: (livery: LiveryColor) => void;
  isFreeOrbit: boolean;
  onToggleFreeOrbit: () => void;
  studioMode: StudioMode;
  onToggleStudioMode: () => void;
  isTelemetryMinimized?: boolean;
  onToggleTelemetry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  totalSections,
  currentLivery,
  onSelectLivery,
  isFreeOrbit,
  onToggleFreeOrbit,
  studioMode,
  onToggleStudioMode,
  isTelemetryMinimized = false,
  onToggleTelemetry,
}) => {
  const isDark = studioMode === 'dark-garage';

  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between pointer-events-auto select-none"
    >
      {/* Brand Monogram */}
      <div className="flex items-center gap-4">
        <a href="#" className="group flex items-center gap-3 no-underline">
          <span className={`font-black text-xl tracking-tighter uppercase font-mono-tech px-2.5 py-0.5 border ${
            isDark
              ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              : 'bg-black border-black text-white'
          }`}>
            F1
          </span>
          <div className="flex flex-col">
            <span className={`text-xs font-black tracking-widest uppercase ${isDark ? 'text-white' : 'text-black'}`}>
              APEX V-26 // GT
            </span>
            <span className="text-[10px] text-zinc-400 font-mono-tech tracking-wider">
              8K CINEMATIC STUDIO RENDER
            </span>
          </div>
        </a>
      </div>

      {/* Center Section Tracker */}
      <div className={`hidden md:flex items-center gap-3 font-mono-tech text-xs tracking-widest px-4 py-2 border rounded-full backdrop-blur-md transition-all ${
        isDark
          ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400'
          : 'bg-white/80 border-zinc-200 text-zinc-600 shadow-xs'
      }`}>
        <span className={isDark ? 'text-cyan-400 font-bold' : 'text-black font-bold'}>0{currentSection}</span>
        <div className={`w-14 h-1 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isDark ? 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-black'
            }`}
            style={{ width: `${(currentSection / totalSections) * 100}%` }}
          />
        </div>
        <span>0{totalSections}</span>
      </div>

      {/* Right Controls: Studio Mode & 360 Orbit */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Studio Mode Toggle (Dark Neon Garage / White Studio) */}
        <button
          id="btn-toggle-studio-mode"
          type="button"
          onClick={onToggleStudioMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 border cursor-pointer ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:border-cyan-400 hover:text-cyan-400'
              : 'bg-white/90 border-zinc-300 text-black hover:border-black'
          }`}
          title="Toggle Studio Lighting Environment"
        >
          {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          <span className="hidden sm:inline">{isDark ? 'Dark Garage' : 'White Studio'}</span>
        </button>

        {/* Free Orbit Mode Pill */}
        <button
          id="btn-toggle-orbit"
          type="button"
          onClick={onToggleFreeOrbit}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 border cursor-pointer ${
            isFreeOrbit
              ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
              : isDark
              ? 'bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:border-zinc-500'
              : 'bg-white/90 border-zinc-300 text-black hover:border-black'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isFreeOrbit ? 'Orbit Active' : '360° Orbit'}</span>
        </button>

        {/* Live Telemetry Pill Button */}
        <button
          id="btn-header-toggle-telemetry"
          type="button"
          onClick={onToggleTelemetry}
          className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono-tech border transition-all cursor-pointer ${
            isTelemetryMinimized
              ? isDark
                ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black'
              : isDark
              ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
              : 'bg-zinc-100 border-zinc-200 text-zinc-900 hover:border-black shadow-xs'
          }`}
          title={isTelemetryMinimized ? 'Expand Live Telemetry HUD' : 'Minimize Live Telemetry HUD'}
        >
          <span className={`w-2 h-2 rounded-full ${
            isTelemetryMinimized
              ? 'bg-zinc-500'
              : 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
          }`} />
          <span className="font-semibold">{isTelemetryMinimized ? 'TELEMETRY (MIN)' : 'TELEMETRY LIVE'}</span>
        </button>
      </div>
    </header>
  );
};

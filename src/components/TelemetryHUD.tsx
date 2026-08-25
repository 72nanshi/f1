import React, { useEffect, useState, useRef } from 'react';
import { Activity, ChevronDown, ChevronUp, Maximize2, Minus } from 'lucide-react';
import { StudioMode } from '../types';

interface TelemetryHUDProps {
  scrollProgress?: number; // 0 to 1
  scrollProgressRef?: React.MutableRefObject<number>;
  studioMode?: StudioMode;
  isMinimized?: boolean;
  onToggleMinimized?: () => void;
  defaultMinimized?: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = React.memo(({
  scrollProgress = 0,
  scrollProgressRef,
  studioMode = 'dark-garage',
  isMinimized: controlledMinimized,
  onToggleMinimized,
  defaultMinimized = false,
}) => {
  const [internalMinimized, setInternalMinimized] = useState<boolean>(defaultMinimized);

  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;

  const handleToggle = () => {
    if (onToggleMinimized) {
      onToggleMinimized();
    } else {
      setInternalMinimized((prev) => !prev);
    }
  };
  const [currentP, setCurrentP] = useState<number>(() =>
    scrollProgressRef ? scrollProgressRef.current : scrollProgress
  );
  const rafId = useRef<number | null>(null);
  const lastP = useRef<number>(currentP);

  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      const targetP = scrollProgressRef ? scrollProgressRef.current : scrollProgress;

      if (Math.abs(targetP - lastP.current) > 0.0015) {
        lastP.current = targetP;
        setCurrentP(targetP);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [scrollProgress, scrollProgressRef]);

  const p = Math.min(Math.max(currentP, 0), 1);
  const isDark = studioMode === 'dark-garage';

  // Calculate realistic telemetry values
  let speedKmh = 0;
  let gear = 1;
  let rpm = 4500;
  let drs = false;
  let gForce = 1.0;
  let downforceKg = 320;
  let stateLabel = 'STUDIO PIT BAY';

  if (p <= 0.20) {
    speedKmh = 0;
    gear = 0; // Neutral
    rpm = Math.round(4200 + Math.sin(p * 20) * 150);
    gForce = 1.0;
    downforceKg = 240;
    stateLabel = 'STATIONARY // IDLE';
  } else if (p <= 0.42) {
    const local = (p - 0.20) / 0.22;
    speedKmh = Math.round(local * 45);
    gear = 1;
    rpm = Math.round(5200 + local * 2000);
    gForce = 1.0 + local * 0.4;
    downforceKg = Math.round(380 + local * 200);
    stateLabel = 'WIND TUNNEL // AERO SCAN';
  } else if (p <= 0.68) {
    const local = (p - 0.42) / 0.26;
    speedKmh = Math.round(180 + local * 172); // Accelerating to 352 km/h
    gear = Math.min(8, Math.floor(4 + local * 4));
    rpm = Math.round(11200 + local * 2800);
    drs = true;
    gForce = 1.4 + local * 0.8;
    downforceKg = Math.round(750 + local * 520);
    stateLabel = 'HIGH VELOCITY // DRS OPEN';
  } else if (p <= 0.86) {
    const local = (p - 0.68) / 0.18;
    speedKmh = Math.round(240 - local * 110);
    gear = Math.max(3, Math.floor(6 - local * 3));
    rpm = Math.round(10800 - local * 2400);
    drs = false;
    gForce = Number((2.8 + Math.sin(local * Math.PI) * 2.6).toFixed(1));
    downforceKg = Math.round(1180 - local * 280);
    stateLabel = 'APEX DRIFT // 5.4G LATERAL';
  } else {
    const local = (p - 0.86) / 0.14;
    speedKmh = Math.round(Math.max(0, 110 * (1 - local * 2)));
    gear = speedKmh > 0 ? 2 : 0;
    rpm = Math.round(6500 - local * 2200);
    drs = false;
    gForce = 1.0;
    downforceKg = Math.round(420 - local * 180);
    stateLabel = 'PARC FERMÉ // COMPLETE';
  }

  return (
    <aside
      id="telemetry-hud"
      aria-label="Real-time Vehicle Telemetry"
      className="fixed bottom-6 right-6 md:right-10 z-30 pointer-events-auto hidden sm:block select-none"
    >
      {isMinimized ? (
        /* Minimized Compact Badge */
        <button
          id="btn-expand-telemetry"
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl backdrop-blur-xl border font-mono-tech text-xs transition-all duration-200 cursor-pointer shadow-lg group hover:scale-[1.03] ${
            isDark
              ? 'bg-zinc-950/90 border-zinc-800 hover:border-cyan-400 text-zinc-100 shadow-[0_0_20px_rgba(0,0,0,0.8)]'
              : 'bg-white/95 border-zinc-300 hover:border-black text-black shadow-md'
          }`}
          title="Click to expand Live Telemetry"
        >
          <div className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse" />
            <span className="text-[11px] font-semibold">TELEMETRY</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-700/60">
            <span className={`font-black tabular-nums ${isDark ? 'text-cyan-300' : 'text-black'}`}>
              {speedKmh} <span className="text-[9px] font-normal text-zinc-400">KM/H</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-black'
            }`}>
              G{gear === 0 ? 'N' : gear}
            </span>
          </div>
          <div className={`p-1 rounded-md transition-colors ${
            isDark ? 'text-zinc-400 group-hover:text-cyan-300 group-hover:bg-zinc-800' : 'text-zinc-600 group-hover:text-black group-hover:bg-zinc-100'
          }`}>
            <ChevronUp className="w-3.5 h-3.5" />
          </div>
        </button>
      ) : (
        /* Full Telemetry HUD Card */
        <div className={`backdrop-blur-xl border p-4 rounded-xl font-mono-tech text-xs w-64 transition-all duration-200 ${
          isDark
            ? 'bg-zinc-950/85 border-zinc-800/80 text-zinc-100 shadow-[0_0_25px_rgba(0,0,0,0.8)]'
            : 'bg-white/90 border-zinc-200 text-black shadow-sm'
        }`}>
          {/* Header with Title and Minimize Button */}
          <div className={`flex items-center justify-between border-b pb-2 mb-2.5 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex items-center gap-1.5 font-bold tracking-wider">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className={isDark ? 'text-white' : 'text-black'}>LIVE TELEMETRY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] tracking-tight ${isDark ? 'text-cyan-400/90' : 'text-zinc-600'}`}>
                {stateLabel}
              </span>
              <button
                id="btn-minimize-telemetry"
                type="button"
                onClick={handleToggle}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  isDark
                    ? 'text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800/80'
                    : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                }`}
                title="Minimize Telemetry HUD"
                aria-label="Minimize Telemetry"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Speed Gauge */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-black tracking-tighter tabular-nums ${
                isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-black'
              }`}>
                {speedKmh}
              </span>
              <span className={`text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>KM/H</span>
            </div>
            <div className="text-right">
              <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>GEAR</div>
              <div className={`text-2xl font-black ${isDark ? 'text-cyan-400' : 'text-black'}`}>
                {gear === 0 ? 'N' : gear}
              </div>
            </div>
          </div>

          {/* RPM Bar */}
          <div className="mb-3">
            <div className={`flex justify-between text-[10px] mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <span>RPM POWERBAND</span>
              <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-black'}`}>{rpm}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden flex ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
              <div
                className={`h-full transition-all duration-100 ${
                  rpm > 13000
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                    : rpm > 9000
                    ? 'bg-amber-400'
                    : isDark
                    ? 'bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                    : 'bg-black'
                }`}
                style={{ width: `${Math.min(100, (rpm / 15000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 gap-2 text-[10px] pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <div className={`flex items-center justify-between px-2 py-1 rounded ${isDark ? 'bg-zinc-900/80 border border-zinc-800/60' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>DOWNFORCE</span>
              <span className={`font-bold tabular-nums ${isDark ? 'text-zinc-100' : 'text-black'}`}>{downforceKg} kg</span>
            </div>
            <div className={`flex items-center justify-between px-2 py-1 rounded ${isDark ? 'bg-zinc-900/80 border border-zinc-800/60' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>LATERAL G</span>
              <span className={`font-bold tabular-nums ${gForce > 4.0 ? 'text-red-500' : isDark ? 'text-cyan-400' : 'text-black'}`}>
                {gForce.toFixed(1)} G
              </span>
            </div>
            <div className={`flex items-center justify-between px-2 py-1 rounded ${isDark ? 'bg-zinc-900/80 border border-zinc-800/60' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>DRS REAR</span>
              <span className={`font-bold ${drs ? 'text-emerald-400' : isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {drs ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
            <div className={`flex items-center justify-between px-2 py-1 rounded ${isDark ? 'bg-zinc-900/80 border border-zinc-800/60' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>GROUND VORTEX</span>
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-black'}`}>SEALED</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
});

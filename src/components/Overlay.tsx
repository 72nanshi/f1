import React, { useState } from 'react';
import { ArrowDown, ChevronRight, Check, Download, Sparkles } from 'lucide-react';
import { LiveryColor, StudioMode } from '../types';
import { LIVERY_CONFIGS } from './F1Car';

interface OverlayProps {
  currentLivery: LiveryColor;
  onSelectLivery: (livery: LiveryColor) => void;
  onScrollToNext: () => void;
  onToggleFreeOrbit: () => void;
  isFreeOrbit: boolean;
  studioMode?: StudioMode;
}

export const Overlay: React.FC<OverlayProps> = ({
  currentLivery,
  onSelectLivery,
  onScrollToNext,
  onToggleFreeOrbit,
  isFreeOrbit,
  studioMode = 'dark-garage',
}) => {
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [dossierDownloaded, setDossierDownloaded] = useState(false);

  const isDark = studioMode === 'dark-garage';

  const handleDownloadDossier = () => {
    setDossierDownloaded(true);
    setTimeout(() => {
      setShowDossierModal(false);
      setDossierDownloaded(false);
    }, 1800);
  };

  return (
    <div className="relative z-10 w-full select-none">
      {/* ================================================================
          SECTION 1: HERO (Engineered for Speed / Dark Garage Studio)
          ================================================================ */}
      <section
        id="section-hero"
        className="h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 py-28 relative"
      >
        {/* Top Floating Technical Eyebrow */}
        <div className="max-w-md">
          <div className={`font-mono-tech text-xs tracking-widest uppercase mb-2 flex items-center gap-2 ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
            CHASSIS // APEX-01 FIA HOMOLOGATED
          </div>
          <p className={`text-xs font-mono-tech leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            OVERHEAD NEON LIGHTING &bull; GLOSSY CARBON FIBRE &bull; 2026 ARCHITECTURE
          </p>
        </div>

        {/* Main Massive Editorial Headline */}
        <div className="max-w-4xl my-auto">
          <div className={`inline-block px-3 py-1 mb-4 rounded text-xs font-mono-tech font-bold uppercase tracking-widest border ${
            isDark
              ? 'bg-zinc-900/90 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
              : 'bg-zinc-100 border-zinc-300 text-zinc-900'
          }`}>
            HIGH-TECH DARK GARAGE // 8K CINEMATIC STUDIO RENDER
          </div>
          <h1 className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.88] ${
            isDark ? 'text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]' : 'text-black'
          }`}>
            ENGINEERED<br />
            <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>FOR</span> VELOCITY.
          </h1>
          <p className={`mt-6 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed ${
            isDark ? 'text-zinc-300' : 'text-zinc-700'
          }`}>
            Parked beneath dramatic overhead neon softbox gantries. Featuring sculpted ground-effect aerodynamics, active DRS actuation, and photorealistic glossy carbon fiber clearcoat.
          </p>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className={`flex items-center justify-between pt-6 border-t ${
          isDark ? 'border-zinc-800/80' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onScrollToNext}
              className={`group flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                isDark ? 'text-white hover:text-cyan-400' : 'text-black hover:text-red-600'
              }`}
            >
              <span>Scroll to ignite sequence</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
          <div className={`font-mono-tech text-xs tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            [ 01 // 05 ] SCROLL FOR 3D CHOREOGRAPHY
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2: ORBIT & AERODYNAMIC SPEC (Floating Left)
          ================================================================ */}
      <section
        id="section-aero"
        className="h-screen w-full flex items-center px-6 sm:px-12 md:px-20 relative"
      >
        {/* Floating Left Editorial Card */}
        <div className={`w-full max-w-lg p-8 md:p-10 border rounded-2xl backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-zinc-950/80 border-zinc-800 text-white shadow-[0_0_35px_rgba(0,0,0,0.8)]'
            : 'bg-white/70 border-zinc-200 text-black shadow-xs'
        }`}>
          <div className="font-mono-tech text-xs font-bold text-cyan-400 tracking-widest uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            02 // DOWNFORCE & WING ARCHITECTURE
          </div>
          
          <div className="flex items-baseline gap-3 mb-3">
            <span className={`text-6xl sm:text-7xl font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              0.24
            </span>
            <span className={`text-lg font-mono-tech font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Cd EFFICIENCY
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            4-STAGE CASCADE & GROUND EFFECT VENTURI
          </h2>

          <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Intricate aerodynamic front wing flaps direct wake vortexes outboard of the 18-inch racing wheels, while dual underbody Venturi channels pull the monocoque toward the track with 1,200 kg of suction at 300 km/h.
          </p>

          <div className={`grid grid-cols-2 gap-3 pt-4 border-t text-xs font-mono-tech ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div>
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>DRS ACTUATION</div>
              <div className={`font-bold text-sm ${isDark ? 'text-cyan-400' : 'text-black'}`}>&lt; 0.18 SECONDS</div>
            </div>
            <div>
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>FRONT WING</div>
              <div className={`font-bold text-sm ${isDark ? 'text-zinc-100' : 'text-black'}`}>4-TIER CARBON</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: ACCELERATION & HIGH SPEED STRAIGHT (Floating Right)
          ================================================================ */}
      <section
        id="section-power"
        className="h-screen w-full flex items-center justify-end px-6 sm:px-12 md:px-20 relative"
      >
        {/* Floating Right Editorial Card */}
        <div className={`w-full max-w-lg p-8 md:p-10 border rounded-2xl backdrop-blur-xl text-right transition-all ${
          isDark
            ? 'bg-zinc-950/80 border-zinc-800 text-white shadow-[0_0_35px_rgba(0,0,0,0.8)]'
            : 'bg-white/70 border-zinc-200 text-black shadow-xs'
        }`}>
          <div className="font-mono-tech text-xs font-bold text-red-500 tracking-widest uppercase mb-2">
            03 // PROPULSION & ACTIVE DRS
          </div>

          <div className="flex items-baseline justify-end gap-3 mb-3">
            <span className={`text-lg font-mono-tech font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>0–100 KM/H IN</span>
            <span className={`text-6xl sm:text-7xl font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              1.9s
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            1,050 HP TURBOCHARGED HYBRID V6
          </h2>

          <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Engineered with a 1.6L 90° V6 internal combustion unit combined with dual MGU-K and MGU-H energy recovery systems, delivering blistering 365 km/h top speeds under open DRS drag reduction.
          </p>

          <div className={`grid grid-cols-2 gap-3 pt-4 border-t text-xs font-mono-tech text-left ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div>
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>TOP VELOCITY</div>
              <div className={`font-bold text-sm ${isDark ? 'text-cyan-400' : 'text-black'}`}>365 KM/H</div>
            </div>
            <div className="text-right">
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>KINETIC BOOST</div>
              <div className={`font-bold text-sm ${isDark ? 'text-emerald-400' : 'text-black'}`}>160 KW MGU-K</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4: COCKPIT & DYNAMIC CHICANE (Floating Bottom-Left)
          ================================================================ */}
      <section
        id="section-dynamics"
        className="h-screen w-full flex items-end px-6 sm:px-12 md:px-20 pb-28 relative"
      >
        <div className={`w-full max-w-xl p-8 md:p-10 border rounded-2xl backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-zinc-950/80 border-zinc-800 text-white shadow-[0_0_35px_rgba(0,0,0,0.8)]'
            : 'bg-white/70 border-zinc-200 text-black shadow-xs'
        }`}>
          <div className="font-mono-tech text-xs font-bold text-cyan-400 tracking-widest uppercase mb-2">
            04 // COCKPIT & LATERAL FORCES
          </div>

          <div className="flex items-baseline gap-3 mb-3">
            <span className={`text-6xl sm:text-7xl font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              5.4 G
            </span>
            <span className={`text-lg font-mono-tech font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              PEAK LATERAL LOAD
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            TITANIUM HALO & PUSHROD SUSPENSION
          </h2>

          <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Grade 5 titanium halo safety hoop capable of withstanding 125 kN of static vertical force, paired with an illuminated digital steering wheel telemetry display and carbon-ceramic brake rotors glowing under peak deceleration.
          </p>

          <div className={`grid grid-cols-3 gap-2 pt-4 border-t text-xs font-mono-tech ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div>
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>BRAKE ROTORS</div>
              <div className={`font-bold ${isDark ? 'text-zinc-100' : 'text-black'}`}>1,000°C CC</div>
            </div>
            <div>
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>HALO STRENGTH</div>
              <div className={`font-bold ${isDark ? 'text-cyan-400' : 'text-black'}`}>125 KN LOAD</div>
            </div>
            <div>
              <div className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>MIN. MASS</div>
              <div className={`font-bold ${isDark ? 'text-zinc-100' : 'text-black'}`}>798 KG FIA</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: CLOSING FINALE & LIVERY SPECIFICATION
          ================================================================ */}
      <section
        id="section-closing"
        className="min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 md:px-20 py-24 relative bg-transparent"
      >
        {/* Top Header of Section 5 */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono-tech text-xs font-bold text-cyan-400 tracking-widest uppercase mb-2">
              05 // STUDIO SHOWCASE & LIVERY SELECTION
            </div>
            <h2 className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              THE PINNACLE OF<br />
              MOTORSPORT.
            </h2>
          </div>

          {/* Livery Selector Pills */}
          <div className={`p-4 border rounded-2xl backdrop-blur-xl transition-all ${
            isDark
              ? 'bg-zinc-950/85 border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.8)]'
              : 'bg-white/90 border-zinc-200 shadow-xs'
          }`}>
            <div className={`text-[11px] font-mono-tech mb-2.5 font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              CHOOSE LIVERY SPECIFICATION
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LIVERY_CONFIGS) as LiveryColor[]).map((key) => {
                const config = LIVERY_CONFIGS[key];
                const isSelected = currentLivery === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectLivery(key)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer border ${
                      isSelected
                        ? isDark
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-black text-white border-black'
                        : isDark
                        ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:border-black'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/30 shadow-xs"
                      style={{ backgroundColor: config.bodyColor }}
                    />
                    <span>{config.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Prompt */}
        <div className="my-auto py-16 pointer-events-none text-center">
          <p className={`text-xs font-mono-tech uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            3D MODEL HOMOLOGATED // FIA TECHNICAL DIRECTIVE COMPLIANT &bull; 8K RESOLUTION SHADERS
          </p>
        </div>

        {/* Bottom CTA Block and Actions */}
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Primary Action Button */}
            <button
              id="btn-request-dossier"
              type="button"
              onClick={() => setShowDossierModal(true)}
              className={`w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 group ${
                isDark
                  ? 'bg-cyan-400 text-black hover:bg-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black'
              }`}
            >
              <span>REQUEST TECHNICAL DOSSIER</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Orbit Inspection Button */}
            <button
              id="btn-explore-360"
              type="button"
              onClick={onToggleFreeOrbit}
              className={`w-full sm:w-auto px-6 py-4 border text-sm font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isFreeOrbit
                  ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : isDark
                  ? 'bg-zinc-900/90 border-zinc-700 text-white hover:border-cyan-400'
                  : 'bg-white border-zinc-300 text-black hover:border-black'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isFreeOrbit ? 'RESET CAMERA' : 'EXPLORE 360° MODEL'}</span>
            </button>
          </div>

          {/* Footer Metadata */}
          <div className={`text-right text-xs font-mono-tech ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <div>APEX RACING MOTORSPORT &copy; 2026</div>
            <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>ALL COMPOSITE AERODYNAMIC RIGHTS RESERVED</div>
          </div>
        </div>
      </section>

      {/* Technical Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`border rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 font-bold uppercase">
                  CONFIDENTIAL TECHNICAL SHEET
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  APEX V-26 SPECIFICATION
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-sm font-bold ${
                  isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'
                }`}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 mb-6 font-mono-tech text-xs">
              <div className={`flex justify-between py-2 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>POWER UNIT</span>
                <span className="font-bold">1.6L 90° Turbocharged V6 Hybrid</span>
              </div>
              <div className={`flex justify-between py-2 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>PEAK OUTPUT</span>
                <span className="font-bold">1,050 BHP @ 15,000 RPM</span>
              </div>
              <div className={`flex justify-between py-2 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>MAX AERODYNAMIC DOWNFORCE</span>
                <span className="font-bold">1,450 KG @ 320 KM/H</span>
              </div>
              <div className={`flex justify-between py-2 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>MINIMUM MASS (FIA)</span>
                <span className="font-bold">798 KG (INCLUDING DRIVER)</span>
              </div>
              <div className={`flex justify-between py-2 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>TRANSMISSION</span>
                <span className="font-bold">8-Speed Seamless Carbon Gearbox</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                CLOSE
              </button>
              <button
                type="button"
                onClick={handleDownloadDossier}
                disabled={dossierDownloaded}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                {dossierDownloaded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>DOSSIER READY</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD PDF DOSSIER</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

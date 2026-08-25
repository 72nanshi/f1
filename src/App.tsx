import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { Header } from './components/Header';
import { TelemetryHUD } from './components/TelemetryHUD';
import { LiveryColor, StudioMode } from './types';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [currentLivery, setCurrentLivery] = useState<LiveryColor>('cyber');
  const [isFreeOrbit, setIsFreeOrbit] = useState<boolean>(false);
  const [studioMode, setStudioMode] = useState<StudioMode>('dark-garage');
  const [isTelemetryMinimized, setIsTelemetryMinimized] = useState<boolean>(false);

  const scrollProgressRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 3. ScrollTrigger for Global Progress Tracking
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        const p = self.progress;
        scrollProgressRef.current = p;

        let newSec = 1;
        if (p < 0.20) newSec = 1;
        else if (p < 0.42) newSec = 2;
        else if (p < 0.68) newSec = 3;
        else if (p < 0.86) newSec = 4;
        else newSec = 5;

        setCurrentSection((prev) => (prev !== newSec ? newSec : prev));
      },
    });

    // 4. Section-specific fade/slide in animations
    const sections = ['#section-hero', '#section-aero', '#section-power', '#section-dynamics', '#section-closing'];
    sections.forEach((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0.15, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleScrollToNext = () => {
    if (lenisRef.current) {
      const nextY = window.innerHeight * 1.0;
      lenisRef.current.scrollTo(nextY, { duration: 1.4 });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const handleToggleFreeOrbit = () => {
    setIsFreeOrbit((prev) => !prev);
  };

  const handleToggleStudioMode = () => {
    setStudioMode((prev) => (prev === 'dark-garage' ? 'white-studio' : 'dark-garage'));
  };

  const handleToggleTelemetry = () => {
    setIsTelemetryMinimized((prev) => !prev);
  };

  const isDark = studioMode === 'dark-garage';

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[500vh] transition-colors duration-500 ${
        isDark
          ? 'bg-[#06070a] text-white selection:bg-cyan-500 selection:text-black'
          : 'bg-white text-black selection:bg-black selection:text-white'
      }`}
    >
      {/* Editorial Header */}
      <Header
        currentSection={currentSection}
        totalSections={5}
        currentLivery={currentLivery}
        onSelectLivery={setCurrentLivery}
        isFreeOrbit={isFreeOrbit}
        onToggleFreeOrbit={handleToggleFreeOrbit}
        studioMode={studioMode}
        onToggleStudioMode={handleToggleStudioMode}
        isTelemetryMinimized={isTelemetryMinimized}
        onToggleTelemetry={handleToggleTelemetry}
      />

      {/* 3D Fixed Background Canvas with Dramatic Dark Garage Overhead Neon Lighting */}
      <Scene
        scrollProgressRef={scrollProgressRef}
        livery={currentLivery}
        isFreeOrbit={isFreeOrbit}
        studioMode={studioMode}
      />

      {/* Live Synchronized Telemetry HUD with Minimize/Maximize option */}
      <TelemetryHUD
        scrollProgressRef={scrollProgressRef}
        studioMode={studioMode}
        isMinimized={isTelemetryMinimized}
        onToggleMinimized={handleToggleTelemetry}
      />

      {/* Asymmetric Floating Editorial Content Overlays */}
      <Overlay
        currentLivery={currentLivery}
        onSelectLivery={setCurrentLivery}
        onScrollToNext={handleScrollToNext}
        onToggleFreeOrbit={handleToggleFreeOrbit}
        isFreeOrbit={isFreeOrbit}
        studioMode={studioMode}
      />
    </div>
  );
}

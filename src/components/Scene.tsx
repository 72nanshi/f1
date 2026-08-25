import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { F1Car } from './F1Car';
import { Ground } from './Ground';
import { GarageEnvironment } from './GarageEnvironment';
import { SpeedEffects } from './SpeedEffects';
import { LiveryColor, StudioMode } from '../types';

interface SceneProps {
  scrollProgress?: number; // 0 to 1
  scrollProgressRef?: React.MutableRefObject<number>;
  livery: LiveryColor;
  isFreeOrbit?: boolean;
  studioMode?: StudioMode;
}

// Internal scene animator component
const CameraAndCarRig: React.FC<{
  scrollProgress?: number;
  scrollProgressRef?: React.MutableRefObject<number>;
  livery: LiveryColor;
  isFreeOrbit?: boolean;
}> = ({ scrollProgress, scrollProgressRef, livery, isFreeOrbit = false }) => {
  const { camera, size } = useThree();

  const carGroup = useRef<THREE.Group>(null);
  const wheelRotationRef = useRef<number>(0);
  const steerAngleRef = useRef<number>(0.12);
  const drsOpenRef = useRef<boolean>(false);
  const speedRef = useRef<number>(0);
  const activeSpeedLinesRef = useRef<boolean>(false);

  // Targets for smooth lerping
  const targetCamPos = useRef(new THREE.Vector3(4.2, 1.8, 4.8));
  const targetCamLookAt = useRef(new THREE.Vector3(0, 0.4, 0.2));
  const currentCamLookAt = useRef(new THREE.Vector3(0, 0.4, 0.2));
  const targetCarPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetCarRot = useRef(new THREE.Euler(0, 0.35, 0));

  const isMobile = size.width < 768;
  const zoomScale = isMobile ? 1.35 : 1.0;

  useFrame((state) => {
    // Read directly from mutable ref for zero React re-render overhead during high-speed scrolling
    const rawP = scrollProgressRef ? scrollProgressRef.current : (scrollProgress ?? 0);
    const p = Math.min(Math.max(rawP, 0), 1);
    const clock = state.clock.getElapsedTime();

    // Subtle hybrid engine idle vibration
    const engineIdleJitter = Math.sin(clock * 45) * 0.0008;

    // =========================================================================
    // CHOREOGRAPHY STATE MACHINE BASED ON SCROLL PROGRESS p
    // =========================================================================

    if (p <= 0.20) {
      // -----------------------------------------------------------------------
      // SECTION 1: HERO (0.00 -> 0.20)
      // Car sitting in dark garage under overhead neon softbox
      // -----------------------------------------------------------------------
      const localT = p / 0.20;
      const idleFloat = Math.sin(clock * 1.4) * 0.008;
      const ambientIdleRot = Math.sin(clock * 0.5) * 0.025;

      targetCarPos.current.set(0, idleFloat + engineIdleJitter, 0);
      targetCarRot.current.set(0, 0.35 + ambientIdleRot + localT * 0.15, 0);

      targetCamPos.current.set(4.2 * zoomScale, 1.7, 4.8 * zoomScale);
      targetCamLookAt.current.set(0, 0.35, 0.2);

      steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, 0.12, 0.1);
      drsOpenRef.current = false;
      speedRef.current = 0;
      activeSpeedLinesRef.current = false;

    } else if (p > 0.20 && p <= 0.42) {
      // -----------------------------------------------------------------------
      // SECTION 2: ORBIT & AERODYNAMIC SPEC INSPECTION (0.20 -> 0.42)
      // Camera sweeps around sidepods, halo, and front wing
      // -----------------------------------------------------------------------
      const localT = (p - 0.20) / 0.22;
      const orbitAngle = THREE.MathUtils.lerp(0.8, -1.8, localT);
      const radius = 5.2 * zoomScale;
      const camY = THREE.MathUtils.lerp(1.7, 2.4, Math.sin(localT * Math.PI));

      targetCamPos.current.set(
        Math.cos(orbitAngle) * radius,
        camY,
        Math.sin(orbitAngle) * radius
      );
      targetCamLookAt.current.set(0, 0.4, 0);

      targetCarPos.current.set(0, engineIdleJitter, 0);
      targetCarRot.current.set(0, THREE.MathUtils.lerp(0.5, 0.1, localT), 0);

      steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, -0.05, 0.1);
      drsOpenRef.current = false;
      speedRef.current = 0;
      activeSpeedLinesRef.current = false;

    } else if (p > 0.42 && p <= 0.68) {
      // -----------------------------------------------------------------------
      // SECTION 3: DRS & HIGH SPEED STRAIGHTAWAY (0.42 -> 0.68)
      // Dynamic acceleration, open DRS flap, spinning wheels, kinetic speed
      // -----------------------------------------------------------------------
      const localT = (p - 0.42) / 0.26;
      const speed = THREE.MathUtils.lerp(0.2, 1.0, localT);
      speedRef.current = speed;

      wheelRotationRef.current -= speed * 0.95;

      const dynamicSteer = Math.sin(clock * 8) * 0.04;
      steerAngleRef.current = dynamicSteer;

      const chassisShakeY = (Math.random() - 0.5) * 0.012 * speed;
      const chassisRollZ = (Math.sin(clock * 6) * 0.018 + dynamicSteer * 0.3) * speed;
      const chassisSquatX = speed * 0.02;

      targetCarPos.current.set(0, chassisShakeY, 0);
      targetCarRot.current.set(-chassisSquatX, Math.PI + Math.sin(clock * 2) * 0.04, chassisRollZ);

      targetCamPos.current.set(
        THREE.MathUtils.lerp(3.2, 2.2, localT) * zoomScale,
        THREE.MathUtils.lerp(1.3, 0.9, localT),
        THREE.MathUtils.lerp(4.5, 3.8, localT) * zoomScale
      );
      targetCamLookAt.current.set(0, 0.38, -0.2);

      drsOpenRef.current = localT > 0.2;
      activeSpeedLinesRef.current = localT > 0.15;

    } else if (p > 0.68 && p <= 0.86) {
      // -----------------------------------------------------------------------
      // SECTION 4: CLOSE-UP COCKPIT & HALO (0.68 -> 0.86)
      // Dramatic macro camera focused on halo and steering wheel telemetry
      // -----------------------------------------------------------------------
      const localT = (p - 0.68) / 0.18;

      targetCamPos.current.set(
        THREE.MathUtils.lerp(0.65, 0.35, localT) * zoomScale,
        THREE.MathUtils.lerp(1.05, 0.92, localT),
        THREE.MathUtils.lerp(1.15, 0.85, localT) * zoomScale
      );
      targetCamLookAt.current.set(0, 0.44, 0.26);

      targetCarPos.current.set(0, engineIdleJitter, 0);
      targetCarRot.current.set(0, THREE.MathUtils.lerp(0.1, -0.15, localT), 0);

      steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, 0.02, 0.1);
      drsOpenRef.current = false;
      speedRef.current = 0;
      activeSpeedLinesRef.current = false;

    } else {
      // -----------------------------------------------------------------------
      // SECTION 5: OUTRO 3/4 BEAUTY REAR/DIFFUSER FINALE (0.86 -> 1.00)
      // Car in center, ready for free 360 inspection
      // -----------------------------------------------------------------------
      const localT = (p - 0.86) / 0.14;

      targetCamPos.current.set(
        THREE.MathUtils.lerp(3.8, 3.9, localT) * zoomScale,
        THREE.MathUtils.lerp(1.6, 1.45, localT),
        THREE.MathUtils.lerp(-3.8, -4.2, localT) * zoomScale
      );
      targetCamLookAt.current.set(0, 0.38, 0);

      targetCarPos.current.set(0, engineIdleJitter, 0);
      targetCarRot.current.set(0, -0.45, 0);

      steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, 0, 0.1);
      drsOpenRef.current = false;
      speedRef.current = 0;
      activeSpeedLinesRef.current = false;
    }

    // Apply Car Transformations
    if (carGroup.current) {
      carGroup.current.position.lerp(targetCarPos.current, 0.1);
      carGroup.current.rotation.x = THREE.MathUtils.lerp(
        carGroup.current.rotation.x,
        targetCarRot.current.x,
        0.1
      );
      carGroup.current.rotation.y = THREE.MathUtils.lerp(
        carGroup.current.rotation.y,
        targetCarRot.current.y,
        0.1
      );
      carGroup.current.rotation.z = THREE.MathUtils.lerp(
        carGroup.current.rotation.z,
        targetCarRot.current.z,
        0.1
      );
    }

    // Apply Camera Position & LookAt if not manually interacting via OrbitControls
    if (!isFreeOrbit) {
      camera.position.lerp(targetCamPos.current, 0.08);
      currentCamLookAt.current.lerp(targetCamLookAt.current, 0.08);
      camera.lookAt(currentCamLookAt.current);
    }
  });

  return (
    <>
      <group ref={carGroup}>
        <F1Car
          livery={livery}
          wheelRotationRef={wheelRotationRef}
          steerAngleRef={steerAngleRef}
          drsOpenRef={drsOpenRef}
        />
      </group>

      <SpeedEffects
        speedRef={speedRef}
        activeRef={activeSpeedLinesRef}
      />
    </>
  );
};

export const Scene: React.FC<SceneProps> = React.memo(({
  scrollProgress = 0,
  scrollProgressRef,
  livery,
  isFreeOrbit = false,
  studioMode = 'dark-garage',
}) => {
  const isDark = studioMode === 'dark-garage';

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        shadows
        camera={{ position: [4.2, 1.8, 4.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        style={{
          background: isDark ? '#06070a' : '#ffffff',
          pointerEvents: isFreeOrbit ? 'auto' : 'none',
        }}
      >
        {/* Deep Atmosphere Fog in Garage Mode */}
        {isDark ? (
          <>
            <color attach="background" args={['#06070a']} />
            <fog attach="fog" args={['#06070a', 6, 26]} />
          </>
        ) : (
          <color attach="background" args={['#ffffff']} />
        )}

        {/* High-Tech Garage Environment with Overhead Neon Lightbars */}
        <Environment resolution={256}>
          <GarageEnvironment mode={studioMode} />
        </Environment>

        {/* Studio Lighting Balance */}
        {isDark ? (
          <>
            {/* Soft Ambient Fill */}
            <ambientLight intensity={0.4} />

            {/* Main Overhead High-Intensity Neon Softbox Light (Casting crisp linear reflections) */}
            <directionalLight
              position={[0, 6.5, 0.5]}
              intensity={3.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={20}
              shadow-camera-left={-5}
              shadow-camera-right={5}
              shadow-camera-top={5}
              shadow-camera-bottom={-5}
              shadow-bias={-0.0001}
            />

            {/* Left Ice Cyan Neon Rim Light */}
            <directionalLight
              position={[-6, 3.5, 2]}
              intensity={2.2}
              color="#38bdf8"
            />

            {/* Right Crisp Studio White Rim Light */}
            <directionalLight
              position={[6, 3.5, -2]}
              intensity={2.5}
              color="#ffffff"
            />

            {/* Front Nose & Wing Highlighting Spot */}
            <spotLight
              position={[0, 4, 6]}
              intensity={2.8}
              angle={0.65}
              penumbra={0.7}
              color="#ffffff"
            />

            {/* Rear Diffuser & Red Rain Light Accent */}
            <pointLight
              position={[0, 1.2, -3.2]}
              intensity={1.8}
              color="#ef4444"
              distance={6}
            />
          </>
        ) : (
          <>
            {/* White Studio Lighting */}
            <ambientLight intensity={0.9} />
            <directionalLight
              position={[7, 11, 6]}
              intensity={2.0}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={20}
              shadow-camera-left={-6}
              shadow-camera-right={6}
              shadow-camera-top={6}
              shadow-camera-bottom={-6}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[-6, 5, -7]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[0, 3, 7]} intensity={0.6} />
          </>
        )}

        {/* Reflective Ground Plane */}
        <Ground mode={studioMode} />

        {/* Car & Choreography Rig */}
        <CameraAndCarRig
          scrollProgress={scrollProgress}
          scrollProgressRef={scrollProgressRef}
          livery={livery}
          isFreeOrbit={isFreeOrbit}
        />

        {/* Free Orbit Controls */}
        {isFreeOrbit && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2.2}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        )}
      </Canvas>
    </div>
  );
});

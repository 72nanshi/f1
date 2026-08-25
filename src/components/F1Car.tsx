import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LiveryColor } from '../types';

interface F1CarProps {
  livery?: LiveryColor;
  wheelRotationRef?: React.MutableRefObject<number>;
  steerAngleRef?: React.MutableRefObject<number>;
  drsOpenRef?: React.MutableRefObject<boolean>;
  rainLightPulse?: boolean;
}

export const LIVERY_CONFIGS: Record<
  LiveryColor,
  {
    name: string;
    bodyColor: string;
    accentColor: string;
    carbonColor: string;
    haloColor: string;
    rimAccent: string;
    secondaryColor: string;
    glowAccent: string;
  }
> = {
  crimson: {
    name: 'Scuderia Corsa',
    bodyColor: '#d60000',
    accentColor: '#ffffff',
    carbonColor: '#0a0a0a',
    haloColor: '#171717',
    rimAccent: '#e10600',
    secondaryColor: '#1a1a1a',
    glowAccent: '#ff2200',
  },
  stealth: {
    name: 'Monolith Carbon',
    bodyColor: '#080809',
    accentColor: '#38bdf8',
    carbonColor: '#030304',
    haloColor: '#121214',
    rimAccent: '#38bdf8',
    secondaryColor: '#18181b',
    glowAccent: '#38bdf8',
  },
  silver: {
    name: 'Silver Arrow',
    bodyColor: '#d4d4d8',
    accentColor: '#00d2be',
    carbonColor: '#09090b',
    haloColor: '#18181b',
    rimAccent: '#00d2be',
    secondaryColor: '#09090b',
    glowAccent: '#00d2be',
  },
  pure: {
    name: 'Apex Gold & Pearl',
    bodyColor: '#fafafa',
    accentColor: '#eab308',
    carbonColor: '#09090b',
    haloColor: '#18181b',
    rimAccent: '#eab308',
    secondaryColor: '#18181b',
    glowAccent: '#eab308',
  },
  cyber: {
    name: 'Neon Cyberpunk',
    bodyColor: '#060814',
    accentColor: '#06b6d4',
    carbonColor: '#020408',
    haloColor: '#0f172a',
    rimAccent: '#f43f5e',
    secondaryColor: '#0f172a',
    glowAccent: '#06b6d4',
  },
};

export const F1Car: React.FC<F1CarProps> = ({
  livery = 'crimson',
  wheelRotationRef,
  steerAngleRef,
  drsOpenRef,
  rainLightPulse = true,
}) => {
  const config = LIVERY_CONFIGS[livery] || LIVERY_CONFIGS.crimson;

  // Animated sub-part refs
  const frontLeftWheelGroup = useRef<THREE.Group>(null);
  const frontRightWheelGroup = useRef<THREE.Group>(null);
  const rearLeftWheelMesh = useRef<THREE.Group>(null);
  const rearRightWheelMesh = useRef<THREE.Group>(null);
  const drsFlapRef = useRef<THREE.Group>(null);
  const rainLightMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const steeringRpmBarRef = useRef<THREE.Group>(null);

  // Wheel spinning meshes
  const flWheelMesh = useRef<THREE.Mesh>(null);
  const frWheelMesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const wheelRot = wheelRotationRef ? wheelRotationRef.current : 0;
    const steerAngle = steerAngleRef ? steerAngleRef.current : 0;
    const isDrs = drsOpenRef ? drsOpenRef.current : false;
    const clock = state.clock.getElapsedTime();

    // Rotate all 4 wheels
    if (flWheelMesh.current) flWheelMesh.current.rotation.x = wheelRot;
    if (frWheelMesh.current) frWheelMesh.current.rotation.x = wheelRot;
    if (rearLeftWheelMesh.current) rearLeftWheelMesh.current.rotation.x = wheelRot;
    if (rearRightWheelMesh.current) rearRightWheelMesh.current.rotation.x = wheelRot;

    // Steer front wheel assemblies
    if (frontLeftWheelGroup.current) frontLeftWheelGroup.current.rotation.y = steerAngle;
    if (frontRightWheelGroup.current) frontRightWheelGroup.current.rotation.y = steerAngle;

    // DRS flap actuation
    if (drsFlapRef.current) {
      const targetFlapRot = isDrs ? -0.42 : 0;
      drsFlapRef.current.rotation.x = THREE.MathUtils.lerp(
        drsFlapRef.current.rotation.x,
        targetFlapRot,
        0.2
      );
    }

    // Flashing FIA Red Rain Light
    if (rainLightMaterialRef.current && rainLightPulse) {
      const pulse = Math.sin(clock * 12) > 0 ? 3.5 : 0.8;
      rainLightMaterialRef.current.emissiveIntensity = pulse;
    }

    // Dynamic Steering Wheel RPM LED animation
    if (steeringRpmBarRef.current) {
      const rpmShift = (Math.sin(clock * 6) + 1) * 0.5;
      steeringRpmBarRef.current.scale.x = 0.4 + rpmShift * 0.6;
    }
  });

  // =========================================================================
  // HIGH-END AUTOMOTIVE MATERIALS (Clearcoat MeshPhysicalMaterial & Weaves)
  // =========================================================================

  // 1. Primary Body Glossy Paint: Ultra-deep clearcoat automotive lacquer with realistic specular reflection
  const bodyMaterial = useMemo(
    () => (
      <meshPhysicalMaterial
        color={config.bodyColor}
        roughness={0.16}
        metalness={0.25}
        clearcoat={1.0}
        clearcoatRoughness={0.06}
        reflectivity={1.0}
        ior={1.54}
      />
    ),
    [config.bodyColor]
  );

  // 2. Exposed Glossy Raw Carbon Fiber Monocoque / Aerodynamic Weaves
  const glossyCarbonMaterial = useMemo(
    () => (
      <meshPhysicalMaterial
        color={config.carbonColor}
        roughness={0.28}
        metalness={0.45}
        clearcoat={0.9}
        clearcoatRoughness={0.18}
        reflectivity={0.8}
      />
    ),
    [config.carbonColor]
  );

  // 3. Satin Carbon Fiber Weave for Halo, Floor edge, & Wing Endplates
  const satinCarbonMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={config.haloColor}
        roughness={0.35}
        metalness={0.7}
      />
    ),
    [config.haloColor]
  );

  // 4. Accent Livery Stripes & Aero Highlights
  const accentMaterial = useMemo(
    () => (
      <meshPhysicalMaterial
        color={config.accentColor}
        roughness={0.14}
        metalness={0.3}
        clearcoat={1.0}
        clearcoatRoughness={0.08}
      />
    ),
    [config.accentColor]
  );

  // 5. Open-Wheel Racing Tires: Matte high-grip rubber
  const tireMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color="#111113"
        roughness={0.88}
        metalness={0.08}
      />
    ),
    []
  );

  // 6. BBS Forged Magnesium Alloy Wheel Rims
  const rimMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color="#18181b"
        roughness={0.22}
        metalness={0.92}
      />
    ),
    []
  );

  // 7. Cockpit Cavity & Dark Intakes
  const darkCavityMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color="#030303"
        roughness={0.1}
        metalness={0.9}
      />
    ),
    []
  );

  // 8. Titanium Exhaust & Metallic Fittings
  const titaniumMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color="#3f3f46"
        roughness={0.2}
        metalness={0.95}
      />
    ),
    []
  );

  // 9. Brembo Painted Brake Caliper Material
  const caliperMaterial = useMemo(
    () => (
      <meshStandardMaterial
        color={config.rimAccent}
        roughness={0.2}
        metalness={0.8}
      />
    ),
    [config.rimAccent]
  );

  // =========================================================================
  // SUB-COMPONENT: WHEEL ASSEMBLY (Open-wheel with Inset Rims & Center Nut)
  // =========================================================================
  const WheelAssembly = ({
    isFront = false,
    isLeft = true,
  }: {
    isFront?: boolean;
    isLeft?: boolean;
  }) => {
    const tireRadius = 0.33;
    const tireWidth = isFront ? 0.28 : 0.35;
    const rimRadius = 0.21;
    const rimOffset = (tireWidth / 2) * (isLeft ? 1 : -1);

    return (
      <group>
        {/* Open-Wheel Rubber Tire Cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[tireRadius, tireRadius, tireWidth, 28]} />
          {tireMaterial}
        </mesh>

        {/* Pirelli P-Zero Sidewall Color Ring Stripe */}
        <mesh
          position={[rimOffset * 1.01, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <ringGeometry args={[tireRadius * 0.74, tireRadius * 0.81, 28]} />
          <meshBasicMaterial color={config.rimAccent} side={THREE.DoubleSide} />
        </mesh>

        {/* Outer Inset Rim Face */}
        <mesh
          position={[rimOffset * 0.95, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[rimRadius, rimRadius, 0.02, 24]} />
          {rimMaterial}
        </mesh>

        {/* BBS Multi-Spoke Center Geometry */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <mesh
            key={idx}
            position={[rimOffset * 0.97, 0, 0]}
            rotation={[0, 0, (angle * Math.PI) / 180]}
          >
            <boxGeometry args={[0.016, rimRadius * 1.6, 0.014]} />
            {rimMaterial}
          </mesh>
        ))}

        {/* Rim Outer Lip / Torus Inset Ring */}
        <mesh
          position={[rimOffset * 0.98, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[rimRadius * 0.92, 0.014, 8, 24]} />
          {rimMaterial}
        </mesh>

        {/* Center Magnesium Wheel Hub / Central Locking Nut */}
        <mesh
          position={[rimOffset * 1.06, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.048, 0.048, 0.038, 8]} />
          <meshStandardMaterial
            color="#e4e4e7"
            metalness={0.98}
            roughness={0.12}
          />
        </mesh>

        {/* Inner Carbon-Ceramic Perforated Brake Rotor Disk */}
        <mesh
          position={[rimOffset * -0.45, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.22, 0.22, 0.02, 20]} />
          <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.35} />
        </mesh>

        {/* Monobloc Brake Caliper (Brembo style with livery color) */}
        <mesh position={[rimOffset * -0.45, 0.12, 0.06]}>
          <boxGeometry args={[0.05, 0.1, 0.08]} />
          {caliperMaterial}
        </mesh>
      </group>
    );
  };

  return (
    <group name="f1-car-root" dispose={null}>
      {/* ===================================================================
          1. MONOCOQUE / CHASSIS / NOSE CONE (Aerodynamic Teardrop & Taper)
          =================================================================== */}

      {/* Main Cockpit Monocoque Tub (Sculpted survival cell) */}
      <mesh position={[0, 0.25, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.27, 2.1]} />
        {bodyMaterial}
      </mesh>

      {/* Forebody Transition Monocoque (Tapering forward with S-Duct channel) */}
      <mesh position={[0, 0.23, 1.4]} rotation={[-0.04, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.22, 0.75]} />
        {bodyMaterial}
      </mesh>

      {/* S-Duct Air Outlet on Top of Nose */}
      <mesh position={[0, 0.345, 1.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.015, 0.08]} />
        {darkCavityMaterial}
      </mesh>

      {/* Low Pointed Nose Cone (FIA Homologated Crash Structure) */}
      <group position={[0, 0.2, 2.05]}>
        {/* Tapered nose wedge */}
        <mesh rotation={[-0.09, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.16, 1.1]} />
          {bodyMaterial}
        </mesh>
        {/* Sharp nose apex tip (Carbon composite impact cone) */}
        <mesh position={[0, -0.065, 0.65]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.08, 0.35]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Central Livery Accent Stripe running down the nose */}
        <mesh position={[0, 0.082, 0.05]} rotation={[-0.09, 0, 0]}>
          <boxGeometry args={[0.07, 0.008, 1.2]} />
          {accentMaterial}
        </mesh>
        {/* Dual Nose Camera Mount Pods (FIA Regulation) */}
        <mesh position={[0.16, 0.04, 0.2]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.04, 0.03, 0.08]} />
          {satinCarbonMaterial}
        </mesh>
        <mesh position={[-0.16, 0.04, 0.2]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.04, 0.03, 0.08]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Pitot Tube & Telemetry Antenna Array */}
        <mesh position={[0, 0.17, -0.28]}>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
          {titaniumMaterial}
        </mesh>
        <mesh position={[0.04, 0.14, -0.24]}>
          <cylinderGeometry args={[0.003, 0.003, 0.12, 6]} />
          {titaniumMaterial}
        </mesh>
      </group>

      {/* Engine Cover & Dorsal Spine (Tapering toward rear gearbox) */}
      <mesh position={[0, 0.34, -0.75]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.28, 1.25]} />
        {bodyMaterial}
      </mesh>

      {/* Airbox Intake Pod atop cockpit / Roll Hoop */}
      <group position={[0, 0.53, -0.2]}>
        {/* Airbox Sculpted Intake Body */}
        <mesh rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.42]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Indented Airbox Intake Mouth */}
        <mesh position={[0, 0.01, 0.18]} rotation={[0.18, 0, 0]}>
          <boxGeometry args={[0.16, 0.14, 0.05]} />
          {darkCavityMaterial}
        </mesh>
        {/* On-Board Broadcast Camera (FIA T-Cam Pod in Yellow) */}
        <mesh position={[0, 0.16, -0.02]}>
          <boxGeometry args={[0.06, 0.04, 0.09]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Dorsal Shark Fin (Spine Stabilizer Aerofoil) */}
      <mesh position={[0, 0.54, -0.92]} castShadow>
        <boxGeometry args={[0.018, 0.28, 1.15]} />
        {glossyCarbonMaterial}
      </mesh>
      {/* Dorsal Fin Accent Edge */}
      <mesh position={[0, 0.68, -0.92]}>
        <boxGeometry args={[0.02, 0.016, 1.12]} />
        {accentMaterial}
      </mesh>

      {/* ===================================================================
          2. COCKPIT, DRIVER & HALO SAFETY BAR
          =================================================================== */}

      {/* Cockpit Indented Cavity */}
      <group position={[0, 0.34, 0.28]}>
        <mesh>
          <boxGeometry args={[0.36, 0.16, 0.65]} />
          {darkCavityMaterial}
        </mesh>

        {/* Headrest Protection Pads */}
        <mesh position={[0, 0.08, -0.16]}>
          <boxGeometry args={[0.3, 0.08, 0.18]} />
          {satinCarbonMaterial}
        </mesh>

        {/* F1 Steering Wheel with Digital Screen */}
        <mesh position={[0, 0.02, 0.24]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.19, 0.095, 0.02]} />
          <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Steering Screen Glow */}
        <mesh position={[0, 0.028, 0.23]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[0.075, 0.038]} />
          <meshBasicMaterial color={config.glowAccent} />
        </mesh>
        {/* Dynamic RPM LED Shift Lights Bar */}
        <group ref={steeringRpmBarRef} position={[0, 0.052, 0.225]} rotation={[0.3, 0, 0]}>
          <mesh>
            <planeGeometry args={[0.09, 0.01]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* Driver Helmet */}
      <group position={[0, 0.41, 0.2]}>
        {/* Helmet Outer Shell with Livery Accent */}
        <mesh castShadow>
          <sphereGeometry args={[0.105, 18, 18]} />
          {bodyMaterial}
        </mesh>
        {/* Tinted Iridium Gold/Blue Visor */}
        <mesh position={[0, 0.015, 0.072]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.14, 0.045, 0.075]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Helmet Top Aero Spoiler Winglet */}
        <mesh position={[0, 0.095, -0.04]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.09, 0.014, 0.05]} />
          {satinCarbonMaterial}
        </mesh>
      </group>

      {/* Halo Safety System (Titanium/Carbon Arc + Central Forward Pillar + Aero Fairing) */}
      <group position={[0, 0.44, 0.35]}>
        {/* Halo Curved Loop / Ring */}
        <mesh position={[0, 0.07, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.188, 0.024, 12, 24, Math.PI * 1.08]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Halo Aerodynamic Top Fairing Winglet */}
        <mesh position={[0, 0.094, 0.04]}>
          <boxGeometry args={[0.26, 0.01, 0.04]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Central Forward Halo Pillar (Angled from nose to top loop) */}
        <mesh position={[0, -0.06, 0.26]} rotation={[-0.32, 0, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.024, 0.24, 12]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Halo Rear Mounting Brackets */}
        <mesh position={[0.16, 0.02, -0.16]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.12, 8]} />
          {satinCarbonMaterial}
        </mesh>
        <mesh position={[-0.16, 0.02, -0.16]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.12, 8]} />
          {satinCarbonMaterial}
        </mesh>
      </group>

      {/* ===================================================================
          3. FRONT WING (Multi-layered Planes + Endplates + Diveplanes)
          =================================================================== */}
      <group position={[0, 0.11, 2.45]}>
        {/* Lower Mainplane Horizontal Ground-Effect Wing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.78, 0.024, 0.46]} />
          {glossyCarbonMaterial}
        </mesh>

        {/* Stacked Upper Cascade Flap 1 */}
        <mesh position={[0, 0.044, -0.06]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[1.70, 0.018, 0.28]} />
          {bodyMaterial}
        </mesh>

        {/* Stacked Upper Cascade Flap 2 (Top aerofoil with accent stripe) */}
        <mesh position={[0, 0.08, -0.11]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.60, 0.016, 0.18]} />
          {accentMaterial}
        </mesh>

        {/* Cascade Flap 3 Gurney Flap */}
        <mesh position={[0, 0.105, -0.16]} rotation={[-0.28, 0, 0]}>
          <boxGeometry args={[1.52, 0.014, 0.12]} />
          {glossyCarbonMaterial}
        </mesh>

        {/* Left Vertical Endplate (Satin carbon finish) */}
        <mesh position={[0.89, 0.07, 0]} castShadow>
          <boxGeometry args={[0.02, 0.19, 0.5]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Left Endplate Diveplane / Outer Vortex Generator */}
        <mesh position={[0.92, 0.09, -0.05]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.065, 0.012, 0.24]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Left Front Wheel Wake Deflector (Vertical Flow Conditioner) */}
        <mesh position={[0.84, 0.15, -0.22]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.014, 0.14, 0.18]} />
          {satinCarbonMaterial}
        </mesh>

        {/* Right Vertical Endplate */}
        <mesh position={[-0.89, 0.07, 0]} castShadow>
          <boxGeometry args={[0.02, 0.19, 0.5]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Right Endplate Diveplane */}
        <mesh position={[-0.92, 0.09, -0.05]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.065, 0.012, 0.24]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Right Front Wheel Wake Deflector */}
        <mesh position={[-0.84, 0.15, -0.22]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.014, 0.14, 0.18]} />
          {satinCarbonMaterial}
        </mesh>

        {/* Dual Nose Pylons / Mounting Struts */}
        <mesh position={[0.09, 0.04, -0.12]}>
          <boxGeometry args={[0.02, 0.1, 0.18]} />
          {glossyCarbonMaterial}
        </mesh>
        <mesh position={[-0.09, 0.04, -0.12]}>
          <boxGeometry args={[0.02, 0.1, 0.18]} />
          {glossyCarbonMaterial}
        </mesh>
      </group>

      {/* ===================================================================
          4. REAR WING (Swan-Neck Pylons + Endplates + Active DRS Flap)
          =================================================================== */}
      <group position={[0, 0.64, -1.92]}>
        {/* Dual Thin Swan-Neck Pylon Support Struts */}
        <mesh position={[0.1, -0.22, 0.12]} rotation={[-0.26, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.016, 0.38, 8]} />
          {glossyCarbonMaterial}
        </mesh>
        <mesh position={[-0.1, -0.22, 0.12]} rotation={[-0.26, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.016, 0.38, 8]} />
          {glossyCarbonMaterial}
        </mesh>

        {/* Lower Main Rear Wing Beam */}
        <mesh castShadow>
          <boxGeometry args={[1.26, 0.028, 0.34]} />
          {glossyCarbonMaterial}
        </mesh>

        {/* Dual-Tier Beam Wing Underneath Rear Wing */}
        <mesh position={[0, -0.18, 0.04]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.96, 0.018, 0.22]} />
          {glossyCarbonMaterial}
        </mesh>

        {/* Active DRS Upper Flap (Animated rotation on high speed) */}
        <group ref={drsFlapRef} position={[0, 0.08, -0.06]}>
          <mesh castShadow>
            <boxGeometry args={[1.24, 0.02, 0.24]} />
            {bodyMaterial}
          </mesh>
          {/* DRS Center Hydraulic Actuator Pod */}
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[0.06, 0.03, 0.12]} />
            {titaniumMaterial}
          </mesh>
        </group>

        {/* Left Rear Wing Vertical Endplate */}
        <mesh position={[0.63, -0.05, 0]} castShadow>
          <boxGeometry args={[0.024, 0.4, 0.48]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Left Endplate Louver Slots */}
        <mesh position={[0.63, 0.12, 0.05]}>
          <boxGeometry args={[0.028, 0.01, 0.22]} />
          {darkCavityMaterial}
        </mesh>

        {/* Right Rear Wing Vertical Endplate */}
        <mesh position={[-0.63, -0.05, 0]} castShadow>
          <boxGeometry args={[0.024, 0.4, 0.48]} />
          {satinCarbonMaterial}
        </mesh>
        {/* Right Endplate Louver Slots */}
        <mesh position={[-0.63, 0.12, 0.05]}>
          <boxGeometry args={[0.028, 0.01, 0.22]} />
          {darkCavityMaterial}
        </mesh>
      </group>

      {/* ===================================================================
          5. SIDEPODS & COOLING LOUVERS (Undercuts + Radiators + Downwash)
          =================================================================== */}

      {/* Left Sidepod (Radiator intake, cooling louvers & downwash bodywork) */}
      <group position={[0.44, 0.22, 0.08]}>
        {/* Main Tapered Sidepod Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.23, 1.45]} />
          {bodyMaterial}
        </mesh>
        {/* Indented Radiator Air Intake Mouth */}
        <mesh position={[0, 0.02, 0.73]} rotation={[-0.12, 0.18, 0]}>
          <boxGeometry args={[0.29, 0.18, 0.04]} />
          {darkCavityMaterial}
        </mesh>
        {/* Sidepod Undercut Channel */}
        <mesh position={[-0.06, -0.08, 0.2]}>
          <boxGeometry args={[0.18, 0.08, 0.9]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Livery Sidepod Accent Streak */}
        <mesh position={[0.176, 0, 0]}>
          <boxGeometry args={[0.01, 0.08, 1.15]} />
          {accentMaterial}
        </mesh>
        {/* Rearview Mirror Pod on Outboard Stalk */}
        <group position={[0.06, 0.18, 0.48]}>
          <mesh>
            <boxGeometry args={[0.12, 0.045, 0.05]} />
            {satinCarbonMaterial}
          </mesh>
          <mesh position={[0, 0, -0.026]}>
            <planeGeometry args={[0.1, 0.038]} />
            <meshStandardMaterial color="#ffffff" metalness={0.99} roughness={0.05} />
          </mesh>
          <mesh position={[-0.05, -0.08, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.006, 0.006, 0.16, 6]} />
            {glossyCarbonMaterial}
          </mesh>
        </group>
        {/* 6 Realistic Cooling Louver Slits along Sidepod Shoulder */}
        {[-0.2, -0.1, 0, 0.1, 0.2, 0.3].map((zPos, idx) => (
          <mesh key={idx} position={[0.04, 0.12, zPos]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.18, 0.008, 0.03]} />
            {darkCavityMaterial}
          </mesh>
        ))}
      </group>

      {/* Right Sidepod */}
      <group position={[-0.44, 0.22, 0.08]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.23, 1.45]} />
          {bodyMaterial}
        </mesh>
        {/* Indented Radiator Air Intake Mouth */}
        <mesh position={[0, 0.02, 0.73]} rotation={[-0.12, -0.18, 0]}>
          <boxGeometry args={[0.29, 0.18, 0.04]} />
          {darkCavityMaterial}
        </mesh>
        {/* Sidepod Undercut Channel */}
        <mesh position={[0.06, -0.08, 0.2]}>
          <boxGeometry args={[0.18, 0.08, 0.9]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Livery Sidepod Accent Streak */}
        <mesh position={[-0.176, 0, 0]}>
          <boxGeometry args={[0.01, 0.08, 1.15]} />
          {accentMaterial}
        </mesh>
        {/* Rearview Mirror Pod */}
        <group position={[-0.06, 0.18, 0.48]}>
          <mesh>
            <boxGeometry args={[0.12, 0.045, 0.05]} />
            {satinCarbonMaterial}
          </mesh>
          <mesh position={[0, 0, -0.026]}>
            <planeGeometry args={[0.1, 0.038]} />
            <meshStandardMaterial color="#ffffff" metalness={0.99} roughness={0.05} />
          </mesh>
          <mesh position={[0.05, -0.08, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.006, 0.006, 0.16, 6]} />
            {glossyCarbonMaterial}
          </mesh>
        </group>
        {/* Cooling Louvers */}
        {[-0.2, -0.1, 0, 0.1, 0.2, 0.3].map((zPos, idx) => (
          <mesh key={idx} position={[-0.04, 0.12, zPos]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.18, 0.008, 0.03]} />
            {darkCavityMaterial}
          </mesh>
        ))}
      </group>

      {/* ===================================================================
          6. UNDERBODY, VENTURI FLOORS & REAR DIFFUSER FINS
          =================================================================== */}

      {/* Wide Ground-Effect Carbon Floor Plan */}
      <mesh position={[0, 0.075, 0.08]} receiveShadow>
        <boxGeometry args={[1.4, 0.035, 2.95]} />
        {glossyCarbonMaterial}
      </mesh>

      {/* Floor Edge Winglets / Vortex Fences */}
      <mesh position={[0.69, 0.11, 0.3]} castShadow>
        <boxGeometry args={[0.02, 0.075, 1.5]} />
        {glossyCarbonMaterial}
      </mesh>
      <mesh position={[-0.69, 0.11, 0.3]} castShadow>
        <boxGeometry args={[0.02, 0.075, 1.5]} />
        {glossyCarbonMaterial}
      </mesh>
      {/* Floor Edge Metallic Stay Rods */}
      <mesh position={[0.64, 0.16, -0.2]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />
        {titaniumMaterial}
      </mesh>
      <mesh position={[-0.64, 0.16, -0.2]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />
        {titaniumMaterial}
      </mesh>

      {/* Angled Rear Diffuser (Fin-like Venturi geometry under rear of car) */}
      <group position={[0, 0.13, -1.58]} rotation={[0.22, 0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.94, 0.03, 0.6]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* 4 Vertical Diffuser Strakes / Fins */}
        {[-0.34, -0.11, 0.11, 0.34].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, -0.048, 0]}>
            <boxGeometry args={[0.015, 0.09, 0.58]} />
            {glossyCarbonMaterial}
          </mesh>
        ))}
      </group>

      {/* FIA Red Rain LED Light Cluster */}
      <group position={[0, 0.13, -1.96]}>
        {/* Black Light Enclosure */}
        <mesh>
          <boxGeometry args={[0.09, 0.06, 0.03]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Pulsing Emissive LED Diode Matrix */}
        <mesh position={[0, 0, -0.016]}>
          <planeGeometry args={[0.07, 0.045]} />
          <meshStandardMaterial
            ref={rainLightMaterialRef}
            color="#ef4444"
            emissive="#ff1e1e"
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Titanium Exhaust Tailpipes with Heat-Shielding Discoloration */}
      <group position={[0, 0.31, -1.62]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.044, 0.044, 0.18, 16, 1, true]} />
          <meshStandardMaterial
            color="#3f3f46"
            metalness={0.96}
            roughness={0.18}
          />
        </mesh>
        {/* Wastegate Outlets Flanking Main Exhaust */}
        <mesh position={[0.05, 0, -0.02]}>
          <cylinderGeometry args={[0.016, 0.016, 0.14, 12, 1, true]} />
          {titaniumMaterial}
        </mesh>
        <mesh position={[-0.05, 0, -0.02]}>
          <cylinderGeometry args={[0.016, 0.016, 0.14, 12, 1, true]} />
          {titaniumMaterial}
        </mesh>
      </group>

      {/* ===================================================================
          7. SUSPENSION WISHBONES & 4 OPEN-WHEEL CORNERS
          =================================================================== */}

      {/* Front Wishbone Carbon Arms (Push-rod / Pull-rod Geometry) */}
      <group position={[0, 0.21, 1.45]}>
        {/* Left upper & lower wishbones */}
        <mesh position={[0.43, 0.04, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.56, 0.016, 0.14]} />
          {glossyCarbonMaterial}
        </mesh>
        <mesh position={[0.43, -0.05, 0]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.56, 0.016, 0.14]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Left Push-rod diagonal arm */}
        <mesh position={[0.44, 0.02, 0.06]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.008, 0.008, 0.45, 6]} />
          {titaniumMaterial}
        </mesh>

        {/* Right upper & lower wishbones */}
        <mesh position={[-0.43, 0.04, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.56, 0.016, 0.14]} />
          {glossyCarbonMaterial}
        </mesh>
        <mesh position={[-0.43, -0.05, 0]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.56, 0.016, 0.14]} />
          {glossyCarbonMaterial}
        </mesh>
        {/* Right Push-rod diagonal arm */}
        <mesh position={[-0.44, 0.02, 0.06]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.008, 0.008, 0.45, 6]} />
          {titaniumMaterial}
        </mesh>
      </group>

      {/* FRONT LEFT WHEEL (Steers & Rotates) */}
      <group position={[0.82, 0.21, 1.45]} ref={frontLeftWheelGroup}>
        <group ref={flWheelMesh}>
          <WheelAssembly isFront={true} isLeft={true} />
        </group>
      </group>

      {/* FRONT RIGHT WHEEL (Steers & Rotates) */}
      <group position={[-0.82, 0.21, 1.45]} ref={frontRightWheelGroup}>
        <group ref={frWheelMesh}>
          <WheelAssembly isFront={true} isLeft={false} />
        </group>
      </group>

      {/* Rear Wishbone Arms */}
      <group position={[0, 0.23, -1.25]}>
        <mesh position={[0.46, 0.03, 0]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.54, 0.018, 0.18]} />
          {glossyCarbonMaterial}
        </mesh>
        <mesh position={[-0.46, 0.03, 0]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.54, 0.018, 0.18]} />
          {glossyCarbonMaterial}
        </mesh>
      </group>

      {/* REAR LEFT WHEEL (Rotates) */}
      <group position={[0.84, 0.21, -1.25]} ref={rearLeftWheelMesh}>
        <WheelAssembly isFront={false} isLeft={true} />
      </group>

      {/* REAR RIGHT WHEEL (Rotates) */}
      <group position={[-0.84, 0.21, -1.25]} ref={rearRightWheelMesh}>
        <WheelAssembly isFront={false} isLeft={false} />
      </group>
    </group>
  );
};

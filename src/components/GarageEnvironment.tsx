import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Lightformer } from '@react-three/drei';
import { StudioMode } from '../types';

interface GarageEnvironmentProps {
  mode: StudioMode;
  neonIntensity?: number;
}

export const GarageEnvironment: React.FC<GarageEnvironmentProps> = React.memo(({
  mode = 'dark-garage',
  neonIntensity = 1.0,
}) => {
  const neonPulseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (neonPulseRef.current && mode === 'dark-garage') {
      const clock = state.clock.getElapsedTime();
      const subtlePulse = 1.0 + Math.sin(clock * 2) * 0.05;
      neonPulseRef.current.scale.set(1, subtlePulse, 1);
    }
  });

  if (mode === 'white-studio') {
    return (
      <group>
        <Lightformer form="rect" intensity={4} position={[0, 5, -9]} scale={[10, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} position={[-5, 2, -1]} scale={[10, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} position={[5, 2, -1]} scale={[10, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2} position={[0, 5, 5]} scale={8} target={[0, 0, 0]} />
      </group>
    );
  }

  // High-Tech Dark Garage Studio with Overhead Neon Softbox Arrays
  return (
    <group name="garage-environment">
      {/* ===================================================================
          1. GPU LIGHTFORMER ENVIRONMENT EMITTERS (For realistic reflections)
          =================================================================== */}
      <group rotation={[-Math.PI / 4, 0, 0]}>
        {/* Overhead Dual Long Softbox Light Strips */}
        <Lightformer
          form="rect"
          intensity={6 * neonIntensity}
          position={[0, 7, 0]}
          scale={[2.2, 16, 1]}
          color="#ffffff"
          target={[0, 0, 0]}
        />
        {/* Left Side Cyan Neon Rim Lightformer */}
        <Lightformer
          form="rect"
          intensity={4 * neonIntensity}
          position={[-6, 3, 0]}
          scale={[1.5, 12, 1]}
          color="#38bdf8"
          target={[0, 0, 0]}
        />
        {/* Right Side Crisp White Lightformer */}
        <Lightformer
          form="rect"
          intensity={4 * neonIntensity}
          position={[6, 3, 0]}
          scale={[1.5, 12, 1]}
          color="#ffffff"
          target={[0, 0, 0]}
        />
        {/* Front Aero Wing Accent Softbox */}
        <Lightformer
          form="rect"
          intensity={3 * neonIntensity}
          position={[0, 3, 8]}
          scale={[8, 2, 1]}
          color="#ffffff"
          target={[0, 0, 0]}
        />
        {/* Rear Diffuser Accent Red Glow */}
        <Lightformer
          form="rect"
          intensity={2.5 * neonIntensity}
          position={[0, 2, -8]}
          scale={[6, 1.5, 1]}
          color="#ef4444"
          target={[0, 0, 0]}
        />
      </group>

      {/* ===================================================================
          2. VISIBLE 3D OVERHEAD NEON SOFTBOX GANTRIES & TRUSS FIXTURES
          =================================================================== */}
      <group position={[0, 5.2, 0]} ref={neonPulseRef}>
        {/* Main Central Overhead Neon Softbox Gantry */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.12, 8.5]} />
          <meshStandardMaterial color="#0c0d12" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing Neon Diffuser Panel (Pure 6500K Studio White) */}
        <mesh position={[0, -0.065, 0]}>
          <boxGeometry args={[1.65, 0.02, 8.3]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3.5 * neonIntensity}
            toneMapped={false}
          />
        </mesh>

        {/* Left Flanking Overhead Neon Light Tube (Ice Cyan) */}
        <group position={[-2.8, -0.4, 0]}>
          <mesh>
            <boxGeometry args={[0.2, 0.08, 9.0]} />
            <meshStandardMaterial color="#090a0f" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 8.8, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={4.2 * neonIntensity}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Right Flanking Overhead Neon Light Tube (Warm Motorsport Gold / White) */}
        <group position={[2.8, -0.4, 0]}>
          <mesh>
            <boxGeometry args={[0.2, 0.08, 9.0]} />
            <meshStandardMaterial color="#090a0f" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 8.8, 12]} />
            <meshStandardMaterial
              color="#f8fafc"
              emissive="#f8fafc"
              emissiveIntensity={3.8 * neonIntensity}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Gantry Steel Suspension Wires */}
        {[-3.5, 0, 3.5].map((z, idx) => (
          <group key={idx} position={[0, 1.2, z]}>
            <mesh position={[-0.8, 0, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 2.4, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.8, 0, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 2.4, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ===================================================================
          3. HIGH-TECH GARAGE ARCHITECTURAL WALLS & NEON HORIZON LINES
          =================================================================== */}
      <group position={[0, 0, -14]}>
        {/* Dark Brushed Carbon Wall */}
        <mesh position={[0, 4, 0]}>
          <planeGeometry args={[48, 12]} />
          <meshStandardMaterial color="#08090d" roughness={0.8} metalness={0.5} />
        </mesh>
        {/* High-Tech Horizontal Neon Edge Strip (Cyan) */}
        <mesh position={[0, 1.8, 0.05]}>
          <boxGeometry args={[36, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.5 * neonIntensity}
            toneMapped={false}
          />
        </mesh>
        {/* Lower Warning Red Accent Line */}
        <mesh position={[0, 0.4, 0.05]}>
          <boxGeometry args={[36, 0.025, 0.02]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.0 * neonIntensity}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
});

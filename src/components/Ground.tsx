import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { StudioMode } from '../types';

interface GroundProps {
  speedRef?: React.MutableRefObject<number>;
  mode?: StudioMode;
}

export const Ground: React.FC<GroundProps> = React.memo(({
  speedRef,
  mode = 'dark-garage',
}) => {
  const gridTextureOffset = useRef(0);
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((_, delta) => {
    const currentSpeed = speedRef ? speedRef.current : 0;
    if (currentSpeed > 0.05 && gridRef.current) {
      gridTextureOffset.current = (gridTextureOffset.current + delta * currentSpeed * 1.5) % 2;
      gridRef.current.position.z = gridTextureOffset.current - 1;
    }
  });

  const isDark = mode === 'dark-garage';

  return (
    <group position={[0, -0.12, 0]}>
      {/* High-performance baked soft contact shadow */}
      <ContactShadows
        position={[0, 0.005, 0.1]}
        opacity={isDark ? 0.85 : 0.42}
        scale={10}
        blur={2.0}
        far={3.5}
        resolution={512}
        frames={1}
        color={isDark ? '#000000' : '#0a0a0a'}
      />

      {/* Main Ground Plane: Glossy Reflective Epoxy in Dark Garage mode */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial
          color={isDark ? '#07080c' : '#ffffff'}
          roughness={isDark ? 0.22 : 0.9}
          metalness={isDark ? 0.7 : 0.02}
        />
      </mesh>

      {/* Technical Grid Lines */}
      <gridHelper
        ref={gridRef}
        args={[80, 40, isDark ? '#38bdf8' : '#000000', isDark ? '#1e293b' : '#e4e4e7']}
        position={[0, 0.002, 0]}
      />

      {/* Pit Stop Bay Parking Box Boundaries */}
      {isDark && (
        <group position={[0, 0.004, 0]}>
          {/* Left Laser Guidance Line (Ice Cyan) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, 0, 0]}>
            <planeGeometry args={[0.04, 18]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
          {/* Right Laser Guidance Line (Ice Cyan) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.4, 0, 0]}>
            <planeGeometry args={[0.04, 18]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
          {/* Front Pit Stop Box Stop Mark (Red) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3.2]}>
            <planeGeometry args={[3.6, 0.08]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.9} />
          </mesh>
          {/* Rear Wheel Alignment Mark (White) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.8]}>
            <planeGeometry args={[3.6, 0.04]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* Track Apex / Curb dashed guidelines for Light mode */}
      {!isDark &&
        [-2.8, 2.8].map((x, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.003, 0]}
          >
            <planeGeometry args={[0.04, 60]} />
            <meshBasicMaterial color="#e4e4e7" transparent opacity={0.6} />
          </mesh>
        ))}
    </group>
  );
});

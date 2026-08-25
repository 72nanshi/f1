import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SpeedEffectsProps {
  speedRef?: React.MutableRefObject<number>;
  activeRef?: React.MutableRefObject<boolean>;
}

export const SpeedEffects: React.FC<SpeedEffectsProps> = React.memo(({ speedRef, activeRef }) => {
  const lineCount = 45;
  const linesGroup = useRef<THREE.Group>(null);

  // Generate initial random aerodynamic speed lines
  const initialLines = useMemo(() => {
    return Array.from({ length: lineCount }, () => ({
      x: (Math.random() - 0.5) * 6,
      y: 0.1 + Math.random() * 1.8,
      z: (Math.random() - 0.5) * 16,
      length: 1.5 + Math.random() * 3.5,
      speedMultiplier: 0.8 + Math.random() * 0.6,
      isAccent: Math.random() > 0.8,
    }));
  }, []);

  const linesData = useRef(initialLines);

  useFrame((_, delta) => {
    if (!linesGroup.current) return;
    const currentSpeed = speedRef ? speedRef.current : 0;
    const isActive = activeRef ? activeRef.current : currentSpeed > 0.1;

    linesGroup.current.visible = isActive || currentSpeed > 0.15;
    if (!linesGroup.current.visible) return;

    // Animate lines rushing backwards to create high-velocity sensation
    linesGroup.current.children.forEach((child, i) => {
      const data = linesData.current[i];
      if (!data) return;

      const zDelta = (currentSpeed * 2.8 + 2.0) * data.speedMultiplier * delta * 10;
      child.position.z -= zDelta;

      if (child.position.z < -10) {
        child.position.z = 10 + Math.random() * 4;
        child.position.x = (Math.random() - 0.5) * 5;
        child.position.y = 0.1 + Math.random() * 1.6;
      }
    });
  });

  return (
    <group ref={linesGroup} visible={false}>
      {linesData.current.map((line, idx) => (
        <mesh
          key={idx}
          position={[line.x, line.y, line.z]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[0.015, 0.015, line.length]} />
          <meshBasicMaterial
            color={line.isAccent ? '#e10600' : '#18181b'}
            transparent
            opacity={line.isAccent ? 0.85 : 0.35}
          />
        </mesh>
      ))}
    </group>
  );
});

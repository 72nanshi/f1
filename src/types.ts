export type LiveryColor = 'crimson' | 'stealth' | 'silver' | 'pure' | 'cyber';
export type StudioMode = 'dark-garage' | 'white-studio';

export interface LiveryTheme {
  id: LiveryColor;
  name: string;
  primary: string;
  accent: string;
  carbon: string;
  metallic: number;
  roughness: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface CarTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  wheelRotation: number;
  steerAngle: number;
  speed: number;
}

export interface TelemetryData {
  speedKmh: number;
  gear: number;
  rpm: number;
  drsActive: boolean;
  downforceKg: number;
  gForce: number;
  throttle: number;
  brake: number;
}

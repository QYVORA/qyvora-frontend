import * as THREE from 'three';

export interface Ping {
  ring: THREE.Mesh;
  glow: THREE.Mesh;
  phase: number;
  isHome: boolean;
}

export interface Arc {
  geo: THREE.BufferGeometry;
  progress: number;
  speed: number;
}

export interface Satellite {
  dot: THREE.Mesh;
  trailLine: THREE.Line;
  trailPts: THREE.Vector3[];
  trailHead: number;
  radius: number;
  incl: number;
  speed: number;
  phase: number;
}

export interface Label {
  div: HTMLDivElement;
  pos: THREE.Vector3;
}

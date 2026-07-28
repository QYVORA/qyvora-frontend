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

export interface Label {
  div: HTMLDivElement;
  pos: THREE.Vector3;
}

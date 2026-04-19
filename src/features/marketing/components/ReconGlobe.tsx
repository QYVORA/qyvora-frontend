import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ReconGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Globe
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x88AD7C, // var(--accent)
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Points (simulated recon targets)
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 100;
    const pointsPos = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointsCount);
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;
      pointsPos[i * 3] = Math.cos(theta) * Math.sin(phi);
      pointsPos[i * 3 + 1] = Math.sin(theta) * Math.sin(phi);
      pointsPos[i * 3 + 2] = Math.cos(phi);
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x88AD7C,
      size: 0.02,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    const currentMount = mountRef.current;
    return () => {
      currentMount?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ReconGlobe;

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameEngine } from '../game/GameEngine';

interface Props {
  engine: GameEngine;
}

export const CanvasContainer: React.FC<Props> = ({ engine }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    let lastTime = performance.now();
    let animFrameId: number;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      engine.update(dt);
      renderer.render(engine.scene, engine.camera);

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      engine.camera.aspect = window.innerWidth / window.innerHeight;
      engine.camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [engine]);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }} />;
};

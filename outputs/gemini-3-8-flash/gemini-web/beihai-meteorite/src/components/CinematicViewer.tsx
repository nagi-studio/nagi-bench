import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SpaceStation } from '../scene/SpaceStation';
import { SniperScene } from '../scene/SniperScene';
import { MeteoriteBulletManager } from '../scene/MeteoriteBullet';
import { DirectorCamera, CameraMode } from '../scene/DirectorCamera';
import { soundEngine } from '../audio/SoundEffects';

interface CinematicViewerProps {
  progress: number;
  cameraMode: CameraMode;
  onCameraChange?: (mode: CameraMode) => void;
}

export const CinematicViewer: React.FC<CinematicViewerProps> = ({
  progress,
  cameraMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const cameraModeRef = useRef(cameraMode);

  progressRef.current = progress;
  cameraModeRef.current = cameraMode;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.0003);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Director Camera Controller
    const directorCam = new DirectorCamera(width / height);

    // High-Density Starfield
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1200 + Math.random() * 800;

      starPositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.8) {
        starColors[i * 3 + 0] = 0.7; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1.0; // Blue star
      } else if (tint > 0.6) {
        starColors[i * 3 + 0] = 1.0; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 0.7; // Warm star
      } else {
        starColors[i * 3 + 0] = 0.9; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 0.9; // White
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Space Lighting
    // Distant Cold Sun (Primary directional sunlight)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(400, 300, 500);
    scene.add(sunLight);

    // Ambient Starlight
    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.4);
    scene.add(ambientLight);

    // Earth Albedo Bounce Light (Cyan-blue upward fill)
    const earthBounceLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    earthBounceLight.position.set(0, -500, 0);
    scene.add(earthBounceLight);

    // Scene Objects
    const spaceStation = new SpaceStation();
    scene.add(spaceStation.group);

    const sniperScene = new SniperScene();
    scene.add(sniperScene.group);

    const bulletManager = new MeteoriteBulletManager();
    scene.add(bulletManager.group);

    // Initialize bullets trajectory from sniper rifle muzzle to station conference dome
    const targetCenter = new THREE.Vector3(0, 50, 0);
    bulletManager.initBullets(sniperScene.muzzlePoint, targetCenter);

    // Audio trigger tracking flags
    let shotAudioPlayed = false;
    let impactAudioPlayed = false;
    let thrusterAudioPlayed = false;
    let holeCreated = false;

    // Animation Loop
    let lastTime = performance.now();
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const p = progressRef.current;

      // Update camera mode
      directorCam.cameraMode = cameraModeRef.current;

      // Determine shot and bullet trajectory progress
      // Bullet travels between p = 0.48 and p = 0.68
      let bulletProgress = -1;
      const isShotFired = p >= 0.48;
      const isImpacted = p >= 0.68;
      const isDecompressing = p >= 0.68 && p <= 0.95;

      if (p >= 0.48 && p <= 0.72) {
        bulletProgress = (p - 0.48) / 0.20; // 0.0 at launch, 1.0 at impact
      } else if (p > 0.72) {
        bulletProgress = 1.2; // Exited through hull
      }

      // Audio and event triggers
      if (p >= 0.48 && !shotAudioPlayed) {
        soundEngine.playSilentShot();
        shotAudioPlayed = true;
      } else if (p < 0.46) {
        shotAudioPlayed = false;
      }

      if (isImpacted) {
        if (!impactAudioPlayed) {
          soundEngine.playKineticImpact();
          directorCam.triggerImpactShake(1.4);
          bulletManager.triggerImpactExplosion(targetCenter);
          impactAudioPlayed = true;
        }
        if (!holeCreated) {
          // Punch kinetic entry hole on the station dome
          spaceStation.addImpactHole(
            new THREE.Vector3(0, 52, 12),
            new THREE.Vector3(0, 0.1, 1).normalize()
          );
          holeCreated = true;
        }
      } else {
        impactAudioPlayed = false;
        holeCreated = false;
        bulletManager.reset();
      }

      if (p >= 0.88 && !thrusterAudioPlayed) {
        soundEngine.playThrusterPuff();
        sniperScene.fireThrusterPuff();
        thrusterAudioPlayed = true;
      } else if (p < 0.86) {
        thrusterAudioPlayed = false;
      }

      // Update sub-scenes
      spaceStation.update(now * 0.001, isDecompressing);
      sniperScene.update(now * 0.001, p >= 0.35 && p <= 0.55);
      bulletManager.update(bulletProgress, deltaTime);

      // Get primary bullet position for camera tracking
      const activeBulletPos = (bulletManager.bullets.length > 0 && bulletProgress >= 0)
        ? bulletManager.bullets[0].mesh.position
        : undefined;

      // Update Director Camera
      directorCam.update(
        p,
        deltaTime,
        targetCenter,
        sniperScene.zhangBeihaiPos,
        sniperScene.muzzlePoint,
        activeBulletPos
      );

      renderer.render(scene, directorCam.camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      directorCam.updateAspect(w / h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#020617'
      }}
    />
  );
};

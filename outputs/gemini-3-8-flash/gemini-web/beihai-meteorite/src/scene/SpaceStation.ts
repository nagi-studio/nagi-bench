import * as THREE from 'three';

export interface StationImpactHole {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  mesh: THREE.Mesh;
}

export class SpaceStation {
  public group: THREE.Group;
  public conferenceDome: THREE.Group;
  public targetCenter: THREE.Vector3;
  public earthMesh: THREE.Mesh;
  public cloudsMesh: THREE.Mesh;
  public elevatorCable: THREE.Line;
  public impactHoles: StationImpactHole[] = [];
  public alarmLight: THREE.PointLight;
  public interiorLight: THREE.PointLight;
  public isDecompressing: boolean = false;
  
  private beaconLights: THREE.Mesh[] = [];
  private hologramRocket: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.conferenceDome = new THREE.Group();
    this.targetCenter = new THREE.Vector3(0, 50, 0);

    // Earth in the distant background
    const earthRadius = 600;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    
    // Procedural Earth surface canvas texture
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext('2d')!;
    
    // Deep ocean
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#021028');
    gradient.addColorStop(0.5, '#0b3060');
    gradient.addColorStop(1, '#021028');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Continents
    ctx.fillStyle = '#1c3d2b';
    ctx.beginPath();
    // Rough landmasses
    for (let i = 0; i < 35; i++) {
      const cx = (i * 37) % 1024;
      const cy = 100 + (i * 29) % 312;
      const r = 40 + (i * 13) % 70;
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Atmospheric swirls
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc((i * 61) % 1024, 80 + (i * 23) % 350, 60 + (i * 17) % 80, 0, Math.PI * 2);
      ctx.fill();
    }

    const earthTex = new THREE.CanvasTexture(earthCanvas);
    earthTex.wrapS = THREE.RepeatWrapping;
    earthTex.wrapT = THREE.ClampToEdgeWrapping;

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.7,
      metalness: 0.1,
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthMesh.position.set(0, -900, -500);
    this.group.add(this.earthMesh);

    // Atmosphere rim glow
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.025, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    this.earthMesh.add(atmoMesh);

    // Earth Clouds Layer
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.01, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    this.earthMesh.add(this.cloudsMesh);

    // Space Elevator Carbon Nanotube Cable
    const cablePoints = [
      new THREE.Vector3(0, 300, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -900, -500)
    ];
    const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePoints);
    const cableMat = new THREE.LineBasicMaterial({ color: 0x475569, linewidth: 2 });
    this.elevatorCable = new THREE.Line(cableGeo, cableMat);
    this.group.add(this.elevatorCable);

    // Elevator Tether Ring Markers
    for (let y = -200; y < 200; y += 40) {
      const ringGeo = new THREE.TorusGeometry(3, 0.4, 8, 24);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, y, 0);
      this.group.add(ring);
    }

    // Build the Terminal Space Station Core
    this.buildStationCore();
    this.buildConferenceDome();
    this.buildSolarArrays();
    this.buildDockingSpindles();

    // Alarm light setup
    this.alarmLight = new THREE.PointLight(0xff0033, 0, 80);
    this.alarmLight.position.set(0, 50, 0);
    this.group.add(this.alarmLight);

    this.interiorLight = new THREE.PointLight(0x38bdf8, 2.5, 60);
    this.interiorLight.position.set(0, 48, 0);
    this.group.add(this.interiorLight);
  }

  private buildStationCore(): void {
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.75,
      roughness: 0.35,
    });
    const darkHullMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.85,
      roughness: 0.4,
    });

    // Central Spindle Hub
    const hubGeo = new THREE.CylinderGeometry(14, 16, 90, 32);
    const hubMesh = new THREE.Mesh(hubGeo, coreMat);
    hubMesh.position.set(0, 30, 0);
    this.group.add(hubMesh);

    // Rotating Outer Habitation Torus (Gravity Ring)
    const torusGeo = new THREE.TorusGeometry(65, 8, 16, 64);
    const torusMesh = new THREE.Mesh(torusGeo, coreMat);
    torusMesh.rotation.x = Math.PI / 2;
    torusMesh.position.set(0, 20, 0);
    this.group.add(torusMesh);

    // Windows on the Torus Ring
    const windowGeo = new THREE.TorusGeometry(65, 8.1, 8, 32, Math.PI * 2);
    const windowMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const torusWindows = new THREE.Mesh(windowGeo, windowMat);
    torusWindows.rotation.x = Math.PI / 2;
    torusWindows.position.set(0, 20, 0);
    this.group.add(torusWindows);

    // Spokes connecting hub to torus
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const spokeGeo = new THREE.CylinderGeometry(2, 2, 58, 12);
      const spoke = new THREE.Mesh(spokeGeo, darkHullMat);
      spoke.position.set(Math.cos(angle) * 32, 20, Math.sin(angle) * 32);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = -angle;
      this.group.add(spoke);
    }

    // Industrial Truss Structures
    for (let i = 0; i < 4; i++) {
      const trussGeo = new THREE.BoxGeometry(4, 70, 4);
      const trussMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        wireframe: true,
      });
      const truss = new THREE.Mesh(trussGeo, trussMat);
      const angle = (i * Math.PI * 2) / 4;
      truss.position.set(Math.cos(angle) * 18, 30, Math.sin(angle) * 18);
      this.group.add(truss);
    }

    // Communication Antennas and Sensor Arrays
    const dishGeo = new THREE.SphereGeometry(7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(16, 70, 10);
    dish.rotation.x = -Math.PI / 3;
    dish.rotation.y = Math.PI / 4;
    this.group.add(dish);

    // Blinking navigation beacon lights
    const beaconColors = [0xef4444, 0x22c55e, 0xef4444, 0x3b82f6];
    const beaconCoords = [
      [75, 20, 0],
      [-75, 20, 0],
      [0, 20, 75],
      [0, 20, -75]
    ];
    beaconCoords.forEach((coord, index) => {
      const lightMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: beaconColors[index] })
      );
      lightMesh.position.set(coord[0], coord[1], coord[2]);
      this.group.add(lightMesh);
      this.beaconLights.push(lightMesh);
    });
  }

  private buildConferenceDome(): void {
    // The key story location: Top VIP Observation & Strategy Conference Module
    this.conferenceDome.position.set(0, 50, 0);

    // Outer Pressure Shell (Reinforced Titanium & Aerogel composite)
    const baseGeo = new THREE.CylinderGeometry(15, 14, 12, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -3, 0);
    this.conferenceDome.add(base);

    // Double-glazed Transparent Observation Panoramic Viewport
    const glassGeo = new THREE.SphereGeometry(13.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.3);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.32,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      reflectivity: 0.8
    });
    const glassDome = new THREE.Mesh(glassGeo, glassMat);
    this.conferenceDome.add(glassDome);

    // Interior Structural Ribs / Window Frames
    const frameGeo = new THREE.SphereGeometry(14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.3);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      wireframe: true,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    this.conferenceDome.add(frameMesh);

    // Interior: Conference Table
    const tableGeo = new THREE.CylinderGeometry(6, 6, 1.2, 24);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.5
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 1, 0);
    this.conferenceDome.add(table);

    // Conference holographic display: Chemical Rocket model (Aerospace Conservatives' dead-end)
    this.hologramRocket = new THREE.Group();
    const rocketStage1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.9, 3.5, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.8 })
    );
    const rocketStage2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.7, 2.5, 12),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.8 })
    );
    rocketStage2.position.set(0, 3, 0);
    const rocketFairing = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 1.8, 12),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.9 })
    );
    rocketFairing.position.set(0, 5.1, 0);

    // 4 strap-on chemical boosters
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const booster = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 2.8, 8),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.7 })
      );
      booster.position.set(Math.cos(angle) * 1.1, -0.4, Math.sin(angle) * 1.1);
      this.hologramRocket.add(booster);
    }

    this.hologramRocket.add(rocketStage1);
    this.hologramRocket.add(rocketStage2);
    this.hologramRocket.add(rocketFairing);
    this.hologramRocket.position.set(0, 2.5, 0);
    this.hologramRocket.scale.set(0.6, 0.6, 0.6);
    this.conferenceDome.add(this.hologramRocket);

    // Hologram circular pedestal light ring
    const holoRingGeo = new THREE.RingGeometry(1.8, 2.2, 24);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = Math.PI / 2;
    holoRing.position.set(0, 1.7, 0);
    this.conferenceDome.add(holoRing);

    // Conservative Aerospace Delegates (Silhouettes around table)
    const delegateMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const delegate = new THREE.Group();
      
      // Torso & head
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.6), delegateMat);
      torso.position.set(0, 1.8, 0);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), delegateMat);
      head.position.set(0, 2.7, 0);
      
      delegate.add(torso);
      delegate.add(head);
      delegate.position.set(Math.cos(angle) * 4.2, 0, Math.sin(angle) * 4.2);
      delegate.lookAt(0, 1.8, 0);
      this.conferenceDome.add(delegate);
    }

    this.group.add(this.conferenceDome);
  }

  private buildSolarArrays(): void {
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.9,
      roughness: 0.15,
      side: THREE.DoubleSide
    });
    const panelGridMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    // Left and right solar array wings
    [-1, 1].forEach((dir) => {
      const boomGeo = new THREE.CylinderGeometry(0.8, 0.8, 70, 8);
      const boomMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
      const boom = new THREE.Mesh(boomGeo, boomMat);
      boom.rotation.z = Math.PI / 2;
      boom.position.set(dir * 55, 30, 0);
      this.group.add(boom);

      // Multiple solar panels per wing
      for (let p = 0; p < 4; p++) {
        const panelGroup = new THREE.Group();
        const panelMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 22), panelMat);
        const gridMesh = new THREE.Mesh(new THREE.BoxGeometry(16.1, 0.45, 22.1), panelGridMat);
        panelGroup.add(panelMesh);
        panelGroup.add(gridMesh);

        panelGroup.position.set(dir * (35 + p * 18), 30, 0);
        panelGroup.rotation.x = Math.PI / 6;
        this.group.add(panelGroup);
      }
    });
  }

  private buildDockingSpindles(): void {
    // Docked aerospace shuttles at lower docking nodes
    const shuttleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.6,
      roughness: 0.4
    });

    for (let i = 0; i < 2; i++) {
      const angle = (i * Math.PI) + Math.PI / 4;
      const shuttle = new THREE.Group();
      
      const body = new THREE.Mesh(new THREE.ConeGeometry(3, 14, 8), shuttleMat);
      body.rotation.z = Math.PI / 2;
      shuttle.add(body);

      const wings = new THREE.Mesh(new THREE.BoxGeometry(1, 14, 0.5), shuttleMat);
      shuttle.add(wings);

      shuttle.position.set(Math.cos(angle) * 28, -5, Math.sin(angle) * 28);
      shuttle.lookAt(0, -5, 0);
      this.group.add(shuttle);
    }
  }

  public addImpactHole(worldPos: THREE.Vector3, normal: THREE.Vector3): void {
    // Create dual-hull puncture decal with molten kinetic glow rim
    const localPos = this.conferenceDome.worldToLocal(worldPos.clone());
    
    const holeGeo = new THREE.RingGeometry(0.15, 0.9, 16);
    const holeMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      side: THREE.DoubleSide
    });
    const holeMesh = new THREE.Mesh(holeGeo, holeMat);
    holeMesh.position.copy(localPos);
    holeMesh.lookAt(localPos.clone().add(normal));
    this.conferenceDome.add(holeMesh);

    // Inner dark void
    const voidMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.35, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
    );
    voidMesh.position.copy(localPos);
    voidMesh.lookAt(localPos.clone().add(normal));
    this.conferenceDome.add(voidMesh);

    this.impactHoles.push({
      position: worldPos,
      normal,
      mesh: holeMesh
    });
  }

  public update(time: number, isDecompressed: boolean): void {
    // Rotate clouds gently around Earth
    this.cloudsMesh.rotation.y = time * 0.005;
    this.earthMesh.rotation.y = time * 0.002;

    // Rotate holographic rocket at conference table
    if (this.hologramRocket) {
      this.hologramRocket.rotation.y = time * 0.8;
    }

    // Beacon blink animation
    const blink = Math.sin(time * 4) > 0.3;
    this.beaconLights.forEach((beacon, i) => {
      beacon.visible = (i % 2 === 0) ? blink : !blink;
    });

    // Decompression emergency alarms
    this.isDecompressing = isDecompressed;
    if (this.isDecompressing) {
      // Rapid red pulsing alarm light
      const alarmFlash = (Math.sin(time * 12) + 1) * 0.5;
      this.alarmLight.intensity = alarmFlash * 8;
      this.interiorLight.color.setHex(0xff1100);
      this.interiorLight.intensity = 1.5 + alarmFlash * 2;
    } else {
      this.alarmLight.intensity = 0;
      this.interiorLight.color.setHex(0x38bdf8);
      this.interiorLight.intensity = 2.5;
    }
  }
}

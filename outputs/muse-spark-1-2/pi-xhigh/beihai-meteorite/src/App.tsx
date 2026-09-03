// @ts-nocheck - Vite subproject; tsc runs after npm install in bench sandbox
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CUES, SHOTS, TOTAL, cueAt, shotAt } from './film/cues';
import { figure, house, lighthouse, boat, meteorite } from './film/voxel';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const timeRef = useRef(0);
  const playingRef = useRef(true);
  const audioRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // keep refs in sync
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { timeRef.current = t; }, [t]);

  // audio helpers - Web Audio procedural, no external files
  function ensureAudio() {
    if (audioRef.current) return audioRef.current;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const g = ctx.createGain(); g.gain.value = muted ? 0 : 0.22; g.connect(ctx.destination);
    audioRef.current = ctx; gainRef.current = g; return ctx;
  }
  function tone(freq:number, dur:number, type: OscillatorType='sine', gain=0.18, slideTo?:number) {
    if (muted) return;
    const ctx = ensureAudio(); const o = ctx.createOscillator(); const gn = ctx.createGain();
    o.type = type; o.frequency.value = freq; if (slideTo) o.frequency.linearRampToValueAtTime(slideTo, ctx.currentTime+dur*0.7);
    gn.gain.value = 0; gn.gain.linearRampToValueAtTime(gain, ctx.currentTime+0.02); gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+dur);
    o.connect(gn); gn.connect(gainRef.current!); o.start(); o.stop(ctx.currentTime+dur+0.05);
  }
  function noiseBurst(dur:number, gain=0.22, hp=800) {
    if (muted) return;
    const ctx = ensureAudio(); const len = Math.floor(ctx.sampleRate*dur); const buf = ctx.createBuffer(1,len,ctx.sampleRate); const d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len) ** 2;
    const src=ctx.createBufferSource(); src.buffer=buf; const f=ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp;
    const gn=ctx.createGain(); gn.gain.value=gain; src.connect(f); f.connect(gn); gn.connect(gainRef.current!); src.start();
  }
  function playCueSound(id:string) {
    if (id==='c01') { tone(420,0.12,'square',0.08); setTimeout(()=>tone(620,0.08,'sine',0.06),120); noiseBurst(0.6,0.06,1200); }
    if (id==='c02' || id==='c05') tone(180,0.4,'sine',0.06);
    if (id==='c04') { tone(260,0.3,'triangle',0.07); }
    if (id==='c07' || id==='c08') { tone(900,0.08,'square',0.07); tone(1200,0.06,'sine',0.05); }
    if (id==='c10') { tone(520,0.5,'square',0.12); setTimeout(()=>tone(520,0.5,'square',0.12),600); }
  }

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.Fog(0x060a14, 28, 72);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // lights
    const hemi = new THREE.HemisphereLight(0x9fb4ff, 0x0a0a12, 0.7); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d0, 1.1); sun.position.set(14, 18, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048); scene.add(sun);
    const moon = new THREE.DirectionalLight(0x8fb4ff, 0.5); moon.position.set(-12, 16, -8); scene.add(moon);
    const fill = new THREE.PointLight(0xff9a3c, 0, 30); fill.position.set(0, 2, 0); scene.add(fill);

    // sky dome
    const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 24, 16), new THREE.MeshBasicMaterial({ color: 0x0a1022, side: THREE.BackSide })); scene.add(sky);
    // stars
    const starG = new THREE.Group();
    for (let i=0;i<90;i++) {
      const s=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,6), new THREE.MeshBasicMaterial({color:0xffffff})); const a=Math.random()*Math.PI*2, r= 38+Math.random()*40, y=14+Math.random()*26;
      s.position.set(Math.cos(a)*r, y, Math.sin(a)*r); s.material.transparent=true; s.material.opacity=0.5+Math.random()*0.5; starG.add(s);
    }
    scene.add(starG);

    // sea
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshLambertMaterial({ color: 0x0e2a4a }));
    sea.rotation.x=-Math.PI/2; sea.position.y=-0.02; scene.add(sea);
    const sea2 = new THREE.Mesh(new THREE.PlaneGeometry(140,140), new THREE.MeshBasicMaterial({ color:0x1a4a7a, transparent:true, opacity:0.12})); sea2.rotation.x=-Math.PI/2; sea2.position.y=0.02; scene.add(sea2);

    // village ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), new THREE.MeshLambertMaterial({ color:0x3a352a })); ground.rotation.x=-Math.PI/2; ground.position.set(-8,0.01,6); ground.receiveShadow=true; scene.add(ground);
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(28, 10), new THREE.MeshLambertMaterial({ color:0x8a7a5a })); sand.rotation.x=-Math.PI/2; sand.position.set(-2,0.02, -1.5); scene.add(sand);

    // houses
    const village = new THREE.Group(); scene.add(village);
    house(village, -12, 8, 0xe8e0c8, 0x8a3a2a, true);
    house(village, -6, 11, 0xd8d0b8, 0x7a2a1a, false);
    house(village, -14, 3, 0xe0d8c0, 0x9a4a3a, true);
    // lighthouse
    const lh = lighthouse(scene, 6, 10);
    // island (appears after meteor)
    const island = new THREE.Group(); island.position.set(18, -0.4, -18); scene.add(island);
    const islandBase = new THREE.Mesh(new THREE.CylinderGeometry(6,7,1.2,12), new THREE.MeshLambertMaterial({color:0x4a3a2a})); islandBase.position.y=0.2; island.add(islandBase);
    const islandTop = new THREE.Mesh(new THREE.CylinderGeometry(5,6,0.6,12), new THREE.MeshLambertMaterial({color:0x6a5a3a})); islandTop.position.y=0.9; island.add(islandTop);
    for(let i=0;i<10;i++){ const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(0.4+Math.random()*0.4,0), new THREE.MeshLambertMaterial({color:0x3a3530})); rock.position.set((Math.random()-0.5)*8,0.9+Math.random()*0.5,(Math.random()-0.5)*8); island.add(rock); }
    island.visible=false;

    // meteor
    const meteorG = new THREE.Group(); scene.add(meteorG);
    const meteor = new THREE.Mesh(new THREE.SphereGeometry(0.9,10,10), new THREE.MeshBasicMaterial({color:0xff9a3c})); meteorG.add(meteor);
    const trail = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.45,6,8), new THREE.MeshBasicMaterial({color:0xff6a2a, transparent:true, opacity:0.6})); trail.rotation.x=Math.PI/2; trail.position.z=-3; meteorG.add(trail);
    const mLight = new THREE.PointLight(0xff6a2a, 0, 28); meteorG.add(mLight); meteorG.visible=false;

    // meteorite on island
    const metOnIsland = meteorite(island, 1.2); metOnIsland.g.position.set(0,1.7,0); metOnIsland.g.visible=false;

    // figures
    const figA = figure(0x4a5a8a, 0xd8b08c, 0x4a3a2a); figA.g.position.set(-8,0,7); figA.g.rotation.y=0.6; scene.add(figA.g);
    const figB = figure(0x8a3a3a, 0xd8b08c); figB.g.position.set(-10,0,9); figB.g.rotation.y=-0.4; scene.add(figB.g);
    const figC = figure(0x5a6a3a, 0xd8b08c, 0x2a4a6a); figC.g.position.set(-12,0,6.5); figC.g.rotation.y=1.1; scene.add(figC.g);
    const atang = figure(0xc84a3a, 0xd8b08c); atang.g.position.set(-7,0,8); scene.add(atang.g);

    // boat
    const ship = boat(scene); ship.position.set(-4,0.15, -0.5); ship.visible=false;

    // camera paths per shot
    function camFor(shotId:string, prog:number, time:number) {
      // prog 0..1 within shot
      if (shotId==='s1') { camera.position.set(0, 14+Math.sin(time*0.2)*0.6, 22); camera.lookAt(0,3,0); }
      else if (shotId==='s2') { camera.position.set(-8+Math.sin(time*0.08)*1.2, 4.2, 14+Math.cos(time*0.1)*0.6); camera.lookAt(-8,1.2,7); }
      else if (shotId==='s3') {
        const p=prog; camera.position.set(6+ p*10, 12 - p*6, 8 - p*14); camera.lookAt(18,-0.2,-18);
        meteorG.visible=true; meteorG.position.set( -12+ p*30, 18 - p*16, 14 - p*32);
        mLight.intensity = 18*(1-(p-0.9) ** 2*2);
        trail.scale.y = 0.6+ p*1.4;
        if(p>0.92 && !island.visible){ island.visible=true; metOnIsland.g.visible=true; fill.intensity=22; fill.color.setHex(0xff9a3c); setTimeout(()=>{fill.intensity=0;},220); noiseBurst(0.9,0.32,300); tone(60,1.2,'sine',0.22); tone(120,0.8,'square',0.14); }
      }
      else if (shotId==='s4') { meteorG.visible=false; camera.position.set(-10, 4.5+Math.sin(time*0.12)*0.3, 16); camera.lookAt(-9,1,7); }
      else if (shotId==='s5') { camera.position.set(-9+prog*1.2, 2.2, 8.5 - prog*0.6); camera.lookAt(-8.5,1.2,7.2); atang.g.position.x = -7 + Math.sin(time*0.9)*0.02; }
      else if (shotId==='s6') { ship.visible=true; const p=prog; ship.position.set(-4+ p*16, 0.15+Math.sin(time*3)*0.06, -0.5 - p*8); ship.rotation.y = -0.2+ Math.sin(time*0.6)*0.06; ship.rotation.z = Math.sin(time*2.2)*0.03;
        camera.position.set(ship.position.x-4, 3.2, ship.position.z+6); camera.lookAt(ship.position.x,0.6,ship.position.z);
      }
      else if (shotId==='s7') { ship.visible=false; atang.g.position.set(17.2,0.9,-17.2); atang.g.visible=prog<0.88; camera.position.set(20+Math.sin(time*0.15)*0.8, 3.2, -14+Math.cos(time*0.12)*0.6); camera.lookAt(18,1.2,-18); }
      else if (shotId==='s8') { camera.position.set(18.6, 2.0+prog*0.6, -16.5); camera.lookAt(18,1.5,-18); atang.g.visible=true; atang.g.position.set(18.4,0.9,-17.6); if(prog>0.4) metOnIsland.g.scale.setScalar(1+ Math.sin(time*8)*0.012); }
      else if (shotId==='s9') {
        ship.visible=true; const p=prog; ship.position.set(18 - p*18, 0.15+Math.sin(time*4)*0.12, -18 + p*15); ship.rotation.z = Math.sin(time*3)*0.08 + p*0.12;
        camera.position.set(ship.position.x+3, 4.5, ship.position.z+3); camera.lookAt(ship.position.x,0.4,ship.position.z);
        // storm fog
        scene.fog = new THREE.Fog(0x0a1422, 10+ p*6, 34);
        if(p>0.3 && p<0.32) noiseBurst(0.5,0.18,600);
      }
      else if (shotId==='s10') { ship.visible=false; island.visible=true; metOnIsland.g.visible=true; camera.position.set(6+Math.sin(time*0.08)*1.4, 11, 10+Math.cos(time*0.07)*1.2); camera.lookAt(6,9.2,10); scene.fog = new THREE.Fog(0x060a14, 28, 72); }
      else { camera.position.set(0,8,18); camera.lookAt(0,1,0); }
    }

    let lastCueId = '';
    let lastShotId = '';
    let raf=0;
    let last = performance.now();
    const tick = () => {
      raf=requestAnimationFrame(tick);
      const now=performance.now(); const dt=Math.min(0.05,(now-last)/1000); last=now;
      if (playingRef.current) {
        timeRef.current = Math.min(TOTAL, timeRef.current + dt);
        if (timeRef.current >= TOTAL) { playingRef.current=false; setPlaying(false); }
        setT(timeRef.current);
      }
      const tt=timeRef.current;
      const sh=shotAt(tt); const prog = (tt - sh.start)/Math.max(0.001, sh.end - sh.start);
      if (sh.id!==lastShotId) { lastShotId=sh.id;
        // shot transition sound
        if (sh.id==='s3') { tone(420,0.6,'sine',0.08); noiseBurst(0.8,0.12,700); }
        if (sh.id==='s6') { tone(180,0.8,'triangle',0.06); }
        if (sh.id==='s9') { tone(90,1.2,'sawtooth',0.1); noiseBurst(1.2,0.14,500); }
      }
      camFor(sh.id, prog, tt);
      // lighthouse beam
      lh.beam.rotation.y += dt*1.2;
      lh.lamp.material.emissiveIntensity = 0.6+ Math.sin(tt*1.8)*0.22;
      // meteorite pulse
      if (metOnIsland.g.visible) {
        const p=Math.sin(tt*2.2)*0.14+0.86; metOnIsland.cracks.forEach((c,i)=> c.material.opacity = 0.6+ Math.sin(tt*3+i)*0.3);
        metOnIsland.glow.intensity = 9+ Math.sin(tt*2.6)*2.2;
        metOnIsland.g.scale.setScalar(1+Math.sin(tt*1.4)*0.008);
        fill.intensity = p>0.9? 1.2:0;
      }
      // figures subtle breathing / gestures
      const cue = cueAt(tt);
      if (cue && cue.id!==lastCueId) { lastCueId=cue.id; playCueSound(cue.id); }
      figA.g.position.y = Math.sin(tt*0.9)*0.02;
      figB.armL.rotation.x = cue && cue.speaker==='阿棠' ? -0.4 : 0;
      figC.head.rotation.y = Math.sin(tt*0.5)*0.12;
      atang.g.rotation.y = -0.2+ Math.sin(tt*0.7)*0.08;
      // sea bob
      sea.position.y = -0.02+ Math.sin(tt*0.7)*0.03;
      sea2.position.y = 0.02+ Math.cos(tt*0.6)*0.02;
      // stars twinkle
      starG.children.forEach((s,i)=> { (s as THREE.Mesh).material.opacity = 0.5+ Math.sin(tt*1.2+i)*0.3; });
      renderer.render(scene,camera);
    };
    tick();

    const onResize=()=>{ camera.aspect=mount.clientWidth/mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth,mount.clientHeight); };
    window.addEventListener('resize',onResize);
    return()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',onResize); mount.removeChild(renderer.domElement); renderer.dispose(); if(audioRef.current) audioRef.current.close(); };
  }, [muted]);

  const curCue = cueAt(t);
  const curShot = shotAt(t);
  const progress = (t/TOTAL)*100;

  return (
    <div style={{width:'100%',height:'100%',position:'relative',background:'#05070a',overflow:'hidden'}}>
      <div ref={mountRef} style={{position:'absolute',inset:0}} />
      {/* film grain vignette */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.62) 100%)'}} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:0.06,backgroundImage:'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>)'}} />

      {/* top bar */}
      <div style={{position:'absolute',left:0,right:0,top:0,padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,pointerEvents:'none'}}>
        <div style={{background:'rgba(10,14,22,0.72)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'10px 14px',maxWidth:380}}>
          <div style={{fontSize:13,letterSpacing:0.14,fontWeight:700,color:'#f2f6ff'}}>北海陨石 · 体素电影 <span style={{opacity:0.6,fontWeight:400,marginLeft:6, fontSize:11}}>BEIHAI METEORITE</span></div>
          <div style={{fontSize:11,opacity:0.72,marginTop:4,lineHeight:1.5}}>总长 {Math.floor(TOTAL/60)}:{String(TOTAL%60).padStart(2,'0')} · 当前 {curShot.title} · {Math.floor(t/60)}:{String(Math.floor(t%60)).padStart(2,'0')} / 5:00 · 片头片尾计入 360s 硬上限内</div>
          <div style={{fontSize:11,opacity:0.62,marginTop:3}}>体素美术 · 程序化建模 · 无外部资产 · Web Audio 合成声</div>
        </div>
        <div style={{display:'flex',gap:8,pointerEvents:'auto'}}>
          <button onClick={()=> setPlaying(v=>!v)} style={{padding:'8px 14px',borderRadius:999,border:'1px solid rgba(255,255,255,0.14)',background: playing?'rgba(74,123,255,0.92)':'rgba(20,26,40,0.9)',color:'#fff',cursor:'pointer',fontSize:12, letterSpacing:0.06}}>{playing?'暂停':'播放'}</button>
          <button onClick={()=> { timeRef.current=0; setT(0); setPlaying(true); }} style={{padding:'8px 14px',borderRadius:999,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(20,26,40,0.9)',color:'#e6eaf0',cursor:'pointer',fontSize:12}}>重播</button>
          <button onClick={()=> setMuted(v=>!v)} style={{padding:'8px 12px',borderRadius:999,border:'1px solid rgba(255,255,255,0.12)',background: muted?'rgba(255,60,40,0.18)':'rgba(20,26,40,0.9)',color:'#e6eaf0',cursor:'pointer',fontSize:12}}>{muted?'静音':'有声'}</button>
        </div>
      </div>

      {/* subtitles fixed bottom-center 【speaker】text */}
      <div style={{position:'absolute',left:'50%',bottom:46,transform:'translateX(-50%)',width:'min(860px, 92vw)',display:'flex',justifyContent:'center',pointerEvents:'none'}}>
        <div style={{background: curCue?'rgba(8,12,20,0.86)':'transparent',border: curCue?'1px solid rgba(255,255,255,0.10)':'1px solid transparent',backdropFilter: curCue?'blur(10px)':'none',padding: curCue?'10px 16px':'0 16px',borderRadius:12, color:'#f2f6ff',fontSize:16,lineHeight:1.5, textAlign:'center', minHeight: curCue?44:0, opacity: curCue?1:0, transition:'opacity 0.18s', boxShadow: curCue?'0 8px 28px rgba(0,0,0,0.42)':'none'}}>
          {curCue ? `【${curCue.speaker}】${curCue.text}` : ''}
        </div>
      </div>

      {/* timeline */}
      <div style={{position:'absolute',left:16,right:16,bottom:12,background:'rgba(10,14,22,0.76)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'10px 14px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{fontSize:11,opacity:0.7, width:64, textAlign:'center', fontVariantNumeric:'tabular-nums'}}>{Math.floor(t/60)}:{String(Math.floor(t%60)).padStart(2,'0')} / 5:00</div>
        <div style={{flex:1,height:6,background:'rgba(255,255,255,0.10)',borderRadius:999,position:'relative',overflow:'hidden', cursor:'pointer'}} onClick={(e)=>{
          const r=(e.currentTarget as HTMLDivElement).getBoundingClientRect(); const p=(e.clientX-r.left)/r.width; const nt=p*TOTAL; timeRef.current=nt; setT(nt);
        }}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${progress}%`,background:'linear-gradient(90deg,#4a7bff,#6ec1ff)',borderRadius:999}} />
          {/* cues ticks */}
          {CUES.map(c=> (
            <div key={c.id} title={`${c.speaker}: ${c.text}`} style={{position:'absolute',left:`${c.start/TOTAL*100}%`,top:0,bottom:0,width:2,background: curCue && curCue.id===c.id?'#fff':'rgba(255,255,255,0.42)'}} />
          ))}
          {/* shots */}
          {SHOTS.map(s=> (
            <div key={s.id} style={{position:'absolute',left:`${s.start/TOTAL*100}%`,top:-2,bottom:-2,width:1,background:'rgba(255,255,255,0.08)'}} />
          ))}
        </div>
        <div style={{fontSize:11,opacity:0.62, width:140, textAlign:'right', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{curShot.title} · {curShot.id}</div>
        <input type="range" min={0} max={TOTAL} step={0.1} value={t} onChange={e=>{ const v=parseFloat(e.target.value); timeRef.current=v; setT(v); }} style={{width:110}} />
      </div>

      {/* shot list overlay */}
      <div style={{position:'absolute',right:16,top:76,background:'rgba(10,14,22,0.72)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'10px 12px',minWidth:160,maxWidth:200}}>
        <div style={{fontSize:11,letterSpacing:0.12,opacity:0.7,marginBottom:6}}>分镜 · 10 段</div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {SHOTS.map(s=> (
            <div key={s.id} onClick={()=>{ timeRef.current=s.start+0.2; setT(timeRef.current); }} style={{fontSize:11,padding:'4px 6px',borderRadius:8,background: curShot.id===s.id?'rgba(74,123,255,0.18)':'transparent',color: curShot.id===s.id?'#fff':'#aeb9cc',cursor:'pointer',display:'flex',justifyContent:'space-between',gap:8}}>
              <span>{s.title}</span><span style={{opacity:0.6,fontVariantNumeric:'tabular-nums'}}>{Math.floor(s.start/60)}:{String(s.start%60).padStart(2,'0')}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,opacity:0.52,marginTop:8,lineHeight:1.4}}>点击分镜可跳段；字幕由同源语音清单驱动，底部居中显示</div>
      </div>

      {/* voice manifest hint */}
      <div style={{position:'absolute',left:16,bottom:62,background:'rgba(10,14,22,0.62)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'8px 10px',maxWidth:320}}>
        <div style={{fontSize:11,opacity:0.7}}>语音清单 · {CUES.length} 条 · 与画面同步</div>
        <div style={{fontSize:11,opacity:0.62,marginTop:4,lineHeight:1.4, maxHeight:72, overflow:'auto'}}>
          {CUES.slice(0,4).map(c=> <div key={c.id} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.id} {c.kind} {c.speaker} {c.start}s-{c.end}s</div>)}<div style={{opacity:0.5}}>…… 共 {CUES.length} 条，每条含 id/kind/speaker/text/delivery/start/end</div>
        </div>
      </div>
    </div>
  );
}

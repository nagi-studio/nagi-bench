import * as THREE from 'three';
import { CinematicPlayer, ThreeStage, mountCinematicControls, validateVoiceCues } from '@agentbench/cinematic-player';
import { makeWorlds } from './world.js';
import { buildShots, DURATION, edit } from './timeline.js';
import { voiceCues } from './voice-cues.js';
import { makeAudio, soundCues } from './sound.js';
import './style.css';

const cinema=document.querySelector('#cinema');
const dom=Object.fromEntries(['title','scope','credits','fade','location'].map(k=>[k,document.getElementById(k)]));
const scene=new THREE.Scene();scene.background=new THREE.Color(0x03090f);
const camera=new THREE.PerspectiveCamera(43,1,.025,1600);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(0x03090f);renderer.domElement.setAttribute('aria-label','程序化三维电影画面');
validateVoiceCues(voiceCues,DURATION);
const worlds=makeWorlds(scene);
const shots=buildShots(scene,camera,worlds,dom);
const player=new CinematicPlayer({duration:DURATION,context:{scene,camera,worlds},shots,cues:[...voiceCues,...soundCues]});
const audio=makeAudio(player);
const stage=new ThreeStage({player,renderer,scene,camera:()=>camera,container:document.getElementById('stage'),maxPixelRatio:1.75});
// A paused frame must be redrawn after a canvas resize, including fullscreen.
const pausedResize=new ResizeObserver(()=>{if(!player.isPlaying){stage.resize();player.refresh();}});
pausedResize.observe(document.getElementById('stage'));
const controls=mountCinematicControls({player,audio,container:cinema});
const begin=document.querySelector('#begin'),replay=document.querySelector('#replay');
let started=false;
async function toggle(){await audio.unlock();if(player.isPlaying)player.pause();else player.play();}
begin.addEventListener('click',toggle);
replay.addEventListener('click',async()=>{await audio.unlock();player.seek(0);player.play();});
player.addTypedEventListener('statechange',({detail})=>{
  if(detail.state==='playing')started=true;
  cinema.classList.toggle('is-playing',detail.state==='playing');
  cinema.classList.toggle('has-started',started);
  cinema.classList.toggle('has-ended',detail.state==='ended');
  begin.style.display=started?'none':'';
});
player.addTypedEventListener('frame',({detail})=>{
  if(detail.time>0.1){begin.style.display='none';started=true;cinema.classList.add('has-started');}
  cinema.classList.toggle('has-ended',detail.time>=DURATION);
});
let idleTimer;
function wake(){cinema.classList.add('awake');clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(player.isPlaying)cinema.classList.remove('awake');},2400);}
cinema.addEventListener('pointermove',wake);cinema.addEventListener('pointerdown',wake);wake();
window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement)return;
  if(e.code==='Space'){e.preventDefault();void toggle();wake();}
  if(e.code==='ArrowRight'){e.preventDefault();player.seek(player.currentTime+10);wake();}
  if(e.code==='ArrowLeft'){e.preventDefault();player.seek(Math.max(0,player.currentTime-10));wake();}
  if(e.code==='KeyF')void cinema.requestFullscreen?.();
});
document.getElementById('loading').remove();
// Exposed for editorial inspection and later voice integration; never an alternate clock.
window.film={player,audio,stage,renderer,scene,camera,worlds,voiceCues,soundCues,edit,duration:DURATION};
player.refresh();
if(import.meta.hot)import.meta.hot.dispose(()=>{pausedResize.disconnect();controls.destroy();audio.destroy();stage.destroy(true);player.destroy();});

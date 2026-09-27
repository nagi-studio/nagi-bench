import * as THREE from 'three';
import {CinematicPlayer,ThreeStage,WebAudioCueBus,mountCinematicControls,validateVoiceCues} from '@agentbench/cinematic-player';
import {makeWorlds} from './worlds.js';
import {makeFilm,DURATION,EDIT} from './film.js';
import {voiceCues} from './voice.js';
import {soundCues,registerAudio} from './audio.js';
import './style.css';
document.body.classList.add('unstarted');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.035,900);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const worlds=makeWorlds(scene);
const shots=makeFilm(scene,camera,worlds);
validateVoiceCues(voiceCues,DURATION);
const player=new CinematicPlayer({duration:DURATION,context:{scene,camera},shots,cues:[...voiceCues,...soundCues]});
const stage=new ThreeStage({player,renderer,scene,camera:()=>camera,container:document.querySelector('#stage'),maxPixelRatio:Math.min(devicePixelRatio,1.7)});
const audio=registerAudio(new WebAudioCueBus(player));
const controls=mountCinematicControls({player,audio,container:document.querySelector('#cinema')});
// Prepare every lighting setup before transport starts, so cuts do not compile shaders.
const size=renderer.getSize(new THREE.Vector2());
renderer.setSize(320,200,false);
let prepared=0;
for(const w of Object.values(worlds)){
  const visible=w.root.visible;
  const staging=new THREE.Scene();staging.fog=w.fog??null;
  staging.add(w.root);w.root.visible=true;
  await renderer.compileAsync(staging,camera);
  renderer.render(staging,camera);
  w.root.visible=visible;scene.add(w.root);
  document.querySelector('#loading').firstChild.nodeValue=`正在布光 · ${++prepared} / 7`;
}
renderer.setSize(size.x,size.y,false);player.refresh();
// Complete the warm-up queue before enabling the first user-initiated frame.
renderer.getContext().finish();
const opening=document.querySelector('#opening'),begin=document.querySelector('#begin');
let started=false;
function reveal(){if(!started){started=true;document.body.classList.remove('unstarted');opening.classList.add('hidden')}}
begin.addEventListener('click',async()=>{begin.disabled=true;try{await audio.unlock();reveal();player.play()}catch(e){begin.disabled=false;begin.textContent='点击重试播放';console.error(e)}});
player.addTypedEventListener('statechange',({detail})=>{if(detail.state==='playing')reveal()});
document.addEventListener('keydown',async e=>{if(e.target instanceof HTMLInputElement)return;if(e.code==='Space'){e.preventDefault();await audio.unlock();reveal();player.isPlaying?player.pause():player.play()}if(e.code==='ArrowRight'){e.preventDefault();player.seek(Math.min(DURATION,player.currentTime+5))}if(e.code==='ArrowLeft'){e.preventDefault();player.seek(Math.max(0,player.currentTime-5))}if(e.code==='KeyF')document.querySelector('#cinema').requestFullscreen?.()});
// Public transport is also useful to editors and playback verification; no debug scene paths.
window.film={player,audio,stage,renderer,scene,camera,shots:EDIT,voiceCues,soundCues};
// Resize also repaints a paused frame, including when entering fullscreen.
new ResizeObserver(()=>requestAnimationFrame(()=>{if(!player.isPlaying)player.refresh()})).observe(document.querySelector('#stage'));
document.querySelector('#loading').remove();

import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {CinematicPlayer,ThreeStage,mountCinematicControls,validateVoiceCues} from '@agentbench/cinematic-player';
import manifest from './voice-cues.json';
import {buildWorlds} from './worlds.js';
import {makeShots,DURATION} from './shots.js';
import {soundManifest,installAudio} from './sound.js';
import './style.css';
export const voiceCues=manifest;
validateVoiceCues(voiceCues,DURATION);
const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x02060b);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(42,1,.04,700);
const worlds=buildWorlds();for(const w of Object.values(worlds)){scene.add(w.root);w.root.visible=false}
// Merge only our static architectural boxes; kit figures and their joints stay untouched.
function batchBoxes(root){for(const child of [...root.children])if(child.isGroup&&child.name!=='block-figure')batchBoxes(child);const batches=new Map();for(const m of [...root.children]){if(!m.isMesh||!m.userData.archBox||m.userData.dynamic)continue;if(!batches.has(m.material))batches.set(m.material,[]);batches.get(m.material).push(m)}for(const [material,list] of batches){if(list.length<3)continue;const geometries=list.map(m=>{m.updateMatrix();return m.geometry.clone().applyMatrix4(m.matrix)});const merged=mergeGeometries(geometries,false);const mesh=new T.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);list.forEach(m=>root.remove(m));geometries.forEach(g=>g.dispose())}}
worlds.space.sun.userData.dynamic=true;for(const w of Object.values(worlds))batchBoxes(w.root);
const {shots,tests,shotsFired}=makeShots(worlds,camera,scene);
const soundCues=soundManifest(tests,shotsFired,voiceCues);
const player=new CinematicPlayer({duration:DURATION,context:{scene,camera,worlds},shots,cues:[...voiceCues,...soundCues]});
const audio=installAudio(player);
const stage=new ThreeStage({player,renderer,scene,camera:()=>camera,container:document.querySelector('#stage'),maxPixelRatio:1.5});
const controls=mountCinematicControls({player,audio,container:document.querySelector('#cinema')});
const invitation=document.querySelector('#invitation'),status=document.querySelector('#status');
let begun=false;
function hideInvitation(){begun=true;invitation.classList.add('hidden')}
document.querySelector('#begin').addEventListener('click',async()=>{await audio.unlock();hideInvitation();player.play()});
player.addTypedEventListener('statechange',({detail})=>{if(detail.state==='playing')hideInvitation();status.textContent=detail.state==='playing'?'正在放映':detail.state==='ended'?'全片终 · 可重播':'已暂停';});
player.addTypedEventListener('frame',({detail})=>{if(detail.time>0)hideInvitation();});
document.addEventListener('keydown',async e=>{if(e.target instanceof HTMLInputElement)return;if(e.code==='Space'){e.preventDefault();await audio.unlock();hideInvitation();player.isPlaying?player.pause():player.play()}else if(e.code==='ArrowRight'){e.preventDefault();player.seek(player.currentTime+5)}else if(e.code==='ArrowLeft'){e.preventDefault();player.seek(player.currentTime-5)}else if(e.code==='KeyF'){document.querySelector('#cinema').requestFullscreen?.()}});
// The same public transport is used for manual playback and browser inspection.
window.film={player,stage,audio,renderer,scene,camera,worlds,voiceCues,soundCues,duration:DURATION};
window.addEventListener('pagehide',()=>{audio.stopAll()});

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir,mkdtemp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { connect } from './cdp.mjs';

const attach=process.argv.includes('--attach');
const children=[];let browser;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,message) {for(let i=0;i<100;i++){try{if(await fn())return;}catch{}await delay(150);}throw new Error(message);}
try {
  await mkdir('.cache',{recursive:true});
  if(!attach) {
    const executable=process.env.CHROME_PATH??[
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      '/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ].find(existsSync);
    if(!executable)throw new Error('Chrome/Chromium is required for browser checks. Set CHROME_PATH to its executable.');
    const vite=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5174','--strictPort'],{windowsHide:true,stdio:'ignore'});children.push(vite);
    await until(async()=>{const r=await fetch('http://127.0.0.1:5174');return r.ok;},'Vite did not start on port 5174.');
    const profile=await mkdtemp(resolve('.cache/check-browser-'));
    const chrome=spawn(executable,['--headless=new','--remote-debugging-port=9233',`--user-data-dir=${profile}`,'--window-size=1440,1000','--no-first-run','--no-default-browser-check','--disable-background-timer-throttling','http://127.0.0.1:5174'],{windowsHide:true,stdio:'ignore'});children.push(chrome);
    await until(async()=>(await fetch('http://127.0.0.1:9233/json/list')).ok,'Chrome did not start.');
  }
  browser=await connect(attach?9222:9233);
  await browser.send('Page.reload');
  await until(()=>browser.evaluate('!!window.__DUST2__?.getSnapshot().ready'),'Game engine did not initialize.');
  await delay(300);
  await browser.screenshot('.cache/briefing.png');
  let passed=0;
  async function check(name,code) {
    const result=await browser.evaluate(`(async()=>{const e=window.__DUST2__;e.paused=true;const assert=(condition,message)=>{if(!condition)throw new Error(message);};const V=(x=0,y=0,z=0)=>e.player.position.clone().set(x,y,z);const reset=(team='CT',pistolRound=false)=>{e.config={team,pistolRound,primary:team==='CT'?'m4a4':'ak47',secondary:'default'};e.round=1;e.elapsed=0;e.resetRound(true);e.started=true;e.paused=true;e.phase='live';};${code}})()`);
    passed++;console.log(`PASS ${name}${result?' · '+result:''}`);
  }
  await check('All nine regions and both spawns connect through navigable routes',`
    const points=[[4,35],[0,-29],[38,0],[30,-19],[1,-13],[16,0],[-30,15],[-30,-18],[-16,12]];
    for(const from of points)for(const to of points){if(from===to)continue;const path=e.map.nav.path(V(from[0],0,from[1]),V(to[0],0,to[1]));assert(path.length>0,'No route '+from+' -> '+to);for(const p of path)assert(!e.map.blocked(p.x,p.z,.34),'Path crosses a collider');}
    return '72 routes';
  `);
  await check('Walls, crates, doors, jumping and line-of-sight are physical',`
    const p=V(38,0,0);e.map.move(p,20,0);assert(p.x<43.5,'Player crossed long wall');
    const door=V(1,0,-18);e.map.move(door,0,9);assert(door.z>-10,'Mid doors cannot be crossed');
    const long=V(30,0,29);e.map.move(long,0,-8);assert(long.z<22,'Long doors cannot be crossed');
    const crate=V(36,0,11);e.map.move(crate,0,-9);assert(crate.z>8,'Player crossed crate');
    assert(e.map.canSee(V(1,1.64,-18),V(1,1.64,-8)),'Open door blocks sight');
    assert(!e.map.canSee(V(38,1.64,0),V(16,1.64,0)),'Sight passes through walls');
    const jump=V(38,0,0);let vy=7,maxY=0;for(let i=0;i<90;i++){const p=e.map.vertical(jump,vy-19/60,1/60);vy=p.velocity;maxY=Math.max(maxY,jump.y);}assert(maxY>1&&jump.y===0,'Jump does not land');
    const roof=V(-30,0,12);const up=e.map.vertical(roof,100,.1);assert(roof.y+1.8<=3.76&&up.velocity===0,'Jump passes tunnel roof');
  `);
  await check('5v5 humanoids and genuine pistol-only opening',`
    reset('T',true);assert(e.actors.length===10,'Not 10 actors');assert(e.actors.filter(a=>a.team==='T').length===5,'Not 5v5');
    for(const a of e.actors){assert(!a.inventory.primary,'Primary in pistol round');assert(a.inventory.secondary.id===(a.team==='CT'?'usp':'glock'),'Wrong default pistol');assert(a.armor===25,'Wrong pistol armor');const zones=new Set(a.hitboxes.map(m=>m.userData.zone));assert(zones.size===5,'Missing hit zone');assert(a.limbs.length===2&&a.hitboxes.length>=9,'Incomplete humanoid');}
  `);
  await check('Weapon damage hierarchy, armor, 2x headshot and AWP lethality',`
    const {WEAPONS:w,damageFor}=await import('/src/game/weapons.ts');
    assert(w.ak47.damage>w.m4a4.damage&&w.m4a4.damage>w.deagle.damage&&w.deagle.damage>w.usp.damage,'Damage hierarchy');
    assert(w.m4a4.interval<w.ak47.interval&&w.ak47.recoil>w.m4a4.recoil,'Rifle feel is identical');
    for(const weapon of Object.values(w)){assert(damageFor(weapon,'head',0).health===damageFor(weapon,'chest',0).health*2,'Headshot multiplier');assert(damageFor(weapon,'chest',100).health<damageFor(weapon,'chest',0).health,'Armor does not reduce damage');}
    assert(damageFor(w.awp,'chest',100).health>=100,'AWP is not lethal');assert(w.deagle.magazine===7,'Deagle magazine');
  `);
  await check('Real raycast hits, ammo decrement, reload and three weapon slots',`
    reset();const p=e.player,v=e.actors[5];for(const a of e.actors){a.position.set(500+a.id*3,0,500);a.group.position.copy(a.position);}
    p.position.set(38,0,4);v.position.set(38,0,-3);p.group.position.copy(p.position);v.group.position.copy(v.position);v.armor=0;
    const oldRandom=Math.random;Math.random=()=>.5;
    try{const direction=v.position.clone().add(V(0,1.32,0)).sub(p.position.clone().add(V(0,1.64,0))).normalize();e.fire(p,direction);assert(p.inventory.primary.ammo===29,'Ammo did not decrement');assert(v.hp===66,'Ray missed chest: '+v.hp);assert(e.lastHitZone==='chest','Wrong hitbox: '+e.lastHitZone);
    p.cooldown=0;const head=v.position.clone().add(V(0,1.72,0)).sub(p.position.clone().add(V(0,1.64,0))).normalize();e.fire(p,head);assert(!v.alive&&e.headshot,'Actual headshot failed');}finally{Math.random=oldRandom;}
    p.inventory.primary.ammo=2;e.reload(p);assert(p.reloadTime>0,'Reload did not start');e.phase='freeze';e.freeze=100;for(let i=0;i<150;i++)e.fixedUpdate(1/60);assert(p.inventory.primary.ammo===30&&p.inventory.primary.reserve===62,'Reload counts incorrect');
    e.switchSlot('secondary');assert(p.slot==='secondary','Secondary switch');e.switchSlot('melee');assert(p.slot==='melee','Knife switch');e.switchSlot('primary');assert(p.slot==='primary','Primary switch');
  `);
  await check('AI navigation reaches B and autonomously plants C4',`
    reset();for(const a of e.actors.filter(a=>a.team==='CT')){a.position.set(500+a.id*3,0,500);a.group.position.copy(a.position);}
    const carrier=e.actors[6];carrier.ai.route=2;
    for(let i=0;i<3600&&e.bomb.state!=='planted';i++)e.fixedUpdate(1/60);
    assert(e.bomb.state==='planted','AI never planted: '+JSON.stringify({state:e.bomb.state,pos:carrier.position,ai:carrier.ai.state,dest:carrier.ai.destination}));
    assert(e.bomb.site==='B','Wrong site');return Math.round(e.elapsed)+' simulated seconds';
  `);
  await check('Planted C4 survives T elimination; uninterrupted CT defuse wins',`
    for(const a of e.actors.filter(a=>a.team==='T'))e.kill(a,e.player,'m4a4');e.checkRound();assert(e.phase==='live','CT won before defusing');
    e.player.position.copy(e.bomb.position).add(V(1,0,0));e.player.moving=0;e.keys.add('KeyE');
    e.updateBomb(1);assert(e.bomb.progress>.15,'Defuse did not start');e.keys.delete('KeyE');e.updateBomb(.1);assert(e.bomb.progress===0,'Defuse progress did not reset');
    e.keys.add('KeyE');for(let i=0;i<305;i++)e.updateBomb(1/60);assert(e.bomb.state==='defused'&&e.winner==='CT','CT defuse did not win');e.keys.clear();
  `);
  await check('C4 drops on death and is recovered by another terrorist',`
    reset('T');const carrier=e.player;carrier.position.set(5,0,35);e.kill(carrier,e.actors[0],'m4a4');assert(e.bomb.state==='dropped'&&e.bomb.carrier===null,'C4 not dropped');
    const teammate=e.actors[6];teammate.position.copy(e.bomb.position);e.updateBomb(.02);assert(e.bomb.carrier===6&&e.bomb.state==='carried','C4 not recovered');
  `);
  await check('Spectator can cycle and take over a surviving teammate',`
    assert(!e.player.alive,'Player should be dead');e.cycleSpectator();const target=e.spectatorId;e.takeover();assert(e.playerId===target&&e.player.alive&&e.player.team==='T','Takeover failed');
    const current=e.player;e.kill(current,e.actors[0],'m4a4');void e.watched;assert(e.spectatorId!==current.id,'Spectator stayed on corpse');
  `);
  await check('Player plant, bomb explosion, elimination wins and next-round reset',`
    reset('T');e.player.position.set(30,0,-20);e.player.moving=0;e.keys.add('KeyE');for(let i=0;i<200;i++)e.updateBomb(1/60);assert(e.bomb.state==='planted'&&e.bomb.site==='A','Player failed to plant');e.keys.clear();e.bomb.timer=.01;e.updateBomb(.02);assert(e.winner==='T'&&e.bomb.state==='exploded','Explosion did not win');
    reset();for(const a of e.actors.filter(a=>a.team==='T'))e.kill(a,e.player,'m4a4');e.checkRound();assert(e.winner==='CT','CT elimination win failed');
    const round=e.round;for(let i=0;i<370;i++)e.fixedUpdate(1/60);assert(e.round===round+1&&e.actors.every(a=>a.alive),'Next round did not reset');
    reset('T');for(const a of e.actors.filter(a=>a.team==='CT'))e.kill(a,e.player,'ak47');e.checkRound();assert(e.winner==='T','T elimination win failed');
  `);
  await check('AI autonomously routes to and defuses an active bomb',`
    reset('T');for(const a of e.actors.filter(a=>a.team==='T')){a.position.set(500+a.id*3,0,500);a.group.position.copy(a.position);}
    e.bomb.state='planted';e.bomb.carrier=null;e.bomb.position.set(30,0,-20);e.bomb.site='A';e.bomb.timer=40;
    for(let i=0;i<2350&&e.phase!=='over';i++)e.fixedUpdate(1/60);
    assert(e.bomb.state==='defused'&&e.winner==='CT','AI failed to defuse: '+e.bomb.state);return Math.round(e.elapsed)+' simulated seconds';
  `);
  await check('Unscripted 5v5 combat fires, records kills and resolves a round',`
    reset();let shots=0,kills=0;for(let i=0;i<9600&&e.phase!=='over';i++){
      e.fixedUpdate(1/60);kills=Math.max(kills,e.actors.reduce((sum,a)=>sum+a.kills,0));
      shots=Math.max(shots,e.actors.reduce((sum,a)=>sum+(a.inventory.primary?30-a.inventory.primary.ammo:0),0));
      for(const a of e.actors)if(a.alive)assert(!e.map.blocked(a.position.x,a.position.z,.30,a.position.y),'Live bot clipped wall: '+a.name);
    }
    assert(shots>5&&kills>0,'AI never fought');assert(e.phase==='over','Round never ended');return kills+' kills, '+e.result+' at '+Math.round(e.elapsed)+'s';
  `);
  // Use a real pointer gesture, keyboard events and right click for the UI checks.
  await browser.send('Page.reload');await until(()=>browser.evaluate('!!window.__DUST2__?.getSnapshot().ready&&!window.__DUST2__.started&&document.querySelectorAll(".weapon-selection button").length===3'),'Reload failed');
  const position=await browser.evaluate(`(()=>{document.querySelectorAll('.weapon-selection button')[2].click();const r=document.querySelector('.deploy-button').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await browser.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...position});
  await browser.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...position});
  await until(()=>browser.evaluate('window.__DUST2__.started&&window.__DUST2__.locked'),'Deploy did not capture the pointer');
  console.log('PASS Deployment button starts game and captures pointer');passed++;
  await browser.evaluate('window.__DUST2__.phase="live";window.__DUST2__.paused=true;');
  await browser.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'right',clickCount:1,x:720,y:500});
  // Enable input without advancing an entire round, then scope through DOM events.
  await browser.evaluate('window.__DUST2__.paused=false;window.dispatchEvent(new MouseEvent("mousedown",{button:2}));');
  await delay(120);
  if(!await browser.evaluate('window.__DUST2__.scoped&&!!document.querySelector(".scope")'))throw new Error('AWP scope or overlay failed');
  await browser.screenshot('.cache/scope.png');console.log('PASS AWP right-click zoom and scope overlay');passed++;
  await browser.evaluate('window.dispatchEvent(new MouseEvent("mousedown",{button:2}));window.__DUST2__.phase="live";');
  const before=await browser.evaluate('({z:window.__DUST2__.player.position.z,y:window.__DUST2__.player.position.y})');
  await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'w',code:'KeyW',windowsVirtualKeyCode:87});
  await delay(450);await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'w',code:'KeyW',windowsVirtualKeyCode:87});
  const after=await browser.evaluate('window.__DUST2__.player.position.z');
  if(Math.abs(after-before.z)<.5)throw new Error('WASD input did not move player');
  console.log('PASS Real keyboard WASD input moves player');passed++;
  await browser.screenshot('.cache/gameplay.png');
  await browser.evaluate('window.__DUST2__.pause()');await delay(100);
  if(!await browser.evaluate('window.__DUST2__.paused&&!window.__DUST2__.locked&&!!document.querySelector(".deployment")'))throw new Error('Pause failed');
  console.log('PASS Pause releases pointer and shows resumable menu');passed++;
  const errors=browser.events.filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Runtime.consoleAPICalled'&&e.params.type==='error'));
  if(errors.length)throw new Error('Browser errors: '+JSON.stringify(errors));
  console.log(`\n${passed} checks passed. No browser exceptions or shader errors. Screenshots: .cache/briefing.png, gameplay.png, scope.png`);
} catch(error) {console.error(error);process.exitCode=1;}
finally {browser?.close();for(const child of children.reverse())child.kill();}

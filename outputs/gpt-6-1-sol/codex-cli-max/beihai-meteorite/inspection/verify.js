const tab=await Bun.file('/workspace/inspection/tab.json').json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let id=0;const pending=new Map(),errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}}else if(m.method==='Runtime.exceptionThrown'||m.method==='Log.entryAdded'&&m.params.entry.level==='error'||m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m);};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function evaluate(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result?.value;}
async function click(selector,fraction=.5){const p=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width*${fraction},y:r.y+r.height/2};})()`);await call('Input.dispatchMouseEvent',{type:'mouseMoved',...p});await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});}
await call('Page.enable');await call('Runtime.enable');await call('Log.enable');await call('Page.bringToFront');
await call('Emulation.setDeviceMetricsOverride',{width:960,height:600,deviceScaleFactor:1,mobile:false});
const previousOrigin=await evaluate('performance.timeOrigin');
console.log('Reloading built film');
await call('Page.reload',{ignoreCache:true});
let ready=false;for(let i=0;i<60;i++){await delay(250);ready=await evaluate(`performance.timeOrigin!==${previousOrigin}&&!!window.film`);if(ready)break;}
if(!ready){console.log(JSON.stringify({errors}));throw Error('Film did not initialize');}
console.log('Film initialized');
await call('Page.bringToFront');await call('Emulation.setFocusEmulationEnabled',{enabled:true});
await click('#begin');
console.log('Clicked Play');
for(let i=0;i<30;i++){await delay(250);if(await evaluate('film.player.currentTime>.5'))break;}
const first=await evaluate('({time:film.player.currentTime,state:film.player.state,audio:film.audio.audioContext.state})');
console.log(JSON.stringify({first}));
await delay(1600);const second=await evaluate('film.player.currentTime');
if(first.state!=='playing'||second<=first.time||first.audio!=='running'){console.log(JSON.stringify({first,second,errors}));throw Error('Actual Play gesture did not start timeline and audio');}
await click('[data-action="play"]');const pausedAt=await evaluate('film.player.currentTime');await delay(700);const pausedAfter=await evaluate('film.player.currentTime');
if(pausedAt!==pausedAfter)throw Error('Pause failed');
await click('[data-action="seek"]',.52);const sought=await evaluate('film.player.currentTime');
console.log(JSON.stringify({pausedAt,pausedAfter,sought}));
if(sought<158||sought>172)throw Error('Native seek control did not update time');
await click('[data-action="play"]');
let resumed=sought;for(let i=0;i<24;i++){await delay(250);resumed=await evaluate('film.player.currentTime');if(resumed>sought)break;}
if(resumed<=sought){console.log(JSON.stringify({first,second,pausedAt,pausedAfter,sought,resumed,state:await evaluate('film.player.state'),errors}));throw Error('Resume after seek failed');}
await click('[data-action="play"]');
const checks={playGesture:first,advancesTo:second,pause:{before:pausedAt,after:pausedAfter},nativeSeek:sought,resumedTo:resumed};
console.log(JSON.stringify({transport:checks}));
// A single uninterrupted accelerated traversal exercises every authored shot and sound factory.
await evaluate('window.qaVisited=new Set();window.qaDetach=film.player.addTypedEventListener("frame",()=>{const s=film.player.getShots().find(s=>film.player.currentTime>=s.start&&film.player.currentTime<s.end);if(s)qaVisited.add(s.id);});film.player.seek(0);film.player.setPlaybackRate(8);film.player.play();void 0;');
const visited=new Set();let ended=false;
for(let i=0;i<240;i++){
  await delay(500);
  const s=await evaluate('({time:film.player.currentTime,state:film.player.state,shot:film.player.getShots().find(s=>film.player.currentTime>=s.start&&film.player.currentTime<s.end)?.id,activeSounds:film.audio.active.size})');
  if(s.shot)visited.add(s.shot);
  if(i%10===0)console.log(JSON.stringify({playback:s}));
  if(s.state==='ended'){ended=true;break;}
}
if(!ended)throw Error('Continuous traversal failed to reach ending');
// Seeking from the end and back must reproduce the same transform and subtitle state.
const deterministic=await evaluate(`(()=>{
  const snapshot=t=>{film.player.seek(t);return JSON.stringify({camera:film.camera.position.toArray(),hero:film.worlds.orbit.zhang.root.matrix.toArray(),subtitle:document.querySelector('.ab-cinematic-subtitle').textContent,poses:film.worlds.photo.crew.map(a=>[a.root.position.toArray(),a.root.rotation.toArray().slice(0,3),a.damaged])});};
  const a=snapshot(255);film.player.seek(28);const b=snapshot(255);return a===b;
})()`);
if(!deterministic)throw Error('Backward / forward seeking changed state');
await evaluate('film.player.setPlaybackRate(1);film.player.pause();film.player.seek(318);void 0;');
const endFrame=await call('Page.captureScreenshot',{format:'jpeg',quality:82});await Bun.write('/workspace/inspection/ending.jpg',Buffer.from(endFrame.data,'base64'));
const allVisited=await evaluate('qaDetach();[...qaVisited]');
const report={verifiedAt:new Date().toISOString(),duration:318,voiceCueCount:await evaluate('film.voiceCues.length'),shotCount:34,transport:checks,continuousTraversalReachedEnd:ended,visitedShots:allVisited,deterministicSeek:deterministic,consoleErrors:errors};
await Bun.write('/workspace/inspection/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
await call('Page.reload',{ignoreCache:true});
ws.close();
if(errors.length)process.exitCode=1;

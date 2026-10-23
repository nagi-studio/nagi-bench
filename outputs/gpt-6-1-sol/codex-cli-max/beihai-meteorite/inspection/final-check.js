const tab=await Bun.file('/workspace/inspection/tab.json').json(),ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});let id=0;const pending=new Map(),errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.j(m.error):p.r(m.result);}}else if(m.method==='Runtime.exceptionThrown'||m.method==='Log.entryAdded'&&m.params.entry.level==='error')errors.push(m);};
const call=(method,params={})=>new Promise((r,j)=>{const n=++id;pending.set(n,{r,j});ws.send(JSON.stringify({id:n,method,params}));});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function ev(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result?.value;}
async function click(selector){const p=await ev(`(()=>{const r=document.querySelector('${selector}').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);await call('Input.dispatchMouseEvent',{type:'mouseMoved',...p});await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});}
async function screenshot(name){await delay(150);const r=await call('Page.captureScreenshot',{format:'jpeg',quality:85});await Bun.write(`/workspace/inspection/${name}.jpg`,Buffer.from(r.data,'base64'));}
await call('Runtime.enable');await call('Log.enable');await call('Page.enable');await call('Page.bringToFront');
await screenshot('poster');
await click('#begin');let advanced=false;for(let i=0;i<40;i++){await delay(250);if(await ev('film.player.currentTime>.25')){advanced=true;break;}}
if(!advanced)throw Error('Final build did not play');await click('[data-action="play"]');
await ev('film.player.seek(130);void 0;');
await call('Emulation.setDeviceMetricsOverride',{width:1024,height:640,deviceScaleFactor:1,mobile:false});await delay(400);
const resized=await ev('({time:film.player.currentTime,state:film.player.state,aspect:film.camera.aspect,canvas:[film.renderer.domElement.width,film.renderer.domElement.height],triangles:film.renderer.info.render.triangles})');
if(resized.time!==130||resized.state!=='paused'||Math.abs(resized.aspect-1.6)>.01)throw Error('Paused resize failed');await screenshot('elevator');
await ev('film.player.seek(231.45);void 0;');await screenshot('flash');
await ev('film.player.seek(270);void 0;');await screenshot('rescue');
await ev('film.player.seek(318);void 0;');await screenshot('ending');
const report=await Bun.file('/workspace/inspection/verification.json').json();report.finalBuild={asset:await ev('document.querySelector("script[type=module]").getAttribute("src")'),playGestureAdvanced:advanced,pausedResize:resized,consoleErrors:errors};
await Bun.write('/workspace/inspection/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.finalBuild));
await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await call('Page.reload',{ignoreCache:true});ws.close();
if(errors.length)process.exitCode=1;

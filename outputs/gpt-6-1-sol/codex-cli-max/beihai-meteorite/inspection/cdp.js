// Local editorial inspection, using the browser supplied by the environment.
// No browser-testing package is a project dependency.
const base='http://127.0.0.1:9333';
const idFile='/workspace/inspection/tab.json';
const args=process.argv.slice(2);
let tab;
if(args[0]==='open'){
  tab=await(await fetch(base+'/json/new?'+encodeURIComponent('http://127.0.0.1:4178/'),{method:'PUT'})).json();
  await Bun.write(idFile,JSON.stringify(tab));
}else tab=await Bun.file(idFile).json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);
const timeout=setTimeout(()=>{console.error('CDP timeout',ws.readyState);process.exit(2);},60000);
await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej;});
let seq=0;const pending=new Map();const events=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}}else events.push(m);};
function call(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
await call('Runtime.enable');await call('Page.enable');await call('Log.enable');await call('Page.bringToFront');
await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
async function evaluate(expression){return call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});}
const command=args[0];
if(command==='open'){
  await new Promise(r=>setTimeout(r,2500));
  console.log(JSON.stringify(await evaluate('({ready:!!window.film,title:document.title,body:document.body.innerText.slice(0,220)})')));
}
if(command==='eval')console.log(JSON.stringify(await evaluate(args.slice(1).join(' '))));
if(command==='shot'){
  if(args[1]!==undefined)await evaluate(`window.film.player.pause();window.film.player.seek(${Number(args[1])});void 0;`);
  await new Promise(r=>setTimeout(r,300));
  const r=await call('Page.captureScreenshot',{format:'png'});await Bun.write(args[2]||'/workspace/inspection/frame.png',Buffer.from(r.data,'base64'));
  console.log(JSON.stringify({file:args[2]||'/workspace/inspection/frame.png',state:await evaluate('({time:film.player.currentTime,state:film.player.state,camera:film.camera.position.toArray(),draws:film.renderer.info.render.calls})')}));
}
if(command==='click'){
  const r=await evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(args[1]||'#begin')}).getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};})()`);const p=r.result.value;
  await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,x:p.x,y:p.y});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:p.x,y:p.y});
  await new Promise(r=>setTimeout(r,1200));console.log(JSON.stringify(await evaluate('({time:film.player.currentTime,state:film.player.state})')));
}
if(command==='watch'){
  await new Promise(r=>setTimeout(r,Number(args[1]||1000)));
  console.log(JSON.stringify(await evaluate('({time:film.player.currentTime,state:film.player.state})')));
}
if(command==='gallery'){
  for(const arg of args.slice(1)){
    await call('Page.bringToFront');const t=Number(arg);await evaluate(`film.player.pause();film.player.seek(${t});void 0;`);
    await new Promise(r=>setTimeout(r,100));
    const shot=await call('Page.captureScreenshot',{format:'jpeg',quality:85});
    await Bun.write(`/workspace/inspection/frame-${String(t).padStart(3,'0')}.jpg`,Buffer.from(shot.data,'base64'));
    console.log('frame',t);
  }
}
console.log(JSON.stringify({events:events.filter(e=>['Runtime.exceptionThrown','Log.entryAdded'].includes(e.method))}));
clearTimeout(timeout);ws.close();

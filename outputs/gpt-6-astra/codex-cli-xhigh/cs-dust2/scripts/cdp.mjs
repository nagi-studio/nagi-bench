import { writeFile } from 'node:fs/promises';

export async function connect(port=9222) {
  const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target=targets.find(t=>t.type==='page'&&t.url.includes('5173'))??targets.find(t=>t.type==='page');
  if(!target)throw new Error('No browser page found. Start Chrome with --remote-debugging-port=9222.');
  const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  let id=0;const pending=new Map();const events=[];
  ws.onmessage=message=>{const data=JSON.parse(message.data);if(data.id){const request=pending.get(data.id);if(request){clearTimeout(request.timeout);pending.delete(data.id);data.error?request.reject(new Error(JSON.stringify(data.error))):request.resolve(data.result);}}else events.push(data);};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const requestId=++id;const timeout=setTimeout(()=>{pending.delete(requestId);reject(new Error(`${method} timeout`));},60000);pending.set(requestId,{resolve,reject,timeout});ws.send(JSON.stringify({id:requestId,method,params}));});
  await send('Runtime.enable');await send('Page.enable');
  const evaluate=async(expression)=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description??JSON.stringify(result.exceptionDetails));return result.result.value;};
  const screenshot=async(path)=>{const result=await send('Page.captureScreenshot',{format:'png'});await writeFile(path,Buffer.from(result.data,'base64'));};
  return {send,evaluate,screenshot,events,close:()=>ws.close()};
}
if(process.argv[1]?.endsWith('cdp.mjs')) {
  const browser=await connect();
  if(process.argv.includes('--screenshot'))await browser.screenshot('.cache/screenshot.png');
  console.log(JSON.stringify(await browser.evaluate('({title:document.title,ready:!!window.__DUST2__,fps:window.__DUST2__?.getSnapshot().fps,actors:window.__DUST2__?.actors.length,draws:window.__DUST2__?.renderer.info.render.calls,text:document.body.innerText.slice(0,500)})'),null,2));
  console.log('Errors:',JSON.stringify(browser.events.filter(e=>e.method==='Runtime.exceptionThrown')));
  browser.close();
}

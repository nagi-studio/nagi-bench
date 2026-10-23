import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const out=resolve(process.argv[2]||'preview-final');await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',chromiumSandbox:false,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],requests=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>requests.push(r.url()));
await page.route(/^https?:/,r=>r.abort());
await page.goto('file://'+resolve('dist/index.html'),{waitUntil:'load',timeout:120000});
await page.waitForFunction(()=>!!window.__film,{timeout:120000});await page.evaluate(()=>window.__film.pause());
const states=[];
const times=process.argv[3]?process.argv[3].split(',').map(Number):[0,5,10,13,18,20,23,24,26,27,30,32];
for(const time of times){
  await page.evaluate(t=>window.__film.seek(t,false),time);
  await page.waitForTimeout(380);
  await page.screenshot({path:`${out}/${String(time).padStart(2,'0')}.png`,timeout:120000});
  const state=await page.evaluate(()=>({time:window.__film.time,physics:window.__film.state,renderer:window.__film.renderer}));states.push(state);console.log('frame',time,'steps',state.physics.steps,'strikes',state.physics.strikes,'calls',state.renderer.calls);
}
await page.click('#sound');await page.waitForTimeout(100);console.log('audio',await page.locator('#sound').getAttribute('aria-pressed'));
await page.click('#info');console.log('notes',await page.locator('#notes').evaluate(e=>e.open));await page.click('#close-notes');
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.__film.seek(5,false));await page.screenshot({path:`${out}/mobile.png`,timeout:120000});
await writeFile(`${out}/report.json`,JSON.stringify({errors,requests,states},null,2));console.log('errors',JSON.stringify(errors));console.log('nonlocalRequests',JSON.stringify(requests.filter(s=>!s.startsWith('file:'))));await browser.close();
if(errors.length)process.exitCode=1;

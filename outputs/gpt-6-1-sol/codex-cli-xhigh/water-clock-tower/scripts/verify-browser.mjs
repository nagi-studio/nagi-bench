import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',chromiumSandbox:false,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const errors=[],external=[],failed=[];
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});page.on('requestfailed',r=>failed.push(r.url()));
await page.goto('file:///workspace/dist/index.html',{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>window.__film,{timeout:120000});
await page.evaluate(()=>{window.__film.pause();window.__film.seek(0);});
await page.click('#sound');
await page.evaluate(()=>window.__film.play());
console.log('Started continuous 30-second offline playback');
await mkdir('preview/live',{recursive:true});
const cdp=await page.context().newCDPSession(page);let peak=0;const frames=[];
for(const t of [5,10,20,30]){
  await page.waitForFunction(t=>window.__film.time>=t,t,{timeout:240000});
  const status=await page.evaluate(()=>({time:window.__film.time,playing:window.__film.playing,physics:window.__film.physics,sound:window.__film.sound}));peak=Math.max(peak,status.sound.peak);frames.push(status);console.log('Live',JSON.stringify(status));
  const shot=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:80,captureBeyondViewport:false});await writeFile(`preview/live/t${t}.jpg`,Buffer.from(shot.data,'base64'));
}
assert.equal(frames.at(-1).time,30);assert.equal(frames.at(-1).playing,false);assert(frames.at(-1).physics.steps>25);assert(peak>0&&peak<.8,'Synthesized sound has a safe nonzero signal');
await page.click('#play');await page.waitForTimeout(150);await page.click('#play');
const paused=await page.evaluate(()=>({t:window.__film.time,playing:window.__film.playing}));assert(!paused.playing);await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>window.__film.time),paused.t,'Pause keeps time fixed');
await page.locator('#timeline').evaluate(e=>{e.value='10.5';e.dispatchEvent(new Event('input',{bubbles:true}));});assert(Math.abs(await page.evaluate(()=>window.__film.time)-10.5)<.01,'Timeline seeks through physical resimulation');
await page.click('#sound');assert.equal(await page.evaluate(()=>window.__film.sound.enabled),false);
await page.evaluate(()=>{window.__film.restart();window.__film.pause();});assert.equal(await page.evaluate(()=>window.__film.time),0);
assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(failed,[]);
const report={result:'PASS',origin:'file://',continuousPlayback:frames,maxObservedAudioPeak:peak,consoleErrors:errors,networkRequests:external,failedRequests:failed,controls:'pause, resume, replay, seek, mute passed'};
await writeFile('preview/browser-report.json',JSON.stringify(report,null,2));console.log('PASS',JSON.stringify({peak,errors,external,failed,controls:true}));await browser.close();

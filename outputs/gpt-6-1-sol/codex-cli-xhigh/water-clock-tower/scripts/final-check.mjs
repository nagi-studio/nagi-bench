import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/opt/agentbench/browser/chromium_headless_shell-1228/chrome-linux/headless_shell',chromiumSandbox:false,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.on('console',m=>console.log('console',m.type(),m.text()));page.on('pageerror',e=>console.log('ERROR',e.stack));
page.on('requestfailed',r=>console.log('REQUEST FAILED',r.url()));
console.log('Opening file URL');
await page.goto('file:///workspace/dist/index.html',{waitUntil:'domcontentloaded',timeout:120000});
console.log('DOM loaded');
await page.waitForFunction(()=>window.__film,{timeout:120000});
await page.evaluate(()=>window.__film.pause());
console.log('Ready',await page.evaluate(()=>({time:window.__film.time,state:window.__film.physics,calls:window.__film.drawCalls,styles:document.styleSheets.length,title:getComputedStyle(document.querySelector('h1')).fontSize})));
await mkdir('preview/final',{recursive:true});const cdp=await page.context().newCDPSession(page);
for(const t of [0,6.5,11,17.5,23.5,30]){
  await page.evaluate(t=>window.__film.seek(t),t);
  console.log('Seek',t,await page.evaluate(()=>window.__film.physics));await page.waitForTimeout(700);
  const shot=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:84,captureBeyondViewport:false});await writeFile(`preview/final/t${t}.jpg`,Buffer.from(shot.data,'base64'));
  console.log('Saved',t);
}
await page.click('#sound');
console.log('Audio button',await page.locator('#sound-text').textContent());
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{window.__film.pause();window.__film.seek(0)});await page.waitForTimeout(1100);const mshot=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:84,captureBeyondViewport:false});await writeFile('preview/final/mobile.jpg',Buffer.from(mshot.data,'base64'));
await browser.close();

// Dev-only smoke check: load the preview site in real Chrome, surface console
// errors, and verify the hero intro animation actually completes.
import puppeteer from 'puppeteer-core'

const url = process.argv[2] ?? 'http://localhost:4173/nagi-bench/'
const shot = process.argv[3] ?? '/tmp/nagi-bench-live.png'
const theme = process.argv[4] // optional: 'light' | 'dark'

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 2200 })
if (theme === 'light' || theme === 'dark') {
  await page.evaluateOnNewDocument((t: string) => {
    localStorage.setItem('nagi-bench-theme', t)
  }, theme)
}

const errors: string[] = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3500))

const heroState = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-hero-fade]')).map(
    (el) => getComputedStyle(el).opacity,
  ),
)
await page.screenshot({ path: shot as `${string}.png`, fullPage: false })
await browser.close()

console.log('hero opacities:', heroState.join(','))
console.log('console errors:', errors.length ? errors.join(' | ') : 'none')

// Dev-only: scroll through the page (triggering ScrollTrigger reveals), then
// capture a full-page screenshot.
import puppeteer from 'puppeteer-core'

const url = process.argv[2] ?? 'http://localhost:4173/nagi-bench/'
const shot = process.argv[3] ?? '/tmp/nagi-bench-full.png'
const theme = process.argv[4]

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 960 })
if (theme === 'light' || theme === 'dark') {
  await page.evaluateOnNewDocument((t: string) => {
    localStorage.setItem('nagi-bench-theme', t)
  }, theme)
}

const errors: string[] = []
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto(url, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1500))

const height = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < height; y += 500) {
  await page.evaluate((py: number) => window.scrollTo(0, py), y)
  await new Promise((r) => setTimeout(r, 120))
}
await new Promise((r) => setTimeout(r, 1200))
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 600))

await page.screenshot({ path: shot as `${string}.png`, fullPage: true })
await browser.close()
console.log('page errors:', errors.length ? errors.join(' | ') : 'none')

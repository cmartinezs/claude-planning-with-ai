#!/usr/bin/env node
/**
 * Visual verification suite for the landing page.
 *
 * Checks horizontal overflow at multiple viewport widths and captures
 * screenshots of selected sections. Read-only; requires the dev server
 * (`npm run dev`) or any served build to be running.
 *
 * Usage:
 *   node scripts/verify.js [options]
 *
 * Options:
 *   --url <url>        Base URL (default: autodetect localhost:3000/3001)
 *   --widths <list>    Comma-separated viewport widths (default: 320,390,768)
 *   --shots <list>     Comma-separated CSS selectors to screenshot at the
 *                      first width (default: body,#installation,#what-it-does)
 *   --out <dir>        Screenshot output dir (default: scripts/shots)
 *   --click <list>     Comma-separated CSS selectors to click (in order)
 *                      after load, before measuring/shooting
 *   --settle <ms>      Wait after each click, e.g. for animations (default: 4000)
 *   --eval <expr>      JS expression evaluated in the page at each width;
 *                      result is printed as JSON (e.g. DOM/style assertions)
 *
 * Playwright is not a dependency of this package. The script resolves
 * playwright-core from PLAYWRIGHT_ROOT (a node_modules path) or from
 * sibling projects that already have it installed.
 */
const fs = require('fs')
const path = require('path')

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

function loadChromium() {
  const roots = [
    process.env.PLAYWRIGHT_ROOT,
    path.join(__dirname, '..', 'node_modules'),
    '/home/carlos/projects/cmartinezs.github.io/node_modules',
  ].filter(Boolean)
  for (const name of ['playwright-core', 'playwright']) {
    for (const root of [null, ...roots]) {
      try {
        const resolved = root ? require.resolve(name, { paths: [root] }) : name
        return require(resolved).chromium
      } catch {}
    }
  }
  throw new Error(
    'playwright-core not found. Set PLAYWRIGHT_ROOT to a node_modules dir that contains it.'
  )
}

async function detectUrl() {
  for (const port of [3000, 3001, 3002]) {
    try {
      const res = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(2000) })
      if (res.ok) return `http://localhost:${port}`
    } catch {}
  }
  throw new Error('No dev server found on ports 3000-3002. Run `npm run dev` first.')
}

async function openPage(browser, url, width) {
  const page = await browser.newPage({ viewport: { width, height: 844 } })
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2000)
  // Dismiss the splash screen; tolerate fade-in animations and dev-server
  // reloads by force-clicking and falling back to its auto-dismiss.
  try {
    await page.locator('button.underline').first().click({ timeout: 3000, force: true })
  } catch {}
  try {
    await page.waitForFunction(() => {
      const el = document.querySelector('#what-it-does')
      return !!el && el.getBoundingClientRect().height > 0
    }, { timeout: 30000 })
  } catch {}
  await page.waitForTimeout(1000)
  return page
}

function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const clipped = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX
        if (ox !== 'visible') return true
      }
      return false
    }
    const offenders = []
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.right > doc.clientWidth + 1 && !clipped(el)) {
        offenders.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 80),
          right: Math.round(r.right),
        })
      }
    })
    return { overflow: doc.scrollWidth - doc.clientWidth, offenders: offenders.slice(0, 8) }
  })
}

async function shoot(page, selector, file) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
  }, selector)
  await page.waitForTimeout(800)
  await page.screenshot({ path: file })
}

;(async () => {
  const widths = arg('widths', '320,390,768').split(',').map(Number)
  const shots = arg('shots', 'body,#installation,#what-it-does').split(',')
  const outDir = arg('out', path.join(__dirname, 'shots'))
  const clicks = arg('click', '').split(',').filter(Boolean)
  const settle = Number(arg('settle', '4000'))
  const evalExpr = arg('eval', null)
  const url = arg('url', null) || (await detectUrl())

  const chromium = loadChromium()
  const browser = await chromium.launch()
  let failed = false

  for (const width of widths) {
    const page = await openPage(browser, url, width)
    for (const sel of clicks) {
      await page.locator(sel).first().click()
      await page.waitForTimeout(settle)
    }
    const { overflow, offenders } = await measureOverflow(page)
    const status = overflow === 0 ? 'OK ' : 'FAIL'
    console.log(`[${status}] ${width}px — horizontal overflow: ${overflow}px`)
    if (evalExpr) {
      const result = await page.evaluate(`(() => (${evalExpr}))()`)
      console.log(`       eval: ${JSON.stringify(result)}`)
    }
    if (overflow > 0) {
      failed = true
      offenders.forEach((o) => console.log(`       ${o.tag} right=${o.right} ${o.cls}`))
    }
    if (width === widths[0]) {
      fs.mkdirSync(outDir, { recursive: true })
      for (const sel of shots) {
        const name = sel.replace(/[^a-z0-9-]/gi, '') || 'body'
        const file = path.join(outDir, `${name}-${width}.png`)
        await shoot(page, sel, file)
        console.log(`       shot: ${file}`)
      }
    }
    await page.close()
  }

  await browser.close()
  process.exit(failed ? 1 : 0)
})().catch((err) => {
  console.error(err.message)
  process.exit(1)
})

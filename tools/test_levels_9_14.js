// Headless playthrough of levels 9–14, plus a short smoke of levels 1 and 8.
// Usage: node tools/test_levels_9_14.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('/tmp/pw/node_modules/playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const FILE = 'file://' + ROOT + '/index.html';
const CHROME = '/usr/local/bin/google-chrome';

function shot(page, name) {
  return page.screenshot({ path: path.join(OUT, name), type: 'jpeg', quality: 68 });
}

async function boot(browser, level, opts) {
  const page = await browser.newPage({ viewport: opts.viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const q = 'level=' + level + '&demo=1&capture=1' + (opts.touch ? '&touch=1' : '&touch=0');
  await page.goto(FILE + '?' + q, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction((n) => window.__rpdReady && window.__rpdAssets2 && window.__rpd.state().level === n && window.__rpd.state().scene === 'play', level, { timeout: 30000 });
  await page.evaluate(() => window.__rpd.freeze(true));
  return { page, errors };
}

async function play(page, wallMs) {
  const t0 = Date.now();
  let st = await page.evaluate(() => window.__rpd.state());
  let steps = 0;
  while (Date.now() - t0 < wallMs) {
    st = await page.evaluate(() => window.__rpd.advance(0.5));
    steps++;
    if (st.scene === 'complete' || st.scene === 'over' || st.scene === 'soon') break;
    if (steps > 2000) break;
  }
  st.steps = steps;
  st.wall = Date.now() - t0;
  return st;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required']
  });
  const report = [];
  const desktop = { width: 1280, height: 720 };
  const mobile = { width: 844, height: 390 };

  // Chronicle and a level card, once art has loaded.
  {
    const page = await browser.newPage({ viewport: desktop });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(FILE + '?unlock=1&touch=0', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__rpdReady && window.__rpdAssets2, null, { timeout: 30000 });
    await page.evaluate(() => { window.__rpd.freeze(true); window.__rpd.scene('select'); window.__rpd.render(); });
    await shot(page, '00_chronicle.jpg');
    await page.evaluate(() => { window.__rpd.scene('card', 8); window.__rpd.advance(0.4); window.__rpd.render(); });
    await shot(page, '00_level9_card.jpg');
    report.push({ what: 'menus', errors: errors.slice() });
    await page.close();
  }

  for (const n of [9, 10, 11, 12, 13, 14]) {
    const desk = await boot(browser, n, { viewport: desktop, touch: false });
    await desk.page.evaluate(() => window.__rpd.advance(1.2));
    await shot(desk.page, 'L' + n + '_desktop.jpg');
    const st = await play(desk.page, n === 9 ? 90000 : n === 14 ? 90000 : 70000);
    if (st.scene === 'complete') await shot(desk.page, 'L' + n + '_complete.jpg');
    let soon = null;
    if (n === 14 && st.scene === 'complete') {
      soon = await desk.page.evaluate(() => { window.__rpd.press('confirm'); return window.__rpd.advance(0.6); });
      await shot(desk.page, 'L14_to_be_continued.jpg');
    }
    report.push({
      level: n, viewport: 'desktop', scene: st.scene, seg: st.seg, segType: st.segType,
      pips: st.pips, fail: st.fail, stars: st.result && st.result.stars, score: st.score,
      wall: st.wall, steps: st.steps, soon: soon && soon.scene, errors: desk.errors.slice()
    });
    await desk.page.close();

    const mob = await boot(browser, n, { viewport: mobile, touch: true });
    await mob.page.evaluate(() => window.__rpd.advance(2.4));
    await shot(mob.page, 'L' + n + '_mobile.jpg');
    report.push({ level: n, viewport: 'mobile', scene: 'shot', segType: (await mob.page.evaluate(() => window.__rpd.state())).segType, errors: mob.errors.slice() });
    await mob.page.close();
    console.log('finished', n, JSON.stringify(report[report.length - 2]));
  }

  // Smoke: levels 1 and 8 still boot and run without errors.
  for (const n of [1, 8]) {
    const b = await boot(browser, n, { viewport: desktop, touch: false });
    const st = await b.page.evaluate(() => window.__rpd.advance(4));
    report.push({ level: n, viewport: 'smoke', scene: st.scene, segType: st.segType, fail: st.fail, errors: b.errors.slice() });
    await b.page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  const bad = report.filter((r) => (r.errors && r.errors.length) || r.scene === 'over' || (r.level >= 9 && r.viewport === 'desktop' && r.scene !== 'complete'));
  console.log(JSON.stringify(report, null, 2));
  if (bad.length) {
    console.error('FAILURES', bad.length);
    process.exit(1);
  }
  console.log('ALL OK');
})().catch((e) => { console.error(e); process.exit(1); });

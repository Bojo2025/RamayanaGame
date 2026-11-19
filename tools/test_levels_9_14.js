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
  await page.waitForFunction((n) => window.__rpdReady && window.__rpdAssets2 && (n < 25 || window.__rpdAssets3) && window.__rpd.state().level === n && window.__rpd.state().scene === 'play', level, { timeout: 30000 });
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
    if (st.scene === 'complete' || st.scene === 'over' || st.scene === 'soon' || st.scene === 'credits') break;
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
    await page.evaluate(() => { window.__rpd.freeze(true); window.__rpd.scene('select'); window.__rpd.advance(2.6); });
    await shot(page, '00_chronicle.jpg');
    await page.evaluate(() => { window.__rpd.scene('card', 8); window.__rpd.advance(0.4); window.__rpd.render(); });
    await shot(page, '00_level9_card.jpg');
    report.push({ what: 'menus', errors: errors.slice() });
    await page.close();
  }

  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]) {
    const desk = await boot(browser, n, { viewport: desktop, touch: false });
    await desk.page.evaluate(() => window.__rpd.advance(1.2));
    await shot(desk.page, 'L' + n + '_desktop.jpg');
    const st = await play(desk.page, n === 9 ? 90000 : n === 14 ? 90000 : 70000);
    if (st.scene === 'complete') await shot(desk.page, 'L' + n + '_complete.jpg');
    let soon = null;
    if (n === 30 && st.scene === 'complete') {
      soon = await desk.page.evaluate(() => { window.__rpd.press('confirm'); window.__rpd.advance(0.05); return window.__rpd.advance(5.4); });
      if (!soon || soon.scene !== 'credits') throw new Error('credits did not open: ' + (soon && soon.scene));
      await shot(desk.page, 'L30_credits.jpg');
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

  // Regression: story stats count again on a second play, retry restores pickups, Enter continues.
  const reg = await boot(browser, 30, { viewport: desktop, touch: false });
  let st = await play(reg.page, 40000);
  if (st.scene !== 'complete') throw new Error('L30 first play did not complete');
  const firstVow = st.stats.vow, firstSouth = st.stats.south;
  if (!firstVow || !firstSouth) throw new Error('L30 first play missing story stats ' + firstVow + ' ' + firstSouth);
  st = await reg.page.evaluate(() => { window.__rpd.advance(0.8); window.__rpd.press('confirm'); return window.__rpd.advance(0.4); });
  if (st.scene !== 'credits') throw new Error('Enter on the completion card did not continue: ' + st.scene);
  await reg.page.evaluate(() => window.__rpd.startLevel(30, 0));
  st = await play(reg.page, 40000);
  if (st.scene !== 'complete') throw new Error('L30 replay did not complete');
  if ((st.stats.vow || 0) < 1 || (st.stats.south || 0) < 1) throw new Error('L30 replay dropped story stats ' + JSON.stringify(st.stats));
  report.push({ level: 30, viewport: 'regress', scene: 'ok', what: 'replay-stats', vow: st.stats.vow, south: st.stats.south, errors: reg.errors.slice() });
  await reg.page.close();

  const ret = await boot(browser, 1, { viewport: desktop, touch: false });
  let mid;
  for (let i = 0; i < 400; i++) {
    mid = await ret.page.evaluate(() => window.__rpd.advance(0.4));
    if ((mid.stats.standards || 0) >= 1 && mid.score > 100) break;
  }
  if ((mid.stats.standards || 0) < 1) throw new Error('could not collect a war-standard');
  let over = await ret.page.evaluate(() => { window.__rpd.forceFail(); return window.__rpd.advance(0.3); });
  if (over.scene !== 'over') throw new Error('Try Again screen did not open');
  let back = await ret.page.evaluate(() => { window.__rpd.advance(0.4); window.__rpd.press('confirm'); return window.__rpd.advance(0.3); });
  if (back.scene !== 'play' || back.seg !== mid.seg) throw new Error('Enter on Not Yet did not restart the section');
  if ((back.stats.standards || 0) !== 0 || back.score >= mid.score) throw new Error('retry kept score/stats ' + back.score + ' ' + back.stats.standards);
  report.push({ level: 1, viewport: 'regress', scene: 'ok', what: 'retry-reset', errors: ret.errors.slice() });
  await ret.page.close();

  const fly = await boot(browser, 29, { viewport: desktop, touch: false, seg: 1 });
  over = await fly.page.evaluate(() => { window.__rpd.forceFail(); return window.__rpd.advance(0.3); });
  if (over.scene !== 'over') throw new Error('L29 Not Yet did not open');
  back = await fly.page.evaluate(() => { window.__rpd.advance(0.4); window.__rpd.press('confirm'); return window.__rpd.advance(0.3); });
  if (back.scene !== 'play') throw new Error('Enter on L29 Not Yet did not restart: ' + back.scene);
  report.push({ level: 29, viewport: 'regress', scene: 'ok', what: 'enter-retry', errors: fly.errors.slice() });
  await fly.page.close();

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

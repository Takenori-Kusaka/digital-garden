// ビルド済みサイトのスクリーンショットを撮る(見た目の確認用。CI では使わない)。
//   node scripts/screenshot.mjs <出力先ディレクトリ>
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2] || '.tmp';
fs.mkdirSync(out, { recursive: true });
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'preview', '--port', '4399'], { stdio: 'ignore', shell: true });
const base = 'http://localhost:4399/digital-garden/';
const wait = async () => {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(base); if (r.ok) return; } catch { /* まだ */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('preview が起動しません');
};
try {
  await wait();
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  for (const [name, w] of [['desktop', 1280], ['phone', 390]]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    for (const p of ['', 'about/', 'career/']) {
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(out, `${name}-${p.replace('/', '') || 'index'}.png`), fullPage: false });
    }
    await page.close();
  }
  await browser.close();
  console.log('ok');
} finally {
  server.kill();
  spawn('taskkill', ['/F', '/T', '/PID', String(server.pid)], { stdio: 'ignore', shell: true });
}

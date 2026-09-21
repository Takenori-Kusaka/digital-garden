import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4329;
const URL = `http://localhost:${PORT}/digital-garden/resume/`;
const DIST_DIR = resolve(process.cwd(), 'dist');
const OUTPUTS = [resolve(DIST_DIR, 'resume.pdf'), resolve(process.cwd(), 'public/resume.pdf')];

// ATS が読み取れるよう、1段組・テキスト選択可能・ページ番号付きで出力する
const PDF_OPTIONS = {
  format: 'A4',
  printBackground: true,
  margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="width:100%; font-size:9px; color:#6b7280; text-align:right; padding-right:16mm;">' +
    '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
};

async function waitUrl(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function main() {
  console.log('Starting preview server...');
  const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    stdio: 'ignore',
    shell: true,
  });

  try {
    await waitUrl(URL);
    console.log(`Server ready at ${URL}`);

    if (!existsSync(DIST_DIR)) {
      mkdirSync(DIST_DIR, { recursive: true });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });

    for (const path of OUTPUTS) {
      await page.pdf({ path, ...PDF_OPTIONS });
      console.log(`PDF written to ${path}`);
    }

    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

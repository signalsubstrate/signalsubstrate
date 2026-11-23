import fs from 'node:fs';
import path from 'node:path';

const START_MARKER = '<!-- signal-substrate-nav:start -->';
const END_MARKER = '<!-- signal-substrate-nav:end -->';

function parseArgs(argv) {
  const options = {
    dir: 'public/viz',
    home: '/',
    useRemoteScript: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dir' && argv[i + 1]) {
      options.dir = argv[i + 1];
      i += 1;
    } else if (arg === '--home' && argv[i + 1]) {
      options.home = argv[i + 1];
      i += 1;
    } else if (arg === '--script') {
      options.useRemoteScript = true;
    }
  }

  return options;
}

function normalizeBaseUrl(home) {
  if (home === '/') return '';
  return home.endsWith('/') ? home.slice(0, -1) : home;
}

function buildNavSnippet(homeUrl, useRemoteScript) {
  const base = normalizeBaseUrl(homeUrl);
  const indexHref = base === '' ? '/' : `${base}/`;
  const aboutHref = `${base}/about`;
  const rssHref = `${base}/rss.xml`;

  if (useRemoteScript) {
    const scriptSrc = `${base || 'https://signalsubstrate.github.io'}/nav.js`;
    return `${START_MARKER}\n<script src="${scriptSrc}" defer></script>\n${END_MARKER}`;
  }

  return `${START_MARKER}
<style id="ss-top-nav-style">
  #ss-top-nav {
    box-sizing: border-box;
    width: 100%;
    background-color: #20150e;
    border-bottom: 1px solid #352419;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }
  #ss-top-nav *,
  #ss-top-nav *::before,
  #ss-top-nav *::after {
    box-sizing: border-box;
  }
  #ss-top-nav .ss-nav-inner {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 1.5rem;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  #ss-top-nav a {
    color: #e6d9c8;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    white-space: nowrap;
    transition: color 140ms ease;
  }
  #ss-top-nav a:hover {
    color: #ffffff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  #ss-top-nav a:focus-visible {
    outline: 2px solid #0969da;
    outline-offset: 2px;
    border-radius: 2px;
  }
  #ss-top-nav .ss-nav-home {
    font-weight: 600;
    color: #f4ede4;
  }
  #ss-top-nav .ss-nav-links {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }
  #ss-top-nav .ss-nav-links a {
    color: #c2ab90;
  }
  #ss-top-nav .ss-nav-sep {
    color: #6b5344;
    user-select: none;
  }
  @media (max-width: 600px) {
    #ss-top-nav .ss-nav-inner {
      padding: 0 1.125rem;
      min-height: 46px;
    }
    #ss-top-nav a {
      min-height: 44px;
    }
  }
</style>
<nav id="ss-top-nav" aria-label="Return to Signal & Substrate">
  <div class="ss-nav-inner">
    <a href="${indexHref}" class="ss-nav-home">&larr; Signal &amp; Substrate</a>
    <div class="ss-nav-links">
      <a href="${aboutHref}">About</a>
      <span class="ss-nav-sep" aria-hidden="true">/</span>
      <a href="${rssHref}">RSS</a>
    </div>
  </div>
</nav>
${END_MARKER}`;
}

function collectHtmlFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function injectNav(html, snippet) {
  const existingPattern = new RegExp(
    `${START_MARKER}[\\s\\S]*?${END_MARKER}`,
    'm'
  );

  if (existingPattern.test(html)) {
    return html.replace(existingPattern, snippet);
  }

  const bodyOpenMatch = html.match(/<body\b[^>]*>/i);
  if (bodyOpenMatch && bodyOpenMatch.index !== undefined) {
    const insertAt = bodyOpenMatch.index + bodyOpenMatch[0].length;
    return `${html.slice(0, insertAt)}\n${snippet}\n${html.slice(insertAt)}`;
  }

  return `${snippet}\n${html}`;
}

function main() {
  const { dir, home, useRemoteScript } = parseArgs(process.argv.slice(2));
  const targetDir = path.resolve(process.cwd(), dir);
  const htmlFiles = collectHtmlFiles(targetDir);

  if (htmlFiles.length === 0) {
    console.log(`[inject-nav] No HTML files found in ${dir}`);
    return;
  }

  const snippet = buildNavSnippet(home, useRemoteScript);
  let updatedCount = 0;

  for (const filePath of htmlFiles) {
    const original = fs.readFileSync(filePath, 'utf8');
    if (original.includes('data-ss-nav="skip"')) {
      continue;
    }
    const updated = injectNav(original, snippet);
    if (updated !== original) {
      fs.writeFileSync(filePath, updated, 'utf8');
      updatedCount += 1;
    }
  }

  console.log(
    `[inject-nav] Checked ${htmlFiles.length} HTML file(s) in ${dir}; updated ${updatedCount}.`
  );
}

main();

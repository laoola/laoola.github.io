import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const siteOrigin = 'https://laoola.github.io';

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtmlFiles(fullPath) : [fullPath];
  }));

  return files.flat().filter((file) => file.endsWith('.html'));
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

const htmlFiles = await listHtmlFiles(distDir);
const missing = [];
let checkedCount = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relativeFile = path.relative(distDir, file).replaceAll(path.sep, '/');
  const pagePath = relativeFile === 'index.html'
    ? '/'
    : `/${relativeFile.replace(/index\.html$/, '')}`;

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const rawTarget = match[1];
    if (/^(?:#|data:|javascript:|mailto:|tel:|\/\/)/i.test(rawTarget)) continue;

    const url = new URL(rawTarget, new URL(pagePath, siteOrigin));
    if (url.origin !== siteOrigin) continue;

    checkedCount += 1;
    let pathname = url.pathname;
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
      // Keep the encoded path so the report still identifies the broken target.
    }

    const relativeTarget = pathname.replace(/^\/+/, '');
    const candidates = pathname.endsWith('/')
      ? [path.join(distDir, relativeTarget, 'index.html')]
      : [
          path.join(distDir, relativeTarget),
          path.join(distDir, relativeTarget, 'index.html'),
          path.join(distDir, `${relativeTarget}.html`),
        ];

    let found = false;
    for (const candidate of candidates) {
      if (await isFile(candidate)) {
        found = true;
        break;
      }
    }

    if (!found) missing.push(`${relativeFile}: ${rawTarget}`);
  }
}

if (missing.length > 0) {
  console.error(`Found ${missing.length} broken internal link(s):`);
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${checkedCount} internal link/asset reference(s) across ${htmlFiles.length} HTML page(s).`);
}

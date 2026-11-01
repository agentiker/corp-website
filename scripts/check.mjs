import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicRoot = join(root, 'public');
const html = await readFile(join(publicRoot, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs must be unique.');
for (const [, anchor] of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(anchor), `Broken section link: #${anchor}`);
for (const [, ref] of html.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) for (const id of ref.split(/\s+/)) assert(ids.includes(id), `Broken ARIA reference: ${id}`);
for (const [, asset] of html.matchAll(/\b(?:src|href)="\.\/([^"]+)"/g)) await access(join(publicRoot, asset));
const css = await readFile(join(publicRoot, 'styles.css'), 'utf8');
for (const [, asset] of css.matchAll(/url\("\.\/([^"]+)"\)/g)) await access(join(publicRoot, asset));
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'The page needs one primary heading.');
assert(html.includes('lang="zh-CN"'), 'The document language must be declared.');
assert(html.includes('示例数据') && html.includes('不代表已交付案例'), 'The illustrative workflow must be disclosed.');
for (const [, id] of (await readFile(join(publicRoot, 'app.js'), 'utf8')).matchAll(/querySelector\('#([^']+)'\)/g)) assert(ids.includes(id), `Missing JavaScript DOM target: #${id}`);
async function checkScripts(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'fonts') await checkScripts(path); }
    else if (/\.(?:mjs|js)$/.test(path)) {
      const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
    }
  }
}
await checkScripts(publicRoot);
await checkScripts(join(root, 'scripts'));
console.log('Passed: anchors, unique IDs, ARIA references, local assets, script targets, demo disclosure, and JavaScript syntax.');

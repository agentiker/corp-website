import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
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

// Validate nested case routes as well as their links back to the homepage.
async function checkPages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await checkPages(path); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const content = await readFile(path, 'utf8');
    const pageIds = [...content.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(pageIds.length, new Set(pageIds).size, `Duplicate IDs in ${path}`);
    assert.equal([...content.matchAll(/<h1\b/g)].length, 1, `Expected one h1 in ${path}`);
    for (const [, ref] of content.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) {
      for (const id of ref.split(/\s+/)) assert(pageIds.includes(id), `Broken ARIA reference: ${path} #${id}`);
    }
    for (const [, link] of content.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(link)) continue;
      const [local, hash] = link.split('#');
      const target = local ? resolve(dirname(path), local) : path;
      await access(target);
      if (hash && target.endsWith('.html')) {
        const targetContent = target === path ? content : await readFile(target, 'utf8');
        assert(targetContent.includes(`id="${hash}"`), `Broken cross-page link: ${path} → ${link}`);
      }
    }
  }
}
await checkPages(publicRoot);
const caseRoot = join(publicRoot, 'cases/china-logistics-ai-ocr');
const caseHtml = await readFile(join(caseRoot, 'index.html'), 'utf8');
const caseScript = await readFile(join(caseRoot, 'case.js'), 'utf8');
for (const [, id] of caseScript.matchAll(/byId\('([^']+)'\)/g)) assert(caseHtml.includes(`id="${id}"`), `Missing case DOM target: ${id}`);
for (const [, asset] of caseScript.matchAll(/src:'([^']+)'/g)) await access(resolve(caseRoot, asset));
const caseImages = (await readdir(join(caseRoot, 'images'))).filter((name) => name.endsWith('.png'));
assert.equal(caseImages.length, 7, 'The case should ship seven original UI screenshots.');
assert(!caseImages.some((name) => name.startsWith('p05')), 'Private personal documents must not ship.');
assert(caseHtml.includes('方案建设目标') && caseHtml.includes('目前暂无实际效果数据'), 'Case goals must remain distinct from measured results.');
console.log('Passed: homepage and case links, unique IDs, ARIA, local assets, screenshot scope, stage labels, script targets and JavaScript syntax.');

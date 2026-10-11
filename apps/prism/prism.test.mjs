import { test } from 'node:test';
import assert from 'node:assert/strict';
import prism from './worker.mjs';
import microapps from './microapps-worker.mjs';

const origin = 'https://jemueldaniel.website';
const get = (worker, path, method='GET') =>
  worker.fetch(new Request(origin+path, {method}));
const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const unique = html => {
  const values = ids(html);
  assert.equal(values.length, new Set(values).size, 'Duplicate HTML element IDs');
};
const read = async (worker, path) => {
  const response = await get(worker, path);
  assert.equal(response.status, 200, path);
  return response.text();
};

test('homepage prioritizes Ask Daniel and preserves original portfolio essentials', async () => {
  const html = await read(prism, '/');
  unique(html);
  assert.match(html, /id="topAskDaniel"/);
  assert.match(html, /function openJDChat\(\)/);
  assert.ok(html.includes("location.hash==='#ask'"));
  assert.match(html, /href="\/resume"/);
  assert.match(html, /href="\/cover-letter"/);
  assert.equal((html.match(/class="cap case-study"/g) || []).length, 5);
  assert.ok(html.includes('prefers-reduced-motion'));
});

test('catalog exposes ten distinct visuals and exactly scoped statuses', async () => {
  const html = await read(prism, '/apps/');
  unique(html);
  assert.equal((html.match(/class="card" data-stage/g) || []).length, 10);
  assert.equal((html.match(/class="app-art /g) || []).length, 10);
  assert.equal((html.match(/data-stage="live"/g) || []).length, 4);
  assert.equal((html.match(/data-stage="local"/g) || []).length, 6);
  assert.equal((html.match(/data-stage="pending"/g) || []).length, 0);
  for (const path of [
    '/apps/live/#workflow','/apps/live/#knowledge','/apps/agent/',
    '/apps/social/','/apps/pay/','/apps/workbench/',
    '/apps/code/','/apps/contract/','/apps/interface/','/apps/project/'
  ]) assert.ok(html.includes('href="'+path+'"'), 'Missing '+path);
  assert.match(html, /id="appSearch"/);
  assert.match(html, /href="\/#ask"/);
});

test('each independent app page is semantically complete and honest', async () => {
  for (const slug of ['code','project','interface','social','contract']) {
    const html = await read(microapps, '/apps/'+slug+'/');
    unique(html);
    assert.match(html, /<main\b/);
    assert.match(html, /href="\/#ask"/);
    assert.ok(html.includes('prefers-reduced-motion'));
    assert.match(html, /<h1>/);
  }
  const contract = await read(microapps, '/apps/contract/');
  assert.match(contract, /Run a real, pinned EthereumJS EVM/);
  assert.match(contract, /No deployed contract, blockchain state, Solidity compiler/);
});

test('known browser modules are served, unknown nested paths rejected', async () => {
  for (const slug of ['code','project','interface','social','contract']) {
    const response = await get(microapps, '/apps/'+slug+'/app.js');
    assert.equal(response.status, 200, slug);
    assert.match(response.headers.get('content-type'), /javascript/);
    assert.ok((await response.text()).length > 500);
  }
  for (const path of [
    '/apps/code/app.js/evil','/apps/code/unexpected',
    '/apps/contract/app.js/evil','/apps/interface/other','/apps/unknown/'
  ]) assert.equal((await get(microapps, path)).status, 404, path);
  assert.equal((await get(microapps, '/apps/social/', 'POST')).status, 405);
  assert.equal((await get(prism, '/', 'POST')).status, 405);
});

test('public pages contain no known private markers or external script tags', async () => {
  for (const [worker, paths] of [
    [prism, ['/','/apps/']],
    [microapps, ['/apps/social/','/apps/contract/','/apps/code/']]
  ]) {
    for (const path of paths) {
      const html = await read(worker, path);
      assert.ok(!/jemueldanieljobs|castractseedprompt|BEGIN PRIVATE KEY/i.test(html), path);
      assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(html), path);
    }
  }
});

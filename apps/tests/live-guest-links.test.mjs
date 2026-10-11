import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const apps=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('recruiters can open the live D1 studio from both pages',()=>{
 assert.ok(home.includes('href="/apps/live/"'));
 assert.ok(apps.includes('href="/apps/live/"'));
 assert.ok(apps.split('href="/apps/live/').length-1>=3);
});
test('server-backed studio is accurately separated from six local previews',()=>{
 assert.equal(apps.split('class="tag">Browser preview</span>').length-1,6);
 assert.equal(apps.split('class="card"').length-1,10);
 assert.match(apps,/24-hour test workspaces/);
 assert.match(apps,/full suite acceptance are not yet qualified/);
 assert.ok(home.includes('Cloudflare D1'));
});

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');

function setup(fetchImpl) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'https://kformula.vercel.app/',
    pretendToBeVisual: true
  });
  dom.window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
  dom.window.AbortController = globalThis.AbortController;
  dom.window.fetch = fetchImpl;
  dom.window.eval(app);
  return dom;
}

function search(dom, query) {
  const input = dom.window.document.getElementById('q');
  input.value = query;
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  dom.window.document.getElementById('go').click();
}

const quickScanPayload = {
  cached: false,
  result: {
    identity_status: 'matched',
    confidence: 'medium',
    product: { brand: 'TIRTIR', name: 'Milk Skin Toner', category: 'Toner' },
    summary: 'A provisional evidence summary.',
    korea_popularity: { level: 'moderate', explanation: 'Korean evidence exists.', evidence_type: 'VERIFIED FACT' },
    global_hype: { level: 'high', explanation: 'Global retail visibility is high.', evidence_type: 'AI-ASSISTED ESTIMATE' },
    gap: { verdict: 'GLOBAL_GT_KOREA', explanation: 'Global signal appears larger.' },
    people_like: ['Easy layering'],
    repeated_complaints: ['Results may feel subtle'],
    formula_history: { verdict: 'not_confirmed', explanation: 'No dated official comparison.' },
    regional_version: { verdict: 'not_confirmed', explanation: 'No material difference confirmed.' },
    varda_take: { text: 'Buy for texture, not dramatic results.', confidence: 'medium' },
    evidence_limits: ['No comparable Korean sales ranking.'],
    sources: [{
      url: 'https://example.com/tirtir',
      title: 'Official product page',
      domain: 'example.com',
      evidence_type: 'VERIFIED FACT',
      market: 'Global'
    }]
  }
};

test('known products remain linked to verified reports without calling the API', () => {
  let calls = 0;
  const dom = setup(async () => { calls += 1; });
  search(dom, 'ANUA Heartleaf 77');
  const results = dom.window.document.getElementById('results').textContent;
  assert.match(results, /VERIFIED REPORT/);
  assert.match(results, /ANUA Heartleaf 77/);
  assert.equal(calls, 0);
  dom.window.close();
});

test('an unknown product starts a live scan and renders evidence labels and sources', async () => {
  let requestBody;
  const dom = setup(async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return { ok: true, json: async () => quickScanPayload };
  });
  search(dom, 'TIRTIR Milk Skin Toner');
  await new Promise(resolve => setTimeout(resolve, 25));
  const content = dom.window.document.getElementById('quickScanContent').textContent;
  assert.equal(requestBody.query, 'TIRTIR Milk Skin Toner');
  assert.match(content, /PROVISIONAL/);
  assert.match(content, /Korea popularity/);
  assert.match(content, /Official product page/);
  assert.match(content, /What remains uncertain/);
  dom.window.close();
});

test('API failures show an incomplete state instead of a fabricated verdict', async () => {
  const dom = setup(async () => ({
    ok: false,
    json: async () => ({ message: 'Live research is not configured yet.' })
  }));
  search(dom, 'Unknown Product 123');
  await new Promise(resolve => setTimeout(resolve, 25));
  const content = dom.window.document.getElementById('quickScanContent').textContent;
  assert.match(content, /SCAN INCOMPLETE/);
  assert.match(content, /not configured/);
  assert.doesNotMatch(content, /VÄRDA TAKE/);
  dom.window.close();
});

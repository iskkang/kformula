'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { _test } = require('../api/scan');

test('normalizes product queries without destroying useful SPF notation', () => {
  assert.equal(
    _test.normalizeQuery('  Beauty of Joseon — Relief Sun SPF50+  '),
    'beauty of joseon relief sun spf50+'
  );
  assert.equal(_test.normalizeQuery('https://example.com/p/123 ANUA 77%'), 'anua 77%');
});

test('parses fenced JSON returned by a research model', () => {
  const result = _test.parseJsonOutput('```json\n{"confidence":"low"}\n```');
  assert.deepEqual(result, { confidence: 'low' });
});

test('extracts and deduplicates only inspectable web-search sources', () => {
  const sources = _test.extractSearchSources({
    output: [
      {
        type: 'web_search_call',
        action: { sources: [
          { url: 'https://example.com/product?utm_source=test', title: 'Product' },
          { url: 'https://example.com/product', title: 'Duplicate' }
        ] }
      },
      {
        type: 'message',
        content: [{ annotations: [{ type: 'url_citation', url: 'https://reviews.example.org/a', title: 'Reviews' }] }]
      }
    ]
  });
  assert.equal(sources.length, 2);
  assert.equal(sources[0].url, 'https://example.com/product');
  assert.equal(sources[1].domain, 'reviews.example.org');
});

test('downgrades unsupported verdict values and ignores invented source URLs', () => {
  const result = _test.sanitizeResult({
    identity_status: 'matched',
    confidence: 'certain',
    product: { brand: 'ANUA', name: 'Heartleaf Toner', category: 'Toner' },
    korea_popularity: { level: 'number_one', evidence_type: 'VERIFIED FACT' },
    global_hype: { level: 'very_high', evidence_type: 'COMMUNITY SIGNAL' },
    gap: { verdict: 'GLOBAL_GT_KOREA' },
    formula_history: { verdict: 'definitely_same' },
    regional_version: { verdict: 'not_confirmed' },
    sources: [
      { url: 'https://invented.example/fake', evidence_type: 'VERIFIED FACT' },
      { url: 'https://official.example/product', evidence_type: 'VERIFIED FACT', market: 'Korea' }
    ]
  }, [{ url: 'https://official.example/product', title: 'Official', domain: 'official.example' }]);

  assert.equal(result.confidence, 'low');
  assert.equal(result.korea_popularity.level, 'not_enough_data');
  assert.equal(result.formula_history.verdict, 'not_confirmed');
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].url, 'https://official.example/product');
});

test('rejects browser requests coming from another origin', () => {
  assert.equal(_test.requestIsSameOrigin({ headers: { origin: 'https://kformula.vercel.app', host: 'kformula.vercel.app' } }), true);
  assert.equal(_test.requestIsSameOrigin({ headers: { origin: 'https://attacker.example', host: 'kformula.vercel.app' } }), false);
  assert.equal(_test.requestIsSameOrigin({ headers: { host: 'kformula.vercel.app' } }), true);
});

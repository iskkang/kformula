const products = [
  {
    id: 'anua-heartleaf-77',
    name: 'ANUA Heartleaf 77 Soothing Toner',
    brand: 'ANUA',
    category: 'Toner',
    url: '/products/anua-heartleaf-77-toner/',
    tone: 'tone-anua',
    korea: 'Established',
    global: 'Very high',
    gap: 'GLOBAL > KOREA',
    gapClass: 'global-gap',
    confidence: 'Medium',
    focus: 'Popularity gap + review intelligence',
    take: 'Real Korean use, but international visibility now appears larger than the domestic evidence captured.',
    tags: ['gap']
  },
  {
    id: 'boj-relief-sun',
    name: 'Beauty of Joseon Relief Sun',
    brand: 'Beauty of Joseon',
    category: 'Sunscreen',
    url: '/products/beauty-of-joseon-relief-sun-korean-vs-us/',
    tone: 'tone-boj',
    korea: 'Established',
    global: 'Very high',
    gap: 'GLOBAL ≥ KOREA',
    gapClass: 'global-gap',
    confidence: 'High on version',
    focus: 'Korea signal + U.S. version',
    take: 'Genuine domestic traction and exceptional global visibility; U.S. BOJ sunscreens are separate market products.',
    tags: ['gap', 'version']
  },
  {
    id: 'round-lab-birch',
    name: 'Round Lab Birch Juice Sunscreen',
    brand: 'Round Lab',
    category: 'Sunscreen',
    url: '/products/round-lab-birch-sunscreen-korean-vs-us/',
    tone: 'tone-round',
    korea: 'High',
    global: 'High',
    gap: 'KOREA ≥ GLOBAL',
    gapClass: 'korea-gap',
    confidence: 'Medium',
    focus: 'Domestic strength + U.S. UVLock',
    take: 'One of the clearer cases where Korean-market strength is not merely a global social-media story.',
    tags: ['gap', 'version']
  },
  {
    id: 'skin1004-hyalu-cica',
    name: 'SKIN1004 Hyalu-Cica Water-Fit Sun Serum',
    brand: 'SKIN1004',
    category: 'Sunscreen',
    url: '/products/skin1004-hyalu-cica-us-formula/',
    tone: 'tone-skin1004',
    korea: 'Not scored',
    global: 'High signal',
    gap: 'NOT ENOUGH DATA',
    gapClass: 'unknown-gap',
    confidence: 'High on U.S. formula',
    focus: 'Regional version check',
    take: 'The U.S. OTC formula is documented. A Korea–global popularity verdict still needs comparable domestic data.',
    tags: ['version', 'unclear']
  },
  {
    id: 'boj-tinted-fluid',
    name: 'Beauty of Joseon Daily Tinted Fluid',
    brand: 'Beauty of Joseon',
    category: 'Tinted sunscreen',
    url: '/products/beauty-of-joseon-daily-tinted-fluid-us-vs-eu/',
    tone: 'tone-tinted',
    korea: 'Not scored',
    global: 'Emerging',
    gap: 'NOT ENOUGH DATA',
    gapClass: 'unknown-gap',
    confidence: 'High on US/EU match',
    focus: 'Regional formula check',
    take: 'The brand states the U.S. and EU formulas match; domestic popularity is not yet scored.',
    tags: ['version', 'unclear']
  },
  {
    id: 'purito-soft-touch',
    name: 'Purito Daily Soft Touch Sunscreen',
    brand: 'Purito Seoul',
    category: 'Sunscreen',
    url: '/products/purito-daily-soft-touch-us-vs-korea/',
    tone: 'tone-purito',
    korea: 'Not scored',
    global: 'Visible',
    gap: 'NOT ENOUGH DATA',
    gapClass: 'unknown-gap',
    confidence: 'Low',
    focus: 'Evidence gap',
    take: 'Official evidence is still insufficient for a confident regional formula or popularity-gap verdict.',
    tags: ['unclear']
  }
];

const safe = value => String(value).replace(/[&<>'"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[char]);

function track(name, data = {}) {
  if (typeof window.va === 'function') window.va('event', { name, data });
  if (typeof window.gtag === 'function') window.gtag('event', name.toLowerCase().replaceAll(' ', '_'), data);
}

const cards = document.getElementById('cards');
function cardTemplate(product) {
  return `
    <article class="reality-card" data-tags="${product.tags.join(' ')}">
      <a class="card-image ${product.tone}" href="${product.url}" aria-label="Open ${safe(product.name)} reality check">
        <span>${safe(product.brand)}</span>
      </a>
      <div class="card-body">
        <div class="card-kicker"><span>${safe(product.category)}</span><span>Confidence · ${safe(product.confidence)}</span></div>
        <h3><a href="${product.url}">${safe(product.name)}</a></h3>
        <div class="signal-mini">
          <div><span>Korea</span><strong>${safe(product.korea)}</strong></div>
          <div><span>Global</span><strong>${safe(product.global)}</strong></div>
        </div>
        <div class="gap-badge ${product.gapClass}">${safe(product.gap)}</div>
        <p>${safe(product.take)}</p>
        <div class="card-actions">
          <a href="${product.url}">View evidence <span>→</span></a>
          <button class="save-product" type="button" data-product-id="${product.id}" aria-label="Save ${safe(product.name)}">Save</button>
        </div>
      </div>
    </article>`;
}

function renderCards(filter = 'all') {
  if (!cards) return;
  const list = filter === 'all' ? products : products.filter(product => product.tags.includes(filter));
  cards.innerHTML = list.map(cardTemplate).join('');
  syncSaveButtons();
}
renderCards();

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderCards(button.dataset.filter);
    track('Filter Reality Checks', { filter: button.dataset.filter });
  });
});

function findProducts(query) {
  return products.filter(product => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query));
}

function verifiedResults(hits) {
  return hits.map(product => `
    <a class="result-link" href="${product.url}" data-search-result="${product.id}">
      <span class="result-thumb ${product.tone}"></span>
      <span><strong>${safe(product.name)}</strong><small>VERIFIED REPORT · ${safe(product.gap)} · ${safe(product.focus)}</small></span>
      <b>→</b>
    </a>`).join('');
}

function showSearchPreview() {
  const input = document.getElementById('q');
  const output = document.getElementById('results');
  if (!input || !output) return;
  const query = input.value.trim().toLowerCase();
  if (!query) {
    output.innerHTML = '';
    output.classList.remove('open');
    return;
  }
  const hits = findProducts(query);
  output.classList.add('open');
  output.innerHTML = hits.length
    ? verifiedResults(hits)
    : `<div class="no-result"><strong>No verified report yet.</strong><span>VÄRDA can research this product now and cache the result for future visitors.</span><button id="runMissingScan" type="button">Run live Quick Scan</button></div>`;
  output.querySelectorAll('[data-search-result]').forEach(link => link.addEventListener('click', () => track('Open Search Result', { product: link.dataset.searchResult })));
  document.getElementById('runMissingScan')?.addEventListener('click', () => startLiveScan(input.value.trim()));
}

const scanSection = document.getElementById('quickScanSection');
const scanContent = document.getElementById('quickScanContent');
let activeScanController;

function titleCase(value) {
  return String(value || '').replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function evidenceClass(value) {
  if (value === 'VERIFIED FACT') return 'fact';
  if (value === 'COMMUNITY SIGNAL') return 'community';
  return 'estimate';
}

function listTemplate(items, emptyText) {
  return items?.length ? `<ul>${items.map(item => `<li>${safe(item)}</li>`).join('')}</ul>` : `<p>${safe(emptyText)}</p>`;
}

function loadingTemplate(query) {
  return `
    <div class="scan-loading">
      <div class="scan-spinner" aria-hidden="true"></div>
      <div>
        <span class="evidence-label estimate">LIVE SOURCE SEARCH</span>
        <h2>Researching ${safe(query)}</h2>
        <p id="scanProgress">Matching the exact product and regional version…</p>
        <small>This provisional scan searches Korean and global evidence. It will say “not enough data” instead of inventing an answer.</small>
      </div>
    </div>`;
}

function renderQuickScan(payload, query) {
  if (!scanContent || !scanSection) return;
  const result = payload.result || {};
  const product = result.product || {};
  const korea = result.korea_popularity || {};
  const global = result.global_hype || {};
  const gap = result.gap || {};
  const formula = result.formula_history || {};
  const regional = result.regional_version || {};
  const take = result.varda_take || {};
  const productName = product.name || query;
  const sourceList = result.sources?.length ? result.sources.map(source => `
    <a href="${safe(source.url)}" target="_blank" rel="nofollow noopener">
      <span class="source-domain">${safe(source.domain)}</span>
      <strong>${safe(source.title)}</strong>
      <small>${safe(source.evidence_type)} · ${safe(source.market)}</small>
    </a>`).join('') : '<p>No inspectable source URLs were returned. Treat this scan as low confidence.</p>';
  scanContent.innerHTML = `
    <header class="scan-head">
      <div>
        <span class="scan-status">PROVISIONAL · AI-ASSISTED · ${safe((result.confidence || 'low').toUpperCase())} CONFIDENCE</span>
        <span class="scan-cache">${payload.cached ? 'CACHED RESULT' : 'NEW LIVE SCAN'}</span>
      </div>
      <button type="button" id="closeQuickScan" aria-label="Close Quick Scan">×</button>
    </header>
    <div class="scan-title">
      <span>${safe(product.brand || 'PRODUCT MATCH')} · ${safe(product.category || 'K-BEAUTY')}</span>
      <h2>${safe(productName)}</h2>
      <p>${safe(result.summary || product.exact_match_note || 'Evidence remains limited for this product.')}</p>
    </div>
    <div class="scan-signals">
      <article><span class="source-type ${evidenceClass(korea.evidence_type)}">${safe(korea.evidence_type || 'AI-ASSISTED ESTIMATE')}</span><small>Korea popularity</small><strong>${safe(titleCase(korea.level || 'not_enough_data'))}</strong><p>${safe(korea.explanation || 'Not enough comparable Korean-market evidence.')}</p></article>
      <article><span class="source-type ${evidenceClass(global.evidence_type)}">${safe(global.evidence_type || 'AI-ASSISTED ESTIMATE')}</span><small>Global hype</small><strong>${safe(titleCase(global.level || 'not_enough_data'))}</strong><p>${safe(global.explanation || 'Not enough comparable global evidence.')}</p></article>
      <article class="scan-gap"><span class="source-type estimate">AI-ASSISTED ESTIMATE</span><small>Korea–global gap</small><strong>${safe(titleCase(gap.verdict || 'NOT_ENOUGH_DATA'))}</strong><p>${safe(gap.explanation || 'The available evidence does not support a directional verdict.')}</p></article>
    </div>
    <div class="scan-review-grid">
      <article><span class="source-type community">COMMUNITY SIGNAL</span><h3>People repeatedly like</h3>${listTemplate(result.people_like, 'No repeated praise pattern was strong enough to report.')}</article>
      <article><span class="source-type community">COMMUNITY SIGNAL</span><h3>Repeated complaints</h3>${listTemplate(result.repeated_complaints, 'No repeated complaint pattern was strong enough to report.')}</article>
    </div>
    <div class="scan-history-grid">
      <article><span>Formula history</span><strong>${safe(titleCase(formula.verdict || 'not_confirmed'))}</strong><p>${safe(formula.explanation || 'No dated official comparison was found.')}</p></article>
      <article><span>Regional version</span><strong>${safe(titleCase(regional.verdict || 'not_confirmed'))}</strong><p>${safe(regional.explanation || 'No material regional difference was confirmed.')}</p></article>
    </div>
    <div class="scan-take">
      <span>VÄRDA TAKE · AI-ASSISTED ESTIMATE</span>
      <p>${safe(take.text || 'There is not enough evidence for a useful buying conclusion yet.')}</p>
      <small>Confidence: ${safe(take.confidence || result.confidence || 'low')}. This is a provisional synthesis, not a verified editorial report.</small>
    </div>
    <div class="scan-bottom">
      <div class="scan-sources"><h3>Sources used</h3>${sourceList}</div>
      <div class="scan-limits"><h3>What remains uncertain</h3>${listTemplate(result.evidence_limits, 'No additional limitation was supplied; the report is still provisional.')}</div>
    </div>`;
  document.getElementById('closeQuickScan')?.addEventListener('click', () => { scanSection.hidden = true; });
  track('Quick Scan Completed', { query: query.slice(0, 100), cached: Boolean(payload.cached), confidence: result.confidence || 'low' });
}

function renderScanError(message, query) {
  if (!scanContent || !scanSection) return;
  scanContent.innerHTML = `
    <div class="scan-error">
      <span class="evidence-label estimate">SCAN INCOMPLETE</span>
      <h2>We could not produce an evidence-backed result.</h2>
      <p>${safe(message)}</p>
      <div><button type="button" id="retryScan">Try again</button><a href="#request">Prioritize a verified report</a></div>
    </div>`;
  document.getElementById('retryScan')?.addEventListener('click', () => startLiveScan(query));
}

async function startLiveScan(query) {
  const cleanQuery = String(query || '').trim();
  if (cleanQuery.length < 3 || !scanSection || !scanContent) return;
  activeScanController?.abort();
  activeScanController = new AbortController();
  scanSection.hidden = false;
  scanContent.innerHTML = loadingTemplate(cleanQuery);
  scanSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const messages = [
    'Searching Korean-market evidence…',
    'Comparing global retail and community signals…',
    'Checking formula and regional-version evidence…',
    'Separating facts, community signals, and estimates…'
  ];
  let messageIndex = 0;
  const timer = setInterval(() => {
    const progress = document.getElementById('scanProgress');
    if (progress) progress.textContent = messages[messageIndex++ % messages.length];
  }, 3500);
  track('Quick Scan Started', { query: cleanQuery.slice(0, 100) });
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: cleanQuery, market: document.getElementById('scanMarket')?.value || 'United States' }),
      signal: activeScanController.signal
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'The live evidence scan failed.');
    renderQuickScan(payload, cleanQuery);
  } catch (error) {
    if (error.name !== 'AbortError') {
      renderScanError(error.message || 'The live evidence scan failed.', cleanQuery);
      track('Quick Scan Failed', { query: cleanQuery.slice(0, 100) });
    }
  } finally {
    clearInterval(timer);
  }
}

function submitSearch() {
  const input = document.getElementById('q');
  const query = input?.value.trim() || '';
  if (!query) return;
  const hits = findProducts(query.toLowerCase());
  if (hits.length) {
    showSearchPreview();
    return;
  }
  track('Search Miss', { query: query.slice(0, 100) });
  startLiveScan(query);
}

document.getElementById('go')?.addEventListener('click', submitSearch);
document.getElementById('q')?.addEventListener('input', showSearchPreview);
document.getElementById('q')?.addEventListener('keydown', event => {
  if (event.key === 'Enter') submitSearch();
});
document.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => {
  const input = document.getElementById('q');
  if (!input) return;
  input.value = button.dataset.search;
  showSearchPreview();
  input.focus();
}));

const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery && document.getElementById('q')) {
  document.getElementById('q').value = initialQuery;
  showSearchPreview();
}

const requestForm = document.getElementById('requestForm');
requestForm?.addEventListener('submit', event => {
  event.preventDefault();
  const product = document.getElementById('requestProduct')?.value.trim();
  const market = document.getElementById('requestMarket')?.value || 'Unknown';
  const status = document.getElementById('requestStatus');
  if (!product) return;
  track('Product Request', { product: product.slice(0, 100), market });
  const history = JSON.parse(localStorage.getItem('varda_requests') || '[]');
  history.push({ product: product.slice(0, 160), market, requestedAt: new Date().toISOString() });
  localStorage.setItem('varda_requests', JSON.stringify(history.slice(-20)));
  if (status) {
    status.textContent = 'Request recorded. Products with the strongest demand signal are researched first.';
    status.classList.add('success');
  }
  requestForm.reset();
});

const watchKey = 'varda_watchlist';
function getWatchlist() {
  try { return JSON.parse(localStorage.getItem(watchKey) || '[]'); }
  catch { return []; }
}
function setWatchlist(list) {
  localStorage.setItem(watchKey, JSON.stringify(list));
  syncWatchlist();
  syncSaveButtons();
}
function toggleSaved(id) {
  const list = getWatchlist();
  const next = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
  setWatchlist(next);
  track(list.includes(id) ? 'Remove Saved Product' : 'Save Product', { product: id });
}
function syncSaveButtons() {
  const list = getWatchlist();
  document.querySelectorAll('.save-product').forEach(button => {
    const active = list.includes(button.dataset.productId);
    button.classList.toggle('saved', active);
    button.textContent = active ? 'Saved' : 'Save';
    button.setAttribute('aria-pressed', String(active));
    button.onclick = () => toggleSaved(button.dataset.productId);
  });
}
function syncWatchlist() {
  const list = getWatchlist();
  const count = document.getElementById('watchCount');
  const items = document.getElementById('watchItems');
  if (count) count.textContent = list.length;
  if (!items) return;
  const savedProducts = list.map(id => products.find(product => product.id === id)).filter(Boolean);
  items.innerHTML = savedProducts.length ? savedProducts.map(product => `
    <div class="watch-item">
      <a href="${product.url}"><span class="watch-thumb ${product.tone}"></span><span><strong>${safe(product.name)}</strong><small>${safe(product.gap)}</small></span></a>
      <button type="button" data-remove-saved="${product.id}" aria-label="Remove ${safe(product.name)}">Remove</button>
    </div>`).join('') : '<div class="empty-watch">No saved products yet.</div>';
  items.querySelectorAll('[data-remove-saved]').forEach(button => button.addEventListener('click', () => toggleSaved(button.dataset.removeSaved)));
}

const drawer = document.getElementById('watchDrawer');
const scrim = document.getElementById('drawerScrim');
function setDrawer(open) {
  if (!drawer || !scrim) return;
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  scrim.hidden = !open;
  document.body.classList.toggle('drawer-open', open);
}
document.getElementById('watchlistTrigger')?.addEventListener('click', () => setDrawer(true));
document.getElementById('closeWatchlist')?.addEventListener('click', () => setDrawer(false));
scrim?.addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setDrawer(false); });

syncWatchlist();
syncSaveButtons();

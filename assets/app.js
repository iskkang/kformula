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

function runSearch() {
  const input = document.getElementById('q');
  const output = document.getElementById('results');
  if (!input || !output) return;
  const query = input.value.trim().toLowerCase();
  if (!query) {
    output.innerHTML = '';
    output.classList.remove('open');
    return;
  }
  const hits = products.filter(product => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query));
  output.classList.add('open');
  output.innerHTML = hits.length
    ? hits.map(product => `
      <a class="result-link" href="${product.url}" data-search-result="${product.id}">
        <span class="result-thumb ${product.tone}"></span>
        <span><strong>${safe(product.name)}</strong><small>${safe(product.gap)} · ${safe(product.focus)}</small></span>
        <b>→</b>
      </a>`).join('')
    : `<div class="no-result"><strong>Not in the pilot database yet.</strong><span>Submit it as a research request. No account or conversation needed.</span><button id="requestMissing" type="button">Request this product</button></div>`;
  output.querySelectorAll('[data-search-result]').forEach(link => link.addEventListener('click', () => track('Open Search Result', { product: link.dataset.searchResult })));
  document.getElementById('requestMissing')?.addEventListener('click', () => {
    const requestInput = document.getElementById('requestProduct');
    if (requestInput) requestInput.value = input.value.trim();
    document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' });
    track('Search Miss', { query: input.value.trim().slice(0, 100) });
  });
}

document.getElementById('go')?.addEventListener('click', runSearch);
document.getElementById('q')?.addEventListener('input', runSearch);
document.getElementById('q')?.addEventListener('keydown', event => {
  if (event.key === 'Enter') runSearch();
});
document.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => {
  const input = document.getElementById('q');
  if (!input) return;
  input.value = button.dataset.search;
  runSearch();
  input.focus();
}));

const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery && document.getElementById('q')) {
  document.getElementById('q').value = initialQuery;
  runSearch();
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

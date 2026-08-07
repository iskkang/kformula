const products=[
 {
  name:'Beauty of Joseon Relief Sun',
  title:'Beauty of Joseon Relief Sun vs U.S. sunscreens',
  brand:'Beauty of Joseon',
  status:'MARKET-SPECIFIC PRODUCT',
  cls:'market',
  url:'/products/beauty-of-joseon-relief-sun-korean-vs-us/',
  tone:'tone-boj',
  short:'The U.S. products are not simply relabeled Relief Sun tubes.',
  productTag:'Original vs U.S. Market',
  evidence:'Official U.S. product pages'
 },
 {
  name:'Beauty of Joseon Daily Tinted Fluid',
  title:'Beauty of Joseon Daily Tinted Fluid — U.S. vs EU',
  brand:'Beauty of Joseon',
  status:'SAME FORMULA',
  cls:'same',
  url:'/products/beauty-of-joseon-daily-tinted-fluid-us-vs-eu/',
  tone:'tone-tinted',
  short:'BOJ states the U.S. and EU formulas are the same.',
  productTag:'Tinted Sunscreen',
  evidence:'Brand statement available'
 },
 {
  name:'Round Lab Birch Juice',
  title:'Round Lab Birch Juice Sunscreen — Korean vs U.S. UVLock',
  brand:'Round Lab',
  status:'DIFFERENT FORMULA',
  cls:'different',
  url:'/products/round-lab-birch-sunscreen-korean-vs-us/',
  tone:'tone-round',
  short:'The U.S. UVLock version is presented as a distinct product.',
  productTag:'Birch Juice Line',
  evidence:'U.S. exclusive UVLock'
 },
 {
  name:'SKIN1004 Hyalu-Cica Sun Serum',
  title:'SKIN1004 Hyalu-Cica Water-Fit Sun Serum UV',
  brand:'SKIN1004',
  status:'U.S. OTC FORMULA CONFIRMED',
  cls:'market',
  url:'/products/skin1004-hyalu-cica-us-formula/',
  tone:'tone-skin1004',
  short:'Current official U.S. listing confirms OTC sunscreen actives.',
  productTag:'Water-Fit Sun Serum UV',
  evidence:'Active ingredients listed'
 },
 {
  name:'Purito Daily Soft Touch',
  title:'Purito Daily Soft Touch Sunscreen',
  brand:'Purito Seoul',
  status:'NOT CONFIRMED',
  cls:'unclear',
  url:'/products/purito-daily-soft-touch-us-vs-korea/',
  tone:'tone-purito',
  short:'We found the Korean listing but not enough official evidence for a U.S.-specific formula verdict.',
  productTag:'Daily Soft Touch',
  evidence:'Insufficient official comparison'
 }
];
const cards=document.getElementById('cards');
if(cards){
 products.forEach(p=>cards.insertAdjacentHTML('beforeend',`
  <a class="card" href="${p.url}">
    <div class="card-visual ${p.tone}">
      <div class="card-brand-mark">${p.brand}</div>
      <div class="card-product-tag">${p.productTag}</div>
    </div>
    <div class="card-meta"><b class="pill ${p.cls}">${p.status}</b></div>
    <h3>${p.title}</h3>
    <div class="sub">${p.short}</div>
    <div class="card-meta"><small>${p.evidence}</small><span class="card-link">View check →</span></div>
  </a>`));
}
function search(){
 const q=document.getElementById('q')?.value.trim().toLowerCase() || '';
 const out=document.getElementById('results');
 if(!out) return;
 if(!q){out.innerHTML='';return}
 const hits=products.filter(p=>(`${p.title} ${p.brand} ${p.name}`).toLowerCase().includes(q));
 out.innerHTML=hits.length?hits.map(p=>`<a class="result-link" href="${p.url}"><strong>${p.title}</strong><span>${p.status} · ${p.brand}</span></a>`).join(''):`<div class="result-link"><strong>Not in the test database yet.</strong><span>We only publish a formula verdict when we have enough official documentation to support it.</span></div>`
}
const go=document.getElementById('go');
const q=document.getElementById('q');
if(go && q){go.addEventListener('click',search);q.addEventListener('input',search);q.addEventListener('keydown',e=>{if(e.key==='Enter')search()});}

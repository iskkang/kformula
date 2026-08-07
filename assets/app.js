const products=[
 {name:'Beauty of Joseon Relief Sun vs U.S. sunscreens',brand:'Beauty of Joseon',status:'MARKET-SPECIFIC PRODUCT',cls:'market',url:'/products/beauty-of-joseon-relief-sun-korean-vs-us/'},
 {name:'Beauty of Joseon Daily Tinted Fluid — U.S. vs EU',brand:'Beauty of Joseon',status:'SAME FORMULA',cls:'same',url:'/products/beauty-of-joseon-daily-tinted-fluid-us-vs-eu/'},
 {name:'Round Lab Birch Juice Sunscreen — Korean vs U.S. UVLock',brand:'Round Lab',status:'DIFFERENT FORMULA',cls:'different',url:'/products/round-lab-birch-sunscreen-korean-vs-us/'},
 {name:'SKIN1004 Hyalu-Cica Water-Fit Sun Serum UV',brand:'SKIN1004',status:'U.S. OTC FORMULA CONFIRMED',cls:'market',url:'/products/skin1004-hyalu-cica-us-formula/'},
 {name:'Purito Daily Soft Touch Sunscreen',brand:'Purito Seoul',status:'KOREAN FORMULA LISTED',cls:'unclear',url:'/products/purito-daily-soft-touch-us-vs-korea/'}
];
const cards=document.getElementById('cards');
products.forEach(p=>cards.insertAdjacentHTML('beforeend',`<a class="card" href="${p.url}"><b class="pill ${p.cls}">${p.status}</b><h3>${p.name}</h3><small>${p.brand}</small><p>View formula evidence →</p></a>`));
function search(){const q=document.getElementById('q').value.trim().toLowerCase();const out=document.getElementById('results');if(!q){out.innerHTML='';return}const hits=products.filter(p=>(p.name+' '+p.brand).toLowerCase().includes(q));out.innerHTML=hits.length?hits.map(p=>`<a class="result-link" href="${p.url}"><strong>${p.name}</strong><span>${p.status}</span></a>`).join(''):`<div class="result-link"><strong>Not in the test database yet.</strong><span>We do not invent a formula verdict without source documentation.</span></div>`}
document.getElementById('go').addEventListener('click',search);document.getElementById('q').addEventListener('input',search);document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter')search()});

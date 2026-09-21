
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const projectData = window.PORTFOLIO_PROJECTS || [];
const grid = $('#projectsGrid');

function renderProjects(filter='all'){
  const items = projectData.filter(p => filter==='all' || (filter==='web' ? p.id==='garment' : p.id!=='garment'));
  grid.innerHTML = items.map(p => `
    <article class="project-card reveal visible">
      <div class="project-image">
        <img src="${p.images[0]}" alt="${p.title} screenshot" loading="lazy">
        <span class="project-badge">${p.icon} · ${p.id==='garment'?'FINAL YEAR':'PROJECT'}</span>
      </div>
      <div class="project-body">
        <span class="project-type">${p.type}</span>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div class="stack">${p.stack.map(x=>`<span>${x}</span>`).join('')}</div>
        <div class="project-actions">
          <button class="view" data-project="${p.id}">View case study ↗</button>
          <a href="${p.repo}" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </div>
    </article>`).join('');
  $$('[data-project]').forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.project)));
}
renderProjects();

$$('.filter').forEach(btn => btn.addEventListener('click',()=>{
  $$('.filter').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(btn.dataset.filter);
}));

function openProject(id){
  const p=projectData.find(x=>x.id===id); if(!p) return;
  $('#modalContent').innerHTML=`
    <span class="section-kicker">${p.type}</span>
    <h2 class="modal-title">${p.title}</h2>
    <p class="modal-summary">${p.summary}</p>
    <div class="stack">${p.stack.map(x=>`<span>${x}</span>`).join('')}</div>
    <h4>Key features</h4>
    <ul class="modal-features">${p.features.map(x=>`<li>${x}</li>`).join('')}</ul>
    <div class="modal-grid">${p.images.map((x,i)=>`<img src="${x}" alt="${p.title} screenshot ${i+1}" loading="lazy">`).join('')}</div>
    <div class="project-actions" style="margin-top:24px"><a class="btn btn-primary" href="${p.repo}" target="_blank" rel="noopener">Open GitHub Repository ↗</a></div>`;
  $('#projectModal').classList.add('open');
  $('#projectModal').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeModal(){ $('#projectModal').classList.remove('open'); $('#projectModal').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
$$('[data-close]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal()});

const navToggle=$('#navToggle'), navLinks=$('#navLinks');
navToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));
$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

const progress=$('#progress');
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(window.scrollY/h*100)+'%';
},{passive:true});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.1});
$$('.reveal').forEach(el=>observer.observe(el));

const themeBtn=$('#themeBtn');
const saved=localStorage.getItem('ashani-theme');
if(saved==='dark') document.body.classList.add('light');
function setTheme(){
  document.body.classList.toggle('light');
  localStorage.setItem('ashani-theme',document.body.classList.contains('light')?'dark':'light');
}
themeBtn.addEventListener('click',setTheme);

const sections=$$('main section[id]');
const navAnchors=$$('#navLinks a[href^="#"]');
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navAnchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>sectionObserver.observe(s));

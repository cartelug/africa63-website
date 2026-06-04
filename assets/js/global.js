/* ============================================================
   AFRICA 63 — GLOBAL SCRIPT
   ============================================================ */
(function(){
  'use strict';

  /* ---------- PRELOADER ---------- */
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');

  /* animated gold mark overlay — CSS mask handles the visuals; injected
     here so the loader markup stays identical across every page. */
  const loaderMark = document.querySelector('.loader-mark');
  if (loaderMark && !loaderMark.querySelector('.loader-gold')){
    const gold = document.createElement('span');
    gold.className = 'loader-gold';
    gold.setAttribute('aria-hidden', 'true');
    loaderMark.appendChild(gold);
  }

  const pctEl = document.querySelector('.loader-pct');
  if (pctEl){
    let p = 0;
    const iv = setInterval(()=>{
      p += Math.floor(Math.random()*9)+4;
      if (p>=100){ p=100; clearInterval(iv); }
      pctEl.textContent = String(p).padStart(3,'0');
    }, 55);
  }

  function endLoader(){
    if (!loader) { document.body.classList.remove('loading'); startHero(); return; }
    loader.classList.add('done');
    document.body.classList.remove('loading');
    startHero();
    setTimeout(()=>{ loader.style.display='none'; }, 1200);
  }

  function startHero(){
    const hero = document.querySelector('.hero, .page-hero');
    if (hero) document.body.classList.add('hero-ready');
  }

  let loaded = false;
  function trigger(){ if(loaded) return; loaded = true; setTimeout(endLoader, 2150); }
  window.addEventListener('load', trigger);
  // safety fallback
  setTimeout(trigger, 4200);

  /* ---------- NAV ON SCROLL + BACK TO TOP ---------- */
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  function onScroll(){
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 700);
    // parallax
    parallax(y);
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  if (toTop){
    toTop.addEventListener('click', e=>{ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); });
  }

  /* ---------- MOBILE NAV ---------- */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileNav');
  function setToggle(open){
    if(!toggle) return;
    const s = toggle.querySelectorAll('span');
    if (open){
      s[0].style.transform='translateY(7.5px) rotate(45deg)';
      s[1].style.opacity='0';
      s[2].style.transform='translateY(-7.5px) rotate(-45deg)';
    } else {
      s[0].style.transform=''; s[1].style.opacity='1'; s[2].style.transform='';
    }
  }
  if (toggle && drawer){
    toggle.addEventListener('click', ()=>{
      const open = drawer.classList.toggle('open');
      setToggle(open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        drawer.classList.remove('open'); setToggle(false); document.body.style.overflow='';
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal, .reveal-line, .mask-line');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    reveals.forEach(el=>io.observe(el));
  } else {
    reveals.forEach(el=>el.classList.add('is-visible'));
  }

  /* ---------- LIGHT PARALLAX ---------- */
  const pxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  function parallax(y){
    if (!pxEls.length) return;
    pxEls.forEach(el=>{
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height/2 - window.innerHeight/2;
      el.style.transform = `translate3d(0, ${(-mid*speed).toFixed(1)}px, 0)`;
    });
  }

  /* ---------- SMOOTH ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if (href === '#'){ return; }
      const t = document.querySelector(href);
      if (t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });

  /* ---------- CONTACT FORM (demo) ---------- */
  window.a63Submit = function(){
    const get = id => (document.getElementById(id)||{}).value || '';
    const req = ['cName','cEmail','cMsg'];
    let ok = true;
    req.forEach(id=>{
      const el = document.getElementById(id);
      if (el && !el.value.trim()){ ok=false; el.style.borderBottomColor='#b4452f'; setTimeout(()=>el.style.borderBottomColor='',2200); }
    });
    if (!ok) return;
    const btn = document.getElementById('cSubmit');
    if (btn){ btn.innerHTML='<span>Sending…</span>'; btn.style.opacity='.7'; btn.style.pointerEvents='none'; }
    setTimeout(()=>{
      const f = document.getElementById('formBody'); if (f) f.style.display='none';
      const s = document.getElementById('formSuccess'); if (s) s.classList.add('show');
    }, 1100);
  };

  // run once on init
  onScroll();
})();

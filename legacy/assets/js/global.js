/* ════════════════════════════════════════════════════════════
   AFRICA 63 — GLOBAL SCRIPT · v3 "MONOCHROME ENGINE"
   - Preloader with raw % counter
   - Lenis smooth scroll (luxury inertia)
   - GSAP + ScrollTrigger: hero parallax + opacity scrub,
     kinetic text reveals, work-card scale, footer curtain
   - Splitting.js: per-char headers
   - Infinite GSAP marquee for partners
   - Magnetic footer links
   - Custom blend-difference cursor
   - Nav scroll state + mobile drawer
   - Contact form demo
   Loaded after Lenis, GSAP, ScrollTrigger, Splitting CDNs.
   ════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  const hasSplitting = typeof window.Splitting !== 'undefined';

  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (!hasGSAP) document.body.classList.add('no-motion');

  /* ──────────────── PRELOADER ────────────────
     Real eased progress: the bar/counter glide toward 86% while
     assets load, then sprint to 100 on window.load and exit. */
  const loader = document.getElementById('loader');
  if (loader) document.body.classList.add('loading');   // pages without a loader (404) never lock scroll

  function endLoader(){
    if (!loader){
      document.body.classList.remove('loading');
      startHero();
      return;
    }
    loader.classList.add('done');
    document.body.classList.remove('loading');
    startHero();
    setTimeout(()=>{ loader.style.display = 'none'; }, 1400);
  }
  function startHero(){
    const hero = document.querySelector('.hero, .page-hero');
    if (hero) document.body.classList.add('hero-ready');
    if (hasST) ScrollTrigger.refresh();
  }

  if (loader){
    const pctEl = loader.querySelector('.loader-pct');
    const barEl = loader.querySelector('.loader-bar');
    let p = 0, target = 86, finished = false;
    let last = performance.now();

    function renderLoad(){
      if (pctEl) pctEl.textContent = String(Math.round(p)).padStart(3, '0');
      if (barEl) barEl.style.transform = 'scaleX(' + (p / 100) + ')';
    }
    // time-based easing so the pace is identical at any frame rate
    function step(now){
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      p = Math.min(p + (target - p) * (1 - Math.exp(-3.2 * dt)) + 9 * dt, target);
      renderLoad();
      if (target === 100 && p >= 99.4){
        p = 100; renderLoad(); finishLoad();
        return;
      }
      requestAnimationFrame(step);
    }
    function finishLoad(){
      if (finished) return; finished = true;
      setTimeout(endLoader, 420);     // let 100% land before the curtain lifts
    }
    requestAnimationFrame(step);
    if (document.readyState === 'complete'){ target = 100; }
    else window.addEventListener('load', ()=>{ target = 100; });
    setTimeout(()=>{ target = 100; }, 4200);   // safety: never trap the visitor
  } else {
    window.addEventListener('load', endLoader);
    setTimeout(endLoader, 2500);
  }

  /* ──────────────── LENIS SMOOTH SCROLL ──────────────── */
  let lenis = null;
  if (hasLenis && !reduced){
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });

    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (hasST){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ──────────────── NAV SCROLL STATE + BACK TO TOP ──────────────── */
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  function onScroll(){
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 36);
    if (toTop) toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  if (toTop){
    toTop.addEventListener('click', ()=>{
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  /* ──────────────── MOBILE NAV ──────────────── */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileNav');
  function setToggle(open){
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    const s = toggle.querySelectorAll('span');
    if (open){
      s[0].style.transform = 'translateY(9px) rotate(45deg)';
      s[1].style.opacity = '0';
      s[2].style.transform = 'translateY(-9px) rotate(-45deg)';
    } else {
      s[0].style.transform = '';
      s[1].style.opacity = '1';
      s[2].style.transform = '';
    }
  }
  if (toggle && drawer){
    toggle.addEventListener('click', ()=>{
      const open = drawer.classList.toggle('open');
      setToggle(open);
      if (lenis){ open ? lenis.stop() : lenis.start(); }
      else { document.body.style.overflow = open ? 'hidden' : ''; }
    });
    drawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        drawer.classList.remove('open');
        setToggle(false);
        if (lenis) lenis.start(); else document.body.style.overflow = '';
      });
    });
  }

  /* ──────────────── SPLITTING.JS — per-char setup ──────────────── */
  if (hasSplitting){
    Splitting({ target: '[data-splitting], .kinetic-header', by: 'chars' });
  } else {
    // graceful fallback that mirrors Splitting's output: split on <br>,
    // then on whitespace, then per character. Words become atomic .word
    // wrappers; spaces become real .whitespace; chars get .char for rise.
    document.querySelectorAll('.kinetic-header').forEach(el=>{
      const html = el.innerHTML.split(/(<br\s*\/?>)/i).map(seg=>{
        if (/<br/i.test(seg)) return seg;
        return seg.split(/(\s+)/).map(tok=>{
          if (tok === '') return '';
          if (/^\s+$/.test(tok)) return '<span class="whitespace"> </span>';
          const chars = tok.split('').map(c=>
            '<span class="char">' + (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c) + '</span>'
          ).join('');
          return '<span class="word">' + chars + '</span>';
        }).join('');
      }).join('');
      el.innerHTML = html;
    });
  }

  /* ──────────────── KINETIC TEXT REVEAL (chars rise) ──────────────── */
  function setupKinetic(){
    if (!hasGSAP) return;
    document.querySelectorAll('.kinetic-header').forEach(el => {
      const chars = el.querySelectorAll('.char');
      if (!chars.length) return;
      gsap.set(chars, { yPercent: 110, opacity: 0 });
      const trigger = el.closest('.hero, .page-hero')
        ? { trigger: el, start: 'top 92%', once: true }
        : { trigger: el, start: 'top 88%', once: true };

      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.018,
        delay: el.closest('.hero, .page-hero') ? 0.05 : 0,
        scrollTrigger: hasST ? trigger : undefined
      });
    });
  }

  /* ──────────────── GENERIC REVEAL (.reveal blocks) ──────────────── */
  function setupReveals(){
    if (!hasGSAP){
      document.querySelectorAll('.reveal').forEach(el => el.style.opacity = '1');
      return;
    }
    document.querySelectorAll('.reveal').forEach((el, i) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.05, ease: 'expo.out',
          delay,
          scrollTrigger: hasST ? {
            trigger: el, start: 'top 90%', once: true
          } : undefined
        }
      );
    });
  }

  /* ──────────────── HERO PARALLAX + OPACITY SCRUB ──────────────── */
  function setupHero(){
    if (!hasST) return;
    const hero = document.querySelector('.hero');
    const bg = document.querySelector('.hero-bg');
    if (!hero || !bg) return;

    // background scrub — parallax via backgroundPositionY + fade
    gsap.to(bg, {
      backgroundPositionY: '40%',
      opacity: 0.18,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // pin-style content pull-up
    const inner = hero.querySelector('.hero-inner');
    if (inner){
      gsap.to(inner, {
        y: -60, opacity: 0.5, ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom 30%',
          scrub: true
        }
      });
    }
  }

  /* ──────────────── WORK CARDS — image scale on hover ──────────────── */
  function setupWorkCards(){
    if (!hasGSAP || !fine || reduced) return;
    document.querySelectorAll('.work-card').forEach(card => {
      const img = card.querySelector('.work-media img');
      if (!img) return;
      const enter = () => gsap.to(img, { scale: 1.08, duration: 1.1, ease: 'expo.out' });
      const leave = () => gsap.to(img, { scale: 1, duration: 1.1, ease: 'expo.out' });
      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
    });

    // scroll-in: clip + scale up entry
    if (hasST){
      document.querySelectorAll('.work-card').forEach(card => {
        const img = card.querySelector('.work-media img');
        if (!img) return;
        gsap.fromTo(img, { scale: 1.18 }, {
          scale: 1, ease: 'expo.out', duration: 1.4,
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });
      });
    }
  }

  /* ──────────────── INFINITE MARQUEE ────────────────
     A single track containing N items duplicated once.
     xPercent -50 walks the track exactly one set's width;
     a modulus utility wraps it seamlessly.
  ─────────────────────────────────────────────────────── */
  function setupMarquee(){
    document.querySelectorAll('.partner-track').forEach(track => {
      // ensure duplicates exist — clone once for a seamless loop
      // (clones are aria-hidden so screen readers hear each partner once)
      if (!track.dataset.cloned){
        Array.from(track.children).forEach(item => {
          const c = item.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          track.appendChild(c);
        });
        track.dataset.cloned = '1';
      }
      if (!hasGSAP || reduced){
        document.body.classList.add('no-motion');
        return;
      }
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: parseFloat(track.dataset.dur) || 38,
        ease: 'none',
        repeat: -1
      });
      // pause on hover
      track.parentElement.addEventListener('mouseenter', ()=> tween.timeScale(0.25));
      track.parentElement.addEventListener('mouseleave', ()=> tween.timeScale(1));
    });
  }

  /* ──────────────── IMAGE BAND PARALLAX ──────────────── */
  function setupImgBands(){
    if (!hasST) return;
    document.querySelectorAll('.img-band img').forEach(img => {
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8, ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.img-band'),
            start: 'top bottom', end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  }

  /* ──────────────── FOOTER CURTAIN — logo scale-in ──────────────── */
  function setupFooter(){
    if (!hasST) return;
    const logo = document.querySelector('.footer-logo img');
    if (logo){
      gsap.fromTo(logo,
        { scale: 0.94, opacity: 0.4, y: 40 },
        {
          scale: 1, opacity: 1, y: 0,
          ease: 'expo.out', duration: 1.4,
          scrollTrigger: {
            trigger: '.site-footer',
            start: 'top 70%', end: 'bottom bottom',
            scrub: 1.2
          }
        }
      );
    }

    // tagline & columns rise as curtain reveals
    gsap.utils.toArray('.footer-anim').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          ease: 'expo.out', duration: 1.1, delay: i * 0.05,
          scrollTrigger: { trigger: el, start: 'top 95%', once: true }
        }
      );
    });
  }

  /* ──────────────── MAGNETIC LINKS (footer + buttons) ──────────────── */
  function setupMagnetic(){
    if (!fine || reduced || !hasGSAP) return;
    const magnets = document.querySelectorAll('.footer-col a, .btn, .nav-cta, .text-link, [data-magnetic]');
    magnets.forEach(el => {
      const strength = parseFloat(el.dataset.magStrength) || 0.32;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(el, {
          x: dx * strength, y: dy * strength,
          duration: 0.6, ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', ()=>{
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ──────────────── CUSTOM CURSOR ──────────────── */
  function setupCursor(){
    if (!fine || reduced) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = innerWidth/2, my = innerHeight/2;
    let rx = mx, ry = my;
    const lerp = (a, b, n) => a + (b - a) * n;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    function loop(){
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener('mouseleave', ()=> document.body.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', ()=> document.body.classList.remove('cursor-hidden'));

    const sel = 'a, button, .work-card, .svc-row, .ci-item, [data-cursor="link"]';
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', ()=> ring.classList.add('is-link'));
      el.addEventListener('mouseleave', ()=> ring.classList.remove('is-link'));
    });
  }

  /* ──────────────── ANCHORS via Lenis ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const t = document.querySelector(href);
      if (t){
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -80 });
        else t.scrollIntoView({ behavior:'smooth' });
      }
    });
  });

  /* ──────────────── CONTACT FORM DEMO ──────────────── */
  window.a63Submit = function(){
    const req = ['cName', 'cEmail', 'cMsg'];
    let ok = true;
    req.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()){
        ok = false;
        el.style.borderBottomColor = '#c63d3d';
        setTimeout(()=> el.style.borderBottomColor = '', 2200);
      }
    });
    if (!ok) return;
    const btn = document.getElementById('cSubmit');
    if (btn){
      btn.innerHTML = '<span>Sending…</span>';
      btn.style.opacity = '.7';
      btn.style.pointerEvents = 'none';
    }
    setTimeout(()=>{
      const f = document.getElementById('formBody');
      if (f) f.style.display = 'none';
      const s = document.getElementById('formSuccess');
      if (s) s.classList.add('show');
    }, 1100);
  };

  /* ──────────────── BOOT ──────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    setupKinetic();
    setupReveals();
    setupHero();
    setupWorkCards();
    setupMarquee();
    setupImgBands();
    setupFooter();
    setupMagnetic();
    setupCursor();
    if (hasST) setTimeout(()=> ScrollTrigger.refresh(), 200);
  });
})();

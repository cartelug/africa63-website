/* ============================================================
   AFRICA 63 — ANIMATION ENGINE
   Lenis (luxury scroll) + GSAP ScrollTrigger + Splitting.js
   Every feature degrades gracefully if a CDN fails to load.
   ============================================================ */
(function(){
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGSAP       = typeof window.gsap !== 'undefined';
  var hasST         = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  var hasLenis      = typeof window.Lenis !== 'undefined';
  var hasSplitting  = typeof window.Splitting !== 'undefined';

  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (!hasGSAP) document.documentElement.classList.add('no-gsap');

  /* ---------- LENIS — buttery smooth scrolling ---------- */
  var lenis = null;
  if (hasLenis && !reducedMotion){
    lenis = new Lenis({
      duration: 1.2,
      easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    if (hasST) lenis.on('scroll', ScrollTrigger.update);
    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target){
    if (lenis){ lenis.scrollTo(target, { duration: 1.4 }); }
    else if (typeof target === 'number'){ window.scrollTo({ top: target, behavior: 'smooth' }); }
    else { target.scrollIntoView({ behavior: 'smooth' }); }
  }

  /* ---------- PRELOADER ---------- */
  var loader = document.getElementById('loader');
  document.body.classList.add('loading');

  var loaderMark = document.querySelector('.loader-mark');
  if (loaderMark && !loaderMark.querySelector('.loader-gold')){
    var sheen = document.createElement('span');
    sheen.className = 'loader-gold';
    sheen.setAttribute('aria-hidden', 'true');
    loaderMark.appendChild(sheen);
  }

  var pctEl = document.querySelector('.loader-pct');
  if (pctEl){
    var p = 0;
    var iv = setInterval(function(){
      p += Math.floor(Math.random() * 9) + 4;
      if (p >= 100){ p = 100; clearInterval(iv); }
      pctEl.textContent = String(p).padStart(3, '0');
    }, 55);
  }

  function endLoader(){
    if (!loader){ document.body.classList.remove('loading'); startHero(); return; }
    loader.classList.add('done');
    document.body.classList.remove('loading');
    startHero();
    setTimeout(function(){ loader.style.display = 'none'; }, 1200);
  }

  var loaded = false;
  function trigger(){ if (loaded) return; loaded = true; setTimeout(endLoader, 2050); }
  window.addEventListener('load', trigger);
  setTimeout(trigger, 4200); // safety fallback

  /* ---------- KINETIC TEXT — Splitting() + char stagger ---------- */
  var heroChars = null;
  if (hasSplitting){
    Splitting({ target: '[data-splitting]', by: 'chars' });
    // keep split headings readable for screen readers
    document.querySelectorAll('[data-splitting]').forEach(function(el){
      el.setAttribute('aria-label', el.textContent.trim());
      el.querySelectorAll('.word').forEach(function(w){ w.setAttribute('aria-hidden', 'true'); });
    });

    if (hasGSAP && !reducedMotion){
      var hero = document.querySelector('.hero, .page-hero');
      document.querySelectorAll('.kinetic-header').forEach(function(el){
        var chars = el.querySelectorAll('.char');
        if (!chars.length) return;
        if (hero && hero.contains(el)){
          // hero headline animates after the preloader, not on scroll
          heroChars = chars;
          gsap.set(chars, { yPercent: 110, opacity: 0 });
        } else if (hasST){
          gsap.fromTo(chars,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: 'expo.out',
              duration: 1.15,
              stagger: 0.022,
              scrollTrigger: { trigger: el, start: 'top 86%', once: true }
            });
        }
      });
    }
  }

  function startHero(){
    var hero = document.querySelector('.hero, .page-hero');
    if (hero) document.body.classList.add('hero-ready');
    if (heroChars && hasGSAP){
      gsap.to(heroChars, {
        yPercent: 0,
        opacity: 1,
        ease: 'expo.out',
        duration: 1.3,
        stagger: 0.028,
        delay: 0.1
      });
    }
  }

  /* ---------- HERO — parallax + opacity scrub ---------- */
  if (hasST && !reducedMotion){
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg){
      gsap.fromTo(heroBg,
        { backgroundPosition: '50% 22%', opacity: 1 },
        {
          backgroundPosition: '50% 72%',
          opacity: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
    }
  }

  /* ---------- INFINITE PARTNER MARQUEE ---------- */
  document.querySelectorAll('.partner-track').forEach(function(track){
    if (!hasGSAP || reducedMotion) return;
    var tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });
    var wrap = track.closest('.partner-marquee');
    if (wrap && finePointer){
      wrap.addEventListener('mouseenter', function(){ gsap.to(tween, { timeScale: 0.25, duration: 0.6 }); });
      wrap.addEventListener('mouseleave', function(){ gsap.to(tween, { timeScale: 1, duration: 0.6 }); });
    }
  });

  /* ---------- WORK CARDS — internal GSAP scale ---------- */
  if (hasGSAP && !reducedMotion && finePointer){
    document.querySelectorAll('.work-card').forEach(function(card){
      var img = card.querySelector('img');
      if (!img) return;
      card.addEventListener('mouseenter', function(){
        gsap.to(img, { scale: 1.08, duration: 1.15, ease: 'expo.out' });
      });
      card.addEventListener('mouseleave', function(){
        gsap.to(img, { scale: 1.01, duration: 0.9, ease: 'expo.out' });
      });
    });
  }

  /* ---------- MAGNETIC FOOTER LINKS ---------- */
  if (hasGSAP && !reducedMotion && finePointer){
    var magnets = document.querySelectorAll('.footer-col a, .f-soc, .footer-cta, [data-magnetic]');
    magnets.forEach(function(el){
      var strength = el.classList.contains('f-soc') ? 0.45 : 0.22;
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * strength,
          y: (e.clientY - r.top - r.height / 2) * strength,
          duration: 0.5,
          ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', function(){
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      });
    });
  }

  /* ---------- NAV STATE + BACK TO TOP ---------- */
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');
  function onScroll(){
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 700);
    legacyParallax(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTop){
    toTop.addEventListener('click', function(e){ e.preventDefault(); scrollToTarget(0); });
  }

  /* ---------- MOBILE NAV ---------- */
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileNav');
  function setToggle(open){
    if (!toggle) return;
    var s = toggle.querySelectorAll('span');
    if (open){
      s[0].style.transform = 'translateY(7.5px) rotate(45deg)';
      s[1].style.opacity = '0';
      s[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
    } else {
      s[0].style.transform = ''; s[1].style.opacity = '1'; s[2].style.transform = '';
    }
  }
  if (toggle && drawer){
    toggle.addEventListener('click', function(){
      var open = drawer.classList.toggle('open');
      setToggle(open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenis){ open ? lenis.stop() : lenis.start(); }
    });
    drawer.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        drawer.classList.remove('open'); setToggle(false);
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      });
    });
  }

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll('.reveal, .reveal-line, .mask-line');
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- LIGHT PARALLAX (data-parallax elements) ---------- */
  var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  function legacyParallax(y){
    if (!pxEls.length || reducedMotion) return;
    pxEls.forEach(function(el){
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      var rect = el.getBoundingClientRect();
      var mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = 'translate3d(0, ' + (-mid * speed).toFixed(1) + 'px, 0)';
    });
  }

  /* ---------- SMOOTH ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if (href === '#') return;
      var t = document.querySelector(href);
      if (t){ e.preventDefault(); scrollToTarget(t); }
    });
  });

  /* ---------- CONTACT FORM (demo) ---------- */
  window.a63Submit = function(){
    var req = ['cName', 'cEmail', 'cMsg'];
    var ok = true;
    req.forEach(function(id){
      var el = document.getElementById(id);
      if (el && !el.value.trim()){
        ok = false;
        el.style.borderBottomColor = '#0a0a0a';
        el.style.borderBottomWidth = '2px';
        setTimeout(function(){ el.style.borderBottomColor = ''; el.style.borderBottomWidth = ''; }, 2200);
      }
    });
    if (!ok) return;
    var btn = document.getElementById('cSubmit');
    if (btn){ btn.innerHTML = '<span>Sending…</span>'; btn.style.opacity = '.7'; btn.style.pointerEvents = 'none'; }
    setTimeout(function(){
      var f = document.getElementById('formBody'); if (f) f.style.display = 'none';
      var s = document.getElementById('formSuccess'); if (s) s.classList.add('show');
    }, 1100);
  };

  // run once on init
  onScroll();
})();

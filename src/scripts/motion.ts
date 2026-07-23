// ════════════════════════════════════════════════════════════
// AFRICA 63 — MOTION ENGINE · v6
// Self-hosted GSAP + ScrollTrigger + Lenis + Splitting.
// Fixes vs legacy: single RAF for Lenis, transform-layer hero
// parallax, gsap.quickTo magnetic, idempotent loader, and full
// re-init across Astro View Transitions.
// ════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Splitting from 'splitting';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

interface MotionState {
  lenis: Lenis | null;
  tickerFn: ((t: number) => void) | null;
  cleanup: Array<() => void>;
}
let S: MotionState = { lenis: null, tickerFn: null, cleanup: [] };

function teardown() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  if (S.tickerFn) gsap.ticker.remove(S.tickerFn);
  if (S.lenis) S.lenis.destroy();
  S.cleanup.forEach((fn) => fn());
  S = { lenis: null, tickerFn: null, cleanup: [] };
}

// ── PRELOADER (runs once, first paint) ──────────────────────
function runPreloader() {
  const loader = document.getElementById('loader');
  const start = () => {
    document.documentElement.classList.add('a63-loaded');
    const hero = document.querySelector('.hero, .page-hero');
    if (hero) document.body.classList.add('hero-ready');
    ScrollTrigger.refresh();
  };
  if (!loader || reduced) {
    document.body.classList.remove('loading');
    start();
    return;
  }
  document.body.classList.add('loading');
  const pctEl = loader.querySelector<HTMLElement>('.loader-pct');
  const barEl = loader.querySelector<HTMLElement>('.loader-bar');
  let p = 0, target = 86, last = performance.now(), done = false;

  const render = () => {
    if (pctEl) pctEl.textContent = String(Math.round(p)).padStart(3, '0');
    if (barEl) barEl.style.transform = `scaleX(${p / 100})`;
  };
  const finish = () => {
    if (done) return;
    done = true;
    p = 100; render();
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      start();
      setTimeout(() => { loader.style.display = 'none'; }, 1300);
    }, 380);
  };
  const step = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    p = Math.min(p + (target - p) * (1 - Math.exp(-3.2 * dt)) + 9 * dt, target);
    render();
    if (target === 100 && p >= 99.4) finish();
    else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  const promote = () => { target = 100; };
  if (document.readyState === 'complete') promote();
  else window.addEventListener('load', promote, { once: true });
  setTimeout(promote, 4200);
}

// ── LENIS (single RAF via gsap.ticker) ──────────────────────
function initLenis() {
  if (reduced) return;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });
  S.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const fn = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(fn);
  gsap.ticker.lagSmoothing(0);
  S.tickerFn = fn;
}

// ── NAV + BACK TO TOP ───────────────────────────────────────
// ── MOBILE DRAWER STATE (elements looked up live — DOM is swapped per nav) ──
function navIsOpen() { return !!document.getElementById('mobileNav')?.classList.contains('open'); }
function setNav(open: boolean) {
  document.getElementById('mobileNav')?.classList.toggle('open', open);
  document.getElementById('navToggle')?.setAttribute('aria-expanded', String(open));
  // scroll lock + hamburger→X are handled in CSS via html.nav-open and
  // .nav-toggle[aria-expanded]; JS only toggles state + scroll lock.
  document.documentElement.classList.toggle('nav-open', open);
  if (open) S.lenis?.stop(); else S.lenis?.start();
}

// Persistent chrome interactions bound ONCE via delegation on `document`.
// `document` survives Astro View Transitions, so the hamburger, drawer links,
// and back-to-top always respond — even in the gap between a page swap and the
// next per-page init(). This is what fixes the "toggle sometimes doesn't react".
function bindChromeOnce() {
  if ((window as any).__a63Chrome) return;
  (window as any).__a63Chrome = true;

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('#navToggle')) { e.preventDefault(); setNav(!navIsOpen()); return; }
    if (t.closest('#mobileNav a')) { setNav(false); return; }        // let nav proceed
    if (t.closest('#toTop')) {
      e.preventDefault();
      if (S.lenis) S.lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navIsOpen()) setNav(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820 && navIsOpen()) setNav(false); });
}

function initChrome() {
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 36);
    if (toTop) toTop.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  S.cleanup.push(() => window.removeEventListener('scroll', onScroll));

  // guarantee a clean, closed drawer on every (re)init / navigation
  setNav(false);
}

// ── SPLITTING + KINETIC HEADERS ─────────────────────────────
function initKinetic() {
  document.querySelectorAll<HTMLElement>('[data-splitting], .kinetic-header').forEach((el) => {
    if (!el.querySelector('.char')) Splitting({ target: el, by: 'chars' });
  });
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('.kinetic-header').forEach((header) => {
    const chars = header.querySelectorAll('.char');
    if (!chars.length) return;
    const isHero = !!header.closest('.hero, .page-hero');
    gsap.set(chars, { yPercent: 110, opacity: 0 });
    gsap.to(chars, {
      yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.018,
      delay: isHero ? 0.05 : 0,
      scrollTrigger: { trigger: header, start: isHero ? 'top 92%' : 'top 88%', once: true },
    });
  });
}

// ── GENERIC REVEALS ─────────────────────────────────────────
function initReveals() {
  if (reduced) { gsap.set('.reveal', { opacity: 1, y: 0 }); return; }
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    gsap.fromTo(el, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.05, ease: 'expo.out', delay,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

// ── HERO PARALLAX (transform layer, GPU-composited) ─────────
function initHeroParallax() {
  if (reduced) return;
  const hero = document.querySelector('.hero');
  const media = hero?.querySelector<HTMLElement>('.hero-media img');
  const inner = hero?.querySelector<HTMLElement>('.hero-inner');
  if (media) {
    gsap.to(media, {
      yPercent: 18, scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
  if (inner) {
    gsap.to(inner, {
      yPercent: -12, opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 30%', scrub: true },
    });
  }
  // interior page hero soft parallax
  const pMedia = document.querySelector<HTMLElement>('.page-hero-media img');
  if (pMedia) {
    gsap.to(pMedia, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
}

// ── WORK CARD SCROLL-IN ─────────────────────────────────────
function initWorkCards() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('.work-card .work-media img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.16 }, {
      scale: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: img, start: 'top 88%', once: true },
    });
  });
}

// ── IMAGE-BAND PARALLAX ─────────────────────────────────────
function initImgBands() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('.img-band img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.closest('.img-band'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

// ── INFINITE MARQUEE ────────────────────────────────────────
function initMarquee() {
  document.querySelectorAll<HTMLElement>('.partner-track').forEach((track) => {
    if (!track.dataset.cloned) {
      Array.from(track.children).forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      track.dataset.cloned = '1';
    }
    if (reduced) { track.classList.add('paused'); return; }
    const dur = parseFloat(track.dataset.dur || '38');
    const tween = gsap.to(track, { xPercent: -50, duration: dur, ease: 'none', repeat: -1 });
    const parent = track.closest('.partner-marquee');
    parent?.addEventListener('mouseenter', () => tween.timeScale(0.25));
    parent?.addEventListener('mouseleave', () => tween.timeScale(1));
  });
}

// ── FOOTER CURTAIN ──────────────────────────────────────────
function initFooter() {
  if (reduced) return;
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  // staggered rise of statement + columns + bar
  const items = footer.querySelectorAll<HTMLElement>('.footer-anim');
  if (items.length) {
    gsap.fromTo(items, { y: 42, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: footer, start: 'top 80%', once: true },
    });
  }

  // grand monogram sign-off: clip-path wipe up (opacity stays as CSS sets it —
  // faint watermark on desktop, bold sign-off on mobile).
  const logo = footer.querySelector<HTMLElement>('.footer-logo img');
  if (logo) {
    gsap.fromTo(logo,
      { clipPath: 'inset(0 0 100% 0)', yPercent: 6, scale: 1.03 },
      {
        clipPath: 'inset(0 0 0% 0)', yPercent: 0, scale: 1,
        duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: footer, start: 'top 62%', once: true },
      });
  }
}

// ── LEADERSHIP / ENGAGEMENT PORTRAITS (clip-path wipe) ──────
function initLeadership() {
  const portraits = document.querySelectorAll<HTMLElement>('.lead-photo img');
  if (reduced) { gsap.set(portraits, { clipPath: 'none' }); return; }
  portraits.forEach((im) => {
    gsap.fromTo(im,
      { clipPath: 'inset(0 0 101% 0)', scale: 1.16 },
      {
        clipPath: 'inset(0 0 0% 0)', scale: 1,
        duration: 1.35, ease: 'expo.out',
        scrollTrigger: { trigger: im, start: 'top 88%', once: true },
      });
  });
}

// ── CINEMATIC HERO CAROUSEL (cross-fade + progress + next) ──
function initHeroCarousel() {
  const hero = document.querySelector<HTMLElement>('.hero-cine');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll<HTMLElement>('.hero-slide'));
  const curEl = hero.querySelector<HTMLElement>('.hc-cur');
  const fill = hero.querySelector<HTMLElement>('.hero-prog-fill');
  const nextBtn = hero.querySelector<HTMLButtonElement>('.hero-next');
  if (slides.length <= 1) { if (fill) fill.style.width = '100%'; return; }

  const ms = parseInt(hero.dataset.autoplay || '6500', 10);
  let index = 0, timer = 0;

  const runProgress = () => {
    if (!fill) return;
    if (reduced) { fill.style.width = '100%'; return; }
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth;                       // force reflow
    fill.style.transition = `width ${ms}ms linear`;
    fill.style.width = '100%';
  };
  const show = (i: number) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, si) => s.classList.toggle('active', si === index));
    if (curEl) curEl.textContent = String(index + 1).padStart(2, '0');
    runProgress();
  };
  const start = () => { if (!reduced && !timer) timer = window.setInterval(() => show(index + 1), ms); };
  const stop = () => { if (timer) { clearInterval(timer); timer = 0; } };

  nextBtn?.addEventListener('click', () => { show(index + 1); stop(); start(); });

  show(0);
  start();
  S.cleanup.push(stop);
}

// ── ENGAGEMENT SLIDESHOW (scroll-snap + dots + arrows + autoplay) ──
function initEngageSlider() {
  document.querySelectorAll<HTMLElement>('.engage-slider').forEach((slider) => {
    const track = slider.querySelector<HTMLElement>('.engage-track');
    const slides = Array.from(slider.querySelectorAll<HTMLElement>('.engage-slide'));
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('.engage-dot'));
    const prev = slider.querySelector<HTMLButtonElement>('.engage-arrow.prev');
    const next = slider.querySelector<HTMLButtonElement>('.engage-arrow.next');
    if (!track || slides.length === 0) return;

    let index = 0;
    const setActive = (i: number) => {
      index = Math.max(0, Math.min(slides.length - 1, i));
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    };
    const goTo = (i: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      // each slide is exactly the track's width (flex 0 0 100%)
      track.scrollTo({ left: track.clientWidth * clamped, behavior: reduced ? 'auto' : 'smooth' });
      setActive(clamped);
    };

    // keep the active dot in sync while the user swipes
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          setActive(slides.indexOf(e.target as HTMLElement));
        }
      });
    }, { root: track, threshold: [0.6] });
    slides.forEach((s) => io.observe(s));
    S.cleanup.push(() => io.disconnect());

    // gentle autoplay — pauses on hover/focus/touch and resets after manual nav
    const autoMs = (() => { const m = parseInt(slider.dataset.autoplay || '0', 10); return m > 0 && !reduced && slides.length > 1 ? m : 0; })();
    let timer = 0;
    const advance = () => goTo(index >= slides.length - 1 ? 0 : index + 1);
    const stopAuto = () => { if (timer) { clearInterval(timer); timer = 0; } };
    const startAuto = () => { if (autoMs && !timer) timer = window.setInterval(advance, autoMs); };
    const bumpAuto = () => { stopAuto(); startAuto(); };   // restart countdown after a manual move

    const nav = (i: number) => { goTo(i); bumpAuto(); };
    prev?.addEventListener('click', () => nav(index - 1));
    next?.addEventListener('click', () => nav(index + 1));
    dots.forEach((d, di) => d.addEventListener('click', () => nav(di)));

    setActive(0);
    if (autoMs) {
      slider.addEventListener('pointerenter', stopAuto);
      slider.addEventListener('pointerleave', startAuto);
      slider.addEventListener('focusin', stopAuto);
      slider.addEventListener('focusout', startAuto);
      track.addEventListener('touchstart', stopAuto, { passive: true });
      startAuto();
      S.cleanup.push(stopAuto);
    }
  });
}

// ── MAGNETIC (gsap.quickTo) ─────────────────────────────────
function initMagnetic() {
  if (!fine || reduced) return;
  document.querySelectorAll<HTMLElement>('.btn, .btn-glow, .nav-cta, .text-link, .f-soc, [data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magStrength || '0.3');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    S.cleanup.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
  });
}

// ── CUSTOM CURSOR ───────────────────────────────────────────
function initCursor() {
  if (!fine || reduced) return;
  if (document.querySelector('.cursor-ring')) return; // persists across transitions
  const dot = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  document.body.append(dot, ring);
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  const onMove = (e: MouseEvent) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  };
  const loop = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
  document.addEventListener('mousemove', onMove);
  loop();
  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));
  document.addEventListener('mouseover', (e) => {
    const t = e.target as HTMLElement;
    ring.classList.toggle('is-link', !!t.closest('a, button, .work-card, .svc-row, .insight-card, .team-card, [data-cursor="link"]'));
  });
}

// ── ANCHOR SCROLL ───────────────────────────────────────────
function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (S.lenis) S.lenis.scrollTo(target as HTMLElement, { offset: -80 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── BOOT ────────────────────────────────────────────────────
function init() {
  document.documentElement.classList.add('js');
  // The preloader (first load only) reveals the hero when it finishes. On any
  // page without an active loader, reveal the hero immediately.
  if (!document.getElementById('loader') || document.documentElement.classList.contains('a63-loaded')) {
    const hero = document.querySelector('.hero, .page-hero');
    if (hero) document.body.classList.add('hero-ready');
  }
  initLenis();
  initChrome();
  initKinetic();
  initReveals();
  initHeroParallax();
  initWorkCards();
  initImgBands();
  initMarquee();
  initFooter();
  initLeadership();
  initHeroCarousel();
  initEngageSlider();
  initMagnetic();
  initCursor();
  initAnchors();
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

// Bind persistent chrome (mobile drawer, back-to-top) immediately at module
// load — independent of the per-page init lifecycle, so the hamburger reacts
// from the first paint and never falls into a re-init timing gap.
bindChromeOnce();

// ── PRELOADER: first genuine page load only ─────────────────
if (!(window as any).__a63Pre) {
  (window as any).__a63Pre = true;
  if (document.readyState !== 'loading') runPreloader();
  else document.addEventListener('DOMContentLoaded', runPreloader, { once: true });
}

// ── MOTION: (re)init on first load + every View-Transition nav ──
let started = false;
const boot = () => { if (started) teardown(); started = true; init(); };
document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', () => { setNav(false); if (started) teardown(); });
// After every navigation swap, guarantee no leftover preloader is shown.
// Runs before the browser paints the new page, so there is never a flash.
document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('a63-loaded');
  document.getElementById('loader')?.remove();
  document.body.classList.remove('loading');
});
// Fallback if the view-transition router never fires.
setTimeout(() => { if (!started) boot(); }, 0);

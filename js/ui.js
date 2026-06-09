// js/ui.js — UI Interactions, Animations & Particles

(function () {
  'use strict';

  // ── Scroll Fade-In ──
  function initFadeIn() {
    const els = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  // ── Particle System (Hero Background) ──
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    const emojis = ['🍪', '✨', '⭐', '🍫', '🥛', '🎉'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 14) + 's';
      p.style.animationDelay = (-Math.random() * 12) + 's';
      container.appendChild(p);
    }
  }

  // ── Counter Animations in Hero Stats ──
  function animateCounters() {
    const els = document.querySelectorAll('[data-count]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const target = parseFloat(e.target.dataset.count);
        const suffix = e.target.dataset.suffix || '';
        let start = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          e.target.textContent = Math.floor(start).toLocaleString() + suffix;
          if (start >= target) clearInterval(timer);
        }, 16);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    els.forEach(el => obs.observe(el));
  }

  // ── FAQ Accordion ──
  function initFaq() {
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // ── Live Cookie Counter Banner ──
  function initLiveCounter() {
    const numEls = document.querySelectorAll('.counter-num[data-live]');
    setInterval(() => {
      const game = window.CookieGame;
      if (!game) return;
      numEls.forEach(el => {
        const key = el.dataset.live;
        const fmt = window.CookieGameAPI && window.CookieGameAPI.formatNum;
        if (!fmt) return;
        if (key === 'cookies')   el.textContent = fmt(game.cookies || 0);
        if (key === 'total')     el.textContent = fmt(game.totalBaked || 0);
        if (key === 'cps')       el.textContent = fmt(game.cps || 0) + '/s';
        if (key === 'buildings') el.textContent = (game.totalBuildings || 0).toString();
      });
      // recalc total buildings
      if (game && game.buildings) {
        game.totalBuildings = Object.values(game.buildings).reduce((a, b) => a + b, 0);
      }
    }, 500);
  }

  // ── Shake Animation CSS Injection ──
  function injectShake() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        15%      { transform: translateX(-8px); }
        30%      { transform: translateX(8px); }
        45%      { transform: translateX(-6px); }
        60%      { transform: translateX(6px); }
        75%      { transform: translateX(-3px); }
        90%      { transform: translateX(3px); }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Smooth anchor scrolling w/ offset ──
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ── Hero cookie pulse on CPS milestone ──
  function initCookieGlow() {
    const img = document.querySelector('.hero-cookie-img');
    if (!img) return;
    let lastMilestone = 0;
    setInterval(() => {
      const game = window.CookieGame;
      if (!game) return;
      const milestone = Math.floor(game.totalBaked / 1000);
      if (milestone > lastMilestone) {
        lastMilestone = milestone;
        img.style.filter = 'drop-shadow(0 0 60px rgba(244,168,32,1)) brightness(1.3)';
        setTimeout(() => {
          img.style.filter = 'drop-shadow(0 0 40px rgba(244,168,32,0.6))';
        }, 500);
      }
    }, 500);
  }

  // ── Init ──
  function init() {
    injectShake();
    initParticles();
    initFadeIn();
    animateCounters();
    initFaq();
    initLiveCounter();
    initSmoothScroll();
    initCookieGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

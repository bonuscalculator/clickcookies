// js/header.js — Site Header Component

(function () {
  const NAV_LINKS = [
    { href: '/#game',          label: 'Play Now' },
    { href: '/#features',      label: 'Features' },
    { href: '/#how-to-play',   label: 'How To Play' },
    { href: '/#buildings-info',label: 'Buildings' },
    { href: '/#achievements',  label: 'Achievements' },
    { href: '/#faq',           label: 'FAQ' },
    { href: '/about',           label: 'About' },
  ];

  function buildHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const navItems = NAV_LINKS.map(l =>
      `<a href="${l.href}">${l.label}</a>`
    ).join('');

    const mobileItems = NAV_LINKS.map(l =>
      `<a href="${l.href}">${l.label}</a>`
    ).join('');

    header.innerHTML = `
      <div class="header-inner">
        <a href="#" class="header-logo" aria-label="ClickCookies Home">
          <span class="logo-icon" aria-hidden="true">🍪</span>
          <span>ClickCookies</span>
        </a>
        <nav class="header-nav" aria-label="Main navigation">
          ${navItems}
          <a href="#game" class="header-cta">🎮 Play Free</a>
        </nav>
        <button class="hamburger" id="hamburger-btn" aria-label="Toggle menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
        ${mobileItems}
        <a href="#game" class="header-cta" style="text-align:center;margin-top:8px;">🎮 Play Free</a>
      </nav>
    `;

    // Scroll effect
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Hamburger toggle
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    btn.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
      });
    });

    // Active nav highlight
    const sections = NAV_LINKS.map(l => document.querySelector(l.href)).filter(Boolean);
    const allNavLinks = header.querySelectorAll('.header-nav a:not(.header-cta)');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          allNavLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }
})();

// js/footer.js — Site Footer Component

(function () {
  function buildFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="header-logo" style="font-size:1.4rem;font-weight:900;color:var(--cookie-gold);display:flex;align-items:center;gap:10px;">
              <span style="font-size:2rem;animation:spin-slow 8s linear infinite;display:inline-block;">🍪</span>
              Click Cookies
            </div>
            <p>The most addictive cookie clicker game on the web. Click, bake, upgrade, and build your cookie empire — one delicious cookie at a time. Free to play, forever.</p>
          </div>

          <div>
            <div class="footer-col-title">Game</div>
            <div class="footer-links">
              <a href="/#game">Play Now</a>
              <a href="/#how-to-play">How To Play</a>
              <a href="/#buildings-info">Buildings</a>
              <a href="/#upgrades-info">Upgrades</a>
              <a href="/#achievements">Achievements</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Info</div>
            <div class="footer-links">
              <a href="/#features">Features</a>
              <a href="/#tips">Pro Tips</a>
              <a href="/#faq">FAQ</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Baking Stats</div>
            <div class="footer-links" style="gap:14px;">
              <div>
                <div style="font-size:1.4rem;font-weight:900;color:var(--cookie-gold);" id="footer-total">0</div>
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Total Baked</div>
              </div>
              <div>
                <div style="font-size:1.4rem;font-weight:900;color:var(--cookie-warm);" id="footer-cps">0/s</div>
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Cookies/sec</div>
              </div>
              <div>
                <div style="font-size:1.4rem;font-weight:900;color:var(--cookie-pink);" id="footer-buildings">0</div>
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Buildings</div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copy">
            &copy; ${year} ClickCookies &mdash; clickcookies.com &mdash; All rights reserved
          </div>
          <div class="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookies Policy</a>
          </div>
        </div>
      </div>
    `;

    // Live game stats update in footer
    function updateFooterStats() {
      const game = window.CookieGame;
      if (!game) return;
      const total = document.getElementById('footer-total');
      const cps = document.getElementById('footer-cps');
      const buildings = document.getElementById('footer-buildings');
      if (total) total.textContent = formatNum(game.totalBaked || 0);
      if (cps) cps.textContent = formatNum(game.cps || 0) + '/s';
      if (buildings) buildings.textContent = game.totalBuildings || 0;
    }

    function formatNum(n) {
      if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
      if (n >= 1e9)  return (n / 1e9).toFixed(1)  + 'B';
      if (n >= 1e6)  return (n / 1e6).toFixed(1)  + 'M';
      if (n >= 1e3)  return (n / 1e3).toFixed(1)  + 'K';
      return Math.floor(n).toLocaleString();
    }

    setInterval(updateFooterStats, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildFooter);
  } else {
    buildFooter();
  }
})();

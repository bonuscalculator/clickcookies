// js/game.js — Cookie Clicker Game Engine

(function () {
  'use strict';

  // ──────────────────────────────
  // CONSTANTS
  // ──────────────────────────────
  const SAVE_KEY = 'clickcookies_save_v2';
  const TICK_MS  = 50;  // 20 ticks per second

  // Buildings definition
  const BUILDINGS = [
    { id: 'cursor',     name: 'Cursor',       emoji: '👆', baseCost: 15,         baseCps: 0.1,   desc: 'Autoclicks the big cookie' },
    { id: 'grandma',    name: 'Grandma',      emoji: '👵', baseCost: 100,        baseCps: 0.5,   desc: 'Bakes cookies with love' },
    { id: 'farm',       name: 'Cookie Farm',  emoji: '🌾', baseCost: 1100,       baseCps: 4,     desc: 'Grows cookies from scratch' },
    { id: 'mine',       name: 'Cookie Mine',  emoji: '⛏️', baseCost: 12000,      baseCps: 10,    desc: 'Mines cookie dough from the earth' },
    { id: 'factory',    name: 'Factory',      emoji: '🏭', baseCost: 130000,     baseCps: 40,    desc: 'Mass-produces cookies round the clock' },
    { id: 'bank',       name: 'Cookie Bank',  emoji: '🏦', baseCost: 1400000,    baseCps: 100,   desc: 'Generates cookie dividends' },
    { id: 'temple',     name: 'Temple',       emoji: '🛕', baseCost: 20000000,   baseCps: 400,   desc: 'Prays for cookies nonstop' },
    { id: 'wizard',     name: 'Wizard Tower', emoji: '🧙', baseCost: 330000000,  baseCps: 1600,  desc: 'Conjures cookies with magic' },
    { id: 'spaceship',  name: 'Spaceship',    emoji: '🚀', baseCost: 5100000000, baseCps: 6500,  desc: 'Harvests cosmic cookie energy' },
    { id: 'alchemist',  name: 'Alchemist Lab',emoji: '⚗️', baseCost: 75000000000,baseCps: 25000, desc: 'Transmutes gold into cookies' },
  ];

  // Upgrades definition
  const UPGRADES = [
    { id: 'u1',  name: 'Reinforced Rolling Pins',  emoji: '🥖', cost: 100,         req: () => G.cookies >= 50,             mult: 2,    target: 'click',    desc: 'Double cookie clicks' },
    { id: 'u2',  name: 'Grandma\'s Secret Recipe', emoji: '📖', cost: 500,         req: () => G.buildings.grandma >= 1,    mult: 2,    target: 'grandma',  desc: '2× Grandma production' },
    { id: 'u3',  name: 'Organic Cookie Seeds',     emoji: '🌱', cost: 5000,        req: () => G.buildings.farm >= 1,       mult: 2,    target: 'farm',     desc: '2× Farm production' },
    { id: 'u4',  name: 'Sugar Crystals',            emoji: '💎', cost: 10000,       req: () => G.cookies >= 1000,           mult: 3,    target: 'click',    desc: 'Triple cookie clicks' },
    { id: 'u5',  name: 'Titanium Ovens',            emoji: '🔥', cost: 50000,       req: () => G.buildings.factory >= 1,    mult: 2,    target: 'factory',  desc: '2× Factory output' },
    { id: 'u6',  name: 'Cookie Futures',            emoji: '📈', cost: 500000,      req: () => G.buildings.bank >= 1,       mult: 2,    target: 'bank',     desc: '2× Bank dividends' },
    { id: 'u7',  name: 'Chocolate Infusion',        emoji: '🍫', cost: 1000000,     req: () => G.totalBaked >= 100000,      mult: 1.5,  target: 'all',      desc: '+50% all production' },
    { id: 'u8',  name: 'Grandma\'s Time Machine',  emoji: '⏰', cost: 5000000,     req: () => G.buildings.grandma >= 5,    mult: 3,    target: 'grandma',  desc: '3× Grandma power' },
    { id: 'u9',  name: 'Quantum Dough',             emoji: '⚛️', cost: 50000000,    req: () => G.buildings.wizard >= 1,     mult: 2,    target: 'wizard',   desc: '2× Wizard output' },
    { id: 'u10', name: 'Stellar Cookie Dust',       emoji: '⭐', cost: 500000000,   req: () => G.buildings.spaceship >= 1,  mult: 2,    target: 'spaceship',desc: '2× Spaceship yield' },
    { id: 'u11', name: 'Laser Oven Array',          emoji: '🔬', cost: 1000000000,  req: () => G.buildings.factory >= 10,   mult: 4,    target: 'factory',  desc: '4× Factory with 10+ factories' },
    { id: 'u12', name: 'Cookie Singularity',        emoji: '🌌', cost: 100000000000,req: () => G.totalBaked >= 1e10,        mult: 2,    target: 'all',      desc: '2× Everything at 10B baked' },
  ];

  // Achievements definition
  const ACHIEVEMENTS = [
    { id: 'a1',  name: 'First Click',       emoji: '👆', req: () => G.totalClicks >= 1,       desc: 'Click the cookie once' },
    { id: 'a2',  name: '100 Clicks',        emoji: '🖱️', req: () => G.totalClicks >= 100,     desc: 'Click 100 times' },
    { id: 'a3',  name: 'Click Addict',      emoji: '💪', req: () => G.totalClicks >= 1000,    desc: 'Click 1,000 times' },
    { id: 'a4',  name: 'Cookie Novice',     emoji: '🍪', req: () => G.totalBaked >= 100,      desc: 'Bake 100 cookies' },
    { id: 'a5',  name: 'Baker Apprentice',  emoji: '👨‍🍳', req: () => G.totalBaked >= 10000,   desc: 'Bake 10,000 cookies' },
    { id: 'a6',  name: 'Cookie Mogul',      emoji: '💰', req: () => G.totalBaked >= 1000000,  desc: 'Bake 1 million cookies' },
    { id: 'a7',  name: 'Golden Cookie!',    emoji: '✨', req: () => G.goldenClicks >= 1,      desc: 'Click a golden cookie' },
    { id: 'a8',  name: 'Cookie Empire',     emoji: '👑', req: () => G.totalBuildings >= 10,   desc: 'Own 10 buildings' },
    { id: 'a9',  name: 'Upgrade Master',    emoji: '⬆️', req: () => G.purchasedUpgrades.length >= 5, desc: 'Buy 5 upgrades' },
    { id: 'a10', name: 'Speed Baker',       emoji: '⚡', req: () => G.cps >= 100,             desc: 'Reach 100 cookies/sec' },
    { id: 'a11', name: 'Cookie Billionaire',emoji: '🤑', req: () => G.totalBaked >= 1e9,      desc: 'Bake 1 billion cookies' },
    { id: 'a12', name: 'Grandma Army',      emoji: '👵', req: () => G.buildings.grandma >= 10,desc: 'Own 10 grandmas' },
    { id: 'a13', name: 'Farm Owner',        emoji: '🌾', req: () => G.buildings.farm >= 5,    desc: 'Own 5 farms' },
    { id: 'a14', name: 'Industrial Baker',  emoji: '🏭', req: () => G.buildings.factory >= 3, desc: 'Own 3 factories' },
    { id: 'a15', name: 'Frenzy Rider',      emoji: '🎉', req: () => G.frenzyCount >= 3,       desc: 'Trigger 3 frenzies' },
    { id: 'a16', name: 'Cookie Trillionaire',emoji:'💎', req: () => G.totalBaked >= 1e12,     desc: 'Bake 1 trillion cookies' },
    { id: 'a17', name: 'Auto Baker Pro',    emoji: '🤖', req: () => G.buildings.cursor >= 20, desc: 'Own 20 cursors' },
    { id: 'a18', name: 'Golden Chaser',     emoji: '🌟', req: () => G.goldenClicks >= 10,     desc: 'Click 10 golden cookies' },
  ];

  // ──────────────────────────────
  // GAME STATE
  // ──────────────────────────────
  let G = {
    cookies: 0,
    totalBaked: 0,
    totalClicks: 0,
    cps: 0,
    clickPower: 1,
    buildings: {},
    purchasedUpgrades: [],
    earnedAchievements: [],
    goldenClicks: 0,
    frenzyCount: 0,
    frenzyActive: false,
    frenzyEnd: 0,
    frenzyMult: 1,
  };

  BUILDINGS.forEach(b => { G.buildings[b.id] = 0; });

  // ──────────────────────────────
  // SAVE / LOAD
  // ──────────────────────────────
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch(e) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      Object.assign(G, s);
      // Ensure all building keys exist
      BUILDINGS.forEach(b => { if (G.buildings[b.id] === undefined) G.buildings[b.id] = 0; });
    } catch(e) {}
  }

  function resetGame() {
    if (!confirm('Reset all progress? This cannot be undone!')) return;
    localStorage.removeItem(SAVE_KEY);
    BUILDINGS.forEach(b => { G.buildings[b.id] = 0; });
    Object.assign(G, {
      cookies: 0, totalBaked: 0, totalClicks: 0, cps: 0, clickPower: 1,
      purchasedUpgrades: [], earnedAchievements: [], goldenClicks: 0,
      frenzyCount: 0, frenzyActive: false, frenzyEnd: 0, frenzyMult: 1,
    });
    recalcCps();
    renderAll();
    showToast('🔄 Game reset!');
  }

  // ──────────────────────────────
  // HELPERS
  // ──────────────────────────────
  function formatNum(n) {
    if (n >= 1e15) return (n / 1e15).toFixed(2) + ' quadrillion';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + ' trillion';
    if (n >= 1e9)  return (n / 1e9).toFixed(2)  + ' billion';
    if (n >= 1e6)  return (n / 1e6).toFixed(2)  + ' million';
    if (n >= 1e3)  return (n / 1e3).toFixed(1)  + 'K';
    return Math.floor(n).toLocaleString();
  }

  function buildingCost(b) {
    return Math.ceil(b.baseCost * Math.pow(1.15, G.buildings[b.id]));
  }

  // ──────────────────────────────
  // CPS CALCULATION
  // ──────────────────────────────
  function recalcCps() {
    let cps = 0;
    BUILDINGS.forEach(b => {
      let bps = b.baseCps * G.buildings[b.id];
      // Per-building upgrades
      UPGRADES.forEach(u => {
        if (!G.purchasedUpgrades.includes(u.id)) return;
        if (u.target === b.id) bps *= u.mult;
      });
      cps += bps;
    });
    // Global multipliers
    UPGRADES.forEach(u => {
      if (!G.purchasedUpgrades.includes(u.id)) return;
      if (u.target === 'all') cps *= u.mult;
    });
    // Click power
    let cp = 1;
    UPGRADES.forEach(u => {
      if (!G.purchasedUpgrades.includes(u.id)) return;
      if (u.target === 'click') cp *= u.mult;
    });
    G.clickPower = cp;
    G.cps = cps;
    window.CookieGame = G;
  }

  // ──────────────────────────────
  // GAME ACTIONS
  // ──────────────────────────────
  function addCookies(n) {
    G.cookies += n;
    G.totalBaked += n;
  }

  function clickCookie() {
    const gain = G.clickPower * (G.frenzyActive ? G.frenzyMult : 1);
    addCookies(gain);
    G.totalClicks++;
    updateCookieDisplay();
    spawnClickText(gain);
    checkAchievements();
  }

  function buyBuilding(id) {
    const b = BUILDINGS.find(b => b.id === id);
    if (!b) return;
    const cost = buildingCost(b);
    if (G.cookies < cost) { shakePanel(); return; }
    G.cookies -= cost;
    G.buildings[id]++;
    recalcCps();
    renderBuildings();
    renderAll();
    checkAchievements();
    showToast(`${b.emoji} ${b.name} built!`);
  }

  function buyUpgrade(id) {
    const u = UPGRADES.find(u => u.id === id);
    if (!u || G.purchasedUpgrades.includes(u.id)) return;
    if (G.cookies < u.cost) { shakePanel(); return; }
    G.cookies -= u.cost;
    G.purchasedUpgrades.push(u.id);
    recalcCps();
    renderUpgrades();
    updateCookieDisplay();
    showToast(`${u.emoji} ${u.name} unlocked!`);
    checkAchievements();
  }

  function shakePanel() {
    const el = document.querySelector('.cookie-clicker-area');
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }

  // ──────────────────────────────
  // GOLDEN COOKIE
  // ──────────────────────────────
  let goldenTimer = null;
  let goldenHideTimer = null;

  function scheduleGolden() {
    const delay = 30000 + Math.random() * 90000; // 30-120s
    goldenTimer = setTimeout(spawnGolden, delay);
  }

  function spawnGolden() {
    const el = document.getElementById('golden-cookie');
    if (!el) return;
    const margin = 80;
    const maxX = window.innerWidth  - 80 - margin;
    const maxY = window.innerHeight - 80 - margin;
    el.style.left = (margin + Math.random() * maxX) + 'px';
    el.style.top  = (margin + Math.random() * maxY) + 'px';
    el.style.display = 'block';
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'golden-appear 0.5s ease-out, golden-float 3s ease-in-out infinite';
    goldenHideTimer = setTimeout(() => hideGolden(), 13000);
  }

  function hideGolden() {
    const el = document.getElementById('golden-cookie');
    if (el) el.style.display = 'none';
    clearTimeout(goldenHideTimer);
    scheduleGolden();
  }

  function collectGolden() {
    const el = document.getElementById('golden-cookie');
    if (!el || el.style.display === 'none') return;
    el.style.display = 'none';
    clearTimeout(goldenHideTimer);
    G.goldenClicks++;

    // Random reward
    const roll = Math.random();
    if (roll < 0.4) {
      // Cookie frenzy (7x for 20s)
      G.frenzyActive = true;
      G.frenzyMult = 7;
      G.frenzyEnd = Date.now() + 20000;
      G.frenzyCount++;
      const banner = document.querySelector('.frenzy-banner');
      if (banner) { banner.textContent = '🎉 Cookie Frenzy! 7× All Cookies for 20s!'; banner.classList.add('active'); }
      setTimeout(() => {
        G.frenzyActive = false;
        G.frenzyMult = 1;
        const b = document.querySelector('.frenzy-banner');
        if (b) b.classList.remove('active');
      }, 20000);
      showToast('✨ Cookie Frenzy! 7× production for 20 seconds!');
    } else if (roll < 0.7) {
      // Lucky — 15 minutes of production
      const bonus = Math.max(G.cps * 900, 13);
      addCookies(bonus);
      showToast(`🍀 Lucky! +${formatNum(bonus)} cookies!`);
    } else {
      // Click frenzy (777x for 13s)
      G.frenzyActive = true;
      G.frenzyMult = 777;
      G.frenzyEnd = Date.now() + 13000;
      G.frenzyCount++;
      const banner = document.querySelector('.frenzy-banner');
      if (banner) { banner.textContent = '🎰 Click Frenzy! 777× Click Power for 13s!'; banner.classList.add('active'); }
      setTimeout(() => {
        G.frenzyActive = false;
        G.frenzyMult = 1;
        const b = document.querySelector('.frenzy-banner');
        if (b) b.classList.remove('active');
      }, 13000);
      showToast('🎰 Click Frenzy! 777× click power for 13 seconds!');
    }

    checkAchievements();
    scheduleGolden();
  }

  // ──────────────────────────────
  // ACHIEVEMENTS CHECK
  // ──────────────────────────────
  function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (G.earnedAchievements.includes(a.id)) return;
      if (a.req()) {
        G.earnedAchievements.push(a.id);
        showToast(`🏆 Achievement: ${a.name}!`);
        renderAchievements();
      }
    });
  }

  // ──────────────────────────────
  // GAME LOOP
  // ──────────────────────────────
  let lastTick = Date.now();
  let saveCountdown = 0;

  function gameTick() {
    const now = Date.now();
    const dt  = (now - lastTick) / 1000;
    lastTick  = now;

    if (G.cps > 0) {
      const gain = G.cps * dt * (G.frenzyActive && G.frenzyMult <= 7 ? G.frenzyMult : 1);
      addCookies(gain);
    }

    saveCountdown += dt;
    if (saveCountdown >= 30) {
      save();
      saveCountdown = 0;
    }

    updateCookieDisplay();
    window.CookieGame = G;
  }

  // ──────────────────────────────
  // DOM RENDERING
  // ──────────────────────────────
  function updateCookieDisplay() {
    const score   = document.getElementById('game-score');
    const cpsEl   = document.getElementById('game-cps');
    const totalEl = document.getElementById('game-total');
    const clickEl = document.getElementById('game-clicks');
    const cpsBar  = document.getElementById('game-cps-bar');
    if (score)   score.textContent   = formatNum(G.cookies);
    if (cpsEl)   cpsEl.textContent   = formatNum(G.cps) + '/s';
    if (totalEl) totalEl.textContent = formatNum(G.totalBaked);
    if (clickEl) clickEl.textContent = formatNum(G.totalClicks);
    if (cpsBar)  cpsBar.textContent  = formatNum(G.cps) + ' cookies/sec';
  }

  function renderBuildings() {
    const list = document.getElementById('buildings-list');
    if (!list) return;
    list.innerHTML = BUILDINGS.map(b => {
      const count  = G.buildings[b.id];
      const cost   = buildingCost(b);
      const locked = G.cookies < cost && count === 0;
      return `
        <div class="building-item ${locked ? 'locked' : ''}" onclick="window.CookieGameAPI.buyBuilding('${b.id}')" title="${b.desc} — Cost: ${formatNum(cost)}">
          <div class="building-emoji">${b.emoji}</div>
          <div class="building-info">
            <div class="building-name">${b.name}</div>
            <div class="building-cost">🍪 ${formatNum(cost)}</div>
            <div class="building-cps">${formatNum(b.baseCps)}/s each</div>
          </div>
          <div class="building-count">${count}</div>
        </div>`;
    }).join('');
  }

  function renderUpgrades() {
    const list = document.getElementById('upgrades-list');
    if (!list) return;
    list.innerHTML = UPGRADES.map(u => {
      const purchased = G.purchasedUpgrades.includes(u.id);
      const available = u.req();
      const locked    = !available && !purchased;
      return `
        <div class="upgrade-item ${locked ? 'locked' : ''} ${purchased ? 'purchased' : ''}"
             onclick="window.CookieGameAPI.buyUpgrade('${u.id}')"
             title="${u.desc}${purchased ? ' (Owned)' : ''}">
          <div class="upgrade-icon">${u.emoji}</div>
          <div class="upgrade-info">
            <div class="upgrade-name">${u.name}${purchased ? ' ✓' : ''}</div>
            <div class="upgrade-cost">🍪 ${formatNum(u.cost)}</div>
            <div class="upgrade-desc">${u.desc}</div>
          </div>
        </div>`;
    }).join('');
  }

  function renderAchievements() {
    const grid = document.getElementById('achievements-game-grid');
    if (!grid) return;
    grid.innerHTML = ACHIEVEMENTS.map(a => {
      const earned = G.earnedAchievements.includes(a.id);
      return `
        <div class="achievement-badge ${earned ? '' : 'locked'}" title="${a.desc}">
          <div class="ach-icon">${a.emoji}</div>
          <div class="ach-name">${a.name}</div>
          <div class="ach-req">${a.desc}</div>
        </div>`;
    }).join('');
  }

  function renderAll() {
    updateCookieDisplay();
    renderBuildings();
    renderUpgrades();
    renderAchievements();
  }

  // ──────────────────────────────
  // CLICK PARTICLES
  // ──────────────────────────────
  function spawnClickText(n) {
    const area = document.querySelector('.cookie-clicker-area');
    if (!area) return;
    const el = document.createElement('div');
    el.className = 'click-sparkle';
    el.textContent = '+' + formatNum(n);
    el.style.left = (80 + Math.random() * 60) + 'px';
    el.style.top  = (80 + Math.random() * 40)  + 'px';
    area.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  // ──────────────────────────────
  // TOAST
  // ──────────────────────────────
  let toastQueue = [];
  let toastShowing = false;

  function showToast(msg) {
    toastQueue.push(msg);
    if (!toastShowing) processToast();
  }

  function processToast() {
    if (toastQueue.length === 0) { toastShowing = false; return; }
    toastShowing = true;
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = toastQueue.shift();
    document.body.appendChild(el);
    setTimeout(() => { el.remove(); processToast(); }, 3000);
  }

  // ──────────────────────────────
  // HERO COOKIE INTERACTION
  // ──────────────────────────────
  function initHeroCookie() {
    const hero = document.getElementById('hero-cookie-btn');
    if (!hero) return;
    hero.addEventListener('click', (e) => {
      clickCookie();
      const rect = hero.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const spark = document.createElement('div');
      spark.className = 'click-sparkle';
      spark.textContent = ['✨', '🍪', '⭐', '💫'][Math.floor(Math.random() * 4)];
      spark.style.left = sx + 'px';
      spark.style.top  = sy + 'px';
      spark.style.fontSize = '1.8rem';
      hero.parentElement.appendChild(spark);
      setTimeout(() => spark.remove(), 1000);
    });
  }

  function initGameCookie() {
    const btn = document.getElementById('game-cookie-btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      clickCookie();
    });
  }

  // ──────────────────────────────
  // INIT
  // ──────────────────────────────
  function init() {
    load();
    recalcCps();
    renderAll();
    initHeroCookie();
    initGameCookie();
    scheduleGolden();

    setInterval(gameTick, TICK_MS);
    // Also save on unload
    window.addEventListener('beforeunload', save);
  }

  // Public API
  window.CookieGameAPI = {
    buyBuilding,
    buyUpgrade,
    clickCookie,
    resetGame,
    collectGolden,
    formatNum,
  };

  window.CookieGame = G;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

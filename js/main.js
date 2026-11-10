/* Chilies Lathpandura — behaviour */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = window.CHILIES;
  const rupees = (n) => "Rs. " + n.toLocaleString("en-LK");
  const dishById = (id) => D.menu.find((m) => m.id === id);

  /* ---------------- Header ---------------- */
  const head = $(".site-head");
  const burger = $(".burger");
  $$(".nav a").forEach((a, i) => a.style.setProperty("--n", i));

  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };
  burger.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
  $$(".nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));

  /* ---------------- Hero slider ---------------- */
  const hero = $(".hero");
  const slides = $$(".slide", hero);
  const dotsBox = $(".hero__dots", hero);
  const SLIDE_MS = 6500;
  let current = -1;
  let timer = 0;
  let hovering = false;

  hero.style.setProperty("--slide-ms", SLIDE_MS + "ms");
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Slide ${i + 1} of ${slides.length}`);
    b.addEventListener("click", () => go(i, true));
    dotsBox.append(b);
    return b;
  });

  function schedule() {
    clearTimeout(timer);
    hero.classList.remove("is-playing");
    if (reduce || hovering || document.hidden) return;
    // restart the progress bar animation
    void hero.offsetWidth;
    hero.classList.add("is-playing");
    timer = setTimeout(() => go(current + 1), SLIDE_MS);
  }

  function go(n, user) {
    n = (n + slides.length) % slides.length;
    if (n === current) return;
    const prev = slides[current];
    if (prev) {
      prev.classList.remove("is-active");
      prev.classList.add("is-leaving");
      prev.setAttribute("aria-hidden", "true");
      prev.inert = true;
      setTimeout(() => prev.classList.remove("is-leaving"), 700);
      // ingredients scatter and regroup around the new plate
      hero.classList.add("is-swapping");
      setTimeout(() => hero.classList.remove("is-swapping"), 420);
    }
    const next = slides[n];
    next.classList.add("is-active");
    next.removeAttribute("aria-hidden");
    next.inert = false;
    dots.forEach((d, i) => d.setAttribute("aria-current", i === n ? "true" : "false"));
    current = n;
    schedule();
  }

  slides.forEach((s) => { s.setAttribute("aria-hidden", "true"); s.inert = true; });
  $(".hero__arrow--prev").addEventListener("click", () => go(current - 1, true));
  $(".hero__arrow--next").addEventListener("click", () => go(current + 1, true));
  hero.addEventListener("pointerenter", () => { hovering = true; schedule(); });
  hero.addEventListener("pointerleave", () => { hovering = false; schedule(); });
  hero.addEventListener("focusin", () => { hovering = true; schedule(); });
  hero.addEventListener("focusout", () => { hovering = false; schedule(); });
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(current - 1, true);
    if (e.key === "ArrowRight") go(current + 1, true);
  });
  document.addEventListener("visibilitychange", schedule);

  // swipe
  let swipeX = null;
  hero.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") swipeX = e.clientX; });
  hero.addEventListener("pointerup", (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1), true);
  });

  /* ---------------- Parallax (pointer + scroll) ---------------- */
  let tx = 0, ty = 0, px = 0, py = 0, heroVisible = true, rafOn = false;
  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; });

  /* ---------------- Backdrop video ---------------- */
  // Plays only while the hero is on screen; the poster still stands in for
  // reduced motion, data saver, or a browser that refuses to autoplay.
  const heroVideo = $(".hero__video");
  const saveData = navigator.connection && navigator.connection.saveData;
  if (heroVideo && !reduce && !saveData) {
    heroVideo.muted = true;
    heroVideo.addEventListener("playing", () => hero.classList.add("has-video"), { once: true });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) heroVideo.play().catch(() => {});
      else heroVideo.pause();
    }, { threshold: 0.05 }).observe(hero);
  }

  /* ---------------- Embers ---------------- */
  const canvas = $(".hero__embers");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, sparks = [];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas() {
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function spawn(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H * (0.74 + Math.random() * 0.3),
      r: 0.5 + Math.random() * 1.6,
      vy: 0.25 + Math.random() * 0.9,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.02,
      life: 0,
      max: 260 + Math.random() * 380,
      hue: 14 + Math.random() * 28,
    };
  }
  function drawEmbers() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      s.life++; s.sway += s.swaySpeed;
      s.y -= s.vy; s.x += Math.sin(s.sway) * 0.5 + px * 0.01 * s.r;
      const t = s.life / s.max;
      if (t >= 1 || s.y < -10) { sparks[i] = spawn(false); continue; }
      const size = s.r * 9;
      ctx.globalAlpha = Math.sin(t * Math.PI) * 0.85;
      ctx.drawImage(glow, s.x - size / 2, s.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  // one soft spark, drawn once and stamped for every ember
  const glow = document.createElement("canvas");
  glow.width = glow.height = 64;
  {
    const g = glow.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 226, 170, 1)");
    grad.addColorStop(0.12, "rgba(255, 150, 60, .85)");
    grad.addColorStop(0.4, "rgba(240, 70, 20, .22)");
    grad.addColorStop(1, "rgba(240, 60, 20, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }

  function frame() {
    if (!heroVisible) { rafOn = false; return; }
    px += (tx * 26 - px) * 0.06;
    py += (ty * 18 - py) * 0.06;
    hero.style.setProperty("--px", px.toFixed(2));
    hero.style.setProperty("--py", py.toFixed(2));
    drawEmbers();
    requestAnimationFrame(frame);
  }
  function startFrame() { if (!rafOn && !reduce) { rafOn = true; requestAnimationFrame(frame); } }

  if (!reduce) {
    sizeCanvas();
    sparks = Array.from({ length: Math.round(Math.min(56, W / 24)) }, () => spawn(true));
    addEventListener("resize", sizeCanvas);
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroVisible) startFrame(); }).observe(hero);
  }

  // scroll: sticky header + hero depth
  let ticking = false;
  function onScroll() {
    const y = scrollY;
    head.classList.toggle("is-stuck", y > 40);
    if (!reduce && y < innerHeight * 1.2) hero.style.setProperty("--sy", y.toFixed(0));
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------------- Scroll reveals ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$("[data-reveal]").forEach((el) => io.observe(el));

  /* ---------------- Dish strip ---------------- */
  const strip = $("[data-strip]");
  const stripHTML = D.strip.map((src) => `<div class="strip__item"><img src="${src}" alt="" width="360" height="360" loading="lazy"></div>`).join("");
  strip.innerHTML = stripHTML + stripHTML; // doubled so the loop is seamless

  /* ---------------- Menu ---------------- */
  const grid = $("[data-grid]");
  const tabsBox = $("[data-tabs]");
  const heatWords = ["No heat", "Mild", "Medium", "Hot"];
  let activeCat = "all";

  const heatHTML = (n) =>
    `<div class="heat" role="img" aria-label="Heat: ${heatWords[n].toLowerCase()}">` +
    [1, 2, 3].map((i) => `<img class="${i <= n ? "" : "off"}" src="images/chili-red-sm.webp" alt="" width="19" height="18">`).join("") +
    `<span>${heatWords[n]}</span></div>`;

  function renderMenu() {
    const list = D.menu.filter((m) => activeCat === "all" || m.cat === activeCat);
    grid.innerHTML = list.map((m, i) => `
      <article class="card" style="--i:${i}">
        <div class="card__img"><img src="${m.img}" alt="${m.name}" width="520" height="520" loading="lazy"></div>
        <h3>${m.name}</h3>
        <p class="card__note">${m.note}</p>
        ${heatHTML(m.heat)}
        <div class="card__foot">
          <span class="price">${rupees(m.price)}</span>
          <button class="add" type="button" data-add="${m.id}" aria-label="Add ${m.name} to your order"><svg aria-hidden="true"><use href="#i-plus"/></svg></button>
        </div>
      </article>`).join("");
  }

  function setCat(id, focus) {
    activeCat = id;
    $$(".tab", tabsBox).forEach((t) => {
      const on = t.dataset.cat === id;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    renderMenu();
  }

  tabsBox.innerHTML = D.categories.map((c) =>
    `<button class="tab" type="button" role="tab" data-cat="${c.id}" aria-selected="false" tabindex="-1">${c.label}</button>`).join("");
  tabsBox.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) setCat(t.dataset.cat); });
  tabsBox.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const ids = D.categories.map((c) => c.id);
    const i = (ids.indexOf(activeCat) + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length;
    setCat(ids[i], true);
  });
  setCat("all");
  $$("[data-filter-link]").forEach((a) => a.addEventListener("click", () => setCat(a.dataset.filterLink)));

  // card tilt follows the pointer
  if (!reduce && matchMedia("(hover: hover)").matches) {
    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(2) + "deg");
      card.style.setProperty("--rx", (((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(2) + "deg");
    });
    grid.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); }
    });
  }

  /* ---------------- Order ---------------- */
  const KEY = "chilies-order";
  const drawer = $(".drawer");
  const scrim = $(".scrim");
  const listBox = $("[data-order-list]");
  const totalBox = $("[data-total]");
  const countBox = $("[data-count]");
  const cartBtn = $(".cart-btn");
  const toast = $("[data-toast]");
  let order = {};
  let lastFocus = null;
  let toastTimer = 0;

  try { order = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { order = {}; }
  Object.keys(order).forEach((id) => { if (!dishById(id)) delete order[id]; });

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(order)); } catch { /* private mode: keep it in memory */ } };

  function renderOrder() {
    const ids = Object.keys(order);
    const count = ids.reduce((n, id) => n + order[id], 0);
    const total = ids.reduce((n, id) => n + order[id] * dishById(id).price, 0);
    countBox.textContent = count;
    countBox.hidden = count === 0;
    totalBox.textContent = rupees(total);
    listBox.innerHTML = ids.length
      ? ids.map((id) => {
          const m = dishById(id);
          return `<div class="item">
            <img src="${m.img}" alt="" width="58" height="58">
            <div><div class="item__name">${m.name}</div><div class="item__price">${rupees(m.price)}</div></div>
            <div class="qty">
              <button type="button" data-qty="-1" data-id="${id}" aria-label="One fewer ${m.name}"><svg aria-hidden="true"><use href="#i-minus"/></svg></button>
              <span aria-label="Quantity">${order[id]}</span>
              <button type="button" data-qty="1" data-id="${id}" aria-label="One more ${m.name}"><svg aria-hidden="true"><use href="#i-plus"/></svg></button>
            </div>
          </div>`;
        }).join("")
      : `<div class="drawer__empty"><img src="images/chili-red.webp" alt=""><p>Nothing here yet. Add a dish from the menu and it will show up in your order.</p></div>`;
  }

  function say(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function flyToCart(img) {
    if (reduce || !img) return;
    const a = img.getBoundingClientRect();
    const b = cartBtn.getBoundingClientRect();
    if (!a.width) return;
    const ghost = img.cloneNode();
    ghost.className = "fly";
    ghost.removeAttribute("loading");
    Object.assign(ghost.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
    document.body.append(ghost);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.animate(
      [
        { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(.6) rotate(140deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(300deg)`, opacity: 0.5 },
      ],
      { duration: 800, easing: "cubic-bezier(.4, 0, .6, 1)" }
    ).onfinish = () => {
      ghost.remove();
      cartBtn.classList.remove("bump");
      void cartBtn.offsetWidth;
      cartBtn.classList.add("bump");
    };
  }

  function add(id, fromEl) {
    const m = dishById(id);
    if (!m) return;
    order[id] = (order[id] || 0) + 1;
    save(); renderOrder();
    say(`Added ${m.name} to your order`);
    const scope = fromEl && fromEl.closest(".card, .post, .slide, .promo");
    flyToCart(scope && $("img", scope));
  }

  function openOrder() {
    lastFocus = document.activeElement;
    scrim.hidden = false;
    drawer.classList.add("is-open");
    drawer.inert = false;
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".drawer__head button", drawer).focus();
  }
  function closeOrder() {
    scrim.hidden = true;
    drawer.classList.remove("is-open");
    drawer.inert = true;
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) return add(addBtn.dataset.add, addBtn);
    if (e.target.closest("[data-open-order]")) return openOrder();
    if (e.target.closest("[data-close-order]")) return closeOrder();
    const q = e.target.closest("[data-qty]");
    if (q) {
      const id = q.dataset.id;
      order[id] = (order[id] || 0) + Number(q.dataset.qty);
      if (order[id] <= 0) delete order[id];
      save(); renderOrder();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (drawer.classList.contains("is-open")) closeOrder();
    else setNav(false);
  });
  $("[data-call]").href = "tel:" + D.orderPhone;
  renderOrder();

  /* ---------------- News rail ---------------- */
  const rail = $("[data-rail]");
  $$("[data-news]").forEach((b) => b.addEventListener("click", () => {
    rail.scrollBy({ left: Number(b.dataset.news) * 364, behavior: reduce ? "auto" : "smooth" });
  }));

  $("[data-year]").textContent = new Date().getFullYear();

  /* ---------------- Raise the curtain ---------------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([Promise.all([wait(reduce ? 0 : 1300), fonts]), wait(3000)]).then(() => {
    root.classList.add("is-ready");
    setTimeout(() => go(0), reduce ? 0 : 350);
  });
})();

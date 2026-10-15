/* ===== EDIT HERE ===== */
const CONFIG = {
  weddingDate: "2026-11-20T19:00:00+05:30",
  dateDay: "Friday",
  dateText: "20 November 2026",
  song: "assets/music.mp3",
  pdf: "assets/Vikas_Raj_Sandhya_Wedding_Invitation_Cards.pdf",
  pdfName: "Vikas_Raj_Sandhya_Wedding_Invitation_Cards.pdf",
  mapUrl: "https://maps.app.goo.gl/q6aZzHY4EmzGLT178",
  mapQuery: "Parvati Farm House Atrauli Aligarh Uttar Pradesh 202281",
  venue: "Parvati Farm House, Pyaau, Atrauli, Aligarh, Uttar Pradesh",
  events: [
    { key: "haldi", title: "Haldi", date: "19 November", day: "Thursday", time: "1:00 PM",
      desc: "A golden morning of turmeric, laughter and blessings as family anoints the couple." },
    { key: "mehendi", title: "Mehendi", date: "19 November", day: "Thursday", time: "5:00 PM",
      desc: "An evening of intricate henna, music and dance to bring good fortune to the bride." },
    { key: "barat", title: "Barat & Reception", date: "20 November", day: "Friday", time: "7:00 PM onwards",
      desc: "The grand wedding procession followed by the reception, dinner and blessings." }
  ],
  /* Bal Aakansha: change the slogans here anytime */
  kids: [
    { name: "Rushank", say: "Shaadi mein zaroor aana, hum aapka intezaar karenge!" },
    { name: "Surbhi", say: "Naach, gaana, masti aur mithai, sab kuch milega!" },
    { name: "Arnav", say: "Aap aaoge toh shaadi aur bhi special ho jayegi!" },
    { name: "Anuj", say: "Aana zaroor, warna hum naraaz ho jayenge!" }
  ]
};

const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Personal greeting: yoursite.com/?to=Sharma%20Family */
const guestName = new URLSearchParams(location.search).get("to");
if (guestName) { const g = $("#guest"); g.textContent = "Dear " + guestName.slice(0, 40) + ","; g.hidden = false; }

/* Events + timeline (dates stay blurred until the scratch card is revealed) */
$("#cards").innerHTML = CONFIG.events.map((e, i) => `
  <article class="card ${e.key} reveal" style="--rd:${i * .15}s">
    <svg class="ico" aria-hidden="true"><use href="#flower"/></svg>
    <h3>${esc(e.title)}</h3><p class="when"><span class="sd">${esc(e.date)} · ${esc(e.day)}</span></p>
    <dl><div><dt>Time</dt><dd>${esc(e.time)}</dd></div></dl>
    <p>${esc(e.desc)}</p></article>`).join("");
$("#timeline").innerHTML = CONFIG.events.map((e, i) => `
  <li class="${e.key} reveal" style="--rd:${i * .12}s"><svg class="dot" aria-hidden="true"><use href="#flower"/></svg>
  <div class="box"><h3>${esc(e.title)}</h3><p><span class="sd">${esc(e.date)}</span> · ${esc(e.time)}</p></div></li>`).join("");

/* Bal Aakansha */
const kidHues = [["#f3c9c6", "#e8a3a0"], ["#f6dca0", "#e3bd5c"], ["#c6d6bd", "#9caf94"], ["#f7cfae", "#e9a778"]];
$("#kids-grid").innerHTML = CONFIG.kids.map((k, i) => `
  <article class="kid reveal" style="--rd:${i * .12}s;--k1:${kidHues[i % 4][0]};--k2:${kidHues[i % 4][1]};--fl:${-i * 1.1}s">
    <p class="bubble">“${esc(k.say)}”</p>
    <div class="kav"><span>${esc(k.name.charAt(0))}</span><svg aria-hidden="true"><use href="#flower"/></svg></div>
    <h3>${esc(k.name)}</h3>
  </article>`).join("");

/* Venue / map / save card */
$("#dirBtn").href = CONFIG.mapUrl;
$("#v-map").src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapQuery) + "&output=embed";
$("#saveBtn").href = CONFIG.pdf;
$("#saveBtn").setAttribute("download", CONFIG.pdfName);

/* Floating gold sparkles on the cover (kept light) */
if (!reduce) {
  const sp = $("#sparks"), n = innerWidth < 600 ? 14 : 26;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    s.className = "spark";
    s.style.cssText = `left:${Math.random() * 100}%;--s:${3 + Math.random() * 6}px;--dx:${Math.random() * 80 - 40}px;animation-duration:${8 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s`;
    sp.appendChild(s);
  }
}

/* Falling petals: created only AFTER the invitation opens, so opening stays smooth */
function startPetals() {
  const box = $("#petals");
  if (reduce || box.childElementCount) return;
  const n = innerWidth < 600 ? 7 : 12;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.className = "petal";
    p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${13 + Math.random() * 10}s;animation-delay:${-Math.random() * 20}s;--dx:${Math.random() * 120 - 60}px`;
    box.appendChild(p);
  }
}

/* Petal burst (transform + opacity only) */
const COLS = ["#f3c9c6", "#f6dca0", "#f7cfae", "#e4cf9e", "#c6d6bd"];
function fling(box, count, minD, maxD, clearAfter) {
  if (reduce) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const b = document.createElement("i"), a = Math.random() * Math.PI * 2, d = minD + Math.random() * maxD;
    b.className = "bit";
    b.style.cssText = `--c:${COLS[i % COLS.length]};--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d - 60}px;--r:${Math.random() * 720 - 360}deg;animation-delay:${Math.random() * .2}s`;
    frag.appendChild(b);
  }
  box.appendChild(frag);
  setTimeout(() => (box.innerHTML = ""), clearAfter || 2400);
}

/* Leaves that fly out of the scratch card and drift down */
function leafShower(n) {
  if (reduce) return;
  const box = $("#leaves"), r = $("#scratch").getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const greens = ["#8fa787", "#9caf94", "#b3c3ab", "#7f9a76", "#c9a24d"];
  const NS = "http://www.w3.org/2000/svg", frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * Math.min(innerWidth, 520) * .55;
    const el = document.createElementNS(NS, "svg"), u = document.createElementNS(NS, "use");
    u.setAttribute("href", "#leaf"); el.appendChild(u);
    el.setAttribute("class", "lf");
    el.style.cssText = `left:${cx}px;top:${cy}px;color:${greens[i % greens.length]};--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d * .6 - 50}px;--r:${Math.random() * 300 - 150}deg;--sw:${Math.random() * 120 - 60}px;--fall:${160 + Math.random() * innerHeight * .45}px;animation-duration:${3.4 + Math.random() * 2}s;animation-delay:${Math.random() * .35}s`;
    frag.appendChild(el);
  }
  box.appendChild(frag);
  setTimeout(() => { while (box.firstChild && box.childElementCount > 0) box.removeChild(box.firstChild); }, 6500);
}

/* Music (starts when the invitation is opened; button toggles) */
const btn = $("#music"), audio = $("#song");
function setMusic(on) {
  btn.setAttribute("aria-pressed", String(on));
  btn.setAttribute("aria-label", on ? "Pause wedding song" : "Play wedding song");
}
if (CONFIG.song) {
  audio.src = CONFIG.song;
  audio.load(); /* buffer early so tapping Open does not stall */
  btn.hidden = false;
  audio.addEventListener("error", () => (btn.hidden = true));
  btn.addEventListener("click", () => {
    if (audio.paused) audio.play().then(() => setMusic(true)).catch(() => (btn.hidden = true));
    else { audio.pause(); setMusic(false); }
  });
}

/* Cover */
const cover = $("#cover"), openBtn = $("#openBtn");
let opened = false;
openBtn.focus({ preventScroll: true });
openBtn.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  scrollTo({ top: 0, behavior: "instant" }); /* no smooth-scroll jank */
  cover.classList.add("open");
  document.body.classList.remove("locked");
  cover.setAttribute("aria-hidden", "true");
  requestAnimationFrame(() => fling($("#burst"), innerWidth < 600 ? 22 : 32, 110, Math.max(innerWidth, innerHeight) * .5));
  if (CONFIG.song) audio.play().then(() => setMusic(true)).catch(() => {});
  setTimeout(() => document.body.classList.add("show"), 420); /* hero animations start as doors part */
  setTimeout(() => { cover.remove(); startPetals(); }, 1500);
});

/* Scratch card */
(function () {
  const box = $("#scratch"), cv = $("#scratchCv"), hint = $("#shint");
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const sFull = $("#sFull");
  $("#sDay").textContent = CONFIG.dateDay;
  sFull.innerHTML = [...CONFIG.dateText].map((c, i) =>
    `<span class="ch" style="--i:${i}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");

  let w = 0, h = 0, dpr = 1, drawing = false, done = false, started = false, last = null, lastCheck = 0;

  function paint() {
    const r = box.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#d6b868"); g.addColorStop(.28, "#f6e7b8"); g.addColorStop(.5, "#c9a24d");
    g.addColorStop(.74, "#f2dea6"); g.addColorStop(1, "#b8934a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1;
    for (let x = -h; x < w; x += 13) { ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + h, 0); ctx.stroke(); }
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = i % 3 ? `rgba(255,255,255,${Math.random() * .4})` : `rgba(122,46,58,${Math.random() * .12})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6);
    }
    ctx.strokeStyle = "rgba(122,46,58,.35)"; ctx.strokeRect(7.5, 7.5, w - 15, h - 15);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#7a2e3a";
    ctx.font = "italic 600 " + Math.min(26, w / 13) + "px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("Scratch to reveal the date", w / 2, h / 2 - 8);
    ctx.font = "500 " + Math.min(15, w / 24) + "px Jost, sans-serif";
    ctx.fillStyle = "rgba(122,46,58,.8)";
    ctx.fillText("✦   ✦   ✦", w / 2, h / 2 + 22);
  }
  paint();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!started) paint(); });
  addEventListener("resize", () => { if (!started && !done) paint(); });

  function pos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function stroke(e) {
    const [x, y] = pos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = ctx.lineJoin = "round"; ctx.lineWidth = Math.max(34, h * .34);
    ctx.beginPath();
    if (last) ctx.moveTo(last[0], last[1]); else ctx.moveTo(x - .1, y);
    ctx.lineTo(x, y); ctx.stroke();
    last = [x, y];
    const now = performance.now();
    if (now - lastCheck > 130) { lastCheck = now; check(); }
  }
  function check() {
    if (done) return;
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 64) { total++; if (d[i] < 40) clear++; }
    if (clear / total > .42) reveal();
  }
  function reveal() {
    if (done) return;
    done = true;
    box.classList.add("revealed");
    document.body.classList.add("revealed");
    hint.textContent = "✦ Save the date, we can't wait to celebrate with you ✦";
    fling($("#sburst"), 30, 60, 170, 2400);
    leafShower(innerWidth < 600 ? 20 : 30);
    setTimeout(() => leafShower(innerWidth < 600 ? 10 : 16), 700);
    cv.style.pointerEvents = "none";
    setTimeout(() => cv.remove(), 1100);
  }
  cv.addEventListener("pointerdown", (e) => {
    if (done) return;
    started = true; drawing = true; last = null;
    box.classList.add("started");
    cv.setPointerCapture(e.pointerId);
    stroke(e);
  });
  cv.addEventListener("pointermove", (e) => { if (drawing && !done) stroke(e); });
  const end = () => { drawing = false; last = null; if (!done) check(); };
  cv.addEventListener("pointerup", end);
  cv.addEventListener("pointercancel", end);
  cv.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } });
})();

/* Scroll reveal */
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es, o) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); o.unobserve(en.target); }
  }), { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
} else items.forEach((el) => el.classList.add("in"));

/* Scroll progress bar */
const bar = $("#progress");
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
}, { passive: true });

/* 3D tilt on event cards (mouse devices only) */
if (!reduce && matchMedia("(hover:hover)").matches) {
  $("#cards").addEventListener("pointermove", (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.transform = `rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg) translateY(-6px)`;
    c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
  });
  $("#cards").addEventListener("pointerout", (e) => { const c = e.target.closest(".card"); if (c) c.style.transform = ""; });
}

/* Countdown */
const target = new Date(CONFIG.weddingDate).getTime();
const pad = (n) => String(n).padStart(2, "0");
const put = (id, v) => { const el = $(id); if (el.textContent !== v) { el.textContent = v; if (!reduce && document.body.classList.contains("revealed")) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } } };
function tick() {
  let d = Math.max(0, target - Date.now());
  put("#cd-d", pad(Math.floor(d / 864e5))); d %= 864e5;
  put("#cd-h", pad(Math.floor(d / 36e5))); d %= 36e5;
  put("#cd-m", pad(Math.floor(d / 6e4))); put("#cd-s", pad(Math.floor((d % 6e4) / 1e3)));
}
tick(); setInterval(tick, 1000);
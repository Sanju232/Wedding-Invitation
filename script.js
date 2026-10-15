/* ===== EDIT HERE ===== */
const CONFIG = {
  weddingDate: "2026-11-20T19:00:00+05:30",
  song: "assets/music.mp3",
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
  ]
};

const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Personal greeting: yoursite.com/?to=Sharma%20Family */
const guestName = new URLSearchParams(location.search).get("to");
if (guestName) { const g = $("#guest"); g.textContent = "Dear " + guestName.slice(0, 40) + ","; g.hidden = false; }

/* Events + timeline */
$("#cards").innerHTML = CONFIG.events.map((e, i) => `
  <article class="card ${e.key} reveal" style="--rd:${i * .15}s">
    <svg class="ico" aria-hidden="true"><use href="#flower"/></svg>
    <h3>${esc(e.title)}</h3><p class="when">${esc(e.date)} · ${esc(e.day)}</p>
    <dl><div><dt>Time</dt><dd>${esc(e.time)}</dd></div></dl>
    <p>${esc(e.desc)}</p></article>`).join("");
$("#timeline").innerHTML = CONFIG.events.map((e, i) => `
  <li class="${e.key} reveal" style="--rd:${i * .12}s"><svg class="dot" aria-hidden="true"><use href="#flower"/></svg>
  <div class="box"><h3>${esc(e.title)}</h3><p>${esc(e.date)} · ${esc(e.time)}</p></div></li>`).join("");

/* Venue / map */
$("#dirBtn").href = CONFIG.mapUrl;
$("#v-map").src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapQuery) + "&output=embed";

/* Floating gold sparkles on the cover */
if (!reduce) {
  const sp = $("#sparks"), n = innerWidth < 600 ? 22 : 40;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    s.className = "spark";
    s.style.cssText = `left:${Math.random() * 100}%;--s:${3 + Math.random() * 6}px;--dx:${Math.random() * 80 - 40}px;animation-duration:${7 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s`;
    sp.appendChild(s);
  }
}

/* Falling petals */
(function () {
  const box = $("#petals");
  if (reduce) return;
  const n = innerWidth < 600 ? 8 : 14;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.className = "petal";
    p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${12 + Math.random() * 10}s;animation-delay:${-Math.random() * 20}s;--dx:${Math.random() * 120 - 60}px`;
    box.appendChild(p);
  }
})();

/* Petal burst when invitation opens */
function burst() {
  if (reduce) return;
  const box = $("#burst"), cols = ["#f3c9c6", "#f6dca0", "#f7cfae", "#e4cf9e", "#c6d6bd"];
  for (let i = 0; i < 48; i++) {
    const b = document.createElement("i"), a = Math.random() * Math.PI * 2, d = 120 + Math.random() * Math.max(innerWidth, innerHeight) * .6;
    b.className = "bit";
    b.style.cssText = `--c:${cols[i % cols.length]};--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d - 80}px;--r:${Math.random() * 720 - 360}deg;animation-delay:${Math.random() * .25}s`;
    box.appendChild(b);
  }
  setTimeout(() => (box.innerHTML = ""), 2600);
}

/* Music (starts when the invitation is opened; button toggles) */
const btn = $("#music"), audio = $("#song");
function setMusic(on) {
  btn.setAttribute("aria-pressed", String(on));
  btn.setAttribute("aria-label", on ? "Pause wedding song" : "Play wedding song");
}
if (CONFIG.song) {
  audio.src = CONFIG.song;
  btn.hidden = false;
  audio.addEventListener("error", () => (btn.hidden = true));
  btn.addEventListener("click", () => {
    if (audio.paused) audio.play().then(() => setMusic(true)).catch(() => (btn.hidden = true));
    else { audio.pause(); setMusic(false); }
  });
}

/* Cover */
const cover = $("#cover"), openBtn = $("#openBtn");
openBtn.focus({ preventScroll: true });
openBtn.addEventListener("click", () => {
  burst();
  cover.classList.add("open");
  document.body.classList.remove("locked");
  cover.setAttribute("aria-hidden", "true");
  scrollTo(0, 0);
  if (CONFIG.song) audio.play().then(() => setMusic(true)).catch(() => {});
});

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

/* Save the date (downloads a calendar file) */
$("#calBtn").addEventListener("click", () => {
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//EN", "BEGIN:VEVENT",
    "UID:vikas-sandhya-20261120@wedding", "DTSTAMP:20261015T000000Z",
    "DTSTART:20261120T133000Z", "DTEND:20261120T190000Z",
    "SUMMARY:Wedding of Vikas Raj & Km. Sandhya", "LOCATION:" + CONFIG.venue.replace(/,/g, "\\,"),
    "DESCRIPTION:Barat and Wedding Reception. Directions: " + CONFIG.mapUrl, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "Vikas-Sandhya-Wedding.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

/* Countdown */
const target = new Date(CONFIG.weddingDate).getTime();
const pad = (n) => String(n).padStart(2, "0");
const put = (id, v) => { const el = $(id); if (el.textContent !== v) { el.textContent = v; if (!reduce) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } } };
function tick() {
  let d = Math.max(0, target - Date.now());
  put("#cd-d", pad(Math.floor(d / 864e5))); d %= 864e5;
  put("#cd-h", pad(Math.floor(d / 36e5))); d %= 36e5;
  put("#cd-m", pad(Math.floor(d / 6e4))); put("#cd-s", pad(Math.floor((d % 6e4) / 1e3)));
}
tick(); setInterval(tick, 1000);
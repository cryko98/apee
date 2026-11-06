// $APE — small interactions, no dependencies.
(() => {
  const CONFIG = {
    X_URL: "https://x.com/apelowcaps",
    CA: "5jqzgwyQMGjJyZPUHXbFCiQ7KmxdGK67ipJAowjHpump",
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* toast */
  const toast = $("[data-toast]");
  let toastT;
  const say = (html) => {
    toast.innerHTML = html;
    toast.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("is-on"), 2600);
  };

  /* contract address */
  if (CONFIG.CA) {
    $$("[data-ca] .ca__val").forEach((v) => {
      v.textContent = CONFIG.CA.slice(0, 6) + "…" + CONFIG.CA.slice(-6);
      v.title = CONFIG.CA;
      v.classList.add("ca__val--addr");
    });
  }
  $$("[data-ca] .ca__btn").forEach((b) =>
    b.addEventListener("click", async () => {
      if (!CONFIG.CA) return say("CA drops on X first. Follow <b>@apelowcaps</b> so you don't miss it.");
      try {
        await navigator.clipboard.writeText(CONFIG.CA);
        say("CA copied. <b>Ape responsibly.</b>");
      } catch {
        say(CONFIG.CA);
      }
    })
  );

  /* tap the ape */
  const ape = $(".hero__ape");
  const counter = $("[data-taps]");
  const words = ["ape", "ape", "ape", "ape more", "send it", "no thoughts", "just ape"];
  let taps = +(localStorage.getItem("ape-taps") || 0);
  counter.textContent = taps;
  ape.addEventListener("click", (e) => {
    taps++;
    counter.textContent = taps;
    localStorage.setItem("ape-taps", taps);
    ape.classList.remove("is-boop");
    void ape.offsetWidth;
    ape.classList.add("is-boop");
    if (reduced) return;
    const r = ape.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 3;
    const n = taps % 10 === 0 ? 7 : 1 + (Math.random() < 0.35);
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "pop";
      p.textContent = n > 2 ? "ape" : words[(Math.random() * words.length) | 0];
      p.style.left = x + (Math.random() - 0.5) * 80 + "px";
      p.style.top = y + (Math.random() - 0.5) * 40 + "px";
      p.style.setProperty("--dx", (Math.random() - 0.5) * 160 + "px");
      p.style.setProperty("--rot", (Math.random() - 0.5) * 24 + "deg");
      p.style.setProperty("--s", 34 + Math.random() * 30 + "px");
      p.style.animationDelay = i * 60 + "ms";
      document.body.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
    if (taps === 19) say("19 taps. Like January <b>19</b>, 2024. Coincidence? No.");
    if (taps === 100) say("100 apes sent. <b>No thoughts. Just ape.</b>");
  });

  /* the trailer: autoplays on mute; one tap brings the sound, from the first words */
  const tr = $("[data-trailer]");
  if (tr) {
    const v = $("video", tr);
    const btn = $("[data-sound]", tr);
    const lab = $("[data-sound-label]", tr);
    const bar = $("[data-progress]", tr);
    const quiet = reduced || (navigator.connection && navigator.connection.saveData);
    let heard = false;
    const ui = () => {
      const on = !v.muted;
      tr.classList.toggle("is-on", on);
      tr.classList.toggle("is-paused", v.paused);
      btn.setAttribute("aria-pressed", on);
      lab.textContent = on ? "sound on" : v.paused ? "play with sound" : heard ? "tap to replay with sound" : "on mute · tap for sound";
    };
    const soundOn = () => {
      v.muted = false;
      v.volume = 1;
      v.currentTime = 0;
      v.play().catch(() => {});
      if (!heard) say("Sound on. <b>From the first words.</b>");
      heard = true;
      tr.classList.add("is-heard");
      ui();
    };
    const soundOff = () => { v.muted = true; ui(); };
    tr.addEventListener("click", (e) => {
      if (e.target.closest("[data-big]")) {
        if (v.muted) soundOn();
        const fs = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen;
        if (fs) fs.call(v);
        return;
      }
      v.muted || v.paused ? soundOn() : soundOff();
    });
    v.addEventListener("timeupdate", () => { bar.style.transform = "scaleX(" + v.currentTime / (v.duration || 30) + ")"; });
    v.addEventListener("ended", () => { v.muted = true; v.currentTime = 0; v.play().catch(() => {}); ui(); });
    ["play", "pause", "volumechange"].forEach((ev) => v.addEventListener(ev, ui));
    if (quiet) { v.removeAttribute("autoplay"); v.pause(); }
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { if (!quiet || !v.muted) v.play().catch(() => {}); }
      else if (!v.paused) v.pause();
    }, { threshold: 0.3 }).observe(tr);
    ui();
  }

  /* reveal on scroll */
  const io = new IntersectionObserver(
    (ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  $$("[data-reveal]").forEach((el, i) => {
    if (el.classList.contains("tw") && el.closest(".board")) el.style.transitionDelay = (i % 3) * 70 + "ms";
    io.observe(el);
  });

  /* nav switches to dark over dark sections */
  const nav = $(".nav");
  const darks = $$(".lore, .poster, .foot");
  const navCheck = () => {
    const y = nav.getBoundingClientRect().bottom - 20;
    nav.classList.toggle("is-dark", darks.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
  };
  addEventListener("scroll", navCheck, { passive: true });
  navCheck();
})();

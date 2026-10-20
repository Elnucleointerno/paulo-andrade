document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("hero-field");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const COUNT = 70;
  const LINK_DIST = 120;
  const MOUSE_RADIUS = 110;
  const LINK_DIST2 = LINK_DIST * LINK_DIST;
  const LEVELS = 10;
  const LINK_STYLES = Array.from({ length: LEVELS }, (_, k) => `rgba(182, 255, 60, ${((k + 0.5) / LEVELS) * 0.14})`);

  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];
  const mouse = { x: null, y: null };
  let heroVisible = true;
  let looping = false;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.3 + 0.5,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      else if (p.y > h) p.y = 0;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }
      }
    });

    // Los trazos se agrupan por nivel de transparencia: pocos trazos grandes en lugar de uno por línea
    // (3 a 7 veces más rápido, casi idéntico a la vista).
    const paths = Array.from({ length: LEVELS }, () => new Path2D());
    const used = new Array(LEVELS).fill(false);
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST2) {
          const k = Math.min(LEVELS - 1, Math.floor((1 - Math.sqrt(d2) / LINK_DIST) * LEVELS));
          paths[k].moveTo(a.x, a.y);
          paths[k].lineTo(b.x, b.y);
          used[k] = true;
        }
      }
    }
    ctx.lineWidth = 1;
    for (let k = 0; k < LEVELS; k++) {
      if (!used[k]) continue;
      ctx.strokeStyle = LINK_STYLES[k];
      ctx.stroke(paths[k]);
    }

    ctx.fillStyle = "rgba(182, 255, 60, 0.45)";
    ctx.beginPath();
    for (const p of particles) {
      ctx.moveTo(p.x + p.r, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    }
    ctx.fill();

    if (!document.hidden && heroVisible) requestAnimationFrame(step);
    else looping = false;
  }

  function start() {
    if (looping) return;
    looping = true;
    requestAnimationFrame(step);
  }

  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });

  if (!isTouch) {
    hero.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) start();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) start();
    }).observe(hero);
  }

  resize();
  initParticles();
  start();
});

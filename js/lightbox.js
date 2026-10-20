document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Cerrar">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Anterior">&lsaquo;</button>
    <img alt="">
    <button class="lightbox-nav lightbox-next" aria-label="Siguiente">&rsaquo;</button>
    <p class="lightbox-caption"></p>
  `;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Imagen ampliada");
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lightbox-caption");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");

  let group = [];
  let index = 0;
  let triggerEl = null;

  function render() {
    const img = group[index];
    const figcaption = img.closest(".gallery-item").querySelector("figcaption");
    imgEl.src = img.src; // el original, no la miniatura que eligió el navegador
    imgEl.alt = img.alt || "";
    captionEl.textContent = figcaption ? figcaption.textContent : "";
    const multi = group.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  }

  function open(newGroup, newIndex, trigger) {
    group = newGroup;
    index = newIndex;
    triggerEl = trigger || document.activeElement;
    render();
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (triggerEl) triggerEl.focus();
  }

  function next() {
    index = (index + 1) % group.length;
    render();
  }

  function prev() {
    index = (index - 1 + group.length) % group.length;
    render();
  }

  function makeOpenable(img, openIt) {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Ampliar imagen: " + (img.alt || ""));
    img.addEventListener("click", openIt);
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openIt();
      }
    });
  }

  const seen = new Set();

  document.querySelectorAll(".gallery, .mini-gallery").forEach((container) => {
    const imgs = [...container.querySelectorAll(".gallery-item:not(.gallery-item--missing) img")];
    imgs.forEach((img) => seen.add(img));
    imgs.forEach((img, i) => {
      makeOpenable(img, () => open(imgs, i, img));
    });
  });

  document.querySelectorAll(".gallery-item:not(.gallery-item--missing) img").forEach((img) => {
    if (!seen.has(img)) {
      makeOpenable(img, () => open([img], 0, img));
    }
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("is-open")) return;
    if (e.key === "Tab") {
      const stops = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
});

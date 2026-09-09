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
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lightbox-caption");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");

  let group = [];
  let index = 0;

  function render() {
    const img = group[index];
    const figcaption = img.closest(".gallery-item").querySelector("figcaption");
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || "";
    captionEl.textContent = figcaption ? figcaption.textContent : "";
    const multi = group.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  }

  function open(newGroup, newIndex) {
    group = newGroup;
    index = newIndex;
    render();
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function next() {
    index = (index + 1) % group.length;
    render();
  }

  function prev() {
    index = (index - 1 + group.length) % group.length;
    render();
  }

  const seen = new Set();

  document.querySelectorAll(".gallery, .mini-gallery").forEach((container) => {
    const imgs = [...container.querySelectorAll(".gallery-item:not(.gallery-item--missing) img")];
    imgs.forEach((img) => seen.add(img));
    imgs.forEach((img, i) => {
      img.addEventListener("click", () => open(imgs, i));
    });
  });

  document.querySelectorAll(".gallery-item:not(.gallery-item--missing) img").forEach((img) => {
    if (!seen.has(img)) {
      img.addEventListener("click", () => open([img], 0));
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
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
});

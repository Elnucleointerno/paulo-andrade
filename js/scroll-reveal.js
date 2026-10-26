document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const groups = new Map();
  targets.forEach((el) => {
    const siblings = groups.get(el.parentElement) || [];
    siblings.push(el);
    groups.set(el.parentElement, siblings);
  });
  groups.forEach((siblings) => {
    siblings.forEach((el, i) => el.style.setProperty("--reveal-i", i));
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  const reveal = (el) => {
    el.classList.add("is-visible");
    observer.unobserve(el);
  };

  // Con el teclado, el foco puede llegar a algo dentro de un bloque alto (varios embeds apilados en el celular) del que
  // todavía se ve menos del 15 %: sin esto el foco caía en un elemento invisible.
  targets.forEach((el) => {
    observer.observe(el);
    el.addEventListener("focusin", () => reveal(el));
  });

  // Cuando el foco entra a un iframe de otro sitio (Spotify, Bandcamp) el navegador no avisa con focusin: lo único que
  // llega es el blur de la ventana, y entonces el iframe pasa a ser document.activeElement.
  window.addEventListener("blur", () => {
    setTimeout(() => {
      const activo = document.activeElement;
      const bloque = activo && activo.tagName === "IFRAME" && activo.closest(".reveal");
      if (bloque) reveal(bloque);
    }, 0);
  });
});

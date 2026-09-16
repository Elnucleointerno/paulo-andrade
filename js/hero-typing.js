document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".hero-role");
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const text = el.textContent.trim();
  el.textContent = "";
  el.classList.add("is-typing");

  let i = 0;
  function typeNext() {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) {
      setTimeout(typeNext, 35);
    } else {
      el.classList.remove("is-typing");
    }
  }

  setTimeout(typeNext, 500);
});

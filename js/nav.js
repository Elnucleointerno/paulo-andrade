document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!links) return;

  const navLinks = [...links.querySelectorAll("a")];
  const pageName = (path) => (path.split("/").pop() || "index").replace(/\.html$/, "");
  const currentFile = pageName(location.pathname);

  function setActive(activeLink) {
    navLinks.forEach((l) => {
      l.classList.remove("is-current-page");
      l.removeAttribute("aria-current");
    });
    if (activeLink) {
      activeLink.classList.add("is-current-page");
      activeLink.setAttribute("aria-current", "page");
    }
  }

  // Links a otra página (ej. "espacio-latente.html"): resaltar si es la página actual.
  const pageLink = navLinks.find((link) => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) return false;
    return pageName(link.pathname) === currentFile;
  });
  if (pageLink) setActive(pageLink);

  // Anclas dentro de esta misma página: resaltar la sección visible al scrollear.
  const sectionLinks = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href.startsWith("#")) return null;
      const el = document.getElementById(href.slice(1));
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  if (sectionLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sectionLinks.find((s) => s.el === entry.target);
          if (match) setActive(match.link);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sectionLinks.forEach((s) => observer.observe(s.el));
  }

  if (!toggle) return;

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));

  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });
});

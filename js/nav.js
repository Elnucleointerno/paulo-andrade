document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!links) return;

  const navLinks = [...links.querySelectorAll("a")];
  const currentFile = location.pathname.split("/").pop() || "index.html";

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
    const linkFile = link.pathname.split("/").pop() || "index.html";
    return linkFile === currentFile;
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

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
});

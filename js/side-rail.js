document.addEventListener("DOMContentLoaded", () => {
  const rail = document.querySelector(".side-rail");
  if (!rail) return;

  const links = [...rail.querySelectorAll("a")];
  const sections = links
    .map((link) => ({
      link,
      el: document.getElementById(link.getAttribute("href").slice(1)),
    }))
    .filter((entry) => entry.el);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const match = sections.find((s) => s.el === entry.target);
        if (!match) return;
        links.forEach((l) => l.classList.remove("is-active"));
        match.link.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((s) => observer.observe(s.el));
});

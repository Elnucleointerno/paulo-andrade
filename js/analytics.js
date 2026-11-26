// Eventos propios para GoatCounter. Es una lista cerrada: no se junta nada más.
// Si el contador no carga o está bloqueado, no pasa nada y el sitio funciona igual.
document.addEventListener("DOMContentLoaded", () => {
  const sent = new Set();

  // Cada evento sale como mucho una vez por carga de página.
  function track(name) {
    const gc = window.goatcounter;
    if (sent.has(name) || !gc || !gc.count) return;
    sent.add(name);
    gc.count({ path: name, title: name, event: true });
  }

  const slug = (text) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const page = slug(location.pathname.split("/").pop().replace(/\.html$/, "")) || "inicio";

  /* ---------- Intentos de contacto y botones ---------- */
  function onClick(selector, name) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", () => track(name));
      el.addEventListener("auxclick", (e) => { if (e.button === 1) track(name); });
    });
  }
  onClick(".contact-email-copy", "contacto-copiar-email");
  onClick("a.contact-email", "contacto-mailto");
  onClick('#contacto a[href*="linkedin.com"]', "contacto-linkedin");
  onClick('.hero-actions a[href="#espacio-latente"]', "cta-hero-proyectos");
  onClick('.hero-actions a[href="#contacto"]', "cta-hero-contacto");
  onClick(".case-end .project-cta a", `cta-caso-${page}`);

  /* ---------- Secciones de la portada ---------- */
  // Cuenta solo si se queda 1 s: un salto por el menú pasa por todas las del medio.
  function onSeen(el, name, options) {
    if (!el) return;
    let timer = null;
    const observer = new IntersectionObserver((entries) => {
      clearTimeout(timer);
      if (!entries[entries.length - 1].isIntersecting) return;
      timer = setTimeout(() => {
        track(name);
        observer.disconnect();
      }, 1000);
    }, options);
    observer.observe(el);
  }

  if (document.querySelector(".hero") && "IntersectionObserver" in window) {
    const center = { rootMargin: "-45% 0px -45% 0px" };
    onSeen(document.getElementById("audiovisual"), "seccion-audiovisual", center);
    onSeen(document.getElementById("apps"), "seccion-apps", center);
    onSeen(document.getElementById("clientes"), "seccion-clientes", center);
    onSeen(document.getElementById("music"), "seccion-musica", center);
    // Contacto es la última y en pantallas altas no llega al centro: se mira la fila del email.
    onSeen(document.querySelector(".contact-email-row"), "seccion-contacto", { threshold: 0.5 });
  }

  /* ---------- Videos ---------- */
  // La fachada de YouTube se reemplaza al hacer clic, por eso se escucha en fase de captura.
  document.addEventListener("click", (e) => {
    const box = e.target.closest(".video-embed--facade");
    if (box && e.target.matches("img, .video-embed-play")) track(`video-${slug(box.dataset.title || "")}`);
  }, true);

  document.querySelectorAll("video.project-video[controls]").forEach((video) => {
    video.addEventListener("play", () => track(`video-demo-${page}`));
  });

  /* ---------- Imágenes ampliadas ---------- */
  function onZoom(e) {
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    if (!e.target.matches('.gallery-item img[role="button"]')) return;
    const heading = e.target.closest(".project-card")?.querySelector("h3");
    track(`galeria-${heading ? slug(heading.textContent) : page}`);
  }
  document.addEventListener("click", onZoom, true);
  document.addEventListener("keydown", onZoom, true);

  /* ---------- Espacio Latente: tocar «entrar» ---------- */
  const frame = document.querySelector(".espacio-latente-embed");
  if (frame) {
    const hook = () => {
      try {
        frame.contentDocument?.getElementById("threshold")
          ?.addEventListener("click", () => track("latente-entrar"));
      } catch (err) {
        // Abierto con file://, el iframe cuenta como otro origen.
      }
    };
    frame.addEventListener("load", hook);
    hook();
  }
});

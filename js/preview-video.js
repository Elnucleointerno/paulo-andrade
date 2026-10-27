document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".featured-project-media video, .project-media video[data-preview]");
  if (!videos.length) return;

  // Con movimiento reducido (o sin IntersectionObserver) el video nunca arranca: queda el póster.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    },
    { threshold: 0.25 }
  );
  videos.forEach((video) => observer.observe(video));
});

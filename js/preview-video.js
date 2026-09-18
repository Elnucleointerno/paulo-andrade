document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".featured-project-media video").forEach((video) => {
    video.removeAttribute("autoplay");
    video.pause();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-embed[data-video-id]").forEach((el) => {
    const id = el.dataset.videoId;
    const provider = el.dataset.videoProvider || "youtube";

    if (!id || id === "PEGAR_ID_VIDEO") {
      el.classList.add("video-embed--pending");
      el.innerHTML =
        "<p>Video demo pendiente<br><span>Reemplazá data-video-id (y data-video-provider si es Vimeo) en el HTML</span></p>";
      return;
    }

    const src =
      provider === "vimeo"
        ? `https://player.vimeo.com/video/${id}`
        : `https://www.youtube.com/embed/${id}`;

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = el.dataset.title || "Video demo";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    el.appendChild(iframe);
  });
});

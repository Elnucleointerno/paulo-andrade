document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-embed[data-video-id]").forEach((el, i) => {
    const id = el.dataset.videoId;
    const provider = el.dataset.videoProvider || "youtube";
    const title = el.dataset.title || "Video demo";

    if (!id || id === "PEGAR_ID_VIDEO") {
      el.classList.add("video-embed--pending");
      el.innerHTML = "<p>Demo próximamente</p>";
      return;
    }

    if (provider === "vimeo") {
      const iframe = document.createElement("iframe");
      iframe.src = `https://player.vimeo.com/video/${id}`;
      iframe.title = title;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      el.appendChild(iframe);
      return;
    }

    // Facade: solo pedirle a YouTube su miniatura hasta que hagan clic.
    el.classList.add("video-embed--facade");

    const thumb = document.createElement("img");
    thumb.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    thumb.alt = title;
    thumb.loading = i === 0 ? "eager" : "lazy";

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "video-embed-play";
    playBtn.setAttribute("aria-label", `Reproducir: ${title}`);
    playBtn.innerHTML = "&#9654;";

    function load() {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      iframe.title = title;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      el.classList.remove("video-embed--facade");
      el.innerHTML = "";
      el.appendChild(iframe);
    }

    thumb.addEventListener("click", load);
    playBtn.addEventListener("click", load);

    el.appendChild(thumb);
    el.appendChild(playBtn);
  });
});

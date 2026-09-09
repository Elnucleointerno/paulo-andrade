document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.closest(".gallery-item").classList.add("gallery-item--missing");
      },
      { once: true }
    );
  });
});

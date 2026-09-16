document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const buildEl = document.getElementById("build-date");
  if (buildEl) {
    const months = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic",
    ];
    const now = new Date();
    buildEl.textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const updatedEl = document.getElementById("last-updated");
  if (updatedEl) {
    const months = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic",
    ];
    const modified = new Date(document.lastModified);
    updatedEl.textContent = `${modified.getDate()} ${months[modified.getMonth()]} ${modified.getFullYear()}`;
  }
});

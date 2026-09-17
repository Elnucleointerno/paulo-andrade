document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".contact-email-copy");
  if (!button) return;

  const email = button.dataset.email;
  const originalLabel = button.textContent;
  let resetTimer = null;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      button.textContent = "Copiado ✓";
      button.classList.add("is-copied");
    } catch (err) {
      button.textContent = "No se pudo copiar";
    }

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      button.textContent = originalLabel;
      button.classList.remove("is-copied");
    }, 2000);
  });
});

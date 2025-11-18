document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("ios-banner");
  const closeBtn = document.getElementById("ios-banner-close");

  if (banner && closeBtn) {
    closeBtn.addEventListener("click", () => {
      banner.classList.add("ios-banner--hidden");
    });
  }
});

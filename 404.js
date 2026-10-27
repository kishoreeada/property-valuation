(() => {
  const homeButton = document.querySelector("[data-go-home]");
  const backButton = document.querySelector("[data-go-back]");

  if (homeButton) {
    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "index.html";
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      if (document.referrer) {
        window.location.href = document.referrer;
        return;
      }
      window.location.href = "index.html";
    });
  }
})();

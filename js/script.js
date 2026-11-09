// Guide to Automotive Survival

// ---------- Footer year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Mobile nav toggle ----------
(function mobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close after choosing a link, or on Escape
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
})();

// ---------- Hero background video ----------
(function heroVideo() {
  const video = document.getElementById("hero-video");
  const button = document.getElementById("hero-pause");
  if (!video || !button) return;

  const label = button.querySelector(".sr-only");
  const setPaused = (paused) => {
    button.setAttribute("aria-pressed", String(paused));
    label.textContent = paused ? "Play background video" : "Pause background video";
  };

  // Respect "reduce motion": show the poster frame instead of autoplaying
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    video.removeAttribute("autoplay");
    video.pause();
    setPaused(true);
  }

  button.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  });
})();

// ---------- Full video modal ----------
(function videoModal() {
  const dialog = document.getElementById("video-modal");
  const full = document.getElementById("full-video");
  const hero = document.getElementById("hero-video");
  if (!dialog || !full || typeof dialog.showModal !== "function") return;

  document.querySelectorAll("[data-open-video]").forEach((btn) => {
    btn.addEventListener("click", () => {
      dialog.showModal();
      hero && hero.pause();
      full.play().catch(() => {});
    });
  });

  dialog.querySelector("[data-close-video]").addEventListener("click", () => dialog.close());

  // Click on the dark backdrop closes it
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    full.pause();
    const heroPaused = document.getElementById("hero-pause")?.getAttribute("aria-pressed") === "true";
    if (hero && !heroPaused) hero.play().catch(() => {});
  });
})();

// ---------- "Save me a seat" form (Netlify Forms, submitted without leaving the page) ----------
(function handleNotifyForm() {
  const form = document.getElementById("notify-form");
  const status = document.getElementById("notify-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    button.disabled = true;
    status.classList.remove("is-error");
    status.textContent = "Sending…";

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);

      form.reset();
      status.textContent = "You're on the list! We'll let you know when class dates go live.";
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "Something went wrong — please try again in a minute.";
      console.error("Notify form error:", error);
    } finally {
      button.disabled = false;
    }
  });
})();

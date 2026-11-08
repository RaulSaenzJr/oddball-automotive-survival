// Guide to Automotive Survival — Under Construction page

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Rhinestone sparkles (a nod to the Stoned Square Body) ----------
(function addSparkles() {
  const layer = document.querySelector(".sparkles");
  if (!layer) return;

  const colors = ["#ffffff", "#ffcc00", "#19d3c5", "#e0115f", "#ff7a18", "#c9d1d9"];
  const count = window.innerWidth < 600 ? 22 : 45;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--size", 6 + Math.random() * 12 + "px");
    s.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    s.style.setProperty("--dur", 2 + Math.random() * 4 + "s");
    s.style.setProperty("--delay", Math.random() * 5 + "s");
    frag.appendChild(s);
  }
  layer.appendChild(frag);
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
    status.textContent = "Revving up…";

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);

      form.reset();
      status.textContent = "You're on the list! We'll holler when class dates drop. ✦";
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "Engine stalled — please try again in a minute.";
      console.error("Notify form error:", error);
    } finally {
      button.disabled = false;
    }
  });
})();

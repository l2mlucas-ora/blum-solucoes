/* Comportamento comum a todas as páginas: tema, menu mobile, formulários, cliques no WhatsApp, reveal. */
import { $, $$ } from "./dom";
import { track } from "./analytics";
import { initForms } from "./forms";

/* ---------------- TEMA ---------------- */
const root = document.documentElement, KEY = "blum-theme";
const effective = () => {
  const a = root.getAttribute("data-theme");
  if (a === "light" || a === "dark") return a;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};
$$("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
  const next = effective() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem(KEY, next); } catch { /* armazenamento bloqueado */ }
}));

/* ---------------- MENU MOBILE ---------------- */
const burger = $("#burger"), mpanel = $("#mpanel");
burger?.addEventListener("click", () => {
  const open = mpanel!.dataset.open === "true";
  mpanel!.dataset.open = String(!open);
  burger.setAttribute("aria-expanded", String(!open));
});
mpanel?.addEventListener("click", (e) => {
  if ((e.target as Element).closest("a, button")) { mpanel.dataset.open = "false"; burger?.setAttribute("aria-expanded", "false"); }
});

/* ---------------- WHATSAPP ---------------- */
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
  if (a) track("whatsapp_click", { pagina: location.pathname });
});

initForms();

/* ---------------- REVEAL ---------------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
} else $$(".reveal").forEach((el) => el.classList.add("in"));

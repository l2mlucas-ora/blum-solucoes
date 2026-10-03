/* Link da bio: destaque dinâmico, status de atendimento, origem "instagram/bio" nos leads e medição dos cliques. */
import { $, $$ } from "./dom";
import { track } from "./analytics";
import { abertoAgora } from "../data/site";

/* Quem chega pela bio vem do Instagram: marca a origem (sem sobrescrever UTM de campanha). */
try {
  const utm = JSON.parse(sessionStorage.getItem("blum-utm") || "{}");
  if (!utm.utm_source) {
    utm.utm_source = "instagram";
    utm.utm_medium = "bio";
    sessionStorage.setItem("blum-utm", JSON.stringify(utm));
  }
} catch { /* armazenamento bloqueado */ }

const st = $("#bio-status");
if (st) {
  const aberto = abertoAgora();
  st.dataset.estado = aberto ? "aberto" : "fechado";
  $(".bio-status-txt", st)!.textContent = (aberto ? st.dataset.aberto : st.dataset.fechado) || "";
}

/* Destaque: ?d=<id> força um; senão, o primeiro dentro do período de hoje. */
const cards = $$<HTMLElement>(".bio-destaque");
if (cards.length) {
  const pedido = new URLSearchParams(location.search).get("d");
  const hoje = new Date().toISOString().slice(0, 10);
  const escolhido =
    cards.find((c) => c.dataset.id === pedido) ??
    cards.find((c) => (c.dataset.de ?? "") <= hoje && hoje <= (c.dataset.ate ?? "")) ??
    cards[0];
  cards.forEach((c) => { c.hidden = c !== escolhido; });
}

document.addEventListener("click", (e) => {
  const el = (e.target as Element).closest<HTMLElement>("[data-bio]");
  if (el) track("bio_click", { link: el.dataset.bio });
});

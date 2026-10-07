/* Assistente guiado: motor da conversa (portado da Target). Roteiros por idioma em src/data/chat/{pt,en,es}.ts. */
import { roteiros, type ChatNode, type Opt } from "../data/chat";
import { allFaq } from "../data/faq";
import { waLink, abertoAgora, horarioTexto } from "../data/site";
import { langAtual } from "../i18n/routes";
import { ui } from "../i18n/ui";
import { $ } from "./dom";
import { sendLead, semBackend } from "./forms";
import { track } from "./analytics";

type State = Record<string, string>;
interface Msg { who: "bot" | "eu"; text: string }
interface Saved { state: State; log: Msg[]; node: string }

const L = langAtual();
const { flow, rotulos } = roteiros[L];
const T = ui[L].chat;
const FAQ = allFaq(L);
// Uma conversa por idioma: trocar de idioma não mistura falas.
const KEY = "blum-chat-" + L;
const root = $("#chat")!;
const panel = $("#chat-panel")!;
const fab = $<HTMLButtonElement>("#chat-fab")!;
const logEl = $("#chat-log")!;
const optsEl = $("#chat-opts")!;
const form = $<HTMLFormElement>("#chat-form")!;
const input = $<HTMLInputElement>("#chat-input")!;
const inputLbl = $<HTMLLabelElement>("#chat-input-lbl")!;
const teaser = $("#chat-teaser");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let s: Saved = load() ?? { state: {}, log: [], node: "" };

function load(): Saved | null {
  try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; }
}
function save() {
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* bloqueado */ }
}

/* ---------- renderização ---------- */
function bubble(m: Msg) {
  const d = document.createElement("div");
  d.className = "chat-msg " + (m.who === "bot" ? "is-bot" : "is-me");
  d.textContent = m.text;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
}
function push(m: Msg) { s.log.push(m); bubble(m); save(); }
function renderLog() { logEl.innerHTML = ""; s.log.forEach(bubble); }
function clearControls() { optsEl.innerHTML = ""; form.hidden = true; }

function renderOptions(opts: Opt[]) {
  clearControls();
  opts.forEach((o) => {
    const el = o.href || o.wa ? document.createElement("a") : document.createElement("button");
    el.className = "chat-opt";
    el.textContent = o.label;
    if (el instanceof HTMLAnchorElement) {
      el.href = o.wa ? waLink(resumo()) : o.href!;
      if (o.wa) el.dataset.wa = "1";
      if (/^https?:/.test(el.href) && !el.href.startsWith(location.origin)) { el.target = "_blank"; el.rel = "noopener"; }
      el.addEventListener("click", () => track("chat_step", { passo: s.node, opcao: o.label, idioma: L }));
    } else {
      el.type = "button";
      el.addEventListener("click", () => pick(o));
    }
    optsEl.appendChild(el);
  });
}

function renderInput(cfg: NonNullable<ChatNode["input"]>) {
  clearControls();
  form.hidden = false;
  inputLbl.textContent = cfg.label;
  input.type = cfg.type ?? "text";
  input.placeholder = cfg.placeholder ?? "";
  input.autocomplete = cfg.field === "nome" ? "name" : cfg.field === "telefone" ? "tel" : "off";
  input.inputMode = cfg.type === "tel" ? "tel" : "text";
  input.value = "";
  form.dataset.field = cfg.field;
  form.dataset.next = cfg.next;
  input.focus({ preventScroll: true });
}

/* ---------- navegação ---------- */
const pause = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

async function go(id: string) {
  s.node = id;
  const node = flow[id];
  if (node.enter) Object.assign(s.state, node.enter);
  clearControls();
  track("chat_step", { passo: id, idioma: L });
  if (id === "faq_res") return faqResult();
  if (id === "lead_envio") return leadConsent();
  for (const line of node.say) {
    await pause(320);
    push({ who: "bot", text: typeof line === "function" ? line(s.state) : line });
  }
  if (node.input) renderInput(node.input);
  else renderOptions(typeof node.options === "function" ? node.options(s.state) : node.options ?? []);
  save();
}

function pick(o: Opt) {
  push({ who: "eu", text: o.label });
  if (o.set) Object.assign(s.state, o.set);
  if (o.next) go(o.next);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = input.value.trim();
  const field = form.dataset.field!;
  if (!v) return;
  if (field === "telefone" && v.replace(/\D/g, "").length < 10) {
    input.setCustomValidity(T.telInvalido);
    input.reportValidity(); input.setCustomValidity("");
    return;
  }
  s.state[field] = v;
  push({ who: "eu", text: v });
  go(form.dataset.next!);
});

/* ---------- FAQ por palavras-chave ---------- */
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
const STOP = new Set(norm(T.stop).split(" "));
const tokens = (t: string) => norm(t).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

async function faqResult() {
  const q = tokens(s.state.pergunta || "");
  const scored = FAQ.map((f) => {
    const tq = tokens(f.q), ta = tokens(f.a);
    const score = q.reduce((n, w) => n + (tq.some((x) => x.startsWith(w) || w.startsWith(x)) ? 3 : 0) + (ta.includes(w) ? 1 : 0), 0);
    return { f, score };
  }).sort((a, b) => b.score - a.score);
  await pause(320);
  const best = scored[0];
  if (best && best.score >= 3) {
    push({ who: "bot", text: best.f.q });
    push({ who: "bot", text: best.f.a.replace(/<[^>]+>/g, "") });
    renderOptions([
      { label: T.faqOk, next: "fim" },
      { label: T.faqOutra, next: "faq" },
      { label: T.faqOrc, next: "orc" },
      { label: T.pessoa, next: "lead" },
    ]);
  } else {
    push({ who: "bot", text: T.faqNao });
    renderOptions([{ label: T.pessoa, next: "lead" }, { label: T.inicio, next: "inicio" }]);
  }
  save();
}

/* ---------- resumo e lead ---------- */
/** Campos de cada bloco da mensagem do WhatsApp (os rótulos vêm do roteiro do idioma). */
const BLOCOS: ["secPedido" | "secVisita", string[]][] = [
  ["secPedido", ["servico", "tipo", "local", "qtd", "detalhe"]],
  ["secVisita", ["cidade", "bairro", "dia", "periodo"]],
];
/** "ana maria" → "Ana Maria" (o nome aparece em negrito na saudação). */
const nomeBonito = (n: string) => n.trim().replace(/\s+/g, " ").replace(/(^|\s)\p{Ll}/gu, (c) => c.toUpperCase());

/** Mensagem pronta para o WhatsApp: saudação, resumo em blocos, dúvida e assinatura, com espaço entre as partes. */
function resumo() {
  const st = s.state;
  const intro = st.visita ? T.introVisita : st.servico ? T.introOrc(st.servico) : T.introGeral;
  const partes = [`${T.saudacao(nomeBonito(st.nome || ""))}\n${intro}`];
  for (const [titulo, campos] of BLOCOS) {
    const linhas = campos.filter((k) => st[k]).map((k) => `• *${rotulos[k]}:* ${st[k]}`);
    if (linhas.length) partes.push(`${T[titulo]}\n${linhas.join("\n")}`);
  }
  if (st.pergunta) partes.push(`${T.secDuvida}\n${st.pergunta}`);
  partes.push(T.assinatura);
  return partes.join("\n\n");
}

function leadConsent() {
  clearControls();
  const wrap = document.createElement("div");
  wrap.className = "chat-consent";
  wrap.innerHTML = `<label><input type="checkbox" id="chat-ok"> <span>${T.consent}</span></label>`;
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "btn btn-primary btn-sm"; btn.textContent = T.enviarTime;
  wrap.appendChild(btn);
  optsEl.appendChild(wrap);
  const ok = wrap.querySelector<HTMLInputElement>("#chat-ok")!;
  ok.focus();
  btn.addEventListener("click", async () => {
    if (!ok.checked) { ok.focus(); ok.closest("label")!.classList.add("is-err"); return; }
    btn.disabled = true; btn.textContent = T.enviando;
    const st = s.state;
    const campos: Record<string, string> = { nome: st.nome, telefone: st.telefone, consentimento: "sim", idioma: L.toUpperCase() };
    Object.entries(rotulos).forEach(([k, l]) => { if (st[k]) campos[l] = st[k]; });
    const origem = st.visita ? "visita" : st.servico ? "orcamento" : "chatbot";
    const produto = (st.visita ? `${T.visita} — ${st.servico || "?"}` : st.servico || T.atendimento) + (L === "pt" ? "" : ` [${L.toUpperCase()}]`);
    clearControls();
    if (semBackend) push({ who: "bot", text: T.viaWa });
    else {
      const r = await sendLead({ origem, produto, campos });
      push({ who: "bot", text: r.ok ? (abertoAgora() ? T.okHorario : T.okFora(horarioTexto(L))) : T.falha });
    }
    renderOptions([{ label: T.abrirWa, wa: true }, { label: T.inicio, next: "inicio" }]);
    save();
  });
}

/** Reabre a conversa salva mostrando os controles do nó atual, sem repetir as falas. */
function resume() {
  const node = flow[s.node];
  if (!node) return go("inicio");
  if (s.node === "lead_envio") return leadConsent();
  if (s.node === "faq_res") return renderOptions([{ label: T.pessoa, next: "lead" }, { label: T.inicio, next: "inicio" }]);
  if (node.input) renderInput(node.input);
  else renderOptions(typeof node.options === "function" ? node.options(s.state) : node.options ?? []);
}

/* ---------- abrir / fechar ---------- */
function open() {
  root.dataset.open = "true";
  fab.setAttribute("aria-expanded", "true");
  panel.hidden = false;
  teaser?.remove();
  try { sessionStorage.setItem("blum-chat-teaser", "1"); } catch { /* bloqueado */ }
  if (!s.log.length) {
    const start = document.body.dataset.chat || "inicio";
    go(flow[start] ? start : "inicio");
  } else {
    renderLog();
    resume();
  }
}
function close() {
  root.dataset.open = "false";
  fab.setAttribute("aria-expanded", "false");
  panel.hidden = true;
  fab.focus();
}
const reset = () => { s = { state: {}, log: [], node: "" }; save(); logEl.innerHTML = ""; };
fab.addEventListener("click", () => (root.dataset.open === "true" ? close() : open()));
$("#chat-close")!.addEventListener("click", close);
$("#chat-reset")!.addEventListener("click", () => { reset(); go("inicio"); });
panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
document.addEventListener("click", (e) => {
  const t = (e.target as Element).closest<HTMLElement>("[data-chat-open]");
  if (!t) return;
  e.preventDefault();
  if (t.dataset.chatOpen) { reset(); document.body.dataset.chat = t.dataset.chatOpen; }
  if (root.dataset.open !== "true") open();
  else go(document.body.dataset.chat || "inicio");
});

/* Convite discreto, uma vez por sessão. */
if (teaser) {
  let visto = false;
  try { visto = !!sessionStorage.getItem("blum-chat-teaser"); } catch { /* bloqueado */ }
  if (!visto && !s.log.length) {
    setTimeout(() => { if (root.dataset.open !== "true") teaser.hidden = false; }, Number(document.body.dataset.teaser) || 12000);
    teaser.querySelector("button")?.addEventListener("click", (e) => {
      e.stopPropagation(); teaser.remove();
      try { sessionStorage.setItem("blum-chat-teaser", "1"); } catch { /* bloqueado */ }
    });
    teaser.addEventListener("click", open);
  } else teaser.remove();
}

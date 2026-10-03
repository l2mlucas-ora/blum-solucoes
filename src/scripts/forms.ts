/* Envio de leads para /api/lead (Cloudflare Pages Function). Portado da Target. */
import { $, $$ } from "./dom";
import { getUtm, track } from "./analytics";
import { waLink } from "../data/site";
import { langAtual } from "../i18n/routes";
import { ui } from "../i18n/ui";

const L = langAtual();
const TF = ui[L].forms;
/** Prévia sem backend (GitHub Pages): o lead segue só pelo WhatsApp. */
export const semBackend = !!document.querySelector('meta[name="lead-off"]');

export interface LeadPayload {
  origem: string;
  produto?: string;
  campos: Record<string, string>;
}

/* Cloudflare Turnstile (anti-spam) — só carrega quando há site key configurada. */
const siteKey = document.querySelector<HTMLMetaElement>('meta[name="turnstile"]')?.content;
let turnstileReady: Promise<void> | null = null;
function loadTurnstile() {
  if (!siteKey) return Promise.resolve();
  turnstileReady ??= new Promise((res) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true; s.onload = () => res();
    document.head.appendChild(s);
  });
  return turnstileReady;
}
async function turnstileToken(): Promise<string> {
  if (!siteKey) return "";
  await loadTurnstile();
  const ts = (window as any).turnstile;
  const host = document.createElement("div");
  host.hidden = true; document.body.appendChild(host);
  return new Promise((res) => {
    ts.render(host, { sitekey: siteKey, size: "invisible", callback: (t: string) => { res(t); host.remove(); }, "error-callback": () => { res(""); host.remove(); } });
  });
}

export async function sendLead(p: LeadPayload): Promise<{ ok: boolean; erro?: string }> {
  const fd = new FormData();
  fd.set("origem", p.origem);
  if (p.produto) fd.set("produto", p.produto);
  fd.set("pagina", location.pathname);
  fd.set("utm", JSON.stringify(getUtm()));
  fd.set("campos", JSON.stringify(p.campos));
  fd.set("website", ""); // honeypot: precisa chegar vazio
  const token = await turnstileToken();
  if (token) fd.set("cf-turnstile-response", token);
  try {
    const r = await fetch("/api/lead", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    // As mensagens da Function são em PT; nos outros idiomas mostramos a genérica traduzida.
    if (!r.ok) return { ok: false, erro: L === "pt" ? j.erro || TF.falha : TF.falha };
    track("generate_lead", { origem: p.origem, produto: p.produto, idioma: L });
    return { ok: true };
  } catch {
    return { ok: false, erro: TF.offline };
  }
}

/** Lê os campos nomeados de um formulário como texto legível. */
function readFields(root: ParentNode): Record<string, string> {
  const out: Record<string, string> = {};
  $$<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input[name], select[name], textarea[name]", root).forEach((el) => {
    if (el instanceof HTMLInputElement && el.name === "website") return;
    if (el instanceof HTMLInputElement && el.type === "checkbox") { out[el.name] = el.checked ? "sim" : "não"; return; }
    if (el.value.trim()) out[el.name] = el.value.trim();
  });
  return out;
}

/** Formulário de contato: envia o lead; se falhar, oferece o WhatsApp já preenchido. */
export function initForms() {
  $$<HTMLFormElement>("form.form").forEach((f) => {
    const out = $("#" + f.id + "-msg");
    const btn = $<HTMLButtonElement>('button[type="submit"]', f);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      const label = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = TF.enviando; }
      const campos = readFields(f);
      if (L !== "pt") campos.idioma = L.toUpperCase();
      const r = semBackend ? { ok: false, erro: TF.viaWa } : await sendLead({ origem: f.dataset.origem || "contato", produto: campos["Serviço"] || TF.contato, campos });
      if (btn) { btn.disabled = false; btn.textContent = label ?? ""; }
      if (!out) return;
      if (r.ok) {
        out.textContent = TF.ok;
        out.dataset.estado = "ok";
        f.reset();
      } else {
        const msg = [TF.ola(campos.nome || ""), campos["Serviço"] ? TF.preciso(campos["Serviço"]) : "", campos.mensagem || ""].filter(Boolean).join(" ");
        out.textContent = (r.erro ?? TF.falha) + " ";
        const a = document.createElement("a");
        a.href = waLink(msg); a.target = "_blank"; a.rel = "noopener"; a.textContent = TF.porWa;
        out.append(a, ".");
        out.dataset.estado = semBackend ? "ok" : "erro";
      }
    });
  });
}

/* GA4 carregado só depois do consentimento (LGPD). Sem consentimento, os eventos são descartados. */
declare global { interface Window { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void } }

const CONSENT_KEY = "blum-consent";

export function consentGiven() {
  try { return localStorage.getItem(CONSENT_KEY) === "all"; } catch { return false; }
}

export function setConsent(v: "all" | "essential") {
  try { localStorage.setItem(CONSENT_KEY, v); } catch { /* bloqueado */ }
  if (v === "all") loadGA();
}

export function consentDecided() {
  try { return localStorage.getItem(CONSENT_KEY) !== null; } catch { return false; }
}

let loaded = false;
export function loadGA() {
  const id = document.querySelector<HTMLMetaElement>('meta[name="ga-id"]')?.content;
  if (!id || loaded || !consentGiven()) return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (window.gtag && consentGiven()) window.gtag("event", event, params);
}

/* Código de indicação de parceiro (?ref=codigo): o lead entra no CRM já na carteira do parceiro.
   Vale para a sessão inteira, mesmo que a pessoa navegue antes de preencher o formulário. */
function captureRef() {
  try {
    const ref = new URLSearchParams(location.search).get("ref")?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
    if (ref) sessionStorage.setItem("blum-ref", ref);
  } catch { /* bloqueado */ }
}

/* Guarda a origem da visita (UTM / referrer) para anexar aos leads. */
export function captureUtm() {
  captureRef();
  try {
    if (sessionStorage.getItem("blum-utm")) return;
    const p = new URLSearchParams(location.search);
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach((k) => {
      const v = p.get(k); if (v) utm[k] = v;
    });
    if (document.referrer && !document.referrer.startsWith(location.origin)) utm.referrer = document.referrer;
    utm.landing = location.pathname;
    sessionStorage.setItem("blum-utm", JSON.stringify(utm));
  } catch { /* bloqueado */ }
}

export function getUtm(): Record<string, string> {
  try {
    const utm = JSON.parse(sessionStorage.getItem("blum-utm") || "{}") as Record<string, string>;
    const ref = sessionStorage.getItem("blum-ref");
    return ref ? { ...utm, ref } : utm;
  } catch { return {}; }
}

captureUtm();
loadGA();

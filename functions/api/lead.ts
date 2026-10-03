/**
 * POST /api/lead — recebe leads do formulário de contato e do assistente (dúvida, pré-orçamento, visita técnica).
 *
 * Entrega (configurado por variáveis de ambiente no Cloudflare Pages):
 *   LEAD_EMAIL_TO, LEAD_EMAIL_FROM, RESEND_API_KEY  → e-mail para a equipe, com anexos
 *   CRM_WEBHOOK_URL (+ CRM_WEBHOOK_SECRET)          → JSON para o CRM (direto ou via Zapier/Make/n8n)
 *   TURNSTILE_SECRET                                 → valida o anti-spam do Cloudflare Turnstile
 *   LEAD_DEBUG=1                                     → aceita sem destino configurado (só desenvolvimento)
 *
 * Anexos nunca são gravados: seguem só no e-mail.
 */

interface Env {
  LEAD_EMAIL_TO?: string;
  LEAD_EMAIL_FROM?: string;
  RESEND_API_KEY?: string;
  CRM_WEBHOOK_URL?: string;
  CRM_WEBHOOK_SECRET?: string;
  TURNSTILE_SECRET?: string;
  LEAD_DEBUG?: string;
}

interface Ctx { request: Request; env: Env }

const ORIGENS = new Set(["chatbot", "contato", "orcamento", "visita"]);
const TIPOS = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"]);
const MAX_FILE = 10 * 1024 * 1024;
const MAX_FILES = 3;
const MAX_CAMPOS = 40;
const MAX_VALOR = 2000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const limpa = (v: unknown, max = MAX_VALOR) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

export interface Lead {
  id: string;
  recebidoEm: string;
  origem: string;
  produto: string;
  pagina: string;
  nome: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  campos: Record<string, string>;
  utm: Record<string, string>;
  anexos: { nome: string; tipo: string; bytes: number }[];
}

/** Valida e normaliza. Devolve o lead ou a mensagem de erro para o usuário. */
export function parseLead(fd: FormData, agora = new Date()): { lead?: Lead; arquivos?: File[]; erro?: string } {
  const origem = limpa(fd.get("origem"), 40);
  if (!ORIGENS.has(origem)) return { erro: "Origem inválida." };

  let bruto: Record<string, unknown> = {};
  try { bruto = JSON.parse(String(fd.get("campos") || "{}")); } catch { return { erro: "Dados inválidos." }; }
  if (typeof bruto !== "object" || bruto === null || Array.isArray(bruto)) return { erro: "Dados inválidos." };
  const entradas = Object.entries(bruto).slice(0, MAX_CAMPOS);
  const campos: Record<string, string> = {};
  for (const [k, v] of entradas) { const kk = limpa(k, 60); if (kk) campos[kk] = limpa(v); }

  const nome = campos.nome ?? "";
  const email = campos.email;
  const telefone = campos.telefone;
  if (nome.length < 2) return { erro: "Informe o seu nome." };
  if (!email && !telefone) return { erro: "Informe um e-mail ou telefone para contato." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { erro: "E-mail inválido." };
  if (telefone && telefone.replace(/\D/g, "").length < 10) return { erro: "Informe o telefone com DDD." };
  if (campos.consentimento !== "sim") return { erro: "É preciso aceitar a Política de Privacidade." };

  const arquivos = fd.getAll("arquivos").filter((f): f is File => typeof f === "object" && f !== null && "size" in f && (f as File).size > 0);
  if (arquivos.length > MAX_FILES) return { erro: `Envie no máximo ${MAX_FILES} arquivos.` };
  for (const f of arquivos) {
    if (f.size > MAX_FILE) return { erro: `O arquivo ${f.name} passa de 10 MB.` };
    if (!TIPOS.has(f.type)) return { erro: `Formato não aceito: ${f.name}. Envie JPG, PNG ou PDF.` };
  }

  let utm: Record<string, string> = {};
  try {
    const u = JSON.parse(String(fd.get("utm") || "{}"));
    if (u && typeof u === "object") utm = Object.fromEntries(Object.entries(u).slice(0, 10).map(([k, v]) => [limpa(k, 40), limpa(v, 300)]));
  } catch { /* ignora */ }

  const { nome: _n, email: _e, telefone: _t, empresa, ...resto } = campos;
  return {
    arquivos,
    lead: {
      id: crypto.randomUUID(),
      recebidoEm: agora.toISOString(),
      origem,
      produto: limpa(fd.get("produto"), 80) || origem,
      pagina: limpa(fd.get("pagina"), 200),
      nome,
      email,
      telefone,
      empresa,
      campos: resto,
      utm,
      anexos: arquivos.map((f) => ({ nome: limpa(f.name, 120), tipo: f.type, bytes: f.size })),
    },
  };
}

async function verificaTurnstile(token: string, secret: string, ip: string | null) {
  const body = new FormData();
  body.set("secret", secret); body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const j = (await r.json()) as { success?: boolean };
  return !!j.success;
}

function htmlEmail(l: Lead) {
  const linha = (k: string, v?: string) => (v ? `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>` : "");
  const tel = l.telefone?.replace(/\D/g, "");
  const wa = tel ? `https://wa.me/${tel.length <= 11 ? "55" + tel : tel}` : "";
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2 style="margin:0 0 6px">Novo lead: ${esc(l.produto)}</h2>
<p style="margin:0 0 14px;color:#555">Origem: ${esc(l.origem)} · ${esc(l.pagina)} · ${new Date(l.recebidoEm).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
<table style="border-collapse:collapse">${linha("Nome", l.nome)}${linha("Empresa", l.empresa)}${linha("E-mail", l.email)}${linha("Telefone", l.telefone)}
${Object.entries(l.campos).map(([k, v]) => linha(k, v)).join("")}</table>
${wa ? `<p style="margin:16px 0"><a href="${wa}" style="background:#25D366;color:#06301A;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Responder no WhatsApp</a></p>` : ""}
${Object.keys(l.utm).length ? `<p style="color:#777;font-size:12px">Origem da visita: ${esc(Object.entries(l.utm).map(([k, v]) => `${k}=${v}`).join(" · "))}</p>` : ""}
<p style="color:#777;font-size:12px">ID ${l.id}</p></div>`;
}

async function enviaEmail(env: Env, l: Lead, arquivos: File[]) {
  const toB64 = async (f: File) => {
    const bytes = new Uint8Array(await f.arrayBuffer());
    let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.LEAD_EMAIL_FROM || "Site Blum Soluções <onboarding@resend.dev>",
      to: env.LEAD_EMAIL_TO!.split(",").map((s) => s.trim()),
      reply_to: l.email || undefined,
      subject: `[Site] ${l.produto} — ${l.nome}`,
      html: htmlEmail(l),
      attachments: await Promise.all(arquivos.map(async (f) => ({ filename: f.name, content: await toB64(f) }))),
    }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

async function enviaWebhook(env: Env, l: Lead) {
  const r = await fetch(env.CRM_WEBHOOK_URL!, {
    method: "POST",
    headers: { "content-type": "application/json", ...(env.CRM_WEBHOOK_SECRET && { "x-webhook-secret": env.CRM_WEBHOOK_SECRET }) },
    body: JSON.stringify(l),
  });
  if (!r.ok) throw new Error(`Webhook ${r.status}`);
}

export async function onRequestPost({ request, env }: Ctx) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > MAX_FILES * MAX_FILE + 512 * 1024) return json({ erro: "Envio muito grande." }, 413);

  let fd: FormData;
  try { fd = await request.formData(); } catch { return json({ erro: "Envio inválido." }, 400); }

  // Honeypot: robô preencheu → responde OK e descarta.
  if (limpa(fd.get("website"))) return json({ ok: true });

  if (env.TURNSTILE_SECRET) {
    const token = String(fd.get("cf-turnstile-response") || "");
    if (!token || !(await verificaTurnstile(token, env.TURNSTILE_SECRET, request.headers.get("cf-connecting-ip")))) {
      return json({ erro: "Não conseguimos confirmar que você não é um robô. Recarregue a página e tente de novo." }, 400);
    }
  }

  const { lead, arquivos, erro } = parseLead(fd);
  if (!lead) return json({ erro }, 400);

  const tarefas: Promise<unknown>[] = [];
  if (env.RESEND_API_KEY && env.LEAD_EMAIL_TO) tarefas.push(enviaEmail(env, lead, arquivos ?? []));
  if (env.CRM_WEBHOOK_URL) tarefas.push(enviaWebhook(env, lead));

  if (!tarefas.length) {
    if (env.LEAD_DEBUG === "1") { console.log("[lead:debug]", JSON.stringify(lead)); return json({ ok: true, id: lead.id, debug: true }); }
    console.error("[lead] nenhum destino configurado");
    return json({ erro: "Nosso formulário está indisponível agora. Chame no WhatsApp." }, 503);
  }

  const res = await Promise.allSettled(tarefas);
  res.forEach((r) => { if (r.status === "rejected") console.error("[lead] falha na entrega", lead.id, String(r.reason)); });
  if (!res.some((r) => r.status === "fulfilled")) return json({ erro: "Não conseguimos registrar agora. Chame no WhatsApp." }, 502);
  return json({ ok: true, id: lead.id });
}

// onRequestPost tem precedência no POST; qualquer outro método cai aqui.
export const onRequest = () => json({ erro: "Método não permitido." }, 405);

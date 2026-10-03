// Testes da função /api/lead. Rodar: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { onRequestPost, onRequest, parseLead } from "../functions/api/lead.ts";

const form = (campos: Record<string, string>, extra: Record<string, string | Blob> = {}) => {
  const fd = new FormData();
  fd.set("origem", "orcamento"); fd.set("produto", "Câmeras de segurança"); fd.set("pagina", "/servicos/cameras-cftv/");
  fd.set("campos", JSON.stringify(campos)); fd.set("utm", JSON.stringify({ utm_source: "google" })); fd.set("website", "");
  for (const [k, v] of Object.entries(extra)) fd.append(k, v as any);
  return fd;
};
const ok = { nome: "Maria Souza", email: "maria@email.com", telefone: "(48) 99999-0000", consentimento: "sim", cameras: "4 a 8" };
const req = (fd: FormData) => new Request("http://x/api/lead", { method: "POST", body: fd });

test("aceita lead válido e separa os campos", () => {
  const { lead, erro } = parseLead(form(ok));
  assert.equal(erro, undefined);
  assert.equal(lead!.nome, "Maria Souza");
  assert.equal(lead!.campos.cameras, "4 a 8");
  assert.equal(lead!.utm.utm_source, "google");
});

test("exige consentimento, nome e contato", () => {
  assert.match(parseLead(form({ ...ok, consentimento: "não" })).erro!, /Política/);
  assert.match(parseLead(form({ ...ok, nome: "" })).erro!, /nome/);
  assert.match(parseLead(form({ nome: "Ana", consentimento: "sim" })).erro!, /e-mail ou telefone/);
  assert.match(parseLead(form({ ...ok, email: "x@y" })).erro!, /E-mail inválido/);
  assert.match(parseLead(form({ ...ok, telefone: "1234" })).erro!, /DDD/);
});

test("rejeita origem desconhecida e arquivo de tipo ou tamanho errado", () => {
  const fd = form(ok); fd.set("origem", "hack");
  assert.match(parseLead(fd).erro!, /Origem/);
  const exe = new File([new Uint8Array(10)], "virus.exe", { type: "application/x-msdownload" });
  assert.match(parseLead(form(ok, { arquivos: exe })).erro!, /Formato/);
  const grande = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.pdf", { type: "application/pdf" });
  assert.match(parseLead(form(ok, { arquivos: grande })).erro!, /10 MB/);
});

test("honeypot preenchido responde ok sem entregar", async () => {
  const fd = form(ok); fd.set("website", "http://spam");
  const r = await onRequestPost({ request: req(fd), env: {} });
  assert.equal(r.status, 200);
});

test("sem destino configurado: 503 em produção, ok em debug", async () => {
  assert.equal((await onRequestPost({ request: req(form(ok)), env: {} })).status, 503);
  assert.equal((await onRequestPost({ request: req(form(ok)), env: { LEAD_DEBUG: "1" } })).status, 200);
});

test("entrega no webhook do CRM com o segredo", async () => {
  let recebido: any, segredo: string | undefined;
  const srv = http.createServer((rq, rs) => {
    let b = ""; rq.on("data", (c) => (b += c)); rq.on("end", () => { recebido = JSON.parse(b); segredo = rq.headers["x-webhook-secret"] as string; rs.end("ok"); });
  });
  await new Promise<void>((r) => srv.listen(0, r));
  const port = (srv.address() as any).port;
  const r = await onRequestPost({ request: req(form(ok)), env: { CRM_WEBHOOK_URL: `http://127.0.0.1:${port}/`, CRM_WEBHOOK_SECRET: "s3gredo" } });
  srv.close();
  assert.equal(r.status, 200);
  assert.equal(recebido.nome, "Maria Souza");
  assert.equal(recebido.origem, "orcamento");
  assert.equal(segredo, "s3gredo");
});

test("webhook fora do ar: 502", async () => {
  const r = await onRequestPost({ request: req(form(ok)), env: { CRM_WEBHOOK_URL: "http://127.0.0.1:1/" } });
  assert.equal(r.status, 502);
});

test("aceita as origens do assistente e do formulário", () => {
  for (const o of ["chatbot", "contato", "visita"]) {
    const fd = form(ok); fd.set("origem", o);
    assert.equal(parseLead(fd).erro, undefined);
  }
});

test("outros métodos: 405", () => {
  assert.equal(onRequest().status, 405);
});

test("prévia em *.pages.dev não é indexada; domínio oficial é", async () => {
  const { onRequest: mw } = await import("../functions/_middleware.ts");
  const next = async () => new Response("ok", { headers: { "content-type": "text/html" } });
  const previa = await mw({ request: new Request("https://blum-solucoes.pages.dev/"), next });
  const oficial = await mw({ request: new Request("https://blumsolucoes.com.br/"), next });
  assert.equal(previa.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(oficial.headers.get("x-robots-tag"), null);
});

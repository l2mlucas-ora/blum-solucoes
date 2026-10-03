// Integridade dos roteiros do assistente nos três idiomas: rodado via esbuild (ver package.json → test).
import { roteiros, proximosDias } from "../src/data/chat";
import { allFaq } from "../src/data/faq";
import type { Lang } from "../src/i18n/routes";

let erros = 0;
const erro = (m: string) => { console.error("✗ " + m); erros++; };

const estados = [
  { servico: "Elétrica", tipo: "Obra nova", local: "Casa", chave: "ele_obra", nome: "Ana Lima", cidade: "Garopaba", dia: "Seg, 5 de out", periodo: "Manhã" },
  { servico: "Security cameras", qtd: "Up to 4", chave: "cam_4", nome: "Bruno", cidade: "Imbituba", dia: "As soon as possible", periodo: "Afternoon" },
  { servico: "Control de acceso", tipo: "Cerradura digital", chave: "acs_fechadura", nome: "Carla Souza", cidade: "Laguna", dia: "Sáb, 10 oct", periodo: "Cualquier horario" },
];

const idsPt = Object.keys(roteiros.pt.flow);
for (const lang of ["pt", "en", "es"] as Lang[]) {
  const { flow, rotulos } = roteiros[lang];
  // Mesmos nós em todos os idiomas: o motor e os botões data-chat-open dependem dos ids.
  for (const id of idsPt) if (!flow[id]) erro(`[${lang}] falta o nó ${id}`);
  for (const id of Object.keys(flow)) if (!idsPt.includes(id)) erro(`[${lang}] nó a mais: ${id}`);
  if (Object.keys(rotulos).join() !== Object.keys(roteiros.pt.rotulos).join()) erro(`[${lang}] rótulos do resumo diferentes do PT`);

  const alcancaveis = new Set<string>(["inicio", "faq_res", "lead_envio", "fim", "orc", "lead"]);
  for (const [id, node] of Object.entries(flow)) {
    for (const st of estados) {
      const s: Record<string, string> = { ...st };
      for (const line of node.say) {
        const t = typeof line === "function" ? line(s) : line;
        if (!t || /undefined|NaN|null/.test(t)) erro(`[${lang}] ${id}: fala inválida → ${t}`);
      }
      const opts = typeof node.options === "function" ? node.options(s) : node.options ?? [];
      for (const o of opts) {
        if (o.next) { alcancaveis.add(o.next); if (!flow[o.next]) erro(`[${lang}] ${id}: "${o.label}" → nó inexistente ${o.next}`); }
        if (!o.next && !o.href && !o.wa) erro(`[${lang}] ${id}: "${o.label}" não leva a lugar nenhum`);
      }
      if (node.input) { alcancaveis.add(node.input.next); if (!flow[node.input.next]) erro(`[${lang}] ${id}: input → ${node.input.next}`); }
      if (!node.input && !opts.length && !["faq_res", "lead_envio"].includes(id)) erro(`[${lang}] ${id}: nó sem saída`);
    }
  }
  for (const id of Object.keys(flow)) if (!alcancaveis.has(id)) erro(`[${lang}] nó órfão: ${id}`);

  const dias = proximosDias(5, lang, new Date("2026-10-03T12:00:00-03:00")); // sábado
  if (dias.length !== 5) erro(`[${lang}] proximosDias devolveu ${dias.length} dias`);
  if (dias.some((d) => /^(dom|sun)/i.test(d))) erro(`[${lang}] proximosDias incluiu domingo: ${dias.join(", ")}`);
  if (dias.some((d) => /^(s[aá]b|sat)/i.test(d))) erro(`[${lang}] proximosDias incluiu sábado (não há atendimento): ${dias.join(", ")}`);

  const faqs = allFaq(lang);
  if (faqs.length < 20) erro(`[${lang}] poucas FAQs (${faqs.length})`);
  console.log(`  ${lang}: ${Object.keys(flow).length} nós, ${faqs.length} FAQs · ${dias.join(" | ")}`);
}
console.log(erros ? `${erros} erro(s) nos roteiros` : "✓ roteiros do assistente ok nos três idiomas");
process.exit(erros ? 1 : 0);

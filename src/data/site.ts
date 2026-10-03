/**
 * Dados institucionais — fonte única para páginas, rodapé, JSON-LD, link da bio e assistente.
 * Itens marcados como PENDENTE precisam de confirmação do cliente (ver PENDENCIAS.md).
 */
import type { Lang, T } from "../i18n/routes";

/** "Há mais de 10 anos" (bio do Instagram). PENDENTE: confirmar o ano de início com o cliente. */
const INICIO_ATIVIDADE = 2015;
export const anosDeMercado = new Date().getFullYear() - INICIO_ATIVIDADE;

export const whatsapp = { numero: "5548996631148", exibicao: "(48) 99663-1148", internacional: "+55 48 99663-1148" };

export function waLink(mensagem?: string) {
  const base = `https://wa.me/${whatsapp.numero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export const waPadrao: T = {
  pt: "Olá! Vim pelo site da Blum Soluções e gostaria de um orçamento.",
  en: "Hi! I found Blum Soluções on your website and would like a quote. (I speak English)",
  es: "¡Hola! Vi el sitio de Blum Soluções y me gustaría un presupuesto. (Hablo español)",
};

export const site = {
  // PENDENTE: domínio definitivo (ver MIGRACAO.md).
  // Vem do `site` do astro.config.mjs (inclui a subpasta da prévia no GitHub Pages).
  url: String(import.meta.env?.SITE ?? "https://blum-solucoes.pages.dev").replace(/\/$/, ""),
  nome: "Blum Soluções",
  slogan: {
    pt: "Elétrica e segurança eletrônica em Garopaba e região",
    en: "Electrical and security systems in Garopaba, Brazil",
    es: "Electricidad y seguridad electrónica en Garopaba y región",
  } as T,
  // PENDENTE: razão social e CNPJ — aparecem no rodapé e no JSON-LD quando preenchidos.
  razaoSocial: "",
  cnpj: "",
  endereco: { cidade: "Garopaba", uf: "SC", regiaoIso: "BR-SC" },
  // PENDENTE: confirmar horário. O assistente e a bio usam estes valores para dizer "aberto agora".
  horario: {
    texto: {
      pt: "Segunda a sexta, 8h às 18h · Sábado, 8h às 12h",
      en: "Mon–Fri 8 am–6 pm · Sat 8 am–12 pm (Brasília time)",
      es: "Lunes a viernes, 8 a 18 h · Sábado, 8 a 12 h (hora de Brasilia)",
    } as T,
    semana: ["08:00", "18:00"],
    sabado: ["08:00", "12:00"],
  },
  redes: {
    instagram: "https://www.instagram.com/blum_solucoes/",
    instagramUser: "@blum_solucoes",
  },
  /** Cidades e praias atendidas — base do SEO local e da lista de cidades no assistente. */
  regiao: ["Garopaba", "Imbituba", "Paulo Lopes", "Imaruí", "Praia do Rosa", "Ibiraquera", "Siriú", "Ferrugem", "Encantada", "Palhocinha"],
} as const;

/** URL absoluta de um caminho do site ("/en/" → "https://…/en/"), respeitando a subpasta da prévia. */
export const abs = (path: string) => site.url + (path.startsWith("/") ? path : "/" + path);

export const horarioTexto = (lang: Lang) => site.horario.texto[lang];

/** Atendimento humano aberto agora? (America/Sao_Paulo). Usado pelo assistente e pela bio. */
export function abertoAgora(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const dia = get("weekday");
  const min = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  const faixa = dia === "Sun" ? null : dia === "Sat" ? site.horario.sabado : site.horario.semana;
  if (!faixa) return false;
  const [a, f] = faixa.map((h) => { const [hh, mm] = h.split(":").map(Number); return hh * 60 + mm; });
  return min >= a && min < f;
}

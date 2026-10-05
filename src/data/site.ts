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
  // Confirmado pelo cliente em 03/10/2026. O assistente e a bio usam estes valores para dizer "aberto agora".
  // `sabado: null` = fechado no sábado (para abrir, use ["09:00", "12:00"] e ajuste os textos).
  horario: {
    texto: {
      pt: "Segunda a sexta, 9h às 17h",
      en: "Mon–Fri, 9 am–5 pm (Brasília time)",
      es: "Lunes a viernes, 9 a 17 h (hora de Brasilia)",
    } as T,
    semana: ["09:00", "17:00"],
    sabado: null as readonly [string, string] | null,
  },
  redes: {
    instagram: "https://www.instagram.com/blum_solucoes/",
    instagramUser: "@blum_solucoes",
  },
  /** Cidades e praias atendidas — base do SEO local e da lista de cidades no assistente. */
  regiao: ["Garopaba", "Imbituba", "Paulo Lopes", "Imaruí", "Praia do Rosa", "Ibiraquera", "Siriú", "Ferrugem", "Encantada", "Palhocinha"],
} as const;

/** Responsável técnico — formação exibida na página Sobre (completa) e na home (resumida). */
export const responsavel = {
  nome: "Fernando Blum",
  cargo: { pt: "Responsável técnico", en: "Technical lead", es: "Responsable técnico" } as T,
  formacao: { pt: "Técnico em Eletrônica", en: "Electronics Technician", es: "Técnico en Electrónica" } as T,
  especializacoes: [
    { icone: "rede", nome: { pt: "Redes", en: "Networking", es: "Redes" } as T,
      desc: { pt: "Infraestrutura de rede e Wi-Fi que sustenta câmeras, alarmes e automação.", en: "Network and Wi-Fi infrastructure behind cameras, alarms and automation.", es: "Infraestructura de red y Wi-Fi que sostiene cámaras, alarmas y automatización." } as T },
    { icone: "fogo", nome: { pt: "Sistemas de prevenção de incêndio", en: "Fire prevention systems", es: "Sistemas de prevención de incendios" } as T,
      desc: { pt: "Detecção e alarme de incêndio para residências e comércios.", en: "Fire detection and alarm systems for homes and businesses.", es: "Detección y alarma de incendio para casas y comercios." } as T },
    { icone: "chave", nome: { pt: "Controle de acesso", en: "Access control", es: "Control de acceso" } as T,
      desc: { pt: "Fechaduras digitais, biometria, interfonia e gestão de acessos.", en: "Smart locks, biometrics, intercoms and access management.", es: "Cerraduras digitales, biometría, porteros y gestión de accesos." } as T },
    { icone: "radar", nome: { pt: "Alarme perimetral com IA", en: "AI perimeter alarms", es: "Alarma perimetral con IA" } as T,
      desc: { pt: "Inteligência artificial que distingue pessoas e veículos e reduz alarmes falsos.", en: "Artificial intelligence that tells people and vehicles apart and cuts false alarms.", es: "Inteligencia artificial que distingue personas y vehículos y reduce falsas alarmas." } as T },
  ],
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
  const faixa: readonly string[] | null = dia === "Sun" ? null : dia === "Sat" ? site.horario.sabado : site.horario.semana;
  if (!faixa) return false;
  const [a, f] = faixa.map((h) => { const [hh, mm] = h.split(":").map(Number); return hh * 60 + mm; });
  return min >= a && min < f;
}

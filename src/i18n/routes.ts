/**
 * Mapa de endereços nos três idiomas (mesmo modelo da Target). Toda página existe em PT, EN e ES:
 * - gera o hreflang no <head>;
 * - faz o seletor de idioma abrir a mesma página no outro idioma;
 * - `r(chave, lang)` monta links internos sem escrever URL na mão.
 */
export type Lang = "pt" | "en" | "es";
export const LANGS: Lang[] = ["pt", "en", "es"];
export const htmlLang: Record<Lang, string> = { pt: "pt-BR", en: "en", es: "es" };
export const ogLocale: Record<Lang, string> = { pt: "pt_BR", en: "en_US", es: "es_ES" };
export const nomeIdioma: Record<Lang, string> = { pt: "Português", en: "English", es: "Español" };

export type T = Record<Lang, string>;

/** Slug de cada serviço em cada idioma (o id é o slug em PT). */
export const servicoSlug: Record<string, T> = {
  "eletrica": { pt: "eletrica", en: "electrical", es: "electricidad" },
  "cameras-cftv": { pt: "cameras-cftv", en: "security-cameras", es: "camaras-de-seguridad" },
  "controle-de-acesso": { pt: "controle-de-acesso", en: "access-control", es: "control-de-acceso" },
  "seguranca-eletronica": { pt: "seguranca-eletronica", en: "alarms-and-security", es: "alarmas-y-seguridad" },
  "iluminacao": { pt: "iluminacao", en: "lighting", es: "iluminacion" },
};
const baseServicos: T = { pt: "/servicos/", en: "/en/services/", es: "/es/servicios/" };

export const rotas = {
  home: { pt: "/", en: "/en/", es: "/es/" },
  sobre: { pt: "/sobre/", en: "/en/about/", es: "/es/sobre-nosotros/" },
  privacidade: { pt: "/politica-de-privacidade/", en: "/en/privacy-policy/", es: "/es/politica-de-privacidad/" },
  bio: { pt: "/bio/", en: "/en/bio/", es: "/es/bio/" },
  eletricista: { pt: "/eletricista-garopaba/", en: "/en/electrician-garopaba/", es: "/es/electricista-garopaba/" },
  cameras: { pt: "/cameras-de-seguranca-garopaba/", en: "/en/security-cameras-garopaba/", es: "/es/camaras-de-seguridad-garopaba/" },
  temporada: { pt: "/casa-de-temporada-garopaba/", en: "/en/vacation-rental-garopaba/", es: "/es/casa-de-temporada-garopaba/" },
  ...Object.fromEntries(Object.entries(servicoSlug).map(([id, s]) => [
    `servico:${id}`, { pt: baseServicos.pt + s.pt + "/", en: baseServicos.en + s.en + "/", es: baseServicos.es + s.es + "/" },
  ])),
} as Record<string, T>;

export type PageKey = "home" | "sobre" | "privacidade" | "bio" | "eletricista" | "cameras" | "temporada" | `servico:${string}`;

/** Link interno no idioma: r("sobre", "en") → "/en/about/". */
export function r(key: PageKey, lang: Lang, hash = ""): string {
  const m = rotas[key];
  if (!m) throw new Error(`Rota desconhecida: ${key}`);
  return m[lang] + hash;
}
export const rServico = (id: string, lang: Lang, hash = "") => r(`servico:${id}`, lang, hash);

/** Versões de uma URL em cada idioma (null = página sem equivalente, ex.: 404). */
export function alternativas(pathname: string): T | null {
  const p = pathname.endsWith("/") ? pathname : pathname + "/";
  return Object.values(rotas).find((x) => Object.values(x).includes(p)) ?? null;
}

export function idiomaDe(pathname: string): Lang {
  return pathname.startsWith("/en/") || pathname === "/en" ? "en" : pathname.startsWith("/es/") || pathname === "/es" ? "es" : "pt";
}

/** Idioma da página no navegador (lê o <html lang>). */
export function langAtual(): Lang {
  const l = document.documentElement.lang;
  return l.startsWith("en") ? "en" : l.startsWith("es") ? "es" : "pt";
}

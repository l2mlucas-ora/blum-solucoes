// Confere o site gerado (dist/): toda página indexável tem hreflang PT/EN/ES + x-default apontando para
// páginas que existem, o <html lang> bate com o idioma da URL e nenhum link interno quebra.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const paginas = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) paginas.push(p);
  }
})(DIST);

const existe = (url) => {
  const path = new URL(url, "https://x").pathname;
  if (/\.[a-z0-9]+$/i.test(path)) return existsSync(join(DIST, path));
  return existsSync(join(DIST, path, "index.html"));
};
const urlDe = (arq) => "/" + arq.slice(DIST.length + 1).replace(/\\/g, "/").replace(/index\.html$/, "").replace(/\.html$/, "/");
const langDe = (u) => (u.startsWith("/en/") ? "en" : u.startsWith("/es/") ? "es" : "pt");
const HTML = { pt: "pt-BR", en: "en", es: "es" };

let erros = 0;
const erro = (m) => { console.error("✗ " + m); erros++; };
for (const arq of paginas) {
  const html = readFileSync(arq, "utf8");
  const url = urlDe(arq);
  if (url === "/404/") continue;
  const lang = langDe(url);
  const hl = html.match(/<html lang="([^"]+)"/)?.[1];
  if (hl !== HTML[lang]) erro(`${url}: <html lang="${hl}"> deveria ser ${HTML[lang]}`);
  const noindex = /name="robots" content="noindex/.test(html);
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  if (!noindex) {
    for (const h of ["pt-BR", "en", "es", "x-default"]) if (!alts.some(([x]) => x === h)) erro(`${url}: falta hreflang ${h}`);
    for (const [h, href] of alts) if (!existe(href)) erro(`${url}: hreflang ${h} → ${href} não existe`);
  }
  // O seletor de idioma é o único lugar que pode linkar para outro idioma.
  const corpo = html.replace(/<ul class="lang-menu">[\s\S]*?<\/ul>/g, "");
  for (const m of corpo.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (href.startsWith("/_astro/") || href.startsWith("/api/")) continue;
    if (!existe(href)) erro(`${url}: link interno quebrado → ${href}`);
    else if (!/\.[a-z0-9]+$/i.test(href) && langDe(href) !== lang)
      erro(`${url}: link para página em outro idioma → ${href}`);
  }
}
console.log(erros ? `${erros} erro(s) de i18n/links` : `✓ ${paginas.length} páginas: hreflang, idioma e links internos ok`);
process.exit(erros ? 1 : 0);

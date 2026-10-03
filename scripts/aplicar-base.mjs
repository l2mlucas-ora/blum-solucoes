// Prévia em subpasta (GitHub Pages: /blum-solucoes/): prefixa BASE_PATH nos caminhos internos que começam
// em "/" dentro do HTML, JS e CSS gerados. Sem BASE_PATH (domínio próprio), não faz nada.
// Cobre href/src/srcset/action (inclusive dentro de strings JS) e url(/...) no CSS (fontes).
// É idempotente: não prefixa o que já começa com o BASE_PATH.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const base = (process.env.BASE_PATH || "").replace(/\/$/, "");
if (!base) { console.log("aplicar-base: sem BASE_PATH, nada a fazer"); process.exit(0); }

const arquivos = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|js|css)$/.test(f)) arquivos.push(p);
  }
})("dist");

const jaTem = base.slice(1) + "/";
const re = /((?:href|src|srcset|action)=\\?["']|url\(["']?)\/(?!\/)/g;
let n = 0;
for (const arq of arquivos) {
  const txt = readFileSync(arq, "utf8");
  const novo = txt.replace(re, (m, attr, off) => (txt.startsWith(jaTem, off + m.length) ? m : (n++, `${attr}${base}/`)));
  if (novo !== txt) writeFileSync(arq, novo);
}
console.log(`aplicar-base: ${n} caminhos prefixados com ${base} em ${arquivos.length} arquivos`);

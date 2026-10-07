import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * Endereço público: https://blumsolucoes.com.br (publicado por scripts/publicar-site.mjs → npm run publicar).
 * BASE_PATH só é usado se um dia o site voltar a rodar numa subpasta (ex.: prévia em usuario.github.io/projeto);
 * nesse caso scripts/aplicar-base.mjs prefixa a subpasta no HTML/JS/CSS gerado.
 */
// SITE inclui a subpasta da prévia; o Astro não usa `base` (os caminhos das páginas continuam começando em "/").
const SITE = (process.env.SITE_URL || "https://blumsolucoes.com.br") + (process.env.BASE_PATH || "").replace(/\/$/, "");

export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
  integrations: [
    sitemap({ filter: (page) => !page.includes("/404") && !/\/bio\/$/.test(page) }),
  ],
});

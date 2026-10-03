import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * Endereço público. Prévia no GitHub Pages: SITE_URL=https://l2mlucas-ora.github.io BASE_PATH=/blum-solucoes
 * (definidos no workflow .github/workflows/previa.yml). Com o domínio próprio, basta SITE_URL — sem BASE_PATH.
 * O código usa caminhos começando em "/"; scripts/aplicar-base.mjs prefixa o BASE_PATH no HTML/JS/CSS gerado.
 */
// SITE inclui a subpasta da prévia; o Astro não usa `base` (os caminhos das páginas continuam começando em "/").
const SITE = (process.env.SITE_URL || "https://blum-solucoes.pages.dev") + (process.env.BASE_PATH || "").replace(/\/$/, "");

export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "auto" },
  integrations: [
    sitemap({ filter: (page) => !page.includes("/404") && !/\/bio\/$/.test(page) }),
  ],
});

// Publica a prévia no GitHub Pages (branch gh-pages): https://l2mlucas-ora.github.io/blum-solucoes/
// Uso: npm run previa
// 1) roda os testes; 2) gera o site na subpasta, com noindex e leads só pelo WhatsApp;
// 3) envia o dist/ para a branch gh-pages (substitui a versão anterior).
import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";

const env = {
  ...process.env,
  SITE_URL: "https://l2mlucas-ora.github.io",
  BASE_PATH: "/blum-solucoes",
  PUBLIC_PREVIA: "1",
  // Git Bash no Windows converte "/blum-solucoes" em caminho de disco; isto desliga a conversão.
  MSYS_NO_PATHCONV: "1",
  MSYS2_ARG_CONV_EXCL: "*",
};
const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", env, ...opts });

run("npm test");
run("npm run build");
run("node scripts/aplicar-base.mjs");
writeFileSync("dist/.nojekyll", ""); // sem isso o GitHub Pages ignora a pasta _astro/

const remoto = execSync("git remote get-url origin").toString().trim();
const commit = execSync("git rev-parse --short HEAD").toString().trim();
rmSync("dist/.git", { recursive: true, force: true });
run("git init -q -b gh-pages", { cwd: "dist" });
run("git add -A", { cwd: "dist" });
run(`git commit -q -m "Prévia a partir de ${commit}"`, { cwd: "dist" });
run(`git push -q -f ${remoto} gh-pages`, { cwd: "dist" });
rmSync("dist/.git", { recursive: true, force: true });
console.log("\n✓ Prévia publicada: https://l2mlucas-ora.github.io/blum-solucoes/ (pode levar 1–2 min para atualizar)");

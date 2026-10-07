// Publica o SITE OFICIAL no GitHub Pages com o domínio próprio: https://blumsolucoes.com.br
// Uso: npm run publicar
// 1) roda os testes; 2) gera o site na raiz do domínio, indexável no Google, com os pedidos indo
//    direto ao WhatsApp (o GitHub Pages não roda /api/lead); 3) envia o dist/ para a branch gh-pages.
// O arquivo CNAME diz ao GitHub qual é o domínio — sem ele, o domínio é desligado a cada publicação.
import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";

const DOMINIO = "blumsolucoes.com.br";
const env = { ...process.env, SITE_URL: `https://${DOMINIO}`, BASE_PATH: "", PUBLIC_SEM_API: "1", PUBLIC_PREVIA: "" };
const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", env, ...opts });

run("npm test");
run("npm run build");
writeFileSync("dist/CNAME", DOMINIO + "\n");
writeFileSync("dist/.nojekyll", ""); // sem isso o GitHub Pages ignora a pasta _astro/

const remoto = execSync("git remote get-url origin").toString().trim();
const commit = execSync("git rev-parse --short HEAD").toString().trim();
rmSync("dist/.git", { recursive: true, force: true });
run("git init -q -b gh-pages", { cwd: "dist" });
run("git add -A", { cwd: "dist" });
run(`git commit -q -m "Site oficial a partir de ${commit}"`, { cwd: "dist" });
run(`git push -q -f ${remoto} gh-pages`, { cwd: "dist" });
rmSync("dist/.git", { recursive: true, force: true });
console.log(`\n✓ Site publicado: https://${DOMINIO}/ (pode levar 1–2 min para atualizar)`);

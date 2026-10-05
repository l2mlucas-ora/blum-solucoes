/**
 * Ponto de foco de cada foto (CSS object-position: "x% y%"). Quando a moldura corta a foto
 * (celular, cards, galeria), o corte centraliza no que importa: a fechadura, a lente da câmera, o altar...
 * Foto nova sem entrada aqui = centro ("50% 50%").
 */
const FOCO: Record<string, string> = {
  "/img/obras/igreja-depois.webp": "50% 62%",
  "/img/obras/igreja-antes.webp": "50% 55%",
  "/img/obras/van-blum.webp": "50% 70%",
  "/img/obras/motor-portao.webp": "50% 70%",
  "/img/obras/predio-por-do-sol.webp": "50% 45%",
  "/img/obras/camera-fachada.webp": "62% 55%",
  "/img/obras/camera-pergolado.webp": "30% 68%",
  "/img/obras/eletroposto.webp": "78% 30%",
  "/img/obras/fechadura.webp": "32% 55%",
  "/img/obras/responsavel.webp": "50% 35%",
};

export const foco = (src?: string) => `object-position:${(src && FOCO[src]) || "50% 50%"}`;

/**
 * Versões responsivas: para cada foto em /img/obras/x.webp existe x-640.webp (gerada junto com a otimização).
 * O navegador baixa a menor que serve na tela — no celular, a de 640 px.
 * Só roda no build (Astro), por isso pode olhar o disco.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
export function srcset(src?: string): string | undefined {
  if (!src || !src.startsWith("/img/obras/") || !src.endsWith(".webp")) return undefined;
  const p640 = src.replace(/\.webp$/, "-640.webp");
  return existsSync(join(process.cwd(), "public", p640)) ? `${p640} 640w, ${src} 1050w` : undefined;
}

/**
 * Ponto de foco de cada foto (CSS object-position: "x% y%"). Quando a moldura corta a foto
 * (celular, cards, galeria), o corte centraliza no que importa: a fechadura, a lente da câmera, o altar...
 * Foto nova sem entrada aqui = centro ("50% 50%").
 */
const FOCO: Record<string, string> = {
  "/img/obras/igreja-depois.webp": "50% 62%",
  "/img/obras/igreja-antes.webp": "50% 55%",
  "/img/obras/camera-fachada.webp": "62% 55%",
  "/img/obras/camera-pergolado.webp": "30% 68%",
  "/img/obras/eletroposto.webp": "45% 35%",
  "/img/obras/corredor-led.webp": "50% 40%",
  "/img/obras/loja-trilho.webp": "50% 35%",
  "/img/obras/sanca-led.webp": "50% 40%",
  "/img/obras/fechadura.webp": "32% 55%",
  "/img/ig/post5.jpg": "50% 45%",
  "/img/obras/responsavel.webp": "50% 35%",
};

export const foco = (src?: string) => `object-position:${(src && FOCO[src]) || "50% 50%"}`;

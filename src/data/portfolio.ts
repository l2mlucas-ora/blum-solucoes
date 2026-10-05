/**
 * Portfólio ("book" de obras): cada foto pertence a um serviço (id de servicos.ts).
 * Aparece no carrossel da home (com filtro por serviço) e no carrossel da página do serviço.
 * Para adicionar: otimize a foto em public/img/obras/ (ver README → Fotos) e inclua uma linha aqui.
 * Ordem = ordem no carrossel (as melhores primeiro).
 */
import type { T } from "../i18n/routes";

export interface Obra {
  src: string;
  servico: "eletrica" | "cameras-cftv" | "controle-de-acesso" | "seguranca-eletronica" | "iluminacao";
  legenda: T;
}

export const portfolio: Obra[] = [
  { src: "/img/obras/igreja-depois.webp", servico: "iluminacao",
    legenda: { pt: "Igreja: forro de madeira com spots e LED", en: "Church: wooden ceiling with spots and LED", es: "Iglesia: techo de madera con spots y LED" } },
  { src: "/img/obras/camera-pergolado.webp", servico: "cameras-cftv",
    legenda: { pt: "Câmera Intelbras em pergolado", en: "Intelbras camera on a pergola", es: "Cámara Intelbras en pérgola" } },
  { src: "/img/obras/eletroposto.webp", servico: "eletrica",
    legenda: { pt: "Eletroposto: carregador de carro elétrico", en: "EV charging station", es: "Electrolinera: cargador de auto eléctrico" } },
  { src: "/img/obras/fechadura.webp", servico: "controle-de-acesso",
    legenda: { pt: "Fechadura digital em porta ripada", en: "Smart lock on a slatted door", es: "Cerradura digital en puerta de listones" } },
  { src: "/img/obras/corredor-led.webp", servico: "iluminacao",
    legenda: { pt: "Perfil de LED embutido no corredor", en: "Recessed LED profile in a hallway", es: "Perfil LED empotrado en el pasillo" } },
  { src: "/img/obras/camera-fachada.webp", servico: "seguranca-eletronica",
    legenda: { pt: "CFTV com caixa de passagem e acabamento", en: "CCTV with junction box and clean finish", es: "CCTV con caja de paso y buena terminación" } },
  { src: "/img/obras/loja-trilho.webp", servico: "iluminacao",
    legenda: { pt: "Loja: trilhos de spots e LED", en: "Store: track spotlights and LED", es: "Tienda: rieles de spots y LED" } },
  { src: "/img/obras/sanca-led.webp", servico: "iluminacao",
    legenda: { pt: "Sanca com luz indireta", en: "Ceiling cove with indirect light", es: "Garganta con luz indirecta" } },
  { src: "/img/obras/balizadores.webp", servico: "iluminacao",
    legenda: { pt: "Balizadores em área externa", en: "Outdoor path lights", es: "Balizas en exterior" } },
];

export const obrasDo = (servico: string) => portfolio.filter((o) => o.servico === servico);

/**
 * Portfólio ("book" de obras): cada foto pertence a um serviço (id de servicos.ts).
 * Aparece no carrossel da home (com filtro por serviço) e no carrossel da página do serviço.
 * Para adicionar: otimize a foto em public/img/obras/ (ver README → Fotos novas) e inclua uma linha aqui.
 * Ordem = ordem no carrossel "Todos" (as mais fortes primeiro, intercalando serviços).
 */
import type { T } from "../i18n/routes";

export interface Obra {
  src: string;
  servico: "eletrica" | "cameras-cftv" | "controle-de-acesso" | "seguranca-eletronica" | "iluminacao";
  legenda: T;
}

const o = (src: string, servico: Obra["servico"], pt: string, en: string, es: string): Obra =>
  ({ src: `/img/obras/${src}.webp`, servico, legenda: { pt, en, es } });

export const portfolio: Obra[] = [
  o("igreja-depois", "iluminacao", "Igreja: forro de madeira com spots e LED", "Church: wooden ceiling with spots and LED", "Iglesia: techo de madera con spots y LED"),
  o("predio-por-do-sol", "iluminacao", "Fachada residencial iluminada ao entardecer", "Residential facade lit at dusk", "Fachada residencial iluminada al atardecer"),
  o("camera-ptz-wifi", "cameras-cftv", "Câmera PTZ Wi-Fi com caixa de passagem", "Wi-Fi PTZ camera with junction box", "Cámara PTZ Wi-Fi con caja de paso"),
  o("academia-1", "iluminacao", "Academia: iluminação linear e destaques em LED", "Gym: linear lighting with LED accents", "Gimnasio: iluminación lineal y acentos LED"),
  o("motor-portao", "controle-de-acesso", "Automação de portão com motor e fotocélula", "Automatic gate with motor and photocell", "Portón automático con motor y fotocélula"),
  o("casa-entardecer", "iluminacao", "Casa com fachada e balizadores iluminados", "House with lit facade and path lights", "Casa con fachada y balizas iluminadas"),
  o("eletroposto", "cameras-cftv", "Câmeras de segurança instaladas em eletroposto", "Security cameras installed at an EV charging station", "Cámaras de seguridad instaladas en una electrolinera"),
  o("escada-pedra-led", "iluminacao", "Escada com LED e parede de pedra em destaque", "Staircase with LED and accent-lit stone wall", "Escalera con LED y pared de piedra destacada"),
  o("rack-cftv", "cameras-cftv", "Rack de CFTV e rede organizado", "Organized CCTV and network rack", "Rack de CCTV y red ordenado"),
  o("cozinha-gourmet-pendentes", "iluminacao", "Espaço gourmet com pendentes circulares", "Gourmet area with ring pendants", "Espacio gourmet con colgantes circulares"),
  o("fechadura", "controle-de-acesso", "Fechadura digital em porta ripada", "Smart lock on a slatted door", "Cerradura digital en puerta de listones"),
  o("perfis-led-zenith", "iluminacao", "Perfis de LED em espaço comercial", "LED profiles in a commercial space", "Perfiles LED en espacio comercial"),
  o("ligacoes-conectores", "eletrica", "Ligações com conectores de alavanca", "Wiring with lever connectors", "Conexiones con conectores de palanca"),
  o("academia-2", "iluminacao", "Academia: iluminação com vista para o mar", "Gym lighting with ocean view", "Gimnasio: iluminación con vista al mar"),
  o("camera-dome-teto", "cameras-cftv", "Câmera dome com eletroduto aparente", "Dome camera with exposed conduit", "Cámara domo con conducto a la vista"),
  o("sala-painel-led", "iluminacao", "Painel de TV com fita de LED", "TV wall with LED strip", "Panel de TV con tira LED"),
  o("camera-pergolado", "cameras-cftv", "Câmera Intelbras em pergolado", "Intelbras camera on a pergola", "Cámara Intelbras en pérgola"),
  o("cozinha-ilha-spots", "iluminacao", "Cozinha com ilha e spots embutidos", "Kitchen island with recessed spots", "Cocina con isla y spots empotrados"),
  o("inspecao-camera-cabos", "eletrica", "Câmera de inspeção para passar cabos sem quebrar", "Inspection camera to run cables without breaking walls", "Cámara de inspección para pasar cables sin romper"),
  o("quarto-arandelas", "iluminacao", "Quarto com arandelas e luz indireta", "Bedroom with sconces and indirect light", "Dormitorio con apliques y luz indirecta"),
  o("fotocelula-portao", "controle-de-acesso", "Fotocélula de segurança no portão", "Safety photocell on the gate", "Fotocélula de seguridad en el portón"),
  o("fachada-comercial-noite", "iluminacao", "Fachada comercial iluminada à noite", "Commercial facade lit at night", "Fachada comercial iluminada de noche"),
  o("camera-fachada", "cameras-cftv", "CFTV com caixa de passagem e acabamento", "CCTV with junction box and clean finish", "CCTV con caja de paso y buena terminación"),
  o("sala-jantar-pendente", "iluminacao", "Sala de jantar com pendente e spots", "Dining room with pendant and spots", "Comedor con colgante y spots"),
  o("tomada-externa", "eletrica", "Tomada externa com eletroduto", "Outdoor outlet with conduit", "Enchufe exterior con conducto"),
  o("pergolado-noite", "iluminacao", "Pergolado iluminado à noite", "Pergola lit at night", "Pérgola iluminada de noche"),
  o("camera-dupla-lente", "cameras-cftv", "Câmera de lente dupla pronta para instalar", "Dual-lens camera ready to install", "Cámara de doble lente lista para instalar"),
  o("cozinha-cooktop-led", "iluminacao", "Cozinha com LED sob os armários", "Kitchen with under-cabinet LED", "Cocina con LED bajo los muebles"),
  o("conexoes-cabos", "eletrica", "Conexões organizadas na caixa", "Neat connections in the junction box", "Conexiones ordenadas en la caja"),
  o("academia-3", "iluminacao", "Academia: área de musculação iluminada", "Gym: weight area lighting", "Gimnasio: área de pesas iluminada"),
  o("fotocelula-coluna", "controle-de-acesso", "Fotocélula em coluna com eletroduto", "Photocell on a post with conduit", "Fotocélula en columna con conducto"),
  o("perfis-led-sala", "iluminacao", "Sala com perfis de LED no teto", "Room with ceiling LED profiles", "Sala con perfiles LED en el techo"),
  o("eletroduto-aparente", "eletrica", "Instalação aparente com eletroduto", "Surface wiring with conduit", "Instalación a la vista con conducto"),
  o("escritorio-perfil-led", "iluminacao", "Escritório com perfil de LED", "Office with LED profile", "Oficina con perfil LED"),
];

export const obrasDo = (servico: string) => portfolio.filter((o) => o.servico === servico);

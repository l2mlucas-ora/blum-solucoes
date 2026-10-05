/**
 * Link da bio do Instagram (/bio/, /en/bio/, /es/bio/). Edite aqui botões e campanhas — a página se monta sozinha.
 *
 * DESTAQUES: o primeiro ativo na data de hoje aparece no topo. Para uma campanha de stories, use
 * /bio/?d=<id> — força aquele destaque (ex.: /bio/?d=temporada).
 */
import type { PageKey, T } from "../i18n/routes";

export interface Destaque {
  id: string;
  /** Período em que aparece sozinho (AAAA-MM-DD). Fora dele, só via ?d=id. */
  de: string;
  ate: string;
  selo: T;
  titulo: T;
  texto: T;
  cta: T;
  /** Destino: página do site ou nó do assistente. */
  pagina?: PageKey;
  chat?: string;
}

export interface LinkBio {
  id: string;
  icone: "chat" | "agenda" | "whats" | "raio" | "camera" | "chave" | "escudo" | "lampada" | "site" | "casa";
  label: T;
  sub: T;
  pagina?: PageKey;
  chat?: string;
  wa?: true;
  principal?: boolean;
}

export const destaques: Destaque[] = [
  {
    id: "temporada", de: "2026-09-15", ate: "2026-12-20",
    selo: { pt: "Antes da temporada", en: "Before the season", es: "Antes de la temporada" },
    titulo: { pt: "Casa de praia pronta para o verão", en: "Beach house ready for summer", es: "Casa de playa lista para el verano" },
    texto: {
      pt: "Revisão elétrica, câmeras com acesso pelo celular e fechadura digital com senha para cada hóspede.",
      en: "Electrical check, cameras you can watch from abroad and smart locks with a code for each guest.",
      es: "Revisión eléctrica, cámaras que ves desde tu país y cerradura digital con clave para cada huésped.",
    },
    cta: { pt: "Quero deixar tudo pronto", en: "Get my house ready", es: "Quiero dejar todo listo" },
    pagina: "temporada",
  },
  {
    id: "visita", de: "2026-01-01", ate: "2099-12-31",
    selo: { pt: "Garopaba e região", en: "Garopaba area", es: "Garopaba y región" },
    titulo: { pt: "Agende sua visita técnica", en: "Book an on-site visit", es: "Agenda tu visita técnica" },
    texto: {
      pt: "Escolha o dia e o período em 1 minuto. A equipe confirma o horário pelo WhatsApp.",
      en: "Pick the day and time in 1 minute. Our team confirms on WhatsApp — in English.",
      es: "Elige el día y el horario en 1 minuto. El equipo lo confirma por WhatsApp, en español.",
    },
    cta: { pt: "Agendar agora", en: "Book now", es: "Agendar ahora" },
    chat: "vis_servico",
  },
];

export const links: LinkBio[] = [
  { id: "assistente", icone: "chat", principal: true, chat: "inicio",
    label: { pt: "Orçamento rápido", en: "Quick quote", es: "Presupuesto rápido" },
    sub: { pt: "O assistente responde na hora", en: "The assistant answers right away", es: "El asistente responde al instante" } },
  { id: "visita", icone: "agenda", chat: "vis_servico",
    label: { pt: "Agendar visita técnica", en: "Book an on-site visit", es: "Agendar visita técnica" },
    sub: { pt: "Escolha o dia e o período", en: "Pick the day and time", es: "Elige el día y el horario" } },
  { id: "whatsapp", icone: "whats", wa: true,
    label: { pt: "Falar no WhatsApp", en: "Chat on WhatsApp", es: "Hablar por WhatsApp" },
    sub: { pt: "(48) 99663-1148", en: "+55 48 99663-1148", es: "+55 48 99663-1148" } },
  { id: "temporada", icone: "casa", pagina: "temporada",
    label: { pt: "Casa de temporada e Airbnb", en: "Vacation rentals and Airbnb", es: "Casas de temporada y Airbnb" },
    sub: { pt: "Tudo pronto antes do hóspede chegar", en: "Everything ready before guests arrive", es: "Todo listo antes de que llegue el huésped" } },
  { id: "cameras", icone: "camera", pagina: "servico:cameras-cftv",
    label: { pt: "Câmeras de segurança", en: "Security cameras", es: "Cámaras de seguridad" },
    sub: { pt: "Veja tudo pelo celular", en: "Watch from your phone, anywhere", es: "Mira todo desde el celular" } },
  { id: "acesso", icone: "chave", pagina: "servico:controle-de-acesso",
    label: { pt: "Fechadura digital e interfone", en: "Smart locks and intercoms", es: "Cerradura digital y portero" },
    sub: { pt: "Senha para cada hóspede", en: "A code for each guest", es: "Una clave para cada huésped" } },
  { id: "eletrica", icone: "raio", pagina: "servico:eletrica",
    label: { pt: "Elétrica residencial e comercial", en: "Electrical work", es: "Electricidad residencial y comercial" },
    sub: { pt: "Obra, reforma e manutenção", en: "New builds, renovations and repairs", es: "Obra, reforma y mantenimiento" } },
  { id: "iluminacao", icone: "lampada", pagina: "servico:iluminacao",
    label: { pt: "Iluminação", en: "Lighting", es: "Iluminación" },
    sub: { pt: "Sancas, trilhos, jardim e fachada", en: "Coves, track lights, garden and facade", es: "Gargantas, rieles, jardín y fachada" } },
  { id: "site", icone: "site", pagina: "home",
    label: { pt: "Ver o site completo", en: "See the full website", es: "Ver el sitio completo" },
    sub: { pt: "Serviços, obras e dúvidas", en: "Services, our work and FAQ", es: "Servicios, trabajos y preguntas" } },
];

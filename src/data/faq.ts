/**
 * Perguntas gerais (home + busca do assistente), em PT/EN/ES. As perguntas de cada serviço ficam em
 * servicos.ts e também entram na busca — veja `allFaq`.
 */
import type { Faq } from "./seo";
import type { Lang } from "../i18n/routes";
import { servicos } from "./servicos";
import { site, whatsapp } from "./site";

const lista = (l: Lang) => {
  const e = { pt: " e ", en: " and ", es: " y " }[l];
  return site.regiao.slice(0, -1).join(", ") + e + site.regiao.at(-1);
};

export const faqGeral: Record<Lang, Faq[]> = {
  pt: [
    { q: "Quais cidades vocês atendem?", a: `Atendemos ${lista("pt")}. Para outras cidades próximas, chame no WhatsApp que verificamos a agenda.` },
    { q: "Como funciona o orçamento?", a: "Para serviços simples passamos o valor pelo WhatsApp com fotos. Para obras, câmeras e projetos, fazemos uma visita técnica para medir e indicar a melhor solução, e enviamos o orçamento detalhado." },
    { q: "A visita técnica é cobrada?", a: "Depende do serviço e da distância. Informamos antes de agendar, e quando o serviço é fechado o valor da visita costuma ser abatido." },
    { q: "Quais as formas de pagamento?", a: "Pix, transferência e cartão de crédito. Para obras maiores combinamos o pagamento por etapas." },
    { q: "O serviço tem garantia?", a: "Sim. Damos garantia da mão de obra e os equipamentos seguem a garantia do fabricante. Os prazos vão descritos no orçamento." },
    { q: "Vocês atendem emergência elétrica?", a: `Em caso de falta de energia só no seu imóvel, cheiro de queimado ou disjuntor que não religa, chame no WhatsApp ${whatsapp.exibicao}. Se houver fios caídos na rua, ligue para a Celesc no 0800 48 0196 e não se aproxime.` },
    { q: "Quem é o responsável técnico?", a: "Fernando Blum, técnico em eletrônica, com especializações em redes, sistemas de prevenção de incêndio, controle de acesso e alarme perimetral com inteligência artificial. Ele acompanha cada projeto do planejamento à entrega." },
    { q: "Vocês vendem o material ou eu compro?", a: "Os dois. Podemos fornecer todo o material, com nota e garantia, ou instalar o que você já comprou, desde que seja compatível e de boa qualidade." },
    { q: "Atendem casas de temporada e Airbnb?", a: "Atendemos muito. Fazemos revisão elétrica antes da temporada, câmeras com acesso remoto e fechaduras digitais com senha para cada hóspede." },
    { q: "Atendem condomínios e empresas?", a: "Sim: manutenção elétrica, CFTV, controle de acesso, interfonia e iluminação de áreas comuns, com contrato ou por chamado." },
    { q: "Quanto tempo leva uma instalação de câmeras?", a: "Uma residência com 4 câmeras costuma ser instalada em um dia. Sistemas maiores são combinados no orçamento." },
    { q: "Vocês fazem manutenção em sistema instalado por outra empresa?", a: "Fazemos. Avaliamos o que existe, aproveitamos o que estiver bom e indicamos o que precisa trocar." },
    { q: "Atendem proprietários que moram fora do Brasil?", a: "Sim. Muitos clientes são estrangeiros com casa na região. Combinamos tudo por WhatsApp, enviamos fotos e vídeos do serviço e configuramos câmeras e fechaduras para você acompanhar de longe." },
  ],
  en: [
    { q: "Which towns do you serve?", a: `We serve ${lista("en")}. For other nearby towns, message us on WhatsApp and we'll check availability.` },
    { q: "How does the quote work?", a: "For simple jobs we can quote on WhatsApp from photos. For larger jobs, cameras and projects we do an on-site visit to measure and recommend the best solution, then send a detailed written quote." },
    { q: "Is there a fee for the on-site visit?", a: "It depends on the service and distance. We tell you before scheduling, and if you hire us the visit fee is usually deducted." },
    { q: "Which payment methods do you accept?", a: "Pix, bank transfer and credit card. For larger jobs we agree on staged payments. If you are abroad, tell us and we'll find the easiest option." },
    { q: "Is the work guaranteed?", a: "Yes. Our labor is guaranteed and equipment carries the manufacturer's warranty. Terms are stated in the quote." },
    { q: "Do you handle electrical emergencies?", a: `If only your property has no power, you smell burning or a breaker won't reset, message us on WhatsApp ${whatsapp.internacional}. If there are wires down on the street, call Celesc (the power company) at 0800 48 0196 and stay away.` },
    { q: "Who is the technical lead?", a: "Fernando Blum, an electronics technician with specializations in networking, fire prevention systems, access control and AI perimeter alarms. He oversees every project from planning to handover." },
    { q: "Do you supply materials, or do I buy them?", a: "Either. We can supply everything with invoice and warranty, or install what you already bought, as long as it is compatible and good quality." },
    { q: "Do you work with vacation rentals and Airbnb?", a: "A lot. We do pre-season electrical checks, cameras with remote access and smart locks with a code for each guest." },
    { q: "Do you serve condos and businesses?", a: "Yes: electrical maintenance, CCTV, access control, intercoms and common-area lighting, under contract or on call." },
    { q: "How long does a camera installation take?", a: "A home with 4 cameras is usually installed in one day. Larger systems are scheduled in the quote." },
    { q: "Do you service systems installed by another company?", a: "Yes. We assess what's there, keep what's good and recommend what needs replacing." },
    { q: "Do you speak English? I live outside Brazil.", a: "Yes — many of our clients are foreigners with homes in the area. We arrange everything over WhatsApp, send photos and videos of the work, and set up cameras and locks so you can follow from abroad." },
  ],
  es: [
    { q: "¿Qué ciudades atienden?", a: `Atendemos ${lista("es")}. Para otras ciudades cercanas, escríbenos por WhatsApp y vemos la agenda.` },
    { q: "¿Cómo funciona el presupuesto?", a: "Para trabajos simples pasamos el valor por WhatsApp con fotos. Para obras, cámaras y proyectos hacemos una visita técnica para medir e indicar la mejor solución, y enviamos el presupuesto detallado." },
    { q: "¿La visita técnica tiene costo?", a: "Depende del servicio y la distancia. Te lo informamos antes de agendar y, si contratas el servicio, el valor de la visita suele descontarse." },
    { q: "¿Qué formas de pago aceptan?", a: "Pix, transferencia y tarjeta de crédito. Para obras grandes acordamos el pago por etapas. Si estás en el exterior, avísanos y buscamos la opción más fácil." },
    { q: "¿El servicio tiene garantía?", a: "Sí. Damos garantía de la mano de obra y los equipos tienen la garantía del fabricante. Los plazos van en el presupuesto." },
    { q: "¿Atienden emergencias eléctricas?", a: `Si solo tu propiedad está sin luz, sientes olor a quemado o el disyuntor no vuelve, escríbenos por WhatsApp ${whatsapp.internacional}. Si hay cables caídos en la calle, llama a Celesc (compañía eléctrica) al 0800 48 0196 y no te acerques.` },
    { q: "¿Quién es el responsable técnico?", a: "Fernando Blum, técnico en electrónica, con especializaciones en redes, sistemas de prevención de incendios, control de acceso y alarma perimetral con inteligencia artificial. Acompaña cada proyecto de la planificación a la entrega." },
    { q: "¿Ustedes venden el material o lo compro yo?", a: "Las dos cosas. Podemos proveer todo el material con factura y garantía, o instalar lo que ya compraste, siempre que sea compatible y de buena calidad." },
    { q: "¿Trabajan con casas de temporada y Airbnb?", a: "Mucho. Hacemos revisión eléctrica antes de la temporada, cámaras con acceso remoto y cerraduras digitales con una clave para cada huésped." },
    { q: "¿Atienden condominios y empresas?", a: "Sí: mantenimiento eléctrico, CCTV, control de acceso, porteros e iluminación de áreas comunes, por contrato o por llamado." },
    { q: "¿Cuánto tarda una instalación de cámaras?", a: "Una casa con 4 cámaras suele instalarse en un día. Los sistemas más grandes se acuerdan en el presupuesto." },
    { q: "¿Hacen mantenimiento en sistemas instalados por otra empresa?", a: "Sí. Evaluamos lo que hay, aprovechamos lo que está bien e indicamos lo que hay que cambiar." },
    { q: "¿Hablan español? Vivo fuera de Brasil.", a: "Sí — muchos clientes son extranjeros con casa en la región (argentinos, uruguayos y más). Coordinamos todo por WhatsApp, enviamos fotos y videos del trabajo y configuramos cámaras y cerraduras para que sigas todo a distancia." },
  ],
};

/** Todas as FAQs do site no idioma, para a busca por palavra-chave do assistente. */
export const allFaq = (l: Lang): Faq[] => [...faqGeral[l], ...servicos.flatMap((s) => s.t[l].faq)];

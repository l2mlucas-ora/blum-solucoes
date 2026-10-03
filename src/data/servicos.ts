/**
 * Serviços da Blum, em PT/EN/ES. Cada item gera uma página por idioma (/servicos/<slug>/, /en/services/…,
 * /es/servicios/…), um card na home, um botão na bio e um ramo no assistente (campo `chat`).
 * Slugs por idioma: src/i18n/routes.ts → servicoSlug.
 */
import type { Faq } from "./seo";
import { rServico, type Lang } from "../i18n/routes";

export interface ServicoTexto {
  nome: string;
  curto: string;
  /** Título da página (SEO). */
  titulo: string;
  descricao: string;
  itens: string[];
  quando: string[];
  faq: Faq[];
}

export interface Servico {
  /** = slug em PT. */
  id: string;
  icone: "raio" | "camera" | "chave" | "escudo" | "lampada";
  chat: string;
  imagem?: string;
  t: Record<Lang, ServicoTexto>;
}

export const servicos: Servico[] = [
  {
    id: "eletrica", icone: "raio", chat: "ele_tipo", imagem: "/img/obras/eletroposto.webp",
    t: {
      pt: {
        nome: "Elétrica residencial e comercial",
        curto: "Instalações, reformas, quadros e padrão de entrada, com segurança e acabamento caprichado.",
        titulo: "Eletricista em Garopaba e região",
        descricao: "Instalação e reforma elétrica residencial e comercial em Garopaba, Imbituba e região: quadro de distribuição, DPS, padrão de entrada Celesc, tomadas, chuveiro e manutenção.",
        itens: ["Instalação elétrica completa para obra nova", "Reforma e adequação de instalações antigas", "Quadro de distribuição, disjuntores, DR e DPS", "Padrão de entrada e aumento de carga junto à Celesc", "Tomadas, interruptores, chuveiros e pontos novos", "Diagnóstico de curto, disjuntor caindo e choque", "Carregador de carro elétrico (residencial e eletroposto)"],
        quando: ["Construção ou reforma", "Disjuntor desarmando sem motivo", "Casa de temporada antes da alta estação", "Comércio que vai ampliar a carga"],
        faq: [
          { q: "Vocês fazem o padrão de entrada da Celesc?", a: "Sim. Montamos o padrão de entrada e acompanhamos o pedido de ligação ou aumento de carga junto à Celesc." },
          { q: "Por que o meu disjuntor fica desarmando?", a: "Pode ser sobrecarga, um equipamento com defeito ou fuga de corrente. Desarme constante é sinal de alerta: o certo é fazer um diagnóstico antes de trocar o disjuntor por um maior." },
          { q: "Vale a pena instalar DPS?", a: "Vale. O DPS protege os aparelhos contra surtos causados por raios e oscilações da rede — comuns no litoral em dias de tempestade." },
        ],
      },
      en: {
        nome: "Residential and commercial electrical",
        curto: "Wiring, renovations, breaker panels and utility hookups — safe, tidy and well finished.",
        titulo: "Electrician in Garopaba, Brazil",
        descricao: "Residential and commercial electrical installation and renovation in Garopaba, Imbituba and nearby: breaker panels, surge protection, Celesc utility hookup, outlets, electric showers and maintenance.",
        itens: ["Complete wiring for new construction", "Renovation and upgrade of old installations", "Breaker panels, RCDs and surge protectors", "Utility service entrance and load increase with Celesc", "Outlets, switches, electric showers and new points", "Troubleshooting shorts, tripping breakers and shocks", "EV chargers (home and commercial charging stations)"],
        quando: ["Building or renovating", "Breaker tripping for no clear reason", "Vacation home before high season", "Business increasing its power load"],
        faq: [
          { q: "Do you handle the Celesc utility hookup?", a: "Yes. We install the service entrance and follow up the connection or load-increase request with Celesc, the local power company." },
          { q: "Why does my breaker keep tripping?", a: "It may be an overload, a faulty appliance or current leakage. Frequent tripping is a warning sign: the right move is a diagnosis, not simply installing a bigger breaker." },
          { q: "Is a surge protector worth it?", a: "Yes. A surge protector (DPS) shields your appliances from lightning and grid spikes — common on the coast during storms." },
        ],
      },
      es: {
        nome: "Electricidad residencial y comercial",
        curto: "Instalaciones, reformas, tableros y acometida, con seguridad y buena terminación.",
        titulo: "Electricista en Garopaba y región",
        descricao: "Instalación y reforma eléctrica residencial y comercial en Garopaba, Imbituba y región: tablero eléctrico, protector contra sobretensiones, acometida de Celesc, enchufes, duchas eléctricas y mantenimiento.",
        itens: ["Instalación eléctrica completa para obra nueva", "Reforma y adecuación de instalaciones antiguas", "Tablero eléctrico, disyuntores, diferencial y protector de sobretensión", "Acometida y aumento de carga ante Celesc", "Enchufes, interruptores, duchas y puntos nuevos", "Diagnóstico de cortocircuitos, disyuntor que salta y descargas", "Cargador de auto eléctrico (residencial y electrolinera)"],
        quando: ["Construcción o reforma", "Disyuntor que salta sin motivo", "Casa de temporada antes del verano", "Comercio que va a aumentar la carga"],
        faq: [
          { q: "¿Hacen la acometida de Celesc?", a: "Sí. Montamos la acometida y hacemos el seguimiento del pedido de conexión o aumento de carga ante Celesc, la compañía eléctrica local." },
          { q: "¿Por qué mi disyuntor salta a cada rato?", a: "Puede ser sobrecarga, un equipo con falla o fuga de corriente. Que salte seguido es una señal de alerta: lo correcto es hacer un diagnóstico antes de cambiarlo por uno mayor." },
          { q: "¿Vale la pena instalar protector contra sobretensiones?", a: "Sí. Protege los aparatos de rayos y picos de la red, muy comunes en la costa en días de tormenta." },
        ],
      },
    },
  },
  {
    id: "cameras-cftv", icone: "camera", chat: "cam_local", imagem: "/img/obras/camera-pergolado.webp",
    t: {
      pt: {
        nome: "Câmeras de segurança (CFTV)",
        curto: "Câmeras com imagem nítida, gravação e acesso pelo celular de qualquer lugar.",
        titulo: "Câmeras de segurança em Garopaba",
        descricao: "Instalação de câmeras de segurança (CFTV) em Garopaba e região: câmeras IP e Wi-Fi, visão noturna, gravação em DVR/NVR e acesso remoto pelo celular para casas, condomínios e comércios.",
        itens: ["Projeto de posicionamento das câmeras", "Câmeras IP, analógicas HD e Wi-Fi", "Visão noturna e câmeras para área externa", "Gravador DVR/NVR com HD dimensionado", "Acesso pelo celular, configurado e explicado", "Manutenção e ampliação de sistemas existentes"],
        quando: ["Casa de praia que fica fechada", "Comércio e pousada", "Condomínio e obra", "Sistema antigo com imagem ruim"],
        faq: [
          { q: "Consigo ver as câmeras pelo celular?", a: "Sim. Configuramos o aplicativo no seu celular e de quem mais você quiser, e explicamos como ver ao vivo e buscar gravações." },
          { q: "Quantos dias de gravação o sistema guarda?", a: "Depende do número de câmeras, da resolução e do HD. No projeto dimensionamos o HD para o período que você precisa — normalmente de 15 a 30 dias." },
          { q: "Câmera Wi-Fi ou cabeada?", a: "A cabeada é mais estável e indicada para áreas externas e comércios. A Wi-Fi é prática para pontos internos ou onde passar cabo é difícil. Indicamos a melhor para cada ponto." },
        ],
      },
      en: {
        nome: "Security cameras (CCTV)",
        curto: "Sharp image, recording and live view on your phone from anywhere in the world.",
        titulo: "Security cameras in Garopaba, Brazil",
        descricao: "Security camera (CCTV) installation in Garopaba and nearby: IP and Wi-Fi cameras, night vision, DVR/NVR recording and remote access on your phone for homes, condos and businesses.",
        itens: ["Camera placement plan", "IP, HD analog and Wi-Fi cameras", "Night vision and outdoor-rated cameras", "DVR/NVR recorder with the right hard drive", "Phone access, set up and explained", "Maintenance and expansion of existing systems"],
        quando: ["Beach house that sits empty", "Shops and guesthouses", "Condos and construction sites", "Old system with poor image"],
        faq: [
          { q: "Can I watch the cameras on my phone from abroad?", a: "Yes. With internet at the property you can watch live and search recordings from anywhere. We set up the app on your phone and on anyone else's you choose." },
          { q: "How many days of recording are kept?", a: "It depends on the number of cameras, resolution and hard drive. We size the drive for the period you need — usually 15 to 30 days." },
          { q: "Wi-Fi or wired cameras?", a: "Wired is more stable and recommended outdoors and for businesses. Wi-Fi is handy indoors or where running cable is hard. We recommend the best option for each spot." },
        ],
      },
      es: {
        nome: "Cámaras de seguridad (CCTV)",
        curto: "Imagen nítida, grabación y acceso desde el celular en cualquier lugar.",
        titulo: "Cámaras de seguridad en Garopaba",
        descricao: "Instalación de cámaras de seguridad (CCTV) en Garopaba y región: cámaras IP y Wi-Fi, visión nocturna, grabación en DVR/NVR y acceso remoto desde el celular para casas, condominios y comercios.",
        itens: ["Proyecto de ubicación de las cámaras", "Cámaras IP, analógicas HD y Wi-Fi", "Visión nocturna y cámaras para exterior", "Grabador DVR/NVR con disco dimensionado", "Acceso desde el celular, configurado y explicado", "Mantenimiento y ampliación de sistemas existentes"],
        quando: ["Casa de playa que queda cerrada", "Comercios y posadas", "Condominios y obras", "Sistema antiguo con mala imagen"],
        faq: [
          { q: "¿Puedo ver las cámaras desde el celular estando en mi país?", a: "Sí. Con internet en la propiedad, ves en vivo y buscas grabaciones desde cualquier lugar. Configuramos la app en tu celular y en el de quien quieras." },
          { q: "¿Cuántos días de grabación guarda el sistema?", a: "Depende de la cantidad de cámaras, la resolución y el disco. Dimensionamos el disco para el período que necesitas — normalmente de 15 a 30 días." },
          { q: "¿Cámara Wi-Fi o cableada?", a: "La cableada es más estable e indicada para exteriores y comercios. La Wi-Fi es práctica en interiores o donde es difícil pasar cable. Indicamos la mejor para cada punto." },
        ],
      },
    },
  },
  {
    id: "controle-de-acesso", icone: "chave", chat: "acs_tipo", imagem: "/img/obras/fechadura.webp",
    t: {
      pt: {
        nome: "Controle de acesso e fechaduras digitais",
        curto: "Fechaduras digitais, interfones, portões e controle por senha, biometria ou cartão.",
        titulo: "Fechadura digital e controle de acesso em Garopaba",
        descricao: "Instalação de fechaduras digitais, videoporteiro, interfone e controle de acesso por senha, biometria, cartão ou aplicativo em Garopaba e região. Ideal para casas de temporada e Airbnb.",
        itens: ["Fechaduras digitais com senha, biometria e app", "Videoporteiro e interfone", "Controle de acesso para condomínios e empresas", "Fechaduras eletroímã e eletromecânicas", "Integração com portão eletrônico", "Senhas temporárias para hóspedes (Airbnb)"],
        quando: ["Casa de temporada e Airbnb", "Condomínio e prédio comercial", "Trocar chave por senha ou digital", "Interfone que parou de funcionar"],
        faq: [
          { q: "Fechadura digital serve para Airbnb?", a: "Serve muito bem. Com modelos por aplicativo você cria senhas temporárias para cada hóspede, sem entregar chave." },
          { q: "A fechadura digital funciona se acabar a energia?", a: "Sim. Elas funcionam a pilha e avisam quando a carga está baixa. Muitos modelos também têm chave mecânica de emergência." },
          { q: "Instalam fechadura comprada por mim?", a: "Instalamos, desde que o modelo seja compatível com a sua porta. Mande a foto da porta e o modelo pelo WhatsApp que confirmamos antes." },
        ],
      },
      en: {
        nome: "Access control and smart locks",
        curto: "Smart locks, intercoms, gates and access by code, fingerprint or card.",
        titulo: "Smart locks and access control in Garopaba",
        descricao: "Smart lock, video doorbell, intercom and access control installation (code, fingerprint, card or app) in Garopaba and nearby. Ideal for vacation rentals and Airbnb.",
        itens: ["Smart locks with code, fingerprint and app", "Video doorbells and intercoms", "Access control for condos and companies", "Magnetic and electromechanical locks", "Integration with automatic gates", "Temporary codes for guests (Airbnb)"],
        quando: ["Vacation rental and Airbnb", "Condos and commercial buildings", "Swap keys for codes or fingerprint", "Intercom that stopped working"],
        faq: [
          { q: "Are smart locks good for Airbnb?", a: "Very. With app-based models you create a temporary code for each guest — no key handover needed, even when you are abroad." },
          { q: "Does a smart lock work during a power outage?", a: "Yes. They run on batteries and warn you when they are low. Many models also have an emergency mechanical key." },
          { q: "Will you install a lock I bought myself?", a: "Yes, as long as the model fits your door. Send us a photo of the door and the model on WhatsApp and we'll confirm first." },
        ],
      },
      es: {
        nome: "Control de acceso y cerraduras digitales",
        curto: "Cerraduras digitales, porteros, portones y acceso por clave, huella o tarjeta.",
        titulo: "Cerradura digital y control de acceso en Garopaba",
        descricao: "Instalación de cerraduras digitales, videoportero, portero eléctrico y control de acceso por clave, huella, tarjeta o app en Garopaba y región. Ideal para casas de temporada y Airbnb.",
        itens: ["Cerraduras digitales con clave, huella y app", "Videoportero y portero eléctrico", "Control de acceso para condominios y empresas", "Cerraduras electroimán y electromecánicas", "Integración con portón automático", "Claves temporales para huéspedes (Airbnb)"],
        quando: ["Casa de temporada y Airbnb", "Condominio y edificio comercial", "Cambiar llave por clave o huella", "Portero que dejó de funcionar"],
        faq: [
          { q: "¿La cerradura digital sirve para Airbnb?", a: "Muy bien. Con modelos por app creas una clave temporal para cada huésped, sin entregar llaves, aunque estés en otro país." },
          { q: "¿Funciona si se corta la luz?", a: "Sí. Funcionan a pilas y avisan cuando la carga está baja. Muchos modelos también tienen llave mecánica de emergencia." },
          { q: "¿Instalan una cerradura que compré yo?", a: "Sí, siempre que el modelo sea compatible con tu puerta. Mándanos la foto de la puerta y el modelo por WhatsApp y lo confirmamos antes." },
        ],
      },
    },
  },
  {
    id: "seguranca-eletronica", icone: "escudo", chat: "seg_tipo", imagem: "/img/obras/camera-fachada.webp",
    t: {
      pt: {
        nome: "Segurança eletrônica e alarmes",
        curto: "Alarmes, sensores, cerca elétrica e automação para proteger casa e empresa.",
        titulo: "Alarme e segurança eletrônica em Garopaba",
        descricao: "Sistemas de alarme, sensores de presença, cerca elétrica e automação de segurança em Garopaba e região, com aviso no celular e integração às câmeras.",
        itens: ["Alarme monitorado pelo celular", "Sensores de presença, abertura e barreira", "Cerca elétrica e concertina", "Sirenes e discadoras", "Integração com câmeras e iluminação", "Manutenção de sistemas instalados"],
        quando: ["Imóvel que fica vazio parte do ano", "Comércio fora do horário", "Reforço depois de tentativa de invasão", "Modernizar alarme antigo"],
        faq: [
          { q: "O alarme avisa no meu celular?", a: "Sim. Os sistemas que instalamos enviam notificação no aplicativo quando um sensor dispara, e você arma ou desarma de longe." },
          { q: "Pet dispara o alarme?", a: "Existem sensores pet friendly, que ignoram animais de até cerca de 20 a 30 kg. Indicamos no projeto." },
        ],
      },
      en: {
        nome: "Alarms and security systems",
        curto: "Alarms, sensors, electric fences and automation to protect home and business.",
        titulo: "Alarm systems in Garopaba, Brazil",
        descricao: "Alarm systems, motion sensors, electric fences and security automation in Garopaba and nearby, with phone alerts and camera integration.",
        itens: ["Alarm monitored from your phone", "Motion, door/window and beam sensors", "Electric fence and razor wire", "Sirens and auto-dialers", "Integration with cameras and lighting", "Maintenance of existing systems"],
        quando: ["Property empty part of the year", "Business after hours", "Upgrade after a break-in attempt", "Modernize an old alarm"],
        faq: [
          { q: "Will the alarm notify my phone?", a: "Yes. The systems we install send an app notification when a sensor is triggered, and you can arm or disarm remotely — even from abroad." },
          { q: "Will my pet set off the alarm?", a: "There are pet-friendly sensors that ignore animals up to about 20–30 kg. We recommend them in the project." },
        ],
      },
      es: {
        nome: "Seguridad electrónica y alarmas",
        curto: "Alarmas, sensores, cerco eléctrico y automatización para proteger casa y empresa.",
        titulo: "Alarmas y seguridad electrónica en Garopaba",
        descricao: "Sistemas de alarma, sensores de movimiento, cerco eléctrico y automatización de seguridad en Garopaba y región, con aviso en el celular e integración con las cámaras.",
        itens: ["Alarma monitoreada desde el celular", "Sensores de movimiento, apertura y barrera", "Cerco eléctrico y concertina", "Sirenas y discadores", "Integración con cámaras e iluminación", "Mantenimiento de sistemas instalados"],
        quando: ["Propiedad vacía parte del año", "Comercio fuera de horario", "Refuerzo después de un intento de robo", "Modernizar una alarma antigua"],
        faq: [
          { q: "¿La alarma avisa en mi celular?", a: "Sí. Los sistemas que instalamos envían una notificación en la app cuando se dispara un sensor, y puedes armar o desarmar a distancia, incluso desde otro país." },
          { q: "¿Mi mascota dispara la alarma?", a: "Existen sensores pet friendly que ignoran animales de hasta unos 20 a 30 kg. Los indicamos en el proyecto." },
        ],
      },
    },
  },
  {
    id: "iluminacao", icone: "lampada", chat: "ilu_tipo", imagem: "/img/obras/igreja-depois.webp",
    t: {
      pt: {
        nome: "Iluminação e projetos de luz",
        curto: "Iluminação interna, externa, de jardim e fachada — com LED, balizadores e automação.",
        titulo: "Iluminação residencial e de jardim em Garopaba",
        descricao: "Projetos e instalação de iluminação em Garopaba e região: LED, perfis e fitas, balizadores, iluminação de jardim, fachada e piscina, sensores e automação.",
        itens: ["Iluminação interna com LED, perfis, sancas e trilhos", "Balizadores, espetos e iluminação de jardim", "Fachada, pergolado e área de piscina", "Sensores de presença e fotocélulas", "Automação e cenas pelo celular", "Troca de lâmpadas e luminárias em altura"],
        quando: ["Casa nova ou reforma", "Valorizar área externa e jardim", "Lojas, igrejas e espaços comerciais", "Pousadas e restaurantes"],
        faq: [
          { q: "Vocês fazem iluminação de jardim e pergolado?", a: "Fazemos: balizadores, espetos, fitas de LED em pergolados e iluminação de fachada, com material próprio para área externa." },
          { q: "Iluminação externa aguenta a maresia?", a: "Com o material certo, sim. Usamos luminárias e conexões com proteção IP adequada para área externa no litoral." },
        ],
      },
      en: {
        nome: "Lighting design and installation",
        curto: "Indoor, outdoor, garden and facade lighting — LED, path lights and automation.",
        titulo: "Home and garden lighting in Garopaba, Brazil",
        descricao: "Lighting design and installation in Garopaba and nearby: LED, profiles and strips, path lights, garden, facade and pool lighting, sensors and automation.",
        itens: ["Indoor LED lighting, profiles, coves and track lights", "Path lights, spike lights and garden lighting", "Facade, pergola and pool area", "Motion sensors and photocells", "Automation and scenes from your phone", "Replacing high-ceiling bulbs and fixtures"],
        quando: ["New home or renovation", "Enhance outdoor areas and garden", "Shops, churches and commercial spaces", "Guesthouses and restaurants"],
        faq: [
          { q: "Do you do garden and pergola lighting?", a: "Yes: path lights, spike lights, LED strips on pergolas and facade lighting, all with outdoor-rated materials." },
          { q: "Does outdoor lighting withstand the salty sea air?", a: "With the right materials, yes. We use fixtures and connections with IP ratings suited to the coast." },
        ],
      },
      es: {
        nome: "Iluminación y proyectos de luz",
        curto: "Iluminación interior, exterior, de jardín y fachada — LED, balizas y automatización.",
        titulo: "Iluminación residencial y de jardín en Garopaba",
        descricao: "Proyectos e instalación de iluminación en Garopaba y región: LED, perfiles y tiras, balizas, iluminación de jardín, fachada y piscina, sensores y automatización.",
        itens: ["Iluminación interior con LED, perfiles, gargantas y rieles", "Balizas, estacas e iluminación de jardín", "Fachada, pérgola y área de piscina", "Sensores de movimiento y fotocélulas", "Automatización y escenas desde el celular", "Cambio de lámparas y luminarias en altura"],
        quando: ["Casa nueva o reforma", "Valorizar el exterior y el jardín", "Tiendas, iglesias y espacios comerciales", "Posadas y restaurantes"],
        faq: [
          { q: "¿Hacen iluminación de jardín y pérgola?", a: "Sí: balizas, estacas, tiras LED en pérgolas e iluminación de fachada, con material apto para exterior." },
          { q: "¿La iluminación exterior aguanta la brisa marina?", a: "Con el material adecuado, sí. Usamos luminarias y conexiones con protección IP apropiada para la costa." },
        ],
      },
    },
  },
];

export const servicoPorId = Object.fromEntries(servicos.map((s) => [s.id, s]));

/** Serviço no idioma, com o link certo. */
export const sv = (s: Servico, lang: Lang) => ({ ...s, ...s.t[lang], href: rServico(s.id, lang) });
export const servicosEm = (lang: Lang) => servicos.map((s) => sv(s, lang));

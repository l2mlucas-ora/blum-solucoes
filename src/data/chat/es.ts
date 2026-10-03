/**
 * Guion del asistente — ESPAÑOL. Mismos ids de nodo que pt.ts (el test lo verifica).
 * Los valores guardados (servicio, lugar…) llegan al equipo de Blum en el resumen de WhatsApp, en español.
 */
import { site, abertoAgora, whatsapp } from "../site";
import { faixa } from "../precos";
import { opts, proximosDias, type Flow, type Opt } from "./types";

export const rotulos: Record<string, string> = {
  servico: "Servicio", tipo: "Tipo", local: "Lugar", qtd: "Cantidad", detalhe: "Detalle",
  cidade: "Ciudad", bairro: "Barrio/referencia", dia: "Día preferido", periodo: "Horario", pergunta: "Consulta",
};

const voltar: Opt = { label: "Volver al inicio", next: "inicio" };

export const flow: Flow = {
  inicio: {
    say: [
      "¡Hola! Soy el asistente de Blum Soluções. Respondo dudas, hago un presupuesto estimado y dejo tu visita técnica encaminada — en español.",
      "¿En qué te puedo ayudar?",
    ],
    options: [
      { label: "Electricidad", next: "ele_tipo" },
      { label: "Cámaras de seguridad", next: "cam_local" },
      { label: "Cerradura digital / portero", next: "acs_tipo" },
      { label: "Alarma y cerco eléctrico", next: "seg_tipo" },
      { label: "Iluminación", next: "ilu_tipo" },
      { label: "Agendar visita técnica", next: "vis_servico" },
      { label: "Emergencia eléctrica", next: "emerg" },
      { label: "Tengo otra consulta", next: "faq" },
    ],
  },

  /* ---------- ELECTRICIDAD ---------- */
  ele_tipo: {
    enter: { servico: "Electricidad" },
    say: ["Perfecto, electricidad. ¿Qué necesitas?"],
    options: [
      { label: "Instalación para obra nueva", next: "ele_local", set: { tipo: "Obra nueva", chave: "ele_obra" } },
      { label: "Reforma / adecuación", next: "ele_local", set: { tipo: "Reforma", chave: "ele_obra" } },
      { label: "Tablero, disyuntor o protector", next: "ele_local", set: { tipo: "Tablero eléctrico", chave: "ele_quadro" } },
      { label: "Enchufes, puntos o ducha eléctrica", next: "ele_local", set: { tipo: "Puntos / ducha", chave: "ele_ponto" } },
      { label: "Cargador de auto eléctrico", next: "ele_local", set: { tipo: "Cargador vehicular", chave: "" } },
      { label: "Acometida de Celesc", next: "ele_local", set: { tipo: "Acometida", chave: "ele_obra" } },
      { label: "Algo no funciona", next: "ele_problema", set: { tipo: "Reparación / falla", chave: "" } },
    ],
  },
  ele_problema: {
    say: ["Entiendo. ¿Cuál se parece a tu caso?"],
    options: [
      { label: "El disyuntor salta", next: "ele_local", set: { detalhe: "Disyuntor que salta" } },
      { label: "Parte de la casa sin luz", next: "ele_local", set: { detalhe: "Parte sin energía" } },
      { label: "Descarga u olor a quemado", next: "emerg", set: { detalhe: "Descarga / olor a quemado" } },
      { label: "Otro problema", next: "ele_local", set: { detalhe: "Otro" } },
    ],
  },
  ele_local: {
    say: ["¿Es vivienda o comercio?"],
    options: opts(["Casa", "Departamento", "Casa de temporada", "Comercio / posada", "Condominio"], "orc", "local"),
  },

  /* ---------- CÁMARAS ---------- */
  cam_local: {
    enter: { servico: "Cámaras de seguridad" },
    say: ["Vamos con las cámaras. ¿Dónde van a estar?"],
    options: opts(["Casa", "Casa de temporada", "Comercio / posada", "Condominio", "Obra"], "cam_qtd", "local"),
  },
  cam_qtd: {
    say: ["¿Más o menos cuántas cámaras imaginas?"],
    options: [
      { label: "Hasta 4", next: "cam_tipo", set: { qtd: "Hasta 4", chave: "cam_4" } },
      { label: "5 a 8", next: "cam_tipo", set: { qtd: "5 a 8", chave: "cam_8" } },
      { label: "Más de 8", next: "cam_tipo", set: { qtd: "Más de 8", chave: "" } },
      { label: "No sé, quiero que me recomienden", next: "cam_tipo", set: { qtd: "A definir en la visita", chave: "" } },
    ],
  },
  cam_tipo: {
    say: ["¿Es un sistema nuevo o ya hay uno instalado?"],
    options: [
      { label: "Sistema nuevo", next: "orc", set: { tipo: "Sistema nuevo" } },
      { label: "Ampliar el que tengo", next: "orc", set: { tipo: "Ampliación" } },
      { label: "Reparar / mantenimiento", next: "orc", set: { tipo: "Mantenimiento", chave: "" } },
    ],
  },

  /* ---------- CONTROL DE ACCESO ---------- */
  acs_tipo: {
    enter: { servico: "Control de acceso" },
    say: ["¿Qué quieres instalar?"],
    options: [
      { label: "Cerradura digital", next: "acs_local", set: { tipo: "Cerradura digital", chave: "acs_fechadura" } },
      { label: "Videoportero / portero eléctrico", next: "acs_local", set: { tipo: "Videoportero / portero", chave: "acs_video" } },
      { label: "Control de acceso (condominio/empresa)", next: "acs_local", set: { tipo: "Control de acceso", chave: "" } },
      { label: "Mantenimiento de lo que ya tengo", next: "acs_local", set: { tipo: "Mantenimiento", chave: "" } },
    ],
  },
  acs_local: {
    say: [(s) => s.chave === "acs_fechadura"
      ? "¡Buena elección! La cerradura digital es la favorita en casas de temporada: una clave distinta para cada huésped, manejada a distancia. ¿Dónde va a ser?"
      : "¿Dónde va a ser?"],
    options: opts(["Casa", "Casa de temporada / Airbnb", "Comercio", "Condominio"], "orc", "local"),
  },

  /* ---------- SEGURIDAD ---------- */
  seg_tipo: {
    enter: { servico: "Alarmas y seguridad" },
    say: ["¿Qué estás buscando?"],
    options: [
      { label: "Alarma con aviso en el celular", next: "seg_local", set: { tipo: "Alarma", chave: "seg_alarme" } },
      { label: "Cerco eléctrico", next: "seg_local", set: { tipo: "Cerco eléctrico", chave: "" } },
      { label: "Alarma + cámaras integradas", next: "seg_local", set: { tipo: "Alarma + cámaras", chave: "" } },
      { label: "Mantenimiento", next: "seg_local", set: { tipo: "Mantenimiento", chave: "" } },
    ],
  },
  seg_local: {
    say: ["¿Y dónde es?"],
    options: opts(["Casa", "Casa de temporada", "Comercio", "Condominio / obra"], "orc", "local"),
  },

  /* ---------- ILUMINACIÓN ---------- */
  ilu_tipo: {
    enter: { servico: "Iluminación" },
    say: ["¿Qué tipo de iluminación?"],
    options: [
      { label: "Jardín y balizas", next: "ilu_local", set: { tipo: "Jardín / balizas", chave: "ilu_ponto" } },
      { label: "Fachada, pérgola o piscina", next: "ilu_local", set: { tipo: "Fachada / pérgola / piscina", chave: "ilu_ponto" } },
      { label: "Interior con LED / perfiles", next: "ilu_local", set: { tipo: "Interior LED", chave: "ilu_ponto" } },
      { label: "Sensores y automatización", next: "ilu_local", set: { tipo: "Sensores / automatización", chave: "" } },
    ],
  },
  ilu_local: {
    say: ["¿Es obra nueva o la propiedad ya está terminada?"],
    options: opts(["Obra nueva", "Propiedad terminada", "Comercio / posada"], "orc", "local"),
  },

  /* ---------- PRESUPUESTO ESTIMADO ---------- */
  orc: {
    say: [
      (s) => {
        const f = s.chave ? faixa(s.chave, "es") : null;
        return f
          ? `Por lo que me contaste, la referencia es ${f}. El valor final sale después de ver el lugar — el material y la distancia cuentan.`
          : "Para darte un precio justo necesitamos ver el lugar o algunas fotos. El presupuesto es gratis y sin compromiso.";
      },
      "¿Cómo prefieres seguir?",
    ],
    options: [
      { label: "Agendar visita técnica", next: "vis_cidade" },
      { label: "Recibir presupuesto por WhatsApp", next: "lead" },
      { label: "Tengo una consulta antes", next: "faq" },
      voltar,
    ],
  },

  /* ---------- VISITA TÉCNICA ---------- */
  vis_servico: {
    say: ["Vamos a agendar. ¿Para qué servicio es la visita?"],
    options: ["Electricidad", "Cámaras de seguridad", "Control de acceso", "Alarmas y seguridad", "Iluminación", "Más de un servicio"]
      .map((l) => ({ label: l, next: "vis_cidade", set: { servico: l } })),
  },
  vis_cidade: {
    enter: { visita: "sim" },
    say: ["¿En qué ciudad o playa está la propiedad?"],
    options: [
      ...site.regiao.map((c) => ({ label: c, next: "vis_bairro", set: { cidade: c } })),
      { label: "Otra ciudad", next: "vis_outra" },
    ],
  },
  vis_outra: {
    say: ["¿Qué ciudad? Atendemos principalmente Garopaba y alrededores, pero vemos la agenda para otras cercanas."],
    input: { field: "cidade", label: "Ciudad", placeholder: "Ej.: Laguna", next: "vis_bairro" },
  },
  vis_bairro: {
    say: ["¿Cuál es el barrio o una referencia de la dirección?"],
    input: { field: "bairro", label: "Barrio o referencia", placeholder: "Ej.: Centro, cerca de la iglesia", next: "vis_dia" },
  },
  vis_dia: {
    say: ["¿Qué día te queda mejor?"],
    options: () => [
      ...proximosDias(5, "es").map((d) => ({ label: d, next: "vis_periodo", set: { dia: d } })),
      { label: "Cualquier día / lo antes posible", next: "vis_periodo", set: { dia: "Lo antes posible" } },
    ],
  },
  vis_periodo: {
    say: ["¿Mañana o tarde?"],
    options: opts(["Mañana", "Tarde", "Cualquier horario"], "vis_ok", "periodo"),
  },
  vis_ok: {
    say: [(s) => `Anotado: ${s.dia}, ${s.periodo.toLowerCase()}, en ${s.cidade}. El equipo te confirma el horario exacto por WhatsApp.`],
    options: [{ label: "Continuar", next: "lead" }],
  },

  /* ---------- EMERGENCIA ---------- */
  emerg: {
    enter: { servico: "Emergencia eléctrica" },
    say: [
      "Primero la seguridad: si hay olor a quemado, chispas o descargas, baja el disyuntor general y no toques los cables.",
      "Si hay cables caídos en la calle o todo el barrio está sin luz, llama a Celesc (compañía eléctrica): 0800 48 0196.",
      () => abertoAgora()
        ? "Estamos en horario de atención — escríbenos ahora por WhatsApp y respondemos rápido."
        : `Estamos fuera de horario (${site.horario.texto.es}), pero escríbenos por WhatsApp y lo vemos lo antes posible.`,
    ],
    options: [
      { label: "Escribir por WhatsApp ahora", wa: true },
      { label: "Llamar a Celesc", href: "tel:08004800196" },
      voltar,
    ],
  },

  /* ---------- FAQ ---------- */
  faq: {
    say: ["Escribe tu consulta en pocas palabras."],
    input: { field: "pergunta", label: "Tu consulta", placeholder: "Ej.: ¿atienden en Imbituba?", next: "faq_res" },
  },
  faq_res: { say: [], options: [] },

  /* ---------- CIERRE ---------- */
  lead: {
    say: ["Perfecto. ¿Cómo te llamas?"],
    input: { field: "nome", label: "Tu nombre", placeholder: "Nombre y apellido", next: "lead_tel" },
  },
  lead_tel: {
    say: [(s) => `¡Mucho gusto, ${s.nome.split(" ")[0]}! ¿Cuál es tu WhatsApp? Incluye el código de país si no es de Brasil.`],
    input: { field: "telefone", label: "Número de WhatsApp", type: "tel", placeholder: "+54 9 11 1234-5678", next: "lead_envio" },
  },
  lead_envio: { say: [], options: [] },
  fim: {
    say: [`Eso es todo por mi parte. Si necesitas algo, ábreme de nuevo — o escríbenos directo por WhatsApp ${whatsapp.internacional}.`],
    options: [voltar],
  },
};

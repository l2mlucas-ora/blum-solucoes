/**
 * Assistant script — ENGLISH. Same node ids as pt.ts (the test checks this).
 * Values saved in the state (service, place…) go to the Blum team in the WhatsApp summary, in English.
 */
import { site, abertoAgora, whatsapp } from "../site";
import { faixa } from "../precos";
import { opts, proximosDias, type Flow, type Opt } from "./types";

export const rotulos: Record<string, string> = {
  servico: "Service", tipo: "Type", local: "Property", qtd: "Quantity", detalhe: "Detail",
  cidade: "Town", bairro: "Neighborhood/landmark", dia: "Preferred day", periodo: "Time of day", pergunta: "Question",
};

const voltar: Opt = { label: "Back to start", next: "inicio" };

export const flow: Flow = {
  inicio: {
    say: [
      "Hi! I'm the Blum Soluções assistant. I can answer questions, give you a ballpark quote and set up an on-site visit — in English.",
      "How can I help?",
    ],
    options: [
      { label: "Electrical", next: "ele_tipo" },
      { label: "Security cameras", next: "cam_local" },
      { label: "Smart lock / intercom", next: "acs_tipo" },
      { label: "Alarm and electric fence", next: "seg_tipo" },
      { label: "Lighting", next: "ilu_tipo" },
      { label: "Book an on-site visit", next: "vis_servico" },
      { label: "Electrical emergency", next: "emerg" },
      { label: "I have another question", next: "faq" },
    ],
  },

  /* ---------- ELECTRICAL ---------- */
  ele_tipo: {
    enter: { servico: "Electrical" },
    say: ["Sure, electrical. What do you need?"],
    options: [
      { label: "Wiring for new construction", next: "ele_local", set: { tipo: "New construction", chave: "ele_obra" } },
      { label: "Renovation / upgrade", next: "ele_local", set: { tipo: "Renovation", chave: "ele_obra" } },
      { label: "Breaker panel or surge protector", next: "ele_local", set: { tipo: "Breaker panel", chave: "ele_quadro" } },
      { label: "Outlets, points or electric shower", next: "ele_local", set: { tipo: "Points / shower", chave: "ele_ponto" } },
      { label: "Celesc utility hookup", next: "ele_local", set: { tipo: "Service entrance", chave: "ele_obra" } },
      { label: "Something isn't working", next: "ele_problema", set: { tipo: "Repair / fault", chave: "" } },
    ],
  },
  ele_problema: {
    say: ["Got it. Which of these sounds like your case?"],
    options: [
      { label: "Breaker keeps tripping", next: "ele_local", set: { detalhe: "Breaker tripping" } },
      { label: "Part of the house has no power", next: "ele_local", set: { detalhe: "Partial outage" } },
      { label: "Shock or burning smell", next: "emerg", set: { detalhe: "Shock / burning smell" } },
      { label: "Other problem", next: "ele_local", set: { detalhe: "Other" } },
    ],
  },
  ele_local: {
    say: ["Is it a home or a business?"],
    options: opts(["House", "Apartment", "Vacation home", "Shop / guesthouse", "Condo"], "orc", "local"),
  },

  /* ---------- CAMERAS ---------- */
  cam_local: {
    enter: { servico: "Security cameras" },
    say: ["Let's talk cameras. Where will they go?"],
    options: opts(["House", "Vacation home", "Shop / guesthouse", "Condo", "Construction site"], "cam_qtd", "local"),
  },
  cam_qtd: {
    say: ["Roughly how many cameras do you have in mind?"],
    options: [
      { label: "Up to 4", next: "cam_tipo", set: { qtd: "Up to 4", chave: "cam_4" } },
      { label: "5 to 8", next: "cam_tipo", set: { qtd: "5 to 8", chave: "cam_8" } },
      { label: "More than 8", next: "cam_tipo", set: { qtd: "More than 8", chave: "" } },
      { label: "Not sure, I'd like advice", next: "cam_tipo", set: { qtd: "To be defined on site", chave: "" } },
    ],
  },
  cam_tipo: {
    say: ["Is it a new system or is there one already installed?"],
    options: [
      { label: "New system", next: "orc", set: { tipo: "New system" } },
      { label: "Expand my current one", next: "orc", set: { tipo: "Expansion" } },
      { label: "Repair / maintenance", next: "orc", set: { tipo: "Maintenance", chave: "" } },
    ],
  },

  /* ---------- ACCESS CONTROL ---------- */
  acs_tipo: {
    enter: { servico: "Access control" },
    say: ["What would you like to install?"],
    options: [
      { label: "Smart lock", next: "acs_local", set: { tipo: "Smart lock", chave: "acs_fechadura" } },
      { label: "Video doorbell / intercom", next: "acs_local", set: { tipo: "Video doorbell / intercom", chave: "acs_video" } },
      { label: "Access control (condo/company)", next: "acs_local", set: { tipo: "Access control", chave: "" } },
      { label: "Service what I already have", next: "acs_local", set: { tipo: "Maintenance", chave: "" } },
    ],
  },
  acs_local: {
    say: [(s) => s.chave === "acs_fechadura"
      ? "Great choice — smart locks are a favorite for vacation rentals: a different code for each guest, managed from abroad. Where will it be?"
      : "Where will it be?"],
    options: opts(["House", "Vacation home / Airbnb", "Shop", "Condo"], "orc", "local"),
  },

  /* ---------- SECURITY ---------- */
  seg_tipo: {
    enter: { servico: "Alarms and security" },
    say: ["What are you looking for?"],
    options: [
      { label: "Alarm with phone alerts", next: "seg_local", set: { tipo: "Alarm", chave: "seg_alarme" } },
      { label: "Electric fence", next: "seg_local", set: { tipo: "Electric fence", chave: "" } },
      { label: "Alarm + cameras integrated", next: "seg_local", set: { tipo: "Alarm + cameras", chave: "" } },
      { label: "Maintenance", next: "seg_local", set: { tipo: "Maintenance", chave: "" } },
    ],
  },
  seg_local: {
    say: ["And where is it?"],
    options: opts(["House", "Vacation home", "Shop", "Condo / construction site"], "orc", "local"),
  },

  /* ---------- LIGHTING ---------- */
  ilu_tipo: {
    enter: { servico: "Lighting" },
    say: ["What kind of lighting?"],
    options: [
      { label: "Garden and path lights", next: "ilu_local", set: { tipo: "Garden / path lights", chave: "ilu_ponto" } },
      { label: "Facade, pergola or pool", next: "ilu_local", set: { tipo: "Facade / pergola / pool", chave: "ilu_ponto" } },
      { label: "Indoor LED / profiles", next: "ilu_local", set: { tipo: "Indoor LED", chave: "ilu_ponto" } },
      { label: "Sensors and automation", next: "ilu_local", set: { tipo: "Sensors / automation", chave: "" } },
    ],
  },
  ilu_local: {
    say: ["Is it new construction or a finished property?"],
    options: opts(["New construction", "Finished property", "Shop / guesthouse"], "orc", "local"),
  },

  /* ---------- BALLPARK QUOTE ---------- */
  orc: {
    say: [
      (s) => {
        const f = s.chave ? faixa(s.chave, "en") : null;
        return f
          ? `Based on what you told me, the reference price is ${f}. The final price comes after seeing the site — materials and distance matter.`
          : "To give you a fair price we need to see the place or a few photos. The quote is free and with no obligation.";
      },
      "How would you like to continue?",
    ],
    options: [
      { label: "Book an on-site visit", next: "vis_cidade" },
      { label: "Get a quote on WhatsApp", next: "lead" },
      { label: "I have a question first", next: "faq" },
      voltar,
    ],
  },

  /* ---------- ON-SITE VISIT ---------- */
  vis_servico: {
    say: ["Let's schedule it. Which service is the visit for?"],
    options: ["Electrical", "Security cameras", "Access control", "Alarms and security", "Lighting", "More than one service"]
      .map((l) => ({ label: l, next: "vis_cidade", set: { servico: l } })),
  },
  vis_cidade: {
    enter: { visita: "sim" },
    say: ["Which town or beach is the property in?"],
    options: [
      ...site.regiao.map((c) => ({ label: c, next: "vis_bairro", set: { cidade: c } })),
      { label: "Another town", next: "vis_outra" },
    ],
  },
  vis_outra: {
    say: ["Which town? We mainly cover Garopaba and surroundings, but we'll check availability for nearby towns."],
    input: { field: "cidade", label: "Town", placeholder: "E.g. Laguna", next: "vis_bairro" },
  },
  vis_bairro: {
    say: ["What's the neighborhood or a landmark near the address?"],
    input: { field: "bairro", label: "Neighborhood or landmark", placeholder: "E.g. Centro, near the church", next: "vis_dia" },
  },
  vis_dia: {
    say: ["Which day works best for you?"],
    options: () => [
      ...proximosDias(5, "en").map((d) => ({ label: d, next: "vis_periodo", set: { dia: d } })),
      { label: "Any day / as soon as possible", next: "vis_periodo", set: { dia: "As soon as possible" } },
    ],
  },
  vis_periodo: {
    say: ["Morning or afternoon?"],
    options: opts(["Morning", "Afternoon", "Any time"], "vis_ok", "periodo"),
  },
  vis_ok: {
    say: [(s) => `Noted: ${s.dia}, ${s.periodo.toLowerCase()}, in ${s.cidade}. Our team will confirm the exact time with you on WhatsApp.`],
    options: [{ label: "Continue", next: "lead" }],
  },

  /* ---------- EMERGENCY ---------- */
  emerg: {
    enter: { servico: "Electrical emergency" },
    say: [
      "Safety first: if there is a burning smell, sparks or shocks, switch off the main breaker and don't touch any wires.",
      "If there are wires down on the street or the whole neighborhood is out, call Celesc (the power company): 0800 48 0196.",
      () => abertoAgora()
        ? "We're open right now — message us on WhatsApp and we'll reply quickly."
        : `We're closed at the moment (${site.horario.texto.en}), but message us on WhatsApp and we'll check as soon as possible.`,
    ],
    options: [
      { label: "Message us on WhatsApp now", wa: true },
      { label: "Call Celesc", href: "tel:08004800196" },
      voltar,
    ],
  },

  /* ---------- FAQ ---------- */
  faq: {
    say: ["Type your question in a few words."],
    input: { field: "pergunta", label: "Your question", placeholder: "E.g. do you cover Imbituba?", next: "faq_res" },
  },
  faq_res: { say: [], options: [] },

  /* ---------- CLOSING ---------- */
  lead: {
    say: ["Perfect. What's your name?"],
    input: { field: "nome", label: "Your name", placeholder: "First and last name", next: "lead_tel" },
  },
  lead_tel: {
    say: [(s) => `Nice to meet you, ${s.nome.split(" ")[0]}! What's your WhatsApp number? Include the country code if it's not Brazilian.`],
    input: { field: "telefone", label: "WhatsApp number", type: "tel", placeholder: "+1 555 123 4567", next: "lead_envio" },
  },
  lead_envio: { say: [], options: [] },
  fim: {
    say: [`That's all from me. If you need anything, just open me again — or message us directly on WhatsApp ${whatsapp.internacional}.`],
    options: [voltar],
  },
};

/**
 * Roteiro do assistente — PORTUGUÊS (sem IA, árvore de decisão como na Target).
 * Caminhos: ramo de cada serviço → pré-orçamento (`orc`) → visita técnica ou WhatsApp;
 * visita técnica (`vis_*`); emergência; dúvidas (`faq`); lead. `faq_res` e `lead_envio` são preenchidos pelo widget.
 * en.ts e es.ts precisam ter exatamente os mesmos nós (o teste confere).
 */
import { site, abertoAgora, whatsapp } from "../site";
import { faixa } from "../precos";
import { opts, proximosDias, type Flow, type Opt } from "./types";

/** Rótulos do resumo enviado no WhatsApp e no lead (ordem = ordem no resumo). */
export const rotulos: Record<string, string> = {
  servico: "Serviço", tipo: "Tipo", local: "Local", qtd: "Quantidade", detalhe: "Detalhe",
  cidade: "Cidade", bairro: "Bairro/referência", dia: "Dia preferido", periodo: "Período", pergunta: "Dúvida",
};

const voltar: Opt = { label: "Voltar ao início", next: "inicio" };

export const flow: Flow = {
  inicio: {
    say: [
      "Oi! Sou o assistente da Blum Soluções. Tiro dúvidas, faço um pré-orçamento e já deixo sua visita técnica encaminhada.",
      "Como posso ajudar?",
    ],
    options: [
      { label: "Elétrica", next: "ele_tipo" },
      { label: "Câmeras de segurança", next: "cam_local" },
      { label: "Fechadura digital / interfone", next: "acs_tipo" },
      { label: "Alarme e cerca elétrica", next: "seg_tipo" },
      { label: "Iluminação", next: "ilu_tipo" },
      { label: "Agendar visita técnica", next: "vis_servico" },
      { label: "Emergência elétrica", next: "emerg" },
      { label: "Tenho outra dúvida", next: "faq" },
    ],
  },

  /* ---------- ELÉTRICA ---------- */
  ele_tipo: {
    enter: { servico: "Elétrica" },
    say: ["Certo, elétrica. O que você precisa?"],
    options: [
      { label: "Instalação para obra nova", next: "ele_local", set: { tipo: "Obra nova", chave: "ele_obra" } },
      { label: "Reforma / adequação", next: "ele_local", set: { tipo: "Reforma", chave: "ele_obra" } },
      { label: "Quadro, disjuntor ou DPS", next: "ele_local", set: { tipo: "Quadro de distribuição", chave: "ele_quadro" } },
      { label: "Tomadas, pontos ou chuveiro", next: "ele_local", set: { tipo: "Pontos / chuveiro", chave: "ele_ponto" } },
      { label: "Carregador de carro elétrico", next: "ele_local", set: { tipo: "Carregador veicular", chave: "" } },
      { label: "Padrão de entrada Celesc", next: "ele_local", set: { tipo: "Padrão de entrada", chave: "ele_obra" } },
      { label: "Algo está com problema", next: "ele_problema", set: { tipo: "Manutenção / defeito", chave: "" } },
    ],
  },
  ele_problema: {
    say: ["Entendi. Qual destes parece com o seu caso?"],
    options: [
      { label: "Disjuntor desarmando", next: "ele_local", set: { detalhe: "Disjuntor desarmando" } },
      { label: "Parte da casa sem luz", next: "ele_local", set: { detalhe: "Parte sem energia" } },
      { label: "Choque ou cheiro de queimado", next: "emerg", set: { detalhe: "Choque / cheiro de queimado" } },
      { label: "Outro problema", next: "ele_local", set: { detalhe: "Outro" } },
    ],
  },
  ele_local: {
    say: ["É residência ou comércio?"],
    options: opts(["Casa", "Apartamento", "Casa de temporada", "Comércio / pousada", "Condomínio"], "orc", "local"),
  },

  /* ---------- CÂMERAS ---------- */
  cam_local: {
    enter: { servico: "Câmeras de segurança" },
    say: ["Vamos às câmeras. Onde vão ficar?"],
    options: opts(["Casa", "Casa de temporada", "Comércio / pousada", "Condomínio", "Obra"], "cam_qtd", "local"),
  },
  cam_qtd: {
    say: ["Mais ou menos quantas câmeras você imagina?"],
    options: [
      { label: "Até 4", next: "cam_tipo", set: { qtd: "Até 4", chave: "cam_4" } },
      { label: "5 a 8", next: "cam_tipo", set: { qtd: "5 a 8", chave: "cam_8" } },
      { label: "Mais de 8", next: "cam_tipo", set: { qtd: "Mais de 8", chave: "" } },
      { label: "Não sei, quero indicação", next: "cam_tipo", set: { qtd: "A definir na visita", chave: "" } },
    ],
  },
  cam_tipo: {
    say: ["É um sistema novo ou já existe algum instalado?"],
    options: [
      { label: "Sistema novo", next: "orc", set: { tipo: "Sistema novo" } },
      { label: "Ampliar o que já tenho", next: "orc", set: { tipo: "Ampliação" } },
      { label: "Consertar / manutenção", next: "orc", set: { tipo: "Manutenção", chave: "" } },
    ],
  },

  /* ---------- CONTROLE DE ACESSO ---------- */
  acs_tipo: {
    enter: { servico: "Controle de acesso" },
    say: ["O que você quer instalar?"],
    options: [
      { label: "Fechadura digital", next: "acs_local", set: { tipo: "Fechadura digital", chave: "acs_fechadura" } },
      { label: "Videoporteiro / interfone", next: "acs_local", set: { tipo: "Videoporteiro / interfone", chave: "acs_video" } },
      { label: "Controle de acesso (condomínio/empresa)", next: "acs_local", set: { tipo: "Controle de acesso", chave: "" } },
      { label: "Manutenção do que já tenho", next: "acs_local", set: { tipo: "Manutenção", chave: "" } },
    ],
  },
  acs_local: {
    say: [(s) => s.chave === "acs_fechadura"
      ? "Ótimo — fechadura digital é campeã em casas de temporada: senha diferente para cada hóspede. Onde vai ser?"
      : "Onde vai ser?"],
    options: opts(["Casa", "Casa de temporada / Airbnb", "Comércio", "Condomínio"], "orc", "local"),
  },

  /* ---------- SEGURANÇA ---------- */
  seg_tipo: {
    enter: { servico: "Segurança eletrônica" },
    say: ["O que você procura?"],
    options: [
      { label: "Alarme com aviso no celular", next: "seg_local", set: { tipo: "Alarme", chave: "seg_alarme" } },
      { label: "Cerca elétrica", next: "seg_local", set: { tipo: "Cerca elétrica", chave: "" } },
      { label: "Alarme + câmeras integrados", next: "seg_local", set: { tipo: "Alarme + câmeras", chave: "" } },
      { label: "Manutenção", next: "seg_local", set: { tipo: "Manutenção", chave: "" } },
    ],
  },
  seg_local: {
    say: ["E onde vai ser?"],
    options: opts(["Casa", "Casa de temporada", "Comércio", "Condomínio / obra"], "orc", "local"),
  },

  /* ---------- ILUMINAÇÃO ---------- */
  ilu_tipo: {
    enter: { servico: "Iluminação" },
    say: ["Que tipo de iluminação?"],
    options: [
      { label: "Jardim e balizadores", next: "ilu_local", set: { tipo: "Jardim / balizadores", chave: "ilu_ponto" } },
      { label: "Fachada, pergolado ou piscina", next: "ilu_local", set: { tipo: "Fachada / pergolado / piscina", chave: "ilu_ponto" } },
      { label: "Interna com LED / perfis", next: "ilu_local", set: { tipo: "Interna LED", chave: "ilu_ponto" } },
      { label: "Sensores e automação", next: "ilu_local", set: { tipo: "Sensores / automação", chave: "" } },
    ],
  },
  ilu_local: {
    say: ["É obra nova ou o imóvel já está pronto?"],
    options: opts(["Obra nova", "Imóvel pronto", "Comércio / pousada"], "orc", "local"),
  },

  /* ---------- PRÉ-ORÇAMENTO ---------- */
  orc: {
    say: [
      (s) => {
        const f = s.chave ? faixa(s.chave, "pt") : null;
        return f
          ? `Pelo que você contou, a referência é ${f}. O valor final sai depois de ver o local — material e distância contam.`
          : "Para te passar um valor justo, a gente precisa ver o local ou algumas fotos. O orçamento é sem compromisso.";
      },
      "Como prefere seguir?",
    ],
    options: [
      { label: "Agendar visita técnica", next: "vis_cidade" },
      { label: "Receber orçamento no WhatsApp", next: "lead" },
      { label: "Tenho uma dúvida antes", next: "faq" },
      voltar,
    ],
  },

  /* ---------- VISITA TÉCNICA ---------- */
  vis_servico: {
    say: ["Vamos agendar. A visita é para qual serviço?"],
    options: ["Elétrica", "Câmeras de segurança", "Controle de acesso", "Segurança eletrônica", "Iluminação", "Mais de um serviço"]
      .map((l) => ({ label: l, next: "vis_cidade", set: { servico: l } })),
  },
  vis_cidade: {
    enter: { visita: "sim" },
    say: ["Em qual cidade ou praia é o imóvel?"],
    options: [
      ...site.regiao.map((c) => ({ label: c, next: "vis_bairro", set: { cidade: c } })),
      { label: "Outra cidade", next: "vis_outra" },
    ],
  },
  vis_outra: {
    say: ["Qual cidade? Atendemos principalmente Garopaba e arredores, mas verificamos a agenda para outras próximas."],
    input: { field: "cidade", label: "Cidade", placeholder: "Ex.: Laguna", next: "vis_bairro" },
  },
  vis_bairro: {
    say: ["Qual o bairro ou uma referência do endereço?"],
    input: { field: "bairro", label: "Bairro ou referência", placeholder: "Ex.: Centro, perto da igreja", next: "vis_dia" },
  },
  vis_dia: {
    say: ["Qual o melhor dia para você?"],
    options: () => [
      ...proximosDias(5, "pt").map((d) => ({ label: d, next: "vis_periodo", set: { dia: d } })),
      { label: "Tanto faz / o quanto antes", next: "vis_periodo", set: { dia: "O quanto antes" } },
    ],
  },
  vis_periodo: {
    say: ["Manhã ou tarde?"],
    options: opts(["Manhã", "Tarde", "Qualquer horário"], "vis_ok", "periodo"),
  },
  vis_ok: {
    say: [(s) => `Anotado: ${s.dia}, ${s.periodo.toLowerCase()}, em ${s.cidade}. A equipe confirma o horário certinho com você pelo WhatsApp.`],
    options: [{ label: "Continuar", next: "lead" }],
  },

  /* ---------- EMERGÊNCIA ---------- */
  emerg: {
    enter: { servico: "Emergência elétrica" },
    say: [
      "Segurança primeiro: se houver cheiro de queimado, faísca ou choque, desligue o disjuntor geral e não toque em fios.",
      "Se o problema for fio caído na rua ou falta de luz no bairro, ligue para a Celesc: 0800 48 0196.",
      () => abertoAgora()
        ? "Estamos em horário de atendimento — chame agora no WhatsApp que a gente responde rápido."
        : `Estamos fora do horário (${site.horario.texto.pt}), mas chame no WhatsApp: verificamos assim que possível.`,
    ],
    options: [
      { label: "Chamar no WhatsApp agora", wa: true },
      { label: "Ligar para a Celesc", href: "tel:08004800196" },
      voltar,
    ],
  },

  /* ---------- FAQ ---------- */
  faq: {
    say: ["Escreva sua dúvida em poucas palavras."],
    input: { field: "pergunta", label: "Sua dúvida", placeholder: "Ex.: vocês atendem Imbituba?", next: "faq_res" },
  },
  faq_res: { say: [], options: [] },

  /* ---------- FECHAMENTO ---------- */
  lead: {
    say: ["Perfeito. Como você se chama?"],
    input: { field: "nome", label: "Seu nome", placeholder: "Nome e sobrenome", next: "lead_tel" },
  },
  lead_tel: {
    say: [(s) => `Prazer, ${s.nome.split(" ")[0]}! Qual o seu WhatsApp com DDD?`],
    input: { field: "telefone", label: "WhatsApp com DDD", type: "tel", placeholder: "(48) 90000-0000", next: "lead_envio" },
  },
  lead_envio: { say: [], options: [] },
  fim: {
    say: [`Fico por aqui. Se precisar, é só me chamar de novo — ou falar direto no WhatsApp ${whatsapp.exibicao}.`],
    options: [voltar],
  },
};

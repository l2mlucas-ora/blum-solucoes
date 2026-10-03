/**
 * Tabela do pré-orçamento do assistente.
 *
 * PENDENTE: todos os valores precisam ser confirmados pelo cliente (ver PENDENCIAS.md).
 * Enquanto `confirmado` for false, o assistente NÃO mostra valor nenhum — diz "sob consulta"
 * e encaminha para o WhatsApp. Para ligar, preencha `apartirDe` e mude `confirmado` para true.
 */
import type { Lang, T } from "../i18n/routes";

export const confirmado = false;

export interface ItemPreco {
  /** Valor inicial em reais (mão de obra, sem material, salvo indicação). */
  apartirDe: number;
  unidade?: T;
  obs?: T;
}

const porPonto: T = { pt: "por ponto", en: "per point", es: "por punto" };

export const precos: Record<string, ItemPreco> = {
  "ele_ponto":     { apartirDe: 0, unidade: porPonto, obs: { pt: "tomada, interruptor ou ponto de luz", en: "outlet, switch or light point", es: "enchufe, interruptor o punto de luz" } },
  "ele_quadro":    { apartirDe: 0, obs: { pt: "troca/organização de quadro de distribuição", en: "breaker panel replacement/rework", es: "cambio/organización del tablero" } },
  "ele_obra":      { apartirDe: 0, obs: { pt: "instalação completa — depende da planta", en: "full installation — depends on the plan", es: "instalación completa — depende del plano" } },
  "cam_4":         { apartirDe: 0, obs: { pt: "kit 4 câmeras instalado, com gravador e app", en: "4-camera kit installed, with recorder and app", es: "kit de 4 cámaras instalado, con grabador y app" } },
  "cam_8":         { apartirDe: 0, obs: { pt: "kit 8 câmeras instalado, com gravador e app", en: "8-camera kit installed, with recorder and app", es: "kit de 8 cámaras instalado, con grabador y app" } },
  "acs_fechadura": { apartirDe: 0, unidade: { pt: "por fechadura", en: "per lock", es: "por cerradura" }, obs: { pt: "instalação de fechadura digital", en: "smart lock installation", es: "instalación de cerradura digital" } },
  "acs_video":     { apartirDe: 0, obs: { pt: "videoporteiro instalado", en: "video doorbell installed", es: "videoportero instalado" } },
  "seg_alarme":    { apartirDe: 0, obs: { pt: "alarme com app e 4 sensores", en: "alarm with app and 4 sensors", es: "alarma con app y 4 sensores" } },
  "ilu_ponto":     { apartirDe: 0, unidade: porPonto, obs: { pt: "balizador, espeto ou luminária", en: "path light, spike light or fixture", es: "baliza, estaca o luminaria" } },
};

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const APARTIR: T = { pt: "a partir de", en: "from", es: "desde" };

/** Texto do pré-orçamento para uma chave — ou null se ainda não houver valor confirmado. */
export function faixa(chave: string, lang: Lang = "pt"): string | null {
  const p = precos[chave];
  if (!confirmado || !p || !p.apartirDe) return null;
  return `${APARTIR[lang]} ${brl(p.apartirDe)}${p.unidade ? " " + p.unidade[lang] : ""}${p.obs ? ` (${p.obs[lang]})` : ""}`;
}

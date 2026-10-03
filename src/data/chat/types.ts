/**
 * Tipos e utilitários comuns aos roteiros do assistente (pt.ts, en.ts, es.ts).
 * Os três roteiros têm OS MESMOS ids de nó — o motor (src/scripts/chat.ts) e o teste dependem disso.
 */
import type { Lang } from "../../i18n/routes";

export type State = Record<string, string>;

export interface Opt {
  label: string;
  next?: string;
  set?: State;
  href?: string;
  /** Abre o WhatsApp com o resumo da conversa. */
  wa?: true;
}

export interface ChatNode {
  say: (string | ((s: State) => string))[];
  options?: Opt[] | ((s: State) => Opt[]);
  input?: { field: string; label: string; type?: "text" | "tel"; placeholder?: string; next: string };
  /** Grava estado ao entrar no nó (serviço, origem do lead...). */
  enter?: State;
}

export type Flow = Record<string, ChatNode>;

/** Botões que gravam um campo e seguem para o mesmo nó. */
export const opts = (labels: string[], next: string, campo: string, extra: State = {}): Opt[] =>
  labels.map((l) => ({ label: l, next, set: { [campo]: l, ...extra } }));

const LOCALE: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-AR" };

/** Próximos dias de atendimento (seg–sáb), a partir de amanhã, no fuso de Brasília. */
export function proximosDias(n = 5, lang: Lang = "pt", hoje = new Date()): string[] {
  const out: string[] = [];
  const fmt = new Intl.DateTimeFormat(LOCALE[lang], { timeZone: "America/Sao_Paulo", weekday: "short", day: "numeric", month: "short" });
  const dow = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short" });
  for (let i = 1; out.length < n && i < 14; i++) {
    const d = new Date(hoje.getTime() + i * 86_400_000);
    if (dow.format(d) === "Sun") continue;
    out.push(fmt.format(d).replace(/\./g, "").replace(/^\w/, (c) => c.toUpperCase()));
  }
  return out;
}

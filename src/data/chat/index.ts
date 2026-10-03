/** Roteiro do assistente por idioma. */
import type { Lang } from "../../i18n/routes";
import type { Flow } from "./types";
import * as pt from "./pt";
import * as en from "./en";
import * as es from "./es";

export const roteiros: Record<Lang, { flow: Flow; rotulos: Record<string, string> }> = { pt, en, es };
export * from "./types";

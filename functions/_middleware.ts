/**
 * Endereços provisórios (*.pages.dev) não podem ser indexados: só o domínio oficial aparece no Google.
 * Vale para a prévia enviada ao cliente antes de apontar o domínio.
 */
interface Ctx { request: Request; next: () => Promise<Response> }

export async function onRequest({ request, next }: Ctx) {
  const res = await next();
  if (!new URL(request.url).hostname.endsWith(".pages.dev")) return res;
  const out = new Response(res.body, res);
  out.headers.set("X-Robots-Tag", "noindex, nofollow");
  return out;
}

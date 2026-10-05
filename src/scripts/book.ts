/* Book de obras: avança sozinho para o lado, pausa quando a pessoa interage, só roda visível na tela. */
const INTERVALO = 3800;
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll<HTMLElement>("[data-book]").forEach((book) => {
  const trilho = book.querySelector<HTMLElement>(".book-trilho")!;
  const barra = book.querySelector<HTMLElement>(".book-progresso span");
  const itens = () => [...trilho.querySelectorAll<HTMLElement>(".book-item:not([hidden])")];
  let timer: number | undefined;
  let pausadoAte = 0;
  let visivel = false;

  const passo = () => {
    const [a, b] = itens();
    return a && b ? b.offsetLeft - a.offsetLeft : trilho.clientWidth;
  };
  const noFim = () => trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 8;

  function mover(dir: number) {
    if (dir > 0 && noFim()) trilho.scrollTo({ left: 0, behavior: reduz ? "auto" : "smooth" });
    else trilho.scrollBy({ left: dir * passo(), behavior: reduz ? "auto" : "smooth" });
  }

  function atualizarBarra() {
    if (!barra) return;
    const max = trilho.scrollWidth - trilho.clientWidth;
    barra.style.width = `${max > 0 ? Math.max(8, (trilho.scrollLeft / max) * 100) : 100}%`;
  }

  function tick() {
    if (!visivel || document.hidden || Date.now() < pausadoAte || itens().length < 2) return;
    mover(1);
  }
  function ligar() { if (!reduz && !timer) timer = window.setInterval(tick, INTERVALO); }
  /** Interação da pessoa: segura o autoplay por 8 s. */
  const pausar = () => { pausadoAte = Date.now() + 8000; };

  book.querySelectorAll<HTMLButtonElement>(".book-seta").forEach((b) =>
    b.addEventListener("click", () => { pausar(); mover(Number(b.dataset.dir)); }));
  ["pointerdown", "wheel", "touchstart", "keydown"].forEach((ev) => trilho.addEventListener(ev, pausar, { passive: true }));
  book.addEventListener("mouseenter", () => { pausadoAte = Infinity; });
  book.addEventListener("mouseleave", () => { pausadoAte = Date.now() + 1500; });
  trilho.addEventListener("focusin", () => { pausadoAte = Infinity; });
  trilho.addEventListener("focusout", () => { pausadoAte = 0; });
  trilho.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); mover(-1); }
  });
  trilho.addEventListener("scroll", atualizarBarra, { passive: true });

  /* Filtros por serviço (só na home). */
  const chips = [...book.querySelectorAll<HTMLButtonElement>(".book-chip")];
  chips.forEach((c) => c.addEventListener("click", () => {
    const f = c.dataset.filtro;
    chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
    trilho.querySelectorAll<HTMLElement>(".book-item").forEach((it) => { it.hidden = f !== "todos" && it.dataset.servico !== f; });
    trilho.scrollTo({ left: 0 });
    pausar();
    atualizarBarra();
  }));

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }, { threshold: 0.35 }).observe(book);
  atualizarBarra();
  ligar();
});

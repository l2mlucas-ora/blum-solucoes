"""Gera as peças de lançamento do site para o Instagram (feed 1080x1350 e story 1080x1920).
Uso: python marketing/instagram/gerar.py  (a partir da raiz do projeto)
Precisa de: fontes TTF convertidas (archivo.ttf, manrope.ttf) e das telas do site (tela-home.jpg, tela-chat.jpg)
na pasta indicada em ASSETS."""
import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS = sys.argv[1] if len(sys.argv) > 1 else "marketing/instagram/assets"
OUT = "marketing/instagram"
TEAL, BLUE, INK = (47, 199, 159), (45, 127, 211), (9, 14, 16)
TXT, DIM = (242, 247, 247), (160, 178, 181)


def fonte(nome, tam, wght=None, wdth=None):
    f = ImageFont.truetype(os.path.join(ASSETS, f"{nome}.ttf"), tam)
    if nome == "archivo":
        f.set_variation_by_axes([wght or 800, wdth or 100])
    else:
        f.set_variation_by_axes([wght or 500])
    return f


def gradiente(w, h, a=TEAL, b=BLUE, diag=True):
    g = Image.new("RGB", (w, h))
    px = g.load()
    for y in range(h):
        for x in range(w):
            t = ((x / max(1, w - 1)) * 0.75 + (y / max(1, h - 1)) * 0.25) if diag else x / max(1, w - 1)
            px[x, y] = tuple(round(a[k] * (1 - t) + b[k] * t) for k in range(3))
    return g


def texto_grad(base, xy, texto, f):
    """Texto preenchido com o degradê da marca."""
    d = ImageDraw.Draw(base)
    xy = (round(xy[0]), round(xy[1]))
    x0, y0, x1, y1 = d.textbbox(xy, texto, font=f)
    m = Image.new("L", base.size)
    ImageDraw.Draw(m).text(xy, texto, font=f, fill=255)
    g = gradiente(x1 - x0 + 2, y1 - y0 + 2, diag=False)
    camada = Image.new("RGB", base.size)
    camada.paste(g, (x0, y0))
    base.paste(camada, (0, 0), m)


def fundo(w, h):
    bg = Image.new("RGBA", (w, h), INK + (255,))
    # brilhos
    gl = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(gl)
    d.ellipse((-w * 0.35, -h * 0.15, w * 0.55, h * 0.45), fill=TEAL + (70,))
    d.ellipse((w * 0.45, h * 0.45, w * 1.4, h * 1.15), fill=BLUE + (80,))
    bg = Image.alpha_composite(bg, gl.filter(ImageFilter.GaussianBlur(160)))
    # grade tech discreta
    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, w, 60):
        gd.line([(x, 0), (x, h)], fill=(255, 255, 255, 10))
    for y in range(0, h, 60):
        gd.line([(0, y), (w, y)], fill=(255, 255, 255, 10))
    # some a grade nas bordas (vinheta)
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).ellipse((-w * 0.1, -h * 0.05, w * 1.1, h * 1.05), fill=255)
    grid.putalpha(Image.composite(grid.split()[3], Image.new("L", (w, h), 0), m.filter(ImageFilter.GaussianBlur(120))))
    return Image.alpha_composite(bg, grid)


def celular(tela, largura, raio=None):
    """Mockup de celular com a tela do site."""
    tw = largura - 28
    th = round(tela.height * tw / tela.width)
    t = tela.resize((tw, th), Image.LANCZOS)
    topo = round(largura * 0.11)  # borda de cima, onde fica a ilha
    h = th + 14 + topo
    raio = raio or round(largura * 0.13)
    corpo = Image.new("RGBA", (largura, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(corpo)
    d.rounded_rectangle((0, 0, largura - 1, h - 1), raio, fill=(22, 28, 31, 255), outline=(70, 84, 88, 255), width=3)
    m = Image.new("L", (tw, th), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, tw - 1, th - 1), raio - 12, fill=255)
    corpo.paste(t, (14, topo), m)
    # ilha dinâmica na borda de cima (fora da tela)
    iw, ih = round(largura * 0.26), round(largura * 0.05)
    d.rounded_rectangle(((largura - iw) // 2, (topo - ih) // 2, (largura + iw) // 2, (topo + ih) // 2), ih // 2, fill=(5, 7, 8, 255))
    return corpo


def sombra(img, desloc=(0, 30), blur=40, alpha=170):
    s = Image.new("RGBA", (img.width + blur * 4, img.height + blur * 4), (0, 0, 0, 0))
    a = img.split()[3].point(lambda v: alpha if v > 0 else 0)
    s.paste(Image.new("RGBA", img.size, (0, 0, 0, 255)), (blur * 2 + desloc[0], blur * 2 + desloc[1]), a)
    return s.filter(ImageFilter.GaussianBlur(blur))


def colar(base, img, xy, rot=0):
    if rot:
        img = img.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh = sombra(img)
    base.alpha_composite(sh, (xy[0] - sh.width // 2 + img.width // 2, xy[1] - sh.height // 2 + img.height // 2))
    base.alpha_composite(img, xy)


def chip(base, xy, texto, f, icone=None, cheio=False):
    camada = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    pad_x, pad_y = 26, 14
    tw = d.textlength(texto, font=f)
    ih = f.size + pad_y * 2
    w = tw + pad_x * 2 + (34 if icone else 0)
    x, y = xy
    if cheio:
        g = gradiente(int(w), ih, diag=False).convert("RGBA")
        m = Image.new("L", (int(w), ih), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, int(w) - 1, ih - 1), ih // 2, fill=255)
        camada.paste(g, (int(x), int(y)), m)
    else:
        d.rounded_rectangle((x, y, x + w, y + ih), ih // 2, fill=(255, 255, 255, 18), outline=(255, 255, 255, 46), width=2)
    tx = x + pad_x
    if icone:
        cx, cy = tx + 10, y + ih / 2
        d.ellipse((cx - 9, cy - 9, cx + 9, cy + 9), fill=TEAL if not cheio else (255, 255, 255))
        tx += 34
    d.text((tx, y + pad_y - 4), texto, font=f, fill=TXT if not cheio else (255, 255, 255))
    base.alpha_composite(camada)
    return w


def marca(base, xy, escala=1.0):
    logo = Image.open("brand/logo-colorido-transparente.png").convert("RGBA")
    sym = logo.crop((0, 0, logo.width, int(logo.height * 0.6)))
    sym = sym.crop(sym.getbbox())
    sym.thumbnail((int(64 * escala), int(64 * escala)), Image.LANCZOS)
    base.alpha_composite(sym, xy)
    d = ImageDraw.Draw(base)
    d.text((xy[0] + sym.width + 16, xy[1] + 2 * escala), "BLUM", font=fonte("archivo", int(30 * escala), 800, 110), fill=TXT)
    d.text((xy[0] + sym.width + 18, xy[1] + 38 * escala), "S O L U Ç Õ E S", font=fonte("manrope", int(14 * escala), 600), fill=DIM)


def feed():
    W, H = 1080, 1350
    b = fundo(W, H)
    d = ImageDraw.Draw(b)
    marca(b, (70, 64))
    chip(b, (W - 70 - 238, 70), "NOVO SITE", fonte("archivo", 26, 800, 110), cheio=True)
    f1 = fonte("archivo", 96, 850, 92)
    d.text((70, 190), "Nosso novo site", font=f1, fill=TXT)
    texto_grad(b, (70, 296), "está no ar.", f1)
    d.text((72, 430), "Orçamento rápido com assistente, agenda de", font=fonte("manrope", 34, 500), fill=DIM)
    d.text((72, 474), "visita técnica e todas as nossas obras.", font=fonte("manrope", 34, 500), fill=DIM)
    home = celular(Image.open(os.path.join(ASSETS, "tela-home.jpg")).convert("RGB"), 380)
    chat = celular(Image.open(os.path.join(ASSETS, "tela-chat.jpg")).convert("RGB"), 410)
    colar(b, home, (95, 600), rot=4)
    colar(b, chat, (520, 560), rot=-3)
    # selo flutuante do assistente
    sel = Image.new("RGBA", (360, 92), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sel)
    sd.rounded_rectangle((0, 0, 359, 91), 46, fill=(14, 22, 25, 235), outline=TEAL + (160,), width=2)
    sd.ellipse((18, 18, 74, 74), fill=TEAL)
    sd.line([(32, 47), (42, 58), (61, 34)], fill=(6, 32, 26), width=6, joint="curve")
    sd.text((92, 16), "Assistente 24h", font=fonte("archivo", 28, 800, 100), fill=TXT)
    sd.text((92, 50), "orça na hora, em 3 idiomas", font=fonte("manrope", 20, 500), fill=DIM)
    colar(b, sel, (640, 1080))
    # rodapé
    d = ImageDraw.Draw(b)
    faixa = Image.new("RGBA", (W, 120), (8, 12, 14, 255))
    b.alpha_composite(faixa, (0, H - 120))
    d = ImageDraw.Draw(b)
    d.line([(0, H - 120), (W, H - 120)], fill=(255, 255, 255, 30), width=1)
    d.text((70, H - 80), "Orçamento rápido  ·  Visita técnica  ·  PT · EN · ES", font=fonte("manrope", 27, 600), fill=DIM)
    fl = fonte("archivo", 32, 800, 100)
    texto_grad(b, (W - 70 - ImageDraw.Draw(b).textlength("Link na bio", font=fl), H - 82), "Link na bio", fl)
    b.convert("RGB").save(f"{OUT}/post-feed-novo-site-1080x1350.jpg", quality=93)


def story():
    W, H = 1080, 1920
    b = fundo(W, H)
    d = ImageDraw.Draw(b)
    marca(b, (70, 150), 1.15)
    chip(b, (W - 70 - 238, 160), "NOVO SITE", fonte("archivo", 26, 800, 110), cheio=True)
    f1 = fonte("archivo", 104, 850, 92)
    d.text((70, 300), "Nosso novo site", font=f1, fill=TXT)
    texto_grad(b, (70, 414), "está no ar.", f1)
    d.text((72, 560), "Peça seu orçamento pelo assistente", font=fonte("manrope", 38, 500), fill=DIM)
    d.text((72, 608), "e agende a visita em 1 minuto.", font=fonte("manrope", 38, 500), fill=DIM)
    home = celular(Image.open(os.path.join(ASSETS, "tela-home.jpg")).convert("RGB"), 370)
    chat = celular(Image.open(os.path.join(ASSETS, "tela-chat.jpg")).convert("RGB"), 410)
    colar(b, home, (100, 720), rot=4)
    colar(b, chat, (530, 690), rot=-3)
    # chamada para o adesivo de link (área livre embaixo)
    f2 = fonte("archivo", 44, 800, 100)
    t = "Toque no link e conheça"
    w = ImageDraw.Draw(b).textlength(t, font=f2)
    texto_grad(b, ((W - w) / 2, 1665), t, f2)
    d = ImageDraw.Draw(b)
    d.text((W / 2 - 18, 1725), "↓", font=fonte("manrope", 56, 700), fill=TEAL)
    b.convert("RGB").save(f"{OUT}/story-novo-site-1080x1920.jpg", quality=93)


if __name__ == "__main__":
    feed()
    story()
    print("ok")

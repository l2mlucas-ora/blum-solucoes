"""Carrossel de lançamento do site (6 slides 1080x1350). Reaproveita o visual de gerar.py.
Uso: python marketing/instagram/carrossel.py  (a partir da raiz do projeto)"""
import os, sys, datetime
sys.path.insert(0, os.path.dirname(__file__))
import gerar as g
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1350
OUT = "marketing/instagram/carrossel"
os.makedirs(OUT, exist_ok=True)
TXT, DIM, TEAL, BLUE = g.TXT, g.DIM, g.TEAL, g.BLUE
WA = (37, 211, 102)
TOTAL = 6


def base(n):
    b = g.fundo(W, H)
    g.marca(b, (70, 64))
    d = ImageDraw.Draw(b)
    f = g.fonte("manrope", 26, 700)
    t = f"{n:02d}/{TOTAL:02d}"
    d.text((W - 70 - d.textlength(t, font=f), 82), t, font=f, fill=DIM)
    # barra de progresso dos slides
    x0, y = 70, H - 46
    seg = (W - 140 - (TOTAL - 1) * 10) / TOTAL
    barras = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(barras)
    for i in range(TOTAL):
        x = x0 + i * (seg + 10)
        if i != n - 1:
            bd.rounded_rectangle((x, y, x + seg, y + 6), 3, fill=(255, 255, 255, 45))
    b.alpha_composite(barras)
    xa = x0 + (n - 1) * (seg + 10)
    b.paste(g.gradiente(int(seg), 6, diag=False), (int(xa), y))
    return b


def eyebrow(b, xy, texto):
    d = ImageDraw.Draw(b)
    f = g.fonte("archivo", 26, 800, 112)
    gr = g.gradiente(36, 5, diag=False)
    b.paste(gr, (xy[0], xy[1] + 16))
    d.text((xy[0] + 52, xy[1]), texto, font=f, fill=(95, 224, 191))


def titulo(b, xy, linhas, tam=84, grad_ultima=True):
    d = ImageDraw.Draw(b)
    f = g.fonte("archivo", tam, 850, 92)
    y = xy[1]
    for i, l in enumerate(linhas):
        if grad_ultima and i == len(linhas) - 1:
            g.texto_grad(b, (xy[0], y), l, f)
        else:
            d.text((xy[0], y), l, font=f, fill=TXT)
        y += int(tam * 1.08)
    return y


def paragrafo(b, xy, linhas, tam=34, cor=DIM):
    d = ImageDraw.Draw(b)
    f = g.fonte("manrope", tam, 500)
    y = xy[1]
    for l in linhas:
        d.text((xy[0], y), l, font=f, fill=cor)
        y += int(tam * 1.45)
    return y


def check(d, cx, cy, r=22, cor=TEAL):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=cor)
    d.line([(cx - r * 0.45, cy + r * 0.02), (cx - r * 0.1, cy + r * 0.38), (cx + r * 0.5, cy - r * 0.35)], fill=(6, 32, 26), width=max(4, r // 5), joint="curve")


def lista(b, xy, itens, tam=32):
    d = ImageDraw.Draw(b)
    f = g.fonte("manrope", tam, 600)
    y = xy[1]
    for it in itens:
        check(d, xy[0] + 22, y + tam * 0.62, 20)
        d.text((xy[0] + 62, y), it, font=f, fill=TXT)
        y += int(tam * 1.75)
    return y


def seta(d, x, y, w=60, cor=TEAL, esp=6):
    d.line([(x, y), (x + w, y)], fill=cor, width=esp)
    d.line([(x + w - 18, y - 16), (x + w, y), (x + w - 18, y + 16)], fill=cor, width=esp, joint="curve")


# ---------- bolhas do assistente (iguais às do site) ----------
def bolha(camada, xy, texto, f, eu=False, maxw=560):
    d = ImageDraw.Draw(camada)
    # quebra de linha simples
    palavras, linhas, atual = texto.split(), [], ""
    for p in palavras:
        teste = (atual + " " + p).strip()
        if d.textlength(teste, font=f) > maxw - 52:
            linhas.append(atual); atual = p
        else:
            atual = teste
    linhas.append(atual)
    lh = int(f.size * 1.4)
    w = max(d.textlength(l, font=f) for l in linhas) + 52
    h = lh * len(linhas) + 30
    x, y = xy
    if eu:
        x = x - w
        d.rounded_rectangle((x, y, x + w, y + h), 26, fill=(18, 48, 42, 255), outline=(47, 199, 159, 120), width=2)
    else:
        d.rounded_rectangle((x, y, x + w, y + h), 26, fill=(30, 40, 44, 255))
    for i, l in enumerate(linhas):
        d.text((x + 26, y + 13 + i * lh), l, font=f, fill=TXT)
    return y + h


def opcao(camada, xy, texto, f, sel=False, wa=False):
    d = ImageDraw.Draw(camada)
    w = d.textlength(texto, font=f) + 44
    h = f.size + 30
    x, y = xy
    if sel:
        gr = g.gradiente(int(w), h, diag=False).convert("RGBA")
        m = Image.new("L", (int(w), h), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, int(w) - 1, h - 1), h // 2, fill=255)
        camada.paste(gr, (int(x), int(y)), m)
    else:
        d.rounded_rectangle((x, y, x + w, y + h), h // 2, fill=(22, 30, 33, 255),
                            outline=(WA + (255,)) if wa else (255, 255, 255, 60), width=2)
    d.text((x + 22, y + 12), texto, font=f, fill=(255, 255, 255) if sel else TXT)
    return w


def cartao_chat(w, h):
    """Painel do assistente desenhado (cabeçalho igual ao do site)."""
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 34, fill=(11, 16, 18, 250), outline=(255, 255, 255, 40), width=2)
    d.rounded_rectangle((2, 2, w - 3, 110), 32, fill=(21, 30, 34, 255))
    d.rectangle((2, 80, w - 3, 110), fill=(21, 30, 34, 255))
    d.line([(0, 110), (w, 110)], fill=(255, 255, 255, 30), width=2)
    logo = Image.open("public/img/logo.png").convert("RGBA").resize((62, 62), Image.LANCZOS)
    m = Image.new("L", (62, 62), 0); ImageDraw.Draw(m).ellipse((0, 0, 61, 61), fill=255)
    c.paste(logo, (28, 24), m)
    d.text((108, 24), "Assistente Blum", font=g.fonte("archivo", 30, 800, 100), fill=TXT)
    d.text((108, 62), "Responde na hora · equipe no WhatsApp", font=g.fonte("manrope", 21, 500), fill=DIM)
    return c


def proximos_dias(n=3):
    # Só o dia da semana (sem data) para o post não "envelhecer" se for publicado depois.
    return ["Quarta", "Quinta", "Sexta"][:n]


# ---------- slides ----------
def s1():
    b = base(1)
    d = ImageDraw.Draw(b)
    g.chip(b, (70, 190), "NOVO SITE", g.fonte("archivo", 26, 800, 110), cheio=True)
    titulo(b, (70, 280), ["Nosso novo site", "está no ar."], 100)
    paragrafo(b, (72, 520), ["Mais fácil pedir orçamento, agendar", "visita e ver nossas obras."])
    home = g.celular(Image.open(os.path.join(g.ASSETS, "tela-home.jpg")).convert("RGB"), 360)
    chat = g.celular(Image.open(os.path.join(g.ASSETS, "tela-chat.jpg")).convert("RGB"), 390)
    g.colar(b, home, (120, 690), rot=4)
    g.colar(b, chat, (540, 660), rot=-3)
    faixa = Image.new("RGBA", (W, 150), (8, 12, 14, 255))
    b.alpha_composite(faixa, (0, H - 150))
    d = ImageDraw.Draw(b)
    f = g.fonte("archivo", 36, 800, 100)
    t = "Deslize e conheça as novidades"
    g.texto_grad(b, (70, H - 122), t, f)
    seta(d, 70 + d.textlength(t, font=f) + 26, H - 98)
    # a barra de progresso fica por cima da faixa
    b2 = base(1)
    b.paste(b2.crop((0, H - 52, W, H - 38)), (0, H - 52))
    return b


def s2():
    b = base(2)
    eyebrow(b, (70, 200), "01 · ASSISTENTE DE ORÇAMENTO")
    y = titulo(b, (70, 262), ["Orçamento na hora,", "a qualquer horário."], 78)
    y = lista(b, (70, y + 34), ["Responde dúvidas em segundos", "Faz o pré-orçamento do serviço", "Manda tudo pronto pro WhatsApp"], 32)
    chat = g.celular(Image.open(os.path.join(g.ASSETS, "tela-chat.jpg")).convert("RGB"), 470)
    # celular cortado logo acima da barra de progresso
    topo = y + 20
    chat = chat.crop((0, 0, chat.width, min(chat.height, H - 80 - topo)))
    g.colar(b, chat, ((W - 470) // 2, topo), rot=0)
    return b


def s3():
    b = base(3)
    eyebrow(b, (70, 200), "02 · VISITA TÉCNICA")
    y = titulo(b, (70, 262), ["Agende sua visita", "em 1 minuto."], 82)
    paragrafo(b, (72, y + 10), ["Escolha o dia e o período. A equipe", "confirma o horário pelo WhatsApp."], 32)
    cw, ch = 900, 690
    c = cartao_chat(cw, ch)
    fb, fo = g.fonte("manrope", 25, 500), g.fonte("manrope", 23, 700)
    dias = proximos_dias(3)
    yy = bolha(c, (28, 136), "Qual o melhor dia para você?", fb) + 12
    x = 28
    for i, dia in enumerate(dias):
        x += opcao(c, (x, yy), dia, fo, sel=(i == 1)) + 12
    yy += 68
    yy = bolha(c, (cw - 28, yy), dias[1], fb, eu=True) + 12
    yy = bolha(c, (28, yy), "Manhã ou tarde?", fb) + 12
    x = 28
    for i, p in enumerate(["Manhã", "Tarde"]):
        x += opcao(c, (x, yy), p, fo, sel=(i == 0)) + 12
    yy += 68
    yy = bolha(c, (28, yy), "Anotado! A equipe confirma o horário com você pelo WhatsApp.", fb, maxw=640) + 12
    opcao(c, (28, yy), "Abrir WhatsApp agora", fo, wa=True)
    g.colar(b, c, ((W - cw) // 2, 575))
    return b


def s4():
    b = base(4)
    eyebrow(b, (70, 200), "03 · BOOK DE OBRAS")
    y = titulo(b, (70, 262), ["Veja nossas obras", "por serviço."], 82)
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fo = g.fonte("manrope", 25, 700)
    x = 70
    for i, (t, n) in enumerate([("Todos", 34), ("Iluminação", 18), ("Câmeras", 7), ("Elétrica", 5)]):
        x += opcao(camada, (x, y + 30), f"{t}  {n}", fo, sel=(i == 0)) + 12
    b.alpha_composite(camada)
    fotos = [("igreja-depois", "ILUMINAÇÃO", "Igreja com spots e LED"),
             ("camera-ptz-wifi", "CÂMERAS", "Câmera PTZ Wi-Fi"),
             ("motor-portao", "CONTROLE DE ACESSO", "Automação de portão")]
    cw, chh = 300, 420
    for i, (f, tag, leg) in enumerate(fotos):
        foto = g.cover_img(f"public/img/obras/{f}.webp", cw, chh) if hasattr(g, "cover_img") else None
        im = Image.open(f"public/img/obras/{f}.webp").convert("RGB")
        r = max(cw / im.width, chh / im.height)
        im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
        im = im.crop(((im.width - cw) // 2, (im.height - chh) // 2, (im.width - cw) // 2 + cw, (im.height - chh) // 2 + chh))
        card = Image.new("RGBA", (cw, chh), (0, 0, 0, 0))
        m = Image.new("L", (cw, chh), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, cw - 1, chh - 1), 28, fill=255)
        card.paste(im, (0, 0), m)
        gr = Image.new("RGBA", (cw, chh), (0, 0, 0, 0)); gd = ImageDraw.Draw(gr)
        for yy in range(chh // 2, chh):
            a = int(225 * (yy - chh // 2) / (chh // 2))
            gd.line([(0, yy), (cw, yy)], fill=(4, 9, 11, a))
        card = Image.composite(Image.alpha_composite(card, gr), card, m)
        cd = ImageDraw.Draw(card)
        ft = g.fonte("archivo", 17, 800, 110)
        tw = cd.textlength(tag, font=ft) + 28
        cd.rounded_rectangle((18, chh - 104, 18 + tw, chh - 72), 16, fill=(255, 255, 255, 50))
        cd.text((32, chh - 100), tag, font=ft, fill=(255, 255, 255))
        cd.text((18, chh - 58), leg, font=g.fonte("manrope", 22, 700), fill=(255, 255, 255))
        x = 70 + i * (cw + 15)
        g.colar(b, card, (x, y + 130))
    d = ImageDraw.Draw(b)
    d.text((72, y + 130 + chh + 40), "34 fotos de obras reais · passa sozinho para o lado", font=g.fonte("manrope", 28, 600), fill=DIM)
    return b


def s5():
    b = base(5)
    eyebrow(b, (70, 200), "04 · 3 IDIOMAS")
    y = titulo(b, (70, 262), ["Português,", "English, Español."], 82)
    paragrafo(b, (72, y + 10), ["Site e assistente nos três idiomas —", "perfeito pra quem tem casa aqui e mora fora."], 32)
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fb = g.fonte("manrope", 34, 600)
    fl = g.fonte("archivo", 24, 800, 110)
    msgs = [("PT", "Olá! Quero um orçamento de câmeras.", False), ("EN", "Hi! I'd like a quote for my beach house.", True), ("ES", "¡Hola! Quiero un presupuesto.", False)]
    yy = y + 170
    for lang, txt, eu in msgs:
        d = ImageDraw.Draw(camada)
        if eu:
            fim = bolha(camada, (W - 70, yy), txt, fb, eu=True, maxw=760)
            d.rounded_rectangle((W - 70 - 80, fim + 10, W - 70, fim + 50), 20, fill=(255, 255, 255, 30))
            d.text((W - 70 - 60, fim + 15), lang, font=fl, fill=(95, 224, 191))
        else:
            fim = bolha(camada, (70, yy), txt, fb, maxw=760)
            d.rounded_rectangle((70, fim + 10, 150, fim + 50), 20, fill=(255, 255, 255, 30))
            d.text((90, fim + 15), lang, font=fl, fill=(95, 224, 191))
        yy = fim + 90
    b.alpha_composite(camada)
    return b


def s6():
    b = base(6)
    d = ImageDraw.Draw(b)
    logo = Image.open("brand/logo-colorido-transparente.png").convert("RGBA")
    logo.thumbnail((300, 400), Image.LANCZOS)
    g.colar(b, logo, ((W - logo.width) // 2, 180))
    f = g.fonte("archivo", 84, 850, 92)
    y = 180 + logo.height + 70
    for i, l in enumerate(["Conheça o", "novo site."]):
        w = d.textlength(l, font=f)
        (g.texto_grad(b, ((W - w) / 2, y), l, f) if i == 1 else d.text(((W - w) / 2, y), l, font=f, fill=TXT))
        y += 92
    fp = g.fonte("manrope", 32, 500)
    t = "Orçamento rápido · Visita técnica · Obras"
    d.text(((W - d.textlength(t, font=fp)) / 2, y + 30), t, font=fp, fill=DIM)
    # botão link na bio
    fbt = g.fonte("archivo", 38, 800, 100)
    t = "Acesse pelo link na bio"
    bw = d.textlength(t, font=fbt) + 150
    bx, by = (W - bw) / 2, y + 120
    gr = g.gradiente(int(bw), 96, diag=False).convert("RGBA")
    m = Image.new("L", (int(bw), 96), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, int(bw) - 1, 95), 48, fill=255)
    b.paste(gr, (int(bx), int(by)), m)
    d = ImageDraw.Draw(b)
    d.text((bx + 50, by + 22), t, font=fbt, fill=(255, 255, 255))
    seta(d, bx + bw - 72, by + 48, 30, (255, 255, 255), 5)
    # whatsapp
    fw = g.fonte("manrope", 32, 700)
    t = "WhatsApp (48) 99663-1148"
    tw = d.textlength(t, font=fw)
    d.text(((W - tw) / 2, by + 140), t, font=fw, fill=(120, 230, 160))
    t2 = "Garopaba e região"
    d.text(((W - d.textlength(t2, font=fp)) / 2, by + 196), t2, font=fp, fill=DIM)
    return b


if __name__ == "__main__":
    for i, fn in enumerate([s1, s2, s3, s4, s5, s6], 1):
        fn().convert("RGB").save(f"{OUT}/carrossel-{i:02d}.jpg", quality=93)
    print("ok")

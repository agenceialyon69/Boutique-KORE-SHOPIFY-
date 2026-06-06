from PIL import Image, ImageDraw, ImageFont

FONT = "/tmp/Montserrat.ttf"
BLACK = (20, 18, 16, 255)
CREAM = (242, 235, 221, 255)
SS = 2  # supersampling

def font_at(size, variation="SemiBold"):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_name(variation)
    except Exception: pass
    return f

def tracked_width(draw, text, font, tracking):
    w = sum(draw.textlength(ch, font=font) for ch in text)
    return w + tracking * (len(text) - 1)

def draw_tracked(draw, text, font, tracking, cx, top, fill):
    total = tracked_width(draw, text, font, tracking)
    x = cx - total / 2
    for ch in text:
        draw.text((x, top), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking

def compose(path, size_w, size_h, bg, fg, word="KORE", tag="ACTIVEWEAR",
            word_ratio=0.30, tag_ratio=0.052, transparent=False):
    W, H = size_w * SS, size_h * SS
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0) if transparent else bg)
    d = ImageDraw.Draw(img)
    cx = W / 2

    wf = font_at(int(H * word_ratio), "SemiBold")
    wtrack = int(H * word_ratio * 0.16)
    wb = wf.getbbox(word)
    wh = wb[3] - wb[1]

    tf = font_at(int(H * tag_ratio), "Medium")
    ttrack = int(H * tag_ratio * 0.55)
    tb = tf.getbbox(tag)
    th = tb[3] - tb[1]

    gap = int(H * 0.045)
    block_h = wh + gap + th
    top = (H - block_h) / 2

    draw_tracked(d, word, wf, wtrack, cx, top - wb[1], fill=fg)
    draw_tracked(d, tag, tf, ttrack, cx, top + wh + gap - tb[1], fill=fg)

    img = img.resize((size_w, size_h), Image.LANCZOS)
    img.save(path)
    print("saved", path, img.size)

# 1) Avatar TikTok — fond noir, lettres crème (le principal)
compose("brand/kore-avatar-noir.png", 1024, 1024, BLACK, CREAM)
# 2) Avatar — fond crème, lettres noires (alternative claire)
compose("brand/kore-avatar-creme.png", 1024, 1024, CREAM, BLACK)
# 3) Wordmark transparent noir (pour fonds clairs / site)
compose("brand/kore-wordmark-noir.png", 2400, 900, BLACK, BLACK,
        word_ratio=0.34, tag_ratio=0.058, transparent=True)
# 4) Wordmark transparent crème (pour fonds sombres)
compose("brand/kore-wordmark-creme.png", 2400, 900, CREAM, CREAM,
        word_ratio=0.34, tag_ratio=0.058, transparent=True)

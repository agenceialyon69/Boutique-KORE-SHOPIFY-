import math
from PIL import Image, ImageDraw, ImageFont

FONT="/tmp/Montserrat.ttf"
BLACK=(20,18,16,255); CREAM=(242,235,221,255); SS=2

def font_at(size,var="SemiBold"):
    f=ImageFont.truetype(FONT,int(size))
    try: f.set_variation_by_name(var)
    except: pass
    return f

def tracked_width(d,t,f,tr): return sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1)

def draw_tracked(d,t,f,tr,cx,top,fill):
    x=cx-tracked_width(d,t,f,tr)/2
    for c in t:
        d.text((x,top),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr

def fit_in_circle(path,size,bg,fg,word,var="SemiBold",margin=0.84,track_k=0.16):
    W=size*SS; img=Image.new("RGBA",(W,W),bg); d=ImageDraw.Draw(img)
    R=0.5*W*margin
    base=200; f0=font_at(base,var); tr0=base*track_k
    tw0=tracked_width(d,word,f0,tr0); b0=f0.getbbox(word); th0=b0[3]-b0[1]
    diag0=math.hypot(tw0/2,th0/2)
    scale=R/diag0; fs=base*scale; tr=fs*track_k
    f=font_at(fs,var); b=f.getbbox(word)
    tw=tracked_width(d,word,f,tr); th=b[3]-b[1]
    cx=W/2; top=(W-th)/2 - b[1]
    draw_tracked(d,word,f,tr,cx,top,fill=fg)
    img=img.resize((size,size),Image.LANCZOS); img.save(path); print("saved",path)

# Photo de profil TikTok (cercle) — monogramme K, fond noir
fit_in_circle("brand/kore-tiktok-K.png",1024,BLACK,CREAM,"K",margin=0.62,track_k=0)
# Photo de profil TikTok (cercle) — KORE entier qui rentre dans le cercle
fit_in_circle("brand/kore-tiktok-KORE.png",1024,BLACK,CREAM,"KORE",margin=0.86,track_k=0.12)
# Variante crème
fit_in_circle("brand/kore-tiktok-KORE-creme.png",1024,CREAM,BLACK,"KORE",margin=0.86,track_k=0.12)

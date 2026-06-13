from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
U="/root/.claude/uploads/080664da-8ab0-5541-bc7c-dfa1dd343287"
FONT="brand/Montserrat.ttf"
CREAM=(242,235,221); BLACK=(18,16,14); ACCENT=(190,172,146)
W,H=1080,1920
os.makedirs("/tmp/sc",exist_ok=True)
def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try: f.set_variation_by_name(v)
    except: pass
    return f
def center(d,t,f,tr,cx,y,fill):
    w=sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1); x=cx-w/2
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr

def gradient(size,top_alpha,bottom_alpha,height,at_top=True):
    g=Image.new("L",(1,height))
    for i in range(height):
        a=top_alpha+(bottom_alpha-top_alpha)*i/height
        g.putpixel((0,i),int(a))
    g=g.resize((W,height))
    return g

def photo_frame(idx,src,label,sub=""):
    im=Image.open(f"{U}/{src}").convert("RGB"); iw,ih=im.size
    # cover sur la hauteur
    scale=H/ih; nw=int(iw*scale)
    im=im.resize((nw,H))
    # fenetre 1080 decalee a droite (enleve la loupe a gauche)
    left=min(int(nw*0.26), nw-W)
    if left<0: left=0
    im=im.crop((left,0,left+W,H))
    base=im.convert("RGB")
    # gradients haut + bas pour lisibilite
    dark=Image.new("RGB",(W,H),(10,9,8))
    gt=gradient(None,180,0,520,True)
    base=Image.composite(dark,base,Image.merge("L",[gt]).resize((W,H)) if False else gt.resize((W,H)).crop((0,0,W,H)) if False else _paste_top(gt))
    return base

def _paste_top(gt): pass

# version simple et fiable : on assombrit haut (0-520) et bas (1500-1920) via alpha
def make_photo(idx,src,label,sub=""):
    im=Image.open(f"{U}/{src}").convert("RGB"); iw,ih=im.size
    scale=H/ih; nw=int(iw*scale); im=im.resize((nw,H))
    left=max(0,min(int(nw*0.26), nw-W)); im=im.crop((left,0,left+W,H)).convert("RGB")
    ov=Image.new("L",(W,H),0); od=ImageDraw.Draw(ov)
    for y in range(0,420): od.line([(0,y),(W,y)],fill=int(170*(1-y/420)))
    for y in range(1420,H): od.line([(0,y),(W,y)],fill=int(190*((y-1420)/(H-1420))))
    dark=Image.new("RGB",(W,H),(8,7,6))
    im=Image.composite(dark,im,ov)
    d=ImageDraw.Draw(im)
    center(d,"KORE",F(54,"SemiBold"),16,W/2,90,CREAM)
    d.line([(W/2-70,170),(W/2+70,170)],fill=ACCENT,width=4)
    center(d,label,F(72,"SemiBold"),0,W/2,H-300,CREAM)
    if sub: center(d,sub,F(44,"Regular"),2,W/2,H-205,CREAM)
    center(d,"korewear.fr",F(38,"Medium"),5,W/2,H-120,CREAM)
    im.save(f"/tmp/sc/{idx}.jpg",quality=90)

def make_text(idx,bg,fg,big,sub=None):
    im=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(im)
    center(d,"KORE",F(60,"SemiBold"),18,W/2,150,fg); d.line([(W/2-80,235),(W/2+80,235)],fill=ACCENT,width=4)
    lines=big.split("|")
    y=H/2-len(lines)*80
    for ln in lines: center(d,ln,F(110,"SemiBold"),0,W/2,y,fg); y+=130
    if sub: center(d,sub,F(46,"Regular"),3,W/2,y+30,fg)
    im.save(f"/tmp/sc/{idx}.jpg",quality=92)

make_text(0,BLACK,CREAM,"L'activewear|pensé pour|les femmes")
make_photo(1,"fa97551d-IMG_2253.jpeg","Ensemble seamless","brassière + legging assortis")
make_photo(2,"5c30c70c-IMG_2259.jpeg","Legging côtelé","taille haute, effet gainant")
make_photo(3,"702bfc06-IMG_2261.jpeg","Legging tie-dye","seamless, taille haute")
make_photo(4,"74f0b68d-IMG_2257.jpeg","Short taille haute","gainant & respirant")
make_photo(5,"ee55d714-IMG_2251.jpeg","Brassière de sport","maintien & confort")
make_text(6,BLACK,CREAM,"Découvre la|collection","korewear.fr  ·  livraison offerte en France")
print("frames:",sorted(os.listdir("/tmp/sc")))

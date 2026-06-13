from PIL import Image, ImageDraw, ImageFont
import os
FONT="brand/Montserrat.ttf"
BLACK=(20,18,16); CREAM=(242,235,221); ACCENT=(185,168,143); GREY=(150,140,125)
W,H=1080,1920
os.makedirs("/tmp/vid",exist_ok=True)

def F(d,s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try: f.set_variation_by_name(v)
    except: pass
    return f
def tw(d,t,f,tr): return sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1)
def tracked(d,t,f,tr,cx,y,fill):
    x=cx-tw(d,t,f,tr)/2
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def wrap(d,t,f,maxw):
    out=[]; cur=""
    for w in t.split():
        test=(cur+" "+w).strip()
        if d.textlength(test,font=f)<=maxw: cur=test
        else: out.append(cur); cur=w
    if cur: out.append(cur)
    return out

def slide(idx,bg,fg,big=None,sub=None,wordmark=True,bottom=None,bigsize=150):
    img=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(img)
    if wordmark:
        tracked(d,"KORE",F(d,60,"SemiBold"),22,W/2,150,fg)
        d.line([(W/2-80,235),(W/2+80,235)],fill=ACCENT,width=4)
    # bloc central
    lines=[]
    if big:
        bf=F(d,bigsize,"SemiBold")
        for ln in wrap(d,big,bf,W-160): lines.append((ln,bf,bigsize))
    if sub:
        sf=F(d,58,"Regular")
        for ln in wrap(d,sub,sf,W-180): lines.append((ln,sf,58))
    total=sum(s*1.18 for _,_,s in lines)
    y=(H-total)/2
    for ln,f,s in lines:
        b=f.getbbox(ln); tracked(d,ln,f,0,W/2,y,fg); y+=s*1.18
    if bottom:
        tracked(d,bottom,F(d,46,"Medium"),4,W/2,H-220,fg)
    img.save(f"/tmp/vid/s{idx}.png")

slide(1,BLACK,CREAM,big="JOUR 1",sub="On vient de lancer notre marque de legging.",bigsize=240)
slide(2,CREAM,BLACK,big="Activewear pensé pour les femmes.",bigsize=120)
slide(3,CREAM,BLACK,big="Aujourd'hui : 0 vente. 0 abonné.",bigsize=120)
slide(4,CREAM,BLACK,big="On documente tout, du début.",bigsize=120)
slide(5,CREAM,BLACK,big="1er produit bientôt — on le teste en direct.",sub="Opacité, matière, sans filtre.",bigsize=110)
slide(6,BLACK,CREAM,big="Abonne-toi pour suivre l'aventure.",bottom="korewear.fr",bigsize=110)
print("slides OK", sorted(os.listdir("/tmp/vid")))

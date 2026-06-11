from PIL import Image, ImageDraw, ImageFont
FONT="brand/Montserrat.ttf"
BLACK=(20,18,16); CREAM=(242,235,221); GREY=(120,110,95); ACCENT=(185,168,143)
SS=2; W,H=1000*SS,1500*SS

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
    words=t.split(); lines=[]; cur=""
    for w in words:
        test=(cur+" "+w).strip()
        if d.textlength(test,font=f)<=maxw: cur=test
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def header(d,surtitle):
    tracked(d,"KORE",F(d,54*SS,"SemiBold"),18*SS,W/2,90*SS,BLACK)
    d.line([(W/2-70*SS,180*SS),(W/2+70*SS,180*SS)],fill=ACCENT,width=4)
    tracked(d,surtitle,F(d,26*SS,"Medium"),8*SS,W/2,210*SS,GREY)
def footer(d):
    tracked(d,"korewear.fr",F(d,34*SS,"Medium"),6*SS,W/2,H-150*SS,BLACK)

# ---- ÉPINGLE 2 : Ensemble seamless ----
img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
header(d,"ACTIVEWEAR · NOUVEAUTÉ")
tf=F(d,76*SS,"SemiBold")
y=410*SS
for ln in wrap(d,"Ensemble de sport seamless taille haute",tf,W-160*SS):
    tracked(d,ln,tf,0,W/2,y,BLACK); y+=90*SS
by=y+60*SS
d.rounded_rectangle([90*SS,by,W-90*SS,by+470*SS],radius=24*SS,fill=BLACK)
bf=F(d,40*SS,"Medium")
items=["Crop top + legging assortis","Taille haute gainante","Maille sans coutures","Yoga · pilates · quotidien"]
yy=by+60*SS
for it in items:
    tracked(d,"·  "+it,bf,0,W/2,yy,CREAM); yy+=95*SS
footer(d)
img.resize((1000,1500),Image.LANCZOS).save("brand/KORE-pin-ensemble.png"); print("pin2 OK")

# ---- ÉPINGLE 3 : 3 erreurs ----
img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
header(d,"ACTIVEWEAR · CONSEIL")
tf=F(d,76*SS,"SemiBold")
y=400*SS
for ln in wrap(d,"3 erreurs quand tu achètes un legging",tf,W-160*SS):
    tracked(d,ln,tf,0,W/2,y,BLACK); y+=90*SS
rows=["Prendre ta taille habituelle","Choisir le noir (cache la transparence)","Ne pas tester l'étirement"]
yy=y+70*SS; nf=F(d,46*SS,"SemiBold"); rf=F(d,40*SS,"Regular")
for i,r in enumerate(rows,1):
    cy=yy+i*0  # placeholder
    rowy=yy+(i-1)*150*SS
    # badge cercle
    cx=130*SS
    d.ellipse([cx-40*SS,rowy-6*SS,cx+40*SS,rowy+74*SS],fill=BLACK)
    nb=str(i); nbw=d.textlength(nb,font=nf)
    d.text((cx-nbw/2,rowy+8*SS),nb,font=nf,fill=ACCENT)
    # texte (wrap si besoin)
    tx=cx+70*SS
    lines=wrap(d,r,rf,W-tx-90*SS)
    ly=rowy + (10*SS if len(lines)==1 else -12*SS)
    for ln in lines:
        d.text((tx,ly),ln,font=rf,fill=BLACK); ly+=50*SS
footer(d)
img.resize((1000,1500),Image.LANCZOS).save("brand/KORE-pin-erreurs.png"); print("pin3 OK")

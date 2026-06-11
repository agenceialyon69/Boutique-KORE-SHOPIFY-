from PIL import Image, ImageDraw, ImageFont
FONT="brand/Montserrat.ttf"
BLACK=(20,18,16); CREAM=(242,235,221); GREY=(120,110,95); ACCENT=(185,168,143)
SS=2; W,H=1000*SS,1500*SS
img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try: f.set_variation_by_name(v)
    except: pass
    return f
def tw(t,f,tr): return sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1)
def tracked(t,f,tr,cx,y,fill):
    x=cx-tw(t,f,tr)/2
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def wrap(t,f,maxw):
    words=t.split(); lines=[]; cur=""
    for w in words:
        test=(cur+" "+w).strip()
        if d.textlength(test,font=f)<=maxw: cur=test
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
lf=F(54*SS,"SemiBold"); tracked("KORE",lf,18*SS,W/2,90*SS,BLACK)
d.line([(W/2-70*SS,180*SS),(W/2+70*SS,180*SS)],fill=ACCENT,width=4)
sf=F(26*SS,"Medium"); tracked("ACTIVEWEAR · CONSEIL",sf,8*SS,W/2,210*SS,GREY)
tf=F(78*SS,"SemiBold"); lines=wrap("Le test à faire avant d'acheter un legging",tf,W-160*SS)
y=440*SS
for ln in lines: tracked(ln,tf,0,W/2,y,BLACK); y+=92*SS
by=y+70*SS
d.rounded_rectangle([90*SS,by,W-90*SS,by+360*SS],radius=24*SS,fill=BLACK)
qf=F(40*SS,"SemiBold"); tracked("LE TEST EN 5 SECONDES",qf,4*SS,W/2,by+50*SS,ACCENT)
bf=F(38*SS,"Regular")
for i,ln in enumerate(["Étire le tissu devant la","lumière. Si tu vois à travers","→ il sera transparent porté."]):
    tracked(ln,bf,0,W/2,by+140*SS+i*58*SS,CREAM)
uf=F(34*SS,"Medium"); tracked("korewear.fr",uf,6*SS,W/2,H-150*SS,BLACK)
img.resize((1000,1500),Image.LANCZOS).save("brand/KORE-pin-test.png")
print("pin OK")

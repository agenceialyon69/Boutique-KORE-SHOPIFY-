from PIL import Image, ImageDraw, ImageFont
import os, imageio_ffmpeg, subprocess
U="/root/.claude/uploads/080664da-8ab0-5541-bc7c-dfa1dd343287"
FONT="brand/Montserrat.ttf"; CREAM=(242,235,221); BLACK=(15,14,12); ACCENT=(196,178,150)
W,H=1080,1920; os.makedirs("/tmp/adv",exist_ok=True)

def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try:f.set_variation_by_name(v)
    except:pass
    return f

def ctr(d,t,f,tr,cx,y,fill,stroke=None,sw=0):
    w=sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1);x=cx-w/2
    for c in t:
        if stroke: d.text((x,y),c,font=f,fill=fill,stroke_width=sw,stroke_fill=stroke)
        else: d.text((x,y),c,font=f,fill=fill)
        x+=d.textlength(c,font=f)+tr

def rounded(im,rad):
    m=Image.new("L",im.size,0);ImageDraw.Draw(m).rounded_rectangle([0,0,*im.size],radius=rad,fill=255)
    o=Image.new("RGBA",im.size,(0,0,0,0));o.paste(im,(0,0),m);return o

def frame(out,photo,top=None,bottom=None,cw=980,cy=330,badge=None,crop_top=0):
    cv=Image.new("RGB",(W,H),BLACK);d=ImageDraw.Draw(cv)
    im=Image.open(f"{U}/{photo}").convert("RGB");iw,ih=im.size
    if crop_top:
        im=im.crop((0,int(ih*crop_top),iw,ih));iw,ih=im.size
    ch=int(cw*ih/iw);im=im.resize((cw,ch));cx=(W-cw)//2
    cv.paste(rounded(im,28),(cx,cy),rounded(im,28))
    # logo tab couvre la loupe CJ
    bw,bh=int(cw*0.30),150
    ImageDraw.Draw(cv).rounded_rectangle([cx,cy,cx+bw,cy+bh],radius=18,fill=BLACK)
    ctr(d,"KORE",F(42,"SemiBold"),11,cx+bw/2,cy+52,CREAM)
    if badge:
        pw=len(badge)*26+70
        ImageDraw.Draw(cv).rounded_rectangle([W-pw-110,cy+20,W-110,cy+90],radius=35,fill=ACCENT)
        ctr(d,badge,F(32,"SemiBold"),0,W-110-pw/2,cy+35,BLACK)
    if top:
        y=140
        for t,s,v in top: ctr(d,t,F(s,v),0,W/2,y,CREAM);y+=int(s*1.18)
    if bottom:
        y=cy+ch+45
        for t,s,v in bottom: ctr(d,t,F(s,v),0,W/2,y,CREAM);y+=int(s*1.3)
    cv.save(out,quality=92)

# 1) HOOK — question qui arrête le scroll
frame("/tmp/adv/1.jpg","d176e723-IMG_2500.jpeg",cy=420,
      top=[("Arrête de scroller",56,"SemiBold"),("si tu détestes changer",56,"SemiBold"),("3 fois de tenue",56,"SemiBold")])

# 2) Le produit qui règle le problème
frame("/tmp/adv/2.jpg","6f297fa7-IMG_2501.jpeg",cy=420,
      top=[("Un seul ensemble.",62,"SemiBold"),("Zéro réflexion.",62,"SemiBold")])

# 3-6) rafale coloris avec badge dynamique
frame("/tmp/adv/3.jpg","d176e723-IMG_2500.jpeg",badge="Vert kaki",
      bottom=[("6 coloris disponibles",54,"SemiBold")])
frame("/tmp/adv/4.jpg","d654e1c1-IMG_2502.jpeg",badge="Gris & Bordeaux",
      bottom=[("Taille haute gainante",54,"SemiBold")])
frame("/tmp/adv/5.jpg","4d2fecb8-IMG_2505.jpeg",badge="Lavande",
      bottom=[("Seamless, sans coutures",54,"SemiBold")])
frame("/tmp/adv/6.jpg","ef60cef2-IMG_2501.jpeg",badge="Rose & Corail",
      bottom=[("Assorti du haut au bas",54,"SemiBold")])

# 7) bénéfice fort
frame("/tmp/adv/7.jpg","6f297fa7-IMG_2501.jpeg",
      top=[("Effet gainant",64,"SemiBold"),("qui tient toute la journée",50,"SemiBold")])

# 8) CTA final
cv=Image.new("RGB",(W,H),BLACK);d=ImageDraw.Draw(cv)
im=Image.open(f"{U}/d176e723-IMG_2500.jpeg").convert("RGB");iw,ih=im.size
cw=840;ch=int(cw*ih/iw);cx=(W-cw)//2;cy=230
cv.paste(rounded(im.resize((cw,ch)),24),(cx,cy),rounded(im.resize((cw,ch)),24))
bw,bh=int(cw*0.30),132;ImageDraw.Draw(cv).rounded_rectangle([cx,cy,cx+bw,cy+bh],radius=16,fill=BLACK);ctr(d,"KORE",F(38,"SemiBold"),10,cx+bw/2,cy+46,CREAM)
yb=cy+ch+60
ctr(d,"KORE",F(74,"SemiBold"),18,W/2,yb,CREAM)
ctr(d,"Ensemble 3 pièces — 49,90 €",F(52,"SemiBold"),0,W/2,yb+105,CREAM)
ctr(d,"Livraison offerte en France",F(40,"Regular"),0,W/2,yb+190,CREAM)
pw=560;px=(W-pw)//2;py=yb+265
ImageDraw.Draw(cv).rounded_rectangle([px,py,px+pw,py+94],radius=47,fill=ACCENT)
ctr(d,"Code BIENVENUE10",F(44,"SemiBold"),1,W/2,py+24,BLACK)
ctr(d,"korewear.fr",F(40,"SemiBold"),2,W/2,py+150,CREAM)
cv.save("/tmp/adv/9.jpg",quality=92)

# --- assemblage avec zoom punch (snap-zoom) sur chaque plan ---
exe=imageio_ffmpeg.get_ffmpeg_exe();clips=[]
# (fichier, durée_s, zoom_depart, zoom_fin) — punch-in rapide type pub virale
plan=[
    ("1.jpg",1.6,1.00,1.10),
    ("2.jpg",1.5,1.00,1.09),
    ("3.jpg",1.0,1.00,1.07),
    ("4.jpg",1.0,1.00,1.07),
    ("5.jpg",1.0,1.00,1.07),
    ("6.jpg",1.0,1.00,1.07),
    ("7.jpg",1.7,1.00,1.10),
    ("9.jpg",3.6,1.00,1.05),
]
for i,(fn,T,z0,z1) in enumerate(plan):
    out=f"/tmp/adv/c{i}.mp4";NF=int(T*30)
    vf=(f"scale=1600:2844,zoompan=z='{z0}+({z1}-{z0})*on/{NF}':d={NF}:s=1080x1920:fps=30,"
        f"format=yuv420p")
    subprocess.run([exe,"-y","-loop","1","-i",f"/tmp/adv/{fn}","-vf",vf,
                     "-frames:v",str(NF),"-c:v","libx264","-pix_fmt","yuv420p","-r","30",out],
                    capture_output=True)
    clips.append(out)
open("/tmp/adv/l.txt","w").write("".join(f"file '{c}'\n" for c in clips))
subprocess.run([exe,"-y","-f","concat","-safe","0","-i","/tmp/adv/l.txt",
                 "-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart",
                 "brand/KORE-pub-virale.mp4"],capture_output=True)
p=subprocess.run([exe,"-i","brand/KORE-pub-virale.mp4"],capture_output=True,text=True)
import re;m=re.search(r"Duration: (\S+)",p.stderr);print("durée",m.group(1) if m else "?")

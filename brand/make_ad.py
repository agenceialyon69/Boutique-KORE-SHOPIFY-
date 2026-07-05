from PIL import Image, ImageDraw, ImageFont
import os, imageio_ffmpeg, subprocess
U="/root/.claude/uploads/080664da-8ab0-5541-bc7c-dfa1dd343287"
FONT="brand/Montserrat.ttf"; CREAM=(242,235,221); BLACK=(15,14,12); ACCENT=(196,178,150)
W,H=1080,1920; os.makedirs("/tmp/ad",exist_ok=True)
def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try:f.set_variation_by_name(v)
    except:pass
    return f
def ctr(d,t,f,tr,cx,y,fill):
    w=sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1);x=cx-w/2
    for c in t:d.text((x,y),c,font=f,fill=fill);x+=d.textlength(c,font=f)+tr
def rounded(im,rad):
    m=Image.new("L",im.size,0);ImageDraw.Draw(m).rounded_rectangle([0,0,*im.size],radius=rad,fill=255)
    o=Image.new("RGBA",im.size,(0,0,0,0));o.paste(im,(0,0),m);return o
def frame(out,photo,top=None,bottom=None,cw=930,cy=370):
    cv=Image.new("RGB",(W,H),BLACK);d=ImageDraw.Draw(cv)
    im=Image.open(f"{U}/{photo}").convert("RGB");iw,ih=im.size
    ch=int(cw*ih/iw);im=im.resize((cw,ch));cx=(W-cw)//2
    cv.paste(rounded(im,26),(cx,cy),rounded(im,26))
    # logo couvre la loupe
    bw,bh=int(cw*0.30),150
    ImageDraw.Draw(cv).rounded_rectangle([cx,cy,cx+bw,cy+bh],radius=18,fill=BLACK)
    ctr(d,"KORE",F(42,"SemiBold"),11,cx+bw/2,cy+52,CREAM)
    if top:
        y=150
        for t,s,v in top: ctr(d,t,F(s,v),0,W/2,y,CREAM);y+=s*1.15
    if bottom:
        y=cy+ch+40
        for t,s,v in bottom: ctr(d,t,F(s,v),1,W/2,y,CREAM);y+=s*1.28
    cv.save(out,quality=90)

# --- frames selon le script ---
frame("/tmp/ad/1.jpg","d176e723-IMG_2500.jpeg",
      top=[("Une tenue complète,",64,"SemiBold"),("sans réfléchir",64,"SemiBold")])
frame("/tmp/ad/2.jpg","6f297fa7-IMG_2501.jpeg",
      bottom=[("Brassière + legging + veste",56,"SemiBold")])
frame("/tmp/ad/3.jpg","4d2fecb8-IMG_2505.jpeg",
      top=[("Confort sport & quotidien",58,"SemiBold")])
# montage couleurs
for i,(ph) in enumerate(["d176e723-IMG_2500.jpeg","d654e1c1-IMG_2502.jpeg","6f297fa7-IMG_2501.jpeg","4d2fecb8-IMG_2505.jpeg"],start=4):
    frame(f"/tmp/ad/{i}.jpg",ph,top=[("6 coloris disponibles",56,"SemiBold")])
# CTA final
cv=Image.new("RGB",(W,H),BLACK);d=ImageDraw.Draw(cv)
im=Image.open(f"{U}/d176e723-IMG_2500.jpeg").convert("RGB");iw,ih=im.size
cw=820;ch=int(cw*ih/iw);cx=(W-cw)//2;cy=250
cv.paste(rounded(im.resize((cw,ch)),24),(cx,cy),rounded(im.resize((cw,ch)),24))
bw,bh=int(cw*0.30),132;ImageDraw.Draw(cv).rounded_rectangle([cx,cy,cx+bw,cy+bh],radius=16,fill=BLACK);ctr(d,"KORE",F(38,"SemiBold"),10,cx+bw/2,cy+46,CREAM)
yb=cy+ch+55
ctr(d,"KORE",F(70,"SemiBold"),18,W/2,yb,CREAM)
ctr(d,"Ensemble 3 pièces — 49,90 €",F(52,"SemiBold"),0,W/2,yb+100,CREAM)
ctr(d,"Livraison offerte en France",F(40,"Regular"),0,W/2,yb+185,CREAM)
# pill code
pw=520;px=(W-pw)//2;py=yb+255
ImageDraw.Draw(cv).rounded_rectangle([px,py,px+pw,py+90],radius=45,fill=CREAM)
ctr(d,"Code BIENVENUE10",F(44,"SemiBold"),1,W/2,py+22,BLACK)
cv.save("/tmp/ad/9.jpg",quality=92)

exe=imageio_ffmpeg.get_ffmpeg_exe();clips=[]
plan=[("1.jpg",1.8),("2.jpg",1.9),("3.jpg",1.9),("4.jpg",1.2),("5.jpg",1.2),("6.jpg",1.2),("7.jpg",1.2),("9.jpg",3.4)]
for i,(fn,T) in enumerate(plan):
    out=f"/tmp/ad/c{i}.mp4";NF=int(T*30)
    subprocess.run([exe,"-y","-loop","1","-i",f"/tmp/ad/{fn}","-vf","scale=1080:1920,format=yuv420p","-frames:v",str(NF),"-c:v","libx264","-pix_fmt","yuv420p","-r","30",out],capture_output=True)
    clips.append(out)
open("/tmp/ad/l.txt","w").write("".join(f"file '{c}'\n" for c in clips))
subprocess.run([exe,"-y","-f","concat","-safe","0","-i","/tmp/ad/l.txt","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart","brand/KORE-pub-ensemble.mp4"],capture_output=True)
p=subprocess.run([exe,"-i","brand/KORE-pub-ensemble.mp4"],capture_output=True,text=True)
import re;m=re.search(r"Duration: (\S+)",p.stderr);print("durée",m.group(1) if m else "?")

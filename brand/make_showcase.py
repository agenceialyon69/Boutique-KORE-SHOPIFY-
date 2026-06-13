from PIL import Image, ImageDraw, ImageFont
import os, imageio_ffmpeg, subprocess
U="/root/.claude/uploads/080664da-8ab0-5541-bc7c-dfa1dd343287"
FONT="brand/Montserrat.ttf"
CREAM=(242,235,221); BLACK=(18,16,14); ACCENT=(190,172,146)
W,H=1080,1920
os.makedirs("/tmp/sc2",exist_ok=True)
def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try: f.set_variation_by_name(v)
    except: pass
    return f
def center(d,t,f,tr,cx,y,fill):
    w=sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1); x=cx-w/2
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def rounded(im,rad):
    m=Image.new("L",im.size,0); ImageDraw.Draw(m).rounded_rectangle([0,0,*im.size],radius=rad,fill=255)
    out=Image.new("RGBA",im.size,(0,0,0,0)); out.paste(im,(0,0),m); return out

def make_photo(idx,src,label,sub=""):
    canvas=Image.new("RGB",(W,H),BLACK); d=ImageDraw.Draw(canvas)
    im=Image.open(f"{U}/{src}").convert("RGB"); iw,ih=im.size
    Cw=948; Ch=int(Cw*ih/iw); im=im.resize((Cw,Ch))
    card=rounded(im,26); cx=(W-Cw)//2; cy=360
    canvas.paste(card,(cx,cy),card)
    bw,bh=int(Cw*0.31),168   # logo plus grand pour couvrir la loupe
    ImageDraw.Draw(canvas).rounded_rectangle([cx,cy,cx+bw,cy+bh],radius=20,fill=BLACK)
    center(d,"KORE",F(44,"SemiBold"),12,cx+bw/2,cy+58,CREAM)
    center(d,"KORE",F(52,"SemiBold"),16,W/2,150,CREAM); d.line([(W/2-68,228),(W/2+68,228)],fill=ACCENT,width=4)
    by=cy+Ch+66
    center(d,label,F(70,"SemiBold"),0,W/2,by,CREAM)
    if sub: center(d,sub,F(42,"Regular"),2,W/2,by+92,CREAM)
    center(d,"korewear.fr",F(36,"Medium"),5,W/2,H-110,CREAM)
    canvas.save(f"/tmp/sc2/{idx}.jpg",quality=90)

def make_text(idx,big,sub=None):
    im=Image.new("RGB",(W,H),BLACK); d=ImageDraw.Draw(im)
    center(d,"KORE",F(64,"SemiBold"),20,W/2,150,CREAM); d.line([(W/2-84,238),(W/2+84,238)],fill=ACCENT,width=5)
    lines=big.split("|"); y=H/2-len(lines)*72
    for ln in lines: center(d,ln,F(120,"SemiBold"),0,W/2,y,CREAM); y+=140
    if sub: center(d,sub,F(44,"Regular"),3,W/2,y+30,CREAM)
    im.save(f"/tmp/sc2/{idx}.jpg",quality=92)

make_text(0,"L'activewear|pensé pour|les femmes")
make_photo(1,"fa97551d-IMG_2253.jpeg","Ensemble seamless","brassière + legging assortis")
make_photo(2,"5c30c70c-IMG_2259.jpeg","Legging côtelé","taille haute, effet gainant")
make_photo(3,"702bfc06-IMG_2261.jpeg","Legging tie-dye","seamless, taille haute")
make_photo(4,"74f0b68d-IMG_2257.jpeg","Short taille haute","gainant & respirant")
make_photo(5,"ee55d714-IMG_2251.jpeg","Brassière de sport","maintien & confort")
make_text(6,"Découvre la|collection","korewear.fr · livraison offerte en France")

exe=imageio_ffmpeg.get_ffmpeg_exe()
durs=[(0,2.6),(1,2.6),(2,2.3),(3,2.3),(4,2.3),(5,2.3),(6,3.0)]
with open("/tmp/sc2/list.txt","w") as f:
    for i,dz in durs: f.write(f"file '/tmp/sc2/{i}.jpg'\nduration {dz}\n")
    f.write("file '/tmp/sc2/6.jpg'\n")
subprocess.run([exe,"-y","-f","concat","-safe","0","-i","/tmp/sc2/list.txt","-vf","fps=30,format=yuv420p","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart","brand/KORE-video-showcase.mp4"],capture_output=True)
print("video OK")

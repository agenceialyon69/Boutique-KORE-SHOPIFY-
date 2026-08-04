from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg, subprocess
FONT="brand/Montserrat.ttf"; CREAM=(242,235,221); BLACK=(15,14,12); ACCENT=(196,178,150)
W,H=1080,1920

def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try:f.set_variation_by_name(v)
    except:pass
    return f
def ctr(d,t,f,tr,cx,y,fill):
    w=sum(d.textlength(c,font=f) for c in t)+tr*(len(t)-1);x=cx-w/2
    for c in t:d.text((x,y),c,font=f,fill=fill);x+=d.textlength(c,font=f)+tr

def bar_overlay(text_lines, top=True, path="/tmp/final2/o.png"):
    o=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(o)
    if top:
        d.rectangle([0,0,W,210+70*(len(text_lines)-1)],fill=(0,0,0,150))
        y=55
    else:
        bh=200+70*(len(text_lines)-1)
        d.rectangle([0,H-bh,W,H],fill=(0,0,0,150))
        y=H-bh+50
    for t,s in text_lines:
        ctr(d,t,F(s,"SemiBold"),0,W/2,y,CREAM); y+=int(s*1.25)
    o.save(path)
    return path

bar_overlay([("On le teste en mouvement,",46),("pas juste en photo",46)], top=True, path="/tmp/final2/o1.png")
bar_overlay([("Zip qui tient,",50),("coupe qui suit le corps",42)], top=False, path="/tmp/final2/o2.png")
bar_overlay([("Taille haute, maintien réel",48)], top=True, path="/tmp/final2/o4.png")

exe=imageio_ffmpeg.get_ffmpeg_exe()
def overlay(clip_in, png, out):
    subprocess.run([exe,"-y","-i",clip_in,"-i",png,
                     "-filter_complex","[0:v][1:v]overlay=0:0,format=yuv420p",
                     "-c:v","libx264","-pix_fmt","yuv420p",out], capture_output=True)

overlay("/tmp/final2/g1.mp4","/tmp/final2/o1.png","/tmp/final2/h1.mp4")
overlay("/tmp/final2/g2.mp4","/tmp/final2/o2.png","/tmp/final2/h2.mp4")
overlay("/tmp/final2/g4.mp4","/tmp/final2/o4.png","/tmp/final2/h4.mp4")

cv=Image.new("RGB",(W,H),BLACK);d=ImageDraw.Draw(cv)
ctr(d,"KORE",F(78,"SemiBold"),18,W/2,720,CREAM)
ctr(d,"Ensemble 3 pièces",F(52,"SemiBold"),0,W/2,840,CREAM)
ctr(d,"49,90 €",F(60,"SemiBold"),0,W/2,915,CREAM)
ctr(d,"Livraison offerte en France",F(38,"Regular"),0,W/2,1010,CREAM)
pw=560;px=(W-pw)//2;py=1080
d.rounded_rectangle([px,py,px+pw,py+94],radius=47,fill=ACCENT)
ctr(d,"Code BIENVENUE10",F(44,"SemiBold"),1,W/2,py+24,BLACK)
ctr(d,"korewear.fr",F(40,"SemiBold"),2,W/2,py+150,CREAM)
cv.save("/tmp/final2/cta.jpg",quality=92)
subprocess.run([exe,"-y","-loop","1","-i","/tmp/final2/cta.jpg","-vf","scale=1080:1920,format=yuv420p",
                 "-frames:v","96","-c:v","libx264","-pix_fmt","yuv420p","-r","30","/tmp/final2/h5.mp4"],
                capture_output=True)

clips=["/tmp/final2/h1.mp4","/tmp/final2/h2.mp4","/tmp/final2/h4.mp4","/tmp/final2/h5.mp4"]
open("/tmp/final2/list.txt","w").write("".join(f"file '{c}'\n" for c in clips))
subprocess.run([exe,"-y","-f","concat","-safe","0","-i","/tmp/final2/list.txt",
                 "-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart",
                 "brand/KORE-pub-mouvement.mp4"], capture_output=True)
p=subprocess.run([exe,"-i","brand/KORE-pub-mouvement.mp4"],capture_output=True,text=True)
import re;m=re.search(r"Duration: (\S+)",p.stderr);print("durée",m.group(1) if m else "?")

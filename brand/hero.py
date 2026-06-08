from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
W,H=2400,1200
top=(26,23,20); bot=(12,10,9)  # dégradé noir chaud premium
img=Image.new("RGB",(W,H),bot)
px=img.load()
for y in range(H):
    t=y/H
    r=int(top[0]*(1-t)+bot[0]*t); g=int(top[1]*(1-t)+bot[1]*t); b=int(top[2]*(1-t)+bot[2]*t)
    for x in range(W): px[x,y]=(r,g,b)
# halo doux en haut-centre (lumière)
glow=Image.new("L",(W,H),0); gd=ImageDraw.Draw(glow)
gd.ellipse([W*0.2,-H*0.5,W*0.8,H*0.7],fill=70)
glow=glow.filter(ImageFilter.GaussianBlur(260))
warm=Image.new("RGB",(W,H),(60,54,46))
img=Image.composite(warm,img,glow)
# filigrane KORE très subtil (texture de marque)
d=ImageDraw.Draw(img)
try:
    f=ImageFont.truetype("/tmp/Montserrat.ttf",520)
    try: f.set_variation_by_name("SemiBold")
    except: pass
except: f=ImageFont.load_default()
layer=Image.new("RGBA",(W,H),(0,0,0,0)); ld=ImageDraw.Draw(layer)
word="KORE"; tr=70
tw=sum(ld.textlength(c,font=f) for c in word)+tr*(len(word)-1)
x=(W-tw)/2; b=f.getbbox(word); y=(H-(b[3]-b[1]))/2-b[1]
for c in word:
    ld.text((x,y),c,font=f,fill=(242,235,221,12)); x+=ld.textlength(c,font=f)+tr
img=Image.alpha_composite(img.convert("RGBA"),layer).convert("RGB")
# léger grain/vignette
vg=Image.new("L",(W,H),0); vd=ImageDraw.Draw(vg)
vd.rectangle([0,0,W,H],fill=0); vd.ellipse([-W*0.15,-H*0.15,W*1.15,H*1.15],fill=255)
vg=vg.filter(ImageFilter.GaussianBlur(200))
dark=Image.new("RGB",(W,H),(6,5,4))
img=Image.composite(img,dark,vg)
img.save("brand/kore-hero-bg-dark.png",quality=92)
# version mobile portrait (recadrage centré)
port=img.crop((int(W*0.30),0,int(W*0.70),H)).resize((1080,1620),Image.LANCZOS)
port.save("brand/kore-hero-bg-dark-mobile.png")
print("ok")

from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg, subprocess
FONT="brand/Montserrat.ttf"; CREAM=(242,235,221); BLACK=(15,14,12)
W,H=1080,1920

def F(s,v="SemiBold"):
    f=ImageFont.truetype(FONT,int(s))
    try:f.set_variation_by_name(v)
    except:pass
    return f

# tag de marque qui couvre le watermark "AI-generated" en bas a gauche
o=Image.new('RGBA',(W,H),(0,0,0,0))
d=ImageDraw.Draw(o)
d.rectangle([0,H-95,300,H],fill=BLACK)
d.text((28,H-72),"KORE",font=F(38,"SemiBold"),fill=CREAM)
o.save("/tmp/final2/wm_mask.png")

exe=imageio_ffmpeg.get_ffmpeg_exe()
for clip in ["g1","g2","g4"]:
    subprocess.run([exe,"-y","-i",f"/tmp/final2/{clip}.mp4","-i","/tmp/final2/wm_mask.png",
                     "-filter_complex","[0:v][1:v]overlay=0:0,format=yuv420p",
                     "-c:v","libx264","-pix_fmt","yuv420p",f"/tmp/final2/{clip}_clean.mp4"],
                    capture_output=True)
print("done")

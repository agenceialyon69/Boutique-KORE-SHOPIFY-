from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Image,
    Table, TableStyle, HRFlowable)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

try:
    pdfmetrics.registerFont(TTFont("Mont","/tmp/Montserrat.ttf")); BASE="Mont"
except Exception:
    BASE="Helvetica"

BLACK=colors.HexColor("#141210"); GREY=colors.HexColor("#6B675F")
BOX=colors.HexColor("#F3EFE8"); LINE=colors.HexColor("#D9D2C6")

doc=SimpleDocTemplate("brand/KORE-video1-Aicha.pdf",pagesize=A4,
    leftMargin=20*mm,rightMargin=20*mm,topMargin=16*mm,bottomMargin=14*mm,
    title="KORE - Ta premiere video TikTok",author="KORE")
st=getSampleStyleSheet()
def S(n,**k): return ParagraphStyle(n,parent=st["Normal"],fontName=BASE,**k)
h1=S("h1",fontSize=22,leading=26,textColor=BLACK,spaceAfter=2)
sub=S("sub",fontSize=11,leading=14,textColor=GREY,spaceAfter=10)
h2=S("h2",fontSize=13,leading=16,textColor=BLACK,spaceBefore=13,spaceAfter=5)
body=S("body",fontSize=10.5,leading=15,textColor=BLACK,spaceAfter=4)
bull=S("bull",fontSize=10.5,leading=15,textColor=BLACK,leftIndent=10,spaceAfter=2)
small=S("small",fontSize=9,leading=12,textColor=GREY)

def boxed(txt):
    t=Table([[Paragraph(txt,body)]],colWidths=[doc.width])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),BOX),("BOX",(0,0),(-1,-1),0.5,LINE),
        ("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),
        ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8)]))
    return t

E=[]
try:
    img=Image("brand/kore-wordmark-noir.png"); img._restrictSize(70*mm,26*mm)
    img.hAlign="CENTER"; E+=[img,Spacer(1,6)]
except Exception: pass

E+=[Paragraph("Ta première vidéo TikTok",h1),
    Paragraph("KORE — « Jour 1 » du lancement  ·  à filmer avec ton téléphone",sub),
    HRFlowable(width="100%",thickness=1,color=BLACK,spaceAfter=8),
    Paragraph("Salut Aïcha ! Cette première vidéo n'a <b>pas besoin de produit</b> et surtout "
      "<b>pas besoin d'être parfaite</b>. Le but : démarrer le compte et lancer l'aventure. "
      "Sur TikTok, le <b>brut fait plus de vues</b> que le trop léché. Faisable en 15 minutes.",body)]

E+=[Paragraph("Avant de filmer (1 min de prépa)",h2),
    Paragraph("•  Téléphone <b>à la verticale</b>",bull),
    Paragraph("•  <b>Lumière du jour</b> : place-toi face à une fenêtre",bull),
    Paragraph("•  Durée visée : <b>10 à 20 secondes</b>",bull),
    Paragraph("•  Sois naturelle, souris — comme si tu parlais à une copine",bull)]

E+=[Paragraph("La 1re seconde = le « hook » (choisis-en UN)",h2),
    Paragraph("La phrase qui empêche de scroller. Dis-la face caméra OU écris-la en gros à l'écran :",body),
    Paragraph("1.  « Jour 1 du lancement de notre marque d'activewear. 0 vente, 0 abonné. On documente tout. »",bull),
    Paragraph("2.  « On lance une marque de legging française. Suivez le truc depuis le tout début. »",bull),
    Paragraph("3.  « POV : tu lances ta marque de sport et t'as littéralement 0 client aujourd'hui. »",bull)]

E+=[Paragraph("Ce que tu dis (avec tes mots, ~15 sec)",h2),
    Paragraph("•  « Salut, moi c'est Aïcha. On lance <b>KORE</b>, de l'activewear pensé pour les femmes. »",bull),
    Paragraph("•  « L'idée : je <b>teste et je sélectionne</b> les pièces — celles qui passent mes tests rentrent, les autres non. »",bull),
    Paragraph("•  « On part de zéro et on vous montre tout. Abonne-toi pour suivre l'aventure. »",bull)]

E+=[Paragraph("Comment filmer (1 seul plan suffit)",h2),
    Paragraph("•  Toi face caméra qui parles ~15 sec. C'est suffisant.",bull),
    Paragraph("•  (Optionnel) 1-2 plans courts en plus : toi qui marches, gros plan sur le logo KORE, ou tu écris « KORE » sur un carnet.",bull)]

E+=[Paragraph("Texte à mettre à l'écran",h2),
    Paragraph("En haut de l'image, pendant les 3 premières secondes :",body),
    boxed("JOUR 1  —  0 vente")]

E+=[Paragraph("Légende (copie-colle, puis ajoute 1-2 emojis dans TikTok)",h2),
    boxed("On lance KORE : de l'activewear testé et sélectionné pour les femmes.<br/>"
          "On part de zéro et on documente tout. Tu suis l'aventure ?")]

E+=[Paragraph("Hashtags (copie-colle)",h2),
    boxed("#entrepreneuse   #activewear   #onselance   #fitnessfrance   #petiteentreprise")]

E+=[Paragraph("Le son",h2),
    Paragraph("Dans TikTok, choisis un <b>son tendance</b> (la petite flèche qui monte), calme/motivant. "
      "Ajoute-le <b>au moment de poster</b> dans TikTok, pas dans CapCut.",body)]

E+=[Paragraph("Montage CapCut (5 min, le minimum)",h2),
    Paragraph("1.  Nouveau projet → choisis ta vidéo",bull),
    Paragraph("2.  Coupe les blancs (sélectionne le clip → Diviser → Supprimer)",bull),
    Paragraph("3.  Sous-titres : onglet Texte → « Sous-titres automatiques » → Français → relis et corrige",bull),
    Paragraph("4.  Format 9:16 (plein écran)",bull),
    Paragraph("5.  Exporter en 1080p — <b>supprime le clip de fin au logo CapCut</b> (sinon filigrane = amateur)",bull)]

E+=[Paragraph("Les 3 règles d'or",h2),
    Paragraph("1.  <b>Brut &gt; parfait.</b> Mieux vaut postée que parfaite. Ne bloque pas.",bull),
    Paragraph("2.  <b>Honnêteté.</b> Jamais « je fabrique » ni « Made in France ». Toujours « je teste et je sélectionne ».",bull),
    Paragraph("3.  <b>La régularité gagne.</b> Objectif : 1 vidéo/jour. La 1re ne sera sûrement pas virale — normal, c'est l'échauffement.",bull)]

E+=[Paragraph("Check-list avant de poster",h2),
    Paragraph("[ ] Vertical + lumière du jour&nbsp;&nbsp;&nbsp; [ ] Hook dans la 1re seconde&nbsp;&nbsp;&nbsp; [ ] Sous-titres ajoutés",bull),
    Paragraph("[ ] Texte « JOUR 1 » à l'écran&nbsp;&nbsp;&nbsp; [ ] Légende + hashtags collés",bull),
    Paragraph("[ ] Son tendance&nbsp;&nbsp;&nbsp; [ ] Pas de filigrane CapCut à la fin",bull),
    Spacer(1,10),
    HRFlowable(width="100%",thickness=0.5,color=GREY,spaceAfter=6),
    Paragraph("KORE · korewear.fr · Activewear pensé pour les femmes",small)]

doc.build(E)
print("PDF OK")

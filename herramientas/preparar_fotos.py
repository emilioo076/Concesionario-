#!/usr/bin/env python3
"""
Prepara fotos para el sitio de SOHO Automotriz.

Recorta la foto a 4:3 (centrado) y genera versiones WebP ligeras en varios
anchos, con el nombre que espera el sitio:  <id>-600.webp, <id>-1000.webp, <id>-1600.webp
Además crea <id>.jpg, una copia de respaldo para equipos que no leen WebP
(por ejemplo, iPhone o iPad con iOS 13 o anterior).

Uso:
    python3 herramientas/preparar_fotos.py FOTO ID
    python3 herramientas/preparar_fotos.py foto-del-auto.jpg bmw-x5-m-2024

Opciones:
    --carpeta autos|escenas   Carpeta de destino dentro de assets/img (por defecto: autos)
    --anchos 600,1000,1600    Anchos a generar (por defecto: 600,1000,1600)
    --calidad 74              Calidad WebP de 1 a 100 (por defecto: 74)
    --sin-recorte             No recortar a 4:3

Requiere Pillow:  pip install Pillow
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  pip install Pillow")

RAIZ = Path(__file__).resolve().parent.parent


def recortar_4x3(im):
    w, h = im.size
    if abs(w / h - 4 / 3) < 0.01:
        return im
    if w / h > 4 / 3:  # muy ancha: recorta los lados
        nw = round(h * 4 / 3)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w * 3 / 4)  # muy alta: recorta arriba y abajo
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def reducir(im, ancho):
    if im.width <= ancho:
        return im
    return im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)


def preparar(foto, ident, carpeta="autos", anchos=(600, 1000, 1600), calidad=74, recorte=True, ancho_jpg=1000):
    im = ImageOps.exif_transpose(Image.open(foto)).convert("RGB")
    if recorte:
        im = recortar_4x3(im)
    destino = RAIZ / "assets" / "img" / carpeta
    destino.mkdir(parents=True, exist_ok=True)
    salidas = []
    for ancho in anchos:
        ruta = destino / f"{ident}-{ancho}.webp"
        reducir(im, ancho).save(ruta, "WEBP", quality=calidad, method=6)
        salidas.append(ruta)
    # Copia JPG de respaldo (el sitio la usa solo si el equipo no puede mostrar WebP)
    ruta = destino / f"{ident}.jpg"
    reducir(im, ancho_jpg).save(ruta, "JPEG", quality=78, optimize=True, progressive=True)
    salidas.append(ruta)
    return salidas


def main():
    p = argparse.ArgumentParser(description="Prepara fotos WebP para el sitio.")
    p.add_argument("foto", help="Ruta de la foto original (JPG, PNG, HEIC no soportado)")
    p.add_argument("id", help="Nombre sin espacios, igual al 'id' del auto en inventario.js")
    p.add_argument("--carpeta", default="autos", choices=["autos", "escenas"])
    p.add_argument("--anchos", default="600,1000,1600")
    p.add_argument("--calidad", type=int, default=74)
    p.add_argument("--sin-recorte", action="store_true")
    a = p.parse_args()

    if " " in a.id:
        sys.exit("El id no puede tener espacios. Usa guiones, por ejemplo: bmw-x5-m-2024")
    anchos = tuple(int(x) for x in a.anchos.split(","))
    ancho_jpg = 1000 if a.carpeta == "autos" else max(anchos)
    for ruta in preparar(a.foto, a.id, a.carpeta, anchos, a.calidad, not a.sin_recorte, ancho_jpg):
        print(f"{ruta.relative_to(RAIZ)}  ({ruta.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()

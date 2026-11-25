# SOHO Automotriz: sitio web

Rediseño del sitio de **SOHO Automotriz** (seminuevos de gama media y alta, Aguascalientes).
Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación), listo para
publicarse en cualquier hosting, en GitHub Pages o en Netlify.

## Presentar la demo

1. Descomprime la carpeta del proyecto en tu computadora.
2. Abre `index.html` con doble clic (de preferencia en Chrome, Edge o Safari).
3. Pon el navegador en pantalla completa (F11 en Windows, Ctrl+Cmd+F en Mac).

No necesita servidor ni instalar nada. Las fotos y las tipografías van dentro del
proyecto, así que **se ve igual aunque no haya internet**. Sin conexión, lo único que no
carga son los mapas de las sucursales (se muestra un ícono en su lugar) y los botones de
WhatsApp e Instagram, que abren servicios externos.

Para enseñar la versión de celular desde la computadora en Chrome: clic derecho →
*Inspeccionar* → ícono de celular (o Ctrl+Shift+M) y elige un modelo de iPhone.

Si prefieres usar un servidor local:
```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Estructura

```
index.html                 Página principal (todas las secciones)
assets/css/styles.css      Estilos (paleta, tipografía, diseño responsivo)
assets/css/fuentes.css     Tipografías incrustadas (funcionan sin internet)
assets/fonts/              Licencias de las tipografías (SIL Open Font License)
assets/js/inventario.js    ← INVENTARIO y datos de contacto (lo único que se edita a diario)
assets/js/main.js          Filtros, ficha del auto, slider, formulario → WhatsApp
assets/img/autos/          Fotos de los autos en WebP (nombre-600, -1000 y -1600)
assets/img/escenas/        Fotos de portada y fondos
assets/img/marca/          Logo, ícono e imagen para redes sociales
herramientas/              preparar_fotos.py: convierte fotos al formato del sitio
```

## Actualizar el inventario

El inventario actual (40 unidades) sale de las últimas publicaciones de Instagram
(@sohoautomotriz, del 28 de mayo al 24 de noviembre de 2026). Todo está en
`assets/js/inventario.js`:

1. Prepara la foto con la herramienta incluida (necesita Python y `pip install Pillow`):
   ```bash
   python3 herramientas/preparar_fotos.py foto-del-auto.jpg bmw-x5-m-2024
   ```
   La recorta a 4:3 y crea tres versiones WebP ligeras en `assets/img/autos/`
   (`bmw-x5-m-2024-600.webp`, `-1000.webp` y `-1600.webp`). El navegador elige el
   tamaño según la pantalla.
2. Copia un bloque `{ ... }` del archivo y cambia los datos (`id`, `marca`, `modelo`,
   `categoria`, `color`, `specs`, `fotos`, `publicado`). El `id` debe ser el mismo
   nombre que usaste para la foto.
3. Si llenas `anio`, `km` o `precio`, se muestran solos. Con `null` se ocultan y el precio
   aparece como "Precio a consultar".
4. `destacado: true` pone el auto al principio con la etiqueta *Signature*.
   `etiqueta: "Nueva"` (o cualquier texto) cambia esa etiqueta.

Para quitar un auto vendido, borra su bloque y sus tres fotos.

## Enlace de cada auto

Cada auto tiene su propio enlace, por ejemplo `https://tu-dominio.com/?auto=ferrari-488-gtb`.
Al abrirlo se muestra directo la ficha de ese auto. La ficha tiene un botón **Compartir**
(menú nativo en el celular o "copiar enlace" en computadora), y el mensaje de WhatsApp
incluye el enlace para que el asesor sepa exactamente qué unidad le interesa al cliente.
El botón "atrás" del celular cierra la ficha sin salir de la página.

> También funciona al abrir `index.html` directo. Si algún navegador no permite cambiar la
> dirección con el archivo abierto así, la ficha del auto se abre igual.

El auto de la sección "Lo más nuevo en SOHO" y los tres autos de la portada están
directamente en `index.html` (busca `DESTACADO` y `HERO`).

## Qué incluye

- Portada a pantalla completa con tres autos que se alternan.
- Cifras de la agencia (22 años, 100+ opciones, 92 puntos, 28K en Instagram).
- Auto recién llegado destacado.
- Colección con filtros por tipo y marca, orden (destacados, recientes, año, marca),
  buscador, botón "Ver más" y ficha de cada auto.
- Sección "Vende tu auto": compra de contado, consignación y avalúo sin costo.
- Servicios: financiamiento, arrendamiento y envíos a toda la República.
- Botones de WhatsApp con mensaje prellenado según el auto o el trámite.
- Formulario (comprar, vender, consignar o financiamiento) que se envía por WhatsApp,
  sin necesidad de servidor.
- Sucursales con mapa, horario y enlace "Cómo llegar".
- Diseño adaptado a celular, accesible con teclado y con datos para Google (Schema.org).

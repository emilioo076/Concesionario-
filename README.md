# SOHO Automotriz: sitio web

Rediseño del sitio de **SOHO Automotriz** (seminuevos de gama media y alta, Aguascalientes).
Es un sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación), listo para
publicarse en cualquier hosting, en GitHub Pages o en Netlify.

## Ver el sitio

- **Directo:** abre `index.html` en el navegador.
- **Con servidor local** (recomendado):
  ```bash
  python3 -m http.server 8000
  # luego abre http://localhost:8000
  ```

## Estructura

```
index.html                 Página principal (todas las secciones)
assets/css/styles.css      Estilos (paleta, tipografía, diseño responsivo)
assets/js/inventario.js    ← INVENTARIO y datos de contacto (lo único que se edita a diario)
assets/js/main.js          Filtros, ficha del auto, slider, formulario → WhatsApp
assets/img/autos/          Fotos de los autos (nombre.jpg y nombre-sm.jpg)
assets/img/escenas/        Fotos de portada y fondos
assets/img/marca/          Logo, ícono e imagen para redes sociales
```

## Actualizar el inventario

El inventario actual (40 unidades) sale de las últimas publicaciones de Instagram
(@sohoautomotriz, del 28 de mayo al 24 de noviembre de 2026). Todo está en
`assets/js/inventario.js`:

1. Guarda la foto en `assets/img/autos/` con un nombre sin espacios, por ejemplo
   `bmw-x5-m.jpg` (unos 1600 px de ancho) y una copia chica `bmw-x5-m-sm.jpg` (unos 760 px).
2. Copia un bloque `{ ... }` del archivo y cambia los datos (`id`, `marca`, `modelo`,
   `categoria`, `color`, `specs`, `fotos`, `publicado`).
3. Si llenas `anio`, `km` o `precio`, se muestran solos. Con `null` se ocultan y el precio
   aparece como "Precio a consultar".
4. `destacado: true` pone el auto al principio con la etiqueta *Signature*.
   `etiqueta: "Nueva"` (o cualquier texto) cambia esa etiqueta.

Para quitar un auto vendido, borra su bloque y sus dos fotos.

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

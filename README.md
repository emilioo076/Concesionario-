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

Todo está en `assets/js/inventario.js`:

1. Guarda la foto en `assets/img/autos/` con un nombre sin espacios, por ejemplo
   `bmw-x5-m.jpg` (unos 1600 px de ancho) y una copia chica `bmw-x5-m-sm.jpg` (unos 760 px).
2. Copia un bloque `{ ... }` del archivo y cambia los datos (`id`, `marca`, `modelo`,
   `categoria`, `color`, `specs`, `fotos`).
3. Si llenas `anio`, `km` o `precio`, se muestran solos. Con `null` se ocultan y el precio
   aparece como "Precio a consultar".
4. `destacado: true` pone el auto al principio con la etiqueta *Signature*.

Para quitar un auto vendido, borra su bloque.

> **Antes de publicar:** las fotos actuales vienen de la galería del sitio anterior.
> Confirma qué unidades siguen en existencia y agrega las nuevas desde Instagram.

## Qué incluye

- Portada a pantalla completa con tres autos que se alternan.
- Cifras de la agencia, marcas y una pieza destacada.
- Colección con filtros por tipo y marca, buscador y ficha de cada auto.
- Botones de WhatsApp con mensaje prellenado según el auto.
- Formulario para agendar cita, que se envía por WhatsApp (no necesita servidor).
- Sucursales con mapa, horario y enlace "Cómo llegar".
- Diseño adaptado a celular, accesible con teclado y con datos para Google (Schema.org).

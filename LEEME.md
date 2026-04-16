# 📰 Pluma Libre — Sitio Web

Medio digital independiente de El Salvador.
Sitio web estático listo para publicar en Netlify de forma gratuita.

---

## 📁 Estructura del sitio

```
pluma-libre/
├── index.html              ← Página de inicio
├── sobre-nosotros.html     ← Página "Sobre Nosotros"
├── style.css               ← Estilos (no tocar a menos que sea necesario)
├── netlify.toml            ← Configuración de Netlify
├── assets/
│   └── logo.jpg            ← Tu logo
├── secciones/
│   ├── religioso.html      ← #AcontecerReligioso
│   ├── politico.html       ← #AcontecerPolítico
│   ├── cultural.html       ← #AcontecerCultural
│   ├── social.html         ← #AcontecerSocial
│   └── economico.html      ← #AcontecerEconómico
└── articulos/
    └── plantilla.html      ← Plantilla para notas nuevas
```

---

## 🚀 PASO 1: Subir el sitio a Netlify (primera vez)

1. Andá a **https://app.netlify.com**
2. Creá una cuenta gratis (podés usar tu cuenta de Google o correo)
3. En el panel, hacé clic en **"Add new site" → "Deploy manually"**
4. Arrastrá la carpeta `pluma-libre` completa al área de carga
5. ¡Listo! Tu sitio estará en una URL como `random-name.netlify.app`

### Conectar tu dominio plumalibre.netlify.app:
1. En Netlify, andá a **Site settings → Domain management**
2. Hacé clic en **"Add custom domain"**
3. Escribí `plumalibre.netlify.app`
4. Seguí las instrucciones para apuntar tu dominio (cambiar los DNS)

---

## ✏️ PASO 2: Cómo publicar una nota nueva (desde el celular)

### Opción A: Usando GitHub (RECOMENDADO)

1. Creá una cuenta en **https://github.com**
2. Subí toda la carpeta `pluma-libre` como un repositorio
3. En Netlify, conectá tu sitio a ese repositorio de GitHub
4. Ahora, cada vez que edités un archivo en GitHub, el sitio se actualiza solo

**Para publicar una nota desde el celular:**
1. Abrí GitHub en el navegador del celular
2. Andá a la carpeta `articulos/`
3. Hacé clic en **"Add file" → "Create new file"**
4. Nombralo: `mi-nota-nueva.html`
5. Copiá todo el contenido de `plantilla.html`
6. Editá el título, texto e imagen
7. Hacé clic en **"Commit new file"**
8. ¡La nota se publica sola en unos segundos!

### Opción B: Subir archivos directamente en Netlify

1. Abrí **https://app.netlify.com** en tu celular
2. Andá a tu sitio → **Deploys**
3. Subí la carpeta actualizada

---

## 📝 PASO 3: Cómo editar la plantilla de artículo

Abrí el archivo `articulos/plantilla.html` y buscá los comentarios con ✏️.
Cada sección editable está marcada claramente.

### Lo que tenés que cambiar en cada nota nueva:

1. **En la parte de arriba (`<head>`):**
   - `<title>` → Ponné el título de tu nota
   - `og:title` → Mismo título (para cuando lo compartan en Facebook)
   - `og:description` → Una línea resumiendo la nota

2. **La sección:**
   - Cambiá "Acontecer Político" por la sección correcta

3. **El título:**
   - Dentro de `<h1>` escribí el título de la nota

4. **La imagen:**
   - Subí tu imagen a la carpeta `assets/`
   - Cambiá `src="..."` por `src="../assets/nombre-de-tu-imagen.jpg"`

5. **El cuerpo:**
   - Cada párrafo va entre `<p>` y `</p>`
   - Para subtítulos usá `<h2>` y `</h2>`
   - Para citas usá `<blockquote>` y `</blockquote>`

### Ejemplo rápido de un párrafo:
```html
<p>Las autoridades confirmaron que el proyecto iniciará en mayo.</p>
```

---

## 📋 PASO 4: Cómo agregar la nota al inicio

Después de crear el archivo de tu nota, tenés que agregarla al inicio (index.html):

1. Abrí `index.html`
2. Buscá `<!-- === NOTA 1 === -->`
3. Copiá todo el bloque de la Nota 1
4. Pegalo ARRIBA de la Nota 1
5. Cambiá:
   - La imagen
   - La sección (etiqueta)
   - El título
   - El enlace (`href="articulos/TU-ARCHIVO.html"`)
   - La fecha

### Bloque para copiar y pegar:
```html
<article class="tarjeta-noticia">
  <div class="thumb">
    <img src="assets/nombre-imagen.jpg" alt="">
  </div>
  <div class="info">
    <span class="etiqueta-sm">Acontecer Social</span>
    <h3><a href="articulos/mi-nota.html">Título de mi nota nueva</a></h3>
    <p class="meta">12 de abril, 2026</p>
  </div>
</article>
```

---

## 🖼️ Sobre las imágenes

- Subí tus imágenes a la carpeta `assets/`
- Usá fotos en formato `.jpg` o `.png`
- Tamaño recomendado: **800x450 píxeles** (horizontal)
- Tratá de que pesen menos de **500 KB** para que carguen rápido
- Podés reducir el tamaño en: https://squoosh.app (gratis)

---

## ❓ Preguntas frecuentes

**¿Cuánto cuesta Netlify?**
Nada. El plan gratuito permite hasta 100 GB de transferencia al mes, más que suficiente para un medio local.

**¿Puedo editar desde el celular?**
Sí, usando GitHub en el navegador de tu celular.

**¿Qué pasa si me equivoco?**
Si usás GitHub, podés ver el historial de cambios y restaurar versiones anteriores.

**¿Puedo agregar más secciones?**
Sí, copiá cualquier archivo de la carpeta `secciones/`, cambiá el nombre y editá el contenido.

**¿Puedo cambiar los colores?**
Sí, abrí `style.css` y cambiá los valores en la sección `:root` al inicio del archivo.

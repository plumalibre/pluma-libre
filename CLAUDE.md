# Pluma Libre — Contexto del Proyecto

> Este archivo le da contexto a Claude Code sobre el proyecto. Mantenerlo actualizado.

## Qué es Pluma Libre

Medio de comunicación digital independiente de Sonsonate, El Salvador. Equipo de 2 personas.
Cobertura local, nacional e internacional. Periodismo crítico sin ataduras políticas ni institucionales.

**Sitio:** https://plumalibre.press
**Repo:** https://github.com/plumalibre/plumalibre.github.io
**Hosting:** GitHub Pages (solo HTML/CSS/JS, sin backend, sin CMS)

## Stack técnico

- HTML5 + CSS3 + Vanilla JavaScript (sin frameworks)
- Tipografías: Newsreader (titulares) + Outfit (cuerpo)
- Deploy: cada `git push` a main actualiza el sitio automáticamente vía GitHub Pages
- SEO: JSON-LD Schema.org, Open Graph, sitemap.xml, robots.txt

## Paleta de colores

```css
--brand: #081A41;   /* azul oscuro, exactamente el fondo del logo PWA */
--accent: #0071E3;  /* azul Apple, links/CTA */
--bg: #F5F5F7;      /* gris claro fondo */
--card: #FFFFFF;    /* blanco tarjetas */
```

## Estructura del repo

```
/
├── index.html                  # Homepage
├── sobre-nosotros.html         # Sobre + contacto (form FormSubmit → redaccion@plumalibre.press)
├── style.css                   # Estilos globales v3
├── robots.txt
├── sitemap.xml
├── rss.xml                     # Feed RSS (30 notas) — lo actualiza el editor al publicar
├── llms.txt                    # Descripción del medio para modelos de lenguaje
├── herramientas-generar-feed.py # Regenera rss.xml y llms.txt desde articulos/
├── assets/
│   ├── logo.jpg                # Logo (globo azul con pluma)
│   └── [imágenes de notas]
├── secciones/
│   ├── religioso.html
│   ├── politico.html
│   ├── cultural.html
│   ├── social.html
│   ├── economico.html
│   └── deportivo.html
├── articulos/
│   ├── plantilla.html          # NO BORRAR - base para notas
│   └── [notas].html
└── herramientas/
    ├── editor.html             # Editor v9 - publicación y generación de posts integrada
    └── generar-clave.html      # Utility local - encriptar token con contraseña
```

## Editor (repo propio: plumalibre/editor)

**Ya NO vive en `herramientas/` de este repo.** Es un repo aparte desplegado en Cloudflare Pages: https://editor-5gq.pages.dev — archivo único `editor.html` (~2700 líneas, todo inline), PWA instalable con service worker (`sw.js`, bumpear `CACHE_VERSION` en cada cambio del editor) y login con contraseña.

4 pestañas:
1. **📝 Escribir** — editor rico con toolbar (H2, H3, cita, negrita, cursiva, foto, video, línea). Publicar/preview son botones del flujo. Al publicar también actualiza la página de sección (`secciones/*.html`) y `sitemap.xml` (desde 2026-07-02).
2. **📱 Redes** — genera posts automáticos para Facebook, X, Instagram y Threads.
3. **📋 Historial** — lista notas publicadas (online y borradores en `articulos-borrador/`), permite editar y borrar (borrar también limpia sección y sitemap).
4. **📊 Stats** — dashboard GA4. Requiere el Worker de Cloudflare de `worker/` (ver `worker/GUIA-STATS.md` en el repo del editor).

Tres botones en la barra superior:
- 🌙 Modo oscuro
- 📢 **Publicidad** — abre modal fullscreen para administrar banners (Banner A home + Banner B nota) sin tocar código: checkbox activo, drag/drop de imagen con compresión adaptativa, link y alt. Cada guardado genera 1-2 commits (imagen si cambió + `banners.json`).
- ⚙️ Configuración GitHub (usuario, repo, token)

**Publicación:** usa GitHub API directamente desde el navegador con un token encriptado con XOR+base64 (SEGURIDAD DÉBIL - PENDIENTE DE MEJORAR).

**Markup especial:**
- `## texto` → H2
- `### texto` → H3
- `> texto` → cita
- `**texto**` → negrita
- `_texto_` → cursiva
- `[IMAGEN:nombre.jpg]` → imagen inline
- `[VIDEO_YOUTUBE:id]`, `[VIDEO_FACEBOOK:url]`, `[VIDEO_TIKTOK:url]`
- `[COL2]...[/COL]...[/COL2]` → 2 columnas
- `---` → separador

**Token actual encriptado en el archivo:**
- `data: 'FxoVMTVQRAlJcyImHz0CMgJYXwQxGVE0HBgCIEFAQAcnA0AZIRRJag=='`
- `check: 'hsme43b'`

## Línea editorial

- **Tono:** Profesional, directo, accesible
- **Secciones fijas (10 desde el 31-jul-2026):** Política, Economía, Deportes, Social, Religión, Cultura, Internacional, **Opinión**, **Tecnología** y **Entrevistas**. (Antes se mostraban como `#AcontecerX`; el branding cambió en mayo 2026: ahora son sustantivos sin `#` ni "Acontecer". El editor genera los hashtags de redes con el sustantivo limpio: `#Política`, `#Economía`, etc.)
- **Hashtags base:** #PlumaLibre #Sonsonate #ElSalvador
- **Relaciones comerciales:** Pauta con Alcaldía de Sonsonate Centro (Alcalde Roberto Aquino). NO con Sonsonate Este.

## Cuentas GitHub

- **plumalibre** (prensaplumalibre@gmail.com) — cuenta del medio, usar para todo
- **Procesion-Sonsonate-Semana-Santa** (njrmancia@gmail.com) — cuenta personal del dev, NO TOCAR

## Banners publicitarios (banners.json)

El sitio tiene tres slots de banner que se controlan desde `banners.json` en la raíz del repo:

- **Banner A** — aparece en el home (entre hero y grid de noticias). Se **achica al scrollear** (250→100px desktop, 150→70px mobile, vuelve a tamaño original al subir el scroll).
- **Banner B** — aparece dentro de las notas (entre el 3er y 4to párrafo).
- **Banner C** — intercalado entre cards del grid de Últimas Noticias en el home, cada N cards (configurable, default 5). Se renderiza como una card más del grid (mismo aspect, sombra, border-radius). Dimensiones recomendadas: 600×600 (1:1) o 800×600 (4:3) px, JPG/PNG, máx 150KB. Tiene campo extra `frecuencia` (3-10) en `banners.json`. **Pendiente futuro:** cuando las páginas de sección (`secciones/*.html`) tengan más cards, extender Banner C a esas páginas también (hoy solo aparece en home).

Banner A y B están en el HTML estático (ocultos con `hidden` hasta que el JS los active). Banner C vive en un `<template id="banner-c-tpl">` y se clona/inserta por JS solo si está activo. El script inline al final del `<body>` lee `banners.json` al cargar, valida link/imagen y aplica.

### Activar un anunciante — opción rápida (editor)

Desde el editor → botón **📢 Publicidad** en la barra superior → modal con formularios para Banner A, Banner B y Banner C:
- Checkbox "Activo"
- Subir imagen (se redimensiona y comprime automáticamente al tamaño del slot)
- Link y alt
- Botón "Guardar Banner X" → genera 1-2 commits automáticos (imagen + `banners.json`).

Este es el flujo recomendado día a día. Los nombres de imagen son fijos (`assets/banner-a.jpg`, `assets/banner-b.jpg`, `assets/banner-c.jpg`) y cada upload sobrescribe.

### Activar un anunciante — opción manual (GitHub web)

1. Subir la imagen del banner a `assets/` (ej. `assets/banner-alcaldia.jpg`).
2. Editar `banners.json` desde GitHub web (Edit this file ✏️). Poner:
   ```json
   {
     "banner_a_home": {
       "activo": true,
       "imagen": "assets/banner-alcaldia.jpg",
       "link": "https://sonsonatecentro.gob.sv",
       "alt": "Alcaldía de Sonsonate Centro"
     },
     "banner_b_nota": { "activo": false, "imagen": "", "link": "", "alt": "" }
   }
   ```
3. Commit en GitHub web. GitHub Pages redespliega en ~30s y el banner queda visible en todas las páginas con ese slot.

### Reglas de validación (anti-XSS)

- `link` debe empezar con `https://`, `mailto:`, `tel:` o `https://wa.me/`. Otros protocolos (incluido `javascript:`) se descartan silenciosamente.
- `imagen` debe ser una URL `https://` o una ruta relativa simple (solo `A-Za-z0-9._/-`). Si tiene `://` con otro protocolo o caracteres raros, se descarta.
- Si validación falla o el fetch de `banners.json` se cae, los banners simplemente no aparecen — la página sigue funcionando.

### Desactivar

Poner `"activo": false` y guardar. El banner desaparece en el próximo redeploy.

### Limitación actual

`banners.json` acepta una sola `imagen` por banner. El HTML tiene 3 slots responsive para Banner A (billboard 970×250, leaderboard 728×90, mobile 320×100) y 2 para Banner B (leaderboard + mobile). El script pone la misma imagen en todos los slots: queda legible pero puede verse deformada si el aspect-ratio no calza. Si en el futuro se quiere una imagen distinta por viewport, el JSON tiene que evolucionar a `{ billboard, leaderboard, mobile }` y el script cambiar en consecuencia.

## Historial reciente importante

- 2026-08-02/03: **más secciones y notas nuevas**. Se publicaron: el editorial del Día del Periodista (Opinión), el imán de fusión de China y el Proyecto Panamá de Anthropic (Tecnología), la pólvora en las fiestas de Chinameca —25 a 30 quemados, corregido a tiempo porque la primera fuente decía cinco— y el memorándum 10-2026 que dejó sin efecto las reglas de los desfiles cívicos. Desde la PC se publicó además **«Las dos caras de Bukele»**, el documental de Univision y El Faro (Política, con arte ilustrado propio).
- 2026-08-03: **auditoría editorial de las 99 notas**. Hallazgos: 89 titulares pasan de 70 caracteres (promedio 87, Google los corta); 71 notas no tienen ningún subtítulo H2; 91 no tienen cita textual destacada; 21 sin bajada y 10 sin pie de foto; promedio de 311 palabras. Se quitó del sitemap la URL `internas-de-nuevas-ideas-colapsan-el-centro-de-sonsonate.html`, que es un stub de redirección por cambio de slug y no una nota.
- 2026-08-03: **decisión editorial** — no dar cobertura al retroceso de los desfiles cívicos por considerarlo cortina de humo. Se priorizan tres temas pendientes: los despidos de docentes e instructores, la exclusión de proveedores del paquete escolar y los préstamos aprobados. Ver la sección de temas pendientes.
- 2026-07-31 (Día del Periodista): se crearon **3 secciones nuevas**, todas con contenido desde el día uno: **Opinión** (abre con el editorial del Día del Periodista, sin firma — badge propio, byline "Editorial · Pluma Libre", JSON-LD `OpinionNewsArticle`), **Tecnología** (imán de fusión de China + Proyecto Panamá de Anthropic) y **Entrevistas** (sembrada con las 2 entrevistas reales de HABLEMOS: Ever Castillo y Manuel Gil; los anuncios de "estará en HABLEMOS" quedaron fuera por ser avisos, no entrevistas). El sitio pasó de 7 a 10 secciones.
- 2026-07-31: **la portada del home llevaba 5 días congelada** en la nota del FMLN del 26-jul, porque nada sube solo al hero. Se promovió el editorial a principal y se refrescaron las secundarias. **Recordar marcar el estado (portada/secundaria/grid) al publicar desde el editor**, o el home se envejece solo.
- 2026-07-28/30: sesión larga de publicación. **6 notas nuevas**: Krisma Mancía (Cultura, obituario con el ángulo del despido del Ministerio de Cultura), Claudia Ortiz vs. fotógrafos de la Asamblea (Política, primicia — ningún medio lo levantó), Seminario de Vida en el Espíritu Santo de la Parroquia La Resurrección (Religión), Ángel Madrid candidato de ARENA casilla 2 (Política, seguimiento de la del 25-jul donde pedía casilla 3), 51 años de la masacre del 30 de julio de 1975 en la UES (Social) e incendios en Europa/Gironda (Internacional).
- 2026-07-30: **SEO e indexación**. Auditoría del sitio: 7 notas no estaban en `sitemap.xml` (ya agregadas) y solo 11 de 96 URLs tenían `<lastmod>` (ahora 91). Se creó **`rss.xml`** (30 notas, validado), **`llms.txt`** (para que Gemini/ChatGPT citen con crédito) y `herramientas-generar-feed.py` que regenera ambos desde `articulos/`. `<link rel="alternate">` en las 102 páginas y `robots.txt` declara sitemap + RSS. **Confirmado que Google indexa el sitio** (aparece en resultados). **Pendiente crítico: dar de alta Google Search Console** — sin eso no se puede medir posicionamiento.
- 2026-07-30: ojo con la marca. Compiten en buscadores `plumalibrenews.com` (Westchester, NY), `plumalibre.com` y "Pluma Libre Newspaper". Además existe una página `facebook.com/plumalibre.net` asociada a Sonsonate que conviene cerrar o redirigir para no dividir la señal con `plumalibre.press`.
- 2026-07-30: **conflicto de merge** con notas publicadas desde el editor (VAMOS diáspora, Madrid en HABLEMOS, parque Rafael Campo). Se resolvió conservando todas las cards. **Hacer `git pull` antes de tocar `index.html`** si alguien más está publicando.
- 2026-07-18 (tarde): publicadas 4 notas nacionales: deuda pública $34,630M (Economía, foto BCR Wikimedia CC BY-SA 4.0), sequía en el oriente (Social, foto USDA Wikimedia CC BY-SA 2.0), Asamblea aprueba $1.35M para estadios con contraste Colonia Izalco (Política, foto aérea de estadio de la nota oficial de la Asamblea — la primera versión usó una foto del Salón Azul de 2015 con Sánchez Cerén y se reemplazó el mismo día) y Claudia Ortiz vs. Vamos (Política, foto LPG/Wikimedia CC BY 3.0). Cards en home + sección + sitemap. Fuentes: BCR/elsalvador.com, MARN/Infobae, EDH/Asamblea, Diario El Mundo.
- 2026-07-18: publicadas 2 notas de Social: condena de 26 años por abuso de menor en Sonsonate Centro (portada/hero, imagen = arte oficial FGR recortado, `assets/nota-condena-fgr-sonsonate.jpg`) y desarticulación de red de narcotráfico en Sonsonate (2 fotos oficiales de la FGR: `assets/nota-narco-operativo-sonsonate.jpg` principal + `nota-narco-droga-incautada.jpg` inline). Cards en home + Social + sitemap. Fuentes: FGR (Facebook oficial), La Noticia SV, Infobae. El sismo de Chiapas salió del hero pero sigue en grid y sección.
- Migración completa de Netlify (suspendido) a GitHub Pages
- Editor pasó de v8 a v9: integración del generador de posts como 5ta pestaña
- Eliminación de `herramientas/redes.html` (redundante tras integración)
- 2026-04-23: limpieza de contenido de prueba (holalala.html + 2 cards rotas en home + imagen huérfana)
- 2026-04-23: Google Analytics 4 activo (`G-TZRTJLP5KT`)
- 2026-04-23: formulario de contacto migrado de Netlify Forms a Formspree (endpoint `xdayypog`)
- 2026-07-03: publicada nota de Deportes "Cabo Verde cae 3-2 ante Argentina en la prórroga" (Mundial 2026) con 2 fotos propias (`assets/nota-caboverde-argentina.jpg` y `nota-caboverde-celebracion.jpg`); card agregada a home + sección Deportes + sitemap. **Ojo:** el crédito de foto quedó como "Selección de Cabo Verde (FCF)" — verificar/ajustar la fuente real de las imágenes.
- 2026-07-03: agregadas 6 notas para nivelar secciones (mezcla local/nacional/internacional), todas con fotos de Wikimedia Commons con crédito CC/CC0: Política (reforma reelección indefinida), Economía (FMI ~4% + Bitcoin 7,600 BTC), Internacional (ofensiva rusa sobre Kiev; Keiko Fujimori presidenta de Perú), Religión (excomunión Sociedad San Pío X, seguimiento de la nota lefebvrista), Cultura (Fiestas Julias 2026). Cards en home + su sección + sitemap. Quitado el "Próximamente" de `internacional.html`. Generadas con script que reutiliza la estructura de la nota de Cabo Verde. Todas las secciones quedaron en 2-3 notas.

## Temas priorizados (decisión del 3-ago-2026)

1. **Despidos** — Bases Magisteriales denunció que entre el 27 y 28 de julio se despidió a **más de 24 instructores de cachiporristas en Sonsonate** por pertenecer a la comunidad LGBTIQ+, con instrucción a los directores. Solo en Sonsonate. El MINED no se ha pronunciado y el memorándum 10-2026 no los menciona. Vocero: David Rodríguez. Aparte, el caso de las maestras del Centro Escolar Rafael Campo, ya tocado en HABLEMOS con Ángel Madrid. **Nadie ha buscado a los despedidos.**
2. **Proveedores del paquete escolar** — la Coordinadora Nacional de Proveedores de Útiles Escolares denuncia que **600 a 700 pequeños comerciantes** quedaron fuera del programa 2026, con $12 millones destinados a útiles. Gato Encerrado documentó la adjudicación a **cinco empresas**. La ministra desmiente exclusión de productores nacionales. Pluma Libre ya publicó la convocatoria a la concentración del 29 de julio: hay hilo abierto.
3. **Préstamos** — el 28 de julio la Comisión de Hacienda avaló operaciones por **$733.8 millones** con dictamen favorable unánime (BCIE $155M movilidad urbana, $185M agua de Guluchapa, ratificación de $340M, CAF $75M para DoctorSV) más una redistribución de $226M de excedente tributario, de los cuales **$69 millones van a Educación para los paquetes escolares de 2027**.

**El cruce que nadie ha hecho:** el Estado destina $69 millones a los paquetes escolares de 2027 mientras 600-700 proveedores pequeños denuncian que los excluyeron de los de 2026.

## Nota pendiente: entrevista a Ángel Madrid en HABLEMOS (31-jul-2026)

La entrevista se grabó el viernes 31. Falta escribir la **nota derivada** (nota de declaraciones)
a partir de la transcripción. Decisiones ya tomadas en la sesión:

- **Formato:** nota de declaraciones, no transcripción. Titular entrecomillado con una frase
  **textual** — si se cambia una palabra, se van las comillas.
- **NO usar el conteo de seguidores** (53 mil en su página verificada de Facebook). Decisión del
  director: contar seguidores ajenos desde un medio que también los tiene se lee como comparación
  y no le aporta nada al lector.
- **Sí sirve como contexto**, y sale de su propia biografía pública: es abogado de la República,
  **periodista y columnista de El Diario de Hoy**, y tiene el podcast *#PupusasPolíticayCafé*.
  Ojo: siendo colega, la nota debe sostenerse sola por lo que diga, sin apoyarse en su condición
  de periodista.
- **No repetir** lo ya publicado: pidió la casilla 3 en las internas y quedó ratificado en la
  casilla 2; anunció gira territorial; dijo que "Sonsonate merece diputados que no solo lleguen a
  presionar un botón".
- **Balance electoral:** sería la tercera nota de Madrid en una semana contra una de Kompagil
  (FMLN). El director explicó que a Manuel Gil se le dio el mismo trato en su momento, así que el
  criterio es parejo. Aun así, conviene que la próxima sea de otro candidato.

Flujo acordado: la transcripción se hace en la PC (subtítulos automáticos de YouTube o Whisper
local) y se pega en crudo — sin limpiar — para que Claude ordene, identifique hablantes y saque
el titular.

## Pendientes abiertos de la sesión del 30-jul-2026

1. ~~**Google Search Console** — sin dar de alta.~~ ✅ **Resuelto 2026-08-01**: propiedad de dominio `plumalibre.press` verificada por TXT en Cloudflare DNS, en la cuenta `prensaplumalibre@gmail.com` (la misma del GA4). Sitemap y `rss.xml` enviados. El «1 error» del sitemap era una URL con el dominio viejo `plumalibre.github.io` (nota de Ever Castillo), corregida en commit `55633a2`. Los datos de posicionamiento empiezan a aparecer en 2-3 días.
2. **Nota de Krisma Mancía** — el titular todavía empieza con "Muere", que en un obituario de días atrás sugiere que pasó hoy. Se propuso cambiarlo a formato `Krisma Mancía (1980-2026)` y quedó sin decidir.
3. **Nota de la UES (30 de julio)** — la portada compone 3 fotos de marchas conmemorativas aportadas por la redacción. **Faltan dos datos**: si son de la jornada de 2026 o de archivo (la gente lleva mascarilla, lo que sugiere 2021-2022) y **de quién son, para acreditarlas**. El pie de foto actual no atribuye fecha a propósito.
4. **Nota del Seminario del Espíritu Santo** — el video decía "FALTA 1 DÍA" cuando faltaban dos. Verificar con el hno. Adelso Torres (7852-7509) si hubo actividad el jueves 30.
5. **Nota de Japón/Kumamoto** — nunca se hizo. El sismo de 7.1 del 28-jul dejó el Aeon Mall de Kashima colapsado con 20-30 atrapados. El sitio no tiene ni una línea sobre esto.
6. **Editor** — la rama `claude/kumamoto-earthquake-july-cd59ip` tiene la actualización automática del RSS. **Falta mergear a `main`** para que Cloudflare Pages la despliegue.
7. **Equilibrio electoral** — ya van 2 notas de Ángel Madrid (ARENA) y 1 de Kompagil (FMLN) rumbo a 2027. Conviene balancear la cobertura de candidaturas de Sonsonate.

## Imágenes: cómo llegan a Claude

Pegar una imagen con Ctrl+V **no genera archivo** — Claude la ve pero no puede guardarla en el repo. Hay que mandarla **con el clip de adjuntar** (desde el celular funciona bien) o subirla a Google Drive, que Claude sí puede leer. También sirve subirla directo a `assets/` desde GitHub web con el nombre exacto que espera la nota.

## Pendientes críticos (Tier 1)

1. ~~**Google Analytics 4** — placeholder hardcoded en TODAS las páginas, pendiente de reemplazar.~~ ✅ **Resuelto 2026-04-23**: GA4 activo con ID `G-TZRTJLP5KT` (cuenta `prensaplumalibre@gmail.com`). Integrado en homepage, 5 secciones, sobre-nosotros, plantilla de artículos y en el template `genHTML()` del editor v9 (así cada nota nueva nace ya trackeada).
2. **Contenido placeholder** — ~~sobre-nosotros genérico~~ ✅ sobre-nosotros ya tiene contenido real (historia, equipo, redes; revisado 2026-07-02: se agregó Internacional a la lista de secciones, JSON-LD AboutPage, "cofundador"→"codirector" y se unificó Facebook a `facebook.com/plumalibre.press` en todo el sitio y en el editor). ~~Cards de ejemplo con fotos azules en secciones~~ ✅ **Resuelto 2026-07-02**: se publicó 1 nota real por sección (7 notas, fotos de Wikimedia Commons con crédito CC en el pie de foto) y las cards placeholder de `secciones/*.html` se reemplazaron por cards reales. Restante: `articulos/brigada-medica-atiende-200-personas-zona-rural.html` aún usa foto placeholder naranja (nota real, falta foto), y la card "Contribuyentes... declarar la renta" tiene badge **Religión** aunque es tema económico (revisar si se reclasifica).
3. **Seguridad del token** — ✅ **Mayormente resuelto 2026-07-05**: el proxy `/gh/` del Worker `plumalibre-analytics` quedó activo con un token fine-grained de la cuenta `plumalibre` (solo repo del sitio, Contents R/W) cargado como secreto de Cloudflare (`GITHUB_TOKEN`). El editor enruta automáticamente todas las llamadas a GitHub por el proxy cuando la config del Worker (URL + API Key en 📊 Stats) está completa; el token ya no necesita vivir en el navegador. **Restante:** quitar el token XOR+base64 embebido en `editor.html` (campos `data`/`check`) y revocar ese token viejo en GitHub; borrar el token del campo ⚙️ Configuración GitHub del editor en los dispositivos donde esté guardado. Ojo: el token del proxy quedó sin fecha de expiración — rotarlo a futuro por uno con vencimiento.
4. ~~**Formulario de contacto roto** — sobre-nosotros.html usa Netlify Forms (suspendido), hay que migrar a Formspree~~ ✅ **Migrado 2×**: primero a Formspree (2026-04-23), y el 2026-07-08 a **FormSubmit** (`https://formsubmit.co/ajax/redaccion@plumalibre.press`, activado y probado) porque Formspree free no permitía cambiar el destinatario del Gmail al correo profesional. Honeypot `_honey` anti-spam, `_captcha=false`, `_template=table`.

## Correo profesional (Zoho Mail free, desde 2026-07-08)

- **redaccion@plumalibre.press** = buzón real y superadmin (webmail: mail.zoho.com; admin: mailadmin.zoho.com).
- **contacto@** y **publicidad@** = **alias** de redaccion@ (todo cae en la misma bandeja; se puede enviar "como" cualquiera). `direccion@` = usuario aparte sin usar.
- DNS en Namecheap: MX (Custom MX) + SPF + DKIM, todos verificados ✅. Opción "Quiero anunciarme / Publicidad" agregada al form; correos visibles en la web: contacto@ y publicidad@.

## Convenciones de código

- Español para comentarios, variables y funciones nuevas cuando sea natural
- HTML/CSS/JS inline en archivos únicos (no separar en archivos múltiples por ahora)
- Minificación conservadora: legible pero compacto
- No introducir frameworks (React, Vue, etc.) sin discutirlo primero
- No romper el deploy actual: siempre probar localmente antes de pushear

## Comandos útiles

```powershell
# Estado y deploy
git status
git add .
git commit -m "mensaje"
git push

# Sincronizar (por si el editor publicó desde otro dispositivo)
git pull

# Probar localmente
# Abrir index.html o editor.html directamente en el navegador
```

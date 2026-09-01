const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

assert(css.includes('NOTAS Y PUBLICIDAD EN GRILLA — v23'));
assert(css.includes('.article-page .article-body .article-img-body'));
assert(css.includes('width: min(860px, calc(100vw - 32px));'));
assert(css.includes('object-fit: contain !important;'));
assert(css.includes('body:has(.home-hero) .news-grid > .pl-ad--banner-c'));
assert(css.includes('aspect-ratio: 4 / 3;'));
// El arte del anuncio es cuadrado y la celda 4:3: sin min-*: 0 desborda y se recorta.
assert(/min-width: 0;\s*min-height: 0;/.test(css));

// v25: secciones en la barra navy + una sola columna en pantallas grandes.
const js = fs.readFileSync(path.join(root, 'assets', 'install.js'), 'utf8');
assert(js.includes('header-rail__track'), 'install.js no inyecta el riel del header');
assert(/SECCIONES\s*=\s*\[/.test(js));
assert(css.includes('.header.scrolled .header-rail'));
// El prefijo body:has(.home-hero) pesa mas: sin repetirlo, la portada ignora la columna.
assert(css.includes('body:has(.home-hero) .section-rail__track'));
assert(/max-width:\s*1240px;\s*\r?\n\s*margin-inline:\s*auto;/.test(css));
// Comentarios balanceados: un */ suelto invalida las reglas que le siguen.
assert.strictEqual((css.match(/\/\*/g) || []).length, (css.match(/\*\//g) || []).length,
  'comentarios CSS desbalanceados');

// Las versiones no se fijan a un numero: lo que importa es que index y sw vayan
// sincronizados, porque si no el service worker sirve el CSS viejo.
const vCss = home.match(/style\.css\?v=(\d+)/);
const vSwLink = home.match(/\/sw\.js\?v=(\d+)/);
const vSw = sw.match(/const CACHE_VERSION = 'pl-v(\d+)';/);
assert(vCss && vSwLink && vSw, 'faltan las versiones de style.css o del service worker');
assert.strictEqual(vSwLink[1], vSw[1], 'index.html pide un sw.js con version distinta a CACHE_VERSION');

console.log('OK: fotos proporcionales y publicidad alineada en la portada.');

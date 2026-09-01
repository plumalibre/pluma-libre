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

// Las versiones no se fijan a un numero: lo que importa es que index y sw vayan
// sincronizados, porque si no el service worker sirve el CSS viejo.
const vCss = home.match(/style\.css\?v=(\d+)/);
const vSwLink = home.match(/\/sw\.js\?v=(\d+)/);
const vSw = sw.match(/const CACHE_VERSION = 'pl-v(\d+)';/);
assert(vCss && vSwLink && vSw, 'faltan las versiones de style.css o del service worker');
assert.strictEqual(vSwLink[1], vSw[1], 'index.html pide un sw.js con version distinta a CACHE_VERSION');

console.log('OK: fotos proporcionales y publicidad alineada en la portada.');

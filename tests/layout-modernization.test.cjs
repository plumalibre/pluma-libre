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
assert(home.includes('style.css?v=23'));
assert(home.includes('/sw.js?v=37'));
assert(sw.includes("const CACHE_VERSION = 'pl-v37';"));

console.log('OK: fotos proporcionales y publicidad alineada en la portada.');

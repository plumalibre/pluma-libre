const assert=require('assert');
const fs=require('fs');
const path=require('path');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const hero=Array.from(
  html.matchAll(/<article class="home-hero-(?:principal|secondary)">(?:(?!<\/article>)[\s\S])*?href="articulos\/([^"]+)/g),
  match=>match[1]
);
const cards=Array.from(
  html.matchAll(/<article class="card">(?:(?!<\/article>)[\s\S])*?href="articulos\/([^"]+)/g),
  match=>match[1]
);
const repeated=hero.filter(fn=>cards.includes(fn));

assert.strictEqual(hero.length,5,'la portada debe tener una principal y cuatro secundarias');
assert.strictEqual(new Set(hero).size,hero.length,'una nota no puede ocupar dos lugares del carrusel');
assert.deepStrictEqual(repeated,[],'las notas del carrusel no deben repetirse en Últimas Noticias');
assert(html.includes('quitarDuplicadasDelGrid'),'debe existir la protección de navegador contra HTML antiguo');

console.log('OK: 5 destacadas únicas, sin repeticiones en Últimas Noticias.');

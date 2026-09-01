// Instalación PWA — agrega un item "📱 Instalar app" al menú dropdown.
// El item queda oculto hasta que el navegador emite `beforeinstallprompt`
// (Chrome/Edge desktop+Android). En iOS Safari el evento no existe, así que
// igual mostramos el item con instrucciones.
(function(){
  var deferred = null;
  var li = null;

  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  function ensureItem(){
    if (li) return li;
    var ul = document.querySelector('.nav ul');
    if (!ul) return null;
    li = document.createElement('li');
    li.className = 'nav-install';
    li.hidden = true;
    var a = document.createElement('a');
    a.href = '#';
    a.textContent = '📱 Instalar app';
    a.addEventListener('click', function(e){
      e.preventDefault();
      if (deferred){
        deferred.prompt();
        deferred.userChoice.then(function(choice){
          if (choice.outcome === 'accepted') li.hidden = true;
          deferred = null;
        });
      } else if (isIOS()){
        alert('Para instalar:\n\n1. Tocá el botón Compartir (□↑) abajo\n2. Bajá y elegí "Añadir a pantalla de inicio"');
      } else {
        alert('Si la app no aparece como sugerencia, instalala desde el menú del navegador (⋮ → "Instalar app").');
      }
    });
    li.appendChild(a);
    ul.appendChild(li);
    return li;
  }

  if (isStandalone()) return;

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferred = e;
    var item = ensureItem();
    if (item) item.hidden = false;
  });

  // Fallback iOS: el item aparece igual aunque no haya evento.
  if (isIOS()){
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){ var i = ensureItem(); if (i) i.hidden = false; });
    } else {
      var i = ensureItem(); if (i) i.hidden = false;
    }
  }

  window.addEventListener('appinstalled', function(){
    if (li) li.hidden = true;
    deferred = null;
  });
})();

// ============================================================
// Pop-up publicitario (Banner P) — se controla desde banners.json
// (clave banner_p_popup, la administra el editor en 📢 Publicidad).
// Vive acá porque install.js lo cargan TODAS las páginas del sitio,
// así el pop-up funciona en las 100+ notas sin tocar cada archivo.
// Reglas: se muestra a lo sumo una vez cada `frecuencia_horas` por
// visitante (localStorage), con retraso de 2 s, cierre con ✕, con
// Escape o tocando el fondo. Si cambia la campaña (campo `v` que el
// editor sella con cada imagen nueva — la ruta assets/banner-p.jpg
// siempre es la misma, por eso NO sirve comparar solo la imagen),
// vuelve a mostrarse aunque no haya vencido el plazo.
(function(){
  var LS_TS='pl_popup_ts', LS_IMG='pl_popup_img';
  function esPortada(){var p=location.pathname;return p==='/'||p==='/index.html';}
  function esNota(){return /\/articulos\//.test(location.pathname)||document.body.classList.contains('article-page');}
  function isUrl(u){return typeof u==='string'&&(/^https:\/\//i.test(u)||/^(mailto:|tel:)/i.test(u));}
  function isImg(u){return typeof u==='string'&&(/^https:\/\//i.test(u)||/^[A-Za-z0-9._\/-]+$/.test(u));}
  function abs(u){return /^https?:\/\//i.test(u)||(u&&u.charAt(0)==='/')?u:'/'+u;}
  function mostrar(b){
    var st=document.createElement('style');
    st.textContent='.pl-pop-ov{position:fixed;inset:0;z-index:9999;background:rgba(8,26,65,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .3s}'+
      '.pl-pop-ov.on{opacity:1}'+
      '.pl-pop{position:relative;max-width:min(430px,92vw);width:100%;background:#fff;border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,.35);overflow:hidden;transform:translateY(14px) scale(.97);transition:transform .3s}'+
      '.pl-pop-ov.on .pl-pop{transform:none}'+
      '.pl-pop-tag{position:absolute;top:8px;left:8px;z-index:1;background:rgba(8,26,65,.72);color:#fff;font:600 10px/1 Outfit,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:4px 8px;border-radius:4px}'+
      '.pl-pop-x{position:absolute;top:6px;right:6px;z-index:1;width:36px;height:36px;border:0;border-radius:50%;background:rgba(8,26,65,.72);color:#fff;font-size:20px;line-height:1;cursor:pointer;display:grid;place-items:center}'+
      '.pl-pop-x:hover{background:#081A41}'+
      '.pl-pop a{display:block}'+
      '.pl-pop img{display:block;width:100%;height:auto;max-height:76vh;object-fit:contain;background:#fff}';
    document.head.appendChild(st);
    var ov=document.createElement('div');ov.className='pl-pop-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Publicidad');
    var card=document.createElement('div');card.className='pl-pop';
    var tag=document.createElement('span');tag.className='pl-pop-tag';tag.textContent='Publicidad';
    var x=document.createElement('button');x.className='pl-pop-x';x.type='button';x.setAttribute('aria-label','Cerrar publicidad');x.innerHTML='×';
    var a=document.createElement('a');a.href=b.link;a.target='_blank';a.rel='noopener nofollow sponsored';
    var img=document.createElement('img');img.src=abs(b.imagen);img.alt=b.alt||'Publicidad';
    a.appendChild(img);card.appendChild(tag);card.appendChild(x);card.appendChild(a);ov.appendChild(card);
    function cerrar(){ov.classList.remove('on');setTimeout(function(){ov.remove();st.remove();},320);document.removeEventListener('keydown',esc);}
    function esc(e){if(e.key==='Escape')cerrar();}
    x.addEventListener('click',cerrar);
    ov.addEventListener('click',function(e){if(e.target===ov)cerrar();});
    document.addEventListener('keydown',esc);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){requestAnimationFrame(function(){ov.classList.add('on');});});
    try{localStorage.setItem(LS_TS,String(Date.now()));localStorage.setItem(LS_IMG,String(b.imagen)+'|'+String(b.v||''));}catch(e){}
  }
  function init(){
    fetch('/banners.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(c){
      if(!c)return;var b=c.banner_p_popup;
      if(!b||b.activo!==true||!isUrl(b.link)||!b.imagen||!isImg(b.imagen))return;
      var donde=Array.isArray(b.ubicaciones)?b.ubicaciones:['nota_interno'];
      var aca=(esNota()&&donde.indexOf('nota_interno')>=0)||(esPortada()&&donde.indexOf('home_top')>=0);
      if(!aca)return;
      var horas=parseFloat(b.frecuencia_horas);if(isNaN(horas)||horas<1)horas=24;if(horas>168)horas=168;
      try{
        var ts=parseInt(localStorage.getItem(LS_TS)||'0',10);
        var vista=localStorage.getItem(LS_IMG)||'';
        if(vista===String(b.imagen)+'|'+String(b.v||'')&&Date.now()-ts<horas*3600000)return;
      }catch(e){}
      setTimeout(function(){mostrar(b);},2000);
    }).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

// Secciones en la barra compacta — v25.
// Al bajar, el header se vuelve navy y el riel de secciones queda fuera de
// vista: estos enlaces lo reemplazan sin tocar la altura del header (cambiarla
// al cruzar el umbral reintroduce el bucle de scroll del hotfix de style.css).
// Se inyecta por JS y no en el HTML porque el header esta repetido en las 167
// paginas del sitio.
(function(){
  var SECCIONES = [
    ['Politica', '/secciones/politico.html'],
    ['Economia', '/secciones/economico.html'],
    ['Deportes', '/secciones/deportivo.html'],
    ['Social', '/secciones/social.html'],
    ['Religion', '/secciones/religioso.html'],
    ['Cultura', '/secciones/cultural.html'],
    ['Internacional', '/secciones/internacional.html'],
    ['Opinion', '/secciones/opinion.html'],
    ['Tecnologia', '/secciones/tecnologico.html'],
    ['Entrevistas', '/secciones/entrevistas.html']
  ];
  // Con acentos para mostrar; el array de arriba se mantiene sin ellos para no
  // depender del encoding del archivo.
  var ACENTOS = {
    'Politica': 'Política',
    'Economia': 'Economía',
    'Religion': 'Religión',
    'Opinion': 'Opinión',
    'Tecnologia': 'Tecnología'
  };

  function montar(){
    var wrap = document.querySelector('.header .wrap');
    if(!wrap || wrap.querySelector('.header-rail')) return;
    var boton = wrap.querySelector('.menu-btn');

    var nav = document.createElement('nav');
    nav.className = 'header-rail';
    nav.setAttribute('aria-label', 'Secciones');

    var track = document.createElement('div');
    track.className = 'header-rail__track';

    var actual = location.pathname.replace(/\/+$/, '');
    SECCIONES.forEach(function(s){
      var a = document.createElement('a');
      a.href = s[1];
      a.textContent = ACENTOS[s[0]] || s[0];
      if(actual && actual.indexOf(s[1]) === 0) a.className = 'on';
      track.appendChild(a);
    });

    nav.appendChild(track);
    if(boton) wrap.insertBefore(nav, boton); else wrap.appendChild(nav);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

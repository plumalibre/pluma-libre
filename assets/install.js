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

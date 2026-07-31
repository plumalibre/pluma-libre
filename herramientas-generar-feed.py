# -*- coding: utf-8 -*-
"""Genera rss.xml y llms.txt a partir de las notas de articulos/.
Uso: python3 herramientas-generar-feed.py"""
import io, os, re, glob
from email.utils import format_datetime
from datetime import datetime, timezone

BASE='https://plumalibre.press'
MAX_ITEMS=30

def meta(h, prop):
    m=re.search(r'<meta[^>]+property="og:%s"[^>]+content="([^"]*)"'%prop, h) or \
      re.search(r'<meta[^>]+content="([^"]*)"[^>]+property="og:%s"'%prop, h)
    return m.group(1) if m else ''

def esc(s):
    return (s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'))

notas=[]
for f in sorted(glob.glob('articulos/*.html')):
    fn=os.path.basename(f)
    if 'plantilla' in fn: continue
    h=io.open(f, encoding='utf-8').read()
    fecha=re.search(r'article:published_time" content="(\d{4}-\d{2}-\d{2})', h)
    if not fecha: continue
    titulo=meta(h,'title') or fn.replace('.html','').replace('-',' ')
    titulo=re.sub(r'\s*—\s*Pluma Libre\s*$','',titulo)
    badge=re.search(r'class="badge badge-brand">([^<]+)</span>', h)
    notas.append({
        'fn':fn, 'titulo':titulo, 'desc':meta(h,'description'),
        'img':meta(h,'image'), 'fecha':fecha.group(1),
        'seccion':badge.group(1).strip() if badge else 'Noticias',
    })

notas.sort(key=lambda n:(n['fecha'], n['fn']), reverse=True)
ahora=format_datetime(datetime.now(timezone.utc))

# ---------- RSS ----------
it=''
for n in notas[:MAX_ITEMS]:
    d=datetime.strptime(n['fecha'],'%Y-%m-%d').replace(tzinfo=timezone.utc)
    it+=('  <item>\n'
         '    <title>%s</title>\n'
         '    <link>%s/articulos/%s</link>\n'
         '    <guid isPermaLink="true">%s/articulos/%s</guid>\n'
         '    <description>%s</description>\n'
         '    <category>%s</category>\n'
         '    <pubDate>%s</pubDate>\n'
         '%s'
         '  </item>\n')%(esc(n['titulo']),BASE,n['fn'],BASE,n['fn'],esc(n['desc']),
                          esc(n['seccion']),format_datetime(d),
                          ('    <enclosure url="%s" type="image/jpeg"/>\n'%esc(n['img'])) if n['img'] else '')

rss=('<?xml version="1.0" encoding="UTF-8"?>\n'
 '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
 '<channel>\n'
 '  <title>Pluma Libre</title>\n'
 '  <link>%s/</link>\n'
 '  <description>Medio de comunicación digital independiente de Sonsonate, El Salvador. '
 'Cobertura local, nacional e internacional.</description>\n'
 '  <language>es-SV</language>\n'
 '  <lastBuildDate>%s</lastBuildDate>\n'
 '  <atom:link href="%s/rss.xml" rel="self" type="application/rss+xml"/>\n'
 '%s'
 '</channel>\n</rss>\n')%(BASE,ahora,BASE,it)
io.open('rss.xml','w',encoding='utf-8').write(rss)

# ---------- llms.txt ----------
secs={}
for n in notas: secs.setdefault(n['seccion'],[]).append(n)
l=('# Pluma Libre\n\n'
 '> Medio de comunicación digital independiente de Sonsonate, El Salvador. '
 'Periodismo local, nacional e internacional, sin ataduras políticas ni institucionales.\n\n'
 'Sitio: %s\nContacto: redaccion@plumalibre.press\nFeed RSS: %s/rss.xml\n'
 'Mapa del sitio: %s/sitemap.xml\n\n'
 'El contenido puede citarse indicando la fuente y enlazando a la nota original.\n\n'
 '## Secciones\n\n')%(BASE,BASE,BASE)
for s in ['Política','Economía','Deportes','Social','Religión','Cultura','Internacional']:
    l+='- [%s](%s/secciones/%s.html)\n'%(s,BASE,{'Política':'politico','Economía':'economico',
        'Deportes':'deportivo','Social':'social','Religión':'religioso','Cultura':'cultural',
        'Internacional':'internacional'}[s])
l+='\n## Notas recientes\n\n'
for n in notas[:40]:
    l+='- [%s](%s/articulos/%s) — %s, %s\n'%(n['titulo'],BASE,n['fn'],n['seccion'],n['fecha'])
l+='\n## Sobre el medio\n\n- [Quiénes somos](%s/sobre-nosotros.html)\n'%BASE
io.open('llms.txt','w',encoding='utf-8').write(l)
print('rss.xml: %d items | llms.txt: %d notas'%(min(len(notas),MAX_ITEMS),len(notas)))

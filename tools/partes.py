#!/usr/bin/env python3
"""Corta um projeto HyperFrames em uma parte de tempo [ini, fim) para render em paralelo.
uso: partes.py PROJETO INI FIM DESTINO
Copia o projeto para DESTINO e desloca todos os clipes em -INI."""
import re, shutil, sys
from pathlib import Path

src, ini, fim, dst = Path(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), Path(sys.argv[4])
if dst.exists(): shutil.rmtree(dst)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('.hyperframes', 'renders'))
D = round(fim - ini, 4)
f = lambda x: ('%.4f' % x).rstrip('0').rstrip('.')

TAG = re.compile(r'<(div|audio|video)\b[^>]*\bdata-start="[^"]*"[^>]*>')
def ajusta(html, raiz_ids):
    out, pos = [], 0
    for m in TAG.finditer(html):
        t = m.group(0)
        idm = re.search(r'\bid="([^"]*)"', t)
        eid = idm.group(1) if idm else ''
        if eid in raiz_ids or 'data-composition-src' in t:
            t = re.sub(r'data-start="[^"]*"', 'data-start="0"', t)
            t = re.sub(r'data-duration="[^"]*"', 'data-duration="%s"' % f(D), t)
        else:
            s = float(re.search(r'data-start="([^"]*)"', t).group(1))
            dm = re.search(r'data-duration="([^"]*)"', t)
            d = float(dm.group(1)) if dm else 1e9
            e = s + d
            if e <= ini + 1e-4 or s >= fim - 1e-4:
                t = t[:-1] + ' data-hidden="true">' if m.group(1) == 'div' else None
                if t is None:  # remove o <audio ...></audio> inteiro
                    end = html.find('</audio>', m.end())
                    out.append(html[pos:m.start()]); pos = end + len('</audio>'); continue
            else:
                ns = s - ini; corte = 0.0
                if ns < 0:
                    corte = -ns; ns = 0.0
                nd = min(e, fim) - ini - ns
                t = re.sub(r'data-start="[^"]*"', 'data-start="%s"' % f(ns), t)
                if dm: t = re.sub(r'data-duration="[^"]*"', 'data-duration="%s"' % f(nd), t)
                if corte and m.group(1) in ('audio', 'video'):
                    ms = re.search(r'data-media-start="([^"]*)"', t)
                    base = float(ms.group(1)) if ms else 0.0
                    if ms: t = re.sub(r'data-media-start="[^"]*"', 'data-media-start="%s"' % f(base + corte), t)
                    else: t = t[:-1] + ' data-media-start="%s">' % f(base + corte)
                    t = re.sub(r'\s*data-fade-in="[^"]*"', '', t)
        out.append(html[pos:m.start()]); out.append(t); pos = m.end()
    out.append(html[pos:])
    return ''.join(out)

idx = dst / 'index.html'
h = idx.read_text()
TOT = re.search(r'id="root"[^>]*data-duration="([^"]*)"', h).group(1)
idx.write_text(ajusta(h, {'root'}))
for c in (dst / 'compositions').glob('*.html'):
    h = c.read_text()
    h = re.sub(r'(id="root"[^>]*data-duration=")[^"]*"', lambda m: m.group(1) + f(D) + '"', h, count=1)
    h = ajusta(h, {'root'})
    h = h.replace('< %s - 0.05' % TOT, '< %s - 0.05' % f(D))
    # mundo 3D: relógio deslocado
    h = h.replace('frame(clock.t);', 'frame(clock.t + %s);' % f(ini)).replace("frame(0); window.__timelines", "frame(%s); window.__timelines" % f(ini))
    h = re.sub(r'const DUR = [\d.]+;', 'const DUR = %s;' % f(D), h) if 'frame(clock.t +' in h else h
    c.write_text(h)
print('parte', ini, fim, 'dur', D, '->', dst)

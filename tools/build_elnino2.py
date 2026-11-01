# "Quantos dias sem dormir?" no estilo mundo contínuo low-poly + cartões + legenda palavra por palavra.
# Rode: python3 tools/build_sono2.py   (usa a narração ElevenLabs de sono/)
import json, os, re, html, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "build_sono.py"), encoding="utf-8").read()
head = src.split("# ---------- mundo 3D ----------")[0]
head = head.replace('ROOT = os.path.join(HERE, "..", "sono")', 'ROOT = os.path.join(HERE, "..", "elnino2")')
a = head.index("CUTS = {"); b = head.index("MARKS = {}")
head = head[:a] + '''CUTS = {i: [(0, n)] for i, n in enumerate(["intro", "botos", "aviso", "empurra", "rios", "estrada", "regua", "encalhe", "tefe", "fogo", "estados", "nordeste", "chuvosa", "seca16", "afeta", "calor", "sul", "parte3", "cta"])}
''' + head[b:]
head = head.replace('GAP = {0: 0.3, 4: 0.6, 9: 0.8, 10: 0.8, 14: 0.6}', 'GAP = {0: 0.3, 1: 0.5, 2: 0.5, 10: 2.4, 11: 0.4, 17: 0.4}')
g = {"__file__": os.path.join(HERE, "build_sono.py")}
exec(head, g)
lines, shots, TOTAL = g["lines"], g["shots"], g["TOTAL"]
ROOT = os.path.join(HERE, "..", "elnino2"); COMP = os.path.join(ROOT, "compositions")
os.makedirs(COMP, exist_ok=True); os.makedirs(os.path.join(ROOT, "assets", "sfx"), exist_ok=True)
W = lambda li, wi=0: round(lines[li]["wt"][wi][0], 3)
END = lambda li: round(lines[li]["wt"][-1][1], 3)
GREY = [round(END(10) + 0.35, 3), round(W(11) - 0.15, 3)]

# ---------- mundo ----------
base = open(os.path.join(HERE, "mundo.js"), encoding="utf-8").read().split("  // ---------- cenários ----------")[0]
js = base + open(os.path.join(HERE, "avatar.js"), encoding="utf-8").read() + open(os.path.join(HERE, "elnino2_mundo.js"), encoding="utf-8").read()
js = js.replace("__SHOTS__", json.dumps(shots)).replace("__MARKS__", "{}").replace("__DUR__", str(TOTAL))
js = js.replace("    greyEl.style.opacity = 0;", f"    const gr = (t >= {GREY[0]} && t < {GREY[1]}) ? 1 : 0; greyEl.style.background = '#808080'; greyEl.style.mixBlendMode = 'saturation'; greyEl.style.opacity = gr;")
open(os.path.join(COMP, "mundo.html"), "w", encoding="utf-8").write(f"""<template>
  <style>
    #root{{position:absolute;inset:0;overflow:hidden;background:#cfe8ff}}
    #mundo-cv{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
    .mundo-fx{{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none}}
    #mundo-flash{{background:#fff;opacity:0}} #mundo-tint{{opacity:0}} #mundo-glitch{{opacity:0}}
    #mundo-vig{{background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%)}}
    .mundo-fontes{{position:absolute;left:-9999px;top:0;font-family:Oswald;font-weight:700}} .mundo-fontes b{{font-family:Inter;font-weight:700}}
  </style>
  <div id="root" data-composition-id="mundo" data-width="1080" data-height="1920" data-duration="{TOTAL}">
    <canvas id="mundo-cv" width="1080" height="1920"></canvas>
    <div id="mundo-tint" class="mundo-fx"></div>
    <div id="mundo-glitch" class="mundo-fx"></div>
    <div id="mundo-vig" class="mundo-fx"></div>
    <div id="mundo-flash" class="mundo-fx"></div>
    <div class="mundo-fontes" data-layout-ignore>Aa <b>Aa</b></div>
  </div>
  <script>
{js}
  </script>
</template>
""")

# ---------- cartões ----------
cards = []   # (id, start, end, html, anim)
def card(cid, t0, t1, inner, top=430, cls="card", anim="pop", extra=""):
    cards.append((cid, t0, t1, f'<div class="{cls}" style="top:{top}px;{extra}">{inner}</div>', anim))
def chips(items, color="#ffd23c"):
    return "".join(f'<span class="chip"><i style="background:{color}"></i>{html.escape(x)}</span>' for x in items)
def bar(label, cid, color, val0, val1):
    return f'<div class="bl"><span>{label}</span><b id="{cid}-v">{val1}%</b></div><div class="bt"><div id="{cid}" class="bf" style="background:{color};width:{val1}%" data-from="{val0}" data-to="{val1}"></div></div>'
def chart(cid, pts, color, label, note=""):
    w, h = 720, 240
    path = " ".join(("M" if i == 0 else "L") + f"{x * w:.0f},{h - y * h:.0f}" for i, (x, y) in enumerate(pts))
    return f'<div class="ct"><span>{label}</span><em>{note}</em></div><svg width="{w}" height="{h + 20}" viewBox="0 -10 {w} {h + 20}"><path d="M0,{h} L{w},{h}" stroke="rgba(255,255,255,.18)" stroke-width="3"/><path id="{cid}" class="ln" d="{path}" fill="none" stroke="{color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
title = lambda a, b="", col="#ffb03a": f'<div class="tt">{html.escape(a)}<br><span style="color:{col}">{html.escape(b)}</span></div>'

prof = '<div class="pf"><div class="av">B</div><div><div class="pn">Bessekai</div><div class="ph">@Bessekai · curiosidades</div></div><div class="fb">Seguir</div></div>'
def vbars(items, unit=""):
    cols = "".join(f'<div class="vc"><div class="vv">{v}{unit}</div><div class="vt"><div class="vbf" style="height:{h}%;background:{c}" data-to="{h}"></div></div><div class="vl">{l}</div></div>' for l, v, h, c in items)
    return f'<div class="vrow">{cols}</div>'
card("perfil", 0.0, W(1), prof, top=560)
card("p2", 0.4, W(1), '<span class="dot" style="background:#ff9a3a"></span>EL NIÑO · PARTE 2', top=190, cls="daychip", anim="slide")
card("botos", W(1), W(2), '<div class="lab">AMAZÔNIA · 2023</div><div class="big" style="color:#ff9ab8">+150 BOTOS</div><div class="sub">mortos em uma semana</div>', top=430)
card("aviso", W(2), W(3), title("UM AVISO", "DO QUE VEM?", "#ff4a5a"), top=250, cls="tw", anim="slam")
card("empurra", W(3), W(4), f'<div class="crow">{chips(["NORTE: chuva vai embora"], "#ff9a3a")}</div>', top=470, cls="cardlite")
card("rios", W(4), W(5), chart("c-rio", [(0, .85), (.3, .78), (.55, .55), (.8, .3), (1, .15)], "#3a9ae8", "NÍVEL DOS RIOS", "baixando"), top=430)
card("estrada", W(5), W(6), '<div class="lab">NA AMAZÔNIA, O RIO É A ESTRADA</div>' + f'<div class="crow">{chips(["comida", "remédio", "combustível", "escola"], "#5ad0ff")}</div>', top=420)
card("regua", W(6), W(7), '<div class="lab">RIO NEGRO · MANAUS · 2023</div><div class="big" style="color:#5ab0ff">12,70 m</div><div class="sub">menor nível desde 1902</div>', top=430)
card("encalhe", W(7), W(8), f'<div class="crow">{chips(["barcos encalhados", "comunidades isoladas", "areia no lugar do rio"], "#d8b878")}</div>', top=470, cls="cardlite")
card("tefe", W(8), W(9), '<div class="lab">LAGO TEFÉ · ÁGUA</div>' + vbars([("febre alta", "39 °C", 78, "#ffb03a"), ("lago Tefé", "+39 °C", 94, "#ff3a3a")]), top=410)
card("fogo", W(9), W(10), title("FLORESTA SECA", "= FOGO", "#ff6a1a"), top=250, cls="tw", anim="slam")
card("estados", W(10), END(10) + 0.3, '<div class="lab">BOLETIM DO GOVERNO · 2026</div><div class="sub" style="font-size:44px">seca piorando em</div>' + f'<div class="crow">{chips(["Roraima", "Acre", "Amazonas"], "#ff3a3a")}</div>', top=420)
cards.append(("pausa", GREY[0], GREY[1], '<div class="pause"><div class="pbtn"><i></i><i></i></div><div class="pl">Deixa o like <span class="heart"></span></div><div class="ps">e segue o <b>@Bessekai</b></div></div>', "fade"))
card("nordeste", W(11), W(12), title("AGORA,", "O NORDESTE", "#ffb03a"), top=250, cls="tw", anim="slam")
card("chuvosa", W(12), W(13), '<div class="lab">ESTAÇÃO CHUVOSA</div><div class="tl"><span class="hot" style="background:#3a9ae8">FEV</span><span class="hot" style="background:#3a9ae8">MAR</span><span class="hot" style="background:#3a9ae8">ABR</span><span>MAI</span></div><div class="sub">pode ficar mais curta</div>', top=430)
card("seca16", W(13), W(14), '<div class="lab">AGOSTO · SECA GRAVE</div><div class="big" style="color:#ff9a3a">16%</div>' + bar("DO NORDESTE", "b-s", "#ff9a3a", 0, 16) + '<div class="sub">a maior parte entre as regiões</div>', top=410)
card("afeta", W(14), W(15), f'<div class="crow">{chips(["quem planta", "o gado", "a água das cidades"], "#c8903a")}</div>', top=470, cls="cardlite")
card("calor", W(15), W(16), '<div class="lab">POUCA GENTE SABE</div><div class="big" style="font-size:96px;color:#ff8a3a">CALOR ACIMA DO NORMAL</div><div class="sub">em quase todo o Brasil</div>', top=400)
card("sul", W(16), W(17), '<div class="lab">ENQUANTO ISSO, NO SUL…</div><div class="big" style="font-size:110px;color:#5ab0ff">CHUVA</div>', top=430, extra="border-color:#5ab0ff")
card("parte3", W(17), W(18), title("PARTE 3:", "O SUL", "#5ab0ff"), top=250, cls="tw", anim="slam")
card("perfil2", W(18), TOTAL, prof, top=470)
card("emb", W(18) + 0.4, TOTAL, '<div class="big" style="font-size:80px;color:#5ab0ff">PARTE 3 EM BREVE</div>', top=760)

cards_html = "\n".join(f'<div id="k-{cid}" class="clip kwrap" data-start="{t0}" data-duration="{round(t1 - t0, 3)}" data-anim="{an}">{h}</div>' for cid, t0, t1, h, an in cards)
CARD_CSS = """
#root{position:absolute;inset:0;pointer-events:none;font-family:Inter}
.kwrap{position:absolute;left:0;top:0;width:1080px;height:1920px}
.card,.cardlite{position:absolute;left:150px;right:150px;padding:34px 40px;border-radius:40px;background:rgba(22,24,58,.9);border:4px solid rgba(255,255,255,.18);box-shadow:0 18px 50px rgba(0,0,0,.35);color:#fff;text-align:center}
.cardlite{background:transparent;border:0;box-shadow:none;padding:0}
.lab{font-family:Inter;font-weight:900;font-size:40px;letter-spacing:2px;color:#cfd4ff}
.big{font-family:'Archivo Black';font-size:150px;line-height:1.05;color:#fff;margin-top:6px}
.sub{font-weight:700;font-size:38px;color:#e6e8ff;margin-top:8px}
.tw{position:absolute;left:60px;right:60px;text-align:center}
.tt{font-family:'Archivo Black';font-size:104px;line-height:1.02;color:#fff;-webkit-text-stroke:16px #14122e;paint-order:stroke fill;text-shadow:0 10px 0 #14122e}
.daychip{position:absolute;left:60px;padding:16px 30px;border-radius:40px;background:rgba(22,24,58,.92);font-family:'Archivo Black';font-size:48px;color:#fff;border:4px solid rgba(255,255,255,.2)}
.dot{display:inline-block;width:26px;height:26px;border-radius:13px;margin-right:16px;vertical-align:middle}
.chip{display:inline-block;margin:10px;padding:16px 30px;border-radius:40px;background:rgba(22,24,58,.92);border:3px solid rgba(255,255,255,.2);font-weight:900;font-size:42px;color:#fff}
.chip i{display:inline-block;width:20px;height:20px;border-radius:10px;margin-right:14px;vertical-align:middle}
.crow{margin-top:10px}
.bl{display:flex;justify-content:space-between;font-weight:900;font-size:36px;margin-top:26px;color:#fff}
.bt{height:30px;border-radius:15px;background:rgba(255,255,255,.14);margin-top:12px;overflow:hidden}
.bf{height:100%;border-radius:15px}
.ct{display:flex;justify-content:space-between;font-weight:900;font-size:38px;color:#fff;margin-bottom:14px} .ct em{font-style:normal;color:#aab0e0;font-size:32px}
.blips{display:flex;justify-content:center;gap:26px;margin:30px 0 10px} .blips i{display:block;width:70px;height:110px;border-radius:16px;background:#ffd23c}
.pf{display:flex;align-items:center;gap:26px;text-align:left}
.av{width:120px;height:120px;border-radius:60px;background:#ff7a1a;font-family:'Archivo Black';font-size:66px;line-height:120px;text-align:center;color:#1a0d18;flex:none}
.pn{font-family:'Archivo Black';font-size:54px;color:#fff} .ph{font-weight:700;font-size:32px;color:#c8ccf0}
.fb{margin-left:auto;padding:18px 34px;border-radius:30px;background:#ff2d55;font-weight:900;font-size:36px;color:#fff}
.stamp{display:inline-block;margin-top:30px;padding:14px 30px;border:10px solid #ff2a3a;border-radius:20px;color:#ff2a3a;font-family:'Archivo Black';font-size:66px;transform:rotate(-8deg)}
.warn{position:relative;border-radius:26px;overflow:hidden;height:150px;background:#ffd23c}
.stripes{position:absolute;inset:0;background:repeating-linear-gradient(-45deg,#ffd23c 0 40px,#1a1a1a 40px 80px);opacity:.9}
.wt{position:absolute;left:30px;right:30px;top:30px;height:90px;border-radius:18px;background:#1a1a1a;color:#ffd23c;font-family:'Archivo Black';font-size:58px;line-height:90px}
.opt{margin-top:22px;padding:22px;border-radius:24px;background:rgba(255,255,255,.12);font-weight:900;font-size:44px;color:#fff;text-align:left;padding-left:40px}
.pause{position:absolute;left:0;right:0;top:640px;text-align:center}
.pbtn{width:230px;height:230px;border-radius:115px;margin:0 auto;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;gap:34px}
.pbtn i{display:block;width:40px;height:110px;border-radius:10px;background:#1d3a2a}
.pl{margin-top:40px;font-family:'Archivo Black';font-size:80px;color:#fff;text-shadow:0 6px 20px rgba(0,0,0,.5)}
.ps{font-weight:700;font-size:44px;color:#fff;margin-top:6px} .ps b{color:#ffb03a}
.badge{display:inline-block;margin-top:14px;padding:12px 30px;border-radius:30px;background:#ff2d55;font-weight:900;font-size:40px;color:#fff}
.vrow{display:flex;justify-content:space-around;align-items:flex-end;height:330px;margin:20px 0 10px}
.vc{width:150px;text-align:center}.vv{font-family:'Archivo Black';font-size:40px;color:#fff}.vt{height:230px;display:flex;align-items:flex-end;justify-content:center}.vbf{width:90px;border-radius:14px 14px 4px 4px}.vl{font-weight:900;font-size:36px;color:#cfd4ff;margin-top:10px}
.tl{display:flex;justify-content:space-between;margin:26px 0 10px}.tl span{flex:1;margin:0 6px;padding:18px 0;border-radius:18px;background:rgba(255,255,255,.12);font-family:'Archivo Black';font-size:38px;color:#fff}.tl .hot{background:#ff3a3a}
.heart{display:inline-block;width:60px;height:54px;position:relative;vertical-align:middle;margin-left:10px}
.heart:before,.heart:after{content:'';position:absolute;top:0;width:32px;height:52px;border-radius:32px 32px 0 0;background:#ff2d55}
.heart:before{left:28px;transform:rotate(-45deg);transform-origin:0 100%} .heart:after{left:0;transform:rotate(45deg);transform-origin:100% 100%}
"""
open(os.path.join(COMP, "cartoes.html"), "w", encoding="utf-8").write(f"""<template>
  <style>{CARD_CSS}</style>
  <div id="root" data-composition-id="cartoes" data-width="1080" data-height="1920" data-duration="{TOTAL}">
{cards_html}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    document.querySelectorAll('#root .kwrap').forEach(function (k) {{
      const s = parseFloat(k.dataset.start), d = parseFloat(k.dataset.duration), an = k.dataset.anim; const el = k.firstElementChild;
      if (an === 'slam') tl.fromTo(el, {{ scale: 1.6, opacity: 0, rotation: -4 }}, {{ scale: 1, opacity: 1, rotation: 0, duration: 0.28, ease: 'back.out(2.2)' }}, s);
      else if (an === 'slide') tl.fromTo(el, {{ x: -360, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.35, ease: 'expo.out' }}, s);
      else if (an === 'fade') tl.fromTo(el, {{ opacity: 0, scale: 1.1 }}, {{ opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }}, s);
      else tl.fromTo(el, {{ scale: 0.6, opacity: 0, y: 40 }}, {{ scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.8)' }}, s);
      tl.to(el, {{ opacity: 0, scale: 0.92, duration: 0.18, ease: 'power3.in' }}, s + d - 0.2);
      k.querySelectorAll('.chip,.opt,.blips i').forEach(function (c, i) {{ tl.fromTo(c, {{ scale: 0, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)' }}, s + 0.25 + i * 0.18); }});
      k.querySelectorAll('.vbf').forEach(function (b, i) {{ tl.fromTo(b, {{ height: '0%' }}, {{ height: b.dataset.to + '%', duration: 0.6, ease: 'back.out(1.6)' }}, s + 0.3 + i * 0.25); }});
      k.querySelectorAll('.bf').forEach(function (b) {{ tl.fromTo(b, {{ width: b.dataset.from + '%' }}, {{ width: b.dataset.to + '%', duration: Math.min(1.6, d * 0.6), ease: 'power2.inOut' }}, s + 0.3); }});
      k.querySelectorAll('.ln').forEach(function (p) {{ const L = p.getTotalLength(); p.style.strokeDasharray = L; tl.fromTo(p, {{ strokeDashoffset: L }}, {{ strokeDashoffset: 0, duration: Math.min(1.6, d * 0.7), ease: 'power2.inOut' }}, s + 0.3); }});
      k.querySelectorAll('.num').forEach(function (n) {{ const o = {{ v: 0 }}; const to = parseFloat(n.dataset.to); tl.fromTo(o, {{ v: 0 }}, {{ v: to, duration: Math.min(1.8, d * 0.7), ease: 'power2.out', onUpdate: function () {{ n.textContent = Math.round(o.v); }} }}, s + 0.2); }});
      k.querySelectorAll('.stamp').forEach(function (st) {{ tl.fromTo(st, {{ scale: 2.6, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.22, ease: 'power4.in' }}, s + d * 0.4); }});
      k.querySelectorAll('.blips i').forEach(function (bp, i) {{ tl.to(bp, {{ opacity: 0.15, duration: 0.05, yoyo: true, repeat: 3, ease: 'steps(1)' }}, s + 0.8 + i * 0.3); }});
    }});
    window.__timelines["cartoes"] = tl;
  </script>
</template>
""")

# ---------- legenda palavra por palavra ----------
words = []
for L in lines:
    for w, (a, b) in zip(L["toks"], L["wt"]):
        words.append([re.sub(r"[.,!?:]$", "", w), a, b])
for i, w in enumerate(words):
    nxt = words[i + 1][1] if i + 1 < len(words) else w[2] + 0.4
    w[2] = round(min(nxt, w[2] + 0.35) if nxt - w[2] < 0.6 else w[2] + 0.25, 3)
wh = "\n".join(f'<div id="w-{i}" class="clip w" data-start="{round(a, 3)}" data-duration="{round(max(0.12, b - a), 3)}"><span>{html.escape(t)}</span></div>' for i, (t, a, b) in enumerate(words))
open(os.path.join(COMP, "palavras.html"), "w", encoding="utf-8").write(f"""<template>
  <style>
    #root{{position:absolute;inset:0;pointer-events:none}}
    .w{{position:absolute;left:0;right:0;top:1290px;text-align:center}}
    .w span{{display:inline-block;font-family:'Archivo Black';font-size:96px;color:#fff;-webkit-text-stroke:14px #14122e;paint-order:stroke fill;text-shadow:0 8px 0 #14122e,0 14px 24px rgba(0,0,0,.45)}}
  </style>
  <div id="root" data-composition-id="palavras" data-width="1080" data-height="1920" data-duration="{TOTAL}">
{wh}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    document.querySelectorAll('#root .w').forEach(function (w) {{ tl.fromTo(w.firstElementChild, {{ scale: 1.25 }}, {{ scale: 1, duration: 0.12, ease: 'power2.out' }}, parseFloat(w.dataset.start)); }});
    window.__timelines["palavras"] = tl;
  </script>
</template>
""")

# ---------- sons ----------
SFXDIR = os.path.join(HERE, "..", ".agents", "skills", "media-use", "audio", "assets", "sfx")
PEAK = {"whoosh": 0.16, "whoosh-short": 0.16, "impact-bass-1": 0.05, "impact-bass-2": 0.05, "glitch-1": 0.4, "glitch-3": 0.29, "pop": 0.12, "sparkle": 0.03, "click": 0.07, "click-soft": 0.07, "ping": 0.33, "chime": 0.42, "whoosh-cinematic": 2.55, "error": 0.62}
sfx = []
def add(n, at, v, ln=1.2): sfx.append((n, max(0, round(at - PEAK.get(n, 0), 3)), ln, v))
for i, (cid, t0, t1, h, an) in enumerate(cards):
    if cid in ("pausa",): continue
    add("impact-bass-1" if an == "slam" else ("whoosh-short" if an == "slide" else "pop"), t0, 0.3 if an == "slam" else 0.22)
st = {s["id"]: s["t0"] for s in shots}
for k in ("botos", "empurra", "rios", "estrada", "tefe", "fogo", "estados", "nordeste", "calor", "sul"):
    add("whoosh", st[k], 0.2, 0.6)
add("error", st["aviso"] + 0.1, 0.3)
add("glitch-3", st["fogo"] + 0.2, 0.25)
add("click", GREY[0] + 0.05, 0.5); add("click", GREY[1] - 0.05, 0.35)
for n in set(s[0] for s in sfx): shutil.copy(os.path.join(SFXDIR, n + ".mp3"), os.path.join(ROOT, "assets", "sfx", n + ".mp3"))
shutil.copy(os.path.join(SFXDIR, "CREDITS.md"), os.path.join(ROOT, "assets", "sfx", "CREDITS.md"))
aud = [f'      <audio id="fala-{L["i"] + 1:02d}" class="clip" src="{L["file"]}" data-start="{round(L["start"], 3)}" data-duration="{round(L["dur"], 3)}" data-track-index="2" data-volume="1.4"></audio>' for L in lines]
aud += [f'      <audio id="sfx-{n:02d}" class="clip" src="assets/sfx/{a}.mp3" data-start="{b}" data-duration="{c}" data-track-index="{3 + n % 5}" data-volume="{v}" data-fade-out="0.12"></audio>' for n, (a, b, c, v) in enumerate(sfx)]

open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>El Niño parte 2</title>
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="assets/three.min.js"></script>
    <style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}}#root{{width:100%;height:100%}}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
      <div id="mundo" data-composition-id="mundo" data-composition-src="compositions/mundo.html" data-start="0" data-duration="{TOTAL}" data-track-index="0" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:1"></div>
      <div id="cartoes" data-composition-id="cartoes" data-composition-src="compositions/cartoes.html" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:2"></div>
      <div id="palavras" data-composition-id="palavras" data-composition-src="compositions/palavras.html" data-start="0" data-duration="{TOTAL}" data-track-index="11" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:3"></div>
{chr(10).join(aud)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
""")
json.dump({"total": TOTAL, "shots": shots, "grey": GREY}, open(os.path.join(ROOT, "timing.json"), "w"), indent=1)
print("ok", TOTAL, "s,", len(shots), "planos,", len(cards), "cartões,", len(words), "palavras,", len(sfx), "sons")

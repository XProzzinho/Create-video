# "O menino que ninguém quis ajudar" — Ep. 1, estilo desenho 2D de história.
# Rode: python3 tools/build_menino1.py   (usa a narração ElevenLabs de menino1/)
import json, os, re, html, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "build_sono.py"), encoding="utf-8").read()
head = src.split("# ---------- mundo 3D ----------")[0]
head = head.replace('ROOT = os.path.join(HERE, "..", "sono")', 'ROOT = os.path.join(HERE, "..", "menino1")')
a = head.index("CUTS = {"); b = head.index("MARKS = {}")
SPEC = [
 [(0, "mercado_wide"), ("menino", "boy_mid"), ("supermercado", "mercado_sign")],
 [(0, "boy_face"), (4, "boy_bags")],
 [(0, "photo_hands"), ("perguntava", "boy_asks"), ("você", "boy_face_ask")],
 [(0, "crowd_passing"), ("sem", "boy_alone")],
 [(0, "rain_wide"), ("mulher", "car_arrives"), ("parou", "woman_stands")],
 [(0, "woman_look"), ("tremer", "woman_tremble")],
 [(0, "woman_kneel")],
 [(0, "boy_face_rain"), ("desaparecer", "flash_mom"), ("procurar", "boy_photo_up")],
 [(0, "woman_cry")],
 [(0, "photo_close"), ("nela", "photo_zoom_baby")],
 [(0, "hospital")],
 [(0, "two_shot"), ("qual", "woman_face_ask")],
 [(0, "boy_face_whisper"), ("ana", "ana_title")],
 [(0, "bag_fall")],
 [(0, "woman_shock")],
 [(0, "woman_shock2"), ("irmã", "sisters_photo")],
 [(0, "rain_wide_end"), ("a", "opt_a"), ("b", "opt_b"), ("c", "opt_c")],
 [(0, "fim")],
]
TXT = [l.strip() for l in open(os.path.join(HERE, "..", "menino1", "narracao.txt"), encoding="utf-8") if l.strip()]
def _wi(li, w): return [t.strip(".,!?:").lower() for t in TXT[li].split()].index(w)
CUTS = {i: [(w if isinstance(w, int) else _wi(i, w), n) for w, n in sp] for i, sp in enumerate(SPEC)}
head = head[:a] + "CUTS = " + repr(CUTS) + "\n" + head[b:]
head = head.replace('GAP = {0: 0.3, 4: 0.6, 9: 0.8, 10: 0.8, 14: 0.6}', 'GAP = {0: 0.3, 2: 0.6, 3: 0.6, 5: 0.6, 9: 0.5, 12: 0.9, 13: 0.4, 15: 1.0, 16: 0.6}').replace('DEFAULT_GAP = 0.7', 'DEFAULT_GAP = 0.45')
g = {"__file__": os.path.join(HERE, "build_sono.py")}
exec(head, g)
lines, shots, TOTAL = g["lines"], g["shots"], g["TOTAL"]
ROOT = os.path.join(HERE, "..", "menino1"); COMP = os.path.join(ROOT, "compositions")
os.makedirs(COMP, exist_ok=True); os.makedirs(os.path.join(ROOT, "assets", "sfx"), exist_ok=True)
W = lambda li, wi=0: round(lines[li]["wt"][wi][0], 3)
END = lambda li: round(lines[li]["wt"][-1][1], 3)
GREY = [-1, -1]
def WI(li, w): return [t.strip('.,!?:').lower() for t in lines[li]['toks']].index(w)

# ---------- mundo ----------
js = open(os.path.join(HERE, "desenho2d.js"), encoding="utf-8").read().replace("  // __EPISODIO__", open(os.path.join(HERE, "menino1_cenas.js"), encoding="utf-8").read())
js = js.replace("__SHOTS__", json.dumps(shots)).replace("__DUR__", str(TOTAL))
open(os.path.join(COMP, "mundo.html"), "w", encoding="utf-8").write(f"""<template>
  <style>
    #root{{position:absolute;inset:0;overflow:hidden;background:#000}}
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
WA, WB, WC = W(16, WI(16, "a")), W(16, WI(16, "b")), W(16, WI(16, "c"))
card("ep", 0.2, W(0, WI(0, "menino")) + 0.2, '<div class="epc"><span>EPISÓDIO 1</span>O MENINO QUE<br>NINGUÉM QUIS AJUDAR</div>', top=170, cls="tw", anim="fade")
card("decide", W(16), WA, '<div class="epc" style="font-size:96px">E AGORA?<br><span style="font-size:60px">VOCÊ DECIDE</span></div>', top=300, cls="tw", anim="slam")
for cid, t0, lt, tx in (("oa", WA, "A", "Leva o menino pra mansão"), ("ob", WB, "B", "Investiga o passado da Ana"), ("oc", WC, "C", "Conta que a família esconde a verdade")):
    card(cid, t0, W(17), f'<div class="opt3"><b>{lt}</b>{tx}</div>', top={"A": 200, "B": 330, "C": 460}[lt], cls="tw", anim="slide")
card("cmt", W(17), TOTAL, '<div class="epc" style="font-size:88px">COMENTA<br><span style="color:#ffd23c">A, B OU C</span></div>', top=230, cls="tw", anim="slam")
card("ep2", W(17, WI(17, "me")), TOTAL, prof + '<div class="sub" style="font-size:30px;margin-top:18px;color:#aab0e0">EPISÓDIO 2 EM BREVE · Voz: ElevenLabs</div>', top=560)

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
.q{position:absolute;left:100px;right:100px;padding:34px 40px 40px;border-radius:44px;background:#ffd23c;color:#14122e;text-align:center;border:6px solid #14122e;box-shadow:0 14px 0 #14122e}
.q:after{content:'';position:absolute;left:130px;bottom:-50px;border-left:24px solid transparent;border-right:24px solid transparent;border-top:44px solid #14122e}
.qh{font-weight:900;font-size:36px;letter-spacing:4px;color:#8a4a00}
.qi{display:inline-block;width:40px;height:30px;border-radius:12px;background:#14122e;margin-right:14px;vertical-align:-4px;position:relative}
.qt{font-family:'Archivo Black';font-size:68px;line-height:1.08;margin-top:12px} .qt span{color:#c8301a}
.opt2{margin-top:18px;padding:16px 26px;border-radius:24px;background:#14122e;color:#ffd23c;font-weight:900;font-size:46px;text-align:left}
.epc{font-family:'Archivo Black';font-size:70px;line-height:1.05;color:#fff;text-align:center;text-shadow:0 6px 24px rgba(0,0,0,.8),0 2px 0 #000}
.epc span{display:block;font-family:Inter;font-weight:900;font-size:38px;letter-spacing:8px;color:#ffd23c;margin-bottom:10px}
.opt3{margin:0 10px;padding:22px 30px;border-radius:30px;background:rgba(18,14,30,.88);border:4px solid rgba(255,255,255,.22);font-weight:900;font-size:46px;color:#fff;text-align:left;box-shadow:0 14px 40px rgba(0,0,0,.5)}
.opt3 b{display:inline-block;width:70px;height:70px;border-radius:35px;background:#ffd23c;color:#14122e;text-align:center;line-height:70px;margin-right:22px;font-family:'Archivo Black';font-size:44px}
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
      k.querySelectorAll('.chip,.opt,.opt2,.blips i').forEach(function (c, i) {{ tl.fromTo(c, {{ scale: 0, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)' }}, s + 0.25 + i * 0.18); }});
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
raw = []
for L in lines:
    for w, (a0, b0) in zip(L["toks"], L["wt"]):
        raw.append([re.sub(r"[.,!?:]+$", "", w).replace("...", "").upper(), a0, b0, bool(re.search(r"[.,!?:]$", w) or w.endswith("..."))])
words = []; i = 0
while i < len(raw):
    t, a0, b0, stop = raw[i]
    if not stop and i + 1 < len(raw) and len(t) + len(raw[i + 1][0]) <= 11 and raw[i + 1][1] - b0 < 0.25:
        t = t + " " + raw[i + 1][0]; b0 = raw[i + 1][2]; i += 1
    words.append([t, a0, b0]); i += 1
for i, w in enumerate(words):
    nxt = words[i + 1][1] if i + 1 < len(words) else w[2] + 0.4
    w[2] = round(min(nxt, w[2] + 0.3) if nxt - w[2] < 0.6 else w[2] + 0.2, 3)
wh = "\n".join(f'<div id="w-{i}" class="clip w" data-start="{round(a, 3)}" data-duration="{round(max(0.12, b - a), 3)}"><span>{html.escape(t)}</span></div>' for i, (t, a, b) in enumerate(words))
open(os.path.join(COMP, "palavras.html"), "w", encoding="utf-8").write(f"""<template>
  <style>
    #root{{position:absolute;inset:0;pointer-events:none}}
    .w{{position:absolute;left:0;right:0;top:900px;text-align:center}}
    .w span{{display:inline-block;font-family:Inter;font-weight:900;font-size:66px;letter-spacing:1px;color:#fff;-webkit-text-stroke:5px #0a0810;paint-order:stroke fill;text-shadow:0 4px 14px rgba(0,0,0,.85)}}
  </style>
  <div id="root" data-composition-id="palavras" data-width="1080" data-height="1920" data-duration="{TOTAL}">
{wh}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    document.querySelectorAll('#root .w').forEach(function (w) {{ tl.fromTo(w.firstElementChild, {{ scale: 1.12, opacity: 0.6 }}, {{ scale: 1, opacity: 1, duration: 0.1, ease: 'power2.out' }}, parseFloat(w.dataset.start)); }});
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
    add("whoosh-short" if an in ("slide", "fade") else "pop", t0, 0.18)
st = {s["id"]: s["t0"] for s in shots}
for k in ("flash_mom", "hospital", "sisters_photo", "photo_close"): add("whoosh-cinematic", st[k], 0.28, 3.5)
for k in ("woman_look", "woman_kneel", "boy_face_whisper", "rain_wide_end"): add("whoosh", st[k], 0.14, 0.6)
add("impact-bass-2", st["ana_title"] + 0.05, 0.45); add("impact-bass-1", st["bag_fall"] + 0.9, 0.5); add("riser", st["woman_shock"], 0.2, 2.5)
add("impact-bass-2", st["sisters_photo"] + 0.05, 0.4); add("chime", st["fim"] + 0.2, 0.25)
for n in set(s[0] for s in sfx): shutil.copy(os.path.join(SFXDIR, n + ".mp3"), os.path.join(ROOT, "assets", "sfx", n + ".mp3"))
shutil.copy(os.path.join(SFXDIR, "CREDITS.md"), os.path.join(ROOT, "assets", "sfx", "CREDITS.md"))
import numpy as np, wave
def wav(path, x, sr=44100):
    x = np.clip(x, -1, 1); y = (x * 32767).astype(np.int16)
    with wave.open(path, "wb") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes(y.tobytes())
SR = 44100; N = int(SR * (TOTAL + 1)); tt = np.arange(N) / SR
def note(f, t0, d, amp):
    a = int(t0 * SR); n = int(d * SR); n = min(n, N - a)
    if n <= 0: return
    tl_ = np.arange(n) / SR; env = np.exp(-tl_ * 2.2) * np.minimum(1, tl_ * 60)
    sig = np.sin(2 * np.pi * f * tl_) + 0.35 * np.sin(4 * np.pi * f * tl_) + 0.12 * np.sin(6 * np.pi * f * tl_)
    mus[a:a + n] += sig * env * amp
mus = np.zeros(N)
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
beat = 60 / 72; bar = beat * 4; k = 0; t0 = 0.0
while t0 < TOTAL:
    c = CH[k % 4]
    note(hz(c[0] - 12), t0, bar * 1.2, 0.22)
    for j, m in enumerate([c[0], c[1], c[2], c[1] + 12, c[2], c[1], c[0] + 12, c[2]]): note(hz(m), t0 + j * beat / 2, beat * 2, 0.07)
    t0 += bar; k += 1
pad = sum(np.sin(2 * np.pi * hz(m) * tt) for m in (57, 64)) * 0.025 * (0.6 + 0.4 * np.sin(tt * 0.3))
mus = mus + pad; mus *= np.minimum(1, tt / 3) * np.minimum(1, np.maximum(0, (TOTAL - tt) / 3))
mus = np.convolve(mus, np.ones(3) / 3, mode="same")
wav(os.path.join(ROOT, "assets", "trilha.wav"), mus / max(1e-6, np.abs(mus).max()) * 0.6)
rng_ = np.random.default_rng(3); rn = rng_.standard_normal(N)
from scipy.signal import butter, lfilter
bb, aa = butter(2, [400 / (SR / 2), 6000 / (SR / 2)], btype="band"); rn = lfilter(bb, aa, rn)
drops = np.zeros(N); idx = rng_.integers(0, N, int(TOTAL * 40)); drops[idx] = rng_.uniform(0.3, 1, len(idx)); drops = lfilter([1], [1, -0.97], drops) * 0.25
rain_ = rn * 0.18 + drops; rain_ *= 0.85 + 0.15 * np.sin(tt * 0.7)
wav(os.path.join(ROOT, "assets", "chuva.wav"), rain_ / np.abs(rain_).max() * 0.7)
RAIN0 = st["rain_wide"]
aud = [f'      <audio id="trilha" class="clip" src="assets/trilha.wav" data-start="0" data-duration="{TOTAL}" data-track-index="9" data-volume="0.22"></audio>',
       f'      <audio id="chuva" class="clip" src="assets/chuva.wav" data-start="{round(RAIN0, 3)}" data-duration="{round(TOTAL - RAIN0, 3)}" data-media-start="{round(RAIN0, 3)}" data-track-index="10" data-volume="0.16" data-fade-in="1.2" data-fade-out="2"></audio>']
aud += [f'      <audio id="fala-{L["i"] + 1:02d}" class="clip" src="{L["file"]}" data-start="{round(L["start"], 3)}" data-duration="{round(L["dur"], 3)}" data-track-index="2" data-volume="1.4"></audio>' for L in lines]
aud += [f'      <audio id="sfx-{n:02d}" class="clip" src="assets/sfx/{a}.mp3" data-start="{b}" data-duration="{c}" data-track-index="{3 + n % 5}" data-volume="{v}" data-fade-out="0.12"></audio>' for n, (a, b, c, v) in enumerate(sfx)]

open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>O menino que ninguém quis ajudar</title>
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
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
json.dump({"total": TOTAL, "shots": shots}, open(os.path.join(ROOT, "timing.json"), "w"), indent=1)
print("ok", TOTAL, "s,", len(shots), "planos,", len(cards), "cartões,", len(words), "palavras,", len(sfx), "sons")

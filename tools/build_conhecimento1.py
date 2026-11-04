# "O Último Conhecimento" — Capítulo 1 em 3D (toon/anime), várias vozes + efeitos ElevenLabs.
# Rode: python3 tools/build_conhecimento1.py
import json, os, re, html, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "conhecimento1"); COMP = os.path.join(ROOT, "compositions")
os.makedirs(COMP, exist_ok=True); os.makedirs(os.path.join(ROOT, "assets", "sfx"), exist_ok=True)

# falas com marcações de emoção -> texto limpo para a legenda
FALAS = [l.rstrip("\n").split("\t") for l in open(os.path.join(ROOT, "falas.tsv"), encoding="utf-8") if l.strip()]
WHO = [f[1] for f in FALAS]
clean = lambda s: re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", "", s)).strip()
open(os.path.join(ROOT, "narracao.txt"), "w", encoding="utf-8").write("\n".join(clean(f[2]) for f in FALAS) + "\n")

src = open(os.path.join(HERE, "build_sono.py"), encoding="utf-8").read()
head = src.split("# ---------- mundo 3D ----------")[0]
head = head.replace('ROOT = os.path.join(HERE, "..", "sono")', 'ROOT = os.path.join(HERE, "..", "conhecimento1")')
a = head.index("CUTS = {"); b = head.index("MARKS = {}")
SPEC = [
 [(0, "intro")], [(0, "wake_white"), ("flutuando", "leo_float")], [(0, "void_wide")], [(0, "elysia_reveal")],
 [(0, "elysia_talk")], [(0, "leo_ask")], [(0, "elysia_smile~1")], [(0, "leo_ask~2")], [(0, "elysia_smile")], [(0, "leo_smile~1")],
 [(0, "elysia_wonder~1")], [(0, "leo_talk")], [(0, "ely_laugh")], [(0, "leo_talk~2")], [(0, "elysia_intro")], [(0, "leo_surprise")],
 [(0, "elysia_wonder~2")], [(0, "leo_talk~3")], [(0, "aeth_wide"), ("dragões", "dragon_fly")], [(0, "dragon_fly~2")],
 [(0, "icons_no")], [(0, "elysia_smile~2")], [(0, "leo_smile~2")], [(0, "elysia_talk~2")], [(0, "leo_think~1")], [(0, "ely_laugh~2")],
 [(0, "blessing_offer")], [(0, "elysia_smile~3")], [(0, "leo_surprise~2")], [(0, "elysia_talk~3")],
 [(0, "leo_think")], [(0, "leo_answer")], [(0, "elysia_shock")], [(0, "leo_soap")], [(0, "elysia_wonder")],
 [(0, "duo_talk")], [(0, "leo_talk~4")], [(0, "elysia_wonder~3")], [(0, "leo_smile")],
 [(0, "touch_forehead"), ("tudo", "memory_burst")], [(0, "blessing_title")], [(0, "elysia_smile~4")], [(0, "dissolve")], [(0, "elysia_last")],
 [(0, "village_night"), ("bebê", "baby_window")], [(0, "baby_close")], [(0, "baby_close~2")], [(0, "visitors")],
 [(0, "prof")], [(0, "adventurer")], [(0, "messenger")], [(0, "choose")],
]
TXT = [clean(f[2]) for f in FALAS]
def _wi(li, w): return [t.strip(".,!?:").lower() for t in TXT[li].split()].index(w)
CUTS = {i: [(w if isinstance(w, int) else _wi(i, w), n) for w, n in sp] for i, sp in enumerate(SPEC)}
head = head[:a] + "CUTS = " + repr(CUTS) + "\n" + head[b:]
head = head.replace('GAP = {0: 0.3, 4: 0.6, 9: 0.8, 10: 0.8, 14: 0.6}', 'GAP = {0: 0.6, 2: 0.5, 3: 0.5, 17: 0.4, 18: 0.3, 19: 0.4, 29: 0.5, 30: 0.3, 33: 0.6, 34: 0.4, 38: 0.6, 39: 0.6, 40: 0.5, 41: 0.4, 42: 1.0, 43: 0.5, 44: 0.4, 46: 0.6, 47: 0.3, 50: 0.5}').replace('DEFAULT_GAP = 0.7', 'DEFAULT_GAP = 0.3').replace('TAIL = 2.6', 'TAIL = 4.2')
g = {"__file__": os.path.join(HERE, "build_sono.py")}
exec(head, g)
lines, shots, TOTAL = g["lines"], g["shots"], g["TOTAL"]
W = lambda li, wi=0: round(lines[li]["wt"][wi][0], 3)
END = lambda li: round(lines[li]["wt"][-1][1], 3)
def WI(li, w): return [t.strip('.,!?:').lower() for t in lines[li]['toks']].index(w)
st = {s["id"]: s["t0"] for s in shots}; sd = {s["id"]: s["t1"] - s["t0"] for s in shots}

# ---------- mundo ----------
p3 = open(os.path.join(HERE, "conhecimento3d_mundo.js"), encoding="utf-8").read()
chars = p3.split("  // ---------- CIDADE (avenida ao longo de x) ----------")[0]
chars = chars.replace("  // ===================== O ÚLTIMO CONHECIMENTO — PRÓLOGO EM 3D (toon/anime) =====================\n", "")
im = re.search(r"  function iconMesh\(kind, col\) \{.*?return opt\(g\); \}\n", p3, re.S).group(0)
im = im.replace("    else if (kind === 'brain')", "    else if (kind === 'drop') { add(SPH, 0, -0.06, 0, 0.17, 0.19, 0.12); add(CONE, 0, 0.16, 0, 0.12, 0.26, 0.09); }\n    else if (kind === 'soap') { add(BOX, 0, 0, 0, 0.44, 0.24, 0.14); add(SPH, 0.12, 0.2, 0.02, 0.07, 0.07, 0.07); add(SPH, -0.05, 0.26, 0.02, 0.05, 0.05, 0.05); add(SPH, 0.02, 0.36, 0.02, 0.035, 0.035, 0.035); }\n    else if (kind === 'brain')")
base = open(os.path.join(HERE, "mundo.js"), encoding="utf-8").read().split("  // ---------- cenários ----------")[0]
ep = open(os.path.join(HERE, "conhecimento1_mundo.js"), encoding="utf-8").read().replace("  // __PERSONAGENS__\n", chars).replace("  // __ICONES__\n", im)
js = (base + ep).replace("__SHOTS__", json.dumps(shots)).replace("__MARKS__", "{}").replace("__DUR__", str(TOTAL))
shutil.copy(os.path.join(HERE, "..", "conhecimento0", "assets", "three.min.js"), os.path.join(ROOT, "assets", "three.min.js"))
shutil.copy(os.path.join(HERE, "..", "conhecimento0", "assets", "logo.png"), os.path.join(ROOT, "assets", "logo.png"))
open(os.path.join(COMP, "mundo.html"), "w", encoding="utf-8").write(f"""<template>
  <style>
    #root{{position:absolute;inset:0;overflow:hidden;background:#000}}
    #mundo-cv{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
    .mundo-fx{{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none}}
    #mundo-flash{{background:#fff;opacity:0}} #mundo-tint{{opacity:0}} #mundo-glitch{{opacity:0}}
    #mundo-vig{{background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 58%,rgba(0,0,0,.42) 100%)}}
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
cards = []
def card(cid, t0, t1, inner, top=430, cls="tw", anim="pop"):
    cards.append((cid, round(t0, 3), round(t1, 3), f'<div class="{cls}" style="top:{top}px;">{inner}</div>', anim))
tag = lambda n, r, c="#ffc83a": f'<div class="lt" style="border-color:{c}"><b>{n}</b><i style="color:{c}">{r}</i></div>'
card("ep", 0.15, W(0, WI(0, "lembra")), '<div class="lgo"><img src="assets/logo.png"><b>O ÚLTIMO CONHECIMENTO</b><small>CAPÍTULO 1</small></div>', top=470, anim="slam")
card("voto", W(0, WI(0, "lembra")), END(0) + 0.5, '<div class="qq"><span>LEMBRA</span>NO FINAL, <em>VOCÊ</em> ESCOLHE<br>O PRÓXIMO EPISÓDIO</div>', top=380, anim="slam")
card("cap", END(0) + 0.5, W(2), '<div class="epc"><span>CAPÍTULO 1</span>O DEUS QUE NÃO SABIA<br>O QUE FAZER COM ELE</div>', top=260, anim="fade")
card("ely", W(14) + 0.1, END(14) + 0.4, tag("ELYSIA", "Deusa da criação · Aetherion", "#ffd890"), top=1580, anim="slide")
card("ise", W(15, WI(15, "isekai")), END(16) + 0.3, '<div class="qq">ISEKAI?<br><em>???</em></div>', top=330, anim="slam")
card("aet", W(18, WI(18, "apareceu")), W(18, WI(18, "dragões")), '<div class="epc" style="font-size:120px"><span>O MUNDO DE</span>AETHERION</div>', top=300, anim="fade")
card("sem", W(20), END(21) + 0.3, '<div class="crow"><span class="chip"><i style="background:#ff3a4a"></i>ELETRICIDADE</span><span class="chip"><i style="background:#ff3a4a"></i>SANEAMENTO</span><span class="chip"><i style="background:#ff3a4a"></i>VACINAS</span><span class="chip"><i style="background:#ff3a4a"></i>IMPRENSA</span></div>', top=300, anim="pop")
card("deus", W(25, WI(25, "deusa")), END(25) + 0.6, '<div class="qq">UMA <em>DEUSA</em>.<br>NÃO O SEU <em>DEUS</em>.</div>', top=320, anim="slam")
card("pod", W(27), W(27, WI(27, "último")), '<div class="crow"><span class="chip"><i style="background:#ffb04a"></i>FORÇA</span><span class="chip"><i style="background:#5ad0ff"></i>MANA INFINITA</span><span class="chip"><i style="background:#c89aff"></i>ESPADA DO DESTINO</span></div>', top=280, anim="pop")
card("ciu", W(29, WI(29, "marido")), END(29) + 0.5, '<div class="qq">MORREU AOS <em>19</em><br>(MARIDO CIUMENTO)</div>', top=320, anim="slam")
card("frase", W(33) + 0.3, END(33) + 0.5, '<div class="qq">QUEM SABE FAZER <em>SABÃO</em><br>VALE MAIS QUE<br>UM <em>DRAGÃO</em></div>', top=300, anim="slam")
card("san", W(35), END(35) + 0.3, '<div class="crow"><span class="chip"><i style="background:#ffd23c"></i>SANTO</span><span class="chip"><i style="background:#ff3a4a"></i>HEREGE</span></div>', top=300, anim="pop")
card("bencao", W(40), END(40) + 0.8, '<div class="epc" style="font-size:88px"><span>BÊNÇÃO CONCEDIDA</span>MEMÓRIA DO<br>MUNDO ANTIGO</div>', top=300, anim="slam")
card("mana", W(41, WI(41, "mana")), END(41) + 0.3, '<div class="crow"><span class="chip"><i style="background:#5ad0ff"></i>+ UM POUCO DE MANA</span></div>', top=300, anim="pop")
card("vila", W(44) + 0.2, W(44, WI(44, "bebê")), '<div class="epc" style="font-size:110px"><span>VILA DE</span>BRUMAFRIA</div>', top=320, anim="fade")
card("maos", W(46), END(46) + 0.5, '<div class="qq"><span>PENSAMENTO DO BEBÊ</span>LAVEM ESSAS<br><em>MÃOS</em> PRIMEIRO!</div>', top=300, anim="slam")
card("12", W(47), W(48), '<div class="epc" style="font-size:120px"><span>DOZE ANOS DEPOIS</span>LEONARDO, 12</div>', top=300, anim="slam")
card("prof", W(48), END(48) + 0.3, tag("PROFESSOR AURELIUS", "Academia Real · Rota A", "#8aa8ff"), top=1580, anim="slide")
card("kae", W(49), END(49) + 0.3, tag("KAELA", "Guilda dos Aventureiros · Rota B", "#ff7a5a"), top=1580, anim="slide")
card("mes", W(50), END(50) + 0.3, tag("MENSAGEIRO", "Duque Aldric · Rota C", "#ffd23c"), top=1580, anim="slide")
op = lambda L, t, s: f'<div class="opt3"><b>{L}</b>{t}<small>{s}</small></div>'
card("enq", W(51), TOTAL, '<div class="pq"><span>COMENTA AÍ</span>QUAL CAMINHO?</div>' + op("A", "ROTA DO SÁBIO", "Academia Real") + op("B", "ROTA DO AVENTUREIRO", "Guilda") + op("C", "ROTA DO REINO", "Duque Aldric"), top=250, anim="slam")
card("fim", W(51, WI(51, "mais")), TOTAL, '<div class="lgo sm"><img src="assets/logo.png"><b>SIGA O PORTAL INFINITO</b><small style="color:#fff">@portal_infinito</small></div>', top=1270, anim="pop")
cards.append(("marca", 0, TOTAL, '<div class="wm"><img src="assets/logo.png"></div>', "none"))
cards_html = "\n".join(f'<div id="k-{cid}" class="clip kwrap" data-start="{t0}" data-duration="{round(t1 - t0, 3)}" data-anim="{an}">{h}</div>' for cid, t0, t1, h, an in cards)
CARD_CSS = """
#root{position:absolute;inset:0;pointer-events:none;font-family:Inter}
.kwrap{position:absolute;left:0;top:0;width:1080px;height:1920px}
.tw{position:absolute;left:60px;right:60px;text-align:center}
.chip{display:inline-block;margin:10px;padding:16px 30px;border-radius:40px;background:rgba(14,12,34,.9);border:3px solid rgba(255,255,255,.22);font-weight:900;font-size:42px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.chip i{display:inline-block;width:20px;height:20px;border-radius:10px;margin-right:14px;vertical-align:middle}
.crow{margin-top:10px}
.epc{font-family:'Archivo Black';font-size:70px;line-height:1.05;color:#fff;text-align:center;text-shadow:0 6px 24px rgba(0,0,0,.85),0 2px 0 #000}
.epc span{display:block;font-family:Inter;font-weight:900;font-size:38px;letter-spacing:8px;color:#ffd23c;margin-bottom:10px}
.lt{display:inline-block;padding:20px 36px;border-left:10px solid #ffc83a;background:rgba(10,10,24,.78);text-align:left;border-radius:6px 24px 24px 6px}
.lt b{display:block;font-family:Oswald;font-weight:700;font-size:62px;color:#fff;letter-spacing:2px}.lt i{display:block;font-style:normal;font-family:Inter;font-weight:700;font-size:32px}
.qq{display:inline-block;padding:34px 44px;border-radius:34px;background:rgba(10,10,28,.84);border:4px solid #ffc83a;font-family:Oswald;font-weight:700;font-size:76px;line-height:1.08;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.6)}
.qq span{display:block;font-family:Inter;font-weight:900;font-size:34px;letter-spacing:6px;color:#ffc83a;margin-bottom:12px}.qq em{font-style:normal;color:#ffc83a}
.wm{position:absolute;left:890px;top:150px;opacity:.9}.wm img{display:block;width:150px;height:150px;border-radius:75px;box-shadow:0 0 24px rgba(150,90,255,.7)}
.lgo{text-align:center}.lgo img{width:380px;height:380px;border-radius:190px;box-shadow:0 0 60px rgba(150,90,255,.8)}.lgo b{display:block;margin-top:24px;font-family:Oswald;font-weight:700;font-size:70px;color:#fff;text-shadow:0 4px 16px #000}.lgo small{display:block;margin-top:8px;font-family:Inter;font-weight:900;font-size:40px;letter-spacing:6px;color:#ffd23c;text-shadow:0 3px 12px #000}
.lgo.sm img{width:170px;height:170px}.lgo.sm b{font-size:52px;margin-top:12px}.lgo.sm small{font-size:34px;letter-spacing:2px}
.pq{font-family:Oswald;font-weight:700;font-size:92px;color:#fff;text-shadow:0 6px 20px #000;margin-bottom:26px}.pq span{display:block;font-family:Inter;font-weight:900;font-size:36px;letter-spacing:8px;color:#ffc83a}
.opt3{margin:18px 30px;padding:22px 30px;border-radius:30px;background:rgba(18,14,30,.9);border:4px solid rgba(255,255,255,.22);font-weight:900;font-size:46px;color:#fff;text-align:left;box-shadow:0 14px 40px rgba(0,0,0,.5)}
.opt3 b{display:inline-block;width:76px;height:76px;border-radius:38px;background:#ffd23c;color:#14122e;text-align:center;line-height:76px;margin-right:22px;font-family:'Archivo Black';font-size:46px;vertical-align:middle}
.opt3 small{display:block;margin-left:98px;margin-top:-10px;font-size:30px;color:#c8c0e8;font-weight:700}
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
      if (an === 'none') return;
      if (an === 'slam') tl.fromTo(el, {{ scale: 1.6, opacity: 0, rotation: -4 }}, {{ scale: 1, opacity: 1, rotation: 0, duration: 0.28, ease: 'back.out(2.2)' }}, s);
      else if (an === 'slide') tl.fromTo(el, {{ x: -360, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.35, ease: 'expo.out' }}, s);
      else if (an === 'fade') tl.fromTo(el, {{ opacity: 0, scale: 1.12 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }}, s);
      else tl.fromTo(el, {{ scale: 0.6, opacity: 0, y: 40 }}, {{ scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.8)' }}, s);
      if (s + d < {TOTAL} - 0.05) tl.to(el, {{ opacity: 0, scale: 0.92, duration: 0.18, ease: 'power3.in' }}, s + d - 0.2);
      tl.to(el, {{ y: '-=10', duration: Math.max(0.5, d), ease: 'sine.inOut' }}, s + 0.35);
      k.querySelectorAll('.chip,.opt3').forEach(function (c, i) {{ tl.fromTo(c, {{ scale: 0, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)' }}, s + 0.25 + i * 0.3); }});
      k.querySelectorAll('.lgo img').forEach(function (im) {{ tl.fromTo(im, {{ rotation: -200 }}, {{ rotation: 0, duration: 0.9, ease: 'back.out(1.4)' }}, s); }});
    }});
    window.__timelines["cartoes"] = tl;
  </script>
</template>
""")

# ---------- legenda palavra por palavra (cor muda por personagem) ----------
COLW = {"NAR": "#ffc83a", "ELY": "#ffe8a0", "LEO": "#7ad0ff", "PROF": "#a8b8ff", "KAE": "#ff9a7a", "MES": "#ffd23c"}
STOP = set("o a os as um uma de da do das dos e é em no na nos nas pra pro que se ele ela eu me te mais mas não só por com era tinha foi ao".split())
raw = []
for L in lines:
    for w, (a0, b0) in zip(L["toks"], L["wt"]):
        raw.append([re.sub(r"[.,!?:]+$", "", w).replace("...", "").upper(), a0, b0, bool(re.search(r"[.,!?:]$", w) or w.endswith("...")), WHO[L["i"]]])
words = []; i = 0
while i < len(raw):
    grp_ = [raw[i]]
    while not grp_[-1][3] and len(grp_) < 3 and i + 1 < len(raw) and raw[i + 1][4] == grp_[0][4] and len(" ".join(g[0] for g in grp_)) + len(raw[i + 1][0]) <= 15 and raw[i + 1][1] - grp_[-1][2] < 0.25:
        i += 1; grp_.append(raw[i])
    toks_ = [g[0] for g in grp_]; cand = [k for k, tk in enumerate(toks_) if tk.lower() not in STOP and len(tk) >= 4]
    hi = max(cand, key=lambda k: len(toks_[k])) if cand else -1
    c = COLW.get(grp_[0][4], "#ffc83a")
    words.append([" ".join(f'<em style="color:{c}">{tk}</em>' if k == hi else tk for k, tk in enumerate(toks_)), grp_[0][1], grp_[-1][2]]); i += 1
for i, w in enumerate(words):
    nxt = words[i + 1][1] if i + 1 < len(words) else w[2] + 0.4
    w[2] = round(min(nxt, w[2] + 0.3) if nxt - w[2] < 0.6 else w[2] + 0.2, 3)
wh = "\n".join(f'<div id="w-{i}" class="clip w" data-start="{round(a, 3)}" data-duration="{round(max(0.12, b - a), 3)}"><span>{t}</span></div>' for i, (t, a, b) in enumerate(words))
open(os.path.join(COMP, "palavras.html"), "w", encoding="utf-8").write(f"""<template>
  <style>
    #root{{position:absolute;inset:0;pointer-events:none}}
    .w{{position:absolute;left:40px;right:40px;top:1360px;text-align:center}} .w em{{font-style:normal}}
    .w span{{display:inline-block;font-family:Oswald;font-weight:700;font-size:80px;letter-spacing:1px;color:#fff;-webkit-text-stroke:4px #0a0810;paint-order:stroke fill;text-shadow:0 5px 16px rgba(0,0,0,.9)}}
  </style>
  <div id="root" data-composition-id="palavras" data-width="1080" data-height="1920" data-duration="{TOTAL}">
{wh}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    document.querySelectorAll('#root .w').forEach(function (w) {{ tl.fromTo(w.firstElementChild, {{ scale: 1.14, opacity: 0.6, y: 8 }}, {{ scale: 1, opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }}, parseFloat(w.dataset.start)); }});
    window.__timelines["palavras"] = tl;
  </script>
</template>
""")

# ---------- sons ----------
SFXDIR = os.path.join(HERE, "..", ".agents", "skills", "media-use", "audio", "assets", "sfx")
EL = os.path.join(ROOT, "assets", "sfx-eleven")
PEAK = {"whoosh": 0.16, "whoosh-short": 0.16, "impact-bass-1": 0.05, "impact-bass-2": 0.05, "pop": 0.12, "sparkle": 0.03, "chime": 0.42, "whoosh-cinematic": 2.55}
sfx = []
def add(n, at, v, ln=1.2): sfx.append((f"assets/sfx/{n}.mp3", max(0, round(at - PEAK.get(n, 0), 3)), ln, v))
def el(n, at, v, ln=None):
    p = os.path.join(EL, n + ".wav")
    if not os.path.exists(p): return
    d = g["dur"](p); sfx.append((f"assets/sfx-eleven/{n}.wav", round(max(0, at), 3), round(min(ln or d, d), 3), v))
for cid, t0, t1, h, an in cards:
    if an == "none": continue
    add("whoosh-short" if an in ("slide", "fade") else "pop", t0, 0.16)
for k in ("wake_white", "elysia_reveal", "aeth_wide", "icons_no", "blessing_offer", "memory_burst", "village_night", "visitors", "choose"): add("whoosh", st[k], 0.14, 0.6)
for j in range(6): add("pop", st["memory_burst"] + 0.2 + j * 0.25, 0.1)
el("portal", 0.0, 0.55); el("celestial", st["wake_white"], 0.0)
el("aparece", st["elysia_reveal"], 0.5); el("cajado", st["elysia_intro"] + 0.2, 0.5); el("vento_alto", st["aeth_wide"], 0.35)
el("dragao", st["dragon_fly"] + 0.1, 0.55); el("asas", st["dragon_fly"] + 1.0, 0.45)
step = sd["icons_no"] / 5
for i in range(4): el("erro", st["icons_no"] + i * step + 0.55, 0.3)
el("scratch", W(21) - 0.1, 0.45); el("susto", W(25, WI(25, "deusa")), 0.35); el("pensando", st["leo_think"], 0.3); el("susto", st["elysia_shock"], 0.45)
el("bolhas", st["leo_soap"] + 0.3, 0.45); el("cajado", st["touch_forehead"] + 0.6, 0.55); el("memoria", st["memory_burst"], 0.55)
el("bencao", st["blessing_title"], 0.55); el("areia", st["dissolve"] + 0.2, 0.5)
el("lareira", st["baby_window"], 0.4, sd["baby_window"]); el("bebe", W(44, WI(44, "chorou")) - 0.2, 0.45); el("bolhas", W(46, WI(46, "lavar")), 0.35)
el("livro", st["prof"] + 0.2, 0.5); el("espada", st["adventurer"] + 0.15, 0.5); el("pergaminho", st["messenger"] + 0.2, 0.5); el("escolha", st["choose"], 0.5)
add("sparkle", st["elysia_reveal"] + 0.2, 0.3); add("impact-bass-1", st["elysia_shock"] + 0.05, 0.35); add("impact-bass-2", st["blessing_title"], 0.45); add("chime", st["choose"] + 0.4, 0.3)
for n in set(re.sub(r".*/|\.mp3", "", s[0]) for s in sfx if s[0].startswith("assets/sfx/")): shutil.copy(os.path.join(SFXDIR, n + ".mp3"), os.path.join(ROOT, "assets", "sfx", n + ".mp3"))
shutil.copy(os.path.join(SFXDIR, "CREDITS.md"), os.path.join(ROOT, "assets", "sfx", "CREDITS.md"))
# camas de ambiente em loop, do tamanho certo
def bed(n, t0, t1, out):
    p = os.path.join(EL, n + ".wav")
    if not os.path.exists(p): return None
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-i", p, "-t", str(round(t1 - t0 + 0.5, 2)), "-af", "afade=t=in:d=1.2", os.path.join(ROOT, "assets", out)], check=True)
    return (f"assets/{out}", round(t0, 3), round(t1 - t0, 3))
beds = [bed("celestial", st["wake_white"], st["village_night"], "cama-celestial.wav"), bed("inverno", st["village_night"], st["visitors"], "cama-inverno.wav"), bed("vila_dia", st["visitors"], TOTAL, "cama-vila.wav")]
BV = [0.32, 0.4, 0.3]

import numpy as np, wave
def wav(path, x, sr=44100):
    x = np.clip(x, -1, 1); y = (x * 32767).astype(np.int16)
    with wave.open(path, "wb") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes(y.tobytes())
SR = 44100; N = int(SR * (TOTAL + 1)); tt = np.arange(N) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
mus = np.zeros(N)
def note(f, t0, d, amp, dec=2.2):
    a = int(t0 * SR); n = min(int(d * SR), N - a)
    if n <= 0: return
    tl_ = np.arange(n) / SR; env = np.exp(-tl_ * dec) * np.minimum(1, tl_ * 60)
    mus[a:a + n] += (np.sin(2 * np.pi * f * tl_) + 0.3 * np.sin(4 * np.pi * f * tl_) + 0.1 * np.sin(6 * np.pi * f * tl_)) * env * amp
CH = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 61]]  # Dm Bb C A
beat = 60 / 78; bar = beat * 4; k = 0; t0 = 0.0
while t0 < TOTAL:
    c = CH[k % 4]; inten = 1.3 if st["blessing_offer"] <= t0 < st["dissolve"] else (0.7 if st["village_night"] <= t0 < st["visitors"] else 1.0)
    note(hz(c[0] - 12), t0, bar * 1.3, 0.22 * inten, 1.0)
    for j, m in enumerate([c[0], c[1], c[2], c[3], c[2] + 12, c[3], c[2], c[1] + 12]): note(hz(m + 12), t0 + j * beat / 2, beat * 2, 0.045 * inten, 3.0)
    t0 += bar; k += 1
pad = sum(np.sin(2 * np.pi * hz(m) * tt + 0.6 * np.sin(tt * 2.3 + m)) for m in (62, 69, 74, 77)) * 0.035
mus = (mus + pad) * np.minimum(1, tt / 1.5) * np.clip((TOTAL - tt) / 2, 0, 1)
mus = np.convolve(mus, np.ones(3) / 3, mode="same")
wav(os.path.join(ROOT, "assets", "trilha.wav"), mus / max(1e-6, np.abs(mus).max()) * 0.6)

VOL = {"NAR": 1.4, "ELY": 1.35, "LEO": 1.35, "PROF": 1.35, "KAE": 1.35, "MES": 1.35}
aud = [f'      <audio id="trilha" class="clip" src="assets/trilha.wav" data-start="0" data-duration="{TOTAL}" data-track-index="9" data-volume="0.2"></audio>']
for i, b_ in enumerate(beds):
    if b_: aud.append(f'      <audio id="cama-{i}" class="clip" src="{b_[0]}" data-start="{b_[1]}" data-duration="{b_[2]}" data-track-index="{12 + i}" data-volume="{BV[i]}" data-fade-out="1.0"></audio>')
aud += [f'      <audio id="fala-{L["i"] + 1:02d}" class="clip" src="{L["file"]}" data-start="{round(L["start"], 3)}" data-duration="{round(L["dur"], 3)}" data-track-index="2" data-volume="{VOL.get(WHO[L["i"]], 1.4)}"></audio>' for L in lines]
aud += [f'      <audio id="sfx-{n:02d}" class="clip" src="{a}" data-start="{b}" data-duration="{c}" data-track-index="{3 + n % 5}" data-volume="{v}" data-fade-out="0.15"></audio>' for n, (a, b, c, v) in enumerate(sfx) if v > 0]

open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>O Último Conhecimento - Capítulo 1</title>
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
json.dump({"total": TOTAL, "shots": shots}, open(os.path.join(ROOT, "timing.json"), "w"), indent=1)
print("ok", TOTAL, "s,", len(shots), "planos,", len(cards), "cartões,", len(words), "palavras,", len(sfx), "sons")

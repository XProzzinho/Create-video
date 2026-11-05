# "O menino que ninguém quis ajudar" — Episódio 2, PARTE 2 (eles chegaram) em 2D, igual ao episódio 1 (toon), várias vozes + efeitos ElevenLabs.
# Rode: python3 tools/build_menino2.py
import json, os, re, html, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "menino2c"); COMP = os.path.join(ROOT, "compositions")
os.makedirs(COMP, exist_ok=True); os.makedirs(os.path.join(ROOT, "assets", "sfx"), exist_ok=True)

# falas com marcações de emoção -> texto limpo para a legenda
FALAS = [l.rstrip("\n").split("\t") for l in open(os.path.join(ROOT, "falas.tsv"), encoding="utf-8") if l.strip()]
WHO = [f[1] for f in FALAS]
clean = lambda s: re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", "", s)).strip()
open(os.path.join(ROOT, "narracao.txt"), "w", encoding="utf-8").write("\n".join(clean(f[2]) for f in FALAS) + "\n")

src = open(os.path.join(HERE, "build_sono.py"), encoding="utf-8").read()
head = src.split("# ---------- mundo 3D ----------")[0]
head = head.replace('ROOT = os.path.join(HERE, "..", "sono")', 'ROOT = os.path.join(HERE, "..", "menino2c")')
a = head.index("CUTS = {"); b = head.index("MARKS = {}")
SPEC = [
 [(0, "recap2"), ("hospedaria", "inn_ext"), ("divisão", "dz_car")],
 [(0, "inn_window"), ("três", "door_knock")],
 [(0, "door_knock~1"), ("divisão", "agents_out")],
 [(0, "rafa_stand"), ("menino", "boy_tremble")],
 [(0, "boy_plead")],
 [(0, "rafa_urgent")],
 [(0, "arm_grab")],
 [(0, "boy_whisper_scared"), ("matar", "boy_kill")],
 [(0, "door_break"), ("rafael", "window_alley")],
 [(0, "hand_hold")],
 [(0, "boy_whisper")],
 [(0, "rafa_confused")],
 [(0, "boy_whisper~1")],
 [(0, "blue_rise"), ("paredes", "walls_shake"), ("velas", "candles_out"), ("silenciosa", "silence_white")],
 [(0, "agents_down"), ("ferimento", "agents_down~1")],
 [(0, "rafa_shock")],
 [(0, "boy_sad")],
 [(0, "rafa_amazed")],
 [(0, "boy_cry")],
 [(0, "sleeve_up"), ("marca", "mark_close")],
 [(0, "rafa_frozen"), ("documento", "vault_doc"), ("lendas", "legend_god")],
 [(0, "boy_name")],
 [(0, "boy_name~1")],
 [(0, "boy_god")],
 [(0, "legend_god~1"), ("divisão", "dz_symbol"), ("parte", "boy_god~1")],
]
TXT = [clean(f[2]) for f in FALAS]
def _wi(li, w): return [t.strip(".,!?:").lower() for t in TXT[li].split()].index(w)
CUTS = {i: [(w if isinstance(w, int) else _wi(i, w), n) for w, n in sp] for i, sp in enumerate(SPEC)}
head = head[:a] + "CUTS = " + repr(CUTS) + "\n" + head[b:]
head = head.replace('GAP = {0: 0.3, 4: 0.6, 9: 0.8, 10: 0.8, 14: 0.6}', 'GAP = {0: 0.6, 1: 0.2, 2: 0.4, 6: 0.2, 7: 0.7, 8: 0.4, 12: 0.5, 13: 0.9, 14: 0.4, 19: 0.4, 20: 0.6, 21: 0.4, 22: 0.3, 23: 1.2}').replace('DEFAULT_GAP = 0.7', 'DEFAULT_GAP = 0.3').replace('TAIL = 2.6', 'TAIL = 4.2')
g = {"__file__": os.path.join(HERE, "build_sono.py")}
exec(head, g)
lines, shots, TOTAL = g["lines"], g["shots"], g["TOTAL"]
W = lambda li, wi=0: round(lines[li]["wt"][wi][0], 3)
END = lambda li: round(lines[li]["wt"][-1][1], 3)
def WI(li, w): return [t.strip('.,!?:').lower() for t in lines[li]['toks']].index(w)
st = {s["id"]: s["t0"] for s in shots}; sd = {s["id"]: s["t1"] - s["t0"] for s in shots}

# ---------- mundo (desenho 2D, mesmo motor do episódio 1) ----------
js = open(os.path.join(HERE, "desenho2d.js"), encoding="utf-8").read().replace("  // __EPISODIO__", open(os.path.join(HERE, "menino1_cenas.js"), encoding="utf-8").read() + open(os.path.join(HERE, "menino2b_cenas.js"), encoding="utf-8").read() + open(os.path.join(HERE, "menino2c_cenas.js"), encoding="utf-8").read())
js = js.replace("EP[sh.id] || EP._default", "EP[sh.id] || EP[sh.id.replace(/~\\d+$/, '')] || EP._default")
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
cards = []
def card(cid, t0, t1, inner, top=430, cls="tw", anim="pop"):
    cards.append((cid, round(t0, 3), round(t1, 3), f'<div class="{cls}" style="top:{top}px;">{inner}</div>', anim))
tag = lambda n, r, c="#ffc83a": f'<div class="lt" style="border-color:{c}"><b>{n}</b><i style="color:{c}">{r}</i></div>'
card("ep", 0.15, W(0, WI(0, "na")), '<div class="epc"><span>EPISÓDIO 2 · PARTE 2</span>O MENINO QUE<br>NINGUÉM QUIS AJUDAR</div>', top=300, anim="slam")
cena = lambda n, t: f'<div class="cena"><b>{n}</b>{t}</div>'
card("ant", W(0, WI(0, "na")), W(0, WI(0, "divisão")), '<div class="qq"><span>NA PARTE ANTERIOR</span>ELA É A <em style="color:#ff8aa0">MÃE</em><br>VERDADEIRA</div>', top=330, anim="pop")
card("dz0", W(0, WI(0, "divisão")), END(0) + 0.4, '<div class="qq" style="border-color:#ff3a3a"><span style="color:#ff6a5a">LÁ FORA</span>A DIVISÃO <em style="color:#ff3a3a">ZERO</em></div>', top=330, anim="slam")
card("c3", W(1), W(1) + 2.4, cena("CENA 3", "ELES CHEGARAM"), top=1580, anim="slide")
card("toc", W(1, WI(1, "três")), END(1) + 0.4, '<div class="qq"><em>TOC! TOC! TOC!</em></div>', top=330, anim="slam")
card("abram", W(2), END(2) + 0.3, '<div class="qq" style="border-color:#ff4a4a"><span style="color:#ff6a5a">DIVISÃO ZERO</span>ABRAM!</div>', top=330, anim="slam")
card("dzt", W(2, WI(2, "divisão")), END(2) + 0.6, tag("DIVISÃO ZERO", "A polícia secreta que caça pessoas com poderes", "#ff5a5a"), top=1580, anim="slide")
card("matar", W(7, WI(7, "matar")) - 0.1, END(7) + 0.4, '<div class="qq" style="border-color:#ff4a4a">ELES QUEREM<br>ME <em style="color:#ff4a4a">MATAR</em></div>', top=330, anim="slam")
card("beco", W(8, WI(8, "beco")), END(8) + 0.3, '<div class="qq"><span>A JANELA</span>BECO SEM SAÍDA</div>', top=330, anim="pop")
card("c4", W(14), W(14) + 2.4, cena("CENA 4", "A VERDADE"), top=1580, anim="slide")
card("pod", W(17, WI(17, "poderes")) - 0.2, END(17) + 0.4, '<div class="qq" style="border-color:#5ab0ff"><span style="color:#8ad0ff">ELE TEM</span><em style="color:#8ad0ff">PODERES?</em></div>', top=330, anim="slam")
card("cofre", W(20, WI(20, "documento")), W(20, WI(20, "lendas")), '<div class="qq"><span>NO COFRE DA MANSÃO</span>UM DOCUMENTO<br><em>SECRETO</em></div>', top=300, anim="pop")
card("mil", W(20, WI(20, "mil")) - 0.2, END(20) + 0.4, '<div class="epc" style="font-size:96px"><span>DESAPARECIDO HÁ</span>MIL ANOS</div>', top=300, anim="slam")
card("noah", W(21), END(22) + 0.2, tag("NOAH", "O menino sem nome", "#9affc8"), top=1580, anim="slide")
card("filho", W(23, WI(23, "último")) - 0.1, END(23) + 0.8, '<div class="qq" style="border-color:#a04aff"><span style="color:#c88aff">REVELAÇÃO</span>O ÚLTIMO FILHO<br>DO <em style="color:#c88aff">DEUS</em> QUE<br>VOCÊS MATARAM</div>', top=300, anim="slam")
card("cont2", W(24, WI(24, "parte")), TOTAL, '<div class="qq"><span>CONTINUA NA</span><em>PARTE 3</em></div><div class="cena" style="margin-top:30px">ME SEGUE PRA NÃO PERDER</div>', top=420, anim="slam")
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
.cena{display:inline-block;padding:16px 34px;border-radius:16px;background:rgba(10,10,24,.82);border-left:10px solid #ffc83a;font-family:Inter;font-weight:900;font-size:40px;color:#fff;letter-spacing:2px}.cena b{color:#ffc83a;margin-right:16px}
.fim{margin-top:40px;font-family:Inter;font-weight:900;font-size:36px;letter-spacing:8px;color:#c8c0e8;text-align:center}
.opt3{margin:16px 30px;padding:22px 30px;border-radius:30px;background:rgba(18,14,30,.9);border:4px solid rgba(255,255,255,.22);font-weight:900;font-size:46px;color:#fff;text-align:left;box-shadow:0 14px 40px rgba(0,0,0,.5)}
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
COLW = {"NAR": "#ffc83a", "RAF": "#7ab8ff", "NOAH": "#9affc8", "GUA": "#ff6a5a", "MUL": "#d88aff", "MAE": "#ff8aa0", "AGE": "#ff5a5a"}
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
for k in ("inn_ext", "door_knock", "agents_out", "door_break", "blue_rise", "agents_down", "vault_doc", "legend_god", "boy_god"): add("whoosh", st[k], 0.12, 0.6)
el("chuva", 0.2, 0.3, 4); el("motor", st["dz_car"], 0.45); el("batidas", st["door_knock"], 0.75); el("batidas", st["door_knock"] + 1.4, 0.5); add("impact-bass-1", st["agents_out"], 0.35)
el("passos", st["rafa_stand"], 0.3); el("coracao", st["boy_tremble"], 0.45); el("tensao", st["boy_kill"], 0.45); el("arrombar", st["door_break"] + 0.1, 0.7); add("impact-bass-2", st["door_break"] + 0.2, 0.4); el("chuva", st["window_alley"], 0.35, sd["window_alley"])
el("magia", st["blue_rise"], 0.6); el("tremor", st["walls_shake"], 0.55); el("velas", st["candles_out"] + 0.3, 0.5); el("silencio", st["silence_white"], 0.45)
el("corpos", st["agents_down"] + 0.1, 0.45); el("marca", st["sleeve_up"] + 0.3, 0.55); el("correntes", st["mark_close"] + 0.3, 0.4); add("impact-bass-1", st["vault_doc"], 0.3)
el("deus", st["legend_god"], 0.6); el("correntes", st["legend_god"] + 0.6, 0.4); el("magia", st["boy_god"], 0.4); el("impacto", st["boy_god"], 0.5); el("sirene", st["dz_symbol"], 0.3)
for n in set(re.sub(r".*/|\.mp3", "", s[0]) for s in sfx if s[0].startswith("assets/sfx/")): shutil.copy(os.path.join(SFXDIR, n + ".mp3"), os.path.join(ROOT, "assets", "sfx", n + ".mp3"))
shutil.copy(os.path.join(SFXDIR, "CREDITS.md"), os.path.join(ROOT, "assets", "sfx", "CREDITS.md"))
# camas de ambiente em loop, do tamanho certo
def bed(n, t0, t1, out):
    p = os.path.join(EL, n + ".wav")
    if not os.path.exists(p): return None
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-i", p, "-t", str(round(t1 - t0 + 0.5, 2)), "-af", "afade=t=in:d=1.2", os.path.join(ROOT, "assets", out)], check=True)
    return (f"assets/{out}", round(t0, 3), round(t1 - t0, 3))
beds = [bed("chuva", 0, st["inn_window"], "cama-chuva.wav"), bed("lareira", st["inn_window"], st["blue_rise"], "cama-lareira.wav"), bed("lareira", st["agents_down"], TOTAL, "cama-lareira2.wav")]
BV = [0.4, 0.35, 0.22]

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
CH = [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]]  # Am F C G
beat = 60 / 66; bar = beat * 4; k = 0; t0 = 0.0
while t0 < TOTAL:
    c = CH[k % 4]; inten = 1.35 if st["door_knock"] <= t0 < st["silence_white"] or st["boy_god"] <= t0 else (0.5 if st["silence_white"] <= t0 < st["agents_down"] + 2 else 1.0)
    note(hz(c[0] - 12), t0, bar * 1.3, 0.22 * inten, 1.0)
    for j, m in enumerate([c[0], c[1], c[2], c[3], c[2] + 12, c[3], c[2], c[1] + 12]): note(hz(m + 12), t0 + j * beat / 2, beat * 2, 0.045 * inten, 3.0)
    t0 += bar; k += 1
pad = sum(np.sin(2 * np.pi * hz(m) * tt + 0.6 * np.sin(tt * 2.3 + m)) for m in (57, 64, 69, 72)) * 0.035
mus = (mus + pad) * np.minimum(1, tt / 1.5) * np.clip((TOTAL - tt) / 2, 0, 1)
mus = np.convolve(mus, np.ones(3) / 3, mode="same")
wav(os.path.join(ROOT, "assets", "trilha.wav"), mus / max(1e-6, np.abs(mus).max()) * 0.6)

VOL = {"NAR": 1.4, "RAF": 1.35, "NOAH": 1.35, "GUA": 1.3, "MUL": 1.35, "MAE": 1.35, "AGE": 1.3}
aud = [f'      <audio id="trilha" class="clip" src="assets/trilha.wav" data-start="0" data-duration="{TOTAL}" data-track-index="9" data-volume="0.2"></audio>']
for i, b_ in enumerate(beds):
    if b_: aud.append(f'      <audio id="cama-{i}" class="clip" src="{b_[0]}" data-start="{b_[1]}" data-duration="{b_[2]}" data-track-index="{12 + i}" data-volume="{BV[i]}" data-fade-out="1.0"></audio>')
aud += [f'      <audio id="fala-{L["i"] + 1:02d}" class="clip" src="{L["file"]}" data-start="{round(L["start"], 3)}" data-duration="{round(L["dur"], 3)}" data-track-index="2" data-volume="{VOL.get(WHO[L["i"]], 1.4)}"></audio>' for L in lines]
aud += [f'      <audio id="sfx-{n:02d}" class="clip" src="{a}" data-start="{b}" data-duration="{c}" data-track-index="{3 + n % 5}" data-volume="{v}" data-fade-out="0.15"></audio>' for n, (a, b, c, v) in enumerate(sfx) if v > 0]

open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>O menino que ninguém quis ajudar - Episódio 2 Parte 2 (2D)</title>
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
json.dump({"total": TOTAL, "shots": shots, "cortes": []}, open(os.path.join(ROOT, "timing.json"), "w"), indent=1)
print("ok", TOTAL, "s,", len(shots), "planos,", len(cards), "cartões,", len(words), "palavras,", len(sfx), "sons")

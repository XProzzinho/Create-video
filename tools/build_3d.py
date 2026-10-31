# Monta o projeto HyperFrames "evil-tale-3d" (estilo reel: mundo 3D em blocos,
# narração, legendas grandes coloridas). Rode: python3 tools/build_3d.py
import json, os, re, subprocess, html, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "evil-tale-3d")
COMP = os.path.join(ROOT, "compositions")
os.makedirs(COMP, exist_ok=True)

LINES = [l.strip() for l in open(os.path.join(ROOT, "narracao.txt"), encoding="utf-8") if l.strip()]
FALAS = os.path.join(ROOT, "assets", "falas")

# planos: (linha, índice da palavra onde o corte acontece, nome do plano)
CUTS = {
    0: [(0, "intro"), (5, "cage")],
    1: [(0, "title"), (6, "gate")],
    2: [(0, "barrier")],
    3: [(0, "room"), (11, "slimes"), (14, "monitor_off")],
    4: [(0, "menu"), (12, "clicks")],
    5: [(0, "clock"), (7, "kills"), (13, "death"), (17, "respawn")],
    6: [(0, "party")],
    7: [(0, "tavern"), (12, "npc1"), (14, "npc2")],
    8: [(0, "castle"), (11, "boss_reveal"), (15, "boss_bar")],
    9: [(0, "fight"), (6, "last_hit"), (10, "explode")],
    10: [(0, "silence")],
    11: [(0, "window"), (9, "window_close")],
    12: [(0, "hand"), (10, "button"), (14, "home")],
    13: [(0, "press"), (2, "shatter")],
    14: [(0, "wake"), (5, "wind"), (8, "moons")],
    15: [(0, "creatures"), (4, "crane")],
    16: [(0, "xsky")],
    17: [(0, "cta")],
}
MARKS = {"sumiu": (4, 9), "nada": (4, 16), "ryu": (6, 10), "sora": (6, 13), "todos": (6, 15)}
# pausa depois de cada linha (s)
GAP = {2: 0.9, 9: 1.0, 10: 1.6, 12: 0.8, 13: 1.6, 16: 0.9}
DEFAULT_GAP = 0.7
TAIL = 2.6
START = 0.45

def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)

def speech_segments(p, d):
    r = subprocess.run(["ffmpeg", "-i", p, "-af", "silencedetect=n=-35dB:d=0.08", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", r)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", r)]
    sil = list(zip(st, en + [d] * (len(st) - len(en))))
    segs, cur = [], 0.0
    for a, b in sil:
        if a - cur > 0.05: segs.append([cur, a])
        cur = b
    if d - cur > 0.05: segs.append([cur, d])
    return segs

def word_times(line, p):
    d = dur(p)
    toks = line.split()
    # frases separadas por pontuação forte
    phrases, cur = [], []
    for i, w in enumerate(toks):
        cur.append(i)
        if re.search(r"[.?!]$", w): phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    segs = speech_segments(p, d)
    while len(segs) > len(phrases):  # junta os segmentos com menor pausa
        gaps = [segs[i + 1][0] - segs[i][1] for i in range(len(segs) - 1)]
        k = gaps.index(min(gaps)); segs[k] = [segs[k][0], segs[k + 1][1]]; del segs[k + 1]
    if len(segs) < len(phrases):  # distribui por tamanho
        a = segs[0][0] if segs else 0; b = segs[-1][1] if segs else d
        tot = sum(sum(len(toks[i]) + 2 for i in ph) for ph in phrases); t = a; segs = []
        for ph in phrases:
            L = sum(len(toks[i]) + 2 for i in ph) / tot * (b - a); segs.append([t, t + L]); t += L
    out = [None] * len(toks)
    for ph, (a, b) in zip(phrases, segs):
        tot = sum(len(toks[i]) + 2 for i in ph); t = a
        for i in ph:
            L = (len(toks[i]) + 2) / tot * (b - a); out[i] = (t, t + L); t += L
    return toks, out, d

# ---------- tempos ----------
t = START
lines = []
for li, line in enumerate(LINES):
    p = os.path.join(FALAS, f"fala-{li + 1:02d}.wav")
    toks, wt, d = word_times(line, p)
    lines.append({"i": li, "text": line, "start": t, "dur": d, "toks": toks, "wt": [(t + a, t + b) for a, b in wt], "file": f"assets/falas/fala-{li + 1:02d}.wav"})
    t += d + GAP.get(li, DEFAULT_GAP)
TOTAL = round(t - GAP.get(len(LINES) - 1, DEFAULT_GAP) + TAIL, 2)

shots = []
for li, cuts in CUTS.items():
    L = lines[li]
    for wi, name in cuts:
        t0 = 0.0 if (li == 0 and wi == 0) else L["wt"][wi][0] - 0.05
        shots.append({"id": name, "t0": round(t0, 3)})
shots.sort(key=lambda s: s["t0"])
for i, s in enumerate(shots):
    s["t1"] = round(shots[i + 1]["t0"] if i + 1 < len(shots) else TOTAL, 3)
marks = {k: round(lines[l]["wt"][w][0], 3) for k, (l, w) in MARKS.items()}

# ---------- mundo 3D ----------
js = open(os.path.join(HERE, "mundo.js"), encoding="utf-8").read()
js = js.replace("__SHOTS__", json.dumps(shots)).replace("__MARKS__", json.dumps(marks)).replace("__DUR__", str(TOTAL))
mundo = f"""<template>
  <style>
    #root{{position:absolute;inset:0;overflow:hidden;background:#05010f}}
    #mundo-cv{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
    .mundo-fx{{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none}}
    #mundo-flash{{background:#fff;opacity:0}}
    #mundo-tint{{opacity:0;mix-blend-mode:multiply}}
    #mundo-glitch{{opacity:0;background:repeating-linear-gradient(0deg,rgba(255,0,80,.18) 0 6px,transparent 6px 40px,rgba(0,229,255,.16) 40px 46px,transparent 46px 90px);mix-blend-mode:screen}}
    #mundo-vig{{background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)}}
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
"""
open(os.path.join(COMP, "mundo.html"), "w", encoding="utf-8").write(mundo)

# ---------- legendas (estilo reel) ----------
PALETTE = ["#ffd23c", "#ff5a4d", "#5ee08a", "#4dc3ff", "#ff9a3c", "#ffffff"]
SPECIAL = {"EVIL": "#ff3355", "TALE": "#ff3355", "SAIR": "#ffd23c", "X": "#c9a7ff", "CASA": "#ffb36b", "SILÊNCIO": "#ffffff"}
chunks = []
for L in lines:
    toks, wt = L["toks"], L["wt"]
    cur = []
    for i, w in enumerate(toks):
        cur.append(i)
        text = " ".join(toks[j] for j in cur)
        end_p = re.search(r"[.,?!]$", w)
        if len(cur) >= 3 or end_p or len(text) > 13 or i == len(toks) - 1:
            chunks.append({"line": L["i"], "idx": cur, "words": [toks[j] for j in cur], "t0": wt[cur[0]][0]}); cur = []
for i, c in enumerate(chunks):
    nxt = chunks[i + 1]["t0"] if i + 1 < len(chunks) else TOTAL - 0.2
    end_line = lines[c["line"]]["wt"][-1][1] + 0.45
    c["t1"] = min(nxt, max(end_line, c["t0"] + 0.5)) if chunks[i + 1:] and chunks[i + 1]["line"] != c["line"] else nxt
    c["t1"] = max(c["t1"], c["t0"] + 0.25)

cap_html, ci = [], 0
for i, c in enumerate(chunks):
    words = [re.sub(r"[.,]$", "", w).upper() for w in c["words"]]
    col = PALETTE[ci % len(PALETTE)]; ci += 1
    spans = []
    for w in words:
        key = re.sub(r"[^A-ZÀ-Ú]", "", w)
        cc = SPECIAL.get(key, col)
        spans.append(f'<span style="color:{cc}">{html.escape(w)}</span>')
    d = round(c["t1"] - c["t0"], 3)
    rot = [-3, 2, -1.5, 2.5, -2, 1][i % 6]
    cap_html.append(f'<div id="cap-{i}" class="clip cap" data-start="{round(c["t0"], 3)}" data-duration="{d}" data-rot="{rot}"><p class="cap-in">{" ".join(spans)}</p></div>')

legendas = f"""<template>
  <style>
    #root{{position:absolute;inset:0;pointer-events:none}}
    .cap{{position:absolute;left:70px;right:70px;top:250px;height:420px;display:flex;align-items:center;justify-content:center}}
    .cap-in{{margin:0;text-align:center;font-family:'Archivo Black';font-weight:400;font-size:136px;line-height:1.0;letter-spacing:-1px;
      -webkit-text-stroke:22px #1a0d18;paint-order:stroke fill;text-shadow:0 12px 0 #1a0d18,0 16px 30px rgba(0,0,0,.6)}}
    .cap-in span{{display:inline-block;margin:0 .1em}}
  </style>
  <div id="root" data-composition-id="legendas" data-width="1080" data-height="1920" data-duration="{TOTAL}">
    {chr(10).join(cap_html)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    document.querySelectorAll('#root .cap').forEach(function (c) {{
      const s = parseFloat(c.dataset.start), r = parseFloat(c.dataset.rot);
      const inn = c.querySelector('.cap-in'); const w = c.querySelectorAll('.cap-in span');
      tl.fromTo(inn, {{ scale: 1.45, rotation: r * 2.2, y: -30, opacity: 0 }}, {{ scale: 1, rotation: r, y: 0, opacity: 1, duration: 0.2, ease: 'back.out(2.4)' }}, s);
      tl.fromTo(w, {{ y: 26 }}, {{ y: 0, duration: 0.22, stagger: 0.05, ease: 'back.out(3)' }}, s + 0.02);
    }});
    window.__timelines["legendas"] = tl;
  </script>
</template>
"""
open(os.path.join(COMP, "legendas.html"), "w", encoding="utf-8").write(legendas)

# ---------- chamada final ----------
cta_start = lines[-1]["start"] - 0.1
cta_dur = round(TOTAL - cta_start, 2)
fim = f"""<template>
  <style>
    #root{{position:absolute;inset:0}}
    #fim-card{{position:absolute;left:110px;right:110px;top:820px;height:430px;border-radius:44px;background:rgba(14,8,30,.92);border:6px solid #c9a7ff;box-shadow:0 0 60px rgba(201,167,255,.55);text-align:center}}
    #fim-user{{position:absolute;left:0;right:0;top:56px;font-family:'Archivo Black';font-size:76px;color:#fff}}
    #fim-sub{{position:absolute;left:0;right:0;top:160px;font-family:Inter;font-weight:700;font-size:42px;color:#c9b8ff}}
    #fim-btn{{position:absolute;left:150px;right:150px;top:250px;height:120px;border-radius:60px;background:#ffd23c;font-family:'Archivo Black';font-size:58px;line-height:120px;color:#1a0d18}}
  </style>
  <div id="root" data-composition-id="fim" data-width="1080" data-height="1920" data-duration="{cta_dur}">
    <div id="fim-cardclip" class="clip" data-start="0.2" data-duration="{round(cta_dur - 0.2, 2)}">
      <div id="fim-card"><div id="fim-user" data-var-text="usuario">@Bessekai</div><div id="fim-sub">Parte 2 em breve</div><div id="fim-btn">COMENTA “X”</div></div>
    </div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    tl.fromTo('#fim-card', {{ y: 300, opacity: 0, scale: 0.9 }}, {{ y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out' }}, 0.25);
    tl.fromTo('#fim-btn', {{ scale: 0.6 }}, {{ scale: 1, duration: 0.45, ease: 'back.out(2.6)' }}, 0.6);
    tl.to('#fim-btn', {{ scale: 1.06, duration: 0.3, ease: 'power2.inOut', yoyo: true, repeat: 3 }}, 1.3);
    window.__timelines["fim"] = tl;
  </script>
</template>
"""
open(os.path.join(COMP, "fim.html"), "w", encoding="utf-8").write(fim)

# ---------- sons ----------
SFXDIR = os.path.join(HERE, "..", ".agents", "skills", "media-use", "audio", "assets", "sfx")
os.makedirs(os.path.join(ROOT, "assets", "sfx"), exist_ok=True)
PEAK = {"whoosh": 0.16, "whoosh-short": 0.16, "impact-bass-1": 0.05, "impact-bass-2": 0.05, "glitch-1": 0.4, "glitch-2": 0.05, "glitch-3": 0.29,
        "error": 0.62, "click": 0.07, "click-soft": 0.07, "pop": 0.12, "sparkle": 0.03, "riser": 9.6, "whoosh-cinematic": 2.55, "chime": 0.42, "ping": 0.33}
LEN = {"riser": 10.03, "whoosh-cinematic": 5.54}
sfx = []
def add(name, at, vol, length=None):
    sfx.append((name, max(0.0, at - PEAK.get(name, 0)), length or min(LEN.get(name, 1.6), 1.6), vol))
shot_t = {s["id"]: s["t0"] for s in shots}
whooshes = ["whoosh", "whoosh-short", "glitch-3"]
for i, s in enumerate(shots[1:]):
    if s["id"] in ("shatter", "explode", "silence", "wake", "moons", "cta"): continue
    add(whooshes[i % 3], s["t0"], 0.22)
add("glitch-1", shot_t["intro"] + 0.0, 0.0)  # (sem som no quadro 0)
add("impact-bass-1", shot_t["cage"] + 0.45, 0.45)
add("glitch-1", shot_t["title"] + 0.15, 0.35)
add("impact-bass-2", shot_t["gate"] + 0.9, 0.45)
for k in range(3): add("impact-bass-1", shot_t["barrier"] + 0.55 + k, 0.25)
for k in range(3): add("pop", shot_t["slimes"] + 0.4 + k * 0.45, 0.3)
add("click-soft", shot_t["monitor_off"] + 0.3, 0.4)
add("glitch-2", marks["sumiu"], 0.35)
cl = shot_t["clicks"]
while cl < marks["nada"]: add("click", cl, 0.35); cl += 0.25
add("error", marks["nada"], 0.4)
add("impact-bass-2", shot_t["death"] + 0.65, 0.4)
add("sparkle", shot_t["respawn"] + 0.2, 0.35)
for k in ("ryu", "sora", "todos"): add("sparkle", marks[k], 0.3)
add("impact-bass-1", shot_t["boss_reveal"] + 0.5, 0.5)
add("impact-bass-2", shot_t["boss_bar"] + 0.3, 0.35)
h = 0.45
fend = shot_t["last_hit"] - shot_t["fight"]
while h < fend - 0.2: add(["impact-bass-1", "impact-bass-2"][int(h * 10) % 2], shot_t["fight"] + h, 0.32); h += 0.7
add("riser", shot_t["explode"], 0.3, 10.03)
add("impact-bass-1", shot_t["explode"], 0.6); add("glitch-2", shot_t["explode"] + 0.02, 0.35)
add("sparkle", shot_t["window"] + 0.2, 0.4); add("chime", shot_t["window"] + 0.25, 0.25)
add("click", shot_t["press"] + 0.35, 0.6); add("impact-bass-2", shot_t["press"] + 0.35, 0.4)
add("glitch-1", shot_t["shatter"] + 0.02, 0.5); add("impact-bass-1", shot_t["shatter"] + 0.02, 0.55)
add("whoosh-cinematic", shot_t["wind"], 0.3, 4.0)
add("impact-bass-1", shot_t["xsky"] + 1.2, 0.55); add("glitch-1", shot_t["xsky"] + 1.2, 0.35)
add("pop", shot_t["cta"] + 0.6, 0.4)
sfx = [s for s in sfx if s[3] > 0]
for n in set(s[0] for s in sfx):
    shutil.copy(os.path.join(SFXDIR, n + ".mp3"), os.path.join(ROOT, "assets", "sfx", n + ".mp3"))
shutil.copy(os.path.join(SFXDIR, "CREDITS.md"), os.path.join(ROOT, "assets", "sfx", "CREDITS.md"))

audio = []
for L in lines:
    audio.append(f'      <audio id="fala-{L["i"] + 1:02d}" class="clip" src="{L["file"]}" data-start="{round(L["start"], 3)}" data-duration="{round(L["dur"], 3)}" data-track-index="2" data-volume="1.5"></audio>')
for n, (name, at, ln, vol) in enumerate(sfx):
    trk = 9 if name == "riser" else 3 + n % 4
    audio.append(f'      <audio id="sfx-{n:02d}" class="clip" src="assets/sfx/{name}.mp3" data-start="{round(at, 3)}" data-duration="{ln}" data-track-index="{trk}" data-volume="{vol}" data-fade-out="0.15"></audio>')
musica = ""
for cand in ("assets/musica.mp3", "assets/musica.wav"):
    if os.path.exists(os.path.join(ROOT, cand)):
        musica = f'      <audio id="musica" class="clip" src="{cand}" data-start="0" data-duration="{TOTAL}" data-track-index="10" data-volume="0.16" data-fade-in="0.5" data-fade-out="2"></audio>'

index = f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Evil Tale 3D</title>
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="assets/three.min.js"></script>
    <style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}}#root{{width:100%;height:100%}}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
      <div id="mundo" data-composition-id="mundo" data-composition-src="compositions/mundo.html" data-start="0" data-duration="{TOTAL}" data-track-index="0" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:1"></div>
      <div id="fim" data-composition-id="fim" data-composition-src="compositions/fim.html" data-start="{round(cta_start, 3)}" data-duration="{cta_dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:2"></div>
      <div id="legendas" data-composition-id="legendas" data-composition-src="compositions/legendas.html" data-start="0" data-duration="{TOTAL}" data-track-index="11" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:3"></div>
{chr(10).join(audio)}
{musica}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(index)
json.dump({"total": TOTAL, "shots": shots, "marks": marks, "lines": [{k: L[k] for k in ("i", "start", "dur", "text")} for L in lines]},
          open(os.path.join(ROOT, "timing.json"), "w"), ensure_ascii=False, indent=1)
print("ok", TOTAL, "s,", len(shots), "planos,", len(chunks), "legendas,", len(sfx), "sons")

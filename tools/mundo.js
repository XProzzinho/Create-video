// Mundo 3D em blocos (voxel) do Evil Tale — um único renderizador Three.js,
// que troca de cenário e câmera conforme o tempo. Tudo é função do tempo t.
// __SHOTS__, __MARKS__ e __DUR__ são preenchidos por tools/build_3d.py.
(function () {
  const SHOTS = __SHOTS__;
  const M = __MARKS__;
  const DUR = __DUR__;
  const W = 1080, H = 1920;
  const T3 = THREE;

  // ---------- utilidades ----------
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const eOut = x => 1 - Math.pow(1 - x, 3);
  const eIn = x => x * x * x;
  const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eBack = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const L3 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
  const mk = (name) => (M[name] !== undefined ? M[name] : 1e9);

  // ---------- renderizador ----------
  const cv = document.getElementById('mundo-cv');
  const renderer = new T3.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = T3.SRGBColorSpace;
  const scene = new T3.Scene();
  const cam = new T3.PerspectiveCamera(50, W / H, 0.5, 3000);
  const hemi = new T3.HemisphereLight(0xffffff, 0x222222, 1.2); scene.add(hemi);
  const sun = new T3.DirectionalLight(0xffffff, 1.4); sun.position.set(40, 80, 50); scene.add(sun);
  const rim = new T3.DirectionalLight(0xff66aa, 0.8); rim.position.set(-60, 30, -60); scene.add(rim);

  const BOX = new T3.BoxGeometry(1, 1, 1);
  const PARTS = [];
  const MATS = {}, BMATS = {};
  function mat(c) { return MATS[c] || (MATS[c] = new T3.MeshLambertMaterial({ color: c })); }
  function bmat(c) { return BMATS[c] || (BMATS[c] = new T3.MeshBasicMaterial({ color: c, toneMapped: false })); }
  function box(p, x, y, z, w, h, d, c, glow) { const m = new T3.Mesh(BOX, glow ? bmat(c) : mat(c)); m.position.set(x, y, z); m.scale.set(w, h, d); p.add(m); return m; }
  function grp(p, x = 0, y = 0, z = 0) { const g = new T3.Group(); g.position.set(x, y, z); if (p) p.add(g); return g; }

  function gradTex(stops) {
    const c = document.createElement('canvas'); c.width = 4; c.height = 512; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 512); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    x.fillStyle = g; x.fillRect(0, 0, 4, 512); const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return t;
  }

  // painel 2D (janela de jogo) desenhado num canvas e usado como textura
  function panel(p, w, h, draw) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / w);
    const ctx = c.getContext('2d'); const tex = new T3.CanvasTexture(c); tex.colorSpace = T3.SRGBColorSpace; tex.anisotropy = 4;
    const m = new T3.Mesh(new T3.PlaneGeometry(w, h), new T3.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, side: T3.DoubleSide }));
    let key = null;
    m.userData.set = function (st) { const k = JSON.stringify(st || 0); if (k === key) return; key = k; ctx.clearRect(0, 0, c.width, c.height); draw(ctx, c.width, c.height, st || {}); tex.needsUpdate = true; };
    if (p) p.add(m); return m;
  }
  function rr(x, X, y, w, h, r) { x.beginPath(); x.moveTo(X + r, y); x.arcTo(X + w, y, X + w, y + h, r); x.arcTo(X + w, y + h, X, y + h, r); x.arcTo(X, y + h, X, y, r); x.arcTo(X, y, X + w, y, r); x.closePath(); }
  function winBg(x, w, h, border, bg) {
    rr(x, 14, 14, w - 28, h - 28, 34); x.fillStyle = bg; x.fill();
    x.lineWidth = 10; x.strokeStyle = border; x.shadowColor = border; x.shadowBlur = 30; x.stroke(); x.shadowBlur = 0;
  }
  function txt(x, s, X, Y, size, col, weight = 700, fam = 'Oswald', align = 'center') {
    x.font = `${weight} ${size}px ${fam}`; while (align === 'center' && size > 20 && x.measureText(s).width > x.canvas.width - 70) { size -= 4; x.font = `${weight} ${size}px ${fam}`; } x.textAlign = align; x.textBaseline = 'middle'; x.fillStyle = col; x.fillText(s, X, Y);
  }

  // partículas: cubinhos instanciados com posição calculada a cada quadro
  function particles(p, n, color, size) {
    const im = new T3.InstancedMesh(BOX, bmat(color), n); im.frustumCulled = false; p.add(im);
    const d = new T3.Object3D();
    PARTS.push(im); im.visible = false;
    im.userData.place = function (fn) {
      im.visible = true;
      for (let i = 0; i < n; i++) { const r = fn(i, d); if (r === false) { d.scale.setScalar(0.0001); } d.updateMatrix(); im.setMatrixAt(i, d.matrix); d.scale.setScalar(size); d.rotation.set(0, 0, 0); }
      im.instanceMatrix.needsUpdate = true;
    };
    d.scale.setScalar(size); return im;
  }

  // ---------- personagens ----------
  function makeHero(o = {}) {
    const g = grp(null); const P = {};
    const C = Object.assign({ shirt: '#7a4a2a', plate: '#5e3820', belt: '#3a2412', pants: '#2b2238', boot: '#1a120c', skin: '#f2c9a0', hair: '#121018', sword: true, eye: '#1a1a24' }, o);
    const hips = grp(g, 0, 7, 0); P.hips = hips;
    [-1, 1].forEach((s) => { const leg = grp(hips, 1.3 * s, 0, 0); box(leg, 0, -3.2, 0, 2.2, 6.4, 2.4, C.pants); box(leg, 0, -6.3, 0.3, 2.5, 1.6, 3, C.boot); P[s < 0 ? 'legL' : 'legR'] = leg; });
    const torso = grp(hips, 0, 0, 0); P.torso = torso;
    box(torso, 0, 3.3, 0, 6, 6.6, 3.4, C.shirt); box(torso, 0, 0.6, 0, 6.2, 1.1, 3.6, C.belt); box(torso, 0, 0.6, 1.85, 1.2, 0.9, 0.2, '#d8b048');
    box(torso, -1.6, 4.6, 1.75, 2.2, 2.6, 0.2, C.plate); box(torso, 1.6, 4.6, 1.75, 2.2, 2.6, 0.2, C.plate); box(torso, 0, 6.8, 0, 5, 0.8, 3.2, C.plate);
    [-1, 1].forEach((s) => { const arm = grp(torso, 4 * s, 6.2, 0); box(arm, 0, -1.4, 0, 2, 3, 2.1, C.shirt); box(arm, 0, -4.3, 0, 1.8, 2.8, 1.9, C.skin); box(arm, 0, -2.9, 0, 2.2, 0.7, 2.3, C.belt); P[s < 0 ? 'armL' : 'armR'] = arm; });
    if (C.sword) {
      const sw = grp(P.armR, 0, -5.6, 0.4); P.sword = sw;
      box(sw, 0, 0, 0, 0.9, 0.9, 1, C.belt); box(sw, 0, 0.8, 0, 3.2, 0.6, 0.9, '#d8b048'); box(sw, 0, 5.6, 0, 0.6, 9, 1.4, '#c4ccd8'); box(sw, 0, 4, 0.72, 0.62, 1.6, 0.06, '#3d424c');
      sw.rotation.x = Math.PI / 2;
    }
    const head = grp(torso, 0, 7.2, 0); P.head = head;
    box(head, 0, 2.3, 0, 4.6, 4.6, 4.4, C.skin);
    box(head, 0, 4.9, 0, 5, 1.2, 4.8, C.hair); box(head, 0, 3.4, -2.3, 5, 3.4, 0.6, C.hair); box(head, -2.45, 3.6, 0, 0.5, 2.6, 4.6, C.hair); box(head, 2.45, 3.6, 0, 0.5, 2.6, 4.6, C.hair);
    box(head, -1.2, 4.15, 2.25, 2.6, 0.9, 0.4, C.hair); box(head, 1.1, 4.35, 2.25, 1.8, 0.6, 0.4, C.hair); box(head, 0.4, 5.7, 0.6, 1.4, 0.8, 1.4, C.hair); box(head, -0.9, 5.5, -0.8, 1.2, 0.6, 1.2, C.hair);
    P.eyes = [];
    [-1.05, 1.05].forEach((x) => { P.eyes.push(box(head, x, 2.6, 2.22, 0.75, 0.8, 0.1, C.eye, C.eyeGlow)); box(head, x, 1.95, 2.21, 0.9, 0.3, 0.08, '#a88aa8'); });
    box(head, 0, 1.1, 2.21, 1.2, 0.25, 0.08, '#9c5a4a');
    g.userData.P = P; return g;
  }
  function heroPose(h, t, o = {}) {
    const P = h.userData.P; const br = Math.sin(t * 2.2) * 0.12;
    P.hips.position.y = 7 + (o.bob || 0) + br * 0.4;
    P.torso.rotation.x = o.lean || 0; P.torso.rotation.y = o.twist || 0;
    const wk = o.walk ? Math.sin(t * o.walk) * 0.7 : 0;
    P.legL.rotation.x = (o.legL !== undefined ? o.legL : wk); P.legR.rotation.x = (o.legR !== undefined ? o.legR : -wk);
    P.armL.rotation.set(o.armL !== undefined ? o.armL : -wk * 0.8 + br, 0, o.armLz || 0.08);
    P.armR.rotation.set(o.armR !== undefined ? o.armR : wk * 0.8 - br, 0, o.armRz || -0.08);
    P.head.rotation.set(o.headX || 0, o.headY || 0, o.headZ || 0);
    const blink = ((t + (o.blinkOff || 0)) % 3.1) < 0.12 ? 0.1 : 1; P.eyes.forEach(e => e.scale.y = 0.8 * blink);
  }
  function makeBoss() {
    const g = grp(null); const P = {}; const A = '#17121f', B = '#2a2235', R = '#7a0f1e';
    const hips = grp(g, 0, 7, 0); P.hips = hips;
    [-1, 1].forEach(s => { const leg = grp(hips, 1.6 * s, 0, 0); box(leg, 0, -3.2, 0, 2.8, 6.4, 3, A); box(leg, 0, -6.4, 0.4, 3.2, 1.6, 3.8, B); });
    const torso = grp(hips); P.torso = torso;
    box(torso, 0, 3.6, 0, 7.4, 7.2, 4.2, A); box(torso, 0, 4.8, 2.15, 5, 3.4, 0.3, B); box(torso, 0, 0.6, 0, 7.6, 1.2, 4.4, R);
    [-1, 1].forEach(s => { box(torso, 4.6 * s, 7.2, 0, 3.6, 2, 4.6, B); box(torso, 5.4 * s, 8.6, 0, 1, 1.6, 1, B); });
    const cape = box(torso, 0, 1.5, -2.6, 8, 12, 0.4, R); P.cape = cape;
    [-1, 1].forEach(s => { const arm = grp(torso, 5 * s, 6.6, 0); box(arm, 0, -2.4, 0, 2.6, 5, 2.8, A); box(arm, 0, -5.4, 0, 2.8, 2, 3, B); P[s < 0 ? 'armL' : 'armR'] = arm; });
    const sw = grp(P.armR, 0, -6, 0.6); P.sword = sw; box(sw, 0, 0, 0, 1.2, 1.2, 1.2, B); box(sw, 0, 1.2, 0, 4.4, 0.8, 1.2, R); box(sw, 0, 8.6, 0, 1, 14, 2, '#2d2838'); box(sw, 0, 8.6, 1.05, 0.3, 14, 0.1, '#ff3b1f', true); sw.rotation.x = Math.PI / 2;
    const head = grp(torso, 0, 8, 0); P.head = head;
    box(head, 0, 2.4, 0, 5, 5, 5, A); box(head, 0, 1.6, 2.55, 4, 0.6, 0.2, B);
    [[-2, 1.6], [-1, 2.6], [0, 3.4], [1, 2.6], [2, 1.6]].forEach(([x, h]) => box(head, x, 5 + h / 2, 0, 0.8, h, 0.8, '#3a2f48'));
    P.eyes = [box(head, -1.2, 2.8, 2.56, 1.4, 0.6, 0.1, '#ff7a1a', true), box(head, 1.2, 2.8, 2.56, 1.4, 0.6, 0.1, '#ff7a1a', true)];
    P.eyeLight = new T3.PointLight(0xff5a1a, 0, 60); P.eyeLight.position.set(0, 3, 6); head.add(P.eyeLight);
    g.userData.P = P; return g;
  }
  function makeNPC(shirt, hat, seed) {
    const h = makeHero({ shirt, plate: shirt, belt: '#3a2a1a', pants: '#3b3226', hair: hat ? '#4a3420' : '#6a4a2a', sword: false, eye: '#eef0ff' });
    if (hat) { const P = h.userData.P; box(P.head, 0, 5.6, 0, 6, 0.6, 6, hat); box(P.head, 0, 6.6, 0, 3.6, 1.6, 3.6, hat); }
    return h;
  }
  function makeSlime(c) {
    const g = grp(null); const body = grp(g); box(body, 0, 2, 0, 5, 4, 5, c); box(body, 0, 4.1, 0, 4, 0.4, 4, '#ffffff'); box(body, -1, 2.6, 2.55, 0.8, 1.2, 0.1, '#10220f'); box(body, 1, 2.6, 2.55, 0.8, 1.2, 0.1, '#10220f');
    g.userData.body = body; return g;
  }
  function tree(p, x, z, s, leaf) {
    const g = grp(p, x, 0, z); g.scale.setScalar(s); box(g, 0, 4, 0, 2, 8, 2, '#6b4a2b'); box(g, 0, 10, 0, 8, 5, 8, leaf); box(g, 0, 13.5, 0, 5, 3, 5, leaf); return g;
  }

  // ---------- cenários ----------
  const SETS = {};
  function newSet(name, cfg) { const g = grp(scene); g.visible = false; SETS[name] = Object.assign({ g }, cfg); return g; }

  // 1) VAZIO: grade roxa + herói (abertura, jaula, barreira)
  const sVoid = newSet('void', { bg: gradTex(['#05010f', '#1b0838', '#3a0d4f']), fog: [0x1b0838, 80, 420], hemi: [0x9a7aff, 0x110022, 1.1], sun: [0xffffff, 1.2], rim: [0xff3d8b, 1.4] });
  { const gh = new T3.GridHelper(600, 60, 0xb06bff, 0x5a2a9a); sVoid.add(gh);
    const R = rng(4); for (let i = 0; i < 40; i++) { const c = box(sVoid, (R() - .5) * 260, 10 + R() * 120, -40 - R() * 200, 2 + R() * 6, 2 + R() * 6, 2 + R() * 6, R() < .5 ? '#2a1450' : '#4a1d6e'); c.userData.spin = R(); }
  }
  const heroV = makeHero(); sVoid.add(heroV);
  const cage = grp(sVoid);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; box(cage, Math.cos(a) * 11, 14, Math.sin(a) * 11, 0.8, 28, 0.8, '#ff2a4a', true); }
  box(cage, 0, 28.2, 0, 24, 0.8, 24, '#ff2a4a', true); box(cage, 0, -0.2, 0, 24, 0.4, 24, '#5a0a1a');
  const barrier = panel(sVoid, 60, 40, (x, w, h, st) => { x.strokeStyle = `rgba(80,220,255,${st.a || 0})`; x.lineWidth = 5; const s = 60; for (let r = 0; r < h / s + 2; r++) for (let c = 0; c < w / s + 2; c++) { const X = c * s * 1.5, Y = r * s * 1.73 + (c % 2) * s * .86; x.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; x.lineTo(X + Math.cos(a) * s, Y + Math.sin(a) * s); } x.closePath(); x.stroke(); } });
  barrier.position.set(-26, 18, 0); barrier.rotation.y = Math.PI / 2;
  const voidLight = new T3.PointLight(0xff2a4a, 0, 120); voidLight.position.set(0, 30, 10); sVoid.add(voidLight);

  // 2) RUÍNAS: campo de batalha, castelo, portão, painel do sistema
  const sRuins = newSet('ruins', { bg: gradTex(['#0a0420', '#3a1060', '#a0306a', '#ff7a6a']), fog: [0x5a1a5a, 60, 520], hemi: [0xff99cc, 0x1a0820, 1.0], sun: [0xffb0c0, 1.1], rim: [0x8a5aff, 1.4] });
  { const R = rng(8);
    for (let x = -12; x < 12; x++) for (let z = -18; z < 6; z++) { const h = R() * 1.5; box(sRuins, x * 10, -2 + h / 2, z * 10, 10, 2 + h, 10, R() < .5 ? '#24142c' : '#2c1834'); }
    for (let i = 0; i < 26; i++) { const x = (R() - .5) * 220, z = -30 - R() * 150, h = 10 + R() * 50; box(sRuins, x, h / 2, z, 4 + R() * 6, h, 4 + R() * 6, '#1c1028'); if (R() < .5) box(sRuins, x + 3, h + 2, z, 8, 3, 3, '#1c1028'); }
    const moon = new T3.Mesh(new T3.SphereGeometry(30, 24, 16), bmat('#ffe2ee')); moon.position.set(90, 170, -420); sRuins.add(moon);
    // castelo na montanha
    const mt = grp(sRuins, -40, 0, -330); for (let i = 0; i < 9; i++) box(mt, 0, i * 12 + 6, 0, 180 - i * 18, 12, 120 - i * 10, '#140a20');
    const cs = grp(mt, 0, 108, 0); box(cs, 0, 20, 0, 40, 40, 30, '#0c0614'); [-24, 24].forEach(x => { box(cs, x, 34, 0, 12, 68, 12, '#0c0614'); box(cs, x, 72, 0, 16, 6, 16, '#0c0614'); }); box(cs, 0, 60, 0, 14, 40, 14, '#0c0614');
    for (let i = 0; i < 10; i++) box(cs, -14 + (i % 5) * 7, 18 + Math.floor(i / 5) * 12, 15.2, 2.5, 4, 0.5, '#ff7a1a', true);
  }
  const heroR = makeHero(); sRuins.add(heroR);
  const titlePanel = panel(sRuins, 44, 22, (x, w, h, st) => {
    winBg(x, w, h, '#ff2a4a', 'rgba(24,2,10,0.92)'); txt(x, '[ SISTEMA ]', w / 2, 110, 54, '#ff8d9f', 700);
    const j = st.j || 0;
    txt(x, 'BEM-VINDO A', w / 2 - j * 14, 230, 120, '#ff2a4a');
    x.globalCompositeOperation = 'lighter'; txt(x, 'EVIL TALE', w / 2 - j * 18, 380, 170, '#ff0040'); txt(x, 'EVIL TALE', w / 2 + j * 18, 380, 170, '#00e5ff'); x.globalCompositeOperation = 'source-over';
    txt(x, 'EVIL TALE', w / 2, 380, 170, '#ffe0e6');
  });
  const gate = grp(sRuins, 0, 0, -60);
  { box(gate, -34, 40, 0, 12, 80, 14, '#1a1024'); box(gate, 34, 40, 0, 12, 80, 14, '#1a1024'); box(gate, 0, 84, 0, 80, 10, 16, '#1a1024'); }
  const doorL = grp(gate, -14, 0, 0), doorR = grp(gate, 14, 0, 0);
  [doorL, doorR].forEach((d, i) => { box(d, 0, 39, 0, 28, 78, 3, '#2a1a10'); for (let k = 0; k < 6; k++) box(d, 0, 6 + k * 13, 1.8, 28, 1.4, 0.6, '#5a4a3a'); box(d, (i ? -1 : 1) * 10, 40, 2, 2, 6, 1, '#d8b048'); });
  const xPanel = panel(gate, 40, 40, (x, w, h) => { x.strokeStyle = '#ff2a4a'; x.lineWidth = 120; x.lineCap = 'round'; x.shadowColor = '#ff2a4a'; x.shadowBlur = 60; x.beginPath(); x.moveTo(170, 170); x.lineTo(w - 170, h - 170); x.moveTo(w - 170, 170); x.lineTo(170, h - 170); x.stroke(); });
  xPanel.position.set(0, 40, 8);
  const lightning = grp(sRuins, -40, 0, -300); { let x = 0, y = 380; const R = rng(21); for (let i = 0; i < 12; i++) { const nx = x + (R() - .5) * 30, ny = y - 22; const seg = box(lightning, (x + nx) / 2, (y + ny) / 2, 0, 3, 26, 3, '#e8e0ff', true); seg.rotation.z = Math.atan2(nx - x, 22); x = nx; y = ny; } }
  const embersR = particles(sRuins, 220, '#ffb070', 0.7);

  // 3) QUARTO: noite, computador
  const sRoom = newSet('room', { bg: gradTex(['#05060f', '#0b0f22']), fog: [0x0b0f22, 80, 400], hemi: [0x6a7aff, 0x080810, 0.55], sun: [0x8899ff, 0.35], rim: [0x2266ff, 0.8] });
  { box(sRoom, 0, -1, 0, 90, 2, 90, '#3a2a22'); box(sRoom, 0, 30, -40, 90, 62, 2, '#22243a'); box(sRoom, -44, 30, 0, 2, 62, 90, '#1e2034');
    box(sRoom, 0, 13, -30, 36, 2, 14, '#5a3a24'); [-16, 16].forEach(x => box(sRoom, x, 6, -30, 2, 12, 12, '#4a2e1c'));
    box(sRoom, 30, 5, -10, 24, 8, 40, '#2a3a6a'); box(sRoom, 30, 10, -26, 22, 4, 8, '#e8e8f0');
    const win = grp(sRoom, -43, 34, -6); box(win, 0, 0, 0, 0.5, 24, 30, '#0a1030');
    const R = rng(5); for (let i = 0; i < 40; i++) box(win, 0.4, (R() - .5) * 22, (R() - .5) * 28, 0.2, 1, 1, R() < .5 ? '#ffd27a' : '#7ac8ff', true);
    box(sRoom, 0, 28, -32, 3, 3, 3, '#ffcc66', true);
  }
  const heroRoom = makeHero({ sword: false, shirt: '#3a4a6a', plate: '#2a3a5a', belt: '#22283a' }); sRoom.add(heroRoom);
  const chair = grp(sRoom, 0, 0, -14); box(chair, 0, 6, 0, 10, 1.5, 10, '#222'); box(chair, 0, 13, 4.5, 10, 14, 1.5, '#222'); box(chair, 0, 3, 0, 1.5, 6, 1.5, '#111');
  const monitor = grp(sRoom, 0, 22, -33); box(monitor, 0, -6, 0, 3, 6, 3, '#151515'); box(monitor, 0, 0, -0.8, 26, 15, 1.2, '#111');
  const screen = panel(monitor, 24, 13.4, (x, w, h, st) => {
    if (st.off >= 1) { x.fillStyle = '#000'; x.fillRect(0, 0, w, h); return; }
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3aa0ff'); g.addColorStop(1, '#7ad06a'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#4a9a3a'; x.fillRect(0, h * .65, w, h * .35);
    for (let i = 0; i < 4; i++) { const sx = 160 + i * 220 + Math.sin((st.t || 0) * 3 + i) * 30, sy = h * .7 - Math.abs(Math.sin((st.t || 0) * 5 + i)) * 50; x.fillStyle = '#5fd35f'; x.fillRect(sx, sy, 90, 70); x.fillStyle = '#10220f'; x.fillRect(sx + 20, sy + 20, 14, 20); x.fillRect(sx + 56, sy + 20, 14, 20); }
    x.fillStyle = '#1a1a24'; x.fillRect(w / 2 - 30, h * .45, 60, 130);
    txt(x, 'EVIL TALE', 160, 50, 46, '#fff', 700, 'Oswald'); x.fillStyle = '#e0304a'; x.fillRect(30, 90, 260, 18);
    if (st.off > 0) { x.fillStyle = `rgba(0,0,0,${st.off})`; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; const lh = Math.max(4, h * (1 - st.off) * 0.5); x.fillRect(w * st.off * 0.4, h / 2 - lh / 2, w * (1 - st.off * 0.8), lh); }
  });
  screen.position.z = 0;
  const monLight = new T3.PointLight(0x66b8ff, 2.2, 90); monLight.position.set(0, 22, -24); sRoom.add(monLight);

  // 4) CAMPO: dia (slimes), morte (vermelho), renascer
  const sField = newSet('field', { bg: gradTex(['#3a8ae8', '#8ac8ff', '#d8f0ff']), fog: [0xbfe6ff, 120, 600], hemi: [0xffffff, 0x4a7a3a, 1.3], sun: [0xfff2d0, 1.5], rim: [0xffffff, 0.3] });
  { const R = rng(9); for (let x = -14; x < 14; x++) for (let z = -20; z < 8; z++) box(sField, x * 10, -1 + R() * 0.6, z * 10, 10, 2, 10, R() < .5 ? '#5aa64a' : '#4e9a40');
    for (let i = 0; i < 18; i++) tree(sField, (R() - .5) * 260, -60 - R() * 160, 1 + R() * 0.8, R() < .5 ? '#2f7a3a' : '#3f8a2a');
    for (let i = 0; i < 10; i++) { const c = grp(sField, (R() - .5) * 400, 120 + R() * 60, -300 - R() * 100); box(c, 0, 0, 0, 30 + R() * 30, 8, 16, '#ffffff', true); box(c, 8, 5, 0, 18, 8, 14, '#ffffff', true); }
  }
  const heroF = makeHero(); sField.add(heroF);
  const slimes = []; { const R = rng(12); for (let i = 0; i < 7; i++) { const s = makeSlime(['#5fd35f', '#6ae06a', '#4cc24c'][i % 3]); s.position.set((R() - .5) * 70, 0, -10 - R() * 40); s.userData.ph = R() * 6; sField.add(s); slimes.push(s); } }
  const pop = particles(sField, 160, '#9aff8a', 1.1);
  const deathPanel = panel(sField, 46, 18, (x, w, h, st) => { winBg(x, w, h, '#ff2a4a', 'rgba(30,0,6,0.9)'); txt(x, 'VOCÊ MORREU', w / 2, h * 0.42, 150, '#ff3355'); txt(x, `MORTES: ${st.n || 0}`, w / 2, h * 0.78, 70, '#ffc0c8'); });
  const beam = box(sField, 0, 60, 0, 10, 120, 10, '#fff6c0', true); beam.material = new T3.MeshBasicMaterial({ color: '#fff6c0', transparent: true, opacity: 0.5, toneMapped: false, depthWrite: false });
  const beamP = particles(sField, 120, '#fff2a0', 0.8);

  // 5) ESPAÇO DE INTERFACE: menu, cliques, relógio, contador
  const sUI = newSet('ui', { bg: gradTex(['#03020a', '#0d0826', '#1a0f3a']), fog: [0x0d0826, 100, 500], hemi: [0x8a7aff, 0x080412, 0.9], sun: [0xffffff, 0.8], rim: [0x6c4bd8, 1.4] });
  { const gh = new T3.GridHelper(800, 80, 0x6c4bd8, 0x2a1a5a); gh.position.y = -30; sUI.add(gh); const R = rng(14); for (let i = 0; i < 160; i++) box(sUI, (R() - .5) * 600, R() * 300 - 20, -100 - R() * 300, 0.8, 0.8, 0.8, '#ffffff', true); }
  const heroUI = makeHero(); heroUI.position.set(0, -30, 30); sUI.add(heroUI);
  const menuItems = ['Inventário', 'Mapa', 'Habilidades', 'Opções', 'Sair do jogo'];
  const menuPanel = panel(sUI, 40, 48, (x, w, h, st) => {
    winBg(x, w, h, '#6c4bd8', 'rgba(9,6,24,0.92)'); txt(x, 'MENU', 90, 100, 60, '#b9a4ff', 700, 'Oswald', 'left');
    menuItems.forEach((it, i) => { const y = 250 + i * 200; x.fillStyle = 'rgba(108,75,216,0.25)'; rr(x, 60, y - 75, w - 120, 150, 20); x.fill();
      if (i === 4) { if (st.gone >= 1) { txt(x, '— — —', w / 2, y, 80, '#3a2a6a'); return; } const j = st.j || 0; x.globalAlpha = 1 - (st.gone || 0); txt(x, it, w / 2 + j * 22, y, 100, '#ffd166'); x.globalAlpha = 1; return; }
      txt(x, it, w / 2, y, 100, '#e6dcff'); });
  });
  const cursor = grp(sUI); { box(cursor, 0, 0, 0, 2, 7, 1.6, '#f2c9a0'); box(cursor, 1.8, -3.2, 0, 4.4, 4, 2, '#f2c9a0'); box(cursor, 3.5, -5.6, 0, 1.5, 2, 1.6, '#f2c9a0'); }
  const errPanels = []; for (let i = 0; i < 9; i++) { const e = panel(sUI, 22, 9, (x, w, h) => { winBg(x, w, h, '#ff2a4a', 'rgba(40,0,8,0.95)'); txt(x, '✖ ERRO', w / 2, h * 0.38, 130, '#ff4d6a'); txt(x, 'OPÇÃO INDISPONÍVEL', w / 2, h * 0.75, 60, '#ffc0c8'); }); errPanels.push(e); }
  const clockG = grp(sUI, 0, 20, -60); { for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; box(clockG, Math.sin(a) * 40, Math.cos(a) * 40, 0, 4, 4, 4, '#6c4bd8', true); } }
  const handH = grp(clockG); box(handH, 0, 12, 1, 3, 24, 2, '#ffd166', true); const handM = grp(clockG); box(handM, 0, 17, 2, 2, 34, 2, '#ffffff', true);
  const countPanel = panel(sUI, 50, 22, (x, w, h, st) => { winBg(x, w, h, st.border || '#6c4bd8', 'rgba(9,6,24,0.92)'); txt(x, st.label || '', w / 2, 110, 60, '#b9a4ff'); txt(x, st.value || '', w / 2, h * 0.62, st.size || 130, st.col || '#ffd166'); });
  const rain = particles(sUI, 260, '#5fd35f', 3.2);

  // 6) PRAÇA: grupo de jogadores que somem
  const sPlaza = newSet('plaza', { bg: gradTex(['#1a2a5a', '#7a4a8a', '#ff9a6a']), fog: [0x7a4a8a, 80, 500], hemi: [0xffc0a0, 0x2a1a3a, 1.1], sun: [0xffb080, 1.2], rim: [0x6a8aff, 1.0] });
  { const R = rng(15); for (let x = -10; x < 10; x++) for (let z = -16; z < 6; z++) box(sPlaza, x * 10, -1, z * 10, 10, 2, 10, (x + z) % 2 ? '#8a8090' : '#7a7080');
    for (let i = 0; i < 8; i++) { const hx = -90 + i * 26; box(sPlaza, hx, 15, -110, 20, 30, 18, '#c8a080'); box(sPlaza, hx, 33, -110, 24, 8, 22, '#8a3a2a'); box(sPlaza, hx, 12, -100.8, 5, 6, 0.5, '#ffd27a', true); } }
  const party = []; const pcol = [['#2a6aa8', '#e8e0d0', 'Ryu_Hyun'], ['#a83a7a', '#d8a050', 'Sora'], ['#3a8a5a', '#2a2020', 'DarkMage77'], ['#c8902a', '#5a3018', 'Jiwon']];
  pcol.forEach(([c, hair, name], i) => { const h = makeHero({ shirt: c, plate: c, hair }); h.position.set(-36 + i * 18, 0, 0); sPlaza.add(h);
    const tag = panel(h, 16, 3.6, (x, w, h2, st) => { rr(x, 0, 0, w, h2, 40); x.fillStyle = 'rgba(0,0,0,0.6)'; x.fill(); txt(x, name, w / 2, h2 / 2, 110, st.off ? '#888' : '#7dffa0'); }); tag.position.set(0, 26, 0); tag.userData.set({});
    party.push({ h, tag, name }); });
  const heroP = makeHero(); heroP.position.set(36, 0, 0); sPlaza.add(heroP);
  const dust = particles(sPlaza, 400, '#bfe6ff', 0.9);

  // 7) TAVERNA
  const sTav = newSet('tavern', { bg: gradTex(['#120804', '#2a140a']), fog: [0x1a0c06, 40, 260], hemi: [0xffb070, 0x2a1408, 1.0], sun: [0xffb070, 0.7], rim: [0xff7a30, 0.8] });
  { box(sTav, 0, -1, 0, 120, 2, 120, '#3a2416'); box(sTav, 0, 30, -50, 120, 62, 2, '#2a1810'); box(sTav, -58, 30, 0, 2, 62, 120, '#24140c'); box(sTav, 58, 30, 0, 2, 62, 120, '#24140c');
    for (let i = 0; i < 6; i++) box(sTav, -50 + i * 20, 44, 0, 3, 3, 120, '#1a0e08');
    box(sTav, 30, 8, -36, 50, 16, 10, '#5a3420'); for (let i = 0; i < 5; i++) box(sTav, 12 + i * 9, 20, -44, 6, 8, 6, '#6a4028');
    [[-20, 0], [10, 14], [-30, 30]].forEach(([x, z]) => { box(sTav, x, 9, z, 16, 1.6, 12, '#6a4028'); box(sTav, x, 4.5, z, 2, 9, 2, '#4a2a18'); }); }
  const candles = []; [[-20, 0], [10, 14], [-30, 30], [30, -30]].forEach(([x, z], i) => { box(sTav, x, 11, z, 1, 2.4, 1, '#f3e2c4'); const f = box(sTav, x, 12.8, z, 0.8, 1.4, 0.8, '#ffcc55', true); const l = new T3.PointLight(0xff9a40, 2.5, 70); l.position.set(x, 16, z); sTav.add(l); candles.push({ f, l, i }); });
  const npcs = [['#7a3a2a', '#3a2a1a'], ['#2a5a3a', null], ['#5a2a6a', '#2a1a3a'], ['#8a6a2a', null], ['#3a3a7a', '#1a1a3a']].map(([c, hat], i) => { const n = makeNPC(c, hat); n.position.set(-40 + i * 20, 0, -20 + (i % 2) * 8); sTav.add(n); return n; });
  const heroT = makeHero(); heroT.position.set(-20, 0, 8); sTav.add(heroT);
  const bubble = panel(sTav, 21, 7.7, (x, w, h) => { rr(x, 10, 10, w - 20, h - 60, 50); x.fillStyle = '#fff4dc'; x.fill(); x.beginPath(); x.moveTo(w * .3, h - 52); x.lineTo(w * .26, h - 6); x.lineTo(w * .42, h - 52); x.fill(); txt(x, 'Bem-vindo, aventureiro!', w / 2, (h - 50) / 2 + 6, 74, '#2a1a10', 700, 'Inter'); });

  // 8) SALA DO TRONO: chefe, luta, explosão, silêncio, janela dourada, mão, botão
  const sThrone = newSet('throne', { bg: gradTex(['#0a0206', '#2a0610', '#120208']), fog: [0x1a0408, 60, 380], hemi: [0xff7a7a, 0x200410, 1.1], sun: [0xffa080, 0.9], rim: [0x8a2aff, 1.4] });
  const throneStatic = grp(sThrone);
  { for (let x = -8; x < 8; x++) for (let z = -14; z < 6; z++) box(throneStatic, x * 10, -1, z * 10, 10, 2, 10, (x + z) % 2 ? '#1a0a10' : '#240e16');
    box(throneStatic, 0, 0.2, -10, 18, 0.6, 180, '#5a0a1a');
    for (let i = 0; i < 6; i++) [-40, 40].forEach(x => { box(throneStatic, x, 40, -i * 30, 8, 80, 8, '#16080e'); box(throneStatic, x, 2, -i * 30, 12, 4, 12, '#2a121a'); box(throneStatic, x, 60, -i * 30 + 4.5, 2, 3, 1, '#ff6a2a', true); });
    const th = grp(throneStatic, 0, 0, -120); box(th, 0, 6, 0, 30, 12, 20, '#1a0a14'); box(th, 0, 22, -8, 30, 40, 4, '#2a1020'); box(th, 0, 44, -8, 14, 8, 4, '#d8b048'); }
  const boss = makeBoss(); boss.scale.setScalar(3); boss.position.set(0, 12, -118); sThrone.add(boss);
  const heroTh = makeHero(); sThrone.add(heroTh);
  const sparks = particles(sThrone, 220, '#ffd27a', 0.9);
  const bossBits = particles(sThrone, 1400, '#ffb060', 1.6);
  const motes = particles(sThrone, 200, '#ffe0b0', 0.35);
  const hpPanel = panel(sThrone, 60, 12, (x, w, h, st) => { winBg(x, w, h, '#ff3b1f', 'rgba(20,2,6,0.9)'); txt(x, 'REI DAS SOMBRAS · CHEFE FINAL', w / 2, 70, 56, '#ff9a7a'); rr(x, 60, 120, w - 120, 50, 25); x.fillStyle = '#2a0710'; x.fill(); if (st.hp > 0) { rr(x, 60, 120, (w - 120) * st.hp, 50, 25); x.fillStyle = '#ff3b1f'; x.fill(); } });
  const dmg = []; for (let i = 0; i < 6; i++) { const d = panel(sThrone, 18, 6, (x, w, h, st) => { x.font = '700 150px Oswald'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 18; x.strokeStyle = '#2a0800'; x.strokeText(st.v || '', w / 2, h / 2); x.fillStyle = st.c || '#ffd166'; x.fillText(st.v || '', w / 2, h / 2); }); dmg.push(d); }
  const godRay = box(sThrone, 0, 60, 0, 16, 140, 16, '#fff0d0', true); godRay.material = new T3.MeshBasicMaterial({ color: '#fff0d0', transparent: true, opacity: 0.0, toneMapped: false, depthWrite: false });
  const goldWin = panel(sThrone, 40, 30, (x, w, h, st) => {
    winBg(x, w, h, '#ffc94a', 'rgba(24,16,4,0.94)'); txt(x, '[ SISTEMA ]', w / 2, 110, 60, '#ffc94a');
    txt(x, 'Deseja sair', w / 2, 270, 104, '#fff6dc', 700, 'Inter'); txt(x, 'de Evil Tale?', w / 2, 390, 104, '#fff6dc', 700, 'Inter');
    const by = 560, bw = 420 * (st.press ? 0.94 : 1), bh = 150 * (st.press ? 0.92 : 1);
    x.shadowColor = '#ffc94a'; x.shadowBlur = 40 + (st.glow || 0) * 60; rr(x, w / 2 - bw / 2, by - bh / 2, bw, bh, 30); x.fillStyle = '#ffc94a'; x.fill(); x.shadowBlur = 0;
    txt(x, 'SAIR', w / 2, by + 4, 120, '#1d1200');
    if (st.cracks) { const R = rng(31); x.strokeStyle = 'rgba(255,255,255,0.9)'; x.lineWidth = 6; for (let k = 0; k < Math.floor(st.cracks * 14); k++) { let X = w / 2, Y = by; x.beginPath(); x.moveTo(X, Y); const a = R() * Math.PI * 2; for (let s = 0; s < 6; s++) { X += Math.cos(a + (R() - .5)) * 70; Y += Math.sin(a + (R() - .5)) * 70; x.lineTo(X, Y); } x.stroke(); } }
  });
  const goldLight = new T3.PointLight(0xffc94a, 0, 160); sThrone.add(goldLight);
  const bigHand = grp(sThrone); { box(bigHand, 0, -20, 0, 9, 40, 7, '#e8bc94'); box(bigHand, 0, 2, 0, 11, 10, 7, '#f2c9a0'); box(bigHand, 2.8, 12, 0, 3, 12, 3, '#f2c9a0'); [-1.2, -4, ].forEach((x, i) => box(bigHand, x, 9 - i, 0, 2.6, 6, 3, '#f2c9a0')); box(bigHand, -6.4, 3, 1, 3, 6, 3, '#f2c9a0'); box(bigHand, 0, -30, 0, 11, 16, 9, '#7a4a2a'); }
  const ring = new T3.Mesh(new T3.RingGeometry(0.8, 1, 48), new T3.MeshBasicMaterial({ color: '#fff6c0', transparent: true, toneMapped: false, side: T3.DoubleSide })); sThrone.add(ring);
  const shards = particles(sThrone, 500, '#c8a0ff', 3.4);
  const shards2 = particles(sThrone, 300, '#ffffff', 2.4);

  // 9) CASA (memória)
  const sHome = newSet('home', { bg: gradTex(['#2a3a7a', '#e8907a', '#ffd9a0']), fog: [0xe8a080, 60, 420], hemi: [0xffd0a0, 0x5a3a2a, 1.2], sun: [0xffb070, 1.4], rim: [0xff8a5a, 0.6] });
  { const R = rng(17); for (let x = -10; x < 10; x++) for (let z = -14; z < 8; z++) box(sHome, x * 10, -1, z * 10, 10, 2, 10, R() < .5 ? '#6a9a4a' : '#5e8e42');
    const hs = grp(sHome, 0, 0, -40); box(hs, 0, 14, 0, 44, 28, 32, '#e8dcc8'); for (let i = 0; i < 6; i++) box(hs, 0, 30 + i * 3, 0, 48 - i * 8, 3, 36, '#a03a2a');
    box(hs, -10, 9, 16.2, 9, 18, 0.6, '#6a4028'); box(hs, 10, 16, 16.2, 10, 9, 0.6, '#ffd27a', true); box(hs, 10, 16, 16.6, 0.8, 9, 0.6, '#5a3a24'); box(hs, 10, 16, 16.6, 10, 0.8, 0.6, '#5a3a24');
    box(hs, 16, 40, -6, 5, 12, 5, '#7a3a2a'); tree(sHome, -40, -30, 1.4, '#3a7a3a'); tree(sHome, 46, -50, 1.2, '#4a8a3a');
    for (let i = 0; i < 14; i++) box(sHome, -60 + i * 9, 4, 10, 1, 8, 1, '#f0e6d0'); box(sHome, -2, 7, 10, 126, 1, 0.8, '#f0e6d0'); }
  const homeLight = new T3.PointLight(0xffc070, 3, 80); homeLight.position.set(10, 16, -10); sHome.add(homeLight);
  const smoke = particles(sHome, 60, '#d8d0e0', 2.2);

  // 10) OUTRO MUNDO: grama, duas luas, ilhas flutuantes, criaturas, X no céu
  const sNew = newSet('new', { bg: gradTex(['#0e2a4a', '#3a5aa6', '#a87ac8', '#ffb8c8']), fog: [0x9a8ac8, 90, 700], hemi: [0xcfe0ff, 0x2a5a4a, 1.2], sun: [0xe8f0ff, 1.2], rim: [0xff9ad0, 1.0] });
  { const R = rng(19); for (let x = -16; x < 16; x++) for (let z = -24; z < 8; z++) box(sNew, x * 10, -1 + Math.sin(x * .5) * 1.2 + Math.cos(z * .4), z * 10, 10, 2, 10, R() < .5 ? '#2e7a5e' : '#348a66');
    const m1 = new T3.Mesh(new T3.SphereGeometry(40, 24, 16), bmat('#fff6e0')); m1.position.set(-120, 260, -520); sNew.add(m1);
    const m2 = new T3.Mesh(new T3.SphereGeometry(22, 24, 16), bmat('#cfe6ff')); m2.position.set(70, 330, -560); sNew.add(m2);
    [[160, 150, -380, 1.4], [-200, 110, -330, 1], [40, 200, -460, 0.8], [-60, 90, -260, 0.6]].forEach(([x, y, z, s], i) => { const il = grp(sNew, x, y, z); il.scale.setScalar(s); il.userData.bob = i;
      for (let k = 0; k < 6; k++) box(il, 0, -k * 6, 0, 50 - k * 8, 6, 40 - k * 6, k ? '#5a4a8a' : '#3fae8f');
      box(il, -8, 14, 0, 6, 24, 6, '#e8f6ff'); box(il, 6, 20, 4, 8, 36, 8, '#d0ecff'); box(il, 6, 40, 4, 12, 4, 12, '#ffc94a', true);
      const wf = box(il, 22, -30, 0, 4, 60, 4, '#bfe8ff', true); wf.material = new T3.MeshBasicMaterial({ color: '#bfe8ff', transparent: true, opacity: 0.6, toneMapped: false });
      il.userData.y0 = y; sNew.userData['il' + i] = il; });
    for (let i = 0; i < 16; i++) { const bx = (R() - .5) * 200, bz = -20 - R() * 80; box(sNew, bx, 3, bz, 8 + R() * 6, 6 + R() * 4, 8, '#1e5a44'); }
  }
  const grassN = 2600; const grass = new T3.InstancedMesh(BOX, mat('#5fbf8f'), grassN); grass.frustumCulled = false; sNew.add(grass);
  const grassSeed = []; { const R = rng(23); for (let i = 0; i < grassN; i++) grassSeed.push([(R() - .5) * 220, -R() * 200 + 40, 2 + R() * 4, R() * 6.28]); }
  const gd = new T3.Object3D();
  function placeGrass(t, wind) { for (let i = 0; i < grassN; i++) { const s = grassSeed[i]; gd.position.set(s[0], 1 + s[2] / 2, s[1]); gd.scale.set(0.5, s[2], 0.5); gd.rotation.set(0, 0, Math.sin(t * 2.2 + s[3] + s[0] * 0.03) * wind); gd.updateMatrix(); grass.setMatrixAt(i, gd.matrix); } grass.instanceMatrix.needsUpdate = true; }
  const heroN = makeHero(); sNew.add(heroN);
  const eyesN = []; { const R = rng(29); for (let i = 0; i < 7; i++) { const g = grp(sNew, (R() - .5) * 140, 4 + R() * 3, -30 - R() * 60); box(g, 0, 0, -1, 10, 6, 4, '#123a2c'); const a = box(g, -1.6, 0.6, 1.1, 1.2, 1.2, 0.2, '#ffe066', true); const b = box(g, 1.6, 0.6, 1.1, 1.2, 1.2, 0.2, '#ffe066', true); g.userData = { a, b, ph: R() * 3 }; eyesN.push(g); } }
  const xCubes = particles(sNew, 180, '#b98cff', 8);
  const lidT = box(sNew, 0, 0, 0, 400, 200, 1, '#000000', true), lidB = box(sNew, 0, 0, 0, 400, 200, 1, '#000000', true);
  const fireflies = particles(sNew, 150, '#fff3a0', 0.6);

  // ---------- helpers de cena ----------
  let curSet = null;
  function useSet(name) {
    if (curSet === name) return; curSet = name;
    for (const k in SETS) SETS[k].g.visible = (k === name);
    const s = SETS[name]; scene.background = s.bg; scene.fog = new T3.Fog(s.fog[0], s.fog[1], s.fog[2]);
    hemi.color.set(s.hemi[0]); hemi.groundColor.set(s.hemi[1]); hemi.intensity = s.hemi[2];
    sun.color.set(s.sun[0]); sun.intensity = s.sun[1]; rim.color.set(s.rim[0]); rim.intensity = s.rim[1];
  }
  function camAt(p, l, fov) { cam.position.set(p[0], p[1], p[2]); cam.lookAt(l[0], l[1], l[2]); fov = fov || 50; if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); } }
  function orbit(c, r, a, y) { return [c[0] + Math.sin(a) * r, y, c[2] + Math.cos(a) * r]; }
  function faceCam(m) { m.quaternion.copy(cam.quaternion); }
  const fx = { flash: 0, shake: 0, tint: null, tintA: 0, black: 0, glitch: 0 };
  const hits = (t, list, w) => list.reduce((s, h) => { const k = (t - h) / w; return k >= 0 && k < 1 ? Math.max(s, 1 - k) : s; }, 0);

  // ---------- planos (shots) ----------
  const S = {
    intro(lt, T, g) { useSet('void'); heroV.position.set(0, 0, 0); heroV.rotation.y = 0; heroPose(heroV, g, { headY: Math.sin(g * .7) * .2, headX: -0.05 });
      cage.visible = false; barrier.visible = false; voidLight.intensity = 0;
      const a = lerp(-0.7, 0.5, eIO(lt / T)); camAt(orbit([0, 0, 0], lerp(26, 20, lt / T), a, 18), [0, 16.5, 0], 45); },
    cage(lt, T, g) { useSet('void'); heroV.position.set(0, 0, 0); cage.visible = true; barrier.visible = false; const d = eOut(prog(lt, 0, 0.45)); cage.position.y = lerp(60, 0, d); voidLight.intensity = 3 * d;
      fx.shake = hits(lt, [0.45], 0.4) * 1.2; fx.flash = Math.max(fx.flash, hits(lt, [0.45], 0.25) * 0.5);
      heroPose(heroV, g, { headX: -0.4 * d, armL: -0.6 * d, armR: -0.6 * d, armLz: 0.5 * d, armRz: -0.5 * d });
      camAt(orbit([0, 0, 0], lerp(34, 60, eOut(lt / T)), 0.3 + lt * 0.08, lerp(18, 32, lt / T)), [0, 14, 0], 50); },
    title(lt, T, g) { useSet('ruins'); heroR.position.set(0, -3.5, 0); heroR.rotation.y = 0;
      heroPose(heroR, g, { legL: -1.4, legR: 0.2, lean: 0.35, headX: 0.2, armR: -0.8, armL: 0.3 }); heroR.userData.P.hips.position.y = 4.5;
      gate.visible = false; lightning.visible = false;
      titlePanel.visible = true; const s = eBack(prog(lt, 0.1, 0.6)); titlePanel.scale.setScalar(Math.max(0.001, s) * 0.8); titlePanel.position.set(0, 30, -10);
      titlePanel.userData.set({ j: (Math.floor(g * 14) % 3 === 0 && lt < 1.6) ? (Math.floor(g * 31) % 2 ? 1 : -1) : 0 });
      embersR.userData.place((i, d) => { const R = rng(i + 1); const sp = 3 + R() * 6; d.position.set((R() - .5) * 160, ((R() * 90 + g * sp) % 90), -120 + R() * 130); d.rotation.set(g + i, g * 0.7, 0); });
      camAt(L3([0, 8, 74], [0, 14, 52], eOut(lt / T)), [0, 38, -10], 55); },
    gate(lt, T, g) { useSet('ruins'); titlePanel.visible = false; gate.visible = true; lightning.visible = false;
      const c = eIn(prog(lt, 0.1, 0.9)); doorL.position.x = lerp(-40, -14, c); doorR.position.x = lerp(40, 14, c);
      xPanel.visible = lt > 0.95; xPanel.scale.setScalar(Math.max(0.01, eBack(prog(lt, 0.95, 1.3))));
      fx.shake = hits(lt, [0.9, 1.0], 0.5) * 2; fx.flash = Math.max(fx.flash, hits(lt, [0.95], 0.2) * 0.4);
      heroR.position.set(0, 0, 20); heroR.rotation.y = Math.PI; heroPose(heroR, g, { headX: -0.2 });
      camAt(L3([10, 12, 70], [0, 20, 60], eOut(lt / T)), [0, 34, -60], 60); },
    barrier(lt, T, g) { useSet('void'); cage.visible = false; barrier.visible = true; voidLight.intensity = 0;
      const cyc = 1.0; const k = (lt % cyc) / cyc; const run = k < 0.55 ? eIn(k / 0.55) : 1 - eOut((k - 0.55) / 0.45) * 0.9;
      heroV.position.set(lerp(6, -22, run), 0, 0); heroV.rotation.y = -Math.PI / 2; heroPose(heroV, g, { walk: 16, lean: 0.3 * (k < .55 ? 1 : -1) });
      const hit = k > 0.55 && k < 0.8 ? 1 - (k - 0.55) / 0.25 : 0; barrier.userData.set({ a: Math.round(hit * 10) / 10 });
      fx.shake = hit * 1.4; camAt([lerp(-6, 4, lt / T), 14, 46], [-8, 12, 0], 48); },
    room(lt, T, g) { useSet('room'); heroRoom.position.set(0, -2.5, -14); heroRoom.rotation.y = Math.PI; heroPose(heroRoom, g, { legL: -1.4, legR: -1.4, armL: -1.2, armR: -1.3 + Math.sin(g * 18) * 0.06 }); heroRoom.userData.P.hips.position.y = 8.5;
      screen.userData.set({ t: Math.round(g * 15) / 15, off: 0 }); monLight.intensity = 2.2 + Math.sin(g * 9) * 0.3;
      camAt(L3([-34, 30, 40], [12, 26, 14], eIO(lt / T)), [0, 18, -30], 50); },
    slimes(lt, T, g) { useSet('field'); deathPanel.visible = false; beam.visible = false; beamP.visible = false;
      heroF.position.set(0, 0, 0); heroF.rotation.set(0, Math.sin(lt * 3) * 0.6 - 0.2, 0); const sl = (lt * 2.2) % 1; heroPose(heroF, g, { armR: lerp(-2.6, 0.6, eOut(sl)), twist: lerp(-0.4, 0.4, eOut(sl)), legL: 0.3, legR: -0.3 });
      slimes.forEach((s, i) => { const ph = s.userData.ph; const j = Math.abs(Math.sin(g * 3.5 + ph)); s.position.y = j * 6; s.userData.body.scale.set(1 + (1 - j) * 0.25, 1 - (1 - j) * 0.25, 1 + (1 - j) * 0.25); s.visible = !(i < 3 && lt > 0.4 + i * 0.45); });
      pop.visible = true; pop.userData.place((i, d) => { const which = Math.floor(i / 50); if (which > 2) return false; const t0 = 0.4 + which * 0.45; const k = lt - t0; if (k < 0 || k > 1) return false; const R = rng(i * 7 + 3); const s0 = slimes[which].position;
        d.position.set(s0.x + (R() - .5) * 30 * k, 3 + R() * 20 * k - 18 * k * k, s0.z + (R() - .5) * 30 * k); d.rotation.set(k * 5, k * 3, 0); });
      fx.shake = hits(lt, [0.4, 0.85, 1.3], 0.2) * 0.8;
      camAt(orbit([0, 0, -12], 50, 0.5 + lt * 0.25, 16), [0, 6, -14], 55); },
    monitor_off(lt, T, g) { useSet('room'); heroRoom.position.set(0, -2.5, -14); heroRoom.rotation.y = Math.PI; heroPose(heroRoom, g, { legL: -1.4, legR: -1.4, armL: -1.2, armR: -1.2, headX: 0.1 }); heroRoom.userData.P.hips.position.y = 8.5;
      const off = eIn(prog(lt, 0.3, 0.9)); screen.userData.set({ t: 0, off: Math.round(off * 20) / 20 }); monLight.intensity = 2.2 * (1 - off);
      camAt(L3([0, 22, -6], [0, 22, -12], lt / T), [0, 22, -33], 45); },
    menu(lt, T, g) { useSet('ui'); menuPanel.visible = true; cursor.visible = false; errPanels.forEach(e => e.visible = false); clockG.visible = false; countPanel.visible = false; rain.visible = false;
      menuPanel.position.set(0, 30, 0); menuPanel.rotation.set(0, 0, 0); menuPanel.scale.setScalar(0.8 * (eBack(prog(lt, 0, 0.4)) || 0.001));
      const gs = mk('sumiu'); const gl = prog(g, gs, gs + 0.6);
      menuPanel.userData.set({ gone: Math.round(gl * 10) / 10, j: (gl > 0 && gl < 1) ? (Math.floor(g * 25) % 2 ? 1 : -1) : 0 });
      fx.glitch = gl > 0 && gl < 1 ? 1 : 0; heroUI.position.set(0, -30, 30); heroUI.rotation.y = Math.PI; heroPose(heroUI, g, { headX: -0.5 });
      camAt(L3([0, 22, 96], [0, 28, 70], eOut(lt / T)), [0, 38, 0], 50); },
    clicks(lt, T, g) { useSet('ui'); menuPanel.visible = true; menuPanel.scale.setScalar(0.8); menuPanel.userData.set({ gone: 1 }); clockG.visible = false; countPanel.visible = false; rain.visible = false;
      menuPanel.position.set(0, 30, 0); menuPanel.rotation.set(0, 0, 0); cursor.visible = true; const ck = (lt * 4) % 1; cursor.position.set(4, 30 - 18 - 4 * 0 + (ck < 0.3 ? -1.5 : 0), 6); cursor.rotation.z = 0.3;
      cursor.position.y = 30 - 19 + (ck < 0.25 ? -1.4 : 0);
      const nE = Math.min(errPanels.length, Math.floor(lt * 4)); errPanels.forEach((e, i) => { e.visible = i < nE; const R = rng(i + 50); e.position.set((R() - .5) * 46, 10 + R() * 44, 4 + i * 0.6); e.rotation.z = (R() - .5) * 0.5; e.scale.setScalar(eBack(clamp((lt - i / 4) * 5)) || 0.001); });
      const nd = mk('nada'); const isN = g >= nd; fx.shake = (ck < 0.2 ? 0.5 : 0) + (isN ? hits(g, [nd], 0.5) * 2 : 0); fx.glitch = isN && g < nd + 0.5 ? 1 : 0; if (isN) fx.flash = Math.max(fx.flash, hits(g, [nd], 0.2) * 0.6);
      camAt(L3([0, 28, 70], [0, 26, 58], lt / T), [0, 38, 0], 52); },
    clock(lt, T, g) { useSet('ui'); menuPanel.visible = false; cursor.visible = false; errPanels.forEach(e => e.visible = false); clockG.visible = true; countPanel.visible = true; rain.visible = false;
      handH.rotation.z = -g * 3; handM.rotation.z = -g * 36; clockG.rotation.y = Math.sin(g * .5) * 0.3;
      const k = eOut(prog(lt, 0, T * 0.8)); const d = Math.round(k * 1229); const a = Math.floor(d / 365), m = Math.floor((d % 365) / 30); const dd = d >= 1229 ? 12 : d % 365 % 30;
      countPanel.position.set(0, 20, 10); countPanel.scale.setScalar(1); countPanel.userData.set({ label: 'TEMPO DE JOGO', value: `${a} anos · ${m} meses · ${dd} dias`, size: 78, col: '#ffd166' });
      camAt(orbit([0, 20, 0], 92, Math.sin(lt * .4) * .5, 26), [0, 22, 0], 50); },
    kills(lt, T, g) { useSet('ui'); clockG.visible = false; countPanel.visible = true; rain.visible = true; menuPanel.visible = false; cursor.visible = false;
      const k = eOut(prog(lt, 0, T * 0.85)); countPanel.position.set(0, 26, 10); countPanel.userData.set({ label: 'MONSTROS DERROTADOS', value: Math.round(k * 48213).toLocaleString('pt-BR'), col: '#7dff9b' });
      rain.userData.place((i, d) => { const R = rng(i + 90); const t0 = R() * T; const fall = lt - t0 * 0.8; const yy = fall < 0 ? 200 : Math.max(-26 + (i % 20) * 0.0 + Math.floor(i / 26) * 3.2 * k, 140 - fall * fall * 120); d.position.set((R() - .5) * 90, yy, (R() - .5) * 50); d.rotation.set(R() * 3 + (yy > -20 ? g * 2 : 0), R() * 3, 0); });
      camAt(L3([0, 6, 110], [0, 30, 92], eIO(lt / T)), [0, 40, 0], 55); },
    death(lt, T, g) { useSet('field'); slimes.forEach(s => s.visible = false); pop.visible = false; beam.visible = false; beamP.visible = false; deathPanel.visible = true;
      const f = eOut(prog(lt, 0, 0.7)); heroF.position.set(0, 0, 0); heroF.rotation.set(-f * Math.PI / 2, 0, 0); heroPose(heroF, g, { armL: -0.3, armR: 0.3 });
      deathPanel.position.set(0, 30, 0); faceCam(deathPanel); deathPanel.scale.setScalar(eBack(prog(lt, 0.3, 0.7)) || 0.001); deathPanel.userData.set({ n: Math.round(eOut(prog(lt, 0.4, T * 0.9)) * 1204) });
      fx.tint = '#5a0010'; fx.tintA = 0.45; fx.flash = Math.max(fx.flash, hits(lt, [0.65], 0.2) * 0.3);
      camAt([Math.sin(lt * 0.3) * 10, lerp(70, 60, lt / T), 30], [0, 6, 0], 55); },
    respawn(lt, T, g) { useSet('field'); slimes.forEach(s => s.visible = false); pop.visible = false; deathPanel.visible = false; beam.visible = true; beamP.visible = true;
      const r = eOut(prog(lt, 0.2, 1.4)); beam.scale.x = beam.scale.z = lerp(0.1, 1, eOut(prog(lt, 0, 0.3))) * (1 - prog(lt, T - 0.6, T) * 0.9) * 10;
      heroF.position.set(0, lerp(-20, 0, r), 0); heroF.rotation.set(0, 0, 0); heroPose(heroF, g, { headX: -0.3 * (1 - r), armL: -0.5, armR: -0.5, armLz: 0.6, armRz: -0.6 });
      beamP.userData.place((i, d) => { const R = rng(i + 300); d.position.set((R() - .5) * 12, ((R() * 80 + lt * (20 + R() * 30)) % 80), (R() - .5) * 12); d.rotation.set(lt * 4 + i, i, 0); });
      camAt(L3([0, 3, 44], [10, 8, 34], eIO(lt / T)), [0, 14, 0], 55); },
    party(lt, T, g) { useSet('plaza'); const gone = [mk('ryu'), mk('sora'), mk('todos'), mk('todos') + 0.25];
      party.forEach((p, i) => { const k = prog(g, gone[i], gone[i] + 0.5); p.h.visible = k < 0.05; p.tag.userData.set({ off: g > gone[i] ? 1 : 0 }); heroPose(p.h, g + i, { headY: Math.sin(g + i) * 0.2 }); });
      heroPose(heroP, g, { headY: -0.6 + Math.sin(g * .8) * 0.2 });
      dust.userData.place((i, d) => { const which = Math.floor(i / 100); const k = g - gone[which]; if (k < 0 || k > 1.6) return false; const R = rng(i + 500); const p0 = party[which].h.position;
        d.position.set(p0.x + (R() - .5) * 6 + (R() - .5) * 20 * k, 2 + R() * 18 + k * 18 * R(), p0.z + (R() - .5) * 6 + (R() - .5) * 10 * k); d.rotation.set(k * 4, i, 0); d.scale.setScalar(0.9 * (1 - k / 1.6)); });
      const u = lt / T; camAt(L3([-50, 20, 70], [30, 16, 55], eIO(u)), L3([-20, 12, 0], [20, 12, 0], eIO(u)), 50); },
    tavern(lt, T, g) { useSet('tavern'); bubble.visible = false; candles.forEach(c => { const f = 0.85 + 0.15 * Math.sin(g * 11 + c.i * 2) * Math.sin(g * 7.3 + c.i); c.f.scale.y = 1.4 * f; c.l.intensity = 2.5 * f; });
      npcs.forEach((n, i) => { n.rotation.y = 0; heroPose(n, g, { headZ: Math.sin(g * 2) * 0.15, armR: Math.sin(g * 2) * 0.3, blinkOff: 0 }); });
      heroT.position.set(-20, -2.5, 8); heroT.rotation.y = Math.PI * 0.85; heroPose(heroT, g, { legL: -1.4, legR: -1.4, headX: 0.3, armL: -1, armR: -1 }); heroT.userData.P.hips.position.y = 8.5;
      camAt(L3([40, 30, 90], [20, 22, 55], eIO(lt / T)), [-10, 12, -6], 52); },
    npc1(lt, T, g) { useSet('tavern'); const n = npcs[1]; npcs.forEach(m => heroPose(m, g, { headZ: Math.sin(g * 2) * 0.15, armR: Math.sin(g * 2) * 0.3 }));
      bubble.visible = true; bubble.position.set(n.position.x + 6, 32, n.position.z + 2); faceCam(bubble); bubble.scale.setScalar(eBack(prog(lt, 0.05, 0.3)) || 0.001);
      camAt(L3([n.position.x + 16, 22, n.position.z + 52], [n.position.x + 12, 22, n.position.z + 42], lt / T), [n.position.x + 4, 22, n.position.z], 50); },
    npc2(lt, T, g) { useSet('tavern'); const n = npcs[3]; npcs.forEach(m => heroPose(m, g, { headZ: Math.sin(g * 2) * 0.15, armR: Math.sin(g * 2) * 0.3 }));
      bubble.visible = true; bubble.position.set(n.position.x - 6, 32, n.position.z + 2); faceCam(bubble); bubble.scale.setScalar(eBack(prog(lt, 0.05, 0.3)) || 0.001);
      camAt(L3([n.position.x - 16, 22, n.position.z + 52], [n.position.x - 12, 22, n.position.z + 42], lt / T), [n.position.x - 4, 22, n.position.z], 50); },
    castle(lt, T, g) { useSet('ruins'); titlePanel.visible = false; gate.visible = false; lightning.visible = true;
      heroR.position.set(0, 0, 30); heroR.rotation.y = Math.PI; heroPose(heroR, g, { headX: -0.15 }); heroR.userData.P.hips.position.y = 7;
      const lt2 = [0.5, 1.7, 2.6]; const f = hits(lt, lt2, 0.18); lightning.visible = f > 0; fx.flash = Math.max(fx.flash, f * 0.55);
      embersR.userData.place((i, d) => { const R = rng(i + 1); d.position.set((R() - .5) * 160, ((R() * 90 + g * 5) % 90), -120 + R() * 130); d.rotation.set(g + i, g, 0); });
      camAt(L3([6, 18, 62], [4, 34, 52], eIO(lt / T)), [-30, 110, -300], 55); },
    boss_reveal(lt, T, g) { useSet('throne'); boss.visible = true; hpPanel.visible = false; heroTh.visible = false; dmg.forEach(d => d.visible = false); sparks.visible = bossBits.visible = motes.visible = false; godRay.material.opacity = 0; goldWin.visible = false; bigHand.visible = false; ring.visible = false; shards.visible = shards2.visible = false; throneStatic.visible = true;
      const P = boss.userData.P; const ig = eOut(prog(lt, 0.3, 0.8)); P.eyes.forEach(e => e.scale.set(1.4, 0.6 * ig + 0.01, 0.1)); P.eyeLight.intensity = 6 * ig;
      const up = eIO(prog(lt, 0.6, T)); boss.position.y = lerp(8, 12, up); P.head.rotation.x = lerp(0.3, 0, up);
      fx.flash = Math.max(fx.flash, hits(lt, [0.5], 0.2) * 0.4); fx.shake = hits(lt, [0.5], 0.6);
      camAt(L3([0, 6, -40], [0, 4, -52], eOut(lt / T)), [0, lerp(40, 70, eIO(lt / T)), -118], 60); },
    boss_bar(lt, T, g) { useSet('throne'); heroTh.visible = true; heroTh.position.set(0, 0, 10); heroTh.rotation.y = Math.PI; heroPose(heroTh, g, { armR: -1.2, twist: 0.2 });
      const P = boss.userData.P; P.eyes.forEach(e => e.scale.set(1.4, 0.6, 0.1)); P.eyeLight.intensity = 6; boss.position.y = 12;
      boss.visible = true; hpPanel.visible = true; hpPanel.position.set(0, 96, -20); hpPanel.scale.setScalar(1.3); hpPanel.scale.setScalar(1.3 * (eBack(prog(lt, 0, 0.35)) || 0.001)); hpPanel.userData.set({ hp: 1 });
      fx.shake = hits(lt, [0.3], 0.4) * 1.2;
      camAt(L3([20, 20, 60], [10, 40, 90], eOut(lt / T)), [0, 60, -60], 55); },
    fight(lt, T, g) { useSet('throne'); boss.visible = true; heroTh.visible = true; hpPanel.visible = true; sparks.visible = true; const P = boss.userData.P; P.eyeLight.intensity = 6;
      const hitsT = []; for (let k = 0.45; k < T - 0.2; k += 0.7) hitsT.push(k);
      const cyc = (lt % 0.7) / 0.7; const dash = cyc < 0.6 ? eIn(cyc / 0.6) : 1 - eOut((cyc - 0.6) / 0.4);
      heroTh.position.set(Math.sin(lt * 2) * 14, dash * 6, lerp(10, -80, dash)); heroTh.rotation.set(0, Math.PI, 0); heroPose(heroTh, g, { armR: lerp(0.8, -2.8, dash), twist: lerp(-0.6, 0.6, dash), legL: dash, legR: -dash, lean: 0.4 });
      P.armR.rotation.x = -1.2 + Math.sin(lt * 5) * 1.0; P.torso.rotation.y = Math.sin(lt * 2.5) * 0.3; boss.position.y = 12;
      const hp = 1 - 0.8 * (hitsT.filter(h => lt > h).length / Math.max(1, hitsT.length)); hpPanel.position.set(0, 110, -70); hpPanel.scale.setScalar(1.2); faceCam(hpPanel); hpPanel.userData.set({ hp: Math.round(hp * 100) / 100 });
      sparks.userData.place((i, d) => { const which = Math.floor(i / 30); const h = hitsT[which]; if (h === undefined) return false; const k = lt - h; if (k < 0 || k > 0.6) return false; const R = rng(i + 900);
        d.position.set(heroTh.position.x * 0 + (R() - .5) * 60 * k, 40 + (R() - .5) * 50 * k, -80 + (R() - .5) * 30 * k); d.rotation.set(k * 9, i, 0); d.scale.setScalar(1.2 * (1 - k / 0.6)); });
      const vals = ['-12.480', '-15.022', '-9.731', '-18.400', '-21.006', '-14.900'];
      dmg.forEach((d, i) => { const h = hitsT[i]; const k = h === undefined ? -1 : lt - h; d.visible = k >= 0 && k < 0.7; if (!d.visible) return; d.position.set(-20 + (i % 3) * 20, 70 + k * 20, -60); faceCam(d); d.scale.setScalar(lerp(1.6, 1, eOut(clamp(k * 6)))); d.userData.set({ v: vals[i % vals.length] }); });
      fx.shake = hits(lt, hitsT, 0.25) * 1.6; fx.flash = Math.max(fx.flash, hits(lt, hitsT, 0.1) * 0.35);
      camAt(orbit([0, 0, -64], 62, Math.sin(lt * 1.3) * 0.45, 30 + Math.sin(lt) * 8), [0, 38, -80], 58); },
    last_hit(lt, T, g) { useSet('throne'); boss.visible = true; heroTh.visible = true; hpPanel.visible = true; hpPanel.position.set(0, 110, -70); faceCam(hpPanel); hpPanel.userData.set({ hp: 0.05 }); sparks.visible = false; dmg.forEach(d => d.visible = false);
      const k = eIO(prog(lt, 0, T)); heroTh.position.set(0, lerp(10, 70, Math.sin(k * Math.PI) * 0.9 + k * 0.1), lerp(0, -80, k)); heroTh.rotation.set(0, Math.PI, 0); heroPose(heroTh, g * 0.25, { armR: lerp(-3.0, 0.4, eIn(k)), armL: -2.6, legL: -0.8, legR: 0.6, lean: -0.3 + k * 0.6 });
      camAt(orbit([0, 40, -40], lerp(60, 80, k), lerp(-1.2, -0.4, k), lerp(30, 50, k)), heroTh.position.toArray(), 50);
      fx.flash = Math.max(fx.flash, prog(lt, T - 0.15, T) * 0.9); },
    explode(lt, T, g) { useSet('throne'); boss.visible = lt < 0.08; heroTh.visible = true; hpPanel.visible = lt < 0.4; hpPanel.position.set(0, 110, -70); hpPanel.userData.set({ hp: 0 }); bossBits.visible = true;
      heroTh.position.set(0, 0, -70); heroTh.rotation.set(0, Math.PI, 0); heroPose(heroTh, g, { legL: -1.2, legR: 0.4, lean: 0.4, armR: 0.4 }); heroTh.userData.P.hips.position.y = 5;
      const k = eOut(prog(lt, 0, T)); bossBits.userData.place((i, d) => { const R = rng(i + 2000); const sx = (R() - .5) * 30, sy = 10 + R() * 70, sz = -118 + (R() - .5) * 20; const a = R() * 6.28, b = R() * 3.14;
        const dist = k * (40 + R() * 160); d.position.set(sx + Math.cos(a) * Math.sin(b) * dist, sy + Math.cos(b) * dist * 0.6 + k * 40 * R(), sz + Math.sin(a) * Math.sin(b) * dist); d.rotation.set(k * 6 + i, k * 4, 0); d.scale.setScalar(1.6 * (1 - k * 0.8)); });
      fx.flash = Math.max(fx.flash, (1 - prog(lt, 0, 0.5)) * 0.9); fx.shake = (1 - prog(lt, 0, 1.2)) * 2.2;
      camAt(L3([0, 30, 40], [0, 50, 90], k), [0, 50, -100], 55); },
    silence(lt, T, g) { useSet('throne'); boss.visible = false; bossBits.visible = false; hpPanel.visible = false; heroTh.visible = true; motes.visible = true;
      heroTh.position.set(0, 0, -60); heroTh.rotation.set(0, Math.PI, 0); heroPose(heroTh, g * 0.5, { legL: -1.3, legR: 0.3, lean: 0.5, headX: 0.4, armR: 0.5, armL: 0.3 }); heroTh.userData.P.hips.position.y = 4.5;
      godRay.position.set(0, 70, -60); godRay.material.opacity = 0.22; throneStatic.visible = true;
      motes.userData.place((i, d) => { const R = rng(i + 3000); d.position.set((R() - .5) * 20 + Math.sin(g * .3 + i) * 2, (R() * 110 + g * 1.5) % 110, -60 + (R() - .5) * 20); });
      fx.tint = '#000000'; fx.tintA = 0.35;
      camAt(L3([0, 30, 20], [0, 26, 0], lt / T), [0, 14, -60], 50); },
    window(lt, T, g) { useSet('throne'); heroTh.visible = true; motes.visible = true; goldWin.visible = true; godRay.material.opacity = 0.12;
      heroTh.position.set(0, 0, -60); heroTh.rotation.set(0, Math.PI, 0); const up = eIO(prog(lt, 0.4, 1.6)); heroPose(heroTh, g * 0.5, { legL: lerp(-1.3, 0, up), legR: lerp(0.3, 0, up), lean: lerp(0.5, 0, up), headX: lerp(0.4, -0.2, up) }); heroTh.userData.P.hips.position.y = lerp(4.5, 7, up);
      const o = eBack(prog(lt, 0.1, 0.7)); goldWin.position.set(0, 34, -82); goldWin.rotation.set(0, 0, 0); goldWin.scale.set(Math.max(0.01, o), Math.max(0.01, eOut(prog(lt, 0.1, 0.5))), 1); goldWin.userData.set({ glow: 0 });
      goldLight.position.set(0, 34, -76); goldLight.intensity = 5 * o; fx.flash = Math.max(fx.flash, hits(lt, [0.2], 0.3) * 0.35);
      motes.userData.place((i, d) => { const R = rng(i + 3000); d.position.set((R() - .5) * 40, (R() * 80 + g * 2) % 80, -80 + (R() - .5) * 20); });
      camAt(L3([10, 22, 10], [4, 26, -16], eOut(lt / T)), [0, 40, -82], 50); },
    window_close(lt, T, g) { useSet('throne'); goldWin.visible = true; goldWin.position.set(0, 34, -82); goldWin.rotation.set(0, 0, 0); goldWin.scale.set(1, 1, 1); goldLight.position.set(0, 34, -76); goldLight.intensity = 5;  goldWin.userData.set({ glow: Math.round((0.5 + 0.5 * Math.sin(g * 5)) * 10) / 10 }); goldLight.intensity = 5;
      camAt(L3([-8, 32, -30], [4, 31, -38], lt / T), [0, 38, -82], 50); },
    hand(lt, T, g) { useSet('throne'); goldWin.visible = true; goldWin.position.set(0, 34, -82); goldWin.rotation.set(0, 0, 0); goldWin.scale.set(1, 1, 1); goldLight.position.set(0, 34, -76); goldLight.intensity = 5;  bigHand.visible = true; heroTh.visible = false; goldWin.userData.set({ glow: 0.6 });
      const r = eIO(prog(lt, 0, T)); const tr = Math.sin(g * 31) * 0.35 + Math.sin(g * 47) * 0.2;
      bigHand.position.set(2 + tr, lerp(4, 22, r), lerp(-52, -66, r)); bigHand.rotation.set(-0.5 + tr * 0.05, 0.2, tr * 0.04);
      camAt([0, 30, -38], [0, 36, -82], 55); },
    button(lt, T, g) { useSet('throne'); goldWin.visible = true; goldWin.position.set(0, 34, -82); goldWin.rotation.set(0, 0, 0); goldWin.scale.set(1, 1, 1); goldLight.position.set(0, 34, -76); goldLight.intensity = 5;  bigHand.visible = false; goldWin.userData.set({ glow: Math.round((0.6 + 0.4 * Math.sin(g * 6)) * 10) / 10 });
      motes.visible = true; motes.userData.place((i, d) => { const R = rng(i + 3100); d.position.set((R() - .5) * 20, 22 + (R() * 20 + g * 3) % 20, -80 + R() * 4); });
      camAt(L3([0, 27, -56], [0, 27, -62], eOut(lt / T)), [0, 27, -82], 42); },
    home(lt, T, g) { useSet('home'); smoke.userData.place((i, d) => { const R = rng(i + 4000); const k = ((g * 0.25 + R()) % 1); d.position.set(16 + Math.sin(k * 6 + i) * 3 * k, 46 + k * 50, -46); d.scale.setScalar(1 + k * 3); });
      fx.tint = '#ffb070'; fx.tintA = 0.12;
      camAt(L3([-30, 14, 90], [-8, 18, 60], eIO(lt / T)), [4, 18, -40], 50); },
    press(lt, T, g) { useSet('throne'); goldWin.visible = true; goldWin.position.set(0, 34, -82); goldWin.rotation.set(0, 0, 0); goldWin.scale.set(1, 1, 1); goldLight.position.set(0, 34, -76); goldLight.intensity = 5;  bigHand.visible = true; ring.visible = true;
      const p = prog(lt, 0.15, 0.35); const back = prog(lt, 0.35, 0.6);
      bigHand.position.set(1.2, lerp(22, 25, p), lerp(-66, -78.5, eIn(p)) + back * 2); bigHand.rotation.set(-0.5, 0.2, 0);
      goldWin.userData.set({ press: p >= 1 ? 1 : 0, cracks: Math.round(eOut(prog(lt, 0.35, T)) * 10) / 10, glow: 1 });
      ring.position.set(0, 25, -81.5); const rk = prog(lt, 0.35, 1.2); ring.scale.setScalar(1 + rk * 40); ring.material.opacity = 1 - rk;
      fx.flash = Math.max(fx.flash, hits(lt, [0.35], 0.25) * 0.6); fx.shake = hits(lt, [0.35], 0.6) * 1.2;
      camAt([0, 30, -40], [0, 35, -82], 55); },
    shatter(lt, T, g) { useSet('throne'); goldWin.position.set(0, 34, -82); goldWin.rotation.set(0, 0, 0); goldWin.scale.set(1, 1, 1); goldLight.position.set(0, 34, -76); goldLight.intensity = 5; const k = eIn(prog(lt, 0, T * 0.8)); throneStatic.visible = lt < 0.25; goldWin.visible = lt < 0.25; bigHand.visible = false; ring.visible = false; heroTh.visible = false; boss.visible = false;
      shards.visible = shards2.visible = true;
      const place = (im, seed, spd) => im.userData.place((i, d) => { const R = rng(i + seed); const sx = (R() - .5) * 70, sy = R() * 110 - 20; const dz = R() * 30; const a = Math.atan2(sy - 30, sx);
        const dist = eOut(prog(lt, 0.05, T)) * (30 + R() * 140) * spd; d.position.set(sx + Math.cos(a) * dist, sy + Math.sin(a) * dist - k * 40 * R(), -70 + dz + eOut(prog(lt, 0, T)) * 70 * R()); d.rotation.set(lt * (3 + R() * 5), lt * (2 + R() * 4), R() * 3); });
      place(shards, 5000, 1); place(shards2, 6000, 1.4);
      fx.flash = Math.max(fx.flash, hits(lt, [0.02], 0.4) * 1); fx.glitch = lt < 0.9 ? 1 : 0; fx.black = prog(lt, T - 0.8, T);
      scene.background = SETS.void.bg; camAt([Math.sin(lt * 9) * 2 * (1 - k), 30, -30], [0, 30, -82], 55); },
    wake(lt, T, g) { useSet('new'); lidT.visible = lidB.visible = true; const o = eIO(prog(lt, 0.2, T * 0.9)); const blink = lt > 0.9 && lt < 1.2 ? 0.6 : 0;
      placeGrass(g, 0.15); heroN.visible = false;
      camAt([0, 3, 20], [0, 30, -100], 70);
      const fwd = new T3.Vector3(); cam.getWorldDirection(fwd); const up = cam.up.clone(); const base = cam.position.clone().add(fwd.multiplyScalar(6));
      const lidOff = lerp(0, 6.5, Math.max(0, o - blink)); lidT.position.copy(base); lidT.quaternion.copy(cam.quaternion); lidT.translateY(1.2 + lidOff + 0); lidT.scale.set(40, 2.4 + 0.0, 1);
      lidB.position.copy(base); lidB.quaternion.copy(cam.quaternion); lidB.translateY(-1.2 - lidOff); lidB.scale.set(40, 2.4, 1);
      lidT.translateY(0); },
    wind(lt, T, g) { useSet('new'); lidT.visible = lidB.visible = false; heroN.visible = true; placeGrass(g, 0.45);
      heroN.position.set(0, 1.5, 0); heroN.rotation.set(-Math.PI / 2, 0, 0.2); heroPose(heroN, g, { headY: Math.sin(g) * 0.3, armL: -0.3, armR: 0.2 });
      fireflies.userData.place((i, d) => { const R = rng(i + 7000); d.position.set((R() - .5) * 120 + g * 12 % 40, 2 + R() * 14 + Math.sin(g + i) * 2, (R() - .5) * 80); });
      camAt(L3([-30, 6, 30], [10, 8, 26], eIO(lt / T)), [0, 2, 0], 55); },
    moons(lt, T, g) { useSet('new'); lidT.visible = lidB.visible = false; placeGrass(g, 0.3); heroN.visible = true; heroN.position.set(0, 1.5, 0); heroN.rotation.set(-Math.PI / 2, 0, 0.2);
      [0, 1, 2, 3].forEach(i => { const il = sNew.userData['il' + i]; il.position.y = il.userData.y0 + Math.sin(g * 0.6 + i) * 6; });
      camAt([0, 8, 30], L3([0, 20, -100], [-20, 240, -500], eIO(lt / T)), 60); },
    creatures(lt, T, g) { useSet('new'); placeGrass(g, 0.3); heroN.visible = true; const up = eIO(prog(lt, 0, 1.4));
      heroN.position.set(0, lerp(1.5, 0, up), 0); heroN.rotation.set(lerp(-Math.PI / 2, 0, up), 0, 0); heroPose(heroN, g, { headY: Math.sin(g * 1.4) * 0.6, armL: -0.3 * up, armR: -0.3 * up });
      eyesN.forEach(e => { const bl = ((g + e.userData.ph) % 2.4) < 0.15 ? 0.1 : 1; e.userData.a.scale.y = e.userData.b.scale.y = 1.2 * bl; });
      camAt(orbit([0, 0, 0], 40, lerp(-0.6, 0.4, lt / T), 16), [0, 12, -10], 55); },
    crane(lt, T, g) { useSet('new'); placeGrass(g, 0.3); heroN.visible = true; heroN.position.set(0, 0, 0); heroN.rotation.set(0, 0, 0); heroPose(heroN, g, { headX: -0.3 });
      const k = eIO(lt / T); camAt(L3([0, 16, 34], [0, 120, 160], k), L3([0, 12, 0], [0, 20, -120], k), 55); },
    xsky(lt, T, g) { useSet('new'); placeGrass(g, 0.25); heroN.visible = true; heroN.position.set(9, 0, 0); heroN.rotation.set(0, Math.PI, 0); heroPose(heroN, g, { headX: -0.6 });
      const k = eOut(prog(lt, 0.2, 1.2)); xCubes.visible = true; xCubes.userData.place((i, d) => { const R = rng(i + 8000); const arm = i % 2; const s = (Math.floor(i / 2) / 90) * 2 - 1;
        const tx = s * 70, ty = 230 + (arm ? s : -s) * 70; const sx = tx + (R() - .5) * 600, sy = ty + (R() - .5) * 400;
        d.position.set(lerp(sx, tx, k) + (lt > 1.2 && Math.floor(g * 20) % 7 === 0 ? (R() - .5) * 8 : 0), lerp(sy, ty, k), -380); d.rotation.set(0, 0, arm ? -0.78 : 0.78); d.scale.setScalar(8 * k + 0.01); });
      fx.flash = Math.max(fx.flash, hits(lt, [1.2], 0.3) * 0.5); fx.shake = hits(lt, [1.2], 0.6) * 1.2; fx.glitch = lt > 1.15 && lt < 1.5 ? 1 : 0;
      camAt(L3([0, 6, 30], [0, 4, 24], lt / T), [0, 160, -380], 60); },
    cta(lt, T, g) { useSet('new'); placeGrass(g, 0.25); heroN.visible = true; heroN.position.set(9, 0, 0); heroPose(heroN, g, { headX: -0.6 }); xCubes.visible = true; xCubes.userData.place((i, d) => { const arm = i % 2; const s = (Math.floor(i / 2) / 90) * 2 - 1; d.position.set(s * 70, 230 + (arm ? s : -s) * 70, -380); d.rotation.set(0, 0, arm ? -0.78 : 0.78); d.scale.setScalar(8); });
      fx.tint = '#000010'; fx.tintA = 0.35 + 0.25 * prog(lt, 0, 1);
      camAt(L3([0, 4, 24], [0, 30, 60], eIO(lt / T)), [0, 160, -380], 60); },
  };

  // ---------- quadro ----------
  const flashEl = document.getElementById('mundo-flash'), tintEl = document.getElementById('mundo-tint'), glEl = document.getElementById('mundo-glitch');
  function frame(t) {
    let sh = SHOTS[0]; for (const s of SHOTS) if (t >= s.t0) sh = s;
    fx.flash = 0; fx.shake = 0; fx.tint = null; fx.tintA = 0; fx.black = 0; fx.glitch = 0;
    PARTS.forEach(p => p.visible = false);
    [cage, barrier, titlePanel, gate, lightning, xPanel, deathPanel, beam, menuPanel, cursor, clockG, countPanel, bubble, hpPanel, goldWin, bigHand, ring, lidT, lidB, heroTh, heroN, boss].concat(errPanels, dmg).forEach(o => o.visible = false);
    [heroV, heroR, heroRoom, heroF, heroUI, heroP, heroT, heroTh, heroN].forEach(h => h.rotation.set(0, 0, 0));
    throneStatic.visible = true; godRay.material.opacity = 0; goldLight.intensity = 0; voidLight.intensity = 0;
    const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    (S[sh.id] || S.intro)(lt, T, t);
    if (hpPanel.visible) { const f = new T3.Vector3(); cam.getWorldDirection(f); const upv = new T3.Vector3(0, 1, 0).applyQuaternion(cam.quaternion); hpPanel.position.copy(cam.position).addScaledVector(f, 40).addScaledVector(upv, -10.5); hpPanel.quaternion.copy(cam.quaternion); hpPanel.scale.setScalar(0.36 * (sh.id === 'boss_bar' ? (eBack(prog(lt, 0, 0.35)) || 0.001) : 1)); }
    // flash de corte (entrada de cada plano)
    fx.flash = Math.max(fx.flash, (1 - prog(lt, 0, 0.12)) * 0.18);
    if (fx.shake) { const k = fx.shake; cam.position.x += Math.sin(t * 87) * k; cam.position.y += Math.cos(t * 71) * k; cam.rotation.z += Math.sin(t * 53) * 0.01 * k; }
    renderer.render(scene, cam);
    flashEl.style.opacity = fx.flash.toFixed(3);
    tintEl.style.background = fx.tint || 'transparent'; tintEl.style.opacity = (fx.tint ? fx.tintA : 0) + fx.black;
    if (fx.black > 0) tintEl.style.background = '#000';
    glEl.style.opacity = fx.glitch ? 1 : 0;
    if (fx.glitch) { const R = rng(Math.floor(t * 20)); glEl.style.transform = `translateX(${(R() - .5) * 40}px)`; glEl.style.backgroundPosition = `0 ${Math.floor(R() * 1920)}px`; }
  }

  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter', '900 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    [titlePanel, menuPanel, deathPanel, countPanel, hpPanel, goldWin, bubble, screen, barrier, xPanel].forEach(p => p.userData.set({}));
    errPanels.forEach(p => p.userData.set({}));
    const tl = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0);
    window.__timelines['mundo'] = tl;
  });
})();

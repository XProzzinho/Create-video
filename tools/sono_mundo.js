  // ===================== VÍDEO: QUANTOS DIAS SEM DORMIR =====================
  const SETS = {};
  function newSet(name, cfg) { const g = grp(scene); g.visible = false; SETS[name] = Object.assign({ g }, cfg); return g; }
  const OPT = []; const opt = (o) => { OPT.push(o); return o; };
  const BILL = []; const bill = (o) => { BILL.push(o); return o; };

  function makeAvatar(o) {
    const h = makeHero(Object.assign({ shirt: '#23233a', plate: '#2f2f4c', belt: '#23233a', pants: '#2a3a5a', boot: '#f0f0f0', hair: '#1a1410', sword: false }, o || {}));
    const P = h.userData.P;
    if (!o || !o.nocap) { box(P.head, 0, 5.3, 0.2, 5.2, 1.4, 5.2, '#ff7a1a'); box(P.head, 0, 4.8, 3.2, 4.6, 0.5, 2.4, '#ff7a1a'); box(P.head, 0, 6.1, 0, 1.2, 0.4, 1.2, '#ffd23c'); box(P.torso, 0, 4.6, 1.8, 3.6, 1.2, 0.2, '#ff7a1a'); }
    return h;
  }
  function labelP(p, w, h, border) { return bill(opt(panel(p, w, h, (x, W, H, st) => { rr(x, 8, 8, W - 16, H - 16, 50); x.fillStyle = 'rgba(8,6,20,0.88)'; x.fill(); x.lineWidth = 8; x.strokeStyle = st.c || border || '#ff7a1a'; x.stroke(); txt(x, st.t || '', W / 2, H / 2, 130, st.c || '#ffffff'); }))); }
  function bigText(p, w, h) { return bill(opt(panel(p, w, h, (x, W, H, st) => { x.font = `700 ${st.s || 380}px Oswald`; let s = st.s || 380; while (x.measureText(st.t || '').width > W - 60 && s > 60) { s -= 10; x.font = `700 ${s}px Oswald`; } x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 34; x.lineJoin = 'round'; x.strokeStyle = '#120818'; x.strokeText(st.t || '', W / 2, H / 2); x.fillStyle = st.c || '#ffd23c'; x.fillText(st.t || '', W / 2, H / 2); }))); }
  const SPH = new T3.SphereGeometry(1, 14, 10);

  // ---------- ESTÚDIO ----------
  const sStudio = newSet('studio', { bg: gradTex(['#0a0a2a', '#2a1a5a', '#6a3a8a']), fog: [0x2a1a5a, 80, 400], hemi: [0xc0c0ff, 0x1a0a2a, 1.2], sun: [0xffe0c0, 1.2], rim: [0xff7a1a, 1.4] });
  const floaters = [];
  { for (let x = -6; x < 6; x++) for (let z = -6; z < 4; z++) box(sStudio, x * 10, -1, z * 10, 10, 2, 10, (x + z) % 2 ? '#1e1a3a' : '#28224a');
    const R = rng(71); for (let i = 0; i < 26; i++) { const c = box(sStudio, (R() - .5) * 140, 10 + R() * 70, -30 - R() * 80, 3, 3, 3, R() < .5 ? '#ffd23c' : '#9a8aff', true); c.userData = { y0: c.position.y, ph: R() * 6 }; floaters.push(c); }
    const moon = new T3.Mesh(new T3.SphereGeometry(16, 20, 14), bmat('#fff2c8')); moon.position.set(50, 80, -120); sStudio.add(moon); }
  const avS = makeAvatar(); sStudio.add(avS);
  const tagS = bill(panel(sStudio, 18, 4, (x, w, h) => { rr(x, 4, 4, w - 8, h - 8, 60); x.fillStyle = 'rgba(10,6,24,0.85)'; x.fill(); x.lineWidth = 8; x.strokeStyle = '#ff7a1a'; x.stroke(); txt(x, '@Bessekai', w / 2, h / 2, 120, '#ffffff'); }));
  const bigS = bigText(sStudio, 60, 30);
  const calS = opt(panel(sStudio, 30, 34, (x, w, h, st) => { rr(x, 10, 10, w - 20, h - 20, 40); x.fillStyle = '#fff6ea'; x.fill(); x.fillStyle = '#e0304a'; rr(x, 10, 10, w - 20, 200, 40); x.fill(); x.fillRect(10, 120, w - 20, 90); txt(x, 'DIAS SEM DORMIR', w / 2, 110, 64, '#ffffff'); txt(x, String(st.d || 0), w / 2, h * 0.62, 420, '#20141a'); }));
  const zzz = particles(sStudio, 30, '#bfe0ff', 2);

  // ---------- QUARTO (noite) ----------
  const sRoom = newSet('room', { bg: gradTex(['#04050e', '#0a0f22']), fog: [0x0a0f22, 80, 380], hemi: [0x8a9aff, 0x181828, 1.0], sun: [0x99aaff, 0.7], rim: [0x4488ff, 1.0] });
  { box(sRoom, 0, -1, 0, 100, 2, 100, '#2a2030'); box(sRoom, 0, 30, -40, 100, 62, 2, '#1c2036'); box(sRoom, -49, 30, 0, 2, 62, 100, '#181c30');
    box(sRoom, 0, 13, -30, 36, 2, 14, '#5a3a24'); [-16, 16].forEach(x => box(sRoom, x, 6, -30, 2, 12, 12, '#4a2e1c'));
    const bed = grp(sRoom, 30, 0, -14); box(bed, 0, 4, 0, 24, 8, 40, '#3a2a20'); box(bed, 0, 9, 2, 22, 2.4, 36, '#e8e8f0'); box(bed, 0, 10.6, -14, 16, 3, 7, '#ffffff'); box(bed, 0, 10.4, 6, 22.4, 1.4, 24, '#3a5aa8');
    const win = grp(sRoom, -48, 36, -10); box(win, 0, 0, 0, 0.5, 24, 30, '#0a1030'); const R = rng(73); for (let i = 0; i < 30; i++) box(win, 0.4, (R() - .5) * 22, (R() - .5) * 28, 0.2, 1, 1, R() < .5 ? '#ffd27a' : '#7ac8ff', true); box(win, 0.5, 6, 8, 0.3, 4, 4, '#fff2c8', true); }
  const roomLight = new T3.PointLight(0x66b8ff, 2, 90); roomLight.position.set(0, 22, -20); sRoom.add(roomLight);
  const clockP = opt(panel(sRoom, 26, 10, (x, w, h, st) => { rr(x, 8, 8, w - 16, h - 16, 30); x.fillStyle = '#05060a'; x.fill(); x.lineWidth = 8; x.strokeStyle = '#2a2e3a'; x.stroke(); x.shadowColor = '#ff3355'; x.shadowBlur = 30; txt(x, st.t || '00:00', w / 2, h / 2 + 6, 300, '#ff3355', 700, 'Oswald'); x.shadowBlur = 0; }));
  clockP.position.set(0, 46, -38.8);
  const avR = makeAvatar(); sRoom.add(avR);
  const phone = grp(avR.userData.P.armR, 0, -6, 1.4); box(phone, 0, 0, 0, 2.4, 0.4, 4, '#111'); const phoneScr = box(phone, 0, 0.25, 0, 2.1, 0.1, 3.6, '#9ad8ff', true);
  const phoneLight = new T3.PointLight(0x9ad8ff, 0, 30); sRoom.add(phoneLight);
  const bookP = opt(panel(sRoom, 26, 18, (x, w, h, st) => { x.fillStyle = '#fff8ea'; rr(x, 10, 10, w - 20, h - 20, 20); x.fill(); const lines = ['O cérebro precisa', 'dormir para', 'O cérebro precisa', 'dormir para', 'O cérebro precisa']; lines.forEach((l, i) => { x.globalAlpha = i <= (st.n || 0) ? 1 : 0.15; txt(x, l, 60, 110 + i * 120, 74, i % 2 ? '#3a2a1a' : '#a02030', 700, 'Inter', 'left'); }); x.globalAlpha = 1; }));
  const steam = particles(sRoom, 120, '#ff3a3a', 1.4);
  const shadows = []; for (let i = 0; i < 4; i++) { const s = makeHero({ shirt: '#000000', plate: '#000000', belt: '#000000', pants: '#000000', boot: '#000000', skin: '#000000', hair: '#000000', sword: false, eye: '#ff2a2a', eyeGlow: true }); sRoom.add(s); shadows.push(opt(s)); }
  const eyesG = opt(grp(sRoom)); const eyeList = []; { const R = rng(79); for (let i = 0; i < 14; i++) { const g = grp(eyesG, (R() - .5) * 90, 8 + R() * 44, -38 + R() * 2); const w = box(g, 0, 0, 0, 4.2, 2.4, 0.3, '#f4f4f4', true); const p = box(g, 0, 0, 0.3, 1.4, 1.4, 0.3, '#1a1a1a', true); g.userData = { p, ph: R() * 6 }; if (R() < 0.5) g.position.set(-48.6, 8 + R() * 44, (R() - .5) * 80), g.rotation.y = Math.PI / 2; eyeList.push(g); } }
  const bubbleR = bill(opt(panel(sRoom, 24, 9, (x, w, h, st) => { rr(x, 10, 10, w - 20, h - 60, 50); x.fillStyle = '#fff4dc'; x.fill(); x.beginPath(); x.moveTo(w * .3, h - 52); x.lineTo(w * .26, h - 6); x.lineTo(w * .42, h - 52); x.fill(); txt(x, st.t || '', w / 2, (h - 50) / 2 + 6, 100, '#2a1a10', 700, 'Inter'); })));
  const zzzR = particles(sRoom, 40, '#bfe0ff', 1.8);
  const sunrise = new T3.PointLight(0xffb070, 0, 160); sunrise.position.set(-40, 36, -10); sRoom.add(sunrise);
  const winSun = opt(box(sRoom, -47.4, 36, -10, 0.3, 24, 30, '#ffb070', true));

  // ---------- COZINHA (fome) ----------
  const sKit = newSet('kitchen', { bg: gradTex(['#04050e', '#0e0a1a']), fog: [0x0e0a1a, 60, 300], hemi: [0x6a6aaa, 0x080810, 0.6], sun: [0x8899ff, 0.3], rim: [0xffd8a0, 0.6] });
  { box(sKit, 0, -1, 0, 100, 2, 100, '#2a2a34'); box(sKit, 0, 30, -30, 100, 62, 2, '#20202e'); box(sKit, -26, 9, -24, 24, 18, 10, '#3a3a48'); box(sKit, -26, 18.5, -24, 25, 1, 11, '#8a8a9a'); }
  const fr = grp(sKit, 10, 0, -24); box(fr, 0, 16, 0, 16, 32, 12, '#e8eef4'); const frDoor = grp(fr, -8, 0, 6); box(frDoor, 8, 16, 0.5, 16, 32, 1, '#d8dee4');
  box(fr, 0, 16, 5.6, 14.6, 30, 0.4, '#fff8e0', true); [8, 16, 24].forEach(y => box(fr, 0, y, 2, 14, 0.5, 8, '#c8d0d8'));
  const goodies = opt(grp(fr)); { const cols = ['#ff5a8a', '#ffd23c', '#7a4a2a', '#5ad0ff', '#ff8a3a']; for (let i = 0; i < 9; i++) { const g = box(goodies, -5 + (i % 3) * 5, 9.4 + Math.floor(i / 3) * 8, 2, 3.4, 2.6, 3, cols[i % 5]); } const d = new T3.Mesh(new T3.TorusGeometry(2.4, 1.1, 8, 16), mat('#ff7ab0')); d.position.set(0, 26, 2); d.rotation.x = Math.PI / 2; goodies.add(d); }
  const fridgeLight = new T3.PointLight(0xfff2d0, 0, 80); fridgeLight.position.set(10, 16, -10); sKit.add(fridgeLight);
  const avK = makeAvatar(); sKit.add(avK);
  const candy = particles(sKit, 40, '#ff5a8a', 1.8);

  // ---------- CÉREBRO ----------
  const sBrain = newSet('brain', { bg: gradTex(['#060414', '#1a0a3a', '#3a0a3a']), fog: [0x1a0a3a, 80, 400], hemi: [0xffb0d0, 0x100818, 1.1], sun: [0xffffff, 1.0], rim: [0x8a5aff, 1.4] });
  { const gh = new T3.GridHelper(600, 60, 0x8a4aa8, 0x3a1a5a); gh.position.y = -30; sBrain.add(gh); }
  const brain = grp(sBrain, 0, 10, 0); const brainCubes = [];
  { const R = rng(83); for (let i = 0; i < 260; i++) { const a = R() * 6.28, b = Math.acos(2 * R() - 1); const rx = 20, ry = 15, rz = 16; const x = Math.cos(a) * Math.sin(b) * rx, y = Math.cos(b) * ry * 0.9 + 2, z = Math.sin(a) * Math.sin(b) * rz; if (y < -8) continue;
      const c = box(brain, Math.round(x / 3) * 3, Math.round(y / 3) * 3, Math.round(z / 3) * 3, 3.2, 3.2, 3.2, R() < 0.5 ? '#ff9ab8' : '#f07aa0'); c.userData = { p0: c.position.clone(), r: R() }; brainCubes.push(c); }
    box(brain, 0, -6, 0, 6, 10, 6, '#e06a90'); }
  const mug = opt(grp(sBrain, 30, 0, 10)); { box(mug, 0, 6, 0, 10, 12, 10, '#ffd060'); box(mug, 0, 12.6, 0, 10.6, 2, 10.6, '#ffffff'); box(mug, 6.4, 6, 0, 2, 7, 2, '#e8c050'); box(mug, 0, 6, 5.1, 6, 8, 0.2, '#f0b030'); }
  const shield = opt(panel(sBrain, 26, 30, (x, w, h, st) => { x.beginPath(); x.moveTo(w / 2, 20); x.lineTo(w - 60, 120); x.lineTo(w - 90, h * .62); x.lineTo(w / 2, h - 30); x.lineTo(90, h * .62); x.lineTo(60, 120); x.closePath(); x.fillStyle = '#3a8aff'; x.fill(); x.lineWidth = 24; x.strokeStyle = '#bfe0ff'; x.stroke(); txt(x, '+', w / 2, h * .45, 360, '#ffffff');
    if (st.k) { const R = rng(5); x.strokeStyle = '#1a0a1a'; x.lineWidth = 16; for (let k = 0; k < Math.floor(st.k * 8); k++) { let X = w / 2, Y = h * .45; x.beginPath(); x.moveTo(X, Y); const a = R() * 6.28; for (let s = 0; s < 5; s++) { X += Math.cos(a + (R() - .5)) * 70; Y += Math.sin(a + (R() - .5)) * 70; x.lineTo(X, Y); } x.stroke(); } } }));
  const germs = particles(sBrain, 40, '#7aff5a', 2.2);
  const brainLbl = labelP(sBrain, 44, 9);

  // ---------- 1964 ----------
  const s64 = newSet('1964', { bg: gradTex(['#2a1e10', '#5a4228', '#8a6a40']), fog: [0x6a5030, 80, 360], hemi: [0xffe0b0, 0x3a2a18, 1.1], sun: [0xffd8a0, 1.0], rim: [0xffb060, 0.6] });
  { box(s64, 0, -1, 0, 120, 2, 120, '#5a3a24'); box(s64, 0, 30, -40, 120, 62, 2, '#8a7050'); box(s64, -59, 30, 0, 2, 62, 120, '#7a6044');
    box(s64, 20, 10, -30, 30, 2, 14, '#6a4628'); const tv = grp(s64, 20, 11, -32); box(tv, 0, 6, 0, 14, 12, 8, '#4a3020'); box(tv, -1, 6, 4.1, 9, 8, 0.2, '#a8b0a0', true); box(tv, 5, 8, 4.1, 1.4, 1.4, 0.3, '#c8a050');
    box(s64, -30, 20, -38.6, 18, 24, 0.4, '#e8d8b8'); }
  const randy = makeAvatar({ nocap: true, shirt: '#c8b090', plate: '#a89070', belt: '#4a3a28', pants: '#4a5a6a', hair: '#7a5030' }); s64.add(randy);
  const docs = []; for (let i = 0; i < 2; i++) { const d = makeHero({ shirt: '#f4f4f0', plate: '#e8e8e4', belt: '#d0d0cc', pants: '#3a3a44', hair: i ? '#9a9a9a' : '#3a2a1a', sword: false }); s64.add(d); docs.push(d);
    const clip = box(d.userData.P.armL, 0, -5, 1.6, 3, 4, 0.4, '#c8a060'); }
  const yearP = opt(panel(s64, 34, 14, (x, w, h, st) => { x.fillStyle = 'rgba(30,20,10,0.85)'; rr(x, 10, 10, w - 20, h - 20, 30); x.fill(); x.lineWidth = 8; x.strokeStyle = '#ffd8a0'; x.stroke(); txt(x, st.t || '', w / 2, h / 2, 230, '#ffe8c0', 700, 'Oswald'); }));
  bill(yearP);
  const hourP = opt(panel(s64, 40, 18, (x, w, h, st) => { winBg(x, w, h, '#ffd23c', 'rgba(20,14,6,0.9)'); txt(x, st.l || 'HORAS ACORDADO', w / 2, 100, 64, '#ffd8a0'); txt(x, String(st.v || 0), w / 2, h * 0.62, 230, '#ffd23c'); })); bill(hourP);
  const bubble64 = bill(opt(panel(s64, 24, 9, (x, w, h, st) => { rr(x, 10, 10, w - 20, h - 60, 50); x.fillStyle = '#fff4dc'; x.fill(); x.beginPath(); x.moveTo(w * .3, h - 52); x.lineTo(w * .26, h - 6); x.lineTo(w * .42, h - 52); x.fill(); txt(x, st.t || '', w / 2, (h - 50) / 2 + 6, 100, '#2a1a10', 700, 'Inter'); })));
  const zzz64 = particles(s64, 40, '#fff4dc', 1.8);
  const bed64 = opt(grp(s64, -26, 0, -16)); { box(bed64, 0, 4, 0, 22, 8, 36, '#5a3a24'); box(bed64, 0, 9, 1, 20, 2.4, 32, '#f0e8d8'); box(bed64, 0, 10.6, -12, 14, 3, 6, '#ffffff'); box(bed64, 0, 10.4, 5, 20.4, 1.4, 22, '#8a3a2a'); }

  // ---------- LIVRO DOS RECORDES ----------
  const sBook = newSet('book', { bg: gradTex(['#0a0612', '#2a1030', '#4a1a2a']), fog: [0x2a1030, 80, 400], hemi: [0xffd0c0, 0x100810, 1.1], sun: [0xffffff, 1.0], rim: [0xffd23c, 1.2] });
  { for (let x = -6; x < 6; x++) for (let z = -6; z < 4; z++) box(sBook, x * 10, -1, z * 10, 10, 2, 10, (x + z) % 2 ? '#1e1424' : '#28182e'); }
  const book = grp(sBook, 0, 20, 0); { box(book, 0, 0, 0, 30, 40, 6, '#1a3a8a'); box(book, 0, 0, 3.1, 26, 36, 0.2, '#ffd23c'); box(book, -15.2, 0, 0, 1, 40, 6.4, '#122a6a'); for (let i = 0; i < 6; i++) box(book, 15.4, -16 + i * 6.4, 0, 0.6, 5, 5.6, '#f4ecd8'); }
  const bookTitle = panel(book, 24, 14, (x, w, h) => { txt(x, 'LIVRO DOS', w / 2, h * 0.32, 150, '#1a3a8a'); txt(x, 'RECORDES', w / 2, h * 0.68, 170, '#1a3a8a'); }); bookTitle.position.set(0, 6, 3.3);
  const stamp = opt(panel(sBook, 44, 16, (x, w, h) => { x.save(); x.translate(w / 2, h / 2); x.rotate(-0.12); x.lineWidth = 24; x.strokeStyle = '#ff2a3a'; x.strokeRect(-w / 2 + 40, -h / 2 + 40, w - 80, h - 80); txt(x, 'NÃO ACEITA MAIS', 0, 0, 120, '#ff2a3a'); x.restore(); }));
  const trophy = grp(sBook, 30, 0, 10); { box(trophy, 0, 1, 0, 8, 2, 8, '#3a2a18'); box(trophy, 0, 5, 0, 2, 6, 2, '#ffd23c'); box(trophy, 0, 11, 0, 8, 6, 8, '#ffd23c'); [-5, 5].forEach(x => box(trophy, x, 11, 0, 2, 4, 1, '#ffd23c')); }

  // ---------- controle ----------
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
  const fx = { flash: 0, shake: 0, tint: null, tintA: 0, black: 0, roll: 0, sepia: 0 };
  const hits = (t, list, w) => list.reduce((s, h) => { const k = (t - h) / w; return k >= 0 && k < 1 ? Math.max(s, 1 - k) : s; }, 0);
  function wave(av, g) { heroPose(av, g, { armR: -0.2, armRz: 2.5 + Math.sin(g * 9) * 0.4, headY: Math.sin(g * 1.3) * 0.2 }); }
  function sitAt(av, x, z, ry) { av.position.set(x, -2.5, z); av.rotation.set(0, ry, 0); av.userData.P.hips.position.y = 8.5; }
  function lie(av, x, y, z) { av.position.set(x, y, z); av.rotation.set(-Math.PI / 2, 0, 0); }
  function puffs(im, cx, cy, cz, g, spd, spread, seed) { im.userData.place((i, d) => { const R = rng(i + seed); const k = ((g * spd + R()) % 1); d.position.set(cx + (R() - .5) * spread + Math.sin(k * 6 + i) * 2, cy + k * 22, cz + (R() - .5) * spread); d.scale.setScalar((0.4 + k) * 0.7); d.rotation.set(0, 0, k * 2); }); }
  const HUD = labelP(scene, 50, 9);   // contador "DIA X · HORAS" preso à câmera
  let hud = null;

  // ---------- planos ----------
  const S = {
    intro(lt, T, g) { useSet('studio'); avS.position.set(0, 0, 0); avS.rotation.set(0, 0.15, 0); wave(avS, g); tagS.visible = true; tagS.position.set(0, 29, 0); tagS.userData.set({}); tagS.scale.setScalar(eBack(prog(lt, 0.1, 0.45)) || 0.001);
      floaters.forEach(c => { c.position.y = c.userData.y0 + Math.sin(g + c.userData.ph) * 3; c.rotation.set(g * .5 + c.userData.ph, g * .3, 0); });
      camAt(L3([12, 18, 54], [4, 16, 38], eOut(lt / T)), [0, 16, 0], 48); },
    question(lt, T, g) { useSet('studio'); avS.position.set(-12, 0, 0); avS.rotation.set(0, 0.5, 0); heroPose(avS, g, { armR: -0.4, armRz: 0.9, headZ: 0.25, headY: 0.4 });
      bigS.visible = true; bigS.position.set(12, 26, 0); bigS.userData.set({ t: '?', s: 600, c: '#ffd23c' }); bigS.scale.setScalar(0.55 * (eBack(prog(lt, 0.05, 0.4)) || 0.001)); bigS.rotation.z = Math.sin(g * 2) * 0.08;
      floaters.forEach(c => { c.position.y = c.userData.y0 + Math.sin(g + c.userData.ph) * 3; });
      camAt(L3([0, 22, 74], [0, 22, 60], lt / T), [0, 20, 0], 50); },
    calendar(lt, T, g) { useSet('studio'); avS.position.set(-16, 0, 6); avS.rotation.set(0, 0.6, 0); heroPose(avS, g, { armR: -1.4, armRz: 0.5, headY: 0.5 });
      calS.visible = true; calS.position.set(8, 22, 0); calS.userData.set({ d: Math.min(11, Math.floor(prog(lt, 0.2, T - 0.3) * 12)) }); calS.rotation.y = -0.15;
      fx.shake = 0.15; camAt(L3([10, 24, 70], [6, 22, 56], eOut(lt / T)), [4, 22, 0], 50); },
    title(lt, T, g, n, col) { useSet('studio'); avS.visible = false; floaters.forEach(c => { c.position.y = c.userData.y0 + Math.sin(g + c.userData.ph) * 3; c.rotation.set(g + c.userData.ph, g, 0); });
      bigS.visible = true; bigS.position.set(0, 24, 0); bigS.userData.set({ t: 'DIA ' + n, s: 380, c: col }); bigS.scale.setScalar(0.45 * Math.max(0.001, lerp(2.2, 1, eOut(prog(lt, 0, 0.3)))));
      fx.shake = hits(lt, [0.3], 0.4) * 1.6; fx.flash = hits(lt, [0.28], 0.2) * 0.5;
      camAt(L3([0, 24, 70], [0, 24, 58], lt / T), [0, 24, 0], 50); },
    clock(lt, T, g) { useSet('room'); hud = { t: 'DIA 1 · ' + Math.round(lerp(8, 18, eOut(prog(lt, 0, T)))) + ' HORAS ACORDADO', c: '#5ad0ff' };
      const hrs = lerp(8, 26, eIO(prog(lt, 0, T))); const hh = Math.floor(hrs) % 24, mm = Math.floor((hrs % 1) * 60); clockP.visible = true; clockP.userData.set({ t: String(hh).padStart(2, '0') + ':' + String(mm - mm % 5).padStart(2, '0') });
      sitAt(avR, 0, -14, Math.PI); heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -1.2, armR: -1.5, headX: 0.35 }); avR.userData.P.hips.position.y = 8.5;
      phoneLight.position.set(0, 18, -10); phoneLight.intensity = 3; camAt(L3([-34, 30, 46], [-24, 30, 36], eIO(lt / T)), [0, 28, -26], 50); },
    drunk(lt, T, g) { useSet('brain'); hud = { t: 'DIA 1 · 18 HORAS ACORDADO', c: '#5ad0ff' }; brain.rotation.set(Math.sin(g * 1.7) * 0.25, g * 0.6, Math.sin(g * 2.1) * 0.2);
      brainCubes.forEach(c => c.position.copy(c.userData.p0)); mug.visible = true; mug.position.set(30, Math.sin(g * 3) * 2, 10); mug.rotation.z = Math.sin(g * 2.6) * 0.3;
      brainLbl.visible = true; brainLbl.position.set(10, -10, 14); brainLbl.scale.setScalar(0.7); brainLbl.userData.set({ t: 'CÉREBRO ≈ BÊBADO', c: '#ffd060' }); fx.roll = Math.sin(g * 2.2) * 0.12;
      camAt(orbit([10, 0, 0], 80, Math.sin(lt * 0.8) * 0.5, 12 + Math.sin(g * 1.6) * 4), [10, 4, 0], 52); },
    reading(lt, T, g) { useSet('room'); hud = { t: 'DIA 1 · 20 HORAS ACORDADO', c: '#5ad0ff' }; sitAt(avR, 0, -14, Math.PI); heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -1.2, armR: -1.2, headX: 0.5 + Math.sin(g * 1.5) * 0.08 }); avR.userData.P.hips.position.y = 8.5;
      bookP.visible = true; bookP.position.set(0, 24, -30); bookP.rotation.set(-0.5, 0, 0); bookP.userData.set({ n: Math.min(4, Math.floor(lt / T * 6)) });
      camAt(L3([8, 44, 12], [4, 40, 4], lt / T), [0, 26, -30], 50); },
    angry(lt, T, g) { useSet('room'); hud = { t: 'DIA 1 · 21 HORAS ACORDADO', c: '#5ad0ff' }; sitAt(avR, 0, -14, Math.PI * 0.85); heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -2.4 + Math.sin(g * 14) * 0.3, armR: -2.4 + Math.cos(g * 14) * 0.3, armLz: 0.6, armRz: -0.6, headX: -0.2 }); avR.userData.P.hips.position.y = 8.5;
      avR.updateMatrixWorld(true); const hp = new T3.Vector3(); avR.userData.P.head.localToWorld(hp.set(0, 6, 0)); puffs(steam, hp.x, hp.y, hp.z, g, 1.4, 4, 100);
      fx.shake = 0.5; fx.tint = '#ff2030'; fx.tintA = 0.18;
      camAt(L3([-24, 28, 34], [-16, 26, 26], lt / T), [0, 24, -14], 50); },
    fridge(lt, T, g) { useSet('kitchen'); hud = { t: 'DIA 1 · 23 HORAS ACORDADO', c: '#5ad0ff' }; const o = eOut(prog(lt, 0.1, 0.6)); frDoor.rotation.y = -o * 1.9; goodies.visible = true; fridgeLight.intensity = 4 * o;
      avK.position.set(10, 0, 4); avK.rotation.set(0, Math.PI, 0); heroPose(avK, g, { armR: -1.6, armL: -1.2, headX: -0.2, lean: 0.2 });
      candy.userData.place((i, d) => { const R = rng(i + 200); const k = ((g * 0.6 + R()) % 1); d.position.set(10 + (R() - .5) * 14, 30 - k * 30, -14 + (R() - .5) * 10 + k * 14); d.rotation.set(k * 6, i, 0); });
      camAt(L3([36, 24, 56], [28, 24, 44], eOut(lt / T)), [10, 16, -18], 52); fridgeLight.intensity += 1.5; },
    microsleep(lt, T, g) { useSet('room'); hud = { t: 'DIA 2 · 34 HORAS ACORDADO', c: '#ffd23c' }; sitAt(avR, 0, -14, Math.PI); const nod = [0.8, 2.6, 4.2]; const drop = Math.max(...nod.map(n => { const k = (lt - n) / 0.9; return k > 0 && k < 1 ? Math.sin(k * Math.PI) : 0; }));
      heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -1.1, armR: -1.1, headX: 0.25 + drop * 1.0 }); avR.userData.P.hips.position.y = 8.5;
      fx.black = drop > 0.55 ? (drop - 0.55) * 2.0 : 0;
      if (drop > 0.4) { brainLbl.visible = true; brainLbl.position.set(0, 36, -20); brainLbl.scale.setScalar(0.6); brainLbl.userData.set({ t: 'MICROCOCHILO', c: '#ffd23c' }); }
      camAt(L3([16, 26, 20], [10, 24, 12], lt / T), [0, 24, -14], 50); },
    memory(lt, T, g) { useSet('brain'); hud = { t: 'DIA 2 · 40 HORAS ACORDADO', c: '#ffd23c' }; brain.rotation.set(0.1, g * 0.4, 0); const k = prog(lt, 0.2, T);
      brainCubes.forEach(c => { const f = clamp(k * 1.6 - c.userData.r * 1.4); c.position.set(c.userData.p0.x * (1 + f * 0.3), c.userData.p0.y - f * f * 60, c.userData.p0.z * (1 + f * 0.3)); });
      brainLbl.visible = true; brainLbl.position.set(0, -8, 20); brainLbl.scale.setScalar(0.7); brainLbl.userData.set({ t: 'MEMÓRIA FALHANDO', c: '#ff9ab8' });
      camAt(orbit([0, 0, 0], 78, 0.4 + lt * 0.2, 14), [0, 2, 0], 52); },
    immune(lt, T, g) { useSet('brain'); hud = { t: 'DIA 2 · 44 HORAS ACORDADO', c: '#ffd23c' }; brain.visible = false; shield.visible = true; shield.position.set(0, 14, 0); const k = eOut(prog(lt, 0.4, T)); shield.userData.set({ k: Math.round(k * 8) / 8 }); shield.rotation.y = Math.sin(g) * 0.2;
      germs.userData.place((i, d) => { const R = rng(i + 300); const a = R() * 6.28 + g * (0.4 + R()); const r = lerp(40, 14, k * R()); d.position.set(Math.cos(a) * r, 14 + Math.sin(a * 1.3) * r * 0.8, Math.sin(a) * 6 + 4); d.rotation.set(g * 3, i, 0); });
      fx.shake = hits(lt, [T * 0.5, T * 0.75], 0.3) * 0.8; brainLbl.visible = true; brainLbl.position.set(0, 34, 6); brainLbl.scale.setScalar(0.6); brainLbl.userData.set({ t: 'DEFESAS BAIXAS', c: '#7aff5a' });
      camAt(L3([0, 14, 70], [0, 14, 58], lt / T), [0, 10, 0], 50); },
    shadows(lt, T, g) { useSet('room'); hud = { t: 'DIA 3 · 60 HORAS ACORDADO', c: '#ff7a3a' }; roomLight.intensity = 1.6; sitAt(avR, 30, -2, Math.PI * 0.5); heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -0.6, armR: -0.6, headY: Math.sin(g * 1.8) * 0.9 }); avR.userData.P.hips.position.y = 11;
      shadows.forEach((s, i) => { s.visible = true; const ph = i * 1.7; const x = -40 + ((g * (6 + i * 2) + i * 25) % 80); s.position.set(x, 0, -34 + i * 3); s.rotation.set(0, Math.PI / 2, 0); s.scale.set(1, 1.4 + 0.2 * Math.sin(g * 3 + ph), 0.3); heroPose(s, g + i, { walk: 6 }); });
      fx.tint = '#200030'; fx.tintA = 0.2; camAt(L3([44, 26, 50], [36, 26, 40], lt / T), [-6, 20, -30], 55); },
    paranoia(lt, T, g) { useSet('room'); hud = { t: 'DIA 3 · 66 HORAS ACORDADO', c: '#ff7a3a' }; roomLight.intensity = 1.6; eyesG.visible = true; sitAt(avR, 30, -2, Math.PI * 0.5); heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -1.6, armR: -1.6, armLz: 0.4, armRz: -0.4, headY: Math.sin(g * 4) * 0.7 }); avR.userData.P.hips.position.y = 11;
      eyeList.forEach((e, i) => { const k = eBack(prog(lt, i * 0.15, i * 0.15 + 0.3)); e.scale.set(Math.max(0.01, k), Math.max(0.01, k * ((g + e.userData.ph) % 2.2 < 0.12 ? 0.1 : 1)), 1); avR.updateMatrixWorld(); e.userData.p.position.x = Math.sin(g * 2 + i) * 1.2; });
      fx.tint = '#300010'; fx.tintA = 0.2; fx.shake = 0.2;
      camAt(L3([46, 28, 52], [40, 28, 44], lt / T), [-10, 28, -24], 60); },
    slurred(lt, T, g) { useSet('room'); hud = { t: 'DIA 3 · 70 HORAS ACORDADO', c: '#ff7a3a' }; roomLight.intensity = 0.8; sitAt(avR, 30, -2, Math.PI * 0.9); heroPose(avR, g, { legL: -1.4, legR: -1.4, armL: -0.4, armR: -0.4, headZ: Math.sin(g * 1.4) * 0.3, headX: 0.2 }); avR.userData.P.hips.position.y = 11;
      bubbleR.visible = true; bubbleR.position.set(26, 36, 4); bubbleR.scale.setScalar(0.75); const opts = ['Ééé... eu táá...', 'O quêêê...?', 'Tô... béém...']; bubbleR.userData.set({ t: opts[Math.floor(lt * 1.2) % 3] }); bubbleR.rotation.z = Math.sin(g * 3) * 0.05;
      fx.roll = Math.sin(g * 1.8) * 0.08; camAt(L3([44, 28, 60], [38, 28, 50], lt / T), [28, 26, -2], 50); },
    tremble(lt, T, g) { useSet('room'); hud = { t: 'DIA 4 · 96 HORAS ACORDADO', c: '#ff3a4a' }; roomLight.intensity = 0.6; avR.position.set(0, 0, 0); avR.rotation.set(0, Math.PI * 0.15, 0);
      heroPose(avR, g * 3, { armL: Math.sin(g * 40) * 0.12, armR: Math.cos(g * 37) * 0.12, headX: Math.sin(g * 33) * 0.06, headZ: Math.sin(g * 1.3) * 0.25, legL: 0.05, legR: -0.05 }); avR.position.x = Math.sin(g * 45) * 0.25;
      fx.shake = 0.5; fx.roll = Math.sin(g * 1.1) * 0.1; fx.tint = '#400010'; fx.tintA = 0.3;
      camAt(L3([0, 18, 40], [0, 17, 28], eOut(lt / T)), [0, 16, 0], 50); },
    limit(lt, T, g) { useSet('studio'); avS.visible = false; bigS.visible = true; bigS.position.set(0, 24, 0); bigS.userData.set({ t: 'LIMITE?', s: 300, c: '#ff4a5a' }); bigS.scale.setScalar(0.45 * Math.max(0.001, lerp(0.4, 1, eBack(prog(lt, 0, 0.5)))));
      floaters.forEach(c => { c.position.y = c.userData.y0 + Math.sin(g + c.userData.ph) * 3; }); fx.flash = hits(lt, [0.3], 0.2) * 0.4;
      camAt(L3([0, 24, 90], [0, 24, 60], eIn(lt / T)), [0, 24, 0], 50); },
    y1964(lt, T, g) { useSet('1964'); randy.visible = false; docs.forEach(d => d.visible = false); yearP.visible = true; yearP.position.set(0, 32, -10); yearP.userData.set({ t: String(Math.round(lerp(2026, 1964, eOut(prog(lt, 0, 1.4))))) }); fx.sepia = 1;
      camAt(L3([0, 30, 60], [0, 30, 40], lt / T), [0, 30, -10], 50); },
    randy(lt, T, g) { useSet('1964'); randy.visible = true; randy.position.set(0, 0, 0); randy.rotation.set(0, 0.2, 0); heroPose(randy, g, { armR: -0.2, armRz: 2.2 + Math.sin(g * 6) * 0.3 }); fx.sepia = 1;
      yearP.visible = true; yearP.position.set(0, 32, -6); yearP.scale.setScalar(0.55); yearP.userData.set({ t: 'RANDY GARDNER' });
      camAt(L3([14, 18, 50], [6, 18, 38], eOut(lt / T)), [0, 16, 0], 48); },
    eleven(lt, T, g) { useSet('1964'); randy.visible = true; randy.position.set(-14, 0, 0); randy.rotation.set(0, 0.4, 0); heroPose(randy, g, { headX: 0.1 }); fx.sepia = 1;
      hourP.visible = true; hourP.position.set(8, 26, 0); hourP.scale.setScalar(0.55); hourP.userData.set({ l: 'DIAS ACORDADO', v: Math.min(11, Math.floor(prog(lt, 0.1, T - 0.2) * 12)) });
      camAt(L3([0, 24, 70], [0, 24, 56], lt / T), [0, 22, 0], 50); },
    hours(lt, T, g) { useSet('1964'); randy.visible = true; randy.position.set(0, 0, 0); randy.rotation.set(0, 0, 0); heroPose(randy, g, { headX: 0.2 }); fx.sepia = 1;
      docs.forEach((d, i) => { d.visible = true; d.position.set(i ? 16 : -16, 0, 8); d.rotation.set(0, i ? -0.8 : 0.8, 0); heroPose(d, g + i, { armL: -1.2, headX: 0.2, headY: Math.sin(g + i) * 0.3 }); });
      hourP.visible = true; hourP.position.set(0, 44, -10); hourP.scale.setScalar(0.85); hourP.userData.set({ l: 'HORAS ACORDADO', v: Math.round(lerp(0, 264, eOut(prog(lt, 0.1, T - 0.3)))) });
      camAt(orbit([0, 0, 0], 70, Math.sin(lt * 0.5) * 0.5, 30), [0, 26, 0], 52); },
    randy_tired(lt, T, g) { useSet('1964'); randy.visible = true; randy.position.set(0, 0, 0); randy.rotation.set(0, 0.3, 0); heroPose(randy, g * 0.5, { headX: 0.4, headZ: Math.sin(g) * 0.3, lean: 0.25, armL: 0.2, armR: 0.2 }); fx.sepia = 1;
      bubble64.visible = true; bubble64.position.set(6, 30, 4); bubble64.scale.setScalar(0.6); bubble64.userData.set({ t: lt < T * 0.55 ? 'Eu ia dizer que...' : '... o quê mesmo?' });
      camAt(L3([18, 20, 44], [12, 20, 34], lt / T), [2, 18, 0], 50); },
    recovery(lt, T, g) { useSet('1964'); randy.visible = true; bed64.visible = true; lie(randy, -26, 12, -14); heroPose(randy, g, { headX: 0 }); randy.userData.P.eyes.forEach(e => e.scale.y = 0.1); fx.sepia = 1 - prog(lt, T * 0.5, T);
      puffs(zzz64, -26, 22, -26, g, 0.5, 4, 400); camAt(L3([10, 40, 30], [0, 36, 20], eIO(lt / T)), [-26, 10, -14], 50); },
    record_book(lt, T, g) { useSet('book'); book.rotation.set(0, Math.sin(g * 0.6) * 0.35, 0); book.position.y = 20 + Math.sin(g * 1.2) * 1.5;
      stamp.visible = lt > T * 0.45; if (stamp.visible) { stamp.position.set(0, 18, 8); const s = lerp(2.4, 1, eOut(prog(lt, T * 0.45, T * 0.45 + 0.2))); stamp.scale.setScalar(s * 0.75); }
      fx.shake = hits(lt, [T * 0.45 + 0.2], 0.4) * 1.4; fx.flash = hits(lt, [T * 0.45 + 0.2], 0.2) * 0.3;
      camAt(L3([24, 26, 100], [10, 24, 84], eOut(lt / T)), [0, 20, 0], 50); },
    sleep_good(lt, T, g) { useSet('room'); roomLight.intensity = 2; lie(avR, 30, 12, -16); heroPose(avR, g * 0.6, {}); avR.userData.P.eyes.forEach(e => e.scale.y = 0.1); winSun.visible = true; sunrise.intensity = 3 * prog(lt, 0, T);
      puffs(zzzR, 30, 20, -28, g, 0.5, 4, 500); camAt(L3([-10, 40, 40], [4, 34, 26], eIO(lt / T)), [30, 10, -14], 50); },
    cta(lt, T, g) { useSet('studio'); avS.position.set(0, 0, 0); avS.rotation.set(0, 0, 0); wave(avS, g); tagS.visible = true; tagS.position.set(0, 29, 0);
      floaters.forEach(c => { c.position.y = c.userData.y0 + Math.sin(g + c.userData.ph) * 3; }); fx.tint = '#000010'; fx.tintA = 0.25 * prog(lt, 0, 1);
      camAt(L3([0, 18, 40], [0, 26, 62], eIO(lt / T)), [0, 26, 0], 50); },
  };
  S.day1 = (lt, T, g) => S.title(lt, T, g, 1, '#5ad0ff');
  S.day2 = (lt, T, g) => S.title(lt, T, g, 2, '#ffd23c');
  S.day3 = (lt, T, g) => S.title(lt, T, g, 3, '#ff7a3a');
  S.day4 = (lt, T, g) => S.title(lt, T, g, '4+', '#ff3a4a');

  const flashEl = document.getElementById('mundo-flash'), tintEl = document.getElementById('mundo-tint'), glEl = document.getElementById('mundo-glitch');
  function frame(t) {
    let sh = SHOTS[0]; for (const s of SHOTS) if (t >= s.t0) sh = s;
    for (const k in fx) fx[k] = k === 'tint' ? null : 0;
    PARTS.forEach(p => p.visible = false); OPT.forEach(o => o.visible = false); HUD.visible = false; hud = null; tagS.visible = false;
    avS.visible = true; brain.visible = true; randy.visible = true; roomLight.intensity = 2; phoneLight.intensity = 0; sunrise.intensity = 0; fridgeLight.intensity = 0;
    [avS, avR, avK, randy].forEach(h => { h.rotation.set(0, 0, 0); h.scale.setScalar(1); }); frDoor.rotation.y = 0; bigS.scale.setScalar(1); yearP.scale.setScalar(1); hourP.scale.setScalar(1); brainLbl.scale.setScalar(1); bubbleR.scale.setScalar(1); bubble64.scale.setScalar(1); calS.rotation.set(0, 0, 0); bigS.rotation.set(0, 0, 0);
    shadows.forEach(s => s.scale.setScalar(1));
    const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    (S[sh.id] || S.intro)(lt, T, t);
    if (fx.roll) cam.rotateZ(fx.roll);
    if (fx.shake) { const k = fx.shake; cam.position.x += Math.sin(t * 87) * k; cam.position.y += Math.cos(t * 71) * k; }
    BILL.forEach(o => { if (o.visible) o.quaternion.copy(cam.quaternion); });
    if (hud) { HUD.visible = true; HUD.userData.set(hud); const f = new T3.Vector3(); cam.getWorldDirection(f); const up = new T3.Vector3(0, 1, 0).applyQuaternion(cam.quaternion); HUD.position.copy(cam.position).addScaledVector(f, 40).addScaledVector(up, -10.5); HUD.quaternion.copy(cam.quaternion); HUD.scale.setScalar(0.32); }
    fx.flash = Math.max(fx.flash, (1 - prog(lt, 0, 0.12)) * 0.16);
    renderer.render(scene, cam);
    flashEl.style.opacity = fx.flash.toFixed(3);
    let bg = fx.tint || 'transparent', op = fx.tint ? fx.tintA : 0;
    if (fx.sepia) { bg = '#a07840'; op = 0.35 * fx.sepia; }
    if (fx.black) { bg = '#000'; op = Math.min(1, fx.black); }
    tintEl.style.background = bg; tintEl.style.opacity = op; tintEl.style.mixBlendMode = fx.black ? 'normal' : 'multiply';
    glEl.style.opacity = 0;
  }

  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    [tagS, bookTitle, stamp].forEach(p => p.userData.set({}));
    const tl = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0);
    window.__timelines['mundo'] = tl;
  });
})();

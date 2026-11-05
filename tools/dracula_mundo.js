  // ===================== VOCÊ É O DRÁCULA — 3D (toon + raio-x) =====================
  let gT = 0;
  // __PERSONAGENS__
  const v3 = new T3.Vector3();
  function headOf(c) { c.updateMatrixWorld(true); c.userData.P.head.getWorldPosition(v3); return [v3.x, v3.y + 0.13 * c.scale.y, v3.z]; }
  function wpos(o, x, y, z) { o.updateMatrixWorld(true); const p = new T3.Vector3(x || 0, y || 0, z || 0); o.localToWorld(p); return [p.x, p.y, p.z]; }
  function place(c, x, y, z, ry) { c.visible = true; c.position.set(x, y, z); c.rotation.set(0, ry || 0, 0); }
  const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const camT = new T3.Vector3();
  function camAt(p, l, fov) { cam.position.set(p[0], p[1], p[2]); camT.set(l[0], l[1], l[2]); if (cam.fov !== (fov || 40)) { cam.fov = fov || 40; cam.updateProjectionMatrix(); } }
  function camAB(lt, T, a, b, la, lb, fov) { const u = eIO(clamp(lt / T)); camAt(L3(a, b, u), L3(la, lb || la, u), fov); }
  const fx = { flash: 0, shake: 0, white: 0, black: 0, red: 0 };

  // ---------- céu e modos de luz ----------
  const skyC = document.createElement('canvas'); skyC.width = 4; skyC.height = 256; const skyX = skyC.getContext('2d'); const skyT = new T3.CanvasTexture(skyC); skyT.colorSpace = T3.SRGBColorSpace;
  const MODES = {
    crypt: { sky: ['#05030a', '#140a22'], hemi: 0.5, sun: 0.5, sunC: '#8a9aff', fog: '#07050c', fogN: 6, fogF: 30, ground: '#1a1420', rim: '#8a5aff', rimI: 0.5 },
    xray: { sky: ['#01050c', '#0a2a48'], hemi: 1.0, sun: 0.6, sunC: '#bfe0ff', fog: '#03101c', fogN: 8, fogF: 40, ground: '#04121e', rim: '#3aa0ff', rimI: 0.8 },
    night: { sky: ['#02030c', '#241850'], hemi: 0.55, sun: 0.8, sunC: '#a8b8ff', fog: '#120e2a', fogN: 40, fogF: 220, ground: '#120e20', rim: '#6a5aff', rimI: 0.6 },
    dawn: { sky: ['#3a4a8a', '#ffa060'], hemi: 1.0, sun: 1.6, sunC: '#ffb070', fog: '#d88a6a', fogN: 40, fogF: 220, ground: '#4a3a3a', rim: '#ff8a3a', rimI: 0.9 },
    dark: { sky: ['#000000', '#05020a'], hemi: 0.12, sun: 0.05, sunC: '#3a3a6a', fog: '#000000', fogN: 3, fogF: 14, ground: '#000000', rim: '#3a0a1a', rimI: 0.2 } };
  scene.fog = new T3.Fog(0x000000, 10, 50); scene.background = skyT;
  const C1 = new T3.Color(), C2 = new T3.Color();
  const mixC = (a, b, u) => '#' + C1.set(a).lerp(C2.set(b), u).getHexString();
  function setMode(k, k2, u) { const A = MODES[k], B = MODES[k2 || k]; u = k2 ? u : 0; const g = skyX.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, mixC(A.sky[0], B.sky[0], u)); g.addColorStop(1, mixC(A.sky[1], B.sky[1], u)); skyX.fillStyle = g; skyX.fillRect(0, 0, 4, 256); skyT.needsUpdate = true;
    hemi.color.set(0xffffff); hemi.groundColor.set(mixC(A.ground, B.ground, u)); hemi.intensity = lerp(A.hemi, B.hemi, u); sun.color.set(mixC(A.sunC, B.sunC, u)); sun.intensity = lerp(A.sun, B.sun, u); rim.intensity = lerp(A.rimI, B.rimI, u); rim.color.set(mixC(A.rim, B.rim, u)); scene.fog.color.set(mixC(A.fog, B.fog, u)); scene.fog.near = lerp(A.fogN, B.fogN, u); scene.fog.far = lerp(A.fogF, B.fogF, u); }
  function sunAt(x, y, z) { sun.position.set(x + 12, y + 30, z + 18); sun.target.position.set(x, y, z); sun.target.updateMatrixWorld(); }

  // ---------- Drácula ----------
  const DRA = { skin: '#e6dce6', hairStyle: 'short', hairC: '#0a0a10', top: '#15121c', top2: '#0c0a12', pants: '#15121c', shoe: '#050505', sole: '#000', iris: '#c8202a' };
  function dressDracula(c) { const P = c.userData.P; const hr = 0.14;
    part(P.head, CONE, DRA.hairC, 0, 0.27, hr * 0.7, 0.05, 0.08, 0.03).rotation.x = Math.PI; // bico de viúva
    [-1, 1].forEach(s => { const b = part(P.head, BOX, '#0a0a10', s * hr * 0.36, 0.215, hr * 0.92, hr * 0.32, hr * 0.06, 0.01); b.rotation.z = s * 0.35; });
    P.fangs = [-1, 1].map(s => { const f = part(P.head, CONE, '#ffffff', s * 0.02, 0.05, hr * 0.97, 0.009, 0.03, 0.009); f.rotation.x = Math.PI; return f; });
    tb(P.spine, 0, 0.42, 0.122, 0.1, 0.3, 0.02, '#e8e4ec'); tb(P.spine, 0, 0.52, 0.128, 0.05, 0.03, 0.02, '#8a0a1a'); part(P.spine, SPH, '#e8c060', 0, 0.36, 0.13, 0.035, 0.035, 0.012, 0, true);
    const cape = grp(P.spine, 0, 0.6, -0.12); P.cape = cape; part(cape, BOX, '#0a0810', 0, -0.55, 0, 0.62, 1.1, 0.03); part(cape, BOX, '#8a0a1a', 0, -0.55, 0.018, 0.58, 1.06, 0.01);
    [-1, 1].forEach(s => { const col = part(P.spine, BOX, '#0a0810', s * 0.2, 0.68, -0.04, 0.12, 0.26, 0.02); col.rotation.set(-0.3, s * 0.6, s * 0.25); part(P.spine, BOX, '#8a0a1a', s * 0.19, 0.68, -0.03, 0.1, 0.22, 0.01).rotation.set(-0.3, s * 0.6, s * 0.25); });
    P.eyeG = [-1, 1].map(s => { const g = glowSpr(P.head, s * hr * 0.36, 0.14, hr * 1.0, 0.09, '#ff2030', 1); g.visible = false; return g; });
    return c; }
  const dra = dressDracula(makeChar(Object.assign({}, DRA, { s: 1.06, ph: 0.3 }))); opt(dra);
  // versão raio-x: casca transparente + órgãos por dentro
  const draX = dressDracula(makeChar(Object.assign({}, DRA, { s: 1.06, ph: 0.3 }))); opt(draX);
  const shellM = new T3.MeshBasicMaterial({ color: '#9ad0ff', transparent: true, opacity: 0.1, depthWrite: false, toneMapped: false });
  const rimM = new T3.MeshBasicMaterial({ color: '#6ab8ff', transparent: true, opacity: 0.22, side: T3.BackSide, depthWrite: false, toneMapped: false });
  draX.traverse(o => { if (o.isMesh) o.material = o.material === OUTM ? rimM : shellM; if (o.isSprite) o.visible = false; });
  const XP = draX.userData.P; const X = {};
  { const boneM = new T3.MeshBasicMaterial({ color: '#e8f0ff', transparent: true, opacity: 0.55, toneMapped: false });
    const B = (p, geo, x, y, z, sx, sy, sz) => { const m = new T3.Mesh(geo, boneM); m.position.set(x, y, z); m.scale.set(sx, sy, sz); p.add(m); return m; };
    X.boneM = boneM; X.bones = [];
    X.bones.push(B(XP.spine, CYL, 0, 0.3, -0.07, 0.022, 0.62, 0.022)); for (let i = 0; i < 5; i++) { const r = B(XP.spine, TOR, 0, 0.26 + i * 0.065, 0, 0.16 - Math.abs(i - 2) * 0.012, 0.16 - Math.abs(i - 2) * 0.012, 0.11); r.rotation.x = Math.PI / 2; X.bones.push(r); }
    X.bones.push(B(XP.head, SPH, 0, 0.13, -0.005, 0.11, 0.12, 0.11)); X.bones.push(B(XP.hips, SPH, 0, 0.0, 0, 0.16, 0.06, 0.1));
    ['L', 'R'].forEach(s => { X.bones.push(B(XP['sh' + s], CYL, 0, -0.15, 0, 0.018, 0.3, 0.018)); X.bones.push(B(XP['el' + s], CYL, 0, -0.14, 0, 0.016, 0.28, 0.016)); X.bones.push(B(XP['th' + s], CYL, 0, -0.21, 0, 0.022, 0.42, 0.022)); X.bones.push(B(XP['kn' + s], CYL, 0, -0.2, 0, 0.02, 0.4, 0.02)); });
    X.veinM = new T3.MeshBasicMaterial({ color: '#5a0a14', toneMapped: false }); const V = (p, x, y, z, l, rz) => { const m = new T3.Mesh(CYL, X.veinM); m.position.set(x, y, z); m.scale.set(0.007, l, 0.007); m.rotation.z = rz || 0; p.add(m); return m; };
    ['L', 'R'].forEach((s, i) => { const k = i ? 1 : -1; V(XP['sh' + s], 0.03 * k, -0.15, 0.05, 0.3); V(XP['el' + s], 0.025 * k, -0.14, 0.045, 0.28); V(XP['th' + s], 0.035 * k, -0.21, 0.06, 0.42); V(XP['kn' + s], 0.03 * k, -0.2, 0.05, 0.4); V(XP.spine, 0.07 * k, 0.3, 0.07, 0.5, k * 0.25); V(XP.spine, 0.12 * k, 0.45, 0.06, 0.2, k * 1.2); });
    V(XP.spine, 0.0, 0.5, 0.085, 0.24); V(XP.head, 0.05, 0.08, 0.08, 0.14, 0.4); V(XP.head, -0.05, 0.08, 0.08, 0.14, -0.4);
    X.heart = new T3.Mesh(SPH, new T3.MeshBasicMaterial({ color: '#3a0a12', toneMapped: false })); X.heart.position.set(0.045, 0.43, 0.06); X.heart.scale.set(0.055, 0.065, 0.05); XP.spine.add(X.heart);
    X.heartG = glowSpr(XP.spine, 0.045, 0.43, 0.08, 0.3, '#ff2a3a', 0);
    X.eso = new T3.Mesh(CYL, new T3.MeshBasicMaterial({ color: '#c8607a', transparent: true, opacity: 0.8, toneMapped: false })); X.eso.position.set(0, 0.46, 0.03); X.eso.scale.set(0.016, 0.36, 0.016); XP.spine.add(X.eso);
    X.stom = new T3.Mesh(SPH, new T3.MeshBasicMaterial({ color: '#8a2a3a', transparent: true, opacity: 0.85, toneMapped: false })); X.stom.position.set(0.05, 0.2, 0.05); X.stom.scale.set(0.095, 0.07, 0.06); X.stom.rotation.z = 0.5; XP.spine.add(X.stom);
    X.stomG = glowSpr(XP.spine, 0.05, 0.2, 0.08, 0.35, '#ff3a3a', 0);
    X.muscM = new T3.MeshBasicMaterial({ color: '#ff5a6a', transparent: true, opacity: 0.0, toneMapped: false }); X.musc = [];
    ['L', 'R'].forEach(s => { [[XP['sh' + s], -0.13, 0.06, 0.15], [XP['el' + s], -0.11, 0.05, 0.12], [XP['th' + s], -0.18, 0.08, 0.18], [XP['kn' + s], -0.16, 0.06, 0.16]].forEach(([p, y, r, h]) => { const m = new T3.Mesh(SPH, X.muscM); m.position.set(0, y, 0.01); m.scale.set(r, h, r); p.add(m); X.musc.push(m); }); });
    [-1, 1].forEach(s => { const m = new T3.Mesh(SPH, X.muscM); m.position.set(s * 0.09, 0.42, 0.06); m.scale.set(0.09, 0.07, 0.04); XP.spine.add(m); X.musc.push(m); });
    X.wings = ['L', 'R'].map((s, i) => { const k = i ? 1 : -1; const sh = new T3.Shape(); sh.moveTo(0, 0); sh.lineTo(0.9 * k, 0.25); for (let j = 0; j < 4; j++) { const x0 = 0.9 * k - j * 0.225 * k; sh.quadraticCurveTo(x0 - 0.11 * k, -0.25, x0 - 0.225 * k, -0.35); } sh.lineTo(0, -0.15); const m = new T3.Mesh(new T3.ShapeGeometry(sh), new T3.MeshBasicMaterial({ color: '#3a1a4a', transparent: true, opacity: 0.6, side: T3.DoubleSide, depthWrite: false, toneMapped: false })); const g = grp(XP['el' + s], 0, -0.25, 0); g.add(m); g.rotation.z = -k * 1.2; g.visible = false; return g; });
    X.eyeG = [-1, 1].map(s => { const g = glowSpr(XP.head, s * 0.14 * 0.36, 0.14, 0.14, 0.1, '#ff2030', 1); g.visible = false; return g; }); }
  // partículas: sangue, células, fumaça, estrelas
  const bloodP = particles(world, 220, '#ff1a2a', 0.012);
  const cellP = particles(world, 260, '#ffd27a', 0.01);
  const smokeP = particles(world, 220, '#6a6a74', 0.05);
  const starP = particles(world, 400, '#ffffff', 0.25);
  const dustP = particles(world, 160, '#b8a8d8', 0.012);

  // ---------- CRIPTA (x=0) ----------
  const crypt = grp(world, 0, 0, 0);
  { for (let i = -6; i <= 6; i++) for (let j = -6; j <= 4; j++) tb(crypt, i * 1.0, -0.05, j * 1.0, 0.97, 0.1, 0.97, ['#3a3440', '#34303c', '#2e2a36'][(i * 7 + j * 3 + 99) % 3]);
    tb(crypt, 0, 3, -5.2, 14, 6.4, 0.4, '#2a2632'); tb(crypt, -6.2, 3, 0, 0.4, 6.4, 12, '#2a2632'); tb(crypt, 6.2, 3, 0, 0.4, 6.4, 12, '#2a2632');
    for (let i = 0; i < 26; i++) { const R = rng(i + 4); tb(crypt, -6 + R() * 12, 0.4 + R() * 5.6, -4.98, 0.9, 0.42, 0.04, ['#34303c', '#24202c'][i % 2]); }
    [-2.5, 2.5].forEach(x => { tb(crypt, x, 3, -4.6, 0.7, 6, 0.7, '#3a3644'); tb(crypt, x, 5.9, -4.6, 1.0, 0.3, 1.0, '#4a4654'); tb(crypt, x, 0.15, -4.6, 1.0, 0.3, 1.0, '#4a4654'); });
    // janela gótica com a lua
    tb(crypt, 0, 3.6, -4.98, 1.6, 2.6, 0.06, '#0a1030', true); part(crypt, SPH, '#0a1030', 0, 4.9, -4.97, 0.8, 0.8, 0.03, 0, true); glowSpr(crypt, 0.25, 4.2, -4.9, 1.8, '#c8d8ff', 0.8); part(crypt, SPH, '#f0f4ff', 0.25, 4.2, -4.92, 0.34, 0.34, 0.02, 0, true);
    tb(crypt, 0, 3.6, -4.94, 0.08, 2.6, 0.06, '#1a1622'); tb(crypt, 0, 3.6, -4.94, 1.6, 0.08, 0.06, '#1a1622');
    tb(crypt, 0, 0.16, 0, 1.4, 0.32, 2.8, '#4a4654'); tb(crypt, 0, 0.34, 0, 1.2, 0.04, 2.6, '#5a5664'); }
  const coffin = grp(crypt, 0, 0.36, 0);
  { tb(coffin, 0, 0.25, 0, 0.8, 0.5, 2.2, '#2a120c'); tb(coffin, 0, 0.49, 0, 0.66, 0.04, 2.06, '#7a0a1a'); tb(coffin, 0, 0.47, -0.9, 0.5, 0.06, 0.3, '#9a1a2a'); [-0.42, 0.42].forEach(x => tb(coffin, x, 0.25, 0, 0.04, 0.42, 2.0, '#c8a040'));
    [-0.6, 0, 0.6].forEach(z => [-0.43, 0.43].forEach(x => tb(coffin, x, 0.3, z, 0.04, 0.06, 0.18, '#c8a040'))); }
  const lid = grp(coffin, -0.4, 0.5, 0); { tb(lid, 0.4, 0.04, 0, 0.82, 0.08, 2.24, '#3a1a10'); tb(lid, 0.4, 0.085, 0.2, 0.06, 0.01, 0.9, '#c8a040'); tb(lid, 0.4, 0.085, -0.05, 0.4, 0.01, 0.06, '#c8a040'); }
  const CANDLES = []; [[-1.4, -1.2], [1.4, -1.2], [-1.4, 1.2], [1.4, 1.2], [-3.6, -4], [3.6, -4]].forEach(([x, z], i) => { const h = 0.9 + (i % 3) * 0.2; tb(crypt, x, h / 2, z, 0.12, h, 0.12, '#e8e0c8'); const f = part(crypt, CONE, '#ffc060', x, h + 0.08, z, 0.04, 0.12, 0.04, 0, true); const g = glowSpr(crypt, x, h + 0.1, z, 0.7, '#ffb050', 0.9); CANDLES.push({ f, g, x, z, h }); });
  const candleL = new T3.PointLight(0xffa050, 0, 9, 1.4); candleL.position.set(0, 1.6, 0.4); world.add(candleL);
  const moonL = new T3.PointLight(0x8aa0ff, 0, 12, 1.2); moonL.position.set(0, 4, -3.6); world.add(moonL);

  // ---------- RAIO-X (x=100) ----------
  const XR = 100; const xlab = grp(world, XR, 0, 0);
  { const grid = new T3.GridHelper(30, 60, 0x2a8aff, 0x0a3a6a); grid.material.transparent = true; grid.material.opacity = 0.6; xlab.add(grid); const ring = new T3.Mesh(new T3.RingGeometry(0.6, 0.66, 64), new T3.MeshBasicMaterial({ color: '#3aa0ff', transparent: true, opacity: 0.6, toneMapped: false, side: T3.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; xlab.add(ring);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; tb(xlab, Math.cos(a) * 5, 2, Math.sin(a) * 5 - 2, 0.04, 4, 0.04, '#1a5aaa', true); } }

  // ---------- CASTELO E CÉU (x=200) ----------
  const CX = 200; const land = grp(world, CX, 0, 0);
  { tb(land, 0, -0.1, 0, 400, 0.2, 400, '#141024'); const hill = part(land, SPH, '#1a1430', 0, -14, -40, 40, 22, 30);
    const castle = grp(land, 0, 7.5, -40); tb(castle, 0, 4, 0, 12, 8, 8, '#2a2438'); [[-7, 0], [7, 0], [-4, 5], [4, 5]].forEach(([x, z]) => { part(castle, CYL, '#2a2438', x, 6, z, 1.6, 12, 1.6); part(castle, CONE, '#4a1a2a', x, 13.5, z, 2.0, 3.5, 2.0); });
    part(castle, CYL, '#2a2438', 0, 10, 0, 2, 12, 2); part(castle, CONE, '#4a1a2a', 0, 18, 0, 2.6, 4.5, 2.6); for (let i = 0; i < 9; i++) { const R = rng(i + 30); tb(castle, -5 + R() * 10, 2 + R() * 9, 4.05 + (i % 2) * 1.0, 0.5, 0.8, 0.05, '#ffc860', true); }
    for (let i = 0; i < 30; i++) { const R = rng(i + 80); const x = (R() - 0.5) * 120, z = -10 - R() * 60; const t = grp(land, x, 0, z); part(t, CYL, '#0e0a16', 0, 1.5, 0, 0.12, 3, 0.12); for (let k = 0; k < 3; k++) { const b = part(t, CYL, '#0e0a16', 0, 2 + k * 0.5, 0, 0.05, 1.4, 0.05); b.rotation.z = (k - 1) * 0.9; } }
    [[-6, 5], [-3, 7], [2, 6], [5, 8], [8, 5]].forEach(([x, z], i) => { tb(land, x, 0.45, z, 0.6, 0.9, 0.16, '#3a3646'); part(land, CYL, '#3a3646', x, 0.9, z, 0.3, 0.16, 0.08).rotation.x = Math.PI / 2; });
    tb(land, -12, 1.2, 3, 3, 2.4, 3, '#2a2632'); part(land, CONE, '#2a2632', -12, 3.0, 3, 2.4, 1.4, 2.4); tb(land, -12, 0.9, 4.52, 0.8, 1.6, 0.04, '#120e18'); }
  const moon = grp(world, CX - 30, 60, -150); { part(moon, SPH, '#f4f6ff', 0, 0, 0, 9, 9, 1, 0, true); glowSpr(moon, 0, 0, 2, 50, '#c8d4ff', 0.6); }
  const sunG = grp(world, CX + 40, -6, -150); { part(sunG, SPH, '#fff2c0', 0, 0, 0, 10, 10, 1, 0, true); glowSpr(sunG, 0, 0, 2, 70, '#ffb060', 0.9); }
  const clouds = []; for (let i = 0; i < 9; i++) { const R = rng(i + 140); const c = grp(world, CX - 80 + R() * 160, 20 + R() * 25, -60 - R() * 70); for (let k = 0; k < 4; k++) part(c, SPH, '#3a3058', k * 3 - 4, R() * 1.5, 0, 4, 1.6, 2); clouds.push(c); }
  // morcego
  const bat = opt(grp(world)); const BW = [];
  { part(bat, SPH, '#141018', 0, 0, 0, 0.12, 0.1, 0.18, 0.05); part(bat, SPH, '#141018', 0, 0.04, 0.17, 0.08, 0.08, 0.08, 0.05); [-1, 1].forEach(s => { part(bat, CONE, '#141018', s * 0.04, 0.13, 0.17, 0.03, 0.08, 0.03); glowSpr(bat, s * 0.03, 0.06, 0.25, 0.08, '#ff2030', 1);
      const sh = new T3.Shape(); sh.moveTo(0, 0.08); sh.lineTo(0.7, 0.18); for (let j = 0; j < 3; j++) { const x0 = 0.7 - j * 0.23; sh.quadraticCurveTo(x0 - 0.1, -0.05, x0 - 0.23, -0.12); } sh.lineTo(0, -0.08); const m = new T3.Mesh(new T3.ShapeGeometry(sh), new T3.MeshToonMaterial({ color: '#1a1424', gradientMap: GRAD, side: T3.DoubleSide })); const w = grp(bat, s * 0.08, 0.02, 0); m.rotation.x = -Math.PI / 2; m.scale.x = s; w.add(m); BW.push({ w, s }); }); }
  function flap(sp, amp) { BW.forEach(({ w, s }) => w.rotation.z = s * Math.sin(gT * (sp || 14)) * (amp || 0.9)); }

  // ---------- ajudantes de cena ----------
  function cryptSet(o) { o = o || {}; setMode(o.mode || 'crypt'); sunAt(0, 0, 0); candleL.intensity = (o.dim ? 1.2 : 3.4) + Math.sin(gT * 13) * 0.3; moonL.intensity = 2.5; CANDLES.forEach((c, i) => { c.f.scale.y = 0.12 * (1 + Math.sin(gT * 17 + i * 2) * 0.15); c.g.material.opacity = o.dim ? 0.4 : 0.9; }); lid.rotation.z = 0; dustP.userData.place((i, d) => { const R = rng(i + 9); const k = (gT * 0.05 + R()) % 1; d.position.set((R() - 0.5) * 8, 0.3 + k * 5, (R() - 0.5) * 6 - 1); d.scale.setScalar(0.01 + R() * 0.012); }); }
  function lying(c, k) { place(c, 0, 0.9, 1.0, 0); c.rotation.set(-Math.PI / 2 * (1 - k), 0, 0); pose(c, gT, { mood: 'neutral', look: [0, 0], arms: { shL: [0, 0, 0.6 - 0.4 * k], elL: [-1.6 * (1 - k), 0, 0.9 * (1 - k)], shR: [0, 0, -0.6 + 0.4 * k], elR: [-1.6 * (1 - k), 0, -0.9 * (1 - k)] } }); }
  function xraySet(o) { o = o || {}; setMode('xray'); sunAt(XR, 0, 0); place(draX, XR, 0, 0, 0); pose(draX, gT, o.pose || { mood: 'neutral', look: [0, 0] }); X.heartG.material.opacity = 0; X.stomG.material.opacity = 0; X.veinM.color.set('#5a0a14'); X.muscM.opacity = 0; X.musc.forEach(m => m.scale.multiplyScalar(1)); X.wings.forEach(w => w.visible = false); X.eyeG.forEach(g => g.visible = false); X.boneM.opacity = 0.55; draX.scale.setScalar(1.06); X.heart.material.color.set('#3a0a12'); X.heart.scale.set(0.055, 0.065, 0.05); }
  function beat(c, phase) { const s = 1 + Math.max(0, Math.sin(phase)) ** 6 * 0.35; X.heart.scale.set(0.055 * s, 0.065 * s, 0.05 * s); X.heart.material.color.set('#e81a2a'); X.heartG.material.opacity = 0.4 + (s - 1) * 2; }
  function cellsGlow(k) { cellP.userData.place((i, d) => { const R = rng(i + 3); const parts = [XP.spine, XP.shL, XP.shR, XP.elL, XP.elR, XP.thL, XP.thR, XP.knL, XP.knR, XP.head]; const p = parts[i % parts.length]; const w = wpos(p, (R() - 0.5) * 0.14, -R() * 0.35 + (p === XP.spine ? 0.5 : 0) + (p === XP.head ? 0.25 : 0), (R() - 0.5) * 0.1); d.position.set(w[0], w[1], w[2]); const tw = 0.5 + 0.5 * Math.sin(gT * 6 + i); d.scale.setScalar(0.012 * k * tw); }); }
  function bloodFlow(lt, mode) { bloodP.userData.place((i, d) => { const R = rng(i + 50); const u = (lt * 0.6 + R()) % 1; let w;
      if (mode === 'throat') w = wpos(XP.spine, (R() - 0.5) * 0.012, lerp(0.7, 0.24, u), 0.03 + (R() - 0.5) * 0.01);
      else if (mode === 'stomach') { const a = R() * 6.28 + lt * 2; w = wpos(XP.spine, 0.05 + Math.cos(a) * 0.06 * R(), 0.2 + Math.sin(a) * 0.045 * R(), 0.05 + (R() - 0.5) * 0.04); }
      else { const parts = [XP.shL, XP.shR, XP.elL, XP.elR, XP.thL, XP.thR, XP.knL, XP.knR]; const p = parts[i % 8]; w = wpos(p, 0.03 * (i % 2 ? 1 : -1), -u * 0.4, 0.05); }
      d.position.set(w[0], w[1], w[2]); d.scale.setScalar(0.012 + R() * 0.008); }); }
  function stars() { starP.userData.place((i, d) => { const R = rng(i + 1); d.position.set(CX + (R() - 0.5) * 400, 30 + R() * 120, -120 - R() * 60); d.scale.setScalar(0.15 + R() * 0.3 * (0.6 + 0.4 * Math.sin(gT * 3 + i))); }); }
  function nightSet(dawn) { setMode('night', dawn != null ? 'dawn' : null, dawn || 0); sunAt(CX, 0, 0); moon.visible = true; sunG.visible = dawn != null; sunG.position.y = lerp(-12, 6, dawn || 0); if (!dawn || dawn < 0.6) stars(); clouds.forEach((c, i) => c.position.x = CX - 80 + ((i * 37 + gT * 1.2) % 160)); }
  function smoke(c, k) { smokeP.userData.place((i, d) => { const R = rng(i + 70); const u = (gT * 0.5 + R()) % 1; const w = headOf(c); d.position.set(w[0] + (R() - 0.5) * 0.5 + u * 0.3, w[1] - R() * 1.4 + u * 1.6, w[2] + (R() - 0.5) * 0.4); d.scale.setScalar((0.012 + u * 0.035) * k * (1 - u * 0.5)); d.rotation.set(u * 3, i, 0); }); }

  const A = {
    crypt_wide(lt, T) { cryptSet(); coffin.visible = true; camAB(lt, T, [3.6, 3.0, 4.6], [2.6, 2.0, 3.6], [0, 0.8, 0], [0, 0.6, 0], 40); },
    bell_moon(lt, T) { nightSet(); camAB(lt, T, [CX - 6, 3, 30], [CX - 6, 4, 26], [CX - 20, 40, -100], [CX - 22, 44, -110], 40); fx.shake = (lt % 1.6) < 0.08 ? 0.01 : 0; },
    lid_open(lt, T) { cryptSet(); const u = eIO(prog(lt, 0.1, T * 0.8)); lid.rotation.z = u * 1.9; camAB(lt, T, [2.2, 1.8, 2.6], [1.6, 1.6, 2.2], [0, 0.6, 0], null, 38); if (lt > 0.1 && lt < T * 0.8) fx.shake = 0.004; lying(dra, 0); dra.visible = true; },
    xray_heart_still(lt, T) { xraySet(); const h = wpos(XP.spine, 0.045, 0.43, 0.06); camAB(lt, T, add3(h, [0.9, 0.2, 2.3]), add3(h, [0.6, 0.12, 1.7]), h, null, 34); },
    xray_heart_beat(lt, T) { xraySet(); const ph = lt < 0.4 ? Math.PI / 2 * clamp(lt / 0.2) : Math.PI; beat(draX, ph * 1); if (lt < 0.35) { fx.flash = 0.3 * (1 - lt / 0.35); fx.shake = 0.006; } X.heart.material.color.set(mixC('#3a0a12', '#e81a2a', clamp(lt / 0.2))); X.heartG.material.opacity = 0.9 * clamp(lt / 0.2) * (1 - clamp((lt - 0.5) / 1.5)) + 0.2; const h = wpos(XP.spine, 0.045, 0.43, 0.06); camAB(lt, T, add3(h, [0.6, 0.12, 1.7]), add3(h, [0.45, 0.08, 1.3]), h, null, 34); },
    drac_eyes_open(lt, T) { cryptSet(); lid.rotation.z = 1.9; const u = eIO(prog(lt, 0.2, T * 0.9)); lying(dra, u); const h = headOf(dra); camAB(lt, T, add3(h, [0.6, 0.4, 1.4]), add3(h, [0.4, 0.1, 1.0]), h, null, 36); pose(dra, gT, { mood: lt < 0.5 ? 'sad' : 'determined', look: [0, 0], arms: { shL: [0, 0, 0.6 - 0.4 * u], elL: [-1.6 * (1 - u), 0, 0.9 * (1 - u)], shR: [0, 0, -0.6 + 0.4 * u], elR: [-1.6 * (1 - u), 0, -0.9 * (1 - u)] } }); },
    drac_hungry(lt, T) { cryptSet(); lid.rotation.z = 1.9; place(dra, 0, 0.86, 0.9, 0.3); pose(dra, gT, { mood: 'angry', look: [0.2, 0], lean: 0.15, headX: 0.1 }); const h = headOf(dra); const b = Math.sin(gT * 3) * 0.02; camAB(lt, T, add3(h, [0.6, 0.05 + b, 1.6]), add3(h, [0.42, 0.02, 1.25]), add3(h, [0, -0.08, 0]), null, 34); },
    fangs_grow(lt, T) { A.drac_hungry(lt, T); const u = eOut(prog(lt, 0.2, T * 0.8)); dra.userData.P.fangs.forEach(f => f.scale.set(0.009 + u * 0.004, 0.03 + u * 0.05, 0.009)); pose(dra, gT, { mood: 'scream', look: [0, 0], lean: 0.15, headX: -0.1 }); const h = headOf(dra); camAB(lt, T, add3(h, [0.15, -0.02, 1.05]), add3(h, [0.08, -0.05, 0.8]), add3(h, [0, -0.08, 0]), null, 32); },
    bite_flash(lt, T) { setMode('dark'); sunAt(0, 0, 0); candleL.intensity = 2.6; place(dra, 0, 0.86, 0.9, 0.3); pose(dra, gT, { mood: 'scream', look: [0, 0], lean: 0.6, headX: 0.3 }); dra.userData.P.fangs.forEach(f => f.scale.set(0.013, 0.08, 0.009)); const h = headOf(dra); camAt(add3(h, [0.1, 0.0, 0.75]), add3(h, [0, -0.08, 0]), 32); fx.red = 0.45 * (1 - clamp(lt / 0.6)); fx.flash = lt < 0.12 ? 0.6 : 0; fx.shake = lt < 0.3 ? 0.01 : 0; },
    xray_throat(lt, T) { xraySet({ pose: { mood: 'neutral', look: [0, 0], headX: -0.15 } }); bloodFlow(lt, 'throat'); X.eso.material.color.set('#ff3a5a'); const h = wpos(XP.spine, 0, 0.55, 0.05); camAB(lt, T, add3(h, [0.9, 0.25, 2.2]), add3(h, [0.7, 0.0, 1.8]), h, add3(h, [0, -0.15, 0]), 36); },
    xray_stomach(lt, T) { xraySet(); bloodFlow(lt, 'stomach'); X.stomG.material.opacity = 0.5 + 0.2 * Math.sin(gT * 4); X.stom.material.color.set('#c8202a'); const h = wpos(XP.spine, 0.05, 0.2, 0.05); camAB(lt, T, add3(h, [0.8, 0.25, 1.9]), add3(h, [0.6, 0.15, 1.5]), h, null, 34); },
    xray_veins(lt, T) { xraySet(); const u = clamp(lt / (T * 0.8)); X.veinM.color.set(mixC('#5a0a14', '#ff2a3a', u)); bloodFlow(lt, 'veins'); X.stomG.material.opacity = 0.5 * (1 - u); beat(draX, gT * 7); camAB(lt, T, [XR + 0.9, 1.3, 2.6], [XR + 0.5, 1.1, 2.1], [XR, 1.0, 0], null, 40); },
    xray_cells(lt, T) { xraySet(); X.veinM.color.set('#ff2a3a'); beat(draX, gT * 7); cellsGlow(eOut(clamp(lt / 1.2))); shellM.color.set(mixC('#9ad0ff', '#ffd27a', clamp(lt / T))); camAB(lt, T, [XR - 0.6, 1.2, 2.4], [XR - 0.2, 1.1, 1.8], [XR, 1.0, 0], null, 40); fx.flash = lt < 0.2 ? 0.15 : 0; },
    xray_muscles(lt, T) { xraySet({ pose: { mood: 'angry', look: [0, 0], arms: { shL: [0, 0, 1.2], elL: [-1.6, 0, 0], shR: [0, 0, -1.2], elR: [-1.6, 0, 0] } } }); X.veinM.color.set('#ff2a3a'); cellsGlow(0.6); const p = 1 + 0.35 * eOut(clamp(lt / 1.5)) + Math.sin(gT * 8) * 0.03; X.muscM.opacity = 0.75; X.musc.forEach(m => { m.userData.s = m.userData.s || m.scale.clone(); m.scale.copy(m.userData.s).multiplyScalar(p); }); camAB(lt, T, [XR + 0.3, 1.3, 2.5], [XR + 0.2, 1.25, 2.0], [XR, 1.15, 0], null, 40); fx.shake = (lt % 0.7) < 0.06 ? 0.006 : 0; },
    eyes_dark(lt, T) { setMode('dark'); sunAt(0, 0, 0); candleL.intensity = 0.2; place(dra, 0, 0, 1.4, 0); pose(dra, gT, { mood: 'determined', look: [Math.sin(gT * 1.5) * 0.6, 0] }); dra.userData.P.eyeG.forEach(g => { g.visible = true; g.material.opacity = 0.7 + 0.3 * Math.sin(gT * 5); }); const h = headOf(dra); camAB(lt, T, add3(h, [0.1, 0.02, 0.9]), add3(h, [0.05, 0.02, 0.55]), add3(h, [0, -0.02, 0]), null, 32); },
    drac_jump(lt, T) { cryptSet(); lid.rotation.z = 1.9; place(dra, 0, 0, 2.4, 0); const u = eOut(prog(lt, 0.3, T)); dra.position.y = u * 1.2; pose(dra, gT, { mood: 'determined', look: [0, 0.4], arms: { shL: [0, 0, 1.4 * u], elL: [0, 0, 0], shR: [0, 0, -1.4 * u], elR: [0, 0, 0] }, legs: { thL: -0.4 * u, knL: 0.8 * u, thR: -0.2 * u, knR: 0.5 * u } }); dra.userData.P.cape.rotation.x = -0.6 * u; camAB(lt, T, [1.6, 0.6, 5.2], [1.2, 0.9, 4.8], [0, 1.3, 2.4], [0, 2.0, 2.4], 42); },
    xray_shrink(lt, T) { xraySet({ pose: { mood: 'scream', look: [0, 0], arms: { shL: [0, 0, 1.3], elL: [0, 0, 0.3], shR: [0, 0, -1.3], elR: [0, 0, -0.3] } } }); const u = eIO(clamp(lt / T)); draX.scale.setScalar(lerp(1.06, 0.6, u)); X.boneM.opacity = 0.55 + 0.4 * Math.sin(gT * 20) ** 2; fx.shake = 0.006; camAB(lt, T, [XR, 1.2, 2.8], [XR, 0.8, 2.2], [XR, 1.0, 0], [XR, 0.6, 0], 40); },
    xray_wings(lt, T) { xraySet({ pose: { mood: 'scream', look: [0, 0], arms: { shL: [0, 0, 1.4], elL: [0, 0, 0.3], shR: [0, 0, -1.4], elR: [0, 0, -0.3] } } }); draX.scale.setScalar(0.6); const u = eOut(clamp(lt / T)); X.wings.forEach((w, i) => { w.visible = true; w.scale.setScalar(0.2 + u * 1.3); w.rotation.z = (i ? 1 : -1) * (1.2 - Math.sin(gT * 12) * 0.3 * u); }); camAB(lt, T, [XR, 0.9, 2.4], [XR, 0.8, 2.0], [XR, 0.6, 0], null, 42); },
    bat_pop(lt, T) { nightSet(); const u = clamp(lt / T); bat.visible = true; bat.position.set(CX + lerp(0, 2, u), 3 + u * 3, 10 - u * 2); bat.rotation.set(-0.3, 0, Math.sin(gT * 3) * 0.2); bat.scale.setScalar(2.2); flap(16, 1.0); fx.flash = lt < 0.25 ? 0.9 * (1 - lt / 0.25) : 0; camAB(lt, T, [CX + 0.5, 3.4, 13], [CX + 1, 5, 13.5], [CX, 3.4, 10], [CX + 2, 6, 8], 40); },
    bat_fly(lt, T) { nightSet(); const u = clamp(lt / T); bat.visible = true; const bx = CX - 20 + u * 40, by = 14 + Math.sin(gT * 1.5) * 1.2, bz = -10; bat.position.set(bx, by, bz); bat.rotation.set(0.1, Math.PI / 2, Math.sin(gT * 2) * 0.25); bat.scale.setScalar(2.2); flap(14, 1.0); camAt([bx - 6, by + 2, bz + 9], [bx + 1, by, bz], 44); },
    dawn_sky(lt, T) { const u = clamp(lt / T); nightSet(u * 0.8); bat.visible = true; const bx = CX + 10 + u * 12, by = 16; bat.position.set(bx, by, -14); bat.rotation.set(0.1, Math.PI / 2, 0); bat.scale.setScalar(2.2); flap(18, 1.0); camAB(lt, T, [CX, 10, 20], [CX + 6, 12, 18], [bx, by, -14], [CX + 30, 6, -150], 46); },
    sun_hit(lt, T) { nightSet(0.85 + clamp(lt / T) * 0.15); place(dra, CX - 3, 0, 6, 0.5); pose(dra, gT, { mood: 'shock', look: [0.6, 0.3], arms: { shL: [-2.4, 0, -0.3], elL: [-1.2, 0, 0], shR: [-0.3, 0, 0.1], elR: [-0.4, 0, 0] } }); const h = headOf(dra); camAB(lt, T, add3(h, [-1.6, 0.2, 2.6]), add3(h, [-1.2, 0.1, 2.0]), add3(h, [0, -0.3, 0]), null, 40); },
    smoke_skin(lt, T) { nightSet(1); place(dra, CX - 3, 0, 6, 0.5); pose(dra, gT, { mood: 'scream', look: [0, 0], arms: { shL: [-2.4, 0, -0.3], elL: [-1.4, 0, 0], shR: [-2.2, 0, 0.3], elR: [-1.4, 0, 0] } }); tm(DRA.skin).color.set(mixC(DRA.skin, '#c84a3a', clamp(lt / T))); smoke(dra, eOut(clamp(lt / 1))); const h = headOf(dra); camAB(lt, T, add3(h, [0.9, 0.1, 1.5]), add3(h, [0.6, 0.05, 1.1]), add3(h, [0, -0.1, 0]), null, 38); fx.shake = 0.004; },
    run_back(lt, T) { nightSet(1); const u = clamp(lt / T); place(dra, CX - 3 - u * 8, 0, 6 - u * 2.5, -2.0); pose(dra, gT, { run: true, mood: 'scream', look: [0, 0] }); dra.userData.P.cape.rotation.x = -0.9; smoke(dra, 0.7); camAB(lt, T, [CX - 1, 1.6, 9], [CX - 6, 1.8, 8], [CX - 3, 1, 6], [CX - 11, 1.2, 3.5], 44); },
    lid_close(lt, T) { cryptSet({ dim: true }); const u = eIn(clamp(lt / (T * 0.6))); lid.rotation.z = 1.9 * (1 - u); lying(dra, 0); if (u >= 1 && lt < T * 0.6 + 0.25) { fx.shake = 0.02; fx.flash = 0.2; } camAB(lt, T, [2.4, 2.2, 3.0], [2.0, 1.8, 2.6], [0, 0.6, 0], null, 38); },
    xray_heart_stop(lt, T) { xraySet(); const u = clamp(lt / T); if (u < 0.6) beat(draX, gT * lerp(6, 2, u / 0.6)); X.heart.material.color.set(mixC('#e81a2a', '#3a0a12', clamp((u - 0.5) * 3))); X.heartG.material.opacity = 0.5 * (1 - clamp((u - 0.5) * 3)); const h = wpos(XP.spine, 0.045, 0.43, 0.06); camAB(lt, T, add3(h, [0.25, 0.04, 0.7]), add3(h, [0.35, 0.08, 1.1]), h, null, 34); },
    crypt_final(lt, T) { cryptSet({ dim: true }); camAB(lt, T, [1.4, 1.2, 2.4], [4.2, 3.6, 6.2], [0, 0.6, 0], [0, 1.2, -1], 40); },
  };

  const flashEl = document.getElementById('mundo-flash'), tintEl = document.getElementById('mundo-tint');
  const ALLC = [dra, draX];
  const PAUSE = __PAUSE__;
  function frame(t) {
    if (t > PAUSE[0] && t < PAUSE[1]) t = PAUSE[0];
    gT = t; let idx = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) idx = i;
    const sh = SHOTS[idx]; const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    for (const k in fx) fx[k] = 0;
    PARTS.forEach(p => p.visible = false); OPT.forEach(o => o.visible = false); moon.visible = false; sunG.visible = false;
    [candleL, moonL].forEach(l => l.intensity = 0); tm(DRA.skin).color.set(DRA.skin); shellM.color.set('#9ad0ff'); X.eso.material.color.set('#c8607a'); X.stom.material.color.set('#8a2a3a');
    ALLC.forEach(c => { const P = c.userData.P; P.fangs.forEach(f => f.scale.set(0.009, 0.03, 0.009)); P.eyeG.forEach(g => g.visible = false); P.cape.rotation.set(0, 0, 0); c.scale.setScalar(1.06); c.rotation.order = 'XYZ'; });
    (A[sh.id] || A[sh.id.replace(/~\d+$/, '')] || A.crypt_wide)(lt, T);
    const pk = 1 - 0.05 * (1 - eOut(clamp(lt / 0.4))); const dir = new T3.Vector3().subVectors(cam.position, camT); cam.position.copy(camT).addScaledVector(dir, pk);
    cam.position.x += Math.sin(t * 0.9) * 0.01 + Math.sin(t * 2.3) * 0.004; cam.position.y += Math.cos(t * 0.7) * 0.008;
    if (fx.shake) { cam.position.x += Math.sin(t * 87) * fx.shake; cam.position.y += Math.cos(t * 71) * fx.shake; }
    cam.lookAt(camT); cam.updateMatrixWorld();
    renderer.render(scene, cam);
    flashEl.style.opacity = Math.max(fx.flash, fx.white).toFixed(3);
    tintEl.style.background = fx.red ? '#c80a1a' : '#000'; tintEl.style.opacity = (fx.red || fx.black).toFixed(3);
  }
  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter', '900 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    const tl = gsap.timeline({ paused: true }); const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0); window.__timelines['mundo'] = tl;
  });
})();

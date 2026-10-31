  // ===================== VÍDEO DO FERRO =====================
  // Os utilitários (box, panel, particles, makeHero...) vêm do topo de mundo.js.
  const SETS = {};
  function newSet(name, cfg) { const g = grp(scene); g.visible = false; SETS[name] = Object.assign({ g }, cfg); return g; }
  const OPT = [];   // objetos opcionais: escondidos em todo quadro, cada plano mostra o que usa
  const opt = (o) => { OPT.push(o); return o; };

  // ---------- o apresentador (Bessekai) ----------
  function makeAvatar() {
    const h = makeHero({ shirt: '#23233a', plate: '#2f2f4c', belt: '#23233a', pants: '#2a3a5a', boot: '#f0f0f0', hair: '#1a1410', sword: false });
    const P = h.userData.P; box(P.head, 0, 5.3, 0.2, 5.2, 1.4, 5.2, '#ff7a1a'); box(P.head, 0, 4.8, 3.2, 4.6, 0.5, 2.4, '#ff7a1a'); box(P.head, 0, 6.1, 0, 1.2, 0.4, 1.2, '#ffd23c');
    box(P.torso, 0, 4.6, 1.8, 3.6, 1.2, 0.2, '#ff7a1a');
    return h;
  }
  function nameTag(p) { const t = panel(p, 18, 4, (x, w, h) => { rr(x, 4, 4, w - 8, h - 8, 60); x.fillStyle = 'rgba(10,6,24,0.85)'; x.fill(); x.lineWidth = 8; x.strokeStyle = '#ff7a1a'; x.stroke(); txt(x, '@Bessekai', w / 2, h / 2, 120, '#ffffff', 700, 'Oswald'); }); return t; }
  function rock(p, s, seed) {
    const g = grp(p); const R = rng(seed || 3);
    for (let i = 0; i < 26; i++) { const a = R() * 6.28, b = R() * 3.14, r = 3 + R() * 1.5; box(g, Math.cos(a) * Math.sin(b) * r, Math.cos(b) * r * 0.8, Math.sin(a) * Math.sin(b) * r, 3 + R() * 2, 3 + R() * 2, 3 + R() * 2, R() < .5 ? '#8a3a24' : '#a24a2c'); }
    box(g, 0, 0, 0, 7, 6, 7, '#7a3020');
    for (let i = 0; i < 18; i++) { const a = R() * 6.28, b = R() * 3.14; box(g, Math.cos(a) * Math.sin(b) * 5, Math.cos(b) * 4.2, Math.sin(a) * Math.sin(b) * 5, 0.8, 0.8, 0.8, '#d8dce8', true); }
    g.scale.setScalar(s); return g;
  }
  function tank(p, x, y, z, r, h, c) { const m = new T3.Mesh(new T3.CylinderGeometry(r, r, h, 20), mat(c)); m.position.set(x, y, z); p.add(m); return m; }

  // ---------- 1) FORJA: barra em brasa (gancho) ----------
  const sForge = newSet('forge', { bg: gradTex(['#060304', '#1a0a06']), fog: [0x1a0a06, 40, 220], hemi: [0xff9a50, 0x100604, 0.6], sun: [0xff8040, 0.6], rim: [0xff5020, 1.0] });
  { box(sForge, 0, -1, 0, 120, 2, 120, '#1a1210'); const an = grp(sForge, 0, 0, 0); box(an, 0, 4, 0, 8, 8, 6, '#2a2a30'); box(an, 0, 9, 0, 22, 3, 8, '#3a3a44'); box(an, 12, 9.5, 0, 6, 2, 4, '#3a3a44'); }
  const bar = grp(sForge, 0, 11.2, 0); box(bar, 0, 0, 0, 20, 1.6, 1.6, '#ff8a2a', true); box(bar, 0, 0, 0, 14, 1.8, 1.8, '#ffd27a', true);
  const forgeLight = new T3.PointLight(0xff7a2a, 4, 80); forgeLight.position.set(0, 18, 6); sForge.add(forgeLight);
  const forgeSparks = particles(sForge, 160, '#ffd27a', 0.35);
  const hookRock = opt(rock(sForge, 1.2, 7)); hookRock.position.set(0, 16, 0);

  // ---------- 2) ESTÚDIO: apresentação ----------
  const sStudio = newSet('studio', { bg: gradTex(['#1a0a3a', '#4a1a6a', '#ff7a4a']), fog: [0x3a1458, 80, 400], hemi: [0xffc0a0, 0x1a0a2a, 1.2], sun: [0xffe0c0, 1.2], rim: [0xff7a1a, 1.4] });
  { for (let x = -6; x < 6; x++) for (let z = -6; z < 4; z++) box(sStudio, x * 10, -1, z * 10, 10, 2, 10, (x + z) % 2 ? '#2a1a3a' : '#34224a');
    const R = rng(41); for (let i = 0; i < 24; i++) { const c = box(sStudio, (R() - .5) * 140, 10 + R() * 70, -30 - R() * 80, 3, 3, 3, R() < .5 ? '#a24a2c' : '#9aa0b0'); c.userData.ph = R() * 6; c.userData.y0 = c.position.y; } }
  const avS = makeAvatar(); sStudio.add(avS); const tagS = nameTag(sStudio);
  const rockS = opt(rock(sStudio, 0.45, 9));

  // ---------- 3) CIDADE: tudo é ferro ----------
  const sCity = newSet('city', { bg: gradTex(['#3a7ad8', '#9ac8f0', '#e8f4ff']), fog: [0xcfe6ff, 120, 600], hemi: [0xffffff, 0x5a6a7a, 1.3], sun: [0xfff2d0, 1.4], rim: [0xffffff, 0.3] });
  const glowable = [];
  { for (let x = -12; x < 12; x++) for (let z = -16; z < 8; z++) box(sCity, x * 10, -1, z * 10, 10, 2, 10, (Math.abs(x) < 1) ? '#3a3a44' : '#8a8a90');
    for (let i = 0; i < 14; i++) { const x = (i % 7) * 26 - 80, z = -40 - Math.floor(i / 7) * 50, h = 40 + (i * 37 % 60); const b = grp(sCity, x, 0, z); box(b, 0, h / 2, 0, 18, h, 18, i % 2 ? '#b0b8c8' : '#9aa4b8');
      for (let k = 0; k < Math.floor(h / 8); k++) for (let j = 0; j < 3; j++) box(b, -6 + j * 6, 6 + k * 8, 9.1, 3, 4, 0.3, '#5a8ad8'); glowable.push(b); }
    const br = grp(sCity, 0, 0, -150); box(br, 0, 20, 0, 160, 3, 14, '#6a6a74'); for (let k = 0; k < 9; k++) box(br, -80 + k * 20, 30, 0, 1.2, 20, 1.2, '#8a8a94'); box(br, 0, 40, 0, 160, 1.5, 1.5, '#8a8a94'); glowable.push(br); }
  const car = grp(sCity, 10, 0, 10); { box(car, 0, 3.5, 0, 9, 4, 18, '#d8303a'); box(car, 0, 7, -1, 8, 3.5, 9, '#c02028'); box(car, 0, 7, -1, 8.2, 2.4, 8.2, '#9ad0ff'); [[-4.6, -6], [4.6, -6], [-4.6, 6], [4.6, 6]].forEach(([x, z]) => box(car, x, 1.8, z, 1.4, 3.6, 3.6, '#111')); box(car, -3, 4, 9.1, 2, 1, 0.3, '#ffeeaa', true); box(car, 3, 4, 9.1, 2, 1, 0.3, '#ffeeaa', true); }
  const fridge = grp(sCity, -14, 0, 6); { box(fridge, 0, 9, 0, 9, 18, 8, '#e8eef4'); box(fridge, 0, 12, 4.1, 8.6, 0.3, 0.2, '#b0b8c0'); box(fridge, 3.2, 14, 4.3, 0.6, 4, 0.6, '#9aa0a8'); box(fridge, 3.2, 7, 4.3, 0.6, 3, 0.6, '#9aa0a8'); }
  const pan = grp(sCity, -2, 0, 22); { box(pan, 0, 1, 0, 7, 2, 7, '#3a3a40'); box(pan, 6, 1.6, 0, 6, 0.8, 1.2, '#2a2a30'); }
  const house = grp(sCity, 40, 0, 0); { box(house, 0, 8, 0, 22, 16, 18, '#f0e0c8'); for (let i = 0; i < 5; i++) box(house, 0, 17 + i * 2.4, 0, 26 - i * 5, 2.4, 22, '#b0503a'); box(house, -5, 5, 9.1, 5, 10, 0.4, '#6a4028'); box(house, 5, 8, 9.1, 6, 5, 0.4, '#9ad0ff'); }
  glowable.push(car, fridge, pan, house);
  const cityMats = {}; glowable.forEach(b => b.traverse(m => { if (m.isMesh && !(m.material instanceof T3.MeshBasicMaterial)) { const c = m.material.color.getHexString(); m.material = cityMats[c] || (cityMats[c] = m.material.clone()); } }));
  function cityGlow(k) { for (const c in cityMats) cityMats[c].emissive.setRGB(k, k * 0.35, 0); }
  const ironGlow = opt(particles(sCity, 1, '#ff8a2a', 1)); // marcador (não usado diretamente)

  // ---------- 4) MINAS: montanha vermelha + placa ----------
  const sMinas = newSet('minas', { bg: gradTex(['#2a6ac8', '#8ac0f0', '#ffe0b0']), fog: [0xf0d8c0, 150, 800], hemi: [0xffffff, 0x6a3a2a, 1.3], sun: [0xffe8c0, 1.5], rim: [0xffa070, 0.6] });
  { const R = rng(43); for (let x = -16; x < 16; x++) for (let z = -24; z < 8; z++) box(sMinas, x * 10, -1, z * 10, 10, 2, 10, R() < .5 ? '#5a8a3a' : '#4e7e34');
    const mt = grp(sMinas, 0, 0, -200); for (let i = 0; i < 12; i++) box(mt, 0, i * 9 + 4.5, 0, 260 - i * 20, 9, 150 - i * 11, i % 2 ? '#a0442a' : '#8a3a24');
    const mt2 = grp(sMinas, -180, 0, -260); for (let i = 0; i < 8; i++) box(mt2, 0, i * 9 + 4.5, 0, 160 - i * 18, 9, 100 - i * 11, i % 2 ? '#9a4a2a' : '#7e3420');
    for (let i = 0; i < 12; i++) tree(sMinas, (R() - .5) * 260, -40 - R() * 60, 1, '#3a7a3a'); }
  const mgSign = opt(panel(sMinas, 60, 26, (x, w, h) => { winBg(x, w, h, '#ffd23c', 'rgba(20,12,4,0.88)'); txt(x, 'MINAS GERAIS', w / 2, h * 0.38, 150, '#ffd23c'); txt(x, 'TERRA DO MINÉRIO DE FERRO', w / 2, h * 0.72, 66, '#ffe8c0'); }));

  // ---------- 5) MINÉRIO: pedra + átomos ----------
  const sLab = newSet('lab', { bg: gradTex(['#05060f', '#141a33', '#24123a']), fog: [0x141a33, 80, 400], hemi: [0xb0c0ff, 0x100818, 1.0], sun: [0xffffff, 1.0], rim: [0xff6a3a, 1.2] });
  { const gh = new T3.GridHelper(600, 60, 0x4a5aa8, 0x24305a); gh.position.y = -20; sLab.add(gh); }
  const bigRock = opt(rock(sLab, 2.2, 11));
  const SPH = new T3.SphereGeometry(1, 16, 12);
  function atom(p, c, r) { const m = new T3.Mesh(SPH, mat(c)); m.scale.setScalar(r); p.add(m); return m; }
  const molFe = [], molO = [], molC = [];
  for (let i = 0; i < 6; i++) molFe.push(atom(sLab, '#c8ccd8', 3.2));
  for (let i = 0; i < 9; i++) molO.push(atom(sLab, '#ff4a4a', 2.2));
  for (let i = 0; i < 9; i++) molC.push(atom(sLab, '#2a2a30', 2.4));
  [...molFe, ...molO, ...molC].forEach(opt);
  const labelPanel = opt(panel(sLab, 40, 10, (x, w, h, st) => { rr(x, 8, 8, w - 16, h - 16, 50); x.fillStyle = 'rgba(10,8,24,0.85)'; x.fill(); x.lineWidth = 8; x.strokeStyle = st.c || '#ff7a1a'; x.stroke(); txt(x, st.t || '', w / 2, h / 2, 120, st.c || '#ffffff'); }));

  // ---------- 6) MINA A CÉU ABERTO: explosão e caminhões ----------
  const sPit = newSet('pit', { bg: gradTex(['#3a7ad8', '#a8d0f0', '#f0e0c8']), fog: [0xe8d0b8, 120, 700], hemi: [0xffffff, 0x7a3a24, 1.3], sun: [0xffecd0, 1.5], rim: [0xffb080, 0.5] });
  { for (let r = 0; r < 7; r++) { const y = -r * 8, s = 300 - r * 36; [[0, -s / 2, s, 12], [0, s / 2, s, 12], [-s / 2, 0, 12, s], [s / 2, 0, 12, s]].forEach(([x, z, w, d]) => box(sPit, x, y, z - 60, w, 8, d, r % 2 ? '#a0482c' : '#8a3c24')); }
    box(sPit, 0, -56, -60, 60, 2, 60, '#7a3420'); }
  const blastBits = particles(sPit, 500, '#a24a2c', 2.6);
  const dustP = particles(sPit, 200, '#d8b090', 4);
  const truck = grp(sPit, 0, 0, 0);
  { box(truck, 0, 9, 0, 22, 8, 36, '#ffc21a'); box(truck, 0, 16, -4, 24, 6, 30, '#e8a810'); box(truck, 7, 16, 14, 8, 8, 8, '#ffc21a'); box(truck, 7, 16, 18.2, 7, 5, 0.4, '#9ad0ff');
    [[-12, -12], [12, -12], [-12, 12], [12, 12]].forEach(([x, z]) => { box(truck, x, 7, z, 4, 14, 14, '#1a1a1a'); box(truck, x * 1.06, 7, z, 0.6, 6, 6, '#5a5a5a'); });
    const R = rng(47); for (let i = 0; i < 30; i++) box(truck, (R() - .5) * 18, 21 + R() * 5, -4 + (R() - .5) * 24, 4, 4, 4, R() < .5 ? '#a24a2c' : '#8a3a24'); }
  const avPit = makeAvatar(); avPit.scale.setScalar(0.55); sPit.add(avPit);

  // ---------- 7) USINA: britador, lavagem, pelotas ----------
  const sPlant = newSet('plant', { bg: gradTex(['#0e1220', '#2a3248', '#4a5a78']), fog: [0x2a3248, 80, 420], hemi: [0xd0e0ff, 0x1a1a24, 1.1], sun: [0xffffff, 1.1], rim: [0x6ab0ff, 1.0] });
  { box(sPlant, 0, -1, 0, 200, 2, 200, '#2a2a30'); for (let i = 0; i < 4; i++) box(sPlant, -60 + i * 40, 30, -80, 6, 60, 6, '#3a4250'); box(sPlant, 0, 62, -80, 180, 4, 8, '#3a4250'); }
  const roll1 = tank(sPlant, -7, 22, 0, 6, 30, '#6a7280'), roll2 = tank(sPlant, 7, 22, 0, 6, 30, '#6a7280'); roll1.rotation.x = roll2.rotation.x = Math.PI / 2;
  [roll1, roll2].forEach(r => { for (let k = 0; k < 8; k++) { const t = box(r, 0, -12 + k * 3.4, 6, 1.2, 1.2, 1.2, '#4a5260'); t.position.set(Math.cos(k) * 6, -12 + k * 3.4, Math.sin(k) * 6); } });
  const crushIn = particles(sPlant, 40, '#a24a2c', 4);
  const crushOut = particles(sPlant, 260, '#b4583a', 1.1);
  const water = particles(sPlant, 160, '#9ad8ff', 0.5);
  const drum = grp(sPlant, 0, 18, -20); { const d = tank(drum, 0, 0, 0, 12, 40, '#4a5a7a'); d.rotation.z = Math.PI / 2; for (let k = 0; k < 10; k++) { const r = box(drum, -20 + k * 4.4, 0, 0, 1, 25, 25, '#5a6a8a'); } }
  const pellets = new T3.InstancedMesh(SPH, mat('#5a3a34'), 220); pellets.frustumCulled = false; sPlant.add(pellets); opt(pellets); opt(drum);
  const pd = new T3.Object3D();

  // ---------- 8) EUCALIPTO + FORNOS DE CARVÃO ----------
  const sForest = newSet('forest', { bg: gradTex(['#4a8ad8', '#b8dcf0', '#f8ecd0']), fog: [0xe0e8e0, 100, 600], hemi: [0xffffff, 0x3a5a2a, 1.3], sun: [0xfff0d0, 1.4], rim: [0xffffff, 0.3] });
  { const R = rng(53); for (let x = -16; x < 16; x++) for (let z = -24; z < 8; z++) box(sForest, x * 10, -1, z * 10, 10, 2, 10, R() < .5 ? '#7a9a4a' : '#6a8a40');
    for (let i = 0; i < 70; i++) { const x = -120 + (i % 10) * 14, z = -60 - Math.floor(i / 10) * 18; const g = grp(sForest, x + (R() - .5) * 4, 0, z); box(g, 0, 18, 0, 1.6, 36, 1.6, '#d8c8b0'); box(g, 0, 38, 0, 7, 10, 7, '#5a8a5a'); box(g, 0, 44, 0, 4, 6, 4, '#4a7a4a'); } }
  const kilns = []; for (let i = 0; i < 5; i++) { const k = new T3.Mesh(new T3.SphereGeometry(9, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat('#a85a3a')); k.position.set(-40 + i * 22, 0, 10); sForest.add(k); box(sForest, -40 + i * 22, 4, 18.5, 4, 6, 1, '#ff7a1a', true); kilns.push(k); }
  const smokeK = particles(sForest, 180, '#c8c4cc', 2.4);
  const charcoal = particles(sForest, 60, '#1a1a1e', 2.2);

  // ---------- 9) ALTO-FORNO ----------
  const sFurn = newSet('furnace', { bg: gradTex(['#0a0612', '#2a1430', '#7a3020']), fog: [0x2a1430, 100, 600], hemi: [0xffa070, 0x140810, 1.0], sun: [0xffb080, 1.0], rim: [0xff5a1a, 1.5] });
  const tower = grp(sFurn, 0, 0, -40);
  { box(sFurn, 0, -1, -20, 300, 2, 300, '#24181c');
    for (let i = 0; i < 16; i++) { const r = i < 4 ? 16 + i * 2 : i < 10 ? 24 : 24 - (i - 10) * 2.2; tank(tower, 0, 6 + i * 10, 0, r, 10.2, i % 2 ? '#3a2a30' : '#4a3438'); }
    tank(tower, 0, 172, 0, 8, 14, '#5a4048'); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; const p = box(tower, Math.cos(a) * 30, 150, Math.sin(a) * 30, 3, 50, 3, '#5a4048'); p.rotation.z = Math.cos(a) * 0.5; p.rotation.x = -Math.sin(a) * 0.5; }
    [-70, 70].forEach(x => { tank(sFurn, x, 50, -60, 14, 100, '#5a4a50'); tank(sFurn, x, 104, -60, 8, 8, '#6a5a60'); });
    const belt = box(sFurn, -60, 95, -40, 140, 4, 8, '#3a3a44'); belt.rotation.z = -0.65; }
  const tuyGlow = []; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; tuyGlow.push(box(tower, Math.cos(a) * 26, 18, Math.sin(a) * 26, 3, 3, 3, '#ffb040', true)); }
  const towerLight = new T3.PointLight(0xff7a2a, 3, 140); towerLight.position.set(0, 20, 10); sFurn.add(towerLight);
  const feed = particles(sFurn, 150, '#ffffff', 3); { const cc = new T3.Color(); const cols = ['#a24a2c', '#2a2a30', '#f0f0e8']; for (let i = 0; i < 150; i++) { cc.set(cols[i % 3]); feed.setColorAt(i, cc); } feed.material = new T3.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }); }
  const airP = particles(sFurn, 160, '#ffd27a', 0.9);
  const furnLabel = opt(panel(sFurn, 60, 12, (x, w, h, st) => { rr(x, 8, 8, w - 16, h - 16, 50); x.fillStyle = 'rgba(10,6,14,0.85)'; x.fill(); x.lineWidth = 8; x.strokeStyle = st.c || '#ff7a1a'; x.stroke(); txt(x, st.t || '', w / 2, h / 2, 110, st.c || '#ffffff'); }));

  // ---------- 10) DENTRO DO FORNO / METAL LÍQUIDO ----------
  const sMelt = newSet('melt', { bg: gradTex(['#1a0400', '#5a1400', '#ff6a00']), fog: [0x5a1400, 40, 260], hemi: [0xffa040, 0x3a0800, 1.3], sun: [0xffc060, 1.2], rim: [0xff4000, 1.5] });
  { [-40, 40].forEach(x => box(sMelt, x, 30, -20, 8, 80, 120, '#2a0c06')); box(sMelt, 0, -4, -20, 90, 4, 120, '#2a0c06'); }
  const meltBlocks = particles(sMelt, 160, '#ffffff', 4); { const cc = new T3.Color('#a24a2c'); for (let i = 0; i < 160; i++) meltBlocks.setColorAt(i, cc); meltBlocks.material = new T3.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }); }
  const pool = box(sMelt, 0, 2, -20, 72, 4, 100, '#ff8a1a', true);
  const slagFoam = particles(sMelt, 300, '#c8b890', 2.2);
  const tempPanel = opt(panel(sMelt, 46, 16, (x, w, h, st) => { winBg(x, w, h, '#ffd23c', 'rgba(30,6,0,0.88)'); txt(x, 'TEMPERATURA', w / 2, 90, 60, '#ffd8a0'); txt(x, `${st.v || 0} °C`, w / 2, h * 0.62, 170, '#ffd23c'); }));
  const glowMelt = new T3.PointLight(0xff7a1a, 4, 160); glowMelt.position.set(0, 30, 10); sMelt.add(glowMelt);

  // ---------- 11) CORRIDA DE GUSA ----------
  const sTap = newSet('tap', { bg: gradTex(['#08040a', '#1a0a0a']), fog: [0x1a0a0a, 60, 380], hemi: [0xff9a50, 0x0a0404, 0.8], sun: [0xff8a40, 0.6], rim: [0xff5a1a, 1.2] });
  { box(sTap, 0, -1, 0, 260, 2, 260, '#1e1416'); const base = grp(sTap, 0, 0, -60); tank(base, 0, 25, 0, 30, 50, '#3a2a30'); box(base, 0, 10, 30, 8, 8, 6, '#2a1a1e');
    for (let k = 0; k < 10; k++) box(sTap, 0, 0.6, -24 + k * 14, 10, 1.6, 14, '#3a2420'); }
  const river = grp(sTap); const riverSegs = []; for (let k = 0; k < 14; k++) riverSegs.push(box(river, 0, 1.6, -26 + k * 10, 6, 1, 10, '#ffa020', true));
  const tapSparks = particles(sTap, 240, '#ffe08a', 0.5);
  const tapLight = new T3.PointLight(0xff8a2a, 5, 160); tapLight.position.set(0, 14, 20); sTap.add(tapLight);
  const gusaLabel = opt(panel(sTap, 50, 12, (x, w, h) => { rr(x, 8, 8, w - 16, h - 16, 50); x.fillStyle = 'rgba(14,6,4,0.85)'; x.fill(); x.lineWidth = 8; x.strokeStyle = '#ffa020'; x.stroke(); txt(x, 'FERRO-GUSA', w / 2, h / 2, 130, '#ffc060'); }));

  // ---------- 12) CONVERSOR E AÇO ----------
  const sSteel = newSet('steel', { bg: gradTex(['#060a14', '#14203a', '#2a3a5a']), fog: [0x14203a, 80, 420], hemi: [0xc0d0ff, 0x0a0a14, 1.0], sun: [0xffffff, 0.9], rim: [0xff8a2a, 1.2] });
  { box(sSteel, 0, -1, 0, 240, 2, 240, '#1a1e28'); [-40, 40].forEach(x => box(sSteel, x, 30, 0, 6, 60, 6, '#3a4250')); }
  const conv = grp(sSteel, 0, 30, 0); { const c1 = new T3.Mesh(new T3.CylinderGeometry(16, 12, 30, 20), mat('#4a4e5a')); conv.add(c1); const c2 = new T3.Mesh(new T3.CylinderGeometry(9, 16, 12, 20), mat('#4a4e5a')); c2.position.y = 21; conv.add(c2); box(conv, 0, 27.5, 0, 14, 1, 14, '#ff9a2a', true); [-17, 17].forEach(x => box(conv, x, 0, 0, 4, 6, 6, '#2a2e38')); }
  const lance = box(sSteel, 0, 80, 0, 2, 50, 2, '#9aa0b0');
  const ingLight = new T3.PointLight(0xffd0a0, 0, 80); ingLight.position.set(0, 30, 50); sSteel.add(ingLight);
  const ingot = opt(grp(sSteel)); const ingA = grp(ingot), ingB = grp(ingot);
  box(ingA, -6, 0, 0, 12, 6, 8, '#5a5458'); box(ingB, 6, 0, 0, 12, 6, 8, '#5a5458'); box(ingA, -6, 3.1, 0, 11, 0.4, 7, '#6a6468'); box(ingB, 6, 3.1, 0, 11, 0.4, 7, '#6a6468');
  ingA.children.forEach(c => c.position.x += 6); ingB.children.forEach(c => c.position.x -= 6);
  const convSparks = particles(sSteel, 300, '#fff0a0', 0.6);
  const acoPanel = opt(panel(sSteel, 50, 26, (x, w, h, st) => { winBg(x, w, h, '#9ad0ff', 'rgba(8,14,28,0.9)'); x.font = '700 300px Oswald'; x.textAlign = 'center'; x.textBaseline = 'middle'; const g = x.createLinearGradient(0, h * .2, 0, h * .8); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#8aa8c8'); x.fillStyle = g; x.fillText('AÇO', w / 2, h * 0.46); txt(x, 'MAIS FORTE · MAIS FLEXÍVEL', w / 2, h * 0.82, 60, '#9ad0ff'); }));

  // ---------- 13) LAMINAÇÃO E PRODUTOS ----------
  const sMill = newSet('mill', { bg: gradTex(['#0e1220', '#2a3248', '#3a4a68']), fog: [0x2a3248, 80, 420], hemi: [0xd0e0ff, 0x1a1a24, 1.1], sun: [0xffffff, 1.1], rim: [0xff8a2a, 1.0] });
  { box(sMill, 0, -1, 0, 260, 2, 260, '#24262e'); for (let k = 0; k < 30; k++) { const r = tank(sMill, 0, 4, -120 + k * 8, 3, 30, '#5a6070'); r.rotation.z = Math.PI / 2; } }
  const stands = []; for (let k = 0; k < 4; k++) { const g = grp(sMill, 0, 0, -60 + k * 40); box(g, -18, 16, 0, 4, 32, 10, '#3a4250'); box(g, 18, 16, 0, 4, 32, 10, '#3a4250'); box(g, 0, 32, 0, 40, 4, 10, '#3a4250'); const a = tank(g, 0, 14, 0, 4, 32, '#8a90a0'); a.rotation.z = Math.PI / 2; const b = tank(g, 0, 5 - k * 0.6, 0, 4, 32, '#8a90a0'); b.rotation.z = Math.PI / 2; stands.push({ a, b }); }
  const slab = box(sMill, 0, 9, 0, 22, 4, 30, '#ff8a2a', true);
  const products = opt(grp(sMill, 0, 0, 60));
  { const coil = new T3.Mesh(new T3.TorusGeometry(9, 5, 12, 24), mat('#9aa4b8')); coil.position.set(-36, 14, 0); products.add(coil);
    for (let k = 0; k < 6; k++) box(products, -10 + k * 1.6, 2 + k * 0.1, 0, 1.2, 1.2, 40, '#7a808e');
    const wire = new T3.Mesh(new T3.TorusGeometry(7, 1.2, 8, 30), mat('#b0b8c8')); wire.position.set(16, 8, 0); wire.rotation.x = Math.PI / 2; products.add(wire);
    box(products, 38, 2, 0, 2, 3, 50, '#6a707e'); box(products, 46, 2, 0, 2, 3, 50, '#6a707e'); for (let k = 0; k < 6; k++) box(products, 42, 0.5, -22 + k * 9, 14, 1, 2.4, '#6a4a30'); }
  const prodLabel = opt(panel(sMill, 70, 9, (x, w, h, st) => { txt(x, st.t || '', w / 2, h / 2, 120, '#ffd23c'); }));

  // ---------- 14) PÔR DO SOL NA MONTANHA (final) ----------
  const sSunset = newSet('sunset', { bg: gradTex(['#2a2a6a', '#c86a6a', '#ffb060']), fog: [0xe89070, 100, 600], hemi: [0xffc090, 0x5a2a2a, 1.2], sun: [0xffa060, 1.4], rim: [0xff6a3a, 0.8] });
  { for (let i = 0; i < 10; i++) box(sSunset, 0, i * 6 - 30, 0, 200 - i * 16, 6, 120 - i * 10, i % 2 ? '#a0442a' : '#8a3a24');
    const sunM = new T3.Mesh(new T3.SphereGeometry(40, 24, 16), bmat('#ffd8a0')); sunM.position.set(-80, 60, -500); sSunset.add(sunM);
    const R = rng(61); for (let i = 0; i < 8; i++) { const m = grp(sSunset, (R() - .5) * 600, 0, -300 - R() * 200); for (let k = 0; k < 6; k++) box(m, 0, k * 14, 0, 160 - k * 26, 14, 80, '#5a2a3a'); } }
  const avSun = makeAvatar(); sSunset.add(avSun); const rockSun = rock(sSunset, 0.32, 13);

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
  function faceCam(m) { m.quaternion.copy(cam.quaternion); }
  const fx = { flash: 0, shake: 0, tint: null, tintA: 0, black: 0, glitch: 0 };
  const hits = (t, list, w) => list.reduce((s, h) => { const k = (t - h) / w; return k >= 0 && k < 1 ? Math.max(s, 1 - k) : s; }, 0);
  function wave(av, g, amt) { heroPose(av, g, { armR: -0.2, armRz: 2.5 + Math.sin(g * 9) * 0.35 * amt, headY: Math.sin(g * 1.3) * 0.2, headZ: Math.sin(g * 2) * 0.05 }); }
  const blinkSpark = (im, cx, cy, cz, lt, spread, n0) => im.userData.place((i, d) => { const R = rng(i + (n0 || 0)); const k = ((lt * (0.8 + R()) + R()) % 1); d.position.set(cx + (R() - .5) * spread * k * 2, cy + R() * spread * k - k * k * spread * 0.6, cz + (R() - .5) * spread * k * 2); d.rotation.set(k * 6, i, 0); d.scale.setScalar(0.35 + (1 - k) * 0.4); });

  // ---------- planos ----------
  const S = {
    hook(lt, T, g) { useSet('forge'); const m = eIO(prog(lt, T - 0.9, T - 0.1)); bar.visible = m < 0.98; bar.scale.setScalar(Math.max(0.01, 1 - m)); hookRock.visible = m > 0.02; hookRock.scale.setScalar(1.2 * m); hookRock.rotation.y = g * 0.8;
      forgeLight.intensity = 4 + Math.sin(g * 13) * 0.6; blinkSpark(forgeSparks, 4, 12, 0, lt * 1.4, 18, 1);
      fx.shake = hits(lt, [0.3, 0.9, 1.5], 0.25) * 0.7; fx.flash = hits(lt, [T - 0.5], 0.3) * 0.4;
      camAt(L3([-6, 24, 44], [4, 20, 34], eOut(lt / T)), [0, 13, 0], 45); },
    intro(lt, T, g) { useSet('studio'); avS.position.set(0, 0, 0); avS.rotation.set(0, 0.2, 0); wave(avS, g, 1); tagS.position.set(0, 29, 0); faceCam(tagS); tagS.userData.set({});
      tagS.scale.setScalar(eBack(prog(lt, 0.15, 0.5)) || 0.001);
      sStudio.children.forEach(c => { if (c.userData.ph !== undefined) { c.position.y = c.userData.y0 + Math.sin(g + c.userData.ph) * 3; c.rotation.set(g * 0.5 + c.userData.ph, g * 0.3, 0); } });
      camAt(L3([10, 18, 52], [4, 16, 36], eOut(lt / T)), [0, 16, 0], 48); },
    intro_rock(lt, T, g) { useSet('studio'); avS.position.set(0, 0, 0); avS.rotation.set(0, 0.2, 0); heroPose(avS, g, { armR: -2.2, armL: -0.4, headX: -0.15 }); tagS.position.set(0, 29, 0); faceCam(tagS);
      rockS.visible = true; avS.updateMatrixWorld(true); const P = avS.userData.P; const wp = new T3.Vector3(); P.armR.localToWorld(wp.set(0, -7.5, 1)); rockS.position.copy(wp); rockS.rotation.y = g; rockS.scale.setScalar(0.28 * (eBack(prog(lt, 0, 0.4)) || 0.001));
      camAt(L3([12, 20, 40], [8, 22, 28], eOut(lt / T)), [0, 20, 0], 48); },
    city(lt, T, g) { useSet('city'); const u = eIO(lt / T); car.position.set(10, 0, lerp(30, -10, u)); cityGlow(0);
      camAt(L3([-30, 30, 90], [20, 50, 30], u), L3([0, 10, 0], [0, 30, -100], u), 55); },
    city_iron(lt, T, g) { useSet('city'); car.position.set(10, 0, -10); const k = eOut(prog(lt, 0.1, 0.6)) * (0.55 + 0.15 * Math.sin(g * 6));
      cityGlow(k);
      camAt(orbit([0, 0, -20], 120, 0.3 + lt * 0.15, 70), [0, 20, -40], 55); },
    minas(lt, T, g) { useSet('minas'); camAt(L3([0, 12, 120], [0, 30, 60], eIO(lt / T)), [0, 50, -200], 55); },
    minas_sign(lt, T, g) { useSet('minas'); mgSign.visible = true; mgSign.position.set(0, 90, -60); mgSign.scale.setScalar(0.72 * (eBack(prog(lt, 0, 0.4)) || 0.001)); mgSign.userData.set({});
      fx.shake = hits(lt, [0.3], 0.3) * 0.6; camAt(L3([0, 40, 80], [0, 46, 60], lt / T), [0, 78, -60], 55); },
    ore(lt, T, g) { useSet('lab'); bigRock.visible = true; bigRock.position.set(0, 0, 0); bigRock.rotation.set(0.3, g * 0.6, 0);
      const showA = prog(lt, T * 0.45, T * 0.65);
      molFe.forEach((m, i) => { m.visible = showA > 0; const a = i / 6 * 6.28 + g * 0.8; m.position.set(Math.cos(a) * 24, Math.sin(g + i) * 4 + 4, Math.sin(a) * 24); m.scale.setScalar(3.2 * showA); });
      molO.forEach((m, i) => { m.visible = showA > 0; const f = molFe[i % 6].position; m.position.set(f.x + Math.cos(i * 2.1) * 4.6, f.y + Math.sin(i * 1.7) * 4.6, f.z + Math.sin(i * 2.1) * 4.6); m.scale.setScalar(2.2 * showA); });
      if (showA > 0) { labelPanel.visible = true; labelPanel.position.set(0, -26, 14); faceCam(labelPanel); labelPanel.userData.set({ t: 'FERRO + OXIGÊNIO', c: '#ff7a5a' }); labelPanel.scale.setScalar(1.1 * showA); }
      camAt(orbit([0, 0, 0], lerp(100, 84, eOut(lt / T)), Math.sin(lt * .5) * .4, 16), [0, 0, 0], 50); },
    ore_atoms(lt, T, g) { S.ore(lt + 6, T + 6, g); camAt(orbit([0, 0, 0], 70, 1.2 + lt * 0.25, 12), [0, 0, 0], 50); },
    washer(lt, T, g) { S.crusher(lt + 3, T + 3, g); water.userData.place((i, d) => { const R = rng(i + 600); const kk = ((g * 1.4 + R()) % 1); d.position.set(-30 + kk * 30, 40 - kk * kk * 30, (R() - .5) * 26); }); camAt(L3([-50, 40, 40], [-36, 34, 30], lt / T), [-10, 24, 0], 50); },
    kilns(lt, T, g) { S.forest(lt + 4, T + 4, g); camAt(L3([-20, 14, 50], [10, 12, 44], eIO(lt / T)), [-10, 6, 10], 50); },
    brittle(lt, T, g) { useSet('steel'); conv.rotation.z = 1; lance.position.y = 90; ingot.visible = true; const k = eOut(prog(lt, T * 0.55, T * 0.7));
      ingA.position.set(-6 - k * 5, 10 + k * 2, 30); ingA.rotation.z = k * 0.4; ingB.position.set(6 + k * 5, 10 + k * 2, 30); ingB.rotation.z = -k * 0.4;
      fx.shake = hits(lt, [T * 0.55], 0.3) * 1.2; fx.flash = hits(lt, [T * 0.55], 0.15) * 0.3;
      camAt(L3([0, 24, 66], [6, 20, 54], lt / T), [0, 10, 30], 45); ingLight.intensity = 3; },
    blast(lt, T, g) { useSet('pit'); truck.visible = false; avPit.visible = false; const bt = mk('explodida') - (g - lt);
      const k = prog(lt, bt, bt + 2.2); blastBits.userData.place((i, d) => { if (k <= 0) return false; const R = rng(i + 100); const a = R() * 6.28, up = 40 + R() * 70; const tt = k * 2.2;
        d.position.set(Math.cos(a) * R() * 60 * k + (R() - .5) * 30, -16 + up * tt - 30 * tt * tt, -60 + Math.sin(a) * R() * 60 * k); d.rotation.set(tt * 5, tt * 3, 0); });
      dustP.userData.place((i, d) => { if (k <= 0) return false; const R = rng(i + 200); const kk = Math.min(1, k * 1.5); d.position.set((R() - .5) * 90 * kk, -10 + R() * 60 * kk, -60 + (R() - .5) * 60 * kk); d.scale.setScalar(4 + kk * 8); });
      fx.flash = hits(lt, [bt], 0.3) * 0.8; fx.shake = hits(lt, [bt], 1.2) * 2.4;
      camAt(L3([40, 50, 120], [30, 60, 110], lt / T), [0, -10, -60], 55); },
    truck(lt, T, g) { useSet('pit'); truck.visible = true; avPit.visible = true; const u = eIO(lt / T); truck.position.set(lerp(-60, 30, u), 0, 40); truck.rotation.set(0, Math.PI / 2, Math.sin(g * 8) * 0.01);
      avPit.position.set(10, 0, 70); avPit.rotation.set(0, -0.4, 0); heroPose(avPit, g, { armR: -1.4, armRz: -0.9, headY: -0.6 });
      dustP.userData.place((i, d) => { const R = rng(i + 300); const kk = ((g * 0.6 + R()) % 1); d.position.set(truck.position.x - 20 - kk * 30, 2 + kk * 14, 40 + (R() - .5) * 20); d.scale.setScalar(2 + kk * 6); });
      camAt(L3([40, 6, 120], [20, 10, 110], u), [truck.position.x * 0.6, 14, 40], 55); },
    crusher(lt, T, g) { useSet('plant'); drum.visible = false; roll1.rotation.y = g * 3; roll2.rotation.y = -g * 3;
      crushIn.userData.place((i, d) => { const R = rng(i + 400); const kk = ((g * 0.7 + R()) % 1); d.position.set((R() - .5) * 10, 60 - kk * 36, (R() - .5) * 20); d.rotation.set(kk * 4, R() * 3, 0); d.scale.setScalar(4 * (1 - kk * 0.5)); });
      crushOut.userData.place((i, d) => { const R = rng(i + 500); const kk = ((g * 0.9 + R()) % 1); d.position.set((R() - .5) * 8 + kk * 4, 16 - kk * 16, (R() - .5) * 26); d.rotation.set(kk * 6, i, 0); });
      const wash = prog(lt, T * 0.55, T * 0.65); if (wash > 0) water.userData.place((i, d) => { const R = rng(i + 600); const kk = ((g * 1.4 + R()) % 1); d.position.set(-30 + kk * 30, 40 - kk * kk * 30, (R() - .5) * 26); });
      camAt(orbit([0, 20, 0], 70, 0.6 + lt * 0.15, 40), [0, 20, 0], 52); },
    pellets(lt, T, g) { useSet('plant'); drum.visible = true; pellets.visible = true; drum.rotation.x = g * 2;
      for (let i = 0; i < 220; i++) { const R = rng(i + 700); const kk = ((g * 0.35 + R()) % 1); pd.position.set(-20 + kk * 60, 18 - kk * 18 + Math.abs(Math.sin(kk * 20 + i)) * 2, -20 + (R() - .5) * 14); pd.scale.setScalar(1.3 + R() * 0.5); pd.updateMatrix(); pellets.setMatrixAt(i, pd.matrix); }
      pellets.instanceMatrix.needsUpdate = true;
      camAt(L3([50, 26, 50], [30, 18, 36], eOut(lt / T)), [0, 12, -20], 52); },
    forest(lt, T, g) { useSet('forest'); smokeK.userData.place((i, d) => { const R = rng(i + 800); const kk = ((g * 0.3 + R()) % 1); const k0 = kilns[i % 5].position; d.position.set(k0.x + Math.sin(kk * 5 + i) * 3, 9 + kk * 50, k0.z + (R() - .5) * 4); d.scale.setScalar(2 + kk * 6); });
      if (lt > T * 0.5) charcoal.userData.place((i, d) => { const R = rng(i + 900); d.position.set(20 + (i % 10) * 4, 2 + Math.floor(i / 10) * 2.6, 0 + (R() - .5) * 4); d.rotation.set(R(), R(), 0); d.scale.setScalar(2.2 * eBack(clamp((lt - T * 0.5) * 3 - i * 0.01))); });
      camAt(L3([-60, 50, 110], [20, 30, 90], eIO(lt / T)), [0, 20, -20], 55); },
    tower(lt, T, g) { useSet('furnace'); const u = eIO(lt / T); tuyGlow.forEach(t => t.scale.setScalar(3 * (0.8 + 0.2 * Math.sin(g * 8)))); towerLight.intensity = 3;
      furnLabel.visible = lt > 0.6; if (furnLabel.visible) { furnLabel.position.set(0, 200, -10); faceCam(furnLabel); furnLabel.userData.set({ t: 'ALTO-FORNO · +30 m', c: '#ffb040' }); furnLabel.scale.setScalar(eBack(prog(lt, 0.6, 1)) || 0.001); }
      camAt(L3([40, 10, 110], [30, 150, 100], u), L3([0, 30, -40], [0, 170, -40], u), 55); },
    charge(lt, T, g) { useSet('furnace'); const cols = ['#a24a2c', '#1a1a1e', '#f0f0e8'];
      feed.userData.place((i, d) => { const R = rng(i + 1000); const kk = ((g * 0.5 + R()) % 1); d.position.set(-110 + kk * 108, 50 + kk * 125, -40 + (R() - .5) * 6); d.rotation.set(kk * 5, i, 0); });
      furnLabel.visible = true; furnLabel.position.set(-10, 196, 20); faceCam(furnLabel); furnLabel.userData.set({ t: 'MINÉRIO · CARVÃO · CALCÁRIO', c: '#ffd27a' }); furnLabel.scale.setScalar(0.62);
      camAt(L3([-90, 200, 120], [-60, 210, 90], lt / T), [0, 170, -40], 55); },
    tuyere(lt, T, g) { useSet('furnace'); tuyGlow.forEach(t => t.scale.setScalar(3 * (1 + 0.3 * Math.sin(g * 12)))); towerLight.intensity = 5;
      airP.userData.place((i, d) => { const R = rng(i + 1100); const a = (i % 8) / 8 * Math.PI * 2; const kk = ((g * 1.2 + R()) % 1); const r = 60 - kk * 32; d.position.set(Math.cos(a) * r, 18 + (R() - .5) * 3, -40 + Math.sin(a) * r); });
      furnLabel.visible = true; furnLabel.position.set(0, 50, 20); faceCam(furnLabel); furnLabel.userData.set({ t: 'AR QUENTE · +1.000 °C', c: '#ffb040' }); furnLabel.scale.setScalar(0.7);
      camAt(orbit([0, 0, -40], 90, 0.4 + lt * 0.2, 30), [0, 22, -40], 55); },
    inside(lt, T, g) { useSet('melt'); const k = eIO(prog(lt, 0.2, T - 0.3)); pool.scale.y = 4; pool.position.y = lerp(-2, 6, k);
      meltBlocks.userData.place((i, d) => { const R = rng(i + 1200); const mm = clamp(k * 1.6 - R() * 0.6); d.position.set((R() - .5) * 60, 30 + R() * 30 - mm * 26 - (g % 1) * 0, -20 + (R() - .5) * 80); d.scale.set(4, 4 * (1 - mm * 0.9), 4); d.rotation.set(0, R() * 3, 0); });
      const cc = new T3.Color(); for (let i = 0; i < 160; i++) { cc.set('#a24a2c').lerp(new T3.Color('#ffb040'), clamp(k * 1.4)); meltBlocks.setColorAt(i, cc); } meltBlocks.instanceColor.needsUpdate = true;
      tempPanel.visible = true; tempPanel.position.set(0, 66, -10); faceCam(tempPanel); tempPanel.userData.set({ v: Math.round(lerp(20, 1500, eOut(prog(lt, 0, T * 0.6)))) >= 1495 ? 1500 : Math.round(lerp(20, 1500, eOut(prog(lt, 0, T * 0.6))) / 10) * 10 });
      glowMelt.intensity = 3 + k * 4; fx.shake = 0.2;
      camAt(L3([0, 70, 80], [0, 54, 60], lt / T), [0, 30, -20], 55); },
    atoms(lt, T, g) { useSet('lab'); const k = eIO(prog(lt, 0.4, T - 0.6));
      molFe.forEach((m, i) => { m.visible = true; m.scale.setScalar(3.2); const a = i / 6 * 6.28; m.position.set(Math.cos(a) * 12, Math.sin(a) * 12 + 6, 0); });
      molO.forEach((m, i) => { m.visible = true; m.scale.setScalar(2.2); const f = molFe[i % 6].position; const a = i * 2.1; const home = [f.x + Math.cos(a) * 4.6, f.y + Math.sin(a) * 4.6, 2]; const away = [f.x * 3 + Math.cos(a) * 30, f.y * 2 + 40 + i * 3, -10];
        const p = L3(home, away, k); m.position.set(p[0], p[1], p[2]); });
      molC.forEach((m, i) => { m.visible = true; m.scale.setScalar(2.4); const o = molO[i].position; const start = [(i - 4) * 10, -30, 10]; const p = L3(start, [o.x + 3.6, o.y, o.z], clamp(k * 1.6)); m.position.set(p[0], p[1], p[2]); });
      labelPanel.visible = true; labelPanel.position.set(0, -24, 10); faceCam(labelPanel); labelPanel.userData.set(k > 0.6 ? { t: 'SOBRA: FERRO PURO', c: '#d8dce8' } : { t: 'CARBONO PEGA O OXIGÊNIO', c: '#ff7a5a' }); labelPanel.scale.setScalar(0.8);
      camAt(L3([0, 10, 80], [10, 14, 64], lt / T), [0, 8, 0], 50); },
    slag(lt, T, g) { useSet('melt'); pool.position.y = 6; pool.scale.y = 4;
      slagFoam.userData.place((i, d) => { const R = rng(i + 1300); const k = clamp(lt / T * 2.6 - R() * 0.4); d.position.set((R() - .5) * 66, 10 + Math.sin(g * 3 + i) * 0.6 + (1 - k) * -6, -20 + (R() - .5) * 90); d.scale.setScalar(3.6 * k + 0.01); d.rotation.set(0, R() * 3, 0); });
      tempPanel.visible = false; glowMelt.intensity = 5;
      labelPanel.visible = false;
      camAt(L3([30, 34, 60], [10, 24, 40], eOut(lt / T)), [0, 6, -20], 55); },
    tap(lt, T, g) { useSet('tap'); const flow = eOut(prog(lt, 0.2, 1.6)); riverSegs.forEach((s, k) => { s.visible = k / 14 < flow; s.scale.y = 1 + Math.sin(g * 6 + k) * 0.2; });
      blinkSpark(tapSparks, 0, 4, -20 + flow * 60, lt, 20, 1500); tapLight.intensity = 3 + flow * 3 + Math.sin(g * 11) * 0.5;
      const gs = mk('gusa') - (g - lt); gusaLabel.visible = lt >= gs; if (gusaLabel.visible) { gusaLabel.position.set(0, 36, 10); faceCam(gusaLabel); gusaLabel.userData.set({}); gusaLabel.scale.setScalar(eBack(prog(lt, gs, gs + 0.35)) || 0.001); }
      fx.flash = hits(lt, [0.2], 0.25) * 0.4;
      camAt(L3([40, 30, 110], [24, 22, 80], eIO(lt / T)), [0, 6, 10], 55); },
    converter(lt, T, g) { useSet('steel'); const tilt = lt < T * 0.35 ? lerp(1.0, 0, eIO(lt / (T * 0.35))) : 0; conv.rotation.z = tilt; const ln = eOut(prog(lt, T * 0.4, T * 0.55)); lance.position.y = lerp(90, 62, ln);
      if (ln > 0) convSparks.userData.place((i, d) => { const R = rng(i + 1600); const kk = ((g * 1.5 + R()) % 1); const a = R() * 6.28; d.position.set(Math.cos(a) * kk * 40, 60 + kk * 40 - kk * kk * 70, Math.sin(a) * kk * 40); d.rotation.set(kk * 9, i, 0); });
      fx.shake = ln > 0 ? 0.6 : 0;
      camAt(orbit([0, 30, 0], 90, 0.5 + lt * 0.12, 50), [0, 50, 0], 55); },
    aco(lt, T, g) { useSet('steel'); conv.rotation.z = 0; lance.position.y = 90; acoPanel.visible = true; acoPanel.position.set(0, 52, 30); faceCam(acoPanel); acoPanel.userData.set({}); acoPanel.scale.setScalar(eBack(prog(lt, 0, 0.45)) || 0.001);
      convSparks.userData.place((i, d) => { const R = rng(i + 1700); const kk = ((g * 0.8 + R()) % 1); d.position.set((R() - .5) * 90, 20 + kk * 80, 20 + (R() - .5) * 30); });
      fx.flash = hits(lt, [0.05], 0.3) * 0.6; fx.shake = hits(lt, [0.3], 0.4) * 1;
      camAt(L3([0, 50, 90], [0, 52, 80], lt / T), [0, 52, 30], 50); },
    rolling(lt, T, g) { useSet('mill'); products.visible = false; const u = lt / T; slab.position.set(0, 8, lerp(-110, 50, u)); const thin = clamp((slab.position.z + 60) / 120); slab.scale.set(22, lerp(6, 1.2, thin), lerp(30, 70, thin));
      stands.forEach(s => { s.a.rotation.x = g * 4; s.b.rotation.x = -g * 4; });
      camAt(L3([50, 40, -80], [40, 30, 40], u), [0, 8, slab.position.z], 55); },
    products(lt, T, g) { useSet('mill'); products.visible = true; slab.position.set(0, 8, 300);
      const names = ['CHAPA', 'BARRA', 'FIO', 'TRILHO']; const idx = Math.min(3, Math.floor(lt / T * 4)); prodLabel.visible = true; prodLabel.position.set(-36 + idx * 26, 34, 60); faceCam(prodLabel); prodLabel.userData.set({ t: names[idx] }); prodLabel.scale.setScalar(0.5);
      camAt(L3([-40, 40, 140], [40, 40, 140], eIO(lt / T)), [lerp(-36, 42, eIO(lt / T)), 8, 60], 50); },
    m_car(lt, T, g) { useSet('city'); car.position.set(10, 0, 10); cityGlow(0); camAt(orbit([10, 0, 10], 36, 0.6 + lt * 0.6, 12), [10, 5, 10], 50); },
    m_fridge(lt, T, g) { useSet('city'); cityGlow(0); camAt(orbit([-14, 0, 6], 34, -0.6 + lt * 0.5, 14), [-14, 10, 6], 50); },
    m_house(lt, T, g) { useSet('city'); cityGlow(0); camAt(L3([70, 14, 50], [56, 18, 40], eOut(lt / T)), [40, 12, 0], 50); },
    final(lt, T, g) { useSet('sunset'); avSun.position.set(0, 30, 0); avSun.rotation.set(0, Math.PI * 0.9, 0); heroPose(avSun, g, { armR: -1.6, armL: 0.1, headX: 0.2 }); avSun.updateMatrixWorld(true); const P = avSun.userData.P; const wp = new T3.Vector3(); P.armR.localToWorld(wp.set(0, -7.4, 1.2)); rockSun.position.copy(wp); rockSun.rotation.y = g * 0.5;
      camAt(L3([20, 46, 60], [8, 44, 36], eIO(lt / T)), [0, 40, 0], 50); },
    cta(lt, T, g) { useSet('studio'); avS.position.set(0, 0, 0); avS.rotation.set(0, 0, 0); wave(avS, g, 1.2); tagS.position.set(0, 29, 0); faceCam(tagS);
      fx.tint = '#000010'; fx.tintA = 0.25 * prog(lt, 0, 1);
      camAt(L3([0, 18, 40], [0, 26, 62], eIO(lt / T)), [0, 26, 0], 50); },
  };

  const flashEl = document.getElementById('mundo-flash'), tintEl = document.getElementById('mundo-tint'), glEl = document.getElementById('mundo-glitch');
  function frame(t) {
    let sh = SHOTS[0]; for (const s of SHOTS) if (t >= s.t0) sh = s;
    fx.flash = 0; fx.shake = 0; fx.tint = null; fx.tintA = 0; fx.black = 0; fx.glitch = 0;
    PARTS.forEach(p => p.visible = false); OPT.forEach(o => o.visible = false); ingLight.intensity = 0;
    bar.visible = true; truck.visible = true; avPit.visible = true; drum.visible = true;
    const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    (S[sh.id] || S.intro)(lt, T, t);
    [tagS, labelPanel, furnLabel, tempPanel, gusaLabel, acoPanel, prodLabel].forEach(o => { if (o.visible) o.quaternion.copy(cam.quaternion); });
    fx.flash = Math.max(fx.flash, (1 - prog(lt, 0, 0.12)) * 0.18);
    if (fx.shake) { const k = fx.shake; cam.position.x += Math.sin(t * 87) * k; cam.position.y += Math.cos(t * 71) * k; }
    renderer.render(scene, cam);
    flashEl.style.opacity = fx.flash.toFixed(3);
    tintEl.style.background = fx.tint || 'transparent'; tintEl.style.opacity = (fx.tint ? fx.tintA : 0);
    glEl.style.opacity = 0;
  }

  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    [mgSign, tempPanel, gusaLabel, acoPanel, tagS].forEach(p => p.userData.set({}));
    const tl = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0);
    window.__timelines['mundo'] = tl;
  });
})();

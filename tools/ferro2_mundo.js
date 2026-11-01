  // ===================== FERRO 2 — SIDERÚRGICA CONTÍNUA (low-poly) =====================
  const PANELS = [];
  const OPT = []; const opt = (o) => { OPT.push(o); return o; };
  const PM = {}; function pmat(c, sh) { const k = c + '|' + (sh || 4); return PM[k] || (PM[k] = new T3.MeshPhongMaterial({ color: c, flatShading: true, shininess: sh || 4 })); }
  const world = grp(scene);
  const ICO = new T3.IcosahedronGeometry(1, 0), CONE = new T3.ConeGeometry(1, 1, 8), CYL = new T3.CylinderGeometry(1, 1, 1, 14), SPH = new T3.SphereGeometry(1, 14, 10), HEMI = new T3.SphereGeometry(1, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2);
  function cyl(p, x, y, z, r, h, c, glow) { const m = new T3.Mesh(CYL, glow ? bmat(c) : pmat(c)); m.position.set(x, y, z); m.scale.set(r, h, r); p.add(m); return m; }
  function hcyl(p, x, y, z, r, len, c, axis) { const m = cyl(p, x, y, z, r, len, c); if (axis === 'x') m.rotation.z = Math.PI / 2; else m.rotation.x = Math.PI / 2; return m; }
  function beam(a, b, w, c, glow) { const m = new T3.Mesh(BOX, glow ? bmat(c) : pmat(c)); world.add(m); m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.scale.set(w, w, Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])); m.lookAt(b[0], b[1], b[2]); return m; }
  const tmpC = new T3.Color(), ca = new T3.Color(), cb = new T3.Color();
  const HOT = '#ff8a1a', HOT2 = '#ffd04a';

  // ---------- chão ----------
  box(world, 80, -0.5, 0, 2000, 1, 1000, '#86ad62');
  box(world, 170, 0.03, 40, 470, 0.1, 230, '#b6b2aa');            // pátio da usina
  box(world, -190, 0.03, -40, 190, 0.1, 110, '#b0aca4');          // beneficiamento
  box(world, 40, 0.07, 128, 1200, 0.1, 9, '#55565c');              // avenida
  for (let i = 0; i < 60; i++) box(world, -540 + i * 20, 0.13, 128, 7, 0.05, 0.7, '#f4f0d8');
  box(world, -150, 0.07, 30, 380, 0.1, 7, '#6a6a70');              // estrada interna
  { const R = rng(7); for (let i = 0; i < 70; i++) { const x = -600 + R() * 1300, z = -330 + R() * 120; const g = grp(world, x, 0, z); const s = 1.2 + R(); box(g, 0, 3 * s, 0, 1.2 * s, 6 * s, 1.2 * s, '#7a5a3a'); const c = new T3.Mesh(ICO, pmat(R() < .5 ? '#3f8a3a' : '#4f9a42')); c.position.y = 8 * s; c.scale.set(4 * s, 4.5 * s, 4 * s); g.add(c); } }
  // montanhas ao fundo
  { const R = rng(11); for (let i = 0; i < 18; i++) { const m = new T3.Mesh(CONE, pmat(i % 2 ? '#6a8a5a' : '#7a9a62')); m.position.set(-700 + i * 85, 0, -480 - R() * 80); m.scale.set(90 + R() * 60, 90 + R() * 90, 70); world.add(m); } }

  // ---------- trabalhadores com uniforme de cor sorteada ----------
  const UNI = ['#ff7a1a', '#1a6ad8', '#2aa84a', '#ffc21a', '#d83a3a', '#1a9ab0', '#8a4ad8', '#3a4a6a'];
  const HAT = ['#ffffff', '#ffd23c', '#ff7a1a', '#1a6ad8', '#2aa84a'];
  const SKIN = ['#f0c49a', '#c88a5e', '#8a5a3a', '#e8b48a', '#a8704a'];
  const WK = [];
  function worker(p, x, y, z, ry, mode, seed, o = {}) {
    const R = rng(seed * 31 + 7); const silver = !!o.silver;
    const u = silver ? '#c4c8d0' : (o.color || UNI[Math.floor(R() * UNI.length)]);
    const h = makeHero({ shirt: u, plate: silver ? '#dfe3ea' : u, belt: silver ? '#9aa0aa' : '#24242a', pants: silver ? '#b4b8c0' : (R() < 0.5 ? '#2a3550' : u), boot: '#2a2018', skin: SKIN[Math.floor(R() * SKIN.length)], hair: '#2a1a10', sword: false });
    const P = h.userData.P; const hc = silver ? '#eef0f4' : HAT[Math.floor(R() * HAT.length)];
    box(P.head, 0, 5.3, 0, 5.4, 1.5, 5.4, hc); box(P.head, 0, 4.7, 1.6, 5.8, 0.4, 3.2, hc);
    if (silver) { box(P.head, 0, 2.9, -0.3, 5.2, 4.4, 4.6, '#c4c8d0'); box(P.head, 0, 2.6, 2.3, 4.2, 2.4, 0.3, '#2a3a5a'); box(P.head, -0.8, 3.1, 2.46, 1.2, 0.5, 0.05, '#9ad0ff', true); [P.armL, P.armR].forEach(a => box(a, 0, -4.3, 0, 2, 2.9, 2.1, '#8a8e96')); }
    else { box(P.torso, 0, 2.3, 1.78, 6.1, 0.55, 0.1, '#f4ff9a', true); box(P.torso, 0, 4.5, 1.78, 6.1, 0.55, 0.1, '#f4ff9a', true); [-1, 1].forEach(s => box(P.torso, 1.6 * s, 3.4, 1.78, 0.5, 6, 0.1, '#f4ff9a', true)); }
    if (o.tool === 'pole') box(P.armR, 0, -11, 0, 0.45, 12, 0.45, '#2a2a2e');
    if (o.tool === 'rake') { box(P.armR, 0, -11, 0, 0.45, 12, 0.45, '#5a3a24'); box(P.armR, 0, -17, 0, 3.4, 0.5, 0.8, '#3a3a3e'); }
    if (o.tool === 'clip') box(P.armL, 0, -5.4, 1.0, 1.6, 2.2, 0.3, '#f4f4f4');
    h.scale.setScalar(o.s || 0.26); h.position.set(x, y, z); h.rotation.y = ry; p.add(h);
    const w = { h, mode, ph: R() * 6, x, y, z, ry, path: o.path || null }; WK.push(w); return w;
  }
  const POSE = {
    idle: (t) => ({ headY: Math.sin(t * 0.6) * 0.4, armL: Math.sin(t * 1.3) * 0.1 }),
    walk: () => ({ walk: 7 }), run: () => ({ walk: 13, lean: 0.2 }),
    pole: (t) => ({ armL: -1.15, armR: -1.05, armLz: 0.35, armRz: -0.15, lean: 0.25 + Math.sin(t * 5) * 0.08, legL: -0.45, legR: 0.3, twist: -0.3 }),
    rake: (t) => ({ armL: -0.8 - Math.sin(t * 2.6) * 0.35, armR: -0.9 - Math.sin(t * 2.6) * 0.35, armLz: 0.4, lean: 0.3, legL: -0.3, legR: 0.25 }),
    point: (t) => ({ armR: -1.6, armRz: -0.1, headY: 0.2 + Math.sin(t) * 0.1 }),
    wave: (t) => ({ armR: -0.2, armRz: 2.5 + Math.sin(t * 9) * 0.45, headY: Math.sin(t) * 0.15 }),
    look: (t) => ({ headX: -0.45, headY: Math.sin(t * 0.7) * 0.3, armL: -0.2 }),
    talk: (t) => ({ armR: -0.6 - Math.sin(t * 3) * 0.3, armRz: -0.3, headY: Math.sin(t * 1.4) * 0.3 }),
    clip: (t) => ({ armL: -1.1, armR: -0.9 + Math.sin(t * 4) * 0.1, armRz: 0.3, headX: 0.35 }),
    shield: (t) => ({ armL: -1.9, armR: -1.9, armLz: 0.5, armRz: -0.5, lean: -0.15, legL: -0.3, legR: 0.3 }),
    carry: (t) => ({ walk: 6, armL: -1.2, armR: -1.2 }),
    drive: () => ({ legL: -1.5, legR: -1.5, armL: -1.1, armR: -1.1, bob: -2.6 }),
  };
  let gT = 0;
  function poseWorkers() { WK.forEach(w => { const t = gT + w.ph; if (w.path) { const [x, z, ry] = w.path(gT, w); w.h.position.x = x; w.h.position.z = z; w.h.rotation.y = ry; } heroPose(w.h, t, (POSE[w.modeNow || w.mode] || POSE.idle)(t)); w.modeNow = null; }); }
  const loop = (x0, z0, x1, z1, sp, off) => (t) => { const u = ((t * sp + off) % 2 + 2) % 2; const k = u < 1 ? u : 2 - u; return [lerp(x0, x1, k), lerp(z0, z1, k), Math.atan2(u < 1 ? x1 - x0 : x0 - x1, u < 1 ? z1 - z0 : z0 - z1)]; };

  // placas de segurança e telas (canvas)
  function sign(p, x, y, z, ry, line1, line2, col) { const m = panel(p, 6, 4.4, (c, w, h) => { c.fillStyle = col || '#ffd23c'; rr(c, 0, 0, w, h, 40); c.fill(); c.lineWidth = 22; c.strokeStyle = '#1a1a1a'; rr(c, 14, 14, w - 28, h - 28, 30); c.stroke(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.moveTo(w / 2, 70); c.lineTo(w / 2 + 120, 290); c.lineTo(w / 2 - 120, 290); c.closePath(); c.fill(); c.fillStyle = col || '#ffd23c'; c.font = '900 150px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', w / 2, 210); txt(c, line1, w / 2, 400, 96, '#1a1a1a', 700, 'Oswald'); if (line2) txt(c, line2, w / 2, 520, 80, '#1a1a1a', 700, 'Oswald'); }); m.position.set(x, y, z); m.rotation.y = ry; PANELS.push(m); return m; }

  // ---------- portão da siderúrgica + apresentador ----------
  const GX = 110, GZ = 96;
  { const g = grp(world, GX, 0, GZ - 14); [-14, 14].forEach(x => { box(g, x, 7, 0, 3.4, 14, 3.4, '#4a4e58'); box(g, x, 14.4, 0, 4, 0.8, 4, '#ff7a1a'); });
    const s = panel(g, 26, 5, (c, w, h) => { c.fillStyle = '#1a2440'; rr(c, 0, 0, w, h, 30); c.fill(); txt(c, 'SIDERÚRGICA', w / 2, h / 2 + 4, 120, '#ffffff', 700, 'Oswald'); c.fillStyle = '#ff7a1a'; c.fillRect(30, h - 26, w - 60, 10); }); s.position.set(0, 17, 0); PANELS.push(s);
    for (let i = 0; i < 9; i++) box(g, -11 + i * 2.75, 4, 0.4, 0.4, 8, 0.4, '#5a5e66'); box(g, 0, 8, 0.4, 24, 0.5, 0.5, '#5a5e66'); box(g, 0, 0.6, 0.4, 24, 0.5, 0.5, '#5a5e66');
    for (let i = 0; i < 16; i++) { box(world, GX - 30 - i * 8, 3, GZ - 14, 0.4, 6, 0.4, '#6a6e76'); box(world, GX + 30 + i * 8, 3, GZ - 14, 0.4, 6, 0.4, '#6a6e76'); } box(world, GX - 90, 5.6, GZ - 14, 120, 0.3, 0.3, '#6a6e76'); box(world, GX + 90, 5.6, GZ - 14, 120, 0.3, 0.3, '#6a6e76');
    sign(world, GX + 22, 4, GZ - 13.6, 0, 'USE EPI', 'capacete obrigatório'); }
  const host = makeBessekai('gamer'); host.scale.setScalar(0.34); host.position.set(GX, 0, GZ + 2); world.add(host);
  const bar = box(host.userData.P.armR, -4, -5.9, 0.6, 10.5, 1.3, 1.3, '#80858d'); bar.material = pmat('#7f848c', 40);
  [-8.6, -6.2, -3.8, -1.4, 0.6].forEach(x => box(host.userData.P.armR, x, -5.9, 0.6, 0.25, 1.36, 1.36, '#6a6e76'));
  const rock = opt(new T3.Mesh(ICO, pmat('#a8482a'))); world.add(rock);
  worker(world, GX - 16, 0, GZ - 6, 0.4, 'talk', 1); worker(world, GX - 19, 0, GZ - 4, -0.9, 'idle', 2); worker(world, GX + 18, 0, GZ - 8, -0.3, 'walk', 3, { path: loop(GX + 18, GZ - 8, GX + 18, GZ - 40, 0.12, 0) });

  // ---------- MINA ----------
  const MX = -330, MZ = -70;
  { const cols = ['#a8482a', '#b8582f', '#9a4026', '#b4502c'];
    for (let k = 0; k < 5; k++) { const s = 22 + k * 13, h = 3 + k * 4.5; [[0, -s, 2 * s + 13, 13], [-s, 0, 13, 2 * s], [s, 0, 13, 2 * s]].forEach(([dx, dz, w, d]) => box(world, MX + dx, h / 2, MZ + dz, w, h, d, cols[k % 4])); }
    box(world, MX, 0.12, MZ, 50, 0.2, 50, '#8a3a22');
    const R = rng(21); for (let i = 0; i < 40; i++) { const m = new T3.Mesh(ICO, pmat(R() < .5 ? '#9a3a20' : '#7a2e1a')); m.position.set(MX - 20 + R() * 40, 0.8, MZ - 20 + R() * 40); m.scale.setScalar(0.8 + R() * 1.8); m.rotation.set(R() * 3, R() * 3, 0); world.add(m); }
    box(world, MX, 0.1, MZ + 60, 14, 0.2, 80, '#8a4a2c'); box(world, MX + 80, 0.09, MZ + 100, 170, 0.2, 14, '#8a5a3a'); }
  // perfuratriz
  const drill = grp(world, MX - 12, 0, MZ - 10);
  { box(drill, 0, 1.4, 0, 6, 2, 8, '#2a2a2e'); box(drill, 0, 3.6, 0, 5, 2.6, 5.4, '#ffc21a'); box(drill, 0, 4.2, 2.4, 3.6, 1.6, 0.2, '#9ad0ff', true); }
  const mast = grp(drill, 0, 4, -2.6); box(mast, 0, 7, 0, 1.2, 14, 1.2, '#ffc21a'); box(mast, 0, 7, 0.7, 0.3, 14, 0.3, '#2a2a2e');
  const bit = box(mast, 0, 0, 0.9, 0.5, 4, 0.5, '#a0a4ac');
  const holes = []; for (let i = 0; i < 12; i++) holes.push(cyl(world, MX - 22 + (i % 6) * 4, 0.25, MZ - 18 + Math.floor(i / 6) * 4, 0.6, 0.2, '#2a1810'));
  const wires = opt(grp(world)); holes.forEach((hh, i) => { if (i < 11) box(wires, hh.position.x + 2, 0.35, hh.position.z, 4, 0.12, 0.12, '#ff3a3a', true); });
  worker(world, MX - 6, 0, MZ - 8, -1.2, 'look', 4); worker(world, MX - 26, 0, MZ - 24, 0.6, 'clip', 5, { tool: 'clip' });
  const boom = particles(world, 160, '#ff9a2a', 1.3), dust = particles(world, 160, '#a8704a', 2.2), dust2 = particles(world, 90, '#c89a7a', 3.2);
  // caminhões fora de estrada
  function truck(p, s) { const g = grp(p); g.scale.setScalar(s);
    box(g, 0, 5, 0, 15, 2, 7.5, '#ffc21a'); const bed = grp(g, -2, 6, 0); box(bed, 0, 2, 0, 11, 4, 7.6, '#ffb000'); box(bed, 5.4, 4.6, 0, 1.2, 1.4, 8, '#ffb000');
    const load = grp(bed, 0, 3.8, 0); const R = rng(5); for (let i = 0; i < 14; i++) { const m = new T3.Mesh(ICO, pmat(i % 2 ? '#9a3a20' : '#b04a28')); m.position.set(-4 + R() * 8, R() * 1.4, -2.8 + R() * 5.6); m.scale.setScalar(1.2 + R() * 0.8); load.add(m); }
    box(g, 6.2, 8, -1.8, 3, 3, 3.4, '#ffc21a'); box(g, 7.75, 8.3, -1.8, 0.1, 1.6, 2.8, '#9ad0ff', true); box(g, 6.2, 6.4, 1.6, 3, 1.2, 3, '#2a2a2e');
    box(g, 6.9, 5.2, 3.9, 0.3, 0.3, 7.4, '#2a2a2e'); for (let i = 0; i < 4; i++) box(g, 7.0, 5.6 + i * 0.8, 4.4, 0.2, 0.2, 1.4, '#2a2a2e');
    const tires = []; [[5, 4.2], [5, -4.2], [-4, 4.2], [-4, -4.2]].forEach(([x, z]) => { const t = grp(g, x, 3.4, z); const r = new T3.Mesh(CYL, pmat('#1e1e22')); r.scale.set(3.4, 2.6, 3.4); r.rotation.x = Math.PI / 2; t.add(r); const hub = new T3.Mesh(CYL, pmat('#ffc21a')); hub.scale.set(1.4, 2.7, 1.4); hub.rotation.x = Math.PI / 2; t.add(hub); for (let k = 0; k < 8; k++) { const tr = box(t, Math.cos(k * 0.785) * 3.3, Math.sin(k * 0.785) * 3.3, 0, 0.6, 0.6, 2.7, '#2a2a2e'); tr.rotation.z = k * 0.785; } tires.push(t); });
    g.userData = { bed, tires, load }; return g; }
  const trucks = [truck(world, 1), truck(world, 1), truck(world, 1)];
  const truckPath = (u) => { if (u < 0.4) { const k = u / 0.4; return [MX, 0, MZ - 5 + k * 105, -Math.PI / 2]; } const k = (u - 0.4) / 0.6; return [MX + k * 170, 0, MZ + 100, 0]; };
  const tireGuy = worker(world, MX + 66, 0, MZ + 110.5, 0.5, 'look', 6); opt(tireGuy.h);

  // ---------- BENEFICIAMENTO: britador, moinho, lavagem, pelotização ----------
  const BX = -235, BZ = -40;
  const crusher = grp(world, BX, 0, BZ);
  { [[-5, -5], [5, -5], [-5, 5], [5, 5]].forEach(([x, z]) => box(crusher, x, 6, z, 1.2, 12, 1.2, '#5a5e66'));
    const hop = new T3.Mesh(new T3.CylinderGeometry(9, 4, 8, 4, 1, true), new T3.MeshPhongMaterial({ color: '#ff7a1a', flatShading: true, side: T3.DoubleSide })); hop.position.y = 17; hop.rotation.y = Math.PI / 4; crusher.add(hop);
    box(crusher, 0, 11, 0, 9, 4, 9, '#3a3e48'); sign(crusher, 0, 11, 4.6, 0, 'BRITADOR', ''); }
  const jawL = box(crusher, -2.4, 15, 0, 1, 5, 6, '#8a8e96'), jawR = box(crusher, 2.4, 15, 0, 1, 5, 6, '#8a8e96');
  const conveyors = [];
  function conveyor(a, b, w) { const m = beam(a, b, w || 2.4, '#2a2a30'); m.scale.y = 0.6; beam([a[0], a[1] + 0.8, a[2] + 1.4], [b[0], b[1] + 0.8, b[2] + 1.4], 0.3, '#ffc21a'); beam([a[0], a[1] + 0.8, a[2] - 1.4], [b[0], b[1] + 0.8, b[2] - 1.4], 0.3, '#ffc21a');
    const n = Math.floor(Math.hypot(b[0] - a[0], b[2] - a[2]) / 14); for (let i = 1; i < n; i++) { const k = i / n; const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k), z = lerp(a[2], b[2], k); if (y > 2) box(world, x, y / 2, z, 0.8, y, 0.8, '#5a5e66'); } conveyors.push({ a, b }); return { a, b }; }
  const cv1 = conveyor([BX + 6, 8, BZ], [BX + 26, 6, BZ]);
  const mill = grp(world, BX + 36, 7, BZ); const millDrum = grp(mill); { const d = new T3.Mesh(CYL, pmat('#6a7a8a')); d.scale.set(6, 16, 6); d.rotation.z = Math.PI / 2; millDrum.add(d); for (let i = 0; i < 5; i++) { const r = box(millDrum, -6 + i * 3, 0, 0, 0.6, 12.6, 12.6, '#4a5a6a'); r.rotation.x = i * 0.3; } }
  box(world, BX + 36, 2, BZ, 18, 4, 9, '#3a3e48'); box(world, BX + 47, 4, BZ + 6, 5, 5, 4, '#1a6ad8'); const gear = new T3.Mesh(new T3.TorusGeometry(7.2, 0.8, 4, 20), pmat('#2a2a2e')); gear.rotation.y = Math.PI / 2; gear.position.set(BX + 42, 7, BZ); world.add(gear);
  sign(world, BX + 36, 4, BZ + 4.7, 0, 'MOINHO', '');
  const tanks = [[BX + 64, BZ - 18], [BX + 64, BZ + 18]].map(([x, z]) => { const g = grp(world, x, 0, z); cyl(g, 0, 2.5, 0, 12, 5, '#9aa0a8'); const w = cyl(g, 0, 5.1, 0, 11.3, 0.3, '#3a8ad8'); w.material = pmat('#3a8ad8', 60); const arm = grp(g, 0, 5.6, 0); box(arm, 0, 0, 0, 22, 0.6, 0.8, '#ffc21a'); cyl(g, 0, 7, 0, 1, 3, '#5a5e66'); return arm; });
  const water = particles(world, 80, '#bfe6ff', 0.5);
  const cv2 = conveyor([BX + 76, 6, BZ], [BX + 96, 10, BZ]);
  const drum = grp(world, BX + 108, 11, BZ); drum.rotation.z = -0.12; const drumR = grp(drum); { const d = new T3.Mesh(new T3.CylinderGeometry(5.5, 5.5, 20, 16, 1, true), new T3.MeshPhongMaterial({ color: '#c86a3a', flatShading: true, side: T3.DoubleSide })); d.rotation.z = Math.PI / 2; drumR.add(d); for (let i = 0; i < 4; i++) { const r = box(drumR, -7 + i * 4.6, 0, 0, 0.8, 11.8, 11.8, '#8a4a2a'); r.rotation.x = 0.4; } }
  [-8, 8].forEach(x => { box(world, BX + 108 + x, 3, BZ, 2, 6, 10, '#5a5e66'); });
  const pellets = particles(world, 140, '#4a3a34', 0.9); const pelletPile = new T3.Mesh(CONE, pmat('#4a3a34')); pelletPile.scale.set(8, 6, 8); pelletPile.position.set(BX + 132, 3, BZ); world.add(pelletPile);
  const oreBits = particles(world, 70, '#9a3a20', 1.1);
  worker(world, BX + 18, 0, BZ + 10, 0.3, 'clip', 7, { tool: 'clip' }); worker(world, BX + 52, 0, BZ - 10, 2.6, 'walk', 8, { path: loop(BX + 20, BZ - 12, BX + 90, BZ - 12, 0.05, 0.3) }); worker(world, BX + 120, 0, BZ + 9, -0.5, 'point', 9); worker(world, BX + 70, 0, BZ + 2, 0, 'look', 10);

  // ---------- CARVOARIA: eucaliptos + fornos iglu ----------
  const CX = -60, CZ = -150;
  { const n = 140; const trunk = new T3.InstancedMesh(BOX, pmat('#e2d8c4'), n), crown = new T3.InstancedMesh(ICO, pmat('#5a9a5a'), n); trunk.frustumCulled = crown.frustumCulled = false; world.add(trunk); world.add(crown); const d = new T3.Object3D(); const R = rng(31);
    for (let i = 0; i < n; i++) { const x = CX - 70 + (i % 14) * 10 + R() * 3, z = CZ - 70 + Math.floor(i / 14) * 6 + R() * 2; const h = 20 + R() * 6; d.position.set(x, h / 2, z); d.scale.set(0.9, h, 0.9); d.rotation.set(0, 0, 0); d.updateMatrix(); trunk.setMatrixAt(i, d.matrix); d.position.set(x, h + 2, z); d.scale.set(2.6, 6, 2.6); d.updateMatrix(); crown.setMatrixAt(i, d.matrix); } }
  const kilns = []; for (let i = 0; i < 8; i++) { const x = CX - 42 + (i % 4) * 22, z = CZ - 10 + Math.floor(i / 4) * 24; const g = grp(world, x, 0, z); const k = new T3.Mesh(HEMI, pmat(i % 2 ? '#b8643a' : '#a85a34')); k.scale.set(8, 7.5, 8); g.add(k); box(g, 0, 2.4, 7.4, 3.2, 4.8, 1.6, '#2a1a12'); cyl(g, 0, 7.6, 0, 1, 0.8, '#5a3a2a'); kilns.push(g); }
  const logs = []; for (let i = 0; i < 4; i++) { const g = grp(world, CX + 46, 0, CZ - 12 + i * 9); for (let k = 0; k < 9; k++) { const l = hcyl(g, 0, 0.8 + Math.floor(k / 3) * 1.5, (k % 3) * 1.6 - 1.6, 0.75, 9, k % 2 ? '#c8b89a' : '#b8a888', 'x'); } logs.push(g); }
  const kSmoke = particles(world, 120, '#8a8690', 2.4);
  const coalPile = new T3.Mesh(CONE, pmat('#1e1e22')); coalPile.scale.set(9, 6, 9); coalPile.position.set(CX + 30, 3, CZ + 30); world.add(coalPile);
  const orePile = new T3.Mesh(CONE, pmat('#a8482a')); orePile.scale.set(8, 5.5, 8); orePile.position.set(CX + 50, 2.75, CZ + 30); world.add(orePile);
  const oxy = particles(world, 40, '#ff4a4a', 0.9), coalFire = particles(world, 90, '#ff7a1a', 0.9);
  worker(world, CX + 40, 0, CZ - 4, -1.6, 'carry', 11, { path: loop(CX + 40, CZ - 2, CX - 10, CZ - 2, 0.05, 0) }); worker(world, CX - 20, 0, CZ + 6, 0.2, 'look', 12); worker(world, CX + 2, 0, CZ + 20, 2.8, 'rake', 13, { tool: 'rake' });

  // ---------- ALTO-FORNO ----------
  const FX = 120, FZ = 0, FL = 16;                                   // FL = piso da casa de corrida
  box(world, FX, FL / 2, FZ, 46, FL, 46, '#6a6460');                  // base
  box(world, FX, FL / 2, FZ + 34, 76, FL, 42, '#7a7470');             // casa de corrida (piso elevado)
  for (let i = 0; i < 12; i++) box(world, FX - 34 + i * 6.2, FL + 0.6, FZ + 55, 0.3, 1.2, 0.3, '#ffc21a'); box(world, FX, FL + 1.2, FZ + 55, 76, 0.3, 0.3, '#ffc21a');
  const shellMat = new T3.MeshPhongMaterial({ color: '#5a5e68', flatShading: true, shininess: 12, transparent: true, opacity: 1 });
  const shell = new T3.Mesh(new T3.CylinderGeometry(10.5, 14, 58, 18), shellMat); shell.position.set(FX, FL + 29, FZ); world.add(shell);
  const bands = []; for (let i = 0; i < 6; i++) { const r = lerp(14, 10.5, (i + 0.5) / 6); const b = new T3.Mesh(new T3.CylinderGeometry(r + 0.4, r + 0.4, 1, 18), pmat('#3a3e48')); b.position.set(FX, FL + 5 + i * 9.5, FZ); world.add(b); bands.push(b); }
  const bustle = new T3.Mesh(new T3.TorusGeometry(19, 1.6, 6, 26), pmat('#a85a34')); bustle.rotation.x = Math.PI / 2; bustle.position.set(FX, FL + 9, FZ); world.add(bustle);
  const tuyeres = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const m = beam([FX + Math.cos(a) * 18, FL + 8.5, FZ + Math.sin(a) * 18], [FX + Math.cos(a) * 13.5, FL + 4.5, FZ + Math.sin(a) * 13.5], 0.9, '#8a5a3a'); const gl = box(world, FX + Math.cos(a) * 13.9, FL + 4.6, FZ + Math.sin(a) * 13.9, 1, 1, 1, HOT2, true); tuyeres.push(gl); }
  // estrutura de prédio (colunas, vigas, plataformas)
  const steelY = '#d8a82a';
  [[-20, -20], [20, -20], [-20, 20], [20, 20]].forEach(([x, z]) => box(world, FX + x, FL + 36, FZ + z, 1.8, 72, 1.8, steelY));
  for (let k = 1; k <= 6; k++) { const y = FL + k * 11; [[0, -20, 40, 1], [0, 20, 40, 1], [-20, 0, 1, 40], [20, 0, 1, 40]].forEach(([x, z, w, d]) => box(world, FX + x, y, FZ + z, w + 1, 1, d + 1, steelY)); if (k % 2 === 0) box(world, FX + 14, y + 0.6, FZ + 14, 12, 0.3, 12, '#7a7e86');
    [[-20, -20, 20, -20], [20, -20, 20, 20]].forEach(([x0, z0, x1, z1]) => beam([FX + x0, y, FZ + z0], [FX + x1, y + 11, FZ + z1], 0.5, steelY)); }
  // topo: casa do topo, tubos de saída de gás
  box(world, FX, FL + 61, FZ, 18, 6, 18, '#4a4e58'); box(world, FX, FL + 66, FZ, 9, 4, 9, '#ff7a1a');
  const top = [FX, FL + 70, FZ];
  [[-6, -6], [6, -6], [-6, 6], [6, 6]].forEach(([x, z]) => { cyl(world, FX + x, FL + 70, FZ + z, 1.4, 14, '#7a7e86'); });
  box(world, FX, FL + 77, FZ, 16, 2.4, 2.4, '#7a7e86'); box(world, FX, FL + 77, FZ, 2.4, 2.4, 16, '#7a7e86');
  beam([FX, FL + 77, FZ - 6], [FX - 34, FL + 34, FZ - 20], 3, '#7a7e86');
  const catcher = grp(world, FX - 36, 0, FZ - 22); cyl(catcher, 0, 36, 0, 6, 16, '#8a8e96'); { const c = new T3.Mesh(CONE, pmat('#8a8e96')); c.scale.set(6, 8, 6); c.rotation.x = Math.PI; c.position.y = 24; catcher.add(c); } [-4, 4].forEach(x => [-4, 4].forEach(z => box(catcher, x, 12, z, 1, 24, 1, steelY)));
  beam([FX - 36, 20, FZ - 22], [FX - 36, 20, FZ - 50], 2.4, '#7a7e86');
  // regeneradores (Cowper) e tubo de ar quente
  const stoves = [-42, -26, -10].map(x => { const g = grp(world, FX + x, 0, FZ - 40); cyl(g, 0, 26, 0, 7, 52, '#a8aeb6'); const d = new T3.Mesh(HEMI, pmat('#a8aeb6')); d.scale.setScalar(7); d.position.y = 52; g.add(d); for (let i = 0; i < 4; i++) cyl(g, 0, 6 + i * 13, 0, 7.3, 0.8, '#7a7e86'); return g; });
  const hotMain = beam([FX - 46, 12, FZ - 30], [FX + 2, 12, FZ - 30], 3.2, '#b0603a'); const hotDown = beam([FX + 2, 12, FZ - 30], [FX, FL + 9, FZ - 18], 3, '#b0603a');
  const hotAir = particles(world, 90, '#ffb03a', 0.9);
  // chaminé
  const CHX = FX + 46, CHZ = FZ - 34;
  { const c = new T3.Mesh(new T3.CylinderGeometry(3.2, 5, 120, 14), pmat('#c8c4bc')); c.position.set(CHX, 60, CHZ); world.add(c); [100, 108, 116].forEach((y, i) => cyl(world, CHX, y, CHZ, lerp(3.6, 3.3, i / 2), 4, i % 2 ? '#ffffff' : '#e8302a')); cyl(world, CHX, 120.5, CHZ, 3.6, 1, '#3a3a3a'); box(world, CHX, 50, CHZ + 3.8, 0.3, 100, 0.3, '#5a5e66'); }
  beam([FX + 14, 22, FZ - 14], [CHX, 22, CHZ], 2.6, '#7a7e86');
  const chSmoke = particles(world, 140, '#9a98a0', 3.4), redLight = opt(box(world, CHX, 122.5, CHZ, 1.2, 1.2, 1.2, '#ff2020', true));
  // esteira inclinada até o topo + silos
  const EA = [FX - 120, 3, FZ + 4], EB = [FX - 9, FL + 66, FZ + 2];
  { const m = beam(EA, EB, 4, '#3a3e48'); m.scale.y = 1.2; const tr1 = beam([EA[0], EA[1] + 2.4, EA[2] + 2.6], [EB[0], EB[1] + 2.4, EB[2] + 2.6], 0.5, '#e0dcd4'), tr2 = beam([EA[0], EA[1] + 2.4, EA[2] - 2.6], [EB[0], EB[1] + 2.4, EB[2] - 2.6], 0.5, '#e0dcd4');
    for (let i = 1; i < 9; i++) { const k = i / 9; const x = lerp(EA[0], EB[0], k), y = lerp(EA[1], EB[1], k), z = lerp(EA[2], EB[2], k); box(world, x, y / 2, z - 2.6, 1, y, 1, '#c8c4bc'); box(world, x, y / 2, z + 2.6, 1, y, 1, '#c8c4bc'); box(world, x, y - 3, z, 1, 1, 5.6, '#c8c4bc'); } }
  [[-150, -16, '#a8482a'], [-150, 16, '#2a2a2e'], [-132, -18, '#e8e4dc']].forEach(([dx, dz, c]) => { const g = grp(world, FX + dx, 0, FZ + dz); cyl(g, 0, 12, 0, 6, 16, '#b8bcc4'); const cn = new T3.Mesh(CONE, pmat('#b8bcc4')); cn.scale.set(6, 5, 6); cn.rotation.x = Math.PI; cn.position.y = 1.5; g.add(cn); const cap = new T3.Mesh(CONE, pmat(c)); cap.scale.set(6, 3, 6); cap.position.y = 21.5; g.add(cap); [-4, 4].forEach(x => box(g, x, 2, 0, 1, 4, 1, steelY)); });
  const feedOre = particles(world, 36, '#b8482a', 1.7), feedCoal = particles(world, 36, '#1e1e22', 1.7), feedLime = particles(world, 30, '#eeeae0', 1.7);
  // interior (corte): camadas, gotas de ferro e cadinho
  const inner = opt(grp(world, FX, FL, FZ));
  { const cols = ['#b8482a', '#1e1e22', '#e8e4dc']; for (let i = 0; i < 12; i++) { const y = 54 - i * 3.4; const r = lerp(9.6, 12.4, i / 12); const m = new T3.Mesh(CYL, pmat(cols[i % 3])); m.scale.set(r, 3.2, r); m.position.y = y; inner.add(m); }
    const z1 = new T3.Mesh(CYL, bmat('#ff6a1a')); z1.scale.set(12.6, 8, 12.6); z1.position.y = 10; inner.add(z1); const z2 = new T3.Mesh(CYL, bmat('#ffd04a')); z2.scale.set(12.8, 2, 12.8); z2.position.y = 5; inner.add(z2); const z3 = new T3.Mesh(CYL, bmat('#ff9a2a')); z3.scale.set(12.9, 3.5, 12.9); z3.position.y = 2.2; inner.add(z3); }
  const drops = particles(world, 80, '#ffe08a', 0.8), insideFall = particles(world, 30, '#b8482a', 1.5);
  // casa de corrida: furo de gusa, bica, escória, panela
  const TAP = [FX, FL + 3.5, FZ + 13.2];
  const runner = grp(world, FX, FL, FZ); box(runner, -2.2, 1, 33, 1.2, 2, 42, '#6a5048'); box(runner, 2.2, 1, 33, 1.2, 2, 42, '#6a5048'); box(runner, 0, 0.2, 33, 3.4, 0.4, 42, '#3a2a24');
  box(runner, 9, 0.8, 29, 14, 1.6, 1.2, '#6a5048'); box(runner, 9, 0.8, 32.6, 14, 1.6, 1.2, '#6a5048'); box(runner, 9, 0.2, 30.8, 14, 0.4, 2.4, '#3a2a24'); box(runner, 0, 2.6, 30.8, 4.6, 0.8, 0.8, '#5a5e66');
  box(runner, 18, -7.6, 30.8, 4, 16, 6, '#5a5048');
  const iron = box(world, FX, FL + 0.9, FZ + 13, 3.2, 0.9, 1, HOT, true), ironTop = box(world, FX, FL + 1.4, FZ + 13, 1.6, 0.2, 1, HOT2, true);
  const slag = box(world, FX + 2, FL + 0.8, FZ + 30.8, 1, 0.8, 2.2, '#ffd06a', true);
  const tapStream = box(world, FX, FL + 2.5, FZ + 13.6, 1.6, 2.2, 1.6, HOT2, true);
  const spout = box(world, FX, FL - 3, FZ + 55.6, 1.8, 7, 1.8, HOT2, true);
  const slagFall = box(world, FX + 16, FL - 4, FZ + 30.8, 1.6, 8, 1.6, '#ffd06a', true);
  const clayGun = grp(world, FX - 9, FL, FZ + 18); box(clayGun, 0, 2, 0, 3, 4, 3, '#3a3e48'); const gunArm = grp(clayGun, 0, 3.6, 0); box(gunArm, 3, 0, 0, 7, 1.4, 1.4, '#ffc21a'); box(gunArm, 6.8, 0, 0, 1, 1, 1, '#2a2a2e');
  const tapDrill = grp(world, FX + 9, FL, FZ + 18); box(tapDrill, 0, 2, 0, 3, 4, 3, '#3a3e48'); const drillArm = grp(tapDrill, 0, 3.6, 0); box(drillArm, -3.4, 0, 0, 7, 1.2, 1.2, '#ff7a1a'); box(drillArm, -7.3, 0, 0, 1.6, 0.5, 0.5, '#a0a4ac');
  const sparks = particles(world, 240, '#ffd04a', 0.45), sparks2 = particles(world, 140, '#ff7a1a', 0.55), steam = particles(world, 140, '#e4e8ee', 1.2), heatHaze = particles(world, 60, '#ffb070', 0.5);
  const tapLight = new T3.PointLight(0xff7a1a, 0, 90, 1.2); tapLight.position.set(FX, FL + 8, FZ + 26); world.add(tapLight);
  // galpão aberto da casa de corrida
  [[-36, 14], [36, 14], [-36, 54], [36, 54]].forEach(([x, z]) => box(world, FX + x, FL + 15, FZ + z, 1.6, 30, 1.6, '#4a5a7a'));
  box(world, FX, FL + 30, FZ + 14, 74, 1.4, 1.4, '#4a5a7a'); box(world, FX - 36, FL + 30, FZ + 34, 1.4, 1.4, 40, '#4a5a7a'); box(world, FX + 36, FL + 30, FZ + 34, 1.4, 1.4, 40, '#4a5a7a');
  const roofB = box(world, FX, FL + 31.5, FZ + 21, 76, 0.8, 16, '#8a9ab0');
  sign(world, FX - 35, FL + 6, FZ + 54.9, 0, 'METAL LÍQUIDO', 'mantenha distância'); sign(world, FX + 35, FL + 6, FZ + 54.9, 0, 'ÁREA QUENTE', 'use roupa aluminizada'); sign(world, FX + 25, FL + 4, FZ + 14.9, 0, 'PERIGO', '1.500 °C', '#ff8a1a');
  const sirens = [[-36, 14], [36, 14], [-36, 54], [36, 54]].map(([x, z]) => { const g = grp(world, FX + x, FL + 24, FZ + z + 1.2); const b = box(g, 0, 0, 0, 1.6, 1.6, 1.6, '#3a1010'); const l = box(g, 0, 1.2, 0, 1.2, 0.8, 1.2, '#ff2020', true); return { g, b, l }; });
  // sala de controle com telas
  const ctrl = grp(world, FX - 26, FL, FZ + 44);
  { box(ctrl, 0, 0.3, 0, 16, 0.6, 9, '#4a4e58'); box(ctrl, 0, 9, -4.2, 16, 18, 0.6, '#d8dce4'); box(ctrl, -7.7, 9, 0, 0.6, 18, 9, '#d8dce4'); box(ctrl, 7.7, 9, 0, 0.6, 18, 9, '#d8dce4'); box(ctrl, 0, 17.7, 0, 16.4, 0.8, 9.4, '#d8dce4'); box(ctrl, 0, 1.2, 4.2, 16, 2.4, 0.6, '#d8dce4');
    const glass = new T3.Mesh(BOX, new T3.MeshPhongMaterial({ color: '#9ad0ff', transparent: true, opacity: 0.22, shininess: 80 })); glass.scale.set(15, 14, 0.2); glass.position.set(0, 9.6, 4.3); ctrl.add(glass);
    box(ctrl, 0, 2.4, 0.6, 14, 1, 3, '#3a3e48');
    const scr = (lbl, val, col, draw) => panel(ctrl, 4.4, 2.8, (c, w, h, st) => { c.fillStyle = '#0a1424'; rr(c, 0, 0, w, h, 30); c.fill(); c.lineWidth = 12; c.strokeStyle = col; rr(c, 6, 6, w - 12, h - 12, 26); c.stroke(); txt(c, lbl, w / 2, 90, 64, '#9ab0d0', 700, 'Oswald'); txt(c, val, w / 2, 260, 170, col, 700, 'Oswald'); if (draw) draw(c, w, h); });
    const s1 = scr('TEMPERATURA', '1.520 °C', '#ff8a3a'), s2 = scr('AR SOPRADO', '1.200 °C', '#ffd23c'), s3 = scr('GUSA', '320 t', '#3af0ff'); [s1, s2, s3].forEach((s, i) => { s.position.set(-5 + i * 5, 6.2, -3.7); PANELS.push(s); });
    const s4 = scr('PRESSÃO', 'OK', '#5aff8a'), s5 = scr('CORRIDA', 'Nº 47', '#ff5a8a'); [s4, s5].forEach((s, i) => { s.position.set(-2.5 + i * 5, 9.6, -3.7); PANELS.push(s); }); }
  const ops = [worker(ctrl, -3, 0.6, 1.4, Math.PI, 'clip', 40), worker(ctrl, 3.4, 0.6, 1.6, Math.PI + 0.3, 'point', 41)];
  // panela no carro de transferência
  const ladle = grp(world, FX, 0, FZ + 62);
  const ladleBody = grp(ladle, 0, 6, 0); { const b = new T3.Mesh(new T3.CylinderGeometry(6.4, 5.4, 12, 16), pmat('#3a3a40')); ladleBody.add(b); cyl(ladleBody, 0, 6, 0, 6.8, 0.8, '#5a5e66'); cyl(ladleBody, 0, 1, 0, 6.2, 0.8, '#2a2a2e'); [-1, 1].forEach(s => { box(ladleBody, 6.8 * s, 3.4, 0, 1.4, 1.6, 1.6, '#5a5e66'); }); box(ladleBody, 6.6, 6.8, 0, 1.4, 1.4, 1.4, '#5a5e66'); }
  const bail = grp(ladleBody, 0, 3.4, 0); box(bail, -7.6, 4.5, 0, 0.8, 9, 0.8, '#4a4e58'); box(bail, 7.6, 4.5, 0, 0.8, 9, 0.8, '#4a4e58'); box(bail, 0, 9, 0, 16, 0.9, 0.9, '#4a4e58');
  const melt = cyl(ladleBody, 0, -2, 0, 5.9, 0.6, HOT, true); const crust = cyl(ladleBody, 0, -1.7, 0, 5.2, 0.2, HOT2, true);
  const car = grp(world, FX, 0, FZ + 62); box(car, 0, 1.2, 0, 15, 1.6, 10, '#3a3e48'); [-5, 5].forEach(x => [-4, 4].forEach(z => hcyl(car, x, 0.9, z, 0.9, 0.8, '#1e1e22')));
  box(world, FX + 40, 0.1, FZ + 58, 120, 0.2, 0.6, '#6a6e76'); box(world, FX + 40, 0.1, FZ + 66, 120, 0.2, 0.6, '#6a6e76');
  // ponte rolante
  const CRY = 44, CR0 = FZ + 50, CR1 = FZ + 80;
  for (let i = 0; i < 6; i++) { const x = FX - 14 + i * 32; box(world, x, CRY / 2, CR0, 1.8, CRY, 1.8, '#4a5a7a'); box(world, x, CRY / 2, CR1, 1.8, CRY, 1.8, '#4a5a7a'); }
  box(world, FX + 66, CRY, CR0, 164, 2, 2, '#4a5a7a'); box(world, FX + 66, CRY, CR1, 164, 2, 2, '#4a5a7a');
  const bridge = grp(world, FX, CRY + 1.8, 0);
  { box(bridge, -2.2, 0, (CR0 + CR1) / 2, 1.8, 2.6, CR1 - CR0 + 4, '#ffc21a'); box(bridge, 2.2, 0, (CR0 + CR1) / 2, 1.8, 2.6, CR1 - CR0 + 4, '#ffc21a'); for (let k = 0; k < 8; k++) { const st = box(bridge, -2.2, 0, CR0 + 2 + k * 3.6, 1.9, 0.6, 0.6, '#1a1a1a'); st.rotation.x = 0.7; }
    for (let k = 0; k < 2; k++) [CR0, CR1].forEach(z => box(bridge, 0, -0.6, z, 6, 1.4, 2.8, '#ffb000')); }
  const cabin = grp(bridge, 3.4, -4.6, CR1 - 3); { box(cabin, 0, 0, 0, 4.4, 4.6, 4.4, '#ffb000'); const g = new T3.Mesh(BOX, new T3.MeshPhongMaterial({ color: '#9ad0ff', transparent: true, opacity: 0.35, shininess: 90 })); g.scale.set(4.5, 2.4, 4.5); g.position.y = 0.4; cabin.add(g); box(cabin, 0, -2.6, 0, 3, 0.6, 3, '#2a2a2e'); }
  const operator = worker(cabin, 0, -2.2, 0, -Math.PI / 2, 'drive', 42, { s: 0.2, color: '#1a6ad8' });
  const beacon = box(bridge, 0, 2.2, CR0 + 4, 1.2, 1.2, 1.2, '#ff8a1a', true);
  const trolley = grp(bridge, 0, 1.8, 0); box(trolley, 0, 0, 0, 7.4, 2.4, 6, '#ff9a10'); box(trolley, 0, 1.6, 1.4, 3, 1.2, 2, '#3a3e48'); cyl(trolley, 0, 0.4, -1.4, 1.4, 6, '#5a5e66').rotation.z = Math.PI / 2;
  const cables = [box(trolley, -1.2, -10, 0, 0.25, 20, 0.25, '#2a2a2e'), box(trolley, 1.2, -10, 0, 0.25, 20, 0.25, '#2a2a2e')];
  const hook = grp(world); box(hook, 0, 0, 0, 4.4, 1.6, 2, '#ffc21a'); box(hook, 0, -1.6, 0, 1, 2, 1, '#3a3e48'); box(hook, 0, -2.8, 0.4, 1, 1, 1.6, '#3a3e48');
  // lingoteiras (máquina de lingotar gusa) + lingotes
  const LG0 = [FX + 76, 7, FZ + 70], LG1 = [FX + 150, 15, FZ + 70];
  beam(LG0, LG1, 0.1, '#2a2a30').scale.set(9, 1.2, Math.hypot(74, 8)); for (let i = 0; i < 7; i++) { const k = i / 6; box(world, lerp(LG0[0], LG1[0], k), lerp(LG0[1], LG1[1], k) / 2, FZ + 70, 1, lerp(LG0[1], LG1[1], k), 9, '#5a5e66'); }
  const trough = grp(world, FX + 72, 9, FZ + 70); box(trough, 0, 0, 0, 5, 2, 7, '#6a5048'); const troughMelt = box(trough, 0, 0.9, 0, 4, 0.3, 6, HOT, true);
  const NI = 52; const ingots = new T3.InstancedMesh(BOX, new T3.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), NI); ingots.frustumCulled = false; world.add(ingots); { const c = new T3.Color('#888'); for (let i = 0; i < NI; i++) ingots.setColorAt(i, c); }
  const molds = new T3.InstancedMesh(BOX, pmat('#3a3a40'), NI); molds.frustumCulled = false; world.add(molds);
  const pour = box(world, 0, 0, 0, 1.4, 1, 1.4, HOT2, true); opt(pour);
  const ingotPile = grp(world, FX + 158, 0, FZ + 70); { const R = rng(41); for (let i = 0; i < 30; i++) { const b = box(ingotPile, -6 + R() * 12, 0.6 + Math.floor(i / 10) * 1.1, -5 + R() * 10, 2.6, 1, 1.2, '#6a6c72'); b.rotation.y = R() * 3; } }
  worker(world, FX + 100, 0, FZ + 78, 0, 'look', 43); worker(world, FX + 124, 0, FZ + 62, Math.PI, 'clip', 44, { tool: 'clip' });
  // trem com lingotes, empilhadeira, caminhão
  box(world, FX + 120, 0.15, FZ + 100, 400, 0.3, 0.6, '#6a6e76'); box(world, FX + 120, 0.15, FZ + 104, 400, 0.3, 0.6, '#6a6e76'); for (let i = 0; i < 80; i++) box(world, FX - 78 + i * 5, 0.08, FZ + 102, 0.9, 0.16, 6, '#6a4a34');
  const train = grp(world, 0, 0, FZ + 102); { const loco = grp(train, 0, 0, 0); box(loco, 0, 3.6, 0, 14, 4.8, 5, '#e8302a'); box(loco, 4, 7, 0, 5, 3, 5, '#e8302a'); box(loco, 6.55, 7.2, 0, 0.1, 1.8, 3.8, '#9ad0ff', true); box(loco, 0, 3.2, 2.55, 13, 0.8, 0.1, '#ffd23c'); for (let w = 1; w <= 4; w++) { const wg = grp(train, -w * 15.5, 0, 0); box(wg, 0, 2.8, 0, 14, 3, 5, '#3a4a6a'); box(wg, 0, 1.4, 0, 12, 0.6, 4, '#2a2a2e'); const R = rng(w); for (let i = 0; i < 12; i++) box(wg, -5 + (i % 6) * 2, 4.6 + Math.floor(i / 6) * 0.9, -1 + (i % 2) * 1.8, 1.9, 0.8, 1, i % 3 ? '#6a6c72' : '#7a7c82'); } [[-4], [4]].forEach(([x]) => {}); }
  const fork = grp(world, FX + 170, 0, FZ + 86); { box(fork, 0, 2, 0, 5, 2.4, 3.4, '#ffc21a'); box(fork, -0.6, 4.6, 0, 3, 0.3, 3, '#2a2a2e'); [-1.4, 1.4].forEach(z => box(fork, -0.6, 3.6, z * 0.9, 0.3, 3.6, 0.3, '#2a2a2e')); box(fork, 3, 4, 0, 0.5, 6, 3, '#3a3e48'); [-1.5, 1.5].forEach(x => [-1.7, 1.7].forEach(z => hcyl(fork, x, 0.9, z, 0.9, 0.6, '#1e1e22'))); const pal = grp(fork, 5, 1.2, 0); box(pal, 0, 0, 0, 3, 0.4, 3, '#a87a4a'); for (let i = 0; i < 4; i++) box(pal, 0, 0.7 + Math.floor(i / 2) * 0.9, -0.7 + (i % 2) * 1.4, 2.6, 0.8, 1.1, '#6a6c72'); fork.userData.pal = pal; }
  worker(fork, -0.6, 2.4, 0, -Math.PI / 2, 'drive', 45, { s: 0.2 });

  // ---------- ACIARIA: conversor ----------
  const SX = 330, SZ = 10;
  { [[-24, -20], [24, -20], [-24, 20], [24, 20]].forEach(([x, z]) => box(world, SX + x, 25, SZ + z, 2, 50, 2, '#5a6a8a')); box(world, SX, 50, SZ, 52, 2, 44, '#7a8aa8'); box(world, SX, 25, SZ - 21, 50, 50, 1, '#9aa8c0'); box(world, SX - 25, 25, SZ, 1, 50, 42, '#9aa8c0');
    box(world, SX, 6, SZ, 30, 12, 8, '#4a4e58'); [-10, 10].forEach(x => box(world, SX + x, 12, SZ, 3, 16, 4, '#3a3e48')); }
  const conv = grp(world, SX, 16, SZ); const convBody = grp(conv); { const b = new T3.Mesh(new T3.CylinderGeometry(7, 6, 10, 16), pmat('#4a4e58')); convBody.add(b); const tp = new T3.Mesh(new T3.CylinderGeometry(3.6, 7, 6, 16, 1, true), new T3.MeshPhongMaterial({ color: '#4a4e58', flatShading: true, side: T3.DoubleSide })); tp.position.y = 8; convBody.add(tp); const bt = new T3.Mesh(new T3.SphereGeometry(6, 14, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), pmat('#4a4e58')); bt.position.y = -5; convBody.add(bt); cyl(convBody, 0, 0, 0, 7.4, 1.4, '#ffc21a'); hcyl(convBody, 0, 0, 0, 1.6, 18, '#3a3e48', 'x'); }
  const convMelt = cyl(convBody, 0, 9.6, 0, 3.2, 0.4, HOT2, true);
  const lance = grp(world, SX, 0, SZ); box(lance, 0, 46, 0, 1, 36, 1, '#c8ccd4'); box(lance, 0, 50, 0, 3, 3, 3, '#3a3e48');
  const flame = particles(world, 160, '#ffb03a', 1.4), flame2 = particles(world, 80, '#fff2b0', 1.0), steelSparks = particles(world, 160, '#ffe08a', 0.45);
  const convLight = new T3.PointLight(0xffa040, 0, 120, 1.2); convLight.position.set(SX, 36, SZ + 10); world.add(convLight);
  const steelLadle = grp(world, SX + 14, 0, SZ); { const b = new T3.Mesh(new T3.CylinderGeometry(5.4, 4.6, 10, 14), pmat('#3a3a40')); b.position.y = 5; steelLadle.add(b); } const steelMelt = cyl(steelLadle, 0, 5, 0, 5, 0.5, '#fff2c0', true); const steelStream = opt(box(world, SX + 11, 11, SZ, 1.4, 8, 1.4, '#fff2c0', true));
  worker(world, SX - 14, 0, SZ + 16, 0.4, 'shield', 46, { silver: true }); worker(world, SX + 16, 0, SZ + 18, -0.6, 'clip', 47, { tool: 'clip' });

  // ---------- LAMINAÇÃO ----------
  const RX = 400, RZ = 40;
  { for (let i = 0; i < 26; i++) hcyl(world, RX + i * 4, 4, RZ, 0.7, 6, '#7a7e86', 'z'); box(world, RX + 50, 2, RZ, 106, 3, 7, '#3a3e48');
    [16, 40, 64, 88].forEach((dx, i) => { const g = grp(world, RX + dx, 0, RZ); [-4.2, 4.2].forEach(z => box(g, 0, 7, z, 4, 14, 1.4, '#1a6ad8')); box(g, 0, 14, 0, 4, 2, 10, '#1a6ad8'); hcyl(g, 0, 6.6 - i * 0.15, 0, 1.6, 7, '#c8ccd4', 'z'); hcyl(g, 0, 3.2, 0, 1.6, 7, '#c8ccd4', 'z'); }); }
  const slab = box(world, RX, 5.4, RZ, 14, 2.4, 5, HOT, true);
  const prod = grp(world, RX + 70, 0, RZ + 26);
  { for (let i = 0; i < 8; i++) box(prod, -24, 0.3 + i * 0.5, 0, 12, 0.4, 7, i % 2 ? '#b8bcc4' : '#a8acb4');
    for (let i = 0; i < 3; i++) { const c = new T3.Mesh(new T3.TorusGeometry(2.6, 1.6, 8, 16), pmat('#a8acb4', 30)); c.position.set(-8 + i * 6, 4.2, 0); prod.add(c); }
    for (let i = 0; i < 20; i++) hcyl(prod, 14, 0.6 + Math.floor(i / 5) * 1.1, -2.4 + (i % 5) * 1.2, 0.5, 14, '#7a7e86', 'x');
    for (let i = 0; i < 4; i++) { box(prod, 32, 0.4 + i * 1.6, 0, 16, 0.4, 2, '#6a6e76'); box(prod, 32, 0.9 + i * 1.6, 0, 16, 0.8, 0.4, '#6a6e76'); box(prod, 32, 1.4 + i * 1.6, 0, 16, 0.4, 1.2, '#6a6e76'); } }
  worker(world, RX + 30, 0, RZ + 12, 0, 'look', 48); worker(world, RX + 90, 0, RZ + 14, -0.4, 'walk', 49, { path: loop(RX + 60, RZ + 14, RX + 110, RZ + 14, 0.06, 0) });

  // ---------- CIDADE ----------
  const TX = 580, TZ = 60;
  const homeCols = ['#f4e8d0', '#d8e8f4', '#f4d8d8', '#e0f0d8'];
  { for (let i = 0; i < 5; i++) { const g = grp(world, TX - 40 + i * 22, 0, TZ - 10); box(g, 0, 5, 0, 14, 10, 12, homeCols[i % 4]); const r1 = box(g, 0, 11.2, 0, 15, 1, 13, '#c8503a'); const r2 = box(g, 0, 12.6, 0, 11, 1.4, 13, '#b8402a'); box(g, -3, 4, 6.05, 3, 7, 0.1, '#7a5a3a'); box(g, 3, 6, 6.05, 3.4, 3, 0.1, '#9ad0ff', true);
      for (let k = 0; k < 9; k++) box(g, -6 + k * 1.5, 2.2, 10, 0.25, 4.4, 0.25, '#5a5e66'); box(g, 0, 4.2, 10, 13.6, 0.3, 0.3, '#5a5e66'); box(g, 0, 0.5, 10, 13.6, 0.3, 0.3, '#5a5e66'); } }
  const car2 = grp(world, TX - 18, 0, TZ + 18); { box(car2, 0, 1.6, 0, 9, 2, 4.2, '#e8302a'); box(car2, -0.6, 3.3, 0, 5, 1.6, 3.8, '#e8302a'); box(car2, -0.6, 3.3, 0, 5.1, 1.2, 3.6, '#9ad0ff', true); [-3, 3].forEach(x => [-2.1, 2.1].forEach(z => hcyl(car2, x, 0.9, z, 0.9, 0.6, '#1e1e22'))); }
  const fridge = grp(world, TX + 22, 0, TZ + 18); box(fridge, 0, 4, 0, 4, 8, 3.4, '#f4f6fa'); box(fridge, 0, 5.6, 1.75, 3.8, 0.12, 0.1, '#c8ccd4'); box(fridge, 1.4, 6.6, 1.8, 0.3, 1.6, 0.3, '#8a8e96'); box(fridge, 1.4, 3.2, 1.8, 0.3, 2, 0.3, '#8a8e96');
  const delivery = grp(world, TX + 34, 0, TZ + 24); box(delivery, 0, 4, 0, 12, 6, 5, '#ffffff'); box(delivery, 7.5, 3, 0, 3.6, 4, 5, '#1a6ad8');
  worker(world, TX + 26, 0, TZ + 20, -0.8, 'carry', 50, { color: '#1a6ad8' }); worker(world, TX - 6, 0, TZ + 22, 0.3, 'wave', 51, { color: '#2aa84a' });
  { for (let i = 0; i < 40; i++) box(world, TX - 80 + i * 4, 0.1, TZ + 40, 0.8, 0.2, 5, '#6a4a34'); box(world, TX, 0.25, TZ + 38.5, 160, 0.3, 0.5, '#8a8e96'); box(world, TX, 0.25, TZ + 41.5, 160, 0.3, 0.5, '#8a8e96'); }

  // pássaros e nuvens
  function cloud(x, y, z, s) { const c = grp(world, x, y, z); for (let k = 0; k < 4; k++) { const m = new T3.Mesh(ICO, pmat('#f4f6fa')); m.position.set(k * 5 - 7, (k % 2) * 2, 0); m.scale.setScalar(5 + (k % 2) * 2); c.add(m); } c.scale.setScalar(s); return c; }
  const clouds = []; { const R = rng(97); for (let i = 0; i < 16; i++) { const c = cloud(-500 + R() * 1200, 150 + R() * 40, -250 + R() * 260, 1.4 + R()); c.userData = { x0: c.position.x, sp: 3 + R() * 4 }; clouds.push(c); } }
  const birds = []; for (let i = 0; i < 7; i++) { const g = grp(world); const wl = box(g, -1.6, 0, 0, 3, 0.25, 1, '#1a1a24'); const wr = box(g, 1.6, 0, 0, 3, 0.25, 1, '#1a1a24'); g.userData = { wl, wr, ph: i * 0.9 }; birds.push(g); }

  // ---------- apresentador gigante (canto da tela) ----------
  const hostBig = makeBessekai('gamer'); world.add(hostBig); opt(hostBig);
  const holo = opt(grp(world)); { const ring = new T3.Mesh(new T3.TorusGeometry(10, 0.6, 6, 32), bmat('#3af0ff')); ring.rotation.x = Math.PI / 2; holo.add(ring); const r2 = new T3.Mesh(new T3.TorusGeometry(14, 0.4, 6, 32), bmat('#9a6aff')); r2.rotation.x = Math.PI / 2; r2.position.y = 0.4; holo.add(r2); }
  function bigHost(lt) { hostBig.visible = true; holo.visible = true;
    const f = new T3.Vector3(); cam.getWorldDirection(f); const up = new T3.Vector3(0, 1, 0).applyQuaternion(cam.quaternion); const rt = new T3.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
    const pop = eBack(prog(lt, 0, 0.45)) || 0.001; hostBig.scale.setScalar(0.9 * pop);
    hostBig.position.copy(cam.position).addScaledVector(f, 55).addScaledVector(rt, 8.5).addScaledVector(up, -21 + Math.sin(gT * 1.6) * 0.5);
    hostBig.quaternion.copy(cam.quaternion); hostBig.rotateY(-0.35);
    holo.position.copy(hostBig.position); holo.quaternion.copy(cam.quaternion); holo.rotateX(0.55); holo.rotateY(gT * 1.5); holo.scale.setScalar(0.45 * pop);
    heroPose(hostBig, gT, { armL: -0.15, armLz: -1.45 - Math.sin(gT * 3) * 0.1, armR: Math.sin(gT * 2) * 0.15, headY: -0.35 + Math.sin(gT) * 0.12, legL: Math.sin(gT * 1.6) * 0.05 }); }

  // ---------- céu ----------
  const skyC = document.createElement('canvas'); skyC.width = 4; skyC.height = 256; const skyX = skyC.getContext('2d'); const skyT = new T3.CanvasTexture(skyC); skyT.colorSpace = T3.SRGBColorSpace; scene.background = skyT;
  const SKY = { day: ['#3a8ae8', '#d8ecff', 1.25], dusk: ['#3a2a6a', '#ff9a6a', 0.95], dark: ['#140c24', '#5a2a3a', 0.7], warm: ['#4a7ad8', '#ffe0b8', 1.15] };
  scene.fog = new T3.Fog(0xd8ecff, 380, 1300);
  function sky(a, b, u) { const A = SKY[a], B = SKY[b]; const g = skyX.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, ca.set(A[0]).lerp(cb.set(B[0]), u).getStyle()); g.addColorStop(1, ca.set(A[1]).lerp(cb.set(B[1]), u).getStyle()); skyX.fillStyle = g; skyX.fillRect(0, 0, 4, 256); skyT.needsUpdate = true;
    hemi.color.set(0xffffff); hemi.groundColor.set(0x4a5a6a); hemi.intensity = lerp(A[2], B[2], u); sun.intensity = 1.2 * lerp(A[2], B[2], u); rim.intensity = 0.15; scene.fog.color.set(A[1]).lerp(cb.set(B[1]), u); }

  // ---------- estados por quadro ----------
  const fx = { flash: 0, shake: 0, black: 0, red: 0 };
  function hostPose(o) { heroPose(host, gT, o); }
  function setWalk(list, mode) { list.forEach(w => w.modeNow = mode); }
  const castCrew = [], silverCrew = [];
  silverCrew.push(worker(world, FX - 4, FL, FZ + 22, Math.PI, 'pole', 60, { silver: true, tool: 'pole' }), worker(world, FX + 4.5, FL, FZ + 23, Math.PI + 0.3, 'pole', 61, { silver: true, tool: 'pole' }), worker(world, FX - 1, FL, FZ + 26, Math.PI - 0.2, 'shield', 62, { silver: true }));
  castCrew.push(worker(world, FX + 8, FL, FZ + 36, -Math.PI / 2, 'rake', 63, { silver: true, tool: 'rake' }), worker(world, FX - 10, FL, FZ + 38, 0.6, 'look', 64), worker(world, FX + 22, FL, FZ + 44, -0.4, 'clip', 65, { tool: 'clip' }), worker(world, FX - 18, FL, FZ + 26, 0.9, 'talk', 66), worker(world, FX + 28, FL, FZ + 22, -1.2, 'idle', 67), worker(world, FX - 6, FL, FZ + 50, 0.2, 'point', 68));
  const groundCrew = [worker(world, FX + 20, 0, FZ + 70, -0.5, 'look', 69), worker(world, FX - 12, 0, FZ + 74, 0.5, 'idle', 70), worker(world, FX + 40, 0, FZ + 86, 0.1, 'talk', 71), worker(world, FX + 60, 0, FZ + 88, -0.2, 'idle', 72), worker(world, FX + 8, 0, FZ + 90, 0.3, 'clip', 73, { tool: 'clip' })];
  const allCrew = castCrew.concat(silverCrew, groundCrew);
  function ironFlow(k) { // k: 0..1 até onde o gusa chegou na bica
    const reach = 13 + k * 42.6; iron.visible = k > 0; iron.scale.z = Math.max(0.01, reach - 13); iron.position.z = FZ + 13 + (reach - 13) / 2; ironTop.scale.z = iron.scale.z * 0.95; ironTop.position.z = iron.position.z; ironTop.material.color.set(HOT2).lerp(tmpC.set('#fff6c8'), (Math.sin(gT * 9) + 1) / 4);
    tapStream.visible = k > 0; tapStream.scale.y = 2.2 + Math.sin(gT * 20) * 0.2; spout.visible = k > 0.98; tapLight.intensity = k > 0 ? 70 + Math.sin(gT * 17) * 12 : 0; }
  function slagFlow(k) { slag.visible = k > 0; slag.scale.x = Math.max(0.01, k * 14); slag.position.x = FX + 2 + k * 7; slagFall.visible = k > 0.95; }
  function sparkFX(n, ox, oy, oz, spread, up) { sparks.userData.place((i, d) => { const R = rng(i + 17); const k = ((gT * (1.4 + R()) + R()) % 1); if (i > n) return false; d.position.set(ox + (R() - .5) * spread + Math.cos(i) * k * 6, oy + k * up * (1.2 - k), oz + (R() - .5) * spread + Math.sin(i * 1.7) * k * 6); d.scale.setScalar(0.45 * (1 - k) + 0.1); }); sparks2.userData.place((i, d) => { const R = rng(i + 91); const k = ((gT * (1.1 + R()) + R()) % 1); d.position.set(ox + (R() - .5) * spread * 2 + Math.cos(i * 2.3) * k * 9, oy + k * up * 1.4 * (1.1 - k), oz + (R() - .5) * spread * 2 + Math.sin(i * 0.7) * k * 9); d.scale.setScalar(0.55 * (1 - k) + 0.1); }); }
  function steamFX(x, y, z, w, d, n) { steam.userData.place((i, dd) => { const R = rng(i + 51); if (i > n) return false; const k = ((gT * 0.35 + R()) % 1); dd.position.set(x + (R() - .5) * w + k * 4, y + 2 + k * 16, z + (R() - .5) * d); dd.scale.setScalar(0.5 + k * 2.2); }); }
  function smokeAll() { chSmoke.userData.place((i, d) => { const R = rng(i + 3); const k = ((gT * 0.12 + R()) % 1); d.position.set(CHX + k * 60 + (R() - .5) * 6 * (1 + k * 3), 124 + k * 40, CHZ + (R() - .5) * 6 * (1 + k * 3) + k * 10); d.scale.setScalar(3 + k * 10); });
    kSmoke.userData.place((i, d) => { const R = rng(i + 5); const kn = kilns[i % kilns.length]; const k = ((gT * 0.18 + R()) % 1); d.position.set(kn.position.x + k * 12 + (R() - .5) * 2, 8 + k * 30, kn.position.z + (R() - .5) * 3); d.scale.setScalar(1.6 + k * 5); }); redLight.visible = (gT % 1.4) < 0.7; }
  function conveyorFeed(fast) { const sp = fast ? 0.09 : 0.05; [feedOre, feedCoal, feedLime].forEach((P, j) => P.userData.place((i, d) => { const u = ((gT * sp + i / 36 + j / 108) % 1); d.position.set(lerp(EA[0], EB[0], u), lerp(EA[1], EB[1], u) + 3.2, lerp(EA[2], EB[2], u) + ((i + j) % 3 - 1) * 1.1); d.rotation.set(i, j, 0); })); }
  function ladleAt(x, y, z, tilt, fill) { ladle.position.set(x, y, z); ladleBody.rotation.z = tilt; melt.position.y = lerp(-5.4, 5.2, fill); melt.scale.x = melt.scale.z = lerp(5.5, 6.3, fill); crust.position.y = melt.position.y + 0.35; melt.visible = crust.visible = fill > 0.02; }
  function craneAt(bx, tz, hookY) { bridge.position.x = bx; trolley.position.z = tz; hook.position.set(bx, hookY, tz); const L = CRY + 1.8 + 1.8 - hookY; cables.forEach(c => { c.scale.y = L; c.position.y = -L / 2; }); beacon.material = bmat(((gT * 3) % 1) < 0.5 ? '#ff8a1a' : '#5a2a0a'); }
  function sirenOn(on) { sirens.forEach((s, i) => { s.l.material = bmat(on && ((gT * 4 + i * 0.25) % 1) < 0.5 ? '#ff2020' : '#4a1010'); s.l.rotation.y = gT * 8; }); }
  function ingotsAt(fillK, cool) { const d = new T3.Object3D(); const hotC = new T3.Color(HOT2), midC = new T3.Color('#e8501a'), cold = new T3.Color('#6e7076');
    for (let i = 0; i < NI; i++) { const row = i % 2, j = Math.floor(i / 2); const u = ((j / 26) + gT * 0.012) % 1; const x = lerp(LG0[0], LG1[0], u), y = lerp(LG0[1], LG1[1], u); d.position.set(x, y + 0.9, FZ + 70 + (row ? 2 : -2)); d.rotation.set(0, 0, -0.11); d.scale.set(2.4, 0.9, 3); d.updateMatrix(); molds.setMatrixAt(i, d.matrix);
      const filled = u < 0.05 ? fillK : 1; d.position.y = y + 1.45; d.scale.set(2.0 * (filled > 0.3 ? 1 : 0.001), 0.5, 2.5); d.updateMatrix(); ingots.setMatrixAt(i, d.matrix);
      const c = clamp((u - 0.05) / 0.85) * cool; tmpC.copy(hotC).lerp(midC, clamp(c * 2)).lerp(cold, clamp(c * 2 - 1)); ingots.setColorAt(i, tmpC); }
    molds.instanceMatrix.needsUpdate = true; ingots.instanceMatrix.needsUpdate = true; ingots.instanceColor.needsUpdate = true; }

  // ---------- câmeras ----------
  const C = {
    hook: { a: [GX + 3.5, 5.2, GZ + 14], b: [GX + 2, 4.8, GZ + 11], l: [GX, 4.2, GZ + 2], sky: 'day' },
    intro: { a: [GX + 8, 7, GZ + 26], b: [GX + 5, 6, GZ + 20], l: [GX, 6.5, GZ + 2], sky: 'day' },
    q_portao: { a: [GX - 6, 5, GZ + 16], b: [GX - 2, 6, GZ + 18], l: [GX, 5, GZ - 6], sky: 'day' },
    mina: { a: [MX + 90, 80, MZ + 120], b: [MX + 70, 64, MZ + 100], l: [MX, 4, MZ], sky: 'day' },
    furos: { a: [MX + 6, 14, MZ + 18], b: [MX + 2, 12, MZ + 14], l: [MX - 16, 4, MZ - 12], sky: 'day' },
    boom: { a: [MX + 16, 22, MZ + 34], b: [MX + 20, 26, MZ + 40], l: [MX - 16, 6, MZ - 14], sky: 'day' },
    caminhao: { a: [MX + 70, 18, MZ + 150], b: [MX + 90, 16, MZ + 146], l: [MX + 40, 6, MZ + 98], sky: 'day' },
    pneu: { a: [MX + 76, 5, MZ + 128], b: [MX + 73, 5.5, MZ + 123], l: [MX + 64, 5, MZ + 106], sky: 'day' },
    britador: { a: [BX + 30, 34, BZ + 52], b: [BX + 40, 30, BZ + 44], l: [BX + 14, 10, BZ], sky: 'day' },
    pelotas: { a: [BX + 70, 34, BZ + 54], b: [BX + 86, 30, BZ + 46], l: [BX + 70, 4, BZ], sky: 'day' },
    tambor: { a: [BX + 122, 18, BZ + 30], b: [BX + 128, 16, BZ + 26], l: [BX + 110, 9, BZ], sky: 'day' },
    carvao: { a: [CX + 70, 40, CZ + 80], b: [CX + 50, 32, CZ + 64], l: [CX - 4, 6, CZ], sky: 'warm' },
    carvao2: { a: [CX + 64, 24, CZ + 72], b: [CX + 58, 21, CZ + 66], l: [CX + 40, 5, CZ + 30], sky: 'warm' },
    forno_intro: { a: [FX + 30, 6, FZ + 110], b: [FX + 20, 30, FZ + 120], l: [FX, 52, FZ], sky: 'day' },
    forno_fora: { a: [FX + 80, 50, FZ + 90], b: [FX + 100, 60, FZ + 40], l: [FX, 50, FZ - 10], sky: 'day' },
    chamine: { a: [FX + 100, 60, FZ + 40], b: [FX + 104, 90, FZ + 36], l: [CHX, 110, CHZ], sky: 'day' },
    esteira: { a: [FX - 140, 16, FZ + 40], b: [FX - 40, 76, FZ + 40], l: [FX - 30, 64, FZ], sky: 'day' },
    q_forno: { a: [FX + 30, 70, FZ + 190], b: [FX + 20, 66, FZ + 170], l: [FX - 20, 44, FZ - 10], sky: 'day' },
    sopro: { a: [FX - 44, FL + 22, FZ + 40], b: [FX - 38, FL + 18, FZ + 34], l: [FX - 8, FL + 8, FZ], sky: 'warm' },
    dentro: { a: [FX + 30, 40, FZ + 60], b: [FX + 26, 30, FZ + 52], l: [FX, 36, FZ], sky: 'dark' },
    q_calor: { a: [FX - 26, FL + 9, FZ + 64], b: [FX - 22, FL + 9, FZ + 60], l: [FX - 26, FL + 7, FZ + 40], sky: 'warm' },
    corrida: { a: [FX + 20, FL + 24, FZ + 80], b: [FX + 10, FL + 18, FZ + 70], l: [FX, FL + 4, FZ + 24], sky: 'dusk' },
    furo: { a: [FX + 12, FL + 8, FZ + 38], b: [FX + 8, FL + 7, FZ + 34], l: [FX, FL + 3, FZ + 16], sky: 'dusk' },
    bica: { a: [FX + 22, FL + 18, FZ + 66], b: [FX + 14, FL + 14, FZ + 58], l: [FX, FL + 1, FZ + 30], sky: 'dusk' },
    escoria: { a: [FX + 30, FL + 16, FZ + 54], b: [FX + 26, FL + 14, FZ + 50], l: [FX + 8, FL + 1, FZ + 31], sky: 'dusk' },
    panela: { a: [FX + 16, 34, FZ + 42], b: [FX + 12, 32, FZ + 45], l: [FX, 8, FZ + 64], sky: 'dusk' },
    ponte: { a: [FX + 44, 16, FZ + 122], b: [FX + 36, 14, FZ + 114], l: [FX + 12, 28, FZ + 64], sky: 'dusk' },
    cabine: { a: [FX - 6, 36, FZ + 100], b: [FX - 4, 36, FZ + 97], l: [FX + 10, 40, FZ + 77], sky: 'dusk' },
    vira: { a: [FX + 104, 34, FZ + 122], b: [FX + 96, 30, FZ + 114], l: [FX + 70, 18, FZ + 70], sky: 'dusk' },
    lingotes: { a: [FX + 100, 50, FZ + 128], b: [FX + 106, 48, FZ + 126], l: [FX + 104, 4, FZ + 64], sky: 'warm' },
    q_trabalha: { a: [FX + 6, FL + 10, FZ + 74], b: [FX + 2, FL + 9, FZ + 70], l: [FX, FL + 4, FZ + 38], sky: 'warm' },
    conversor: { a: [SX + 26, 30, SZ + 60], b: [SX + 18, 26, SZ + 50], l: [SX, 22, SZ], sky: 'dusk' },
    aco: { a: [SX + 10, 22, SZ + 36], b: [SX + 14, 20, SZ + 31], l: [SX + 10, 10, SZ], sky: 'dusk' },
    lamina: { a: [RX + 20, 26, RZ + 50], b: [RX + 70, 24, RZ + 56], l: [RX + 50, 4, RZ + 10], sky: 'day' },
    cidade: { a: [TX - 30, 24, TZ + 70], b: [TX + 10, 20, TZ + 66], l: [TX, 5, TZ + 10], sky: 'day' },
    final: { a: [GX + 5, 6, GZ + 20], b: [GX + 9, 9, GZ + 30], l: [GX, 6, GZ + 2], sky: 'day' },
  };
  const BIG = { mina: 1, caminhao: 1, britador: 1, pelotas: 1, carvao: 1, forno_intro: 1, esteira: 1, sopro: 1, corrida: 1, ponte: 1, lingotes: 1, conversor: 1, lamina: 1 };

  // ---------- ações de cada plano ----------
  const A = {
    hook(lt) { bar.visible = true; hostPose({ armL: -1.25, armR: -1.25, armLz: 0.25, armRz: -0.05, headX: 0.3, headY: Math.sin(gT) * 0.1 }); rock.visible = lt > 0.9; const k = eBack(prog(lt, 0.9, 1.4)); rock.scale.setScalar(Math.max(0.001, 1.6 * k)); rock.position.set(GX - 2.6, 6.6 + Math.sin(gT * 2) * 0.3, GZ + 5); rock.rotation.set(gT, gT * 0.7, 0); },
    intro() { bar.visible = false; hostPose({ armR: -0.2, armRz: 2.5 + Math.sin(gT * 9) * 0.4, headY: Math.sin(gT) * 0.15 }); },
    q_portao(lt) { bar.visible = true; hostPose({ armL: -1.25, armR: -1.25, armLz: 0.25, headY: 0.4 + Math.sin(gT) * 0.2, headX: -0.1 }); },
    mina() { },
    furos(lt, T) { mast.rotation.x = 0; bit.position.y = -1 - ((gT * 2) % 1) * 1.4; dust.userData.place((i, d) => { const R = rng(i + 3); const k = ((gT * 0.8 + R()) % 1); if (i > 50) return false; d.position.set(MX - 12 + (R() - .5) * 3, 0.5 + k * 3, MZ - 7 + (R() - .5) * 3); d.scale.setScalar(0.3 + k * 0.6); }); wires.visible = lt > T * 0.5; },
    boom(lt, T) { wires.visible = lt < 0.5; const k = prog(lt, 0.4, 2.6); if (lt > 0.4) { fx.shake = Math.max(0, 0.8 * (1 - k * 2)); fx.flash = Math.max(0, 0.6 - k * 3); boom.userData.place((i, d) => { const R = rng(i + 5); const hh = holes[i % 12].position; const v = 10 + R() * 18; d.position.set(hh.x + (R() - .5) * 2 + Math.cos(i) * v * k, 1 + v * k * (1.4 - k * 1.2), hh.z + Math.sin(i * 1.3) * v * k); d.scale.setScalar(1.3 * (1 - k) + 0.2); }); dust2.userData.place((i, d) => { const R = rng(i + 7); if (i > 50) return false; const hh = holes[i % 12].position; d.position.set(hh.x + (R() - .5) * 8 * (1 + k * 3), 2 + k * 22 * R(), hh.z + (R() - .5) * 8 * (1 + k * 3)); d.scale.setScalar(1.2 + k * 3); }); } },
    caminhao(lt, T) { trucks.forEach((tr, i) => { tr.visible = true; tr.position.set(MX + 30 + lt * 7 - i * 34, 0, MZ + 100); tr.rotation.y = 0; tr.userData.tires.forEach(t => t.rotation.z = -lt * 2.2); }); dust.userData.place((i, d) => { const R = rng(i + 9); const tr = trucks[i % 3]; const k = ((gT * 0.9 + R()) % 1); d.position.set(tr.position.x - 8 - k * 10, 0.6 + k * 3, MZ + 100 + (R() - .5) * 8); d.scale.setScalar(0.6 + k * 1.8); }); },
    pneu(lt) { trucks[0].position.set(MX + 60, 0, MZ + 102); trucks[0].rotation.y = 0; trucks[0].userData.load.visible = true; trucks[1].visible = trucks[2].visible = false; tireGuy.h.visible = true; tireGuy.modeNow = lt > 1.6 ? 'point' : 'look'; },
    britador(lt) { jawL.position.x = -2.4 + Math.sin(gT * 8) * 0.5; jawR.position.x = 2.4 - Math.sin(gT * 8) * 0.5; millDrum.rotation.x = gT * 1.4;
      oreBits.userData.place((i, d) => { const R = rng(i + 2); if (i < 30) { const k = ((gT * 0.6 + i / 30) % 1); d.position.set(BX + (R() - .5) * 6, 26 - k * 12, BZ + (R() - .5) * 6); d.scale.setScalar(1.6 - k * 0.6); } else { const u = ((gT * 0.08 + i / 40) % 1); d.position.set(lerp(cv1.a[0], cv1.b[0], u), lerp(cv1.a[1], cv1.b[1], u) + 1, cv1.a[2] + ((i % 3) - 1) * 0.6); d.scale.setScalar(0.6); } d.rotation.set(i, gT, 0); });
      dust.userData.place((i, d) => { const R = rng(i + 13); const k = ((gT * 0.5 + R()) % 1); d.position.set(BX + (R() - .5) * 10 + k * 6, 18 + k * 12, BZ + (R() - .5) * 10); d.scale.setScalar(1 + k * 3); }); },
    pelotas(lt) { millDrum.rotation.x = gT * 1.4; tanks.forEach((a, i) => a.rotation.y = gT * 0.4 * (i ? -1 : 1)); drumR.rotation.x = gT * 1.2;
      water.userData.place((i, d) => { const R = rng(i + 21); const tk = i % 2 ? tanks[0].parent : tanks[1].parent; const a = R() * 6.28, r = 11; const k = ((gT * 0.8 + R()) % 1); d.position.set(tk.position.x + Math.cos(a) * r, 5 - k * 4, tk.position.z + Math.sin(a) * r); });
      pellets.userData.place((i, d) => { const R = rng(i + 23); const k = ((gT * 0.4 + i / 140) % 1); if (k < 0.7) { const kk = k / 0.7; const a = gT * 1.2 + R() * 6; d.position.set(BX + 98 + kk * 20, 11 - 2.4 * kk + Math.sin(a) * 3.6 - 1.6, BZ + Math.cos(a) * 3.6); } else { const kk = (k - 0.7) / 0.3; d.position.set(BX + 118 + kk * 12, 9 - kk * 6, BZ + (R() - .5) * 3); } d.scale.setScalar(0.9); }); },
    carvao() { },
    carvao2(lt) { coalFire.userData.place((i, d) => { const R = rng(i + 31); const k = ((gT * 0.9 + R()) % 1); d.position.set(CX + 30 + (R() - .5) * 10 * (1 - k), 4 + k * 8, CZ + 30 + (R() - .5) * 10 * (1 - k)); d.scale.setScalar(0.9 * (1 - k) + 0.2); });
      oxy.userData.place((i, d) => { const R = rng(i + 33); const k = ((gT * 0.5 + i / 40) % 1); d.position.set(lerp(CX + 50, CX + 30, k) + (R() - .5) * 4, 4 + Math.sin(k * Math.PI) * 8 + R() * 2, CZ + 30 + (R() - .5) * 4); d.scale.setScalar(0.9); }); },
    forno_intro() { }, forno_fora() { }, chamine() { },
    esteira(lt, T) { conveyorFeed(true); insideFall.userData.place((i, d) => { const R = rng(i + 41); const k = ((gT * 0.7 + i / 30) % 1); d.position.set(FX + (R() - .5) * 4, FL + 68 - k * 10, FZ + (R() - .5) * 4); d.rotation.set(i, gT, 0); if (lt < T * 0.5) return false; }); },
    q_forno() { },
    sopro(lt) { hotAir.userData.place((i, d) => { const R = rng(i + 61); const k = ((gT * 0.5 + i / 90) % 1); if (i < 45) { d.position.set(lerp(FX - 46, FX + 2, k), 12 + (R() - .5) * 1.4, FZ - 30 + (R() - .5) * 1.4); } else { const a = (i / 45) * Math.PI * 2 + gT * 0.4; d.position.set(FX + Math.cos(a) * lerp(19, 13.6, k), FL + lerp(9, 4.6, k), FZ + Math.sin(a) * lerp(19, 13.6, k)); } d.scale.setScalar(0.9); }); tuyeres.forEach((t, i) => t.material = bmat(((gT * 3 + i * 0.13) % 1) < 0.5 ? HOT2 : '#fff2c0')); },
    dentro(lt, T) { shellMat.opacity = lerp(1, 0.16, eIO(prog(lt, 0, 0.8))); shellMat.depthWrite = shellMat.opacity > 0.9; bands.forEach(b => b.visible = false); inner.visible = true; inner.children.forEach((m, i) => { if (i < 12) m.position.y = 54 - i * 3.4 - ((gT * 1.2) % 3.4); });
      drops.userData.place((i, d) => { const R = rng(i + 71); const k = ((gT * 0.6 + i / 80) % 1); const a = R() * 6.28, r = R() * 9; d.position.set(FX + Math.cos(a) * r, FL + 18 - k * 13, FZ + Math.sin(a) * r); d.scale.set(0.5, 1.2, 0.5); });
      hotAir.userData.place((i, d) => { const R = rng(i + 63); const k = ((gT * 0.8 + i / 90) % 1); const a = (i % 12) / 12 * Math.PI * 2; d.position.set(FX + Math.cos(a) * lerp(13, 3, k), FL + 4.6 + k * 10 * R(), FZ + Math.sin(a) * lerp(13, 3, k)); d.scale.setScalar(0.8); }); tapLight.intensity = 50; },
    q_calor(lt) { ops[1].modeNow = 'point'; heatHaze.userData.place((i, d) => { const R = rng(i + 81); const k = ((gT * 0.5 + R()) % 1); d.position.set(FX - 14 + R() * 28, FL + 1 + k * 14, FZ + 16 + R() * 30); }); ironFlow(1); sparkFX(80, FX, FL + 2, FZ + 14, 2, 8); },
    corrida(lt, T) { sirenOn(true); fx.red = 0.12 + 0.08 * Math.sin(gT * 8); const k = eOut(prog(lt, 0.2, T * 0.8)); setWalk(castCrew, k < 1 ? 'run' : 'look'); castCrew.forEach((w) => { const s = w.x > FX ? 1 : -1; w.h.position.x = w.x + s * k * 7; w.h.rotation.y = k < 1 ? (s > 0 ? Math.PI / 2 : -Math.PI / 2) : (s > 0 ? -Math.PI / 2 : Math.PI / 2); }); },
    furo(lt, T) { sirenOn(true); const open = lt > T * 0.6; drillArm.rotation.y = -0.45; drillArm.position.x = 0; if (!open) sparkFX(90, TAP[0], TAP[1], TAP[2] + 1, 0.6, 6); else { ironFlow(prog(lt, T * 0.6, T) * 0.25); sparkFX(240, TAP[0], TAP[1], TAP[2] + 2, 1.2, 10); fx.flash = Math.max(0, 0.35 - (lt - T * 0.6) * 1.2); } },
    bica(lt, T) { ironFlow(clamp(0.25 + eOut(prog(lt, 0, T * 0.8)) * 0.75)); const z = FZ + 13 + clamp(0.25 + prog(lt, 0, T * 0.8) * 0.75) * 42; sparkFX(240, FX, FL + 1.5, (FZ + 14 + z) / 2, 2, 10); steamFX(FX, FL + 2, FZ + 34, 6, 30, 18); },
    escoria(lt, T) { ironFlow(1); slagFlow(eOut(prog(lt, 0.3, T * 0.8))); castCrew[0].modeNow = 'rake'; sparkFX(160, FX + 2, FL + 1.5, FZ + 31, 3, 8); steamFX(FX + 10, FL + 1, FZ + 31, 16, 4, 22); },
    panela(lt, T) { ironFlow(1); slagFlow(1); ladleAt(FX, 2, FZ + 62, 0, lerp(0.1, 0.85, eIO(prog(lt, 0, T)))); spout.visible = true; spout.scale.y = 7 + Math.sin(gT * 18) * 0.3; sparkFX(200, FX, 12, FZ + 60, 2.5, 9); steamFX(FX, 12, FZ + 62, 10, 10, 50); craneAt(FX + 60, FZ + 62, 30); },
    ponte(lt, T) { const k1 = eIO(prog(lt, 0, T * 0.4)), k2 = eIO(prog(lt, T * 0.45, T)); const ly = 2 + k2 * 10; const bx = lerp(FX + 50, FX, k1); craneAt(bx, FZ + 62, lt < T * 0.4 ? lerp(38, ly + 22, k1) : ly + 22); ladleAt(FX, ly, FZ + 62, 0, 0.9); },
    cabine(lt, T) { const k = eIO(prog(lt, 0, T)); craneAt(FX + k * 20, FZ + 62, 34 + k * 2); ladleAt(FX + k * 20, 12 + k * 2, FZ + 62, 0, 0.9); setWalk([operator], 'drive'); operator.h.userData.P.armL.rotation.x = -1.1 + Math.sin(gT * 6) * 0.2; },
    vira(lt, T) { sirenOn(true); const k1 = eIO(prog(lt, 0, T * 0.35)), k2 = eIO(prog(lt, T * 0.35, T * 0.9)); const bx = lerp(FX + 20, FX + 64, k1); const bz = lerp(FZ + 62, FZ + 70, k1); craneAt(bx, bz, 36); ladleAt(bx, 14, bz, -1.25 * k2, lerp(0.9, 0.35, k2)); setWalk(groundCrew, lt < T * 0.5 ? 'run' : 'look'); groundCrew.forEach((w, i) => { w.h.position.z = w.z + eOut(prog(lt, 0, T * 0.5)) * 14; w.h.rotation.y = lt < T * 0.5 ? 0 : Math.PI; });
      pour.visible = k2 > 0.25; pour.position.set(bx + 7.6, 12.5, bz); pour.scale.set(1.4, 7, 1.4); troughMelt.visible = k2 > 0.3; ingotsAt(clamp(k2 * 2 - 0.4), 1); sparkFX(180, bx + 7.5, 10, FZ + 69, 2, 7); steamFX(FX + 110, 10, FZ + 70, 50, 8, 70); },
    lingotes(lt) { ingotsAt(1, 1); troughMelt.visible = true; steamFX(FX + 112, 11, FZ + 70, 60, 8, 20); train.position.x = FX + 80 + ((lt * 9) % 400); fork.position.x = FX + 170 - Math.sin(gT * 0.6) * 12; fork.userData.pal.position.y = 1.2 + (Math.sin(gT * 0.6) + 1) * 1.5; },
    q_trabalha() { allCrew.forEach(w => w.modeNow = 'wave'); ironFlow(1); },
    conversor(lt, T) { convBody.rotation.z = 0; lance.position.y = lerp(0, -8, eIO(prog(lt, 0, 1.2))); convLight.intensity = 90 + Math.sin(gT * 15) * 20; fx.shake = 0.08;
      flame.userData.place((i, d) => { const R = rng(i + 91); const k = ((gT * 1.3 + R()) % 1); d.position.set(SX + (R() - .5) * 6 * (1 + k), 26 + k * 18, SZ + (R() - .5) * 6 * (1 + k)); d.scale.setScalar(1.6 * (1 - k) + 0.3); }); flame2.userData.place((i, d) => { const R = rng(i + 93); const k = ((gT * 1.6 + R()) % 1); d.position.set(SX + (R() - .5) * 3, 25 + k * 10, SZ + (R() - .5) * 3); });
      steelSparks.userData.place((i, d) => { const R = rng(i + 95); const k = ((gT * 1.1 + R()) % 1); d.position.set(SX + Math.cos(i) * k * 22, 26 + k * 16 * (1.3 - k), SZ + Math.sin(i * 1.3) * k * 22); }); },
    aco(lt, T) { const k = eIO(prog(lt, 0, 1.4)); convBody.rotation.z = -1.6 * k; convLight.intensity = 90; lance.position.y = 10; steelStream.visible = k > 0.8; steelStream.scale.y = 8 + Math.sin(gT * 20) * 0.3; steelMelt.position.y = lerp(1, 9, prog(lt, 1.2, T)); steelSparks.userData.place((i, d) => { const R = rng(i + 97); const k2 = ((gT * 1.1 + R()) % 1); if (k < 0.8) return false; d.position.set(SX + 14 + Math.cos(i) * k2 * 9, 10 + k2 * 8 * (1.3 - k2), SZ + Math.sin(i * 1.3) * k2 * 9); }); },
    lamina(lt, T) { const u = (lt / T); const x = RX + u * 100; slab.position.x = x; const s = Math.min(1, u * 1.3); slab.scale.set(14 + s * 30, lerp(2.4, 0.6, s), 5); slab.position.y = 4.8 + slab.scale.y / 2; slab.material = bmat(tmpC.set(HOT).lerp(ca.set('#c84a2a'), s).getStyle()); steamFX(RX + 50, 6, RZ, 90, 4, 40); },
    cidade(lt) { car2.position.x = TX - 60 + ((lt * 10) % 90); },
    final(lt) { bar.visible = true; hostPose({ armL: -0.2, armLz: -2.5 - Math.sin(gT * 9) * 0.4, armR: -1.25, armRz: -0.05, headY: Math.sin(gT) * 0.15 }); },
  };

  const flashEl = document.getElementById('mundo-flash'), tintEl = document.getElementById('mundo-tint'), greyEl = document.getElementById('mundo-glitch');
  function frame(t) {
    gT = t; let idx = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) idx = i;
    const sh = SHOTS[idx], prev = SHOTS[Math.max(0, idx - 1)]; const c = C[sh.id] || C.intro, pc = C[prev.id] || c;
    const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    for (const k in fx) fx[k] = 0;
    PARTS.forEach(p => p.visible = false); OPT.forEach(o => o.visible = false);
    // estado padrão
    bar.visible = false; hostPose({ headY: Math.sin(gT * 1.1) * 0.2, armL: -0.1 }); shellMat.opacity = 1; shellMat.depthWrite = true; bands.forEach(b => b.visible = true);
    ironFlow(0); slagFlow(0); spout.visible = false; sirenOn(false); tapLight.intensity = 0; convLight.intensity = 0; troughMelt.visible = false; steelStream.visible = false;
    ladleAt(FX, 2, FZ + 62, 0, 0); craneAt(FX + 70, FZ + 66, 32); ingotsAt(1, 1); convBody.rotation.z = 0; lance.position.y = 8; steelMelt.position.y = 1;
    train.position.x = FX + 150; fork.position.x = FX + 170; fork.userData.pal.position.y = 1.2; slab.position.set(RX + 4, 6, RZ); slab.scale.set(14, 2.4, 5); slab.material = bmat(HOT); car2.position.x = TX - 18;
    drillArm.rotation.y = 0; millDrum.rotation.x = gT * 1.4; drumR.rotation.x = gT * 1.2; tanks.forEach((a, i) => a.rotation.y = gT * 0.4 * (i ? -1 : 1)); jawL.position.x = -2.4 + Math.sin(gT * 8) * 0.5; jawR.position.x = 2.4 - Math.sin(gT * 8) * 0.5;
    trucks.forEach((tr, i) => { const u = (gT * 0.035 + i * 0.33) % 1; const [x, y, z, ry] = truckPath(u); tr.position.set(x, y, z); tr.rotation.y = ry; tr.userData.tires.forEach(tt => tt.rotation.z = -gT * 2); tr.userData.load.visible = true; tr.visible = u > 0.02 && u < 0.97; });
    WK.forEach(w => { if (!w.path) { w.h.position.set(w.x, w.y, w.z); w.h.rotation.y = w.ry; } });
    groundCrew.forEach(w => { w.h.position.z = w.z; w.h.rotation.y = w.ry; });
    sky(pc.sky, c.sky, idx === 0 ? 1 : eIO(prog(lt, 0, 1.2)));
    smokeAll(); conveyorFeed(false);
    (A[sh.id] || (() => {}))(lt, T);
    poseWorkers();
    clouds.forEach((cl, i) => { cl.position.x = cl.userData.x0 + ((t * cl.userData.sp + i * 30) % 160) - 80; });
    birds.forEach((b, i) => { const u2 = ((t * 0.03 + i * 0.13) % 1); b.position.set(-200 + u2 * 700 + Math.floor(i / 2) * 4, 60 + Math.sin(t + i) * 2, -60 + (i % 3) * 6); b.rotation.y = -1.5; const f = Math.sin(t * 9 + b.userData.ph) * 0.6; b.userData.wl.rotation.z = f; b.userData.wr.rotation.z = -f; });
    const u = eIO(clamp(lt / T)); let P = L3(c.a, c.b, u), Lk = c.l.slice();
    if (idx > 0) { const d = Math.hypot(c.a[0] - pc.b[0], c.a[1] - pc.b[1], c.a[2] - pc.b[2]); const tr = Math.min(T * 0.7, 0.5 + d / 260); const k = eIO(clamp(lt / tr)); if (k < 1) { P = L3(pc.b, P, k); Lk = L3(pc.l, c.l, k); if (d > 140) P[1] += Math.sin(k * Math.PI) * Math.min(150, d * 0.18); } }
    const sw = 0.25 + Math.hypot(P[0] - Lk[0], P[1] - Lk[1], P[2] - Lk[2]) * 0.006; P[0] += Math.sin(t * 0.7) * sw; P[1] += Math.sin(t * 1.1) * sw * 0.5; cam.position.set(P[0], P[1], P[2]); cam.lookAt(Lk[0], Lk[1], Lk[2]); if (cam.fov !== 50) { cam.fov = 50; cam.updateProjectionMatrix(); }
    if (fx.shake) { cam.position.x += Math.sin(t * 87) * fx.shake; cam.position.y += Math.cos(t * 71) * fx.shake; }
    cam.updateMatrixWorld(); if (BIG[sh.id]) bigHost(lt); clouds.forEach(cl => { cl.visible = cl.position.distanceTo(cam.position) > 120; });
    renderer.render(scene, cam);
    flashEl.style.opacity = fx.flash.toFixed(3);
    tintEl.style.background = fx.red ? '#ff0020' : '#000'; tintEl.style.mixBlendMode = fx.red ? 'multiply' : 'normal'; tintEl.style.opacity = fx.red ? fx.red : Math.min(1, fx.black);
    greyEl.style.opacity = 0;
  }
  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter', '900 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    const tl = gsap.timeline({ paused: true }); const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    PANELS.forEach(pp => pp.userData.set({})); frame(0); window.__timelines['mundo'] = tl;
  });
})();

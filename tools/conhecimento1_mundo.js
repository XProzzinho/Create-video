  // ===================== O ÚLTIMO CONHECIMENTO — CAPÍTULO 1 EM 3D (toon/anime) =====================
  // __PERSONAGENS__
  const ROOF = new T3.ConeGeometry(1, 1, 4);
  // __ICONES__
  const ICOLS = ['#5ad0ff', '#ffd23c', '#7aff9a', '#ff7a9a', '#c89aff', '#ffb04a'];
  const motes = particles(world, 220, '#ffffff', 0.04), sand = particles(world, 520, '#fff2c8', 0.035), snow = particles(world, 420, '#ffffff', 0.05), smoke = particles(world, 90, '#c8c8d4', 0.35), bubbles = particles(world, 40, '#cfefff', 0.09);
  const v3 = new T3.Vector3();
  function headOf(c) { c.updateMatrixWorld(true); c.userData.P.head.getWorldPosition(v3); return [v3.x, v3.y + 0.13 * c.scale.y, v3.z]; }
  function place(c, x, y, z, ry) { c.visible = true; c.position.set(x, y, z); c.rotation.set(0, ry || 0, 0); }

  // ---------- VAZIO BRANCO (x=0) ----------
  const voidG = grp(world, 0, 0, 0);
  const shards = []; for (let i = 0; i < 26; i++) { const R = rng(i + 70); const m = part(voidG, ICO, ['#ffffff', '#f4ead0', '#dfe8ff'][i % 3], (R() - .5) * 30, -4 + R() * 12, -6 - R() * 26, 0.15 + R() * 0.5, 0.15 + R() * 0.5, 0.15 + R() * 0.5); m.userData.y0 = m.position.y; m.userData.sp = 0.3 + R(); shards.push(m); }
  const halo = new T3.Mesh(new T3.TorusGeometry(1, 0.025, 8, 90), gm('#f0c860')); voidG.add(halo); opt(halo);
  const halo2 = new T3.Mesh(new T3.TorusGeometry(1.3, 0.012, 8, 90), gm('#ffe8a8')); voidG.add(halo2); opt(halo2);
  const aura = opt(glowSpr(voidG, 0, 0, 0, 6, '#ffd890', 0.8)); const gemBurst = opt(glowSpr(voidG, 0, 0, 0, 3, '#7ac8ff', 1));
  const rays = []; for (let i = 0; i < 12; i++) { const m = new T3.Mesh(new T3.ConeGeometry(0.6, 14, 12, 1, true), new T3.MeshBasicMaterial({ color: '#ffe8b0', transparent: true, opacity: 0.12, blending: T3.AdditiveBlending, depthWrite: false, side: T3.DoubleSide, toneMapped: false })); const g = opt(grp(voidG)); m.position.y = 7; g.add(m); g.rotation.z = i * 0.5236; rays.push(g); }

  // ---------- PERSONAGENS ----------
  const leo = makeChar(Object.assign({}, LEOC, { hoodie: true, ph: 0.3 })); opt(leo);
  const ELY = { skin: '#f8dcc8', hairStyle: 'long', hairC: '#f0f0fa', top: '#f6f4fc', top2: '#e2c27a', pants: '#f6f4fc', shoe: '#e2c27a', sole: '#c8a860', iris: '#e8a018', ph: 1.1 };
  const ely = makeChar(ELY); opt(ely);
  { const P = ely.userData.P; const hr = 0.14, hc = '#f0f0fa', gold = '#e2c27a';
    part(P.hips, CONE, '#f6f4fc', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03); const hem = part(P.hips, TOR, gold, 0, -0.9, 0, 0.36, 0.36, 0.5); hem.rotation.x = Math.PI / 2;
    part(P.spine, BOX, gold, 0, 0.3, 0.12, 0.05, 0.42, 0.02); part(P.spine, SPH, '#4ab0ff', 0, 0.48, 0.13, 0.03, 0.03, 0.02, 0, true);
    part(P.head, CAP, hc, 0, -0.16, -0.09, hr * 2.2, hr * 3.0, hr * 1.3, 0.03);
    [-1, 1].forEach(s => part(P.head, CAP, hc, s * hr * 0.97, -0.02, 0.03, hr * 0.42, hr * 1.9, hr * 0.42, 0.03));
    for (let i = 0; i < 7; i++) { const a = -0.75 + i * 0.25; const c = part(P.head, CONE, gold, Math.sin(a) * hr * 0.95, 0.27 + (i === 3 ? 0.03 : 0), Math.cos(a) * hr * 0.55, 0.014, i === 3 ? 0.09 : 0.05, 0.014, 0, true); c.rotation.z = -a * 0.6; }
    [-1, 1].forEach(s => { const w = part(P.head, CONE, gold, s * hr * 1.05, 0.2, -0.02, 0.02, 0.16, 0.05, 0, true); w.rotation.z = -s * 1.0; });
    const staff = grp(P.elL, 0, -0.29, 0.03); part(staff, CYL, '#ece0b8', 0, 0.2, 0, 0.018, 1.75, 0.018, 0.05); const ring = part(staff, TOR, gold, 0, 1.08, 0, 0.09, 0.09, 0.09); ring.rotation.x = Math.PI / 2;
    P.gem = part(staff, SPH, '#4ab0ff', 0, 1.1, 0, 0.07, 0.095, 0.07, 0, true); P.gemGlow = glowSpr(staff, 0, 1.1, 0, 0.9, '#5ab8ff', 0.9); P.staff = staff; }
  const staffSolo = opt(grp(world)); { part(staffSolo, CYL, '#ece0b8', 0, 0, 0, 0.018, 1, 0.018, 0.05); }
  const soloGem = opt(part(world, SPH, '#4ab0ff', 0, 0, 0, 0.07, 0.095, 0.07, 0, true)); const soloGlow = opt(glowSpr(world, 0, 0, 0, 1.2, '#5ab8ff', 1));
  function elyPose(o) { pose(ely, gT, o); const P = ely.userData.P; P.staff.rotation.x = -(P.shL.rotation.x + P.elL.rotation.x); P.staff.rotation.z = -(P.shL.rotation.z + P.elL.rotation.z); P.staff.visible = !o.noStaff; const k = 1 + Math.sin(gT * 3) * 0.15 + (o.gemK || 0); P.gemGlow.scale.set(0.9 * k, 0.9 * k, 1); }
  const holdStaff = { shL: [-0.35, 0, -0.15], elL: [-0.55, 0, 0] };

  // Leonardo com 12 anos (roupa medieval)
  const kidLeo = makeChar({ skin: LEOC.skin, hair: LEOC.hair, hairC: '#1c1a28', hairStyle: 'leo', top: '#8a6a40', top2: '#6a4a2a', pants: '#4a3a2a', shoe: '#3a2a1a', sole: '#2a1a10', iris: LEOC.iris, s: 0.82, ph: 0.6 }); opt(kidLeo);
  part(kidLeo.userData.P.spine, CYL, '#3a2414', 0, 0.06, 0, 0.19, 0.05, 0.14);
  // professor
  const prof = makeChar({ skin: '#ecc0a0', hairStyle: 'bald', top: '#34348a', top2: '#24246a', pants: '#34348a', shoe: '#22223a', iris: '#4a4a5a', book: true, ph: 2.1 }); opt(prof);
  { const P = prof.userData.P; part(P.hips, CONE, '#34348a', 0, -0.42, 0, 0.34, 0.98, 0.34, 0.03); const b = part(P.head, CONE, '#f0f0f0', 0, 0.0, 0.12, 0.09, 0.2, 0.05, 0.04); b.rotation.x = Math.PI; part(P.head, BOX, '#f0f0f0', 0, 0.07, 0.135, 0.12, 0.025, 0.02); tb(P.head, 0, 0.29, 0, 0.32, 0.03, 0.32, '#1a1a3a'); part(P.head, CYL, '#1a1a3a', 0, 0.26, 0, 0.12, 0.06, 0.12); [-1, 1].forEach(s => part(P.head, SPH, '#f0f0f0', s * 0.135, 0.12, -0.02, 0.03, 0.06, 0.05)); }
  // aventureira Kaela
  const kaela = makeChar({ skin: '#f2c0a0', hairStyle: 'long', hairC: '#c8402a', top: '#8a90a2', top2: '#5a6072', pants: '#4a3030', shoe: '#4a3020', iris: '#2a8a4a', ph: 3.3 }); opt(kaela);
  { const P = kaela.userData.P; [-1, 1].forEach(s => part(P.spine, SPH, '#6a7082', s * 0.22, 0.52, 0, 0.13, 0.08, 0.13, 0.05)); const sw = grp(P.spine, 0, 0.35, -0.16); sw.rotation.z = 0.7; tb(sw, 0, 0.1, 0, 0.06, 0.9, 0.02, '#d8dce8'); tb(sw, 0, -0.38, 0, 0.22, 0.04, 0.04, '#e2c27a'); tb(sw, 0, -0.48, 0, 0.04, 0.16, 0.04, '#3a2414'); part(P.head, BOX, '#c03a3a', 0.05, 0.05, 0.13, 0.05, 0.008, 0.005); part(P.spine, CYL, '#3a2414', 0, 0.06, 0, 0.19, 0.05, 0.14); }
  // mensageiro do Duque
  const mess = makeChar({ skin: '#c88a5e', hairStyle: 'short', hairC: '#2a1a14', top: '#a82a2a', top2: '#e2c27a', pants: '#2a2a3a', shoe: '#2a2026', iris: '#3a2a1a', ph: 4.4 }); opt(mess);
  { const P = mess.userData.P; const h = part(P.head, CYL, '#a82a2a', 0, 0.27, 0, 0.17, 0.03, 0.17); const f = part(P.head, CONE, '#f4f0e0', -0.1, 0.36, -0.05, 0.02, 0.2, 0.02); f.rotation.z = 0.5; part(P.spine, BOX, '#e2c27a', 0, 0.3, 0.125, 0.3, 0.04, 0.02); const sc = grp(P.elR, 0, -0.32, 0.06); const roll = part(sc, CYL, '#f4ead0', 0, 0, 0, 0.035, 0.24, 0.035); roll.rotation.z = Math.PI / 2; part(sc, CYL, '#c02020', 0, 0, 0.03, 0.035, 0.012, 0.035, 0, true).rotation.x = Math.PI / 2; }
  // mãe, pai e bebê
  const mom = makeChar({ skin: '#f2b48e', hairStyle: 'long', hairC: '#6a3a1a', top: '#5a7a4a', top2: '#4a6a3a', pants: '#5a7a4a', shoe: '#3a2a1a', iris: '#4a3020', ph: 5.2 }); opt(mom);
  part(mom.userData.P.hips, CONE, '#5a7a4a', 0, -0.42, 0, 0.36, 0.98, 0.36, 0.03);
  const dad = makeChar({ skin: '#e8a880', hairStyle: 'short', hairC: '#3a2214', top: '#6a4a34', top2: '#4a3424', pants: '#3a3030', shoe: '#2a1a10', iris: '#3a2a1a', s: 1.12, ph: 6.1 }); opt(dad);
  { const P = dad.userData.P; const b = part(P.head, SPH, '#3a2214', 0, 0.03, 0.06, 0.13, 0.11, 0.1, 0.04); part(P.spine, BOX, '#3a2a20', 0, 0.25, 0.13, 0.3, 0.4, 0.02); }
  const baby = opt(grp(world)); { const bl = part(baby, CAP, '#f4f0ff', 0, 0, 0, 0.11, 0.14, 0.1, 0.04); bl.rotation.z = Math.PI / 2; part(baby, SPH, '#f6c0a0', 0.17, 0.03, 0, 0.075, 0.075, 0.075, 0.05); baby.userData.mouth = part(baby, SPH, '#7a2a2a', 0.2, 0.0, 0.065, 0.02, 0.02, 0.008); [-1, 1].forEach(s => part(baby, BOX, '#1a1018', 0.2 + s * 0.025, 0.045, 0.07, 0.025, 0.006, 0.004)); }

  // ---------- AETHERION visto de cima (x=6000) ----------
  const aeth = grp(world, 6000, 0, 0);
  tb(aeth, 0, -0.6, 0, 1200, 0.2, 1200, '#2a64b0'); part(aeth, CYL, '#e6d6a0', 0, -0.2, 0, 66, 0.6, 50); part(aeth, CYL, '#6aa850', 0, 0, 0, 64, 0.6, 48);
  { const R = rng(601); for (let i = 0; i < 18; i++) { const x = -50 + R() * 100, z = -40 + R() * 22, h = 8 + R() * 10, r = 4 + R() * 4; part(aeth, CONE, '#7a7488', x, h / 2, z, r, h, r); part(aeth, CONE, '#ffffff', x, h - h * 0.15, z, r * 0.32, h * 0.3, r * 0.32); }
    for (let i = 0; i < 90; i++) { const x = -55 + R() * 110, z = -18 + R() * 50; if (Math.hypot(x / 64, z / 48) > 0.92) continue; part(aeth, ICO, R() < 0.5 ? '#3f8a46' : '#2f7a3a', x, 1.2, z, 1 + R() * 0.8, 1.4 + R(), 1 + R() * 0.8); }
    for (let i = 0; i < 16; i++) tb(aeth, -40 + i * 5, 0.32, 18 - Math.sin(i * 0.6) * 6, 5.5, 0.05, 1.6, '#4a9ae8'); }
  function castle(x, z, s, roof) { const g = grp(aeth, x, 0, z); g.scale.setScalar(s); tb(g, 0, 1.2, 0, 6, 2.4, 6, '#c8c0b0'); [[-3, -3], [3, -3], [-3, 3], [3, 3]].forEach(([a, b]) => { part(g, CYL, '#d8d0c0', a, 2, b, 0.9, 4, 0.9); part(g, CONE, roof, a, 4.7, b, 1.1, 1.6, 1.1); }); part(g, CYL, '#e0d8c8', 0, 3, 0, 1.4, 6, 1.4); part(g, CONE, roof, 0, 6.9, 0, 1.7, 2.2, 1.7); tb(g, 0.6, 8.4, 0, 1.2, 0.6, 0.06, '#e8302a'); return g; }
  castle(-8, 4, 1.4, '#c03030'); castle(28, -8, 1.0, '#3a5ad8'); castle(-34, -6, 0.9, '#8a3ad8');
  { const R = rng(611); for (let i = 0; i < 30; i++) { const x = -30 + R() * 60, z = 8 + R() * 22; const g = grp(aeth, x, 0, z); tb(g, 0, 0.4, 0, 1, 0.8, 1, '#c89a6a'); part(g, ROOF, '#8a4a2a', 0, 1.1, 0, 0.85, 0.7, 0.85).rotation.y = Math.PI / 4; } }
  const clouds = []; { const R = rng(621); for (let i = 0; i < 14; i++) { const g = grp(aeth, -60 + R() * 120, 22 + R() * 8, -40 + R() * 70); for (let j = 0; j < 4; j++) part(g, SPH, '#ffffff', j * 2 - 3, R(), R() - .5, 2.4, 1.4, 1.8); clouds.push(g); } }
  const dragon = grp(aeth); { const red = '#c8302a', dk = '#8a1a1a', bel = '#e8b060';
    part(dragon, CAP, red, 0, 0, 0, 1.0, 1.6, 1.0, 0.04).rotation.x = Math.PI / 2; part(dragon, CAP, bel, 0, -0.3, 0, 0.8, 1.4, 0.7).rotation.x = Math.PI / 2;
    const neck = part(dragon, CAP, red, 0, 0.6, 1.6, 0.45, 1.0, 0.45, 0.04); neck.rotation.x = 0.9; const hd = grp(dragon, 0, 1.1, 2.4); tb(hd, 0, 0, 0.3, 0.7, 0.55, 1.2, red); tb(hd, 0, -0.25, 0.4, 0.6, 0.2, 1.0, dk); [-1, 1].forEach(s => { const h = part(hd, CONE, '#f4ead0', s * 0.25, 0.45, -0.2, 0.08, 0.5, 0.08); h.rotation.x = -0.7; part(hd, SPH, '#ffd23c', s * 0.3, 0.12, 0.55, 0.08, 0.06, 0.06, 0, true); });
    dragon.userData.wings = [-1, 1].map(s => { const w = grp(dragon, s * 0.7, 0.4, 0.2); const m = tb(w, s * 1.8, 0, 0, 3.6, 0.06, 1.8, dk); tb(w, s * 1.8, 0.05, 0.85, 3.6, 0.12, 0.12, red); return w; });
    let tp = dragon; const tail = []; for (let i = 0; i < 6; i++) { const g = grp(tp, 0, 0, i ? -0.55 : -1.4); part(g, SPH, red, 0, 0, 0, 0.32 - i * 0.04, 0.32 - i * 0.04, 0.45, 0.04); tail.push(g); tp = g; } part(tp, CONE, dk, 0, 0, -0.4, 0.2, 0.5, 0.06).rotation.x = -Math.PI / 2; dragon.userData.tail = tail; }
  function flyDragon(rad, h, sp) { const a = gT * sp; dragon.position.set(Math.cos(a) * rad, h + Math.sin(gT * 1.3) * 0.8, Math.sin(a) * rad - 4); dragon.rotation.set(0, -a, 0.35); dragon.userData.wings.forEach((w, i) => w.rotation.z = (i ? 1 : -1) * Math.sin(gT * 6) * 0.6); dragon.userData.tail.forEach((g, i) => g.rotation.y = Math.sin(gT * 3 - i * 0.6) * 0.25); }

  // ---------- VILA DE BRUMAFRIA (x=8000) ----------
  const vil = grp(world, 8000, 0, 0); tb(vil, 0, -0.05, 0, 300, 0.1, 300, '#e6ecf6');
  const WIN = []; const CHIM = [];
  function house(x, z, ry, w, d, col) { const g = grp(vil, x, 0, z); g.rotation.y = ry; tb(g, 0, 1.3, 0, w, 2.6, d, col); tb(g, 0, 0.15, 0, w + 0.1, 0.3, d + 0.1, '#7a7480'); [-1, 1].forEach(s => tb(g, s * w / 2, 1.3, d / 2 + 0.01, 0.18, 2.6, 0.06, '#4a3424')); tb(g, 0, 2.55, d / 2 + 0.01, w, 0.16, 0.06, '#4a3424'); const r = part(g, ROOF, '#4a3a4a', 0, 3.6, 0, w * 0.82, 2.1, d * 0.82); r.rotation.y = Math.PI / 4; const sn = part(g, ROOF, '#ffffff', 0, 3.9, 0, w * 0.6, 1.5, d * 0.6); sn.rotation.y = Math.PI / 4; tb(g, w * 0.25, 4.0, -d * 0.1, 0.5, 1.6, 0.5, '#6a5a5a'); CHIM.push([g, w * 0.25, 4.9, -d * 0.1]); tb(g, -w * 0.2, 0.75, d / 2 + 0.03, 0.8, 1.5, 0.06, '#5a3a24'); const wn = tb(g, w * 0.22, 1.5, d / 2 + 0.035, 0.7, 0.6, 0.04, '#ffc468', true); WIN.push(glowSpr(g, w * 0.22, 1.5, d / 2 + 0.3, 2.2, '#ffb050', 0.7)); return g; }
  const HOUSES = [[0, -8, 0, 4.5, 4, '#c8b8a0'], [-7, -5, 0.4, 4, 3.6, '#b8a890'], [7, -5, -0.4, 4, 3.6, '#c8b090'], [-12, 2, 0.9, 3.6, 3.4, '#a89880'], [12, 2, -0.9, 3.6, 3.4, '#c0b8a8'], [-5, -16, 0.2, 4, 3.6, '#b0a088'], [6, -17, -0.2, 4.2, 3.6, '#c8b8a0'], [-16, -10, 0.7, 3.6, 3.4, '#b8a890'], [17, -11, -0.7, 3.6, 3.4, '#a89880']];
  HOUSES.forEach(h => house(...h));
  { const R = rng(801); for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = 22 + R() * 30; const x = Math.cos(a) * r, z = Math.sin(a) * r - 10; const g = grp(vil, x, 0, z); const s = 0.8 + R() * 0.8; g.scale.setScalar(s); tb(g, 0, 0.5, 0, 0.35, 1, 0.35, '#5a3a24'); for (let j = 0; j < 3; j++) { part(g, CONE, '#2a5a3a', 0, 1.6 + j * 1.0, 0, 1.4 - j * 0.35, 1.6, 1.4 - j * 0.35); part(g, CONE, '#ffffff', 0, 2.1 + j * 1.0, 0, 0.6 - j * 0.15, 0.6, 0.6 - j * 0.15); } } }
  { const w = grp(vil, 0, 0, 0); part(w, CYL, '#8a8a94', 0, 0.45, 0, 0.9, 0.9, 0.9); part(w, CYL, '#1a2a4a', 0, 0.91, 0, 0.7, 0.02, 0.7); [-1, 1].forEach(s => tb(w, s * 0.8, 1.6, 0, 0.12, 1.6, 0.12, '#5a3a24')); part(w, ROOF, '#4a3a4a', 0, 2.7, 0, 1.2, 0.8, 1.2).rotation.y = Math.PI / 4; }
  const moon = grp(vil, -30, 40, -90); part(moon, SPH, '#fff6dc', 0, 0, 0, 6, 6, 6, 0, true); glowSpr(moon, 0, 0, -1, 40, '#c8d8ff', 0.6);
  // interior da casa (x=9000)
  const inn = grp(world, 9000, 0, 0); tb(inn, 0, -0.05, 0, 10, 0.1, 10, '#7a5a3a'); tb(inn, 0, 2, -2.5, 10, 4, 0.2, '#b89a78'); tb(inn, -3, 2, 0, 0.2, 4, 10, '#a88a68'); for (let i = 0; i < 5; i++) tb(inn, -4 + i * 2, 3.6, 0, 0.25, 0.25, 10, '#5a3a24');
  const fire = grp(inn, 2.2, 0, -2.2); tb(fire, 0, 1.2, 0, 2.2, 2.4, 0.6, '#8a8a94'); tb(fire, 0, 0.6, 0.2, 1.2, 0.9, 0.4, '#1a1010'); const flames = [0, 1, 2].map(i => part(fire, CONE, ['#ffb030', '#ff7a1a', '#ffe070'][i], -0.3 + i * 0.3, 0.45, 0.25, 0.16, 0.5, 0.16, 0, true)); glowSpr(fire, 0, 0.6, 0.6, 3, '#ff9a3a', 0.9);
  const fireL = new T3.PointLight(0xff9a4a, 0, 14, 1.2); fireL.position.set(2.2, 1, -1.4); inn.add(fireL);
  const crib = grp(inn, -1.8, 0, -1.6); tb(crib, 0, 0.5, 0, 1, 0.5, 0.6, '#8a5a3a');

  // ---------- fórmulas e lembranças ----------
  const formulas = ['E=mc²', 'H₂O', 'F=m·a', 'NaOH', 'π', 'Fe', 'CO₂', 'V=R·I', '∫ dx', 'PÃO'].map((s, i) => { const t = canvasTex(256, 96, (x, w, h) => { x.font = '700 64px Oswald'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#e8f8ff'; x.shadowColor = i % 2 ? '#ffc83a' : '#5ad0ff'; x.shadowBlur = 20; x.fillText(s, w / 2, h / 2); }); const m = new T3.Sprite(new T3.SpriteMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false, blending: T3.AdditiveBlending })); m.scale.set(0.42, 0.16, 1); world.add(m); return opt(m); });
  function formulaCloud(c, lt, R0, sp) { const h = headOf(c); formulas.forEach((m, i) => { const p = eBack(prog(lt, i * (sp || 0.12), i * (sp || 0.12) + 0.4)); if (p <= 0.01) return; m.visible = true; const a = i / formulas.length * Math.PI * 2 + gT * 0.5; m.position.set(h[0] + Math.cos(a) * R0, h[1] + 0.1 + Math.sin(a * 2 + i) * 0.25, h[2] + Math.sin(a) * R0); m.scale.set(0.42 * p * R0, 0.16 * p * R0, 1); }); }
  const icNo = ['bolt', 'health', 'drop', 'soap'].map((k, i) => iconMesh(k, ['#ffd23c', '#7aff9a', '#5ad0ff', '#ff9ad8'][i]));
  const icPow = ['sword', 'star', 'bolt', 'coin'].map((k, i) => iconMesh(k, ['#ffb04a', '#c89aff', '#5ad0ff', '#ffd23c'][i]));
  const icMem = ['gear', 'flask', 'atom', 'wheat', 'health', 'bolt'].map((k, i) => iconMesh(k, ICOLS[i]));
  const soapBig = iconMesh('soap', '#ff9ad8');
  function orbitIcons(list, cx, cy, cz, R0, lt, step, crossK, sc) { list.forEach((g, i) => { const a = i / list.length * Math.PI * 2 + gT * 0.45; const p = eBack(prog(lt, i * step, i * step + 0.45)); if (p <= 0.001) return; g.visible = true; g.position.set(cx + Math.cos(a) * R0, cy + Math.sin(a * 2 + i) * 0.2, cz + Math.sin(a) * R0 * 0.6); g.scale.setScalar(p * (sc || 0.62)); g.rotation.y = Math.sin(gT * 0.8 + i) * 0.5; const ck = crossK ? crossK(i) : 0; g.userData.x1.visible = ck > 0; g.userData.x2.visible = ck > 0.5; g.userData.x1.scale.x = 0.8 * Math.min(1, ck * 2); g.userData.x2.scale.x = 0.8 * Math.min(1, Math.max(0, ck * 2 - 1)); }); }

  // ---------- céu / luz ----------
  const skyC = document.createElement('canvas'); skyC.width = 4; skyC.height = 256; const skyX = skyC.getContext('2d'); const skyT = new T3.CanvasTexture(skyC); skyT.colorSpace = T3.SRGBColorSpace;
  const MODES = {
    white: { sky: ['#fffdf4', '#f4e2c0'], hemi: 1.45, sun: 1.6, sunC: '#ffffff', fog: '#fff6e4', fogN: 8, fogF: 46, ground: '#e8dcc8', rim: '#ffd890' },
    gold: { sky: ['#fff4d0', '#ffc878'], hemi: 1.4, sun: 1.8, sunC: '#fff0c8', fog: '#ffe8b8', fogN: 8, fogF: 46, ground: '#e8c890', rim: '#ffb040' },
    dark: { sky: ['#03040e', '#18204e'], hemi: 0.6, sun: 1.2, sunC: '#9ad0ff', fog: '#0a1028', fogN: 12, fogF: 60, ground: '#1a2040', rim: '#5aa0ff' },
    aeth: { sky: ['#2a5ad0', '#ffd8b0'], hemi: 1.1, sun: 2.4, sunC: '#ffe8c8', fog: '#d8e0f0', fogN: 80, fogF: 360, ground: '#4a6a4a', rim: '#ffaa88' },
    vnight: { sky: ['#04081c', '#1c2a52'], hemi: 0.55, sun: 0.9, sunC: '#8aa8ff', fog: '#121a36', fogN: 25, fogF: 140, ground: '#3a4a6a', rim: '#5a7aff' },
    vday: { sky: ['#6a9ae0', '#eef3fa'], hemi: 1.2, sun: 2.0, sunC: '#fff4e4', fog: '#dde6f2', fogN: 40, fogF: 200, ground: '#c8d0e0', rim: '#ffd0a0' },
    inner: { sky: ['#140c08', '#140c08'], hemi: 0.85, sun: 0.25, sunC: '#ffb070', fog: '#140c08', fogN: 20, fogF: 60, ground: '#3a2418', rim: '#ff8a3a' } };
  scene.fog = new T3.Fog(0xffffff, 10, 50); scene.background = skyT;
  function setMode(k, flash) { const M = MODES[k]; const g = skyX.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, M.sky[0]); g.addColorStop(1, M.sky[1]); skyX.fillStyle = g; skyX.fillRect(0, 0, 4, 256); skyT.needsUpdate = true;
    hemi.color.set(0xffffff); hemi.groundColor.set(M.ground); hemi.intensity = M.hemi + (flash || 0) * 2; sun.color.set(M.sunC); sun.intensity = M.sun; rim.intensity = 0.5; rim.color.set(M.rim);
    scene.fog.color.set(M.fog); scene.fog.near = M.fogN; scene.fog.far = M.fogF; }
  function sunAt(x, y, z) { sun.position.set(x + 20, y + 40, z + 25); sun.target.position.set(x, y, z); sun.target.updateMatrixWorld(); }
  function motesAround(cx, cy, cz, col, r, n) { motes.material.color.set(col || '#ffffff'); motes.userData.place((i, d) => { if (i > (n || 220)) return false; const R = rng(i + 33); const k = ((gT * (0.05 + R() * 0.05) + R()) % 1); d.position.set(cx + (R() - .5) * (r || 8), cy - 1.5 + k * 5, cz + (R() - .5) * (r || 8)); d.scale.setScalar(d.position.distanceTo(cam.position) < 1.2 ? 0.0001 : 0.02 + R() * 0.03); }); }
  function snowAround(cx, cy, cz, r) { snow.userData.place((i, d) => { const R = rng(i + 91); const k = ((gT * (0.08 + R() * 0.06) + R()) % 1); d.position.set(cx + (R() - .5) * r + Math.sin(gT + i) * 0.4, cy + 10 - k * 12, cz + (R() - .5) * r); d.scale.setScalar(0.03 + R() * 0.04); }); }
  function smokeUp() { smoke.userData.place((i, d) => { const c = CHIM[i % CHIM.length]; const R = rng(i + 5); const k = ((gT * 0.12 + R()) % 1); c[0].updateMatrixWorld(); v3.set(c[1], c[2], c[3]); c[0].localToWorld(v3); d.position.set(v3.x + k * 1.6 + Math.sin(gT + i) * 0.2, v3.y + k * 4, v3.z); d.scale.setScalar(0.25 + k * 0.9); }); }
  function shardsMove() { shards.forEach((m, i) => { m.position.y = m.userData.y0 + Math.sin(gT * m.userData.sp + i) * 0.5; m.rotation.set(gT * 0.2 * m.userData.sp, gT * 0.3, 0); }); }
  function haloOn(c, s) { const h = headOf(c); [halo, halo2].forEach((r, i) => { r.visible = true; r.position.set(h[0], h[1] + 0.05, h[2] - 0.35); r.scale.setScalar((s || 0.55) * (1 + i * 0.12)); r.rotation.set(0, 0, gT * (i ? -0.4 : 0.3)); }); }

  // ---------- câmera ----------
  const camT = new T3.Vector3();
  function camAt(p, l, fov) { cam.position.set(p[0], p[1], p[2]); camT.set(l[0], l[1], l[2]); if (cam.fov !== (fov || 40)) { cam.fov = fov || 40; cam.updateProjectionMatrix(); } }
  function camAB(lt, T, a, b, la, lb, fov) { const u = eIO(clamp(lt / T)); camAt(L3(a, b, u), L3(la, lb || la, u), fov); }
  const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  // close no rosto: o personagem olha para dir (+1 = +z, -1 = -z)
  function closeOn(c, lt, T, dir, d0, d1, side, fov) { const h = headOf(c); camAB(lt, T, add3(h, [side || 0.18, 0.02, dir * d0]), add3(h, [(side || 0.18) * 0.6, 0.0, dir * d1]), add3(h, [0, -0.04, 0]), null, fov || 35); }
  const fx = { flash: 0, shake: 0, white: 0 };
  const FY = () => 0.45 + Math.sin(gT * 1.2) * 0.06, EY = () => 0.62 + Math.sin(gT * 1.0 + 1) * 0.05;
  const LZ = 0, EZ = -2.4;
  const floatLegs = { legs: { thL: -0.25, thR: 0.1, knL: 0.5, knR: 0.25 } };
  function voidScene(mode, withEly) { setMode(mode || 'white'); sunAt(0, 0, 0); shardsMove(); motesAround(0, 1.5, -1, mode === 'dark' ? '#9ad0ff' : '#ffe8b0', 12); place(leo, 0, FY(), LZ, Math.PI); if (withEly) place(ely, 0, EY(), EZ, 0); }
  function leoP(o) { pose(leo, gT, Object.assign({}, floatLegs, o)); }
  function elyP(o) { elyPose(Object.assign({ arms: holdStaff, legs: { thL: 0, thR: 0, knL: 0.05, knR: 0.05 } }, o)); }

  // portal da abertura (x=-3000)
  const portal = grp(world, -3000, 0, 0); const pRings = [];
  for (let i = 0; i < 6; i++) { const r = new T3.Mesh(new T3.TorusGeometry(2.2 + i * 0.55, 0.04 + (i % 2) * 0.03, 10, 120), gm(['#5ad0ff', '#c89aff', '#ff7ab0', '#ffc83a', '#7aff9a', '#9ad0ff'][i])); r.position.set(0, 3, -6 - i * 1.2); portal.add(r); pRings.push(r); }
  const pCore = glowSpr(portal, 0, 3, -9, 9, '#b89aff', 0.9); glowSpr(portal, 0, 3, -12, 22, '#5a3aff', 0.5);
  for (let i = 0; i < 40; i++) { const R = rng(i + 950); part(portal, ICO, ['#3a2a6a', '#5a3a9a', '#2a2050'][i % 3], (R() - .5) * 26, -6 + R() * 18, -4 - R() * 22, 0.2 + R() * 0.7, 0.2 + R() * 0.7, 0.2 + R() * 0.7).userData.sp = 0.3 + R(); }
  const portalRocks = portal.children.filter(c => c.userData.sp);
  const A = {
    intro(lt, T) { setMode('dark'); scene.fog.near = 30; scene.fog.far = 120; sunAt(-3000, 0, 0); pRings.forEach((r, i) => { r.rotation.set(Math.sin(gT * 0.4 + i) * 0.35, Math.cos(gT * 0.3 + i) * 0.35, gT * (i % 2 ? -0.6 : 0.8) * (1 + i * 0.15)); const s = 1 + 0.06 * Math.sin(gT * 3 + i); r.scale.setScalar(s); }); pCore.scale.set(9 + Math.sin(gT * 4) * 1.5, 9 + Math.sin(gT * 4) * 1.5, 1); portalRocks.forEach((m, i) => { m.rotation.set(gT * m.userData.sp, gT * 0.5, 0); });
      motesAround(-3000, 3, -6, '#c8b8ff', 14); formulas.forEach((m, i) => { m.visible = true; const a = i / formulas.length * Math.PI * 2 + gT * 0.6; const z = -6 - ((gT * 2 + i * 1.3) % 12); m.position.set(-3000 + Math.cos(a) * 3.6, 3 + Math.sin(a) * 3.6, z); m.scale.set(1.0, 0.38, 1); });
      const k = eIO(clamp(lt / T)); camAt([-3000 + Math.sin(gT * 0.5) * 0.6, 3 + Math.cos(gT * 0.4) * 0.3, lerp(9, -2, k)], [-3000, 3, -10], lerp(55, 70, k)); fx.white = prog(lt, T - 0.45, T); },
    wake_white(lt, T) { voidScene('white'); leoP({ mood: 'neutral', look: [0, 0], headX: -0.05 }); fx.white = Math.max(0, 1 - lt / 1.1); closeOn(leo, lt, T, -1, 0.95, 0.75, 0.2); },
    leo_float(lt, T) { voidScene('white'); leoP({ mood: 'shock', look: [Math.sin(gT * 1.5), 0], arms: { shL: [0, 0, -0.6], shR: [0, 0, 0.6], elL: [-0.3, 0, 0], elR: [-0.3, 0, 0] } }); const a = 2.6 + lt * 0.25; camAt([Math.sin(a) * 4.2, 1.6, Math.cos(a) * 4.2], [0, 1.25, 0], 40); },
    void_wide(lt, T) { voidScene('white'); leoP({ mood: 'worried', look: [0.6, 0], headY: 0.4 * Math.sin(gT) }); camAB(lt, T, [0, 2.5, -9], [0, 4.5, -18], [0, 1.2, 0], [0, 1.0, 0], 45); },
    elysia_reveal(lt, T) { voidScene('white', true); const k = eOut(prog(lt, 0, 1.2)); ely.scale.setScalar(Math.max(0.01, k)); fx.flash = Math.max(0, 0.8 - lt * 1.2); leoP({ mood: 'shock', look: [0, 0.2] }); elyP({ mood: 'neutral', look: [0, -0.3], gemK: 0.6 }); haloOn(ely, 0.6); aura.visible = true; const h = headOf(ely); aura.position.set(h[0], h[1] - 0.3, h[2] - 0.6); aura.scale.set(5 * k, 6 * k, 1); rays.forEach((r, i) => { r.visible = true; r.position.set(0, h[1], EZ - 1.5); r.rotation.z = i * 0.5236 + gT * 0.05; }); camAB(lt, T, [1.3, 1.15, 1.6], [0.9, 1.35, 0.9], [0, 1.6, EZ], [0, 1.72, EZ], 40); },
    elysia_talk(lt, T) { voidScene('white', true); elyP({ mood: 'smile', talk: lt > 0.15 && lt < T - 0.3, look: [0, 0] }); haloOn(ely); closeOn(ely, lt, T, 1, 1.25, 1.0, -0.2); },
    leo_ask(lt, T) { voidScene('white', true); leoP({ mood: lt < 1.0 ? 'shock' : 'worried', talk: true, look: [0, 0] }); elyP({ mood: 'smile' }); closeOn(leo, lt, T, -1, 1.15, 0.9, 0.22); },
    elysia_smile(lt, T) { voidScene('white', true); leoP({ mood: 'worried' }); elyP({ mood: 'smile', talk: lt < T - 0.4, look: [0, 0], headZ: 0.08 }); haloOn(ely); closeOn(ely, lt, T, 1, 1.1, 0.85, -0.25); },
    elysia_intro(lt, T) { voidScene('gold', true); leoP({ mood: 'shock' }); const up = eOut(prog(lt, 0.2, 1.0)); elyP({ mood: 'smile', talk: lt > 0.2, arms: { shL: [-0.35 - up * 2.2, 0, -0.15], elL: [-0.55 + up * 0.45, 0, 0] }, gemK: up * 1.5 }); haloOn(ely, 0.6); rays.forEach((r, i) => { r.visible = true; r.position.set(0, 1.8, EZ - 1.5); r.rotation.z = i * 0.5236 + gT * 0.08; }); const a = -0.5 + lt * 0.12; camAt([Math.sin(a) * 3.6, 1.3, EZ + Math.cos(a) * 3.6], [0, 1.45, EZ], 40); },
    aeth_wide(lt, T) { setMode('aeth'); sunAt(6000, 0, 0); flyDragon(30, 18, 0.25); clouds.forEach((c, i) => c.position.x += 0); camAB(lt, T, [6000, 95, 110], [6000, 60, 70], [6000, 0, -5], [6000, 2, -8], 45); },
    dragon_fly(lt, T) { setMode('aeth'); sunAt(6000, 0, 0); flyDragon(18, 14, 0.35); dragon.updateMatrixWorld(true); dragon.getWorldPosition(v3); const p = [v3.x, v3.y, v3.z]; camAt(add3(p, [Math.cos(gT * 0.35) * 14, 4, Math.sin(gT * 0.35) * 14 + 4]), p, 42); },
    icons_no(lt, T) { voidScene('dark'); leoP({ mood: 'worried', look: [Math.sin(gT * 2) * 0.8, 0] }); const step = T / 5; orbitIcons(icNo, 0, 1.6, 0, 1.6, lt, step, i => prog(lt, i * step + 0.5, i * step + 0.9)); camAB(lt, T, [0.4, 1.7, -4.4], [0.3, 1.6, -3.6], [0, 1.45, 0], null, 42); },
    blessing_offer(lt, T) { voidScene('gold', true); leoP({ mood: 'neutral' }); elyP({ mood: 'smile', talk: true, arms: { shL: [-0.35, 0, -0.15], elL: [-0.55, 0, 0], shR: [-0.3, 0, 0.9], elR: [-0.4, 0, 0] } }); haloOn(ely); orbitIcons(icPow, 0, 1.55, EZ + 0.3, 1.3, lt, 0.45, null, 0.7); camAB(lt, T, [0.9, 1.5, EZ + 3.6], [0.5, 1.55, EZ + 3.0], [0, 1.45, EZ], null, 42); },
    leo_think(lt, T) { voidScene('white', true); elyP({ mood: 'neutral' }); leoP({ mood: 'neutral', look: [0.4, 0.4], headX: -0.12, headZ: 0.08, arms: { shR: [-1.25, 0, 0.35], elR: [-2.0, 0, 0] } }); closeOn(leo, lt, T, -1, 1.25, 1.0, 0.3); },
    leo_answer(lt, T) { voidScene('white', true); elyP({ mood: 'neutral' }); leoP({ mood: 'determined', talk: lt < T - 0.3, look: [0, 0] }); formulaCloud(leo, lt, 0.42, 0.18); closeOn(leo, lt, T, -1, 2.0, 1.5, 0.25); },
    elysia_shock(lt, T) { voidScene('white', true); leoP({ mood: 'determined' }); elyP({ mood: 'shock', talk: lt > 0.3 && lt < T - 0.3, look: [0, 0] }); haloOn(ely); fx.shake = lt < 0.25 ? 0.01 : 0; closeOn(ely, lt, T, 1, 0.95, 0.7, -0.15); },
    leo_soap(lt, T) { voidScene('white', true); elyP({ mood: 'shock' }); leoP({ mood: 'smile', talk: lt < T - 0.3, arms: { shR: [-1.3, 0, 0.2], elR: [-0.6, 0, 0] } }); const h = headOf(leo); const p = eBack(prog(lt, 0.3, 0.8)); soapBig.visible = true; soapBig.position.set(h[0] - 0.2, h[1] + 0.34 + Math.sin(gT * 2) * 0.04, h[2] - 0.25); soapBig.scale.setScalar(0.42 * p); soapBig.rotation.y = Math.PI + Math.sin(gT) * 0.4; soapBig.userData.x1.visible = soapBig.userData.x2.visible = false; bubbles.userData.place((i, d) => { const R = rng(i + 3); const k = ((gT * 0.25 + R()) % 1); d.position.set(h[0] - 0.2 + (R() - .5) * 0.9, h[1] + 0.3 + k * 0.9, h[2] - 0.25 + (R() - .5) * 0.5); d.scale.setScalar(p * (0.03 + R() * 0.05) * Math.sin(k * Math.PI)); }); { const u = eIO(clamp(lt / T)); camAt(add3(h, [0.1, 0.12, lerp(-1.9, -1.55, u)]), add3(h, [-0.08, 0.16, 0]), 36); } },
    elysia_wonder(lt, T) { voidScene('white', true); leoP({ mood: 'smile' }); elyP({ mood: 'neutral', look: [0, -0.2], headZ: -0.1, headX: 0.05 }); haloOn(ely); closeOn(ely, lt, T, 1, 1.6, 0.95, -0.3, 33); },
    duo_talk(lt, T) { voidScene('white', true); leoP({ mood: 'neutral' }); elyP({ mood: 'worried', talk: true, look: [0, 0] }); haloOn(ely); camAB(lt, T, [1.5, 1.7, 1.9], [1.1, 1.65, 1.4], [-0.1, 1.55, -1.4], null, 42); },
    leo_smile(lt, T) { voidScene('white', true); elyP({ mood: 'worried' }); leoP({ mood: 'smile', talk: lt < T - 0.3, look: [0, 0], headZ: 0.06 }); closeOn(leo, lt, T, -1, 1.15, 0.9, -0.2); },
    touch_forehead(lt, T) { voidScene('gold', true); place(ely, 0, EY(), -2.25, 0); const reach = eOut(prog(lt, 0, 0.9)); leoP({ mood: lt > 1.0 ? 'shock' : 'neutral', look: [0, 0.3] }); elyP({ mood: 'smile', noStaff: true, arms: { shL: [-0.35 - reach * 1.1, 0, -0.1], elL: [-0.55 + reach * 0.4, 0, 0] } }); haloOn(ely);
      const P = ely.userData.P; P.elL.updateMatrixWorld(true); v3.set(0, -0.29, 0.03); P.elL.localToWorld(v3); const hand = [v3.x, v3.y, v3.z]; const h = headOf(leo); const tip = lerp(0, 1, reach); const end = [lerp(hand[0], h[0], 1) , lerp(hand[1] + 0.9, h[1] + 0.06, tip), lerp(hand[2] + 0.2, h[2] - 0.13, tip)];
      const dx = end[0] - hand[0], dy = end[1] - hand[1], dz = end[2] - hand[2]; const L = Math.hypot(dx, dy, dz); staffSolo.visible = true; staffSolo.position.set((hand[0] + end[0]) / 2, (hand[1] + end[1]) / 2, (hand[2] + end[2]) / 2); staffSolo.scale.set(1, L, 1); staffSolo.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), new T3.Vector3(dx / L, dy / L, dz / L));
      soloGem.visible = soloGlow.visible = true; soloGem.position.set(...end); soloGlow.position.set(...end); const pk = lt > 1.0 ? 1 + 2.5 * Math.exp(-(lt - 1.0) * 3) : 1; soloGlow.scale.set(1.2 * pk, 1.2 * pk, 1); fx.flash = lt > 1.0 ? Math.max(0, 0.7 - (lt - 1.0) * 1.5) : 0;
      camAB(lt, T, [1.7, 1.8, 1.5], [1.2, 1.78, 1.0], [0, 1.72, -1.2], null, 40); },
    memory_burst(lt, T) { voidScene('dark'); leoP({ mood: 'shock', look: [0, 0.2], headX: -0.15, arms: { shL: [0, 0, -0.9], shR: [0, 0, 0.9], elL: [-0.4, 0, 0], elR: [-0.4, 0, 0] } }); formulaCloud(leo, lt, 0.9 + lt * 0.15, 0.1); orbitIcons(icMem, 0, 1.3, 0, 1.4 + lt * 0.1, lt, 0.12, null, 0.5); const h = headOf(leo); aura.visible = true; aura.position.set(h[0], h[1] - 0.5, h[2] + 0.6); aura.scale.set(4, 5, 1); aura.material.color.set('#7ac8ff'); camAB(lt, T, [0.2, 1.7, -2.6], [0.1, 1.65, -3.6], [0, 1.45, 0], null, 42); },
    blessing_title(lt, T) { voidScene('gold'); leoP({ mood: 'smile', look: [0, 0.4], headX: -0.2, arms: { shL: [0, 0, -0.35], shR: [0, 0, 0.35] } }); const h = headOf(leo); aura.visible = true; aura.material.color.set('#ffd890'); aura.position.set(h[0], h[1] - 0.6, h[2] + 0.6); aura.scale.set(5, 7, 1); rays.forEach((r, i) => { r.visible = true; r.position.set(0, 1.2, 1.2); r.rotation.z = i * 0.5236 - gT * 0.1; }); motesAround(0, 1.2, 0, '#ffd890', 5); camAB(lt, T, [0.0, 0.6, -3.2], [0.0, 0.9, -2.6], [0, 1.4, 0], null, 44); },
    dissolve(lt, T) { voidScene('white', true); const k = prog(lt, 0.2, T * 0.85); elyP({ mood: 'smile' }); haloOn(ely); if (k < 0.7) leoP({ mood: 'smile', look: [0, 0] }); else leo.visible = false; leo.scale.setScalar(1 - k * 0.15); sand.userData.place((i, d) => { const R = rng(i + 41); const born = R(); if (born > k * 1.2) return false; const u = (k - born / 1.2) * 2; d.position.set((R() - .5) * 0.7 + u * (R() - .3) * 2, FY() + R() * 1.9 + u * 2.5, (R() - .5) * 0.4 + u * 1.2); d.scale.setScalar(0.03 * (1 - Math.min(1, u))); }); fx.white = prog(lt, T * 0.75, T); camAB(lt, T, [2.4, 1.4, 1.6], [3.0, 1.6, 2.4], [0, 1.3, -0.4], null, 42); },
    elysia_last(lt, T) { voidScene('white', true); leo.visible = false; elyP({ mood: 'smile', talk: lt > 1.6 && lt < T - 0.4, look: [0, 0.5], headX: 0.18 }); haloOn(ely); fx.white = Math.max(0, 0.7 - lt * 1.4) + prog(lt, T - 0.5, T); closeOn(ely, lt, T, 1, 1.9, 1.15, -0.35, 34); },
    village_night(lt, T) { setMode('vnight'); sunAt(8000, 0, 0); WIN.forEach(w => w.material.opacity = 0.75 + Math.sin(gT * 4 + w.id) * 0.06); snowAround(8000, 0, -6, 40); smokeUp(); camAB(lt, T, [8000, 14, 28], [8000, 4.5, 12], [8000, 3, -8], [8000, 2.6, -8], 45); },
    baby_window(lt, T) { famSet(lt, T, false); },
    baby_close(lt, T) { famSet(lt, T, true); },
    leo_talk(lt, T) { voidScene('white', true); elyP({ mood: 'neutral' }); leoP({ mood: 'neutral', talk: lt < T - 0.3, look: [0.1, 0], headZ: Math.sin(gT * 1.3) * 0.05 }); closeOn(leo, lt, T, -1, 1.3, 1.05, -0.12); },
    leo_surprise(lt, T) { voidScene('white', true); elyP({ mood: 'smile' }); leoP({ mood: 'shock', talk: lt > 0.2 && lt < T - 0.3, look: [0, 0], arms: { shL: [-0.9, 0, -0.5], elL: [-1.2, 0, 0], shR: [-0.9, 0, 0.5], elR: [-1.2, 0, 0] } }); fx.shake = lt < 0.2 ? 0.008 : 0; closeOn(leo, lt, T, -1, 1.0, 1.4, 0.15); },
    ely_laugh(lt, T) { voidScene('white', true); leoP({ mood: 'neutral' }); elyP({ mood: 'smile', talk: lt < T - 0.3, look: [0, 0.2], headZ: Math.sin(gT * 9) * 0.06 * Math.max(0, 1 - lt / 1.5), headX: -0.08 }); haloOn(ely); closeOn(ely, lt, T, 1, 1.3, 1.0, 0.22); },
  };
  function famSet(lt, T, close) { setMode('inner'); sunAt(9000, 0, 0); fireL.intensity = 3.2 + Math.sin(gT * 9) * 0.6 + Math.sin(gT * 23) * 0.3; flames.forEach((f, i) => { f.scale.y = 0.5 + Math.sin(gT * 11 + i * 2) * 0.12; });
      place(mom, 8999.6, 0, -0.4, 0.25); pose(mom, gT, { mood: 'smile', look: [0.3, 0.5], headX: 0.3, headY: 0.2, arms: { shL: [-0.75, 0, 0.55], elL: [-1.45, 0, 0], shR: [-0.55, 0, -0.45], elR: [-1.35, 0, 0] } });
      place(dad, 9000.75, 0, -0.75, -0.45); pose(dad, gT, { mood: 'smile', talk: lt > T * 0.5, look: [-0.5, 0.3], headX: 0.15, arms: { shL: [-0.3, 0, -0.1] } });
      mom.updateMatrixWorld(true); const MP = mom.userData.P; const hL = new T3.Vector3(0, -0.29, 0.01), hR = new T3.Vector3(0, -0.29, 0.01); MP.elL.localToWorld(hL); MP.elR.localToWorld(hR); v3.copy(hL).add(hR).multiplyScalar(0.5); v3.y += 0.05; const fz = new T3.Vector3(Math.sin(0.25), 0, Math.cos(0.25)); const bx = new T3.Vector3().subVectors(hL, hR); bx.addScaledVector(fz, -bx.dot(fz)); bx.y *= 0.35; bx.normalize(); const by = new T3.Vector3().crossVectors(fz, bx).normalize(); baby.visible = true; baby.position.copy(v3).addScaledVector(fz, 0.03); baby.quaternion.setFromRotationMatrix(new T3.Matrix4().makeBasis(bx, by, fz)); baby.scale.setScalar(1.15); baby.updateMatrixWorld(true); window.__bb = [hL.toArray(), hR.toArray(), v3.toArray()]; const cry = Math.abs(Math.sin(gT * 6)); baby.userData.mouth.scale.set(0.016, 0.008 + cry * 0.012, 0.006);
      const mh = headOf(mom); const bh = new T3.Vector3(0.17, 0, 0); baby.localToWorld(bh); const c = [(bh.x + mh[0]) / 2, (v3.y + mh[1]) / 2 - 0.05, (bh.z + mh[2]) / 2]; if (close) { const bc = [bh.x, bh.y + 0.02, bh.z]; baby.userData.mouth.scale.set(0.012, 0.004, 0.006); camAB(lt, T, add3(bc, [0.04, 0.12, 1.0]), add3(bc, [0.02, 0.06, 0.62]), add3(bc, [-0.05, 0, 0]), null, 38); } else camAB(lt, T, add3(c, [0.5, 0.15, 3.0]), add3(c, [0.2, 0.05, 2.0]), c, null, 40); }
  const A2 = {
    visitors(lt, T) { setMode('vday'); sunAt(8000, 0, 0); smokeUp(); snowAround(8000, 0, 0, 30); vSet(); camAB(lt, T, [8001.4, 1.5, 9.5], [8000.9, 1.3, 7.6], [8000, 1.1, 2.2], null, 42); },
    prof(lt, T) { setMode('vday'); sunAt(8000, 0, 0); snowAround(8000, 0, 0, 30); vSet(); pose(prof, gT, { mood: 'neutral', look: [0, 0], talk: true, arms: { shR: [-0.9, 0, 0], elR: [-1.0, 0, 0] } }); closeOn(prof, lt, T, 1, 1.4, 1.1, 0.25); },
    adventurer(lt, T) { setMode('vday'); sunAt(8000, 0, 0); snowAround(8000, 0, 0, 30); vSet(); pose(kaela, gT, { mood: 'smile', look: [0, 0], arms: { shR: [0, 0, 0.6], elR: [-1.6, 0, 0], shL: [0, 0, -0.6], elL: [-1.6, 0, 0] } }); closeOn(kaela, lt, T, 1, 1.4, 1.1, -0.2); },
    messenger(lt, T) { setMode('vday'); sunAt(8000, 0, 0); snowAround(8000, 0, 0, 30); vSet(); pose(mess, gT, { mood: 'neutral', look: [0, 0], arms: { shR: [-1.3, 0, 0.1], elR: [-0.3, 0, 0] } }); closeOn(mess, lt, T, 1, 1.5, 1.15, 0.2); },
    choose(lt, T) { setMode('vday'); sunAt(8000, 0, 0); smokeUp(); snowAround(8000, 0, 0, 30); vSet(true); const u = eIO(clamp(lt / 3)); camAt([8000 + lerp(1.6, 0.9, u) + Math.sin(gT * 0.4) * 0.2, lerp(0.8, 1.6, u), lerp(7.2, 6.4, u)], [8000, 1.25, 1.3], 46); },
  };
  Object.assign(A, A2);
  function vSet(up) { place(kidLeo, 8000, 0, 4, Math.PI); pose(kidLeo, gT, { mood: up ? 'determined' : 'shock', look: up ? [0, 0.6] : [Math.sin(gT * 0.8), 0], headX: up ? -0.25 : 0 });
    place(prof, 7998.4, 0, 1.6, 0.35); place(kaela, 8000, 0, 1.1, 0); place(mess, 8001.6, 0, 1.6, -0.35);
    pose(prof, gT, { mood: 'neutral', look: [0.3, 0] }); pose(kaela, gT, { mood: 'smile', arms: { shR: [0, 0, 0.6], elR: [-1.6, 0, 0], shL: [0, 0, -0.6], elL: [-1.6, 0, 0] } }); pose(mess, gT, { mood: 'neutral', arms: { shR: [-1.3, 0, 0.1], elR: [-0.3, 0, 0] } }); }
  A.choose_end = A.choose;

  const flashEl = document.getElementById('mundo-flash');
  function frame(t) {
    gT = t; let idx = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) idx = i;
    const sh = SHOTS[idx]; const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    for (const k in fx) fx[k] = 0;
    PARTS.forEach(p => p.visible = false); OPT.forEach(o => o.visible = false); fireL.intensity = 0; ely.scale.setScalar(1); leo.scale.setScalar(1); aura.material.color.set('#ffd890');
    (A[sh.id] || A[sh.id.replace(/~\d+$/, '')] || A.wake_white)(lt, T);
    const pk = 1 - 0.05 * (1 - eOut(clamp(lt / 0.4))); const dir = new T3.Vector3().subVectors(cam.position, camT); cam.position.copy(camT).addScaledVector(dir, pk);
    cam.position.x += Math.sin(t * 0.9) * 0.012 + Math.sin(t * 2.3) * 0.005; cam.position.y += Math.cos(t * 0.7) * 0.01;
    if (fx.shake) { cam.position.x += Math.sin(t * 87) * fx.shake; cam.position.y += Math.cos(t * 71) * fx.shake; }
    cam.lookAt(camT); cam.updateMatrixWorld();
    renderer.render(scene, cam);
    flashEl.style.opacity = Math.max(fx.flash, fx.white).toFixed(3);
  }
  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    formulas.forEach((m, i) => { const s = ['E=mc²', 'H₂O', 'F=m·a', 'NaOH', 'π', 'Fe', 'CO₂', 'V=R·I', '∫ dx', 'PÃO'][i]; m.material.map = canvasTex(256, 96, (x, w, h) => { x.font = '700 64px Oswald'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#e8f8ff'; x.shadowColor = i % 2 ? '#ffc83a' : '#5ad0ff'; x.shadowBlur = 20; x.fillText(s, w / 2, h / 2); }); m.material.needsUpdate = true; });
    const tl = gsap.timeline({ paused: true }); const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0); window.__timelines['mundo'] = tl;
  });
})();

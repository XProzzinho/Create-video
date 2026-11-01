  // ===================== EL NIÑO PARTE 1 — MAPA 3D CONTÍNUO =====================
  const OPT = []; const opt = (o) => { OPT.push(o); return o; };
  const PM = {}; function pmat(c) { return PM[c] || (PM[c] = new T3.MeshPhongMaterial({ color: c, flatShading: true, shininess: 4 })); }
  const K = 4; const ll = (lon, lat) => [lon * K, -lat * K];
  const world = grp(scene);
  const ICO = new T3.IcosahedronGeometry(1, 0), CONE = new T3.ConeGeometry(1, 1, 6);

  // ---------- oceano com temperatura ----------
  const oceanG = new T3.PlaneGeometry(1300, 900, 90, 60); oceanG.rotateX(-Math.PI / 2); oceanG.translate(-450, 0, 60);
  const oPos = oceanG.attributes.position; const oCol = new Float32Array(oPos.count * 3); oceanG.setAttribute('color', new T3.BufferAttribute(oCol, 3));
  const ocean = new T3.Mesh(oceanG, new T3.MeshPhongMaterial({ vertexColors: true, flatShading: true, shininess: 30 })); world.add(ocean);
  const cCold = new T3.Color('#2a7ac8'), cWarm = new T3.Color('#ff3a2a'), cMid = new T3.Color('#ffb02a'), tmpC = new T3.Color();
  let lastHeat = -1;
  function oceanHeat(k, t) {
    for (let i = 0; i < oPos.count; i++) { const x = oPos.getX(i), z = oPos.getZ(i); const lon = x / K, lat = -z / K;
      const band = Math.exp(-(lat * lat) / (2 * 7 * 7)) * Math.exp(-Math.pow((lon + 125) / 55, 2)) * (lon < -78 ? 1 : 0.15);
      const h = clamp(band * k * 1.15); tmpC.copy(cCold); if (h > 0) tmpC.lerp(cMid, Math.min(1, h * 1.6)); if (h > 0.55) tmpC.lerp(cWarm, (h - 0.55) / 0.45);
      const shade = 0.92 + 0.08 * Math.sin(x * 0.05 + z * 0.07); oCol[i * 3] = tmpC.r * shade; oCol[i * 3 + 1] = tmpC.g * shade; oCol[i * 3 + 2] = tmpC.b * shade;
      oPos.setY(i, Math.sin(x * 0.04 + t * 1.2) * 0.6 + Math.cos(z * 0.05 + t) * 0.5); }
    oPos.needsUpdate = true; oceanG.attributes.color.needsUpdate = true;
  }

  // ---------- América do Sul e Brasil por regiões ----------
  function shapeOf(pts) { const s = new T3.Shape(); pts.forEach((p, i) => { const [x, z] = ll(p[0], p[1]); i ? s.lineTo(x, -z) : s.moveTo(x, -z); }); return s; }
  function landPiece(pts, color, depth, y) { const g = new T3.ExtrudeGeometry(shapeOf(pts), { depth, bevelEnabled: false }); g.rotateX(-Math.PI / 2); const m = new T3.Mesh(g, new T3.MeshPhongMaterial({ color, flatShading: true, shininess: 4 })); m.position.y = y; world.add(m); return m; }
  const SA = [[-77.5, 8.5], [-75, 11], [-71.5, 12.4], [-64, 10.7], [-61, 10.5], [-58, 7], [-52, 5], [-51, 4], [-50, 1.8], [-48, -0.5], [-44, -2.5], [-40, -2.9], [-37, -4.8], [-35.2, -5.5], [-34.8, -7.5], [-35.5, -9.5], [-37, -11], [-38.5, -13], [-39, -17.5], [-40.5, -20.5], [-42, -22.9], [-44.5, -23.3], [-48.5, -25.5], [-48.6, -28], [-50, -30.5], [-52.5, -33.5], [-54, -34.8], [-57.5, -35.5], [-57, -38], [-62, -39], [-65, -42], [-65.5, -45], [-67.5, -46.5], [-69, -50], [-68.5, -52.5], [-70, -54.5], [-73, -53], [-75, -50], [-74.5, -46], [-73.5, -42], [-73.5, -37], [-71.5, -32], [-71.5, -28], [-70.5, -23], [-70.3, -18.5], [-75, -15.5], [-77, -12], [-79.5, -8], [-81.2, -5.5], [-80.5, -2], [-80, 0.8], [-78.8, 2], [-77.5, 4], [-77.4, 7]];
  landPiece(SA, '#7aa85a', 3, 0);
  const REG = {
    norte: [[-60, 5.2], [-51.6, 4.3], [-50, 1.8], [-48, -0.5], [-46, -1.2], [-48.5, -5], [-48.5, -13], [-50.5, -13], [-60.5, -13.5], [-65, -11.5], [-69.5, -11], [-73, -9.5], [-74, -7.5], [-73, -5], [-70, -4.2], [-69.5, -1], [-70, 1.5], [-67, 1.8], [-64, 1.5], [-63.5, 3.5]],
    nordeste: [[-46, -1.2], [-44, -2.5], [-40, -2.9], [-37, -4.8], [-35.2, -5.5], [-34.8, -7.5], [-35.5, -9.5], [-37, -11], [-38.5, -13], [-39, -17.5], [-40.5, -17.8], [-44, -14.5], [-46, -15], [-46.5, -10], [-48.5, -5]],
    centro: [[-48.5, -13], [-46, -15], [-47, -18], [-51, -19.5], [-53, -22.5], [-54.4, -24], [-55, -24], [-57.8, -22], [-58, -20], [-57.5, -18], [-60, -16], [-60.5, -13.5], [-50.5, -13]],
    sudeste: [[-44, -14.5], [-40.5, -17.8], [-39, -17.5], [-40.5, -20.5], [-42, -22.9], [-44.5, -23.3], [-48, -23.0], [-53, -22.5], [-51, -19.5], [-47, -18], [-46, -15]],
    sul: [[-53, -22.5], [-48, -23.0], [-48.5, -25.5], [-48.6, -28], [-50, -30.5], [-52.5, -33.7], [-53.6, -33.5], [-57.6, -30.2], [-55.8, -28], [-53.7, -26.2], [-54.6, -25.5], [-54.4, -24]],
  };
  const BASEC = { norte: '#3f9a46', nordeste: '#9ac05a', centro: '#7ab04a', sudeste: '#5aa85a', sul: '#4a9a6a' };
  const regions = {}; for (const k in REG) regions[k] = landPiece(REG[k], BASEC[k], 2.4, 3);
  function regColor(k, c, u) { regions[k].material.color.set(BASEC[k]).lerp(tmpC.set(c), u); }
  // rio Amazonas / Negro
  const riverPts = [[-73, -4], [-68, -3.5], [-63, -3.4], [-60, -3.1], [-56, -2.6], [-52, -1.6], [-50, -0.8]];
  const river = []; for (let i = 1; i < riverPts.length; i++) { const [x1, z1] = ll(...riverPts[i - 1]), [x2, z2] = ll(...riverPts[i]); const m = box(world, (x1 + x2) / 2, 5.6, (z1 + z2) / 2, Math.hypot(x2 - x1, z2 - z1) + 1, 0.4, 2.6, '#3a9ae8', true); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1); river.push(m); }
  const [mxM, mzM] = ll(-60, -3.1); const manaus = grp(world, mxM, 5.4, mzM); box(manaus, 0, 1.5, 0, 3, 3, 3, '#f0f0f0'); box(manaus, 2.5, 2.2, 1, 2, 4.4, 2, '#e0e0e8'); box(manaus, -2, 1, 2, 2, 2, 2, '#f4e8d8');
  // barcos encalhados (2023)
  const boats = opt(grp(world, mxM - 10, 5.4, mzM + 6)); for (let i = 0; i < 5; i++) { const b = grp(boats, i * 4.2, 0, (i % 2) * 3); box(b, 0, 0.8, 0, 3.4, 1.4, 1.6, i % 2 ? '#f4f4f4' : '#3a7ac8'); box(b, -0.4, 2, 0, 1.6, 1.2, 1.2, '#ffffff'); b.rotation.z = (i % 2 ? 0.2 : -0.15); }
  const sand = opt(box(world, mxM - 2, 5.5, mzM + 4, 30, 0.3, 12, '#d8b878'));

  // ---------- ventos alísios (setas) ----------
  const arrows = []; for (let i = 0; i < 8; i++) { const g = grp(world, -650 + i * 42, 10, (i % 2 ? -14 : 14)); const shaft = box(g, 6, 0, 0, 14, 1.2, 1.2, '#ffffff', true); const head = new T3.Mesh(CONE, bmat('#ffffff')); head.scale.set(2.4, 5, 2.4); head.rotation.z = Math.PI / 2; head.position.x = -2; g.add(head); g.userData.x0 = g.position.x; arrows.push(opt(g)); }
  // nuvens e chuva
  const cloudsBR = []; function cloud(x, z, s) { const c = grp(world, x, 30, z); for (let k = 0; k < 4; k++) { const m = new T3.Mesh(ICO, pmat('#f4f6fa')); m.position.set(k * 5 - 7, (k % 2) * 2, 0); m.scale.setScalar(5 + (k % 2) * 2); c.add(m); } c.scale.setScalar(s); return c; }
  const [sx, sz] = ll(-52, -28); const stormClouds = opt(grp(world)); for (let i = 0; i < 4; i++) { const c = cloud(sx + (i - 1.5) * 16, sz + (i % 2) * 10 - 5, 1); stormClouds.add(c); c.children.forEach(m => m.material = pmat('#5a6478')); }
  const rain = particles(world, 260, '#9ad0ff', 0.5);
  const bolt = opt(grp(world)); { let x = sx, y = 28; for (let i = 0; i < 5; i++) { const nx = x + (i % 2 ? 3 : -3); const s = box(bolt, (x + nx) / 2, y - 3, sz, 0.8, 7, 0.8, '#fff6a0', true); s.rotation.z = (nx - x) / 7; x = nx; y -= 6; } }
  const heat = particles(world, 220, '#ffb040', 0.7);
  const [nx0, nz0] = ll(-55, -6);
  const sunBall = opt(new T3.Mesh(new T3.SphereGeometry(10, 16, 12), bmat('#ffd23c'))); sunBall.position.set(nx0, 46, nz0); world.add(sunBall);

  // ---------- barco do pescador (Peru) ----------
  const [px0, pz0] = ll(-82, -8); const fish = grp(world, px0, 1, pz0); box(fish, 0, 1, 0, 10, 2, 4, '#8a5a34'); box(fish, 0, 2.3, 0, 9, 0.6, 3.4, '#a87a4a'); box(fish, 1, 6, 0, 0.5, 8, 0.5, '#5a3a24');
  const sail = box(fish, 1.2, 7, 0, 0.2, 6, 4.5, '#f4f0e0'); const fisher = makeHero({ shirt: '#c84a3a', plate: '#c84a3a', belt: '#3a2a1a', pants: '#3a3a5a', hair: '#1a1410', sword: false }); fisher.scale.setScalar(0.18); fisher.position.set(-2.5, 2.4, 0); fish.add(fisher);
  const star = opt(grp(world, px0 + 6, 26, pz0)); for (let k = 0; k < 4; k++) { const b = box(star, 0, 0, 0, 1, 6, 1, '#ffe680', true); b.rotation.z = k * Math.PI / 4; }

  // ---------- PARTE 2: lago Tefé, botos, floresta, fogo, estados, Nordeste ----------
  const [tx, tz] = ll(-64.7, -3.6); const lakeG = new T3.CircleGeometry(9, 18); lakeG.rotateX(-Math.PI / 2);
  const lake = new T3.Mesh(lakeG, new T3.MeshPhongMaterial({ color: '#3a9ae8', flatShading: true, shininess: 40 })); lake.position.set(tx, 5.75, tz + 4); world.add(lake);
  function boto(p) { const g = grp(p); const b = new T3.Mesh(ICO, pmat('#ff9ab8')); b.scale.set(2.6, 0.9, 0.9); g.add(b); const sn = new T3.Mesh(CONE, pmat('#ff9ab8')); sn.scale.set(0.3, 1.4, 0.3); sn.rotation.z = Math.PI / 2; sn.position.x = 2.8; g.add(sn); const fin = new T3.Mesh(CONE, pmat('#f07aa0')); fin.scale.set(0.5, 1.0, 0.25); fin.position.set(-0.2, 0.9, 0); g.add(fin); return g; }
  const botos = []; for (let i = 0; i < 4; i++) { const b = boto(world); b.userData.ph = i * 1.6; botos.push(opt(b)); }
  const trees = new T3.InstancedMesh(CONE, pmat('#2f7a3a'), 520); trees.frustumCulled = false; world.add(trees); const treePts = [];
  { const R = rng(91); const d = new T3.Object3D(); let n = 0; while (n < 520) { const lon = -73 + R() * 25, lat = 4 - R() * 15; if (lat < -13 || (lon > -50 && lat < -1)) continue; if (Math.hypot(lon + 64.7, lat + 3.6) < 3.2 || Math.hypot(lon + 60, lat + 3.1) < 4) continue; const [x, z] = ll(lon, lat); treePts.push([x, z]); d.position.set(x, 8, z); d.scale.set(1.4, 5 + R() * 2, 1.4); d.updateMatrix(); trees.setMatrixAt(n, d.matrix); n++; } trees.instanceMatrix.needsUpdate = true; }
  const fire = particles(world, 260, '#ff6a1a', 0.9); const smoke = particles(world, 140, '#6a6670', 2.2);
  const STATES = { rr: [[-60.7, 5.2], [-59.8, 4.5], [-58.9, 1.3], [-59.6, 0.9], [-60, -0.8], [-61.5, -1.3], [-62.3, 0.2], [-64, 1.5], [-64.6, 3.9], [-63.5, 3.9], [-61.5, 4.3]],
    ac: [[-73.9, -7.4], [-72.3, -8.3], [-70.4, -9.5], [-69.4, -10.9], [-68.6, -11.1], [-66.7, -9.9], [-67.5, -9.4], [-70, -8.3], [-72.5, -7.1]],
    am: [[-73.7, -4.3], [-70, -4.2], [-69.5, -1], [-70, 1.5], [-67, 1.8], [-64, 1.5], [-62.3, 0.2], [-61.5, -1.3], [-60, -0.8], [-58.5, -1.5], [-56.5, -2.3], [-58.5, -7.3], [-61.5, -8.7], [-66.7, -9.9], [-67.5, -9.4], [-70, -8.3], [-72.5, -7.1], [-73.9, -7.4], [-72.8, -5.2]] };
  const stateM = {}; for (const k in STATES) { const m = landPiece(STATES[k], '#ff3a3a', 0.6, 5.5); m.material = new T3.MeshBasicMaterial({ color: '#ff3a3a', transparent: true, opacity: 0.7, toneMapped: false }); stateM[k] = opt(m); }
  const cracks = opt(grp(world)); { const R = rng(93); for (let i = 0; i < 26; i++) { const [x, z] = ll(-36 - R() * 9, -4 - R() * 10); const c = box(cracks, x, 5.6, z, 6 + R() * 8, 0.3, 0.6, '#5a3a20'); c.rotation.y = R() * 3.14; } }
  const cattle = opt(grp(world)); { for (let i = 0; i < 6; i++) { const [x, z] = ll(-39 - i * 0.9, -8 - (i % 2) * 1.2); const c = grp(cattle, x, 5.6, z); box(c, 0, 1.6, 0, 3.2, 1.6, 1.4, '#f0ece4'); box(c, 1.9, 2.2, 0, 1, 1, 1, '#f0ece4'); [[-1.2, -0.5], [1.2, -0.5], [-1.2, 0.5], [1.2, 0.5]].forEach(([a, b]) => box(c, a, 0.5, b, 0.4, 1, 0.4, '#d8d0c4')); } }
  const tank = opt(grp(world)); { const [x, z] = ll(-38.5, -7); const t = new T3.Mesh(new T3.CylinderGeometry(2.4, 2.4, 4, 10), pmat('#5ab0e8')); t.position.set(x, 12, z); tank.add(t); [-1.5, 1.5].forEach(a => box(tank, x + a, 7.5, z, 0.4, 5, 0.4, '#8a8a90')); }
  const cargo = []; for (let i = 0; i < 3; i++) { const b = grp(world); box(b, 0, 0.8, 0, 4.4, 1.4, 1.8, '#f4f4f4'); box(b, -0.6, 2.1, 0, 2, 1.2, 1.4, '#3a7ac8'); box(b, 1.2, 1.9, 0, 1.2, 1, 1.2, '#c8963a'); b.userData.ph = i / 3; cargo.push(opt(b)); }
  const gauge = opt(grp(world, mxM + 6, 5.4, mzM - 2)); { box(gauge, 0, 7, 0, 0.6, 14, 0.6, '#f4f4f4'); for (let i = 0; i < 7; i++) box(gauge, 0.6, 1 + i * 2, 0, 1, 0.2, 0.3, i % 2 ? '#ff3a3a' : '#1a1a1a'); }
  const gaugeWater = opt(box(world, mxM + 6, 5.6, mzM - 2, 4, 1, 4, '#3a9ae8', true));
  const rainAway = particles(world, 120, '#cfe6ff', 1.6);
  function riverAlong(u) { const i = Math.min(riverPts.length - 2, Math.floor(u * (riverPts.length - 1))); const f = u * (riverPts.length - 1) - i; const a = ll(...riverPts[i]), b = ll(...riverPts[i + 1]); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])]; }

  // ---------- ilha do apresentador ----------
  const [ix, iz] = ll(-24, -12); const isle = grp(world, ix, 0, iz);
  { const base = new T3.Mesh(new T3.CylinderGeometry(22, 16, 8, 8), pmat('#d8c088')); base.position.y = 2; isle.add(base); const top = new T3.Mesh(new T3.CylinderGeometry(22, 22, 1.4, 8), pmat('#6cbf52')); top.position.y = 6.6; isle.add(top);
    const palm = grp(isle, -12, 7, -8); const tr = new T3.Mesh(new T3.CylinderGeometry(0.8, 1.1, 16, 6), pmat('#9a6a3a')); tr.position.y = 8; tr.rotation.z = 0.15; palm.add(tr); for (let k = 0; k < 5; k++) { const lf = box(palm, Math.cos(k * 1.25) * 4 + 1.2, 16, Math.sin(k * 1.25) * 4, 9, 0.5, 2.4, '#3f9a46'); lf.rotation.y = -k * 1.25; lf.rotation.z = -0.35; } }
  const host = makeBessekai('gamer'); host.scale.setScalar(0.85); host.position.set(4, 7.3, 4); isle.add(host);

  // ---------- EXTRAS: apresentador gigante (estilo moça do tempo), nuvens, pássaros, avião-tanque, Manaus maior ----------
  const hostBig = makeBessekai('gamer'); hostBig.scale.setScalar(2.6); world.add(hostBig); opt(hostBig);
  const holo = opt(grp(world)); { const ring = new T3.Mesh(new T3.TorusGeometry(10, 0.6, 6, 32), bmat('#3af0ff')); ring.rotation.x = Math.PI / 2; holo.add(ring); const r2 = new T3.Mesh(new T3.TorusGeometry(14, 0.4, 6, 32), bmat('#9a6aff')); r2.rotation.x = Math.PI / 2; r2.position.y = 0.4; holo.add(r2); }
  const driftClouds = []; { const R = rng(97); for (let i = 0; i < 9; i++) { const c = cloud(-300 + R() * 140, -20 + R() * 140, 0.9 + R() * 0.6); c.position.y = 140 + R() * 14; c.userData = { x0: c.position.x, sp: 4 + R() * 6 }; driftClouds.push(c); } }
  const birds = []; for (let i = 0; i < 7; i++) { const g = grp(world); const wl = box(g, -1.6, 0, 0, 3, 0.25, 1, '#1a1a24'); const wr = box(g, 1.6, 0, 0, 3, 0.25, 1, '#1a1a24'); g.userData = { wl, wr, ph: i * 0.9 }; birds.push(g); }
  const plane = opt(grp(world)); { box(plane, 0, 0, 0, 12, 2.6, 2.6, '#e8302a'); box(plane, 0, 0.4, 0, 3, 0.5, 18, '#ffd23c'); box(plane, -5.5, 2, 0, 2, 3, 0.5, '#e8302a'); box(plane, -5.5, 0.6, 0, 2, 0.4, 6, '#ffd23c'); box(plane, 6.4, 0, 0, 0.6, 1.8, 1.8, '#9ad0ff'); }
  const drop = particles(world, 160, '#7ad0ff', 0.7);
  { const R = rng(99); for (let i = 0; i < 26; i++) { const a = R() * 6.28, r = 2.5 + R() * 4.5; const h = 1 + R() * 3; box(manaus, Math.cos(a) * r, h / 2, Math.sin(a) * r, 0.8 + R() * 0.8, h, 0.8 + R() * 0.8, R() < 0.5 ? '#f0f0f4' : '#d8e0ec'); } }
  const ripples = particles(world, 30, '#bfe6ff', 0.4);

  // ---------- céu ----------
  const skyC = document.createElement('canvas'); skyC.width = 4; skyC.height = 256; const skyX = skyC.getContext('2d'); const skyT = new T3.CanvasTexture(skyC); skyT.colorSpace = T3.SRGBColorSpace; scene.background = skyT;
  const SKY = { day: ['#3a8ae8', '#cfe8ff', 1.25], alert: ['#2a0a18', '#8a2a3a', 0.8], warm: ['#4a7ad8', '#ffd8a8', 1.2] };
  scene.fog = new T3.Fog(0xcfe8ff, 500, 1600);
  const ca = new T3.Color(), cb = new T3.Color();
  function sky(a, b, u) { const A = SKY[a], B = SKY[b]; const g = skyX.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, ca.set(A[0]).lerp(cb.set(B[0]), u).getStyle()); g.addColorStop(1, ca.set(A[1]).lerp(cb.set(B[1]), u).getStyle()); skyX.fillStyle = g; skyX.fillRect(0, 0, 4, 256); skyT.needsUpdate = true;
    hemi.color.set(0xffffff); hemi.groundColor.set(0x3a5a6a); hemi.intensity = lerp(A[2], B[2], u); sun.intensity = 1.2 * lerp(A[2], B[2], u); rim.intensity = 0.2; scene.fog.color.set(A[1]).lerp(cb.set(B[1]), u); }

  // ---------- planos (câmera A→B, olhar, céu, ação) ----------
  const P_BR = ll(-50, -14); const [nex, nez] = ll(-39, -8);
  const C = {
    intro: { a: [ix + 22, 30, iz + 70], b: [ix + 12, 28, iz + 56], l: [ix + 4, 26, iz + 4], sky: 'day' },
    botos: { a: [tx + 26, 46, tz + 50], b: [tx + 14, 34, tz + 32], l: [tx, 6, tz + 4], sky: 'warm' },
    aviso: { a: [tx + 14, 34, tz + 32], b: [tx + 40, 90, tz + 120], l: [tx, 6, tz], sky: 'alert' },
    empurra: { a: [-200, 200, 160], b: [-220, 180, 120], l: [-240, 0, 10], sky: 'warm' },
    rios: { a: [mxM + 60, 70, mzM + 80], b: [mxM + 30, 50, mzM + 60], l: [mxM - 20, 5, mzM], sky: 'warm' },
    estrada: { a: [mxM - 40, 40, mzM + 46], b: [mxM + 10, 36, mzM + 40], l: [mxM - 10, 6, mzM], sky: 'warm' },
    regua: { a: [mxM + 24, 26, mzM + 26], b: [mxM + 18, 22, mzM + 18], l: [mxM + 6, 9, mzM - 2], sky: 'warm' },
    encalhe: { a: [mxM + 24, 40, mzM + 40], b: [mxM + 12, 32, mzM + 30], l: [mxM - 4, 5, mzM + 4], sky: 'warm' },
    tefe: { a: [tx + 18, 36, tz + 34], b: [tx + 10, 30, tz + 26], l: [tx, 6, tz + 4], sky: 'warm' },
    fogo: { a: [-250, 120, 150], b: [-240, 100, 120], l: [-260, 8, 10], sky: 'alert' },
    estados: { a: [-260, 230, 230], b: [-250, 210, 190], l: [-260, 0, 10], sky: 'warm' },
    nordeste: { a: [-250, 210, 190], b: [nex + 30, 90, nez + 110], l: [nex, 6, nez], sky: 'warm' },
    chuvosa: { a: [nex + 40, 80, nez + 100], b: [nex + 30, 70, nez + 80], l: [nex, 6, nez], sky: 'warm' },
    seca16: { a: [nex + 50, 120, nez + 140], b: [nex + 40, 110, nez + 120], l: [nex, 4, nez], sky: 'warm' },
    afeta: { a: [nex + 14, 22, nez + 30], b: [nex + 8, 20, nez + 22], l: [nex, 7, nez], sky: 'warm' },
    calor: { a: [P_BR[0] + 10, 360, P_BR[1] + 220], b: [P_BR[0], 330, P_BR[1] + 180], l: [P_BR[0], 0, P_BR[1]], sky: 'warm' },
    sul: { a: [sx + 60, 70, sz + 90], b: [sx + 40, 60, sz + 70], l: [sx, 10, sz], sky: 'alert' },
    parte3: { a: [sx + 40, 60, sz + 70], b: [sx + 20, 90, sz + 120], l: [sx, 10, sz], sky: 'alert' },
    cta: { a: [ix + 20, 30, iz + 70], b: [ix + 12, 28, iz + 56], l: [ix + 4, 26, iz + 4], sky: 'day' },
  };
  const fx = { flash: 0, shake: 0, black: 0, grey: 0, red: 0 };
  const hits = (t, list, w) => list.reduce((s2, h) => { const k = (t - h) / w; return k >= 0 && k < 1 ? Math.max(s2, 1 - k) : s2; }, 0);
  let gT = 0;
  function hostPose(o) { heroPose(host, gT, o); }
  const HEAT = {};
  function dryNorth(k) { regColor('norte', '#e8902a', k); river.forEach(r => r.scale.z = lerp(1, 0.35, k)); }
  function swimBotos(hot, dead) { botos.forEach((b, i) => { b.visible = true; const a = gT * 0.6 + b.userData.ph; const j = dead ? 0 : Math.max(0, Math.sin(gT * 2.2 + i * 1.7)); b.position.set(tx + Math.cos(a) * 5, 5.8 + (dead ? 0.2 : j * 3.2), tz + 4 + Math.sin(a) * 5); b.rotation.set(dead ? Math.PI : 0, -a - Math.PI / 2, dead ? 0 : Math.cos(gT * 2.2 + i * 1.7) * 0.8); });
    ripples.userData.place((i, d) => { const b = botos[i % 4].position; const k = ((gT * 1.5 + i * 0.13) % 1); d.position.set(b.x + Math.cos(i) * k * 3, 5.9, b.z + Math.sin(i) * k * 3); d.scale.set(1 + k * 2, 0.1, 1 + k * 2); }); lake.material.color.set('#3a9ae8').lerp(tmpC.set('#ff8a2a'), hot); }
  function burn(k) { fire.userData.place((i, d) => { const p = treePts[(i * 7) % treePts.length]; const R = rng(i + 3); if (R() > k) return false; const kk = ((gT * 1.2 + R()) % 1); d.position.set(p[0] + (R() - .5) * 2, 9 + kk * 9, p[1] + (R() - .5) * 2); d.scale.setScalar(0.9 * (1 - kk) + 0.2); });
    smoke.userData.place((i, d) => { const p = treePts[(i * 11) % treePts.length]; const R = rng(i + 9); if (R() > k) return false; const kk = ((gT * 0.4 + R()) % 1); d.position.set(p[0] + kk * 10, 16 + kk * 30, p[1]); d.scale.setScalar(1.5 + kk * 4); }); }
  const BIG = { empurra: [-62, -6], rios: null, estados: [-64, -4], nordeste: [-40, -8], chuvosa: [-40, -8], seca16: [-40, -9], calor: [-50, -12], sul: [-52, -28], parte3: [-52, -28] };
  function bigHost(id, lt) { if (!BIG[id]) return; hostBig.visible = true; holo.visible = true;
    const f = new T3.Vector3(); cam.getWorldDirection(f); const up = new T3.Vector3(0, 1, 0).applyQuaternion(cam.quaternion); const rt = new T3.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
    const pop = eBack(prog(lt, 0, 0.45)) || 0.001; hostBig.scale.setScalar(0.9 * pop);
    hostBig.position.copy(cam.position).addScaledVector(f, 55).addScaledVector(rt, 8.5).addScaledVector(up, -21 + Math.sin(gT * 1.6) * 0.5);
    hostBig.quaternion.copy(cam.quaternion); hostBig.rotateY(-0.35);
    holo.position.copy(hostBig.position); holo.quaternion.copy(cam.quaternion); holo.rotateX(0.55); holo.rotateY(gT * 1.5); holo.scale.setScalar(0.45 * pop);
    heroPose(hostBig, gT, { armL: -0.15, armLz: -1.45 - Math.sin(gT * 3) * 0.1, armR: Math.sin(gT * 2) * 0.15, headY: -0.35 + Math.sin(gT) * 0.12, legL: Math.sin(gT * 1.6) * 0.05 }); }
  const A = {
    intro() { hostPose({ armR: -0.2, armRz: 2.5 + Math.sin(gT * 9) * 0.4 }); },
    botos(lt, T) { dryNorth(0.6); swimBotos(eIO(prog(lt, 0.5, T)), lt > T * 0.75); },
    aviso(lt, T) { dryNorth(0.6); swimBotos(1, true); fx.red = 0.15 + 0.1 * Math.sin(gT * 9); },
    empurra(lt, T) { const k = eIO(prog(lt, 0.2, T)); dryNorth(k); rainAway.userData.place((i, d) => { const R = rng(i + 70); const [x0, z0] = ll(-62 + R() * 14, -2 - R() * 8); d.position.set(x0 + k * 120, 34 + R() * 6, z0 + k * 160); d.scale.setScalar(2 + R() * 2); }); },
    rios(lt, T) { dryNorth(eIO(prog(lt, 0, T))); },
    estrada(lt) { dryNorth(0.2); cargo.forEach((b, i) => { b.visible = true; const u = (gT * 0.05 + b.userData.ph) % 1; const [x, z, a] = riverAlong(u); b.position.set(x, 5.8, z); b.rotation.y = -a; }); },
    regua(lt, T) { dryNorth(0.7); gauge.visible = true; gaugeWater.visible = true; const h = lerp(12, 1.2, eIO(prog(lt, 0.2, T))); gaugeWater.scale.y = h; gaugeWater.position.y = 5.4 + h / 2; },
    encalhe(lt, T) { dryNorth(1); boats.visible = true; sand.visible = true; sand.scale.x = 30; },
    tefe(lt, T) { dryNorth(0.8); swimBotos(1, false); },
    fogo(lt, T) { dryNorth(0.9); burn(eIO(prog(lt, 0.2, T))); plane.visible = true; const u = prog(lt, 0.3, T); plane.position.set(-330 + u * 160, 34 + Math.sin(gT * 2) * 1.5, 10 + u * 20); plane.rotation.set(Math.sin(gT * 2) * 0.05, -0.12, 0);
      drop.userData.place((i, d) => { const R2 = rng(i + 5); const k = ((gT * 1.6 + R2()) % 1); if (u < 0.15) return false; d.position.set(plane.position.x - 4 - k * 6 + (R2() - .5) * 3, plane.position.y - k * 26, plane.position.z + (R2() - .5) * 4); d.scale.set(0.5, 1.4, 0.5); }); },
    estados(lt, T) { dryNorth(1); burn(0.6); const k = (Math.sin(gT * 6) + 1) / 2; ['rr', 'ac', 'am'].forEach((s, i) => { stateM[s].visible = lt > 0.4 + i * 0.5; stateM[s].material.opacity = 0.45 + 0.4 * k; }); },
    nordeste(lt, T) { dryNorth(1); regColor('nordeste', '#c8903a', eIO(prog(lt, 0, T))); },
    chuvosa(lt, T) { regColor('nordeste', '#c8903a', 1); sunBall.visible = true; sunBall.position.set(nex, 46, nez); },
    seca16(lt, T) { regColor('nordeste', '#a8642a', 1); cracks.visible = true; const k = eOut(prog(lt, 0.1, T * 0.8)); cracks.children.forEach((c, i) => { c.scale.x = (6 + (i % 5) * 1.6) * clamp(k * 1.5 - (i % 7) * 0.08); }); },
    afeta(lt, T) { regColor('nordeste', '#a8642a', 1); cracks.visible = true; cattle.visible = true; tank.visible = true; cattle.children.forEach((c, i) => { c.position.x += 0; c.rotation.y = Math.sin(gT * 0.6 + i) * 0.6; c.children[1].position.y = 2.2 + Math.sin(gT * 3 + i) * 0.3; }); const tk = tank.children[0]; tk.scale.y = 1 - 0.7 * prog(lt, 0, T); tk.position.y = 10 + 2 * tk.scale.y; },
    calor(lt, T) { const k = eIO(prog(lt, 0.2, T)); for (const r in regions) regColor(r, '#ff8a3a', k * 0.85); heat.userData.place((i, d) => { const R = rng(i + 80); const kk = ((gT * 0.5 + R()) % 1); const [x, z] = ll(-70 + R() * 34, -2 - R() * 28); d.position.set(x, 6 + kk * 26, z); d.scale.setScalar(0.4 + (1 - kk) * 0.9); }); },
    sul(lt) { regColor('sul', '#3a7ad8', 1); dryNorth(1); stormClouds.visible = true; rain.userData.place((i, d) => { const R = rng(i + 10); const k = ((gT * 1.4 + R()) % 1); d.position.set(sx + (R() - .5) * 60, 30 - k * 26, sz + (R() - .5) * 30); d.scale.set(0.3, 2.4, 0.3); }); bolt.visible = ((gT * 1.3) % 1.6) < 0.12; fx.flash = bolt.visible ? 0.25 : 0; },
    cta() { hostPose({ armR: -0.2, armRz: 2.5 + Math.sin(gT * 9) * 0.4 }); },
  };
  A.parte3 = A.sul;
  const flashEl = document.getElementById('mundo-flash'), tintEl = document.getElementById('mundo-tint'), greyEl = document.getElementById('mundo-glitch');
  function frame(t) {
    gT = t; let idx = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) idx = i;
    const sh = SHOTS[idx], prev = SHOTS[Math.max(0, idx - 1)]; const c = C[sh.id] || C.intro, pc = C[prev.id] || c;
    const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    for (const k in fx) fx[k] = 0;
    PARTS.forEach(p => p.visible = false); OPT.forEach(o => o.visible = false);
    for (const k in regions) { regColor(k, BASEC[k], 0); regions[k].position.z = 0; } river.forEach(r => r.scale.z = 1);
    hostPose({ headY: Math.sin(gT * 1.1) * 0.2 }); fish.position.y = 1;
    sky(pc.sky, c.sky, idx === 0 ? 1 : eIO(prog(lt, 0, 1.2)));
    oceanHeat(1.1, t);
    (A[sh.id] || (() => {}))(lt, T);
    driftClouds.forEach((c, i) => { c.position.x = c.userData.x0 + ((t * c.userData.sp + i * 30) % 120) - 60; });
    birds.forEach((b, i) => { const u2 = ((t * 0.04 + i * 0.13) % 1); b.position.set(-320 + u2 * 260 + Math.floor(i / 2) * 4, 34 + Math.sin(t + i) * 2, -10 + (i % 3) * 5 + u2 * 60); b.rotation.y = -0.4; const f = Math.sin(t * 9 + b.userData.ph) * 0.6; b.userData.wl.rotation.z = f; b.userData.wr.rotation.z = -f; });
    const u = eIO(clamp(lt / T)); let P = L3(c.a, c.b, u), Lk = c.l.slice();
    if (idx > 0) { const d = Math.hypot(c.a[0] - pc.b[0], c.a[1] - pc.b[1], c.a[2] - pc.b[2]); const tr = Math.min(T * 0.7, 0.5 + d / 220); const k = eIO(clamp(lt / tr)); if (k < 1) { P = L3(pc.b, P, k); Lk = L3(pc.l, c.l, k); if (d > 120) P[1] += Math.sin(k * Math.PI) * Math.min(160, d * 0.2); } }
    const sw = 0.6 + Math.hypot(P[0] - Lk[0], P[1] - Lk[1], P[2] - Lk[2]) * 0.01; P[0] += Math.sin(t * 0.7) * sw; P[1] += Math.sin(t * 1.1) * sw * 0.5; cam.position.set(P[0], P[1], P[2]); cam.lookAt(Lk[0], Lk[1], Lk[2]); if (cam.fov !== 50) { cam.fov = 50; cam.updateProjectionMatrix(); }
    if (fx.shake) { cam.position.x += Math.sin(t * 87) * fx.shake; cam.position.y += Math.cos(t * 71) * fx.shake; }
    cam.updateMatrixWorld(); bigHost(sh.id, lt); driftClouds.forEach(c => { c.visible = c.position.distanceTo(cam.position) > 110; });
    renderer.render(scene, cam);
    flashEl.style.opacity = fx.flash.toFixed(3);
    tintEl.style.background = fx.red ? '#ff0020' : '#000'; tintEl.style.mixBlendMode = fx.red ? 'multiply' : 'normal'; tintEl.style.opacity = fx.red ? fx.red : Math.min(1, fx.black);
    greyEl.style.opacity = 0;
  }
  const fontsReady = Promise.all(['700 40px Oswald', '700 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    const tl = gsap.timeline({ paused: true }); const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0); window.__timelines['mundo'] = tl;
  });
})();

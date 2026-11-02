  // ===================== O MENINO QUE NINGUÉM QUIS AJUDAR — EP. 1 =====================
  const BOY = { kid: true, s: 0.95, hair: 'boy', hairC: '#5a3018', shirt: '#3a62c8', hood: true, pants: '#3a3a48', shoe: '#d8463a', mood: 'sad', iris: '#5a3014' };
  const WOMAN = { s: 1.08, hair: 'bun', hairC: '#17121c', coat: '#e6cfa6', pants: '#1a1a22', shoe: '#14141a', heels: true, lips: '#c8303a', necklace: true, iris: '#3a5a2a', bag: '#c8302a' };
  const ANA = { s: 1.0, hair: 'long', hairC: '#7a4420', dress: '#e8a830', shoe: '#7a3a20', iris: '#5a3014', mood: 'smile' };
  const PAL = ['#e8643a', '#3aa86a', '#8a5ad8', '#e8b030', '#3a8ad8', '#d84a7a', '#5a6a7a', '#a86a3a'];
  const HAIRS = ['short', 'long', 'bun', 'cap', 'graybun', 'short'];
  const HC = ['#2a1a10', '#14101a', '#7a4420', '#3a2a5a', '#5a3a1a'];
  const PEOPLE = []; { const R = rng(77); for (let i = 0; i < 14; i++) PEOPLE.push({ s: 0.95 + R() * 0.15, hair: HAIRS[Math.floor(R() * HAIRS.length)], hairC: HC[Math.floor(R() * HC.length)], shirt: PAL[Math.floor(R() * PAL.length)], coat: R() < 0.3 ? PAL[Math.floor(R() * PAL.length)] : null, pants: ['#2a3048', '#4a3a2a', '#1a1a22', '#5a5a6a'][Math.floor(R() * 4)], dir: R() < 0.5 ? 1 : -1, sp: 70 + R() * 50, off: R() * 2400, lane: 1420 + R() * 70, phone: R() < 0.35, groceries: R() < 0.35, ph: R() * 6, mood: ['neutral', 'neutral', 'smug', 'neutral'][Math.floor(R() * 4)], walk: 7 + R() * 2 }); }

  // ---------- rua do supermercado ----------
  function sky(mode, x0, x1) {
    const g = X.createLinearGradient(0, -400, 0, 560);
    if (mode === 'day') { g.addColorStop(0, '#5aa0e8'); g.addColorStop(1, '#cfe6f8'); }
    else if (mode === 'dusk') { g.addColorStop(0, '#3a2a6a'); g.addColorStop(0.6, '#c8607a'); g.addColorStop(1, '#ffb07a'); }
    else { g.addColorStop(0, '#0c0a1e'); g.addColorStop(1, '#2a2448'); }
    X.fillStyle = g; X.fillRect(x0, -600, x1 - x0, 1200);
    if (mode === 'day') [[-200, 120], [380, 60], [900, 150], [1500, 90]].forEach(([x, y], i) => { const dx = (gT * 8 + i * 40) % 300; [[0, 0, 70], [60, -20, 60], [120, 0, 55]].forEach(([a, b, r]) => circle(x + a + dx, y + b, r, '#ffffff', 0)); });
    if (mode === 'night') { const R = rng(3); for (let i = 0; i < 60; i++) circle(x0 + R() * (x1 - x0), -500 + R() * 900, 1.5 + R() * 2, 'rgba(255,255,255,' + (0.4 + 0.4 * Math.sin(gT * 2 + i)).toFixed(2) + ')', 0); }
  }
  function windowsGrid(x, y, cols, rows, w, h, lit, seed) { const R = rng(seed); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = lit && R() < 0.6; const wx = x + c * (w + 26), wy = y + r * (h + 40); rect(wx, wy, w, h, on ? '#ffd88a' : '#5a6a8a', 5); line(wx + w / 2, wy, wx + w / 2, wy + h, OL, 3); if (on) glow(wx + w / 2, wy + h / 2, w, 'rgba(255,200,120,0.35)'); if (R() < 0.4) rect(wx - 6, wy + h - 8, w + 12, 12, '#7a5a4a', 4); } }
  function lights(x0, x1, y, night) { X.beginPath(); for (let x = x0; x <= x1; x += 20) { const k = ((x - x0) % 360) / 360; X.lineTo(x, y + Math.sin(k * Math.PI) * 60); } go(null, 3, '#2a2030'); const cols = ['#ff4a5a', '#ffd23c', '#5ad07a', '#5aa0ff', '#d86aff']; let i = 0; for (let x = x0 + 20; x < x1; x += 60) { const k = ((x - x0) % 360) / 360; const yy = y + Math.sin(k * Math.PI) * 60 + 14; const c = cols[i++ % 5]; ell(x, yy, 9, 13, 0, c, 3); if (night) glow(x, yy, 46, c, 0.55); } }
  function street(mode, o) {
    o = o || {}; const night = mode === 'night'; const wet = !!o.rain;
    sky(mode, -900, 2100);
    // prédio da esquerda (rosa) e da direita (verde-água)
    rect(-760, 160, 760, 1170, '#d88a9a', LW); windowsGrid(-700, 230, 4, 4, 110, 140, night || mode === 'dusk', 4); rect(-740, 160, 720, 40, shade('#d88a9a', 0.8), 4);
    rect(-600, 900, 380, 40, '#6a4a5a', 5); for (let i = 0; i < 8; i++) line(-590 + i * 50, 940, -590 + i * 50, 1010, '#6a4a5a', 4); line(-600, 1010, -220, 1010, '#6a4a5a', 5);
    rect(1080, 220, 760, 1110, '#6ab8b0', LW); windowsGrid(1130, 300, 4, 3, 110, 140, night || mode === 'dusk', 9);
    rrect(1150, 860, 520, 110, 14, '#2a8a4a', LW); text('FARMÁCIA', 1410, 916, 76, '#ffffff', '700 76px Oswald'); poly([[1170, 900], [1200, 900], [1200, 870], [1230, 870], [1230, 900], [1260, 900], [1260, 930], [1230, 930], [1230, 960], [1200, 960], [1200, 930], [1170, 930]], '#ffffff', 4);
    if (night) glow(1410, 915, 300, 'rgba(60,255,140,0.35)');
    rect(1130, 1000, 600, 330, night ? '#ffe8b0' : '#bfe0e8', LW);
    bricks(-760, 160, 760, 1170, '#c87a8a', 1); bricks(1080, 220, 760, 640, '#5aa8a0', 2);
    [[-560, 640], [-300, 380], [1300, 760]].forEach(([x, y], i) => { rect(x, y, 110, 70, '#d8d8e0', 5); for (let k = 0; k < 5; k++) line(x + 12 + k * 20, y + 10, x + 12 + k * 20, y + 60, '#9a9aa8', 3); const d = ((gT * 0.8 + i * 0.3) % 1); if (night || o.rain) ell(x + 90, y + 74 + d * 200, 4, 7, 0, '#9ad8ff', 0); });
    rrect(-520, 1060, 200, 260, 6, '#f4ecd8', 4); text('PROCURA-SE', -420, 1095, 34, '#c8302a', '700 34px Oswald'); circle(-420, 1180, 50, '#e8903a', 4); text('GATO MIMI', -420, 1270, 30, '#1a1a1a', '700 30px Oswald');
    rrect(-300, 1100, 230, 150, 6, '#ffd23c', 4); text('ALUGA-SE', -185, 1150, 44, '#1a1a1a', '700 44px Oswald'); text('9 9999-1234', -185, 1205, 30, '#1a1a1a', '700 30px Oswald');
    if (night) { const R = rng(12); for (let i = 0; i < 3; i++) { const wx = -700 + Math.floor(R() * 4) * 136, wy = 230 + Math.floor(R() * 4) * 180; X.save(); X.globalAlpha = 0.6; ell(wx + 55 + Math.sin(gT * 0.6 + i) * 20, wy + 110, 26, 40, 0, '#3a2a3a', 0); circle(wx + 55 + Math.sin(gT * 0.6 + i) * 20, wy + 60, 20, '#3a2a3a', 0); X.restore(); } }
    // supermercado
    rect(0, 380, 1080, 950, '#efe3c6', LW); rect(0, 1240, 1080, 90, '#c9b48e', LW);
    const signGlow = night ? 0.7 + 0.3 * Math.sin(gT * 3) * (Math.sin(gT * 17) > 0.92 ? 0 : 1) : 0;
    rrect(50, 410, 980, 170, 18, '#d8322a', LW); text('SUPERMERCADO', 540, 492, 128, '#ffffff', '700 128px Oswald', 'center', 10);
    rrect(400, 570, 280, 56, 12, '#ffd23c', 5); text('BOM PREÇO', 540, 598, 40, '#8a1a10', '700 40px Oswald');
    if (night) glow(540, 495, 520, 'rgba(255,80,60,' + (0.45 * signGlow).toFixed(2) + ')');
    for (let i = 0; i < 12; i++) { X.beginPath(); X.moveTo(i * 90, 640); X.lineTo(i * 90 + 90, 640); X.lineTo(i * 90 + 90, 690); X.arc(i * 90 + 45, 690, 45, 0, Math.PI); X.closePath(); go(i % 2 ? '#ffffff' : '#e83a3a', 5); }
    [[70, 730], [700, 730]].forEach(([x, y]) => { rect(x, y, 310, 450, night ? '#ffe8a8' : '#a8d4e8', LW); for (let r = 0; r < 4; r++) { rect(x + 14, y + 80 + r * 100, 282, 8, '#8a7a6a', 0); const R = rng(x + r); for (let k = 0; k < 9; k++) rect(x + 20 + k * 30, y + 46 + r * 100, 22, 34, PAL[Math.floor(R() * 8)], 3); } line(x + 155, y, x + 155, y + 450, OL, 5); if (night) glow(x + 155, y + 225, 330, 'rgba(255,220,140,0.35)'); });
    rrect(110, 760, 150, 110, 8, '#ffd23c', 5); text('OFERTA', 185, 795, 40, '#d8322a', '700 40px Oswald'); text('R$ 4,99', 185, 840, 34, '#1a1a1a', '700 34px Oswald');
    rrect(820, 1050, 140, 100, 8, '#ffd23c', 5); text('PÃO', 890, 1084, 36, '#d8322a', '700 36px Oswald'); text('R$ 0,79', 890, 1124, 30, '#1a1a1a', '700 30px Oswald');
    rect(420, 730, 240, 600, night ? '#fff0c0' : '#c4e2ee', LW); line(540, 730, 540, 1330, OL, 5); if (night) glow(540, 1050, 380, 'rgba(255,230,160,0.4)');
    rect(430, 1330, 220, 18, '#6a3a3a', 4);
    [[30, 1240], [1010, 1250]].forEach(([x, y]) => { rrect(x - 40, y, 80, 90, 10, '#b8643a', 5); for (let k = 0; k < 5; k++) { const a = -2.6 + k * 0.4 + Math.sin(gT * 1.5 + k) * 0.06; ell(x + Math.cos(a) * 50, y - 20 + Math.sin(a) * 50, 26, 12, a, '#3a9a4a', 4); } });
    // pombos no letreiro
    [[200, 405], [260, 405], [880, 405]].forEach(([x, y], i) => { const pk = Math.max(0, Math.sin(gT * 3 + i * 2)) * 8; ell(x, y - 18, 24, 16, 0, '#8a8a9a', 4); circle(x + 18, y - 34 + pk * 0.3, 11, '#9a9aaa', 4); poly([[x + 28, y - 34 + pk * 0.3], [x + 38, y - 31 + pk * 0.3], [x + 28, y - 29 + pk * 0.3]], '#e8a830', 2); circle(x + 21, y - 37 + pk * 0.3, 2.5, OL, 0); });
    // carrinhos
    for (let i = 0; i < 3; i++) { const x = 120 + i * 40; rect(x, 1200, 150, 70, 'rgba(0,0,0,0)', 4, '#5a5a6a'); for (let k = 1; k < 5; k++) line(x + k * 30, 1200, x + k * 30, 1270, '#5a5a6a', 3); circle(x + 20, 1290, 10, '#2a2a2e', 3); circle(x + 130, 1290, 10, '#2a2a2e', 3); }
    // calçada e rua
    rect(-900, 1330, 3000, 200, wet ? '#7a7a8a' : '#c8c0b4', LW); for (let x = -900; x < 2100; x += 120) line(x, 1330, x - 40, 1530, wet ? '#6a6a7a' : '#b4ac9e', 3);
    rect(-900, 1530, 3000, 26, '#9a9284', LW); rect(-900, 1556, 3000, 900, wet ? '#2a2a36' : '#4a4a54', 0); for (let x = -900; x < 2100; x += 260) rect(x, 1790, 140, 16, '#e8e0b0', 0);
    if (wet) { [[-300, 1440, 160], [300, 1470, 120], [880, 1450, 180], [1300, 1480, 140], [150, 1700, 260], [800, 1880, 220]].forEach(([x, y, r]) => { ell(x, y, r, r * 0.16, 0, 'rgba(120,140,200,0.5)', 0); const k = (gT * 1.4 + x * 0.01) % 1; ell(x + 20, y, r * 0.3 * k + 6, r * 0.05 * k + 2, 0, null, 2, 'rgba(220,230,255,' + (1 - k).toFixed(2) + ')'); });
      X.save(); X.globalAlpha = 0.35; X.globalCompositeOperation = 'lighter'; [[540, 1640, '#ff5a4a'], [220, 1650, '#ffd88a'], [850, 1650, '#ffd88a'], [1410, 1660, '#5aff9a']].forEach(([x, y, c]) => { const g = X.createLinearGradient(0, y - 100, 0, y + 260); g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(x - 120 + Math.sin(gT * 3 + x) * 6, y - 100, 240, 360); }); X.restore(); }
    // lixeira, bueiro com vapor, carros passando de dia
    rrect(-80, 1380, 70, 110, 8, '#3a8a4a', 5); rect(-88, 1372, 86, 16, '#2a6a3a', 5);
    ell(330, 1660, 90, 20, 0, '#2a2a30', 5); for (let k = 0; k < 4; k++) line(260 + k * 45, 1652, 270 + k * 45, 1668, '#4a4a54', 3);
    if (night || o.rain) { X.save(); for (let i = 0; i < 8; i++) { const R = rng(i + 61); const k = ((gT * 0.35 + R()) % 1); X.globalAlpha = 0.18 * (1 - k); circle(330 + Math.sin(k * 6 + i) * 30 + k * 40, 1640 - k * 300, 30 + k * 60, '#e8e8f0', 0); } X.restore(); }
    if (!night && !o.noCars) { [[0, '#3a7ad8', 1], [1, '#e8b030', -1]].forEach(([i, c, d]) => { const x = ((gT * 420 * d + i * 1400) % 3200 + 3200) % 3200 - 1000; X.save(); X.translate(x, d > 0 ? 1700 : 1860); X.scale(d * 0.8, 0.8); poly([[-260, -30], [-220, -100], [-100, -110], [-40, -180], [140, -180], [200, -100], [260, -90], [270, -30], [250, 0], [-250, 0]], c, LW); poly([[-20, -165], [60, -165], [60, -110], [-80, -110]], '#cfe6f8', 4); [-160, 170].forEach(wx => { circle(wx, 0, 44, '#1a1a1e', LW); circle(wx, 0, 18, '#9a9aa8', 3); }); X.restore(); }); }
    if (!night) for (let i = 0; i < 5; i++) { const x = ((gT * 90 + i * 260) % 2600) - 800, y = 120 + Math.sin(gT + i) * 20 + i * 18; const fl = Math.sin(gT * 10 + i) * 10; line(x - 18, y - fl, x, y, OL, 4); line(x, y, x + 18, y - fl, OL, 4); }
    // poste e varal de luzes
    rect(990, 760, 22, 770, '#3a3a4a', 5); rrect(950, 730, 110, 40, 10, '#2a2a36', 5); ell(1005, 778, 40, 12, 0, night || mode === 'dusk' ? '#fff2b0' : '#e8e8e0', 4); if (night || mode === 'dusk') { glow(1005, 790, 280, 'rgba(255,230,150,0.5)'); X.save(); X.globalAlpha = 0.18; poly([[970, 780], [1040, 780], [1180, 1530], [830, 1530]], '#fff2b0', 0); X.restore(); }
    line(-760, 280, 1840, 300, '#2a2030', 3); line(-760, 300, 1840, 340, '#2a2030', 2);
    lights(-760, 1840, 330 + Math.sin(gT * 1.2) * 6, night || mode === 'dusk');
    if (wet) for (let i = 0; i < 70; i++) { const R = rng(i + 101); const k = ((gT * 2.2 + R()) % 1); const x = -600 + R() * 2400, y = 1340 + R() * 560; X.save(); X.globalAlpha = 0.7 * (1 - k); X.beginPath(); X.ellipse(x, y, 4 + k * 22, 2 + k * 6, 0, Math.PI, 0); go(null, 2.5, '#d8e4ff'); X.restore(); }
    // caixote do menino
    rect(700, 1250, 150, 84, '#b8844a', LW); line(700, 1292, 850, 1292, '#7a5428', 4); line(725, 1250, 725, 1334, '#7a5428', 4); line(825, 1250, 825, 1334, '#7a5428', 4);
    // gato
    if (o.cat !== false) { const cx = -120, cy = 1325; ell(cx, cy - 28, 44, 30, 0, '#e8903a', 5); circle(cx + 40, cy - 60, 26, '#e8903a', 5); poly([[cx + 24, cy - 78], [cx + 30, cy - 104], [cx + 44, cy - 84]], '#e8903a', 4); poly([[cx + 46, cy - 84], [cx + 58, cy - 104], [cx + 62, cy - 78]], '#e8903a', 4); circle(cx + 34, cy - 62, 4, OL, 0); circle(cx + 50, cy - 62, 4, OL, 0); X.beginPath(); X.moveTo(cx - 40, cy - 30); X.quadraticCurveTo(cx - 90, cy - 60 + Math.sin(gT * 3) * 14, cx - 80, cy - 100); go(null, 10, '#e8903a'); }
  }
  function bricks(x, y, w, h, c, seed) { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.globalAlpha = 0.35; for (let r = 0; r * 34 < h; r++) for (let k = -1; k * 80 < w; k++) { const R = rng(seed * 1000 + r * 40 + k); if (R() < 0.55) continue; rect(x + k * 80 + (r % 2) * 40, y + r * 34, 76, 30, c, 2, shade(c, 0.75)); } X.globalAlpha = 0.2; for (let i = 0; i < 5; i++) { const R = rng(seed * 50 + i); ell(x + R() * w, y + R() * h, 40 + R() * 80, 20 + R() * 60, 0, shade(c, 0.6), 0); } X.restore(); }
  function umbrellaPeople(n) { for (let i = 0; i < n; i++) { const p = PEOPLE[i + 4]; const span = 3000; const x = ((p.off + gT * 140 * p.dir) % span + span) % span - 900; person(Object.assign({}, p, { x, y: 1450 + (i % 3) * 30, f: p.dir, walk: 9, umbrella: ['#2a4a8a', '#8a2a3a', '#2a6a4a', '#5a3a7a'][i % 4], phone: false, groceries: false, pose: { aF: 2.7, eF: 0.4 } })); } }
  function passers(n, speedK, filterFn) { const list = []; PEOPLE.slice(0, n).forEach((p, i) => { const span = 3000; const x = ((p.off + gT * p.sp * (speedK || 1) * p.dir) % span + span) % span - 900; if (filterFn && !filterFn(x)) return; list.push(Object.assign({}, p, { x, y: p.lane, f: p.dir, walk: p.walk * (speedK || 1) })); }); list.sort((a, b) => a.y - b.y).forEach(p => person(p)); }
  function boySitting(extra) { return person(Object.assign({}, BOY, { x: 770, y: 1255, sit: true, f: -1, photo: true, pose: { aF: 1.2, eF: 0.9, aB: 0.9, eB: 0.7 }, look: [-0.3, 0.2] }, extra || {})); }
  function car(x, y, lightsOn, doorOpen) {
    X.save(); X.translate(x, y);
    if (lightsOn) { X.save(); X.globalAlpha = 0.28; poly([[-330, -70], [-1100, -230], [-1100, 120]], '#fff6c8', 0); X.restore(); glow(-330, -70, 120, 'rgba(255,250,210,0.9)'); }
    poly([[-340, -40], [-300, -120], [-160, -130], [-80, -220], [180, -220], [260, -130], [340, -120], [350, -40], [330, 0], [-330, 0]], '#14141c', LW);
    poly([[-60, -205], [60, -205], [60, -135], [-140, -135]], '#5a6a9a', 4); poly([[80, -205], [170, -205], [230, -135], [80, -135]], '#5a6a9a', 4);
    if (doorOpen) { poly([[60, -205], [-10, -215], [-30, -10], [60, -10]], '#22222c', 5); }
    line(-320, -60, 340, -60, '#4a4a5a', 3); ell(-320, -70, 22, 14, 0, '#fff6c8', 4); rect(330, -80, 18, 22, '#ff3a3a', 3);
    [-210, 220].forEach(wx => { circle(wx, 0, 58, '#1a1a1e', LW); circle(wx, 0, 26, '#8a8a96', 4); });
    X.restore();
  }

  // ---------- close (rosto grande com ombros) ----------
  function closeUp(o, cx, cy, r, bgFn) {
    if (bgFn) blurred(bgFn);
    X.setTransform(1, 0, 0, 1, 0, 0);
    const body = o.coat || o.shirt || o.dress || '#3a62c8';
    if (o.hair === 'long') hairBack(cx, cy, r, o);
    rrect(cx - r * 1.45, cy + r * 0.88, r * 2.9, r * 2.4, r * 0.7, body, r * 0.05);
    if (o.hood) { rrect(cx - r * 0.9, cy + r * 0.8, r * 1.8, r * 0.4, r * 0.2, shade(body, 0.8), r * 0.04); line(cx - r * 0.3, cy + r * 1.1, cx - r * 0.35, cy + r * 1.7, '#e8e8f0', r * 0.04); line(cx + r * 0.3, cy + r * 1.1, cx + r * 0.35, cy + r * 1.7, '#e8e8f0', r * 0.04); }
    if (o.coat) { poly([[cx - r * 0.4, cy + r * 0.86], [cx, cy + r * 1.5], [cx + r * 0.4, cy + r * 0.86]], shade(body, 0.85), r * 0.04); }
    if (o.necklace) for (let i = 0; i < 11; i++) circle(cx - r * 0.42 + i * r * 0.084, cy + r * 1.0 + Math.sin(i / 10 * Math.PI) * r * 0.2, r * 0.035, '#fff8e8', r * 0.012);
    rrect(cx - r * 0.22, cy + r * 0.7, r * 0.44, r * 0.3, r * 0.1, SKIN, r * 0.04);
    X.save(); X.translate(cx, cy + r); X.rotate(Math.sin(gT * 0.7) * 0.025); X.translate(-cx, -cy - r); face(cx, cy + Math.sin(gT * 1.8) * 4, r, o); X.restore();
    if (o.rainDrops) { for (let i = 0; i < 9; i++) { const R = rng(i + 31); const k = ((gT * 0.15 + R()) % 1); X.save(); X.globalAlpha = 0.5; ell(R() * W, k * H, 10 + R() * 14, 14 + R() * 18, 0, 'rgba(200,220,255,0.25)', 3, 'rgba(230,240,255,0.6)'); X.restore(); } }
  }
  function umbrellaTop(k) { X.setTransform(1, 0, 0, 1, 0, 0); X.beginPath(); X.moveTo(-200, 520); X.quadraticCurveTo(540, -120, 1280, 520); for (let i = 7; i >= 0; i--) X.quadraticCurveTo(-200 + (i + 0.5) * 185, 470, -200 + i * 185, 520); go('#1a1a22', 8); for (let i = 1; i < 8; i++) line(540, 120, -200 + i * 185, 520, '#2e2e3a', 4); }

  // ---------- foto ----------
  function photoContent(x, y, w, h, zoom, sepia) {
    X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.translate(x + w / 2, y + h / 2); X.scale(zoom || 1, zoom || 1); X.translate(-w / 2, -h / 2);
    rect(0, 0, w, h, '#cfe0e8', 0); rect(w * 0.55, h * 0.08, w * 0.36, h * 0.4, '#e8f4ff', w * 0.012); line(w * 0.73, h * 0.08, w * 0.73, h * 0.48, OL, w * 0.01); line(w * 0.55, h * 0.28, w * 0.91, h * 0.28, OL, w * 0.01);
    rect(0, h * 0.78, w, h * 0.22, '#a8b8c8', 0);
    const s = w / 520; X.save(); X.translate(w * 0.42, h * 1.18); X.scale(s * 1.5, s * 1.5);
    const p = Object.assign({}, WOMAN, { x: 0, y: 0, s: 1, mood: 'smile', bag: null, coat: '#9ac8e8', pose: { aF: 1.4, eF: 1.3, aB: 1.2, eB: 1.2 } }); person(p);
    ell(30, -200, 70, 44, -0.2, '#f8f0e0', 6); circle(60, -222, 26, SKIN, 5); ell(56, -222, 4, 2, 0, OL, 0); ell(68, -222, 4, 2, 0, OL, 0);
    X.restore();
    X.restore();
    if (sepia) { X.save(); X.globalCompositeOperation = 'multiply'; X.fillStyle = '#e8c8a0'; X.fillRect(x, y, w, h); X.restore(); }
  }
  function polaroid(cx, cy, w, rot, zoom, date) {
    X.save(); X.translate(cx, cy); X.rotate(rot || 0); const h = w * 1.18;
    X.save(); X.shadowColor = 'rgba(0,0,0,0.5)'; X.shadowBlur = 40; X.shadowOffsetY = 16; rect(-w / 2, -h / 2, w, h, '#f6f0e2', w * 0.012); X.restore();
    photoContent(-w / 2 + w * 0.07, -h / 2 + w * 0.07, w * 0.86, w * 0.86, zoom);
    rect(-w / 2 + w * 0.07, -h / 2 + w * 0.07, w * 0.86, w * 0.86, null, w * 0.01);
    if (date) text(date, w * 0.25, -h / 2 + w * 0.86, w * 0.06, '#ff8a1a', '700 ' + Math.round(w * 0.06) + 'px Oswald');
    X.save(); X.globalAlpha = 0.25; line(-w / 2, -h * 0.1, w / 2, -h * 0.05, '#ffffff', w * 0.006); line(-w * 0.1, -h / 2, -w * 0.05, h / 2, '#ffffff', w * 0.005); X.restore();
    text('2016', 0, h / 2 - w * 0.08, w * 0.07, '#5a4a3a', '700 ' + Math.round(w * 0.07) + 'px Oswald');
    X.restore();
  }
  function hands(cx, cy, w) { X.setTransform(1, 0, 0, 1, 0, 0); [-1, 1].forEach(s => { rrect(cx + s * w * 0.5 - 70, cy + 120, 140, 700, 60, '#3a62c8', 8); circle(cx + s * w * 0.48, cy + 90, 62, SKIN, 7); ell(cx + s * w * 0.42, cy + 40, 26, 40, s * 0.4, SKIN, 6); }); }

  // ---------- flashbacks e opções ----------
  function hospital(lt) {
    rect(-200, -200, 1500, 2400, '#c8d8d0', 0); rect(-200, 1250, 1500, 900, '#a8b8b0', LW);
    rect(640, 300, 340, 420, '#2a3a5a', LW); line(810, 300, 810, 720, OL, 6); line(640, 510, 980, 510, OL, 6); rain(0);
    rect(80, 1000, 600, 70, '#e8e8f0', LW); rect(60, 900, 40, 380, '#9aa0aa', LW); rect(660, 960, 40, 320, '#9aa0aa', LW); rrect(110, 940, 170, 70, 30, '#ffffff', LW);
    person(Object.assign({}, WOMAN, { x: 300, y: 1240, sit: true, coat: '#9ac8e8', mood: 'cry', bag: null, necklace: false, pose: { aF: 2.6, eF: 1.4, aB: 2.4, eB: 1.5 } }));
    rect(80, 1060, 600, 120, '#9ac8e8', LW);
    person({ x: 900, y: 1300, s: 1.05, hair: 'short', hairC: '#3a3a3a', coat: '#ffffff', pants: '#3a4a6a', mood: 'sad', glasses: true, f: -1, look: [-0.4, 0.3], pose: { aF: 0.3, eF: 1.6 } });
    rrect(820, 1000, 60, 80, 6, '#5a8ad8', 4);
    rect(200, 1380, 260, 130, '#f0e8d8', LW); for (let i = 0; i < 6; i++) line(210 + i * 48, 1380, 210 + i * 48, 1290, OL, 4); line(200, 1290, 460, 1290, OL, 5); ell(330, 1400, 90, 20, 0, '#f8c8d8', 4);
  }
  function anaHouse(lt, T) {
    rect(-400, -300, 1900, 2600, '#2a2440', 0); rect(-400, 1400, 1900, 900, '#3a3448', LW);
    rect(250, 600, 580, 820, '#c88a6a', LW); rect(420, 900, 240, 500, '#ffe0a0', LW); glow(540, 1150, 500, 'rgba(255,210,140,0.6)'); rect(300, 680, 120, 120, '#ffe0a0', LW); rect(660, 680, 120, 120, '#ffe0a0', LW);
    poly([[200, 610], [540, 380], [880, 610]], '#8a4a3a', LW);
    const leave = prog(lt, T * 0.45, T); const ax = lerp(470, 1250, eIO(leave));
    X.save(); X.globalAlpha = 1 - leave * 0.8; person(Object.assign({}, ANA, { x: ax, y: 1460, f: leave > 0 ? 1 : -1, walk: leave > 0 ? 7 : 0, mood: leave > 0 ? 'sad' : 'smile', photo: leave === 0, pose: leave > 0 ? {} : { aF: 1.3, eF: 0.4 } })); X.restore();
    person(Object.assign({}, BOY, { x: 700, y: 1460, s: 0.8, mood: leave > 0 ? 'cry' : 'neutral', look: [leave > 0 ? 0.6 : -0.6, -0.3], photo: leave > 0, f: -1, pose: leave > 0 ? { aF: 1.2, eF: 0.9 } : { aF: 1.5 } }));
  }
  function mansion(lt) {
    sky('night', -200, 1300); rect(-200, 1300, 1500, 900, '#2a3a2a', 0);
    rect(120, 620, 840, 680, '#e8e0d0', LW); poly([[80, 630], [540, 360], [1000, 630]], '#4a3a4a', LW); for (let c = 0; c < 4; c++) for (let r = 0; r < 2; r++) { rect(170 + c * 200, 700 + r * 260, 120, 170, '#ffd88a', LW); glow(230 + c * 200, 785 + r * 260, 140, 'rgba(255,210,140,0.35)'); }
    for (let i = 0; i < 5; i++) rect(150 + i * 190, 640, 30, 660, '#f4f0e8', 4);
    rect(-200, 1460, 1500, 24, '#1a1a1e', 0); for (let i = 0; i < 30; i++) line(-200 + i * 52, 1300, -200 + i * 52, 1480, '#1a1a1e', 8);
    person(Object.assign({}, WOMAN, { x: 470, y: 1640, mood: 'smile', bag: null, pose: { aF: 0.9, eF: 0.2 } })); person(Object.assign({}, BOY, { x: 620, y: 1640, mood: 'smile', look: [-0.6, -0.2] }));
  }
  function files(lt) {
    rect(-200, -200, 1500, 2400, '#3a2a24', 0); rect(-200, 1000, 1500, 1200, '#6a4a34', LW); glow(300, 700, 700, 'rgba(255,200,120,0.5)');
    line(140, 1000, 220, 640, '#2a2a2e', 12); ell(260, 620, 120, 50, -0.4, '#2a6a4a', LW);
    [[300, 1180, -0.1, 'HOSPITAL SÃO LUCAS · 2016'], [620, 1300, 0.12, 'CERTIDÃO DE ÓBITO'], [420, 1500, -0.05, 'ANA · DESAPARECIDA']].forEach(([x, y, r, s]) => { X.save(); X.translate(x, y); X.rotate(r); rect(-230, -150, 460, 300, '#e8c88a', LW); rect(-230, -150, 160, 40, '#d8b070', 4); text(s, 0, -40, 30, '#3a2a1a', '700 30px Oswald'); for (let i = 0; i < 4; i++) line(-190, 20 + i * 34, 190 - i * 30, 20 + i * 34, '#8a6a4a', 4); X.restore(); });
    X.save(); X.translate(760, 1050 + Math.sin(gT * 2) * 20); circle(0, 0, 110, 'rgba(200,230,255,0.25)', 14); line(78, 78, 190, 190, '#5a3a24', 26); X.restore();
    polaroid(820, 680, 300, 0.15, 1); line(820, 520, 300, 1050, '#d82a2a', 4);
  }
  function family(lt) {
    rect(-200, -200, 1500, 2400, '#2a1a24', 0); glow(540, 1500, 700, 'rgba(255,170,80,0.45)');
    rrect(170, 420, 740, 900, 20, '#8a6a2a', 14); rect(220, 470, 640, 800, '#d8c8a8', LW);
    [[330, 900, 'graybun', 'neutral'], [470, 880, 'short', 'smug'], [620, 980, 'bun', 'neutral'], [760, 980, 'long', 'neutral']].forEach(([x, y, h, m], i) => { X.save(); X.beginPath(); X.rect(220, 470, 640, 800); X.clip(); person({ x, y: y + 260, s: 0.75, hair: h, hairC: h === 'long' ? '#7a4420' : '#2a1a14', shirt: ['#6a3a5a', '#3a4a6a', '#a86a3a', '#e8a830'][i], mood: m, noBlink: true }); X.restore(); });
    X.save(); X.translate(760, 735); X.rotate(0.2); poly([[-60, -80], [70, -60], [50, 90], [-70, 70]], '#1a1014', 5); X.restore();
    X.save(); X.globalCompositeOperation = 'multiply'; X.fillStyle = '#d8a870'; X.fillRect(220, 470, 640, 800); X.restore();
    rect(470, 1500, 40, 140, '#f4ecd8', 5); ell(490, 1490, 10 + Math.sin(gT * 14) * 2, 26, 0, '#ffb03a', 3); glow(490, 1480, 140, 'rgba(255,180,80,0.7)');
  }
  function sistersPhoto(cx, cy, w) {
    X.save(); X.translate(cx, cy); X.rotate(-0.06); const h = w * 1.2; rect(-w / 2, -h / 2, w, h, '#efe2c8', 10);
    X.save(); X.beginPath(); X.rect(-w / 2 + 40, -h / 2 + 40, w - 80, w - 80); X.clip(); rect(-w, -h, w * 2, h * 2, '#b8c8a8', 0); circle(w * 0.2, -h * 0.25, 90, '#ffe8a0', 0);
    person({ x: -w * 0.15, y: h * 0.32, s: 1.4, kid: true, hair: 'bun', hairC: '#17121c', dress: '#d86a8a', mood: 'smile', noBlink: true, pose: { aF: 1.6, eF: 0.3 } });
    person({ x: w * 0.17, y: h * 0.32, s: 1.4, kid: true, hair: 'long', hairC: '#7a4420', dress: '#e8a830', mood: 'smile', noBlink: true, f: -1, pose: { aF: 1.6, eF: 0.3 } });
    X.restore(); text('Clara e Ana · 1998', 0, h / 2 - 70, 50, '#4a3a2a', 'italic 700 50px Oswald');
    X.restore();
  }

  // ---------- planos ----------
  const EP = {
    _default(lt, T) { cam(540, 960, 1); street('day'); return 'warm'; },
    mercado_wide(lt, T) { camAB(lt, T, [520, 980, 0.6], [640, 1080, 0.78]); street('day'); boySitting(); passers(9, 1); return 'warm'; },
    boy_mid(lt, T) { camAB(lt, T, [740, 1120, 1.5], [760, 1100, 1.7]); street('day'); boySitting(); passers(5, 1, x => x < 600 || x > 980); return 'warm'; },
    mercado_sign(lt, T) { camAB(lt, T, [540, 560, 1.5], [540, 600, 1.75]); street('day'); return 'warm'; },
    boy_face(lt, T) { closeUp(Object.assign({}, BOY, { mood: 'sad', look: [-0.4, 0.1] }), 540, 880 - lt * 6, 300 + lt * 8, (k) => { cam(760, 1100, 1.5 * k); X.setTransform(1.5 * k, 0, 0, 1.5 * k, 108 - 760 * 1.5 * k, 192 - 1100 * 1.5 * k); street('day'); }); return 'warm'; },
    boy_bags(lt, T) { camAB(lt, T, [620, 1180, 1.05], [700, 1200, 1.15]); street('day'); boySitting({ look: [-0.8, -0.2] }); PEOPLE.slice(0, 6).forEach((p, i) => { const x = 1400 - ((gT * 160 + i * 220) % 1500); person(Object.assign({}, p, { x, y: 1440 + (i % 2) * 40, f: -1, groceries: true, phone: false, walk: 8 })); }); return 'warm'; },
    photo_hands(lt, T) { blurred(k => { X.setTransform(1.4 * k, 0, 0, 1.4 * k, 540 * k - 760 * 1.4 * k, 960 * k - 1150 * 1.4 * k); street('day'); }); X.setTransform(1, 0, 0, 1, 0, 0); const s = 1 + lt * 0.04; X.translate(540, 960); X.scale(s, s); X.translate(-540, -960); polaroid(540, 880, 560, -0.05 + Math.sin(gT * 1.5) * 0.02, 1); hands(540, 1060, 600); return 'warm'; },
    boy_asks(lt, T) { camAB(lt, T, [640, 1150, 1.25], [680, 1140, 1.4]); street('day'); const mx = lerp(1100, 200, clamp(lt / T)); person(Object.assign({}, PEOPLE[2], { x: mx, y: 1450, f: -1, walk: 8, phone: true, mood: 'smug', look: [0.8, 0], pose: { aF: 2.4, eF: 0.9 } })); person(Object.assign({}, BOY, { x: 720, y: 1400, f: 1, mood: 'worried', talk: true, photo: true, photoRot: -0.3, look: [0.6, -0.4], pose: { aF: 1.9, eF: 0.2, aB: 0.2 } })); return 'warm'; },
    boy_face_ask(lt, T) { closeUp(Object.assign({}, BOY, { mood: 'worried', talk: true, look: [0.5, -0.5] }), 540, 900, 310 + lt * 10, (k) => { X.setTransform(1.2 * k, 0, 0, 1.2 * k, 540 * k - 700 * 1.2 * k, 960 * k - 1150 * 1.2 * k); street('day'); }); return 'warm'; },
    crowd_passing(lt, T) { const k = clamp(lt / T); camAB(lt, T, [560, 1060, 0.72], [600, 1100, 0.8]); street(k < 0.5 ? 'day' : 'dusk'); boySitting({ look: [Math.sin(gT * 2) * 0.8, 0] }); passers(14, 3.2); return k < 0.5 ? 'warm' : 'dusk'; },
    boy_alone(lt, T) { camAB(lt, T, [760, 1140, 1.35], [770, 1120, 1.55]); street('dusk'); boySitting({ mood: 'sad', look: [0, 0.5] }); return 'dusk'; },
    rain_wide(lt, T) { camAB(lt, T, [540, 1050, 0.66], [560, 1090, 0.76]); street('night', { rain: true }); boySitting({ mood: 'sad', look: [0, 0.4] }); umbrellaPeople(4); rain(260); rain(40, 1, 0.12, true); return 'night'; },
    car_arrives(lt, T) { camAB(lt, T, [480, 1520, 0.9], [440, 1540, 1.0]); street('night', { rain: true }); boySitting({ look: [0.6, 0.2] }); const k = eOut(prog(lt, 0, T * 0.6)); car(lerp(1700, 420, k), 1760, true, lt > T * 0.7); if (lt > T * 0.75) { const u = eBack(prog(lt, T * 0.75, T)); X.save(); X.translate(470, 1590); X.scale(u, u); X.beginPath(); X.moveTo(-150, 0); X.quadraticCurveTo(0, -160, 150, 0); go('#1a1a22', 6); X.restore(); } rain(260); rain(40, 1, 0.12, true); return 'night'; },
    woman_stands(lt, T) { camAB(lt, T, [700, 1200, 1.15], [700, 1170, 1.3]); street('night', { rain: true }); boySitting({ mood: 'worried', look: [-0.8, -0.8] }); person(Object.assign({}, WOMAN, { x: 560, y: 1400, f: 1, mood: 'neutral', umbrella: '#1a1a22', look: [0.6, 0.5], pose: { aF: 2.7, eF: 0.4 } })); rain(220); rain(40, 1, 0.12, true); return 'night'; },
    woman_look(lt, T) { const m = lt > T * 0.55 ? 'shock' : 'neutral'; closeUp(Object.assign({}, WOMAN, { mood: m, look: [0.3, 0.8] }), 540, 980, 300 + lt * 14, (k) => { X.setTransform(1.3 * k, 0, 0, 1.3 * k, 540 * k - 650 * 1.3 * k, 960 * k - 1100 * 1.3 * k); street('night', { rain: true }); }); umbrellaTop(); rain(120, 0.8); return 'night'; },
    woman_tremble(lt, T) { const j = Math.sin(gT * 45) * 6 * clamp(lt * 2); X.save(); closeUp(Object.assign({}, WOMAN, { mood: 'scared', look: [0.2, 0.7], sweat: true }), 540 + j, 1020, 340, (k) => { X.setTransform(1.3 * k, 0, 0, 1.3 * k, 540 * k - 650 * 1.3 * k, 960 * k - 1100 * 1.3 * k); street('night', { rain: true }); }); X.restore(); X.setTransform(1, 0, 0, 1, j * 1.5, 0); umbrellaTop(); X.setTransform(1, 0, 0, 1, 0, 0); rain(120, 0.8); return 'night'; },
    woman_kneel(lt, T) { camAB(lt, T, [720, 1180, 1.45], [730, 1170, 1.6]); street('night', { rain: true }); boySitting({ mood: 'worried', look: [-0.7, -0.1] }); person(Object.assign({}, WOMAN, { x: 600, y: 1340, f: 1, sit: true, mood: 'worried', talk: true, umbrella: '#1a1a22', look: [0.7, 0.1], pose: { aF: 2.5, eF: 0.5 } })); rain(220); rain(30, 1, 0.12, true); return 'night'; },
    boy_face_rain(lt, T) { closeUp(Object.assign({}, BOY, { mood: 'sad', talk: true, look: [-0.5, -0.4], rainDrops: true }), 540, 900, 310 + lt * 9, (k) => { X.setTransform(1.4 * k, 0, 0, 1.4 * k, 540 * k - 700 * 1.4 * k, 960 * k - 1150 * 1.4 * k); street('night', { rain: true }); }); rain(140, 0.8); return 'night'; },
    flash_mom(lt, T) { camAB(lt, T, [520, 1180, 1.45], [640, 1180, 1.25]); anaHouse(lt, T); return 'sepia'; },
    boy_photo_up(lt, T) { blurred(k => { X.setTransform(1.3 * k, 0, 0, 1.3 * k, 540 * k - 700 * 1.3 * k, 960 * k - 1150 * 1.3 * k); street('night', { rain: true }); }); X.setTransform(1, 0, 0, 1, 0, 0); const u = eOut(prog(lt, 0, 0.8)); polaroid(540, lerp(1300, 860, u), 520, 0.06, 1); hands(540, lerp(1480, 1040, u), 560); rain(160, 0.9); return 'night'; },
    woman_cry(lt, T) { closeUp(Object.assign({}, WOMAN, { mood: 'cry', look: [0.2, 0.6], tears: clamp(lt / 1.2), rainDrops: true }), 540, 960, 320 + lt * 12, (k) => { X.setTransform(1.3 * k, 0, 0, 1.3 * k, 540 * k - 650 * 1.3 * k, 960 * k - 1100 * 1.3 * k); street('night', { rain: true }); }); umbrellaTop(); rain(120, 0.8); return 'night'; },
    photo_close(lt, T) { X.setTransform(1, 0, 0, 1, 0, 0); rect(0, 0, W, H, '#16121e', 0); glow(540, 900, 800, 'rgba(255,200,140,0.25)'); const z = 1 + lt * 0.05; X.translate(540, 900); X.scale(z, z); X.translate(-540, -900); polaroid(540, 900, 760, -0.04, 1, '12 03 16'); return 'warm'; },
    photo_zoom_baby(lt, T) { X.setTransform(1, 0, 0, 1, 0, 0); rect(0, 0, W, H, '#16121e', 0); const z = lerp(1.9, 2.5, eIO(clamp(lt / T))); X.translate(540, 960); X.scale(z, z); X.translate(-540 - 40, -900 + 70); polaroid(540, 900, 760, -0.04, 1, '12 03 16'); X.setTransform(1, 0, 0, 1, 0, 0); glow(560, 900, 380, 'rgba(255,230,180,0.25)'); return 'warm'; },
    hospital(lt, T) { camAB(lt, T, [600, 1150, 1.25], [420, 1120, 1.45]); hospital(lt); return 'sepia'; },
    two_shot(lt, T) { camAB(lt, T, [690, 1110, 1.7], [700, 1100, 1.85]); street('night', { rain: true }); boySitting({ mood: 'worried', look: [-0.7, -0.1] }); person(Object.assign({}, WOMAN, { x: 600, y: 1340, f: 1, sit: true, mood: 'cry', tears: 1, umbrella: '#1a1a22', look: [0.7, 0.1], pose: { aF: 2.5, eF: 0.5 } })); rain(220); return 'night'; },
    woman_face_ask(lt, T) { closeUp(Object.assign({}, WOMAN, { mood: 'worried', talk: true, tears: 0.6, look: [0.6, 0.3] }), 540, 960, 330 + lt * 10, (k) => { X.setTransform(1.3 * k, 0, 0, 1.3 * k, 540 * k - 650 * 1.3 * k, 960 * k - 1100 * 1.3 * k); street('night', { rain: true }); }); umbrellaTop(); rain(110, 0.8); return 'night'; },
    boy_face_whisper(lt, T) { closeUp(Object.assign({}, BOY, { mood: 'whisper', talk: true, look: [-0.6, -0.3] }), 560, 760, 420 + lt * 18, (k) => { X.setTransform(1.4 * k, 0, 0, 1.4 * k, 540 * k - 700 * 1.4 * k, 960 * k - 1150 * 1.4 * k); street('night', { rain: true }); }); rain(100, 0.7); return 'night'; },
    ana_title(lt, T) { X.setTransform(1, 0, 0, 1, 0, 0); rect(0, 0, W, H, '#1a1420', 0); cam(540, 1060, 1.1 + lt * 0.05); X.save(); X.globalAlpha = 0.9; person(Object.assign({}, ANA, { x: 540, y: 1500, s: 1.6, noBlink: true, pose: { aF: 0.2 } })); X.restore(); X.setTransform(1, 0, 0, 1, 0, 0); const u = eBack(prog(lt, 0.05, 0.5)); X.save(); X.translate(540, 620); X.scale(u, u); text('ANA', 0, 0, 260, '#ffffff', '700 260px Oswald', 'center', 18); X.restore(); return 'sepia'; },
    bag_fall(lt, T) { cam(540, 960, 1); X.setTransform(1, 0, 0, 1, 0, 0); rect(0, 0, W, 900, '#2a2a3a', 0); rect(0, 900, W, 1100, '#3a3a4a', 0); for (let i = 0; i < 9; i++) line(0, 980 + i * 110, W, 940 + i * 110, '#4a4a5a', 4); ell(540, 1360, 420, 90, 0, '#3a4a7a', 0); glow(540, 1360, 380, 'rgba(255,90,70,0.25)');
      const k = eIO(prog(lt, 0.1, 0.9)); const by = lerp(-200, 1250, k); const rot = k * 0.9; const hit = lt > 0.9;
      person(Object.assign({}, WOMAN, { x: 300, y: 3200, s: 4, bag: null, mood: 'shock' }));
      X.save(); X.translate(560, by); X.rotate(hit ? 0.9 : rot); rrect(-150, -110, 300, 220, 40, '#c8302a', 9); X.beginPath(); X.arc(0, -110, 90, Math.PI, 0); go(null, 12, '#5a1a1a'); rect(-30, -60, 60, 30, '#ffd23c', 5); X.restore();
      if (hit) { const u = prog(lt, 0.9, 1.6); for (let i = 0; i < 26; i++) { const R = rng(i + 4); const a = -Math.PI * R(); const v = 300 + R() * 400; ell(560 + Math.cos(a) * v * u, 1300 + Math.sin(a) * v * u * (1.4 - u) + u * u * 200, 8, 14, a, '#cfe0ff', 0); } ell(560, 1360, 200 * (1 + u * 2), 40 * (1 + u * 2), 0, null, 6 * (1 - u) + 0.1, 'rgba(220,230,255,' + (1 - u).toFixed(2) + ')');
        X.save(); X.translate(760 + u * 60, 1330); X.rotate(0.3); rrect(-12, -50, 24, 70, 6, '#d8303a', 5); rect(-12, -10, 24, 30, '#e8c860', 4); X.restore(); X.save(); X.translate(330 - u * 40, 1340); line(-30, 0, 30, -10, '#c8c8d0', 8); circle(-30, 0, 16, null, 6, '#c8c8d0'); X.restore(); }
      rain(180, 0.9); return 'night'; },
    woman_shock(lt, T) { closeUp(Object.assign({}, WOMAN, { mood: 'shock', look: [0, 0], tears: 0.8 }), 540, 960, 340 + lt * 28, (k) => { X.setTransform(1.3 * k, 0, 0, 1.3 * k, 540 * k - 650 * 1.3 * k, 960 * k - 1100 * 1.3 * k); street('night', { rain: true }); }); umbrellaTop(); rain(100, 0.7); return 'night'; },
    woman_shock2(lt, T) { closeUp(Object.assign({}, WOMAN, { mood: 'shock', look: [0, 0], tears: 1, noBlink: true }), 540, 1010, 780 + lt * 40, null); X.setTransform(1, 0, 0, 1, 0, 0); return 'night'; },
    sisters_photo(lt, T) { X.setTransform(1, 0, 0, 1, 0, 0); rect(0, 0, W, H, '#1a1420', 0); const z = 1 + lt * 0.06; X.translate(540, 900); X.scale(z, z); X.translate(-540, -900); sistersPhoto(540, 900, 760); return 'sepia'; },
    rain_wide_end(lt, T) { camAB(lt, T, [620, 1150, 1.1], [560, 1050, 0.7]); street('night', { rain: true }); person(Object.assign({}, WOMAN, { x: 600, y: 1420, f: 1, mood: 'sad', umbrella: '#1a1a22', look: [0.6, 0.5], pose: { aF: 2.7, eF: 0.4 } })); person(Object.assign({}, BOY, { x: 730, y: 1430, f: -1, mood: 'worried', photo: true, look: [-0.8, -0.8], pose: { aF: 1.2, eF: 0.9 } })); car(260, 1760, true, true); rain(240); rain(30, 1, 0.12, true); return 'night'; },
    opt_a(lt, T) { camAB(lt, T, [540, 1100, 0.85], [540, 1150, 0.95]); mansion(lt); rain(120, 0.6); return 'night'; },
    opt_b(lt, T) { camAB(lt, T, [540, 1060, 0.9], [580, 1080, 1.0]); files(lt); return 'warm'; },
    opt_c(lt, T) { camAB(lt, T, [540, 900, 0.95], [540, 880, 1.08]); family(lt); return 'warm'; },
    fim(lt, T) { camAB(lt, T, [560, 1080, 0.72], [520, 1060, 0.66]); street('night', { rain: true }); const k = clamp(lt / T); person(Object.assign({}, WOMAN, { x: 600 - k * 220, y: 1500, f: -1, walk: 6, mood: 'sad', umbrella: '#1a1a22', pose: { aF: 2.7, eF: 0.4 } })); person(Object.assign({}, BOY, { x: 700 - k * 220, y: 1505, f: -1, walk: 7, mood: 'neutral', photo: true })); car(150, 1760, true, true); rain(240); return 'night'; },
  };

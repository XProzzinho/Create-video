// Desenho 2D estilo "história animada" — canvas 2D, tudo função do tempo t.
// __SHOTS__ e __DUR__ são preenchidos pelo builder. Cenas específicas vêm do arquivo do episódio.
(function () {
  const SHOTS = __SHOTS__;
  const DUR = __DUR__;
  const W = 1080, H = 1920;
  const main = document.getElementById('mundo-cv').getContext('2d');
  let X = main;
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const eOut = x => 1 - Math.pow(1 - x, 3), eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eBack = x => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, u) => a + (b - a) * u;
  let gT = 0;

  // ---------- primitivas com contorno ----------
  const OL = '#1d1626'; let LW = 6;
  const SKIN = '#f7f4ef';
  function go(fill, lw, stroke) { if (fill) { X.fillStyle = fill; X.fill(); } if (lw !== 0) { X.lineWidth = lw || LW; X.strokeStyle = stroke || OL; X.lineJoin = 'round'; X.lineCap = 'round'; X.stroke(); } }
  function rect(x, y, w, h, fill, lw, stroke) { X.beginPath(); X.rect(x, y, w, h); go(fill, lw, stroke); }
  function rrect(x, y, w, h, r, fill, lw, stroke) { X.beginPath(); X.roundRect(x, y, w, h, r); go(fill, lw, stroke); }
  function circle(x, y, r, fill, lw, stroke) { X.beginPath(); X.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2); go(fill, lw, stroke); }
  function ell(x, y, rx, ry, rot, fill, lw, stroke) { X.beginPath(); X.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, Math.PI * 2); go(fill, lw, stroke); }
  function poly(pts, fill, lw, stroke) { X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.closePath(); go(fill, lw, stroke); }
  function line(x1, y1, x2, y2, col, lw) { X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.strokeStyle = col || OL; X.lineWidth = lw || LW; X.lineCap = 'round'; X.stroke(); }
  function text(s, x, y, size, col, font, align, stroke) { X.font = `${font || '700'} ${size}px ${font && font.includes('Oswald') ? '' : ''}`; X.font = (font || '700 ' + size + 'px Oswald'); X.textAlign = align || 'center'; X.textBaseline = 'middle'; if (stroke) { X.lineWidth = stroke; X.strokeStyle = OL; X.lineJoin = 'round'; X.strokeText(s, x, y); } X.fillStyle = col; X.fillText(s, x, y); }
  function glow(x, y, r, col, a) { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); X.save(); X.globalAlpha = a == null ? 1 : a; X.globalCompositeOperation = 'lighter'; X.fillStyle = g; X.fillRect(x - r, y - r, r * 2, r * 2); X.restore(); }
  function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255; r = Math.round(clamp(r * k / 255) * 255); g = Math.round(clamp(g * k / 255) * 255); b = Math.round(clamp(b * k / 255) * 255); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }

  // ---------- rosto (usado no corpo e nos closes) ----------
  // o: hair, hairC, mood ('neutral','sad','shock','cry','worried','smile','whisper','talk','scared'), look [dx,dy], lips, glasses, blush, ph
  function hairBack(cx, cy, r, o) {
    if (o.hair === 'long') { rrect(cx - r * 1.12, cy - r * 0.6, r * 2.24, r * 2.0, r * 0.7, o.hairC, r * 0.05); }
    if (o.hair === 'bun') { circle(cx + r * 0.1, cy - r * 1.02, r * 0.34, o.hairC, r * 0.05); }
    if (o.hair === 'graybun') { circle(cx, cy - r * 1.0, r * 0.3, '#b8b4c0', r * 0.05); }
  }
  function hairFront(cx, cy, r, o) {
    const c = o.hairC, lw = r * 0.05;
    X.save(); X.beginPath(); X.arc(cx, cy, r * 1.0, 0, Math.PI * 2); X.clip();
    if (o.hair === 'boy') { X.beginPath(); X.moveTo(cx - r * 1.1, cy - r * 0.05); for (let i = 0; i <= 8; i++) { const x = cx - r * 1.0 + i * r * 0.25; X.lineTo(x, cy - r * (i % 2 ? 0.28 : 0.42) - Math.sin(i) * r * 0.04); } X.lineTo(cx + r * 1.1, cy - r * 0.1); X.lineTo(cx + r * 1.1, cy - r * 1.2); X.lineTo(cx - r * 1.1, cy - r * 1.2); X.closePath(); go(c, 0); }
    else if (o.hair === 'bun' || o.hair === 'long') { X.beginPath(); X.moveTo(cx - r * 1.1, cy + (o.hair === 'long' ? r * 0.2 : -r * 0.15)); X.quadraticCurveTo(cx - r * 0.5, cy - r * 0.55, cx + r * 0.15, cy - r * 0.5); X.quadraticCurveTo(cx + r * 0.7, cy - r * 0.45, cx + r * 1.1, cy + (o.hair === 'long' ? r * 0.2 : -r * 0.15)); X.lineTo(cx + r * 1.1, cy - r * 1.2); X.lineTo(cx - r * 1.1, cy - r * 1.2); X.closePath(); go(c, 0); }
    else if (o.hair === 'short') { X.beginPath(); X.moveTo(cx - r * 1.1, cy - r * 0.2); X.quadraticCurveTo(cx, cy - r * 0.62, cx + r * 1.1, cy - r * 0.3); X.lineTo(cx + r * 1.1, cy - r * 1.2); X.lineTo(cx - r * 1.1, cy - r * 1.2); X.closePath(); go(c, 0); }
    else if (o.hair === 'graybun') { X.beginPath(); X.moveTo(cx - r * 1.1, cy - r * 0.2); X.quadraticCurveTo(cx, cy - r * 0.6, cx + r * 1.1, cy - r * 0.2); X.lineTo(cx + r * 1.1, cy - r * 1.2); X.lineTo(cx - r * 1.1, cy - r * 1.2); X.closePath(); go('#b8b4c0', 0); for (let i = 0; i < 5; i++) line(cx - r * 0.6 + i * r * 0.3, cy - r * 0.9, cx - r * 0.5 + i * r * 0.28, cy - r * 0.5, '#8a8494', lw * 0.6); }
    else if (o.hair === 'cap') { X.beginPath(); X.moveTo(cx - r * 1.1, cy - r * 0.3); X.lineTo(cx + r * 1.1, cy - r * 0.3); X.lineTo(cx + r * 1.1, cy - r * 1.2); X.lineTo(cx - r * 1.1, cy - r * 1.2); X.closePath(); go(c, 0); }
    X.restore();
    // contorno do cabelo
    if (o.hair === 'boy') { X.beginPath(); X.moveTo(cx - r * 0.98, cy - r * 0.18); for (let i = 0; i <= 8; i++) { const x = cx - r * 1.0 + i * r * 0.25; X.lineTo(x, cy - r * (i % 2 ? 0.28 : 0.42) - Math.sin(i) * r * 0.04); } go(null, lw); for (let i = 0; i < 4; i++) { const a = -2.4 + i * 0.35; poly([[cx + Math.cos(a) * r * 0.96, cy + Math.sin(a) * r * 0.96], [cx + Math.cos(a + 0.12) * r * 1.22, cy + Math.sin(a + 0.12) * r * 1.22], [cx + Math.cos(a + 0.28) * r * 0.96, cy + Math.sin(a + 0.28) * r * 0.96]], c, lw); } }
    if (o.hair === 'cap') { rrect(cx - r * 0.2, cy - r * 0.42, r * 1.5, r * 0.18, r * 0.08, shade(c, 0.8), lw); }
  }
  function face(cx, cy, r, o) {
    o = o || {}; const lw = Math.max(2.5, r * 0.055); const t = gT + (o.ph || 0);
    hairBack(cx, cy, r, o);
    [-1, 1].forEach(s => { ell(cx + s * r * 0.97, cy + r * 0.1, r * 0.14, r * 0.2, 0, SKIN, lw); ell(cx + s * r * 0.97, cy + r * 0.1, r * 0.06, r * 0.1, 0, '#e8d8d0', 0); });
    circle(cx, cy, r, SKIN, lw);
    X.save(); X.beginPath(); X.arc(cx, cy, r - lw / 2, 0, Math.PI * 2); X.clip(); ell(cx + r * 0.55, cy + r * 0.45, r * 0.75, r * 0.75, 0, 'rgba(150,130,170,0.16)', 0); X.restore();
    hairFront(cx, cy, r, o);
    if (o.hair && o.hair !== 'graybun') { X.save(); X.globalAlpha = 0.35; X.beginPath(); X.arc(cx - r * 0.1, cy - r * 0.15, r * 0.72, -2.5, -1.9); go(null, r * 0.06, '#ffffff'); X.restore(); }
    X.beginPath(); X.moveTo(cx + r * 0.02, cy + r * 0.2); X.quadraticCurveTo(cx + r * 0.12, cy + r * 0.3, cx + r * 0.02, cy + r * 0.33); go(null, lw * 0.6, '#9a8a9a');
    if (o.hair === 'boy' || o.hair === 'short' || o.hair === 'cap' || o.hair === 'bun' || o.hair === 'long' || o.hair === 'graybun') { X.beginPath(); X.arc(cx, cy, r, 0, Math.PI * 2); go(null, lw); }
    const m = o.mood || 'neutral'; const lk = o.look || [0, 0];
    const blink = (o.noBlink ? 1 : (((t + 0.7) % 3.6) < 0.12 ? 0.1 : 1));
    const ex = r * 0.36, ey = cy + r * 0.04, erx = r * 0.22, ery = r * (m === 'shock' || m === 'scared' ? 0.32 : 0.27);
    [-1, 1].forEach(s => {
      const x = cx + ex * s;
      ell(x, ey, erx, ery * blink, 0, '#ffffff', lw * 0.8);
      if (blink > 0.5) {
        const ir = r * (m === 'shock' || m === 'scared' ? 0.085 : 0.12);
        circle(x + lk[0] * erx * 0.45, ey + lk[1] * ery * 0.4 + r * 0.03, ir, o.iris || '#4a2a14', 0);
        circle(x + lk[0] * erx * 0.45, ey + lk[1] * ery * 0.4 + r * 0.03, ir * 0.5, '#120c14', 0);
        circle(x + lk[0] * erx * 0.45 - ir * 0.35, ey + lk[1] * ery * 0.4 - ir * 0.2, ir * 0.32, '#ffffff', 0);
        if (m === 'sad' || m === 'cry') { X.save(); X.beginPath(); X.ellipse(x, ey, erx + 1, ery + 1, 0, 0, Math.PI * 2); X.clip(); X.beginPath(); X.moveTo(x - erx * 1.2, ey - ery * 0.15 + (s > 0 ? 0 : ery * 0.3)); X.lineTo(x + erx * 1.2, ey - ery * 0.15 + (s > 0 ? ery * 0.3 : 0)); X.lineTo(x + erx * 1.2, ey - ery * 2); X.lineTo(x - erx * 1.2, ey - ery * 2); X.closePath(); go(SKIN, 0); X.restore(); X.beginPath(); X.moveTo(x - erx * 1.0, ey - ery * 0.12 + (s > 0 ? 0 : ery * 0.3)); X.lineTo(x + erx * 1.0, ey - ery * 0.12 + (s > 0 ? ery * 0.3 : 0)); go(null, lw * 0.9); }
        if (m === 'smug') { X.save(); X.beginPath(); X.ellipse(x, ey, erx + 1, ery + 1, 0, 0, Math.PI * 2); X.clip(); rect(x - erx * 1.3, ey - ery * 2, erx * 2.6, ery * 1.6, SKIN, 0); X.restore(); line(x - erx, ey - ery * 0.4, x + erx, ey - ery * 0.4, OL, lw); }
      } else line(x - erx, ey, x + erx, ey, OL, lw);
      // sobrancelhas
      const bY = ey - ery - r * 0.12; const tilt = m === 'sad' || m === 'cry' || m === 'worried' ? 0.35 : m === 'shock' || m === 'scared' ? -0.05 : m === 'angry' ? -0.4 : 0.08;
      const lift = m === 'shock' || m === 'scared' ? -r * 0.08 : 0;
      X.save(); X.translate(x, bY + lift); X.rotate(tilt * s); line(-erx * 0.8, 0, erx * 0.8, 0, OL, lw * 1.1); X.restore();
      if (o.blush) ell(x + s * r * 0.08, ey + ery + r * 0.1, r * 0.13, r * 0.06, 0, 'rgba(255,120,140,0.35)', 0);
    });
    if (o.glasses) { [-1, 1].forEach(s => circle(cx + ex * s, ey, erx * 1.15, null, lw * 0.7, '#3a3040')); line(cx - ex + erx * 1.15, ey, cx + ex - erx * 1.15, ey, '#3a3040', lw * 0.7); }
    // boca
    const my = cy + r * 0.5; const lc = o.lips || OL; const talk = (m === 'talk' || o.talk) ? Math.abs(Math.sin(t * 13)) : 0;
    if (m === 'smile') { X.beginPath(); X.arc(cx, my - r * 0.12, r * 0.18, 0.3, Math.PI - 0.3); go(null, lw, lc); }
    else if (m === 'sad' || m === 'worried') { X.beginPath(); X.arc(cx, my + r * 0.12, r * 0.16, Math.PI + 0.5, -0.5); go(null, lw, lc); }
    else if (m === 'shock' || m === 'scared') { ell(cx, my + r * 0.02, r * 0.1, r * 0.14, 0, '#3a1420', lw * 0.8, lc); }
    else if (m === 'cry') { X.beginPath(); X.moveTo(cx - r * 0.16, my + r * 0.06); X.quadraticCurveTo(cx, my - r * 0.1 - Math.sin(t * 9) * r * 0.03, cx + r * 0.16, my + r * 0.06); X.quadraticCurveTo(cx, my + r * 0.04, cx - r * 0.16, my + r * 0.06); go('#3a1420', lw * 0.8, lc); }
    else if (m === 'whisper') { ell(cx, my, r * 0.05, r * 0.05 + talk * r * 0.02, 0, '#3a1420', lw * 0.7, lc); }
    else if (talk) { ell(cx, my, r * 0.12, r * 0.02 + talk * r * 0.08, 0, '#3a1420', lw * 0.8, lc); }
    else line(cx - r * 0.12, my, cx + r * 0.12, my, lc, lw);
    if (o.lips && m !== 'shock' && m !== 'cry' && !talk) line(cx - r * 0.12, my, cx + r * 0.12, my, o.lips, lw * 1.6);
    // lágrimas
    if (o.tears || m === 'cry') { const k = o.tears == null ? 1 : o.tears; [-1, 1].forEach(s => { const x = cx + ex * s + s * erx * 0.2; X.save(); X.globalAlpha = 0.85 * k; X.beginPath(); X.moveTo(x - r * 0.03, ey + ery * 0.7); X.quadraticCurveTo(x + s * r * 0.02, ey + r * 0.4, x, ey + r * 0.4 + r * 0.35 * k); go(null, r * 0.06, '#7ac8ff'); for (let i = 0; i < 2; i++) { const kk = ((t * 0.9 + i * 0.5 + (s > 0 ? 0.25 : 0)) % 1); ell(x + s * r * 0.02, ey + r * 0.45 + kk * r * 0.6, r * 0.035, r * 0.05, 0, '#9ad8ff', 0); } X.restore(); }); }
    if (m === 'scared' || o.sweat) ell(cx + r * 0.75, cy - r * 0.35, r * 0.06, r * 0.1, 0.3, '#9ad8ff', lw * 0.6);
  }

  // ---------- corpo ----------
  function limb(x, y, a1, l1, a2, l2, col, w) {
    const kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1, ex = kx + Math.sin(a1 + a2) * l2, ey = ky + Math.cos(a1 + a2) * l2;
    X.lineCap = 'round'; X.lineJoin = 'round';
    X.beginPath(); X.moveTo(x, y); X.lineTo(kx, ky); X.lineTo(ex, ey); X.strokeStyle = OL; X.lineWidth = w + 10; X.stroke(); X.strokeStyle = col; X.lineWidth = w; X.stroke();
    return [ex, ey, a1 + a2];
  }
  // o: x,y (pés), s, f (1 direita/-1 esquerda), shirt, pants, shoe, hair, hairC, mood, look, coat, dress, kid, pose {...}
  function person(o) {
    const s = o.s || 1, f = o.f || 1; const t = gT + (o.ph || 0); const P = o.pose || {};
    if (!o.sit && !o.noShadow) { X.save(); X.globalAlpha = 0.28; ell(o.x, o.y + 4, 62 * s, 12 * s, 0, '#000', 0); X.restore(); }
    X.save(); X.translate(o.x, o.y); X.scale(s * f, s); LW = 6;
    const kid = !!o.kid; const hip = kid ? -110 : -140, sh = kid ? -200 : -240, hr = kid ? 74 : 66;
    const walk = o.walk ? Math.sin(t * o.walk) : 0; const bob = o.walk ? Math.abs(Math.cos(t * o.walk)) * 6 : Math.sin(t * 2) * 1.5;
    X.translate(0, -bob + (o.sit ? (kid ? 40 : 55) : 0));
    const legL = kid ? 55 : 68, armL = kid ? 44 : 52;
    const pants = o.pants || '#2a3048', shoe = o.shoe || '#2a2026';
    const swing = o.kid && o.sit ? Math.sin(t * 2.3) * 0.25 : 0; const legs = o.sit ? [[1.45, -1.45 + swing], [1.6, -1.55 - swing]] : [[walk * 0.45 + (P.legA || 0), Math.max(0, -walk) * 0.5], [-walk * 0.45 + (P.legB || 0), Math.max(0, walk) * 0.5]];
    legs.forEach(([a1, a2], i) => { const e = limb((i ? 10 : -10), hip, a1, legL, a2, legL, i ? pants : shade(pants, 0.85), 22); ell(e[0] + 9, e[1] + 4, 16, 9, 0, shoe, 4); if (o.heels) line(e[0] - 4, e[1] + 6, e[0] - 6, e[1] + 16, OL, 4); });
    // braço de trás
    const sw = o.walk ? walk * 0.5 : Math.sin(t * 1.6) * 0.04;
    const arms = [[P.aB != null ? P.aB : -sw, P.eB != null ? P.eB : 0.25], [P.aF != null ? P.aF : sw, P.eF != null ? P.eF : 0.25]];
    const sleeve = o.coat || o.dress || o.shirt || '#3a6ad8';
    const back = limb(-6, sh + 10, arms[0][0], armL, arms[0][1], armL, shade(sleeve, 0.8), 17); circle(back[0], back[1], 9, SKIN, 4);
    // tronco
    if (o.coat) { poly([[-34, sh - 4], [34, sh - 4], [50, hip + 80], [-50, hip + 80]], o.coat, LW); line(-46, hip + 10, 46, hip + 10, shade(o.coat, 0.6), 7); X.save(); X.beginPath(); X.moveTo(-34, sh - 4); X.lineTo(34, sh - 4); X.lineTo(50, hip + 80); X.lineTo(-50, hip + 80); X.closePath(); X.clip(); rect(10, sh - 10, 60, 300, 'rgba(0,0,0,0.13)', 0); X.restore(); line(0, sh, 0, hip + 78, shade(o.coat, 0.75), 3); for (let i = 0; i < 3; i++) circle(10, sh + 30 + i * 32, 4, shade(o.coat, 0.55), 2); const fl = Math.sin(t * 3) * 4; poly([[-50, hip + 80], [-44 + fl, hip + 92], [44 + fl, hip + 92], [50, hip + 80]], shade(o.coat, 0.9), 4); poly([[-20, sh - 4], [0, sh + 30], [20, sh - 4]], shade(o.coat, 0.85), 4); }
    else if (o.dress) { poly([[-30, sh - 4], [30, sh - 4], [56, hip + 70], [-56, hip + 70]], o.dress, LW); for (let i = 0; i < 6; i++) circle(-30 + (i % 3) * 30, sh + 40 + Math.floor(i / 3) * 60, 4, shade(o.dress, 1.3), 0); }
    else { rrect(-34, sh - 6, 68, hip - sh + 18, 16, o.shirt || '#3a6ad8', LW); X.save(); X.beginPath(); X.roundRect(-34, sh - 6, 68, hip - sh + 18, 16); X.clip(); rect(8, sh - 10, 40, hip - sh + 30, 'rgba(0,0,0,0.14)', 0); X.restore(); if (o.hood) { rrect(-28, sh - 12, 56, 22, 10, shade(o.shirt, 0.8), 4); rrect(-22, sh + 52, 44, 28, 8, shade(o.shirt, 0.85), 4); line(-8, sh + 6, -10, sh + 40, '#e8e8f0', 3); line(8, sh + 6, 10, sh + 40, '#e8e8f0', 3); } else { poly([[-16, sh - 6], [0, sh + 14], [16, sh - 6]], shade(o.shirt || '#3a6ad8', 1.25), 3); } if (o.stripe) rect(-34, sh + 40, 68, 12, o.stripe, 0); }
    if (o.necklace) for (let i = 0; i < 7; i++) circle(-15 + i * 5, sh + 6 + Math.sin(i / 6 * Math.PI) * 9, 3, '#fff8e8', 1.5);
    if (o.badge) rrect(10, sh + 30, 18, 22, 3, o.badge, 3);
    // cabeça
    const hx = 0, hy = sh - hr + 6; X.save(); X.translate(0, sh); X.rotate(Math.sin(t * 0.9) * 0.04 + (o.tilt || 0)); X.translate(0, -sh);
    if (o.look3) { /* placeholder */ }
    face(hx, hy, hr, Object.assign({}, o, { ph: o.ph })); X.restore();
    // braço da frente + objetos
    const fr = limb(6, sh + 10, arms[1][0], armL, arms[1][1], armL, sleeve, 17); circle(fr[0], fr[1], 9.5, SKIN, 4);
    if (o.photo) { X.save(); X.translate(fr[0] + 6, fr[1] - 6); X.rotate(o.photoRot || -0.1); rect(-4, -34, 46, 54, '#f4efe4', 4); rect(2, -28, 34, 34, '#c8a888', 2); circle(19, -14, 7, SKIN, 2); X.restore(); }
    if (o.umbrella) { const ux = fr[0], uy = fr[1]; line(ux, uy + 10, ux, uy - 150, '#2a2a2e', 5); X.beginPath(); X.moveTo(ux - 150, uy - 140); X.quadraticCurveTo(ux, uy - 300, ux + 150, uy - 140); for (let i = 5; i >= 0; i--) X.quadraticCurveTo(ux - 150 + (i + 0.5) * 50, uy - 160, ux - 150 + i * 50, uy - 140); go(o.umbrella, LW); X.beginPath(); X.arc(ux - 8, uy + 10, 8, 0, Math.PI); go(null, 4); }
    if (o.bag) { const bx = o.bagFree ? null : back; if (bx) { line(bx[0], bx[1], bx[0] - 6, bx[1] + 26, '#3a1a1a', 4); rrect(bx[0] - 28, bx[1] + 22, 46, 38, 8, o.bag, 5); rect(bx[0] - 10, bx[1] + 30, 10, 6, '#ffd23c', 2); } }
    if (o.phone) { rrect(fr[0] - 6, fr[1] - 28, 16, 28, 4, '#1a1a24', 3); }
    if (o.groceries) { rrect(back[0] - 20, back[1] + 4, 40, 44, 6, '#f4ead4', 4); circle(back[0] - 6, back[1] + 2, 8, '#ff8a3a', 3); rect(back[0] + 2, back[1] - 12, 6, 20, '#3aa84a', 2); }
    X.restore();
    return { hand: [o.x + fr[0] * s * f, o.y + (fr[1] + (o.sit ? (kid ? 40 : 55) : 0) - bob) * s] };
  }

  // ---------- textura, granulado, vinheta ----------
  const noise = document.createElement('canvas'); noise.width = noise.height = 256; { const n = noise.getContext('2d'); const id = n.createImageData(256, 256); const R = rng(5); for (let i = 0; i < id.data.length; i += 4) { const v = R() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } n.putImageData(id, 0, 0); }
  let noisePat = null;
  function post(grade, t) {
    X.setTransform(1, 0, 0, 1, 0, 0);
    if (grade === 'sepia') { X.save(); X.globalCompositeOperation = 'saturation'; X.fillStyle = '#808080'; X.globalAlpha = 0.85; X.fillRect(0, 0, W, H); X.restore(); X.save(); X.globalCompositeOperation = 'multiply'; X.fillStyle = '#f0c890'; X.fillRect(0, 0, W, H); X.restore(); }
    if (grade === 'night') { X.save(); X.globalCompositeOperation = 'multiply'; X.fillStyle = '#9aa0d8'; X.fillRect(0, 0, W, H); X.restore(); const lf = (t % 9.3); const fl = lf < 0.08 ? 0.35 : (lf > 0.16 && lf < 0.22 ? 0.22 : 0); if (fl) { X.fillStyle = 'rgba(220,230,255,' + fl + ')'; X.fillRect(0, 0, W, H); } }
    if (grade === 'warm') { X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = '#ffb070'; X.globalAlpha = 0.35; X.fillRect(0, 0, W, H); X.restore(); }
    if (grade === 'dusk') { X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = '#ff7a8a'; X.globalAlpha = 0.4; X.fillRect(0, 0, W, H); X.restore(); }
    if (!noisePat) noisePat = X.createPattern(noise, 'repeat');
    X.save(); X.globalAlpha = 0.07; X.globalCompositeOperation = 'overlay'; const f = Math.floor(t * 30) % 7; X.translate(f * 37, f * 53); X.fillStyle = noisePat; X.fillRect(-300, -300, W + 600, H + 600); X.restore();
    const v = X.createRadialGradient(W / 2, H * 0.46, H * 0.28, W / 2, H * 0.46, H * 0.72); v.addColorStop(0, 'rgba(10,6,20,0)'); v.addColorStop(1, 'rgba(10,6,20,0.62)'); X.fillStyle = v; X.fillRect(0, 0, W, H);
    if (grade === 'sepia') { X.save(); X.globalAlpha = 0.25; for (let i = 0; i < 6; i++) { const R = rng(Math.floor(t * 12) * 7 + i); line(R() * W, 0, R() * W + 4, H, '#3a2a18', 2); } X.restore(); }
  }
  let SHOT_LT = 9;
  function cam(cx, cy, z, rot) { const pk = 1 + 0.07 * (1 - eOut(clamp(SHOT_LT / 0.45))); z *= pk; cx += Math.sin(gT * 0.8) * 6 + Math.sin(gT * 2.1) * 2.5; cy += Math.cos(gT * 0.6) * 5 + Math.sin(gT * 1.7) * 2; rot = (rot || 0) + Math.sin(gT * 0.5) * 0.006; X.setTransform(z, 0, 0, z, W / 2 - cx * z, H / 2 - cy * z); if (rot) { X.translate(cx, cy); X.rotate(rot); X.translate(-cx, -cy); } }
  // fundo desfocado: desenha a cena num canvas pequeno e amplia
  const blurC = document.createElement('canvas'); blurC.width = 216; blurC.height = 384; const blurX = blurC.getContext('2d');
  function blurred(fn) { const old = X; X = blurX; X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, 216, 384); fn(0.2); X = old; X.setTransform(1, 0, 0, 1, 0, 0); X.imageSmoothingEnabled = true; X.imageSmoothingQuality = 'high'; X.drawImage(blurC, 0, 0, W, H); X.fillStyle = 'rgba(8,6,18,0.32)'; X.fillRect(0, 0, W, H); const cols = ['255,200,120', '255,90,90', '120,200,255', '255,240,180', '200,120,255']; for (let i = 0; i < 16; i++) { const R = rng(i * 7 + 3); const x = (R() * W + gT * (8 + R() * 14)) % (W + 200) - 100, y = R() * H * 0.75; const rr2 = 30 + R() * 70; X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = 0.18 + 0.12 * Math.sin(gT * 1.3 + i); circle(x, y, rr2, 'rgb(' + cols[i % 5] + ')', 0); X.restore(); } }
  function rain(n, k, ang, front) { X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 0.55 * (k == null ? 1 : k); X.strokeStyle = '#cfe0ff'; X.lineCap = 'round';
    for (let i = 0; i < n; i++) { const R = rng(i * 13 + (front ? 5 : 1)); const sp = front ? 2600 : 1700; const L = front ? 90 : 46; const x0 = R() * (W + 300) - 150; const y = ((R() * H + gT * sp) % (H + 200)) - 100; const x = x0 + y * (ang || 0.12); X.lineWidth = front ? 4 : 2.2; X.beginPath(); X.moveTo(x, y); X.lineTo(x + L * (ang || 0.12), y + L); X.stroke(); }
    X.restore(); }

  // __EPISODIO__

  const capEl = null;
  function frame(t) {
    gT = t; let idx = 0; for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].t0) idx = i;
    const sh = SHOTS[idx]; const lt = t - sh.t0, T = Math.max(0.3, sh.t1 - sh.t0);
    X = main; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
    SHOT_LT = lt; const fn = EP[sh.id] || EP._default; const g = fn(lt, T, t) || 'warm';
    post(g, t);
    // corte com "flash" suave nos primeiros quadros
    if (lt < 0.1 && idx > 0) { X.fillStyle = 'rgba(0,0,0,' + (0.6 * (1 - lt / 0.1)).toFixed(3) + ')'; X.fillRect(0, 0, W, H); }
  }
  const fontsReady = Promise.all(['700 40px Oswald', '900 40px Inter', '700 40px Inter'].map(f => document.fonts.load(f).catch(() => null)));
  fontsReady.then(() => {
    const tl = gsap.timeline({ paused: true }); const clock = { t: 0 };
    tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: 'none', onUpdate: function () { frame(clock.t); } }, 0);
    frame(0); window.__timelines['mundo'] = tl;
  });
})();

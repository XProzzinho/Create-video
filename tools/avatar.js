  // ===== Apresentador Bessekai — visuais novos (precisa de box/grp/makeHero/heroPose do topo de mundo.js) =====
  function makeBessekai(style) {
    const S = {
      street: { shirt: '#ff7a1a', plate: '#ff8f3a', belt: '#1a1a22', pants: '#20263a', boot: '#f4f4f4', hair: '#15110e', skin: '#e8b48a' },
      gamer: { shirt: '#5a2ad8', plate: '#6a3af0', belt: '#16122a', pants: '#14141e', boot: '#1a1a24', hair: '#0e0c12', skin: '#f0c49a' },
      varsity: { shirt: '#14223a', plate: '#f2f0ea', belt: '#14223a', pants: '#3a5a8a', boot: '#ffffff', hair: '#2a1a10', skin: '#c88a5e' },
    }[style] || {};
    const h = makeHero(Object.assign({ sword: false }, S)); const P = h.userData.P;
    // rosto mais simpático: sobrancelhas, brilho nos olhos, sorriso
    P.eyes.forEach(e => { e.scale.set(0.8, 1.0, 0.1); });
    [-1.05, 1.05].forEach(x => { box(P.head, x, 3.45, 2.24, 1.1, 0.32, 0.1, '#1a120c'); box(P.head, x + 0.18, 2.85, 2.29, 0.24, 0.24, 0.06, '#ffffff', true); });
    box(P.head, 0, 0.95, 2.23, 1.4, 0.22, 0.1, '#c24a4a'); box(P.head, -0.8, 1.12, 2.23, 0.3, 0.22, 0.1, '#c24a4a'); box(P.head, 0.8, 1.12, 2.23, 0.3, 0.22, 0.1, '#c24a4a'); box(P.head, 0, 0.82, 2.21, 0.9, 0.16, 0.08, '#f4f4f4');
    box(P.head, 0, 1.5, 2.25, 0.6, 0.5, 0.2, S.skin ? shade(S.skin) : '#d8a07a');
    if (style === 'street') {
      // moletom laranja com capuz, logo "B", fone no pescoço, óculos escuros, corrente
      box(P.torso, 0, 6.2, -2.0, 5.4, 2.4, 1.4, '#e86a10'); box(P.torso, 0, 4.2, 1.82, 2.6, 2.6, 0.12, '#ffffff'); box(P.torso, 0, 4.2, 1.9, 1.4, 1.8, 0.08, '#ff7a1a');
      box(P.torso, -0.6, 2.2, 1.85, 0.4, 2.2, 0.1, '#ffffff'); box(P.torso, 0.6, 2.2, 1.85, 0.4, 2.2, 0.1, '#ffffff');
      box(P.torso, 0, 7.0, 1.4, 4.2, 0.7, 1.2, '#1a1a1a'); [-2.3, 2.3].forEach(x => box(P.torso, x, 7.0, 1.2, 1.2, 1.4, 1.6, '#111'));
      box(P.torso, 0, 5.6, 1.86, 0.5, 0.5, 0.1, '#ffd23c', true);
      box(P.head, 0, 2.7, 2.36, 4.4, 1.0, 0.2, '#0c0c10'); box(P.head, -1.1, 2.75, 2.48, 1.5, 0.7, 0.08, '#2a3a5a'); box(P.head, 1.1, 2.75, 2.48, 1.5, 0.7, 0.08, '#2a3a5a');
      box(P.head, 0, 5.4, 0.3, 4.8, 1.6, 4.6, '#15110e'); box(P.head, 0.8, 6.3, 0.8, 2.4, 0.9, 2.6, '#15110e'); box(P.head, -1.2, 6.1, -0.4, 1.8, 0.8, 2.0, '#15110e');
      [P.legL, P.legR].forEach(l => { box(l, 0, -6.3, 0.3, 2.7, 1.8, 3.4, '#ffffff'); box(l, 0, -7.0, 0.3, 2.8, 0.5, 3.5, '#ff7a1a'); });
    } else if (style === 'gamer') {
      // jaqueta roxa, headset com luz, tênis com LED
      box(P.torso, 0, 3.3, 1.75, 1.0, 6.4, 0.2, '#16122a'); box(P.torso, -1.8, 2.6, 1.8, 1.4, 1.2, 0.1, '#3af0ff', true);
      box(P.head, 0, 6.35, 0, 5.8, 0.8, 1.2, '#1a1a24'); [-1, 1].forEach(s => { box(P.head, 2.95 * s, 4.6, 0, 0.6, 3.6, 1.0, '#1a1a24'); box(P.head, 2.95 * s, 2.6, 0, 1.2, 2.8, 2.8, '#1a1a24'); box(P.head, 3.6 * s, 2.6, 0, 0.12, 1.8, 1.8, '#3af0ff', true); });
      box(P.head, 2.4, 1.6, 1.6, 0.4, 0.4, 2.2, '#1a1a24'); box(P.head, 2.3, 1.4, 2.7, 0.6, 0.6, 0.6, '#3af0ff', true);
      box(P.head, 0, 5.6, 0.4, 4.6, 1.0, 4.2, '#0e0c12'); box(P.head, 1.2, 4.6, 2.3, 2.2, 1.0, 0.4, '#0e0c12');
      [P.legL, P.legR].forEach(l => { box(l, 0, -6.4, 0.3, 2.7, 1.6, 3.4, '#1a1a24'); box(l, 0, -7.1, 0.3, 2.8, 0.3, 3.5, '#3af0ff', true); });
    } else {
      // jaqueta college (corpo azul-marinho, mangas brancas), boné virado laranja, óculos redondos
      [P.armL, P.armR].forEach(a => { a.children[0].material = mat('#f2f0ea'); });
      box(P.torso, 0, 4.4, 1.8, 2.2, 2.2, 0.12, '#ff7a1a'); box(P.torso, 0, 4.4, 1.88, 1.2, 1.4, 0.08, '#ffffff');
      box(P.torso, 0, 0.9, 1.78, 6.0, 0.6, 0.1, '#ff7a1a'); box(P.torso, 0, 6.6, 1.6, 4.0, 0.8, 0.4, '#ff7a1a');
      box(P.head, 0, 5.2, 0.1, 5.1, 1.5, 5.1, '#ff7a1a'); box(P.head, 0, 4.7, -3.1, 4.4, 0.5, 2.2, '#ff7a1a'); box(P.head, 0, 6.0, 0, 1.0, 0.4, 1.0, '#ffffff');
      [-1.1, 1.1].forEach(x => { box(P.head, x, 2.7, 2.34, 1.5, 0.12, 0.1, '#d8b048'); box(P.head, x, 2.15, 2.34, 1.5, 0.12, 0.1, '#d8b048'); box(P.head, x - 0.7, 2.42, 2.34, 0.12, 0.6, 0.1, '#d8b048'); box(P.head, x + 0.7, 2.42, 2.34, 0.12, 0.6, 0.1, '#d8b048'); });
      box(P.head, 0, 2.6, 2.34, 0.4, 0.12, 0.1, '#d8b048');
      [P.legL, P.legR].forEach(l => { box(l, 0, -6.3, 0.3, 2.7, 1.8, 3.4, '#ffffff'); box(l, 0, -5.6, 0.3, 2.8, 0.4, 3.5, '#ff7a1a'); });
    }
    return h;
  }
  function shade(hex) { const c = new THREE.Color(hex); c.multiplyScalar(0.88); return '#' + c.getHexString(); }

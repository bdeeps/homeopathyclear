// Chapter 3: potentisation, with a real dilution calculator. A rack of six test tubes shows the last
// six steps of a serial dilution. Each step keeps 1 part of the last tube and adds 99 parts of water
// (C scale) or 9 parts (X scale), then shakes hard ("succussion"). Pink dots are molecules of the
// starting substance, drawn one for one while there are fewer than 120, and as a random Poisson draw
// once fewer than one is expected (so a lucky tube may still show one).
//
// Model (all counts per litre, so the tube size does not matter):
//   expected molecules after n steps  λ = (moles at the start) × NA ÷ 100ⁿ   (or ÷ 10ⁿ for X)
//   chance a litre holds at least one = 1 − e^(−λ)  (Poisson)
//   water you would search to expect one molecule = 1 ÷ λ litres
// Everything is done in log10 so 200C (1 in 10⁴⁰⁰) does not underflow. With 1 mole in the first
// litre (58 g of table salt, "Natrum muriaticum"), λ falls below 1 at 12C: 6.0 × 10²³ ÷ 10²⁴ = 0.60.
// 30C: 6.022 × 10²³ ÷ 10⁶⁰ = 6.0 × 10⁻³⁷ per litre → 1.66 × 10³⁶ L for one molecule
//   = 1.2 × 10¹⁵ times Earth's oceans (1.335 × 10²¹ L, NOAA); as a ball of water,
//   d = (6V/π)^(1/3) with V = 1.66 × 10³³ m³ → 1.47 × 10¹¹ m ≈ 147 million km, about the Earth–Sun
//   distance (149.6 million km).
// Sources: Avogadro constant (BIPM SI Brochure 2019); scales and succussion (Organon 6th ed. §269–
// §270; Homoeopathic Pharmacopoeia of India, Ministry of AYUSH / PCIM&H); molar mass NaCl 58.44 g/mol.
// Hahnemann died in 1843; the first estimate of the number of molecules in a given amount of gas came
// from Josef Loschmidt in 1865 (Britannica "Loschmidt"), so Hahnemann could not have known that his
// high dilutions ran out of molecules.
// Water memory: Davenas et al. (Benveniste's group), Nature 333:816 (30 June 1988), reported that
// antibody solutions diluted far beyond 12C still affected basophil cells. Nature published it with
// an editorial reservation and sent John Maddox, Walter Stewart and James Randi to watch repeats; under
// blinded conditions the effect vanished (Maddox et al., Nature 334:287, 28 July 1988). Hirst et al.,
// Nature 366:525 (1993) also failed to replicate. Hydrogen bonds in liquid water break and re-form in
// about a picosecond, and the network loses memory of its arrangement in well under a picosecond
// (Cowan et al., Nature 434:199, 2005). IIT Bombay researchers reported nanoparticles of the starting
// metal in some commercial high-potency metal remedies (Chikramane et al., Homeopathy 99:231, 2010);
// this has not been shown to explain any clinical effect, and it does not apply to plant remedies.
import { THREE, M, box, beam, clamp, lerp, smooth } from '../kit.js';
import {
  COL, hex, tint, inReel, fitNarrow, compactReadout, rows, board, panelBg, text, wrap, axes, polyline,
  testTube, dots, rnd, prng, NA, LOG_NA, OCEAN_L, AU_KM, SCALES, logLeft, pAny, logSphereKm, fmtLog, fmtVolume, sup, book,
} from '../homeo.js';

export const POT = [...Array.from({ length: 31 }, (_, i) => i), 200];
const CAP = 120, NT = 6, X0 = -2.5, DX = 1.0, BASE = 0.36, TR = 0.23, TH = 1.9;
const potName = (n, sc) => (n === 0 ? 'start' : `${n}${sc}`);
const molFmt = (m) => (m >= 1 ? `${m.toFixed(m >= 10 ? 0 : 1)} mol` : m >= 1e-3 ? `${(m * 1000).toFixed(m >= 0.01 ? 0 : 1)} mmol` : `${(m * 1e6).toFixed(0)} µmol`);
// Chance that a litre holds at least one molecule, as a percentage people can read (log-safe).
const pct = (Lg) => { const p = pAny(Lg); if (p >= 0.9995) return 'certain'; if (p < 1e-4) return fmtLog(Lg + 2) + '%'; return (p * 100).toFixed(p > 0.1 ? 0 : 2) + '%'; };
const VIEW = { pos: [0.3, 2.9, 9.8], target: [-0.45, 2.35, 0] };

export default {
  id: 'potency',
  short: 'Dilute and shake',
  title: 'Potentisation: dilute, shake, repeat',
  subtitle: 'A real dilution calculator. Watch the molecules run out, and see how much water you would need to find just one.',
  view: VIEW,
  learn: `<p>Homeopathic remedies are made by <b>potentisation</b>. Take 1 drop of the starting liquid, add <b>99 drops</b> of water or alcohol, and shake hard with firm knocks. That is <b>1C</b>, a dilution of 1 in 100. Hahnemann knocked the bottle on a leather-bound book; this shaking is called <b>succussion</b>. Repeat: 2C is 1 in 10,000, <b>6C</b> is 1 in 10¹², <b>30C</b> is 1 in 10⁶⁰. (The X scale uses 1 in 10 per step, so 24X equals 12C.) Homeopathy teaches that each step makes the remedy <b>stronger</b>.</p>
    <p>Chemistry lets us count what is left. A <b>mole</b> of anything holds <b>6.022 × 10²³</b> particles (<b>Avogadro's number</b>). Start with a whole mole in a litre, 58 g of table salt, which homeopathy calls <i>Natrum muriaticum</i>. Each C step divides the count by 100. At <b>12C</b> you expect only <b>0.6</b> of a molecule per litre: most bottles have <b>none at all</b>.</p>
    <p><b>The maths for 30C:</b> 6.022 × 10²³ ÷ 10⁶⁰ = 6 × 10⁻³⁷ molecules per litre. To expect <b>one</b> molecule you'd need 1 ÷ (6 × 10⁻³⁷) ≈ <b>1.7 × 10³⁶ litres</b>. Earth's oceans hold about 1.3 × 10²¹ litres, so that is about <b>10¹⁵ oceans</b>, a ball of water about <b>147 million km</b> across, nearly the distance from Earth to the Sun. <b>200C</b> is 1 in 10⁴⁰⁰, far more than the roughly 10⁸⁰ atoms in the whole visible universe. Hahnemann couldn't have known this: the first estimate of molecule numbers came in 1865, after he died.</p>
    <p>So how could a remedy act? Some homeopaths propose <b>water memory</b>: water keeps an imprint of what was dissolved in it. In <b>1988</b> Jacques Benveniste's lab reported such an effect in <i>Nature</i>, but when the tests were repeated blind, it vanished, and later labs could not repeat it. Physics adds that the <b>hydrogen bonds</b> holding water molecules together break and re-form about every <b>picosecond</b> (a millionth of a millionth of a second), so there is no lasting structure to store a pattern. Water has also touched countless other substances. Some researchers, including a 2010 IIT Bombay team, reported tiny particles of the starting metal in some high potencies, but this has not been shown to cause any effect in patients.</p>
    <p class="tip"><b>Try it:</b> press "Dilute one more step" and watch the dots. Jump to 12C, then 30C and read how much water you'd need. Turn on "Zoom into the water" to watch hydrogen bonds flicker. Solutions and concentration are explained in OsmosisClear.</p>`,
  terms: [
    { t: 'Potentisation', d: 'Homeopathy\'s process of repeated dilution with vigorous shaking at each step.' },
    { t: 'Succussion', d: 'Shaking a remedy bottle with firm knocks between dilution steps.' },
    { t: 'C and X scales', d: 'C means 1 part in 100 at each step; X (or D) means 1 part in 10. 30C = 1 part in 10⁶⁰.' },
    { t: 'Mole', d: 'A counting unit for particles: 6.022 × 10²³ of them, about 58 g of table salt.' },
    { t: 'Avogadro\'s number', d: '6.022 × 10²³, the number of particles in one mole.' },
    { t: 'Water memory', d: 'The claim that water keeps an imprint of substances once dissolved in it. Not supported by physics or blinded tests.' },
    { t: 'Hydrogen bond', d: 'A weak attraction between water molecules that breaks and re-forms about every picosecond.' },
  ],
  defaults: { pot: 6, scale: 'C', mol: 1, zoom: false, labels: true },
  controls: [
    { key: 'pot', type: 'range', label: 'Potency', min: 0, max: POT.length - 1, step: 1, ends: ['start', '30C | 200C'], fmt: (v, s) => potName(POT[Math.round(v)], s.scale) },
    { key: 'scale', type: 'seg', label: 'Scale', options: [{ v: 'C', label: 'C: 1 in 100' }, { v: 'X', label: 'X: 1 in 10' }] },
    { key: 'mol', type: 'log', label: 'Starting amount in the first litre', min: 1e-6, max: 1, ends: ['1 µmol', '1 mole (58 g of salt)'], fmt: (v) => `${molFmt(v)} = ${fmtLog(Math.log10(v) + LOG_NA)} molecules` },
    { key: 'go', type: 'buttons', label: 'Make it', items: [
      { label: 'Dilute one more step', act: (s, inst) => inst.step(s) },
      { label: '6C', act: (s) => { s.pot = 6; s.scale = 'C'; } },
      { label: '12C', act: (s) => { s.pot = 12; s.scale = 'C'; } },
      { label: '30C', act: (s) => { s.pot = 30; s.scale = 'C'; } },
      { label: '200C', act: (s) => { s.pot = POT.length - 1; s.scale = 'C'; } },
    ] },
    { key: 'zoom', type: 'toggle', label: 'Zoom into the water (hydrogen bonds)' },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'What does 30C mean?', options: ['30% remedy', '1 part in 30', 'Diluted 1 in 100, thirty times over: 1 in 10⁶⁰', 'Kept at 30 °C'], answer: 2, why: 'Each C step is 1 in 100. Thirty steps make 100³⁰ = 10⁶⁰.' },
    { q: 'Starting with a whole mole, at about which potency do you expect less than one molecule per litre?', options: ['1C', '6C', '12C', '1,000C'], answer: 2, why: 'A mole is 6 × 10²³ molecules. 12C divides by 10²⁴, leaving about 0.6 per litre.' },
    { q: 'What happened when Benveniste\'s 1988 "water memory" experiment was repeated blind?', options: ['The effect grew stronger', 'The effect disappeared', 'The water froze', 'It was never repeated'], answer: 1, why: 'Under blinded conditions, watched by a team from Nature, the effect vanished, and later labs could not repeat it.' },
  ],
  reel: [
    { ms: 5400, caption: 'Each step keeps 1 drop in 100 and shakes it hard. By 12C the substance has almost certainly gone.', set: { pot: 1, scale: 'C', mol: 1, zoom: false, labels: false }, anim: { pot: [1, 12] }, view: { pos: [0, 2.7, 7.2], target: [0, 2.3, 0] }, spin: 0 },
    { ms: 5600, caption: 'To expect one molecule of a 30C remedy you would need about 10¹⁵ Earths\' worth of ocean.', set: { pot: 30, scale: 'C', mol: 1, zoom: false, labels: false }, view: { pos: [0, 2.8, 7.2], target: [0, 2.4, 0] }, spin: 0 },
    { ms: 5000, caption: 'Water\'s hydrogen bonds break and re-form every picosecond, so it cannot hold a lasting memory.', set: { pot: 30, zoom: true, labels: false }, view: { pos: [0, 2.0, 4.6], target: [0, 1.6, 0] }, spin: 0.4 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    const lab = new THREE.Group(); root.add(lab);

    // --- the rack and six tubes
    const rack = box(NT * DX + 0.4, 0.12, 0.9, M.matte(0x4d3525)); rack.position.set(X0 + (NT - 1) * DX / 2, BASE - 0.06, 0); lab.add(rack);
    const rackTop = box(NT * DX + 0.4, 0.06, 0.9, M.matte(0x4d3525)); rackTop.position.set(X0 + (NT - 1) * DX / 2, 1.05, 0); lab.add(rackTop);
    [-1, 1].forEach((sx) => { const p = box(0.08, 1.0, 0.9, M.matte(0x4d3525)); p.position.set(X0 + (NT - 1) * DX / 2 + sx * (NT * DX / 2 + 0.16), 0.6, 0); lab.add(p); });
    const leg = box(NT * DX + 0.6, 0.3, 1.0, M.matte(0x2b3039)); leg.position.set(X0 + (NT - 1) * DX / 2, 0.15 - 0.15, 0); lab.add(leg);
    const tubes = [];
    for (let i = 0; i < NT; i++) { const tt = testTube(TR, TH, 0x6fb6ff); tt.position.set(X0 + i * DX, BASE, 0); tt.setLevel(0.62); lab.add(tt); tubes.push(tt); }
    const tubeL = tubes.map((tt, i) => L('', [X0 + i * DX, BASE + TH + 0.2, 0], 'cyan', lab));
    const countL = tubes.map((tt, i) => L('', [X0 + i * DX, BASE - 0.28, 0.5], 'mol', lab));
    // a leather book to knock the tube on (succussion), and a dropper
    const pad = book(0.9, 0.7, 0.14, 0x6b3a2a); pad.position.set(X0 + (NT - 1) * DX + 1.35, 0, 0.2); lab.add(pad);
    const dropper = new THREE.Group(); lab.add(dropper);
    { const _m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.012, 1.1, 16), M.clear(0xe6f6ff, 0.35)); _m.position.set(0, 0.55, 0); dropper.add(_m); }
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), M.plastic(0xc0392b)); bulb.scale.set(1, 1.5, 1); bulb.position.y = 1.2; dropper.add(bulb);
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), M.glow(hex(COL.water))); lab.add(drop);

    // molecules: pink dots inside each tube
    const mol = dots(NT * CAP, 0.03, hex(COL.mol)); lab.add(mol);
    const home = Array.from({ length: NT * CAP }, (_, i) => { const a = rnd(i) * 6.283, r = Math.sqrt(rnd(i + 7)) * (TR - 0.05); return [Math.cos(a) * r, 0.1 + rnd(i + 3) * 0.95, Math.sin(a) * r]; });

    // --- the chart board: expected molecules per litre (log10) against steps
    let S = { pot: 6, scale: 'C', mol: 1 };
    const chart = board(lab, 4.4, 1.5, 1180, 400, (g, w, h) => {
      panelBg(g, w, h);
      const n = POT[Math.round(S.pot)], sc = S.scale, big = n > 30, nMax = 30;
      const y0v = logLeft(S.mol, 0, sc);
      text(g, 'Expected molecules left per litre', 26, 42, { size: 26, bold: true });
      text(g, `start: ${fmtLog(y0v)} · each step ÷ ${sc === 'C' ? 100 : 10}`, w - 26, 42, { size: 20, col: COL.muted, align: 'right' });
      const yMin = sc === 'C' ? -40 : -10, yMax = 25;
      const { X, Y } = axes(g, { x0: 110, x1: w - 30, y0: h - 50, y1: 70, xMin: 0, xMax: nMax, yMin, yMax, xTicks: [0, 6, 12, 18, 24, 30], yTicks: sc === 'C' ? [-40, -20, 0, 20] : [-10, 0, 10, 20], xFmt: (v) => v + sc, yFmt: (v) => (v === 0 ? '1' : '10' + sup(v)) });
      // the "one molecule" line
      g.strokeStyle = COL.remedy; g.setLineDash([10, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(nMax), Y(0)); g.stroke(); g.setLineDash([]);
      text(g, 'one molecule', X(nMax) - 6, Y(0) - 10, { size: 18, col: COL.remedy, align: 'right' });
      const pts = []; for (let k = 0; k <= nMax; k++) { const v = logLeft(S.mol, k, sc); if (v < yMin) { pts.push([X(k - (v - yMin) / SCALES[sc].k), Y(yMin)]); break; } pts.push([X(k), Y(v)]); }
      polyline(g, pts, COL.mol, 5);
      const cross = (Math.log10(S.mol) + LOG_NA) / SCALES[sc].k;
      if (cross <= nMax) { g.fillStyle = COL.remedy; g.beginPath(); g.arc(X(cross), Y(0), 8, 0, 6.283); g.fill(); text(g, `below one at ${cross.toFixed(1)}${sc}`, X(cross) + 12, Y(0) + 26, { size: 18, col: COL.remedy }); }
      const nv = logLeft(S.mol, Math.min(n, nMax), sc);
      if (!big && nv >= yMin) { g.fillStyle = '#fff'; g.beginPath(); g.arc(X(n), Y(nv), 9, 0, 6.283); g.fill(); }
      const need = -logLeft(S.mol, n, sc);
      if (need > 0) text(g, `to expect one molecule: ${fmtVolume(need)}`, 26, 76, { size: 22, bold: true, col: COL.remedy });
      if (big || nv < yMin) text(g, big ? `200${sc}: 10${sup(Math.round(logLeft(S.mol, n, sc)))} per litre, far off the chart` : `${n}${sc}: 10${sup(Math.round(nv))}, off the chart`, X(nMax) - 6, Y(yMin) - 12, { size: 20, bold: true, col: '#fff', align: 'right' });
    }, [1.35, 3.35, -0.6]);

    // --- zoom: a cluster of water molecules whose hydrogen bonds flicker
    const zoom = new THREE.Group(); zoom.position.set(0, 1.6, 0); root.add(zoom);
    const NW = 70, rw = prng(5);
    const W = Array.from({ length: NW }, () => ({ p: new THREE.Vector3((rw() - 0.5) * 2.6, (rw() - 0.5) * 1.8, (rw() - 0.5) * 1.6), v: new THREE.Vector3(), q: new THREE.Euler(rw() * 6, rw() * 6, rw() * 6), w: new THREE.Vector3((rw() - 0.5) * 4, (rw() - 0.5) * 4, (rw() - 0.5) * 4) }));
    const oM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 16, 12), M.plastic(0xe0474c, { roughness: 0.3 }), NW);
    const hM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.065, 12, 10), M.plastic(0xf2f4f8, { roughness: 0.3 }), NW * 2);
    [oM, hM].forEach((m) => { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; zoom.add(m); });
    const bondGeo = new THREE.BufferGeometry(); const bondPos = new Float32Array(NW * 8 * 6); bondGeo.setAttribute('position', new THREE.BufferAttribute(bondPos, 3));
    const bonds = new THREE.LineSegments(bondGeo, new THREE.LineBasicMaterial({ color: hex(COL.cyan), transparent: true, opacity: 0.8 })); zoom.add(bonds);
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.0, 2.1, 1.9)), new THREE.LineBasicMaterial({ color: 0x9fb4c8, transparent: true, opacity: 0.3 })); zoom.add(cage);
    const zL = L('Dotted lines: hydrogen bonds, re-forming about every picosecond', [0, 1.35, 0], 'cyan', zoom);
    const zL2 = L('Slowed about a trillion times', [0, -1.3, 0.8], 'muted', zoom);
    const o3 = new THREE.Object3D(), tmp = new THREE.Vector3(), HOH = 104.5 * Math.PI / 180;

    const fit = fitNarrow(stage, { pos: [0, 2.9, 7.2], target: [0, 2.1, 0] });
    let t = 0, animT = 9, fromPot = -1, lastKey = '', lastPot = -1;
    const counts = new Array(NT).fill(0);
    const api = {
      step(s) { const i = Math.round(s.pot); if (i < POT.length - 1 && POT[i] < 30) { s.pot = i + 1; animT = 0; } },
      update(dt, s) {
        dt = Math.max(0, dt); t += dt; animT += dt;
        S = s;
        const idx = Math.round(s.pot), n = POT[idx], sc = s.scale;
        // in the tall reel video, centre the chart above the rack and make it bigger
        if (inReel()) { chart.mesh.position.set(X0 + (NT - 1) * DX / 2, 3.7, -0.6); chart.mesh.scale.setScalar(1.3); } else { chart.mesh.position.set(1.35, 3.35, -0.6); chart.mesh.scale.setScalar(1); }
        if (idx !== lastPot) { if (lastPot >= 0 && idx === lastPot + 1) animT = Math.min(animT, 0); lastPot = idx; }
        const key = `${idx}|${sc}|${s.mol.toPrecision(3)}`;
        if (key !== lastKey) { lastKey = key; chart.redraw(); }
        const zoomOn = !!s.zoom;
        lab.visible = !zoomOn; zoom.visible = zoomOn;
        const narrow = fit(), on = s.labels && !inReel() && !narrow;
        // which steps the six tubes show: the last six up to n
        const first = n <= 30 ? Math.max(0, n - (NT - 1)) : n - (NT - 1);
        for (let i = 0; i < NT; i++) {
          const k = first + i, Lg = logLeft(s.mol, k, sc);
          tubeL[i].element.textContent = potName(k, sc);
          countL[i].element.textContent = fmtLog(Lg, Lg < -3 ? 0 : 1);
          tubeL[i].visible = on || inReel(); countL[i].visible = on;
          // molecules drawn: exact while few, capped when many, a seeded Poisson draw when < 1
          let c;
          if (Lg >= Math.log10(CAP)) c = CAP;
          else if (Lg >= 0) c = Math.round(Math.pow(10, Lg));
          else c = rnd(k * 13 + (sc === 'C' ? 1 : 2)) < pAny(Lg) ? 1 : 0;
          counts[i] = c;
          const tt = tubes[i];
          tt.liquidMat.color.set(k === 0 ? 0xffb547 : 0x6fb6ff);
          tt.liquidMat.opacity = k === 0 ? 0.45 : 0.3;
        }
        // step animation: the dropper carries a drop from tube 5 to tube 6, then tube 6 is knocked 10 times
        const a = animT;
        const xa = X0 + (NT - 2) * DX, xb = X0 + (NT - 1) * DX;
        dropper.visible = a < 1.1; drop.visible = a > 0.55 && a < 0.8;
        if (a < 1.1) { const u = smooth(a / 0.55); dropper.position.set(lerp(xa, xb, u), BASE + TH - 0.2 + Math.sin(u * Math.PI) * 0.6, 0); }
        drop.position.set(xb, lerp(BASE + TH - 0.25, BASE + 1.0, smooth((a - 0.55) / 0.25)), 0);
        const knock = a > 0.8 && a < 2.6 ? Math.abs(Math.sin(((a - 0.8) / 1.8) * Math.PI * 10)) : 0;
        tubes[NT - 1].position.y = BASE + knock * 0.25;
        tubes[NT - 1].rotation.z = knock * 0.05;
        // place molecules (Brownian jiggle), shaken harder during succussion
        for (let i = 0; i < NT; i++) {
          const tt = tubes[i], shake = i === NT - 1 ? knock : 0;
          for (let j = 0; j < CAP; j++) {
            const id = i * CAP + j;
            if (j >= counts[i]) { mol.hide(id); continue; }
            const h = home[id], jig = 0.02 + shake * 0.05;
            mol.place(id, tt.position.x + h[0] + Math.sin(t * 3.1 + id) * jig, tt.position.y + 0.12 + h[1] * 1.0 + Math.cos(t * 2.7 + id * 1.3) * jig, h[2] + Math.sin(t * 2.3 + id * 0.7) * jig, 1);
          }
        }
        mol.done();
        // zoom: water molecules drift and tumble; hydrogen bonds link O to a neighbour's H when close
        if (zoomOn) {
          const sp = 0.25;
          W.forEach((w, i) => {
            w.p.x += Math.sin(t * 1.3 + i) * dt * sp; w.p.y += Math.cos(t * 1.1 + i * 1.7) * dt * sp; w.p.z += Math.sin(t * 0.9 + i * 2.3) * dt * sp;
            ['x', 'y', 'z'].forEach((ax, k) => { const lim = [1.35, 0.9, 0.8][k]; if (w.p[ax] > lim) w.p[ax] -= 2 * lim; if (w.p[ax] < -lim) w.p[ax] += 2 * lim; });
            w.q.x += w.w.x * dt * 0.3; w.q.y += w.w.y * dt * 0.3;
            o3.position.copy(w.p); o3.rotation.set(0, 0, 0); o3.scale.setScalar(1); o3.updateMatrix(); oM.setMatrixAt(i, o3.matrix);
            w.h = [0, 1].map((k) => { tmp.set(Math.sin((k ? 1 : -1) * HOH / 2) * 0.13, -Math.cos(HOH / 2) * 0.13, 0).applyEuler(w.q).add(w.p); o3.position.copy(tmp); o3.updateMatrix(); hM.setMatrixAt(i * 2 + k, o3.matrix); return tmp.clone(); });
          });
          oM.instanceMatrix.needsUpdate = hM.instanceMatrix.needsUpdate = true;
          let nb = 0;
          for (let i = 0; i < NW && nb < NW * 8 - 1; i++) for (let j = 0; j < NW; j++) {
            if (i === j) continue;
            for (const hp of W[j].h) {
              const d = W[i].p.distanceTo(hp);
              if (d > 0.18 && d < 0.42 && nb < NW * 8) { bondPos.set([W[i].p.x, W[i].p.y, W[i].p.z, hp.x, hp.y, hp.z], nb * 6); nb++; }
            }
          }
          bondGeo.setDrawRange(0, nb * 2); bondGeo.attributes.position.needsUpdate = true;
          zL.visible = zL2.visible = on;
        }
      },
      readout: (s) => {
        const idx = Math.round(s.pot), n = POT[idx], sc = s.scale, Lg = logLeft(s.mol, n, sc), p = pAny(Lg);
        const dil = n * SCALES[sc].k;
        if (s.zoom) return `<div class="big">Can water remember?</div>${rows([['Hydrogen bonds last', 'about 1 picosecond'], ['That is', '10⁻¹² of a second'], ['Benveniste, 1988', 'effect vanished when blinded'], ['Later repeats', 'failed (e.g. Nature, 1993)']])}<small>Water molecules keep swapping partners, so there is no lasting shape to store an imprint.</small>`;
        const volL = -Lg, dKm = Math.pow(10, logSphereKm(volL));
        const list = [
          ['Potency', `${potName(n, sc)} = 1 in 10${sup(dil)}`],
          ['Expected per litre now', fmtLog(Lg)],
          ['Chance a litre has even one', pct(Lg)],
        ];
        if (Lg < 0) list.push(['Water to expect one molecule', fmtVolume(volL)]);
        if (Lg < 0 && volL > Math.log10(OCEAN_L)) list.push(['As one ball of water', dKm > AU_KM * 5 ? `${fmtLog(logSphereKm(volL))} km across` : `${fmtLog(logSphereKm(volL) - 6)} million km across${Math.abs(dKm / AU_KM - 1) < 0.2 ? ' ≈ Earth to Sun' : ''}`]);
        const note = n > 30 ? '200C is 1 in 10⁴⁰⁰. The visible universe holds only about 10⁸⁰ atoms.' : Lg >= 0 ? 'The pink dots are real molecule counts while there are fewer than 120.' : 'Past this point most bottles hold no molecule of the starting substance at all.';
        return `<div class="big">${potName(n, sc)}: ${Lg >= 0 ? fmtLog(Lg) + ' molecules left' : 'probably none left'}</div>${rows(list)}<small>${note}</small>`;
      },
    };
    return compactReadout(stage, api);
  },
};

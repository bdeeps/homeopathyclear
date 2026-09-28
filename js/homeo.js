// HomeopathyClear's shared parts: the dilution maths (Avogadro's number, log arithmetic so 200C does
// not underflow), number formatting, canvas boards for live charts, label helpers, a seeded random
// generator, and the 3D props the chapters reuse (test tubes, vials, a pill jar, books, simple people).
//
// Scene units: one unit is about 10 cm for tabletop props; floors are at y = 0.
//
// Constants and sources:
//  - Avogadro constant NA = 6.02214076 × 10²³ per mole, exact since the 2019 SI redefinition
//    (BIPM, SI Brochure, 9th ed., 2019).
//  - Volume of Earth's oceans about 1.335 billion km³ = 1.335 × 10²¹ litres (NOAA "How much water is in
//    the ocean?"; USGS gives about 1.338 billion km³). 1 km³ = 10¹² L.
//  - Mean Earth–Sun distance 1 au = 149.6 million km (IAU 2012, exactly 149,597,870.7 km).
//  - Olympic pool about 2.5 million litres (50 × 25 × 2 m, FINA minimum depth).
//  - Atoms in the observable universe: roughly 10⁸⁰ (a common order-of-magnitude estimate; e.g.
//    Britannica "universe"; estimates range 10⁷⁸–10⁸²).
// Homeopathic scales (Hahnemann, Organon 6th ed. §270; Homoeopathic Pharmacopoeia of India, general
// notices): C (centesimal) = 1 part in 100 at each step; X or D (decimal) = 1 part in 10.
// LM (Q) = 1 part in 50,000 is mentioned in the text but not modelled.
import { THREE, M, clamp, lerp, smooth, box, sphere, beam } from './kit.js';

export const NA = 6.02214076e23;
export const LOG_NA = Math.log10(NA);             // 23.7797
export const OCEAN_L = 1.335e21;
export const AU_KM = 149.6e6;
export const POOL_L = 2.5e6;
export const TAU = Math.PI * 2;

// ---------------------------------------------------------------- dilution maths (in log10)
export const SCALES = { C: { n: 'C (1 in 100)', k: 2 }, X: { n: 'X (1 in 10)', k: 1 } };
// log10 of the expected number of molecules left in each litre, starting from `mol` moles in the
// first litre and keeping 1 part in 100 (C) or 1 in 10 (X) at each of `steps` steps.
export const logLeft = (mol, steps, scale = 'C') => Math.log10(mol) + LOG_NA - steps * SCALES[scale].k;
// Poisson chance that a sample holding on average 10^L molecules has at least one.
export function pAny(L) {
  if (L > 1.5) return 1;
  if (L < -8) return Math.pow(10, L);   // 1 − e^−λ ≈ λ when λ is tiny
  return 1 - Math.exp(-Math.pow(10, L));
}
// Volume (litres, as log10) you would have to search to expect one molecule: V = 1 ÷ concentration.
export const logVolForOne = (L) => -L;
// Diameter of a sphere holding 10^logL litres, in km (as log10). V(m³) = L/1000; d = (6V/π)^(1/3).
export const logSphereKm = (logL) => (logL - 3 + Math.log10(6 / Math.PI)) / 3 - 3;

// ---------------------------------------------------------------- number formatting
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sup = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('');
// A number given as its log10, written for people: 600, 6.0 lakh, 6.0 × 10²³.
export function fmtLog(L, dig = 1) {
  if (!isFinite(L)) return '0';
  if (L < 5 && L >= -2) { const v = Math.pow(10, L); return v >= 100 ? Math.round(v).toLocaleString('en-IN') : v >= 1 ? v.toFixed(v >= 10 ? 0 : 1) : v.toFixed(v >= 0.1 ? 2 : 3); }
  let e = Math.floor(L), m = Math.pow(10, L - e);
  if (+m.toFixed(dig) >= 10) { m /= 10; e += 1; }
  return `${m.toFixed(dig)} × 10${sup(e)}`;
}
export const fmtNum = (v, d = 0) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-IN') : v.toFixed(d));
// A volume (log10 litres) in words that make sense.
export function fmtVolume(logL) {
  if (logL < -2) return fmtLog(logL + 3) + ' mL';
  if (logL < 3) return fmtLog(logL) + ' L';
  if (logL < Math.log10(POOL_L) + 2) return `${fmtLog(logL - Math.log10(POOL_L))} Olympic pools`;
  if (logL < Math.log10(OCEAN_L) - 1) return `${fmtLog(logL - 12)} km³`;
  return `${fmtLog(logL - Math.log10(OCEAN_L))} × Earth's oceans`;
}

// ---------------------------------------------------------------- colours
export const COL = {
  water: '#6fb6ff', remedy: '#ffb547', mol: '#ff8ab0', text: '#e8eef8', muted: 'rgba(255,255,255,.6)',
  good: '#5ce1a9', bad: '#ff6b6b', gold: '#ffd166', blue: '#8fb0ff', purple: '#c9a7ff', cyan: '#8ef0ff', leaf: '#8bd46a',
};
export const hex = (c) => new THREE.Color(c).getHex();

// ---------------------------------------------------------------- labels and layout helpers
export function tint(l, c) { l.element.classList.add('hot'); l.element.style.setProperty('--c', COL[c] || c); return l; }
export const inReel = () => document.body.classList.contains('gb-reel');
// On a phone-width stage the readout covers the upper left: re-centre once, unless orbited.
export function fitNarrow(stage, view) {
  let done = false;
  return () => {
    const narrow = stage.host.clientWidth < 560;
    if (narrow && !done && !stage.moved && !inReel()) { stage.setView(view.pos, view.target, 0.01); done = true; }
    return narrow;
  };
}
// On phones keep only the readout's headline and two rows.
export function compactReadout(stage, api) {
  const full = api.readout;
  if (!full) return api;
  api.readout = (s) => {
    const html = full(s);
    if (stage.host.clientWidth >= 560 || !html) return html;
    let rows = 0;
    return html.replace(/<small>[\s\S]*?<\/small>/g, '').replace(/<div class="row">[\s\S]*?<\/div>/g, (m) => (++rows <= 2 ? m : ''));
  };
  return api;
}
export const rows = (list) => list.map(([a, b]) => `<div class="row"><span>${a}</span><b>${b}</b></div>`).join('');

// ---------------------------------------------------------------- random numbers
export function prng(seed = 1) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const gauss = (r) => Math.sqrt(-2 * Math.log(Math.max(1e-9, r()))) * Math.cos(TAU * r());

// ---------------------------------------------------------------- boards (live charts in 3D)
export function board(parent, w, h, pxW, pxH, draw, pos = [0, 0, 0]) {
  const c = document.createElement('canvas'); c.width = pxW; c.height = pxH;
  const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const redraw = (...a) => { draw(g, pxW, pxH, ...a); tex.needsUpdate = true; };
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: THREE.DoubleSide, depthWrite: false }));
  m.position.set(...pos); parent.add(m);
  redraw();
  return { tex, redraw, canvas: c, mesh: m };
}
export function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
export function panelBg(g, w, h) { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(10,12,18,.9)'; rrect(g, 0, 0, w, h, 22); g.fill(); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; g.stroke(); }
export function text(g, s, x, y, { size = 20, col = COL.text, bold = false, align = 'left', serif = false } = {}) {
  g.font = `${bold ? 'bold ' : ''}${size}px ${serif ? 'Georgia, serif' : 'sans-serif'}`; g.fillStyle = col; g.textAlign = align; g.fillText(s, x, y); g.textAlign = 'left';
}
// Wrap text into lines no wider than w; returns the y after the last line.
export function wrap(g, s, x, y, w, lh, opts = {}) {
  const { size = 20, bold = false } = opts;
  g.font = `${bold ? 'bold ' : ''}${size}px sans-serif`;
  let line = '';
  for (const word of s.split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (g.measureText(t).width > w && line) { text(g, line, x, y, opts); y += lh; line = word; } else line = t;
  }
  if (line) { text(g, line, x, y, opts); y += lh; }
  return y;
}
export function axes(g, { x0, x1, y0, y1, xMin, xMax, yMin, yMax, xTicks = [], yTicks = [], xFmt = String, yFmt = String }) {
  const X = (x) => x0 + ((x - xMin) / (xMax - xMin)) * (x1 - x0);
  const Y = (y) => y0 - ((y - yMin) / (yMax - yMin)) * (y0 - y1);
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1; g.font = '18px sans-serif'; g.fillStyle = 'rgba(255,255,255,.6)';
  for (const t of xTicks) { g.beginPath(); g.moveTo(X(t), y1); g.lineTo(X(t), y0); g.stroke(); const s = xFmt(t); g.fillText(s, X(t) - g.measureText(s).width / 2, y0 + 24); }
  for (const t of yTicks) { g.beginPath(); g.moveTo(x0, Y(t)); g.lineTo(x1, Y(t)); g.stroke(); const s = yFmt(t); g.fillText(s, x0 - 10 - g.measureText(s).width, Y(t) + 6); }
  g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke();
  return { X, Y };
}
export function polyline(g, pts, col, w = 4, dash = null) {
  if (pts.length < 2) return;
  g.strokeStyle = col; g.lineWidth = w; g.setLineDash(dash || []); g.lineJoin = 'round'; g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.setLineDash([]);
}

// ---------------------------------------------------------------- 3D props
export const glassMat = (op = 0.16) => M.clear(0xe6f6ff, op);
export const liquidMat = (col = 0x6fb6ff, op = 0.35) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.1, transparent: true, opacity: op, depthWrite: false });

// A test tube standing on y0: round bottom, open top, radius r, height h. setLevel(k) fills 0→1.
export function testTube(r = 0.22, h = 1.9, liquid = 0x6fb6ff) {
  const g = new THREE.Group();
  const gm = glassMat(0.17);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h - r, 36, 1, true), gm); wall.position.y = r + (h - r) / 2; g.add(wall);
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 12, 0, TAU, Math.PI / 2, Math.PI / 2), gm); bottom.position.y = r; g.add(bottom);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(r + 0.012, 0.022, 8, 36), M.clear(0xffffff, 0.55)); lip.rotation.x = Math.PI / 2; lip.position.y = h; g.add(lip);
  const lm = liquidMat(liquid, 0.38);
  const lb = new THREE.Mesh(new THREE.SphereGeometry(r - 0.02, 32, 10, 0, TAU, Math.PI / 2, Math.PI / 2), lm); lb.position.y = r; g.add(lb);
  const lc = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.02, r - 0.02, 1, 32), lm); g.add(lc);
  g.setLevel = (k) => { const top = r + Math.max(0.001, (h - r) * k); lc.scale.y = top - r; lc.position.y = r + (top - r) / 2; };
  g.setLevel(0.6);
  Object.assign(g, { r, h, liquidMat: lm, glassMat: gm });
  return g;
}
// A small glass vial with a cap.
export function vial(r = 0.16, h = 0.6, liquid = 0xffb547, cap = 0x2b3039) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28, 1, true), glassMat(0.2)); body.position.y = h / 2; g.add(body);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.02, 28), glassMat(0.3)); base.position.y = 0.01; g.add(base);
  const lq = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.015, r - 0.015, h * 0.55, 28), liquidMat(liquid, 0.5)); lq.position.y = 0.02 + h * 0.275; g.add(lq);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.75, r * 0.75, 0.12, 24), M.plastic(cap)); c.position.y = h + 0.08; g.add(c);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r, 0.06, 24, 1, true), glassMat(0.2)); neck.position.y = h + 0.02; g.add(neck);
  g.liquid = lq;
  return g;
}
// A closed book: w wide, d deep, t thick; cover colour.
export function book(w = 1.1, d = 0.8, t = 0.16, cover = 0x7a3b2e) {
  const g = new THREE.Group();
  const pages = box(w - 0.04, t - 0.04, d - 0.05, M.matte(0xf1e6c8)); pages.position.set(0.02, t / 2, 0); g.add(pages);
  const top = box(w, 0.02, d, M.matte(cover)); top.position.y = t - 0.01; g.add(top);
  const bot = top.clone(); bot.position.y = 0.01; g.add(bot);
  const spine = box(0.03, t, d, M.matte(cover)); spine.position.set(-w / 2, t / 2, 0); g.add(spine);
  return g;
}
// An open book lying flat, with a canvas texture on its two pages.
// texL, texR: optional canvas textures for the left and right pages.
export function openBook(w = 2.2, d = 1.4, texL = null, texR = null, cover = 0x5a2f24) {
  const g = new THREE.Group();
  const cv = box(w + 0.1, 0.04, d + 0.1, M.matte(cover)); cv.position.y = 0.02; g.add(cv);
  for (const s of [-1, 1]) {
    const tex = s < 0 ? texL : texR;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.03, d), tex ? new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }) : M.matte(0xf1e6c8));
    p.rotation.x = -Math.PI / 2; p.rotation.y = s * 0.06; p.position.set(s * (w / 4), 0.1, 0);
    g.add(p);
    const block = box(w / 2 - 0.05, 0.06, d - 0.02, M.matte(0xe9dcbc)); block.position.set(s * (w / 4), 0.065, 0); g.add(block);
  }
  return g;
}
// A simple, clearly stylised person (about 1.7 units tall at scale 1), standing on y = 0.
export function person(col = 0x8fb0ff, opts = {}) {
  const { seated = false, skin = 0xd9a47e } = opts;
  const g = new THREE.Group();
  const mat = M.plastic(col), sk = M.plastic(skin);
  const legY = seated ? 0.45 : 0;
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.5, 6, 16), mat); torso.position.y = legY + 1.05; torso.castShadow = true; g.add(torso);
  const head = sphere(0.17, sk, 24); head.position.y = legY + 1.55; g.add(head);
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.5, 4, 10), mat); arm.position.set(s * 0.32, legY + 1.02, 0); arm.rotation.z = s * 0.12; g.add(arm);
    if (seated) {
      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.4, 4, 10), M.plastic(0x3a4150)); thigh.rotation.x = Math.PI / 2; thigh.position.set(s * 0.12, legY + 0.6, 0.25); g.add(thigh);
      const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.4, 4, 10), M.plastic(0x3a4150)); shin.position.set(s * 0.12, 0.3, 0.5); g.add(shin);
    } else {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.62, 4, 10), M.plastic(0x3a4150)); leg.position.set(s * 0.12, 0.42, 0); g.add(leg);
    }
  }
  g.head = head; g.torso = torso; g.mat = mat;
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}
// A low wooden table top w × d at height h.
export function table(w = 4, d = 2, h = 0.9, col = 0x5b3f2a) {
  const g = new THREE.Group();
  const top = box(w, 0.08, d, M.matte(col)); top.position.y = h; g.add(top);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const leg = box(0.08, h, 0.08, M.matte(col)); leg.position.set(sx * (w / 2 - 0.12), h / 2, sz * (d / 2 - 0.12)); g.add(leg); }
  g.top = h + 0.04;
  return g;
}
// Glowing dots, one instanced mesh, each with its own colour.
export function dots(n, r, color = 0xffffff, seg = 8) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), n);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const o = new THREE.Object3D(), c = new THREE.Color(color);
  for (let i = 0; i < n; i++) mesh.setColorAt(i, c);
  mesh.place = (i, x, y, z, s = 1) => { o.position.set(x, y, z); o.scale.setScalar(Math.max(0.0001, s)); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); };
  mesh.hide = (i) => mesh.place(i, 0, -99, 0, 0.0001);
  mesh.tint = (i, col) => mesh.setColorAt(i, col);
  mesh.done = () => { mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; };
  return mesh;
}
// Show one group from a set, by key.
export const showOnly = (groups, k) => Object.entries(groups).forEach(([n, g]) => { g.visible = n === k; });
export { THREE, M, clamp, lerp, smooth, box, sphere, beam };
// A plain canvas texture drawn once (book pages, labels printed on props).
export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

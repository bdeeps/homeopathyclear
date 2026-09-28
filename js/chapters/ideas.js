// Chapter 2: homeopathy's core ideas, told as homeopathy describes them, and labelled that way.
// "Like cures like" (similia similibus curentur), provings, individualised case-taking, the single
// remedy, and the minimum dose. Scenes: a substance on a pedestal whose "proving" symptoms light up
// and link to a patient's matching symptoms; volunteers keeping proving diaries; a consultation with a
// clock; a rack of remedies from which one is chosen; a single tiny dose.
// Sources for what homeopathy teaches:
//  - Hahnemann, Organon of Medicine, 6th ed. (Dudgeon/Boericke translation, 1921): §26 the law of
//    similars; §105–§145 provings on healthy people; §83–§104 individualising examination of the
//    patient; §273 one single, simple medicine at a time; §275–§279 the smallest dose.
//  - The symptom pictures used as examples follow standard homeopathic materia medica, e.g.
//    W. Boericke, Pocket Manual of Homoeopathic Materia Medica (9th ed., 1927; widely reprinted in
//    India by B. Jain): Allium cepa (red onion) for watery, burning nasal discharge and watery eyes
//    "as when peeling onions"; Coffea cruda for sleeplessness with an overactive mind; China
//    officinalis (cinchona) for weakness after loss of fluids and intermittent fever. These are what
//    the texts say, not tested treatment claims.
//  - CCRH runs drug-proving ("homoeopathic pathogenetic trial") studies (ccrhindia.ayush.gov.in,
//    "Drug Proving"). A systematic review of provings published 1945–1995 found most were of low
//    quality and that people taking placebo also reported many symptoms (Dantas et al., Homeopathy
//    96:4, 2007).
//  - Consultation length: classical homeopathic first consultations often last 30–90 minutes (Faculty
//    of Homeopathy, UK; hedged, practice varies, and busy Indian clinics may be much shorter).
import { THREE, M, box, sphere, beam, clamp, lerp, smooth } from '../kit.js';
import { COL, hex, tint, inReel, fitNarrow, compactReadout, rows, board, panelBg, text, wrap, person, vial, book, rnd } from '../homeo.js';

const IDEAS = {
  similia: { label: 'Like cures like', title: 'Like cures like' },
  proving: { label: 'Provings', title: 'Provings: testing on healthy people' },
  case: { label: 'Case-taking', title: 'The whole person, in detail' },
  single: { label: 'One remedy', title: 'One remedy at a time' },
  dose: { label: 'Minimum dose', title: 'The smallest dose' },
};
const SUBST = {
  onion: { label: 'Red onion', remedy: 'Allium cepa', prov: ['Watery, burning eyes', 'Runny, stinging nose', 'Sneezing'], pt: ['Streaming eyes', 'Runny nose', 'Sneezing fits'], who: 'hay fever or a cold' },
  coffee: { label: 'Coffee', remedy: 'Coffea cruda', prov: ['Wide awake at night', 'Racing thoughts', 'Extra-sensitive to noise'], pt: ['Can\'t fall asleep', 'Mind won\'t stop', 'Every sound bothers'], who: 'sleeplessness' },
  bark: { label: 'Cinchona bark', remedy: 'China officinalis', prov: ['Chills, then fever', 'Weakness', 'Sensitive to touch'], pt: ['Fever with chills', 'Exhausted', 'Aches when touched'], who: 'fever with weakness' },
};
const VIEW = { pos: [0.6, 2.5, 7.8], target: [-0.75, 1.85, 0] };

export default {
  id: 'ideas',
  short: 'The ideas',
  title: 'Like cures like, as homeopathy describes it',
  subtitle: 'Similars, provings, the whole-person consultation, one remedy at a time, and the smallest dose.',
  view: VIEW,
  learn: `<p>This chapter explains homeopathy <b>in its own terms</b>, the way its books and teachers describe it. What the scientific evidence says comes later, in chapter 5.</p>
    <p><b>Like cures like</b> (in Latin, <i>similia similibus curentur</i>). Homeopathy teaches that a substance which causes certain symptoms in a <b>healthy</b> person can, in a special diluted form, treat <b>similar</b> symptoms in a sick person. Cutting a red onion makes your eyes and nose stream, so the onion remedy, <b>Allium cepa</b>, is described for colds and hay fever with streaming eyes and nose.</p>
    <p>How are these "symptom pictures" found? By <b>provings</b>: healthy volunteers take a substance and write down every change they notice in a diary. The collected symptoms form the <b>materia medica</b>. India's research council, <b>CCRH</b>, still runs proving studies.</p>
    <p>Then <b>case-taking</b>. A homeopath asks about much more than the main complaint: sleep, mood, food cravings, what makes things better or worse. The aim is to find the one remedy whose picture best matches the <b>whole person</b>. Two people with the same cold may be given different remedies. Classical homeopathy gives a <b>single remedy</b> at a time, in the <b>minimum dose</b>, prepared by the dilution and shaking you'll see in the next chapter.</p>
    <p>A fair note: vaccines are sometimes compared with "like cures like", but they work differently. A vaccine holds a <b>measured amount</b> of a germ's parts that immune cells can detect, and it makes antibodies you can measure (see ImmuneClear).</p>
    <p class="tip"><b>Try it:</b> in "Like cures like", switch between onion, coffee and cinchona bark and watch which symptoms get linked. Then open "Provings" and watch the diaries fill.</p>`,
  terms: [
    { t: 'Similia similibus curentur', d: 'Latin for "let like be cured by like", homeopathy\'s central principle.' },
    { t: 'Proving', d: 'In homeopathy, a test where healthy volunteers take a substance and record the symptoms they notice.' },
    { t: 'Materia medica', d: 'A reference book listing each remedy and the symptoms linked to it.' },
    { t: 'Case-taking', d: 'The long, detailed interview a homeopath uses to choose a remedy for the whole person.' },
    { t: 'Individualisation', d: 'Choosing a remedy for the particular person rather than for the name of the disease.' },
    { t: 'Minimum dose', d: 'Hahnemann\'s rule to give the smallest dose thought to be enough.' },
  ],
  defaults: { idea: 'similia', subst: 'onion', labels: true },
  controls: [
    { key: 'idea', type: 'seg', label: 'Idea (as described in homeopathy)', options: Object.entries(IDEAS).map(([v, m]) => ({ v, label: m.label })) },
    { key: 'subst', type: 'seg', label: 'Substance', options: Object.entries(SUBST).map(([v, m]) => ({ v, label: m.label })), fmt: (v) => `Remedy name: ${SUBST[v].remedy}` },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  onChange(s, key) { if (key === 'subst' && s.idea !== 'similia' && s.idea !== 'proving') s.idea = 'similia'; },
  quiz: [
    { q: 'In homeopathy, what does "like cures like" mean?', options: ['A remedy should taste like food', 'A substance that causes symptoms in a healthy person is used for similar symptoms in a sick one', 'Patients should like their doctor', 'Similar diseases cancel out'], answer: 1, why: 'That is the principle of similars, similia similibus curentur, as Hahnemann described it.' },
    { q: 'What is a "proving"?', options: ['A lab test of blood', 'Healthy volunteers taking a substance and recording their symptoms', 'A court case', 'A trial on sick patients with a placebo'], answer: 1, why: 'Provings build the symptom pictures of the materia medica. Reviews found many were low quality, and people on placebo also reported symptoms.' },
    { q: 'Why might two people with the same cold get different homeopathic remedies?', options: ['By mistake', 'Homeopathy matches the remedy to the whole person, not just the disease name', 'Because one is older', 'Remedies ran out'], answer: 1, why: 'Individualised case-taking looks at the person\'s whole symptom picture, including sleep, mood and what makes things better or worse.' },
  ],
  reel: [
    { ms: 5400, caption: 'Homeopathy teaches "like cures like": onion makes eyes stream, so onion is its remedy for streaming colds.', set: { idea: 'similia', subst: 'onion', labels: false }, view: { pos: [0, 2.6, 6.2], target: [0, 1.5, 0] }, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    let t = 0, idea = '', sub = 'onion', k = 0;
    const G = {}; ['match', 'prove', 'case', 'single', 'dose'].forEach((k) => { G[k] = new THREE.Group(); root.add(G[k]); });
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);

    // ---------------------------------------------------------------- the substances
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.9, 40), M.matte(0x2b3039)); pedestal.position.set(-1.9, 0.45, 0); root.add(pedestal);
    const topY = 0.9;
    const S = {};
    // red onion: a squashed purple-red bulb with a neck and roots
    S.onion = new THREE.Group();
    const bulb = sphere(0.3, M.plastic(0x8a2d52, { roughness: 0.35 }), 40); bulb.scale.set(1, 0.85, 1); bulb.position.y = 0.26; S.onion.add(bulb);
    const neck = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 20), M.plastic(0xb56a7e)); neck.position.y = 0.62; S.onion.add(neck);
    for (let i = 0; i < 8; i++) S.onion.add(beam([0, 0.03, 0], [Math.cos(i) * 0.12, -0.02, Math.sin(i) * 0.12], 0.008, M.matte(0xd9c8a8)));
    const half = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 16, 0, Math.PI), M.plastic(0xf2dde6)); half.rotation.x = -Math.PI / 2; half.position.set(0.42, 0.001, 0.25); S.onion.add(half);
    for (let r = 0.07; r < 0.22; r += 0.05) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 6, 40, Math.PI), M.plastic(0xb5577c)); ring.rotation.x = -Math.PI / 2; ring.position.set(0.42, 0.004, 0.25); S.onion.add(ring); }
    // coffee: a small heap of roasted beans
    S.coffee = new THREE.Group();
    const beanGeo = new THREE.SphereGeometry(0.07, 16, 12), beanMat = M.plastic(0x4a2a17, { roughness: 0.5 }), groove = M.matte(0x1e0f06);
    for (let i = 0; i < 26; i++) {
      const b = new THREE.Mesh(beanGeo, beanMat); b.scale.set(1, 0.6, 0.75);
      const a = rnd(i) * 6.28, r = 0.26 * Math.sqrt(rnd(i + 9)), h = 0.04 + (0.26 - r) * 0.6 * rnd(i + 3);
      b.position.set(Math.cos(a) * r, h, Math.sin(a) * r); b.rotation.set(rnd(i + 1) * 3, rnd(i + 2) * 3, rnd(i + 4) * 3);
      const gr = box(0.12, 0.012, 0.012, groove); gr.position.y = 0.068; b.add(gr); b.castShadow = true; S.coffee.add(b);
    }
    // cinchona bark quills
    S.bark = new THREE.Group();
    const barkMat = new THREE.MeshStandardMaterial({ color: 0x8a4a2c, roughness: 0.95, side: THREE.DoubleSide });
    for (let i = 0; i < 4; i++) { const q = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 20, 1, true, 0, Math.PI * 1.6), barkMat); q.rotation.z = Math.PI / 2; q.rotation.y = i * 0.5 - 0.7; q.position.set(0, 0.07 + (i === 3 ? 0.1 : 0), (i - 1.5) * 0.12); q.castShadow = true; S.bark.add(q); }
    Object.values(S).forEach((g) => { g.position.set(-1.9, topY, 0); root.add(g); });

    // ---------------------------------------------------------------- the patient and the symptom links
    const patient = person(0x8fb0ff); patient.position.set(1.5, 0, 0); patient.scale.setScalar(1.15); G.match.add(patient);
    const PT = [[1.45, 1.93, 0.2], [1.5, 1.82, 0.22], [1.5, 1.72, 0.2]];     // eyes, nose, mouth: on the head
    const PTbody = { coffee: [[1.5, 2.0, 0.1], [1.5, 1.95, 0.18], [1.33, 1.85, 0.1]], bark: [[1.5, 1.35, 0.25], [1.5, 1.1, 0.25], [1.2, 1.2, 0.2]] };
    const spots = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), M.glow(hex(COL.mol))); G.match.add(m); return m; });
    const linkMat = new THREE.MeshBasicMaterial({ color: hex(COL.remedy), transparent: true, opacity: 0.8, toneMapped: false, depthWrite: false });
    const links = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.BufferGeometry(), linkMat); G.match.add(m); return m; });
    const chipsL = [0, 1, 2].map((i) => L('', [-0.8, 1.95 - i * 0.36, 0.3], 'remedy', G.match));
    const chipsR = [0, 1, 2].map((i) => L('', [0.75, 1.95 - i * 0.36, 0.3], 'mol', G.match));
    const headL = L('Proving symptoms of the substance', [-1.0, 2.35, 0.3], 'muted', G.match);
    const headR = L('The patient\'s symptoms', [0.95, 2.35, 0.3], 'muted', G.match);
    const arc = (a, b, lift) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), mid = A.clone().add(B).multiplyScalar(0.5); mid.y += lift;
      const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
      return new THREE.TubeGeometry(curve, 40, 0.012, 6, false);
    };

    // ---------------------------------------------------------------- provings: volunteers with diaries
    const vols = [];
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * (0.15 + i * 0.175), x = -1.9 + Math.cos(a) * 1.9, z = -Math.sin(a) * 1.1 + 0.5;
      const p = person([0x6ee7a8, 0x8ef0ff, 0xc9a7ff, 0xffd166, 0xff9fc0][i]); p.scale.setScalar(0.72); p.position.set(x + 2.3, 0, z - 0.4); p.lookAt(-1.9 + 2.3, 0, 0.3);
      const diary = book(0.28, 0.2, 0.04, 0x33445a); diary.position.set(0, 0.95, 0.3); diary.rotation.x = -0.9; p.add(diary);
      const pops = [0, 1, 2].map((k) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), M.glow(hex(COL.mol))); m.position.set((k - 1) * 0.18, 2.05, 0); p.add(m); return m; });
      G.prove.add(p); vols.push({ p, pops, seed: i });
    }
    const provL = L('Healthy volunteers keep a symptom diary', [0.4, 2.3, 0], 'muted', G.prove);
    const drawDiary = (g, w, h, day = 0) => {
      panelBg(g, w, h);
      const sb = SUBST[sub] || SUBST.onion;
      text(g, `Proving diary: ${sb.label}, day ${Math.min(14, Math.floor(day) + 1)}`, 24, 44, { size: 26, bold: true });
      const items = sb.prov.concat(['Headache (also seen on placebo)', 'Tiredness (also seen on placebo)']);
      items.forEach((it, i) => { const on = day > 1.5 + i * 2; text(g, (on ? '✓ ' : '· ') + it, 30, 100 + i * 46, { size: 22, col: on ? (i < 3 ? COL.remedy : COL.muted) : 'rgba(255,255,255,.3)' }); });
      text(g, 'As described in homeopathy. Placebo groups report symptoms too.', 24, h - 22, { size: 18, col: COL.muted });
    };
    const diaryB = board(G.prove, 2.6, 1.55, 640, 380, (g, w, h, day) => drawDiary(g, w, h, day), [0.35, 2.95, -1.2]);

    // ---------------------------------------------------------------- case-taking: two chairs and a clock
    const chair = (x, rot) => { const c = new THREE.Group(); const seat = box(0.6, 0.06, 0.6, M.matte(0x5b3f2a)); seat.position.y = 0.45; c.add(seat); const back = box(0.6, 0.7, 0.05, M.matte(0x5b3f2a)); back.position.set(0, 0.8, -0.28); c.add(back); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = box(0.05, 0.45, 0.05, M.matte(0x5b3f2a)); l.position.set(sx * 0.26, 0.22, sz * 0.26); c.add(l); } c.position.x = x; c.rotation.y = rot; G.case.add(c); return c; };
    chair(-0.3, Math.PI / 2 + 0.3); chair(1.6, -Math.PI / 2 - 0.3);
    const doc = person(0x5ce1a9, { seated: true }); doc.position.set(-0.3, 0, 0); doc.rotation.y = Math.PI / 2 + 0.3; G.case.add(doc);
    const pat2 = person(0x8fb0ff, { seated: true }); pat2.position.set(1.6, 0, 0); pat2.rotation.y = -Math.PI / 2 - 0.3; G.case.add(pat2);
    const clock = new THREE.Group(); clock.position.set(0.65, 2.55, -1.0); G.case.add(clock);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 48), M.matte(0xf1e6c8)); face.rotation.x = Math.PI / 2; clock.add(face);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.03, 8, 48), M.metal(0x9aa0a8)); clock.add(rim);
    for (let i = 0; i < 12; i++) { const tk = box(0.02, 0.07, 0.01, M.matte(0x222222)); tk.position.set(Math.sin(i * Math.PI / 6) * 0.35, Math.cos(i * Math.PI / 6) * 0.35, 0.03); tk.rotation.z = -i * Math.PI / 6; clock.add(tk); }
    const sweep = new THREE.Mesh(new THREE.CircleGeometry(0.33, 48, Math.PI / 2, 0.01), new THREE.MeshBasicMaterial({ color: hex(COL.good), transparent: true, opacity: 0.45, side: THREE.DoubleSide })); sweep.position.z = 0.03; clock.add(sweep);
    const hand = box(0.025, 0.32, 0.01, M.matte(0x222222)); hand.geometry.translate(0, 0.16, 0); hand.position.z = 0.04; clock.add(hand);
    const QS = ['What is the main problem?', 'How do you sleep?', 'Hot or cold person?', 'What makes it worse?', 'Any food cravings?', 'How is your mood?', 'What worries you?'];
    const qL = QS.map((q, i) => L(q, [0.65 + (i % 2 ? 0.9 : -0.9), 1.3 + (i % 4) * 0.28, 0.4], i % 2 ? 'mol' : 'good', G.case));

    // ---------------------------------------------------------------- single remedy: a rack of vials
    const rack = box(3.2, 0.1, 0.8, M.matte(0x4d3525)); rack.position.set(0.2, 0.9, 0); G.single.add(rack);
    const shelfLegs = [-1.3, 1.7].map((x) => { const l = box(0.08, 0.9, 0.7, M.matte(0x4d3525)); l.position.set(x, 0.45, 0); G.single.add(l); return l; });
    const vials = [];
    for (let i = 0; i < 18; i++) { const v = vial(0.08, 0.34, [0xffb547, 0xffd166, 0xf1e6c8][i % 3]); v.position.set(-1.2 + (i % 9) * 0.34, 0.95, (i < 9 ? -0.18 : 0.18)); G.single.add(v); vials.push(v); }
    const chosen = 12;
    const oneL = L('One remedy, chosen for the whole picture', [0.3, 2.1, 0], 'remedy', G.single);

    // ---------------------------------------------------------------- minimum dose: one drop, one pill
    const dropV = vial(0.18, 0.6, 0xffb547); dropV.position.set(0.3, 0.9, 0); G.dose.add(dropV);
    const stand = box(1.4, 0.9, 0.9, M.matte(0x2b3039)); stand.position.set(0.3, 0.45, 0); G.dose.add(stand);
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 14), M.plastic(0xffb547, { transparent: true, opacity: 0.85 })); drop.scale.set(1, 1.3, 1); G.dose.add(drop);
    const pill = sphere(0.07, M.plastic(0xffffff, { roughness: 0.3 })); pill.position.set(0.85, 0.97, 0.2); G.dose.add(pill);
    const doseL = L('Hahnemann: give the smallest dose that is enough', [0.3, 2.0, 0], 'remedy', G.dose);

    const subL = L('', [-1.9, 0.15, 0.8], 'remedy');
    const fit = fitNarrow(stage, { pos: [0, 2.4, 5.8], target: [-0.2, 1.45, 0] });
    

    return compactReadout(stage, {
      update(dt, s) {
        dt = Math.max(0, dt); t += dt;
        const changed = s.idea !== idea || s.subst !== sub;
        if (changed) { idea = s.idea; sub = s.subst; k = 0; }
        k += dt;
        Object.entries(G).forEach(([n, g]) => { g.visible = n === ({ similia: 'match', proving: 'prove' }[idea] || idea); });
        const showSub = idea === 'similia' || idea === 'proving';
        pedestal.visible = showSub;
        Object.entries(S).forEach(([n, g]) => { g.visible = showSub && n === sub; g.rotation.y = t * 0.3; });
        const narrow = fit(), on = s.labels && !inReel() && !narrow;
        subL.visible = on && showSub; subL.element.textContent = `${SUBST[sub].label} → remedy "${SUBST[sub].remedy}"`;

        if (idea === 'similia') {
          const SD = SUBST[sub], targets = sub === 'onion' ? PT : PTbody[sub];
          for (let i = 0; i < 3; i++) {
            const appear = smooth((k - 0.4 - i * 0.6) / 0.6);
            spots[i].position.set(...targets[i]); spots[i].scale.setScalar(appear * (1 + 0.25 * Math.sin(t * 5 + i)));
            if (changed || links[i].userData.sub !== sub) { links[i].geometry.dispose(); links[i].geometry = arc([-1.9, topY + 0.55, 0], targets[i], 0.9 + i * 0.25); links[i].userData.sub = sub; }
            links[i].geometry.setDrawRange(0, Math.floor(appear * links[i].geometry.index.count / 3) * 3);
            chipsL[i].element.textContent = SD.prov[i]; chipsR[i].element.textContent = '✓ ' + SD.pt[i];
            chipsL[i].visible = on && appear > 0.2; chipsR[i].visible = on && appear > 0.6;
          }
          headL.visible = headR.visible = on;
        }
        if (idea === 'proving') {
          const day = (k * 1.4) % 16;
          vols.forEach((v) => v.pops.forEach((m, j) => { const d0 = 1.5 + ((v.seed * 3 + j * 5) % 9); m.scale.setScalar(day > d0 ? 1 + 0.2 * Math.sin(t * 4 + j) : 0.001); }));
          if (Math.floor(day * 4) !== diaryB.last || changed) { diaryB.last = Math.floor(day * 4); diaryB.redraw(day); }
          provL.visible = on;
          diaryB.mesh.visible = true;
        }
        if (idea === 'case') {
          const mins = Math.min(60, k * 6);   // time-lapse: 1 s here is 6 minutes
          hand.rotation.z = -(mins / 60) * Math.PI * 2;
          sweep.geometry.dispose(); sweep.geometry = new THREE.CircleGeometry(0.33, 48, Math.PI / 2 - (mins / 60) * Math.PI * 2, Math.max(0.01, (mins / 60) * Math.PI * 2));
          qL.forEach((l, i) => { l.visible = on && k > 0.4 + i * 1.2; });
          doc.head.rotation.x = 0.1 * Math.sin(t * 2);
        }
        if (idea === 'single') {
          vials.forEach((v, i) => { const lift = i === chosen ? smooth((k - 1) / 1.2) : 0; v.position.y = 0.95 + lift * 0.6; v.position.z = (i < 9 ? -0.18 : 0.18) + lift * 0.4; v.rotation.y = i === chosen ? t : 0; });
          oneL.visible = on;
        }
        if (idea === 'dose') {
          const c = (k * 0.6) % 1;
          drop.position.set(0.85, lerp(1.62, 1.05, smooth(c / 0.7)), 0.2); drop.visible = c < 0.7;
          pill.material.color.set(c > 0.7 ? 0xffe2a8 : 0xffffff);
          doseL.visible = on;
        }
      },
      readout: (s) => {
        const SD = SUBST[s.subst];
        const R = {
          similia: [[['Substance', SD.label], ['In a healthy person (provings)', SD.prov[0].toLowerCase()], ['Used in homeopathy for', SD.who], ['Remedy name', SD.remedy]], 'As described in homeopathy. Whether it works is tested in chapter 5.'],
          proving: [[['Who takes it', 'healthy volunteers'], ['What they record', 'every change they notice'], ['Result', 'a remedy\'s "symptom picture"'], ['In India', 'CCRH runs proving studies']], 'A review of provings from 1945–1995 found most were low quality, and placebo takers reported symptoms too.'],
          case: [[['First consultation', 'often 30–90 minutes'], ['Asks about', 'sleep, mood, cravings, habits'], ['Goal', 'match one remedy to the whole person'], ['Same disease', 'can mean different remedies']], 'Being listened to carefully can help people feel better in itself (chapter 5).'],
          single: [[['Classical rule', 'one remedy at a time'], ['Chosen by', 'the closest symptom match'], ['Also sold', 'combination products'], ['Found using', 'a repertory (chapter 4)']], 'As described in homeopathy.'],
          dose: [[['Hahnemann\'s rule', 'the smallest dose that is enough'], ['How', 'dilute and shake, step by step'], ['Homeopathy\'s claim', 'more dilute can act more deeply'], ['What chemistry says', 'see chapter 3']], 'In pharmacology, a stronger dose usually has a stronger effect. Homeopathy claims the reverse.'],
        }[s.idea];
        return `<div class="big">${IDEAS[s.idea].title}</div>${rows([['Told', 'as homeopathy describes it'], ...R[0]])}<small>${R[1]}</small>`;
      },
    });
  },
};

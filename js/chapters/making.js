// Chapter 4: how remedies are made and chosen, described factually. Four stations on a long bench:
// a jar of plant material soaking in alcohol and a funnel filtering the mother tincture (Ø); a mortar
// grinding an insoluble substance with milk sugar (trituration); a vial of sugar globules being
// medicated with drops of a liquid potency; and an open repertory, the index a homeopath uses to go
// from symptoms to remedies.
// Sources:
//  - Homoeopathic Pharmacopoeia of India (HPI), Ministry of AYUSH, published by the Pharmacopoeia
//    Commission for Indian Medicine & Homoeopathy (PCIM&H), Ghaziabad: mother tinctures are made by
//    macerating or percolating plant material in alcohol; many have a "drug strength" of 1/10; the
//    symbol Ø marks a mother tincture. Trituration: 1 part substance with 99 parts lactose (C) for
//    insoluble substances, usually up to 3C, after which the triturate can be dissolved and
//    potentised as a liquid.
//  - Hahnemann, Organon 6th ed. §270 and Chronic Diseases (1828/1835): trituration with milk sugar in
//    a porcelain mortar, about an hour per step (three rounds of about 20 minutes).
//  - Globules: small pills of sucrose (or sucrose with lactose) moistened with a liquid potency made in
//    strong alcohol, then dried (HPI, "Globules"; German HAB method 10).
//  - Repertories: J. T. Kent, Repertory of the Homoeopathic Materia Medica (1897). Kent graded remedies
//    in three types: bold (3), italic (2), plain (1). Today software is common, including Indian
//    programs such as Hompath (Mumbai). The rubrics shown here are a simplified, illustrative layout,
//    not a copy of any repertory.
//  - Regulation in India: homoeopathic medicines are covered by the Drugs and Cosmetics Act, 1940 and
//    the Drugs and Cosmetics Rules, 1945 (manufacturing licences, labelling), with standards from the
//    HPI (CDSCO; Ministry of AYUSH).
import { THREE, M, box, beam, clamp, lerp, smooth } from '../kit.js';
import { COL, hex, tint, inReel, fitNarrow, compactReadout, rows, board, panelBg, text, wrap, vial, openBook, table, dots, rnd, canvasTex, liquidMat, glassMat, TAU } from '../homeo.js';

const STEPS = {
  tincture: { label: 'Mother tincture', title: 'Mother tincture (Ø)', x: -3.1 },
  trit: { label: 'Trituration', title: 'Trituration: grinding with milk sugar', x: -1.05 },
  globules: { label: 'Globules', title: 'Medicating sugar globules', x: 1.05 },
  repertory: { label: 'Repertory', title: 'Choosing a remedy: the repertory', x: 3.1 },
};
const viewFor = (k) => ({ pos: [STEPS[k].x + 0.3, 3.2, 5.4], target: [STEPS[k].x - 0.8, 1.8, 0] });
const VIEW = { pos: [0.2, 3.6, 8.6], target: [-0.9, 1.3, 0] };

export default {
  id: 'making',
  short: 'Making remedies',
  title: 'From plant to sugar pill',
  subtitle: 'Mother tinctures, grinding with milk sugar, medicated globules, and the repertory a homeopath uses to choose.',
  view: VIEW,
  learn: `<p>Most homeopathic remedies start as a <b>mother tincture</b>, marked <b>Ø</b>. Fresh or dried plant material, such as red onion or the flowers of <i>Arnica</i>, is chopped and left to soak in alcohol for days or weeks, then pressed and filtered. India's official standard, the <b>Homoeopathic Pharmacopoeia of India</b>, says how each one is made.</p>
    <p>Some starting materials don't dissolve: metals, minerals, oyster shell (<i>Calcarea carbonica</i>). These are <b>triturated</b>: ground with 99 parts of <b>milk sugar</b> (lactose) in a mortar. Hahnemann described about an hour of grinding per step. After three steps the powder can be dissolved and diluted like a liquid (chapter 3).</p>
    <p>You rarely swallow the liquid itself. Tiny white <b>globules</b>, made of cane sugar, are wetted with a few drops of the diluted remedy in strong alcohol and left to dry. So a 30C pill is sugar that was moistened with a liquid expected to hold no molecule of the starting substance.</p>
    <p>How does a homeopath pick a remedy? With a <b>repertory</b>: a huge index that lists symptoms, called <b>rubrics</b>, and under each the remedies linked to it in provings. J. T. Kent's repertory (1897) is still used, often through software, including programs made in India. The homeopath combines the patient's rubrics to find the remedy that covers most of them. In India, homeopathic medicines are licensed under the <b>Drugs and Cosmetics Act</b>.</p>
    <p class="tip"><b>Try it:</b> step through the four stations. At "Globules", watch the drops soak in. At "Repertory", see how three symptoms narrow the list to one remedy.</p>`,
  terms: [
    { t: 'Mother tincture (Ø)', d: 'The starting liquid for a plant remedy, made by soaking plant material in alcohol and filtering it.' },
    { t: 'Trituration', d: 'Grinding an insoluble substance with milk sugar, 1 part to 99, to start the dilution.' },
    { t: 'Globules', d: 'Small sugar pills wetted with a liquid potency and dried.' },
    { t: 'Repertory', d: 'An index of symptoms (rubrics), each listing the remedies linked to it.' },
    { t: 'Rubric', d: 'One entry in a repertory, such as "Nose: discharge, watery".' },
    { t: 'HPI', d: 'The Homoeopathic Pharmacopoeia of India: the official standards for making homeopathic medicines.' },
  ],
  defaults: { step: 'tincture', labels: true },
  controls: [
    { key: 'step', type: 'seg', label: 'Station', options: Object.entries(STEPS).map(([v, m]) => ({ v, label: m.label })) },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'What is a mother tincture?', options: ['A remedy for mothers', 'The starting liquid, made by soaking plant material in alcohol', 'The strongest 200C remedy', 'Sugar syrup'], answer: 1, why: 'The mother tincture (Ø) is the plant extract in alcohol that the dilutions start from.' },
    { q: 'What are homeopathic globules mostly made of?', options: ['Pure plant extract', 'Sugar', 'Salt', 'Metal'], answer: 1, why: 'They are sugar pills (sucrose or lactose) wetted with a liquid potency and then dried.' },
    { q: 'What does a repertory help a homeopath do?', options: ['Count molecules', 'Look up which remedies are linked to a set of symptoms', 'Measure blood pressure', 'Store remedies'], answer: 1, why: 'A repertory is an index of symptoms (rubrics), each listing the remedies linked to it.' },
  ],
  reel: [
    { ms: 5000, caption: 'Remedies start as plant material soaked in alcohol, then end up as drops on tiny sugar pills.', set: { step: 'globules', labels: false }, view: { pos: [1.1, 2.1, 2.3], target: [1.0, 1.35, 0] }, spin: 0.25 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c) => tint(stage.label(h, p, root), c);
    const bench = table(8.4, 1.8, 0.9, 0x4d3525); root.add(bench);
    const Y = bench.top;

    // ---------------------------------------------------------------- station 1: mother tincture
    const tx = STEPS.tincture.x;
    const jarG = new THREE.Group(); jarG.position.set(tx - 0.45, Y, 0); root.add(jarG);
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 40, 1, true), glassMat(0.18)); jar.position.y = 0.55; jarG.add(jar);
    const jarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 40), glassMat(0.3)); jarBase.position.y = 0.015; jarG.add(jarBase);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.1, 40), M.metal(0xb9bec8)); lid.position.y = 1.15; jarG.add(lid);
    const alc = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.85, 40), liquidMat(0xc98a2a, 0.35)); alc.position.y = 0.46; jarG.add(alc);
    const NP = 40, piece = new THREE.InstancedMesh(new THREE.CircleGeometry(0.07, 6), new THREE.MeshStandardMaterial({ color: 0x8bd46a, side: THREE.DoubleSide, roughness: 0.7 }), NP); piece.frustumCulled = false; jarG.add(piece);
    const pieceCol = [0x8bd46a, 0x6aa84f, 0xb5577c, 0xe8c547];
    for (let i = 0; i < NP; i++) piece.setColorAt(i, new THREE.Color(pieceCol[i % 4]));
    // funnel and bottle
    const bottle = new THREE.Group(); bottle.position.set(tx + 0.55, Y, 0.1); root.add(bottle);
    const bb = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32), new THREE.MeshStandardMaterial({ color: 0x6b3a12, transparent: true, opacity: 0.75, roughness: 0.2 })); bb.position.y = 0.25; bottle.add(bb);
    const bn = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.2, 0.15, 32), bb.material); bn.position.y = 0.57; bottle.add(bn);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.22), new THREE.MeshBasicMaterial({ map: canvasTex(128, 110, (g, w, h) => { g.fillStyle = '#f1e6c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a2a1c'; g.font = 'bold 60px Georgia'; g.textAlign = 'center'; g.fillText('Ø', w / 2, 62); g.font = '20px Georgia'; g.fillText('Allium cepa', w / 2, 96); }) })); label.position.set(0, 0.25, 0.201); bottle.add(label);
    const funnel = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.4, 32, 1, true), glassMat(0.3)); funnel.rotation.x = Math.PI; funnel.position.y = 0.95; bottle.add(funnel);
    const paper = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.34, 32, 1, true), M.matte(0xf6f1e4, { side: THREE.DoubleSide })); paper.rotation.x = Math.PI; paper.position.y = 0.99; bottle.add(paper);
    const tdrop = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), M.plastic(0xc98a2a)); bottle.add(tdrop);

    // ---------------------------------------------------------------- station 2: trituration
    const mx = STEPS.trit.x;
    const mortar = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.3, 0], [0.36, 0.07], [0.4, 0.34], [0.35, 0.36], [0.31, 0.12], [0, 0.1]].map(([x, y]) => new THREE.Vector2(x, y)), 48), M.matte(0xefece6));
    mortar.position.set(mx, Y, 0); mortar.castShadow = true; root.add(mortar);
    const powder = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.2, 0.06, 32), M.matte(0xffffff)); powder.position.set(mx, Y + 0.14, 0); root.add(powder);
    const grey = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.03, 24), M.matte(0x8a8f99)); grey.position.set(mx, Y + 0.175, 0); root.add(grey);
    const pestle = new THREE.Group(); root.add(pestle);
    const pst = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.55, 6, 16), M.matte(0xe4e0d6)); pst.position.y = 0.3; pestle.add(pst);
    const sugarBag = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.45, 24), M.matte(0xd9cfb7)); sugarBag.position.set(mx + 0.7, Y + 0.225, -0.3); root.add(sugarBag);

    // ---------------------------------------------------------------- station 3: globules
    const gx = STEPS.globules.x;
    const gv = new THREE.Group(); gv.position.set(gx - 0.2, Y, 0); root.add(gv);
    const gvb = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.7, 40, 1, true), glassMat(0.16)); gvb.position.y = 0.35; gv.add(gvb);
    const gvBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 40), glassMat(0.3)); gvBase.position.y = 0.01; gv.add(gvBase);
    const NG = 160, glob = dots(NG, 0.045, 0xffffff, 10); glob.material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }); gv.add(glob);
    const gpos = []; for (let i = 0; i < NG; i++) { const a = rnd(i) * TAU, r = Math.sqrt(rnd(i + 5)) * 0.24; const y = 0.06 + Math.floor(i / 22) * 0.07 + rnd(i + 2) * 0.03; gpos.push([Math.cos(a) * r, y, Math.sin(a) * r]); glob.place(i, ...gpos[i]); }
    glob.done();
    const pv = vial(0.12, 0.45, 0x6fb6ff); pv.position.set(gx + 0.55, Y, 0.1); root.add(pv);
    const dropper = new THREE.Group(); gv.add(dropper);
    const dt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 0.6, 12), M.clear(0xe6f6ff, 0.4)); dt1.position.y = 0.3; dropper.add(dt1);
    const dbulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), M.plastic(0x2b3039)); dbulb.scale.y = 1.4; dbulb.position.y = 0.65; dropper.add(dbulb);
    dropper.position.set(0, 0.95, 0);
    const gdrop = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), M.glow(hex(COL.water))); gv.add(gdrop);
    const wet = new THREE.Color(0xfff0c8), dry = new THREE.Color(0xffffff), gc = new THREE.Color();

    // ---------------------------------------------------------------- station 4: the repertory
    const rx = STEPS.repertory.x;
    const RUB = [
      ['Nose: discharge, watery, burning', [['All-c.', 3], ['Ars.', 2], ['Euphr.', 1], ['Merc.', 2], ['Nat-m.', 2]]],
      ['Eyes: tears, bland (not burning)', [['All-c.', 3], ['Puls.', 2], ['Nat-m.', 1]]],
      ['Worse in a warm room', [['All-c.', 3], ['Puls.', 3], ['Nat-m.', 1], ['Merc.', 1]]],
    ];
    const pageL = canvasTex(560, 700, (g, w, h) => {
      g.fillStyle = '#f1e6c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a2a1c';
      g.font = 'bold 30px Georgia'; g.fillText('REPERTORY', 30, 60); g.font = '20px Georgia'; g.fillText('(simplified example)', 30, 92);
      let y = 150;
      RUB.forEach(([r, list]) => {
        g.font = 'bold 22px Georgia'; g.fillStyle = '#5a2f24'; g.fillText(r, 30, y); y += 34;
        let x = 40;
        list.forEach(([n, gr]) => { g.font = `${gr === 3 ? 'bold ' : gr === 2 ? 'italic ' : ''}24px Georgia`; g.fillStyle = '#3a2a1c'; g.fillText(n, x, y); x += g.measureText(n).width + 18; });
        y += 70;
      });
      g.font = '18px Georgia'; g.fillStyle = '#6b5a48'; g.fillText('Bold = 3 · italic = 2 · plain = 1', 30, h - 40);
    });
    const pageR = canvasTex(560, 700, (g, w, h) => {
      g.fillStyle = '#f1e6c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a2a1c';
      g.font = 'bold 26px Georgia'; g.fillText('Adding up the rubrics', 30, 60);
      const tot = {}; RUB.forEach(([, l]) => l.forEach(([n, gr]) => { tot[n] = tot[n] || { s: 0, c: 0 }; tot[n].s += gr; tot[n].c += 1; }));
      Object.entries(tot).sort((a, b) => b[1].c - a[1].c || b[1].s - a[1].s).forEach(([n, v], i) => {
        const y = 130 + i * 72; g.font = '24px Georgia'; g.fillStyle = '#3a2a1c'; g.fillText(n, 30, y);
        g.fillStyle = i === 0 ? '#b5651d' : '#9b8b74'; g.fillRect(150, y - 22, v.s * 38, 28);
        g.fillStyle = '#3a2a1c'; g.font = '20px Georgia'; g.fillText(`${v.c} of 3 rubrics, score ${v.s}`, 160 + v.s * 38, y);
      });
      g.font = 'italic 20px Georgia'; g.fillStyle = '#6b5a48'; g.fillText('All-c. = Allium cepa (red onion)', 30, h - 40);
    });
    const rep = openBook(1.8, 1.15, pageL, pageR); rep.position.set(rx, Y, 0.05); rep.rotation.x = 0.0; root.add(rep);

    // ---------------------------------------------------------------- labels and marker
    const ringMat = M.glow(hex(COL.remedy)); ringMat.transparent = true;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.012, 8, 64), ringMat); ring.rotation.x = Math.PI / 2; root.add(ring);
    const lab = {
      tincture: [L('Plant material soaking in alcohol', [tx - 0.45, Y + 1.45, 0], 'leaf'), L('Filtered: the mother tincture Ø', [tx + 0.55, Y + 1.35, 0.1], 'remedy')],
      trit: [L('1 part substance + 99 parts milk sugar', [mx, Y + 0.95, 0], 'text'), L('about an hour of grinding per step', [mx, Y + 0.72, 0.1], 'muted')],
      globules: [L('Sugar globules', [gx - 0.2, Y + 0.85, 0.3], 'text'), L('Drops of a liquid potency soak in, then dry', [gx - 0.1, Y + 1.8, 0], 'cyan')],
      repertory: [L('Symptoms (rubrics) → remedies', [rx, Y + 0.7, 0], 'gold')],
    };
    const fit = fitNarrow(stage, { pos: [0, 3.4, 8.2], target: [0, 1.4, 0] });
    let t = 0, cur = '', k = 0;

    return compactReadout(stage, {
      update(dt, s) {
        dt = Math.max(0, dt); t += dt; k += dt;
        if (s.step !== cur) { cur = s.step; k = 0; if (!inReel()) stage.setView(viewFor(cur).pos, viewFor(cur).target, 1.0); }
        const narrow = fit(), on = s.labels && !inReel() && !narrow;
        Object.entries(lab).forEach(([n, ls]) => ls.forEach((l) => { l.visible = on && n === cur; }));
        ring.position.set(STEPS[cur].x, Y + 0.005, 0); ring.scale.setScalar(1 + 0.03 * Math.sin(t * 3)); ringMat.opacity = 0.5 + 0.3 * Math.sin(t * 3);
        // tincture: pieces drift in the alcohol; drops fall through the filter
        for (let i = 0; i < NP; i++) {
          const a = rnd(i) * TAU + t * 0.15 * (0.5 + rnd(i + 1)), r = 0.08 + rnd(i + 2) * 0.27, y = 0.08 + rnd(i + 3) * 0.75 + Math.sin(t * 0.6 + i) * 0.03;
          const o = new THREE.Object3D(); o.position.set(Math.cos(a) * r, y, Math.sin(a) * r); o.rotation.set(rnd(i) * 6 + t * 0.3, rnd(i + 4) * 6, 0); o.updateMatrix(); piece.setMatrixAt(i, o.matrix);
        }
        piece.instanceMatrix.needsUpdate = true; if (piece.instanceColor) piece.instanceColor.needsUpdate = true;
        const dp = (t * 1.3) % 1; tdrop.position.set(0, lerp(0.77, 0.4, dp * dp), 0); tdrop.visible = cur === 'tincture';
        // trituration: the pestle circles
        const pa = t * 2.2; pestle.position.set(mx + Math.cos(pa) * 0.13, Y + 0.12, Math.sin(pa) * 0.13); pestle.rotation.set(Math.sin(pa) * 0.35, 0, -Math.cos(pa) * 0.35);
        grey.scale.setScalar(Math.max(0.05, 1 - ((t * 0.05) % 1)));
        // globules: a drop falls every 1.2 s and the globules take on a wet tint that dries off
        const c = (k % 6) / 6, dropping = cur === 'globules' && k % 1.2 < 0.5;
        gdrop.visible = dropping; gdrop.position.set(Math.sin(Math.floor(k / 1.2)) * 0.12, lerp(0.95, 0.5, ((k % 1.2) / 0.5) ** 2), 0);
        const wetness = cur === 'globules' ? clamp(c * 2, 0, 1) * (1 - clamp((c - 0.7) / 0.3, 0, 1)) : 0;
        gc.copy(dry).lerp(wet, wetness);
        for (let i = 0; i < NG; i++) glob.tint(i, gc);
        glob.done();
      },
      readout: (s) => {
        const R = {
          tincture: [['Starts from', 'plant, animal or mineral material'], ['Method', 'soak in alcohol, press, filter'], ['Typical strength', 'often 1 part drug in 10'], ['Standard', 'Homoeopathic Pharmacopoeia of India']],
          trit: [['Used for', 'metals, minerals, shells'], ['Mix', '1 part + 99 parts lactose'], ['Grinding', 'about 1 hour per step'], ['Then', 'dissolved after 3C, diluted as liquid']],
          globules: [['Made of', 'sucrose (cane sugar) or lactose'], ['Medicated with', 'a liquid potency in alcohol'], ['After drying', 'sugar, with the alcohol gone'], ['A 30C pill', 'no molecule of the substance expected']],
          repertory: [['What it is', 'an index of symptoms'], ['Classic', 'Kent\'s Repertory, 1897'], ['Grades', 'bold 3, italic 2, plain 1'], ['Today', 'often software, some made in India']],
        }[s.step];
        const note = { tincture: 'Mother tinctures and low potencies can contain real amounts of the plant, and alcohol.', trit: 'Oyster shell (Calcarea carbonica) and silica (Silicea) are made this way.', globules: 'In India these are licensed under the Drugs and Cosmetics Act, 1940.', repertory: 'The page shown is a simplified example, not a copy of a real repertory.' }[s.step];
        return `<div class="big">${STEPS[s.step].title}</div>${rows(R)}<small>${note}</small>`;
      },
    });
  },
};

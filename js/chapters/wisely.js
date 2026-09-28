// Chapter 6: using it wisely. A consultation room with a clock, a prescribed-medicine bottle, a
// vaccine vial and syringe, and a hospital sign. Each topic lights up its object and a board.
// No treatment or dosing advice anywhere: the message is "see a qualified doctor", "never stop
// prescribed medicine", and "vaccines are not replaced by homeopathic prophylaxis".
// Sources:
//  - Consultation length: Irving et al., "International variations in primary care physician
//    consultation time: a systematic review of 67 countries", BMJ Open 7:e017902 (2017): India about
//    2 minutes, Bangladesh 48 seconds, UK about 9 minutes, Sweden 22.5 minutes. Classical homeopathic
//    first consultations are often 30–90 minutes (hedged; practice varies widely, and busy Indian
//    clinics can be much shorter).
//  - Vaccines: WHO certified India polio-free on 27 March 2014 (WHO SEARO); India's Universal
//    Immunisation Programme (MoHFW) gives free vaccines against 12 diseases. India gave more than 220
//    crore COVID-19 vaccine doses (MoHFW/PIB, 2023). The UK Faculty of Homeopathy states that
//    homeopathy should not be used as an alternative to vaccination (Faculty of Homeopathy position
//    statement on vaccination). No rigorous trial has shown that homeopathic "prophylaxis" (nosodes)
//    protects like a vaccine.
//  - In January 2020 the Ministry of AYUSH, following CCRH's Scientific Advisory Board, suggested
//    Arsenicum album 30 as a possible preventive against the new coronavirus (PIB, 29 January 2020);
//    it was widely criticised for lacking trial evidence, and no large, rigorous, independently
//    replicated trial has shown that it prevents COVID-19.
//  - Emergency numbers in India: 112 (all emergencies) and 108 (ambulance, most states).
//  - Why people choose homeopathy: surveys often cite longer consultations, feeling listened to, fewer
//    expected side effects, cost and family tradition (e.g. Frenkel et al.; NCCIH "Homeopathy: what you
//    need to know"). AYUSH doctors are co-located in many government hospitals and health centres under
//    the National Health Mission (Ministry of AYUSH).
import { THREE, M, box, beam, clamp, lerp, smooth } from '../kit.js';
import { COL, hex, tint, inReel, fitNarrow, compactReadout, rows, board, panelBg, text, wrap, person, table, vial, canvasTex } from '../homeo.js';

const TOPICS = {
  medicines: { label: 'Prescribed medicines', title: 'Never stop prescribed medicine' },
  serious: { label: 'Serious illness', title: 'See a qualified doctor' },
  vaccines: { label: 'Vaccines', title: 'Vaccines can\'t be swapped' },
  why: { label: 'Why people choose it', title: 'Why people choose homeopathy' },
};
const VIEW = { pos: [0.3, 3.6, 8.6], target: [-0.6, 1.75, 0] };

export default {
  id: 'wisely',
  short: 'Using it wisely',
  title: 'Using homeopathy wisely',
  subtitle: 'Keep taking prescribed medicine, see a doctor for serious illness, keep vaccines up to date, and why people value it.',
  view: VIEW,
  learn: `<p>Many Indian families use homeopathy alongside other kinds of medicine. Whatever you choose, a few rules keep everyone safe. This page explains; it cannot tell you what is right for your own body. For that, <b>see a qualified doctor</b>.</p>
    <p><b>Never stop prescribed medicine</b> on your own, such as insulin, asthma inhalers, epilepsy or blood-pressure medicine. Stopping can be dangerous. Tell every doctor and practitioner <b>everything</b> you take.</p>
    <p>For <b>serious illness</b>, go to a qualified doctor quickly: high fever that won't settle (dengue and malaria are common in India), trouble breathing, chest pain, a child who is floppy or not drinking, or a wound that is getting worse. In an emergency call <b>112</b> or <b>108</b>. Delay is the biggest real risk of any alternative treatment.</p>
    <p><b>Vaccines</b> hold measured parts of a germ that train your immune system, and they are tested in huge trials (see ImmuneClear). Homeopathic "prophylaxis" has not been shown to protect like a vaccine, and even the UK Faculty of Homeopathy says it should not replace vaccination. In 2020 India's AYUSH ministry suggested the remedy <i>Arsenicum album 30</i> against the new coronavirus; there was no trial evidence that it prevents COVID-19. India's protection came from vaccines: more than 220 crore doses. India has also been <b>polio-free since 2014</b> thanks to vaccination.</p>
    <p>So <b>why</b> do people choose homeopathy? Often for good human reasons: a <b>long, unhurried consultation</b> where they feel heard (an average Indian GP visit lasts about <b>2 minutes</b>), gentle pills with few side effects, low cost, and family tradition. Those are real needs, and good medicine should meet them too. Compare with AyurvedaClear, UnaniClear, SiddhaClear, NaturopathyClear and MedicineClear.</p>
    <p class="tip"><b>Try it:</b> click through the topics. On "Why people choose it", compare the clock for a 2-minute visit with an hour-long homeopathy consultation.</p>`,
  terms: [
    { t: 'Qualified doctor', d: 'A registered medical practitioner, such as an MBBS doctor, who can diagnose and prescribe tested treatment.' },
    { t: 'Prophylaxis', d: 'Something taken to prevent a disease. Vaccines are proven prophylaxis; homeopathic prophylaxis is not.' },
    { t: 'Vaccine', d: 'A measured, harmless piece or version of a germ that trains immune memory.' },
    { t: 'Integrative care', d: 'Using more than one kind of care, with every practitioner told about everything you take.' },
    { t: 'Emergency numbers', d: 'In India, 112 for any emergency and 108 for an ambulance in most states.' },
  ],
  defaults: { topic: 'medicines', labels: true },
  controls: [
    { key: 'topic', type: 'seg', label: 'Topic', options: Object.entries(TOPICS).map(([v, m]) => ({ v, label: m.label })) },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'You take a prescribed medicine and want to try homeopathy too. What should you do?', options: ['Stop the prescribed medicine', 'Keep taking it and tell your doctor what else you take', 'Double the dose', 'Hide it from your doctor'], answer: 1, why: 'Never stop prescribed medicine on your own. Tell every practitioner everything you take.' },
    { q: 'Can homeopathic "prophylaxis" replace a vaccine?', options: ['Yes, it works the same', 'No: it has not been shown to protect, and vaccines have', 'Only for measles', 'Only for adults'], answer: 1, why: 'Vaccines are proven in large trials to prevent disease. Even the UK Faculty of Homeopathy says homeopathy should not replace vaccination.' },
    { q: 'Which is a common reason people say they choose homeopathy?', options: ['It is the strongest medicine', 'Long consultations where they feel listened to', 'It is required by law', 'It has the most trials'], answer: 1, why: 'Many value the time and attention. An average primary care visit in India lasts about 2 minutes.' },
  ],
  reel: [
    { ms: 5600, caption: 'Use it wisely: never stop prescribed medicine, see a doctor for serious illness, and keep vaccines up to date.', set: { topic: 'vaccines', labels: false }, view: { pos: [0, 2.7, 5.8], target: [0, 1.95, 0] }, spin: 0.2 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c) => tint(stage.label(h, p, root), c);
    const desk = table(3.2, 1.4, 0.8, 0x5b3f2a); desk.position.set(0, 0, -0.2); root.add(desk);
    const Y = desk.top;
    const chairAt = (x, rot) => { const c = new THREE.Group(); const seat = box(0.6, 0.06, 0.6, M.matte(0x3a4150)); seat.position.y = 0.45; c.add(seat); const back = box(0.6, 0.7, 0.05, M.matte(0x3a4150)); back.position.set(0, 0.8, -0.28); c.add(back); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = box(0.05, 0.45, 0.05, M.matte(0x3a4150)); l.position.set(sx * 0.26, 0.22, sz * 0.26); c.add(l); } c.position.set(x, 0, 0.9); c.rotation.y = rot; root.add(c); };
    chairAt(-2.2, Math.PI / 2); chairAt(2.2, -Math.PI / 2);
    const doc = person(0x5ce1a9, { seated: true }); doc.position.set(-2.2, 0, 0.9); doc.rotation.y = Math.PI / 2; root.add(doc);
    const pat = person(0x8fb0ff, { seated: true }); pat.position.set(2.2, 0, 0.9); pat.rotation.y = -Math.PI / 2; root.add(pat);

    const glowRing = (x, z, r) => { const m = M.glow(hex(COL.remedy)); m.transparent = true; const g = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 48), m); g.rotation.x = Math.PI / 2; g.position.set(x, Y + 0.005, z); root.add(g); return g; };
    // prescribed medicine: an amber pharmacy bottle with an "Rx" label
    const rx = new THREE.Group(); rx.position.set(-1.0, Y, -0.2); root.add(rx);
    const rxb = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.45, 32), new THREE.MeshStandardMaterial({ color: 0xc46a12, transparent: true, opacity: 0.8, roughness: 0.2 })); rxb.position.y = 0.225; rx.add(rxb);
    const rxc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32), M.plastic(0xffffff)); rxc.position.y = 0.5; rx.add(rxc);
    const rxl = new THREE.Mesh(new THREE.CylinderGeometry(0.172, 0.172, 0.22, 32, 1, true, -0.9, 1.8), new THREE.MeshBasicMaterial({ map: canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.font = 'bold 64px sans-serif'; g.fillText('℞', 16, 80); g.fillStyle = '#333'; g.font = '22px sans-serif'; g.fillText('Take as', 110, 52); g.fillText('prescribed', 110, 82); }) })); rxl.position.y = 0.22; rx.add(rxl);
    const pills = []; for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.06, 4, 8), M.plastic(i % 2 ? 0xffffff : 0xff7a59)); p.rotation.z = Math.PI / 2; p.position.set(0.3 + (i % 3) * 0.1, 0.03, 0.1 + Math.floor(i / 3) * 0.1); rx.add(p); pills.push(p); }
    const ringRx = glowRing(-0.85, -0.1, 0.45);
    // a vaccine vial and a syringe
    const vac = new THREE.Group(); vac.position.set(0.25, Y, -0.3); root.add(vac);
    const vv = vial(0.09, 0.26, 0xdfe9ff, 0x3b82f6); vac.add(vv);
    const syr = new THREE.Group(); syr.position.set(0.45, 0.06, 0.15); syr.rotation.y = -0.5; vac.add(syr);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 20), M.clear(0xe6f6ff, 0.5)); barrel.rotation.z = Math.PI / 2; syr.add(barrel);
    const plunger = box(0.3, 0.03, 0.03, M.plastic(0xffffff)); plunger.position.x = -0.33; syr.add(plunger);
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.22, 8), M.metal(0xdfe4ea)); needle.rotation.z = Math.PI / 2; needle.position.x = 0.36; syr.add(needle);
    const ringVac = glowRing(0.45, -0.2, 0.5);
    // a hospital sign
    const sign = new THREE.Group(); sign.position.set(1.25, Y, -0.6); sign.scale.setScalar(0.5); root.add(sign);
    { const _m = box(0.06, 1.5, 0.06, M.metal(0x8c95a3)); _m.position.set(0, 0.75, 0); sign.add(_m); }
    const plate = box(1.1, 0.7, 0.05, M.plastic(0xffffff)); plate.position.set(0, 1.7, 0); sign.add(plate);
    const cr1 = box(0.4, 0.12, 0.02, M.glow(0xe0474c)); cr1.position.set(-0.25, 1.75, 0.04); sign.add(cr1);
    const cr2 = box(0.12, 0.4, 0.02, M.glow(0xe0474c)); cr2.position.set(-0.25, 1.75, 0.04); sign.add(cr2);
    const num = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), new THREE.MeshBasicMaterial({ map: canvasTex(200, 160, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.font = 'bold 64px sans-serif'; g.textAlign = 'center'; g.fillText('112', w / 2, 70); g.fillText('108', w / 2, 140); }) })); num.position.set(0.25, 1.7, 0.03); sign.add(num);
    // the consultation clock on a stand behind the desk
    const clock = new THREE.Group(); clock.position.set(-0.25, Y + 0.42, -0.65); clock.scale.setScalar(0.75); root.add(clock);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 48), M.matte(0xf1e6c8)); face.rotation.x = Math.PI / 2; clock.add(face);
    clock.add(new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.03, 8, 48), M.metal(0x9aa0a8)));
    for (let i = 0; i < 12; i++) { const tk = box(0.02, 0.08, 0.01, M.matte(0x222222)); tk.position.set(Math.sin(i * Math.PI / 6) * 0.42, Math.cos(i * Math.PI / 6) * 0.42, 0.03); tk.rotation.z = -i * Math.PI / 6; clock.add(tk); }
    const sweep = new THREE.Mesh(new THREE.CircleGeometry(0.4, 48, Math.PI / 2, 0.01), new THREE.MeshBasicMaterial({ color: hex(COL.good), transparent: true, opacity: 0.5, side: THREE.DoubleSide })); sweep.position.z = 0.03; clock.add(sweep);
    const hand = box(0.025, 0.38, 0.01, M.matte(0x222222)); hand.geometry.translate(0, 0.19, 0); hand.position.z = 0.04; clock.add(hand);

    // --- the board
    let topic = 'medicines';
    const brd = board(root, 3.0, 1.67, 900, 500, (g, w, h) => {
      panelBg(g, w, h);
      if (topic === 'why') {
        text(g, 'How long a consultation lasts', 30, 52, { size: 30, bold: true });
        const B = [['Bangladesh, GP average', 0.8, COL.muted], ['India, GP average', 2, COL.bad], ['UK, GP average', 9.2, COL.muted], ['Sweden, GP average', 22.5, COL.muted], ['Homeopathy, first visit (often)', 60, COL.good]];
        B.forEach(([n, v, c], i) => { const y = 92 + i * 66; text(g, n, 30, y + 30, { size: 22, col: c, bold: i === 1 || i === 4 }); g.fillStyle = c; g.globalAlpha = 0.85; g.fillRect(420, y + 8, Math.max(4, (v / 60) * 380), 34); g.globalAlpha = 1; text(g, v < 1 ? '48 s' : `${v} min`, 430 + Math.max(4, (v / 60) * 380) - (v > 50 ? 110 : 0), y + 34, { size: 22, bold: true }); });
        text(g, 'GP data: Irving et al., BMJ Open 2017. Homeopathy: often 30–90 min; varies.', 30, h - 22, { size: 18, col: COL.muted });
        return;
      }
      const T = {
        medicines: ['Keep taking prescribed medicine', ['Insulin, inhalers, epilepsy and BP medicines must not be stopped suddenly.', 'Tell every doctor and practitioner everything you take.', 'Ask your doctor before adding or changing anything.'], COL.remedy],
        serious: ['Go to a qualified doctor quickly if…', ['High fever that won\'t settle (think dengue, malaria)', 'Trouble breathing, chest pain, fainting', 'A child who is floppy, drowsy or not drinking', 'Emergency: call 112, or 108 for an ambulance'], COL.bad],
        vaccines: ['Vaccines are not replaceable', ['Vaccines are tested in trials of thousands of people.', 'No homeopathic "prophylaxis" has been shown to protect like one.', 'India: polio-free since 2014; 220 crore+ COVID-19 vaccine doses.', 'Free under India\'s Universal Immunisation Programme.'], COL.cyan],
      }[topic];
      text(g, T[0], 30, 56, { size: 32, bold: true, col: T[2] });
      let y = 116; T[1].forEach((l) => { g.fillStyle = T[2]; g.beginPath(); g.arc(42, y - 8, 7, 0, 6.283); g.fill(); y = wrap(g, l, 62, y, w - 100, 32, { size: 24 }) + 22; });
    }, [1.9, 2.75, -1.3]);

    const lab = {
      medicines: [L('Prescribed medicine: don\'t stop it on your own', [-1.0, Y + 0.85, -0.2], 'remedy')],
      serious: [L('Serious illness: hospital, 112 or 108', [1.25, Y + 1.25, -0.6], 'bad')],
      vaccines: [L('Vaccine: tested, measured, protective', [0.35, Y + 0.7, -0.3], 'cyan')],
      why: [L('Time to talk, and feeling heard', [0, 2.0, 0.9], 'good')],
    };
    const fit = fitNarrow(stage, { pos: [0, 3.0, 7.0], target: [0, 1.8, 0] });
    let t = 0, k = 0, cur = '';
    return compactReadout(stage, {
      update(dt, s) {
        dt = Math.max(0, dt); t += dt; k += dt;
        brd.mesh.position.set(inReel() ? 0 : 1.9, inReel() ? 3.2 : 2.75, -1.3);
        if (s.topic !== cur) { cur = s.topic; topic = cur; k = 0; brd.redraw(); }
        const narrow = fit(), on = s.labels && !inReel() && !narrow;
        Object.entries(lab).forEach(([n, ls]) => ls.forEach((l) => { l.visible = on && n === cur; }));
        const pulse = 0.55 + 0.35 * Math.sin(t * 3);
        ringRx.visible = cur === 'medicines'; ringRx.material.opacity = pulse;
        ringVac.visible = cur === 'vaccines'; ringVac.material.opacity = pulse;
        [cr1, cr2].forEach((c) => c.material.color.setScalar(cur === 'serious' ? 0.6 + 0.4 * pulse : 0.5).multiply(new THREE.Color(0xe0474c)));
        // the clock: in "why", the hand sweeps an hour; otherwise it sits at 2 minutes
        const mins = cur === 'why' ? Math.min(60, k * 8) : 2;
        hand.rotation.z = -(mins / 60) * Math.PI * 2;
        sweep.geometry.dispose(); sweep.geometry = new THREE.CircleGeometry(0.4, 48, Math.PI / 2 - (mins / 60) * Math.PI * 2, Math.max(0.01, (mins / 60) * Math.PI * 2));
        pat.head.rotation.x = cur === 'why' ? 0.12 * Math.sin(t * 1.5) : 0;
        doc.head.rotation.y = cur === 'why' ? 0.1 * Math.sin(t * 0.8) : 0;
        syr.position.x = 0.45 + (cur === 'vaccines' ? 0.03 * Math.sin(t * 2) : 0);
      },
      readout: (s) => {
        const R = {
          medicines: [['Never', 'stop prescribed medicine on your own'], ['Always', 'tell every practitioner what you take'], ['Examples', 'insulin, inhalers, BP, epilepsy'], ['Ask', 'your doctor before any change']],
          serious: [['Warning signs', 'high fever, breathing trouble'], ['In children', 'floppy, drowsy, not drinking'], ['Emergency', 'call 112, or 108 (ambulance)'], ['Biggest risk', 'delaying effective treatment']],
          vaccines: [['Vaccines', 'proven in large trials'], ['Homeopathic prophylaxis', 'not shown to protect'], ['India, polio', 'free of it since 2014'], ['India, COVID-19', '220 crore+ vaccine doses']],
          why: [['Average GP visit, India', 'about 2 minutes'], ['Homeopathy first visit', 'often 30–90 minutes'], ['Other reasons', 'gentle pills, cost, tradition'], ['What it shows', 'people want to be heard']],
        }[s.topic];
        return `<div class="big">${TOPICS[s.topic].title}</div>${rows(R)}<small>This page explains; it does not advise. For your own health, see a qualified doctor.</small>`;
      },
    });
  },
};

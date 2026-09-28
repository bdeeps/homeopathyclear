// Chapter 1: where homeopathy came from. Hahnemann's desk around 1790–1810: cinchona bark, a mortar,
// a candle, the Organon open at §1, and the harsh medicine of his day (a bleeding bowl and lancet).
// A timeline board behind the desk follows the moment you pick, ending with homeopathy in India.
// Sources:
//  - Samuel Hahnemann, born 10 April 1755 in Meissen, Saxony; died 2 July 1843 in Paris (Britannica
//    "Samuel Hahnemann"; Wikipedia). He left practice around 1784, calling the medicine of the day
//    harmful, and earned a living translating.
//  - 1790: translating William Cullen's "A Treatise of the Materia Medica", he disagreed with Cullen's
//    explanation of why cinchona bark treats intermittent fever (malaria), took the bark himself and
//    reported fever-like symptoms (Hahnemann's footnote in his translation, 1790; Britannica).
//    Later repeats did not reliably reproduce this; one suggestion is that he was hypersensitive to
//    the bark (hedged; see Wikipedia "Homeopathy" history).
//  - Quinine was isolated from the bark by Pelletier and Caventou in 1820 (Britannica "quinine"); it
//    kills the malaria parasite, which is ordinary pharmacology.
//  - 1796: "Essay on a New Principle for Ascertaining the Curative Powers of Drugs", Hufeland's
//    Journal; 1807: first use of the word "homöopathisch"; 1810: "Organon der rationellen
//    Heilkunde" (1st ed.); 6th edition written 1842, published 1921 (Wikipedia "Organon of the
//    Healing Art"). §1 (Dudgeon's translation, public domain): "The physician's high and only mission
//    is to restore the sick to health".
//  - Medicine of the day: bloodletting, purging with calomel (mercury chloride), blistering. George
//    Washington was bled of an estimated 2.4 litres (about 40% of his blood) in about 12 hours
//    before he died in December 1799 (Vadakan, Permanente Journal 9:76, 2005; estimates vary).
//  - India: J. M. Honigberger reached Lahore in 1829 and returned in 1838–39 at Maharaja Ranjit
//    Singh's request; accounts say he treated the Maharaja (Wikipedia "Johann Martin Honigberger";
//    Directorate of AYUSH Delhi, "Origin and growth of homeopathy in India"). Bengal: Rajendralal
//    Dutta, Mahendralal Sircar (1860s); the Calcutta Homoeopathic Medical College, founded 1881 by
//    P. C. Majumdar and D. N. Roy (same). Homoeopathy Central Council Act 1973; CCRH constituted
//    30 March 1978 (ccrhindia.ayush.gov.in); Ministry of AYUSH formed 9 November 2014; National
//    Commission for Homoeopathy Act 2020, in force 5 July 2021 (nch.org.in).
//  - Numbers: more than 3.45 lakh registered homeopathy practitioners, 277 hospitals and 8,593
//    dispensaries (Ministry of Ayush, April 2025, as reported by PIB and news agencies); about 290
//    teaching institutions (NCH chairperson, World Homoeopathy Day 2026, PIB). Whether India has the
//    most practitioners in the world is widely stated but hard to verify, so it is hedged.
import { THREE, M, box, sphere, beam, clamp } from '../kit.js';
import { COL, hex, tint, inReel, fitNarrow, compactReadout, rows, board, panelBg, text, wrap, openBook, book, table, canvasTex } from '../homeo.js';

const MOMENTS = {
  bark: { label: '1790: the bark', year: 1790 },
  bleed: { label: 'Medicine of his day', year: 1799 },
  organon: { label: '1810: the Organon', year: 1810 },
  india: { label: 'India', year: 1881 },
};
const VIEW = { pos: [0.6, 3.5, 7.6], target: [-0.45, 1.95, 0] };

export default {
  id: 'origins',
  short: 'Where it came from',
  title: 'A doctor who wanted gentler medicine',
  subtitle: 'Samuel Hahnemann, a dose of cinchona bark in 1790, the Organon of 1810, and how homeopathy grew in India.',
  view: VIEW,
  learn: `<p><b>Homeopathy</b> is a system of medicine started in Germany by a doctor named <b>Samuel Hahnemann</b> (1755–1843). It is used by millions of families today, especially in India. To understand it, start with the medicine of his time.</p>
    <p>Around 1800, doctors often <b>drained blood</b> (bloodletting), gave strong purges made with mercury, and raised blisters on the skin. These treatments often did more harm than good. Hahnemann was so unhappy that he stopped practising and earned his living translating medical books.</p>
    <p>In <b>1790</b>, while translating a book by the Scottish doctor William Cullen, he doubted Cullen's reason for why <b>cinchona bark</b> treated malaria fever. He took the bark himself and reported fever-like symptoms. From this he came to believe that a substance that causes symptoms in a healthy person can cure similar symptoms in a sick one. He published the idea in <b>1796</b>, coined the word "homeopathy" (Greek for "similar suffering") by 1807, and set out the full system in his book the <b>Organon</b> in <b>1810</b>.</p>
    <p>Two notes from science. Others who repeated the bark test did not reliably get the same symptoms. And the bark really does fight malaria, because it contains <b>quinine</b>, found in 1820, which kills the malaria parasite in the ordinary way drugs work.</p>
    <p>Homeopathy reached <b>India</b> in the 1830s, when the doctor J. M. Honigberger worked at Maharaja Ranjit Singh's court in Lahore, and it grew fast in <b>Bengal</b>. Today it is one of India's official <b>AYUSH</b> systems, with its own degree (<b>BHMS</b>), research council (<b>CCRH</b>) and regulator (<b>NCH</b>), and more than <b>3.4 lakh</b> registered practitioners. Sister boxes: AyurvedaClear, UnaniClear and MedicineClear.</p>
    <p class="tip"><b>Try it:</b> step through the four moments and watch the timeline. Click the bark, the bowl or the book.</p>`,
  terms: [
    { t: 'Homeopathy', d: 'A system of medicine founded by Samuel Hahnemann, based on "like cures like" and very dilute remedies.' },
    { t: 'Cinchona bark', d: 'Bark of a South American tree. Its quinine treats malaria; it was the starting point of Hahnemann\'s idea.' },
    { t: 'Bloodletting', d: 'Draining blood to treat illness. Common for 2,000 years, it usually did harm and was abandoned.' },
    { t: 'Organon', d: 'Hahnemann\'s book setting out homeopathy (1810; the 6th edition was published in 1921).' },
    { t: 'AYUSH', d: 'India\'s Ministry for Ayurveda, Yoga and Naturopathy, Unani, Siddha, Sowa-Rigpa and Homoeopathy (2014).' },
    { t: 'BHMS', d: 'Bachelor of Homoeopathic Medicine and Surgery, India\'s 5½-year homeopathy degree, including a year of internship.' },
  ],
  defaults: { moment: 'bark', labels: true },
  controls: [
    { key: 'moment', type: 'seg', label: 'Moment', options: Object.entries(MOMENTS).map(([v, m]) => ({ v, label: m.label })) },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  quiz: [
    { q: 'What did Hahnemann do with cinchona bark in 1790?', options: ['Planted it in Germany', 'Took it himself while healthy and noted his symptoms', 'Boiled it to make quinine', 'Banned it'], answer: 1, why: 'He took the bark while healthy and reported fever-like symptoms. That test led to his idea of "like cures like".' },
    { q: 'Why does cinchona bark really help against malaria?', options: ['Because it causes similar symptoms', 'It contains quinine, which kills the malaria parasite', 'Because it is bitter', 'It doesn\'t help at all'], answer: 1, why: 'Quinine, isolated in 1820, attacks the malaria parasite directly. That is how ordinary drugs work.' },
    { q: 'Which of these was common medicine around 1800?', options: ['Antibiotics', 'Bloodletting and mercury purges', 'Vaccines for flu', 'X-rays'], answer: 1, why: 'Doctors drained blood and gave harsh purges. Hahnemann rejected them as harmful, which helps explain why his gentle method became popular.' },
  ],
  reel: [
    { ms: 5200, caption: 'In 1790 a German doctor, Samuel Hahnemann, took cinchona bark while healthy to see what it did.', set: { moment: 'bark', labels: false }, view: { pos: [1.2, 2.9, 3.9], target: [0.6, 1.2, 0] }, spin: 0.3 },
    { ms: 5000, caption: 'Doctors then drained blood and gave mercury purges. His gentler method spread fast, including to India.', set: { moment: 'india', labels: false }, view: { pos: [0, 3.4, 6.2], target: [0, 2.0, 0] }, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const desk = table(4.2, 1.9, 0.9, 0x4d3525); root.add(desk);
    const Y = desk.top;
    const picks = {};

    // --- the Organon, open at §1
    const pg = (lines, title) => canvasTex(512, 640, (g, w, h) => {
      g.fillStyle = '#f1e6c8'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#3a2a1c'; g.textAlign = 'center';
      if (title) { g.font = 'bold 44px Georgia, serif'; g.fillText('ORGANON', w / 2, 150); g.font = '30px Georgia, serif'; g.fillText('der rationellen', w / 2, 210); g.fillText('Heilkunde', w / 2, 250); g.font = '26px Georgia, serif'; g.fillText('von', w / 2, 320); g.fillText('Samuel Hahnemann', w / 2, 360); g.fillText('Dresden, 1810', w / 2, 480); }
      else { g.font = 'bold 34px Georgia, serif'; g.fillText('§ 1', w / 2, 110); g.font = '28px Georgia, serif'; lines.forEach((l, i) => g.fillText(l, w / 2, 180 + i * 44)); }
      g.textAlign = 'left';
    });
    const organon = openBook(1.5, 0.95, pg(null, true), pg(['The physician\'s high', 'and only mission is', 'to restore the sick', 'to health, to cure,', 'as it is termed.', '', '(Dudgeon\'s English', 'translation)'])); organon.position.set(-0.55, Y, 0.1); organon.rotation.y = 0.05; root.add(organon);
    picks.organon = organon;

    // --- cinchona bark: curled quills of reddish-brown bark
    const barkG = new THREE.Group(); barkG.position.set(1.15, Y, 0.25); root.add(barkG);
    const barkMat = new THREE.MeshStandardMaterial({ color: 0x8a4a2c, roughness: 0.95, side: THREE.DoubleSide });
    const barkIn = new THREE.MeshStandardMaterial({ color: 0xc98a5a, roughness: 0.9, side: THREE.BackSide });
    for (let i = 0; i < 5; i++) {
      const len = 0.55 + (i % 3) * 0.12, r = 0.05 + (i % 2) * 0.015;
      const q = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20, 1, true, 0, Math.PI * 1.6), barkMat);
      const qi = new THREE.Mesh(q.geometry, barkIn); q.add(qi);
      q.rotation.z = Math.PI / 2; q.rotation.y = -0.4 + i * 0.35; q.position.set((i - 2) * 0.07, r + (i === 4 ? 0.1 : 0), (i - 2) * 0.12); q.castShadow = true;
      barkG.add(q);
    }
    // a tiny paper of ground bark and a spoon
    const powder = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.07, 24), M.matte(0xa9663d)); powder.position.set(0.52, 0.035, -0.25); barkG.add(powder);
    const paper = box(0.42, 0.005, 0.42, M.matte(0xf1e6c8)); paper.position.set(0.52, 0.003, -0.25); paper.rotation.y = 0.3; barkG.add(paper);
    picks.bark = barkG;

    // --- mortar and pestle
    const mortar = new THREE.Mesh(new THREE.LatheGeometry([[0.0, 0], [0.2, 0], [0.24, 0.05], [0.26, 0.22], [0.22, 0.24], [0.2, 0.08], [0.0, 0.07]].map(([x, y]) => new THREE.Vector2(x, y)), 40), M.matte(0xd9d4c7));
    mortar.position.set(1.55, Y, -0.55); mortar.castShadow = true; root.add(mortar);
    root.add(Object.assign(beam([1.55, Y + 0.12, -0.55], [1.72, Y + 0.5, -0.45], 0.035, M.matte(0xcfc8b8)), {}));

    // --- a candle
    const candle = new THREE.Group(); candle.position.set(-1.7, Y, -0.55); root.add(candle);
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.05, 32), M.metal(0xc8a25a)); holder.position.y = 0.025; candle.add(holder);
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 20), M.matte(0xf3ead2)); wax.position.y = 0.3; candle.add(wax);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), M.glow(0xffc46b)); flame.scale.set(1, 1.9, 1); flame.position.y = 0.62; candle.add(flame);
    const glow = new THREE.PointLight(0xffb36b, 1.2, 4, 2); glow.position.y = 0.7; candle.add(glow);

    // --- medicine of the day: a pewter bleeding bowl with blood, and a lancet
    const bleed = new THREE.Group(); bleed.position.set(-1.45, Y, 0.45); root.add(bleed);
    const bowl = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.22, 0], [0.3, 0.1], [0.32, 0.13], [0.31, 0.14], [0.28, 0.11], [0.2, 0.02], [0, 0.02]].map(([x, y]) => new THREE.Vector2(x, y)), 40), M.metal(0x9aa0a8, { roughness: 0.45 }));
    bowl.castShadow = true; bleed.add(bowl);
    const handle = box(0.2, 0.015, 0.12, M.metal(0x9aa0a8)); handle.position.set(0.38, 0.12, 0); bleed.add(handle);
    const blood = new THREE.Mesh(new THREE.CircleGeometry(0.25, 32), new THREE.MeshStandardMaterial({ color: 0x7a0c14, roughness: 0.2 })); blood.rotation.x = -Math.PI / 2; blood.position.y = 0.08; bleed.add(blood);
    const lancet = new THREE.Group(); lancet.position.set(0.1, 0.01, 0.42); lancet.rotation.y = 0.6; bleed.add(lancet);
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.22, 4), M.metal(0xe0e4ea)); blade.rotation.z = Math.PI / 2; blade.position.x = 0.2; lancet.add(blade);
    const shell = box(0.26, 0.02, 0.06, M.matte(0xe8dcc0)); lancet.add(shell);
    // a stoneware jar of calomel (mercury chloride purges)
    const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.3, 24), M.matte(0x3f5f7a)); jar.position.set(-0.05, 0.15, -0.35); bleed.add(jar);
    const jl = box(0.16, 0.08, 0.005, M.matte(0xf1e6c8)); jl.position.set(-0.05, 0.16, -0.2); bleed.add(jl);
    picks.bleed = bleed;
    // a stack of books he translated
    const stack = new THREE.Group(); stack.position.set(0.4, Y, -0.6); root.add(stack);
    [0x6b3a2a, 0x2f4a3a, 0x3b3552].forEach((c, i) => { const b = book(0.9 - i * 0.08, 0.6, 0.12, c); b.position.y = i * 0.12; b.rotation.y = (i - 1) * 0.12; stack.add(b); });

    // --- glowing rings that mark what each moment is about
    const ringMat = M.glow(hex(COL.remedy)); ringMat.transparent = true;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 8, 64), ringMat); ring.rotation.x = Math.PI / 2; root.add(ring);
    const RING = { bark: [1.2, 0.72], bleed: [-1.4, 0.6], organon: [-0.55, 0.95], india: [0, 0] };
    const RZ = { bark: 0.2, bleed: 0.4, organon: 0.1, india: 0 };

    // --- the timeline / India board behind the desk
    let mom = 'bark';
    const EV = [[1755, 'Hahnemann born'], [1790, 'Cinchona test'], [1796, 'First essay'], [1810, 'Organon'], [1839, 'Honigberger, Lahore'], [1881, 'Calcutta college'], [1921, '6th Organon'], [1973, 'Central Council Act'], [1978, 'CCRH'], [2014, 'Ministry of AYUSH'], [2020, 'NCH Act']];
    const brd = board(root, 4.4, 1.65, 1150, 430, (g, w, h) => {
      panelBg(g, w, h);
      const x0 = 60, x1 = w - 50, X = (y) => x0 + ((y - 1750) / (2030 - 1750)) * (x1 - x0), ly = 250;
      if (mom === 'india') {
        text(g, 'Homeopathy in India today', 34, 52, { size: 32, bold: true });
        const cards = [['3.45 lakh+', 'registered practitioners'], ['about 290', 'teaching institutions'], ['277', 'homeopathy hospitals'], ['8,593', 'dispensaries']];
        cards.forEach(([a, b], i) => { const x = 34 + i * 275; g.fillStyle = 'rgba(255,181,71,.12)'; g.fillRect(x, 80, 255, 120); text(g, a, x + 16, 138, { size: 40, bold: true, col: COL.remedy }); text(g, b, x + 16, 178, { size: 20, col: COL.muted }); });
        wrap(g, 'Regulated by the National Commission for Homoeopathy (NCH, 2020). Research: the Central Council for Research in Homoeopathy (CCRH, 1978). Degree: BHMS. Part of the Ministry of AYUSH (2014).', 34, 250, w - 68, 30, { size: 22, col: COL.text });
        text(g, 'Sources: Ministry of Ayush (April 2025) and NCH (2026), via PIB. Counts are official registrations.', 34, 395, { size: 18, col: COL.muted });
        return;
      }
      text(g, 'Homeopathy: a timeline', 34, 52, { size: 32, bold: true });
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, ly); g.lineTo(x1, ly); g.stroke();
      [1750, 1800, 1850, 1900, 1950, 2000].forEach((y) => text(g, String(y), X(y), ly + 44, { size: 18, col: COL.muted, align: 'center' }));
      const hot = MOMENTS[mom].year;
      EV.forEach(([y, n], i) => {
        const on = Math.abs(y - hot) < 6 || (mom === 'organon' && y === 1810) || (mom === 'bark' && y === 1790);
        const up = i % 2 === 0, yy = up ? ly - 50 - (i % 4 === 0 ? 50 : 0) : ly + 80 + (i % 4 === 1 ? 50 : 0);
        g.strokeStyle = on ? COL.remedy : 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(y), ly); g.lineTo(X(y), yy + (up ? 8 : -24)); g.stroke();
        g.fillStyle = on ? COL.remedy : '#8fa0b8'; g.beginPath(); g.arc(X(y), ly, on ? 10 : 6, 0, Math.PI * 2); g.fill();
        text(g, `${y} ${n}`, clamp(X(y), 90, w - 110), yy, { size: on ? 22 : 18, bold: on, col: on ? COL.remedy : 'rgba(255,255,255,.75)', align: 'center' });
      });
      if (mom === 'bleed') text(g, '1799: George Washington is bled of an estimated 2.4 litres in 12 hours, and dies.', 34, 405, { size: 20, col: COL.bad });
    }, [1.45, 2.55, -1.35]);
    brd.mesh.rotation.x = -0.08;

    const L = (h, p, c) => tint(stage.label(h, p, root), c);
    const lab = {
      bark: L('Cinchona bark: contains quinine', [1.25, Y + 0.55, 0.3], 'remedy'),
      bleed: L('Bleeding bowl and lancet', [-1.45, Y + 0.55, 0.5], 'bad'),
      calomel: L('Mercury purge (calomel)', [-1.55, Y + 0.6, -0.1], 'bad'),
      organon: L('The Organon, 1810', [-0.55, Y + 0.45, 0.1], 'gold'),
      mortar: L('Mortar for grinding', [1.6, Y + 0.7, -0.6], 'muted'),
    };
    const fit = fitNarrow(stage, { pos: [0.3, 3.3, 6.2], target: [0.3, 1.7, 0] });
    stage.pickables.push(barkG, bleed, organon);
    let t = 0, shown = '', rk = 0;
    const toastFor = { bark: 'Quinine, taken from cinchona bark in 1820, still treats some malaria today. It works by killing the parasite.', bleed: 'Bloodletting was used for over 2,000 years. Careful comparisons in the 1800s, like Pierre Louis\'s counts in Paris, helped show it did not help.', organon: 'Hahnemann revised the Organon six times. The 6th edition, finished in 1842, was only published in 1921.' };
    return compactReadout(stage, {
      pick(o) {
        const inG = (g) => { let p = o; while (p) { if (p === g) return true; p = p.parent; } return false; };
        const k = inG(barkG) ? 'bark' : inG(bleed) ? 'bleed' : 'organon';
        import('../ui.js').then(({ toast }) => toast(toastFor[k]));
      },
      update(dt, s) {
        dt = Math.max(0, dt); t += dt;
        if (s.moment !== mom) { mom = s.moment; brd.redraw(); }
        if (shown !== mom) { shown = mom; rk = 0; }
        rk = Math.min(1, rk + dt * 2.5);
        const [x, r] = RING[mom];
        ring.visible = mom !== 'india';
        ring.position.set(x, Y + 0.01, RZ[mom]); ring.scale.setScalar(r * (0.9 + 0.1 * rk) * (1 + 0.04 * Math.sin(t * 3)));
        ringMat.opacity = rk * (0.6 + 0.3 * Math.sin(t * 3));
        flame.scale.set(1 + 0.08 * Math.sin(t * 17), 1.9 + 0.2 * Math.sin(t * 11), 1);
        glow.intensity = 1.1 + 0.15 * Math.sin(t * 13);
        const narrow = fit(), on = s.labels && !inReel() && !narrow;
        lab.bark.visible = on && (mom === 'bark' || mom === 'india');
        lab.mortar.visible = on && mom === 'bark';
        lab.bleed.visible = lab.calomel.visible = on && mom === 'bleed';
        lab.organon.visible = on && (mom === 'organon' || mom === 'india');
      },
      readout: (s) => {
        const R = {
          bark: ['1790: a test on himself', [['Who', 'Samuel Hahnemann, 35'], ['What he took', 'cinchona bark, while healthy'], ['What he reported', 'fever-like symptoms'], ['The idea it gave him', '"like cures like"'], ['Why the bark works on malaria', 'quinine kills the parasite']], 'Others who repeated the test did not reliably get the same symptoms.'],
          bleed: ['Medicine around 1800', [['Bloodletting', 'draining blood from a vein'], ['Purges', 'calomel, a mercury salt'], ['Blistering', 'burning the skin on purpose'], ['Washington, 1799', 'about 2.4 L of blood taken'], ['Hahnemann\'s view', 'these harm the patient']], 'Gentle remedies that did no harm looked good next to treatments like these.'],
          organon: ['1810: the Organon', [['Full title', 'Organon der rationellen Heilkunde'], ['First essay on the idea', '1796'], ['Word "homeopathy"', 'by 1807'], ['Editions', '6; the last printed in 1921'], ['Later book', 'Chronic Diseases, 1828']], 'The Organon is still the core text taught in BHMS courses.'],
          india: ['Homeopathy in India', [['Arrived', '1830s, Lahore (Honigberger)'], ['First big college', 'Calcutta, 1881'], ['Registered practitioners', 'more than 3.45 lakh'], ['Research council', 'CCRH, 1978'], ['Regulator', 'NCH (2020 Act)']], 'India has one of the largest numbers of homeopathy practitioners in the world, by many estimates the largest.'],
        }[s.moment];
        return `<div class="big">${R[0]}</div>${rows(R[1])}<small>${R[2]}</small>`;
      },
    });
  },
};

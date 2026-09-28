// Chapter 5: what the evidence says. Four views:
//  - a fair-test simulator: a crowd of patients, with or without a comparison (placebo) group, with
//    or without blinding. You set how many get better anyway and how big a true extra effect the
//    remedy has; the simulator draws the result by chance (seeded) and says whether a real
//    difference was found (95% confidence interval of the difference in proportions, normal
//    approximation, se = √(p₁q₁/n + p₀q₀/n)).
//    Unblinded bias: in trials with subjective outcomes, lack of blinding exaggerated treatment effects
//    by about a third on average: ratio of odds ratios 0.75 (Wood et al., BMJ 336:601, 2008). Here, if
//    blinding is off, the treated group's odds of reporting improvement are multiplied by 1/0.75.
//  - regression to the mean: 3,000 simulated people whose daily symptom score wanders around their
//    usual level (AR(1): x' = μ + 0.85(x − μ) + noise). Each "visits a practitioner" on the first day
//    the score reaches 8 of 10. With no treatment at all, the average after the visit falls back.
//  - the big reviews, and dissent, in neutral words:
//    NHMRC (Australia), "Evidence on the effectiveness of homeopathy for treating health
//    conditions", March 2015: 176 studies, 61 conditions; no health condition with reliable evidence
//    that homeopathy was effective. Homeopathy groups criticised its methods; NHMRC stood by it.
//    Shang et al., Lancet 366:726 (27 August 2005): 110 homeopathy and 110 matched conventional trials;
//    in the larger, better trials, homeopathy's effects were compatible with placebo. Critics
//    questioned which trials were chosen.
//    Mathie et al., Systematic Reviews 3:142 (2014): individualised homeopathy "may have small,
//    specific treatment effects", but the evidence was of low or unclear quality.
//    UK House of Commons Science and Technology Committee, Evidence Check 2 (February 2010).
//    NHS England: consultation July 2017, guidance November 2017 to stop routine prescribing; the High
//    Court rejected a challenge by the British Homeopathic Association (June 2018).
//    EASAC (European Academies' Science Advisory Council), statement, September 2017.
//    CCRH (India) runs clinical research and publishes the Indian Journal of Research in Homoeopathy;
//    it reports positive results for several conditions (ccrhindia.ayush.gov.in, "Clinical Research").
//    Most such studies are small, often open-label, and not independently replicated.
//  - safety: Posadzki, Alotaibi & Ernst, Int J Clin Pract 66:1178 (2012): 38 reports, 1,159 patients
//    with adverse effects, 4 deaths, some from using homeopathy instead of effective treatment (its
//    methods were disputed in the same journal). FDA, 27 January 2017: lab analysis found
//    inconsistent, sometimes far higher than labelled, amounts of belladonna in some homeopathic
//    teething tablets; recalled in April 2017. WHO, August 2009: does not recommend homeopathy for
//    HIV, TB, malaria, influenza or infant diarrhoea.
import { THREE, M, box, clamp, lerp, smooth } from '../kit.js';
import { COL, hex, tint, inReel, fitNarrow, compactReadout, rows, board, panelBg, text, wrap, axes, polyline, prng, gauss, TAU } from '../homeo.js';

const MODES = {
  trial: { label: 'Fair test', title: 'A fair test' },
  regress: { label: 'Better anyway', title: 'Why people feel better anyway' },
  reviews: { label: 'The big reviews', title: 'What the big reviews found' },
  safety: { label: 'Safety', title: 'Is it safe?' },
};
const CAPG = 100;
const VIEW = { pos: [0.3, 5.4, 9.8], target: [-1.0, 1.9, 0] };

// One run of the trial. Returns counts drawn by chance.
export function runTrial({ n, anyway, effect, fair, blind, seed }) {
  const r = prng(seed), p0 = anyway / 100;
  let p1 = clamp(p0 + effect / 100, 0, 1);
  if (!blind) { const o = (p1 / Math.max(1e-6, 1 - p1)) / 0.75; p1 = o / (1 + o); }   // Wood et al. 2008
  const draw = (p, m) => Array.from({ length: m }, () => r() < p);
  const treat = draw(p1, n), ctrl = fair ? draw(p0, n) : [];
  const a = treat.filter(Boolean).length / n, b = fair ? ctrl.filter(Boolean).length / n : 0;
  const se = Math.sqrt((a * (1 - a)) / n + (b * (1 - b)) / n), diff = a - b;
  return { treat, ctrl, a, b, diff, lo: diff - 1.96 * se, hi: diff + 1.96 * se };
}
// Regression to the mean: average score around the day of the visit (day 0), no treatment at all.
function regression() {
  const r = prng(11), N = 3000, mu = 5, phi = 0.85, sd = 1.6 * Math.sqrt(1 - phi * phi), D0 = 8, before = 6, after = 21;
  const sum = new Array(before + after + 1).fill(0); let cnt = 0;
  for (let i = 0; i < N; i++) {
    const m = mu + gauss(r) * 0.6; let x = m + gauss(r) * 1.6; const hist = [];
    for (let d = 0; d < 400; d++) {
      x = m + phi * (x - m) + gauss(r) * sd; hist.push(clamp(x, 0, 10));
      if (d > before && x >= D0) {
        for (let k = 1; k <= after; k++) { x = m + phi * (x - m) + gauss(r) * sd; hist.push(clamp(x, 0, 10)); }
        const h0 = hist.length - after - 1;
        for (let k = -before; k <= after; k++) sum[k + before] += hist[h0 + k];
        cnt++; break;
      }
    }
  }
  return { days: sum.map((v, i) => [i - before, v / cnt]), cnt, mu };
}

export default {
  id: 'evidence',
  short: 'The evidence',
  title: 'What fair tests show',
  subtitle: 'A trial simulator, why people feel better anyway, what the big reviews found, and safety.',
  view: VIEW,
  learn: `<p>People often say, "I took it and I got better." That is real, and it matters. But many illnesses get better <b>on their own</b>, and a caring consultation can make us feel better too (the <b>placebo effect</b>). To know whether a remedy adds anything, we need a <b>fair test</b>.</p>
    <p>A fair test compares two groups chosen <b>at random</b>: one gets the remedy, the other an identical-looking dummy pill (a <b>placebo</b>). Ideally it is <b>double-blind</b>: neither patients nor doctors know who got which, so hopes can't tip the result. Only the <b>difference</b> between the groups belongs to the remedy. MedicineClear has a full trial simulator.</p>
    <p>There's a sneaky effect too: <b>regression to the mean</b>. People visit a healer on their worst days. Symptoms go up and down, so after a very bad day the next days are usually better, whatever you take.</p>
    <p><b>What the big reviews found.</b> Australia's <b>NHMRC</b> (2015) looked at 176 studies across 61 conditions and found <b>no health condition</b> with reliable evidence that homeopathy works better than placebo. A 2005 <i>Lancet</i> analysis by Shang and colleagues found that the larger, better trials showed effects compatible with placebo. <b>NHS England</b> stopped routinely funding it in 2017. Homeopaths dispute these reviews: they argue that individualised treatment is hard to test this way, and one 2014 review suggested small effects, though from low-quality evidence. India's <b>CCRH</b> runs its own trials and reports positive results; most are small and have not been repeated independently.</p>
    <p><b>Safety.</b> A 30C remedy contains essentially nothing, so the pill itself poses little direct risk. The real dangers are <b>delaying effective treatment</b> for serious illness (the WHO warns against homeopathy for HIV, TB, malaria, flu and infant diarrhoea), and low-dilution or badly made products: in 2017 the US FDA found far too much toxic belladonna in some homeopathic teething tablets.</p>
    <p class="tip"><b>Try it:</b> run the trial with no comparison group: most people "got better". Now switch to a fair test with a true effect of 0: both groups improve about equally. Turn blinding off and watch a fake difference appear. Then open "Better anyway".</p>`,
  terms: [
    { t: 'Placebo', d: 'A dummy treatment that looks like the real one. Feeling better after a placebo is called the placebo effect.' },
    { t: 'Randomised controlled trial', d: 'A test where patients are split by chance into a treatment group and a comparison group.' },
    { t: 'Double-blind', d: 'Neither patients nor researchers know who got the real treatment until the end.' },
    { t: 'Regression to the mean', d: 'After an unusually bad day, the next ones tend to be closer to normal, with or without treatment.' },
    { t: 'Systematic review', d: 'A study that gathers and weighs all the good trials on a question.' },
    { t: 'Confidence interval', d: 'The range where the true difference probably lies. If it includes zero, chance could explain the result.' },
  ],
  defaults: { mode: 'trial', fair: true, blind: true, anyway: 50, effect: 0, n: 100, seed: 11, labels: true },
  controls: [
    { key: 'mode', type: 'seg', label: 'Show', options: Object.entries(MODES).map(([v, m]) => ({ v, label: m.label })) },
    { key: 'fair', type: 'toggle', label: 'Randomised comparison (placebo) group', hint: 'Off: everyone takes the remedy and we just count who got better.' },
    { key: 'blind', type: 'toggle', label: 'Blinded' },
    { key: 'anyway', type: 'range', label: 'Get better anyway (your guess)', min: 0, max: 80, step: 1, ends: ['0%', '80%'], fmt: (v) => `${Math.round(v)}% of people` },
    { key: 'effect', type: 'range', label: 'True extra effect of the remedy', min: 0, max: 30, step: 1, ends: ['none', '+30 points'], fmt: (v) => (v ? `+${Math.round(v)} percentage points` : 'none') },
    { key: 'n', type: 'log', label: 'Patients per group', min: 10, max: 1000, ends: ['10', '1,000'], fmt: (v) => Math.round(v).toLocaleString('en-IN') },
    { key: 'go', type: 'buttons', label: 'Trial', items: [{ label: 'Run it again', act: (s) => { s.seed = (s.seed * 7 + 3) % 9973; } }] },
    { key: 'labels', type: 'toggle', label: 'Labels' },
  ],
  onChange(s, key) { if (['fair', 'blind', 'anyway', 'effect', 'n', 'action'].includes(key)) s.mode = 'trial'; },
  quiz: [
    { q: 'Why does a fair test need a placebo group?', options: ['To save money', 'Because many people get better anyway, and only the difference shows the remedy\'s own effect', 'Placebos are stronger', 'To make the trial longer'], answer: 1, why: 'Without a comparison group you can\'t separate the remedy from natural recovery, regression to the mean and the placebo effect.' },
    { q: 'What did Australia\'s NHMRC review (2015) conclude?', options: ['Homeopathy cures colds', 'No health condition had reliable evidence that homeopathy works better than placebo', 'Homeopathy is dangerous in every dose', 'It did not look at any studies'], answer: 1, why: 'It reviewed 176 studies on 61 conditions and found no reliable evidence of effectiveness for any of them.' },
    { q: 'What is the biggest safety risk with highly diluted remedies?', options: ['Overdose', 'Delaying effective treatment for a serious illness', 'Allergy to water', 'They explode'], answer: 1, why: 'The pills contain essentially nothing, but using them instead of proven treatment for serious illness can be dangerous.' },
  ],
  reel: [
    { ms: 5200, caption: 'In a fair test, a remedy with no real effect helps just as many people as a dummy pill.', set: { mode: 'trial', fair: true, blind: true, anyway: 50, effect: 0, n: 100, seed: 11, labels: false }, view: { pos: [0, 4.2, 7.8], target: [0, 2.1, 0] }, spin: 0 },
    { ms: 5200, caption: 'Australia\'s 2015 review of 176 studies found no condition where homeopathy reliably beat placebo.', set: { mode: 'reviews', labels: false }, view: { pos: [0, 3.2, 6.4], target: [0, 1.7, 0.8] }, spin: 0 },
  ],

  build({ stage }) {
    const root = new THREE.Group(); stage.root.add(root);
    const L = (h, p, c, parent = root) => tint(stage.label(h, p, parent), c);
    const trialG = new THREE.Group(); root.add(trialG);

    // --- two mats of people (instanced bodies and heads)
    const matL = box(4.2, 0.04, 3.2, M.matte(0x2b3039)); matL.position.set(-2.4, 0.02, 0.4); trialG.add(matL);
    const matR = box(4.2, 0.04, 3.2, M.matte(0x2b3039)); matR.position.set(2.4, 0.02, 0.4); trialG.add(matR);
    const NB = CAPG * 2;
    const bodyM = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.1, 0.22, 4, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), NB);
    const headM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.08, 12, 10), new THREE.MeshStandardMaterial({ color: 0xd9a47e, roughness: 0.6 }), NB);
    [bodyM, headM].forEach((m) => { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; m.castShadow = true; trialG.add(m); });
    const o3 = new THREE.Object3D(), cGrey = new THREE.Color(0x7d8696), cGood = new THREE.Color(hex(COL.good)), cNo = new THREE.Color(0x4a5160), cTmp = new THREE.Color();
    const place = (i, x, z, sc, col) => {
      o3.position.set(x, 0.24 * sc, z); o3.scale.setScalar(sc); o3.updateMatrix(); bodyM.setMatrixAt(i, o3.matrix); bodyM.setColorAt(i, col);
      o3.position.y = 0.5 * sc; o3.updateMatrix(); headM.setMatrixAt(i, o3.matrix);
    };
    const gL = L('Remedy', [-2.4, 1.1, 1.9], 'remedy', trialG), gR = L('Placebo (dummy pill)', [2.4, 1.1, 1.9], 'blue', trialG);

    // --- chart board for the trial
    let S = {}, res = null, reg = null;
    const pctS = (v) => `${Math.round(v * 100)}%`;
    const tb = board(trialG, 3.9, 1.72, 1000, 440, (g, w, h) => {
      panelBg(g, w, h);
      if (!res) return;
      text(g, S.fair ? 'Share who got better' : 'Share who got better (no comparison group)', 28, 46, { size: 28, bold: true });
      const bars = S.fair ? [['Remedy', res.a, COL.remedy], ['Placebo', res.b, COL.blue]] : [['Remedy', res.a, COL.remedy]];
      bars.forEach(([n, v, c], i) => { const y = 90 + i * 80; text(g, n, 28, y + 36, { size: 24, bold: true, col: c }); g.fillStyle = c; g.globalAlpha = 0.85; g.fillRect(180, y + 8, v * 620, 44); g.globalAlpha = 1; text(g, pctS(v), 190 + v * 620, y + 40, { size: 24, bold: true }); });
      let verdict, col;
      if (!S.fair) { verdict = `${pctS(res.a)} got better. Looks like it works, but we can't tell: many would have got better anyway.`; col = COL.gold; }
      else if (res.lo > 0) { verdict = `Difference ${res.diff > 0 ? '+' : ''}${Math.round(res.diff * 100)} points (95% range ${Math.round(res.lo * 100)} to ${Math.round(res.hi * 100)}): unlikely to be chance.${S.blind ? '' : ' But unblinded: hopes can create a fake difference.'}`; col = S.blind ? COL.good : COL.bad; }
      else { verdict = `Difference ${res.diff >= 0 ? '+' : ''}${Math.round(res.diff * 100)} points (95% range ${Math.round(res.lo * 100)} to +${Math.round(res.hi * 100)}): could easily be chance. No real effect shown.`; col = COL.muted; }
      wrap(g, verdict, 28, S.fair ? 290 : 210, w - 56, 34, { size: 24, col });
    }, [2.5, 3.2, -1.4]);

    // --- regression to the mean board and a figure whose symptom bar rises and falls
    const regG = new THREE.Group(); root.add(regG);
    const rb = board(regG, 5.0, 2.5, 1240, 620, (g, w, h, cursor = 99) => {
      panelBg(g, w, h);
      reg = reg || regression();
      text(g, 'Average symptom score of 3,000 simulated people, with NO treatment', 30, 50, { size: 28, bold: true });
      const { X, Y } = axes(g, { x0: 100, x1: w - 40, y0: h - 70, y1: 100, xMin: -6, xMax: 21, yMin: 3, yMax: 9, xTicks: [-6, 0, 7, 14, 21], yTicks: [3, 5, 7, 9], xFmt: (v) => (v === 0 ? 'visit' : (v > 0 ? '+' : '') + v + ' d'), yFmt: (v) => v + '/10' });
      g.strokeStyle = COL.muted; g.setLineDash([8, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(X(-6), Y(reg.mu)); g.lineTo(X(21), Y(reg.mu)); g.stroke(); g.setLineDash([]);
      text(g, 'their usual level', X(21) - 6, Y(reg.mu) + 26, { size: 20, col: COL.muted, align: 'right' });
      g.strokeStyle = COL.bad; g.lineWidth = 2; g.beginPath(); g.moveTo(X(0), Y(3)); g.lineTo(X(0), Y(9)); g.stroke();
      text(g, 'they visit on a bad day (score 8+)', X(0) + 10, Y(8.9), { size: 20, col: COL.bad });
      polyline(g, reg.days.filter(([d]) => d <= cursor).map(([d, v]) => [X(d), Y(v)]), COL.remedy, 5);
      const at = reg.days.find(([d]) => d === 7);
      if (cursor >= 7) text(g, `a week later: ${at[1].toFixed(1)}/10, back near normal, with nothing taken`, X(1), Y(3.5), { size: 22, bold: true, col: COL.good });
    }, [1.0, 1.5, 0.8]);
    rb.mesh.rotation.x = -0.4;
    const regL = L('Anything taken at the visit would seem to "work"', [1.0, 0.05, 1.6], 'gold', regG);

    // --- reviews and safety boards
    const infoG = new THREE.Group(); root.add(infoG);
    let infoMode = 'reviews';
    const REV = [
      ['NHMRC, Australia (2015)', '176 studies, 61 conditions: no condition with reliable evidence that homeopathy works better than placebo.', COL.bad],
      ['Shang et al., The Lancet (2005)', '110 homeopathy trials vs 110 matched drug trials: in the larger, better ones, effects compatible with placebo.', COL.bad],
      ['UK Parliament committee (2010) · NHS England (2017)', 'No better than placebo; NHS England stopped routine prescribing (upheld by the High Court, 2018).', COL.bad],
      ['Mathie et al. (2014)', 'Individualised homeopathy "may have small, specific effects", but the evidence was low or unclear quality.', COL.gold],
      ['CCRH, India', 'Runs clinical studies and reports positive results; most are small and not independently repeated.', COL.gold],
      ['Homeopathy organisations', 'Dispute the big reviews\' methods, saying individualised care is hard to test in standard trials.', COL.gold],
    ];
    const SAF = [
      ['Very dilute remedies (e.g. 30C)', 'Essentially no substance left, so little direct risk from the pill itself.', COL.good],
      ['Delaying real treatment', 'The main danger. WHO (2009) does not recommend homeopathy for HIV, TB, malaria, flu or infant diarrhoea.', COL.bad],
      ['Low dilutions and tinctures', 'Can contain real amounts of the plant or mineral, and alcohol. Some are toxic, like belladonna.', COL.bad],
      ['Badly made products', 'FDA, 2017: some teething tablets held far more belladonna than labelled; they were recalled.', COL.bad],
      ['Reported harms', 'A 2012 review found 1,159 people with side effects in case reports, 4 deaths (its methods were disputed).', COL.gold],
      ['Always', 'Tell your doctor what you take, and never stop prescribed medicine without asking them.', COL.cyan],
    ];
    const ib = board(infoG, 5.0, 2.81, 1280, 720, (g, w, h) => {
      panelBg(g, w, h);
      const list = infoMode === 'reviews' ? REV : SAF;
      text(g, infoMode === 'reviews' ? 'What the big reviews found, and who disagrees' : 'Safety: where the real risks are', 34, 56, { size: 32, bold: true });
      let y = 116;
      list.forEach(([a, b, c]) => { g.fillStyle = c; g.fillRect(34, y - 24, 8, 70); text(g, a, 58, y, { size: 24, bold: true, col: c }); y = wrap(g, b, 58, y + 32, w - 100, 28, { size: 21, col: COL.text }) + 26; });
    }, [1.0, 1.5, 0.8]);
    ib.mesh.rotation.x = -0.4;

    const fit = fitNarrow(stage, { pos: [0, 4.8, 9.6], target: [0, 1.9, 0] });
    let t = 0, key = '', revealT = 9, mode = '', regT = 0;
    return compactReadout(stage, {
      update(dt, s) {
        dt = Math.max(0, dt); t += dt; revealT += dt;
        S = s;
        const R = inReel();
        tb.mesh.position.set(R ? 0 : 2.5, R ? 3.6 : 3.2, -1.4); tb.mesh.scale.setScalar(R ? 1.5 : 1);
        rb.mesh.position.x = ib.mesh.position.x = R ? 0 : 1.0;
        if (s.mode !== mode) { mode = s.mode; regT = 0; if (mode === 'reviews' || mode === 'safety') { infoMode = mode; ib.redraw(); } }
        trialG.visible = mode === 'trial'; regG.visible = mode === 'regress'; infoG.visible = mode === 'reviews' || mode === 'safety';
        const narrow = fit(), on = s.labels && !inReel() && !narrow;
        if (mode === 'trial') {
          const n = Math.round(s.n), k2 = `${s.fair}|${s.blind}|${Math.round(s.anyway)}|${Math.round(s.effect)}|${n}|${s.seed}`;
          if (k2 !== key) { key = k2; res = runTrial({ n, anyway: Math.round(s.anyway), effect: Math.round(s.effect), fair: s.fair, blind: s.blind, seed: s.seed * 131 + n }); revealT = 0; tb.redraw(); }
          matR.visible = s.fair; gR.visible = on && s.fair; gL.visible = on;
          matL.position.x = s.fair ? -2.4 : 0; gL.position.x = s.fair ? -2.4 : 0;
          // show up to 100 per group; each figure stands for n/100 people when n > 100
          const show = Math.min(CAPG, n), cols = 10;
          for (let gi = 0; gi < 2; gi++) {
            const arr = gi === 0 ? res.treat : res.ctrl, cx = gi === 0 ? (s.fair ? -2.4 : 0) : 2.4;
            for (let j = 0; j < CAPG; j++) {
              const id = gi * CAPG + j;
              if (j >= show || (gi === 1 && !s.fair)) { o3.position.set(0, -99, 0); o3.scale.setScalar(0.001); o3.updateMatrix(); bodyM.setMatrixAt(id, o3.matrix); headM.setMatrixAt(id, o3.matrix); continue; }
              const rowsN = Math.ceil(show / cols), x = cx + ((j % cols) - (cols - 1) / 2) * 0.38, z = 0.4 + (Math.floor(j / cols) - (rowsN - 1) / 2) * 0.3;
              const idx = Math.floor((j * arr.length) / show), better = arr[idx];
              const k = clamp((revealT * 1.2 - j / show) * 3, 0, 1);
              cTmp.copy(cGrey).lerp(better ? cGood : cNo, k);
              place(id, x, z, show > 60 ? 1 : 1.25, cTmp);
            }
          }
          bodyM.instanceMatrix.needsUpdate = headM.instanceMatrix.needsUpdate = true; if (bodyM.instanceColor) bodyM.instanceColor.needsUpdate = true;
        }
        if (mode === 'regress') {
          regT += dt;
          const cur = -6 + (regT * 5) % 34;
          if (Math.floor(cur) !== rb.last) { rb.last = Math.floor(cur); rb.redraw(Math.min(21, cur)); }
          regL.visible = on;
        }
      },
      readout: (s) => {
        if (s.mode === 'trial' && res) {
          const list = s.fair ? [['Remedy group better', pctS(res.a)], ['Placebo group better', pctS(res.b)], ['Difference', `${res.diff >= 0 ? '+' : ''}${Math.round(res.diff * 100)} points`], ['95% range', `${Math.round(res.lo * 100)} to ${Math.round(res.hi * 100)}`]] : [['Took the remedy', Math.round(s.n).toLocaleString('en-IN')], ['Got better', pctS(res.a)], ['Would have anyway', `about ${Math.round(s.anyway)}%`], ['Comparison group', 'none']];
          return `<div class="big">${s.fair ? (s.blind ? 'Randomised, blinded, controlled' : 'Randomised, but not blinded') : 'No comparison group'}</div>${rows(list)}<small>You choose the true effect; chance does the rest. Each figure stands for ${Math.max(1, Math.round(s.n / 100))} ${Math.round(s.n / 100) > 1 ? 'people' : 'person'}.</small>`;
        }
        if (s.mode === 'regress') return `<div class="big">Better anyway</div>${rows([['Simulated people', '3,000'], ['Visit when score hits', '8 out of 10'], ['Treatment given', 'none'], ['A week later', 'back near their usual 5']])}<small>Symptoms go up and down. People seek help at the peak, so almost anything seems to work.</small>`;
        if (s.mode === 'reviews') return `<div class="big">The big reviews</div>${rows([['NHMRC 2015', 'no reliable evidence, any condition'], ['Lancet 2005', 'compatible with placebo'], ['NHS England 2017', 'stopped routine funding'], ['Dissent', 'practitioners, CCRH, Mathie 2014']])}<small>Reviews weigh all the good trials together, so one small study can't mislead.</small>`;
        return `<div class="big">Safety</div>${rows([['A 30C pill itself', 'very low direct risk'], ['Biggest risk', 'delaying real treatment'], ['Low dilutions', 'can hold real, toxic doses'], ['Tell your doctor', 'everything you take']])}<small>Never stop prescribed medicine without talking to your doctor.</small>`;
      },
    });
  },
};

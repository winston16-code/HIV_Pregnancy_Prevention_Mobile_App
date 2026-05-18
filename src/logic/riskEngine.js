import { questions, questionsById } from '../data/questions';

// Bands chosen so a "default safe" profile lands in low, a few risk factors
// push to moderate, and combinations of unprotected sex / multiple partners /
// no testing land in high. Tuned by hand against a small set of personas.
const HIV_LOW_MAX = 2;
const HIV_MOD_MAX = 5;
const PREG_LOW_MAX = 1;
const PREG_MOD_MAX = 3;

export function scoreAnswers(answers) {
  let hiv = 0;
  let preg = 0;
  for (const [qid, value] of Object.entries(answers)) {
    const q = questionsById[qid];
    if (!q) continue;
    const opt = q.options.find((o) => o.value === value);
    if (!opt) continue;
    hiv += opt.hiv || 0;
    preg += opt.preg || 0;
  }
  return { hiv, preg };
}

export function bandFor(score, type) {
  if (type === 'hiv') {
    if (score <= HIV_LOW_MAX) return 'low';
    if (score <= HIV_MOD_MAX) return 'moderate';
    return 'high';
  }
  if (score <= PREG_LOW_MAX) return 'low';
  if (score <= PREG_MOD_MAX) return 'moderate';
  return 'high';
}

export function overallBand(hivBand, pregBand) {
  const rank = { low: 0, moderate: 1, high: 2 };
  const max = Math.max(rank[hivBand], rank[pregBand]);
  return ['low', 'moderate', 'high'][max];
}

// Recommendation engine: looks at specific answers, not just totals, so the
// suggestions feel personal rather than generic. Each recommendation has an
// action (what to do), an actionLabel (button text), and an actionType
// (where to send the user — chat, find, learn).
export function recommendationsFor(answers) {
  const recs = [];
  const a = answers;

  if (a.active === 'none') {
    recs.push({
      title: 'recActiveNoneTitle',
      body: 'recActiveNoneBody',
      actionLabel: 'recActiveNoneAction',
      actionType: 'learn',
    });
    return recs;
  }

  if (a.tested === 'never' || a.tested === 'old' || a.tested === 'year') {
    recs.push({
      title: 'recTestedTitle',
      body: 'recTestedBody',
      actionLabel: 'recTestedAction',
      actionType: 'find',
    });
  }

  if (a.protection === 'contra' || a.protection === 'none' || a.protection === 'unsure') {
    recs.push({
      title: 'recCondomTitle',
      body: 'recCondomBody',
      actionLabel: 'recCondomAction',
      actionType: 'learn',
      topicId: 'contraception',
    });
  }

  if (a.protection === 'condom' || a.protection === 'none' || a.protection === 'unsure') {
    recs.push({
      title: 'recContraTitle',
      body: 'recContraBody',
      actionLabel: 'recContraAction',
      actionType: 'learn',
      topicId: 'contraception',
    });
  }

  if (a.active === 'many' || a.prep === 'no' || a.prep === 'know') {
    recs.push({
      title: 'recPrepTitle',
      body: 'recPrepBody',
      actionLabel: 'recPrepAction',
      actionType: 'learn',
      topicId: 'prep',
    });
  }

  if (a.health === 'sti' || a.health === 'both') {
    recs.push({
      title: 'recStiTitle',
      body: 'recStiBody',
      actionLabel: 'recStiAction',
      actionType: 'find',
    });
  }

  if (a.health === 'unsafe' || a.health === 'both') {
    recs.push({
      title: 'recSafeTitle',
      body: 'recSafeBody',
      actionLabel: 'recSafeAction',
      actionType: 'find',
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: 'recDoingWellTitle',
      body: 'recDoingWellBody',
      actionLabel: 'recDoingWellAction',
      actionType: 'learn',
    });
  }

  return recs;
}

export function evaluate(answers) {
  const { hiv, preg } = scoreAnswers(answers);
  const hivBand = bandFor(hiv, 'hiv');
  const pregBand = bandFor(preg, 'preg');
  const band = overallBand(hivBand, pregBand);
  const recs = recommendationsFor(answers);
  return { hivScore: hiv, pregScore: preg, hivBand, pregBand, band, recs };
}

// Walks the branching questionnaire to produce the next visible question id.
// Returns null when the user has reached the end of their branch.
export function nextQuestionId(currentId, value) {
  const q = questionsById[currentId];
  if (!q) return null;
  const opt = q.options.find((o) => o.value === value);
  return opt?.next ?? null;
}

export function firstQuestionId() {
  return questions[0].id;
}

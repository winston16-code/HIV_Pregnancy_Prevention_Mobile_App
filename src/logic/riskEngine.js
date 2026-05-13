import { questions, questionsById } from '../data/questions';

// Bands chosen so a "default safe" profile lands in low, a few risk factors
// push to moderate, and combinations of unprotected sex / multiple partners /
// no testing land in high. Tuned by hand against a small set of personas.
const HIV_LOW_MAX = 2;
const HIV_MOD_MAX = 6;
const PREG_LOW_MAX = 1;
const PREG_MOD_MAX = 4;

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
      title: 'Knowledge is power',
      body:
        'Even if you’re not sexually active right now, learning about your options puts you in control later.',
      actionLabel: 'Browse Learn',
      actionType: 'learn',
    });
    return recs;
  }

  if (a.tested === 'never' || a.tested === 'old') {
    recs.push({
      title: 'Consider a quick HIV test',
      body:
        'Tests are free, fast, and confidential. Knowing your status is the first step in caring for yourself.',
      actionLabel: 'Find a clinic',
      actionType: 'find',
    });
  }

  if (a.condom === 'sometimes' || a.condom === 'never') {
    recs.push({
      title: 'Condoms protect against both',
      body:
        'They are the only method that prevents both HIV and pregnancy. Free at most clinics — both partners can carry them.',
      actionLabel: 'Read about condoms',
      actionType: 'learn',
      topicId: 'contraception',
    });
  }

  if (a.contra === 'no' || a.contra === 'emergency' || a.contra === 'unsure') {
    recs.push({
      title: 'Other contraception worth knowing',
      body:
        'The pill, injection, and implant are very effective and discreet. A clinician can help you pick one that suits your life.',
      actionLabel: 'See options',
      actionType: 'learn',
      topicId: 'contraception',
    });
  }

  if (a.partners === 'few' || a.partners === 'many' || a.prep === 'no' || a.prep === 'know') {
    recs.push({
      title: 'PrEP could be a good fit',
      body:
        'PrEP is a daily pill that prevents HIV — over 99% effective when taken right. Free at many youth-friendly clinics.',
      actionLabel: 'Learn about PrEP',
      actionType: 'learn',
      topicId: 'prep',
    });
  }

  if (a.sti === 'untreated' || a.sti === 'unsure') {
    recs.push({
      title: 'Get an STI check',
      body:
        'STI symptoms (or symptoms you’re unsure about) are usually easy to treat — but untreated they can cause bigger problems. Clinics handle this confidentially.',
      actionLabel: 'Find a clinic',
      actionType: 'find',
    });
  }

  if (a.relationship === 'some' || a.relationship === 'rare') {
    recs.push({
      title: 'You deserve to feel safe',
      body:
        'If saying no or asking for a condom feels risky, a youth counsellor can talk with you privately. You don’t have to handle this alone.',
      actionLabel: 'Find a counsellor',
      actionType: 'find',
    });
  }

  if (a.substances === 'often') {
    recs.push({
      title: 'Plan ahead for nights out',
      body:
        'When alcohol is in the picture, decisions get harder. Carrying a condom and agreeing limits with a friend before going out really helps.',
      actionLabel: 'Read more',
      actionType: 'learn',
      topicId: 'consent',
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: 'You’re doing well',
      body:
        'Stay informed and check in again whenever life changes. Knowing your status once a year is a good habit.',
      actionLabel: 'Browse Learn',
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

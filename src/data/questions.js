// Adaptive questionnaire for HIV + pregnancy prevention risk assessment.
// Each question contributes to two scores: hivScore and pregScore.
// Branching is handled via the `next` field on each option.
// Authored to be answerable in ~2 minutes at a form 4 reading level.

export const questions = [
  {
    id: 'active',
    text: 'In the last 6 months, have you been sexually active?',
    options: [
      { label: 'No, not at all', value: 'none', hiv: 0, preg: 0, next: 'futurePlans' },
      { label: 'Yes, once or twice', value: 'few', hiv: 1, preg: 1, next: 'partners' },
      { label: 'Yes, regularly', value: 'often', hiv: 2, preg: 2, next: 'partners' },
      { label: 'I prefer not to say', value: 'skip', hiv: 1, preg: 1, next: 'partners' },
    ],
  },
  {
    id: 'futurePlans',
    text: 'Do you think you may become sexually active in the next year?',
    options: [
      { label: 'No', value: 'no', hiv: 0, preg: 0, next: null },
      { label: 'Maybe', value: 'maybe', hiv: 0, preg: 0, next: null },
      { label: 'Yes', value: 'yes', hiv: 0, preg: 0, next: null },
    ],
  },
  {
    id: 'partners',
    text: 'How many partners in the last 6 months?',
    options: [
      { label: 'One', value: 'one', hiv: 0, preg: 0, next: 'condom' },
      { label: 'Two or three', value: 'few', hiv: 2, preg: 1, next: 'condom' },
      { label: 'More than three', value: 'many', hiv: 3, preg: 1, next: 'condom' },
      { label: 'I prefer not to say', value: 'skip', hiv: 1, preg: 0, next: 'condom' },
    ],
  },
  {
    id: 'condom',
    text: 'How often do you use a condom?',
    options: [
      { label: 'Every time', value: 'always', hiv: 0, preg: 0, next: 'contra' },
      { label: 'Most times', value: 'most', hiv: 1, preg: 1, next: 'contra' },
      { label: 'Sometimes', value: 'sometimes', hiv: 2, preg: 2, next: 'contra' },
      { label: 'Rarely or never', value: 'never', hiv: 3, preg: 3, next: 'contra' },
    ],
  },
  {
    id: 'contra',
    text: 'Are you (or your partner) using any other contraception?',
    options: [
      { label: 'Yes — pill, injection, implant, or IUD', value: 'modern', hiv: 0, preg: -2, next: 'partnerStatus' },
      { label: 'Yes — emergency pill sometimes', value: 'emergency', hiv: 0, preg: 1, next: 'partnerStatus' },
      { label: 'No', value: 'no', hiv: 0, preg: 2, next: 'partnerStatus' },
      { label: 'Not sure', value: 'unsure', hiv: 0, preg: 1, next: 'partnerStatus' },
    ],
  },
  {
    id: 'partnerStatus',
    text: 'Do you know your partner’s HIV status?',
    options: [
      { label: 'Yes, we both tested recently', value: 'both', hiv: 0, preg: 0, next: 'tested' },
      { label: 'Only mine', value: 'mine', hiv: 1, preg: 0, next: 'tested' },
      { label: 'No', value: 'no', hiv: 2, preg: 0, next: 'tested' },
      { label: 'Prefer not to say', value: 'skip', hiv: 1, preg: 0, next: 'tested' },
    ],
  },
  {
    id: 'tested',
    text: 'When did you last test for HIV?',
    options: [
      { label: 'In the last 3 months', value: 'recent', hiv: 0, preg: 0, next: 'sti' },
      { label: 'In the last year', value: 'year', hiv: 1, preg: 0, next: 'sti' },
      { label: 'More than a year ago', value: 'old', hiv: 2, preg: 0, next: 'sti' },
      { label: 'Never', value: 'never', hiv: 3, preg: 0, next: 'sti' },
    ],
  },
  {
    id: 'sti',
    text: 'Have you had any STI symptoms or diagnosis in the past year?',
    options: [
      { label: 'No', value: 'no', hiv: 0, preg: 0, next: 'substances' },
      { label: 'Yes, treated', value: 'treated', hiv: 1, preg: 0, next: 'substances' },
      { label: 'Yes, not treated', value: 'untreated', hiv: 3, preg: 0, next: 'substances' },
      { label: 'Not sure', value: 'unsure', hiv: 1, preg: 0, next: 'substances' },
    ],
  },
  {
    id: 'substances',
    text: 'Do you sometimes have sex after drinking alcohol or using substances?',
    options: [
      { label: 'Never', value: 'never', hiv: 0, preg: 0, next: 'relationship' },
      { label: 'Sometimes', value: 'some', hiv: 1, preg: 1, next: 'relationship' },
      { label: 'Often', value: 'often', hiv: 2, preg: 2, next: 'relationship' },
    ],
  },
  {
    id: 'relationship',
    text: 'In your current relationship(s), do you feel safe to say no or ask to use a condom?',
    options: [
      { label: 'Yes, always', value: 'always', hiv: 0, preg: 0, next: 'prep' },
      { label: 'Sometimes', value: 'some', hiv: 1, preg: 1, next: 'prep' },
      { label: 'Rarely or never', value: 'rare', hiv: 3, preg: 2, next: 'prep' },
      { label: 'Not applicable', value: 'na', hiv: 0, preg: 0, next: 'prep' },
    ],
  },
  {
    id: 'prep',
    text: 'Have you heard of PrEP (a pill that helps prevent HIV)?',
    options: [
      { label: 'Yes, I use it', value: 'using', hiv: -2, preg: 0, next: null },
      { label: 'Yes, but I don’t use it', value: 'know', hiv: 0, preg: 0, next: null },
      { label: 'No', value: 'no', hiv: 0, preg: 0, next: null },
    ],
  },
];

export const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));

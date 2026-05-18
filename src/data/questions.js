// Adaptive questionnaire for HIV + pregnancy prevention risk assessment.
// Consolidated from 11 questions down to 5 high-impact questions for a stress-free experience.
// Branching is handled via the `next` field on each option.
// Uses translation keys to maintain 100% trilingual purity.

export const questions = [
  {
    id: 'active',
    text: 'q_active_text',
    options: [
      { label: 'q_active_opt_none', value: 'none', hiv: 0, preg: 0, next: null },
      { label: 'q_active_opt_one', value: 'one', hiv: 1, preg: 1, next: 'protection' },
      { label: 'q_active_opt_many', value: 'many', hiv: 3, preg: 2, next: 'protection' },
      { label: 'q_active_opt_skip', value: 'skip', hiv: 1, preg: 1, next: 'protection' },
    ],
  },
  {
    id: 'protection',
    text: 'q_protection_text',
    options: [
      { label: 'q_protection_opt_both', value: 'both', hiv: 0, preg: 0, next: 'tested' },
      { label: 'q_protection_opt_condom', value: 'condom', hiv: 0, preg: 2, next: 'tested' },
      { label: 'q_protection_opt_contra', value: 'contra', hiv: 2, preg: 0, next: 'tested' },
      { label: 'q_protection_opt_none', value: 'none', hiv: 3, preg: 3, next: 'tested' },
      { label: 'q_protection_opt_unsure', value: 'unsure', hiv: 2, preg: 2, next: 'tested' },
    ],
  },
  {
    id: 'tested',
    text: 'q_tested_text',
    options: [
      { label: 'q_tested_opt_recent', value: 'recent', hiv: 0, preg: 0, next: 'health' },
      { label: 'q_tested_opt_year', value: 'year', hiv: 1, preg: 0, next: 'health' },
      { label: 'q_tested_opt_old', value: 'old', hiv: 2, preg: 0, next: 'health' },
      { label: 'q_tested_opt_never', value: 'never', hiv: 3, preg: 0, next: 'health' },
    ],
  },
  {
    id: 'health',
    text: 'q_health_text',
    options: [
      { label: 'q_health_opt_safe', value: 'safe', hiv: 0, preg: 0, next: 'prep' },
      { label: 'q_health_opt_sti', value: 'sti', hiv: 3, preg: 0, next: 'prep' },
      { label: 'q_health_opt_unsafe', value: 'unsafe', hiv: 2, preg: 1, next: 'prep' },
      { label: 'q_health_opt_both', value: 'both', hiv: 3, preg: 1, next: 'prep' },
    ],
  },
  {
    id: 'prep',
    text: 'q_prep_text',
    options: [
      { label: 'q_prep_opt_using', value: 'using', hiv: -2, preg: 0, next: null },
      { label: 'q_prep_opt_know', value: 'know', hiv: 0, preg: 0, next: null },
      { label: 'q_prep_opt_no', value: 'no', hiv: 0, preg: 0, next: null },
    ],
  },
];

export const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));

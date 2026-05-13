// Short, plain-language content cards for the Learn pillar.
// Aim: form 4 reading level, ~80-150 words per card.
// Each topic groups several cards and an optional 3-question quiz.

export const topics = [
  {
    id: 'hiv-basics',
    title: 'HIV — the basics',
    summary: 'What it is, how it spreads, how it doesn’t.',
    color: '#0F766E',
    cards: [
      {
        id: 'hiv-what',
        title: 'What HIV is',
        body:
          'HIV is a virus that weakens the body’s defences over time. Without treatment it can lead to AIDS. With treatment, people living with HIV live long, healthy lives — and can have HIV-negative children and partners.',
      },
      {
        id: 'hiv-spread',
        title: 'How it spreads',
        body:
          'HIV passes through specific body fluids — blood, semen, vaginal fluids, and breast milk. The most common way it spreads is unprotected sex. Sharing needles can also spread it.',
      },
      {
        id: 'hiv-not',
        title: 'How it doesn’t spread',
        body:
          'You cannot get HIV from sharing food, hugging, shaking hands, mosquito bites, toilets, or kissing. These myths still hurt people. Spread the truth.',
      },
      {
        id: 'hiv-u-equals-u',
        title: 'U = U',
        body:
          'Undetectable equals Untransmittable. When someone takes HIV treatment well, the virus becomes so low it cannot pass on. This is one of the biggest changes in HIV in decades.',
      },
    ],
    quiz: [
      {
        q: 'Can HIV spread through hugging?',
        options: ['Yes', 'No', 'Only sometimes'],
        answer: 1,
      },
      {
        q: 'What does U = U mean?',
        options: [
          'Universal vaccine',
          'Undetectable = Untransmittable',
          'Used = Unused',
        ],
        answer: 1,
      },
      {
        q: 'Which fluid does NOT spread HIV?',
        options: ['Blood', 'Saliva', 'Semen'],
        answer: 1,
      },
    ],
  },
  {
    id: 'contraception',
    title: 'Contraception choices',
    summary: 'What works, how well, and what suits campus life.',
    color: '#2563EB',
    cards: [
      {
        id: 'condom',
        title: 'Condoms',
        body:
          'Used correctly, condoms prevent pregnancy about 98% of the time and are the only method that also protects against HIV and other STIs. Free at most clinics. Carry them — both partners can.',
      },
      {
        id: 'pill',
        title: 'The pill',
        body:
          'Taken every day at roughly the same time. Around 99% effective if used perfectly, closer to 91% in real life because people forget. Does not protect against HIV.',
      },
      {
        id: 'injection',
        title: 'The injection',
        body:
          'Given every 2 or 3 months at a clinic. Around 94% effective in real use. Private — no daily pill to remember. Some people get changes in their periods.',
      },
      {
        id: 'implant',
        title: 'The implant',
        body:
          'A small rod placed under the skin of the arm. Lasts 3 to 5 years. Over 99% effective. Hands-off once it’s in. Can be removed any time.',
      },
      {
        id: 'emergency',
        title: 'Emergency pill',
        body:
          'Taken within 72 hours of unprotected sex, sooner is better. Works for one event only. It is not the same as the abortion pill. Available at most pharmacies.',
      },
    ],
    quiz: [
      {
        q: 'Which method protects against both pregnancy and HIV?',
        options: ['Pill', 'Condom', 'Injection'],
        answer: 1,
      },
      {
        q: 'How long does an implant last?',
        options: ['1 month', '1 year', '3–5 years'],
        answer: 2,
      },
      {
        q: 'When should the emergency pill be taken?',
        options: ['Within 72 hours', 'Within 2 weeks', 'Any time'],
        answer: 0,
      },
    ],
  },
  {
    id: 'prep',
    title: 'PrEP — a pill to prevent HIV',
    summary: 'For people who are HIV-negative and want extra protection.',
    color: '#9333EA',
    cards: [
      {
        id: 'prep-what',
        title: 'What PrEP is',
        body:
          'PrEP is a daily pill taken by HIV-negative people to prevent getting HIV. When taken correctly it is over 99% effective. You can get it free at many youth-friendly clinics.',
      },
      {
        id: 'prep-who',
        title: 'Who might consider it',
        body:
          'PrEP can be a good option if you have more than one partner, if you don’t always use condoms, if your partner’s status is unknown, or simply if you want extra peace of mind.',
      },
      {
        id: 'prep-how',
        title: 'Getting started',
        body:
          'You take a quick HIV test first. If negative, a clinician gives you a prescription and reviews you every few months. You can stop any time.',
      },
    ],
    quiz: [
      {
        q: 'Who is PrEP for?',
        options: ['People with HIV', 'HIV-negative people who want to prevent HIV', 'Anyone with a cold'],
        answer: 1,
      },
      {
        q: 'How effective is PrEP if taken daily?',
        options: ['About 50%', 'About 70%', 'Over 99%'],
        answer: 2,
      },
    ],
  },
  {
    id: 'consent',
    title: 'Consent & healthy relationships',
    summary: 'What yes really means and how to spot warning signs.',
    color: '#DB2777',
    cards: [
      {
        id: 'consent-what',
        title: 'What consent is',
        body:
          'Consent is a clear, ongoing yes — given freely, without pressure, fear, or being drunk or asleep. You can change your mind at any moment, and so can your partner.',
      },
      {
        id: 'green-flags',
        title: 'Healthy signs',
        body:
          'You feel safe to say no. Your partner respects your time, your studies, and your friends. You can talk about hard things without it becoming a fight.',
      },
      {
        id: 'red-flags',
        title: 'Warning signs',
        body:
          'Pressure to do things you don’t want. Refusing to use a condom. Checking your phone, cutting you off from friends, or threatening you. These are not love — they are control.',
      },
    ],
    quiz: [
      {
        q: 'Can someone consent if they are drunk and falling asleep?',
        options: ['Yes', 'No', 'Only if they said yes earlier'],
        answer: 1,
      },
      {
        q: 'Can you change your mind during sex?',
        options: ['No, once you say yes it’s yes', 'Yes, at any time'],
        answer: 1,
      },
    ],
  },
  {
    id: 'testing',
    title: 'Testing & getting checked',
    summary: 'Where to go, what to expect, how often.',
    color: '#F59E0B',
    cards: [
      {
        id: 'when',
        title: 'When to test',
        body:
          'Test at least once a year if you are sexually active. Test more often if you have new partners, or about 4–6 weeks after any unprotected sex.',
      },
      {
        id: 'what',
        title: 'What happens at a test',
        body:
          'A small finger-prick or saliva sample. Results in 15–20 minutes. Confidential. Many clinics test for HIV and other STIs in the same visit.',
      },
      {
        id: 'free',
        title: 'Cost',
        body:
          'HIV testing is free at public clinics and at New Start centres in Zimbabwe. Some campus health services also offer it free.',
      },
    ],
    quiz: [
      {
        q: 'If you are sexually active, how often should you test?',
        options: ['Once in your life', 'At least once a year', 'Only if sick'],
        answer: 1,
      },
    ],
  },
];

export const topicsById = Object.fromEntries(topics.map((t) => [t.id, t]));

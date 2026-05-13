// Keyword-driven FAQ used by the rule-based chat assistant.
// Each rule has a set of trigger keywords (lowercased) and a response.
// Match strategy: count keyword overlaps; the rule with the most matches wins.

export const faqRules = [
  {
    id: 'condom-fail',
    keywords: ['condom', 'broke', 'tore', 'burst', 'split'],
    answer:
      'If a condom broke during sex, two things can help. (1) For pregnancy, the emergency pill works best within 72 hours — sooner is better. (2) For HIV, PEP is a medicine you can take within 72 hours that helps prevent infection. Visit the nearest clinic today if you can.',
  },
  {
    id: 'prep',
    keywords: ['prep', 'prevent', 'hiv', 'pill'],
    answer:
      'PrEP is a daily pill that prevents HIV when taken correctly. It is free at many youth-friendly clinics. You take a quick HIV test first, then start. You can stop any time. It does not protect against pregnancy or other STIs, so condoms still help.',
  },
  {
    id: 'pep',
    keywords: ['pep', 'after', 'exposure', '72'],
    answer:
      'PEP is an emergency course of HIV medicine you take after possible exposure. It must be started within 72 hours and continued for 28 days. Go to a clinic as soon as you can — the sooner, the better.',
  },
  {
    id: 'pregnancy-test',
    keywords: ['pregnant', 'pregnancy', 'test', 'late', 'period'],
    answer:
      'A home pregnancy test is most accurate from about one week after a missed period. Pharmacies sell them. Clinics also test for free or low cost. A late period can also be caused by stress or illness — testing is the only way to know.',
  },
  {
    id: 'emergency-pill',
    keywords: ['morning', 'after', 'emergency', 'pill', 'plan'],
    answer:
      'The emergency pill works best within 72 hours of unprotected sex — earlier is better. It is sold at most pharmacies without a prescription. It is for one event only. It is not the same as the abortion pill.',
  },
  {
    id: 'condom-use',
    keywords: ['how', 'use', 'condom'],
    answer:
      'Check the expiry date. Open carefully — no teeth. Pinch the tip to leave a small space, then roll it down before any contact. Use a new one for each act. After, hold the base when pulling out and tie it off in the bin.',
  },
  {
    id: 'hiv-symptoms',
    keywords: ['symptoms', 'hiv', 'signs'],
    answer:
      'Many people with HIV have no symptoms for years. Some get a flu-like illness 2–4 weeks after exposure. The only reliable way to know is to test. Free, confidential tests are available at clinics.',
  },
  {
    id: 'stress',
    keywords: ['scared', 'worried', 'anxious', 'panic'],
    answer:
      'It is okay to feel scared — that feeling means you care about yourself. Take a breath. Whatever happened, there are usually next steps that help. Would you like me to suggest a clinic near you?',
  },
  {
    id: 'partner-pressure',
    keywords: ['pressure', 'refuse', 'force', 'won’t'],
    answer:
      'You always have the right to say no, or to ask for a condom, without giving a reason. A partner who pressures or refuses is showing you something important about how they treat you. If you feel unsafe, a counsellor at any youth-friendly clinic can talk with you in private.',
  },
  {
    id: 'cost',
    keywords: ['free', 'cost', 'how much', 'money', 'price'],
    answer:
      'HIV testing, PrEP, PEP, condoms, and many contraceptive methods are free at public clinics and partner centres like New Start and CeSHHAR. Some pharmacy products (emergency pill, branded pills) have a small cost.',
  },
  {
    id: 'iud',
    keywords: ['iud', 'coil', 'loop'],
    answer:
      'An IUD is a small T-shaped device fitted in the womb by a clinician. It lasts 3–10 years depending on the type. Over 99% effective. Some people get heavier or lighter periods. It does not protect against HIV.',
  },
  {
    id: 'side-effects',
    keywords: ['side', 'effect', 'spotting', 'bleeding', 'mood'],
    answer:
      'Many contraceptive methods cause small side effects — spotting, mood changes, lighter or heavier periods. Most settle in 2–3 months. If they don’t, a clinician can switch your method.',
  },
];

export const fallbackAnswer =
  "I want to help. I didn't quite catch that — could you ask in another way? You can also tap Find to see clinics near you, or Learn to read short cards on HIV, contraception, and relationships.";

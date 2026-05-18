import { faqRules, fallbackAnswer } from '../data/chatFAQ';

// Simple keyword-overlap matcher. Tokenises the user message, counts how
// many of each rule's keywords appear, and returns the highest-scoring rule.
// Ties go to the rule with the higher keyword density (matches / total).
export function reply(userText) {
  const text = (userText || '').toLowerCase();
  if (!text.trim()) return 'chatFaqFallback';

  let best = null;
  let bestScore = 0;

  for (const rule of faqRules) {
    let hits = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw)) hits += 1;
    }
    if (hits === 0) continue;
    const density = hits / rule.keywords.length;
    const score = hits + density * 0.1;
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  if (!best) return 'chatFaqFallback';
  return `chatFaq_${best.id}`;
}

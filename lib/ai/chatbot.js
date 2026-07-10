// Rule-based chatbot placeholder. No external API. Recognises intents and
// composes responses using the hackathon dataset.

import { HACKATHONS, CATEGORIES } from '@/lib/data/hackathons';
import { recommendHackathons } from './recommender';

const INTENTS = [
  {
    id: 'greet',
    match: /^(hi|hello|hey|yo|sup|hola)\b/i,
    respond: () => ({
      text: "Hey! I'm Verse — your hackathon co-pilot. Ask me things like:\n• 'Find AI hackathons this month'\n• 'What's the biggest prize right now?'\n• 'Recommend something for beginners'",
    }),
  },
  {
    id: 'recommend',
    match: /(recommend|suggest|for me|best fit)/i,
    respond: (msg, prefs) => {
      const recs = recommendHackathons(HACKATHONS, prefs, 3);
      if (!prefs?.onboarded || !recs.length) {
        return {
          text: "Set your skills in the dashboard first and I'll tailor picks for you. In the meantime, here are three that most students are joining:",
          hackathons: HACKATHONS.filter((h) => h.trending).slice(0, 3),
        };
      }
      return {
        text: `Based on your skills and interests, here are my top ${recs.length} picks:`,
        hackathons: recs,
      };
    },
  },
  {
    id: 'biggest-prize',
    match: /(biggest|highest|largest|top).*(prize|money|reward)/i,
    respond: () => {
      const top = [...HACKATHONS]
        .sort((a, b) => (b.prizeValue || 0) - (a.prizeValue || 0))
        .slice(0, 3);
      return {
        text: 'Here are the hackathons with the largest prize pools right now:',
        hackathons: top,
      };
    },
  },
  {
    id: 'ongoing',
    match: /(live|ongoing|right now|happening now)/i,
    respond: () => {
      const live = HACKATHONS.filter((h) => h.status === 'ongoing').slice(0, 3);
      return {
        text: `${live.length} hackathons are live right now. Jump in:`,
        hackathons: live,
      };
    },
  },
  {
    id: 'beginner',
    match: /(beginner|first|new|starter|noob)/i,
    respond: () => {
      const easy = HACKATHONS.filter((h) =>
        (h.tags || []).some((t) => /beginner|community/i.test(t))
      ).slice(0, 3);
      return {
        text: 'These hackathons are beginner-friendly — mentors, prep material and forgiving deadlines:',
        hackathons: easy.length ? easy : HACKATHONS.slice(0, 3),
      };
    },
  },
  {
    id: 'category',
    match: /(ai|ml|web3|climate|gaming|fintech|healthtech|hardware|space)/i,
    respond: (msg) => {
      const cat = CATEGORIES.find((c) =>
        new RegExp(c.name.replace(/\s+/g, '.?'), 'i').test(msg) ||
        new RegExp(c.slug, 'i').test(msg)
      );
      const list = cat
        ? HACKATHONS.filter((h) => h.category === cat.slug).slice(0, 3)
        : [];
      return {
        text: cat
          ? `Here are top ${cat.name} hackathons:`
          : "I can filter by AI, Web3, Climate, Gaming, FinTech, HealthTech, Hardware or Space — which one?",
        hackathons: list,
      };
    },
  },
  {
    id: 'thanks',
    match: /(thank|thx|ty|cheers)/i,
    respond: () => ({ text: "Anytime. Go build something wild 🚀" }),
  },
];

const FALLBACK = {
  text: "I'm still a placeholder brain 🤖 — the full AI is on its way. Try: 'recommend hackathons for me', 'live now', 'biggest prize', or 'beginner friendly'.",
};

export function replyTo(message, prefs = {}) {
  const msg = String(message || '').trim();
  if (!msg) return FALLBACK;
  for (const intent of INTENTS) {
    if (intent.match.test(msg)) {
      return intent.respond(msg, prefs);
    }
  }
  return FALLBACK;
}

export const CHAT_SUGGESTIONS = [
  'Recommend hackathons for me',
  'What is live right now?',
  'Biggest prize this month?',
  'Beginner-friendly hackathons',
  'Show me AI hackathons',
];

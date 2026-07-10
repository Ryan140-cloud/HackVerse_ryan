// Provider-agnostic AI adapter. Reply generation for the floating assistant.
//
// Today: rule-based fallback (chatbot.js).
// Later: swap `REPLY_FN` for an OpenAI/Anthropic/Gemini call by setting
//   process.env.AI_PROVIDER = 'openai' | 'anthropic' | 'gemini'
// The public API of this module (`reply({ message, prefs })`) stays stable.

import { replyTo as ruleBasedReply } from './chatbot';

async function ruleBasedProvider({ message, prefs }) {
  const r = ruleBasedReply(message, prefs);
  return {
    provider: 'rule-based',
    text: r.text,
    hackathons: r.hackathons || [],
  };
}

// -----------------------------------------------------------------------
// Future providers — keep the signature identical.
// -----------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
async function openaiProvider({ message, prefs }) {
  // Placeholder: fill this in when OPENAI_API_KEY is provisioned.
  // Example:
  //   const res = await fetch('https://api.openai.com/v1/chat/completions', { ... });
  //   const data = await res.json();
  //   return { provider: 'openai', text: data.choices[0].message.content };
  return ruleBasedProvider({ message, prefs });
}

// eslint-disable-next-line no-unused-vars
async function anthropicProvider({ message, prefs }) {
  return ruleBasedProvider({ message, prefs });
}

// eslint-disable-next-line no-unused-vars
async function geminiProvider({ message, prefs }) {
  return ruleBasedProvider({ message, prefs });
}

const PROVIDERS = {
  'rule-based': ruleBasedProvider,
  openai: openaiProvider,
  anthropic: anthropicProvider,
  gemini: geminiProvider,
};

export function activeProvider() {
  const key = (process.env.AI_PROVIDER || 'rule-based').toLowerCase();
  return PROVIDERS[key] || PROVIDERS['rule-based'];
}

export async function reply({ message, prefs = {} } = {}) {
  const fn = activeProvider();
  return fn({ message, prefs });
}

export const AVAILABLE_PROVIDERS = Object.keys(PROVIDERS);

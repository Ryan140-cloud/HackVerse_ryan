// Pure recommendation scoring engine. Framework/runtime agnostic.
// Given user preferences and the full hackathon list, returns hackathons
// with a numeric `score`, `matchReasons[]`, sorted descending.

const SKILL_TO_TAGS = {
  javascript: ['JavaScript', 'JS', 'Web', 'Frontend', 'Node'],
  typescript: ['TypeScript', 'TS', 'Web', 'Frontend', 'Node'],
  python: ['Python', 'ML', 'Data', 'AI', 'Analytics'],
  react: ['React', 'Web', 'Frontend'],
  nextjs: ['Next.js', 'Web', 'Frontend'],
  nodejs: ['Node', 'Backend', 'JS'],
  ai: ['AI', 'ML', 'LLM', 'Agents', 'Generative AI'],
  ml: ['ML', 'AI', 'Data', 'Analytics'],
  web3: ['Web3', 'DeFi', 'Blockchain', 'ZK', 'Ethereum', 'Solana'],
  design: ['Design', 'UX', 'Product', 'Frontend'],
  gaming: ['Gaming', 'Unity', 'Godot', 'AR', '3D'],
  hardware: ['Hardware', 'IoT', 'Robotics', 'Firmware', 'Sensors'],
  mobile: ['Android', 'iOS', 'Mobile', 'React Native'],
  data: ['Data', 'Analytics', 'ML', 'Kaggle'],
  cloud: ['Cloud', 'Google Cloud', 'AWS', 'Systems'],
};

const EXPERIENCE_TAGS = {
  beginner: ['Beginner Friendly', 'Community', 'Fast Ship'],
  intermediate: ['Web', 'AI', 'Product'],
  advanced: ['Frontier Tech', 'ZK', 'Systems', 'Research', 'Bio'],
};

const CATEGORY_TO_KEYWORDS = {
  'ai-ml': ['AI', 'ML', 'LLM', 'Generative AI', 'Agents'],
  web3: ['Web3', 'DeFi', 'Blockchain', 'ZK'],
  fintech: ['FinTech', 'Payments', 'Business', 'Yield'],
  healthtech: ['HealthTech', 'Bio', 'Diagnostics', 'Wearables'],
  climate: ['Climate', 'Sustainability', 'Impact', 'Satellite'],
  gaming: ['Gaming', 'Unity', 'Godot'],
  hardware: ['Hardware', 'IoT', 'Robotics', 'Firmware'],
  space: ['Space', 'Orbital', 'Telemetry', 'Astronomy'],
};

function includesAny(haystack, needles) {
  const lc = haystack.map((h) => h.toLowerCase());
  return needles.filter((n) => lc.includes(n.toLowerCase()));
}

/**
 * Score a single hackathon vs preferences.
 * @param {object} h - hackathon
 * @param {object} prefs - { skills[], technologies[], experience, categories[], bookmarks[] }
 * @returns {{score:number, reasons:string[]}}
 */
export function scoreHackathon(h, prefs = {}) {
  const {
    skills = [],
    technologies = [],
    experience = 'intermediate',
    categories = [],
    bookmarks = [],
  } = prefs;

  let score = 0;
  const reasons = [];

  const hackTags = [
    ...(h.tags || []),
    ...(h.themes || []),
    h.category || '',
  ];

  // 1) Skills (map to tags via dictionary).
  skills.forEach((s) => {
    const mapped = SKILL_TO_TAGS[s.toLowerCase()] || [s];
    const hits = includesAny(hackTags, mapped);
    if (hits.length) {
      score += 30 * Math.min(hits.length, 2);
      reasons.push(`Matches your skill: ${s}`);
    }
  });

  // 2) Technologies (direct tag match).
  technologies.forEach((t) => {
    const hits = includesAny(hackTags, [t]);
    if (hits.length) {
      score += 20;
      reasons.push(`Uses ${t}`);
    }
  });

  // 3) Experience level.
  const expTags = EXPERIENCE_TAGS[experience] || [];
  const expHits = includesAny(hackTags, expTags);
  if (expHits.length) {
    score += 15;
    reasons.push(`Great for ${experience} builders`);
  }

  // 4) Preferred categories.
  if (categories.includes(h.category)) {
    score += 25;
    reasons.push('In your preferred category');
  } else {
    categories.forEach((c) => {
      const hits = includesAny(hackTags, CATEGORY_TO_KEYWORDS[c] || []);
      if (hits.length) {
        score += 10;
        reasons.push(`Related to ${c}`);
      }
    });
  }

  // 5) Bookmarks similarity — boost hackathons sharing tags with bookmarked ones.
  if (bookmarks.length) {
    const bookmarkTagSet = new Set(bookmarks.flatMap((b) => (b.tags || []).map((x) => x.toLowerCase())));
    const overlap = hackTags.filter((t) => bookmarkTagSet.has(String(t).toLowerCase())).length;
    if (overlap) {
      score += Math.min(overlap * 8, 24);
      reasons.push('Similar to your bookmarks');
    }
  }

  // 6) Freshness / status bonuses.
  if (h.status === 'upcoming') score += 4;
  if (h.status === 'ongoing') score += 8; // easier to join right now
  if (h.featured) score += 3;
  if (h.trending) score += 3;

  // 7) Popularity nudge (log-scale so it doesn't dominate).
  if (h.participants) score += Math.min(Math.log10(h.participants + 1) * 2, 8);

  return { score: Math.round(score), reasons: Array.from(new Set(reasons)) };
}

export function recommendHackathons(hackathons, prefs = {}, limit = 6) {
  const scored = hackathons
    .filter((h) => h.status !== 'ended')
    .map((h) => {
      const { score, reasons } = scoreHackathon(h, prefs);
      return { ...h, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

export const AVAILABLE_SKILLS = [
  'javascript', 'typescript', 'python', 'react', 'nextjs', 'nodejs',
  'ai', 'ml', 'web3', 'design', 'gaming', 'hardware', 'mobile', 'data', 'cloud',
];

export const AVAILABLE_TECH = [
  'React', 'Next.js', 'Node', 'Python', 'TypeScript', 'JavaScript',
  'Solidity', 'Rust', 'Go', 'Unity', 'Godot', 'Android', 'iOS',
  'Google Cloud', 'AWS', 'PostgreSQL', 'MongoDB',
];

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'First 1–2 hackathons' },
  { value: 'intermediate', label: 'Intermediate', desc: '3–9 hackathons under my belt' },
  { value: 'advanced', label: 'Advanced', desc: '10+ hackathons, love hard problems' },
];

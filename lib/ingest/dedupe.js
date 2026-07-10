// Duplicate detection utilities. A hackathon is a duplicate if it shares:
//  • the exact sourceUrl, OR
//  • title similarity > 0.85 AND overlapping start date (±5 days).

function normalizeTitle(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function titleSimilarity(a, b) {
  const A = normalizeTitle(a);
  const B = normalizeTitle(b);
  if (!A || !B) return 0;
  if (A === B) return 1;
  if (A.includes(B) || B.includes(A)) return 0.9;

  const tokensA = new Set(String(a).toLowerCase().split(/\s+/));
  const tokensB = new Set(String(b).toLowerCase().split(/\s+/));
  const inter = [...tokensA].filter((t) => tokensB.has(t)).length;
  return inter / Math.max(tokensA.size, tokensB.size);
}

export function isDuplicate(candidate, existingList) {
  for (const e of existingList) {
    if (candidate.sourceUrl && candidate.sourceUrl === e.sourceUrl) return e;
    const daysApart = Math.abs(
      (new Date(candidate.startDate).getTime() - new Date(e.startDate).getTime()) / 86400000
    );
    if (daysApart <= 5 && titleSimilarity(candidate.title, e.title) > 0.85) return e;
  }
  return null;
}

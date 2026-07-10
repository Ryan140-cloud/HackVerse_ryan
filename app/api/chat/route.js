// POST /api/chat  —  streams a hackathon-aware reply from Verse (the HackVerse AI).
// Uses the Emergent Universal LLM Key via the official Node client.

import { NextResponse } from 'next/server';
import { LlmChat, UserMessage } from 'emergentintegrations';
import { dbGetActive } from '@/lib/data/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are "Verse", the AI co-pilot for HackVerse — a platform that helps students discover hackathons.

Rules:
- Be concise, warm, and helpful. Prefer bullet points and short sentences.
- When the user asks for hackathons, use ONLY the "Live hackathon catalogue" JSON provided in the user's message as your factual source. Do NOT invent hackathons.
- Recommend at most 3 hackathons at a time, and cite the title + a very short reason.
- If no live catalogue is provided or nothing matches, say so honestly and suggest broader filters.
- Never leak the raw JSON back to the user — just weave the insights into your reply.
- If the question is unrelated to hackathons, answer briefly and steer back to HackVerse.`;

function pickCatalogueRows(list, limit = 40) {
  // Trim the catalogue to keep prompt tokens low.
  return list.slice(0, limit).map((h) => ({
    title: h.title,
    slug: h.slug,
    status: h.status,
    startDate: h.startDate,
    endDate: h.endDate,
    registerBy: h.registerBy,
    prizePool: h.prizePool,
    prizeValue: h.prizeValue,
    category: h.category,
    mode: h.mode,
    location: h.location,
    tags: h.tags,
    participants: h.participants,
    featured: h.featured,
    trending: h.trending,
    source: h.source,
    sourceUrl: h.sourceUrl,
  }));
}

function pickRecommendations(query, catalogue, prefs) {
  // Simple relevance ranking to attach as "hackathons" cards even if the LLM
  // does not explicitly reference them. Prioritises ongoing + prize + text
  // match + category preference.
  const q = String(query || '').toLowerCase();
  const wantsLive = /(live|ongoing|right now|happening)/i.test(q);
  const wantsBigPrize = /(prize|money|reward|biggest|highest)/i.test(q);
  const wantsBeginner = /(beginner|first|new|starter|noob)/i.test(q);

  const scored = catalogue.map((h) => {
    let score = 0;
    const hay = `${h.title} ${h.category} ${(h.tags || []).join(' ')} ${(h.themes || []).join(' ')} ${h.location}`.toLowerCase();
    if (q && hay.includes(q)) score += 5;
    if (wantsLive && h.status === 'ongoing') score += 6;
    if (wantsBigPrize) score += (h.prizeValue || 0) / 20000;
    if (wantsBeginner && (h.tags || []).some((t) => /beginner|community/i.test(t))) score += 4;
    if (prefs?.categories?.includes?.(h.category)) score += 3;
    if (h.trending) score += 1;
    return { h, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((s) => s.score > 0)
    .map((s) => ({
      id: s.h.id || s.h.slug,
      title: s.h.title,
      sourceUrl: s.h.sourceUrl,
    }));
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = (body?.message || '').toString().trim();
    const sessionId = (body?.sessionId || 'anon').toString();
    const prefs = body?.prefs || {};
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const apiKey = process.env.EMERGENT_LLM_KEY;
    if (!apiKey) {
      return NextResponse.json({
        text:
          "I'm not connected to the AI backend yet. Please ask an admin to set the EMERGENT_LLM_KEY environment variable.",
      });
    }

    // Load the live hackathon catalogue so the LLM has grounded context.
    let catalogue = [];
    try {
      catalogue = await dbGetActive();
    } catch {
      catalogue = [];
    }

    const contextPayload = {
      user_prefs: {
        skills: prefs.skills || [],
        categories: prefs.categories || [],
        technologies: prefs.technologies || [],
      },
      catalogue: pickCatalogueRows(catalogue, 40),
    };

    const chat = new LlmChat(apiKey, sessionId, SYSTEM_PROMPT)
      .withModel('openai', 'gpt-4o-mini')
      .withParams({ temperature: 0.4, max_tokens: 380 });

    const userText =
      `USER QUESTION:\n${message}\n\n` +
      `Live hackathon catalogue (JSON, hidden from user):\n${JSON.stringify(contextPayload)}`;

    const reply = await chat.sendMessage(new UserMessage({ text: userText }));

    // Attach top 3 relevant hackathons as clickable cards.
    const hackathons = pickRecommendations(message, catalogue, prefs);

    return NextResponse.json({
      text: typeof reply === 'string' ? reply : String(reply ?? ''),
      hackathons,
      model: 'openai/gpt-4o-mini',
    });
  } catch (e) {
    console.error('[chat] error:', e);
    return NextResponse.json(
      {
        text:
          "Verse is having a rough moment — please try again in a second. If this keeps happening, ping an admin.",
        error: String(e?.message || e),
      },
      { status: 200 }
    );
  }
}

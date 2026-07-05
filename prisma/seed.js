/* eslint-disable no-console */
// Seed HackVerse with categories, organizers, hackathons, and an admin user.
// Idempotent: uses upsert where possible so re-runs are safe.

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DAY_MS = 86400000;
const addDays = (n) => new Date(Date.now() + n * DAY_MS);

const CATEGORIES = [
  { slug: 'ai-ml', name: 'AI & ML', emoji: '🤖', color: 'from-fuchsia-500 to-purple-600' },
  { slug: 'web3', name: 'Web3', emoji: '⛓️', color: 'from-amber-500 to-orange-600' },
  { slug: 'fintech', name: 'FinTech', emoji: '💳', color: 'from-emerald-500 to-teal-600' },
  { slug: 'healthtech', name: 'HealthTech', emoji: '🩺', color: 'from-rose-500 to-pink-600' },
  { slug: 'climate', name: 'Climate', emoji: '🌍', color: 'from-green-500 to-emerald-600' },
  { slug: 'gaming', name: 'Gaming', emoji: '🎮', color: 'from-indigo-500 to-blue-600' },
  { slug: 'hardware', name: 'Hardware', emoji: '🔧', color: 'from-slate-500 to-zinc-700' },
  { slug: 'space', name: 'Space', emoji: '🚀', color: 'from-sky-500 to-cyan-600' },
];

const ORGANIZERS = [
  { slug: 'futurestack', name: 'FutureStack', country: 'US', verified: true },
  { slug: 'nyu-tandon', name: 'NYU Tandon', country: 'US', verified: true },
  { slug: 'devfolio', name: 'Devfolio', country: 'IN', verified: true },
  { slug: 'unstop', name: 'Unstop', country: 'IN', verified: true },
  { slug: 'ethglobal', name: 'ETHGlobal', country: 'Global', verified: true },
  { slug: 'nasa', name: 'NASA', country: 'US', verified: true },
  { slug: 'harvard', name: 'Harvard University', country: 'US', verified: true },
  { slug: 'gov-india', name: 'Government of India', country: 'IN', verified: true },
  { slug: 'upenn', name: 'UPenn', country: 'US', verified: true },
  { slug: 'google', name: 'Google', country: 'US', verified: true },
  { slug: 'stanford', name: 'Stanford University', country: 'US', verified: true },
  { slug: 'lablab', name: 'lablab.ai', country: 'Global', verified: true },
  { slug: 'mit', name: 'MIT', country: 'US', verified: true },
  { slug: 'openai', name: 'OpenAI', country: 'US', verified: true },
];

// Base hackathon seed — dates as offsets from today (self-refreshing on every seed run).
const HACKS = [
  { slug: 'hack-the-future', title: 'Hack the Future', desc: 'A 48-hour global hackathon for students building the next generation of AI-native tools.', source: 'Devpost', url: 'https://devpost.com', banner: 'https://images.pexels.com/photos/34212916/pexels-photo-34212916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', location: 'Online', mode: 'ONLINE', off: 12, dur: 3, reg: 2, pool: '$50,000', pv: 50000, tags: ['AI', 'Web', 'Beginner Friendly'], themes: ['Generative AI', 'Developer Tools'], cat: 'ai-ml', org: 'futurestack', ppl: 4820, feat: true, trend: true },
  { slug: 'hacknyu-summer-sprint', title: 'HackNYU Summer Sprint', desc: "NYU's flagship student hackathon returns this summer with climate, healthtech and fintech tracks.", source: 'MLH', url: 'https://mlh.io', banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop', location: 'New York, USA', mode: 'HYBRID', off: -1, dur: 3, reg: 1, pool: '$25,000', pv: 25000, tags: ['Climate', 'HealthTech', 'FinTech'], themes: ['Sustainability', 'Wellbeing'], cat: 'climate', org: 'nyu-tandon', ppl: 1200, feat: true, trend: true },
  { slug: 'devfolio-buildathon-x', title: 'Devfolio Buildathon X', desc: "India's largest asynchronous hackathon for indie builders and student teams.", source: 'Devfolio', url: 'https://devfolio.co', banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80&auto=format&fit=crop', location: 'Bengaluru, India', mode: 'HYBRID', off: 20, dur: 70, reg: 6, pool: '₹15 Lakhs', pv: 18000, tags: ['Web3', 'DeFi', 'Open Source'], themes: ['Blockchain', 'Payments'], cat: 'web3', org: 'devfolio', ppl: 8900, feat: false, trend: true },
  { slug: 'unstop-innovate', title: 'Unstop Innovate', desc: 'Campus-to-corporate innovation challenge with Fortune 500 sponsors.', source: 'Unstop', url: 'https://unstop.com', banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80&auto=format&fit=crop', location: 'Mumbai, India', mode: 'OFFLINE', off: 45, dur: 3, reg: 10, pool: '₹10 L + Internships', pv: 12000, tags: ['Business', 'Product'], themes: ['Innovation', 'Case Study'], cat: 'fintech', org: 'unstop', ppl: 3400, feat: false, trend: false },
  { slug: 'ethglobal-online', title: 'ETHGlobal Online', desc: 'Month-long virtual Ethereum hackathon with DeFi, ZK, gaming and infra tracks.', source: 'Devpost', url: 'https://devpost.com', banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'ONLINE', off: -5, dur: 30, reg: 0, pool: '$375,000', pv: 375000, tags: ['Web3', 'ZK', 'Gaming'], themes: ['Ethereum', 'Layer 2'], cat: 'web3', org: 'ethglobal', ppl: 12000, feat: true, trend: true },
  { slug: 'nasa-space-apps', title: 'NASA Space Apps Challenge', desc: "World's largest global hackathon. Use NASA's open data.", source: 'MLH', url: 'https://spaceappschallenge.org', banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop', location: 'Global', mode: 'HYBRID', off: 90, dur: 2, reg: 5, pool: 'Global Recognition', pv: 0, tags: ['Space', 'Data', 'Science'], themes: ['Earth Observation'], cat: 'space', org: 'nasa', ppl: 32000, feat: true, trend: true },
  { slug: 'hackharvard', title: 'HackHarvard', desc: "Harvard's premier international hackathon with mentors from Google and Meta.", source: 'MLH', url: 'https://hackharvard.io', banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop', location: 'Cambridge, USA', mode: 'OFFLINE', off: 110, dur: 3, reg: 30, pool: '$30,000', pv: 30000, tags: ['AI', 'HealthTech'], themes: ['Impact'], cat: 'ai-ml', org: 'harvard', ppl: 750, feat: false, trend: false },
  { slug: 'smart-india-hackathon', title: 'Smart India Hackathon', desc: "India's nationwide initiative to solve real problems from ministries.", source: 'Unstop', url: 'https://sih.gov.in', banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop', location: 'Pan India', mode: 'HYBRID', off: 140, dur: 2, reg: 15, pool: '₹1 Crore', pv: 120000, tags: ['Government', 'Social Impact'], themes: ['Public Sector'], cat: 'fintech', org: 'gov-india', ppl: 40000, feat: true, trend: true },
  { slug: 'pennapps-xxv', title: 'PennApps XXV', desc: "The nation's first college hackathon celebrates 25 editions.", source: 'MLH', url: 'https://pennapps.com', banner: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80&auto=format&fit=crop', location: 'Philadelphia, USA', mode: 'OFFLINE', off: 70, dur: 2, reg: 18, pool: '$40,000', pv: 40000, tags: ['Hardware', 'ML'], themes: ['Robotics', 'IoT'], cat: 'hardware', org: 'upenn', ppl: 1100, feat: false, trend: false },
  { slug: 'google-solution-challenge', title: 'Google Solution Challenge', desc: "Solve one of the UN's 17 SDGs using Google technologies.", source: 'Devpost', url: 'https://developers.google.com', banner: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80&auto=format&fit=crop', location: 'Global', mode: 'ONLINE', off: -10, dur: 50, reg: 0, pool: '$3,000/team', pv: 3000, tags: ['SDG', 'Google Cloud'], themes: ['Impact'], cat: 'climate', org: 'google', ppl: 18000, feat: false, trend: false },
  { slug: 'stanford-treehacks', title: 'Stanford TreeHacks', desc: "Stanford's biggest hackathon with mentors from a16z and Sequoia.", source: 'MLH', url: 'https://treehacks.com', banner: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80&auto=format&fit=crop', location: 'Stanford, USA', mode: 'OFFLINE', off: 180, dur: 3, reg: 30, pool: '$45,000', pv: 45000, tags: ['AI', 'Bio', 'FinTech'], themes: ['Frontier Tech'], cat: 'ai-ml', org: 'stanford', ppl: 1600, feat: false, trend: false },
  { slug: 'lablab-ai-weekly', title: 'lablab.ai Weekly Hack', desc: 'A rapid 72-hour AI hackathon every week.', source: 'Devpost', url: 'https://lablab.ai', banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'ONLINE', off: -1, dur: 4, reg: 1, pool: '$5,000 + credits', pv: 5000, tags: ['AI', 'Fast Ship'], themes: ['LLMs', 'Agents'], cat: 'ai-ml', org: 'lablab', ppl: 2400, feat: false, trend: true },
  { slug: 'hackmit', title: 'HackMIT', desc: 'MIT flagship 24-hour hackathon in Cambridge.', source: 'MLH', url: 'https://hackmit.org', banner: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&q=80&auto=format&fit=crop', location: 'Cambridge, USA', mode: 'OFFLINE', off: 75, dur: 2, reg: 20, pool: '$35,000', pv: 35000, tags: ['AI', 'Robotics'], themes: ['Frontier'], cat: 'ai-ml', org: 'mit', ppl: 1200, feat: true, trend: false },
  { slug: 'openai-devday-hack', title: 'OpenAI DevDay Hack', desc: 'Prototype apps on the newest OpenAI APIs. Demo at DevDay live.', source: 'Devpost', url: 'https://openai.com', banner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'ONLINE', off: 100, dur: 5, reg: 2, pool: '$100,000 + credits', pv: 100000, tags: ['AI', 'Agents', 'LLM'], themes: ['GPT', 'Realtime'], cat: 'ai-ml', org: 'openai', ppl: 22000, feat: true, trend: true },
];

async function main() {
  console.log('🌱 Seeding HackVerse...');

  // 1. Categories
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, emoji: c.emoji, color: c.color },
    });
  }
  console.log(`✓ ${CATEGORIES.length} categories`);

  // 2. Organizers
  for (const o of ORGANIZERS) {
    await prisma.organizer.upsert({
      where: { slug: o.slug },
      create: o,
      update: { name: o.name, country: o.country, verified: o.verified },
    });
  }
  console.log(`✓ ${ORGANIZERS.length} organizers`);

  // 3. Admin user — Ryan Sharma (founder)
  const hashedPassword = await bcrypt.hash('RyanSharma@2025', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'ryan@hackverse.dev' },
    create: {
      name: 'Ryan Sharma',
      email: 'ryan@hackverse.dev',
      hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      location: 'Ambala Cantt, Haryana, India',
      bio: 'Founder & CEO of HackVerse.',
    },
    update: { role: 'ADMIN' },
  });
  console.log(`✓ Admin user: ${admin.email}  (temp password: RyanSharma@2025)`);

  // 4. Hackathons
  const cats = await prisma.category.findMany();
  const orgs = await prisma.organizer.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  const orgMap = Object.fromEntries(orgs.map((o) => [o.slug, o.id]));

  let created = 0;
  for (const h of HACKS) {
    const start = addDays(h.off);
    const end = addDays(h.off + h.dur);
    const regBy = addDays(h.off - h.reg);
    await prisma.hackathon.upsert({
      where: { slug: h.slug },
      create: {
        slug: h.slug,
        title: h.title,
        description: h.desc,
        source: h.source,
        sourceUrl: h.url,
        bannerUrl: h.banner,
        location: h.location,
        mode: h.mode,
        startDate: start,
        endDate: end,
        registerBy: regBy,
        prizePool: h.pool,
        prizeValue: h.pv,
        tags: h.tags,
        themes: h.themes,
        participants: h.ppl,
        featured: h.feat,
        trending: h.trend,
        status: 'APPROVED',
        categoryId: catMap[h.cat],
        organizerId: orgMap[h.org],
      },
      update: {
        startDate: start,
        endDate: end,
        registerBy: regBy,
        featured: h.feat,
        trending: h.trend,
      },
    });
    created += 1;
  }
  console.log(`✓ ${created} hackathons seeded (dates always relative to today)`);

  // 5. Notifications welcoming the admin
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, type: 'SYSTEM', title: 'Welcome to HackVerse', body: 'Your admin console is ready.', href: '/admin' },
      { userId: admin.id, type: 'RECOMMENDATION', title: '3 hackathons are live right now', body: 'Check the dashboard to see live events.', href: '/dashboard' },
    ],
    skipDuplicates: true,
  }).catch(() => {});
  console.log('✓ Welcome notifications');

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

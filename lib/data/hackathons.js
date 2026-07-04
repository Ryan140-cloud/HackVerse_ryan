// ---------------------------------------------------------------------------
// HackVerse dataset \u2014 Date-relative, self-refreshing.
// ---------------------------------------------------------------------------
// All hackathon dates are defined as offsets from *today* (in days). Whenever
// this module is loaded (on every server request in Next.js dev/prod), the
// dates are recomputed \u2014 so the platform NEVER shows expired data.
//
// Consumers should prefer the getters:
//   getHackathons()  \u2014 fresh snapshot with computed dates + status
//   getActive()      \u2014 non-expired only  (upcoming + ongoing)
//   getUpcoming()    \u2014 upcoming only
//   getOngoing()     \u2014 live only
//   getFeatured()    \u2014 active + featured, sorted by nearest deadline
//   getTrending()    \u2014 active + trending, sorted by popularity
//
// A `HACKATHONS` snapshot is still exported for legacy imports (admin,
// chatbot, etc.).
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  { slug: 'ai-ml', name: 'AI & ML', emoji: '\uD83E\uDD16', color: 'from-fuchsia-500 to-purple-600', count: 214 },
  { slug: 'web3', name: 'Web3', emoji: '\u26D3\uFE0F', color: 'from-amber-500 to-orange-600', count: 148 },
  { slug: 'fintech', name: 'FinTech', emoji: '\uD83D\uDCB3', color: 'from-emerald-500 to-teal-600', count: 92 },
  { slug: 'healthtech', name: 'HealthTech', emoji: '\uD83E\uDE7A', color: 'from-rose-500 to-pink-600', count: 77 },
  { slug: 'climate', name: 'Climate', emoji: '\uD83C\uDF0D', color: 'from-green-500 to-emerald-600', count: 63 },
  { slug: 'gaming', name: 'Gaming', emoji: '\uD83C\uDFAE', color: 'from-indigo-500 to-blue-600', count: 88 },
  { slug: 'hardware', name: 'Hardware', emoji: '\uD83D\uDD27', color: 'from-slate-500 to-zinc-700', count: 44 },
  { slug: 'space', name: 'Space', emoji: '\uD83D\uDE80', color: 'from-sky-500 to-cyan-600', count: 21 },
];

export const SOURCES = ['Devpost', 'Devfolio', 'MLH', 'Unstop'];
export const MODES = ['Online', 'Hybrid', 'Offline'];
export const STATUSES = ['upcoming', 'ongoing', 'ended'];

export const STATS = [
  { value: '1,200+', label: 'Hackathons indexed' },
  { value: '50+', label: 'Countries covered' },
  { value: '$8M+', label: 'Total prize pool' },
  { value: '25k+', label: 'Students onboard' },
];

// -------- Base seed \u2014 all dates as OFFSETS FROM TODAY --------
// startOffsetDays: negative = started N days ago  |  positive = starts in N days
// durationDays:    length of event
// registerLeadDays: how many days BEFORE the event the registration closes
// ---------------------------------------------------------------
const BASE = [
  { id: '1', slug: 'hack-the-future', title: 'Hack the Future', description: 'A 48-hour global hackathon for students building the next generation of AI-native tools. Mentors from OpenAI, Anthropic, and Vercel.', source: 'Devpost', sourceUrl: 'https://devpost.com', bannerUrl: 'https://images.pexels.com/photos/34212916/pexels-photo-34212916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', location: 'Online', mode: 'Online', startOffsetDays: 12, durationDays: 3, registerLeadDays: 2, prizePool: '$50,000', prizeValue: 50000, tags: ['AI', 'Web', 'Beginner Friendly'], themes: ['Generative AI', 'Developer Tools'], category: 'ai-ml', organizer: 'FutureStack', participants: 4820, featured: true, trending: true },
  { id: '2', slug: 'hacknyu-summer-sprint', title: 'HackNYU Summer Sprint', description: "NYU's flagship student hackathon returns this summer with tracks on climate, healthtech and fintech. Free swag and workshops.", source: 'MLH', sourceUrl: 'https://mlh.io', bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop', location: 'New York, USA', mode: 'Hybrid', startOffsetDays: -1, durationDays: 3, registerLeadDays: 1, prizePool: '$25,000', prizeValue: 25000, tags: ['Climate', 'HealthTech', 'FinTech'], themes: ['Sustainability', 'Wellbeing'], category: 'climate', organizer: 'NYU Tandon', participants: 1200, featured: true, trending: true },
  { id: '3', slug: 'devfolio-buildathon-x', title: 'Devfolio Buildathon X', description: "Ten weeks. Ten challenges. One winner. India's largest asynchronous hackathon for indie builders and student teams.", source: 'Devfolio', sourceUrl: 'https://devfolio.co', bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80&auto=format&fit=crop', location: 'Bengaluru, India', mode: 'Hybrid', startOffsetDays: 20, durationDays: 70, registerLeadDays: 6, prizePool: '\u20B915 Lakhs', prizeValue: 18000, tags: ['Web3', 'DeFi', 'Open Source'], themes: ['Blockchain', 'Payments'], category: 'web3', organizer: 'Devfolio', participants: 8900, featured: false, trending: true },
  { id: '4', slug: 'unstop-innovate', title: 'Unstop Innovate', description: 'A campus-to-corporate innovation challenge featuring Fortune 500 sponsors. Solve real business problems and win internships.', source: 'Unstop', sourceUrl: 'https://unstop.com', bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80&auto=format&fit=crop', location: 'Mumbai, India', mode: 'Offline', startOffsetDays: 45, durationDays: 3, registerLeadDays: 10, prizePool: '\u20B910 L + Internships', prizeValue: 12000, tags: ['Business', 'Product', 'Consulting'], themes: ['Innovation', 'Case Study'], category: 'fintech', organizer: 'Unstop', participants: 3400, featured: false, trending: false },
  { id: '5', slug: 'ethglobal-online', title: 'ETHGlobal Online', description: 'A month-long virtual Ethereum hackathon with prizes across DeFi, ZK, gaming, and infrastructure tracks.', source: 'Devpost', sourceUrl: 'https://devpost.com', bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: -5, durationDays: 30, registerLeadDays: 0, prizePool: '$375,000', prizeValue: 375000, tags: ['Web3', 'ZK', 'Gaming'], themes: ['Ethereum', 'Layer 2'], category: 'web3', organizer: 'ETHGlobal', participants: 12000, featured: true, trending: true },
  { id: '6', slug: 'nasa-space-apps', title: 'NASA Space Apps Challenge', description: "The world's largest global hackathon. Use NASA's open data to build solutions for challenges on Earth and in space.", source: 'MLH', sourceUrl: 'https://spaceappschallenge.org', bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop', location: 'Global', mode: 'Hybrid', startOffsetDays: 90, durationDays: 2, registerLeadDays: 5, prizePool: 'Global Recognition', prizeValue: 0, tags: ['Space', 'Data', 'Science'], themes: ['Earth Observation', 'Astronomy'], category: 'space', organizer: 'NASA', participants: 32000, featured: true, trending: true },
  { id: '7', slug: 'hackharvard', title: 'HackHarvard', description: "Harvard's premier international hackathon. Meet mentors from Google, Meta, and top VCs while building your dream project.", source: 'MLH', sourceUrl: 'https://hackharvard.io', bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop', location: 'Cambridge, USA', mode: 'Offline', startOffsetDays: 110, durationDays: 3, registerLeadDays: 30, prizePool: '$30,000', prizeValue: 30000, tags: ['AI', 'HealthTech', 'FinTech'], themes: ['Impact', 'Research'], category: 'ai-ml', organizer: 'Harvard University', participants: 750, featured: false, trending: false },
  { id: '8', slug: 'smart-india-hackathon', title: 'Smart India Hackathon', description: "Government of India's nationwide initiative to provide students a platform to solve real problems from ministries and industries.", source: 'Unstop', sourceUrl: 'https://sih.gov.in', bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop', location: 'Pan India', mode: 'Hybrid', startOffsetDays: 140, durationDays: 2, registerLeadDays: 15, prizePool: '\u20B91 Crore', prizeValue: 120000, tags: ['Government', 'Social Impact'], themes: ['Public Sector', 'Innovation'], category: 'fintech', organizer: 'Government of India', participants: 40000, featured: true, trending: true },
  { id: '9', slug: 'pennapps-xxv', title: 'PennApps XXV', description: "The nation's first college hackathon celebrates 25 editions. Hardware labs, ML APIs, and a 36-hour build sprint.", source: 'MLH', sourceUrl: 'https://pennapps.com', bannerUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80&auto=format&fit=crop', location: 'Philadelphia, USA', mode: 'Offline', startOffsetDays: 70, durationDays: 2, registerLeadDays: 18, prizePool: '$40,000', prizeValue: 40000, tags: ['Hardware', 'ML', 'Systems'], themes: ['Robotics', 'IoT'], category: 'hardware', organizer: 'UPenn', participants: 1100, featured: false, trending: false },
  { id: '10', slug: 'google-solution-challenge', title: 'Google Solution Challenge', description: "Solve one of the UN's 17 Sustainable Development Goals using Google technologies. Open to student developer clubs worldwide.", source: 'Devpost', sourceUrl: 'https://developers.google.com/community/gdsc-solution-challenge', bannerUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80&auto=format&fit=crop', location: 'Global', mode: 'Online', startOffsetDays: -10, durationDays: 50, registerLeadDays: 0, prizePool: '$3,000/team', prizeValue: 3000, tags: ['SDG', 'Google Cloud', 'Android'], themes: ['Impact', 'Sustainability'], category: 'climate', organizer: 'Google', participants: 18000, featured: false, trending: false },
  { id: '11', slug: 'stanford-treehacks', title: 'Stanford TreeHacks', description: "Stanford's biggest hackathon. Build, break and iterate over 36 hours with mentors from a16z, Sequoia, and top startups.", source: 'MLH', sourceUrl: 'https://treehacks.com', bannerUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80&auto=format&fit=crop', location: 'Stanford, USA', mode: 'Offline', startOffsetDays: 180, durationDays: 3, registerLeadDays: 30, prizePool: '$45,000', prizeValue: 45000, tags: ['AI', 'Bio', 'FinTech'], themes: ['Frontier Tech'], category: 'ai-ml', organizer: 'Stanford University', participants: 1600, featured: false, trending: false },
  { id: '12', slug: 'lablab-ai-weekly', title: 'lablab.ai Weekly Hack', description: 'A rapid 72-hour AI hackathon happening every week. Choose a stack, ship a demo, win credits and grants.', source: 'Devpost', sourceUrl: 'https://lablab.ai', bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: -1, durationDays: 4, registerLeadDays: 1, prizePool: '$5,000 + credits', prizeValue: 5000, tags: ['AI', 'Fast Ship'], themes: ['LLMs', 'Agents'], category: 'ai-ml', organizer: 'lablab.ai', participants: 2400, featured: false, trending: true },
  { id: '13', slug: 'global-game-dev-jam', title: 'Global Game Dev Jam', description: '72 hours. One theme. Build a playable game and get feedback from indie studio veterans and Steam publishers.', source: 'Devpost', sourceUrl: 'https://itch.io', bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: 25, durationDays: 3, registerLeadDays: 1, prizePool: '$15,000', prizeValue: 15000, tags: ['Gaming', 'Unity', 'Godot'], themes: ['Indie', 'Multiplayer'], category: 'gaming', organizer: 'GameDev.tv', participants: 5200, featured: false, trending: true },
  { id: '14', slug: 'medhack-berlin', title: 'MedHack Berlin', description: 'Europe premier healthtech hackathon. Prototype a diagnostic, therapeutic or medtech solution alongside doctors and researchers.', source: 'Devfolio', sourceUrl: 'https://medhack.eu', bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80&auto=format&fit=crop', location: 'Berlin, Germany', mode: 'Hybrid', startOffsetDays: 60, durationDays: 3, registerLeadDays: 14, prizePool: '\u20AC20,000', prizeValue: 22000, tags: ['HealthTech', 'Bio', 'AI'], themes: ['Diagnostics', 'Wearables'], category: 'healthtech', organizer: 'Charit\u00E9', participants: 640, featured: false, trending: false },
  { id: '15', slug: 'climate-hack-io', title: 'Climate Hack IO', description: 'Use satellite data and ML to model climate risk. Cash prizes, GPU credits and a fast-track for Y Combinator interviews.', source: 'Devpost', sourceUrl: 'https://climatehack.io', bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: 35, durationDays: 30, registerLeadDays: 1, prizePool: '$60,000 + GPU', prizeValue: 60000, tags: ['Climate', 'ML', 'Satellite'], themes: ['Sustainability'], category: 'climate', organizer: 'Open Climate Fix', participants: 3100, featured: true, trending: true },
  { id: '16', slug: 'hackmit', title: 'HackMIT', description: 'MIT flagship 24-hour hackathon returns to Cambridge. First-timer friendly with dedicated mentors and hardware lab access.', source: 'MLH', sourceUrl: 'https://hackmit.org', bannerUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&q=80&auto=format&fit=crop', location: 'Cambridge, USA', mode: 'Offline', startOffsetDays: 75, durationDays: 2, registerLeadDays: 20, prizePool: '$35,000', prizeValue: 35000, tags: ['AI', 'Robotics', 'Systems'], themes: ['Frontier'], category: 'ai-ml', organizer: 'MIT', participants: 1200, featured: true, trending: false },
  { id: '17', slug: 'defi-summer-jam', title: 'DeFi Summer Jam', description: 'Build the next generation of decentralized finance apps on Base, Solana or Aptos. Grants from top VCs on tap.', source: 'Devfolio', sourceUrl: 'https://devfolio.co', bannerUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: -3, durationDays: 30, registerLeadDays: 0, prizePool: '$120,000', prizeValue: 120000, tags: ['Web3', 'DeFi'], themes: ['Stablecoins', 'Yield'], category: 'web3', organizer: 'ETHIndia', participants: 5400, featured: false, trending: true },
  { id: '18', slug: 'hack-the-north', title: 'Hack the North', description: 'Canada largest hackathon. 1,500 students, 36 hours, first-class travel reimbursements for international attendees.', source: 'MLH', sourceUrl: 'https://hackthenorth.com', bannerUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop', location: 'Waterloo, Canada', mode: 'Offline', startOffsetDays: 66, durationDays: 3, registerLeadDays: 28, prizePool: 'CAD $50,000', prizeValue: 37000, tags: ['AI', 'Web', 'Hardware'], themes: ['General'], category: 'ai-ml', organizer: 'University of Waterloo', participants: 1500, featured: false, trending: false },
  { id: '19', slug: 'openai-devday-hack', title: 'OpenAI DevDay Hack', description: 'Prototype apps on top of the freshly launched OpenAI APIs. Best submissions get invited to demo at DevDay live.', source: 'Devpost', sourceUrl: 'https://openai.com', bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: 100, durationDays: 5, registerLeadDays: 2, prizePool: '$100,000 + credits', prizeValue: 100000, tags: ['AI', 'Agents', 'LLM'], themes: ['GPT', 'Realtime'], category: 'ai-ml', organizer: 'OpenAI', participants: 22000, featured: true, trending: true },
  { id: '20', slug: 'iot-makers-fest', title: 'IoT Makers Fest', description: 'A hardware-first hackathon at the Shenzhen Maker Space. Free parts kit, PCB fabrication and mentor sessions with hardware VCs.', source: 'Unstop', sourceUrl: 'https://unstop.com', bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop', location: 'Shenzhen, China', mode: 'Offline', startOffsetDays: 120, durationDays: 3, registerLeadDays: 23, prizePool: '$20,000', prizeValue: 20000, tags: ['Hardware', 'IoT'], themes: ['Firmware', 'Sensors'], category: 'hardware', organizer: 'Shenzhen Makers', participants: 500, featured: false, trending: false },
  { id: '21', slug: 'space-x-hackday', title: 'Space X HackDay', description: 'Rocket-science-adjacent hacks welcome. Build tools for spacecraft telemetry, orbital planning, and ground-station comms.', source: 'Devpost', sourceUrl: 'https://devpost.com', bannerUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&q=80&auto=format&fit=crop', location: 'Los Angeles, USA', mode: 'Hybrid', startOffsetDays: 200, durationDays: 3, registerLeadDays: 14, prizePool: '$25,000', prizeValue: 25000, tags: ['Space', 'Systems'], themes: ['Orbital', 'Telemetry'], category: 'space', organizer: 'Space Ventures', participants: 380, featured: false, trending: false },
  { id: '22', slug: 'unity-mega-jam', title: 'Unity Mega Jam', description: 'The biggest Unity engine game jam of the year. Prizes include Unity Pro licenses and a spot at the GDC showcase.', source: 'Devpost', sourceUrl: 'https://itch.io', bannerUrl: 'https://images.unsplash.com/photo-1580327332925-a10e6cb11baa?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: 40, durationDays: 7, registerLeadDays: 1, prizePool: '$30,000', prizeValue: 30000, tags: ['Gaming', 'Unity'], themes: ['3D', 'AR'], category: 'gaming', organizer: 'Unity Foundation', participants: 8400, featured: false, trending: true },
  { id: '23', slug: 'kaggle-analytics-cup', title: 'Kaggle Analytics Cup', description: 'A structured, notebook-based data science competition with a $75k prize pool and access to real-world enterprise datasets.', source: 'Devpost', sourceUrl: 'https://kaggle.com', bannerUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80&auto=format&fit=crop', location: 'Online', mode: 'Online', startOffsetDays: -7, durationDays: 60, registerLeadDays: 0, prizePool: '$75,000', prizeValue: 75000, tags: ['Data', 'ML', 'Analytics'], themes: ['Kaggle'], category: 'ai-ml', organizer: 'Kaggle', participants: 14000, featured: false, trending: true },
  { id: '24', slug: 'women-who-hack', title: 'Women Who Hack', description: 'A 48-hour hackathon celebrating women and non-binary students in tech. Mentors from GitHub, Figma and Stripe.', source: 'MLH', sourceUrl: 'https://mlh.io', bannerUrl: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1200&q=80&auto=format&fit=crop', location: 'London, UK', mode: 'Hybrid', startOffsetDays: 55, durationDays: 3, registerLeadDays: 20, prizePool: '\u00A315,000', prizeValue: 19000, tags: ['Community', 'Web'], themes: ['Diversity', 'Impact'], category: 'healthtech', organizer: 'Code First Girls', participants: 900, featured: true, trending: false },
];

const DAY_MS = 86400000;

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

// Compute a hackathon's live status + serialised dates given a reference `now`.
function hydrate(item, now) {
  const start = addDays(now, item.startOffsetDays);
  const end = addDays(start, item.durationDays);
  const registerBy = addDays(start, -item.registerLeadDays);
  const status = end < now ? 'ended' : start <= now ? 'ongoing' : 'upcoming';

  // Strip the offset fields \u2014 downstream code should not see them.
  const { startOffsetDays, durationDays, registerLeadDays, ...rest } = item;

  return {
    ...rest,
    startDate: isoDate(start),
    endDate: isoDate(end),
    registerBy: isoDate(registerBy),
    status,
    // Millisecond timestamps for fast sorting.
    _startMs: start.getTime(),
    _endMs: end.getTime(),
    _registerMs: registerBy.getTime(),
  };
}

// ---- Public getters ----

export function getHackathons(now = new Date()) {
  return BASE.map((h) => hydrate(h, now));
}

export function getActive(now = new Date()) {
  return getHackathons(now).filter((h) => h.status !== 'ended');
}

export function getUpcoming(now = new Date()) {
  return getActive(now)
    .filter((h) => h.status === 'upcoming')
    .sort((a, b) => a._startMs - b._startMs);
}

export function getOngoing(now = new Date()) {
  return getActive(now).filter((h) => h.status === 'ongoing');
}

export function getFeatured(now = new Date(), limit) {
  const list = getActive(now)
    .filter((h) => h.featured)
    .sort((a, b) => a._registerMs - b._registerMs);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export function getTrending(now = new Date(), limit) {
  const list = getActive(now)
    .filter((h) => h.trending)
    .sort((a, b) => b.participants - a.participants);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export function getByCategory(slug, now = new Date()) {
  return getActive(now).filter((h) => h.category === slug);
}

export function getBySlug(slug, now = new Date()) {
  return getHackathons(now).find((h) => h.slug === slug) || null;
}

// Legacy snapshot for modules that still import a static array.
// Recomputed on every module load \u2014 which in Next.js dev/prod happens per
// server start, keeping dates always relative-ish. Prefer getters for freshness.
export const HACKATHONS = getActive();

// ---- Testimonials / FAQs (unchanged, exported here for a single import path) ----

export const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'CS Student \u00b7 IIT Bombay', avatar: 'https://i.pravatar.cc/120?img=47', quote: 'HackVerse helped me discover three hackathons I would have missed otherwise. Won my first prize at ETHIndia thanks to a deadline reminder.' },
  { name: 'Marcus Chen', role: 'Engineering \u00b7 UC Berkeley', avatar: 'https://i.pravatar.cc/120?img=13', quote: 'Finally, one dashboard instead of ten tabs. The filters are lightning fast and the design is a mile ahead of every alternative.' },
  { name: 'Ana Souza', role: 'Design \u00b7 USP', avatar: 'https://i.pravatar.cc/120?img=32', quote: 'I found a global design-focused hackathon on HackVerse that led to my first internship offer. This platform is a game changer for students.' },
  { name: 'Kenji Watanabe', role: 'AI Research \u00b7 Todai', avatar: 'https://i.pravatar.cc/120?img=68', quote: 'The trending section surfaces the highest-signal AI hackathons every week. I use HackVerse before checking Twitter.' },
  { name: 'Sofia Rossi', role: 'Startup Founder', avatar: 'https://i.pravatar.cc/120?img=25', quote: 'We hired two of our first three engineers from a hackathon we listed here. The audience quality is unmatched.' },
  { name: 'Amir Hassan', role: 'Full-stack \u00b7 TUM', avatar: 'https://i.pravatar.cc/120?img=15', quote: "HackVerse's calendar view saved my exam-week sanity. I know exactly which weekends I can afford to hack." },
];

export const FAQS = [
  { q: 'Is HackVerse free for students?', a: 'Yes. HackVerse is free for individual students and always will be. We may introduce optional paid features for organizations, but discovery stays free.' },
  { q: 'Where do you source hackathons from?', a: 'We aggregate public listings from Devpost, Devfolio, MLH, Unstop and a growing list of university and community platforms. All source links point back to the original listing.' },
  { q: 'How often is the list updated?', a: 'Dates auto-recompute against today on every request, and our crawlers refresh listings every 60 minutes. Registration deadlines and live states appear within the hour.' },
  { q: 'Can I submit a hackathon I am organizing?', a: 'Absolutely. Use the Contact page to submit your event and we will index it within 24 hours after a quick review.' },
  { q: 'Will you notify me before deadlines?', a: 'Once you sign in, you can bookmark hackathons and receive email or Discord reminders 72h, 24h and 1h before deadlines.' },
  { q: 'Is HackVerse open source?', a: 'Parts of HackVerse (our scrapers and UI kit) are moving to open source next quarter. Star our GitHub to follow along.' },
];

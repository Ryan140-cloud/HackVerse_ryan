// Mock data + generators for the admin dashboard.
// When Postgres is wired up, replace these with Prisma queries.

import { HACKATHONS, CATEGORIES } from '@/lib/data/hackathons';

export const ADMIN_USERS = [
  { id: 'u_1', name: 'Ryan Sharma', email: 'ryan@hackverse.dev', role: 'ADMIN', status: 'active', createdAt: '2024-05-12', avatar: null, location: 'Ambala Cantt, IN', hackathons: 42 },
  { id: 'u_2', name: 'Priya Sharma', email: 'priya@iitb.ac.in', role: 'USER', status: 'active', createdAt: '2024-09-01', avatar: 'https://i.pravatar.cc/120?img=47', location: 'Mumbai, IN', hackathons: 12 },
  { id: 'u_3', name: 'Marcus Chen', email: 'marcus@berkeley.edu', role: 'USER', status: 'active', createdAt: '2024-11-11', avatar: 'https://i.pravatar.cc/120?img=13', location: 'Berkeley, US', hackathons: 8 },
  { id: 'u_4', name: 'Ana Souza', email: 'ana@usp.br', role: 'ORGANIZER', status: 'active', createdAt: '2025-01-20', avatar: 'https://i.pravatar.cc/120?img=32', location: 'S\u00E3o Paulo, BR', hackathons: 4 },
  { id: 'u_5', name: 'Kenji Watanabe', email: 'kenji@u-tokyo.jp', role: 'USER', status: 'suspended', createdAt: '2024-08-15', avatar: 'https://i.pravatar.cc/120?img=68', location: 'Tokyo, JP', hackathons: 6 },
  { id: 'u_6', name: 'Sofia Rossi', email: 'sofia@founder.io', role: 'ORGANIZER', status: 'pending', createdAt: '2025-05-30', avatar: 'https://i.pravatar.cc/120?img=25', location: 'Milan, IT', hackathons: 1 },
  { id: 'u_7', name: 'Amir Hassan', email: 'amir@tum.de', role: 'USER', status: 'active', createdAt: '2024-10-04', avatar: 'https://i.pravatar.cc/120?img=15', location: 'Munich, DE', hackathons: 3 },
];

export const ADMIN_ORGANIZERS = [
  { id: 'o_1', name: 'FutureStack', slug: 'futurestack', country: 'US', verified: true, hackathons: 6, ownerEmail: 'ops@futurestack.io' },
  { id: 'o_2', name: 'ETHGlobal', slug: 'ethglobal', country: 'Global', verified: true, hackathons: 4, ownerEmail: 'hi@ethglobal.co' },
  { id: 'o_3', name: 'Devfolio', slug: 'devfolio', country: 'IN', verified: true, hackathons: 12, ownerEmail: 'team@devfolio.co' },
  { id: 'o_4', name: 'MLH', slug: 'mlh', country: 'US', verified: true, hackathons: 18, ownerEmail: 'contact@mlh.io' },
  { id: 'o_5', name: 'Unstop', slug: 'unstop', country: 'IN', verified: true, hackathons: 9, ownerEmail: 'hello@unstop.com' },
  { id: 'o_6', name: 'Charit\u00E9 Berlin', slug: 'charite', country: 'DE', verified: false, hackathons: 2, ownerEmail: 'medhack@charite.de' },
  { id: 'o_7', name: 'Code First Girls', slug: 'code-first-girls', country: 'UK', verified: false, hackathons: 1, ownerEmail: 'events@cfg.uk' },
];

// Attach a review status to each existing hackathon for admin demo purposes.
const STATUS_ROTATION = ['APPROVED', 'APPROVED', 'PENDING', 'APPROVED', 'REJECTED', 'PENDING'];
export const ADMIN_HACKATHONS = HACKATHONS.map((h, i) => ({
  ...h,
  reviewStatus: STATUS_ROTATION[i % STATUS_ROTATION.length],
  submittedBy: ADMIN_USERS[(i + 1) % ADMIN_USERS.length].email,
  submittedAt: `2025-0${(i % 6) + 1}-1${(i % 9) + 1}`,
}));

export const ADMIN_CATEGORIES = CATEGORIES.map((c) => ({
  ...c,
  createdAt: '2024-08-15',
  approved: true,
}));

export const AUDIT_LOGS = [
  { id: 'a_1', at: '2025-06-04T18:42:00Z', actor: 'ryan@hackverse.dev', action: 'APPROVE', entity: 'Hackathon', target: 'Hack the Future 2025' },
  { id: 'a_2', at: '2025-06-04T15:10:00Z', actor: 'ryan@hackverse.dev', action: 'REJECT', entity: 'Hackathon', target: 'Sketchy Coin Drop' },
  { id: 'a_3', at: '2025-06-04T12:24:00Z', actor: 'ana@usp.br', action: 'CREATE', entity: 'Hackathon', target: 'S\u00E3o Paulo AI Sprint' },
  { id: 'a_4', at: '2025-06-03T21:07:00Z', actor: 'ryan@hackverse.dev', action: 'UPDATE', entity: 'Category', target: 'AI & ML' },
  { id: 'a_5', at: '2025-06-03T09:00:00Z', actor: 'system', action: 'CRAWL', entity: 'Pipeline', target: 'Devpost sync' },
  { id: 'a_6', at: '2025-06-02T16:50:00Z', actor: 'ryan@hackverse.dev', action: 'SUSPEND', entity: 'User', target: 'kenji@u-tokyo.jp' },
  { id: 'a_7', at: '2025-06-02T10:15:00Z', actor: 'ryan@hackverse.dev', action: 'VERIFY', entity: 'Organizer', target: 'ETHGlobal' },
  { id: 'a_8', at: '2025-06-01T22:03:00Z', actor: 'system', action: 'DEDUPE', entity: 'Pipeline', target: '12 duplicates removed' },
];

export const ANALYTICS = {
  usersOverTime: [
    { month: 'Jan', users: 320 },
    { month: 'Feb', users: 480 },
    { month: 'Mar', users: 690 },
    { month: 'Apr', users: 940 },
    { month: 'May', users: 1420 },
    { month: 'Jun', users: 2110 },
  ],
  hackathonsBySource: [
    { name: 'Devpost', value: 46, color: 'hsl(262 83% 58%)' },
    { name: 'Devfolio', value: 32, color: 'hsl(199 89% 48%)' },
    { name: 'MLH', value: 28, color: 'hsl(340 82% 62%)' },
    { name: 'Unstop', value: 18, color: 'hsl(43 74% 66%)' },
  ],
  registrationsByCategory: [
    { name: 'AI & ML', value: 5200 },
    { name: 'Web3', value: 3100 },
    { name: 'FinTech', value: 1900 },
    { name: 'HealthTech', value: 1400 },
    { name: 'Climate', value: 1250 },
    { name: 'Gaming', value: 2100 },
  ],
};

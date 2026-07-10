// ---------------------------------------------------------------------------
// HackVerse — Central site configuration.
// Edit here to update branding across the whole application.
// ---------------------------------------------------------------------------

export const siteConfig = {
  name: 'HackVerse',
  tagline: 'Every hackathon, one universe.',
  description:
    'HackVerse aggregates ongoing and upcoming hackathons from Devpost, Devfolio, MLH, Unstop and more in a single, elegant dashboard for students.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://hackverse.dev',
  founded: 2024,

  founder: {
    name: 'Ryan Sharma',
    role: 'Founder & CEO',
    email: 'ryan@hackverse.dev',
    initials: 'RS',
  },

  owner: 'Ryan Sharma',

  contact: {
    email: 'hello@hackverse.dev',
    supportEmail: 'support@hackverse.dev',
    privacyEmail: 'privacy@hackverse.dev',
    legalEmail: 'legal@hackverse.dev',
    discord: 'discord.gg/hackverse',
  },

  address: {
    line1: 'Ambala Cantt',
    region: 'Haryana',
    country: 'India',
    display: 'Ambala Cantt, Haryana, India',
  },

  socials: {
    github: 'https://github.com/hackverse',
    twitter: 'https://twitter.com/hackverse',
    linkedin: 'https://linkedin.com/company/hackverse',
  },

  team: [
    { name: 'Ryan Sharma', role: 'Founder · Full-stack', emoji: '🚀' },
    { name: 'Aarav Mehta', role: 'Engineering · Backend', emoji: '⚙️' },
    { name: 'Sara Khan', role: 'Design · UX', emoji: '🎨' },
    { name: 'Diego Alvarez', role: 'Data · Scrapers', emoji: '🤖' },
    { name: 'Mei Tanaka', role: 'Community', emoji: '🤝' },
  ],

  copyright: (year = new Date().getFullYear()) =>
    `© ${year} HackVerse by Ryan Sharma. All rights reserved.`,
};

export default siteConfig;

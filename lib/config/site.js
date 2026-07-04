// ---------------------------------------------------------------------------
// HackVerse \u2014 Central site configuration.
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
    { name: 'Ryan Sharma', role: 'Founder \u00B7 Full-stack', emoji: '\uD83D\uDE80' },
    { name: 'Aarav Mehta', role: 'Engineering \u00B7 Backend', emoji: '\u2699\uFE0F' },
    { name: 'Sara Khan', role: 'Design \u00B7 UX', emoji: '\uD83C\uDFA8' },
    { name: 'Diego Alvarez', role: 'Data \u00B7 Scrapers', emoji: '\uD83E\uDD16' },
    { name: 'Mei Tanaka', role: 'Community', emoji: '\uD83E\uDD1D' },
  ],

  copyright: (year = new Date().getFullYear()) =>
    `\u00A9 ${year} HackVerse by Ryan Sharma. All rights reserved.`,
};

export default siteConfig;

// Central registry of ingestion connectors. Add new sources here.
// Each connector implements BaseConnector { fetch(): raw[] }.
//
// The stubs below return an empty array — they are intentionally minimal
// so the pipeline works end-to-end today without hitting third-party APIs.
// Wire them to real endpoints when official access is granted.

import { BaseConnector } from '../base';

class MLHConnector extends BaseConnector {
  static source = 'MLH';
  static label = 'Major League Hacking';
  static official = true;
  async fetch() {
    // Example: https://mlh.io/seasons/2025/events.json (public JSON)
    // Real implementation:
    //   const res = await fetch('https://mlh.io/seasons/2025/events.json', { next: { revalidate: 3600 } });
    //   return await res.json();
    return [];
  }
}

class DevpostConnector extends BaseConnector {
  static source = 'Devpost';
  static label = 'Devpost';
  static official = false;
  async fetch() {
    // Devpost does not expose an official API. When permission is granted,
    // wire a scraper here.
    return [];
  }
}

class DevfolioConnector extends BaseConnector {
  static source = 'Devfolio';
  static label = 'Devfolio';
  static official = false;
  async fetch() { return []; }
}

class ETHGlobalConnector extends BaseConnector {
  static source = 'ETHGlobal';
  static label = 'ETHGlobal';
  static official = false;
  async fetch() { return []; }
}

class NASASpaceAppsConnector extends BaseConnector {
  static source = 'NASA Space Apps';
  static label = 'NASA Space Apps Challenge';
  static official = true;
  async fetch() { return []; }
}

class HackClubConnector extends BaseConnector {
  static source = 'HackClub';
  static label = 'Hack Club';
  static official = true;
  async fetch() { return []; }
}

class GoogleSolutionChallengeConnector extends BaseConnector {
  static source = 'Google Solution Challenge';
  static label = 'Google Solution Challenge';
  static official = true;
  async fetch() { return []; }
}

class SIHConnector extends BaseConnector {
  static source = 'SIH';
  static label = 'Smart India Hackathon';
  static official = true;
  async fetch() { return []; }
}

export const CONNECTORS = [
  MLHConnector,
  DevpostConnector,
  DevfolioConnector,
  ETHGlobalConnector,
  NASASpaceAppsConnector,
  HackClubConnector,
  GoogleSolutionChallengeConnector,
  SIHConnector,
];

export const CONNECTOR_SUMMARY = CONNECTORS.map((c) => ({
  source: c.source,
  label: c.label,
  official: c.official,
}));

// Base contract every ingestion connector must implement.
// A connector talks to ONE upstream source and returns an array of raw
// hackathon objects. Normalization/dedupe/persistence is done by the pipeline.

export class BaseConnector {
  /** @type {string} unique short slug used in DB "source" column */
  static source = 'base';
  /** @type {string} human-readable name */
  static label = 'Base';
  /** @type {boolean} whether the upstream exposes an official API */
  static official = false;

  /**
   * Fetch hackathons from the upstream. Must return an array of raw records.
   * Records will be normalized by the pipeline.
   * @returns {Promise<Array<object>>}
   */
  async fetch() {
    throw new Error('BaseConnector.fetch() must be implemented');
  }

  /**
   * Map an upstream record to HackVerse’s normalized shape:
   *  { title, description, sourceUrl, location, mode, startDate, endDate,
   *    registerBy, prizePool, prizeValue, tags, themes, category, bannerUrl,
   *    organizerName }
   * The constructor of the derived class receives the pipeline context.
   * @param {object} raw
   * @returns {object}
   */
  normalize(raw) {
    return raw;
  }
}

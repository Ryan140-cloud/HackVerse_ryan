import { siteConfig } from '@/lib/config/site';

export default function robots() {
  const base = siteConfig.url.replace(/\/$/, '');
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/dashboard'] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

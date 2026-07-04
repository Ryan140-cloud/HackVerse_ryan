import { siteConfig } from '@/lib/config/site';

export default function sitemap() {
  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  const routes = ['', '/explore', '/dashboard', '/about', '/contact', '/privacy', '/terms', '/signin', '/signup'];

  return routes.map((path) => ({
    url: `${base}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/explore' ? 'hourly' : 'weekly',
    priority: path === '' ? 1 : path === '/explore' ? 0.9 : 0.6,
  }));
}

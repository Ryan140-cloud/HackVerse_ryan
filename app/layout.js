import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/lib/config/site';

export const metadata = {
  title: {
    default: `${siteConfig.name} \u2014 Discover Hackathons in One Place`,
    template: `%s \u00B7 ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'hackathons', 'student hackathons', 'devpost', 'devfolio', 'mlh',
    'unstop', 'hackathon aggregator',
  ],
  authors: [{ name: siteConfig.founder.name }],
  creator: siteConfig.founder.name,
  publisher: siteConfig.owner,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} \u2014 Discover Hackathons`,
    description: siteConfig.tagline,
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

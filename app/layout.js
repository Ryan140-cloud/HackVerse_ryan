import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'HackVerse — Discover Hackathons in One Place',
  description:
    'HackVerse aggregates ongoing and upcoming hackathons from Devpost, Devfolio, MLH, Unstop and more — all in a single, elegant dashboard for students.',
  keywords: [
    'hackathons',
    'student hackathons',
    'devpost',
    'devfolio',
    'mlh',
    'unstop',
    'hackathon aggregator',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://hackverse.local'
  ),
  openGraph: {
    title: 'HackVerse — Discover Hackathons',
    description: 'One dashboard for every hackathon that matters.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
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

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'PriceCompare — Compare prices across Myntra, Ajio & Meesho',
    template: '%s · PriceCompare',
  },
  description:
    'Search once and compare product prices, ratings and offers across Myntra, Ajio and Meesho. Find the best deal in seconds.',
  keywords: ['price comparison', 'Myntra', 'Ajio', 'Meesho', 'best price', 'shopping'],
  openGraph: {
    title: 'PriceCompare',
    description: 'Compare prices across Myntra, Ajio and Meesho.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

// Set theme before paint to avoid a flash of the wrong colour scheme.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

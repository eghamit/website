import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: {
    default: 'ML Academy — Learn Machine Learning from the ground up',
    template: '%s · ML Academy',
  },
  description:
    'A free, interactive course on Machine Learning: theory, the mathematics behind each method, and fully worked examples — supervised learning, unsupervised learning, the perceptron and multilayer perceptrons.',
  keywords: [
    'machine learning',
    'supervised learning',
    'unsupervised learning',
    'perceptron',
    'neural networks',
    'backpropagation',
    'tutorial',
  ],
  openGraph: {
    title: 'ML Academy',
    description: 'Learn Machine Learning: theory, mathematics and solved examples.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

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
      <body className="min-h-screen">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

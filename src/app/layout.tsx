import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const title = 'Стрелин: Кирпич с историей — премиум коллекция';
const description =
  'Лимитированная подборка кирпичей с клеймом Стрелин: история, фактура, факты. Минималистичный лендинг с современным UX.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'кирпич Стрелин',
    'исторический кирпич',
    'коллекционный кирпич',
    'строительные материалы премиум',
    'архитектурное наследие',
  ],
  openGraph: {
    title,
    description,
    url: 'https://example.com/landing-four',
    siteName: 'Стрелин · Коллекция',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Премиальный кирпич Стрелин',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [
      'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  metadataBase: new URL('https://example.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-background text-text antialiased">{children}</body>
    </html>
  );
}

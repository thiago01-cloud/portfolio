import './globals.css';

export const metadata = {
  title: 'Justin-Laurent NZENGUI-MAYOMBO, lead développeur',
  description:
    'Portfolio de Justin-Laurent NZENGUI-MAYOMBO, lead développeur web et mobile à Libreville (Gabon).',
  icons: { icon: '/icon.svg' },
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

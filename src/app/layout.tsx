import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getSiteSettings } from '@/app/lib/data';
import { auth } from '@/auth';
import SystemWrapper from '@/components/SystemWrapper';
import PWAInstall from '@/components/PWAInstall';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.site_title || 'Szymon - Fotografia, Grafika, Marketing',
    keywords: 'Szymon Baranowski, Tarnów, Fotografia Tarnów, Grafik Tarnów, Marketing Tarnów, profesjonalne sesje zdjęciowe, fotografia biznesowa, fotografia produktowa, fotografia wizerunkowa, sesje lifestyle, projektowanie graficzne, identyfikacja wizualna, branding, projektowanie logo, grafika do social media, marketing internetowy, strategia marki, social media marketing, copywriting, kampanie reklamowe',
    openGraph: {
      title: settings.site_title || 'Szymon - Fotografia, Grafika, Marketing',
      description: settings.site_description || 'Profesjonalne usługi: Fotografia, Grafika, Marketing.',
      url: 'https://szymonbaranowski.pl',
      siteName: 'Szymon Baranowski Portfolio',
      images: [
        {
          url: '/og-image.jpg', // Pamiętaj o dodaniu tego pliku do folderu public!
          width: 1200,
          height: 630,
          alt: 'Szymon Baranowski Portfolio',
        },
      ],
      locale: 'pl_PL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_title || 'Szymon - Fotografia, Grafika, Marketing',
      description: settings.site_description || 'Profesjonalne usługi: Fotografia, Grafika, Marketing.',
      images: ['/og-image.jpg'],
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Szymon Portfolio',
    },
    themeColor: '#E63946',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const session = await auth();
  const isAdmin = !!session?.user;

  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased text-dark bg-white`}>
        {settings.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.google_analytics_id}');
              `}
            </Script>
          </>
        )}
        <SystemWrapper settings={settings} isAdmin={isAdmin}>
          {children}
        </SystemWrapper>
        <PWAInstall />
      </body>
    </html>
  );
}

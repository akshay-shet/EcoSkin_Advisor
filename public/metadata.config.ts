import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoSkin AI - Skincare & Beauty Advisor',
  description: 'AI-powered personalized skincare, hair analysis, and beauty recommendations with multi-language support',
  keywords: 'skincare, hair analysis, beauty advisor, AI, dermatology, makeup',
  authors: [{ name: 'EcoSkin Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#0D9488',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ecoskin-ai.vercel.app',
    siteName: 'EcoSkin AI',
    title: 'EcoSkin AI - Skincare & Beauty Advisor',
    description: 'Get personalized skincare and beauty recommendations powered by AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EcoSkin AI',
      },
    ],
  },
};

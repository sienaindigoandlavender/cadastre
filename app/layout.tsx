import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cadastre.example'),
  title: {
    default: 'Cadastre',
    template: '%s · Cadastre'
  },
  description: 'Pan-African real estate intelligence — open data on land tenure, property markets, and the built environment.',
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

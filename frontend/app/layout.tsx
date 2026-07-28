import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#F8FAFC',
};

export const metadata: Metadata = {
  title: 'SentinelScribe | Healthcare Experience',
  description: 'Premium healthcare platform',
};

import GlobalMobileCopilot from '@/components/GlobalMobileCopilot';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <head>
        <meta name="theme-color" content="#F8FAFC" />
      </head>
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased">
        {children}
      </body>
    </html>
  );
}

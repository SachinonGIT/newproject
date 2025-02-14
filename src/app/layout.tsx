import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "White Screen Test Tool | Dead Pixel, Fake Screen & Bleeding Check | Free",
  description: "Test mobile, laptop, or monitor screens instantly. Detect dead pixels, fake screens, screen bleeding, and more. Check Your Screen for free.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://whitescreentest.org',
  },
  openGraph: {
    title: 'White Screen Test Tool | Free Screen Testing Suite',
    description: 'Test mobile, laptop, or monitor screens instantly. Detect dead pixels, fake screens, screen bleeding, and more.',
    url: 'https://whitescreentest.org',
    siteName: 'White Screen Test Tool',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'White Screen Test Tool | Free Screen Testing Suite',
    description: 'Test mobile, laptop, or monitor screens instantly. Free tool for detecting screen issues.',
    creator: '@whitescreentest',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Facebook SDK */}
        <Script 
          id="facebook-jssdk" 
          strategy="lazyOnload"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v13.0"
          nonce="random123"
        />
      </head>
      <body className={inter.className}>
        {/* Facebook Root Div */}
        <div id="fb-root"></div>
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}

import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sunsetology - Analyze Sunset Colors',
  description: 'Upload a sunset photo and extract beautiful color palettes for your designs.',
  keywords: ['sunset', 'color palette', 'photo analysis', 'design', 'colors'],
  openGraph: {
    title: 'Sunsetology - Sunset Color Analysis',
    description: 'Upload a sunset photo and extract beautiful color palettes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunsetology - Sunset Color Analysis',
    description: 'Upload a sunset photo and extract beautiful color palettes.',
  },
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
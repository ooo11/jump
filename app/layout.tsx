import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

import '../app/ui/packages/Calendar/calendar.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Jump Works',
    default: 'Jump Works',
  },
  description: 'The official Jump Dashboard.',
  metadataBase: new URL('https://jumpsay.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
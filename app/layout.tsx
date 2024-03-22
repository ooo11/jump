import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { SessionProvider } from 'next-auth/react';
import { auth } from "@/auth";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </SessionProvider>
  );
}
import "@/app/ui/global.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Saldo Finance',
    default: 'Saldo Finance',
  },
  description: 'Personal finance wealth management platform.',
  metadataBase: new URL('https://saldo-beta.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lusitana:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font-inter antialiased`}>{children}</body>
    </html>
  );
}

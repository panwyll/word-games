import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import AuthHeader from '@/components/AuthHeader';

export const metadata: Metadata = {
  title: 'Word Games',
  description: 'NYT-style word games: Wordle, Connections, Spelling Bee, and Letter Boxed',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <header className="border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold tracking-tight">Word Games</Link>
              <nav className="flex gap-4 text-sm font-medium items-center">
                <Link href="/wordle" className="hover:underline">Wordle</Link>
                <Link href="/connections" className="hover:underline">Connections</Link>
                <Link href="/spelling-bee" className="hover:underline">Spelling Bee</Link>
                <Link href="/letter-boxed" className="hover:underline">Letter Boxed</Link>
                <Link href="/pricing" className="hover:underline text-yellow-600 dark:text-yellow-400">Pricing</Link>
                <AuthHeader />
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}

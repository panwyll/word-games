import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import AuthHeader from '@/components/AuthHeader';

export const metadata: Metadata = {
  title: 'Word Games',
  description: 'NYT-style word games: Wordle, Connections, and Spelling Bee',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
                Word Games
              </Link>
              <nav className="flex gap-3 text-sm font-medium items-center">
                <Link href="/wordle" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Wordle</Link>
                <Link href="/connections" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Connections</Link>
                <Link href="/spelling-bee" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors hidden sm:inline">Spelling Bee</Link>
                <Link href="/sudoku" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden md:inline">Sudoku</Link>
                <Link href="/crossword" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors hidden md:inline">Crossword</Link>
                <Link href="/pricing" className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold transition-all hover:scale-105">
                  Premium
                </Link>
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

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Word Games',
  description: 'NYT-style word games: Wordle, Connections, and Spelling Bee',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold tracking-tight">Word Games</a>
            <nav className="flex gap-4 text-sm font-medium">
              <a href="/wordle" className="hover:underline">Wordle</a>
              <a href="/connections" className="hover:underline">Connections</a>
              <a href="/spelling-bee" className="hover:underline">Spelling Bee</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

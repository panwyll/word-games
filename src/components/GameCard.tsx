import Link from 'next/link';

interface GameCardProps {
  href: string;
  title: string;
  description: string;
  emoji: string;
  color: 'green' | 'yellow' | 'amber' | 'blue' | 'purple';
}

const colorMap = {
  green: 'bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:border-green-800',
  yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 dark:border-yellow-800',
  amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:border-amber-800',
  blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:border-blue-800',
  purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:border-purple-800',
};

export default function GameCard({ href, title, description, emoji, color }: GameCardProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${colorMap[color]}`}
    >
      <span className="text-5xl mb-4">{emoji}</span>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}

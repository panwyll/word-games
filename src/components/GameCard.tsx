import Link from 'next/link';

interface GameCardProps {
  href: string;
  title: string;
  description: string;
  emoji: string;
  color: 'green' | 'yellow' | 'amber' | 'blue' | 'purple' | 'indigo' | 'red';
}

const colorMap = {
  green: 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-300 dark:from-green-900/20 dark:to-green-800/20 dark:hover:from-green-900/40 dark:hover:to-green-800/40 dark:border-green-700 shadow-green-200/50',
  yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-yellow-300 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:hover:from-yellow-900/40 dark:hover:to-yellow-800/40 dark:border-yellow-700 shadow-yellow-200/50',
  amber: 'bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-300 dark:from-amber-900/20 dark:to-amber-800/20 dark:hover:from-amber-900/40 dark:hover:to-amber-800/40 dark:border-amber-700 shadow-amber-200/50',
  blue: 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-300 dark:from-blue-900/20 dark:to-blue-800/20 dark:hover:from-blue-900/40 dark:hover:to-blue-800/40 dark:border-blue-700 shadow-blue-200/50',
  purple: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-300 dark:from-purple-900/20 dark:to-purple-800/20 dark:hover:from-purple-900/40 dark:hover:to-purple-800/40 dark:border-purple-700 shadow-purple-200/50',
  indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-indigo-300 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:hover:from-indigo-900/40 dark:hover:to-indigo-800/40 dark:border-indigo-700 shadow-indigo-200/50',
  red: 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-300 dark:from-red-900/20 dark:to-red-800/20 dark:hover:from-red-900/40 dark:hover:to-red-800/40 dark:border-red-700 shadow-red-200/50',
};

export default function GameCard({ href, title, description, emoji, color }: GameCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${colorMap[color]}`}
    >
      <span className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">{emoji}</span>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}

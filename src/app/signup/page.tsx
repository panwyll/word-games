'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Registration failed');
    } else {
      router.push('/login?registered=true');
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create account</h1>
        <p className="text-gray-500">Start playing Word Games for free</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-400 outline-none transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-400 outline-none transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-400 outline-none transition-shadow"
          />
          <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-medium underline hover:text-gray-700 dark:hover:text-gray-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}

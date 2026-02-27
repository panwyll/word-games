import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LetterBoxedArchive from '@/components/letter-boxed/LetterBoxedArchive';
import PremiumGate from '@/components/PremiumGate';

export const metadata = { title: 'Letter Boxed Archive – Word Games' };

export default async function LetterBoxedArchivePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/letter-boxed/archive');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">Letter Boxed Archive 📦</h1>
        <p className="text-gray-500 text-sm">Play any past Letter Boxed puzzle</p>
      </div>
      
      <PremiumGate>
        <LetterBoxedArchive />
      </PremiumGate>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [lookerUrl, setLookerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
        return;
      }

      setUser(firebaseUser);

      try {
        const docRef = doc(db, 'dashboards', firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLookerUrl(data.lookerUrl);
        } else {
          setError('No dashboard found for this user.');
        }
      } catch (err) {
        console.error('Error fetching Looker URL:', err);
        setError('Failed to load your dashboard.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // 🔒 While loading or auth not verified, render nothing or a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-500 text-xl animate-pulse">Verifying user...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.displayName || user?.email || 'User'} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here is your personalized dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-center text-lg font-semibold">
            {error}
          </div>
        )}

        {/* Dashboard */}
        {!error && lookerUrl && (
          <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-md">
            <iframe
              src={lookerUrl}
              width="100%"
              height="600"
              className="w-full h-[600px] rounded-xl"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title="User Dashboard"
            />
          </div>
        )}
      </div>
    </div>
  );
}

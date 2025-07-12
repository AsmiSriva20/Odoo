'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

const Dashboard = () => {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState({ name: '', points: 0 });
  const [myListings, setMyListings] = useState([]);
  const [mySwaps, setMySwaps] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (loading) return; // Wait for AuthContext to load
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: res.data.name,
          points: res.data.points || 0,
        });
        setMyListings(res.data.listings || []);
        setMySwaps(res.data.swaps || []);
      } catch (err) {
        console.error('❌ Error fetching profile:', err.response?.data || err.message);
        alert('Session expired. Please log in again.');
        logout();
        router.push('/login');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [token, loading]);

  if (loading || profileLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      <span className="ml-4 text-lg text-gray-600">Loading dashboard...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 flex flex-col items-center bg-white rounded-2xl shadow-lg p-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-green-400 to-green-200 flex items-center justify-center mb-4 shadow-md">
            <span className="text-4xl font-bold text-white">{profile.name?.charAt(0) || '?'}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
          <p className="text-green-700 font-semibold">Points: {profile.points}</p>
          <button
            onClick={logout}
            className="mt-6 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
        {/* Quick Stats */}
        <div className="col-span-2 flex flex-col justify-center items-center md:items-start bg-gradient-to-tr from-green-100 to-green-50 rounded-2xl shadow p-8">
          <div className="flex flex-col md:flex-row gap-8 w-full justify-between">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-3xl font-bold text-green-700">{myListings.length}</span>
              <span className="text-gray-600">Listings</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-3xl font-bold text-green-700">{mySwaps.length}</span>
              <span className="text-gray-600">Swaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="max-w-4xl mx-auto mb-10">
        <h3 className="text-xl font-semibold mb-4 text-green-800">My Listings</h3>
        {myListings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">No listings yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myListings.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <div
                  className="w-32 h-32 bg-gray-200 rounded-lg mb-3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.images?.[0] || '/placeholder.jpg'})` }}
                />
                <p className="font-medium text-gray-800 text-center">{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swaps Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-green-800">My Swaps</h3>
        {mySwaps.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">No swaps yet.</div>
        ) : (
          <ul className="space-y-4">
            {mySwaps.map((swap) => (
              <li
                key={swap._id}
                className="bg-white rounded-xl shadow flex flex-col md:flex-row justify-between items-center p-4 hover:shadow-lg transition"
              >
                <span className="font-medium text-gray-700 mb-2 md:mb-0">{swap.item}</span>
                <span
                  className={`text-sm px-4 py-1 rounded-full font-semibold ${
                    swap.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {swap.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

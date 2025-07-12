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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", type: "", size: "", points: 1000 });
  const [adding, setAdding] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [myProducts, setMyProducts] = useState([]); // For user's own products
  const [swapTarget, setSwapTarget] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapMessage, setSwapMessage] = useState("");
  const [initiateSwapOpen, setInitiateSwapOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");

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

  // Fetch all products for swap modal
  useEffect(() => {
    if (initiateSwapOpen) {
      api.get('/items').then(res => setAllProducts(res.data));
    }
  }, [initiateSwapOpen]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/items", { ...newItem, userId: user.id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddForm(false);
      setNewItem({ name: "", type: "", size: "", points: 1000 });
      // Refresh listings
      const res = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyListings(res.data.listings || []);
    } catch (err) {
      alert("Failed to add item.");
    }
    setAdding(false);
  };

  const handleOpenSwap = (targetProduct) => {
    setSwapTarget(targetProduct);
    setSwapModalOpen(true);
    setSwapMessage("");
  };
  const handleRequestSwap = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !swapTarget || !receiverEmail) return;
    setSwapLoading(true);
    setSwapMessage("");
    try {
      await api.post("/swaps/request", {
        senderEmail: user.email,
        receiverEmail,
        senderProductId: selectedProduct._id,
        requestedProductId: swapTarget._id,
      });
      setSwapMessage("Swap request sent!");
      setInitiateSwapOpen(false);
      setReceiverEmail("");
    } catch (err) {
      setSwapMessage("Failed to send swap request.");
    }
    setSwapLoading(false);
  };

  if (loading || profileLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      <span className="ml-4 text-lg text-gray-600">Loading dashboard...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/landing')}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white shadow hover:bg-green-50 text-green-700 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Landing
      </button>
      {/* Initiate Swap Button */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end">
        <button
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold shadow"
          onClick={() => setInitiateSwapOpen(true)}
        >
          Initiate Swap
        </button>
      </div>
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

      {/* Add Item Form and Listings Section */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-green-800">My Listings</h3>
          <button
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            onClick={() => setShowAddForm((v) => !v)}
          >
            {showAddForm ? "Cancel" : "Add Item"}
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleAddItem} className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <select
              value={newItem.type}
              onChange={e => setNewItem({ ...newItem, type: e.target.value })}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Accessories">Accessories</option>
              <option value="Shoes">Shoes</option>
              <option value="Sports">Sports</option>
            </select>
            <select
              value={newItem.size}
              onChange={e => setNewItem({ ...newItem, size: e.target.value })}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <input
              type="number"
              placeholder="Points (default 1000)"
              value={newItem.points}
              onChange={e => setNewItem({ ...newItem, points: Number(e.target.value) })}
              className="p-2 border rounded"
              min={0}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={adding}
            >
              {adding ? "Adding..." : "Add Item"}
            </button>
          </form>
        )}
        {myListings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">No listings yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myListings.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700 mb-2">
                  {item.name?.charAt(0) || '?'}
                </div>
                <p className="font-bold text-lg text-gray-800">{item.name}</p>
                <p className="text-gray-600">Type: {item.type}</p>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="text-green-700 font-semibold">Points: {item.points}</p>
                {/* Swap Button - only show for products not owned by the user */}
                {item.userId !== user.id && (
                  <button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleOpenSwap(item)}
                  >
                    Request Swap
                  </button>
                )}
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

      {/* Swap Modal */}
      {swapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Select Your Product to Swap</h2>
            <form onSubmit={handleRequestSwap} className="flex flex-col gap-4">
              <select
                value={selectedProduct?._id || ""}
                onChange={e => setSelectedProduct(myProducts.find(p => p._id === e.target.value))}
                className="p-2 border rounded"
                required
              >
                <option value="">Select your product</option>
                {myProducts.map((prod) => (
                  <option key={prod._id} value={prod._id}>{prod.name} ({prod.type}, {prod.size})</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={swapLoading}
              >
                {swapLoading ? "Requesting..." : "Request Swap"}
              </button>
              {swapMessage && <p className="text-center text-sm text-green-700 mt-2">{swapMessage}</p>}
              <button
                type="button"
                className="mt-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSwapModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Initiate Swap Modal */}
      {initiateSwapOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Initiate a Swap</h2>
            <form onSubmit={handleRequestSwap} className="flex flex-col gap-4">
              <label className="font-medium">Receiver's Email:</label>
              <input
                type="email"
                value={receiverEmail}
                onChange={e => setReceiverEmail(e.target.value)}
                className="p-2 border rounded"
                placeholder="Enter receiver's email"
                required
              />
              <label className="font-medium">Select a product to request:</label>
              <select
                value={swapTarget?._id || ""}
                onChange={e => setSwapTarget(allProducts.find(p => p._id === e.target.value))}
                className="p-2 border rounded"
                required
              >
                <option value="">Select product</option>
                {allProducts.filter(p => p.userId !== user.id).map((prod) => (
                  <option key={prod._id} value={prod._id}>{prod.name} ({prod.type}, {prod.size})</option>
                ))}
              </select>
              <label className="font-medium">Select your product to offer:</label>
              <select
                value={selectedProduct?._id || ""}
                onChange={e => setSelectedProduct(myProducts.find(p => p._id === e.target.value))}
                className="p-2 border rounded"
                required
              >
                <option value="">Select your product</option>
                {myProducts.map((prod) => (
                  <option key={prod._id} value={prod._id}>{prod.name} ({prod.type}, {prod.size})</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={swapLoading}
              >
                {swapLoading ? "Requesting..." : "Request Swap"}
              </button>
              {swapMessage && <p className="text-center text-sm text-green-700 mt-2">{swapMessage}</p>}
              <button
                type="button"
                className="mt-2 text-gray-500 hover:text-gray-700"
                onClick={() => setInitiateSwapOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

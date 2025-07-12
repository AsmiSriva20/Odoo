"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";

export default function ProductDescriptionPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapMessage, setSwapMessage] = useState("");

  useEffect(() => {
    // Fetch product details
    api.get(`/items/${id}`).then(res => setProduct(res.data));
    // Fetch user's own products
    if (user && token) {
      api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setMyProducts(res.data.listings || []));
    }
  }, [id, user, token]);

  const handleRequestSwap = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !receiverEmail) return;
    setSwapLoading(true);
    setSwapMessage("");
    try {
      await api.post("/swaps/request", {
        senderEmail: user.email,
        receiverEmail,
        senderProductId: selectedProduct._id,
        requestedProductId: product._id,
      });
      setSwapMessage("Swap request sent!");
      setReceiverEmail("");
    } catch (err) {
      setSwapMessage("Failed to send swap request.");
    }
    setSwapLoading(false);
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-2">Type: {product.type}</p>
        <p className="text-gray-700 mb-2">Size: {product.size}</p>
        <p className="text-green-700 font-semibold mb-4">Points: {product.points}</p>
        {/* Add more product details here if needed */}
      </div>
      {/* Swap Initiation Form */}
      <div className="max-w-xl w-full bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Initiate a Swap for this Product</h2>
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
        </form>
      </div>
    </div>
  );
}

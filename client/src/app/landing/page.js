"use client";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api"; // Make sure this points to your axios instance

const categories = [
  { name: "Men", icon: "👔" },
  { name: "Women", icon: "👗" },
  { name: "Kids", icon: "🧒" },
  { name: "Accessories", icon: "👜" },
  { name: "Shoes", icon: "👟" },
  { name: "Sports", icon: "🏀" },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await api.get("/items");
      setProducts(res.data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700">ReWear</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/landing" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
            <Link href="#categories" className="text-gray-700 hover:text-green-700 font-medium">Browse</Link>
            {!user && <Link href="/login" className="text-gray-700 hover:text-green-700 font-medium">Login</Link>}
            {!user && <Link href="/signup" className="text-gray-700 hover:text-green-700 font-medium">Sign Up</Link>}
            {user && (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition font-medium"
              >
                <span className="text-lg">👤</span> Profile
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Swap, Save, <span className="text-green-700">Sustain</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover a new way to refresh your wardrobe. Swap clothes, reduce waste, and join a community making fashion circular.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition">Start Swapping</button>
            <button className="px-6 py-3 bg-white border border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition">Browse Items</button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          {/* Hero Image Placeholder */}
          <div className="w-80 h-56 bg-green-100 rounded-2xl flex items-center justify-center text-6xl text-green-400">
            👚👕
          </div>
        </div>
      </section>

      {/* Carousel Placeholder */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Featured Clothing Items</h2>
          <div className="w-full flex gap-6 overflow-x-auto pb-2">
            {[1,2,3,4,5].map((n) => (
              <div key={n} className="min-w-[200px] h-40 bg-gray-100 rounded-xl flex items-center justify-center text-3xl text-gray-300">
                Image {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="max-w-5xl mx-auto px-6 mb-12">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:bg-green-50 transition cursor-pointer">
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="font-medium text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Listings Section */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Product Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition">
              <div
                className="w-32 h-32 bg-gray-200 rounded-lg mb-3 bg-cover bg-center"
                style={{ backgroundImage: `url(${prod.image})` }}
              />
              <p className="font-medium text-gray-800 text-center">{prod.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials/Impact Metrics Placeholder */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-tr from-green-100 to-green-50 rounded-2xl shadow p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-green-800 mb-2">What Our Swappers Say</h3>
            <p className="text-gray-700 mb-4">“ReWear helped me refresh my closet and help the planet!”</p>
            <p className="text-gray-700">“Great community and awesome finds every time.”</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-4xl font-bold text-green-700 mb-2">10,000+</span>
            <span className="text-gray-600">Items Swapped</span>
          </div>
        </div>
      </section>
    </div>
  );
}

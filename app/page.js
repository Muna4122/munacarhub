"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="flex flex-col">

      {/* HERO SECTION */}
      <section className="relative min-h-screen sm:h-[90vh] flex items-center justify-center text-center">
       <img
          src="/cary.jpg"
          alt="Premium Car"
          className="object-cover absolute inset-0 w-full h-full"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

        <div className="relative z-10 px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="mb-4 sm:mb-6 inline-block bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
            <p className="text-blue-200 text-xs sm:text-sm font-semibold">✨ Welcome to Premium Car Shopping</p>
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 sm:mb-6">
            Your Next <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Perfect Car</span> Awaits
          </h1>

          <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Discover thousands of premium vehicles from trusted sellers. Browse, compare, and find the car of your dreams with confidence.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-8 sm:mt-10 flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-2xl max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search by brand, model, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 outline-none text-sm sm:text-base text-slate-900"
            />
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 hover:from-blue-700 hover:to-blue-800 transition cursor-pointer font-bold text-sm sm:text-base">
              Search
            </button>
          </form>

          <div className="mt-8 flex justify-center gap-4 sm:gap-6">
            <button onClick={() => router.push("/explore")} className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/20 transition font-semibold text-sm">Browse All</button>
            <button onClick={() => router.push("/sell")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">Sell Your Car</button>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Browse by Category
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Find exactly what you're looking for with our curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {["Luxury", "Electric", "Sports", "SUV", "Sedan", "Truck"].map(
            (item, index) => (
              <button
                key={index}
                onClick={() => router.push(`/explore?search=${item}`)}
                className="group bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-2xl sm:text-3xl mb-2">
                  {item === "Luxury" && ""}
                  {item === "Electric" && ""}
                  {item === "Sports" && ""}
                  {item === "SUV" && ""}
                  {item === "Sedan" && ""}
                  {item === "Truck" && ""}
                </div>
                <p className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600">{item}</p>
              </button>
            )
          )}
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-slate-100 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Featured Listings
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg">Handpicked collections of the finest vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">

            {/* Card 1 */}
            <div className="group rounded-3xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="relative h-48 xs:h-60 sm:h-72 md:h-80 overflow-hidden bg-slate-200">
                <img
                  src="/jeep.jpg"
                  alt="Electric Car"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Trending</span>
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Electric Revolution
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Explore our latest collection of premium electric vehicles with cutting-edge technology
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-blue-600">From $45K</p>
                  <button onClick={() => router.push("/explore?search=Electric")} className="text-blue-600 hover:text-blue-700 font-bold text-sm">View →</button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-3xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="relative h-48 xs:h-60 sm:h-72 md:h-80 overflow-hidden bg-slate-200">
                <img
                  src="/carf.jpg"
                  alt="Luxury Sedan"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Premium</span>
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Luxury Collection
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Premium luxury vehicles for those who demand the finest in comfort and performance
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-blue-600">From $89K</p>
                  <button onClick={() => router.push("/explore?search=Luxury")} className="text-blue-600 hover:text-blue-700 font-bold text-sm">View →</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">The numbers speak for themselves</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">800+</p>
              <p className="text-blue-100 text-sm sm:text-base">Premium Vehicles</p>
              <p className="text-xs text-blue-300 mt-2">Carefully selected</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">50K+</p>
              <p className="text-blue-100 text-sm sm:text-base">Happy Customers</p>
              <p className="text-xs text-blue-300 mt-2">Satisfied buyers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-2">24/7</p>
              <p className="text-blue-100 text-sm sm:text-base">Customer Support</p>
              <p className="text-xs text-blue-300 mt-2">Always available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-violet-400 mb-2">100%</p>
              <p className="text-blue-100 text-sm sm:text-base">Verified Dealers</p>
              <p className="text-xs text-blue-300 mt-2">Trusted sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            How It Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Simple, transparent, and hassle-free car shopping
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { num: "1", title: "Search", desc: "Browse our extensive catalog" },
            { num: "2", title: "Compare", desc: "Compare prices and features" },
            { num: "3", title: "Connect", desc: "Contact sellers directly" },
            { num: "4", title: "Purchase", desc: "Complete your transaction" }
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 w-full bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Ready to Drive Your Dream Car?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who found their perfect vehicle on Muna CarHub. Search, compare, and purchase with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/explore")}
                className="bg-white text-blue-600 font-bold px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-50 transition text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Explore All Cars
              </button>
              <button
                onClick={() => router.push("/sell")}
                className="bg-blue-500 text-white font-bold px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Sell Your Car
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
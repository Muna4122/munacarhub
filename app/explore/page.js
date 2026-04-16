"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cars } from "../../data/cars";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("featured");
  const [filterBrand, setFilterBrand] = useState("all");

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  // Get unique brands
  const brands = ["all", ...new Set(cars.map((car) => car.brand))];

  let filteredCars = cars.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.description.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = filterBrand === "all" || car.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  // Sort cars
  if (sortBy === "price-low") {
    filteredCars = [...filteredCars].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredCars = [...filteredCars].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredCars = [...filteredCars].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 sm:pt-20 md:pt-24 pb-16 px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-slate-200 rounded-lg transition text-sm font-semibold flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Explore Cars
          </h1>
          <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
            {filteredCars.length} cars found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-10">
          
          {/* Search Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by car name, brand, or features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-lg focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            
            {/* Brand Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Brand
              </label>
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-lg focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === "all" ? "All Brands" : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-lg focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 h-full flex flex-col cursor-pointer">
                  <div className="relative h-40 xs:h-48 sm:h-52 md:h-60 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                  <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 sm:px-3 py-1 rounded-full mb-2">
                        {car.brand}
                      </span>
                      <h2 className="font-bold text-sm sm:text-base md:text-lg text-slate-900">{car.name}</h2>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2">{car.description}</p>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                        ${car.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-12 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              No cars found
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}

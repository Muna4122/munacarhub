"use client";
import { cars } from "../../../data/cars";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CarDetail({params}) {
  const router = useRouter();
  const {id} = use(params);
  const car = cars.find((c) => c.id === id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsAuthenticated(!!firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handlePurchaseAction = (modal) => {
    if (!isAuthenticated) {
      alert('Please sign up or log in to purchase a car');
      router.push('/profile');
      return;
    }
    setActiveModal(modal);
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Car not found
          </h1>
          <Link href="/explore" className="text-blue-600 hover:underline font-semibold">
            Go back to explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 sm:pt-20 md:pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb with Back Button */}
        <div className="mb-6 sm:mb-8 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
            title="Go back"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-base overflow-x-auto">
            <Link href="/" className="hover:text-blue-600 whitespace-nowrap">
              Home
            </Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-blue-600 whitespace-nowrap">
              Explore
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate text-xs sm:text-base">{car.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
          
          {/* Image Section */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-96 relative w-full">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            
            {/* Brand Badge */}
            <span className="inline-block bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold px-3 py-1 rounded-full mb-3 sm:mb-4">
              {car.brand}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
              {car.name}
            </h1>

            {/* Condition */}
            <p className="text-slate-600 text-base sm:text-lg mb-4 sm:mb-6">{car.condition}</p>

            {/* Price */}
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-200">
              <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-2">
                Price
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-blue-600">
                ${car.price.toLocaleString()}
              </p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-1">
                  Year
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {car.year}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-1">
                  Transmission
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {car.transmission}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-1">
                  Fuel Type
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {car.fuel}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-1">
                  Mileage
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {car.mileage}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <button 
                onClick={() => handlePurchaseAction('buy')}
                className="w-full bg-green-600 text-white font-bold py-3 sm:py-4 rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
              >
                🛒 Buy Now
              </button>
              <button 
                onClick={() => handlePurchaseAction('contact')}
                className="w-full bg-blue-600 text-white font-bold py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                ☎️ Contact Seller
              </button>
              <button 
                onClick={() => handlePurchaseAction('offer')}
                className="w-full border-2 border-blue-600 text-blue-600 font-bold py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition text-sm sm:text-base"
              >
                💰 Make an Offer
              </button>
            </div>

          </div>

        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
            {car.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                <span className="text-blue-600 text-lg sm:text-xl">✓</span>
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
            About This Car
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            {car.description}
          </p>
          <p className="text-slate-600 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
            This {car.year} {car.brand} {car.name.split(" ").slice(-1)[0]} is in {car.condition.toLowerCase()} condition with only {car.mileage} on the odometer. 
            It features a {car.transmission} transmission and runs on {car.fuel}. Perfect for drivers looking for a reliable and well-maintained vehicle.
          </p>
        </div>

      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="float-right text-2xl text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>

            {activeModal === 'buy' && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Purchase {car.name}</h2>
                <div className="mb-6">
                  <p className="text-slate-600 mb-4">Price: <span className="text-2xl font-bold text-blue-600">${car.price.toLocaleString()}</span></p>
                  <p className="text-slate-600 text-sm mb-4">To complete your purchase, please contact the seller for payment details and inspection arrangements.</p>
                </div>
                <button 
                  onClick={() => setActiveModal('contact')}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Contact Seller to Buy
                </button>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-3 bg-slate-200 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            {activeModal === 'contact' && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Contact Seller</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Your Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Your Email</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Message</label>
                    <textarea placeholder="I'm interested in this car..." rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    alert('Message sent to seller! They will contact you soon.');
                    setActiveModal(null);
                  }}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-3 bg-slate-200 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            {activeModal === 'offer' && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Make an Offer</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Asking Price</label>
                    <input type="text" disabled value={`$${car.price.toLocaleString()}`} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Your Offer</label>
                    <input type="number" placeholder="e.g., 40000" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Message</label>
                    <textarea placeholder="Tell us about your offer..." rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    alert('Offer submitted! The seller will review and respond soon.');
                    setActiveModal(null);
                  }}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Offer
                </button>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-3 bg-slate-200 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithGoogle, logoutUser } from "@/app/lib/authService";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user from Firebase on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        };

        setUser(userData);

        // Load user's listings
        setListingsLoading(true);
        try {
          const listingsQuery = query(
            collection(db, "listings"),
            where("ownerId", "==", firebaseUser.uid),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(listingsQuery);
          const listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserListings(listings);
        } catch (e) {
          console.error("Error loading user listings:", e);
          setUserListings([]);
        }
        setListingsLoading(false);
      } else {
        setUser(null);
        setUserListings([]);
        setListingsLoading(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsSubmitting(true);
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
      setMessage("✓ Logged out successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const result = await signInWithGoogle();

    if (result.success) {
      setUser(result.user);
      setMessage("✓ Signed in with Google successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16 sm:pt-20 md:pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-6 p-2 hover:bg-slate-200 rounded-lg transition text-sm font-semibold flex items-center gap-2"
        >
          ← Back
        </button>
        
        {user ? (
          // User Profile View
          <div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12">
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-slate-200 gap-4 sm:gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{user.email.split("@")[0]}</h1>
                    <p className="text-slate-600 mt-1 text-xs sm:text-sm md:text-base flex items-center gap-2">
                      {user.email}
                      {user.emailVerified ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">✓ Verified</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">⚠ Unverified</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 sm:px-6 py-2 rounded-lg transition text-xs sm:text-sm md:text-base disabled:opacity-50"
                >
                  {isSubmitting ? "Logging out..." : "Logout"}
                </button>
              </div>

              {/* Email Verification Alert - Removed for Google auth */}

              {/* User Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                    {listingsLoading ? "..." : userListings.length}
                  </p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-base">Active Listings</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-2">0</p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-base">Favorites</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">✓</p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-base">Verified Seller</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 sm:gap-6">
                <Link href="/sell">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 rounded-xl transition text-xs sm:text-sm md:text-base">
                    📌 Create New Listing
                  </button>
                </Link>
              </div>

            </div>

            {/* Your Listings */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Your Listings</h2>
                <Link href="/sell">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm">
                    + New Listing
                  </button>
                </Link>
              </div>

              {listingsLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-sm sm:text-base">Loading your listings...</p>
                </div>
              ) : userListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-base sm:text-lg mb-4">You have no active listings yet.</p>
                  <Link href="/sell">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition text-xs sm:text-sm md:text-base">
                      Create Your First Listing
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{listing.makeModel || "Untitled"}</h3>
                        <span className="text-sm font-semibold text-blue-700">${listing.price || "0"}</span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm mb-3 line-clamp-2">
                        {listing.description || "No description provided."}
                      </p>
                      <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white rounded-full border">{listing.year || "—"}</span>
                        <span className="px-2 py-1 bg-white rounded-full border">{listing.transmission || "—"}</span>
                        <span className="px-2 py-1 bg-white rounded-full border">{listing.fuelType || "—"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          // Authentication Form
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2 sm:mb-4">Welcome to Muna CarHub</h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600">
                Sign in with Google to get started
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Google Sign In */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
                  Sign In
                </h2>

                {/* Success Message */}
                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4 text-sm">
                    {message}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 font-bold py-2 sm:py-3 rounded-xl transition text-xs sm:text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isSubmitting ? "Signing in..." : "Sign in with Google"}
                </button>

                {/* Terms text */}
                <p className="text-center text-slate-600 mt-4 sm:mt-6 text-xs sm:text-sm">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12 sm:mt-16 bg-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Why Join Muna CarHub?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <p className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚗</p>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Browse Cars</h3>
                  <p className="text-blue-100 text-xs sm:text-sm md:text-base">Access 100+ premium vehicles</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl mb-3 sm:mb-4">📌</p>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">List Your Car</h3>
                  <p className="text-blue-100 text-xs sm:text-sm md:text-base">Sell your vehicle easily</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl mb-3 sm:mb-4">✓</p>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Verified Sellers</h3>
                  <p className="text-blue-100 text-xs sm:text-sm md:text-base">Buy with confidence</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

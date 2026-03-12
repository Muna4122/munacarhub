"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpUser, loginUser, logoutUser, resendVerificationEmail } from "@/app/lib/authService";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Load user from Firebase on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    const result = await signUpUser(email, password, name);

    if (result.success) {
      setMessage(result.message);
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setName("");
      setIsSignUp(false);
    } else {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const result = await loginUser(email, password);

    if (result.success) {
      setUser(result.user);
      setMessage("✓ Logged in successfully!");
      setEmail("");
      setPassword("");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
      setIsSignUp(false);
      setMessage("✓ Logged out successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
    setIsSubmitting(false);
  };

  const handleResendVerification = async () => {
    setError("");
    setMessage("");
    const result = await resendVerificationEmail();
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
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

              {/* Email Verification Alert */}
              {!user.emailVerified && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 mb-6 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 text-lg">⚠️</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-yellow-800 text-sm sm:text-base">Email Not Verified</h3>
                      <p className="text-yellow-700 text-xs sm:text-sm mt-1">Please verify your email to access all features.</p>
                      <button
                        onClick={handleResendVerification}
                        className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold text-xs sm:text-sm transition"
                      >
                        Resend Verification Email
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* User Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-2">0</p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-base">Active Listings</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-2">0</p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-base">Favorites</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">{user.emailVerified ? "✓" : "✗"}</p>
                  <p className="text-slate-700 font-semibold text-xs sm:text-base">{user.emailVerified ? "Verified Seller" : "Pending Verification"}</p>
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

            {/* Recent Listings Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 mt-6 sm:mt-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6">Your Activity</h2>
              <div className="text-center py-8 sm:py-12">
                <p className="text-slate-600 text-base sm:text-lg mb-4">No listings yet</p>
                <Link href="/sell">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition text-xs sm:text-sm md:text-base">
                    Create Your First Listing
                  </button>
                </Link>
              </div>
            </div>

          </div>
        ) : (
          // Authentication Form
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2 sm:mb-4">Welcome to Muna CarHub</h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600">
                {isSignUp ? "Create an account to get started" : "Sign in to your account"}
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Single Form */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
                  {isSignUp ? "Create Account" : "Sign In"}
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
                
                <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 sm:space-y-6">
                  {/* Name field - only for Sign Up */}
                  {isSignUp && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-xl focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
                        required
                      />
                    </div>
                  )}

                  {/* Email field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-xl focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
                      required
                    />
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-xl focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
                      required
                    />
                  </div>

                  {/* Password Confirm - only for Sign Up */}
                  {isSignUp && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border-2 border-slate-200 p-2 sm:p-3 rounded-xl focus:outline-none focus:border-blue-500 transition text-xs sm:text-base"
                        required
                      />
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-bold py-2 sm:py-3 rounded-xl transition text-xs sm:text-sm md:text-base text-white disabled:opacity-50 ${
                      isSignUp
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                  </button>
                </form>

                {/* Terms text for Sign Up */}
                {isSignUp && (
                  <p className="text-center text-slate-600 mt-4 sm:mt-6 text-xs sm:text-sm">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                )}

                {/* Toggle between Sign In and Sign Up */}
                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-3">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  </p>
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setName("");
                      setEmail("");
                      setPassword("");
                    }}
                    className="text-blue-600 font-bold hover:underline text-xs sm:text-sm md:text-base"
                  >
                    {isSignUp ? "Sign in here" : "Sign up here"}
                  </button>
                </div>
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

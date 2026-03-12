"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                🚗
              </div>
              <span className="font-extrabold text-lg text-white">
                Muna CarHub
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Your trusted platform for buying and selling premium cars.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white">Quick Links</h3>
            <Link href="/" className="text-sm hover:text-blue-400 transition">
              Home
            </Link>
            <Link href="/explore" className="text-sm hover:text-blue-400 transition">
              Explore Cars
            </Link>
            <Link href="/sell" className="text-sm hover:text-blue-400 transition">
              Sell Your Car
            </Link>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white">Support</h3>
            <Link href="/profile" className="text-sm hover:text-blue-400 transition">
              Profile
            </Link>
            <Link href="/contact" className="text-sm hover:text-blue-400 transition">
              Contact Us
            </Link>
            <a href="#" className="text-sm hover:text-blue-400 transition">
              FAQ
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
          <p>&copy; {currentYear} Muna CarHub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-blue-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

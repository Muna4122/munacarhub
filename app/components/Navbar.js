"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            🚗
          </div>
          <span className="font-extrabold text-xl uppercase text-slate-900 hidden sm:inline">
            Muna CarHub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-semibold">
          <Link href="/" className="text-slate-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/explore" className="text-slate-700 hover:text-blue-600 transition">
            Explore
          </Link>
          <Link href="/sell" className="text-slate-700 hover:text-blue-600 transition">
            Sell
          </Link>
          <Link href="/profile" className="text-slate-700 hover:text-blue-600 transition">
            Profile
          </Link>
          <Link href="/contact" className="text-slate-700 hover:text-blue-600 transition">
            Contact
          </Link>
          <Link
            href="/explore"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search Cars
          </Link>
          <Link
            href="/profile"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-bold"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-slate-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-4 font-semibold">
          <Link href="/" className="block text-slate-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/explore" className="block text-slate-700 hover:text-blue-600 transition">
            Explore
          </Link>
          <Link href="/sell" className="block text-slate-700 hover:text-blue-600 transition">
            Sell
          </Link>
          <Link href="/profile" className="block text-slate-700 hover:text-blue-600 transition">
            Profile
          </Link>
          <Link href="/contact" className="block text-slate-700 hover:text-blue-600 transition">
            Contact
          </Link>
          <Link
            href="/explore"
            className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
          >
            Search Cars
          </Link>
          <Link
            href="/profile"
            className="block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-center font-bold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}

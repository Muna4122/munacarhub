"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiMapPin, FiSend, FiX } from "react-icons/fi";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SellPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/profile");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, [router]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    makeModel: "",
    year: "",
    price: "",
    mileage: "",
    transmission: "",
    fuelType: "",
    condition: "",
    description: "",
    location: "Abuja, Nigeria",
    phone: "",
    contact: "",
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 10 total images
    const remainingSlots = 10 - images.length;
    const selectedFiles = files.slice(0, remainingSlots);

    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel? Any unsaved data will be lost."
    );
    if (confirmed) {
      router.push("/");
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will clear all form fields and images. Continue?"
    );
    if (confirmed) {
      setImages([]);
      setFormData({
        makeModel: "",
        year: "",
        price: "",
        mileage: "",
        transmission: "",
        fuelType: "",
        condition: "",
        description: "",
        location: "Abuja, Nigeria",
        phone: "",
        contact: "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, images });
    alert("Listing posted successfully!");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="mt-16 sm:mt-20 md:mt-24 ml-4 sm:ml-6 p-2 hover:bg-slate-200 rounded-lg transition text-sm font-semibold flex items-center gap-2 w-fit"
      >
        ← Back
      </button>

      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleCancel}
            className="text-blue-600 font-medium text-sm sm:text-base hover:text-blue-700 transition"
          >
            Cancel
          </button>
          <h1 className="text-lg sm:text-xl font-bold">Sell Your Car</h1>
          <button 
            onClick={handleReset}
            className="text-blue-600 font-medium text-sm sm:text-base hover:text-blue-700 transition"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Upload Section */}
        <section>
          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition rounded-2xl h-48 sm:h-64 flex flex-col items-center justify-center bg-white">
              <FiUpload className="text-3xl sm:text-4xl text-blue-500 mb-2 sm:mb-3" />
              <p className="font-semibold text-base sm:text-lg">Add Photos</p>
              <p className="text-gray-500 text-xs sm:text-sm">
                {images.length}/10 images uploaded
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Preview Images with Delete Button */}
          {images.length > 0 && (
            <div className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 group"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl border"
                  />

                  {/* Delete Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 transition text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

          {/* Make & Model */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Make & Model *
            </label>
            <input
              type="text"
              name="makeModel"
              value={formData.makeModel}
              onChange={handleInputChange}
              placeholder="e.g. Toyota Camry"
              className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
              required
            />
          </div>

          {/* Year & Price */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Year *
              </label>
              <select 
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              >
                <option value="">Select Year</option>
                {Array.from({ length: 25 }, (_, i) => 2025 - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Mileage & Transmission */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mileage (KM) *
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="e.g. 45000"
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
          </div>

          {/* Fuel Type & Condition */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell buyers about your car, features, condition, service history, etc..."
              className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none text-sm sm:text-base"
            ></textarea>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+234 800 000 0000"
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full h-12 sm:h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white border rounded-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <FiMapPin className="text-blue-500 text-lg sm:text-xl" />
              <div>
                <p className="font-semibold text-sm">{formData.location}</p>
                <p className="text-gray-500 text-xs">Location</p>
              </div>
            </div>
            <button type="button" className="text-blue-600 font-medium text-xs sm:text-sm">
              Change
            </button>
          </div>

        </form>
      </main>

      {/* Bottom Button */}
      <div className="sticky bottom-0 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <button 
            onClick={handleSubmit}
            className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
          >
            Post Listing <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Contact() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="fixed top-20 left-4 sm:left-6 p-2 hover:bg-slate-200 rounded-lg transition text-sm font-semibold flex items-center gap-2 bg-white shadow-md z-40"
      >
        ← Back
      </button>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Have questions about our vehicles or services? We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {/* CONTACT FORM */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 font-semibold text-sm sm:text-base">✓ Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base bg-white"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="sales">Sales Question</option>
                    <option value="support">Customer Support</option>
                    <option value="dealer-inquiry">Dealer Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base bg-white resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <p className="text-slate-500 text-xs sm:text-sm mt-6 text-center">
                We typically respond within 24 hours during business days.
              </p>
            </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm sm:text-base">Find answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                q: "How long does it take to get a response?",
                a: "We typically respond to inquiries within 24 hours during business days. For urgent matters, please call us directly."
              },
              {
                q: "Can I schedule a test drive?",
                a: "Yes! Contact us via phone or email to schedule a test drive. Our team will arrange a convenient time for you."
              },
              {
                q: "Do you offer financing options?",
                a: "Yes, we work with multiple financing partners to offer flexible payment plans. Contact our sales team for details."
              },
              {
                q: "How can I sell my car on Muna CarHub?",
                a: "Visit our 'Sell Your Car' page and fill out the listing form. Our team will review and list your vehicle within 48 hours."
              },
              {
                q: "Are all vehicles inspected?",
                a: "All vehicles on our platform undergo a comprehensive inspection to ensure quality and reliability."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept credit cards, bank transfers, and financing options. Contact us for more details on available payment methods."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-2xl">
                <h3 className="font-bold text-slate-900 mb-3 text-sm sm:text-base">{faq.q}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

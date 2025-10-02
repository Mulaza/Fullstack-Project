"use client";

import React, { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header/Navbar */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">HabitFlow</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600 transition-colors">Testimonials</button>
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection('features')} className="text-left hover:text-blue-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left hover:text-blue-600 transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-left hover:text-blue-600 transition-colors">Testimonials</button>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors text-center">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Better Habits,<br />One Day at a Time
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Transform your life with HabitFlow. The simplest way to track habits, stay consistent, and achieve your goals effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-full text-lg hover:bg-blue-600 transition-colors">
              Start Free Today
            </button>
            <button className="border-2 border-black text-black px-8 py-4 rounded-full text-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <div>
              <h2 className="text-4xl font-bold mb-6">Track Everything That Matters</h2>
              <p className="text-lg text-gray-600 mb-6">
                From morning routines to evening wind-downs, track any habit you want to build. Set custom frequencies, add notes, and watch your progress unfold with beautiful visualizations.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Unlimited habit tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Custom frequencies and reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Beautiful progress charts</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center">
              <span className="text-gray-400 text-lg">Feature Image Placeholder</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center order-2 md:order-1">
              <span className="text-gray-400 text-lg">Feature Image Placeholder</span>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">Stay Motivated with Streaks</h2>
              <p className="text-lg text-gray-600 mb-6">
                Nothing feels better than seeing your streak grow day by day. Our intelligent streak system keeps you motivated and celebrates your consistency with meaningful milestones.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Smart streak tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Milestone celebrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Weekly and monthly insights</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <div>
              <h2 className="text-4xl font-bold mb-6">Simple Yet Powerful</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe the best tools disappear into your routine. HabitFlow is designed to be intuitive, fast, and distraction-free. Check in with your habits in seconds, not minutes.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Lightning-fast interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>One-tap habit logging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Clean, minimal design</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center">
              <span className="text-gray-400 text-lg">Feature Image Placeholder</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center order-2 md:order-1">
              <span className="text-gray-400 text-lg">Feature Image Placeholder</span>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">Your Data, Your Privacy</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your habits are personal. That's why we built HabitFlow with privacy at its core. Your data stays yours, encrypted and secure. No selling, no tracking, no surprises.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>No data selling ever</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Export your data anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">
                $0<span className="text-lg text-gray-600 font-normal">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Track up to 3 habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Basic streak tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Weekly reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Mobile app access</span>
                </li>
              </ul>
              <button className="w-full border-2 border-black text-black px-6 py-3 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-black text-white rounded-3xl p-8 relative">
              <div className="absolute top-0 right-8 bg-blue-600 text-white px-4 py-1 rounded-b-lg text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                $4.99<span className="text-lg text-gray-400 font-normal">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Unlimited habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Custom reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Data export</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">✓</span>
                  <span>No ads, ever</span>
                </li>
              </ul>
              <button className="w-full bg-white text-black px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Loved by Thousands</h2>
            <p className="text-xl text-gray-600">See what our users have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 mb-6">
                "HabitFlow changed my life. I've been consistent with my morning routine for 90 days straight. The streak feature is incredibly motivating!"
              </p>
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-gray-600">Product Designer</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 mb-6">
                "Finally, a habit tracker that doesn't overwhelm me. Simple, beautiful, and it just works. Best $5 I spend every month."
              </p>
              <div>
                <div className="font-semibold">Marcus Johnson</div>
                <div className="text-sm text-gray-600">Entrepreneur</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 mb-6">
                "I tried every habit app out there. HabitFlow is the only one I stuck with. The minimalist design keeps me focused on what matters."
              </p>
              <div>
                <div className="font-semibold">Emily Rodriguez</div>
                <div className="text-sm text-gray-600">Writer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Better Habits?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of people transforming their lives, one habit at a time.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-full text-lg hover:bg-blue-600 hover:text-white transition-colors">
            Start Your Journey Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">HabitFlow</div>
              <p className="text-gray-600">Build better habits, one day at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-600">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600">Pricing</button></li>
                <li><a href="#" className="hover:text-blue-600">Download</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2025 HabitFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
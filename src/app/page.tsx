"use client";

import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    text: "ExpenseFlow changed my financial life. I've been tracking my expenses for 90 days straight and saved 30% more than before!",
    name: "Sarah Chen",
    role: "Product Designer",
    image: "SC"
  },
  {
    text: "Finally, an expense tracker that doesn't overwhelm me. Simple, beautiful, and it just works. Best decision I made this year.",
    name: "Marcus Johnson",
    role: "Entrepreneur",
    image: "MJ"
  },
  {
    text: "I tried every expense app out there. ExpenseFlow is the only one I stuck with. The minimalist design keeps me focused on saving.",
    name: "Emily Rodriguez",
    role: "Writer",
    image: "ER"
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">ExpenseFlow</div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-[#00B67A] transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-[#00B67A] transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-[#00B67A] transition-colors">Testimonials</button>
            <a href="/login" className="text-gray-600 hover:text-[#00B67A] transition-colors">Login</a>
            <a href="/signup" className="bg-[#00B67A] text-white px-6 py-2 rounded-md hover:bg-[#009966] transition-colors">
              Sign Up
            </a>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection('features')} className="text-left text-gray-600 hover:text-[#00B67A]">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left text-gray-600 hover:text-[#00B67A]">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-left text-gray-600 hover:text-[#00B67A]">Testimonials</button>
              <a href="/login" className="text-left text-gray-600 hover:text-[#00B67A]">Login</a>
              <a href="/signup" className="bg-[#00B67A] text-white px-6 py-2 rounded-md hover:bg-[#009966] text-center">Sign Up</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Smart Money Management,<br />Simplified
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Track expenses, visualize spending patterns, and take control of your finances with ExpenseFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-[#00B67A] text-white px-8 py-4 rounded-md text-lg hover:bg-[#009966] transition-colors">
              Get Started Free
            </a>
            <a href="/login" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-md text-lg hover:border-[#00B67A] hover:text-[#00B67A] transition-colors">
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features, simple interface</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#00B67A] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00B67A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Visual Analytics</h3>
              <p className="text-gray-600">Beautiful charts and graphs to understand your spending patterns at a glance.</p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#00B67A] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00B67A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Categories</h3>
              <p className="text-gray-600">Organize expenses with customizable categories for better financial insights.</p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <div className="w-12 h-12 bg-[#00B67A] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00B67A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">Your financial data stays yours. Encrypted and protected at all times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Free</h3>
              <div className="text-4xl font-bold mb-6 text-gray-900">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#00B67A]">✓</span>
                  <span>Track unlimited expenses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00B67A]">✓</span>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00B67A]">✓</span>
                  <span>7 categories</span>
                </li>
              </ul>
              <a href="/signup" className="block w-full text-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:border-[#00B67A] hover:text-[#00B67A] transition-colors">
                Start Free
              </a>
            </div>

            <div className="bg-[#00B67A] text-white rounded-lg p-8 relative">
              <div className="absolute top-0 right-8 bg-black text-white px-4 py-1 rounded-b-lg text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                $4.99<span className="text-lg font-normal opacity-80">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>CSV export</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <a href="/signup" className="block w-full text-center bg-white text-[#00B67A] px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users</p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-lg p-12 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#00B67A] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                  {testimonials[currentTestimonial].image}
                </div>
                <p className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-[#00B67A]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-[#00B67A] text-white rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6">
            Start Managing Your Money Better
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands taking control of their finances today.
          </p>
          <a href="/signup" className="inline-block bg-white text-[#00B67A] px-8 py-4 rounded-md text-lg hover:bg-gray-50 transition-colors">
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4 text-gray-900">ExpenseFlow</div>
              <p className="text-gray-600">Smart money management, simplified.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-[#00B67A]">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#00B67A]">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#00B67A]">About</a></li>
                <li><a href="#" className="hover:text-[#00B67A]">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#00B67A]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#00B67A]">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-600">
            <p>&copy; 2025 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
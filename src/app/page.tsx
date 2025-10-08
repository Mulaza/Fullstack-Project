'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const testimonials = [
   {
    text: "ExpenseFlow changed my financial life. I've been tracking my expenses for 90 days straight and saved 30% more than before!",
    name: "Sarah Chen",
    role: "Product Designer",
    image: "/faces/face-5.png"
  },
  {
    text: "Finally, an expense tracker that doesn't overwhelm me. Simple, beautiful, and it just works. Best decision I made this year.",
    name: "Marcus Johnson",
    role: "Entrepreneur",
    image: "/faces/face-1.png"
  },
  {
    text: "I tried every expense app out there. ExpenseFlow is the only one I stuck with. The minimalist design keeps me focused on saving.",
    name: "Emily Rodriguez",
    role: "Writer",
    image: "/faces/face-2.png"
  },
  {
    text: "The analytics are incredible. I discovered I was spending $400/month on subscriptions I forgot about!",
    name: "David Park",
    role: "Software Engineer",
    image: "/faces/face-4.png"
  },
  {
    text: "As a freelancer, tracking business expenses used to be a nightmare. ExpenseFlow makes it effortless.",
    name: "Lisa Thompson",
    role: "Freelance Designer",
    image: "/faces/face-3.png"
  }
];

// Sample data for demo charts
const sampleLineData = [
  { date: 'Jan 1', amount: 245 },
  { date: 'Jan 8', amount: 380 },
  { date: 'Jan 15', amount: 290 },
  { date: 'Jan 22', amount: 450 },
  { date: 'Jan 29', amount: 320 },
  { date: 'Feb 5', amount: 410 },
];

const samplePieData = [
  { name: 'Food', value: 850, color: '#000000' },
  { name: 'Transport', value: 450, color: '#3f3f46' },
  { name: 'Entertainment', value: 320, color: '#71717a' },
  { name: 'Bills', value: 680, color: '#d4d4d8' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold text-black"><img src={"/logo.svg"} width={150}/></div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-sm text-gray-600 hover:text-black transition-colors">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm text-gray-600 hover:text-black transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-sm text-gray-600 hover:text-black transition-colors">Testimonials</button>
            <a href="/login" className="text-sm text-gray-600 hover:text-black transition-colors">Login</a>
            <a href="/signup" className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors">Get Started</a>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollToSection('features')} className="text-left text-sm text-gray-600 hover:text-black py-2">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-left text-sm text-gray-600 hover:text-black py-2">Pricing</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-left text-sm text-gray-600 hover:text-black py-2">Testimonials</button>
              <a href="/login" className="text-left text-sm text-gray-600 hover:text-black py-2">Login</a>
              <a href="/signup" className="bg-black text-white px-4 py-2 rounded-full text-sm text-center hover:bg-gray-800">Get Started</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Smart expense tracking for everyone</div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-black tracking-tight">Finances made<br />simple</h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Track expenses, visualize spending patterns, and take control of your financial future with ExpenseFlow.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors">Get Started Free</a>
            <a href="/login" className="border border-gray-300 text-black px-8 py-3 rounded-full text-base font-medium hover:bg-gray-50 transition-colors">Sign In</a>
          </div>
          <p className="mt-6 text-sm text-gray-500">No credit card required · Free forever</p>
        </div>
      </section>

      {/* Visual Section 1 - Line Chart */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Powerful insights at your fingertips</div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl p-8 ">
              <h3 className="text-lg font-semibold mb-4 text-black">Your Spending Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#000000" strokeWidth={3} dot={{ fill: '#000', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Track every dollar with precision</h2>
              <p className="text-lg text-gray-600 mb-6">Get real-time insights into your spending habits. Our intelligent categorization and beautiful visualizations make it easy to see where your money goes.</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automatic expense categorization
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Beautiful visual reports
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Export data anytime
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Section 2 - Pie Chart */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block mb-8 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Stay organized effortlessly</div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Never miss a transaction</h2>
              <p className="text-lg text-gray-600 mb-6">Keep all your expenses in one place. Whether it's a coffee or a car payment, ExpenseFlow helps you stay on top of every purchase.</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Quick expense entry
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Smart search and filters
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 ">
              <h3 className="text-lg font-semibold mb-4 text-black">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={samplePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: $${entry.value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {samplePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Built for modern finance</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Everything you need</h2>
            <p className="text-lg text-gray-600">Powerful features in a simple package</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Visual Analytics</h3>
              <p className="text-gray-600">Beautiful charts and graphs to understand your spending patterns at a glance.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Smart Categories</h3>
              <p className="text-gray-600">Organize expenses with customizable categories for better financial insights.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Secure & Private</h3>
              <p className="text-gray-600">Your financial data stays yours. Encrypted and protected at all times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Transparent pricing</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Simple pricing</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-black">Free</h3>
              <div className="text-4xl font-bold mb-6 text-black">$0<span className="text-base font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                 <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track unlimited expenses
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  7 categories
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6"/>
                </svg>
                  PDF export
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6"/>
                </svg>
                  CSV export
                </li>
              </ul>
              <a href="/signup" className="block w-full text-center border border-gray-300 text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Start Free</a>
            </div>

            <div className="bg-black text-white rounded-2xl p-8 relative ring-2 ring-black">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-1 rounded-full text-xs font-medium">Most Popular</div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$4.99<span className="text-base font-normal opacity-80">/month</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track unlimited expenses
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  7 categories
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PDF export
                </li>
                <li className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6"/>
                </svg>
                  CSV export
                </li>
              </ul>
              <a href="/signup" className="block w-full text-center bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">Get Started</a>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-black">Business</h3>
              <div className="text-4xl font-bold mb-6 text-black">$14.99<span className="text-base font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                         <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track unlimited expenses
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track unlimited expenses
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  7 categories
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PDF export
                </li>
                                <li className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  CSV export
                </li>
              </ul>
              <a href="/signup" className="block w-full text-center border border-gray-300 text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Get Started</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Loved by thousands</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">What users say</h2>
          <p className="text-lg text-gray-600">Join thousands of satisfied users</p>
        </div>

        <div className="relative">
          <div ref={scrollContainerRef} className="flex gap-6 overflow-hidden" style={{ scrollBehavior: 'auto' }}>
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 flex-shrink-0 w-[400px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    <img src={testimonial.image} width={50} height={50}/>
                  </div>
                  <div>
                    <div className="font-semibold text-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-black text-white rounded-3xl p-16">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 rounded-full text-sm">Get started today</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start tracking today</h2>
          <p className="text-lg opacity-90 mb-8 text-gray-300">Join thousands taking control of their finances.</p>
          <a href="/signup" className="inline-block bg-white text-black px-8 py-3 rounded-full text-base font-medium hover:bg-gray-100 transition-colors">Get Started Free</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-semibold mb-4">ExpenseFlow</div>
              <p className="text-sm text-gray-400">Smart money management, simplified.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
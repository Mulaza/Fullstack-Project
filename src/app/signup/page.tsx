"use client";

import React, { useState } from 'react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!agreeToTerms) {
      alert("Please agree to the Terms and Privacy Policy");
      return;
    }
    console.log('Signup attempt:', { name, email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#00B67A] text-white p-12 flex-col justify-between">
        <div>
          <a href="/" className="text-3xl font-bold hover:opacity-80 transition-opacity">
            ExpenseFlow
          </a>
        </div>

        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Financial Journey
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Join thousands managing their expenses smarter with ExpenseFlow.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#00B67A] font-bold">✓</span>
              </div>
              <span>Track unlimited expenses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#00B67A] font-bold">✓</span>
              </div>
              <span>Beautiful visual analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#00B67A] font-bold">✓</span>
              </div>
              <span>Secure and private</span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 rounded-2xl h-64 flex items-center justify-center">
          <span className="opacity-50 text-lg">Dashboard Preview</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8">
            <a href="/" className="text-3xl font-bold text-gray-900 hover:text-[#00B67A] transition-colors">
              ExpenseFlow
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2 text-gray-900">Create Account</h2>
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#00B67A] hover:underline font-semibold">
                Sign in
              </a>
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-900">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#00B67A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-900">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#00B67A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#00B67A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-gray-900">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#00B67A] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-[#00B67A] focus:ring-[#00B67A]"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-[#00B67A] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-[#00B67A] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#00B67A] text-white py-3 rounded-md font-semibold hover:bg-[#009966] transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full border-2 border-gray-200 py-3 rounded-md font-semibold hover:border-[#00B67A] hover:text-[#00B67A] transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  validateUsername, 
  validateEmail, 
  validatePassword,
  sanitizeInput,
  USERNAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH 
} from '../lib/validation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validateForm = () => {
    const nameValidation = validateUsername(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setValidationErrors({
      name: nameValidation.error || '',
      email: emailValidation.error || '',
      password: passwordValidation.error || ''
    });

    if (!nameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sanitize inputs before sending
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: sanitizedEmail, 
          password, 
          name: sanitizedName 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Now sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Creating your account...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-block text-2xl font-semibold text-black mb-8 hover:opacity-80 transition-opacity">
            ExpenseFlow
          </a>
          <h1 className="text-3xl font-bold mb-2 text-black">Create account</h1>
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-black underline hover:no-underline font-medium">
              Sign in
            </a>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-black">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationErrors({ ...validationErrors, name: '' });
              }}
              placeholder="John Doe"
              maxLength={USERNAME_MAX_LENGTH}
              required
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                validationErrors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-black focus:ring-black'
              }`}
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {name.length}/{USERNAME_MAX_LENGTH} characters
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors({ ...validationErrors, email: '' });
              }}
              placeholder="name@example.com"
              required
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                validationErrors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-black focus:ring-black'
              }`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors({ ...validationErrors, password: '' });
              }}
              placeholder="Create a strong password"
              maxLength={PASSWORD_MAX_LENGTH}
              required
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                validationErrors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-black focus:ring-black'
              }`}
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Must be 8-128 characters with at least one letter and one number
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-black">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" className="text-black underline hover:no-underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-black underline hover:no-underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button 
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full border border-gray-300 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          Free forever · No credit card required
        </p>
      </div>
    </div>
  );
}
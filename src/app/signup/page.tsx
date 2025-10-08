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

  const handleGithubSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
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
          onClick={handleGithubSignup}
          disabled={loading}
          className="w-full border border-gray-300 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
<svg
  className="w-5 h-5"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.958-.266 1.983-.399 3.003-.404 1.02.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.804 5.625-5.475 5.921.43.372.814 1.102.814 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
  />
</svg>

          Continue with Github
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          Free forever · No credit card required
        </p>
      </div>
    </div>
  );
}
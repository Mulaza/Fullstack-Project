"use client";

import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
            HabitFlow
          </a>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/login" className="bg-black text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
              Sign In
            </a>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 text-lg">Last updated: October 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using HabitFlow, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HabitFlow provides a habit tracking application that allows users to track their daily habits, build streaks, and monitor their progress over time. Our service includes both free and premium subscription tiers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of HabitFlow, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. User Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain all rights to the content you create and store in HabitFlow, including your habit data, notes, and any other information you input into the service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our service, you grant HabitFlow a limited license to store, process, and display your content solely for the purpose of providing and improving our service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Use the service for any illegal purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use the service to transmit any malicious code or harmful content</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Harvest or collect information about other users without their consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Subscriptions and Payments</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HabitFlow offers both free and paid subscription plans. Paid subscriptions are billed on a recurring basis and will automatically renew unless cancelled before the renewal date.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may cancel your subscription at any time through your account settings. Cancellations will take effect at the end of your current billing period. No refunds will be provided for partial subscription periods.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to change our subscription fees at any time. Any price changes will be communicated to you in advance and will take effect on your next billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The HabitFlow service, including its original content, features, and functionality, is owned by HabitFlow and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              HabitFlow is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, HabitFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Email: legal@habitflow.com<br />
              Address: 123 Habit Street, San Francisco, CA 94102
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>&copy; 2025 HabitFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="mailto:support@habitflow.com" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
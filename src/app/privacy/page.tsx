"use client";

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
            ExpenseFlow
          </a>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              Terms of Service
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
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Last updated: October 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At ExpenseFlow, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our habit tracking application. Please read this privacy policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Name and email address when you create an account</li>
              <li>Password (encrypted and never stored in plain text)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Profile information you choose to add</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">Habit Data</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you use ExpenseFlow, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Habits you create and track</li>
              <li>Completion records and streak data</li>
              <li>Notes and comments you add to your habits</li>
              <li>Settings and preferences</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you access our service, we automatically collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address and location data</li>
              <li>Usage data (features used, time spent, interactions)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and manage your subscription</li>
              <li>Send you technical notices, updates, and security alerts</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Protect against fraudulent or illegal activity</li>
              <li>Send you promotional communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>End-to-end encryption for sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal information</li>
              <li>Secure data storage with encrypted backups</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>With service providers who help us operate our business (e.g., payment processors, hosting services)</li>
              <li>When required by law or to respond to legal processes</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>In connection with a merger, acquisition, or sale of assets (you will be notified)</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your personal information</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your personal information</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@expenseflow.com.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to improve your experience. You can control cookies through your browser settings. Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Essential cookies (required for the service to function)</li>
              <li>Analytics cookies (to understand how you use our service)</li>
              <li>Preference cookies (to remember your settings)</li>
              <li>Marketing cookies (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              ExpenseFlow is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that your data receives an adequate level of protection.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">11. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of ExpenseFlow after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
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
          <p>&copy; 2025 ExpenseFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="mailto:support@expenseflow.com" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
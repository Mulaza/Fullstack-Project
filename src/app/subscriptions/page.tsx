'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SubscriptionsPage() {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUser(user);
    await fetchPlans();
    await fetchUserSubscription(user.id);
  };

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) {
      console.error('Error fetching plans:', error);
    } else if (data) {
      setPlans(data);
    }
  };

  const fetchUserSubscription = async (userId) => {
    setLoading(true);
    
    // Use the view to get subscription with plan details
    const { data } = await supabase
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setCurrentSubscription(data);
      setSelectedPlan(data.plan_id);
    }
    setLoading(false);
  };

  const handleUpgradePlan = async () => {
    if (selectedPlan === currentSubscription?.plan_id) {
      return;
    }

    setUpgrading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Find the selected plan's name
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      
      const response = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ planName: selectedPlanData.name })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        setUpgrading(false);
        return;
      }

      setCurrentSubscription(data.subscription);
      setUpgrading(false);
      alert(data.message);
    } catch (error) {
      alert('Error updating plan: ' + error.message);
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {upgrading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Updating your plan...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
            <h1 className="text-xl font-semibold text-black">Dashboard</h1>
          </div>
          <span className="px-4 py-2 bg-gray-100 text-black rounded-full text-sm font-medium capitalize">
            Current: {currentSubscription?.plan_name || 'free'}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-black">Choose Your Plan</h2>
          <p className="text-lg text-gray-600">Select the perfect plan for your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => {
            const features = Array.isArray(plan.features) ? plan.features : [];
            const isCurrentPlan = currentSubscription?.plan_id === plan.id;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`bg-white p-8 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-black shadow-lg'
                    : 'border-2 border-gray-200 hover:border-gray-300'
                } ${isCurrentPlan ? 'ring-2 ring-black ring-offset-4' : ''}`}
              >
                {isCurrentPlan && (
                  <div className="inline-block mb-3 px-3 py-1 bg-black text-white rounded-full text-xs font-semibold">
                    CURRENT PLAN
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-2xl font-bold text-black mb-2">{plan.display_name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-black">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto ${
                  isSelected
                    ? 'border-black bg-black'
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-md mx-auto">
          <button
            onClick={handleUpgradePlan}
            disabled={selectedPlan === currentSubscription?.plan_id || upgrading}
            className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedPlan === currentSubscription?.plan_id 
              ? 'Current Plan' 
              : `Switch to ${plans.find(p => p.id === selectedPlan)?.display_name || 'Plan'}`
            }
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Changes take effect immediately. No hidden fees.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="text-2xl font-bold mb-8 text-black text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 text-sm">Yes, you can cancel or downgrade your plan at any time. Changes take effect at the end of your billing period.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept all major credit cards and debit cards through our secure payment processor.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-2">Is my data secure?</h4>
              <p className="text-gray-600 text-sm">Absolutely. We use bank-level encryption to protect your financial data. Your information is never shared with third parties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
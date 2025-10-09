'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other'];

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentView, setCurrentView] = useState('charts');
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    notes: ''
  });

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
    await fetchUserSubscription(user.id);
    await fetchExpenses(user.id);
  };

  const fetchUserSubscription = async (userId) => {
    const { data, error } = await supabase
      .from('user_subscription_details')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
    }
    
    if (data) {
      setSubscription(data);
      return;
    }

    console.log('No subscription found, creating one...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/subscriptions/ensure', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success && result.subscription) {
        console.log('Subscription created successfully');
        setSubscription(result.subscription);
      } else {
        console.error('Failed to create subscription');
        setSubscription({
          plan_name: 'free',
          display_name: 'Free',
          can_export_pdf: false,
          can_export_csv: false,
          price: 0,
          features: []
        });
      }
    } catch (err) {
      console.error('Error auto-creating subscription:', err);
      setSubscription({
        plan_name: 'free',
        display_name: 'Free',
        can_export_pdf: false,
        can_export_csv: false,
        price: 0,
        features: []
      });
    }
  };

  const fetchExpenses = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Food',
      notes: ''
    });
  };

  const handleAddExpense = async () => {
    if (!formData.title || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }

    setActionLoading(true);
    setLoadingMessage('Adding expense...');

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: user.id,
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        notes: formData.notes
      }])
      .select()
      .single();

    if (error) {
      alert('Error adding expense: ' + error.message);
      setActionLoading(false);
    } else {
      setExpenses([data, ...expenses]);
      setShowModal(false);
      resetForm();
      setActionLoading(false);
    }
  };

  const handleEditExpense = async () => {
    setActionLoading(true);
    setLoadingMessage('Updating expense...');

    const { data, error } = await supabase
      .from('expenses')
      .update({
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        notes: formData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedExpense.id)
      .select()
      .single();

    if (error) {
      alert('Error updating expense: ' + error.message);
      setActionLoading(false);
    } else {
      setExpenses(expenses.map(exp => 
        exp.id === selectedExpense.id ? data : exp
      ));
      setShowEditModal(false);
      setSelectedExpense(null);
      resetForm();
      setActionLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    setActionLoading(true);
    setLoadingMessage('Deleting expense...');

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', selectedExpense.id);

    if (error) {
      alert('Error deleting expense: ' + error.message);
      setActionLoading(false);
    } else {
      setExpenses(expenses.filter(exp => exp.id !== selectedExpense.id));
      setShowDeleteModal(false);
      setSelectedExpense(null);
      setActionLoading(false);
    }
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      date: expense.date,
      category: expense.category,
      notes: expense.notes || ''
    });
    setShowEditModal(true);
  };

  const exportToCSV = async () => {
    if (!subscription?.can_export_csv) {
      window.location.href = '/subscriptions';
      return;
    }

    setActionLoading(true);
    setLoadingMessage('Generating CSV...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/exports/csv', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          try {
            const error = await response.json();
            if (error.requiresUpgrade) {
              alert(error.error);
              window.location.href = '/subscriptions';
            } else {
              alert('Error generating CSV: ' + error.error);
            }
          } catch (parseError) {
            alert('Error generating CSV. Please try again.');
          }
        } else {
          alert('Server error occurred. Please try again.');
        }
        setActionLoading(false);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setActionLoading(false);
    } catch (error) {
      alert('Error: ' + error.message);
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const expensesByCategory = categories.map(cat => ({
    name: cat,
    value: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  })).filter(item => item.value > 0);

  const expensesByDate = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const lineChartData = Object.keys(expensesByDate).sort().map(date => ({
    date,
    amount: expensesByDate[date]
  }));

  const top5Expenses = [...expenses]
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 5)
    .map(exp => ({
      title: exp.title.length > 15 ? exp.title.substring(0, 15) + '...' : exp.title,
      amount: parseFloat(exp.amount),
      category: exp.category
    }));

  const categoryColors = {
    Food: '#000000',
    Transport: '#3f3f46',
    Entertainment: '#52525b',
    Health: '#71717a',
    Shopping: '#a1a1aa',
    Bills: '#d4d4d8',
    Other: '#e4e4e7'
  };

  const getUserInitial = () => {
    return user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  // NEW: Check if user has access to advanced charts (Pro/Business)
  const hasAdvancedCharts = () => subscription?.can_export_pdf || false;
  const canExportCSV = () => subscription?.can_export_csv || false;
  const userPlan = subscription?.plan_name || 'free';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {actionLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">{loadingMessage}</p>
          </div>
        </div>
      )}

      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 fixed left-0 top-0 bottom-0 z-30">
        <div className="flex-1 flex flex-col gap-6 mt-8">
          <button
            onClick={() => setCurrentView('charts')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === 'charts'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Charts View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentView('table')}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              currentView === 'table'
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Table View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col ml-16">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-black">ExpenseFlow</h1>
            
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                disabled={!canExportCSV()}
                className={`border px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  canExportCSV()
                    ? 'border-gray-300 text-black hover:bg-gray-50'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={!canExportCSV() ? 'Requires Business plan' : 'Export to CSV'}
              >
                Export CSV
              </button>

              <a
                href="/subscriptions"
                className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium capitalize hover:bg-gray-200 transition-colors"
              >
                {userPlan}
              </a>
              
              <a
                href="/subscriptions"
                className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors font-medium"
              >
                {userPlan === 'free' ? 'Upgrade' : 'Change Plan'}
              </a>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-medium text-black">{getUserName()}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitial()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {currentView === 'charts' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1 font-medium">Total Expenses</div>
                <div className="text-3xl font-bold text-black">${totalExpenses.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1 font-medium">Average Expense</div>
                <div className="text-3xl font-bold text-black">${avgExpense.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1 font-medium">Total Transactions</div>
                <div className="text-3xl font-bold text-black">{expenses.length}</div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              + Add Expense
            </button>
          </div>

          {currentView === 'charts' && expenses.length > 0 && (
            <>
              {/* FREE CHARTS - Always visible */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-base font-semibold mb-4 text-black">Spending Over Time</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#000000" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-base font-semibold mb-4 text-black">Expense Categories</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PRO CHARTS - Locked for free users */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top 5 Biggest Expenses - PRO FEATURE */}
                {top5Expenses.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-black">Top 5 Biggest Expenses</h3>
                      {!hasAdvancedCharts() && (
                        <span className="px-2 py-1 bg-black text-white text-xs font-semibold rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    
                    {hasAdvancedCharts() ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={top5Expenses} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                          <YAxis dataKey="title" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={120} />
                          <Tooltip />
                          <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                            {top5Expenses.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || '#000000'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="relative h-[300px]">
                        {/* Blurred preview */}
                        <div className="absolute inset-0 filter blur-md opacity-40">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={top5Expenses} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                              <YAxis dataKey="title" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={120} />
                              <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                                {top5Expenses.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || '#000000'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Lock overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-bold text-black mb-2">Unlock Advanced Analytics</h4>
                          <p className="text-sm text-gray-600 mb-4 text-center max-w-xs">
                            Upgrade to Pro to access detailed expense breakdowns and insights
                          </p>
                          <a
                            href="/subscriptions"
                            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                          >
                            Upgrade to Pro
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Category Breakdown - PRO FEATURE */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-black">Category Breakdown</h3>
                    {!hasAdvancedCharts() && (
                      <span className="px-2 py-1 bg-black text-white text-xs font-semibold rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                  
                  {hasAdvancedCharts() ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={expensesByCategory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="relative h-[300px]">
                      {/* Blurred preview */}
                      <div className="absolute inset-0 filter blur-md opacity-40">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={expensesByCategory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                            <Bar dataKey="value" fill="#000000" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-bold text-black mb-2">Unlock Advanced Analytics</h4>
                        <p className="text-sm text-gray-600 mb-4 text-center max-w-xs">
                          Upgrade to Pro to see detailed category analysis
                        </p>
                        <a
                          href="/subscriptions"
                          className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Upgrade to Pro
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentView === 'table' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-base font-semibold text-black">All Expenses</h3>
              </div>
              {expenses.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No expenses yet. Click "Add Expense" to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Notes</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expenses.map(expense => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-black">{expense.title}</td>
                          <td className="px-6 py-4 text-sm text-black">${parseFloat(expense.amount).toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{expense.date}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-black">
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{expense.notes || '-'}</td>
                          <td className="px-6 py-4 text-right text-sm space-x-3">
                            <button
                              onClick={() => openEditModal(expense)}
                              className="text-black hover:underline font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedExpense(expense);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:underline font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {currentView === 'charts' && expenses.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-gray-500 mb-2 font-medium">No expenses to display</div>
              <div className="text-sm text-gray-400">Add your first expense to see charts and analytics</div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-40"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-black">Add Expense</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Groceries"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex-1 border border-gray-300 py-2.5 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-40"
          onClick={() => {
            setShowEditModal(false);
            setSelectedExpense(null);
            resetForm();
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-black">Edit Expense</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedExpense(null);
                  resetForm();
                }}
                className="flex-1 border border-gray-300 py-2.5 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditExpense}
                className="flex-1 bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-40"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedExpense(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-black">Delete Expense</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{selectedExpense?.title}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedExpense(null);
                }}
                className="flex-1 border border-gray-300 py-2.5 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExpense}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-full hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
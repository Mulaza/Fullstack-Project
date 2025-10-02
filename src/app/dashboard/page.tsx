"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Supabase client - Replace with actual Supabase client
const mockSupabase = {
  auth: {
    getUser: async () => ({ data: { user: { id: '123', email: 'user@example.com' } }, error: null })
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ 
          data: mockExpenses, 
          error: null 
        })
      })
    }),
    insert: (data) => Promise.resolve({ data, error: null }),
    update: (data) => ({
      eq: () => Promise.resolve({ data, error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  })
};

const mockExpenses = [
  { id: '1', title: 'Groceries', amount: 85.50, date: '2025-09-15', category: 'Food', notes: 'Weekly shopping', user_id: '123' },
  { id: '2', title: 'Gas', amount: 45.00, date: '2025-09-18', category: 'Transport', notes: 'Fuel', user_id: '123' },
  { id: '3', title: 'Netflix', amount: 15.99, date: '2025-09-01', category: 'Entertainment', notes: 'Monthly subscription', user_id: '123' },
  { id: '4', title: 'Dinner', amount: 62.30, date: '2025-09-20', category: 'Food', notes: 'Restaurant', user_id: '123' },
  { id: '5', title: 'Uber', amount: 18.50, date: '2025-09-22', category: 'Transport', notes: 'Ride to work', user_id: '123' },
  { id: '6', title: 'Coffee', amount: 5.75, date: '2025-09-23', category: 'Food', notes: 'Morning coffee', user_id: '123' },
  { id: '7', title: 'Gym', amount: 50.00, date: '2025-09-01', category: 'Health', notes: 'Monthly membership', user_id: '123' },
  { id: '8', title: 'Books', amount: 28.99, date: '2025-09-10', category: 'Entertainment', notes: 'Amazon order', user_id: '123' },
];

const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other'];
const categoryColors = {
  Food: '#3b82f6',
  Transport: '#10b981',
  Entertainment: '#f59e0b',
  Health: '#ef4444',
  Shopping: '#8b5cf6',
  Bills: '#6366f1',
  Other: '#6b7280'
};

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [userPlan, setUserPlan] = useState('free'); // 'free' or 'premium'
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    notes: ''
  });

  // Filter state
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    // In real app: const { data } = await supabase.from('expenses').select('*').eq('user_id', userId);
    setExpenses(mockExpenses);
  };

  const handleAddExpense = async () => {
    if (!formData.title || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }

    const newExpense = {
      ...formData,
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      user_id: '123'
    };

    // In real app: await supabase.from('expenses').insert(newExpense);
    setExpenses([newExpense, ...expenses]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditExpense = async () => {
    if (!formData.title || !formData.amount) return;

    const updatedExpense = {
      ...editingExpense,
      ...formData,
      amount: parseFloat(formData.amount)
    };

    // In real app: await supabase.from('expenses').update(updatedExpense).eq('id', editingExpense.id);
    setExpenses(expenses.map(exp => exp.id === editingExpense.id ? updatedExpense : exp));
    setEditingExpense(null);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Delete this expense?')) return;
    // In real app: await supabase.from('expenses').delete().eq('id', id);
    setExpenses(expenses.filter(exp => exp.id !== id));
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

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      date: expense.date,
      category: expense.category,
      notes: expense.notes || ''
    });
    setShowAddModal(true);
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const expensesByCategory = categories.map(cat => ({
    name: cat,
    value: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(item => item.value > 0);

  const expensesByMonth = expenses.reduce((acc, exp) => {
    const month = exp.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});

  const monthlyData = Object.keys(expensesByMonth).sort().map(month => ({
    month,
    amount: expensesByMonth[month]
  }));

  // Filter expenses
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Export functions
  const exportToCSV = () => {
    if (userPlan !== 'premium') {
      setShowUpgradeModal(true);
      return;
    }

    const headers = ['Title', 'Amount', 'Date', 'Category', 'Notes'];
    const rows = expenses.map(exp => [
      exp.title,
      exp.amount,
      exp.date,
      exp.category,
      exp.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    if (userPlan !== 'premium') {
      setShowUpgradeModal(true);
      return;
    }
    alert('PDF Export would generate a formatted report here!');
  };

  const handleUpgrade = async () => {
    // In real app: process payment, then update user plan in Supabase
    // await supabase.from('profiles').update({ plan: 'premium' }).eq('id', userId);
    setUserPlan('premium');
    setShowUpgradeModal(false);
    alert('Successfully upgraded to Premium! 🎉');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">ExpenseFlow</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              userPlan === 'premium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {userPlan === 'premium' ? '✨ Premium' : 'Free'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {userPlan === 'free' && (
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
              >
                Upgrade to Premium
              </button>
            )}
            <button className="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">Total Expenses</div>
            <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">This Month</div>
            <div className="text-3xl font-bold">${expenses.filter(exp => exp.date.startsWith('2025-09')).reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">Total Transactions</div>
            <div className="text-3xl font-bold">{expenses.length}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
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

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setEditingExpense(null);
                  resetForm();
                  setShowAddModal(true);
                }}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors font-semibold"
              >
                + Add Expense
              </button>
              <button
                onClick={exportToCSV}
                className="border-2 border-gray-300 px-6 py-3 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors font-semibold"
              >
                Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="border-2 border-gray-300 px-6 py-3 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors font-semibold"
              >
                Export PDF
              </button>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-600 focus:outline-none"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-600 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold">Recent Expenses</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredExpenses.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No expenses found. Add your first expense to get started!
              </div>
            ) : (
              filteredExpenses.map(expense => (
                <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: categoryColors[expense.category] }}
                      >
                        {expense.category.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{expense.title}</div>
                        <div className="text-sm text-gray-600">
                          {expense.category} • {expense.date}
                        </div>
                        {expense.notes && (
                          <div className="text-sm text-gray-500 mt-1">{expense.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold">${expense.amount.toFixed(2)}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(expense)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Groceries"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-blue-600 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional details..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-blue-600 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingExpense(null);
                  resetForm();
                }}
                className="flex-1 border-2 border-gray-300 py-3 rounded-full hover:border-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={editingExpense ? handleEditExpense : handleAddExpense}
                className="flex-1 bg-black text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-semibold"
              >
                {editingExpense ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
            <p className="text-gray-600 mb-6">
              Unlock export features and get the most out of ExpenseFlow!
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="text-3xl font-bold mb-2">$4.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>CSV Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>PDF Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Priority Support</span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 border-2 border-gray-300 py-3 rounded-full hover:border-gray-400 transition-colors font-semibold"
              >
                Maybe Later
              </button>
              <button
                onClick={handleUpgrade}
                className="flex-1 bg-black text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
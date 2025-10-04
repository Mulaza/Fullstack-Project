"use client";

import React, { useState } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const categories = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other'];

const initialExpenses = [
  { id: '1', title: 'Weekly Groceries', amount: 125.50, date: '2025-10-01', category: 'Food', notes: 'Supermarket shopping' },
  { id: '2', title: 'Fuel', amount: 60.00, date: '2025-10-02', category: 'Transport', notes: 'Gas station' },
  { id: '3', title: 'Netflix Subscription', amount: 15.99, date: '2025-10-01', category: 'Entertainment', notes: 'Monthly' },
  { id: '4', title: 'Restaurant Dinner', amount: 85.00, date: '2025-10-03', category: 'Food', notes: 'Date night' },
  { id: '5', title: 'Gym Membership', amount: 49.99, date: '2025-10-01', category: 'Health', notes: 'Monthly fee' },
  { id: '6', title: 'Coffee Shop', amount: 12.50, date: '2025-10-04', category: 'Food', notes: 'Morning coffee' },
];

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isPro, setIsPro] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Food',
      notes: ''
    });
  };

  const handleAddExpense = () => {
    if (!formData.title || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount)
    };

    setExpenses([newExpense, ...expenses]);
    setShowModal(false);
    resetForm();
  };

  const handleEditExpense = () => {
    const updatedExpense = {
      ...selectedExpense,
      ...formData,
      amount: parseFloat(formData.amount)
    };

    setExpenses(expenses.map(exp => exp.id === selectedExpense.id ? updatedExpense : exp));
    setShowEditModal(false);
    setSelectedExpense(null);
    resetForm();
  };

  const handleDeleteExpense = () => {
    setExpenses(expenses.filter(exp => exp.id !== selectedExpense.id));
    setShowDeleteModal(false);
    setSelectedExpense(null);
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

  const exportToCSV = () => {
    if (!isPro) {
      setShowProModal(true);
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

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Data for charts
  const expensesByCategory = categories.map(cat => ({
    name: cat,
    value: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(item => item.value > 0);

  const expensesByDate = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
    return acc;
  }, {});

  const lineChartData = Object.keys(expensesByDate).sort().map(date => ({
    date,
    amount: expensesByDate[date]
  }));

  const categoryColors = {
    Food: '#00B67A',
    Transport: '#37D5A3',
    Entertainment: '#6FE3BF',
    Health: '#009966',
    Shopping: '#00875A',
    Bills: '#006B4D',
    Other: '#004D38'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ExpenseFlow</h1>
          <div className="flex items-center gap-4">
            {!isPro && (
              <button 
                onClick={() => setShowProModal(true)}
                className="bg-[#00B67A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#009966] transition-colors font-medium"
              >
                Upgrade to Pro
              </button>
            )}
            {isPro && (
              <span className="px-3 py-1 bg-[#00B67A] bg-opacity-10 text-[#00B67A] rounded-full text-sm font-medium">
                Pro Member
              </span>
            )}
            <a href="/" className="text-gray-600 hover:text-gray-900">Logout</a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
            <div className="text-3xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Average Expense</div>
            <div className="text-3xl font-bold text-gray-900">${avgExpense.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{expenses.length}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Spending Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#00B67A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">By Category</h3>
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

        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="value" fill="#00B67A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-[#00B67A] text-white px-6 py-3 rounded-md hover:bg-[#009966] transition-colors font-medium"
          >
            + Add Expense
          </button>
          <button
            onClick={exportToCSV}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:border-gray-400 transition-colors font-medium"
          >
            Export CSV
          </button>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Recent Expenses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${categoryColors[expense.category]}20`, color: categoryColors[expense.category] }}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{expense.notes || '-'}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => openEditModal(expense)}
                        className="text-[#00B67A] hover:text-[#009966] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedExpense(expense);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Expense</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Groceries"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
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
                className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-[#00B67A] text-white py-3 rounded-md hover:bg-[#009966] transition-colors font-medium"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Confirmation Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Expense</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to edit this expense?</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00B67A] focus:ring-1 focus:ring-[#00B67A] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedExpense(null);
                  resetForm();
                }}
                className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditExpense}
                className="flex-1 bg-[#00B67A] text-white py-3 rounded-md hover:bg-[#009966] transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Delete Expense</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{selectedExpense?.title}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedExpense(null);
                }}
                className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExpense}
                className="flex-1 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pro Upgrade Modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Upgrade to Pro</h2>
            <p className="text-gray-600 mb-6">Export your expenses to CSV and unlock premium features!</p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold mb-2 text-gray-900">$4.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <ul className="space-y-3 mt-4">
                <li className="flex items-center gap-2">
                  <span className="text-[#00B67A]">✓</span>
                  <span>CSV Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00B67A]">✓</span>
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00B67A]">✓</span>
                  <span>Priority Support</span>
                </li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowProModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setIsPro(true);
                  setShowProModal(false);
                }}
                className="flex-1 bg-[#00B67A] text-white py-3 rounded-md hover:bg-[#009966] transition-colors font-medium"
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
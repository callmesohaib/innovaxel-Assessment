import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

const categories = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.05
        }
    }
};

const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

function ExpenseForm({ onSubmit, editingExpense, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: categories[0],
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingExpense) {
            setFormData({
                ...editingExpense,
                date: editingExpense.date.split('T')[0]
            });
        }
    }, [editingExpense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Amount must be positive';
        if (!formData.date) newErrors.date = 'Date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                amount: Number(formData.amount),
                date: new Date(formData.date).toISOString()
            });

            setFormData({
                title: '',
                amount: '',
                category: categories[0],
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });

            onSuccess();
        }
    };

return (
  <motion.form
    onSubmit={handleSubmit}
    className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 w-full max-w-md mx-auto md:max-w-2xl"
    variants={formVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.h2
      className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 md:mb-8 text-white border-b border-gray-700 pb-2 sm:pb-3"
      variants={inputVariants}
    >
      {editingExpense ? (
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          ✏️ Edit Expense
        </span>
      ) : (
        <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          ➕ Add New Expense
        </span>
      )}
    </motion.h2>

    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Title Field */}
      <motion.div className="flex flex-col gap-1 sm:gap-2" variants={inputVariants}>
        <label className="block text-xs sm:text-sm font-medium text-gray-300" htmlFor="title">
          Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 sm:p-3 bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm sm:text-base ${
            errors.title
              ? 'border-red-500 focus:ring-red-400/30'
              : 'border-gray-600 focus:ring-blue-400/30 focus:border-blue-400'
          } text-white placeholder-gray-400`}
          placeholder="Dinner with friends"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
      </motion.div>

      {/* Amount & Category Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6">
        {/* Amount Field */}
        <motion.div className="flex flex-col gap-1 sm:gap-2" variants={inputVariants}>
          <label className="block text-xs sm:text-sm font-medium text-gray-300" htmlFor="amount">
            Amount*
          </label>
          <div className="relative">
            <span className="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400">$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full pl-7 sm:pl-10 p-2 sm:p-3 bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm sm:text-base ${
                errors.amount
                  ? 'border-red-500 focus:ring-red-400/30'
                  : 'border-gray-600 focus:ring-blue-400/30 focus:border-blue-400'
              } text-white placeholder-gray-400`}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
        </motion.div>

        {/* Category Field */}
        <motion.div className="flex flex-col gap-1 sm:gap-2" variants={inputVariants}>
          <label className="block text-xs sm:text-sm font-medium text-gray-300" htmlFor="category">
            Category*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-sm sm:text-base text-white appearance-none"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Date Field */}
      <motion.div className="flex flex-col gap-1 sm:gap-2" variants={inputVariants}>
        <label className="block text-xs sm:text-sm font-medium text-gray-300" htmlFor="date">
          Date*
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full p-2 sm:p-3 bg-gray-700 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm sm:text-base ${
            errors.date
              ? 'border-red-500 focus:ring-red-400/30'
              : 'border-gray-600 focus:ring-blue-400/30 focus:border-blue-400'
          } text-white placeholder-gray-400`}
        />
        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
      </motion.div>

      {/* Notes Field */}
      <motion.div className="flex flex-col gap-1 sm:gap-2" variants={inputVariants}>
        <label className="block text-xs sm:text-sm font-medium text-gray-300" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-sm sm:text-base text-white placeholder-gray-400"
          rows="2"
          placeholder="Any additional details..."
        />
      </motion.div>
    </div>

    {/* Form Buttons */}
    <motion.div
      className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700"
      variants={inputVariants}
    >
      {editingExpense && (
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 bg-gray-700 text-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-600 transition-colors shadow-sm text-sm sm:text-base"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
      )}
      <motion.button
        type="submit"
        className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 bg-gradient-to-r rounded-lg sm:rounded-xl text-white transition-all shadow-lg text-sm sm:text-base ${
          editingExpense
            ? 'from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            : 'from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {editingExpense ? 'Update' : 'Add Expense'}
      </motion.button>
    </motion.div>
  </motion.form>
);
}

export default ExpenseForm;
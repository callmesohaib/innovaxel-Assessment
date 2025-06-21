import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseForm from './pages/ExpenseForm';
import ExpenseList from './pages/ExpenseList';
import SummaryStats from './pages/SummaryStats';
import SummaryChart from './pages/SummaryChart';
import FilterExpenses from './pages/FilterExpenses';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.3
    }
  }
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};
const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Housing', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('expenses');
  const [editingExpense, setEditingExpense] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    startDate: '',
    endDate: ''
  });



  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        const parsed = JSON.parse(savedExpenses);
        setExpenses(parsed);
      } catch (error) {
        console.error("Error parsing saved expenses:", error);
      }
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
      } catch (error) {
        console.error("Failed to save expenses:", error);
      }
    }
  }, [expenses, hasMounted]);

  const addExpense = (expense) => {
    const updatedExpenses = editingExpense
      ? expenses.map(e => e.id === editingExpense.id ? expense : e)
      : [{ ...expense, id: Date.now() }, ...expenses];

    setExpenses(updatedExpenses);
    setEditingExpense(null);
    setActiveTab('expenses');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-4 sm:py-6 md:py-8 px-3 sm:px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="container mx-auto max-w-full lg:max-w-screen-2xl px-4 sm:px-6 lg:px-8" // Modified for full width
        variants={itemVariants}
      >
        <motion.div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-700 mx-auto max-w-4xl lg:max-w-5xl" // Centered with max-width
          variants={itemVariants}
        >
          {/* Header */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2"
            variants={itemVariants}
          >
            Personal Expense Tracker
          </motion.h1>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8">
            Track your spending with precision
          </p>

          {/* Tab Navigation - Full width */}
          <motion.div
            className="flex flex-col sm:flex-row mb-6 sm:mb-8 rounded-lg sm:rounded-xl bg-gray-800 p-0.5 sm:p-1 border border-gray-700 w-full" // Added w-full
            variants={itemVariants}
          >
            {['expenses', 'add', 'summary'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 md:px-6 relative rounded-md sm:rounded-lg transition-all text-sm sm:text-base text-center ${activeTab === tab
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-sm sm:shadow-lg text-white font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'expenses' ? 'All Expenses' :
                  tab === 'add' ? (editingExpense ? 'Edit Expense' : 'Add Expense') :
                    'Summary'}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    layoutId="tabIndicator"
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Tab Content - Full width */}
          <AnimatePresence mode="wait">
            {activeTab === 'add' && (
              <motion.div
                key="add"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full" // Added w-full
              >
                <ExpenseForm
                  onSubmit={addExpense}
                  editingExpense={editingExpense}
                  onCancel={() => {
                    setEditingExpense(null);
                    setActiveTab('expenses');
                  }}
                  onSuccess={() => setActiveTab('expenses')}
                />
              </motion.div>
            )}

            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FilterExpenses
                  filters={filters}
                  setFilters={setFilters}
                  categories={categories}
                />
                <ExpenseList
                  expenses={expenses}
                  onDelete={deleteExpense}
                  onEdit={startEditing}
                  filters={filters}
                />
              </motion.div>
            )}

            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full" // Added w-full
              >
                <SummaryStats expenses={expenses} />
                <SummaryChart expenses={expenses} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default App;
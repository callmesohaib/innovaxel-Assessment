"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.2
    }
  }
};

function ExpenseList({ expenses, onDelete, onEdit, filters }) {
  const [activeExpense, setActiveExpense] = useState(null);
  const ref = useRef(null);
  const id = useId();
  const filteredExpenses = expenses.filter(expense => {
    // Category filter
    if (filters.category && filters.category !== 'all' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    const expenseDate = new Date(expense.date);
    if (filters.startDate && new Date(filters.startDate) > expenseDate) {
      return false;
    }
    if (filters.endDate && new Date(filters.endDate) < expenseDate) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActiveExpense(null);
      }
    }

    if (activeExpense) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // Prevent scrollbar jump
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeExpense]);

  useOutsideClick(ref, () => setActiveExpense(null));


  if (expenses.length === 0) {
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-gray-400">No expenses recorded yet. Add your first expense!</p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Overlay for expanded card */}
      <AnimatePresence>
        {activeExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card View */}
      <AnimatePresence>
        {activeExpense && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.button
              key={`close-button-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full h-10 w-10 shadow-lg z-50 transition-colors"
              onClick={() => setActiveExpense(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${activeExpense.id}-${id}`}
              ref={ref}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
            >
              <div className="p-8 overflow-y-auto">
                <motion.h2
                  layoutId={`title-${activeExpense.id}-${id}`}
                  className="text-3xl font-bold text-white mb-4"
                >
                  {activeExpense.title}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-sm text-gray-400 mb-1">Amount</h3>
                    <motion.p className="text-2xl font-semibold text-white">
                      ${activeExpense.amount.toFixed(2)}
                    </motion.p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-sm text-gray-400 mb-1">Category</h3>
                    <motion.span
                      className="inline-block px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md"
                    >
                      {activeExpense.category}
                    </motion.span>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-sm text-gray-400 mb-1">Date</h3>
                    <motion.p className="text-white">
                      {new Date(activeExpense.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </motion.p>
                  </div>
                </div>

                {activeExpense.notes && (
                  <div className="mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-sm text-gray-400 mb-2">Notes</h3>
                    <motion.p className="text-gray-300 whitespace-pre-line">
                      {activeExpense.notes}
                    </motion.p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <motion.button
                    onClick={() => {
                      onEdit(activeExpense);
                      setActiveExpense(null);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Expense
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      onDelete(activeExpense.id);
                      setActiveExpense(null);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-400 transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete Expense
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List View */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              layoutId={`card-${expense.id}-${id}`}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 hover:border-gray-600 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setActiveExpense(expense)}
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <motion.h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    {expense.title}
                  </motion.h3>
                  <motion.p className="text-sm text-gray-400">
                    {new Date(expense.date).toLocaleDateString()} •{' '}
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs bg-gray-700 text-blue-300">
                      {expense.category}
                    </span>
                  </motion.p>
                </div>
                <motion.div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  ${expense.amount.toFixed(2)}
                </motion.div>
              </div>
              {expense.notes && (
                <motion.p className="text-sm text-gray-500 mt-2 line-clamp-1 group-hover:text-gray-300 transition-colors">
                  {expense.notes}
                </motion.p>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 text-center"
          >
            <p className="text-gray-400">
              {expenses.length === 0
                ? "No expenses recorded yet. Add your first expense!"
                : "No expenses match your current filters"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

const CloseIcon = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-gray-300"
      whileHover={{ rotate: 90 }}
      transition={{ duration: 0.3 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

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

export default ExpenseList;
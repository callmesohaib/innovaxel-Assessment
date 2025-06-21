import { motion } from 'framer-motion';

export default function FilterExpenses({ filters, setFilters, categories }) {
  return (
    <motion.div 
      className="mb-6 bg-gray-800 p-4 rounded-xl border border-gray-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-medium text-white mb-4">Filter Expenses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">From Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">To Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>
    </motion.div>
  );
}
import { CardSpotlight } from "@/components/ui/card-spotlight";

function SummaryStats({ expenses }) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <CardSpotlight className="h-full p-6 relative"> {/* Added relative here */}
      <div className="relative z-0"> {/* Spotlight background layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl" />
      </div>

      <div className="relative z-10"> {/* Content layer */}
        <h2 className="text-2xl font-bold text-white">
          Spending Summary
        </h2>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-neutral-300 mb-2">Total Spending</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ${totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-neutral-300 mb-4">By Category</h3>
          <ul className="space-y-3">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <li key={category} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CategoryIcon category={category} />
                  <span className="text-white">{category}</span>
                </div>
                <span className="font-medium text-white">${amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-neutral-400 mt-6 text-sm">
          {expenses.length === 0
            ? "Add expenses to see detailed statistics"
            : "Detailed breakdown of your spending by category"}
        </p>
      </div>
    </CardSpotlight>
  );
}

const CategoryIcon = ({ category }) => {
  const icons = {
    'Food': '🍔',
    'Transport': '🚗',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Utilities': '💡',
    'Housing': '🏠',
    'Other': '✨'
  };

  return (
    <span className="text-lg">
      {icons[category] || icons['Other']}
    </span>
  );
};

export default SummaryStats;
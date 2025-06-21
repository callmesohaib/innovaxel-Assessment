import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CardSpotlight } from "@/components/ui/card-spotlight";

ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryChart({ expenses }) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Improved color palette with better contrast
  const backgroundColors = [
    'rgba(99, 102, 241, 0.85)',  // Indigo
    'rgba(217, 70, 239, 0.85)',  // Fuchsia
    'rgba(20, 184, 166, 0.85)',  // Teal
    'rgba(234, 88, 12, 0.85)',   // Orange
    'rgba(220, 38, 38, 0.85)',   // Red
    'rgba(101, 163, 13, 0.85)',  // Green
    'rgba(202, 138, 4, 0.85)',   // Amber
    'rgba(139, 92, 246, 0.85)',  // Violet
    'rgba(6, 182, 212, 0.85)',   // Cyan
  ];

  const hoverColors = backgroundColors.map(color => color.replace('0.85)', '1)'));

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: backgroundColors,
      hoverBackgroundColor: hoverColors,
      borderWidth: 0,
      borderRadius: 6,
      spacing: 4,  // Add space between segments
      cutout: '60%',  // Make it a donut chart
    }],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? 'bottom' : 'right',
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Inter, sans-serif',
            size: window.innerWidth < 768 ? 12 : 14,
            weight: '500'
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
        },
        onHover: (event, legendItem) => {
          document.body.style.cursor = 'pointer';
        },
        onLeave: () => {
          document.body.style.cursor = 'default';
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return ` ${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <CardSpotlight className="h-full p-4 sm:p-6">
      <div className="flex flex-col h-full">
        <h2 className="text-xl sm:text-2xl font-bold relative z-20 text-white mb-4 sm:mb-6">
          Spending Breakdown
        </h2>
        
        <div className="relative z-20 flex-1 min-h-[300px]">
          <Pie 
            data={data} 
            options={options}
            className="w-full h-full"
          />
        </div>
        
        <p className="text-neutral-400 mt-3 sm:mt-4 relative z-20 text-xs sm:text-sm">
          {expenses.length === 0 
            ? "Add expenses to visualize your spending" 
            : "Hover segments for details • Click legend to toggle categories"}
        </p>
      </div>
    </CardSpotlight>
  );
}

export default SummaryChart;
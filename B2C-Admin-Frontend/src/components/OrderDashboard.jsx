import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderDashboard = () => {
  
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10'],
    datasets: [
      {
        label: 'Orders',
        data: [50, 100, 75, 125, 90, 130, 85, 150, 110, 160], // Sample data values for 10 weeks
        backgroundColor: 'rgba(255, 165, 0, 0.6)', // Orange color of the bars
        borderColor: 'rgba(255, 165, 0, 1)', // Border color
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure it fills the height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Orders Over 10 Weeks',
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limit the number of ticks shown
        },
        grid:{
          display : false,
        }
      },
      y: {
        beginAtZero: true, // Start Y-axis from 0
        grid:{
          display : false,
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6 relative"> {/* Added relative positioning */}
      <h3 className="text-lg font-semibold mb-4">Order Dashboard</h3>
      <div className="absolute top-4 right-6 flex space-x-2"> {/* Positioned buttons to the top right */}
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">Weekly</button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">Monthly</button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">Yearly</button>
      </div>
      <div className="h-64 w-full"> {/* Set width to full */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default OrderDashboard;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderDashboard = () => {
  const [filter, setFilter] = useState('month');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://b2c-backend-1.onrender.com/api/v1/admin/orders/summary?filter=${filter}`);
      const data = await response.json();
      
      if (data?.data) {
        const reversedData = data.data.reverse(); // Ensure latest data is rightmost

        const labels =
          filter === 'week'
            ? reversedData.map(item => item.day)
            : filter === 'month'
            ? reversedData.map(item => item.month)
            : reversedData.map(item => item.year.toString());

        setRawData(reversedData);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Earnings',
              data: reversedData.map(item => Math.round(item.totalEarnings)), // Round earnings to integer
              backgroundColor: 'rgba(255, 206, 90, 1)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text:
          filter === 'week'
            ? 'Last 10 Days'
            : filter === 'month'
            ? 'Last 10 Months'
            : 'Last 10 Years',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const itemData = rawData[index];

            return [
              `💰 Total Earnings: Rs: ${Math.round(itemData?.totalEarnings || 0)}`, // Rounded earnings
              `📦 Total Orders: ${itemData?.totalOrders || 0}`,
              `🏬 Total Outlets: ${itemData?.totalOutlets || 0}`,
              `👥 Total Customers: ${itemData?.totalCustomers || 0}`,
            ];
          },
          afterBody: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `📅 ${chartData.labels[index]}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6 relative">
      <h3 className="text-lg font-semibold mb-4">Order Dashboard</h3>

      <div className="absolute top-4 right-6 flex space-x-2">
        <button
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            filter === 'week' ? 'bg-yellow-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('week')}
        >
          Weekly
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            filter === 'month' ? 'bg-yellow-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('month')}
        >
          Monthly
        </button>
        <button
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            filter === 'year' ? 'bg-yellow-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setFilter('year')}
        >
          Yearly
        </button>
      </div>

      <div className="h-64 w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default OrderDashboard;

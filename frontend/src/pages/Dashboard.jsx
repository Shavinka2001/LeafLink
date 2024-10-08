import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaWeight, FaChartBar, FaUserPlus } from 'react-icons/fa'; // Importing icons

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Sample data for the charts
  const productionData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Production (in kg)',
        data: [1200, 1900, 3000, 2500, 3500, 4000],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const employeeData = {
    labels: ['Employee A', 'Employee B', 'Employee C', 'Employee D'],
    datasets: [
      {
        label: 'Performance Score',
        data: [85, 90, 75, 80],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green-600
        borderColor: 'rgba(34, 197, 94, 1)', // Green-600
        borderWidth: 1,
      },
    ],
  };

  // Dummy statistics with icons
  const stats = [
    { title: 'Total Employees', number: 120, icon: <FaUsers className="text-4xl text-blue-600 mb-2" /> },
    { title: 'Total Production', number: '15,000 kg', icon: <FaWeight className="text-4xl text-green-600 mb-2" /> },
    { title: 'Average Performance Score', number: '81%', icon: <FaChartBar className="text-4xl text-purple-600 mb-2" /> },
    { title: 'New Employees This Month', number: 10, icon: <FaUserPlus className="text-4xl text-orange-600 mb-2" /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Dashboard Header */}
      <header className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">LeafLink Manager Dashboard</h2>
          
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
          >
            {stat.icon}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.number}</p>
          </div>
        ))}
      </div>

      {/* Cards for Employee Management, Operations, and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-14">
        {/* Employee Management Card */}
        <div className="bg-green-50 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Employee Management</h3>
          <p className="text-gray-500 mb-4">View, add, or edit employee details.</p>
          <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Manage Employees
          </button>
        </div>

        {/* Operations Card */}
        <div className="bg-blue-50 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Operations</h3>
          <p className="text-gray-500 mb-4">Monitor and optimize factory operations.</p>
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            View Operations
          </button>
        </div>

        
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Production Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Production</h3>
          <Line data={productionData} />
        </div>

        {/* Employee Performance Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Employee Performance</h3>
          <Bar data={employeeData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

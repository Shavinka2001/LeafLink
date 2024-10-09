import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineHome, AiOutlineLogout, AiOutlineShoppingCart, AiOutlineDollarCircle } from 'react-icons/ai';
import Dashboard from "../pages/Dashboard";
import EmployeeManagement from './InventoryManagement';
import Profile from './Profile';
import PaymentManagement from './PaymentManagment'; // Ensure this is correctly imported

const ManagerProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Set initial state to 'dashboard'

  // Function to handle tab change and update active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Logo and Title */}
        <div className="py-6 px-4 bg-gray-800 text-center text-xl font-bold">
          <h1 className="text-green-600 text-3xl">LeafLink</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-5">
          <ul className="space-y-4">
            <li>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleTabChange('dashboard')}
              >
                <AiOutlineHome size={24} />
                <span>Dashboard</span>
              </div>
            </li>
            <li>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleTabChange('profile')}
              >
                <AiOutlineUser size={24} />
                <span>Profile</span>
              </div>
            </li>
            <li>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'inventory' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleTabChange('inventory')}
              >
                <AiOutlineShoppingCart size={24} /> {/* Icon for Inventory Management */}
                <span>Inventory Management</span>
              </div>
            </li>
            <li>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'payment' ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleTabChange('payment')}
              >
                <AiOutlineDollarCircle size={24} /> {/* Icon for Payment Management */}
                <span>Payment Management</span>
              </div>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-5">
          <button className="w-full bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center">
            <AiOutlineLogout size={20} />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {/* Tab Content */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'inventory' && <EmployeeManagement />}
          {activeTab === 'payment' && <PaymentManagement />}
          {activeTab === 'dashboard' && <Dashboard />}
        </div>
      </main>
    </div>
  );
};

export default ManagerProfile;

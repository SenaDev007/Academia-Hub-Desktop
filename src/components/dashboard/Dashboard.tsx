import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import Students from './Students';
import Finance from './Finance';
import Planning from './Planning';
import Communication from './Communication';
import Settings from './Settings';
import Analytics from './Analytics';
import Cafeteria from './Cafeteria';
import Health from './Health';
import HR from './HR';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<Students />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/payroll" element={<PayrollManagement />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/library" element={<Library />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/cafeteria" element={<Cafeteria />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
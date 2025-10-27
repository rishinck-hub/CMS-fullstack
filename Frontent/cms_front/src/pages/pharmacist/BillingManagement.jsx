import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import BillingManagement from '../../components/pharmacist/BillingManagement';

const BillingManagementPage = () => {
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <BillingManagement />
        </div>
      </div>
    </div>
  );
};

export default BillingManagementPage;

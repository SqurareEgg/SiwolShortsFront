import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-800">
      <SideNav />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
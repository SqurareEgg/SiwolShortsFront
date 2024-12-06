import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/atoms';
import { SideMenu } from './SideMenu';
import { UserMenu } from './UserMenu';

export const MainLayout = () => {
  const user = useRecoilValue(userState);

  return (
    <div className="flex min-h-screen bg-gray-800">
      <SideMenu />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <div className="max-w-[1800px] mx-auto px-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold py-4 text-white">커뮤니티 게시판</h1>
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
import React from 'react';
import { UserMenu } from '../UserMenu';

const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
    {/*// <header className="hidden">*/}
      <div className="max-w-[1800px] mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold py-4 text-white">스토리</h1>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
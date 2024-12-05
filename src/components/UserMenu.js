import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export const UserMenu = ({ user, onLogin, onLogout }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => user ? setMenuOpen(!isMenuOpen) : onLogin()}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-700 text-white"
      >
        <User size={20} />
        <span>{user ? user.username : '게스트'}</span>
        {user && <ChevronDown size={16} className={`transform transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />}
      </button>

      {user && isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
          <a
            href="/mypage"
            className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            <Settings size={16} className="mr-2" />
            마이페이지
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
          >
            <LogOut size={16} className="mr-2" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};
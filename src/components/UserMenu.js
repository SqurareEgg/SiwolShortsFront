import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userState, loginModalState } from '../recoil/atoms';
import { authApi } from '../api/auth';

export const UserMenu = () => {
  const [user, setUser] = useRecoilState(userState);
  const [, setLoginModalOpen] = useRecoilState(loginModalState);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <div className="relative">
      {user ? (
        <button
          onClick={handleLogout}
          className="text-white hover:text-gray-300 px-4 py-2"
        >
          로그아웃
        </button>
      ) : (
        <button
          onClick={() => setLoginModalOpen(true)}
          className="text-white hover:text-gray-300 px-4 py-2"
        >
          로그인
        </button>
      )}
    </div>
  );
};
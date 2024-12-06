import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { MainLayout } from './components/MainLayout';
import { PostsPage } from './components/PostsPage';
import { ChatPage } from './components/ChatPage';
import { MemesPage } from './components/MemesPage';
import { SettingsPage } from './components/SettingsPage';
import { MyPage } from './components/MyPage';
import { LoginModal } from './components/LoginModal';
import { userState, loginModalState } from './recoil/atoms';
import { authApi } from './api/auth';

function AppContent() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoginModalOpen, setLoginModalOpen] = useRecoilState(loginModalState);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        try {
          const currentUser = await authApi.getCurrentUser();
          if (!currentUser) {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [user, setUser]);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setLoginModalOpen(false);
  }, [setUser, setLoginModalOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [setUser]);

  return (
    <Routes>
      <Route
        path="/mypage"
        element={user ? <MyPage /> : <Navigate to="/" replace />}
      />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PostsPage />} />
        <Route path="chat/:chatId" element={<ChatPage />} />
        <Route path="memes" element={<MemesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppContent />
        <LoginModal />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { MainLayout } from './components/MainLayout';
import { PostsPage } from './components/PostsPage';
import { StoryPage } from './components/StoryPage';
import { ChatPage } from './components/ChatPage';
import { MemesPage } from './components/MemesPage';
import { SettingsPage } from './components/SettingsPage';
import { MyPage } from './components/MyPage';
import { LoginModal } from './components/LoginModal';
import { useRecoilState } from 'recoil';
import { userState, loginModalState } from './recoil/atoms';
import { authApi } from './api/auth';

function AppContent() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoginModalOpen, setLoginModalOpen] = useRecoilState(loginModalState);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        const currentUser = await authApi.getCurrentUser();
        if (!currentUser) {
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
    await authApi.logout();
    setUser(null);
  }, [setUser]);

  return (
    <>
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
      </Routes>
      <LoginModal onLogin={handleLogin} onLogout={handleLogout} />
    </>
  );
}

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
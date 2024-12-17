import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { userState, loginModalState } from './recoil/atoms';
import MainLayout from './components/layout/MainLayout';
import { PostsPage } from './components/PostsPage';
import { ChatPage } from './components/ChatPage';
import MemesPage from './components/MemesPage';
import { SettingsPage } from './components/SettingsPage';
import LoginModal from './components/LoginModal';

function AppContent() {
  const [user, setUser] = useRecoilState(userState);
  const [, setLoginModalOpen] = useRecoilState(loginModalState);

  useEffect(() => {
    // 페이지 로드시 localStorage에서 사용자 정보 복원
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // API 클라이언트에 토큰 설정
        import('./api/client').then(({ api }) => {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        });
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [user, setUser]);

  // 토큰 만료 체크 및 자동 갱신
  useEffect(() => {
    if (user) {
      const checkTokenExpiry = async () => {
        try {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Token expired');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoginModalOpen(true);
        }
      };

      // 주기적으로 토큰 확인 (5분마다)
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, setUser, setLoginModalOpen]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PostsPage />} />
        <Route
          path="chat/:chatId"
          element={
            user ? <ChatPage /> : <Navigate to="/" replace state={{ needLogin: true }} />
          }
        />
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
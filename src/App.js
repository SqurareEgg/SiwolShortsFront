import React, { useState, useEffect, useCallback, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OCRInput } from './components/OCRInput';
import { StoryGenerator } from './components/StoryGenerator';
import { PostList } from './components/PostList';
import { ContentViewer } from './components/ContentViewer';
import { ChatHistory } from './components/ChatHistory';
import { UserMenu } from './components/UserMenu';
import { LoginModal } from './components/LoginModal';
import { MyPage } from './components/MyPage';
import { ChevronLeft, ChevronRight, MessageSquare, PenTool } from 'lucide-react';
import { authApi } from './api/auth';

// 사이드바 컴포넌트 분리 및 메모이제이션
const Sidebar = memo(({ isOpen, activeTab, onTabChange, onTextExtracted, storyText }) => (
  <div
    className={`w-96 bg-gray-900 transition-all duration-300 flex flex-col ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="flex border-b border-gray-700">
      <button
        onClick={() => onTabChange('chat')}
        className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${
          activeTab === 'chat' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <MessageSquare size={18} />
        <span>대화 히스토리</span>
      </button>
      <button
        onClick={() => onTabChange('story')}
        className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${
          activeTab === 'story' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <PenTool size={18} />
        <span>스토리 생성</span>
      </button>
    </div>

    <div className="flex-1 overflow-hidden">
      {activeTab === 'chat' ? (
        <div className="h-full">
          <ChatHistory />
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <OCRInput onTextExtracted={onTextExtracted} />
          <StoryGenerator initialText={storyText} />
        </div>
      )}
    </div>
  </div>
));

// 메인 레이아웃 컴포넌트 분리 및 메모이제이션
const MainLayout = memo(({
  user,
  onLogin,
  onLogout,
  isLoginModalOpen,
  setLoginModalOpen
}) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  const handleTextExtracted = useCallback((text) => {
    setStoryText(prev => prev ? `${prev}\n\n${text}` : text);
    setActiveTab('story');
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex">
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-2 rounded-r-md z-10 hover:bg-gray-600"
      >
        {isSidebarOpen ? <ChevronLeft className="text-white" /> : <ChevronRight className="text-white" />}
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTextExtracted={handleTextExtracted}
        storyText={storyText}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-[1800px] mx-auto px-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold py-4 text-white">커뮤니티 게시판</h1>
            <UserMenu
              user={user}
              onLogin={onLogin}
              onLogout={onLogout}
            />
          </div>
        </header>

        <main className="flex-1 overflow-hidden p-4">
          <div className="h-full grid grid-cols-2 gap-4">
            <PostList onSelectPost={setSelectedPost} />
            <ContentViewer selectedPost={selectedPost} />
          </div>
        </main>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={onLogin}
      />
    </div>
  );
});

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

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
  }, [user]);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setLoginModalOpen(false);  // 로그인 성공 시 모달 닫기
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/mypage"
          element={user ? <MyPage user={user} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            <MainLayout
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              isLoginModalOpen={isLoginModalOpen}
              setLoginModalOpen={setLoginModalOpen}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
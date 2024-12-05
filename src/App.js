import React, { useState } from 'react';
import { OCRInput } from './components/OCRInput';
import { StoryGenerator } from './components/StoryGenerator';
import { PostList } from './components/PostList';
import { ContentViewer } from './components/ContentViewer';
import { ChatHistory } from './components/ChatHistory';
import { ChevronLeft, ChevronRight, MessageSquare, PenTool } from 'lucide-react';

function App() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'story'

  const handleTextExtracted = (text) => {
    setStoryText(prev => prev ? `${prev}\n\n${text}` : text);
    setActiveTab('story'); // OCR 결과가 추출되면 스토리 탭으로 전환
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex">
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-2 rounded-r-md z-10 hover:bg-gray-600"
      >
        {isSidebarOpen ? <ChevronLeft className="text-white" /> : <ChevronRight className="text-white" />}
      </button>

      {/* 사이드바 */}
      <div
        className={`w-96 bg-gray-900 transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 탭 버튼 */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${
              activeTab === 'chat' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <MessageSquare size={18} />
            <span>대화 히스토리</span>
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 ${
              activeTab === 'story' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <PenTool size={18} />
            <span>스토리 생성</span>
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="h-full">
              <ChatHistory />
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <OCRInput onTextExtracted={handleTextExtracted} />
              <StoryGenerator initialText={storyText} />
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-[1800px] mx-auto px-4">
            <h1 className="text-3xl font-bold py-4 text-white">커뮤니티 게시판</h1>
          </div>
        </header>

        {/* 메인 영역 */}
        <main className="flex-1 overflow-hidden p-4">
          <div className="h-full grid grid-cols-2 gap-4">
            <PostList onSelectPost={setSelectedPost} />
            <ContentViewer selectedPost={selectedPost} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LayoutGrid, Image, Settings, MessageSquare } from 'lucide-react';
import { sidebarState, userState } from '../recoil/atoms';
import { api } from '../api/client';

export const SideMenu = () => {
  const [sidebarData, setSidebarData] = useRecoilState(sidebarState);
  const user = useRecoilValue(userState);

  const menuItems = [
    { icon: <LayoutGrid size={20} />, text: "게시판", path: "/" },
    { icon: <Image size={20} />, text: "짤 검색", path: "/memes" },
    { icon: <Settings size={20} />, text: "AI 설정", path: "/settings" },
  ];

  // 사용자의 채팅 기록 가져오기
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (user) {
        try {
          const response = await api.get('/chat/history');
          if (response.data.success) {
            setSidebarData(prev => ({
              ...prev,
              chatHistory: response.data.chats
            }));
          }
        } catch (err) {
          console.error('Failed to fetch chat history:', err);
        }
      }
    };

    fetchChatHistory();
  }, [user, setSidebarData]);

  return (
    <nav className="w-16 hover:w-64 transition-all duration-300 bg-gray-900 h-screen flex-shrink-0 flex flex-col">
      {/* 메인 메뉴 */}
      <ul className="py-4 space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-gray-400 hover:text-white
                ${isActive ? 'bg-gray-800 text-white' : ''}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-4 whitespace-nowrap overflow-hidden opacity-100 transition-opacity duration-300">
                {item.text}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* 채팅 히스토리 섹션 */}
      {user && (
        <div className="mt-4 flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-sm font-semibold text-gray-400">
            이전 대화
          </div>
          <ul className="space-y-1">
            {sidebarData.chatHistory.map((chat) => (
              <li key={chat.id}>
                <NavLink
                  to={`/chat/${chat.id}`}
                  className={({ isActive }) => `
                    flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800
                    ${isActive ? 'bg-gray-800 text-white' : ''}
                  `}
                >
                  <MessageSquare size={16} className="mr-2" />
                  <span className="truncate">
                    {chat.title || `Chat ${new Date(chat.created_at).toLocaleDateString()}`}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
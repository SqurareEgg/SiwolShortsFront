import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { MessageSquare, Plus, Bot, User, ChevronLeft } from 'lucide-react';
import { chatListState, currentChatState } from '../recoil/atoms';
import { api } from '../api/client';
import { Link, useNavigate } from 'react-router-dom';

export const ChatHistory = () => {
  const [chatList, setChatList] = useRecoilState(chatListState);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatList = async () => {
      setLoading(true);
      try {
        const response = await api.get('/chats');
        setChatList(response.data);
      } catch (err) {
        console.error('Failed to fetch chat list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatList();
  }, []);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    };
    setChatList(prev => [newChat, ...prev]);
    setCurrentChat(newChat.id);
    navigate(`/chat/${newChat.id}`);
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-700 rounded-lg mr-2"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">채팅 목록</h2>
      </div>

      {/* 새 채팅 버튼 */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>새 채팅</span>
        </button>
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chatList.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChat === chat.id
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <MessageSquare size={18} className="mr-3" />
                <span className="text-sm truncate">{chat.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 채팅 메시지 컴포넌트
export const ChatMessages = ({ chatId }) => {
  const [chatList, setChatList] = useRecoilState(chatListState);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (chatId) {
        try {
          const response = await api.get(`/chat/${chatId}/messages`);
          if (response.data.success) {
            setChatList(response.data.messages);
          }
        } catch (err) {
          console.error('Failed to fetch chat messages:', err);
        }
      }
    };

    fetchChatMessages();
  }, [chatId, setChatList]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {chatList.map((message, index) => (
        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-lg p-3 ${
            message.type === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-white'
          }`}>
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
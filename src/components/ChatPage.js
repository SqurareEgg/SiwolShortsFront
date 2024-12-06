import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Send, RefreshCw, Wand2 } from 'lucide-react';
import { chatListState, currentChatState } from '../recoil/atoms';
import { ChatMessages } from './ChatHistory';
import { api } from '../api/client';

export const ChatPage = () => {
  const { chatId } = useParams();
  const [chatList, setChatList] = useRecoilState(chatListState);
  const [, setCurrentChat] = useRecoilState(currentChatState);
  const [input, setInput] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChatData = async () => {
      if (chatId) {
        try {
          const response = await api.get(`/chat/${chatId}`);
          if (response.data.success) {
            setOriginalText(response.data.chat.response);
          }
        } catch (err) {
          console.error('Failed to fetch chat:', err);
        }
      }
    };

    fetchChatData();
  }, [chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const response = await api.post('/generate-story', {
        text: input,
        tone: '기본',
      });

      if (response.data.success) {
        // 새로운 채팅 메시지 추가
        setChatList(prev => [...prev, {
          id: response.data.chat_id,
          message: input,
          response: response.data.response,
          created_at: new Date().toISOString()
        }]);

        // 원본 텍스트 업데이트
        setOriginalText(response.data.response);
        setInput('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] divide-y divide-gray-600 gap-4 h-full">
      {/* 채팅 영역 */}
      <div className="h-full flex flex-col bg-gray-800">
        <div className="flex-1 overflow-hidden">
          <ChatMessages chatId={chatId} />
        </div>
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="수정 요청을 입력하세요..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* 수정 제안 영역 */}
      <div className="h-full flex flex-col bg-gray-700 p-4">
        <h3 className="text-xl font-bold text-white mb-4">현재 버전</h3>
        <div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-gray-300 whitespace-pre-wrap">
            {originalText}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setInput("이 내용을 더 재미있게 수정해주세요.")}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            <Wand2 className="inline-block mr-2" size={16} />
            재미있게
          </button>
          <button
            onClick={() => setInput("이 내용을 더 감동적으로 수정해주세요.")}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            <RefreshCw className="inline-block mr-2" size={16} />
            감동적으로
          </button>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">이미지 미리보기</h3>
        <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">이미지 생성 준비 중...</p>
        </div>
      </div>
    </div>
  );
};
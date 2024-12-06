import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Send } from 'lucide-react';
import { chatListState, currentChatState } from '../recoil/atoms';
import {ChatHistory, ChatMessages} from './ChatHistory';
import { api } from '../api/client';

export const ChatPage = () => {
  const { chatId } = useParams();
  const [chatList, setChatList] = useRecoilState(chatListState);
  const [, setCurrentChat] = useRecoilState(currentChatState);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = { role: 'user', content: input };
    setLoading(true);

    try {
      // 채팅 목록 업데이트
      setChatList(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, message]
              }
            : chat
        )
      );
      setInput('');

      // API 호출
      const response = await api.post(`/chat/${chatId}`, { message: input });

      // 응답 추가
      setChatList(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: 'assistant', content: response.data.message }
                ]
              }
            : chat
        )
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="grid grid-cols-[1fr_1fr_1fr] divide-y divide-gray-600 gap-4 h-full">
          {/* 히스토리 영역 사이드바로 이동예정 */}
          {/*<div className="rounded-full ">*/}
          {/*    <ChatHistory/>*/}
          {/*</div>*/}
          {/* 채팅 영역 */}
          <div className="h-full flex flex-col bg-gray-800">
              {/* 채팅 메시지 영역 */}
              <div className="flex-1 overflow-hidden">
                  <ChatMessages chatId={chatId}/>
              </div>

              {/* 입력 영역 */}
              <div className="border-t border-gray-700 p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="메시지를 입력하세요..."
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          disabled={loading}
                      />
                      <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
                      >
                          <Send size={20}/>
                      </button>
                  </form>
              </div>
          </div>
          {/* 수정 제안 영역 */}
          <div className="h-full flex flex-col bg-gray-400 border border-blue-500 p-4"><b className="align-text-bottom">수정 제안 영역</b>
            <div className="h-full">원본 텍스트</div>
            <div className="h-full">수정제안, 스토리 라인 다듬기 & 짤생성 버튼</div>
          </div>
          <div className="bg-gray-400 border border-blue-500">짤 or 이미지</div>
      </div>
  );
};
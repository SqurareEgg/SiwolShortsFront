// components/ChatPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Search, Wand2 } from 'lucide-react';
import { chatListState, currentChatState } from '../recoil/atoms';
import { api } from '../api/client';
import { ChatInput } from './chat/ChatInput';
import { ChatResponseArea } from './chat/ChatResponseArea';

export const ChatPage = () => {
  const { chatId } = useParams();
  const [chatList, setChatList] = useRecoilState(chatListState);
  const [, setCurrentChat] = useRecoilState(currentChatState);
  const [input, setInput] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSplitParagraphs = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/dalle-api-endpoint', { text: originalText });
      if (response.data.success) {
        setGptResponse({
          type: 'paragraphs',
          content: response.data.response
        });
      } else {
        console.error('Error:', response.data.error);
        setGptResponse({
          type: 'error',
          content: response.data.error || 'Error: No response data received'
        });
      }
    } catch (err) {
      console.error('Failed to split paragraphs:', err);
      setGptResponse({
        type: 'error',
        content: 'Error: Failed to get response'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTags = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/generate-shorts-script', { text: originalText });
      if (response.data.success && response.data.scenes) {
        setGptResponse(response.data);
      } else {
        console.error('Error:', response.data.error);
        setGptResponse({
          type: 'error',
          content: response.data.error || '응답을 생성하지 못했습니다.'
        });
      }
    } catch (err) {
      console.error('Failed to generate tags:', err);
      setGptResponse({
        type: 'error',
        content: 'Failed to get response'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        setChatList(prev => [...prev, {
          id: response.data.chat_id,
          message: input,
          response: response.data.response,
          created_at: new Date().toISOString()
        }]);

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
    <div className="grid grid-cols-[1fr_1fr] divide-y divide-gray-600 gap-4 h-full">
      <div className="h-full flex flex-col bg-gray-800">
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col bg-gray-700 p-4">
            <h3 className="text-xl font-bold text-white mb-4">현재 버전</h3>
            <div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-4 mb-4">
              <div className="text-gray-300 whitespace-pre-wrap">
                {originalText}
              </div>
            </div>
          </div>
        </div>
        <ChatInput
          input={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      <div className="h-screen bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">쇼츠 스크립트</h3>
          <div className="flex gap-2">
            <button
              onClick={handleSplitParagraphs}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 flex items-center gap-2"
            >
              <Wand2 size={16} />
              문단 나누기
            </button>
            <button
              onClick={handleGenerateTags}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 flex items-center gap-2"
            >
              <Search size={16} />
              짤방 태그 생성
            </button>
          </div>
        </div>
        <ChatResponseArea response={gptResponse} isLoading={isLoading} />
      </div>
    </div>
  );
};
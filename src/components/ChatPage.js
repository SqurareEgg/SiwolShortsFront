import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Send, Wand2 } from 'lucide-react';
import { chatListState, currentChatState } from '../recoil/atoms';
import { api } from '../api/client';

// ChatMessage 컴포넌트 수정
const ChatMessage = ({ message }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/generate-image', { text: message });
      if (response.data.success) {
        setImageUrl(response.data.image_url);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <p className="text-gray-300 whitespace-pre-wrap">{message}</p>
          {!imageUrl && (
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 flex items-center gap-2 text-sm"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="animate-spin" size={16} />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  이미지 생성
                </>
              )}
            </button>
          )}
        </div>
        {imageUrl && (
          <div className="w-64 h-64 flex-shrink-0">
            <img
              src={imageUrl}
              alt="Generated illustration"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ChatResponseArea 컴포넌트 수정
const ChatResponseArea = ({ response, isLoading }) => {
  const processMessages = (response) => {
    if (!response) return [];
    const text = typeof response === 'object' ? response.response : response;
    const strResponse = String(text || '');
    return strResponse.split('---').filter(msg => msg.trim());
  };

  const messages = processMessages(response);

  return (
    <div className="h-full bg-gray-800 rounded-lg p-4 overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Wand2 className="animate-spin text-gray-400 mr-2" />
          <p className="text-gray-400">GPT 응답을 기다리는 중...</p>
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-2 overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message.trim()} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">응답이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export const ChatPage = () => {
  const { chatId } = useParams();
  const [chatList, setChatList] = useRecoilState(chatListState);
  const [, setCurrentChat] = useRecoilState(currentChatState);
  const [input, setInput] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [loading, setLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 채팅 데이터 불러오기
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

  // GPT 요청 보내기
  useEffect(() => {
    const sendGptRequest = async () => {
      if (originalText) {
        setIsLoading(true);
        try {
          console.log('Sending request with text:', originalText);
          const response = await api.post('/dalle-api-endpoint', { text: originalText });
          console.log('Full response:', response);
          console.log('Response data:', response.data);

          if (response.data) {
            setGptResponse(response.data.response || response.data);
          } else {
            console.error('No response data received');
            setGptResponse('Error: No response data received');
          }
        } catch (err) {
          console.error('Failed to send GPT request:', err);
          console.error('Error details:', {
            message: err.message,
            response: err.response?.data
          });
          setGptResponse('Error: Failed to get GPT response');
        } finally {
          setIsLoading(false);
        }
      }
    };

    sendGptRequest();
  }, [originalText]);

  // 입력 제출 처리
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
    <div className="grid grid-cols-[1fr_1fr] divide-y divide-gray-600 gap-4 h-full">
      {/* 채팅 영역 */}
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

      {/* GPT 응답 영역 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">쇼츠 스크립트</h3>
        <ChatResponseArea response={gptResponse} isLoading={isLoading} />
      </div>
    </div>
  );
};
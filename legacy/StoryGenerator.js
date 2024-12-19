import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/client';
import { storyGeneratorState, chatHistoryState } from '../../../recoil/atoms';
import { MessageSquare } from 'lucide-react';
import { userState } from '../../../recoil/atoms';

export const StoryGenerator = () => {
  const [user] = useRecoilState(userState);
  const navigate = useNavigate();
  const [storyState, setStoryState] = useRecoilState(storyGeneratorState);
  const [, setChatHistory] = useRecoilState(chatHistoryState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toneStyles, setToneStyles] = useState({});
  const [generatedChatId, setGeneratedChatId] = useState(null);

  useEffect(() => {
    const fetchToneStyles = async () => {
      try {
        const response = await api.get('/ai/generate/styles');
        setToneStyles(response.data);
      } catch (err) {
        console.error('Failed to fetch tone styles:', err);
      }
    };
    fetchToneStyles();
  }, []);

  const handleGenerate = async () => {
    if (!storyState.text) return;

    setLoading(true);
    setError(null);
    try {
      console.log('Generating story...');
      const response = await api.post('/ai/generate/story',{
        text: storyState.text,
        tone: storyState.tone
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setStoryState(prev => ({
          ...prev,
          result: response.data.response
        }));

        setGeneratedChatId(response.data.chat_id);
        console.log('Generated chat ID:', response.data.chat_id);

        setChatHistory(prev => [...prev, {
          message: storyState.text,
          response: response.data.response,
          timestamp: new Date().toISOString()
        }]);
      } else {
        setError(response.data.error || '스토리 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      setError(`스토리 생성 실패: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChatEdit = () => {
    if (generatedChatId) {
      console.log('Navigating to chat:', generatedChatId);
      // 채팅 페이지로 이동하기 전에 필요한 정보를 저장
      localStorage.setItem('currentChatText', storyState.result);
      navigate(`/chat/${generatedChatId}`);
    } else {
      console.error('No chat ID available');
      setError('채팅 ID를 찾을 수 없습니다.');
    }
  };

  const handleReset = () => {
    setStoryState({
      text: '',
      result: '',
      tone: '기본',
      modificationInput: ''
    });
    setError(null);
    setGeneratedChatId(null);
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">스토리 생성기</h3>
        <div className="space-y-3">
          <textarea
            value={storyState.text}
            onChange={(e) => setStoryState(prev => ({ ...prev, text: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
            placeholder="텍스트를 입력하세요"
          />
          <select
            value={storyState.tone}
            onChange={(e) => setStoryState(prev => ({ ...prev, tone: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
          >
            {Object.entries(toneStyles).map(([key, value]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading || !storyState.text}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 disabled:bg-gray-500"
          >
            {loading ? "생성 중..." : "스토리 생성"}
          </button>
          {error && (
            <p className="text-red-400 text-xs break-words">{error}</p>
          )}
          {storyState.result && (
            <div className="space-y-2">
              <textarea
                value={storyState.result}
                readOnly
                rows={8}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleChatEdit}
                  // disabled={!generatedChatId || !user}  // user 상태 확인
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded text-sm hover:bg-purple-700
                            flex items-center justify-center gap-2 disabled:bg-gray-500"
                  title={!user ? "로그인이 필요합니다" : ""}  // 툴팁 추가
                >
                  <MessageSquare size={16} />
                  {user ? "채팅으로 수정하기" : "로그인하여 수정하기"}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 border border-gray-500 text-white py-2 px-4 rounded text-sm hover:bg-gray-600"
                >
                  초기화
                </button>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(storyState.result)}
                className="w-full border border-gray-500 py-2 px-4 rounded text-sm hover:bg-gray-600 text-white"
              >
                📋 복사
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
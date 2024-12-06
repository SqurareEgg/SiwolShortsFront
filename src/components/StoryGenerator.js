import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { api } from '../api/client';
import { storyGeneratorState, chatHistoryState } from '../recoil/atoms';

export const StoryGenerator = () => {
  // Recoil 상태
  const [storyState, setStoryState] = useRecoilState(storyGeneratorState);
  const [chatHistory, setChatHistory] = useRecoilState(chatHistoryState);

  // 로컬 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toneStyles, setToneStyles] = useState({});

  useEffect(() => {
    const fetchToneStyles = async () => {
      try {
        const response = await api.get('/tone-styles');
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
      const response = await api.post('/generate-story', {
        text: storyState.text,
        tone: storyState.tone
      });

      if (response.data.success) {
        setStoryState(prev => ({
          ...prev,
          result: response.data.response
        }));

        // 채팅 히스토리에 추가
        setChatHistory(prev => [...prev, {
          message: storyState.text,
          response: response.data.response,
          timestamp: new Date().toISOString()
        }]);
      } else {
        setError(response.data.error || '스토리 생성에 실패했습니다.');
      }
    } catch (err) {
      setError(`스토리 생성 실패: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModification = async () => {
    if (!storyState.modificationInput || !storyState.result) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/generate-story', {
        text: storyState.result,
        instruction: storyState.modificationInput,
        continue_thread: true
      });

      if (response.data.success) {
        setStoryState(prev => ({
          ...prev,
          result: response.data.response,
          modificationInput: ''
        }));
      } else {
        setError(response.data.error || '수정에 실패했습니다.');
      }
    } catch (err) {
      setError(`수정 실패: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
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
            placeholder="텍스트를 입력하세요..."
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
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={storyState.modificationInput}
                    onChange={(e) => setStoryState(prev => ({ ...prev, modificationInput: e.target.value }))}
                    placeholder="수정 제안 (예: '더 짧게 줄여줘', '감정을 더 강조해줘')"
                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                  />
                  <button
                    onClick={handleModification}
                    disabled={loading || !storyState.modificationInput}
                    className="px-4 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:bg-gray-500"
                  >
                    적용
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 border border-gray-500 text-white py-2 px-4 rounded text-sm hover:bg-gray-600"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(storyState.result)}
                    className="flex-1 border border-gray-500 py-2 px-4 rounded text-sm hover:bg-gray-600 text-white"
                  >
                    📋 복사
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
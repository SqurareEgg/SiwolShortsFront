import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export const StoryGenerator = ({ initialText }) => {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('기본');
  const [toneStyles, setToneStyles] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modificationInput, setModificationInput] = useState('');

  useEffect(() => {
    if (initialText) {
      setText(prev => prev ? `${prev}\n\n${initialText}` : initialText);
    }
  }, [initialText]);

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
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/generate-story', {
        text: text,
        tone
      });

      if (response.data.success) {
        setResult(response.data.response);
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
    if (!modificationInput || !result) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/generate-story', {
        text: result,
        instruction: modificationInput,
        continue_thread: true
      });

      if (response.data.success) {
        setResult(response.data.response);
        setModificationInput(''); // 입력 필드 초기화
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
    setText('');
    setResult('');
    setError(null);
    setModificationInput('');
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">스토리 생성기</h3>
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
            placeholder="텍스트를 입력하세요..."
          />
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
          >
            {Object.entries(toneStyles).map(([key, value]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading || !text}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 disabled:bg-gray-500"
          >
            {loading ? "생성 중..." : "스토리 생성"}
          </button>
          {error && (
            <p className="text-red-400 text-xs break-words">{error}</p>
          )}
          {result && (
            <div className="space-y-2">
              <textarea
                value={result}
                readOnly
                rows={8}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
              />
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={modificationInput}
                    onChange={(e) => setModificationInput(e.target.value)}
                    placeholder="수정 제안 (예: '더 짧게 줄여줘', '감정을 더 강조해줘')"
                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                  />
                  <button
                    onClick={handleModification}
                    disabled={loading || !modificationInput}
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
                    onClick={() => navigator.clipboard.writeText(result)}
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
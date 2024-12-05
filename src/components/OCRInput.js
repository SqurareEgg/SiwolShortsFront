import React, { useState } from 'react';
import { api } from '../api/client';

export const OCRInput = ({ onTextExtracted }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTextExtraction = async () => {
    if (!imageUrl) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/extract-text', {
        image_url: imageUrl
      });

      if (response.data.success) {
        const newText = response.data.text;
        onTextExtracted(newText); // 부모 컴포넌트로 추출된 텍스트 전달
        setImageUrl('');
      } else {
        setError(response.data.error || '텍스트 추출에 실패했습니다.');
      }
    } catch (err) {
      console.error('OCR failed:', err);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">이미지에서 텍스트 추출</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
          />
          <button
            onClick={handleTextExtraction}
            disabled={loading || !imageUrl}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 disabled:bg-gray-500"
          >
            {loading ? "추출 중..." : "텍스트 추출"}
          </button>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
};
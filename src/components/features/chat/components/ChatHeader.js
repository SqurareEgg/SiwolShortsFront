import React from 'react';
import { Search, Wand2 } from 'lucide-react';

export const ChatHeader = ({
  title,
  onSplitParagraphs,
  onGenerateTags,
  loading
}) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <div className="flex gap-2">
      <button
        onClick={onSplitParagraphs}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                  disabled:bg-gray-600 flex items-center gap-2"
      >
        <Wand2 size={16} />
        이미지 생성하기
      </button>
      <button
        onClick={onGenerateTags}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                  disabled:bg-gray-600 flex items-center gap-2"
      >
        <Search size={16} />
        짤방 생성
      </button>
    </div>
  </div>
);
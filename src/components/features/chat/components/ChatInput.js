import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

export const ChatInput = ({ input, onChange, onSubmit, loading }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  // textarea 높이 자동 조절
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // 최대 높이 200px
      textarea.style.height = `${newHeight}px`;
    }
  };

  // input 값이 변경될 때마다 높이 조절
  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <div className="border-t border-gray-700 p-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="수정 요청을 입력하세요..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2
                     text-white focus:outline-none focus:border-blue-500 min-h-[40px] max-h-[200px]
                     overflow-y-auto resize-none transition-all duration-200"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700
                     disabled:bg-gray-600 self-end" // self-end 추가하여 하단 정렬
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
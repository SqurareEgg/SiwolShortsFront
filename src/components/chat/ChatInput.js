import React from 'react';
import { Send } from 'lucide-react';

export const ChatInput = ({ input, onChange, onSubmit, loading }) => {
  return (
    <div className="border-t border-gray-700 p-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onChange(e.target.value)}
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
  );
};
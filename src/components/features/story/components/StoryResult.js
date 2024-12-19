import { MessageSquare } from 'lucide-react';

export const StoryResult = ({ result, onChatEdit, onReset, onCopy, user }) => (
  <div className="space-y-2">
    <textarea
      value={result}
      readOnly
      rows={8}
      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
    />
    <div className="flex space-x-2">
      <button
        onClick={onChatEdit}
        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded text-sm
                  hover:bg-purple-700 flex items-center justify-center gap-2
                  disabled:bg-gray-500"
      >
        <MessageSquare size={16} />
        {user ? "채팅으로 수정하기" : "로그인하여 수정하기"}
      </button>
      <button
        onClick={onReset}
        className="flex-1 border border-gray-500 text-white py-2 px-4
                  rounded text-sm hover:bg-gray-600"
      >
        초기화
      </button>
    </div>
    <button
      onClick={onCopy}
      className="w-full border border-gray-500 py-2 px-4 rounded text-sm
                hover:bg-gray-600 text-white"
    >
      📋 복사
    </button>
  </div>
);
import React from 'react';
import { ChatInput } from './ChatInput';

export const ChatVersion = ({ text, input, onChange, onSubmit, loading }) => (
  <div className="h-full flex flex-col bg-gray-800">
    <div className="flex-1 bg-gray-700 p-4">
      <h3 className="text-xl font-bold text-white mb-4">현재 버전</h3>
      <div className="h-full overflow-auto bg-gray-800 rounded-lg p-4">
        <div className="text-gray-300 whitespace-pre-wrap">{text}</div>
      </div>
    </div>
    <ChatInput
      input={input}
      onChange={onChange}
      onSubmit={onSubmit}
      loading={loading}
    />
  </div>
);
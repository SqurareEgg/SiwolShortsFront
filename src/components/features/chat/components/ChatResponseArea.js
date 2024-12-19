import React from 'react';
import { Wand2 } from 'lucide-react';
import { ChatMessage } from '../ChatMessage';

export const ChatResponseArea = ({ response, loading }) => {
  if (loading) {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <Wand2 className="animate-spin text-gray-400 mr-2" />
          <p className="text-gray-400">응답을 기다리는 중...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">응답이 없습니다.</p>
        </div>
      </div>
    );
  }

  if (response.scenes) {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="space-y-2">
          {response.scenes.map((scene, index) => (
            <ChatMessage key={index} scene={scene} />
          ))}
        </div>
      </div>
    );
  }

  const messages = typeof response.content === 'string'
    ? response.content.split('---').filter(msg => msg.trim())
    : [response.content];

  return (
    <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
      <div className="space-y-2">
        {messages.map((message, index) => (
          <div key={index} className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-300 whitespace-pre-wrap">{message.trim()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
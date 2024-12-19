import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { storyGeneratorState, chatHistoryState } from '../recoil/atoms';
import { OCRInput } from './features/ocr/OCRInput';
import { StoryGenerator } from './features/story/StoryGenerator';
import { ChatHistory } from './features/chat/ChatHistory';

export const StoryPage = () => {
  const [storyState, setStoryState] = useRecoilState(storyGeneratorState);
  const [chatHistory] = useRecoilState(chatHistoryState);

  const handleTextExtracted = useCallback((text) => {
    setStoryState(prev => ({
      ...prev,
      text: prev.text ? `${prev.text}\n\n${text}` : text
    }));
  }, [setStoryState]);

  return (
    <div className="h-full grid grid-cols-2 gap-4 overflow-auto">
      <div className="space-y-4">
        <OCRInput onTextExtracted={handleTextExtracted} />
        <StoryGenerator />
      </div>
      <ChatHistory />
    </div>
  );
};
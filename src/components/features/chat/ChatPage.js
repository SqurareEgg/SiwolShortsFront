import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { chatListState, currentChatState } from '../../../recoil/atoms';
import { api } from '../../../api/client';
import { ChatVersion } from './components/ChatVersion';
import { ChatHeader } from './components/ChatHeader';
import { ChatResponseArea } from './components/ChatResponseArea';
import { useChatActions } from './hooks/useChatActions';

export const ChatPage = () => {
  const { chatId } = useParams();
  const [input, setInput] = useState('');
  const [originalText, setOriginalText] = useState('');
  const {
    loading,
    response: gptResponse,
    handleSplitParagraphs,
    handleGenerateTags,
    handleSubmit
  } = useChatActions();

  useEffect(() => {
    const fetchChatData = async () => {
      if (chatId) {
        try {
          const response = await api.get(`/ai/chat/${chatId}`);
          if (response.data.success) {
            setOriginalText(response.data.chat.response);
          }
        } catch (err) {
          console.error('Failed to fetch chat:', err);
        }
      }
    };

    fetchChatData();
  }, [chatId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await handleSubmit(input);
    if (response) {
      setOriginalText(response);
      setInput('');
    }
  };

  const onSplitParagraphs = () => handleSplitParagraphs(originalText);
  const onGenerateTags = () => handleGenerateTags(originalText);

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4 h-full">
      <ChatVersion
        text={originalText}
        input={input}
        onChange={setInput}
        onSubmit={onSubmit}
        loading={loading}
      />

      <div className="bg-gray-700 p-4 rounded-lg">
        <ChatHeader
          title="쇼츠 스크립트"
          onSplitParagraphs={onSplitParagraphs}
          onGenerateTags={onGenerateTags}
          loading={loading}
        />
        <ChatResponseArea response={gptResponse} loading={loading} />
      </div>
    </div>
  );
};
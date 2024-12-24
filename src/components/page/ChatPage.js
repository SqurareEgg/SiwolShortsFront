import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { ChatVersion } from '../features/chat/components/ChatVersion';
import { ChatHeader } from '../features/chat/components/ChatHeader';
import { ChatResponseArea } from '../features/chat/components/ChatResponseArea';
import { useChatActions } from '../features/chat/hooks/useChatActions';

export const ChatPage = () => {
  const { chatId } = useParams();
  const [input, setInput] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    loading,
    response: gptResponse,
    setResponse,
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

  const handleDalleGenerate = async () => {
  if (!originalText || isGenerating) return;

  setIsGenerating(true);
  try {
    const response = await api.post('/ai/dalle/parse-and-generate', {
      text: originalText
    });

    console.log('Dalle response:', response.data);

    if (response.data.success) {
      // 초기 scene 설정
      setResponse({
        type: 'scenes',
        scenes: response.data.scenes
      });

      // 폴링 시작
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await api.get(`/ai/dalle/status/${response.data.task_id}`);
          console.log('Status update:', statusResponse.data);

          if (statusResponse.data.success) {
            setResponse({
              type: 'scenes',
              scenes: statusResponse.data.scenes
            });

            // 모든 이미지가 생성되었는지 확인
            const allCompleted = statusResponse.data.scenes.every(
              scene => scene.status === 'completed' || scene.status === 'failed'
            );

            if (allCompleted) {
              clearInterval(pollInterval);
              setIsGenerating(false);
            }
          }
        } catch (error) {
          console.error('Error polling status:', error);
        }
      }, 3000); // 3초마다 상태 확인

      // 컴포넌트 언마운트시 폴링 중지
      return () => clearInterval(pollInterval);
    }
  } catch (error) {
    console.error('Failed to generate Dalle images:', error);
  }
};

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
          onDalleGenerate={() => handleDalleGenerate(originalText)} // 원본 텍스트 전달
          onGenerateTags={() => handleGenerateTags(originalText)} // 원본 텍스트 전달
          loading={loading || isGenerating}
        />
        <ChatResponseArea
          response={gptResponse}
          loading={loading}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { storyGeneratorState, chatHistoryState } from '../../../../recoil/atoms';
import { api } from '../../../../api/client';

export const useStoryGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [storyState, setStoryState] = useRecoilState(storyGeneratorState);
  const [, setChatHistory] = useRecoilState(chatHistoryState);
  const [generatedChatId, setGeneratedChatId] = useState(null);

  const generateStory = async () => {
    if (!storyState.text) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/ai/generate/story', {
        text: storyState.text,
        tone: storyState.tone
      });

      if (response.data.success) {
        setStoryState(prev => ({
          ...prev,
          result: response.data.response
        }));

        setGeneratedChatId(response.data.chat_id);
        console.log('Generated chat ID:', response.data.chat_id);

        setChatHistory(prev => [...prev, {
          message: storyState.text,
          response: response.data.response,
          timestamp: new Date().toISOString()
        }]);

        return response.data.chat_id;
      } else {
        setError(response.data.error || '스토리 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      setError(`스토리 생성 실패: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStoryState({
      text: '',
      result: '',
      tone: '기본',
      modificationInput: ''
    });
    setError(null);
    setGeneratedChatId(null);
  };

  return {
    storyState,
    setStoryState,
    loading,
    error,
    generatedChatId,
    generateStory,
    reset
  };
};
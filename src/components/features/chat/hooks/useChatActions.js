import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { chatListState } from '../../../../recoil/atoms';
import { api } from '../../../../api/client';

export const useChatActions = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [chatList, setChatList] = useRecoilState(chatListState);

  const handleSplitParagraphs = async (text) => {
    if (!text || typeof text !== 'string' || !text.trim()) {
    setResponse({
      type: 'error',
      content: 'Invalid input: Text must be a non-empty string.'
    });
    return;
  }
    setLoading(true);
    try {
      const response = await api.post('/ai/dalle/parse', { text });
      if (response.data.success) {
        setResponse({
          type: 'paragraphs',
          content: response.data.response
        });
      } else {
        setResponse({
          type: 'error',
          content: response.data.error || 'Error: No response data received'
        });
      }
    } catch (err) {
      setResponse({
        type: 'error',
        content: 'Error: Failed to get response'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTags = async (text) => {
    setLoading(true);
    try {
      const response = await api.post('/ai/search/tags', { text });

      // 응답 구조 확인을 위한 로깅 추가
      console.log('Tags response:', response.data);

      if (response.data.success && response.data.scenes) {
        setResponse(response.data);
      } else {
        setResponse({
          type: 'error',
          content: response.data.error || '응답을 생성하지 못했습니다.'
        });
      }
    } catch (err) {
      console.error('Failed to generate tags:', err);
      setResponse({
        type: 'error',
        content: 'Failed to get response'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (text, tone = '기본') => {
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const response = await api.post('/ai/generate/story', {
        text,
        tone,
      });

      if (response.data.success) {
        setChatList(prev => [...prev, {
          id: response.data.chat_id,
          message: text,
          response: response.data.response,
          created_at: new Date().toISOString()
        }]);
        return response.data.response;
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    response,
    handleSplitParagraphs,
    handleGenerateTags,
    handleSubmit
  };
};
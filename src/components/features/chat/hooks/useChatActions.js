import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { chatListState } from '../../../../recoil/atoms';
import { api } from '../../../../api/client';

export const useChatActions = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [chatList, setChatList] = useRecoilState(chatListState);

  const handleSplitParagraphs = async (text) => {
    if (!text) return;

    setLoading(true);
    try {
      const response = await api.post('/ai/dalle/parse-and-generate', { text });
      console.log('DALLE response:', response.data);

      if (response.data.success) {
        setResponse({
          type: 'scenes',
          scenes: response.data.scenes
        });
      } else {
        setResponse({
          type: 'error',
          content: response.data.error || 'Failed to process text'
        });
      }
    } catch (err) {
      console.error('Failed to generate content:', err);
      setResponse({
        type: 'error',
        content: 'Failed to get response'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTags = async (text) => {
  setLoading(true);
  try {
    const response = await api.post('/ai/search/tags', {
      text: text
    });
    console.log('Generated tags response:', response.data); // 디버깅용

    if (response.data.success && response.data.scenes) {
      // scenes 데이터 구조 맞추기
      setResponse({
        type: 'scenes',
        scenes: response.data.scenes.map(scene => ({
          scene_number: scene.scene_number,
          search_tags: scene.search_tags,
          narration: scene.narration,
          images: Array.isArray(scene.images) ? scene.images : []
        }))
      });
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
    setResponse,
    handleSplitParagraphs,
    handleGenerateTags,
    handleSubmit
  };
};

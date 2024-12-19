import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoil/atoms';
import { api } from '../../../api/client';
import { useStoryGeneration } from './hooks/useStoryGeneration';
import { StoryInput } from './components/StoryInput';
import { ToneSelect } from './components/ToneSelect';
import { StoryResult } from './components/StoryResult';

export const StoryGenerator = () => {
  const [user] = useRecoilState(userState);
  const navigate = useNavigate();
  const {
    storyState,
    setStoryState,
    loading,
    error,
    generatedChatId,
    generateStory,
    reset
  } = useStoryGeneration();

  const [toneStyles, setToneStyles] = React.useState({});

  useEffect(() => {
    const fetchToneStyles = async () => {
      try {
        const response = await api.get('/ai/generate/styles');
        setToneStyles(response.data);
      } catch (err) {
        console.error('Failed to fetch tone styles:', err);
      }
    };
    fetchToneStyles();
  }, []);

  const handleChatEdit = () => {
    if (generatedChatId) {
      console.log('Navigating to chat:', generatedChatId);
      localStorage.setItem('currentChatText', storyState.result);
      navigate(`/ai/chat/${generatedChatId}`);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(storyState.result);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">스토리 생성기</h3>
        <div className="space-y-3">
          <StoryInput
            value={storyState.text}
            onChange={(text) => setStoryState(prev => ({ ...prev, text }))}
            disabled={loading}
          />

          <ToneSelect
            value={storyState.tone}
            options={toneStyles}
            onChange={(tone) => setStoryState(prev => ({ ...prev, tone }))}
            disabled={loading}
          />

          <button
            onClick={generateStory}
            disabled={loading || !storyState.text}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm
                      hover:bg-blue-700 disabled:bg-gray-500"
          >
            {loading ? "생성 중..." : "스토리 생성"}
          </button>

          {error && (
            <p className="text-red-400 text-xs break-words">{error}</p>
          )}

          {storyState.result && (
            <StoryResult
              result={storyState.result}
              onChatEdit={handleChatEdit}
              onReset={reset}
              onCopy={handleCopy}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
};
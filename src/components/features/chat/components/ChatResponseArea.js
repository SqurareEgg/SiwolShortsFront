import React from 'react';
import { Wand2 } from 'lucide-react';

export const ChatResponseArea = ({ response, loading, isGenerating }) => {
  if (loading || isGenerating) {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <Wand2 className="animate-spin text-gray-400 mr-2" />
          <p className="text-gray-400">
            {isGenerating ? '이미지를 생성하는 중...' : '응답을 기다리는 중...'}
          </p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Dalle 생성하기 또는 짤방 생성 버튼을 눌러 시작하세요</p>
        </div>
      </div>
    );
  }

  console.log('Current response:', response); // 디버깅용

  if (response.type === 'scenes' && Array.isArray(response.scenes)) {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="space-y-6">
          {response.scenes.map((scene, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">장면 {scene.scene_number}</h4>
              {scene.search_tags ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {scene.search_tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{scene.narration}</p>
                  {scene.images && scene.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {scene.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative aspect-square">
                          <img
                            src={image.url}
                            alt={`${scene.search_tags[0]} ${imgIndex + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">이미지를 찾을 수 없습니다.</p>
                  )}
                </>
              ) : scene.image_url ? (
                <>
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{scene.narration}</p>
                  <div className="mt-2">
                    <img
                      src={scene.image_url}
                      alt={`Scene ${scene.scene_number}`}
                      className="w-full rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{scene.narration}</p>
                  <div className="mt-2 text-gray-400 text-sm">
                    {scene.error ? `이미지 생성 실패: ${scene.error}` : '이미지 생성 대기 중...'}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (response.type === 'error') {
    return (
      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
          <p>{response.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg p-4 overflow-y-auto">
      <div className="space-y-2">
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-300">응답 형식이 올바르지 않습니다.</p>
        </div>
      </div>
    </div>
  );
};
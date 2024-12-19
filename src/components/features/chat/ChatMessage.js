import React, { useState, useEffect } from 'react';

const isValidImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/');
  } catch {
    return false;
  }
};

export const ChatMessage = ({ scene }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [validImages, setValidImages] = useState([]);

  useEffect(() => {
    const validateImages = async () => {
      if (scene.images && scene.images.length > 0) {
        const validatedImages = await Promise.all(
          scene.images.map(async (image) => {
            const isValid = await isValidImageUrl(image.url);
            return isValid ? image : null;
          })
        );
        setValidImages(validatedImages.filter(img => img !== null));
      }
    };

    validateImages();
  }, [scene.images]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-3">
      <div className="flex flex-col gap-2">
        <div className="text-gray-300">
          <strong>{scene.scene_number}. [{scene.search_tags[0]}]</strong>
          <p className="whitespace-pre-wrap">{scene.narration}</p>
        </div>

        {validImages.length > 0 && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              {isExpanded ? '짤방 숨기기' : `짤방 보기 (${validImages.length}개)`}
            </button>

            {isExpanded && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {validImages.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                    {image.source_url && (
                      <a
                        href={image.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity duration-200"
                      >
                        출처 보기
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
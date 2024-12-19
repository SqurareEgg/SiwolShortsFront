import React, { useState, useEffect } from 'react';
import { api } from '../../../api/client';
import ContentToolbar from './ContentToolbar';
import ElementInspector from './ElementInspector';

const style = `
  .content-frame-wrapper {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 50px);
    overflow: hidden;
    background: white;
    border-radius: 0.5rem;
  }
  .content-frame {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export const ContentViewer = ({ selectedPost }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [elementInfo, setElementInfo] = useState(null);

  useEffect(() => {
    if (!selectedPost) {
      setContent(null);
      return;
    }

    const fetchContent = async (url = selectedPost.url) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/extract-content', { url });

        // iframe에서 부모로 메시지를 보내기 위한 스크립트
        const inspectorScript = isInspecting ? `
          <script>
            document.body.style.cursor = 'crosshair';
            let lastHighlighted = null;

            function getElementInfo(element) {
              const rect = element.getBoundingClientRect();
              const computedStyle = window.getComputedStyle(element);
              
              return {
                tagName: element.tagName.toLowerCase(),
                classes: Array.from(element.classList),
                id: element.id,
                dimensions: {
                  width: Math.round(rect.width),
                  height: Math.round(rect.height)
                },
                position: {
                  top: Math.round(rect.top),
                  left: Math.round(rect.left)
                },
                styles: {
                  color: computedStyle.color,
                  backgroundColor: computedStyle.backgroundColor,
                  fontSize: computedStyle.fontSize,
                  padding: computedStyle.padding,
                  margin: computedStyle.margin
                },
                text: element.textContent.trim()
              };
            }

            document.addEventListener('mouseover', (e) => {
              if (lastHighlighted) {
                lastHighlighted.style.outline = '';
                lastHighlighted.style.backgroundColor = '';
              }

              const target = e.target;
              target.style.outline = '2px solid #3b82f6';
              target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              lastHighlighted = target;

              const info = getElementInfo(target);
              window.parent.postMessage({ type: 'elementInfo', info }, '*');
            }, true);

            document.addEventListener('mouseout', () => {
              if (lastHighlighted) {
                lastHighlighted.style.outline = '';
                lastHighlighted.style.backgroundColor = '';
                lastHighlighted = null;
              }
            }, true);
          </script>
        ` : '';

        const frameContent = `
          <div class="content-frame-wrapper">
            <iframe
              id="contentFrame"
              class="content-frame"
              src="${response.data.url}"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
            ></iframe>
            ${inspectorScript}
          </div>
        `;

        setContent({
          styles: `<style>${style}</style>`,
          content: frameContent,
          url: response.data.url
        });
      } catch (err) {
        console.error('Content loading failed:', err);
        setError(err.response?.data?.detail || '콘텐츠를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // 이벤트 리스너 설정
    const handleMessage = (event) => {
      if (event.data.type === 'elementInfo') {
        setElementInfo(event.data.info);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      setContent(null);
      setError(null);
      setIsInspecting(false);
      setElementInfo(null);
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedPost, isInspecting]);

  const handleCustomUrl = async (url) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/extract-content', { url });
      setContent({
        styles: `<style>${style}</style>`,
        content: `<div class="content-frame-wrapper">
          <iframe
            class="content-frame"
            src="${response.data.url}"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
          ></iframe>
        </div>`,
        url: response.data.url
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'URL 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      <ContentToolbar
        url={content?.url}
        title={selectedPost ? selectedPost.title : '게시글 내용'}
        isInspecting={isInspecting}
        onInspectToggle={setIsInspecting}
        onCustomUrlSubmit={handleCustomUrl}
      />

      <div className="flex-1 overflow-hidden">
        <div className={`h-full flex ${isInspecting ? 'space-x-4' : ''}`}>
          <div className={`flex-1 bg-white rounded-b-lg ${isInspecting ? 'rounded-br-none' : ''}`}>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : error ? (
              <div className="p-4 text-red-400 bg-red-400/10">
                <p className="font-semibold">오류 발생</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            ) : content ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: content.styles }} />
                <div
                  dangerouslySetInnerHTML={{ __html: content.content }}
                  className="h-full"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <span className="text-2xl mb-2">👈</span>
                <p>왼쪽에서 게시글을 선택하세요.</p>
              </div>
            )}
          </div>

          {isInspecting && (
            <ElementInspector
              elementInfo={elementInfo}
              onClose={() => setIsInspecting(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
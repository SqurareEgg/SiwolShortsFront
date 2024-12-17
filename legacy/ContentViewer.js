import React, { useState, useEffect, useRef } from 'react';
import { api } from '../src/api/client';
import { Link as LinkIcon, X, ExternalLink, Copy, Check, Crosshair, XCircle } from 'lucide-react';
import PropTypes from "prop-types";

const style = `
  .element-highlight {
    outline: 2px solid #3b82f6 !important;
    background-color: rgba(59, 130, 246, 0.1) !important;
  }
  
  .content-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 1rem;
  }
  
  .content-wrapper img {
    max-width: 100%;
    height: auto;
  }
  
  .content-wrapper a {
    color: #3b82f6;
    text-decoration: none;
  }
  
  .content-wrapper a:hover {
    text-decoration: underline;
  }
`;

export const ContentViewer = ({ selectedPost }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUrlInputVisible, setUrlInputVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [elementInfo, setElementInfo] = useState(null);
  const contentRef = useRef(null);
  const highlightRef = useRef(null);
  const styleRef = useRef(null);

  useEffect(() => {
    // Add styles to document
    styleRef.current = document.createElement('style');
    styleRef.current.textContent = style;
    document.head.appendChild(styleRef.current);

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedPost) {
      setContent(null);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/extract-content', {
          url: selectedPost.url
        });

        setContent({
          url: response.data.url,
          html: response.data.html || '<div>No content available</div>' // Fallback content
        });
      } catch (err) {
        console.error('Content loading failed:', err);
        setError(err.response?.data?.detail || '콘텐츠를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => {
      setContent(null);
      setError(null);
      setIsInspecting(false);
      setElementInfo(null);
    };
  }, [selectedPost]);

  useEffect(() => {
    if (!isInspecting || !contentRef.current) return;

    const container = contentRef.current;

    const getElementInfo = (element) => {
      if (!element || element === container) return null;

      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      return {
        tagName: element.tagName.toLowerCase(),
        classes: Array.from(element.classList).filter(cls => cls !== 'element-highlight'),
        id: element.id,
        dimensions: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        position: {
          top: Math.round(rect.top - containerRect.top + container.scrollTop),
          left: Math.round(rect.left - containerRect.left + container.scrollLeft),
        },
        styles: {
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          fontSize: computedStyle.fontSize,
          padding: `${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}`,
          margin: `${computedStyle.marginTop} ${computedStyle.marginRight} ${computedStyle.marginBottom} ${computedStyle.marginLeft}`,
        },
        text: element.textContent.trim().substring(0, 100) + (element.textContent.length > 100 ? '...' : '')
      };
    };

    const removeHighlight = () => {
      if (highlightRef.current) {
        container.querySelectorAll('.element-highlight').forEach(el => {
          el.classList.remove('element-highlight');
        });
        highlightRef.current = null;
      }
    };

    const handleMouseMove = (e) => {
      if (!isInspecting) return;

      let element = e.target;

      // Ignore the container itself
      if (element === container) {
        removeHighlight();
        setElementInfo(null);
        return;
      }

      // Don't process the same element twice
      if (element === highlightRef.current) return;

      removeHighlight();

      const info = getElementInfo(element);
      if (info) {
        element.classList.add('element-highlight');
        highlightRef.current = element;
        setElementInfo(info);
      }
    };

    const handleMouseLeave = () => {
      removeHighlight();
      setElementInfo(null);
    };

    const handleClick = (e) => {
      if (!isInspecting) return;
      e.preventDefault();
      e.stopPropagation();
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      removeHighlight();
    };
  }, [isInspecting]);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!customUrl) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/extract-content', {
        url: customUrl
      });

      setContent({
        url: response.data.url,
        html: response.data.html || '<div>No content available</div>'
      });
      setUrlInputVisible(false);
      setCustomUrl('');
    } catch (err) {
      setError(err.response?.data?.detail || 'URL 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    if (content?.url) {
      try {
        await navigator.clipboard.writeText(content.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const toggleInspector = () => {
    setIsInspecting(!isInspecting);
    setElementInfo(null);
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {selectedPost ? selectedPost.title : '게시글 내용'}
          </h3>
          <div className="flex items-center space-x-2">
            {content?.url && (
              <button
                onClick={copyUrl}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-600"
                title={copied ? "복사됨" : "URL 복사"}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            )}
            <button
              onClick={() => setUrlInputVisible(!isUrlInputVisible)}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-600"
              title="URL 직접 입력"
            >
              <LinkIcon size={20} />
            </button>
            <button
              onClick={toggleInspector}
              className={`p-2 rounded-lg ${
                isInspecting 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
              title="요소 검사"
            >
              <Crosshair size={20} />
            </button>
            {content?.url && (
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-600"
                title="새 탭에서 열기"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        {/* URL Input Form */}
        {isUrlInputVisible && (
          <form onSubmit={handleUrlSubmit} className="mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="URL 입력..."
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => setUrlInputVisible(false)}
                className="p-2 text-gray-300 hover:text-white rounded hover:bg-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        )}

        {/* Meta Information */}
        {selectedPost && (
          <div className="mt-2 text-sm text-gray-300 flex items-center space-x-4">
            <span>작성일: {selectedPost.date}</span>
            <span>조회수: {selectedPost.views}</span>
            <span>출처: {selectedPost.community}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 bg-white rounded-bl-lg ${isInspecting ? 'rounded-br-none' : 'rounded-br-lg'}`}>
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
            <div
              ref={contentRef}
              className="content-wrapper"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <span className="text-2xl mb-2">👈</span>
              <p>왼쪽에서 게시글을 선택하세요.</p>
            </div>
          )}
        </div>

        {/* Inspector Panel */}
        {isInspecting && (
          <div className="w-80 bg-gray-800 rounded-br-lg overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h4 className="text-white font-medium">요소 정보</h4>
              <button
                onClick={toggleInspector}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            {elementInfo ? (
              <div className="p-4 text-sm">
                <div className="mb-4">
                  <h5 className="text-blue-400 font-medium mb-2">요소</h5>
                  <p className="text-white">{elementInfo.tagName}</p>
                  {elementInfo.id && (
                    <p className="text-gray-300 mt-1">ID: {elementInfo.id}</p>
                  )}
                  {elementInfo.classes.length > 0 && (
                    <p className="text-gray-300 mt-1 break-words">
                      Classes: {elementInfo.classes.join(' ')}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <h5 className="text-blue-400 font-medium mb-2">크기</h5>
                  <p className="text-gray-300">
                    너비: {elementInfo.dimensions.width}px
                  </p>
                  <p className="text-gray-300">
                    높이: {elementInfo.dimensions.height}px
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="text-blue-400 font-medium mb-2">위치</h5>
                  <p className="text-gray-300">
                    상단: {elementInfo.position.top}px
                  </p>
                  <p className="text-gray-300">
                    좌측: {elementInfo.position.left}px
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="text-blue-400 font-medium mb-2">스타일</h5>
                  <p className="text-gray-300">
                    색상: {elementInfo.styles.color}
                  </p>
                  <p className="text-gray-300">
                    배경: {elementInfo.styles.backgroundColor}
                  </p>
                  <p className="text-gray-300">
                    글자 크기: {elementInfo.styles.fontSize}
                  </p>
                  <p className="text-gray-300">
                    패딩: {elementInfo.styles.padding}
                  </p>
                  <p className="text-gray-300">
                    마진: {elementInfo.styles.margin}
                  </p>
                </div>

                {elementInfo.text && (
                  <div>
                    <h5 className="text-blue-400 font-medium mb-2">텍스트 내용</h5>
                    <p className="text-gray-300 break-words">{elementInfo.text}</p>
                  </div>
                )}
                </div>
            ) : (
              <div className="p-4 text-gray-400 text-center">
                요소 위로 마우스를 올려보세요
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add PropTypes
ContentViewer.propTypes = {
  selectedPost: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    date: PropTypes.string,
    views: PropTypes.number,
    community: PropTypes.string,
  }),
};
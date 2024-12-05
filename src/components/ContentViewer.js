import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Link as LinkIcon, X, ExternalLink, Copy, Check } from 'lucide-react';

export const ContentViewer = ({ selectedPost }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUrlInputVisible, setUrlInputVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [copied, setCopied] = useState(false);

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

        const styles = `
          <style>
            .content-frame-wrapper {
              width: 100%;
              height: 100%;
              max-height: calc(100vh - 180px);
              overflow: hidden;
              background: white;
              border-radius: 0.5rem;
            }
            .content-frame {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        `;

        const frameContent = `
          <div class="content-frame-wrapper">
            <iframe
              class="content-frame"
              src="${response.data.url}"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
            ></iframe>
          </div>
        `;

        setContent({ styles, content: frameContent, url: response.data.url });
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
    };
  }, [selectedPost]);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!customUrl) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/extract-content', {
        url: customUrl
      });

      const styles = `
        <style>
          .content-frame-wrapper {
            width: 100%;
            height: 100%;
            max-height: calc(100vh - 180px);
            overflow: hidden;
            background: white;
            border-radius: 0.5rem;
          }
          .content-frame {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      `;

      const frameContent = `
        <div class="content-frame-wrapper">
          <iframe
            class="content-frame"
            src="${response.data.url}"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="lazy"
          ></iframe>
        </div>
      `;

      setContent({ styles, content: frameContent, url: response.data.url });
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

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      {/* 헤더 */}
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

        {/* URL 입력 폼 */}
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

        {/* 메타 정보 */}
        {selectedPost && (
          <div className="mt-2 text-sm text-gray-300 flex items-center space-x-4">
            <span>작성일: {selectedPost.date}</span>
            <span>조회수: {selectedPost.views}</span>
            <span>출처: {selectedPost.community}</span>
          </div>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-hidden bg-white rounded-b-lg">
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
    </div>
  );
};
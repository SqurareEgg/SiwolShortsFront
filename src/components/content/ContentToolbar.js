import React, { useState } from 'react';
import { LinkIcon, ExternalLink, Copy, Check, Crosshair } from 'lucide-react';

const ContentToolbar = ({
  url,
  title,
  isInspecting,
  onInspectToggle,
  onCustomUrlSubmit
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    onCustomUrlSubmit(customUrl);
    setShowUrlInput(false);
    setCustomUrl('');
  };

  const handleCopyUrl = async () => {
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-600">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          {url && (
            <button
              onClick={handleCopyUrl}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-600"
              title={copied ? "복사됨" : "URL 복사"}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          )}
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-600"
            title="URL 직접 입력"
          >
            <LinkIcon size={20} />
          </button>
          <button
            onClick={() => onInspectToggle(!isInspecting)}
            className={`p-2 rounded-lg ${
              isInspecting 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
            title="요소 검사"
          >
            <Crosshair size={20} />
          </button>
          {url && (
            <a
              href={url}
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

      {showUrlInput && (
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
          </div>
        </form>
      )}
    </div>
  );
};

export default ContentToolbar;
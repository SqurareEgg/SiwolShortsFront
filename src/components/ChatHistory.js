import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MessageSquare, Bot, User } from 'lucide-react';

export const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await api.get('/chat-history', {
        params: { page }
      });

      const newHistory = response.data.items;
      setHistory(prev => [...prev, ...newHistory]);
      setHasMore(response.data.has_more);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-600 flex items-center">
        <MessageSquare className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">대화 히스토리</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((item, index) => (
          <div key={index} className="space-y-2">
            {/* 사용자 메시지 */}
            <div className="flex items-start space-x-2">
              <div className="p-2 bg-blue-500 rounded-lg flex-1">
                <div className="flex items-center mb-1">
                  <User className="w-4 h-4 text-white mr-2" />
                  <span className="text-xs text-white/80">사용자</span>
                </div>
                <p className="text-sm text-white">{item.message}</p>
              </div>
            </div>

            {/* AI 응답 */}
            <div className="flex items-start space-x-2">
              <div className="p-2 bg-gray-600 rounded-lg flex-1">
                <div className="flex items-center mb-1">
                  <Bot className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-xs text-white/80">AI 어시스턴트</span>
                </div>
                <p className="text-sm text-white">{item.response}</p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        )}

        {hasMore && !loading && (
          <button
            onClick={loadMore}
            className="w-full py-2 text-sm text-blue-400 hover:text-blue-300"
          >
            이전 대화 더 보기
          </button>
        )}
      </div>
    </div>
  );
};
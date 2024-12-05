import React, { useState, useEffect } from 'react';
import { User, MessageSquare, Clock, Edit2, Save, X } from 'lucide-react';
import { api } from '../api/client';

export const MyPage = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [statsResponse, historyResponse] = await Promise.all([
        api.get('/user/stats'),
        api.get('/chat-history')
      ]);

      setStats(statsResponse.data);
      setChatHistory(historyResponse.data.items);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/auth/update', userInfo);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다.');
      console.error('Failed to update profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 프로필 섹션 */}
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <User className="mr-2" />
              프로필
            </h2>
            <button
              onClick={() => editMode ? handleUpdateProfile() : setEditMode(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editMode ? (
                <>
                  <Save size={18} className="mr-2" />
                  저장
                </>
              ) : (
                <>
                  <Edit2 size={18} className="mr-2" />
                  수정
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">사용자명</label>
              {editMode ? (
                <input
                  type="text"
                  value={userInfo.username}
                  onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
                />
              ) : (
                <p className="text-white">{userInfo.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">이메일</label>
              <p className="text-white">{userInfo.email}</p>
            </div>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">총 대화 수</h3>
              <MessageSquare className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {stats?.totalChats || 0}
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">생성된 스토리</h3>
              <Edit2 className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {stats?.totalStories || 0}
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">가입일</h3>
              <Clock className="text-purple-500" />
            </div>
            <p className="text-lg font-medium text-white mt-2">
              {new Date(stats?.joinDate || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 최근 대화 내역 */}
        <div className="bg-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <MessageSquare className="mr-2" />
            최근 대화 내역
          </h2>
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4">
                <div className="text-sm text-gray-400">
                  {new Date(chat.created_at).toLocaleString()}
                </div>
                <div className="mt-1 text-white">
                  <p className="text-gray-300">{chat.message}</p>
                  <p className="mt-2 text-blue-400">{chat.response}</p>
                </div>
              </div>
            ))}
            {chatHistory.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                아직 대화 내역이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
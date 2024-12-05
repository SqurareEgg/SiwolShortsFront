import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth';

export const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setIsRegister(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const userData = await authApi.register({ email, password, username });
        // 회원가입 후 자동 로그인
        await handleLogin(email, password);
      } else {
        await handleLogin(email, password);
      }
      handleClose();
    } catch (err) {
      setError(err.response?.data?.detail || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    onLogin(data.user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-96">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {isRegister ? '회원가입' : '로그인'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600"
                required
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">사용자명</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white border border-gray-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  처리중...
                </span>
              ) : (
                isRegister ? '가입하기' : '로그인'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError('');
                setIsRegister(!isRegister);
              }}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              {isRegister ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
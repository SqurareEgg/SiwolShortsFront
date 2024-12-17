import { useState } from 'react';
import { authApi } from '../api/auth';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms';

export const useAuthForm = (type = 'login') => {
  const [, setUser] = useRecoilState(userState);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password, username } = formData;

      if (type === 'register') {
        await authApi.register({ email, password, username });
      }

      const loginData = await authApi.login(email, password);
      setUser(loginData.user);
      resetForm();
      return true;
    } catch (err) {
      let errorMessage = '';
      if (err.response?.data?.detail) {
        errorMessage = typeof err.response.data.detail === 'object'
          ? '입력 정보를 확인해주세요.'
          : err.response.data.detail;
      } else {
        errorMessage = '처리 중 오류가 발생했습니다.';
      }
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};
import React from 'react';
import Input from './common/Input';
import Button from './common/Button';

const AuthForm = ({
  type = 'login',
  loading,
  error,
  formData,
  onSubmit,
  onChange,
  onToggleType,
  setError  // error 상태를 설정하기 위한 prop 추가
}) => {
  const isRegister = type === 'register';

  const validateForm = () => {
    if (isRegister) {
      if (!formData.username || formData.username.length < 2) {
        return '사용자명은 2자 이상이어야 합니다.';
      }
      if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
        return '사용자명은 영문자와 숫자만 사용할 수 있습니다.';
      }
    }

    if (!formData.password || formData.password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!/[A-Z]/.test(formData.password)) {
      return '비밀번호에 대문자가 포함되어야 합니다.';
    }
    if (!/[a-z]/.test(formData.password)) {
      return '비밀번호에 소문자가 포함되어야 합니다.';
    }
    if (!/[0-9]/.test(formData.password)) {
      return '비밀번호에 숫자가 포함되어야 합니다.';
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return '유효한 이메일 주소를 입력해주세요.';
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);  // setError를 사용하여 에러 상태 설정
      return;
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Input
        label="이메일"
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        required
        placeholder="example@email.com"
      />

      {isRegister && (
        <Input
          label="사용자명"
          name="username"
          value={formData.username}
          onChange={onChange}
          required
          placeholder="영문, 숫자 조합 2자 이상"
        />
      )}

      <Input
        label="비밀번호"
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        required
        placeholder={isRegister ? "대소문자, 숫자 조합 8자 이상" : ""}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={loading}
      >
        {isRegister ? '가입하기' : '로그인'}
      </Button>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={onToggleType}
      >
        {isRegister
          ? '이미 계정이 있으신가요? 로그인'
          : '계정이 없으신가요? 회원가입'}
      </Button>
    </form>
  );
};

export default AuthForm;
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
  onToggleType
}) => {
  const isRegister = type === 'register';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
      />

      {isRegister && (
        <Input
          label="사용자명"
          name="username"
          value={formData.username}
          onChange={onChange}
          required
        />
      )}

      <Input
        label="비밀번호"
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        required
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
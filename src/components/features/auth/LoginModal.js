import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginModalState } from '../../../recoil/atoms';
import Modal from '../../common/Modal';
import AuthForm from './AuthForm';
import { useAuthForm } from '../../../hooks/useAuthForm';

const LoginModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(loginModalState);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);  // error state 추가
  const {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useAuthForm(isRegister ? 'register' : 'login');

  const handleClose = () => {
    resetForm();
    setIsRegister(false);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) {
      handleClose();
    }
  };

  const toggleAuthType = () => {
    setIsRegister(!isRegister);
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isRegister ? '회원가입' : '로그인'}
    >
      <AuthForm
        type={isRegister ? 'register' : 'login'}
        loading={loading}
        error={error}
        formData={formData}
        onSubmit={handleFormSubmit}
        onChange={handleInputChange}
        onToggleType={toggleAuthType}
        setError={setError}  // setError 함수 전달
      />
    </Modal>
  );
};

export default LoginModal;
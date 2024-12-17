import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { api } from './api/client';
//
// 앱 시작시 자동 로그인
// const autoLogin = async () => {
//   try {
//     const formData = new URLSearchParams();
//     formData.append('username', '123@123.com');
//     formData.append('password', '123123');
//
//     const response = await api.post('/auth/login', formData, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });
//
//     if (response.data.access_token) {
//       localStorage.setItem('token', response.data.access_token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       console.log('Auto login successful');
//     }
//   } catch (error) {
//     console.error('Auto login failed:', error);
//   }
// };
//
// // 앱 시작시 자동 로그인 실행
// autoLogin();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

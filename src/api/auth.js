import { api } from './client';

export const authApi = {
    login: async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data);
            throw error;
        }
    },

    register: async ({ email, password, username }) => {
    try {
        // form-urlencoded 대신 JSON 형식으로 전송
        const response = await api.post('/auth/register', {
            email,
            password,
            username
        }, {
            headers: {
                'Content-Type': 'application/json'  // JSON 형식 명시
            }
        });
        return response.data;
    } catch (error) {
        // 422 에러의 경우 validation 에러 메시지 처리
        if (error.response?.status === 422) {
            const validationErrors = error.response.data.detail;
            // validation 에러 메시지를 읽기 쉽게 변환
            const errorMessage = Array.isArray(validationErrors)
                ? validationErrors.map(err => err.msg).join('\n')
                : '입력 정보를 확인해주세요.';
            throw new Error(errorMessage);
        }
        console.error('Register error:', error.response?.data);
        throw error;
    }
},

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Get user error:', error.response?.data);
            return null;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    }
};
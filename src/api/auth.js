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
        console.log('Sending registration request:', {
            email,
            password: password ? 'YES' : 'NO',  // 비밀번호 존재 여부만 표시
            username
        });

        const response = await api.post('/auth/register', {
            email,
            password,
            username
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            const validationErrors = error.response.data.detail;
            console.log('Validation errors:', validationErrors);
            // 상세 에러 메시지 구성
            const errorMessage = Array.isArray(validationErrors)
                ? validationErrors.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n')
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
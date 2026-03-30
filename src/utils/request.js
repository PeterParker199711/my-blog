// src/utils/request.js
import axios from 'axios';
import { Message } from '@arco-design/web-vue';

const service = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// 标记是否正在刷新 Token
let isRefreshing = false;

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        // 后端 R.ok() 通常 code 为 200
        if (res.code !== 200) {
            Message.error(res.message || '系统错误');
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res.data; // 直接返回 TokenVO 或 UserInfoVO
    },
    async (error) => {
        const { response, config } = error;

        // 当返回 401 且不是刷新接口本身报错时
        if (response && response.status === 401 && !config.url.includes('/auth/refresh')) {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                //连刷新 Token 都没有，直接去登录
                handleLogout();
                return Promise.reject(error);
            }

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const res = await axios.post('/api/auth/refresh', refreshToken, {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    if (res.data.code === 200) {
                        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

                        // 更新本地存储
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);

                        // 让原始请求带上新 Token 重试
                        config.headers['Authorization'] = `Bearer ${accessToken}`;
                        isRefreshing = false;
                        return service(config);
                    }
                } catch (refreshError) {
                    handleLogout();
                } finally {
                    isRefreshing = false;
                }
            }
        }

        Message.error(error.response?.data?.message || '网络异常');
        return Promise.reject(error);
    }
);

function handleLogout() {
    localStorage.clear();
    window.location.href = '/login';
}

export default service;
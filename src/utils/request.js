// src/utils/request.js
import axios from 'axios';
import { Message } from '@arco-design/web-vue';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
// 1. 创建 Axios 实例
const service = axios.create({
    // baseURL 会自动读取上面环境变量配置的地址
    baseURL: VITE_API_BASE_URL,
    timeout: 10000, // 超时时间 10秒
});

// 2. 请求拦截器 (Request Interceptor)
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么：比如携带 Token
        const token = localStorage.getItem('blog_token');
        if (token) {
            // 标准的 Bearer Token 格式
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 响应拦截器 (Response Interceptor)
service.interceptors.response.use(
    (response) => {
        // 后端通常会包装一层统一结构，如 { code: 200, data: {...}, msg: "success" }
        const res = response.data;

        // 假设你们约定的成功状态码是 200 或 0
        if (res.code !== 200 && res.code !== 0) {
            // 统一报错
            Message.error(res.message || res.msg || '服务器开小差了');

            // 401 代表 Token 过期或未登录
            if (res.code === 401) {
                localStorage.removeItem('blog_token');
                window.location.href = '/login'; // 强制踢回登录页
            }
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            // 剥离外层壳，直接返回核心数据
            return res.data;
        }
    },
    (error) => {
        // 处理 HTTP 网络层面错误 (如 404, 500)
        let errMsg = '网络异常，请稍后重试';
        if (error.response) {
            switch (error.response.status) {
                case 401: errMsg = '登录已过期，请重新登录'; break;
                case 403: errMsg = '您没有权限访问该资源'; break;
                case 404: errMsg = '请求的接口不存在'; break;
                case 500: errMsg = '服务器内部错误'; break;
            }
        }
        Message.error(errMsg);
        return Promise.reject(error);
    }
);

export default service;
import request from '../utils/request';

// 登录接口
export function loginAPI(data) {
    return request({
        url: '/auth/login',
        method: 'post',
        data
    });
}

// 获取用户信息接口
export function getUserInfoAPI() {
    return request({
        url: '/auth/info',
        method: 'get'
    });
}
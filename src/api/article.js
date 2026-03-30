import request from '../utils/request';

// 获取文章列表
export function getArticleListAPI() {
    return request({
        url: '/articles',
        method: 'get'
    });
}
import request from '../utils/request';

export const getArticles = () => request.get('/articles');
export const getCategories = () => request.get('/categories');
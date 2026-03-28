// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { Message } from '@arco-design/web-vue';

const routes = [
    {
        path: '/',
        redirect: '/login' // 默认重定向到登录页
    },
    { path: '/Intro', name: 'Intro', component: () => import('../views/intro/Intro.vue') },
    {
        path: '/blog',
        name: 'Blog',
        component: () => import('../views/blog/Blog.vue'),
        meta: {
            title: '我的博客',
            requiresAuth: true // 需要登录才能进
        }
    },
    { path: '/archive', name: 'Archive', component: () => import('../views/archive/Archive.vue') },
    { path: '/about', name: 'About', component: () => import('../views/about/About.vue') },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: '系统登录 - Peter Space'
        }
    },
]

const router = createRouter({
    // 🚀 核心修复：注入 Vite 的 BASE_URL，自动适配 /my-blog/ 这种子目录前缀
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    // 这样如果 to.meta.title 是 undefined，就会自动变成 'Peter Space'
    document.title = to.meta.title || 'Peter Space';
    console.log(to, from, next);
    console.log(document.title);


    // 获取本地存储的 token
    const token = localStorage.getItem('blog_token');

    // 检查即将进入的页面是否需要验证权限 (requiresAuth)
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            Message.warning('检测到您未登录或身份已过期，请先登录');
            // 强制踢回登录页，并带上原来想去的路径，方便登录后跳回来
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        // 如果页面不需要权限，直接放行
        next();
    }
})

export default router
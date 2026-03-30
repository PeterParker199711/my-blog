// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { Message } from '@arco-design/web-vue';

const routes = [
    {
        path: '/',
        name: 'Root',
        // 🚀 删掉这里的 beforeEnter，不要让路由表自己做主
        component: () => import('../views/intro/Intro.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/Intro',
        // 🚀 让 /Intro 直接重定向到 /，保持 URL 唯一
        redirect: '/'
    },
    {
        path: '/blog',
        name: 'Blog',
        component: () => import('../views/blog/Blog.vue'),
        meta: { title: '博客内容', requiresAuth: true }
    },
    { path: '/archive', name: 'Archive', component: () => import('../views/archive/Archive.vue') },
    { path: '/about', name: 'About', component: () => import('../views/about/About.vue') },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: '系统登录'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../components/404NotFound/404NotFound.vue'), // 确保路径指向你存放该文件的位置
        meta: { title: '404 - 信号丢失' }
    }
]

const router = createRouter({
    //  核心修复：注入 Vite 的 BASE_URL，自动适配 /my-blog/ 这种子目录前缀
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Space';
    const token = localStorage.getItem('accessToken');

    const isLoggingIn = to.path === '/login';
    const isRoot = to.path === '/'; // 现在 / 就是 Intro 页面

    // 1. 处理未登录情况
    if (!token) {
        if (isLoggingIn || isRoot) {
            // 未登录时，准许去登录页和首页(Intro)
            next();
        } else {
            // 访问 /blog 或其他，强制去登录
            Message.warning('请先验证身份');
            next({ path: '/login', query: { redirect: to.fullPath } });
        }
    }
    // 2. 处理已登录情况
    else {
        if (isLoggingIn) {
            // 已登录还去登录页？直接去博客
            next('/blog');
        }
        else if (isRoot && from.name === null) {
            // 🚀 核心优化：只有在“初次进入网站”且路径是 / 时，才自动跳转到博客
            // 这样能保证你刷新页面时直接进博客，而不会先看一眼 Intro
            next('/blog');
        }
        else {
            // 🚀 关键点：其他情况（包括在站内点击“首页”）一律放行 next()
            // 不要写 next('/blog')，否则你会永远被锁死在博客页
            next();
        }
    }
});

export default router
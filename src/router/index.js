import { createRouter, createWebHistory } from 'vue-router'
import Intro from '../views/intro/Intro.vue'
import Blog from '../views/blog/Blog.vue'
// 导入你的 404 页面
import NotFound from '../components/404NotFound/404NotFound.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Intro', component: Intro },
        { path: '/blog', name: 'Blog', component: Blog },

        // 👇 这一段必须放在最后！捕获所有未匹配的路径
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})

export default router
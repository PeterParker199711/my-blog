// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Intro', component: () => import('../views/intro/Intro.vue') },
    { path: '/blog', name: 'Blog', component: () => import('../views/blog/Blog.vue') },
    { path: '/archive', name: 'Archive', component: () => import('../views/archive/Archive.vue') },
    { path: '/about', name: 'About', component: () => import('../views/about/About.vue') },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

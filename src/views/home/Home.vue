<template>
    <div class="page-wrapper">
        <div class="background-layer">
            <Aurora :color-stops="['#00FFFF', '#F0E68C', '#FFC0CB']" :amplitude="1.0" :blend="0.5" :speed="0.8"
                class="aurora-bg" />
        </div>

        <main class="content-layer">
            <header class="header">
                <div class="nav-container">
                    <GooeyNav :items="navItems" :particle-count="5" :particle-distances="[110, 30]" />
                </div>
            </header>

            <div class="main-container">
                <transition name="fade-slide" mode="out-in">

                    <section v-if="!isEntered" class="hero-section">
                        <h1 class="main-title">show time</h1>

                        <div class="search-wrap">
                            <SearchInput placeholder="搜索组件、文档或代码片段..." @search="onSearch" />
                        </div>

                        <div class="action-group">
                            <button class="btn btn-primary" @click="enterBlog">开始</button>
                            <button class="btn btn-secondary">了解更多</button>
                        </div>
                    </section>

                    <section v-else class="blog-layout">

                        <aside class="glass-panel left-sidebar">
                            <h2 class="panel-title">探索</h2>
                            <ul class="category-list">
                                <li v-for="cat in categories" :key="cat"
                                    :class="['category-item', { active: currentCategory === cat }]"
                                    @click="currentCategory = cat">
                                    {{ cat }}
                                </li>
                            </ul>
                            <div class="divider"></div>
                            <div class="article-list">
                                <div v-for="article in articles" :key="article.id" class="article-card">
                                    <span class="date">{{ article.date }}</span>
                                    <h3>{{ article.title }}</h3>
                                </div>
                            </div>
                        </aside>

                        <article class="glass-panel main-content">
                            <div class="article-header">
                                <span class="tag">前端开发</span>
                                <h1 class="article-title">Vue3 组合式 API 高级应用指南</h1>
                                <div class="article-meta">发布于 2023-10-24 · 约 2500 字</div>
                            </div>
                            <div class="article-body">
                                <p>这里是文章的正文区域。采用毛玻璃设计，文字保持高对比度。</p>
                                <p>在实际开发中，这里将渲染 Markdown 内容。你可以通过滚动条向下阅读，而背后的极光动画依然在缓缓流动，带来极致的阅读沉浸感。</p>
                                <br><br><br><br><br><br><br><br><br><br><br><br>
                                <p>（我是用来占位测试滚动的文字）</p>
                            </div>
                        </article>

                        <aside class="glass-panel right-sidebar">
                            <div class="author-card">
                                <div class="avatar">👨‍💻</div>
                                <h3>Flower</h3>
                                <p>前端工程师 / 设计爱好者</p>
                                <div class="social-links">
                                    <span class="icon">GH</span>
                                    <span class="icon">TW</span>
                                    <span class="icon">WX</span>
                                </div>
                            </div>
                            <div class="divider"></div>
                            <h2 class="panel-title">当前目录</h2>
                            <ul class="toc-list">
                                <li>响应式原理解析</li>
                                <li>依赖注入实战</li>
                                <li>性能优化技巧</li>
                            </ul>
                        </aside>

                    </section>
                </transition>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Aurora from '../../components/Aurora/Aurora.vue'
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'
import SearchInput from '../../components/SearchInput/SearchInput.vue'

// --- 状态控制 ---
const isEntered = ref(false)
const enterBlog = () => {
    isEntered.value = true
}

// --- 顶部导航 ---
const navItems = [
    { label: '首页', href: '/' },
    { label: '文档', href: '/docs' },
    { label: '关于', href: '/about' },
    { label: '我的', href: '/mine' }
]

const onSearch = (val) => {
    console.log('Searching for:', val)
}

// --- 博客模拟数据 ---
const categories = ['全部', '前端开发', '生活随笔', '设计资源']
const currentCategory = ref('前端开发')
const articles = ref([
    { id: 1, title: '2023 前端技术栈盘点', date: '10-24' },
    { id: 2, title: '如何设计一个完美的暗黑模式', date: '10-18' },
    { id: 3, title: 'Tailwind CSS 高阶玩法', date: '09-05' },
    { id: 4, title: '我的第一篇博客', date: '08-12' },
])
</script>

<style scoped>
/* ================= 基础布局 ================= */
.page-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    background: #000;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: white;
}

.background-layer {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.aurora-bg {
    opacity: 0.6;
}

.content-layer {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: center;
    /* 居中导航栏 */
    align-items: center;
    padding: 24px 48px;
    height: 80px;
    flex-shrink: 0;
}

.main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 防止外层滚动 */
}

/* ================= 动画转场 ================= */
/* 上滑消失与淡入的动画曲线 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(40px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-40px);
}

/* ================= Hero 首屏区域 ================= */
.hero-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 10vh;
}

.main-title {
    font-size: clamp(40px, 8vw, 80px);
    font-weight: 800;
    letter-spacing: -2px;
    margin-bottom: 40px;
    text-transform: uppercase;
}

.search-wrap {
    width: 100%;
    max-width: 580px;
    margin-bottom: 40px;
}

.action-group {
    display: flex;
    gap: 16px;
}

.btn {
    padding: 12px 36px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: white;
    color: black;
    border: none;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* ================= 博客三栏布局 ================= */
.blog-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    /* 左中右宽度分配 */
    gap: 24px;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px 24px 24px;
    height: calc(100vh - 80px);
    /* 减去 Header 高度 */
}

/* 统一的毛玻璃面板样式 */
.glass-panel {
    background: rgba(20, 20, 20, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 24px;
    overflow-y: auto;
    /* 内部独立滚动 */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 隐藏滚动条但保留滚动功能 (提升美观度) */
.glass-panel::-webkit-scrollbar {
    width: 4px;
}

.glass-panel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

.panel-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
}

.divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 20px 0;
}

/* 左侧：分类与列表 */
.category-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.category-item {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s;
}

.category-item:hover,
.category-item.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.article-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.article-card {
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
}

.article-card:hover {
    background: rgba(255, 255, 255, 0.05);
}

.article-card .date {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 4px;
    display: block;
}

.article-card h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.4;
}

/* 中间：正文区 */
.main-content {
    background: rgba(10, 10, 10, 0.6);
    /* 中间区域稍微暗一点，提升阅读对比度 */
    padding: 40px;
}

.article-header {
    margin-bottom: 40px;
}

.article-header .tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(0, 255, 255, 0.1);
    color: #00FFFF;
    font-size: 12px;
    margin-bottom: 16px;
}

.article-title {
    font-size: 36px;
    margin: 0 0 16px 0;
    font-weight: 700;
    line-height: 1.2;
}

.article-meta {
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
}

.article-body {
    font-size: 16px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.85);
}

/* 右侧：名片区 */
.author-card {
    text-align: center;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00FFFF, #FFC0CB);
    margin: 0 auto 16px;
    display: grid;
    place-items: center;
    font-size: 32px;
}

.author-card h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
}

.author-card p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 16px 0;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 12px;
}

.icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: grid;
    place-items: center;
    font-size: 12px;
    cursor: pointer;
    transition: 0.2s;
}

.icon:hover {
    background: white;
    color: black;
}

.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.toc-list li {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    padding: 8px 0;
    cursor: pointer;
    transition: color 0.2s;
}

.toc-list li:hover {
    color: white;
}
</style>
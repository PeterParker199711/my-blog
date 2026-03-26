<template>
    <div class="blog-page">
        <main class="content-layer">
            <header class="header">
                <GooeyNav :items="navItems" :particle-count="5" :particle-distances="[122, 30]" />
            </header>

            <section class="blog-layout">
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
                        <div class="article-meta">发布于 2023-10-24 · 作者 Flower</div>
                    </div>
                    <div class="article-body">
                        <MarkdownViewer :content="mockMarkdown" />
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
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'
import MarkdownViewer from '../../components/MarkdownViewer/MarkdownViewer.vue'

const navItems = [
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
    { label: '关于', href: '/about' }
]

const categories = ['全部', '前端开发', '生活随笔', '设计资源']
const currentCategory = ref('前端开发')

const articles = [
    { id: 1, title: '2023 前端技术栈盘点', date: '10-24' },
    { id: 2, title: '如何设计一个完美的暗黑模式', date: '10-18' },
    { id: 3, title: 'Tailwind CSS 高阶玩法', date: '09-05' },
    { id: 4, title: '我的第一篇博客', date: '08-12' },
]

// 模拟的 Markdown 数据测试排版
const mockMarkdown = `
## 1. 为什么选择 Composition API？

在 Vue 2 中，我们习惯了使用 Options API（配置项 API）。但在大型项目中，\`data\`、\`methods\` 和 \`computed\` 的分离往往会导致**逻辑碎片化**。

> "Composition API 的核心目的，就是把相同功能的代码聚合在一起。"

### 代码示例

下面是一个简单的 \`ref\` 和 \`computed\` 的使用示例：

\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    const increment = () => {
      count.value++
    }

    return { count, doubleCount, increment }
  }
}
\`\`\`

你可以发现，它让代码更加灵活了！这在处理复杂的组件时，比如我们目前正在封装的 \`MarkdownViewer\`，体验极佳。
`
</script>

<style scoped>
/* ================= 基础布局 ================= */
.blog-page {
    width: 100%;
    height: 100vh;
    position: relative;
    background: transparent;
    /* 背景透明，透出 App.vue 里的极光 */
    overflow: hidden;
    color: white;
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
    align-items: center;
    height: 80px;
    flex-shrink: 0;
}

/* ================= 三栏结构 ================= */
.blog-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    gap: 24px;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px 24px 24px;
    height: calc(100vh - 80px);
}

/* ================= 毛玻璃面板 ================= */
.glass-panel {
    background: rgba(20, 20, 20, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 24px;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.glass-panel::-webkit-scrollbar {
    width: 4px;
}

.glass-panel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

/* ================= 组件复用样式 ================= */
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

/* ---------- 左侧：分类与文章 ---------- */
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

/* ---------- 中间：文章正文 ---------- */
.main-content {
    background: rgba(10, 10, 10, 0.6);
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

/* ---------- 右侧：名片与目录 ---------- */
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
<template>
    <div class="page-wrapper" @click="closeSearchOnOutsideClick">
        <main class="content-layer">
            <header class="header">
                <div class="nav-container">
                    <GooeyNav :items="navItems" :particle-count="5" :particle-distances="[122, 30]" />
                </div>
            </header>

            <section class="hero-section" :class="{ 'is-searching': searchResultVisible }">
                <h1 class="main-title">SHOW TIME</h1>

                <div class="search-wrap" id="search-wrapper">
                    <SearchInput placeholder="搜索文章标题或内容..." @search="onSearch" @clear="clearSearch" @focus="onSearch" />

                    <transition name="fade">
                        <div v-if="searchResultVisible" class="search-result-panel glass-panel"
                            :class="{ 'is-empty': searchResults.length === 0 }">
                            <div class="result-header">
                                找到 {{ searchResults.length }} 篇相关文章
                            </div>

                            <div class="result-scroll-area">
                                <div v-for="item in searchResults" :key="item.path" class="result-item"
                                    @click="goToArticle(item.path)">
                                    <h4 v-html="item.highlightTitle"></h4>
                                    <p class="summary" v-html="item.highlightSummary"></p>
                                </div>
                                <div v-if="searchResults.length === 0" class="no-result">
                                    暂无匹配内容
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="action-group">
                    <button class="btn btn-primary" @click="goToBlog">开始阅读</button>
                    <button class="btn btn-secondary">了解更多</button>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'
import SearchInput from '../../components/SearchInput/SearchInput.vue'

export default {
    name: 'Intro',
    components: {
        GooeyNav,
        SearchInput
    },
    data() {
        return {
            // 🚀 读取 Markdown 文件用于搜索
            postModules: import.meta.glob('../../content/posts/*.md', {
                query: '?raw',
                import: 'default',
                eager: true
            }),

            navItems: [
                { label: '首页', href: '/' },
                { label: '博客', href: '/blog' },
                { label: '归档', href: '/archive' },
                { label: '关于', href: '/about' }
            ],

            // 搜索相关的状态
            searchResults: [],
            searchResultVisible: false,
        }
    },
    methods: {
        goToBlog() {
            if (this.$router) {
                this.$router.push('/blog')
            }
        },

        // 🚀 搜索逻辑
        onSearch(keyword) {
            if (!keyword || keyword.trim() === '') {
                this.searchResultVisible = false;
                return;
            }

            const results = [];
            const regex = new RegExp(keyword.trim(), 'gi');

            Object.keys(this.postModules).forEach(path => {
                const rawContent = this.postModules[path] || '';
                const contentBody = rawContent.replace(/---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
                const title = path.split('/').pop().replace('.md', '');

                if (title.match(regex) || contentBody.match(regex)) {
                    results.push({
                        path,
                        highlightTitle: title.replace(regex, match => `<span class="search-keyword">${match}</span>`),
                        highlightSummary: this.generateSummary(contentBody, regex)
                    });
                }
            });

            this.searchResults = results;
            this.searchResultVisible = true;
        },

        generateSummary(content, regex) {
            const firstMatchIndex = content.search(regex);
            if (firstMatchIndex === -1) return content.substring(0, 80) + '...';

            const start = Math.max(0, firstMatchIndex - 20);
            const end = Math.min(content.length, firstMatchIndex + 80);
            return '...' + content.substring(start, end).replace(regex, match => `<span class="search-keyword">${match}</span>`) + '...';
        },

        clearSearch() {
            this.searchResults = [];
            this.searchResultVisible = false;
        },

        closeSearchOnOutsideClick(e) {
            const wrap = document.getElementById('search-wrapper');
            if (wrap && !wrap.contains(e.target)) {
                this.searchResultVisible = false;
            }
        },

        goToArticle(path) {
            this.clearSearch();
            const fileName = path.split('/').pop().replace('.md', '');
            if (this.$router) {
                // 🚀 跳转到博客页并携带文章 ID
                this.$router.push({ path: '/blog', query: { id: fileName } });
            }
        }
    }
}
</script>

<style scoped>
/*  🚀 终极赛博网格背景  */
.page-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #0a0c10;
    /* 核心魔法：径向渐变模拟光源，线性渐变模拟网格 */
    background-image:
        radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    background-position: center center;
    overflow: hidden;
    color: white;
    color: #ffffff !important;
}

.content-layer {
    position: relative;
    z-index: 10;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 48px;
    height: 80px;
}

.nav-container {
    font-size: 25px;
}


.main-title {
    font-size: clamp(60px, 10vw, 120px);
    font-weight: 900;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #ffffff;
    /* 🚀 核心新增：如果渐变没出来，先显示白字 */
    background: linear-gradient(135deg, #fff 0%, #00FFFF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    /* 增加标准属性 */
    -webkit-text-fill-color: transparent;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 0;
    display: block;
    z-index: 2;
}

:deep(.nav-link) {
    color: #ffffff !important;
    text-decoration: none;
}

.is-searching .main-title {
    margin-top: -35vh;
    transform: scale(0.7);
    margin-bottom: 20px;
}

.hero-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 10vh;
    transition: all 0.5s ease;
}

.is-searching .search-result-panel {
    height: 55vh;
}

.is-searching .action-group {
    opacity: 0.2;
    pointer-events: none;
    transition: opacity 0.4s;
}

.search-wrap {
    width: 100%;
    max-width: 800px;
    /* 拉长到 800px */
    margin-bottom: 60px;
    position: relative;
}

.action-group {
    display: flex;
    gap: 30px;
}

.btn {
    padding: 18px 56px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    letter-spacing: 1px;
}

.btn-primary {
    background: white;
    color: black;
    border: none;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.4);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #00FFFF;
    color: #00FFFF;
    transform: translateY(-4px);
}

.search-result-panel {
    position: absolute;
    top: calc(100% + 15px);
    left: 0;
    width: 100%;
    height: 55vh;
    z-index: 1000;
    padding: 10px;
    background: rgba(10, 12, 16, 0.92);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 16px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    /* 🚀 增加高度变化的过渡动画 */
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.5s ease,
        opacity 0.3s ease;
}

.search-result-panel.is-empty {
    height: 140px;
    /* 足够显示 Header 和 "暂无匹配内容" 的高度 */
    border-color: rgba(255, 255, 255, 0.1);
    /* 没内容时边框调暗，不抢戏 */
}

/* 优化：没内容时隐藏滚动条区域的内边距 */
.search-result-panel.is-empty .result-scroll-area {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-result {
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    font-size: 15px;
    letter-spacing: 1px;
    /* 可以在这里加个简单的呼吸动画 */
    animation: breathe 2s infinite ease-in-out;
}

@keyframes breathe {

    0%,
    100% {
        opacity: 0.3;
    }

    50% {
        opacity: 0.6;
    }
}

.result-scroll-area {
    /* 🚀 这是最核心的修改：强制占用除了 Header 以外的所有高度 */
    flex: 1;
    overflow-y: scroll !important;
    /* 强制显示滚动轨道，哪怕内容不多 */
    padding: 5px 15px;
    margin-top: 5px;
    /* 阻止滚动事件冒泡到父页面，防止背景跟着晃 */
    overscroll-behavior: contain;
}

/* 🚀 让滚动条“发光”，不仅好看，还能提醒用户这里可以滚 */
.result-scroll-area::-webkit-scrollbar {
    width: 8px;
}

.result-scroll-area::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
}

.result-scroll-area::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #00FFFF, #008B8B);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.result-item {
    padding: 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.03);
}

.result-item:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: #00FFFF;
    transform: scale(1.02);
    /* 悬浮稍微放大，更有点击感 */
}

.result-item h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #fff;
}

.result-item .summary {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
}

:deep(.search-keyword) {
    color: #00FFFF;
    font-weight: bold;
    background: rgba(0, 255, 255, 0.15);
    padding: 0 4px;
    border-radius: 4px;
}

.no-result {
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    padding: 40px 0;
}

/* 渐变动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
<template>
    <div class="page-wrapper" @click="closeSearchOnOutsideClick">
        <main class="content-layer">
            <header class="header">
                <div class="nav-container">
                    <GooeyNav :items="navItems" :particle-count="5" :particle-distances="[122, 10]" />
                </div>
            </header>

            <section class="hero-section" :class="{ 'is-searching': searchResultVisible }">
                <h1 class="main-title">show time</h1>

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
import { NAV_ITEMS } from '../../config/site.js'
export default {
    name: 'Intro',
    components: {
        GooeyNav,
        SearchInput
    },
    data() {
        return {
            //  读取 Markdown 文件用于搜索
            postModules: import.meta.glob('../../content/posts/*.md', {
                query: '?raw',
                import: 'default',
                eager: true
            }),
            navItems: NAV_ITEMS,
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

        //  搜索逻辑
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
                //  跳转到博客页并携带文章 ID
                this.$router.push({ path: '/blog', query: { id: fileName } });
            }
        }
    }
}
</script>

<style scoped>
/*  终极赛博网格 + 动态极光噪点背景  */
.page-wrapper {
    position: relative;
    width: 100%;
    min-height: 100vh;
    /* 确保最小高度占满 */
    background-color: #050608;
    /*  底色调得更深，极光才够亮 */
    overflow: hidden !important;
    /*  强制锁死外层滚动条，根治右侧闪现 */
    color: #ffffff !important;

    /*  第一层：动态极光气团 */
    background-image:
        radial-gradient(at 0% 0%, rgba(0, 255, 255, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(128, 0, 255, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(0, 128, 255, 0.15) 0px, transparent 50%);
    /*  让气团位置缓慢平移 */
    animation: aurora-drift 20s infinite alternate ease-in-out;
}

/*  第二层：赛博网格 */
.page-wrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
    mask-image: radial-gradient(ellipse at center, black, transparent 80%);
    pointer-events: none;
    z-index: 1;
}

/*  第三层：高阶胶片噪点（增加物理质感） */
.page-wrapper::after {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.04; /* 稍微调高一点点，因为内联的噪点比较细腻 */
    /*  核心替换：直接把 SVG 代码转成 data URI 写死在 CSS 里，彻底告别 403！ */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
}

@keyframes aurora-drift {
    0% {
        background-position: 0% 0%, 100% 100%, 50% 50%;
    }

    100% {
        background-position: 20% 10%, 80% 90%, 40% 60%;
    }
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
    font-size: clamp(60px, 10vw, 70px);
    font-weight: 900;
    letter-spacing: 4px;
    color: #ffffff;
    background: linear-gradient(135deg, #fff 0%, #00FFFF 100%);
    -webkit-background-clip: text;
    text-transform: uppercase;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transform: translateY(0) scale(1);
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    margin-top: 0;
    display: block;
    z-index: 2;
}

:deep(.nav-link) {
    color: #ffffff !important;
    text-decoration: none;
}

.is-searching .main-title {
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
    transform: translateY(0);
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-section.is-searching {
    transform: translateY(-20vh);
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
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.5s ease,
        opacity 0.3s ease;
}

.search-result-panel.is-empty {
    height: 140px;
    border-color: rgba(255, 255, 255, 0.1);
}

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
    flex: 1;
    overflow-y: scroll !important;
    padding: 5px 15px;
    margin-top: 5px;
    overscroll-behavior: contain;
}

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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
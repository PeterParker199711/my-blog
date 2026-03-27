<template>
    <div class="blog-view-root">
        <a-layout class="transparent-layout">
            <a-layout-header>
                <BlogHeader />
            </a-layout-header>

            <a-layout-content class="blog-content-body">

                <div class="mobile-action-bar" v-if="isMobile">
                    <a-button type="primary" shape="round" class="glass-btn" @click="leftDrawerVisible = true">
                        <template #icon><icon-menu /></template>
                        文章列表
                    </a-button>
                    <a-button type="primary" shape="round" class="glass-btn" @click="rightDrawerVisible = true">
                        章节目录
                        <template #icon><icon-nav /></template>
                    </a-button>
                </div>

                <div class="blog-grid-system" :class="{ 'is-mobile': isMobile }">
                    <div class="desktop-sider" v-show="!isMobile">
                        <BlogLeftSider :articles="filteredArticles" @select="onArticleChange"
                            @category-change="handleCategoryChange" />
                    </div>

                    <BlogMainContent :title="activeTitle" :content="activeContent" :meta="activeMeta" />

                    <div class="desktop-sider" v-show="!isMobile">
                        <BlogRightSider :tocList="currentToc" />
                    </div>
                </div>
            </a-layout-content>
        </a-layout>


        <a-drawer class="blog-drawer" :visible="leftDrawerVisible" placement="left" :width="300" :footer="false"
            @cancel="leftDrawerVisible = false" unmountOnClose>
            <template #title>探索文章</template>
            <BlogLeftSider :articles="filteredArticles" @select="onMobileArticleChange"
                @category-change="handleCategoryChange" />
        </a-drawer>

        <a-drawer class="blog-drawer" :visible="rightDrawerVisible" placement="right" :width="300" :footer="false"
            @cancel="rightDrawerVisible = false" unmountOnClose>
            <template #title>当前目录</template>
            <BlogRightSider :tocList="currentToc" />
        </a-drawer>
    </div>
</template>

<script>
// 引入 Arco 的图标
import { IconMenu, IconNav } from '@arco-design/web-vue/es/icon';
import BlogHeader from './components/BlogHeader.vue';
import BlogLeftSider from './components/BlogLeftSider.vue';
import BlogMainContent from './components/BlogMainContent.vue';
import BlogRightSider from './components/BlogRightSider.vue';

export default {
    name: 'Blog',
    components: {
        BlogHeader,
        BlogLeftSider,
        BlogMainContent,
        BlogRightSider,
        IconMenu,
        IconNav
    },
    data() {
        return {
            postModules: import.meta.glob('../../content/posts/*.md', {
                query: '?raw',
                import: 'default',
                eager: true
            }),
            activeTitle: '',
            activeContent: '',
            currentToc: [],
            activeMeta: {},
            articles: [],
            currentCategory: '全部',

            // 🚀 移动端适配相关的状态
            isMobile: false,
            leftDrawerVisible: false,
            rightDrawerVisible: false,
        }
    },
    computed: {
        filteredArticles() {
            if (this.currentCategory === '全部') {
                return this.articles;
            }
            return this.articles.filter(article => article.tag === this.currentCategory);
        }
    },
    mounted() {
        this.initData();

        // 🚀 监听屏幕大小变化
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    beforeUnmount() {
        // 组件销毁时移除监听，防止内存泄漏
        window.removeEventListener('resize', this.checkMobile);
    },
    methods: {
        checkMobile() {
            // 当屏幕宽度小于 1200px 时，认为是移动端（或小屏幕平板）
            this.isMobile = window.innerWidth <= 1200;
        },

        // 移动端专属：点击文章后，自动收起左侧抽屉，方便直接阅读
        onMobileArticleChange(article) {
            this.onArticleChange(article);
            this.leftDrawerVisible = false;
        },

        initData() {
            const list = Object.keys(this.postModules).map((path, index) => {
                const rawContent = this.postModules[path] || '';
                const fmMatch = rawContent.match(/---\r?\n([\s\S]*?)\r?\n---/);

                let title = path.split('/').pop().replace('.md', '');
                let date = '未知日期';
                let tag = '未分类';

                if (fmMatch) {
                    const fmString = fmMatch[1];
                    const titleMatch = fmString.match(/title:\s*([^\r\n]*)/);
                    const dateMatch = fmString.match(/date:\s*([^\r\n]*)/);
                    const tagMatch = fmString.match(/tag:\s*([^\r\n]*)/);

                    if (titleMatch) title = titleMatch[1].trim();
                    if (dateMatch) date = dateMatch[1].trim();
                    if (tagMatch) tag = tagMatch[1].trim();
                }

                return { id: index, title, path, date, tag, rawContent };
            });

            this.articles = list;
            if (list.length > 0) this.onArticleChange(list[0]);
        },

        onArticleChange(article) {
            this.activeTitle = article.title;
            this.activeMeta = {
                date: article.date || '未知日期',
                tag: article.tag || '未分类'
            };

            const contentBody = article.rawContent.replace(/---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
            this.activeContent = contentBody;

            const headingRegex = /^(#{2,3})\s+(.*)/gm;
            const toc = [];
            let match;
            while ((match = headingRegex.exec(contentBody)) !== null) {
                const rawText = match[2].trim();
                const safeId = 'heading-' + rawText.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
                toc.push({ id: safeId, text: rawText });
            }
            this.currentToc = toc;
        },

        handleCategoryChange(category) {
            this.currentCategory = category;
            const newList = this.filteredArticles;
            if (newList.length > 0) {
                this.onArticleChange(newList[0]);
            } else {
                this.activeTitle = '';
                this.activeContent = '';
                this.activeMeta = {};
                this.currentToc = [];
            }
        }
    }
}
</script>

<style scoped>
.blog-view-root {
    width: 100%;
    min-height: 100vh;
    background-color: #0a0c10;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 30px 30px;
    background-position: center center;
}

.transparent-layout {
    background: transparent !important;
}

.blog-content-body {
    padding: 0 40px 40px;
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
}

.blog-grid-system {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    gap: 20px;
    width: 100%;
    align-items: start;
}

/* 🚀 移动端顶部悬浮操作栏 */
.mobile-action-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 5px;
}

.glass-btn {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    color: #fff !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.glass-btn:active {
    background: rgba(0, 255, 255, 0.2) !important;
    border-color: #00FFFF !important;
    color: #00FFFF !important;
}

/* 1. 改变抽屉主体底色 */
:deep(.arco-drawer) {
    background-color: #0d0f14 !important;
    /* 稍微比背景深一点的颜色 */
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    border-left: 1px solid rgba(255, 255, 255, 0.05);
}

/* 2. 改变抽屉头部样式 */
:deep(.arco-drawer-header) {
    background-color: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* 3. 改变标题文字颜色 */
:deep(.arco-drawer-title) {
    color: #00FFFF !important;
    /* 用咱们的青色作为标题，更好看 */
    font-size: 16px;
    font-weight: 600;
}

/* 4. 改变关闭按钮颜色 */
:deep(.arco-drawer-close-btn) {
    color: rgba(255, 255, 255, 0.5);
}

:deep(.arco-drawer-close-btn:hover) {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
}

/* 5. 改变抽屉内部内容区（这里最关键，去掉白色背景） */
:deep(.arco-drawer-body) {
    background-color: transparent !important;
    padding: 20px 15px !important;
}

/* 6. 顺便把里面的卡片背景也调透明，让分类标签直接浮在抽屉上 */
:deep(.arco-drawer .glass-card) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
}

/* 移动端适配 */
@media (max-width: 1200px) {
    .blog-content-body {
        padding: 0 20px 20px;
        /* 手机上缩小一点边距 */
    }

    .blog-grid-system {
        grid-template-columns: 1fr;
        /* 变成单列，只有中间的文章区！ */
    }

    .desktop-sider {
        display: none !important;
        /* 彻底隐藏原本因为堆叠而导致变长的侧边栏 */
    }
}
</style>

<style>
/* 针对带 blog-drawer 类的抽屉进行全局暗黑化 */
.blog-drawer .arco-drawer {
    background-color: #0d0f14 !important;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.blog-drawer .arco-drawer-header {
    background-color: rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.blog-drawer .arco-drawer-title {
    color: #00FFFF !important;
}

.blog-drawer .arco-drawer-body {
    background-color: transparent !important;
}

/* 顺便把抽屉里的文字也调亮，防止看不清 */
.blog-drawer .panel-label {
    color: rgba(255, 255, 255, 0.5) !important;
}

/* 按钮和卡片的覆盖 */
.blog-drawer .glass-card {
    background: transparent !important;
    border: none !important;
    backdrop-filter: none !important;
}

/* 针对侧边栏列表文字的优化 */
.blog-drawer .item-title {
    color: #fff !important;
}
</style>
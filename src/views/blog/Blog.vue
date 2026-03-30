<template>
    <BaseLayout>
        <a-layout class="transparent-layout">
            <a-spin :loading="loading" tip="正在同步时空数据..." :size="32" style="width: 100%">
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
                        <div class="desktop-sider" v-if="!isMobile">
                            <!-- <BlogLeftSider :articles="filteredArticles" :active-id="activeArticleId"
                                @select="onArticleChange" @category-change="handleCategoryChange" /> -->
                            <BlogLeftSider :articles="filteredArticles" :categories="categories"
                                :active-id="activeArticleId" @select="onArticleChange"
                                @category-change="handleCategoryChange" />
                        </div>

                        <BlogMainContent :title="activeTitle" :content="activeContent" :meta="activeMeta" />

                        <div class="desktop-sider" v-if="!isMobile">
                            <BlogRightSider :tocList="currentToc" />
                        </div>
                    </div>
                </a-layout-content>
            </a-spin>
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
    </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout/BaseLayout.vue';
import { IconMenu, IconNav } from '@arco-design/web-vue/es/icon';
import BlogLeftSider from './components/BlogLeftSider.vue';
import BlogMainContent from './components/BlogMainContent.vue';
import BlogRightSider from './components/BlogRightSider.vue';
import { getArticleListAPI } from '../../api/article';
import { getArticles, getCategories } from '../../api/blog';
export default {
    name: 'Blog',
    components: {
        BaseLayout,
        BlogLeftSider,
        BlogMainContent,
        BlogRightSider,
        IconMenu,
        IconNav
    },
    data() {
        return {
            loading: false,
            articles: [],
            activeArticleId: null,
            activeTitle: '',
            activeContent: '',
            activeMeta: {},
            currentToc: [],
            categories: [],      // 动态分类列表
            currentCategory: '全部',
            isMobile: false,
            leftDrawerVisible: false,
            rightDrawerVisible: false,
        }
    },
    computed: {
        filteredArticles() {
            if (this.currentCategory === '全部') return this.articles;
            return this.articles.filter(a => a.tag === this.currentCategory);
        }
    },
    async mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.handleResize);
        this.initData();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        async initData() {
            this.loading = true;
            try {
                const [artRes, catRes] = await Promise.all([
                    getArticles(),
                    getCategories()
                ]);

                // 1. 设置分类列表
                this.categories = [{ id: 0, name: '全部' }, ...catRes];

                // 2. 映射文章数据
                this.articles = artRes.map(item => ({
                    id: item.id,
                    title: item.title,
                    rawContent: item.content,
                    date: item.publishTime ? item.publishTime.split('T')[0] : '未知日期',
                    tag: item.categoryName || '未分类'
                }));

                // 3. 默认选中
                if (this.articles.length > 0) {
                    this.onArticleChange(this.articles[0]);
                }
            } catch (error) {
                console.error("初始化数据失败", error);
            } finally {
                this.loading = false;
            }
            if (this.$route.query.id) {
                const target = this.articles.find(a => a.title.includes(this.$route.query.id));
                if (target) this.onArticleChange(target);
            }
        },
        // 分类切换逻辑
        handleCategoryChange(categoryName) {
            this.currentCategory = categoryName;
            // 切换分类后，自动选中该分类下的第一篇文章
            const firstOfCategory = this.filteredArticles[0];
            if (firstOfCategory) {
                this.onArticleChange(firstOfCategory);
            }
        },
        onArticleChange(article) {
            this.activeArticleId = article.id;
            this.activeTitle = article.title;
            this.activeMeta = {
                date: article.date,
                tag: article.tag
            };
            this.activeContent = article.rawContent;

            // 生成目录索引（逻辑保持不变，依然解析 h2/h3）
            const headingRegex = /^(#{2,3})\s+(.*)/gm;
            const toc = [];
            let match;
            while ((match = headingRegex.exec(article.rawContent)) !== null) {
                const rawText = match[2].trim();
                const safeId = 'heading-' + rawText.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
                toc.push({ id: safeId, text: rawText });
            }
            this.currentToc = toc;
        },

        handleCategoryChange(category) {
            this.currentCategory = category;
            if (this.filteredArticles.length > 0) {
                this.onArticleChange(this.filteredArticles[0]);
            }
        },

        // 基础 UI 方法
        checkMobile() {
            this.isMobile = window.innerWidth <= 1200;
        },
        handleResize() {
            if (this.resizeTimer) clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.checkMobile(), 100);
        },
        onMobileArticleChange(article) {
            this.onArticleChange(article);
            this.leftDrawerVisible = false;
        }
    }
}
</script>
<style scoped>
.transparent-layout {
    background: transparent !important;
}

.blog-content-body {
    box-sizing: border-box;
    padding: 0 40px 40px;
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 10;
    overflow-x: hidden;
}

.blog-grid-system {
    display: grid;
    grid-template-columns: 300px 1fr 300px;
    gap: 20px;
    width: 100%;
    align-items: start;
}

.mobile-action-bar {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 24px;
    width: 100%;
    box-sizing: border-box;
}

.glass-btn {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    color: #fff !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    padding: 0 20px;
    height: 38px;
}

.glass-btn:active {
    background: rgba(0, 255, 255, 0.2) !important;
    border-color: #00FFFF !important;
    color: #00FFFF !important;
}

/* 移动端适配 */
@media (max-width: 1200px) {
    .blog-content-body {
        padding: 0 15px 20px;
    }

    .blog-grid-system {
        grid-template-columns: 1fr;
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
    padding: 20px 15px !important;
}

/* 顺便把抽屉里的文字也调亮，防止看不清 */
.blog-drawer .panel-label {
    color: rgba(255, 255, 255, 0.5) !important;
}

/* 按钮和卡片的覆盖 */
.blog-drawer .glass-card,
.blog-drawer .blog-glass-card {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
}

.blog-drawer .item-title {
    color: #fff !important;
}
</style>
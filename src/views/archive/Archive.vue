<template>
    <div class="page-wrapper">
        <main class="content-layer">
            <header class="header">
                <div class="nav-container">
                    <GooeyNav :items="navItems" />
                </div>
            </header>

            <section class="archive-main">
                <h1 class="archive-title">TIMELINE <span>归档</span></h1>

                <div v-for="year in sortedYears" :key="year" class="year-group">
                    <div class="year-label">{{ year }}</div>
                    <div class="post-list">
                        <div v-for="post in archiveData[year]" :key="post.path" class="archive-item"
                            @click="goToPost(post.fileName)">
                            <span class="post-date">{{ post.date.substring(5) }}</span>
                            <span class="post-title">{{ post.title }}</span>
                            <a-tag size="small" class="post-tag">{{ post.tag }}</a-tag>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'

export default {
    components: { GooeyNav },
    data() {
        return {
            postModules: import.meta.glob('../../content/posts/*.md', { as: 'raw', eager: true }),
            navItems: [
                { label: '首页', href: '/' },
                { label: '博客', href: '/blog' },
                { label: '归档', href: '/archive' },
                { label: '关于', href: '/about' }
            ],
            archiveData: {}
        }
    },
    computed: {
        sortedYears() {
            return Object.keys(this.archiveData).sort((a, b) => b - a);
        }
    },
    mounted() {
        this.processArchive();
    },
    methods: {
        processArchive() {
            const groups = {};
            Object.keys(this.postModules).forEach(path => {
                const rawContent = this.postModules[path] || '';
                const title = path.split('/').pop().replace('.md', '');
                const dateMatch = rawContent.match(/date:\s*([^\r\n]*)/);
                const tagMatch = rawContent.match(/tag:\s*([^\r\n]*)/);

                const date = dateMatch ? dateMatch[1].trim() : '2026-01-01';
                const tag = tagMatch ? tagMatch[1].trim() : '未分类';
                const year = date.substring(0, 4);

                if (!groups[year]) groups[year] = [];
                groups[year].push({ title, date, tag, fileName: title });
            });
            // 组内按日期排序
            Object.keys(groups).forEach(y => groups[y].sort((a, b) => b.date.localeCompare(a.date)));
            this.archiveData = groups;
        },
        goToPost(id) {
            this.$router.push({ path: '/blog', query: { id } });
        }
    }
}
</script>

<style scoped>
/* 保持背景一致 */
.page-wrapper {
    /* 同上 */
    min-height: 100vh;
    background-color: #0a0c10;
}

.archive-main {
    max-width: 800px;
    margin: 60px auto;
    padding: 0 20px;
}

.archive-title {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 60px;
}

.archive-title span {
    font-size: 20px;
    color: #00FFFF;
    vertical-align: middle;
    margin-left: 10px;
}

.year-group {
    margin-bottom: 50px;
    position: relative;
    border-left: 2px solid rgba(0, 255, 255, 0.2);
    padding-left: 30px;
}

.year-label {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 20px;
    position: relative;
}

.year-label::before {
    content: '';
    position: absolute;
    left: -37px;
    top: 10px;
    width: 12px;
    height: 12px;
    background: #00FFFF;
    border-radius: 50%;
    box-shadow: 0 0 10px #00FFFF;
}

.archive-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.03);
}

.archive-item:hover {
    background: rgba(0, 255, 255, 0.1);
    transform: translateX(10px);
}

.post-date {
    color: rgba(255, 255, 255, 0.4);
    font-family: monospace;
    width: 60px;
}

.post-title {
    flex: 1;
    font-size: 16px;
    margin: 0 20px;
}

.post-tag {
    background: rgba(0, 255, 255, 0.1);
    color: #00FFFF;
    border: none;
}
</style>
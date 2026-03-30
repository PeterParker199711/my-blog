<template>
    <BaseLayout>
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
    </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout/BaseLayout.vue';
import { NAV_ITEMS } from '../../config/site.js'
export default {
    components: { BaseLayout },
    data() {
        return {
            postModules: import.meta.glob('../../content/posts/*.md', {
                query: '?raw',
                import: 'default',
                eager: true
            }),
            navItems: NAV_ITEMS,
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
.archive-main {
    max-width: 800px;
    margin: 60px auto;
    padding: 0 20px;
}

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

.page-wrapper::after {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.04;
    /* 稍微调高一点点，因为内联的噪点比较细腻 */
    /*  核心替换：直接把 SVG 代码转成 data URI 写死在 CSS 里，彻底告别 403！ */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
}

.content-layer {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
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
<template>
    <div class="sider-left">
        <a-card :bordered="false" class="glass-card category-card">
            <template #title><span class="panel-label">文章分类</span></template>
            <a-space wrap>
                <div v-for="cat in categories" :key="cat" :class="['custom-tag', { active: currentCategory === cat }]"
                    @click="changeCategory(cat)">
                    {{ cat }}
                </div>
            </a-space>
        </a-card>

        <transition-group name="list-fade" tag="div" class="list-container">
            <div v-for="article in articles" :key="article.id" class="article-item-card"
                @click="$emit('select', article)">
                <div class="item-meta">{{ article.date }}</div>
                <div class="item-title">{{ article.title }}</div>
                <div class="hover-indicator"></div>
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
    name: 'BlogLeftSider',
    props: {
        articles: { type: Array, default: () => [] }
    },
    data() {
        return {
            categories: ['全部', '前端开发', '生活随笔', '设计资源'],
            currentCategory: '全部'
        }
    },
    methods: {
        changeCategory(cat) {
            this.currentCategory = cat;
            this.$emit('category-change', cat);
        }
    }
}
</script>

<style scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    margin-bottom: 20px;
}

.panel-label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    letter-spacing: 1px;
}

.custom-tag {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s;
}

.custom-tag.active {
    background: #00FFFF;
    color: #000;
    font-weight: bold;
}

.article-item-card {
    position: relative;
    padding: 16px;
    margin-bottom: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s;
}

.article-item-card:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.08);
}

.item-meta {
    font-size: 12px;
    color: #00FFFF;
    margin-bottom: 4px;
    opacity: 0.8;
}

.item-title {
    font-size: 15px;
    color: #fff;
    line-height: 1.4;
}

/* 🚀 Vue Transition Group 魔法动画 */
/* 🚀 Vue 3 Transition Group 魔法动画 */
.list-fade-enter-active,
.list-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 🚀 补充平滑移动的过渡 */
.list-fade-move {
    transition: transform 0.4s ease;
}

/* 🚀 注意这里：enter 变成了 enter-from */
.list-fade-enter-from,
.list-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.list-fade-leave-active {
    position: absolute;
    width: 100%;
}

.list-container {
    position: relative;
}

</style>
<template>
    <div class="main-reader">
        <a-card :bordered="false" class="reader-glass-panel">
            <div class="reading-progress-bar" :style="{ width: scrollPercent + '%' }"></div>
            <transition name="fade-slide" mode="out-in" @after-enter="initScrollListener">
                <div id="article-scroll-container" ref="scrollContainer" class="scroll-area" :key="title">
                    <div class="reader-header">
                        <a-tag color="arcoblue" bordered class="meta-tag">
                            {{ meta.tag || '未分类' }}
                        </a-tag>
                        <h1 class="reader-title">{{ title || '请选择文章' }}</h1>
                        <div class="reader-meta">
                            <span>📅 {{ meta.date || '未知日期' }}</span>
                            <a-divider direction="vertical" />
                            <span>👤 Peter Parker</span>
                        </div>
                    </div>
                    <a-divider />

                    <div class="markdown-body-wrapper" :class="{ 'is-empty': !content }">
                        <MarkdownViewer :content="content" v-if="content" />
                        <a-empty v-else description="空空如也，点左侧文章试试" />
                    </div>

                    <Comment v-if="content" :title="title" />
                </div>
            </transition>
        </a-card>
    </div>
</template>

<script>
import MarkdownViewer from '../../../components/MarkdownViewer/MarkdownViewer.vue';
import Comment from '../../../components/Comment/Comment.vue';

export default {
    name: 'BlogMainContent',
    components: { MarkdownViewer, Comment },
    props: {
        title: { type: String, default: '' },
        content: { type: String, default: '' },
        meta: { type: Object, default: () => ({}) }
    },
    data() {
        return {
            scrollPercent: 0
        }
    },
    watch: {
        // 🚀 换文章时先重置进度
        title() {
            this.scrollPercent = 0;
        }
    },
    mounted() {
        this.initScrollListener();
    },
    beforeUnmount() {
        this.removeListener();
    },
    methods: {
        removeListener() {
            const container = this.$refs.scrollContainer;
            if (container) {
                container.removeEventListener('scroll', this.updateProgress);
            }
        },
        initScrollListener() {
            // 先尝试移除旧的，防止重复绑定
            this.removeListener();

            this.$nextTick(() => {
                const container = this.$refs.scrollContainer;
                if (container) {
                    container.addEventListener('scroll', this.updateProgress);
                    // 初始化跑一次，防止容器高度变化没触发 scroll
                    this.updateProgress();
                }
            });
        },
        updateProgress() {
            const container = this.$refs.scrollContainer;
            if (!container) return;

            const totalHeight = container.scrollHeight - container.clientHeight;
            const currentScroll = container.scrollTop;

            if (totalHeight <= 0) {
                this.scrollPercent = 0;
            } else {
                this.scrollPercent = (currentScroll / totalHeight) * 100;
            }
        }
    }
}
</script>

<style scoped>
/* 🚀 极强霓虹感 CSS */
.reading-progress-bar {
    /* 🚀 从 fixed 改为 absolute，它就会跟着卡片走了 */
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    background: #00FFFF;
    /* 增强霓虹感，让光晕稍微渗入一点毛玻璃内部 */
    box-shadow:
        0 2px 10px rgba(0, 255, 255, 0.8),
        0 0 5px rgba(0, 255, 255, 0.4);
    z-index: 100;
    /* 🚀 配合卡片的圆角，让进度条开头和结尾不扎眼 */
    border-radius: 24px 24px 0 0;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.main-reader {
    width: 100%;
    min-width: 0;
    height: 100%;
}

/* 🚀 中间阅读区的呼吸切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

/* 🚀 注意这里：enter 变成了 enter-from */
.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(15px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-15px);
}

/* --- 外层毛玻璃：彻底锁死，禁止滚动 --- */
.reader-glass-panel {
    background: rgba(10, 10, 10, 0.7) !important;
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    height: 85vh;
    /* 固定高度 */
    overflow: hidden;
    /* 绝对禁止滚动！浏览器不用重绘了！ */
    display: flex;
    flex-direction: column;
    transform: translateZ(0);
    /* 开启 GPU 硬件加速 */
}

/* Arco Card Body 默认带有 padding，把它清空，让内层接管 */
:deep(.arco-card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 !important;
    /* 💥 清空原本的 padding */
    overflow: hidden;
}

/* --- 内层滚动区：身轻如燕，丝滑滚动 --- */
.scroll-area {
    flex: 1;
    overflow-y: auto;
    /* 核心：让内层滚动 */
    padding: 30px 40px;
    height: 100%;
    scroll-behavior: auto;
    will-change: transform;
}

/* 隐藏滚动条，让页面更极简高级（可选） */
.scroll-area::-webkit-scrollbar {
    width: 6px;
}

.scroll-area::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.scroll-area::-webkit-scrollbar-track {
    background: transparent;
}

.reader-header {
    margin-bottom: 30px;
}

.meta-tag {
    margin-bottom: 16px;
}

.reader-title {
    font-size: 32px;
    color: #fff;
    margin: 10px 0;
    font-weight: 700;
}

.reader-meta {
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
}

.markdown-body-wrapper {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.8;
    font-size: 16px;
    flex: 1;
}

.markdown-body-wrapper.is-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
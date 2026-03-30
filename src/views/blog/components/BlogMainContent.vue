<template>
    <div class="main-reader">
        <a-card :bordered="false" class="reader-glass-panel">
            <div class="reading-progress-bar" :style="{ width: scrollPercent + '%' }"></div>

            <div id="article-scroll-container" ref="scrollContainer" class="scroll-area">
                <transition name="fade-slide" mode="out-in">
                    <div :key="title" class="article-inner-wrapper">
                        <div class="reader-header">
                            <a-tag color="" bordered class="meta-tag">
                                {{ meta.tag || '未分类' }}
                            </a-tag>
                            <h1 class="reader-title">{{ title || '请选择文章' }}</h1>
                            <div class="reader-meta">
                                <span>📅 {{ meta.date || '未知日期' }}</span>
                                <a-divider direction="vertical" />
                                <span>👤 Peter</span>
                            </div>
                        </div>
                        <a-divider />

                        <div class="markdown-body-wrapper" :class="{ 'is-empty': !content }">
                            <MarkdownViewer :content="content" v-if="content" />
                            <a-empty v-else description="空空如也，点左侧文章试试" />
                        </div>
                    </div>
                </transition>
            </div>
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
        title() {
            this.scrollPercent = 0;
            // 切换文章时，滚动条自动回到顶部
            this.$nextTick(() => {
                if (this.$refs.scrollContainer) {
                    this.$refs.scrollContainer.scrollTop = 0;
                }
            });
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
            const container = this.$refs.scrollContainer;
            if (container) {
                container.addEventListener('scroll', this.updateProgress);
            }
        },
        updateProgress() {
            const container = this.$refs.scrollContainer;
            if (!container) return;

            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    const totalHeight = container.scrollHeight - container.clientHeight;
                    const currentScroll = container.scrollTop;

                    if (totalHeight <= 0) {
                        this.scrollPercent = 0;
                    } else {
                        this.scrollPercent = (currentScroll / totalHeight) * 100;
                    }

                    // 计算完成后，解锁
                    this.ticking = false;
                });

                // 上锁
                this.ticking = true;
            }
        }
    }
}
</script>

<style scoped>
/*  CSS 几乎不用大改，保留你原本帅气的极光面板样式即可 */
/* 只添加一个 wrapper 的基础样式 */
.article-inner-wrapper {
    width: 100%;
}

.reading-progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    background: #00FFFF;
    box-shadow: 0 2px 10px rgba(0, 255, 255, 0.8), 0 0 5px rgba(0, 255, 255, 0.4);
    z-index: 100;
    border-radius: 24px 24px 0 0;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.main-reader {
    width: 100%;
    min-width: 0;
    height: 100%;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(15px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-15px);
}

.reader-glass-panel {
    background: rgba(10, 10, 10, 0.7) !important;
    backdrop-filter: blur(1px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: translateZ(0);
}

:deep(.arco-card-body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 !important;
    overflow: hidden;
}

.scroll-area {
    flex: 1;
    overflow-y: auto;
    padding: 30px 40px;
    height: 100%;
    scroll-behavior: smooth;
    /*  加入平滑滚动 */
    will-change: transform;
}

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
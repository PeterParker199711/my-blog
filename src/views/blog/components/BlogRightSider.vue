<template>
    <div class="right-sider-container">
        <a-card :bordered="false" class="blog-glass-card author-card">
            <div class="avatar-wrapper">
                <a-avatar :size="80" class="avatar-glow">
                    <img alt="avatar" src="../../../assets/spider.png" class="avatar-img" />
                </a-avatar>
            </div>
            <div class="author-info">
                <h3 class="name">Peter</h3>
                <p class="bio">苦逼一位</p>
            </div>
            <a-divider />
            <div class="social-links">
                <a-space size="large">
                    <a-link href="#">
                        <icon-wechat :size="22" class="social-icon" @click="goto('wechat')" />
                    </a-link>
                    <a-link href="#">
                        <icon-twitter :size="22" class="social-icon" @click="goto('twitter')" />
                    </a-link>
                </a-space>
            </div>
        </a-card>

        <a-card :bordered="false" class="blog-glass-card toc-card">
            <template #title>
                <div class="blog-card-title">
                    <icon-nav :size="16" />
                    <span style="margin-left: 8px">当前目录</span>
                </div>
            </template>

            <a-anchor :boundary="100" class="custom-anchor" scroll-container="#article-scroll-container">
                <a-anchor-link v-for="item in tocList" :key="item.id" :href="`#${item.id}`" :title="item.text" />
                <div v-if="tocList.length === 0" class="empty-toc">暂无目录</div>
            </a-anchor>
        </a-card>
    </div>
</template>

<script>
import { IconWechat, IconTwitter, IconNav } from '@arco-design/web-vue/es/icon';

export default {
    name: 'BlogRightSider',
    components: { IconWechat, IconTwitter, IconNav },
    props: {
        tocList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        goto(platform) {
            const urls = {
                wechat: 'https://wechat.com/',
                twitter: 'https://twitter.com/'
            };
            window.open(urls[platform], '_blank');
        }
    }
}
</script>

<style scoped>
.avatar-wrapper {
    display: flex;
    justify-content: center;
    margin: 10px 0 20px;
}

.avatar-glow {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    border: 2px solid rgba(0, 255, 255, 0.5);
    background: #1d1e23;
    overflow: hidden;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.author-info {
    text-align: center;
}

.name {
    color: #fff;
    font-size: 20px;
    margin: 0 0 8px 0;
    font-weight: 600;
}

.bio {
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    margin: 0;
}

.social-links {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
}

.social-icon {
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s;
}

.social-icon:hover {
    color: #00FFFF;
    transform: scale(1.2);
    filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
}

.custom-anchor {
    background: transparent;
    padding-left: 5px;
}

/* 1. 提升基础文字亮度与手感 (加上 .toc-card 前缀提升权重) */
.toc-card :deep(.arco-anchor-link-title) {
    color: rgba(255, 255, 255, 0.75) !important;
    font-size: 13.5px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: inline-block;
}

/* 2. 鼠标悬浮特效：文字高亮并微微向右浮动 */
.toc-card :deep(.arco-anchor-link:hover > .arco-anchor-link-title) {
    color: #fff !important;
    transform: translateX(4px);
}

/* 3. 激活状态：极光青色 + 荧光爆燃 + 保持右移 */
.toc-card :deep(.arco-anchor-link-active > .arco-anchor-link-title) {
    color: #00FFFF !important;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.6) !important;
    transform: translateX(4px);
}

/* 4. 改造 Arco 默认的左侧轨道（暗色轨道） */
.toc-card :deep(.arco-anchor-line) {
    background-color: rgba(255, 255, 255, 0.08) !important;
    width: 2px !important;
}

/* 5. 改造 Arco 默认的滑动指示器（霓虹光剑） */
.toc-card :deep(.arco-anchor-line-slider) {
    background-color: #00FFFF !important;
    width: 2px !important;
    border-radius: 2px;
    box-shadow: 0 0 8px #00FFFF, 0 0 15px #00FFFF !important;
    transition: top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.empty-toc {
    color: rgba(255, 255, 255, 0.3);
    text-align: center;
    padding: 20px 0;
    font-size: 13px;
}
</style>
<template>
    <div class="right-sider-container">
        <a-card :bordered="false" class="glass-card author-card">
            <div class="avatar-wrapper">
                <a-avatar :size="80" class="avatar-glow">
                    <img alt="avatar" src="../../../assets/spider.png" class="avatar-img" />
                </a-avatar>
            </div>
            <div class="author-info">
                <h3 class="name">Peter</h3>
                <p class="bio">一位苦逼开发</p>
            </div>
            <a-divider />
            <div class="social-links">
                <a-space size="large">
                    <a-link href="#">
                        <icon-wechat :size="22" class="social-icon" @click="ss" />
                    </a-link>
                    <a-link href="#">
                        <icon-twitter :size="22" class="social-icon" />
                    </a-link>
                </a-space>
            </div>
        </a-card>

        <a-card :bordered="false" class="glass-card toc-card">
            <template #title>
                <div class="toc-header">
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
// 导入图标
import { IconGithub, IconWechat, IconTwitter, IconNav } from '@arco-design/web-vue/es/icon';

export default {
    name: 'BlogRightSider',
    components: { IconGithub, IconWechat, IconTwitter, IconNav },
    props: {
        tocList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        ss() {
            console.log('ss杀杀杀s');

        }
    }
}
</script>

<style scoped>
.glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

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

.toc-header {
    color: #00FFFF;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.custom-anchor {
    background: transparent;
}

:deep(.arco-anchor-link-title) {
    color: rgba(255, 255, 255, 0.5) !important;
    transition: all 0.3s;
}

:deep(.arco-anchor-link-active .arco-anchor-link-title) {
    color: #00FFFF !important;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
}
</style>
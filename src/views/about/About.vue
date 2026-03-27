<template>
    <div class="page-wrapper">
        <main class="content-layer">
            <header class="header">
                <div class="nav-container">
                    <GooeyNav :items="navItems" :particle-count="5" :particle-distances="[122, 30]" />
                </div>
            </header>

            <section class="about-container">
                <a-card :bordered="false" class="glass-card profile-card">
                    <div class="profile-header">
                        <a-avatar :size="100" class="avatar-glow">
                            <img src="../../assets/langlang.png" alt="avatar" />
                        </a-avatar>
                        <h1 class="name">Peter Parker</h1>
                        <p class="tagline">一位在代码与现实间穿梭的苦逼开发</p>
                    </div>

                    <a-divider />

                    <div class="bio-text">
                        <p>👋 你好！我是 Peter。白天在 0 和 1 的世界里修 BUG，晚上在赛博空间的网格里造梦。</p>
                        <p>这个博客是我存放思考、技术方案和生活随笔的“数字后花园”。希望这里的文字能给你带来一点启发，或者至少...让你觉得不孤单。</p>
                    </div>

                    <div class="social-icons">
                        <a-space size="large">
                            <icon-github :size="24" class="icon-hover" />
                            <icon-wechat :size="24" class="icon-hover" />
                            <icon-twitter :size="24" class="icon-hover" />
                        </a-space>
                    </div>
                </a-card>

                <div class="side-info">
                    <a-card :bordered="false" class="glass-card skill-card">
                        <template #title><span class="panel-title">🛠️ 技术栈</span></template>
                        <div class="skill-tags">
                            <a-tag v-for="s in skills" :key="s" color="arcoblue" bordered>{{ s }}</a-tag>
                        </div>
                    </a-card>

                    <a-card :bordered="false" class="glass-card timeline-card">
                        <template #title><span class="panel-title">⏳ 那些年</span></template>
                        <a-timeline>
                            <a-timeline-item label="2026-03" dotColor="#00FFFF">开启赛博博客计划</a-timeline-item>
                            <a-timeline-item label="2025-10">深耕 Vue 3 核心架构</a-timeline-item>
                            <a-timeline-item label="2024-06">在某大厂体验 996 的洗礼</a-timeline-item>
                        </a-timeline>
                    </a-card>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'
import { IconGithub, IconWechat, IconTwitter } from '@arco-design/web-vue/es/icon'

export default {
    components: { GooeyNav, IconGithub, IconWechat, IconTwitter },
    data() {
        return {
            navItems: [
                { label: '首页', href: '/' },
                { label: '博客', href: '/blog' },
                { label: '归档', href: '/archive' },
                { label: '关于', href: '/about' }
            ],
            skills: ['Vue 3', 'Vite', 'Arco Design', 'TypeScript', 'Node.js', 'Cyber Styling']
        }
    }
}
</script>

<style scoped>
/* 这里复用 Intro.vue 的背景样式 */
.page-wrapper {
    min-height: 100vh;
    background-color: #0a0c10;
    background-image:
        radial-gradient(circle at 50% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    color: white;
}

.about-container {
    max-width: 1200px;
    margin: 40px auto;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 30px;
    padding: 0 20px;
}

.glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    color: white;
}

.profile-header {
    text-align: center;
    padding: 20px 0;
}

.avatar-glow {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
    border: 2px solid #00FFFF;
    margin-bottom: 20px;
}

.name {
    font-size: 32px;
    margin: 0;
    color: #fff;
}

.tagline {
    color: #00FFFF;
    opacity: 0.8;
}

.bio-text {
    line-height: 2;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    padding: 0 20px;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.panel-title {
    color: #00FFFF;
    font-weight: 600;
}

.icon-hover:hover {
    color: #00FFFF;
    transform: scale(1.2);
    transition: 0.3s;
    cursor: pointer;
}

@media (max-width: 900px) {
    .about-container {
        grid-template-columns: 1fr;
    }
}
</style>
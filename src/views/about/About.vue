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
                        <a-avatar :size="200" class="avatar-glow">
                            <img src="../../assets/spider.png" alt="avatar" class="custom-avatar-img" />
                        </a-avatar>

                        <div class="glitch-wrapper">
                            <h1 class="name" data-text="PETER PARKER">/peter\ </h1>
                            <p class="tagline">努力奔跑的开发</p>
                        </div>
                    </div>

                    <a-divider />

                    <div class="bio-text">
                        <p>👋 白天在 0 和 1 的世界里修 BUG，晚上在赛博空间的网格里造梦。</p>
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
                        <template #title><span class="panel-title">⏳ 某年</span></template>
                        <a-timeline>
                            <a-timeline-item class="time_line" label="2026-03" dotColor="#00FFFF">博客计划</a-timeline-item>
                            <a-timeline-item class="time_line" label="2025-10">深耕 Vue 3 核心架构</a-timeline-item>
                        </a-timeline>
                    </a-card>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'
import { IconWechat, IconTwitter } from '@arco-design/web-vue/es/icon'
import { NAV_ITEMS } from '../../config/site.js'
export default {
    components: { GooeyNav, IconWechat, IconTwitter },
    data() {
        return {
            navItems: NAV_ITEMS,
            skills: ['Vue 3', 'Vite', 'Arco Design', 'TypeScript', 'Node.js', 'Cyber Styling']
        }
    }
}
</script>

<style scoped>
/* 这里复用 Intro.vue 的背景样式 */
/* 🚀 全站通用的终极极光背景（复制这段，替换掉 Archive 和 About 里的旧背景） */
.page-wrapper {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background-color: #050608;
    overflow-x: hidden;
    color: #ffffff !important;
    background-image:
        radial-gradient(at 0% 0%, rgba(0, 255, 255, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(128, 0, 255, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(0, 128, 255, 0.15) 0px, transparent 50%);
    animation: aurora-drift 20s infinite alternate ease-in-out;
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
    /* 🚀 核心替换：直接把 SVG 代码转成 data URI 写死在 CSS 里，彻底告别 403！ */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
}

@keyframes aurora-drift {
    0% {
        background-position: 0% 0%, 100% 100%, 50% 50%;
    }

    100% {
        background-position: 20% 10%, 80% 90%, 40% 60%;
    }
}

.content-layer {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
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
    margin-top: 20px;
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

.custom-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 🚀 保持比例填满 */
    object-position: center 0%;
}


/* 🚀 整体触发器，当鼠标滑过这一块时触发动画 */
.glitch-wrapper {
    position: relative;
    cursor: default;
}

/* 🚀 基础名字样式 */
.name {
    position: relative;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    margin: 10px 0;
    line-height: 1.2;
}

/* 🚀 基础签名样式 */
.tagline {
    position: relative;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
}

/* 🚀 赛博故障核心 CSS (伪元素魔法) */
.name:before,
.name:after,
.tagline:before,
.tagline:after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    transition: all 0.2s;
    clip-path: rect(0 0 0 0);
    /* 默认隐藏 */
}

/* 🚀 当整体被 hover 时，文字基础层发生微微抖动 */
.glitch-wrapper:hover .name,
.glitch-wrapper:hover .tagline {
    animation: glitch-skew 1s infinite linear alternate-reverse;
}

/* 🚀 当整体被 hover 时，名字出现红蓝错位 Glitch */
.glitch-wrapper:hover .name:after {
    clip-path: rect(0, 100%, 100%, 0);
    /* 显示 */
    color: #00FFFF;
    /* 青色通道 */
    text-shadow: -2px 0 10px #00FFFF;
    animation: glitch-anim 2s infinite linear alternate-reverse;
    z-index: -1;
}

.glitch-wrapper:hover .name:before {
    clip-path: rect(0, 100%, 100%, 0);
    /* 显示 */
    color: #FF00FF;
    /* 紫色通道 */
    text-shadow: 2px 0 10px #FF00FF;
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
    z-index: -2;
}

.glitch-wrapper:hover .tagline:after {
    clip-path: rect(0, 100%, 100%, 0);
    color: #00FFFF;
    animation: glitch-anim 3s infinite linear alternate-reverse;
    opacity: 0.5;
}

.glitch-wrapper:hover .tagline:before {
    clip-path: rect(0, 100%, 100%, 0);
    color: #FF00FF;
    animation: glitch-anim-2 4s infinite linear alternate-reverse;
    opacity: 0.5;
}

/* 1. 水平切片撕裂动画 (青色通道) */
@keyframes glitch-anim {
    0% {
        clip-path: inset(40% 0 61% 0);
        transform: translate(-10px, 4px);
    }

    10% {
        clip-path: inset(92% 0 1% 0);
        transform: translate(10px, -4px);
    }

    20% {
        clip-path: inset(40% 0 61% 0);
        transform: translate(-10px, 4px);
    }

    30% {
        clip-path: inset(92% 0 1% 0);
        transform: translate(10px, -4px);
    }

    40% {
        clip-path: inset(26% 0 29% 0);
        transform: translate(-5px, 6px);
    }

    50% {
        clip-path: inset(54% 0 7% 0);
        transform: translate(5px, -6px);
    }

    60% {
        clip-path: inset(58% 0 13% 0);
        transform: translate(10px, 2px);
    }

    70% {
        clip-path: inset(80% 0 2% 0);
        transform: translate(-10px, -2px);
    }

    80% {
        clip-path: inset(11% 0 78% 0);
        transform: translate(0, 0);
    }

    /* 短暂恢复 */
    90% {
        clip-path: inset(62% 0 28% 0);
        transform: translate(5px, 4px);
    }

    100% {
        clip-path: inset(25% 0 58% 0);
        transform: translate(-5px, -4px);
    }
}

/* 2. 水平切片撕裂动画 (紫色通道) */
@keyframes glitch-anim-2 {
    0% {
        clip-path: inset(25% 0 58% 0);
        transform: translate(10px, -4px);
    }

    10% {
        clip-path: inset(54% 0 7% 0);
        transform: translate(-10px, 4px);
    }

    80% {
        clip-path: inset(11% 0 78% 0);
        transform: translate(0, 0);
    }

    100% {
        clip-path: inset(40% 0 61% 0);
        transform: translate(-10px, 4px);
    }
}

/* 3. 基础抖动动画 */
@keyframes glitch-skew {
    0% {
        transform: skew(0deg);
    }

    10% {
        transform: skew(3deg);
    }

    20% {
        transform: skew(-3deg);
    }

    30% {
        transform: skew(1deg);
    }

    40% {
        transform: skew(-1deg);
    }

    50% {
        transform: skew(0deg);
    }

    100% {
        transform: skew(0deg);
    }
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

/* 🚀 1. 改变右侧正文的颜色（比如“博客计划”） */
.time_line :deep(.arco-timeline-item-content) {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* 🚀 2. 改变左侧时间标签的颜色（比如“2026-03”） */
.time_line :deep(.arco-timeline-item-label) {
    color: rgba(255, 255, 255, 0.5) !important;
    /* 如果你想让时间亮一点，可以换成 #00FFFF */
}

/* 🚀 3. 可选：如果你觉得连接线的颜色太暗，也可以顺手改了 */
.time_line :deep(.arco-timeline-item-line) {
    background-color: rgba(0, 255, 255, 0.2) !important;
}

.large {
    margin-top: 20px;
}

.icon-hover:hover {
    color: #4736db;
    transform: scale(1.2);
    transition: 0.3s;
    cursor: pointer;
}

@media (max-width: 900px) {
    .about-container {
        grid-template-columns: 1fr;
    }
}

.glitch-wrapper {
    position: relative;
    cursor: default;
}
</style>
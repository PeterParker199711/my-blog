<template>
    <BaseLayout>
        <section class="about-container">
            <a-card :bordered="false" class="glass-card profile-card">
                <div class="profile-header">
                    <a-avatar :size="200" class="avatar-glow">
                        <img src="../../assets/spider.png" alt="avatar" class="custom-avatar-img" />
                    </a-avatar>

                    <div class="glitch-wrapper">
                        <h1 class="name" data-text="PETER PARKER">/peter\ </h1>
                        <p class="tagline">With great power comes great responsibility</p>
                    </div>
                </div>

                <a-divider />

                <div class="bio-text">
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
    </BaseLayout>
</template>

<script>
import BaseLayout from '../../components/BaseLayout/BaseLayout.vue';
import { IconWechat, IconTwitter, IconGithub } from '@arco-design/web-vue/es/icon'

export default {
    name: 'About',
    components: { BaseLayout, IconWechat, IconTwitter, IconGithub },
    data() {
        return {
            skills: ['Vue 3', 'Vite', 'Arco Design', 'TypeScript', 'Node.js', 'Cyber Styling']
        }
    }
}
</script>

<style scoped>
/*  那些长达几十行的极光背景、噪点 SVG 已经被彻底删除了，现在由 BaseLayout 接管！ */

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
    object-position: center 0%;
}

.glitch-wrapper {
    position: relative;
    cursor: default;
}

.name {
    position: relative;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 900;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    margin: 10px 0;
    line-height: 1.2;
}

.tagline {
    position: relative;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
}

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
}

.glitch-wrapper:hover .name,
.glitch-wrapper:hover .tagline {
    animation: glitch-skew 1s infinite linear alternate-reverse;
}

.glitch-wrapper:hover .name:after {
    clip-path: rect(0, 100%, 100%, 0);
    color: #00FFFF;
    text-shadow: -2px 0 10px #00FFFF;
    animation: glitch-anim 2s infinite linear alternate-reverse;
    z-index: -1;
}

.glitch-wrapper:hover .name:before {
    clip-path: rect(0, 100%, 100%, 0);
    color: #FF00FF;
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

    90% {
        clip-path: inset(62% 0 28% 0);
        transform: translate(5px, 4px);
    }

    100% {
        clip-path: inset(25% 0 58% 0);
        transform: translate(-5px, -4px);
    }
}

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

.social-icons {
    display: flex;
    justify-content: center;
    padding: 20px 0;
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

.time_line :deep(.arco-timeline-item-content) {
    color: rgba(255, 255, 255, 0.8) !important;
}

.time_line :deep(.arco-timeline-item-label) {
    color: rgba(255, 255, 255, 0.5) !important;
}

.time_line :deep(.arco-timeline-item-line) {
    background-color: rgba(0, 255, 255, 0.2) !important;
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
</style>
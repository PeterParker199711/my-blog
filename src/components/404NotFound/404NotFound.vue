<template>
    <div class="not-found-container">
        <div class="content">
            <FuzzyText :font-size="140" :font-weight="900" color="#00FFFF" :enable-hover="true" :base-intensity="0.15"
                :hover-intensity="0.8" :glitch-mode="true" :click-effect="true" :letter-spacing="10">
                404
            </FuzzyText>

            <h2 class="sub-title">SIGNAL LOST</h2>
            <p class="description">你要寻找的页面已经迷失在数字深渊中。</p>

            <button class="back-btn" @click="goHome">返回安全区</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import FuzzyText from '../FuzzyText/FuzzyText.vue';

const router = useRouter();

const goHome = () => {
    // 🚀 这里建议直接跳回 /blog 或者 /，取决于你的登录状态
    router.push('/');
};
</script>

<style scoped>
.not-found-container {
    /* 🚀 核心修复：确保容器占满全屏 */
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    background-image: url("../../assets/spiderman4.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
}

/* 深色半透明遮罩 */
.not-found-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    /* 稍微深一点，增加深渊感 */
    z-index: 1;
    /* 遮罩层在底层 */
}

.content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    /* 🚀 核心修复：必须加上 position，z-index 才会生效 */
    position: relative;
    z-index: 10;
    /* 确保内容在遮罩层之上 */
    pointer-events: auto;
    /* 确保可以被点击 */
}

.sub-title {
    font-size: 24px;
    letter-spacing: 8px;
    margin-top: 20px;
    margin-bottom: 16px;
    color: #fff;
    opacity: 0.8;
}

.description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 40px;
}

.back-btn {
    padding: 12px 32px;
    background: transparent;
    color: #00FFFF;
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 4px;
    font-size: 16px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    /* 强行取消父级的 pointer-events 影响（如果有的话） */
    pointer-events: all;
}

.back-btn:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: #00FFFF;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
    transform: translateY(-2px);
}
</style>
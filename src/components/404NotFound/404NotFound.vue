<template>
    <div class="not-found-container">
        <div class="content">
            <FuzzyText :font-size="140" :font-weight="900"
            color="#00FFFF" :enable-hover="true" :base-intensity="0.15"
                :hover-intensity="0.8" :glitch-mode="true"
                :click-effect="true" :letter-spacing="10">
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
    router.push('/');
};
</script>

<style scoped>
.not-found-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #050505;
    /* 深色背景 */
    color: white;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
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
}

.back-btn:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: #00FFFF;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}
</style>
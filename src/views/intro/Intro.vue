<template>
    <main class="content-layer">
        <header class="header">
            <div class="nav-container">
                <GooeyNav :items="navItems" :particle-count="5" :particle-distances="[122, 30]" />
            </div>
        </header>

        <section class="hero-section">
            <h1 class="main-title">show time</h1>

            <div class="search-wrap">
                <SearchInput placeholder="搜索组件、文档或代码片段..." @search="onSearch" />
            </div>

            <div class="action-group">
                <button class="btn btn-primary" @click="goToBlog">开始</button>
                <button class="btn btn-secondary">了解更多</button>
            </div>
        </section>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import GooeyNav from '../../components/GooeyNav/GooeyNav.vue'
import SearchInput from '../../components/SearchInput/SearchInput.vue'

const router = useRouter()

const navItems = [
    { label: '首页', href: '/' },
    { label: '文档', href: '/docs' },
    { label: '关于', href: '/about' },
    { label: '我的', href: '/mine' }
]

const onSearch = (val) => {
    console.log('Searching for:', val)
}

const goToBlog = () => {
    // 触发路由跳转，自动触发 App.vue 里的 page-fade 动画
    router.push('/blog')
}
</script>

<style scoped>
.content-layer {
    position: relative;
    z-index: 10;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 48px;
    height: 80px;
}

.hero-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 10vh;
}

.main-title {
    font-weight: 800;
    letter-spacing: -2px;
    margin-bottom: 40px;
    text-transform: uppercase;
}

.search-wrap {
    width: 100%;
    max-width: 580px;
    margin-bottom: 40px;
}

.action-group {
    display: flex;
    gap: 16px;
}

.btn {
    padding: 12px 36px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: white;
    color: black;
    border: none;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
}
</style>
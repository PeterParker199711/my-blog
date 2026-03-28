<template>
    <div class="page-wrapper">
        <header class="header">
            <BlogHeader />
        </header>

        <main class="content-layer">
            <slot></slot>
        </main>
    </div>
</template>

<script>
import BlogHeader from '../../views/blog/components/BlogHeader.vue';

export default {
    name: 'BaseLayout',
    components: {
        BlogHeader
    }
}
</script>

<style scoped>
/* 🚀 把你原本分散在三个文件里的长串背景代码，统一放在这里！ */
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

.header {
    width: 100%;
    /* 可以在这里给 header 加统一的悬浮、毛玻璃等样式 */
}

.content-layer {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    /* 减去 header 的高度 */
}
</style>
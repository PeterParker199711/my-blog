<template>
  <div class="app-container">
    <div class="background-layer">
      <!-- <Aurora :color-stops="['#00FFFF', '#F0E68C', '#FFC0CB']" :amplitude="1.0" :blend="0.5" :speed="0.8"
        class="aurora-bg" /> -->
    </div>

    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Aurora from './components/Aurora/Aurora.vue'
</script>

<style>
/* 全局基础重置 */
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  /* 防止原生滚动条破坏排版 */
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.background-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  /* 防止背景阻挡点击事件 */
}

.aurora-bg {
  opacity: 0.6;
}

/* 🔥 核心：德芙般丝滑的页面转场动画 🔥 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
  /* 新页面从下方微微浮现 */
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  /* 老页面向上方飘逸消失 */
}
</style>
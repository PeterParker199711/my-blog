<template>
  <div class="app-container">
    <router-view v-if="routerReady" v-slot="{ Component, route }">
      <!-- <transition name="page-fade" mode="out-in"> -->
      <component :is="Component" :key="route.path" />
      <!-- </transition> -->
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const routerReady = ref(false);
const router = useRouter();

onMounted(async () => {
  // 等待路由解析完成
  await router.isReady();
  // 🚀 这里现在能正确找到变量并赋值了
  routerReady.value = true;
});
</script>

<style>
/* 引用你的全局样式 */
@import './publicstyle/BlogGlobal.css';

/* 全局基础重置 */
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  /* 纯黑底色，防止路由跳转瞬间闪白 */
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

/* 🔥 核心：德芙般丝滑的页面转场动画样式 🔥 */
.page-fade-enter-active,
.page-fade-leave-active {
  /* 调整为 0.4s 会更清爽一些，0.6s 稍微有点慢 */
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
  /* 新页面从下方微微浮现 */
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
  /* 老页面向上方飘逸消失 */
}
</style>
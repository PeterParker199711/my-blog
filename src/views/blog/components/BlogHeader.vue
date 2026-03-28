<template>
    <div class="blog-header-inner">
        <GooeyNav :items="navItems" :particle-count="5" />
    </div>
</template>

<script>
import GooeyNav from '../../../components/GooeyNav/GooeyNav.vue';
import { NAV_ITEMS } from '../../../config/site.js'
export default {
    name: 'BlogHeader',
    components: { GooeyNav },
    data() {
        return {
            navItems: NAV_ITEMS,
        }
    }
}
</script>

<style scoped>
.blog-header-inner {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 100;
}
/* 将此代码加在 BlogHeader.vue 的 <style scoped> 中 */
@media (max-width: 1200px) {

    /* **方案 A：隐藏 PC 端导航，只留 Logo** */
    /* 假设 BlogHeader 内部是一个 flex 容器 */
    .header-container>*:not(:first-child) {
        display: none !important;
    }

    /* 让 Logo 居中显示 */
    .header-container {
        justify-content: center !important;
    }

    /* **方案 B (更佳)：隐藏导航，引入汉堡菜单** */
    /* 隐藏除 Logo 之外的所有横向导航文字和图标 */
    /* ...
    /* 在移动端下让一个汉堡菜单按钮（Arco Design <icon-menu />）在右侧可见 */
}
</style>
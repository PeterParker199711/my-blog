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
    /* 确保导航在最上层 */
}
</style>
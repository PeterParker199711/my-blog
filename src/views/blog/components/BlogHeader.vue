<template>
    <div class="blog-header-inner">
        <GooeyNav :items="navItems" :particle-count="5" :active-index="1" />
    </div>
</template>
<script>
import { useRouter } from 'vue-router';
import GooeyNav from '../../../components/GooeyNav/GooeyNav.vue';
export default {
    name: 'BlogHeader',
    components: { GooeyNav },
    data() {
        return {
            navItems: [
                { label: '首页', href: '/intro' },
                { label: '博客', href: '/blog' },
                { label: '归档', href: '/archive' },
                { label: '关于', href: '/about' }
            ],
        }
    },
    methods: {
        handleNavClick(index) {
            const item = this.navItems[index];
            if (item && item.href) {
                this.$router.push(item.href);
            }
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
    /* 确保导航在最上层，不被背景遮挡 */
    position: relative;
    z-index: 100;
}
</style>
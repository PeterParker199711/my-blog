<template>
    <BaseLayout>
        <div class="main-layout-container">
            <BlogHeader />
            <router-view v-slot="{ Component, route }">
                <transition name="page-fade" mode="out-in">
                    <component :is="Component" :key="route.path" />
                </transition>
            </router-view>
        </div>
    </BaseLayout>
</template>

<script setup>
import BaseLayout from '../components/BaseLayout/BaseLayout.vue';
import BlogHeader from '../views/blog/components/BlogHeader.vue';
</script>

<style scoped>
.main-layout-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
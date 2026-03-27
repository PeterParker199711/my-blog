<template>
    <div class="search-wrapper">
        <div class="search-container" :class="{ focused: isFocused }">
            <div class="search-icon">
            </div>

            <input type="text" v-model="query" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ placeholder?: string }>();
const emit = defineEmits(['search', 'clear', 'focus']); // 🚀 新增 focus 事件

const query = ref('');
const isFocused = ref(false);
let timer: any = null;

const handleFocus = () => {
    isFocused.value = true;
    // 🚀 当重新聚焦且有内容时，立刻触发搜索，让面板出来
    if (query.value) {
        emit('focus', query.value);
    }
};

const handleBlur = () => {
    isFocused.value = false;
};

watch(query, (newVal) => {
    if (!newVal) {
        emit('clear');
        if (timer) clearTimeout(timer);
        return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        emit('search', newVal);
    }, 200);
});
</script>

<style scoped>
.search-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
}

.search-container {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 48px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-container.focused {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
}

.search-icon {
    color: rgba(255, 255, 255, 0.5);
    margin-right: 12px;
    display: flex;
}

input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.kdb-hint {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    padding: 2px 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.clear-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 14px;
}
</style>
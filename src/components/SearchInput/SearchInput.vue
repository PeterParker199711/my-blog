<template>
    <div class="search-wrapper">
        <div class="search-container" :class="{ focused: isFocused }">
            <div class="search-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>

            <input type="text" v-model="query" :placeholder="placeholder" @focus="isFocused = true"
                @blur="isFocused = false" @keyup.enter="handleSearch" />

            <div class="search-suffix">
                <span v-if="!query" class="kdb-hint">⌘ K</span>
                <button v-else @click="query = ''" class="clear-btn">✕</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ placeholder?: string }>();
const emit = defineEmits(['search']);

const query = ref('');
const isFocused = ref(false);

const handleSearch = () => {
    emit('search', query.value);
};
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
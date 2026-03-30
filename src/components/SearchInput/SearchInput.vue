<template>
    <div class="search-wrapper">
        <div class="search-container" :class="{ focused: isFocused }">
            <div class="search-icon"></div>

            <input type="text" v-model="query" ref="searchInput" :placeholder="placeholder" @focus="handleFocus"
                @blur="handleBlur" />

            <div class="search-suffix">
                <button v-if="query" class="clear-btn" @mousedown.prevent="clearContent" title="清空搜索">
                    ✕
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchInput',
    // 1. 接收父组件传来的属性
    props: {
        placeholder: {
            type: String,
            default: ''
        }
    },
    // 2. 响应式数据存放在 data 中
    data() {
        return {
            query: '',
            isFocused: false,
            timer: null // 用于防抖的计时器
        }
    },
    // 3. 监听 query 的变化实现防抖搜索
    watch: {
        query(newVal) {
            if (!newVal) {
                // 如果为空，告诉父组件清空列表
                this.$emit('clear');
                if (this.timer) clearTimeout(this.timer);
                return;
            }

            // ⚡️ 防抖处理：200ms 后再执行搜索
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$emit('search', newVal);
            }, 200);
        }
    },
    // 4. 所有方法都放在 methods 里
    methods: {
        handleFocus() {
            this.isFocused = true;
            // 当重新聚焦且有内容时，立刻触发 focus 事件，让面板重新弹出来
            if (this.query) {
                this.$emit('focus', this.query);
            }
        },

        handleBlur() {
            // 💡 贴心小细节：稍微延迟失去焦点
            // 防止你还没点到清空按钮，输入框就先 blur 导致面板消失了
            setTimeout(() => {
                this.isFocused = false;
            }, 150);
        },

        clearContent() {
            this.query = '';
            // 强制把光标按回输入框
            this.$nextTick(() => {
                if (this.$refs.searchInput) {
                    this.$refs.searchInput.focus();
                }
            });
        }
    }
}
</script>

<style scoped>
/* 样式部分保持你原本的设计，一点都没变！ */
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


/*  补上缺失的容器样式，让按钮变得好点 */
.search-suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    /* 给按钮留出固定的呼吸空间 */
}

/* 稍微优化一下你的清空按钮样式 */
.clear-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-btn:hover {
    color: #ff4d4f;
    /* 悬浮变成红色警示 */
    transform: rotate(90deg) scale(1.1);
    /* 鼠标放上去有一个帅气的旋转放大 */
}
</style>
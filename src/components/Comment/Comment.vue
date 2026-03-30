<template>
    <div class="comments-wrapper">
        <h3 class="comments-title">
            <span>💬 评论交流</span>
        </h3>

        <div ref="commentRef" class="giscus-container"></div>
    </div>
</template>

<script>
export default {
    name: 'Comment',
    props: {
        // 接收文章标题，用来区分不同的评论区
        title: {
            type: String,
            required: true
        }
    },
    watch: {
        //  核心逻辑：当你在左侧切换文章时，标题会变，我们需要重新加载对应文章的评论
        title() {
            this.loadGiscus();
        }
    },
    mounted() {
        this.loadGiscus();
    },
    methods: {
        // loadGiscus() {
        //     const container = this.$refs.commentRef;
        //     if (!container) return;

        //     // 每次加载前先清空上一个文章的评论
        //     container.innerHTML = '';

        //     // 动态创建并插入 Giscus 脚本
        //     const script = document.createElement('script');
        //     script.src = "https://giscus.app/client.js";

        //     // ⚠️ 下面这两行需要换成你自己的 GitHub 仓库！这里先用一个公共的测试仓库占位
        //     script.setAttribute('data-repo', "laymonage/giscus-test");
        //     script.setAttribute('data-repo-id', "MDEwOlJlcG9zaXRvcnkzNjc1MzkxMjI=");
        //     script.setAttribute('data-category', "General");
        //     script.setAttribute('data-category-id', "DIC_kwDOFekyMs4CQA_C");

        //     // 让评论区和“文章标题”绑定
        //     script.setAttribute('data-mapping', "title");
        //     script.setAttribute('data-strict', "0");
        //     script.setAttribute('data-reactions-enabled', "1"); // 允许点赞表情
        //     script.setAttribute('data-emit-metadata', "0");
        //     script.setAttribute('data-input-position', "bottom");

        //     // 透明暗黑模式
        //     script.setAttribute('data-theme', "transparent_dark");
        //     script.setAttribute('data-lang', "zh-CN");
        //     script.setAttribute('crossorigin', "anonymous");
        //     script.async = true;

        //     container.appendChild(script);
        // }
    }
}
</script>

<style scoped>
.comments-wrapper {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.comments-title {
    color: #00FFFF;
    font-size: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.giscus-container {
    width: 100%;
    min-height: 300px;
}
</style>
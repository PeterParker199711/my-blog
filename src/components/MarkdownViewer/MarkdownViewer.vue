<template>
    <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
/* 引入 hljs 的暗黑系主题，完美契合极光背景 */
import 'highlight.js/styles/atom-one-dark.css'

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

// 配置 Markdown-it 并集成 hljs 代码高亮
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
})

const renderedHtml = computed(() => md.render(props.content))
</script>

<style>
/* 注意：这里不使用 scoped，因为我们要深度修改 v-html 渲染出来的原生 DOM 样式 */
.markdown-body {
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
    line-height: 1.8;
    word-wrap: break-word;
}

/* 标题样式 */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
    color: #ffffff;
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    line-height: 1.3;
}

.markdown-body h2 {
    font-size: 1.5em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    /* 优雅的分割线 */
}

/* 段落与列表 */
.markdown-body p {
    margin-bottom: 1.2em;
}

.markdown-body ul,
.markdown-body ol {
    padding-left: 1.5em;
    margin-bottom: 1.2em;
}

.markdown-body li {
    margin-bottom: 0.3em;
}

/* 引用块 (Blockquote) 设计 */
.markdown-body blockquote {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid #00FFFF;
    /* 呼应极光的青色 */
    border-radius: 0 8px 8px 0;
}

/* 行内代码与代码块 */
.markdown-body code {
    background: rgba(255, 255, 255, 0.1);
    color: #FFC0CB;
    /* 呼应极光的粉色 */
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'Fira Code', Consolas, monospace;
    font-size: 0.9em;
}

.markdown-body pre {
    background: #1e1e1e;
    /* 代码块底色 */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    overflow: auto;
    margin-bottom: 1.5em;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
}

.markdown-body pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: 0.9em;
}

/* 链接 */
.markdown-body a {
    color: #00FFFF;
    text-decoration: none;
    transition: all 0.2s;
}

.markdown-body a:hover {
    text-decoration: underline;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
}
</style>
<template>
    <div class="markdown-body" v-html="parsedHtml" @click="handleDocClick"></div>
</template>

<script>
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default {
    name: 'MarkdownViewer',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    computed: {
        parsedHtml() {
            if (!this.content) return '';

            const renderer = new marked.Renderer();

            // 1. 拦截标题（保持原有逻辑不变）
            renderer.heading = (...args) => {
                let text = '';
                let level = 2;
                if (typeof args[0] === 'object') {
                    text = args[0].text;
                    level = args[0].depth;
                } else {
                    text = args[0];
                    level = args[1];
                }

                const pureText = text.replace(/<[^>]+>/g, '').trim();
                const safeId = 'heading-' + pureText.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');

                return `<h${level} id="${safeId}">${text}</h${level}>`;
            };

            // 2. 🚀 拦截代码块（注入复制按钮和语言标签）
            renderer.code = (...args) => {
                let code = '';
                let language = '';

                if (typeof args[0] === 'object') {
                    code = args[0].text;
                    language = args[0].lang || 'text';
                } else {
                    code = args[0];
                    language = args[1] || 'text';
                }

                const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
                const highlightedCode = hljs.highlight(code, { language: validLanguage }).value;

                // 🚀 核心修改：用一个 div.code-block-wrapper 把代码块包起来，并在顶部加上 Mac 风格的工具栏
                return `
                    <div class="code-block-wrapper">
                        <div class="code-header">
                            <span class="code-lang">${validLanguage}</span>
                            <button class="copy-btn" data-code="">复制</button>
                        </div>
                        <pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>
                    </div>
                `;
            };

            return marked.parse(this.content, { renderer });
        }
    },
    methods: {
        // 🚀 新增：利用事件委托，处理所有动态生成的 HTML 里的点击事件
        async handleDocClick(e) {
            // 如果点击的元素带有 'copy-btn' 类名
            if (e.target.classList.contains('copy-btn')) {
                const btn = e.target;

                // 向上找到包裹这个代码块的父容器
                const wrapper = btn.closest('.code-block-wrapper');
                // 从父容器里找到里面真正的代码内容
                const codeBlock = wrapper.querySelector('code');

                if (codeBlock) {
                    // 获取纯文本代码（innerText 会自动忽略高亮的 span 标签）
                    const codeText = codeBlock.innerText;

                    try {
                        // 调用现代浏览器的剪贴板 API 写入文字
                        await navigator.clipboard.writeText(codeText);

                        // 给按钮一个成功反馈
                        btn.innerText = '已复制!';
                        btn.classList.add('copied');

                        // 2秒后恢复原样
                        setTimeout(() => {
                            btn.innerText = '复制';
                            btn.classList.remove('copied');
                        }, 2000);

                    } catch (err) {
                        console.error('复制失败:', err);
                        btn.innerText = '失败';
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.markdown-body {
    color: rgba(255, 255, 255, 0.85);
    font-size: 16px;
    line-height: 1.8;
    width: 100%;
}

:deep(h1),
:deep(h2),
:deep(h3) {
    color: #fff;
    margin-top: 32px;
    margin-bottom: 16px;
    font-weight: 600;
}

:deep(h2) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
}

:deep(p) {
    margin-bottom: 16px;
}

/* 🚀 代码块外层容器 */
:deep(.code-block-wrapper) {
    position: relative;
    background: #1e1e24;
    /* 深沉的高级灰底色 */
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

/* 🚀 顶部工具栏 (显示语言 + 复制按钮) */
:deep(.code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.code-lang) {
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
}

/* 🚀 复制按钮样式 */
:deep(.copy-btn) {
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

:deep(.copy-btn:hover) {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

/* 复制成功后的状态 */
:deep(.copy-btn.copied) {
    background: #00FFFF;
    color: #000;
    border-color: #00FFFF;
    font-weight: bold;
}

/* 修改原有 pre 的样式，去掉多余的边框和圆角 */
:deep(pre) {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    background: transparent;
    /* 背景色交由外层 wrapper 控制 */
}

:deep(pre code) {
    font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    background: transparent;
    padding: 0;
}

:deep(code:not(.hljs)) {
    background: rgba(0, 255, 255, 0.1);
    color: #00FFFF;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
}

:deep(blockquote) {
    border-left: 4px solid #00FFFF;
    margin: 20px 0;
    padding: 10px 20px;
    color: rgba(255, 255, 255, 0.6);
    background: linear-gradient(90deg, rgba(0, 255, 255, 0.05) 0%, transparent 100%);
    border-radius: 0 8px 8px 0;
}
</style>
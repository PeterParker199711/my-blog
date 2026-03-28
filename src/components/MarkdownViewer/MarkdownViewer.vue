<template>
    <div class="markdown-body" v-html="parsedHtml" @click="handleDocClick"></div>
</template>

<script>
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// 🚀 核心修复：把自定义渲染器抽离到组件外部，只初始化一次！
const renderer = new marked.Renderer();

// 1. 拦截标题，强制生成与右侧目录一致的安全 ID
renderer.heading = (...args) => {
    let text = '';
    let level = 2;
    // 兼容 marked 新旧版本传参
    if (typeof args[0] === 'object') {
        text = args[0].text;
        level = args[0].depth;
    } else {
        text = args[0];
        level = args[1];
    }

    const pureText = text.replace(/<[^>]+>/g, '').trim();
    // 这里的正则必须和 Blog.vue 里生成目录的正则一模一样！
    const safeId = 'heading-' + pureText.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');

    return `<h${level} id="${safeId}">${text}</h${level}>`;
};

// 2. 拦截代码块，注入 Mac 风格工具栏和复制按钮
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

    return `
        <div class="code-block-wrapper">
            <div class="code-header">
                <span class="code-lang">${validLanguage}</span>
                <button class="copy-btn">复制</button>
            </div>
            <pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>
        </div>
    `;
};

// 🚀 核心修复：使用 marked.use() 让自定义渲染器在全局生效
marked.use({ renderer });

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
            // 此时 marked 已经携带了我们的自定义规则，直接解析即可
            return marked.parse(this.content);
        }
    },
    methods: {
        async handleDocClick(e) {
            if (e.target.classList.contains('copy-btn')) {
                const btn = e.target;
                const wrapper = btn.closest('.code-block-wrapper');
                const codeBlock = wrapper.querySelector('code');

                if (codeBlock) {
                    const codeText = codeBlock.innerText;
                    try {
                        await navigator.clipboard.writeText(codeText);
                        btn.innerText = '已复制!';
                        btn.classList.add('copied');
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
/* 这里保留你原本所有的精美 CSS 样式，一行都不用改！ */
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

/* 代码块相关样式 */
:deep(.code-block-wrapper) {
    position: relative;
    background: #1e1e24;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

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

:deep(.copy-btn.copied) {
    background: #00FFFF;
    color: #000;
    border-color: #00FFFF;
    font-weight: bold;
}

:deep(pre) {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    background: transparent;
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
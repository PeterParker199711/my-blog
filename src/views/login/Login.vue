<template>
    <div class="auth-wrapper">
        <div class="auth-container" :class="{ 'is-register': isRegister }">

            <div class="overlay-panel">
                <div class="overlay-inner">
                    <transition name="fade-fast" mode="out-in">
                        <div v-if="!isRegister" key="login-img" class="overlay-content login-style">
                            <img src="../../assets/spiderman2.jpg" alt="login-img" class="cyber-logo" />
                            <h2 class="auth-label">/ peter \</h2>
                            <p class="auth-tag">努力奔跑</p>
                        </div>

                        <div v-else key="register-img" class="overlay-content register-style">
                            <img src="../../assets/spiderman3.jpg" alt="register-img" class="cyber-logo full-cover" />
                        </div>
                    </transition>
                </div>
            </div>

            <div class="form-sliding-card">
                <transition name="fade-fast">
                    <div v-if="!isRegister" class="form-panel login-panel">
                        <div class="form-header">
                            <h1 class="panel-title">L O G I N</h1>
                            <p class="panel-subtitle"></p>
                        </div>
                        <a-form :model="loginForm" @submit="handleLoginSubmit" layout="vertical" class="auth-form">
                            <a-form-item field="username" hide-label>
                                <a-input v-model="loginForm.username" placeholder="请输入超级管理员账号" allow-clear size="large"
                                    class="cyber-input">
                                    <template #prefix><icon-user /></template>
                                </a-input>
                            </a-form-item>
                            <a-form-item field="password" hide-label>
                                <a-input-password v-model="loginForm.password" placeholder="请输入访问密钥" allow-clear
                                    size="large" class="cyber-input">
                                    <template #prefix><icon-lock /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" html-type="submit" long size="large" :loading="loading"
                                    class="cyber-submit-btn">
                                    登 录
                                </a-button>
                            </a-form-item>
                        </a-form>
                        <div class="panel-footer">
                            <span>没有账号?</span>
                            <a-link @click="togglePanel" class="active-link">去注册</a-link>
                        </div>
                    </div>
                </transition>

                <transition name="fade-fast">
                    <div v-if="isRegister" class="form-panel register-panel">
                        <div class="form-header">
                            <h1 class="panel-title">REGISTER</h1>
                            <!-- <p class="panel-subtitle">开启新的造梦旅程...</p> -->
                            <p class="panel-subtitle"></p>
                        </div>
                        <a-form :model="registerForm" @submit="handleRegisterSubmit" layout="vertical"
                            class="auth-form">
                            <a-form-item field="username" hide-label>
                                <a-input v-model="registerForm.username" placeholder="请设置账号ID" allow-clear size="large"
                                    class="cyber-input">
                                    <template #prefix><icon-user /></template>
                                </a-input>
                            </a-form-item>
                            <a-form-item field="password" hide-label>
                                <a-input-password v-model="registerForm.password" placeholder="请设置密钥" allow-clear
                                    size="large" class="cyber-input">
                                    <template #prefix><icon-lock /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item field="confirmPassword" hide-label>
                                <a-input-password v-model="registerForm.confirmPassword" placeholder="请再次确认密钥"
                                    allow-clear size="large" class="cyber-input">
                                    <template #prefix><icon-lock /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" html-type="submit" long size="large" :loading="loading"
                                    class="cyber-submit-btn">
                                    注 册
                                </a-button>
                            </a-form-item>
                        </a-form>
                        <div class="panel-footer">
                            <span>已有账号?</span>
                            <a-link @click="togglePanel" class="active-link">返回登录</a-link>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon';
import { useUserStore } from '../../store/user';
import { Message } from '@arco-design/web-vue';
export default {
    name: 'AuthPage',
    components: { IconUser, IconLock },
    data() {
        return {
            isRegister: false,
            loading: false,
            //  默认塞入假账号密码，省得每次手动输入
            loginForm: { username: 'admin', password: '123456' },
            registerForm: { username: '', password: '', confirmPassword: '' }
        }
    },
    methods: {
        togglePanel() {
            // 切换面板并重置表单
            this.loginForm = { username: '', password: '' };
            this.registerForm = { username: '', password: '', confirmPassword: '' };
            this.isRegister = !this.isRegister;
        },
        // Login.vue 的 handleLoginSubmit 关键部分
        async handleLoginSubmit({ errors }) {
            if (errors) return;
            this.loading = true;
            try {
                const userStore = useUserStore();
                await userStore.doLogin(this.loginForm);
                Message.success('欢迎回来,管理员');
                const redirectUrl = this.$route.query.redirect || '/blog';
                this.$router.push(redirectUrl);
            } catch (error) {
                // 错误已被 request.js 拦截弹窗，这里只需停止 loading
                this.loading = false;
            } finally {
                this.loading = false;
            }
        },
        handleRegisterSubmit({ errors }) {
            if (errors) return;
            if (this.registerForm.password !== this.registerForm.confirmPassword) {
                Message.error('两次密钥输入不一致！');
                return;
            }
            this.loading = true;
            setTimeout(() => {
                Message.success('注册成功，请登录！');
                this.loading = false;
                this.togglePanel();
            }, 1500);
        }
    }
}
</script>

<style scoped>
/*  基础布局与背景 */
.auth-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #050608;
    overflow: hidden;
    background-image: url("../../assets/spiderman4.png");
    background-size: cover;
    background-position: center center;
}

.auth-wrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
}

.auth-wrapper::after {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.04;
    /* background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); */
    pointer-events: none;
    z-index: 2;
}

/* 核心毛玻璃卡片 */
.auth-container {
    position: relative;
    z-index: 10;
    width: 850px;
    height: 520px;
    background: rgba(15, 15, 20, 0.7);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    display: flex;
}

/* =========================================
   ⚡️ 滑动装饰面板 (左侧海报/右侧全屏图)
========================================= */
.overlay-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: transparent;
    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 1;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    background-color: #121318;
    /* 给图片区一个极暗的底色 */
}

/* 切换到注册时：面板滑到右边 */
.auth-container.is-register .overlay-panel {
    transform: translateX(100%);
    border-right: none;
    border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.overlay-inner {
    width: 100%;
    height: 100%;
    position: relative;
}

.overlay-content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

/* 登录时的排版：带边距 */
.login-style {
    padding: 0 0px;
}

/* 注册时的排版：无边距，全覆盖 */
.register-style {
    padding: 0;
}

/* 登录状态的海报图片 (spiderman2) */
.cyber-logo {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 255, 255, 0.15);
}

/* 注册状态的全覆盖图片 (spiderman3) */
.cyber-logo.full-cover {
    max-width: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: none;
}

.auth-label {
    color: #fff;
    font-size: 26px;
    font-weight: 800;
    margin: 0 0 8px 0;
}

.auth-tag {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin: 0;
}

/* =========================================
   ⚡️ 表单滑动卡片
========================================= */
.form-sliding-card {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: rgba(255, 255, 255, 0.01);
    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 2;
}

.auth-container.is-register .form-sliding-card {
    transform: translateX(-100%);
}

.form-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 50px;
    box-sizing: border-box;
}

.form-header {
    margin-bottom: 35px;
    text-align: left;
}

.panel-title {
    text-align: center;
    color: #fff;
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 4px;
    margin: 0 0 10px 0;
}

.panel-subtitle {
    /* color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    margin: 0; */
}

/* 输入框干净化改造 */
:deep(.cyber-input),
:deep(.arco-input-wrapper) {
    background-color: #fff !important;
    border: 1px solid #dcdfe6 !important;
    border-radius: 8px;
    color: #303133 !important;
    transition: all 0.3s ease;
}

:deep(.arco-input-wrapper .arco-input-prefix) {
    color: #c0c4cc;
}

:deep(.arco-input-wrapper:hover),
:deep(.arco-input-wrapper.arco-input-focus) {
    border-color: #00FFFF !important;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important;
}

/* 提交按钮：饱满极光渐变 */
.cyber-submit-btn {
    background: linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%) !important;
    border: none !important;
    border-radius: 8px !important;
    color: #fff !important;
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 2px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
    margin-top: 10px;
}

.cyber-submit-btn:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5) !important;
    transform: translateY(-2px);
}

.panel-footer {
    margin-top: 25px;
    text-align: center;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
}

.active-link {
    color: #00FFFF !important;
    font-weight: bold;
    margin-left: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.active-link:hover {
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
}

/* =========================================
   动画控制
========================================= */
.fade-fast-enter-active,
.fade-fast-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
    opacity: 0;
    transform: scale(0.98);
}
</style>
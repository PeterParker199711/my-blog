import { defineStore } from 'pinia';
import { loginAPI, getUserInfoAPI } from '../api/user';

export const useUserStore = defineStore('user', {
    state: () => ({
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        userInfo: null
    }),
    actions: {
        // 登录流程
        async doLogin(loginForm) {
            const res = await loginAPI(loginForm);
            this.setTokens(res);
            await this.fetchUserInfo(); // 登录成功顺便获取用户信息
            return res;
        },
        // 获取用户信息
        async fetchUserInfo() {
            const info = await getUserInfoAPI();
            this.userInfo = info;
            return info;
        },
        setTokens({ accessToken, refreshToken }) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },
        logout() {
            this.$reset(); // 重置 state
            localStorage.clear();
        }
    }
});
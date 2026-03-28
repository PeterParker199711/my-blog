import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './style.css'
import './publicstyle/BlogGlobal.css'; // 引入全局样式
const app = createApp(App);
app.use(router);
app.use(ArcoVue);
app.mount('#app');
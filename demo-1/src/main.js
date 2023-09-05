import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入上面新建的路由文件
import router from './router/index'

createApp(App).use(router).mount('#app')

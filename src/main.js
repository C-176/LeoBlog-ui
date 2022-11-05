import {createApp} from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from "@/router";
import store from '@/store';
import Swal from "sweetalert2";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/static/css/daemon.css'
import '@/static/css/loading.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import bread from "@/components/pub/bread";

//全局注册一个a函数
const app = createApp(App)
//1.开发 2.生产
let env = 1
let host = ''
if (env === 1) {
    app.config.globalProperties.baseURL = 'http://localhost:8080'
    axios.defaults.baseURL = 'http://localhost:8080'
    host = 'localhost'
} else if (env === 2) {
    host = '49.235.100.240'
    app.config.globalProperties.baseURL = 'http://' + host + '/api'
    axios.defaults.baseURL = 'http://' + host + '/api'
}
app.config.globalProperties.$host = host

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token;
        } else {
            console.log("token不存在")
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);
app.config.globalProperties.$axios = axios
app.config.globalProperties.$sa = (msg, icon) => {
    Swal.fire({
        title: msg,
        // text: 'This is a sweet alert',
        icon: icon,
        confirmButtonText: '确定',

    })
}
app.config.globalProperties.$st = (title, icon) => {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    })

    Toast.fire({
        icon,
        title
    })
}
app.config.globalProperties.$moments = (stamp) => {
    let date = new Date(stamp)
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
}
app.config.globalProperties.p = (pic) => {
    if(pic=='') return pic
    if(pic) {
        return pic.startsWith('http') ? pic : app.config.globalProperties.baseURL + pic
    } else {
        return IMG_SRC
    }
}
// 第一步导入默认图片
import IMG_SRC from '@/source/images/index/1.jpg'

app.config.globalProperties.$imgOnerror = e => {
    let img = e.srcElement
    img.src = IMG_SRC
    img.onerror = null
}

app.use(router).use(store).use(ElementPlus).use(Antd).component('bread', bread)
app.mount('#app')

export default app
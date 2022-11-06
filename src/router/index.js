import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'


const routes = [
    {path: '/', redirect: '/index'},
    {path: '/write/:articleId', component: () => import('@/components/front/write')},
    {path: '/test', component: () => import('@/components/test')},
    {path: '/index', component: () => import('@/components/index')},
    {path: '/user', component: () => import('@/components/pub/user')},
    {path: '/LR', component: () => import('@/components/LR')},
    {
        path: '/home', component: () => import('@/components/home'), redirect: '/home/index',
        children: [
            {path: '/home/index', name: 'index', component: () => import('@/components/front/index_main')},
            {path: '/home/article', component: () => import('@/components/front/articles')},
            {path: '/home/picture', component: () => import('@/components/front/pictures')},
            {path: '/home/about', component: () => import('@/components/front/about')},
            {path: '/home/video', component: () => import('@/components/pub/video')},
            {path: '/back/info', component: () => import('@/components/back/info')},
            {path: '/back/articles', component: () => import('@/components/back/articles')},
            {path: '/back/scripts', component: () => import('@/components/back/scripts')},
            {path: '/back/comments', component: () => import('@/components/back/comments')},
            {path: '/back/pictures', component: () => import('@/components/back/pictures')},
            {path: '/back/security', component: () => import('@/components/back/security')},
            {
                path: '/search/:key', name: 'search', component: () => import('@/components/front/search'), meta: {
                    keepAlive: false,
                    title: '搜索'
                }
            },
            {path: '/article/:articleId', component: () => import('@/components/front/articleShowing')},

        ]

    },
    {path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/components/pub/404')},
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from) {
        // console.log(to, from)
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        }
        return {}
    }
})
router.beforeEach((to, from, next) => {
    //将页面设置为缓存

    to.meta.keepAlive = !to.path.includes('/search');
    to.meta.transition = 'fade'
    if (to.path == '/index') {
        next()
        return
    }
    if (to.path.includes('/LR')) {
        next()
    } else {
        let token = localStorage.getItem("token")
        if (token == null || token.trim() == '' || token == undefined) {
            next('/LR')
        } else {
            next()
        }
    }
    if (to.path.includes('/back')) {
        store.commit('changeShell', true)
    } else {
        store.commit('changeShell', false)
    }
},)

export default router
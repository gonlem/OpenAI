import * as VueRouter from 'vue-router';
import Responses from './pages/Responses.vue';
import Images from './pages/Images.vue';

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: Responses },
        { path: '/responses', component: Responses},
        { path: '/images', component: Images },
    ]
})

export default router;
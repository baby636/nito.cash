import Vue from 'vue'
import VueRouter from 'vue-router'

/* Import MAIN components. */
import Splash from '@/views/Splash'
import Setup from '@/views/Setup'

/* Initialize Vue Router. */
Vue.use(VueRouter)

/**
 * Initialize Routes
 */
const routes = [{
    path: '/',
    component: Splash
}, {
    path: '/setup',
    component: Setup
}]

/* Export Vue Router. */
export default new VueRouter({ routes })

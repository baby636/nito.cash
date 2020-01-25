import Vue from 'vue'
import VueRouter from 'vue-router'

/* Import MAIN components. */
import Dashboard from '@/views/Dashboard'
import Settings from '@/views/Settings'
import Setup from '@/views/Setup'
import Splash from '@/views/Splash'

/* Initialize Vue Router. */
Vue.use(VueRouter)

/**
 * Initialize Routes
 */
const routes = [{
    path: '/',
    component: Splash
}, {
    path: '/dashboard',
    component: Dashboard
}, {
    path: '/settings',
    component: Settings
}, {
    path: '/setup',
    component: Setup
}]

/* Export Vue Router. */
export default new VueRouter({ routes })

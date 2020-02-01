/* Import modules. */
import Vue from 'vue'
import Vuex from 'vuex'

/* Import (local) modules. */
import profile from './modules/profile'
import system from './modules/system'
import wallets from './modules/wallets'

/* Initialize Vuex. */
Vue.use(Vuex)

/* Initialize debugging. */
const debug = process.env.NODE_ENV !== 'production'

/* Export store. */
export default new Vuex.Store({
    modules: {
        profile,
        system,
        wallets
    },
    strict: process.env.NODE_ENV !== 'production'
})

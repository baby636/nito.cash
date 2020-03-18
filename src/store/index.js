/* Import (core) modules. */
import Vue from 'vue'
import Vuex from 'vuex'

/* Import persisted state (for vuex). */
import createPersistedState from 'vuex-persistedstate'

/* Import (local) modules. */
import blockchain from './modules/blockchain'
import profile from './modules/profile'
import system from './modules/system'
import wallets from './modules/wallets'

/* Initialize Vuex. */
Vue.use(Vuex)

/* Export store. */
export default new Vuex.Store({
    modules: {
        blockchain,
        profile,
        system,
        wallets,
    },
    plugins: [createPersistedState()],
    strict: process.env.NODE_ENV !== 'production',
})

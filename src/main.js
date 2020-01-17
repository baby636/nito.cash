/* Import modules. */
import Vue from 'vue'
import App from './App.vue'

/* Set production flag. */
Vue.config.productionTip = false

/* Initialize Vue. */
new Vue({
    render: h => h(App),
}).$mount('#app')

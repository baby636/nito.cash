/* Import modules. */
import Vue from 'vue'

/* Import router. */
import router from './router'

/* Import main application. */
import App from './App.vue'

/* Import svg icons. */
import VueSVGIcon from 'vue-svgicon'

/* Enable svg icons. */
Vue.use(VueSVGIcon)

/* Set production flag. */
Vue.config.productionTip = false

/* Initialize Vue. */
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')

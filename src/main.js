/* Import modules. */
import Vue from 'vue'
import App from './App.vue'

/* Import svg icons. */
import VueSVGIcon from 'vue-svgicon'

/* Enable svg icons. */
Vue.use(VueSVGIcon)

/* Set production flag. */
Vue.config.productionTip = false

/* Initialize Vue. */
new Vue({
    render: h => h(App),
}).$mount('#app')

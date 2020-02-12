/* Import core modules. */
import Vue from 'vue'

/* Import bugsnag modules. */
import bugsnag from '@bugsnag/js'
import bugsnagVue from '@bugsnag/plugin-vue'

/* Initialize bugsnag. */
const bugsnagClient = bugsnag('ef854244cf93e02c094a333e5fee2192')

/* Attach bugsnag to Vue instance. */
bugsnagClient.use(bugsnagVue, Vue)

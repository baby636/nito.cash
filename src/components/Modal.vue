<template>
    <main>
        <Header v-if="!hideHeader" :label="label" :help="help" :secondary="secondary" />
        <div class="hideHeader">
            <slot />
        </div>
    </main>
</template>

<script>
/* Import components. */
import { Header } from '@/components'

export default {
    components: {
        Header,
    },
    props: {
        label: String,
        help: Boolean,
        secondary: Boolean,
        hideHeader: Boolean,
    },
    data: () => {
        return {
            //
        }
    },

}
</script>

<style scoped>
div {
    width: 100%;
    height: calc(100% - 65px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
div.hideHeader {
    height: 100%;
}
</style>

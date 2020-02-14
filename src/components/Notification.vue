<template>
    <main>
        <!-- transition:fly={{ x: 20, duration: 200, opacity: 0, easing: quintOut }} -->
        <p v-if="notification"  @:click="notification = null">
            {{notification}}
        </p>

        <!-- transition:fly={{ x: 20, duration: 200, opacity: 0, easing: quintOut }} -->
        <p
            v-if="error"
            class="error"

            @click="error = null">
            {{error}}
        </p>
    </main>
</template>

<script>
export default {
    computed: {
        error: {
            get: function () {
                return this.$store.state.system.error
            },
            set: function (_val) {
                this.$store.commit('system/setError', _val)
            }
        },
        notification: {
            get: function () {
                return this.$store.state.system.notification
            },
            set: function (_val) {
                this.$store.commit('system/setNotification', _val)
            }
        },
    },
}
</script>

<style scoped>
p {
    cursor: pointer;
    position: absolute;
    top: 65px;
    left: 0px;
    width: 100%;
    height: 55px;
    line-height: 55px;
    text-align: center;
    font-weight: 500;
    color: var(--primary-fg);
    background: var(--success);
    z-index: 10;
}

p.error {
    color: var(--warning-fg);
    background: var(--warning);
}
</style>

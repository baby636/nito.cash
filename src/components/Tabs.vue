<template>
    <nav>
        <button
            v-for="item of tabs"
            v-bind:key="item"
            v-bind:value="tab"
            @click="updateTab(item)"
            :class="{ active: item === activeTab }">
            {{item}}
        </button>
    </nav>
</template>

<script>
export default {
    props: {
        tab: String,
        tabs: Array,
    },
    data: () => {
        return {
            selectedTab: null,
        }
    },
    computed: {
        // NOTE: We use `activeTab` to avoid mutating the parent's (tab) prop.
        activeTab: function () {
            return this.selectedTab ? this.selectedTab : this.tab
        },
    },
    methods: {
        updateTab(_item) {
            /* Update selected tab. */
            this.selectedTab = _item

            /* Emit tab update (to parent). */
            this.$emit('tab-change', _item)
        }
    }

}
</script>

<style scoped>
nav {
    display: flex;
}
nav button {
    position: relative;
    flex: 1;
    background: var(--box-bg);
    font-weight: 600;
    height: 58px;
    line-height: 58px;
    font-size: 13px;
}
nav button:before {
    content: '';
    width: 0%;
    height: 3px;
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 0);
    background: var(--secondary);
    transition: width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}
nav button.active:before {
    width: 70%;
}
</style>

<template>
    <div
        :class="{ disabled: disabled }"
        @click.stop="dropdown = !dropdown">
        <img :src="getFlagName(flag)" alt="" />

        <p>{{value}}</p>

        <nav :class="{ active: dropdown }">
            <button v-for="item of items" @click="onSelect(item.value)" :class="{ active: item.label === value }">
                <img v-if-"item.flag" :src="getFlagName(item.flag)" alt="" />
                {{item.label}}
            </button>
        </nav>
    </div>
</template>

<script>
export default {
    props: {
        value: String,
        flag: String,
        disabled: Boolean,
    },
    data: () => {
        return {
            items: [],
            onSelect: null,
            dropdown: false,
            // selectedTab: '',
        }
    },
    computed: {
        // // NOTE: We use `activeTab` to avoid mutating the parent's (tab) prop.
        // activeTab: function () {
        //     return this.selectedTab ? this.selectedTab : this.tab
        // },
    },
    methods: {
        getFlagName(_country) {
            // return require('@/assets/flags/united-kingdom.svg')

            if (_country === 'American Samoa') {
                return require('@/assets/flags/united-states-of-america.svg')
            }

            if (_country === 'Bouvet Island') {
                return require('@/assets/flags/norway.svg')
            }

            if (_country === 'Andorra') {
                return require('@/assets/flags/european-union.svg')
            }

            // FIXME: We MUST hard-code these countries, until we can
            //        fix the issue below.
            if (_country === 'United Kingdom') {
                return require('@/assets/flags/united-kingdom.svg')
            }

            // NOTE: We (default) to USA, until we can fix the issue below.
            return require('@/assets/flags/united-states-of-america.svg')

            // FIXME: This is NOT working!!
            //        Probably an issue with webpack and `@` aliasing.
            return require(`@/assets/flags/${_country}.svg`
                .replace(' (The)', '')
                .replace(' (The Republic Of)', '')
                .replace(/\s+/g, '-')
                .toLowerCase())
        },

        clickOutside() {
            this.dropdown = false
        },

        // onSelect() {
        //     console.log('ON SELECT WAS CALLED!')
        // },
    },

}
</script>

<style scoped>
div {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 22px;
    height: 52px;
    padding: 0 20px;
    background: var(--input-bg);
    border-radius: 7px;
    border: 1px solid var(--input-border);
    width: 100%;
}
div:after {
    content: '';
    top: 22px;
    right: 20px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 6px 0 6px;
    border-color: var(--input-carret) transparent transparent transparent;
    position: absolute;
}

div.disabled {
    opacity: 0.4;
    pointer-events: none;
}

img {
    position: relative;
    overflow: hidden;
    margin-right: 13px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
}

div p {
    font-weight: 600;
    opacity: 0.5;
    line-height: 13px;
}

nav {
    position: absolute;
    top: 56px;
    left: 0px;
    width: 100%;
    max-height: 260px;
    overflow-y: scroll;
    background: var(--input-bg);
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    opacity: 0;
    transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    z-index: 2;
}

nav.active {
    opacity: 1;
    pointer-events: all;
}

nav button {
    display: flex;
    align-items: center;
    background: var(--input-bg);
    height: 36px;
    padding: 0 20px;
    width: 100%;
    text-align: left;
    font-size: 14px;
}

nav button:hover {
    background: var(--dropdown-hover);
}

nav button.active {
    background: var(--dropdown-active);
}

nav button:first-child {
    border-radius: 3px 3px 0 0;
}
nav button:last-child {
    border-radius: 0 0¬ 3px 3px;
}
</style>

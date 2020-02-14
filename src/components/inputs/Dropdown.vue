<template>
    <div
        :class="{ disabled }"
        @click.stop="dropdown = !dropdown">
        <img :src="getFlagName(activeFlag)" alt="" />

        <p>{{activeCountry}}</p>

        <nav :class="{ active: dropdown }">
            <button
                v-for="item of items"
                v-bind:key="item"
                @click="onSelect(item)"
                :class="{ active: item.label === activeCountry }"
            >
                <img v-if="item.flag" :src="getFlagName(item.flag)" alt="" />
                {{item.label}}
            </button>
        </nav>
    </div>
</template>

<script>
/* Import modules. */
import cc from 'currency-codes'

export default {
    props: {
        disabled: Boolean,
        flag: String,
        items: Array,
        value: String,
    },
    data: () => {
        return {
            dropdown: false,
            selectedCountry: null,
            selectedFlag: null,
        }
    },
    computed: {
        // NOTE: We use `selectedCountry` to avoid mutating the parent's (value) prop.
        activeCountry: function () {
            return this.selectedCountry ? this.selectedCountry : this.value
        },

        // NOTE: We use `selectedFlag` to avoid mutating the parent's (flag) prop.
        activeFlag: function () {
            return this.selectedFlag ? this.selectedFlag : this.flag
        },
    },
    methods: {
        getFlagName(_country) {
            // console.log('GET FLAG NAME', _country)

            if (_country === 'American Samoa' || _country === 'United States') {
                return require('@/assets/flags/united-states-of-america.svg')
            }

            if (_country === 'Bouvet Island') {
                return require('@/assets/flags/norway.svg')
            }

            if (_country === 'Andorra') {
                return require('@/assets/flags/european-union.svg')
            }

            if (_country === 'United Kingdom Of Great Britain And Northern Ireland (The)') {
                return require('@/assets/flags/united-kingdom.svg')
            }

            /* Decode country id. */
            // NOTE: This is "required"; probably due to an issue
            //       with webpack and `@` aliasing.
            const countryId = _country.replace(' (The)', '')
                .replace(' (The Republic Of)', '')
                .replace(/\s+/g, '-')
                .toLowerCase()

            /* Return flag's svg (image). */
            return require(`@/assets/flags/${countryId}.svg`)
            // FIXME: Workaround for Bug in Jest testing
            // return require('@/assets/flags/united-states-of-america.svg')
        },

        clickOutside() {
            this.dropdown = false
        },

        onSelect(_country) {
            // console.log('ON SELECT WAS CALLED!', _country)

            /* Retrieve currency. */
            const currency = cc.code(_country.value).currency

            /* Set (selected) country. */
            this.selectedCountry = currency

            /* Set (selected) flag. */
            this.selectedFlag = _country.flag
        },
    }
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

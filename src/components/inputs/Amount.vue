<template>
    <div>
        <input
            type="number"
            placeholder="Enter your amount"
            v-bind:value="amount"
            v-on:input="$emit('input', $event.target.value)"
        />

        <span v-if="amount">=1337.888</span>
        <!-- <span v-if="amountDisplay">={{ unit !== $marketPrice.currency ? marketValue.fiat : `${marketValue.rounded} ${marketValue.unit}` }}</span> -->

        <button
            @click.prevent.stop="dropdown = !dropdown">
            {{unit}}
        </button>

        <nav :class="{ active: dropdown }">
            <button
                v-for="item of units"
                :class="{ active: unit === item }"
                @click.prevent="unit = item">
                {{item}}
            </button>
        </nav>
    </div>
</template>

<script>
// import { marketPrice } from '~/lib/market'
// import { formatValue } from '~/lib/helpers'

export default {
    props: {
        amount: String,
        unit: String,
    },
    data: () => {
        return {
            dropdown: false,
            userAmount: null,
            marketValue: 0,
            units: ['bits', 'mBCH', 'BCH', 'USD'],
            // units = ['i', 'Ki', 'Mi', 'Gi', 'Ti', marketPrice ? marketPrice.currency : 'USD'],
        }
    },
    computed: {
        //
    },
    methods: {
        //
    },
    created: function () {
        // $: marketValue = formatValue(amount, $marketPrice, unit)
        // $: units = ['i', 'Ki', 'Mi', 'Gi', 'Ti', $marketPrice ? $marketPrice.currency : 'USD']
    },
    beforeDestroy() {
        /* Set flag. */
        // NOTE: This should be triggered on `clickOutside`.
        this.dropdown = false
    }
}
</script>

<style scoped>
div {
    position: relative;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
div > button {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 56px;
    height: 36px;
    border-radius: 5px;
    background: var(--secondary);
    color: var(--secondary-fg);
    text-align: center;
    font-size: 14px;
    line-height: 37px;
    font-weight: 700;
}

@media only screen and (max-height: 600px) {
    div > button {
        top: 4px;
        right: 4px;
    }
}

span {
    position: absolute;
    top: 18px;
    right: 74px;
    font-size: 13px;
    color: var(--light);
    text-align: right;
}

@media only screen and (max-height: 600px) {
    span {
        top: 15px;
        right: 50px;
    }
}

nav {
    position: absolute;
    top: 48px;
    right: 0px;
    background: var(--input-bg);
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    opacity: 0;
    transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

nav.active {
    opacity: 1;
    pointer-events: all;
}

nav button {
    display: block;
    background: var(--input-bg);
    height: 36px;
    width: 68px;
    text-align: center;
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

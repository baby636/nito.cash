<template>
    <main>
        <div>
            <header>
                <button @click="loadSettings">
                    <svgicon icon="cog" width="24" height="24" :fill="false" :original="true"></svgicon>
                </button>
            </header>

            <!-- <balance>
                <h1>
                    {balanceDisplay.rounded}
                    <small>{balanceDisplay.unit}</small>
                </h1>
                <h2>{balanceDisplay.fiat}</h2>

                <div>
                    <Button onClick={() => goto('history')} label="Transaction history" secondary small />
                </div>
            </balance> -->
        </div>

        <!-- <chart>
            <h3>Trading price</h3>
            <Chart />
        </chart> -->

        <Footer>
            <Button @click.native="loadRequest" label="Request" double :disabled="!account" />
            <Button @click.native="loadPay" label="Pay" double />
        </Footer>
    </main>
</template>

<script>
/* Import components. */
import { Button, Footer } from '@/components'

/* Import icons. */
import '@/compiled-icons/cog'
import '@/compiled-icons/fire'

export default {
    components: {
        Button,
        Footer
    },
    data: () => {
        return {
            account: null
        }
    },
    methods: {
        loadPay() {
            this.$router.push('pay')
        },
        loadRequest() {
            this.$router.push('request')
        },
        loadSettings() {
            this.$router.push('settings')
        },

    },
    mounted: function () {
        //
    }
}
</script>

<style scoped>
main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

header {
    text-align: right;
    padding: 18px 17px 16px;
}
header button {
    cursor: pointer;
    background: none;
}

balance {
    display: block;
    text-align: center;
    margin-bottom: 40px;
}
balance h1 {
    position: relative;
    display: inline-block;
    margin: 0 auto 10px;
    font-size: 40px;
    line-height: 40px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
}

balance h1 small,
balance h2 {
    font-size: 13px;
    line-height: 21px;
    font-weight: 500;
}

balance h1 small {
    position: absolute;
    top: 2px;
    left: calc(100% + 3px);
}

balance h2 {
    margin-bottom: 36px;
}

@media only screen and (max-height: 600px) {
    balance h2 {
        margin-bottom: 16px;
    }
}

balance div {
    max-width: 186px;
    margin: 0 auto;
}

h3 {
    color: var(--chart-title);
    font-size: 14px;
    font-weight: 600;
    text-align: center;
}
</style>

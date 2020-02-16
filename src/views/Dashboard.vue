<template>
    <main>
        <Backup
            v-if="backupReminder"
            :showBackup="showBackup"
            v-on:close-backup="showBackup = false"
        />

        <Import
            v-if="showImport"
            v-on:close-import="showImport = false"
        />

        <div>
            <header>
                <button @click="loadSettings">
                    <svgicon icon="cog" width="24" height="24" :fill="false" :original="true"></svgicon>
                </button>
            </header>

            <div class="balance">
                <h1>
                    {{walletBalance.value}}
                    <small>{{walletBalance.unit}}</small>
                </h1>

                <h2>{{walletBalance.fiat}}</h2>

                <div>
                    <Button @click.native="loadHistory" label="Transaction history" secondary small />
                </div>
            </div>
        </div>

        <!-- <chart>
            <h3>Trading price</h3>
            <Chart />
        </chart> -->

        <Footer>
            <Button @click.native="loadRequest" label="Request" double :disabled="!walletMasterSeed" />
            <Button @click.native="loadPay" label="Pay" double />
        </Footer>
    </main>
</template>

<script>
/* Initialize vuex. */
import { mapActions, mapGetters, mapState } from 'vuex'

/* Import components. */
import { Backup, Button, Footer, Import } from '@/components'

/* Import libraries. */
// import formatValue from '@/libs/formatValue'

/* Import icons. */
import '@/compiled-icons/cog'
import '@/compiled-icons/fire'

export default {
    components: {
        Backup,
        Button,
        Footer,
        Import,
    },
    data: () => {
        return {
            backupReminder: false,
            showBackup: false,
            showImport: false,
            walletBalance: null,
        }
    },
    computed: {
        ...mapState({
            /* Blockchain */
            marketPrice: state => state.blockchain.tickers.BCH.USD,

            /* Wallets */
            walletDerivationPath: state => state.wallets.derivationPath,
            walletMasterMnemonic: state => state.wallets.masterMnemonic,
            walletMasterSeed: state => state.wallets.masterSeed,
            walletImportedSeeds: state => state.wallets.importedSeeds,
        }),

        ...mapGetters('wallets', [
            'getAddress',
            'getBalance',
        ]),
    },
    methods: {
        ...mapActions('blockchain', [
            'updateTickers',
        ]),

        /**
         * Load Pay Screen
         */
        loadPay() {
            this.$router.push('pay')
        },

        /**
         * Load Request Screen
         */
        loadRequest() {
            this.$router.push('request')
        },

        /**
         * Load Settings Screen
         */
        loadSettings() {
            this.$router.push('settings')
        },

        /**
         * Load History Screen
         */
        loadHistory() {
            this.$router.push('history')
        },


    },
    created: async function () {
        /* Initialize balance display (values). */
        this.walletBalance = {
            value: 0,
            rounded: 0,
            unit: '',
            fiat: 0
        }

        /* Retrieve current (wallet) balance. */
        // FIXME: We don't need to request address.
        this.walletBalance = await this.getBalance(
            this.getAddress, this.marketPrice)

        /* Update price tickers. */
        this.updateTickers()

    },
    mounted: function () {
        //
    },
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

.balance {
    display: block;
    text-align: center;
    margin-bottom: 40px;
}
.balance h1 {
    position: relative;
    display: inline-block;
    margin: 0 auto 10px;
    font-size: 48px;
    line-height: 40px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
}

.balance h1 small,
.balance h2 {
    line-height: 21px;
    font-weight: 500;
}

.balance h1 small {
    font-size: 16px;
    position: absolute;
    top: 2px;
    left: calc(100% + 3px);
}

.balance h2 {
    font-size: 20px;
    margin-bottom: 36px;
}

@media only screen and (max-height: 600px) {
    .balance h2 {
        margin-bottom: 16px;
    }
}

.balance div {
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

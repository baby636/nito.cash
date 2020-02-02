<template>
    <main>
        <Backup v-if="backupReminder" :showExport="showExport" />

        <div>
            <header>
                <button @click="loadSettings">
                    <svgicon icon="cog" width="24" height="24" :fill="false" :original="true"></svgicon>
                </button>
            </header>

            <div class="balance">
                <h1>
                    {{balanceDisplay.rounded}}
                    <small>{{balanceDisplay.unit}}</small>
                </h1>

                <h2>{{balanceDisplay.fiat}}</h2>

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

/* Import modules. */
import { BITBOX } from 'bitbox-sdk'

/* Import components. */
import { Backup, Button, Footer } from '@/components'

/* Import libraries. */
import formatValue from '@/libs/formatValue'
import marketPrice from '@/libs/marketPrice'

/* Import icons. */
import '@/compiled-icons/cog'
import '@/compiled-icons/fire'

export default {
    components: {
        Backup,
        Button,
        Footer
    },
    data: () => {
        return {
            address: null,
            backupReminder: false,
            balanceDisplay: null,
            bitbox: null,
            showExport: false,
        }
    },
    computed: {
        ...mapState({
            walletMasterMnemonic: state => state.wallets.masterMnemonic,
            walletMasterSeed: state => state.wallets.masterSeed,
            walletSeeds: state => state.wallets.seeds,
        }),
        ...mapGetters('wallets', {
            //
        }),
    },
    methods: {
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

        /**
         * Initialize BITBOX
         */
        initBitbox() {
            console.info('Initializing BITBOX..')

            try {
                /* Initialize BITBOX. */
                this.bitbox = new BITBOX()
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * Get (Wallet) Balance
         */
        async getBalance() {
            try {
                const details = await this.bitbox.Address.details(this.address)
                // const balance = await this.bitbox.Price.current('usd')
                console.log('DETAILS', details)

                /* Set balance (in satoshis). */
                const balance = details.balanceSat

                console.log('MARKET PRICE', marketPrice)

                this.balanceDisplay = formatValue(balance, marketPrice)
                console.log('BALANCE DISPLAY', JSON.stringify(this.balanceDisplay, null, 4))
            } catch(error) {
                console.error(error)
            }
        },

        async getCashAccount() {
            try {
                let cashAccounts = await this.bitbox.CashAccounts.lookup("nyusternie", 55155)
                console.log(cashAccounts)
            } catch (error) {
                console.log(error)
            }
        },
        async getCashAddress() {
            try {
                let reverseLookup = await this.bitbox.CashAccounts.reverseLookup('bitcoincash:qr5cv5xee23wdy8nundht82v6637etlq3u6kzrjknk')
                console.log(reverseLookup)
            } catch (error) {
                console.log(error)
            }
        },
        async getPrice() {
            try {
                let current = await this.bitbox.Price.current('usd');
                console.log('PRICE', current)
            } catch(error) {
                console.error(error)
            }
        },
        async openSocket() {
            let socket = new this.bitbox.Socket({callback: () => {console.log('connected')}, wsURL: 'https://ws.bitcoin.com'})
            socket.listen('blocks', (message) => {
                console.log(message)
            })
        },

    },
    created: function () {
        /* Initialize balance display (values). */
        this.balanceDisplay = {
            rounded: 0,
            unit: '',
            fiat: 0
        }
    },
    mounted: function () {
        /* Initialize BITBOX. */
        this.initBitbox()

        // console.log('this.walletMasterSeed', this.walletMasterSeed)
        // console.log('this.walletMasterMnemonic', this.walletMasterMnemonic)

        /* Initialize seed buffer. */
        const seedBuffer = this.bitbox.Mnemonic.toSeed(this.walletMasterMnemonic)
        // console.log('SEED BUFFER', seedBuffer)

        const hdNode = this.bitbox.HDNode.fromSeed(seedBuffer)
        // console.log('HD NODE', hdNode)

        const address = this.bitbox.HDNode.toCashAddress(hdNode)
        console.log('ADDRESS', address)

        /* Initialize QRCode link. */
        if (address) {
            this.address = address
        }

        this.getBalance()

        // this.getCashAccount()
        // this.getCashAddress()
        // this.getPrice()
        // this.openSocket()

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
    font-size: 40px;
    line-height: 40px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
}

.balance h1 small,
.balance h2 {
    font-size: 13px;
    line-height: 21px;
    font-weight: 500;
}

.balance h1 small {
    position: absolute;
    top: 2px;
    left: calc(100% + 3px);
}

.balance h2 {
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

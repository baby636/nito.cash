<template>
    <main>
        <!-- <svgicon icon="carnival" width="172" height="172" :fill="false" :original="true"></svgicon> -->

        <svgicon icon="rocketman" width="256" height="256" :fill="false" :original="true"></svgicon>

        <Footer tooltip>
            <article>
                <svgicon icon="alarm" width="54" height="54" :fill="false" :original="true"></svgicon>

                <div>
                    <h6>!!! Warning !!! Please read !!!</h6>

                    <p>
                        Nito.cash is a low-security wallet built for the <strong>CONVENIENCE</strong> and <strong>EDUCATION</strong> of newcomers to the Wonderful World of Crypto.
                    </p>

                    <p>
                        We highly recommend that you <strong>ONLY</strong> send &amp; receive small amounts of crypto(currency).
                    </p>
                </div>
            </article>

            <Button @click.native="createWallet" label="Create a NEW wallet" />
        </Footer>
    </main>
</template>

<script>
/* Initialize vuex. */
import { mapActions, mapGetters, mapState } from 'vuex'

/* Import modules. */
import { BITBOX } from 'bitbox-sdk'

/* Import components. */
import { Button, Footer } from '@/components'

/* Import icons. */
import '@/compiled-icons/alarm'

export default {
    components: {
        Button,
        Footer,
    },
    computed: {
        ...mapState({
            walletSeed: state => state.wallets.seed,
        }),
        ...mapGetters('wallets', {
            // walletSeed: 'getSeed',
        }),
    },
    data: () => {
        return {
            bitbox: null,
        }
    },
    methods: {
        ...mapActions('wallets', [
            'setSeed'
        ]),
        initBitbox() {
            console.log('Initializing BITBOX..')
            this.bitbox = new BITBOX()

            /* Initialize entropy. */
            let entropy = null

            /* Validate seed. */
            if (this.walletSeed) {
                /* Generate entropy from seed. */
                entropy = this.bitbox.Crypto.sha256(this.walletSeed)
            } else {
                /* Generate entropy from random bytes. */
                entropy = this.bitbox.Crypto.randomBytes(32)
            }
            console.log('ENTROPY', entropy)

            // const mnemonic = this.bitbox.Mnemonic.fromEntropy(entropy)
            // const mnemonic = this.bitbox.Mnemonic.fromEntropy(entropy.toString('hex'), this.bitbox.Mnemonic.wordLists().japanese)
            const mnemonic = this.bitbox.Mnemonic.fromEntropy(entropy.toString('hex'), this.bitbox.Mnemonic.wordLists().english)
            console.log('MNEMONIC', mnemonic)

            // const isValid = this.bitbox.Mnemonic.validate('bi', this.bitbox.Mnemonic.wordLists().english)
            // console.log('IS VALID', isValid)
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
        async createWallet() {
            try {
                console.log('SET THAT SEED!')
                // const secret = generateSeed()
                // await API.setSecret({ secret })
                // seed.set(secret)

                // this.$router.push('dashboard')
                // alert('Developer Preview is coming soon...')

                // this.$store.dispatch('wallets/create', this.walletSeed)
                // console.log('Current seed phrase is (2)', this.walletSeed)
                this.setSeed(null) // FOR DEVELOPMENT PURPOSES ONLY
            } catch (err) {
                console.error(err)
            }
        },

    },
    mounted: function () {
        console.log('Starting wallet setup..')

        console.log('Current seed phrase is (1)', this.walletSeed)

        /* Parse the query string for shortcut. */
        if (window.location && window.location.search) {
            /* Set param (remove &). */
            const param = window.location.search.substr(1)

            /* Handle shortcuts. */
            if (param.length === 36) {
                /* Set wallet (private key) seed. */
                // this.walletSeed = param
                this.setSeed(param)

                console.log('User has a wallet seed', this.walletSeed)
            }
        }

        /* Initialize BITBOX. */
        this.initBitbox()

        this.getCashAccount()
        this.getCashAddress()
        this.getPrice()
        // this.openSocket()

    }
}
</script>

<style scoped>
main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 60px 0 0;
    height: 100%;
}

@media only screen and (max-height: 600px) {
    main {
        padding-top: 40px;
    }
}

article {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}
article div {
    padding-left: 24px;
}

p {
    font-size: 12px;
    line-height: 18px;
    margin-top: 10px;
}

p strong {
    font-weight: 600;
}
</style>

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

/* Import components. */
import { Button, Footer } from '@/components'

/* Import icons. */
import '@/compiled-icons/alarm'

export default {
    components: {
        Button,
        Footer,
    },
    data: () => {
        return {
            bitbox: null,
        }
    },
    computed: {
        ...mapState({
            walletMasterMnemonic: state => state.wallets.masterMnemonic,
            walletMasterSeed: state => state.wallets.masterSeed,
            walletSeeds: state => state.wallets.seeds,
        }),
        ...mapGetters('wallets', {
            // walletSeed: 'getSeed',
        }),
    },
    methods: {
        ...mapActions('wallets', [
            'addNewSeed',
            'setMasterMnemonic',
            'setMasterSeed',
        ]),

        /**
         * Initialize BITBOX
         */
        initBitbox() {
            console.info('Initializing BITBOX..')

            try {
                /* Initialize BITBOX. */
                this.bitbox = new window.BITBOX()
            } catch (err) {
                console.error(err)
            }
        },

        async createWallet() {
            console.info('Creating a NEW wallet..')

            try {
                /* Initialize walletMasterSeed. */
                let walletMasterSeed = null

                /* Generate walletMasterSeed from random bytes. */
                // TODO: !!! WARNING !!! WARNING !!! WARNING !!!
                //       We MUST properly evaluate ANY and ALL weaknesses with
                //       using randomBytes via a ("mobile") web browser.
                walletMasterSeed = this.bitbox.Crypto.randomBytes(32)

                console.info('Generated a NEW Master Wallet Seed (from randomBytes)',
                    walletMasterSeed)

                /* Set new master (private) key to wallet.. */
                this.setMasterSeed(walletMasterSeed)

                /**
                 * Create mnemonic wordlist using BIP-39.
                 * (https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
                 *
                 * Available languages are:
                 *   01. English
                 *   02. Japanese
                 *   03. Korean
                 *   04. Spanish
                 *   05. Chinese (Simplified)
                 *   06. Chinese (Traditional)
                 *   07. French
                 *   08. Italian
                 *   09. Czech
                 */
                const language = this.bitbox.Mnemonic.wordLists().english

                /* Initialize mnemonic. */
                const mnemonic = this.bitbox.Mnemonic
                    .fromEntropy(walletMasterSeed.toString('hex'), language)

                // TODO: Save partial key to Nito cloud.

                console.log('MNEMONIC', mnemonic)

                /* Set new master (private) key to wallet.. */
                this.setMasterMnemonic(mnemonic)

                /* Redirect to dashboard. */
                this.$router.push('dashboard')
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * Initialize Sponsored Wallet
         *
         * These wallets are received by attaching a UUID to the wallet URL.
         *
         * eg. https://nito.cash?47a49dfe-2fe4-4343-b81e-947580f243f0
         *     will generate a new seed `47a49dfe-2fe4-4343-b81e-947580f243f0`
         */
        initSponsorWallet() {
            /* Parse the query string for shortcut. */
            if (window.location && window.location.search) {
                /* Set param (remove &). */
                const param = window.location.search.substr(1)

                /* Handle uuid wallet seeds. */
                if (param.length === 36) {
                    /* Add sponsor wallet (private key) seed. */
                    this.addNewSeed(param)

                    /* Sponsorship DOES exist. */
                    // NOTE: We must notify the user.
                    return true
                }
            }

            /* Sponsorship DOES NOT exists. */
            return false
        },

    },
    created: function () {
        /* Initialize sponsored wallet. */
        this.initSponsorWallet()

        /* Validate wallet (master seed) exists. */
        if (this.walletMasterSeed) {
            /* Redirect to dashboard. */
            return this.$router.push('dashboard')
        }

        /* Initialize BITBOX. */
        this.initBitbox()
    },
    mounted: function () {
        //
    },
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

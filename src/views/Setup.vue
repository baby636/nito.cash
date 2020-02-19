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

            <Button @click.native="create" label="Create a NEW wallet" />
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
            walletImportedSeeds: state => state.wallets.importedSeeds,
            walletMasterMnemonic: state => state.wallets.masterMnemonic,
            walletMasterSeed: state => state.wallets.masterSeed,
        }),
        ...mapGetters('wallets', {
            // walletSeed: 'getSeed',
        }),
    },
    methods: {
        ...mapActions('wallets', [
            'addImportedSeed',
            'createNewWallet',
            'setMasterMnemonic',
            'setMasterSeed',
        ]),

        async create() {
            /* Create new wallet. */
            this.createNewWallet()

            /* Continue to Dashboard. */
            setTimeout(() => {
                /* Redirect to dashboard. */
                this.$router.push('dashboard')
            }, 1000)
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
                    this.addImportedSeed(param)

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

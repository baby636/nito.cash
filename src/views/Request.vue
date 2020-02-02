<template>
    <Modal label="Request a payment" :help="true">
        <main>
            <QR :value="address" />

        </main>

        <small class="small">
            {{address}}
        </small>

        <Footer>
            <Button @click.native="copyAddress" label="Copy shareable link" />
        </Footer>
    </Modal>
</template>

<script>
/* Initialize vuex. */
import { mapActions, mapGetters, mapState } from 'vuex'

/* Import components. */
import { Amount, Animation, Button, Footer, Modal, QR } from '@/components'

/* Import modules. */
import { BITBOX } from 'bitbox-sdk'

// import { address, receiver, setAddress } from '~/lib/account'
// import { marketPrice } from '~/lib/market'
// import { getIotas, goto, createLink, getTimeUnits, setClipboard } from '~/lib/helpers'

export default {
    components: {
        Amount,
        Animation,
        Button,
        Footer,
        Modal,
        QR,
    },
    data: () => {
        return {
            bitbox: null,

            address: null,
            amount: null,
            loading: false,
            receiver: null,
            reference: '',
            timer: null,
            time: 0,
            unit: 'bits',
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
        ...mapActions('system', [
            'setError',
            'setNotification',
        ]),

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

        async generateRequest() {
            if (!this.amount) {
                return this.setError('Please enter your requested amount')
            }

            /* Set loading flag. */
            this.loading = true

            try {
                // FIXME: What can we do here?
                // await setAddress(getIotas(amount, unit, $marketPrice), reference)
            } catch (_err) {
                /* Set loading flag. */
                this.loading = false

                this.setError((_err && _err.message) || _err || 'Error generating address')
            }
        },

        copyAddress() {
            console.log('COPY ADDRESS')
            // setClipboard(link)
            this.setNotification('Link copied to clipboard')
        },
    },
    created: function () {
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
    },
    mounted: function () {
        //
    },
}
</script>

<style scoped>
main {
    flex: 1;
    padding: 40px 20px 0;
}

p {
    text-align: center;
    margin-bottom: 20px;
}

small {
    color: rgba(220, 30, 30);
    text-align: center;
    margin-top: 20px;
}
</style>

<template>
    <Modal label="Request a payment" :help="true">
        <main>
            <QR :value="address" />
        </main>

        <div class="abbr">
            {{displayAddress}}
        </div>

        <div class="address">
            {{address}}
        </div>

        <Footer>
            <Button @click.native="copyAddress" label="Copy shareable link" />
        </Footer>
    </Modal>
</template>

<script>
/* Initialize vuex. */
import { mapActions, mapGetters, mapState } from 'vuex'

/* Import components. */
import { Button, Footer, Modal, QR } from '@/components'

export default {
    components: {
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

        displayAddress() {
            /* Set abbreviation length. */
            const lenAbbr = 24

            /* Set (un-formatted) address. */
            let formatted = this.address

            /* Handle `bitcoincash` prefix. */
            if (formatted.indexOf(':') !== -1) {
                // formatted = formatted.split(':')[0] + '\n' + formatted.split(':')[1]
                formatted = formatted.split(':')[1]
            }

            /* Shorten address using `...` in-between. */
            formatted = formatted.slice(0, lenAbbr / 4) +
                ' • ' +
                formatted.slice(lenAbbr / 4, lenAbbr / 2) +
                ' . . . ' +
                formatted.slice(-lenAbbr / 2, -lenAbbr / 4) +
                ' • ' +
                formatted.slice(-lenAbbr / 4)

            /* Return (formatted) address. */
            return formatted
        },
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
                this.bitbox = new window.BITBOX()
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

        /**
         * Set Clipboard
         */
        setClipboard(_input) {
            // console.log('SET CLIPBOARD')

            try {
                const textArea = document.createElement('textarea')
                textArea.value = _input
                document.body.appendChild(textArea)

                if (navigator.userAgent.match(/ipad|iphone/i)) {
                    const range = document.createRange()
                    range.selectNodeContents(textArea)

                    const selection = window.getSelection()
                    selection.removeAllRanges()
                    selection.addRange(range)

                    textArea.setSelectionRange(0, 999999)
                } else {
                    textArea.select()
                }

                document.execCommand('copy')
                document.body.removeChild(textArea)

                return true
            } catch (err) {
                console.error(err)

                return false
            }
        },

        /**
         * Copy Address
         */
        copyAddress() {
            // console.log('COPY ADDRESS', this.address)

            /* Set clipboard (with current address). */
            this.setClipboard(this.address)

            /* Display notification. */
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

        /* Initialize child node. */
        const childNode = hdNode.derivePath("m/44'/145'/0'/0/0")

        const address = this.bitbox.HDNode.toCashAddress(childNode)
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

div .abbr {
    font-size: 20px;
    font-weight: 600;
    color: var(--trinary);

    text-align: center;
    margin-top: 48px;
}

div .address {
    font-size: 11px;
    font-weight: 600;
    color: var(--secondary);

    text-align: center;
    margin-top: 16px;
}
</style>

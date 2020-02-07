<template>
    <Modal label="Send a payment" :hideHeader="sendState !== 'idle'">
        <div v-if="sendState === 'sending'">
            <main class="center">
                <Spinner />

                <p>
                    Your payment is being processed, please wait...
                </p>
            </main>
        </div>

        <div v-else-if="sendState === 'done'">
            <main class="center">
                <div style="height: 200px; margin-bottom: 30px;">
                    <Animation type="pay-ok" />
                </div>

                <p>
                    Your payment is complete
                </p>
            </main>

            <Footer>
                <Button @click.native="resetSend" label="OK" />
            </Footer>
        </div>

        <div v-else>
            <div class="balance">
                Current balance: {{currentBalance.rounded}} {{currentBalance.unit}}
            </div>

            <div v-if="cameraError || address">
                <main>
                    <div />

                    <div class="animation">
                        <Animation type="pay" />
                    </div>

                    <Address :address="address" />

                    <form>
                        <label>Amount</label>
                        <Amount :amount="amount" :unit="unit" />

                        <label>Transaction note</label>
                        <input placeholder="Optional reference" type="text" :value="reference" />
                    </form>

                    <div class="scanner" :class="{enabled: scanner}">
                        <div class="video-container">
                            <video id="video-display" autoplay playsinline />
                        </div>

                        <svg width="204" height="204" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M167 10V0h26.976c5.523 0 10 4.477 10 10v27h-10V10H167zM36.976 10H10v27H0V10C0 4.477 4.477 0 10
                                0h26.976v10zM167 194h26.976v-27h10v27c0 5.523-4.477 10-10 10H167v-10zm-130.024 0v10H10c-5.523
                                0-10-4.477-10-10v-27h10v27h26.976z" />
                        </svg>
                    </div>
                </main>

                <Footer>
                    <Button @click.native="onSend" label="Send" />
                </Footer>
            </div>

            <div v-else>
                <div class="scanner" :class="{enabled: scanner}">
                    <div class="video-container">
                        <video id="video-display" autoplay playsinline />
                    </div>

                    <svg width="204" height="204" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M167 10V0h26.976c5.523 0 10 4.477 10 10v27h-10V10H167zM36.976 10H10v27H0V10C0 4.477 4.477 0 10
                            0h26.976v10zM167 194h26.976v-27h10v27c0 5.523-4.477 10-10 10H167v-10zm-130.024 0v10H10c-5.523
                            0-10-4.477-10-10v-27h10v27h26.976z" />
                    </svg>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
/* Initialize vuex. */
import { mapActions, mapGetters, mapState } from 'vuex'

/* Import components. */
import { Address, Amount, Animation, Button, Footer, Modal } from '@/components'
// import { Berny, Button, Footer, Header, Spinner, View } from '~/components'

/* Import QR Code scanner, with JS worker path. */
import QrScanner from 'qr-scanner'
QrScanner.WORKER_PATH = './js/qr-scanner-worker.min.js'

// import { formatValue, getDomain, goto, parseLink, getIotas, getPlatform } from '~/lib/helpers'
// import { account, balance, history, sendState } from '~/lib/account'

export default {
    components: {
        Address,
        Amount,
        Animation,
        Button,
        Footer,
        Modal,
    },
    data: () => {
        return {
            address: null,
            currentBalance: 0,

            amount: null,
            reference: '',
            unit: 'Satoshis',

            video: null,
            scanner: null,
            camera: null,
            cameraError: false,

            paymentLink: '',

            sendState: null,
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

        async onSend() {
            console.log('ON SEND')

            if (!this.value) {
                return this.setError('Cannot send payment without amount')
            }

            try {
                /* Initialize transaction builder. */
                const transactionBuilder = new bitbox.TransactionBuilder('mainnet')

                // if (value > $balance) {
                //     return error.set('Insufficient funds')
                // }
                // 
                // this.sendState = 'sending'
                //
                // const data = {
                //     address: cda.address,
                //     timeoutAt: cda.timeoutAt,
                //     value
                // }
                //
                // if (cda.expectedAmount) {
                //     data['expectedAmount'] = cda.expectedAmount
                // }
                //
                // await $account.sendToCDA(data)
                //
                // history.update(($history) =>
                //     $history.concat([{ address: cda.address.substr(0, 81), reference, receiver: cda.receiver, incoming: false }])
                // )
            } catch (err) {
                this.setError(err.message ? err.message.split(';')[0] : err)

                this.sendState = 'idle'
            }
        },

        onPaste(e) {
            console.log('ON PASTE')
            // const data = (event.clipboardData || window.clipboardData).getData('text')
            // const result = parseLink(data)
            // if (result) {
            //     setAddress(result)
            // }
        },

        resetSend() {
            /* Reset (send) state to idle. */
            this.sendState = 'idle'

            /* Redirect to dashboard. */
            this.$router.push('dashboard')
        },

        setAddress(_result) {
            console.log('SET ADDRESS')

            /* Set address. */
            this.address = _result

            // if (result.expectedAmount) {
            //     const value = formatValue(result.expectedAmount)
            //     amount = value.value
            //     unit = value.unit
            // }

            // reference = result.reference || ''

            if (this.camera) {
                this.camera.stop()
                this.camera = null
            }

            if (this.scanner) {
                this.scanner.destroy()
                this.scanner = null
            }
        },

        async scannerWeb () {
            console.log('SCANNER WEB')

            try {
                navigator.getUserMedia =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia

                if (!navigator.mediaDevices.getUserMedia && !navigator.getUserMedia) {
                    this.cameraError = true
                } else {
                    /* Initialize video element. */
                    this.video = document.getElementById('video-display')

                    this.scanner = new QrScanner(this.video, (_data) => {
                        console.log('SCANNER DATA', _data)

                        // FIXME: Build a new link parser
                        const result = _data
                        // const result = parseLink(_data)

                        /* Validate (scanner) result. */
                        if (result) {
                            this.setAddress(result)
                        }
                    })

                    /* Start scanner. */
                    await this.scanner.start()
                }
            } catch (err) {
                console.log('SCANNER WEB ERROR:', err)
                this.cameraError = true
            }
        },
    },
    created: function () {
        // this.currentBalance = formatValue(this.balance)
        const value = 1337
        const rounded = Math.round(value * 10) / 10 + (Math.round(value * 10) / 10 === value ? '' : '+')
        const unit = 'sat'
        const fiat = '$1.337'

        /* Build current balance package. */
        this.currentBalance = {
            value,
            rounded,
            unit,
            fiat
        }
    },
    mounted: function () {
        /* Initialize send state. */
        this.sendState = 'idle'

        /* Initialize scanner. */
        // if (Capacitor.getPlatform() === 'web') {
        if (true) {
            this.scannerWeb()
        } else {
            this.scannerMobile(true)
        }
    },
    beforeDestroy() {
        /* Cleanup camera. */
        if (this.camera) {
            this.camera.stop()
            this.camera = null
        }

        /* Cleanup scanner. */
        if (this.scanner) {
            this.scanner.destroy()
            this.scanner = null
        }
    }
}
</script>

<style scoped>
main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 20px 0;
}

main.center {
    height: calc(100% - 94px);
    align-items: center;
    justify-content: center;
}

.balance {
    line-height: 55px;
    background: var(--trinary);
    color: var(--trinary-fg);
    text-align: center;
    font-size: 15px;
    font-weight: 600;
}

.scanner {
    flex: 1;
    position: relative;
    background: #000;
    overflow: hidden;
    opacity: 0;

    height: 450px;
    /* height: calc(100vh - 225px); */
    /* height: 100%; */
}

.scanner.enabled {
    opacity: 1;
}

.animation {
    display: block;
    height: 150px;
    text-align: center;
    margin-bottom: 15px;
}

@media only screen and (max-height: 600px) {
    .animation {
        height: 100px;
    }
}

.video-container {
    position: absolute;
    top: 0px;
    left: 50%;
    height: 100%;
    width: auto;
    transform: translate(-50%, 0);
}

video {
    display: block;
    height: 100%;
}

.scanner svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
svg path {
    fill: var(--secondary);
}

form {
    width: 100%;
}

h4 {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}
h4 strong {
    font-size: 40px;
    line-height: 44px;
    font-weight: 400;
}
h4 small {
    font-size: 13px;
    line-height: 13px;
    margin: 4px 0 0 3px;
}

.receiver {
    display: block;
    text-align: center;
}

main.center p {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    text-align: center;
}

main.center svg path {
    fill: var(--success);
}
</style>

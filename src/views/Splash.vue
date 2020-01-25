<template>
    <div class="splash">
        <svgicon icon="carnival" width="128" height="128" :fill="false" :original="true"></svgicon>

        <h1>
            Nito.cash
        </h1>

        <h2>
            Hush Your Money™
        </h2>

        <h3>
            (Developer Preview)
        </h3>

        <div>
            <svgicon icon="rocketman" width="194" height="242" :fill="false" :original="true"></svgicon>
        </div>

        <p>
            Launching soon
            <span>{{ '...'.substr(0, index) }}</span>
        </p>
  </div>
</template>

<script>
/* Import modules. */
import { BITBOX } from 'bitbox-sdk'

/* Import components. */
import '@/compiled-icons/carnival'
import '@/compiled-icons/rocket'
import '@/compiled-icons/rocketman'

export default {
    components: {
        // Icon
    },
    data: () => {
        return {
            bitbox: null,
            index: 0,
            frame: 0
        }
    },
    methods: {
        loop() {
            if (this.frame % 10 === 0) {
                this.index = this.index === 3 ? 0 : this.index + 1
            }
            this.frame = requestAnimationFrame(this.loop)
        },
        initBitbox() {
            console.log('Initializing BITBOX..')
            this.bitbox = new BITBOX()

            const entropy = this.bitbox.Crypto.randomBytes(32)
            console.log('ENTROPY', entropy)

            // const mnemonic = this.bitbox.Mnemonic.generate(256)
            // const mnemonic = this.bitbox.Mnemonic.fromEntropy(entropy)
            // const mnemonic = this.bitbox.Mnemonic.fromEntropy(entropy.toString('hex'), this.bitbox.Mnemonic.wordLists().japanese)
            const mnemonic = this.bitbox.Mnemonic.fromEntropy(entropy.toString('hex'), this.bitbox.Mnemonic.wordLists().english)
            console.log('MNEMONIC', mnemonic)

            const isValid = this.bitbox.Mnemonic.validate('bi', this.bitbox.Mnemonic.wordLists().english)
            console.log('IS VALID', isValid)

            let seedBuffer = this.bitbox.Mnemonic.toSeed(mnemonic)
            console.log('SEED BUFFER', seedBuffer)

            let hdNode = this.bitbox.HDNode.fromSeed(seedBuffer)

            let childNode = this.bitbox.HDNode.derivePath(hdNode, `m/44'/145'/0'`)

            const xPrivate = this.bitbox.HDNode.toXPriv(childNode)
            console.log('X PRIVATE', xPrivate)
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
    mounted: function () {
        /* Start animation loop. */
        this.loop()

        /* Initialize BITBOX. */
        this.initBitbox()

        this.getCashAccount()
        this.getCashAddress()
        this.getPrice()
        // this.openSocket()

        /* Load setup. */
        setTimeout(() => {
            this.$router.push('setup')
        }, 2000)
    }
}
</script>

<style scoped>
.splash {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background: var(--primary);
    color: var(--primary-fg);
    padding: 66px 0 55px;
}

.splash h1 {
    text-align: center;
    font-size: 28px;
    line-height: 0px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4em;
}

.splash h2 {
    text-align: center;
    font-size: 14px;
    line-height: 0px;
    font-weight: 600;
    /* font-style: italic; */
    letter-spacing: 0.4em;
}

.splash h3 {
    text-align: center;
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
    letter-spacing: 0.4em;
}

.splash p {
    text-align: left;
    width: 125px;
}

.splash p span {
    letter-spacing: 0.1em;
}

.splash div {
    height: 242px;
}

.splash div svg {
    height: 100%;
}

@media (max-height: 560px) {
    .splash {
        padding: 30px 0;
    }

    .splash div {
        height: 160px;
    }
}
</style>

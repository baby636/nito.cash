<template>
    <div>
        <Header label="Transaction history" secondary />

        <Tabs :tabs="tabs" :tab="tab" v-on:tab-change="updateTab" />

        <main :class="{ empty: items.length === 0}">
            <Transaction
                :txHash="selectedHash"
                :tx="selected"
                :active="showDetails"
                 v-on:close-details="showDetails = false" />

            <p v-if="items.length === 0">
                You haven’t {{ tab === 'Sent' ? 'sent' : 'made' }} any transactions yet
            </p>

            <div v-for="tx of items" v-bind:key="tx">
                <div class="date" v-if="tx.day">{{ formatDate(tx.day, 'short') }}</div>

                <div class="item"
                    @click="openDetails(tx.hash)"
                    :class="{ incoming: tx.incoming, pending: !tx.persistence }"
                >
                    <svg width="14" height="8" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.055 0L14 6.459l-1.563 1.453-5.382-5.006L1.563 8 0 6.547z" />
                    </svg>

                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5a1 1 0 112 0v3h2a1 1 0 110 2H9a1 1 0 01-1-1V5z" />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18 9A9 9 0 110 9a9 9 0 0118 0zm-2 0A7 7 0 112 9a7 7 0 0114 0z" />
                    </svg>

                    <h5>{{ tx.persistence ? (tx.incoming ? 'Received' : 'Sent') : (tx.incoming ? 'Receiving' : 'Sending') }}</h5>

                    <article>
                        <strong>
                            <em>{{tx.value.rounded}}</em>
                            <span>{{tx.value.unit}}</span>
                        </strong>

                        <small>{{tx.value.fiat}}</small>

                        <time>{{ formatDate(tx.timestamp, 'time') }}</time>
                    </article>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
/* Initialize vuex. */
import { mapActions, mapState } from 'vuex'

/* Import components. */
import { Header, Tabs, Transaction } from '@/components'

/* Import libraries. */
import formatValue from '@/libs/formatValue'

// import { history } from '~/lib/account'
// import { formatDate, formatValue } from '~/lib/helpers'

export default {
    components: {
        Header,
        Tabs,
        Transaction,
    },
    data: () => {
        return {
            addresses: [],
            history: [],

            selectedHash: null,
            showDetails: false,
            tab: 'All',
            tabs: ['All', 'Sent', 'Received'],
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

        /* Returns history items. */
        items() {
            /* Return items (from history). */
            return this.setItems()
        },

        /* Returns selected transaction (from history). */
        selected() {
            /* Return selected (item). */
            return this.items.find((item) => item.hash === this.selectedHash)
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
            try {
                /* Initialize BITBOX. */
                this.bitbox = new window.BITBOX()
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * Update Tab
         */
        updateTab(_tab) {
            /* Update tab. */
            this.tab = _tab
        },

        /**
         * Open Details
         */
        openDetails(_hash) {
            /* Set selected hash. */
            this.selectedHash = _hash

            /* Set (details) display flag. */
            this.showDetails = true
        },

        /**
         * Format Date
         *
         * TODO Consider switching to momentjs.
         */
        formatDate(_time, _type) {
            /* Define date (formatting) options. */
            const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }

            /* Initialize date. */
            const date = new Date(_time * 1000)

            /* Select a (formatting) type. */
            switch (_type) {
                case 'long':
                    return `${date.toLocaleDateString(navigator.language, options)}, ${date.toLocaleTimeString(navigator.language)}`
                case 'short':
                    return date.toLocaleDateString(navigator.language, options)
                default:
                    return date.toLocaleTimeString(navigator.language)
            }
        },

        /**
         * Set Items
         */
        setItems() {
            console.log('SET ITEMS')

            /* Initialize filtered. */
            const filtered =
                this.tab === 'All'
                    ? this.history.filter((item) => item.hash)
                    : this.history.filter((item) =>
                        item.hash && (
                            (this.tab === 'Sent' && !item.incoming) || (this.tab === 'Received' && item.incoming)
                        )
                    )

            /* Sort filtered. */
            filtered.sort((a, b) => b.timestamp - a.timestamp)

            /* Initialize current day. */
            let currentDay = null

            /* Return filtered (transactions). */
            return filtered.map(item => {
                /* Initialize transaction day. */
                const txDay = item.timestamp - (item.timestamp % (24 * 60 * 60))

                /* Sets the (display) day (null if already set for the "current" day). */
                const day = txDay !== currentDay ? txDay : null

                /* Saves the current (displayed) day (on the UI). */
                currentDay = txDay

                /* Return (formated) transaction object. */
                return Object.assign(
                    {},
                    item,
                    {
                        day,
                        value: formatValue(item.value, this.marketPrice, 'USD')
                    }
                )
            })
        },

        async setHistory() {
            try {
                /* Initialize seed buffer. */
                const seedBuffer = this.bitbox.Mnemonic.toSeed(this.walletMasterMnemonic)
                // console.log('SEED BUFFER', seedBuffer)

                const hdNode = this.bitbox.HDNode.fromSeed(seedBuffer)
                // console.log('HD NODE', hdNode)

                /* Initialize child node. */
                const childNode = hdNode.derivePath(`${this.walletDerivationPath.bch}/0/0`)

                const address = this.bitbox.HDNode.toCashAddress(childNode)
                console.log('ADDRESS', address)

                // NOTE: Array with maximum of 20 legacy or cash addresses.
                // TODO: Add support for "change" addresses.
                if (address) {
                    this.addresses = [address]
                }

                /* Retrieve unspent transaction outputs. */
                const utxo = await this.bitbox.Address.utxo(this.addresses)
                console.log('UTXOS', utxo)

                /* Retrieve transaction details. */
                const addrDetails = await this.bitbox.Address.details(this.addresses)
                console.log('ADDRESS(ES) DETAILS', addrDetails)

                /* Loop through ALL uxtos. */
                addrDetails.forEach(async address => {
                    console.log('ADDRESS DETAILS', address)

                    /* Retrieve transactions. */
                    const transactions = address.transactions

                    /* Loop through ALL uxtos. */
                    transactions.forEach(async txHash => {
                        console.log('TX HASH', txHash)

                        /* Retrieve transaction details. */
                        const details = await this.bitbox.Transaction.details(txHash)
                        console.log('TX DETAILS', details)

                        /* Set (transaction) hash. */
                        const hash = details.txid

                        /* Initialize value. */
                        let value = 0

                        /* Initialize incoming. */
                        let incoming = false

                        /* Initialize persistence. */
                        let persistence = false
                        // let persistence = utxo.confirmations > 0 ? true : false

                        /* Initialize timestamp. */
                        let timestamp = null

                        /* Set inputs. */
                        const inputs = details.vin

                        /* Search inputs. */
                        inputs.forEach(input => {
                            console.log('INPUT CASHADDR', input.cashAddress, this.addresses)

                            /* Validate (matching) transaction. */
                            // FIXME: This "could" fail (or cause problems),
                            //        when sending within the same wallet.
                            if (this.addresses.includes(input.cashAddress)) {
                                /* Add value. */
                                value += input.value

                                /* Validate persistence. */
                                if (details.confirmations > 0) {
                                    persistence = true
                                }

                                /* Set timestamp. */
                                timestamp = details.time
                            }
                        })

                        /* Set outputs. */
                        const outputs = details.vout

                        /* Search outputs. */
                        outputs.forEach(output => {
                            console.log('OUTPUT CASHADDR', output.scriptPubKey.cashAddrs[0])

                            /* Validate (matching) transaction. */
                            // FIXME: This "could" fail (or cause problems),
                            //        when sending within the same wallet.
                            if (this.addresses.includes(output.scriptPubKey.cashAddrs[0])) {
                                /* Add value. */
                                value += parseInt(output.value * 100000000)

                                /* Set (incoming) flag. */
                                incoming = true

                                /* Validate persistence. */
                                if (details.confirmations > 0) {
                                    persistence = true
                                }

                                /* Set timestamp. */
                                timestamp = details.time
                            }
                        })

                        /* Build transaction details. */
                        const tx = {
                            hash,
                            value,
                            incoming,
                            persistence,
                            timestamp
                        }

                        console.log('BUILT TX', tx)

                        /* Add transaction to history. */
                        this.history.push(tx)
                    })

                    /* Set (transaction) hash. */
                    // const hash = utxo.txid

                    /* Retrieve transaction details. */
                    // const details = await this.bitbox.Transaction.details(hash)
                    // console.log('TX DETAILS', details)

                    /* Set value. */
                    // const value = utxo.satoshis

                    /* Set incoming. */
                    // const incoming = true

                    /* Set persistence. */
                    // const persistence = utxo.confirmations > 0 ? true : false

                    /* Set timestamp. */
                    // const timestamp = details.time

                    /* Build transaction details. */
                    // const tx = {
                    //     hash,
                    //     value,
                    //     incoming,
                    //     persistence,
                    //     timestamp
                    // }

                    /* Add transaction to history. */
                    // this.history.push(tx)
                })
            } catch (err) {
                console.error('SET HISTORY ERROR:', err)

                /* Set error. */
                this.setError(err.message ? err.message.split(';')[0] : err)
            }
        },
    },
    created: function () {
        /* Initialize BITBOX. */
        this.initBitbox()
    },
    mounted: function () {
        /* Set (transaction) history. */
        this.setHistory()
    }
}
</script>

<style scoped>
main {
    flex: 1;
    flex-direction: column;
    padding: 0 20px;
    height: calc(100% - 58px - 65px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

main.empty {
    text-align: center;
    padding-top: 150px;
    font-size: 14px;
}

main:before {
    display: block;
    position: absolute;
    top: 185px;
    left: 35px;
    content: '';
    width: 2px;
    height: calc(100% - 165px);
    background: var(--list-bg);
}

main.empty:before {
    display: none;
}

div .date {
    font-size: 11px;
    display: block;
    text-align: center;
    margin: 26px 0 15px;
}

div .item {
    display: block;
    cursor: pointer;
    padding: 6px 0 0 48px;
    position: relative;
}

div .item:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background: var(--secondary);
}

div .item.incoming:before {
    background: var(--trinary);
}

div .item.pending:before {
    background: var(--pending);
}

svg {
    position: absolute;
    z-index: 2;
    top: 11px;
    left: 9px;
}

svg:last-of-type {
    display: none;
    top: 7px;
    left: 7px;
}

svg path {
    fill: var(--primary-fg);
}

div .item.incoming svg path {
    transform: rotate(180deg) translate(0, -2px);
    transform-origin: center center;
}

div .item.pending svg:first-of-type {
    display: none;
}

div .item.pending svg:last-of-type {
    display: block;
}

div .item.pending svg path {
    transform: none;
}

h5 {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 9px 4px;
}

article {
    position: relative;
    background: var(--list-bg);
    border-radius: 10px;
    padding: 17px 10px 13px 16px;
    margin-bottom: 17px;
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

div .item:hover article {
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.25);
}

strong {
    display: flex;
    margin-bottom: 13px;
}
strong em {
    font-style: normal;
    font-size: 20px;
    font-weight: 600;
}
strong span {
    font-size: 11px;
    line-height: 11px;
    margin-left: 3px;
}
small {
    font-size: 11px;
}
time {
    font-size: 11px;
    position: absolute;
    top: 14px;
    right: 15px;
    font-weight: 600;
    opacity: 0.4;
}
</style>

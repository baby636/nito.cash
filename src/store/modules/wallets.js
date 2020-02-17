/* Import libraries. */
// import telr from '../../api/telr'

/* Import libraries. */
import formatValue from '@/libs/formatValue'

/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/* Set dust amount. */
const DUST_AMOUNT = 546

/* Initialize state. */
const state = {
    // NOTE: A complete record of ALL incoming and outgoing transactions.
    accountHistory: [],

    // NOTE: A list of the starting and ending indexes of ALL
    //       active "receiver" accounts.
    activeAccounts: {
        start: 0,
        end: 0,
    },

    // NOTE: A list of the starting and ending indexes of ALL
    //       active "change" accounts.
    changeAccounts: {
        start: 0,
        end: 0,
    },

    // NOTE: Based on (BIP-44) derivation paths.
    //       (m / purpose' / coin_type' / account' / change / address_index)
    derivationPath: {
        bch: `m/44'/145'/0'`, // Bitcoin Cash
        eth: `m/44'/60'/0'`, // Ethereum
        slp: `m/44'/245'/0'`, // Simple Ledger Protocol (SLP)
        slpr: `m/44'/2450'/0'`, // SLP Registered
    },

    // NOTE: Seeds may be imported from UUIDs embedded in the url,
    //       as a querystring (https://nito.cash?<uuid>).
    importedSeeds: [],

    // NOTE: This is a 24-word (BIP-39) phrase, which can be generated from
    //       the `masterSeed` or imported from an existing wallet.
    masterMnemonic: null,

    // NOTE: This is a 32-byte seed, which can be generated randomly,
    //       or by importing from an existing wallet.
    masterSeed: null,
}

/* Getters. */
const getters = {
    /**
     * Get Active Accounts
     *
     * Returns (addresses for) ALL active accounts.
     */
    getActiveAccounts: (state) => {
        /* Set current account index. */
        const currentAccountIndex = Math.max(...state.activeAccounts)

        return currentAccountIndex + 1
    },

    /**
     * Get Address
     */
    getAddress: (state) => {
        /* Initialize seed buffer. */
        const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)
        // console.log('SEED BUFFER', seedBuffer)

        const hdNode = bitbox.HDNode.fromSeed(seedBuffer)
        // console.log('HD NODE', hdNode)

        /* Set change. */
        // FIXME: This must be derived.
        const change = 0

        /* Set address index. */
        // FIXME: This must be derived.
        const addressIndex = 0

        /* Initialize child node. */
        const childNode = hdNode.derivePath(
            `${state.derivationPath.bch}/${change}/${addressIndex}`)

        const address = bitbox.HDNode.toCashAddress(childNode)
        console.log('ADDRESS', address)

        /* Return address. */
        return address
    },

    /**
    * Get Balance
    *
    * NOTE: This function will accept ANY wallet address to retrieve the
    *       current balance (based on "supplied" market price).
    */
    getBalance: (state, getters, rootState) => async (_marketPrice) => {
        /* Set address. */
        const address = getters.getAddress

        /* Set (change) address. */
        const changeAddress = getters.getChangeAddress

        console.log('GET BALANCE (address)', address)
        console.log('GET BALANCE (change address)', changeAddress)
        console.log('GET BALANCE (market price)', _marketPrice)

        try {
            /* Retrieve address details. */
            const details = await bitbox.Address.details([
                address,
                changeAddress,
            ])
            console.log('ADDRESS DETAILS', JSON.stringify(details, null, 4))

            /* Initialize balance. */
            let balance = 0

            /* Set balance (in satoshis). */
            if (rootState.profile.showUnconfirmed) {
                details.forEach((address) => {
                    /* Both confirmed and unconfirmed. */
                    balance += (address.balanceSat + address.unconfirmedBalanceSat)
                })
            } else {
                details.forEach((address) => {
                    /* Confirmed ONLY. */
                    balance += address.balanceSat
                })
            }

            /* Format balance (for display). */
            const formattedBalance = formatValue(balance, _marketPrice, 'USD')
            console.log('FORMATTED BALANCE', JSON.stringify(formattedBalance, null, 4))

            /* Return (formatted) balance. */
            return formattedBalance
        } catch(error) {
            console.error(error)
        }
    },

    /**
     * Get Change Accounts
     *
     * Returns (addresses for) ALL (in-use) change accounts.
     */
    getChangeAccounts: (state) => {
        /* Set current account index. */
        const currentAccountIndex = Math.max(...state.activeAccounts)

        return currentAccountIndex + 1
    },

    /**
     * Get Change Address
     *
     * Returns the next available change address.
     */
    getChangeAddress: (state) => {
        /* Initialize seed buffer. */
        const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)
        // console.log('SEED BUFFER', seedBuffer)

        const hdNode = bitbox.HDNode.fromSeed(seedBuffer)
        // console.log('HD NODE', hdNode)

        /* Set change. */
        // FIXME: This must be derived.
        const change = 1

        /* Set address index. */
        // FIXME: This must be derived.
        const addressIndex = 0

        /* Initialize child node. */
        const childNode = hdNode.derivePath(
            `${state.derivationPath.bch}/${change}/${addressIndex}`)

        const address = bitbox.HDNode.toCashAddress(childNode)
        // console.log('CHANGE ADDRESS', address)

        /* Return address. */
        return address
    },

    /**
     * Get Receiving Account
     *
     * Returns the current (next active) receiving account.
     *
     * NOTE: This account MUST be currently "unfunded".
     */
    getReceivingAccount: (state) => {
        /* Set current account index. */
        const currentAccountIndex = Math.max(...state.activeAccounts)

        return currentAccountIndex + 1
    },

    // wallets: (state, getters, rootState) => {
    //     return state.items.map(({ id, quantity }) => {
    //         const product = rootState.products.all.find(product => product.id === id)
    //         return {
    //             title: product.title,
    //             price: product.price,
    //             quantity
    //         }
    //     })
    // },

    // totalBalance: (state, getters) => {
    //     return getters.cartProducts.reduce((total, product) => {
    //         return total + product.price * product.quantity
    //     }, 0)
    // },
}

/* Actions. */
const actions = {
    /**
     * Add New Seed
     */
    addNewSeed ({ commit, state }, _seed) {
        /* Validate new seed (for duplicates). */
        if (state.importedSeeds.includes(_seed)) {
            console.log(_seed, 'has already been added to this wallet')
        } else {
            console.log('Adding new seed to wallet', _seed)

            /* Commit new seed to wallet. */
            commit('addNewSeed', _seed)
        }
    },

    /**
     * Create New Wallet
     */
    createNewWallet ({ commit }) {
        console.info('Creating a NEW wallet..')

        try {
            /* Initialize walletMasterSeed. */
            // let walletMasterSeed = null

            /* Generate walletMasterSeed from random bytes. */
            // TODO: !!! WARNING !!! WARNING !!! WARNING !!!
            //       We MUST properly evaluate ANY and ALL weaknesses with
            //       using randomBytes via a ("mobile") web browser.
            const masterSeed = bitbox.Crypto.randomBytes(32)

            /* Set new master (private) key to wallet.. */
            commit('setMasterSeed', masterSeed)

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
            const language = bitbox.Mnemonic.wordLists().english

            /* Initialize mnemonic. */
            const mnemonic = bitbox.Mnemonic
                .fromEntropy(masterSeed.toString('hex'), language)

            // TODO: Save partial key to Nito cloud.

            // console.log('MNEMONIC', mnemonic)

            /* Set new master (private) key to wallet.. */
            commit('setMasterMnemonic', mnemonic)
        } catch (err) {
            console.error(err)
        }
    },

    async sendCrypto ({ dispatch, getters, state }, _params) {
        /* Set receiver. */
        const receiver = _params.receiver

        /* Set amount. */
        const amount = parseInt(_params.amount)

        /* Set unit. */
        const unit = _params.unit

        console.log('SENDING CRYPTO', receiver, amount, unit)

        /* Initialize addresses. */
        const addresses = []

        /* Validate amount (sending to receiver). */
        if (!amount) {
            return dispatch('setError',
                'Cannot send payment without amount', { root: true })
        }

        try {
            /* Initialize seed buffer. */
            const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)
            // console.log('SEED BUFFER', seedBuffer)

            const hdNode = bitbox.HDNode.fromSeed(seedBuffer)
            // console.log('HD NODE', hdNode)

            /* Initialize child node. */
            const childNode = hdNode.derivePath(`${state.derivationPath.bch}/0/0`)

            const address = bitbox.HDNode.toCashAddress(childNode)
            console.log('ADDRESS (of sender)', address)

            // NOTE: Array with maximum of 20 legacy or cash addresses.
            // TODO: Add support for "change" addresses.
            if (address) {
                addresses.push(address)
            }

            /* Retrieve unspent transaction outputs. */
            const utxo = await bitbox.Address.utxo(addresses)
            console.log('UTXOS', utxo)

            /* Set ALL uxtos. */
            const myInputs = utxo[0].utxos

            /* Initialize transaction builder. */
            const transactionBuilder = new bitbox.TransactionBuilder('mainnet')
            console.log('TX BUILDER - 1', transactionBuilder)

            /* Initialize send amount. */
            let sendAmount = 0

            switch(unit.toUpperCase()) {
            case 'SATOSHIS':
                sendAmount += amount
                break
            case 'BITS':
                sendAmount += (amount * 100)
                break
            case 'MBCH':
                sendAmount += (amount * 100000)
                break
            case 'BCH':
                sendAmount += (amount * 100000000)
                break
            default:
                sendAmount += amount
            }
            console.log('SEND AMOUNT', sendAmount)

            // FIXME: How do we determine the number of outputs (incl. change)?
            // const byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 })
            const byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 2 })
            console.log('BYTE COUNT', byteCount)

            /* Add byte count to send amount. */
            // NOTE: It's the original amount - 1 sat/byte for tx size
            const txAmount = sendAmount + byteCount
            console.log('TRANSACTION AMOUNT (incl bytes)', sendAmount)

            /* Initialize utxo (value) total. */
            let inputsTotal = 0

            /* Loop through ALL uxtos. */
            myInputs.forEach(utxo => {
                console.log('UXTO', utxo)

                /* Validate input flag. */
                if (inputsTotal < txAmount) {
                    /* Add input with txid and index of vout. */
                    transactionBuilder.addInput(utxo.txid, utxo.vout)

                    console.log('ADDED UTXO', utxo.txid, utxo.vout, utxo.satoshis)

                    /* Add input value to total. */
                    inputsTotal += utxo.satoshis
                }
            })

            console.log('INPUTS TOTAL', inputsTotal)
            console.log('TX BUILDER - 2', transactionBuilder)

            /* Validate send amount. */
            // TODO: Validate BCH dust amount.
            if (sendAmount < DUST_AMOUNT) {
                /* Set error. */
                dispatch('setError',
                    `Amount is too low. Min: ${DUST_AMOUNT + byteCount} sats`, { root: true })

                /* Set flag. */
                // FIXME: How can we display this on the UI?
                // this.sendState = 'idle'

                return
            }

            /* Add output w/ address and amount to send. */
            transactionBuilder.addOutput(receiver, sendAmount)
            // transactionBuilder.addOutput(receiver, inputsTotal - byteCount)

            /* Complete outputs (to change address). */
            if (sendAmount < inputsTotal) {
                /* Retrieve change address. */
                const changeAddress = getters.getChangeAddress
                console.log('CHANGE ADDRESS', changeAddress)

                /* Calculate change amount. */
                const changeAmount = inputsTotal - txAmount
                console.log('CHANGE AMOUNT', changeAmount)

                /* Add change output w/ change address. */
                transactionBuilder.addOutput(changeAddress, changeAmount)
            }

            console.log('TX BUILDER - 3', transactionBuilder)

            /* Set locktime (for immediate propagation). */
            transactionBuilder.setLockTime(0)

            /* Set keypair. */
            const keyPair = bitbox.HDNode.toKeyPair(childNode)
            // console.log('KEYPAIR', keyPair)

            /* Initialize redeemscript. */
            let redeemScript

            /* Sign the transaction input(s). */
            // FIXME: Allow for multipe inputs.
            transactionBuilder.sign(
                0, // vin
                keyPair,
                redeemScript,
                transactionBuilder.hashTypes.SIGHASH_ALL,
                parseInt(inputsTotal),
                transactionBuilder.signatureAlgorithms.SCHNORR
            )

            console.log('TX BUILDER - 4', transactionBuilder)

            /* Build transaction. */
            const tx = transactionBuilder.build()
            console.log('TX BUILD', tx)

            /* Set tx output to raw hex. */
            const txHex = tx.toHex()
            console.log('RAW HEX', txHex)

            /* Set state. */
            // this.sendState = 'sending'

            /* Broadcast transaction to network. */
            bitbox.RawTransactions.sendRawTransaction(txHex)
                .then(
                    (result) => {
                        console.log('TX RESULT', result)

                        /* Increment receiving wallet (index). */
                        state.activeAccounts.end++

                        /* Increment receiving wallet (index). */
                        // FIXME: Verify that a change account was used.
                        state.changeAccounts.end++

                        /* Set notification. */
                        dispatch('setNotification',
                            'Sent successfully!', { root: true })

                        /* Set flag. */
                        // this.sendState = 'idle'
                    },
                    (err) => {
                        console.error('TX SEND ERROR:', err)

                        /* Set error. */
                        dispatch('setError',
                            err.message ? err.message.split(';')[0] : err, { root: true })

                        /* Set flag. */
                        // this.sendState = 'idle'
                    }
                )
        } catch (err) {
            console.error('TX SEND ERROR:', err)

            /* Set error. */
            dispatch('setError',
                err.message ? err.message.split(';')[0] : err, { root: true })

            /* Set flag. */
            // FIXME: Add this to the `system` module.
            // this.sendState = 'idle'
        }
    },

    /**
     * Set Account History
     */
    async setAccountHistory ({ commit, state }) {
        /* Initialize history. */
        const history = []

        /* Initialize addresses (array). */
        const addresses = []

        try {
            /* Initialize seed buffer. */
            const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)
            // console.log('SEED BUFFER', seedBuffer)

            const hdNode = bitbox.HDNode.fromSeed(seedBuffer)
            // console.log('HD NODE', hdNode)

            /* Initialize child node. */
            const childNode = hdNode.derivePath(`${state.derivationPath.bch}/0/0`)

            const address = bitbox.HDNode.toCashAddress(childNode)
            console.log('ADDRESS', address)

            // NOTE: Array with maximum of 20 legacy or cash addresses.
            // TODO: Add support for "change" addresses.
            if (address) {
                /* Add address. */
                addresses.push(address)
            }

            /* Retrieve unspent transaction outputs. */
            const utxo = await bitbox.Address.utxo(addresses)
            console.log('UTXOS', utxo)

            /* Retrieve transaction details. */
            const addrDetails = await bitbox.Address.details(addresses)
            console.log('ADDRESS(ES) DETAILS', addrDetails)

            /* Loop through ALL uxtos. */
            addrDetails.forEach(async address => {
                console.log('ADDRESS DETAILS', address)

                /* Retrieve transactions. */
                const transactions = address.transactions

                /* Loop through ALL uxtos. */
                transactions.forEach(async (txHash, txIdx) => {
                    console.log('TX HASH', txHash)

                    /* Retrieve transaction details. */
                    const details = await bitbox.Transaction.details(txHash)
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
                        console.log('INPUT CASHADDR', input.cashAddress, addresses)

                        /* Validate (matching) transaction. */
                        // FIXME: This "could" fail (or cause problems),
                        //        when sending within the same wallet.
                        if (addresses.includes(input.cashAddress)) {
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
                        if (addresses.includes(output.scriptPubKey.cashAddrs[0])) {
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

                    console.log('BUILT TX', txIdx, tx)

                    /* Add transaction to history. */
                    history.push(tx)

                    /* Commit history. */
                    if (txIdx === transactions.length - 1) {
                        commit('setAccountHistory', history)
                    }
                })
            })
        } catch (err) {
            console.error('SET HISTORY ERROR:', err)
        }
    },

    /**
     * Set Master Mnemonic
     */
    setMasterMnemonic ({ commit }, _mnemonic) {
        console.log('Setting master wallet mnemonic', _mnemonic)

        /* Commit wallet's master mnemonic. */
        commit('setMasterMnemonic', _mnemonic)
    },

    /**
     * Set Master Seed
     */
    setMasterSeed ({ commit }, _seed) {
        console.log('Setting master wallet seed', _seed)

        /* Commit wallet's master seed. */
        commit('setMasterSeed', _seed)
    },

    /**
     * Destroy Wallet
     */
    destroyWallet ({ commit }) {
        console.log('Destroying wallet')

        /* Commit wallet's destruction. */
        commit('destroyWallet')
    },
}

/* Mutations. */
const mutations = {
    /**
     * Add New (Imported) Seed
     *
     * New seeds are typically imported from BCH sponsors.
     * eg. https://nito.cash?47a49dfe-2fe4-4343-b81e-947580f243f0
     *     will generate a new seed `47a49dfe-2fe4-4343-b81e-947580f243f0`
     */
    addNewSeed (state, _seed) {
        /* Add NEW "imported" seed to pool. */
        state.importedSeeds.push(_seed)
    },

    /**
     * Set Account History
     *
     * This is a complete record of ALL incoming and outgoing transactions.
     */
    setAccountHistory (state, _history) {
        /* Update master seed. */
        state.accountHistory = _history
    },

    /**
     * Set Master Mnemonic
     *
     * This is the user's primary mnemonic phrase.
     *
     * BIP-39 will be used to split the 24-word mnemonic phrase:
     *   1. 12 words will be sent to user's primary email.
     *   2. 6 words will be sent to user's secondary (and/or social) email(s).
     *   3. 6 words will be sent to Nito cloud server (managed by Modenero).
     */
    setMasterMnemonic (state, _mnemonic) {
        /* Update master seed. */
        state.masterMnemonic = _mnemonic
    },

    /**
     * Set Master Seed
     *
     * This is the user's primary (private key) seed.
     */
    setMasterSeed (state, _seed) {
        /* Update master seed. */
        state.masterSeed = _seed
    },

    /**
     * Destroy Wallet
     *
     * This will completely destory the user's wallet,
     * as well as ALL imported seeds.
     */
    destroyWallet (state) {
        /* Destory master mnemonic. */
        state.masterMnemonic = null

        /* Destory master seed. */
        state.masterSeed = null

        /* Reset all (imported) seeds. */
        state.importedSeeds = []

        /* Reset active accounts (address) index. */
        state.activeAccounts = [0]

        /* Reset change (address) index. */
        state.changeAccounts = [0]
    },
}

/* Export. */
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

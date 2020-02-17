/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/* Set dust amount. */
const DUST_AMOUNT = 546

/**
 * Send Crypto
 */
const sendCrypto = async ({ dispatch, getters, state }, _params) => {
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
}

/* Export module. */
export default sendCrypto

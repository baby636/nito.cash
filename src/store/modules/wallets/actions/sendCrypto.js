/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/* Set dust amount. */
const DUST_AMOUNT = 546

/**
 * Sign Input
 */
const signInput = (_transactionBuilder, _hdNode, _inputs) => {
    /* Set input. */
// TEMP: FOR DEVELOPMENT PURPOSES ONLY
    const input = _inputs[0]
    console.log('ADDRESS (of input)', input.address)

    /* Initialize child node. */
    const childNode = _hdNode.derivePath(input.path)

    /* Set keypair. */
    const keyPair = bitbox.HDNode.toKeyPair(childNode)
    console.log('KEYPAIR', keyPair)

    /* Set (signing) amount. */
// TEMP: FOR DEVELOPMENT PURPOSES ONLY
    const amount = parseInt(input.satoshis)
    console.log('SIGNING AMOUNT', amount)

    /* Initialize redeemscript. */
    // TODO: Find out WHY the hell we need this here??
    let redeemScript

    /* Sign the transaction input(s). */
    // FIXME: Allow for multipe inputs.
    _transactionBuilder.sign(
        0, // vin
        keyPair,
        redeemScript,
        _transactionBuilder.hashTypes.SIGHASH_ALL,
        amount,
        _transactionBuilder.signatureAlgorithms.SCHNORR
    )
}

/**
 * Send Crypto
 */
const sendCrypto = async ({ dispatch, getters, state }, _params) => {
    /* Set receiver. */
    const receiver = _params.receiver

    /* Set amount. */
    // NOTE: We allow for decimal (fractional) amounts.
    const amount = parseFloat(_params.amount)

    /* Set unit. */
    const unit = _params.unit

    console.log('SENDING CRYPTO', receiver, amount, unit)

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

        /* Initialize ALL (wallet) address. */
        // NOTE: Array with maximum of 20 legacy or cash addresses.
        const addresses = [
            ...getters.getReceivingAccounts('bch'),
            ...getters.getChangeAccounts('bch')
        ]

        /* Retrieve unspent transaction outputs. */
        const utxos = await bitbox.Address.utxo(addresses)
        console.log('UTXOS', utxos)

        /* Initialize available inputs. */
        const availableInputs = []

        /* Add ALL (available) UTXOs. */
        utxos.forEach(utxo => {
            /* Validate UXTO(s). */
            // FIXME: Add support for multiple UXTOs per account address.
            if (utxo.utxos.length > 0) {
                /* Add input to available pool. */
                availableInputs.push({
                    address: utxo.cashAddress.slice(12), // sans prefix
                    // FIXME: How do we determine the derivation path??
                    path: `${state.derivationPath.bch}/1/0`,
                    ...utxo.utxos[0]
                })
            }
        })

        console.log('AVAILABLE INPUTS', availableInputs)

        if (availableInputs.length == 0) {
            /* Set error. */
            dispatch('setError',
                `Your balance is too low.`, { root: true })

            return
        }

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
        availableInputs.forEach(input => {
            console.log('INPUT', input)

            /* Validate input flag. */
            if (inputsTotal < txAmount) {
                /* Add input with txid and index of vout. */
                transactionBuilder.addInput(input.txid, input.vout)

                console.log('ADDED UTXO', input.txid, input.vout, input.satoshis)

                /* Add input value to total. */
                inputsTotal += input.satoshis
            }
        })

        console.log('INPUTS TOTAL', inputsTotal)
        console.log('TX BUILDER - 2', transactionBuilder)

        /* Validate send amount. */
        // TODO: Validate BCH dust amount.
        if (sendAmount < DUST_AMOUNT) {
            /* Set error. */
            dispatch('setError',
                `Amount is too low. Min: ${DUST_AMOUNT} sats`, { root: true })

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

            /* Validate change amount. */
            // TODO: Should we adjust the number of outputs??
            if (changeAmount >= DUST_AMOUNT) {
                /* Add change output w/ change address. */
                transactionBuilder.addOutput(changeAddress, changeAmount)
            }
        }

        console.log('TX BUILDER - 3', transactionBuilder)

        /* Set locktime (for immediate propagation). */
        transactionBuilder.setLockTime(0)

        /* Sign input(s). */
        signInput(transactionBuilder, hdNode, availableInputs)
        console.log('(SIGNED) TX BUILDER', transactionBuilder)

        /* Build transaction. */
        const tx = transactionBuilder.build()
        console.log('TRANSACTION BUILD', tx)

        /* Set tx output to raw hex. */
        const txHex = tx.toHex()
        console.log('TRANSACTION BUILD (RAW HEX)', txHex)

        /* Set state. */
        // this.sendState = 'sending'

        /* Broadcast transaction to network. */
        bitbox.RawTransactions.sendRawTransaction(txHex)
            .then(
                (result) => {
                    console.log('TX RESULT', result)

                    /* Increment receiving wallet (index). */
                    // FIXME: Verify that a change account was used.
                    dispatch('nextChange')

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

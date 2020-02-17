/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Update Account History
 */
const updateAccountHistory = async ({ commit, state }) => {
    // console.log('Updating account history')

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
}

/* Export module. */
export default updateAccountHistory

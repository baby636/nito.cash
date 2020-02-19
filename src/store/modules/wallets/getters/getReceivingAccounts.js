/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Get Receiving Accounts
 *
 * Returns (addresses for) ALL (in-use) receiving accounts.
 */
const getReceivingAccounts = (state) => (_walletType) => {
    /* Initialize (receiving) accounts. */
    const accounts = []

    /* Add all active receiving account (addresses) to pool. */
    state.receivingAccounts[_walletType].active.forEach(index => {
        /* Initialize seed buffer. */
        const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)

        /* Initialize HD node. */
        const hdNode = bitbox.HDNode.fromSeed(seedBuffer)

        /* Set change. */
        const change = 0

        /* Set derivation path. */
        const path = `${state.derivationPath.bch}/${change}/${index}`

        /* Initialize child node. */
        const childNode = hdNode.derivePath(path)

        const address = bitbox.HDNode.toCashAddress(childNode)
        console.log('GET RECEIVING ACCOUNTS (address)', address)

        /* Add to all receiving (pool). */
        accounts.push(address)
    })

    /* Return accounts. */
    return accounts
}

/* Export module. */
export default getReceivingAccounts

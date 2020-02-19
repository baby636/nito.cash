/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Get Change Accounts
 *
 * Returns (addresses for) ALL (in-use) change accounts.
 */
const getChangeAccounts = (state) => (_walletType) => {
    /* Initialize (change) accounts */
    const accounts = []

    /* Add all active change account (addresses) to pool. */
    state.changeAccounts[_walletType].active.forEach(index => {
        /* Initialize seed buffer. */
        const seedBuffer = bitbox.Mnemonic.toSeed(state.masterMnemonic)

        /* Initialize HD node. */
        const hdNode = bitbox.HDNode.fromSeed(seedBuffer)

        /* Set change. */
        const change = 1

        /* Set derivation path. */
        const path = `${state.derivationPath.bch}/${change}/${index}`

        /* Initialize child node. */
        const childNode = hdNode.derivePath(path)

        const address = bitbox.HDNode.toCashAddress(childNode)
        console.log('GET CHANGE ACCOUNTS (address)', address)

        /* Add to all change (pool). */
        accounts.push(address)
    })

    /* Return accounts. */
    return accounts
}

/* Export module. */
export default getChangeAccounts

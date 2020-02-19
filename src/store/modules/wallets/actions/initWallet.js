/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Initialize Wallet
 */
const initWallet = async ({ dispatch, getters, state}) => {
    console.info('Initializing wallet..')

// TEMP: FOR DEVELOPMENT PURPOSES ONLY
    const receivingAccounts = state.receivingAccounts
    console.log('DEBUG: ALL RECEIVING ACCOUNTS', receivingAccounts)

    const currentWalletAddress = getters.getWalletAddress
    // console.log('CURRENT WALLET ADDRESS', currentWalletAddress)

    /* Retrieve (ALL) account(s) details. */
    const details = await bitbox.Address.details(currentWalletAddress)
    // console.log('DETAILS', details)

    /* Set transactions count. */
    const numTxs = details.transactions.length

    /* Validate (account) address usage. */
    if (numTxs > 0) {
        console.log(`[ ${currentWalletAddress} ] HAS ALREADY BEEN USED.`)
        console.log('A new receiving address will be generated now..')

        /* Request next (receiving account) address. */
        dispatch('nextReceiver', 'bch')
    } else {
        console.log(`[ ${currentWalletAddress} ] is ready to receive funds..`)
    }
}

/* Export module. */
export default initWallet

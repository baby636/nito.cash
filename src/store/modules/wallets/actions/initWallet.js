/* Initialize BITBOX. */
const bitbox = new window.BITBOX()

/**
 * Initialize Wallet
 */
const initWallet = async ({ dispatch, getters, state}) => {
    console.info('Initializing wallet..')

    /* Retrieve receiving accounts. */
    const receivingAccounts = state.receivingAccounts
    console.log('LIST OF RECEIVING ACCOUNTS (BCH)', receivingAccounts)

    const currentWalletAddress = getters.getWalletAddress
    console.log('CURRENT WALLET ADDRESS', currentWalletAddress)

    /* Retrieve (ALL) account(s) details. */
    const details = await bitbox.Address.details(currentWalletAddress)
    console.log('DETAILS', details)

    /* Set transactions count. */
    const numTxs = details.transactions.length

    /* Validate (account) address usage. */
    if (numTxs > 0) {
        console.log('WE NEED TO MOVE TO A NEW RECEIVING ADDRESS')

        /* Request next (receiving account) address. */
        dispatch('nextReceiver', 'bch')
    } else {
        console.log('THIS WALLET ADDRESS IS GOOD TO GO!')
    }
}

/* Export module. */
export default initWallet

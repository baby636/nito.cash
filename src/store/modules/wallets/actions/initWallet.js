/**
 * Initialize Wallet
 */
const initWallet = ({ state }) => {
    console.info('Initializing wallet..')

    /* Retrieve receiving accounts. */
    const receivingAccounts = state.receivingAccounts
    console.log('LIST OF RECEIVING ACCOUNTS (BCH)', receivingAccounts)
}

/* Export module. */
export default initWallet

/**
 * Get Receiving Accounts
 *
 * Returns (addresses for) ALL (in-use) receiving accounts.
 */
const getReceivingAccounts = (state) => async (_walletType) => {
    /* Set (receiving) accounts. */
    const accounts = state.receivingAccounts

    console.log('RECEIVING ACCOUNTS', accounts)

    /* Set active (accounts). */
    const active = accounts[_walletType].active
    console.log('RECEIVING ACCOUNTS (active)', active)

    /* Set curent (account). */
    const current = accounts[_walletType].current
    console.log('RECEIVING ACCOUNTS (current)', current)

    /* Set current account index. */
    // const currentAccountIndex = Math.max(...state.receivingAccounts)

    /* Return accounts. */
    return accounts
}

/* Export module. */
export default getReceivingAccounts

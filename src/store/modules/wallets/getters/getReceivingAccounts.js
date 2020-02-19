/**
 * Get Receiving Accounts
 *
 * Returns (addresses for) ALL (in-use) receiving accounts.
 */
const getReceivingAccounts = (state) => (_walletType) => {
    /* Initialize (receiving) accounts. */
    // const accounts = []
    const accounts = []

    console.log('RECEIVING ACCOUNTS', accounts)

    /* Set active (accounts). */
    const active = state.receivingAccounts[_walletType].active
    console.log('RECEIVING ACCOUNTS (active)', active)

    /* Set curent (account). */
    const current = state.receivingAccounts[_walletType].current
    console.log('RECEIVING ACCOUNTS (current)', current)

    /* Return accounts. */
    return accounts
}

/* Export module. */
export default getReceivingAccounts

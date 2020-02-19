/**
 * Get Change Accounts
 *
 * Returns (addresses for) ALL (in-use) change accounts.
 */
const getChangeAccounts = (state) => (_walletType) => {
    /* Initialize (change) accounts */
    // const accounts = []
    const accounts = []

    console.log('CHANGE ACCOUNTS', accounts)

    /* Set active (accounts). */
    const active = state.changeAccounts[_walletType].active
    console.log('CHANGE ACCOUNTS (active)', active)

    /* Set curent (account). */
    const current = state.changeAccounts[_walletType].current
    console.log('CHANGE ACCOUNTS (current)', current)

    /* Return accounts. */
    return accounts
}

/* Export module. */
export default getChangeAccounts

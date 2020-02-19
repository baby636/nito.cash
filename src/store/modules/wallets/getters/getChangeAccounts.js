/**
 * Get Change Accounts
 *
 * Returns (addresses for) ALL (in-use) change accounts.
 */
const getChangeAccounts = (state) => {
    /* Set current account index. */
    const currentAccountIndex = Math.max(...state.changeAccounts)
// FIXME: We need to return the addresses
    return currentAccountIndex + 1
}

/* Export module. */
export default getChangeAccounts

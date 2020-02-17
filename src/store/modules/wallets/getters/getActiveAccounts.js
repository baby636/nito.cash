/**
 * Get Active (Receiving) Accounts
 *
 * Returns (addresses for) ALL active accounts.
 */
const getActiveAccounts = (state) => {
    /* Set current account index. */
    const currentAccountIndex = Math.max(...state.activeAccounts)
// FIXME: We need to return the addresses
    return currentAccountIndex + 1
}

/* Export module. */
export default getActiveAccounts

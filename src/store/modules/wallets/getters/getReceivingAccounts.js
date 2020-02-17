/**
 * Get Receiving Accounts
 *
 * Returns (addresses for) ALL (in-use) receiving accounts.
 */
const getReceivingAccounts = (state) => {
    /* Set current account index. */
    const currentAccountIndex = Math.max(...state.receivingAccounts)
// FIXME: We need to return the addresses
    return currentAccountIndex + 1
}

/* Export module. */
export default getReceivingAccounts

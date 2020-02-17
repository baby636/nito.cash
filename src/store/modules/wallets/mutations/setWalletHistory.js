/**
 * Set Wallet History
 *
 * Stores the complete record of ALL incoming and outgoing transactions,
 * held by this wallet.
 */
const setWalletHistory = (state, _history) => {
    /* Set wallet history. */
    state.history = _history
}

/* Export module. */
export default setWalletHistory

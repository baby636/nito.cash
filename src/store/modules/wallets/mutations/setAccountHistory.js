/**
 * Set Account History
 *
 * This is a complete record of ALL incoming and outgoing transactions.
 */
const setAccountHistory = (state, _history) => {
    /* Set account history. */
    state.accountHistory = _history
}

/* Export module. */
export default setAccountHistory

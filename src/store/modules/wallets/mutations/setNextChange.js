/**
 * Set Next (Change Account) Address
 *
 * This will increment the change accounts index by 1.
 */
const setNextChange = (state, _walletType) => {
    /* Add current (index) to active (pool). */
    state.changeAccounts[_walletType].active.push(
        state.changeAccounts[_walletType].current)

    /* Increment change accounts index. */
    state.changeAccounts[_walletType].current++
}

/* Export module. */
export default setNextChange

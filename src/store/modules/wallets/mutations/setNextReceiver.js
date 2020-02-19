/**
 * Set Next (Receiving Account) Address
 *
 * This will increment the receiving accounts index by 1.
 */
const setNextReceiver = (state, _walletType) => {
    // console.log('SET NEXT RECEIVER', _walletType)

    /* Add current (index) to active (pool). */
    state.receivingAccounts[_walletType].active.push(
        state.receivingAccounts[_walletType].current)

    /* Increment receiving accounts index. */
    state.receivingAccounts[_walletType].current++
}

/* Export module. */
export default setNextReceiver

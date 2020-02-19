/**
 * (Request) Next Change (Accounts Index)
 */
const nextChange = ({ commit }, _walletType) => {
    console.info('Incrementing change accounts index..')

    /* Commit next change (accounts index). */
    commit('setNextChange', _walletType)
}

/* Export module. */
export default nextChange

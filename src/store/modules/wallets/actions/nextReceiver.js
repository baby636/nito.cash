/**
 * (Request) Next Receiving (Accounts Index)
 */
const nextReceiver = ({ commit }, _walletType) => {
    console.info('Incrementing receiving accounts index..')

    /* Commit next receiving (accounts index). */
    commit('setNextReceiver', _walletType)
}

/* Export module. */
export default nextReceiver

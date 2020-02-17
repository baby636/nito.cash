/**
 * Destroy Wallet
 */
const destroyWallet = ({ commit }) => {
    console.log('Destroying wallet..')

    /* Commit empty wallet. */
    commit('setEmptyWallet')
}

/* Export module. */
export default destroyWallet

/**
 * Update Master Mnemonic
 */
const updateMasterMnemonic = ({ commit }, _mnemonic) => {
    // console.log('Updating master wallet mnemonic', _mnemonic)

    /* Commit wallet's master mnemonic. */
    commit('setMasterMnemonic', _mnemonic)
}

/* Export module. */
export default updateMasterMnemonic

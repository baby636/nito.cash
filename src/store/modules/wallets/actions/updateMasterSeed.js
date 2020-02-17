/**
 * Update Master Seed
 */
const updateMasterSeed = ({ commit }, _seed) => {
    // console.log('Updating master wallet seed', _seed)

    /* Commit wallet's master seed. */
    commit('setMasterSeed', _seed)
}

/* Export module. */
export default updateMasterSeed

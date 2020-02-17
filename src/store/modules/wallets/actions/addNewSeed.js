/**
 * Add New Seed
 */
const addNewSeed = ({ commit, state }, _seed) => {
    /* Validate new seed (for duplicates). */
    if (state.importedSeeds.includes(_seed)) {
        console.log(_seed, 'has already been added to this wallet')
    } else {
        console.log('Adding new seed to wallet', _seed)

        /* Set imported seeds. */
        // NOTE: Cloning with ES6 spread operator.
        const importedSeeds = [...state.importedSeeds]

        /* Add new seed to pool. */
        importedSeeds.push(_seed)

        /* Commit new seed pool. */
        commit('setImportedSeeds', importedSeeds)
    }
}

/* Export module. */
export default addNewSeed

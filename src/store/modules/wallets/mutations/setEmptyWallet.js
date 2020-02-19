/**
 * Destroy Wallet
 *
 * This will completely destory the user's wallet,
 * as well as ALL imported seeds.
 */
const destroyWallet = (state) => {
    /* Re-initialize account history. */
    state.accountHistory = null

    /* Re-initialize change (address) index. */
    state.changeAccounts = null

    /* Re-initialize all (imported) seeds. */
    state.importedSeeds = null

    /* Re-initialize master mnemonic. */
    state.masterMnemonic = null

    /* Re-initialize master seed. */
    state.masterSeed = null

    /* Re-initialize receiving accounts (address) index. */
    state.receivingAccounts = null
}

/* Export module. */
export default destroyWallet

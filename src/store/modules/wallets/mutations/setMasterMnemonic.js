/**
 * Set Master Mnemonic
 *
 * This is the user's primary mnemonic phrase.
 *
 * BIP-39 will be used to split the 24-word mnemonic phrase:
 *   1. 12 words will be sent to user's primary email.
 *   2. 6 words will be sent to user's secondary (and/or social) email(s).
 *   3. 6 words will be sent to Nito cloud server (managed by Modenero).
 */
const setMasterMnemonic = (state, _mnemonic) => {
    /* Set master mnemonic. */
    state.masterMnemonic = _mnemonic
}

/* Export module. */
export default setMasterMnemonic
